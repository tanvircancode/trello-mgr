<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreUserRequest extends FormRequest
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
            //
            'name' => 'nullable|string|max:50',
            'email' => 'required|string|email',
            'password' => 'required|string|min:5|max:255',
            'password_hint' => 'required|string|min:3|max:20',
        ];
    }

    public function messages(): array
    {
        return [
            'password.min' => 'Password is too short',
            'password.max' => 'Password is too long',
            'password_hint.min' => 'Password Hint is too short',
            'password_hint.max' => 'Password Hint is too long',
            'email.required' => 'Email is required',
            'email.email' => 'This must be a valid email address.',
            'name.max' => 'Please Try To Use Shorter Name',
        ];
    }
}
