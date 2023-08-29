<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ProyectoAnexoRequest extends FormRequest
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
            'convocatoria_anexo_id' => ['required', 'min:0', 'max:2147483647', 'integer', 'exists:convocatoria_anexos,id'],
            'archivo'               => ['required', 'file', 'max:10240'],
        ];
    }
}
