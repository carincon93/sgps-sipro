<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ConvocatoriaRolSennovaRequest extends FormRequest
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
            'tipo_formulario_convocatoria_id'   => ['required', 'min:0', 'max:2147483647', 'integer', 'exists:tipos_formulario_convocatoria,id'],
            'rol_sennova_id'                    => ['required', 'min:0', 'max:2147483647', 'integer', 'exists:roles_sennova,id'],
            'asignacion_mensual'                => ['required', 'integer', 'min:0'],
            'nivel_academico'                   => ['required', 'integer', 'min:0', 'max:2147483647'],
            'experiencia'                       => ['nullable', 'string'],
            'sumar_al_presupuesto'              => ['nullable', 'boolean'],
            'habilitado'                        => ['nullable', 'boolean'],
            'meses_maximos'                     => ['nullable', 'numeric', 'min:1', 'max:12']
        ];
    }

    /**
     * Prepare the data for validation.
     *
     * @return void
     */
    protected function prepareForValidation()
    {
        //
    }
}
