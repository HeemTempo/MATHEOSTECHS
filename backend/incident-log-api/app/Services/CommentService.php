<?php

namespace App\Services;

use App\Models\Comment;
use App\Models\Incident;

class CommentService
{
    protected $auditLogService;

    public function __construct(AuditLogService $auditLogService)
    {
        $this->auditLogService = $auditLogService;
    }

    public function addComment($incidentId, $commentText, $userId)
    {
        $incident = Incident::findOrFail($incidentId);

        $comment = Comment::create([
            'incident_id' => $incidentId,
            'user_id' => $userId,
            'comment' => $commentText,
        ]);

        // Log audit
        $this->auditLogService->log(
            $userId,
            'commented',
            'Incident',
            $incidentId,
            "Added comment to incident"
        );

        return $comment->load('user:id,name,email');
    }
}
