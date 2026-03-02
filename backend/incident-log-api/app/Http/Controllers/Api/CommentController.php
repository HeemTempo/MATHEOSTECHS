<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCommentRequest;
use App\Http\Resources\CommentResource;
use App\Services\CommentService;
use Illuminate\Http\Request;

class CommentController extends Controller
{
    protected $commentService;

    public function __construct(CommentService $commentService)
    {
        $this->commentService = $commentService;
    }

    public function store(StoreCommentRequest $request, $incidentId)
    {
        $comment = $this->commentService->addComment(
            $incidentId,
            $request->comment,
            $request->user()->id
        );

        return response()->json([
            'success' => true,
            'message' => 'Comment added successfully',
            'data' => new CommentResource($comment)
        ], 201);
    }
}
