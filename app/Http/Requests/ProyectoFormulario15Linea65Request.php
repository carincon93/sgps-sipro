<?php

namespace App\Http\Requests;

use App\Rules\MaxWords;
use Illuminate\Foundation\Http\FormRequest;

class ProyectoFormulario15Linea65Request extends FormRequest
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
        if ($this->isMethod('PUT')) {
            return [
                'centro_formacion_id'                           => ['required', 'min:0', 'max:2147483647', 'integer', 'exists:centros_formacion,id'],
                'linea_investigacion_id'                        => ['required', 'min:0', 'max:2147483647', 'integer', 'exists:lineas_investigacion,id'],
                'area_conocimiento_id'                          => ['required', 'min:0', 'max:2147483647', 'integer', 'exists:areas_conocimiento,id'],
                'tematica_estrategica_id'                       => ['required', 'min:0', 'max:2147483647', 'integer', 'exists:tematicas_estrategicas,id'],
                'actividad_economica_id'                        => ['required', 'min:0', 'max:2147483647', 'integer', 'exists:actividades_economicas,id'],
                'titulo'                                        => ['required', 'string', new MaxWords(20)],
                'fecha_inicio'                                  => ['required', 'date', 'date_format:Y-m-d', 'before:fecha_finalizacion'],
                'fecha_finalizacion'                            => ['required', 'date', 'date_format:Y-m-d', 'after:fecha_inicio'],
                'max_meses_ejecucion'                           => ['required', 'numeric', 'min:1', 'max:12'],
                'video'                                         => ['nullable', 'string', 'url'],
                'numero_aprendices'                             => ['required', 'min:0', 'max:2147483647', 'integer'],
                'municipios*'                                   => ['required', 'integer', 'min:0', 'max:2147483647', 'exists:municipios,id'],
                'programas_formacion*'                          => ['required', 'integer', 'min:0', 'max:2147483647', 'exists:programas_formacion,id'],
                'programas_formacion_articulados*'              => ['nullable', 'integer', 'min:0', 'max:2147483647', 'exists:programas_formacion,id'],
                'relacionado_plan_tecnologico'                  => ['required', 'min:0', 'max:3', 'integer'],
                'relacionado_agendas_competitividad'            => ['required', 'min:0', 'max:3', 'integer'],
                'relacionado_mesas_sectoriales'                 => ['required', 'min:0', 'max:3', 'integer'],
                'mesa_sectorial_id*'                            => ['required_if:relacionado_mesas_sectoriales,1', 'min:0', 'max:2147483647', 'exists:mesas_sectoriales,id'],
                'eje_sennova'                                   => ['nullable', 'integer'],
                'areas_cualificacion_mnc'                       => ['nullable', 'json'],
                'aportacion_linea_transeversal_campesena'       => ['nullable', 'string'],
                'lineas_estrategicas_sena'                      => ['nullable', 'json'],
                'justificacion_aportes_lineas_estrategicas'     => ['nullable', 'string'],
                'lineas_programaticas_sennova'                  => ['nullable', 'json'],
            ];
        } else {
            return [
                'centro_formacion_id'                           => ['required', 'min:0', 'max:2147483647', 'integer', 'exists:centros_formacion,id'],
                'linea_investigacion_id'                        => ['required', 'min:0', 'max:2147483647', 'integer', 'exists:lineas_investigacion,id'],
                'area_conocimiento_id'                          => ['required', 'min:0', 'max:2147483647', 'integer', 'exists:areas_conocimiento,id'],
                'tematica_estrategica_id'                       => ['required', 'min:0', 'max:2147483647', 'integer', 'exists:tematicas_estrategicas,id'],
                'titulo'                                        => ['required', 'string', new MaxWords(20)],
                'fecha_inicio'                                  => ['required', 'date', 'date_format:Y-m-d', 'before:fecha_finalizacion'],
                'fecha_finalizacion'                            => ['required', 'date', 'date_format:Y-m-d', 'after:fecha_inicio'],
                'max_meses_ejecucion'                           => ['required', 'numeric', 'min:1', 'max:12'],
                'actividad_economica_id'                        => ['required', 'min:0', 'max:2147483647', 'integer', 'exists:actividades_economicas,id'],
                'rol_sennova'                                   => ['required', 'min:0', 'max:2147483647', 'integer', 'exists:roles_sennova,id'],
                'cantidad_horas'                                => ['required', 'numeric', 'min:1', 'max:168'],
                'cantidad_meses'                                => ['required', 'numeric', 'min:1', 'max:12'],
            ];
        }
    }

    /**
     * Prepare the data for validation.
     *
     * @return void
     */
    protected function prepareForValidation()
    {
        $this->merge([
            'municipios'                    => is_array($this->municipios) && count($this->municipios) == 0 ? null : $this->municipios,
            'programas_formacion'           => is_array($this->programas_formacion) && count($this->programas_formacion) == 0 ? null : $this->programas_formacion,
            'areas_cualificacion_mnc'       => json_encode($this->areas_cualificacion_mnc),
            'lineas_estrategicas_sena'      => json_encode($this->lineas_estrategicas_sena),
            'lineas_programaticas_sennova'  => json_encode($this->lineas_programaticas_sennova),
        ]);
    }
}
