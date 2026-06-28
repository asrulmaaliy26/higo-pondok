<?php

namespace App\Domains\Canteen\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreProductRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
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
            'category' => 'nullable|string',
            'description' => 'nullable|string',
            'price' => 'required|numeric',
            'stock' => 'integer|min:0',
            'is_available' => 'boolean',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
        ];
    }
}
