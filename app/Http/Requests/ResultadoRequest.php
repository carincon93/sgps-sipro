<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ResultadoRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'descripcion'               => ['required', 'string'],
            'objetivo_especifico_id'    => ['required', 'min:0', 'max:2147483647', 'exists:objetivos_especificos,id'],
        ];
    }
}
