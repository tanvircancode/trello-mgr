<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreChecklistRequest extends FormRequest
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
            'name' => 'required|string|min:5|max:255',
            'task_id' => 'required|string',
        ];
    }

    public function messages(): array
    {
        return [
           'name.required' => 'Title is required',
            'name.min' => 'Title is too short',
            'name.max' => 'Please Try To Use Shorter Title',
            'task_id.required' => 'Task is required',
        ];
    }
}
