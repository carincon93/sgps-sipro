<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ConvocatoriaRequest extends FormRequest
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
            'descripcion'                               => ['required'],
            'esta_activa'                               => ['required_if:tipo_convocatoria,1', 'nullable', 'boolean'],
            'fecha_finalizacion_fase'                   => ['required', 'date', 'date_format:Y-m-d'],
            'min_fecha_inicio_proyectos_idi'            => ['required_if:tipo_convocatoria,1', 'nullable', 'date', 'date_format:Y-m-d', 'before:max_fecha_finalizacion_proyectos_idi'],
            'max_fecha_finalizacion_proyectos_idi'      => ['required_if:tipo_convocatoria,1', 'nullable', 'date', 'date_format:Y-m-d', 'after:min_fecha_inicio_proyectos_idi'],
            'min_fecha_inicio_proyectos_cultura'        => ['required_if:tipo_convocatoria,1', 'nullable', 'date', 'date_format:Y-m-d', 'before:max_fecha_finalizacion_proyectos_cultura'],
            'max_fecha_finalizacion_proyectos_cultura'  => ['required_if:tipo_convocatoria,1', 'nullable', 'date', 'date_format:Y-m-d', 'after:min_fecha_inicio_proyectos_cultura'],
            'min_fecha_inicio_proyectos_st'             => ['required_if:tipo_convocatoria,1', 'nullable', 'date', 'date_format:Y-m-d', 'before:max_fecha_finalizacion_proyectos_st'],
            'max_fecha_finalizacion_proyectos_st'       => ['required_if:tipo_convocatoria,1', 'nullable', 'date', 'date_format:Y-m-d', 'after:min_fecha_inicio_proyectos_st'],
            'min_fecha_inicio_proyectos_ta'             => ['required_if:tipo_convocatoria,1', 'nullable', 'date', 'date_format:Y-m-d', 'before:max_fecha_finalizacion_proyectos_ta'],
            'min_fecha_inicio_proyectos_tp'             => ['required_if:tipo_convocatoria,1', 'nullable', 'date', 'date_format:Y-m-d', 'before:max_fecha_finalizacion_proyectos_tp'],
            'max_fecha_finalizacion_proyectos_ta'       => ['required_if:tipo_convocatoria,1', 'nullable', 'date', 'date_format:Y-m-d', 'after:min_fecha_inicio_proyectos_ta'],
            'max_fecha_finalizacion_proyectos_tp'       => ['required_if:tipo_convocatoria,1', 'nullable', 'date', 'date_format:Y-m-d', 'after:min_fecha_inicio_proyectos_tp'],
            'hora_finalizacion_fase'                    => ['required'],
            'idi_activa'                                => ['nullable', 'boolean'],
            'st_activa'                                 => ['nullable', 'boolean'],
            'ta_activa'                                 => ['nullable', 'boolean'],
            'tp_activa'                                 => ['nullable', 'boolean'],
            'cultura_activa'                            => ['nullable', 'boolean'],
        ];
    }

    /**
     * Prepare the data for validation.
     *
     * @return void
     */
    protected function prepareForValidation()
    {
        if (is_array($this->tipo_convocatoria)) {
            $this->merge([
                'tipo_convocatoria' => $this->tipo_convocatoria['value']
            ]);
        }
    }
}
