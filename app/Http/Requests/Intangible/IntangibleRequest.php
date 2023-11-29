<?php

namespace App\Http\Requests\Intangible;

use Illuminate\Foundation\Http\FormRequest;

class IntangibleRequest extends FormRequest
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
            'codigo_intangible'                     => ['required', 'string'],
            'fecha_cierre_vigencia'                 => ['required', 'date'],
            'fecha_cierre_vigencia_presupuestal'    => ['required', 'date'],
            'tipo_intangible'                       => ['required', 'integer'],
            'clase_intangible'                      => ['required', 'integer'],
            'nombre_intangible'                     => ['required', 'string'],
            'recurso_controlado'                    => ['required', 'boolean'],
            'observacion_recurso'                   => ['nullable', 'string'],
            'potencial_servicios'                   => ['nullable', 'boolean'],
            'observacion_potencial_servicios'       => ['nullable', 'string'],
            'fiabilidad'                            => ['nullable', 'boolean'],
            'observacion_fiabilidad'                => ['nullable', 'string'],
            'identificar'                           => ['nullable', 'boolean'],
            'observacion_identificar'               => ['nullable', 'string'],
            'monetario'                             => ['nullable', 'boolean'],
            'observacion_monetario'                 => ['nullable', 'string'],
            'apariencia_fisica'                     => ['nullable', 'boolean'],
            'observacion_apariencia_fisica'         => ['nullable', 'string'],
            'uso_mas_vigencias'                     => ['nullable', 'boolean'],
            'observacion_uso_vigencias'             => ['nullable', 'string'],
            'actividades_entidad'                   => ['nullable', 'boolean'],
            'observacion_actividades_entidad'       => ['nullable', 'string'],
        ];
    }
}
