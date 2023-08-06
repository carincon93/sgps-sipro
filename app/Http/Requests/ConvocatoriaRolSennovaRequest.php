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
            'linea_programatica_id' => ['required', 'min:0', 'max:2147483647', 'integer', 'exists:lineas_programaticas,id'],
            'rol_sennova_id'        => ['required', 'min:0', 'max:2147483647', 'integer', 'exists:roles_sennova,id'],
            'asignacion_mensual'    => ['required', 'integer', 'min:0'],
            'nivel_academico'       => ['required', 'integer', 'min:0', 'max:2147483647'],
            'experiencia'           => ['nullable', 'string'],
            'sumar_al_presupuesto'  => ['required', 'boolean'],
            'habilitado'            => ['required', 'boolean'],
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
