<?php

namespace App\Domains\Canteen\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateCanteenRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // Auth is handled by middleware
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => 'required|string',
            'description' => 'nullable|string',
            'is_open' => 'boolean',
            'image' => 'nullable|image|max:5120', // Maks 5MB
            'whatsapp_number' => 'nullable|string|max:20',
        ];
    }
}
