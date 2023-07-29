<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use App\Rules\MaxWords;

class ProyectoLinea66Request extends FormRequest
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
                'centro_formacion_id'                       => ['required', 'min:0', 'max:2147483647', 'integer', 'exists:centros_formacion,id'],
                'linea_programatica_id'                     => ['required', 'min:0', 'max:2147483647', 'integer', 'exists:lineas_programaticas,id'],
                'linea_investigacion_id'                    => ['required', 'min:0', 'max:2147483647', 'integer', 'exists:lineas_investigacion,id'],
                'disciplina_subarea_conocimiento_id'        => ['required', 'min:0', 'max:2147483647', 'integer', 'exists:disciplinas_subarea_conocimiento,id'],
                'tematica_estrategica_id'                   => ['required', 'min:0', 'max:2147483647', 'integer', 'exists:tematicas_estrategicas,id'],
                'red_conocimiento_id'                       => ['required', 'min:0', 'max:2147483647', 'integer', 'exists:redes_conocimiento,id'],
                'actividad_economica_id'                    => ['required', 'min:0', 'max:2147483647', 'integer', 'exists:actividades_economicas,id'],
                'titulo'                                    => ['required', 'string', new MaxWords(20)],
                'fecha_inicio'                              => ['required', 'date', 'date_format:Y-m-d', 'before:fecha_finalizacion'],
                'fecha_finalizacion'                        => ['required', 'date', 'date_format:Y-m-d', 'after:fecha_inicio'],
                'max_meses_ejecucion'                       => ['required', 'numeric', 'min:1', 'max:12'],
                'video'                                     => ['nullable', 'string', 'url'],
                'muestreo'                                  => ['required', 'max:191'],
                'actividades_muestreo'                      => ['nullable', 'max:191'],
                'objetivo_muestreo'                         => ['nullable', 'max:191'],
                'recoleccion_especimenes'                   => ['required', 'min:1', 'max:2', 'integer'],
                'numero_aprendices'                         => ['required', 'min:0', 'max:2147483647', 'integer'],
                'municipios*'                               => ['required', 'integer', 'exists:municipios,id'],
                'programas_formacion*'                      => ['required', 'integer', 'exists:programas_formacion,id'],
                'programas_formacion_articulados*'          => ['nullable', 'integer', 'exists:programas_formacion_articulados,id'],
                'relacionado_plan_tecnologico'              => ['required', 'min:0', 'max:3', 'integer'],
                'relacionado_agendas_competitividad'        => ['required', 'min:0', 'max:3', 'integer'],
                'relacionado_mesas_sectoriales'             => ['required', 'min:0', 'max:3', 'integer'],
                'relacionado_tecnoacademia'                 => ['required', 'min:0', 'max:3', 'integer'],
                'mesa_sectorial_id*'                        => ['required_if:relacionado_mesas_sectoriales,1', 'min:0', 'max:2147483647', 'exists:mesas_sectoriales,id'],
                'linea_tecnologica_id*'                     => ['required_if:relacionado_tecnoacademia,1', 'min:0', 'max:2147483647', 'exists:lineas_tecnoacademia,id'],
                'proyecto_investigacion_pedagogica'         => ['nullable', 'boolean'],
                'articulacion_eni'                          => ['nullable', 'boolean'],
                'area_tematica_eni_id*'                     => ['nullable', 'integer', 'exists:areas_tematicas_eni,id'],
                'linea_investigacion_eni_id*'               => ['nullable', 'integer', 'exists:lineas_investigacion,id'],
                'grupo_investigacion_eni_id'                => ['nullable', 'integer', 'exists:grupos_investigacion,id'],
            ];
        } else {
            return [
                'centro_formacion_id'                       => ['required', 'min:0', 'max:2147483647', 'integer', 'exists:centros_formacion,id'],
                'linea_programatica_id'                     => ['required', 'min:0', 'max:2147483647', 'integer', 'exists:lineas_programaticas,id'],
                'linea_investigacion_id'                    => ['required', 'min:0', 'max:2147483647', 'integer', 'exists:lineas_investigacion,id'],
                'disciplina_subarea_conocimiento_id'        => ['required', 'min:0', 'max:2147483647', 'integer', 'exists:disciplinas_subarea_conocimiento,id'],
                'tematica_estrategica_id'                   => ['required', 'min:0', 'max:2147483647', 'integer', 'exists:tematicas_estrategicas,id'],
                'red_conocimiento_id'                       => ['required', 'min:0', 'max:2147483647', 'integer', 'exists:redes_conocimiento,id'],
                'titulo'                                    => ['required', 'string', new MaxWords(20)],
                'fecha_inicio'                              => ['required', 'date', 'date_format:Y-m-d', 'before:fecha_finalizacion'],
                'fecha_finalizacion'                        => ['required', 'date', 'date_format:Y-m-d', 'after:fecha_inicio'],
                'max_meses_ejecucion'                       => ['required', 'numeric', 'min:1', 'max:12'],
                'actividad_economica_id'                    => ['required', 'min:0', 'max:2147483647', 'integer', 'exists:actividades_economicas,id'],
                'rol_sennova'                               => ['required', 'min:0', 'max:2147483647', 'integer'],
                'cantidad_horas'                            => ['required', 'numeric', 'min:1', 'max:168'],
                'cantidad_meses'                            => ['required', 'numeric', 'min:1', 'max:12'],
                'proyecto_investigacion_pedagogica'         => ['nullable', 'boolean'],
                'articulacion_eni'                          => ['nullable', 'boolean']
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
            'municipios' => json_encode($this->municipios),
            'area_tematica_eni_id' => json_encode($this->area_tematica_eni_id),
            'programas_formacion' => json_encode($this->programas_formacion),
            'programas_formacion_articulados' => json_encode($this->programas_formacion_articulados),
        ]);
    }
}
