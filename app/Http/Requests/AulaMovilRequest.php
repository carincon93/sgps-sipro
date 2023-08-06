<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AulaMovilRequest extends FormRequest
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
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            'placa'                             => ['required', 'string'],
            'modelo'                            => ['required', 'integer'],
            'logros_vigencia'                   => ['required', 'string'],
            'numero_municipios_visitados'       => ['required', 'integer'],
            'numero_aprendices_beneficiados'    => ['required', 'integer'],
            'estado'                            => ['required', 'string'],
            'modulos_interactivos'              => ['required', 'string'],
            'acciones_a_desarrollar'            => ['required', 'string'],
            'numero_aprendices_a_beneficiar'    => ['required', 'integer'],
            'recursos_mantenimiento'            => ['required', 'string'],
        ];
    }
}
