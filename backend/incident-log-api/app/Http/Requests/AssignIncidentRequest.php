<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AssignIncidentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->role === 'admin';
    }

    public function rules(): array
    {
        return [
            'assigned_to' => 'required|exists:users,id',
        ];
    }
}
