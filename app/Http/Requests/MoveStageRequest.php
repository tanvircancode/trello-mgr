<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class MoveStageRequest extends FormRequest
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
            'prior_project_id' => 'required|string',
            'stage_id' => 'required|string',
            'new_position' => 'required|integer',
            'original_position' => 'required|integer',
        ];
    }
}
