<?php

namespace App\Services;

use App\Models\Incident;
use App\Models\IncidentUpdate;
use Illuminate\Support\Facades\DB;

class IncidentService
{
    protected $auditLogService;

    public function __construct(AuditLogService $auditLogService)
    {
        $this->auditLogService = $auditLogService;
    }

    public function getAllIncidents($user, $filters = [])
    {
        $query = Incident::with(['reporter:id,name,email', 'assignedUser:id,name,email']);

        // Reporters can only see their own incidents
        if ($user->role === 'reporter') {
            $query->where('reported_by', $user->id);
        }

        // Operators can ONLY see incidents assigned to them
        if ($user->role === 'operator') {
            $query->where('assigned_to', $user->id);
        }

        // Admins can see all incidents (no filter)

        // Apply filters
        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (!empty($filters['severity'])) {
            $query->where('severity', $filters['severity']);
        }

        if (!empty($filters['assigned_to'])) {
            $query->where('assigned_to', $filters['assigned_to']);
        }

        if (!empty($filters['reported_by'])) {
            $query->where('reported_by', $filters['reported_by']);
        }

        if (!empty($filters['search'])) {
            $query->where(function($q) use ($filters) {
                $q->where('title', 'like', '%' . $filters['search'] . '%')
                  ->orWhere('description', 'like', '%' . $filters['search'] . '%');
            });
        }

        // Sorting
        $sortBy = $filters['sort_by'] ?? 'created_at';
        $sortOrder = $filters['sort_order'] ?? 'desc';
        $query->orderBy($sortBy, $sortOrder);

        // Pagination
        $perPage = $filters['per_page'] ?? 15;
        
        return $query->paginate($perPage);
    }

    public function getIncidentById($id, $user)
    {
        $incident = Incident::with(['reporter:id,name,email', 'assignedUser:id,name,email', 'comments.user:id,name,email', 'updates.updater:id,name,email'])
            ->findOrFail($id);

        // Reporters can only view their own incidents
        if ($user->role === 'reporter' && $incident->reported_by !== $user->id) {
            abort(403, 'Unauthorized to view this incident');
        }

        // Operators can view all incidents (read-only for non-assigned)
        // They can only edit incidents assigned to them

        // Admins can view all incidents

        return $incident;
    }

    public function createIncident($data, $userId)
    {
        return DB::transaction(function () use ($data, $userId) {
            $data['reported_by'] = $userId;
            $data['status'] = 'open';

            $incident = Incident::create($data);

            // Log audit
            $this->auditLogService->log(
                $userId,
                'created',
                'Incident',
                $incident->id,
                "Created incident: {$incident->title}"
            );

            return $incident;
        });
    }

    public function assignIncident($incidentId, $assignedToUserId, $currentUserId)
    {
        return DB::transaction(function () use ($incidentId, $assignedToUserId, $currentUserId) {
            $incident = Incident::findOrFail($incidentId);
            $incident->assigned_to = $assignedToUserId;
            $incident->save();

            // Log audit
            $this->auditLogService->log(
                $currentUserId,
                'assigned',
                'Incident',
                $incident->id,
                "Assigned incident to user ID: {$assignedToUserId}"
            );

            return $incident;
        });
    }

    public function updateStatus($incidentId, $newStatus, $userId)
    {
        return DB::transaction(function () use ($incidentId, $newStatus, $userId) {
            $incident = Incident::findOrFail($incidentId);
            $oldStatus = $incident->status;

            // Validate status progression
            $this->validateStatusProgression($oldStatus, $newStatus);

            // Update incident status
            $incident->status = $newStatus;
            $incident->save();

            // Create incident update record
            IncidentUpdate::create([
                'incident_id' => $incident->id,
                'old_status' => $oldStatus,
                'new_status' => $newStatus,
                'updated_by' => $userId,
            ]);

            // Log audit
            $this->auditLogService->log(
                $userId,
                'status_changed',
                'Incident',
                $incident->id,
                "Status changed from {$oldStatus} to {$newStatus}"
            );

            return $incident;
        });
    }

    protected function validateStatusProgression($oldStatus, $newStatus)
    {
        $allowedTransitions = [
            'open' => ['investigating'],
            'investigating' => ['resolved'],
            'resolved' => ['closed'],
            'closed' => [],
        ];

        if (!isset($allowedTransitions[$oldStatus]) || !in_array($newStatus, $allowedTransitions[$oldStatus])) {
            throw new \Exception("Invalid status transition from {$oldStatus} to {$newStatus}");
        }
    }
}
