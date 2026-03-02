<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\AuditLogResource;
use App\Services\AuditLogService;

class AuditLogController extends Controller
{
    protected $auditLogService;

    public function __construct(AuditLogService $auditLogService)
    {
        $this->auditLogService = $auditLogService;
    }

    public function getIncidentAuditLogs($incidentId)
    {
        $logs = $this->auditLogService->getIncidentAuditLogs($incidentId);
        return response()->json([
            'success' => true,
            'message' => 'Audit logs retrieved successfully',
            'data' => AuditLogResource::collection($logs)
        ]);
    }
}
