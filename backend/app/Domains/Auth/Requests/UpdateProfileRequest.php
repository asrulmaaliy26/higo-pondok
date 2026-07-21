<?php

namespace App\Domains\Auth\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProfileRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // We check ownership based on currently authenticated user later
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|string|email|max:255|unique:users,email,' . $this->user()->id,
            'password' => 'nullable|string|min:6',
            'avatar' => 'nullable|image|max:5120',
            'santri_name' => 'nullable|string|max:255',
            'santri_room' => 'nullable|string|max:255',
            'santri_class' => 'nullable|string|max:255',
            'santri_level' => 'nullable|string|max:255',
        ];
    }
}
