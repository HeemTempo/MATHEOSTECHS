<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        // Only admins can create users
        return $this->user() && $this->user()->role === 'admin';
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8',
            'role' => 'required|in:reporter,operator,admin', // All roles can be created
        ];
    }

    public function messages(): array
    {
        return [
            'role.required' => 'User role is required.',
            'role.in' => 'Role must be reporter, operator, or admin.',
        ];
    }
}
