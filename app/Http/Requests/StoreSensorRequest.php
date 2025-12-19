<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreSensorRequest extends FormRequest
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
            'code' => ['required', 'string', 'max:50', 'unique:sensors,code'],
            'latitude' => ['required', 'numeric', 'between:-90,90'],
            'longitude' => ['required', 'numeric', 'between:-180,180'],
            'status' => ['sometimes', Rule::in(['safe', 'warning', 'danger'])],
            'water_level' => ['sometimes', 'numeric', 'min:0'],
            'address' => ['nullable', 'string', 'max:500'],
            'description' => ['nullable', 'string', 'max:1000'],
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
            'name.required' => 'Nama sensor harus diisi.',
            'code.required' => 'Kode sensor harus diisi.',
            'code.unique' => 'Kode sensor sudah digunakan.',
            'latitude.required' => 'Latitude harus diisi.',
            'latitude.between' => 'Latitude harus antara -90 dan 90.',
            'longitude.required' => 'Longitude harus diisi.',
            'longitude.between' => 'Longitude harus antara -180 dan 180.',
        ];
    }
}
