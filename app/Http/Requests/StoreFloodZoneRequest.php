<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreFloodZoneRequest extends FormRequest
{
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
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:1000'],
            'coordinates' => ['required', 'array', 'min:3'],
            'coordinates.*' => ['required', 'array', 'size:2'],
            'coordinates.*.*' => ['required', 'numeric'],
            'risk_level' => ['required', Rule::in(['low', 'medium', 'high'])],
            'color' => ['nullable', 'string', 'regex:/^#[a-fA-F0-9]{6}$/'],
            'is_active' => ['sometimes', 'boolean'],
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'name.required' => 'Nama zona harus diisi.',
            'coordinates.required' => 'Koordinat polygon harus diisi.',
            'coordinates.min' => 'Polygon harus memiliki minimal 3 titik koordinat.',
            'coordinates.array' => 'Koordinat harus berupa array.',
            'risk_level.required' => 'Tingkat risiko harus dipilih.',
            'risk_level.in' => 'Tingkat risiko harus low, medium, atau high.',
            'color.regex' => 'Format warna harus berupa kode hex (contoh: #ff0000).',
        ];
    }
}
