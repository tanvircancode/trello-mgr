<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreTaskRequest extends FormRequest
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
            'project_id' => 'required|string',
            'title' => 'required|string|min:5|max:255',
        ];
    }

    public function messages(): array
    {
        return [
            'title.required' => 'Title is required',
            'title.min' => 'Title is too short',
            'title.max' => 'Please Try To Use Shorter Title',
        ];
    }
}
