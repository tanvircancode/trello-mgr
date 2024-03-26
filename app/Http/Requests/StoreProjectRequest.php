<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreProjectRequest extends FormRequest
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
            'user_id' => 'required|string',
            'title' => 'required|string|min:5|max:255',
           
        ];
    }

    public function messages(): array
    {
        return [
            'title.required' => 'Title is required',
            'title.min' => 'Please write at least five characters',
            'title.max' => 'Please Try To Use Shorter Title',
        ];
    }
}
