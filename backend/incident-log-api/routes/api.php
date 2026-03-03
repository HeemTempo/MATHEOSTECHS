<?php

use App\Http\Controllers\Api\AuditLogController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CommentController;
use App\Http\Controllers\Api\IncidentController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Support\Facades\Route;

// Public routes
Route::post('/login', [AuthController::class, 'login']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);

    // Incident routes
    Route::get('/incidents', [IncidentController::class, 'index']);
    Route::post('/incidents', [IncidentController::class, 'store']);
    Route::get('/incidents/{id}', [IncidentController::class, 'show']);
    Route::put('/incidents/{id}/assign', [IncidentController::class, 'assign']);
    Route::put('/incidents/{id}/status', [IncidentController::class, 'updateStatus']);

    // Comment routes
    Route::post('/incidents/{incidentId}/comments', [CommentController::class, 'store']);

    // Audit log routes
    Route::get('/incidents/{incidentId}/audit-log', [AuditLogController::class, 'getIncidentAuditLogs']);

    // User management routes (Admin only)
    Route::get('/users', [UserController::class, 'index']);
    Route::post('/users', [UserController::class, 'store']);
    Route::get('/users/{id}', [UserController::class, 'show']);
    Route::put('/users/{id}', [UserController::class, 'update']);
    Route::delete('/users/{id}', [UserController::class, 'destroy']);
    Route::put('/users/{id}/activate', [UserController::class, 'activate']);
    Route::put('/users/{id}/deactivate', [UserController::class, 'deactivate']);
    Route::get('/operators', [UserController::class, 'getOperators']);
    Route::get('/reporters', [UserController::class, 'getReporters']);
});
