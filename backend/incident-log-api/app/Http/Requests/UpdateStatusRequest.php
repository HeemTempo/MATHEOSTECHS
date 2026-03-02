<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateStatusRequest extends FormRequest
{
    public function authorize(): bool
    {
        return in_array($this->user()->role, ['operator', 'admin']);
    }

    public function rules(): array
    {
        return [
            'status' => 'required|in:open,investigating,resolved,closed',
        ];
    }
}
