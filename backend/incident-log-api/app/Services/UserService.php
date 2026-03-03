<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserService
{
    protected $auditLogService;

    public function __construct(AuditLogService $auditLogService)
    {
        $this->auditLogService = $auditLogService;
    }

    public function registerReporter($data)
    {
        // This method is no longer used - all users created by admin
        throw new \Exception('User registration is disabled. Contact admin to create account.');
    }

    public function createUser($data, $creatorId)
    {
        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
            'role' => $data['role'], // reporter, operator, or admin
            'is_active' => false, // New users are inactive by default
        ]);

        // Log audit
        $this->auditLogService->log(
            $creatorId,
            'created_user',
            'User',
            $user->id,
            "Created {$user->role}: {$user->email} (inactive)"
        );

        return $user;
    }

    public function getAllUsers($filters = [])
    {
        $query = User::select('id', 'name', 'email', 'role', 'is_active', 'created_at');

        // Filter by role
        if (!empty($filters['role'])) {
            $query->where('role', $filters['role']);
        }

        // Search
        if (!empty($filters['search'])) {
            $query->where(function($q) use ($filters) {
                $q->where('name', 'like', '%' . $filters['search'] . '%')
                  ->orWhere('email', 'like', '%' . $filters['search'] . '%');
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

    public function getUsersByRole($role)
    {
        return User::where('role', $role)
            ->select('id', 'name', 'email', 'role', 'created_at')
            ->orderBy('name')
            ->get();
    }

    public function getUserById($id)
    {
        return User::select('id', 'name', 'email', 'role', 'is_active', 'created_at')
            ->findOrFail($id);
    }

    public function updateUser($id, $data, $updaterId)
    {
        $user = User::findOrFail($id);

        if (isset($data['name'])) {
            $user->name = $data['name'];
        }

        if (isset($data['email'])) {
            $user->email = $data['email'];
        }

        if (isset($data['password'])) {
            $user->password = Hash::make($data['password']);
        }

        if (isset($data['role'])) {
            $user->role = $data['role'];
        }

        $user->save();

        // Log audit
        $this->auditLogService->log(
            $updaterId,
            'updated_user',
            'User',
            $user->id,
            "Updated user: {$user->email}"
        );

        return $user;
    }

    public function deleteUser($id, $deleterId)
    {
        $user = User::findOrFail($id);

        // Prevent deleting yourself
        if ($user->id === $deleterId) {
            throw new \Exception('You cannot delete your own account');
        }

        $email = $user->email;
        $user->delete();

        // Log audit
        $this->auditLogService->log(
            $deleterId,
            'deleted_user',
            'User',
            $id,
            "Deleted user: {$email}"
        );

        return true;
    }

    public function getOperators()
    {
        return User::where('role', 'operator')
            ->select('id', 'name', 'email')
            ->get();
    }

    public function activateUser($id, $activatorId)
    {
        $user = User::findOrFail($id);
        
        if ($user->is_active) {
            throw new \Exception('User is already active');
        }

        $user->is_active = true;
        $user->save();

        // Log audit
        $this->auditLogService->log(
            $activatorId,
            'activated_user',
            'User',
            $user->id,
            "Activated user: {$user->email}"
        );

        return $user;
    }

    public function deactivateUser($id, $deactivatorId)
    {
        $user = User::findOrFail($id);

        // Prevent deactivating yourself
        if ($user->id === $deactivatorId) {
            throw new \Exception('You cannot deactivate your own account');
        }

        if (!$user->is_active) {
            throw new \Exception('User is already inactive');
        }

        $user->is_active = false;
        $user->save();

        // Revoke all tokens
        $user->tokens()->delete();

        // Log audit
        $this->auditLogService->log(
            $deactivatorId,
            'deactivated_user',
            'User',
            $user->id,
            "Deactivated user: {$user->email}"
        );

        return $user;
    }
}
