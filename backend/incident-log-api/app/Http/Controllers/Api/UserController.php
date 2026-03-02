<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\CreateUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Http\Resources\UserResource;
use App\Services\UserService;
use Illuminate\Http\Request;

class UserController extends Controller
{
    protected $userService;

    public function __construct(UserService $userService)
    {
        $this->userService = $userService;
    }

    public function index(Request $request)
    {
        // Only admins can view all users
        if ($request->user()->role !== 'admin') {
            return response()->json([
                'success' => false,
                'message' => 'Access denied',
                'error' => 'You need admin privileges to view all users'
            ], 403);
        }

        $filters = [
            'role' => $request->query('role'),
            'search' => $request->query('search'),
            'sort_by' => $request->query('sort_by', 'created_at'),
            'sort_order' => $request->query('sort_order', 'desc'),
            'per_page' => $request->query('per_page', 15),
        ];

        $users = $this->userService->getAllUsers($filters);
        
        return response()->json([
            'success' => true,
            'message' => 'Users retrieved successfully',
            'data' => UserResource::collection($users),
            'meta' => [
                'current_page' => $users->currentPage(),
                'last_page' => $users->lastPage(),
                'per_page' => $users->perPage(),
                'total' => $users->total(),
                'from' => $users->firstItem(),
                'to' => $users->lastItem(),
            ],
            'links' => [
                'first' => $users->url(1),
                'last' => $users->url($users->lastPage()),
                'prev' => $users->previousPageUrl(),
                'next' => $users->nextPageUrl(),
            ]
        ]);
    }

    public function store(CreateUserRequest $request)
    {
        $user = $this->userService->createUser(
            $request->validated(),
            $request->user()->id
        );

        return response()->json([
            'success' => true,
            'message' => 'User created successfully',
            'data' => new UserResource($user)
        ], 201);
    }

    public function show(Request $request, $id)
    {
        // Only admins can view user details
        if ($request->user()->role !== 'admin') {
            return response()->json([
                'success' => false,
                'message' => 'Access denied',
                'error' => 'You need admin privileges to view user details'
            ], 403);
        }

        $user = $this->userService->getUserById($id);
        return response()->json([
            'success' => true,
            'message' => 'User retrieved successfully',
            'data' => new UserResource($user)
        ]);
    }

    public function update(UpdateUserRequest $request, $id)
    {
        $user = $this->userService->updateUser(
            $id,
            $request->validated(),
            $request->user()->id
        );

        return response()->json([
            'success' => true,
            'message' => 'User updated successfully',
            'data' => new UserResource($user)
        ]);
    }

    public function destroy(Request $request, $id)
    {
        // Only admins can delete users
        if ($request->user()->role !== 'admin') {
            return response()->json([
                'success' => false,
                'message' => 'Access denied',
                'error' => 'You need admin privileges to delete users'
            ], 403);
        }

        try {
            $this->userService->deleteUser($id, $request->user()->id);

            return response()->json([
                'success' => true,
                'message' => 'User deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Could not delete user',
                'error' => $e->getMessage()
            ], 422);
        }
    }

    public function getOperators(Request $request)
    {
        // Only admins can get operators list
        if ($request->user()->role !== 'admin') {
            return response()->json([
                'success' => false,
                'message' => 'Access denied',
                'error' => 'You need admin privileges to view operators'
            ], 403);
        }

        $operators = $this->userService->getOperators();
        return response()->json([
            'success' => true,
            'message' => 'Operators retrieved successfully',
            'data' => UserResource::collection($operators)
        ]);
    }

    public function getReporters(Request $request)
    {
        // Only admins can get reporters list
        if ($request->user()->role !== 'admin') {
            return response()->json([
                'success' => false,
                'message' => 'Access denied',
                'error' => 'You need admin privileges to view reporters'
            ], 403);
        }

        $reporters = $this->userService->getUsersByRole('reporter');
        return response()->json([
            'success' => true,
            'message' => 'Reporters retrieved successfully',
            'data' => UserResource::collection($reporters)
        ]);
    }
}
