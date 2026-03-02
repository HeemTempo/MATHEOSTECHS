<?php

namespace App\Services;

use App\Models\AuditLog;

class AuditLogService
{
    public function log($userId, $action, $entityType, $entityId, $description = null)
    {
        return AuditLog::create([
            'user_id' => $userId,
            'action' => $action,
            'entity_type' => $entityType,
            'entity_id' => $entityId,
            'description' => $description,
        ]);
    }

    public function getIncidentAuditLogs($incidentId)
    {
        return AuditLog::where('entity_type', 'Incident')
            ->where('entity_id', $incidentId)
            ->with('user:id,name,email')
            ->orderBy('created_at', 'desc')
            ->get();
    }
}
