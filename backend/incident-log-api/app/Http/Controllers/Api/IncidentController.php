<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\AssignIncidentRequest;
use App\Http\Requests\StoreIncidentRequest;
use App\Http\Requests\UpdateStatusRequest;
use App\Http\Resources\IncidentResource;
use App\Services\IncidentService;
use Illuminate\Http\Request;

class IncidentController extends Controller
{
    protected $incidentService;

    public function __construct(IncidentService $incidentService)
    {
        $this->incidentService = $incidentService;
    }

    public function index(Request $request)
    {
        $filters = [
            'status' => $request->query('status'),
            'severity' => $request->query('severity'),
            'assigned_to' => $request->query('assigned_to'),
            'reported_by' => $request->query('reported_by'),
            'search' => $request->query('search'),
            'sort_by' => $request->query('sort_by', 'created_at'),
            'sort_order' => $request->query('sort_order', 'desc'),
            'per_page' => $request->query('per_page', 15),
        ];

        $incidents = $this->incidentService->getAllIncidents($request->user(), $filters);
        
        return response()->json([
            'success' => true,
            'message' => 'Incidents retrieved successfully',
            'data' => IncidentResource::collection($incidents),
            'meta' => [
                'current_page' => $incidents->currentPage(),
                'last_page' => $incidents->lastPage(),
                'per_page' => $incidents->perPage(),
                'total' => $incidents->total(),
                'from' => $incidents->firstItem(),
                'to' => $incidents->lastItem(),
            ],
            'links' => [
                'first' => $incidents->url(1),
                'last' => $incidents->url($incidents->lastPage()),
                'prev' => $incidents->previousPageUrl(),
                'next' => $incidents->nextPageUrl(),
            ]
        ]);
    }

    public function store(StoreIncidentRequest $request)
    {
        $incident = $this->incidentService->createIncident(
            $request->validated(),
            $request->user()->id
        );

        return response()->json([
            'success' => true,
            'message' => 'Incident created successfully',
            'data' => new IncidentResource($incident)
        ], 201);
    }

    public function show(Request $request, $id)
    {
        $incident = $this->incidentService->getIncidentById($id, $request->user());
        return response()->json([
            'success' => true,
            'message' => 'Incident retrieved successfully',
            'data' => new IncidentResource($incident)
        ]);
    }

    public function assign(AssignIncidentRequest $request, $id)
    {
        $incident = $this->incidentService->assignIncident(
            $id,
            $request->assigned_to,
            $request->user()->id
        );

        return response()->json([
            'success' => true,
            'message' => 'Incident assigned successfully',
            'data' => new IncidentResource($incident)
        ]);
    }

    public function updateStatus(UpdateStatusRequest $request, $id)
    {
        try {
            $incident = $this->incidentService->updateStatus(
                $id,
                $request->status,
                $request->user()->id
            );

            return response()->json([
                'success' => true,
                'message' => 'Incident status updated successfully',
                'data' => new IncidentResource($incident)
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Could not update status',
                'error' => $e->getMessage()
            ], 422);
        }
    }
}
