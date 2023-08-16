<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use App\Rules\MaxWords;

class ProyectoFormulario9Linea23Request extends FormRequest
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
                'titulo'                                            => ['required', 'string', new MaxWords(20)],
                'fecha_inicio'                                      => ['required', 'date', 'date_format:Y-m-d', 'before:fecha_finalizacion'],
                'fecha_finalizacion'                                => ['required', 'date', 'date_format:Y-m-d', 'after:fecha_inicio'],
                'max_meses_ejecucion'                               => ['required', 'numeric', 'min:1', 'max:12'],
                'centro_formacion_id'                               => ['required', 'min:0', 'max:2147483647', 'integer', 'exists:centros_formacion,id'],
                'linea_investigacion_id'                            => ['required', 'min:0', 'max:2147483647', 'integer', 'exists:lineas_investigacion,id'],
                'red_conocimiento_id'                               => ['required', 'min:0', 'max:2147483647', 'integer', 'exists:redes_conocimiento,id'],
                'disciplina_subarea_conocimiento_id'                => ['required', 'min:0', 'max:2147483647', 'integer', 'exists:disciplinas_subarea_conocimiento,id'],
                'tematica_estrategica_id'                           => ['required', 'min:0', 'max:2147483647', 'integer', 'exists:tematicas_estrategicas,id'],
                'actividad_economica_id'                            => ['required', 'min:0', 'max:2147483647', 'integer', 'exists:actividades_economicas,id'],
                'grupo_investigacion_eni_id'                        => ['nullable', 'integer', 'exists:grupos_investigacion,id'],
                'video'                                             => ['nullable', 'string', 'url'],
                'numero_aprendices'                                 => ['required', 'min:0', 'max:2147483647', 'integer'],
                'municipios*'                                       => ['required', 'integer', 'exists:municipios,id'],
                'programas_formacion*'                              => ['required', 'integer', 'exists:programas_formacion,id'],
                'linea_tecnologica_id*'                             => ['required_if:relacionado_tecnoacademia,1', 'min:0', 'max:2147483647', 'exists:lineas_tecnoacademia,id'],
                'relacionado_plan_tecnologico'                      => ['required', 'min:0', 'max:3', 'integer'],
                'relacionado_agendas_competitividad'                => ['required', 'min:0', 'max:3', 'integer'],
                'relacionado_mesas_sectoriales'                     => ['required', 'min:0', 'max:3', 'integer'],
                'relacionado_tecnoacademia'                         => ['required', 'min:0', 'max:3', 'integer'],
                'resumen'                                           => ['nullable', 'string'],
                'antecedentes'                                      => ['nullable', 'string'],
                'marco_conceptual'                                  => ['nullable', 'string'],
                'justificacion_industria_4'                         => ['nullable', 'string'],
                'justificacion_economia_naranja'                    => ['nullable', 'string'],
                'justificacion_politica_discapacidad'               => ['nullable', 'string'],
                'atencion_pluralista_diferencial'                   => ['nullable', 'string'],
                'impacto_sector_agricola'                           => ['nullable', 'string'],
                'bibliografia'                                      => ['nullable', 'string'],
                'impacto_municipios'                                => ['nullable', 'string'],
                'impacto_centro_formacion'                          => ['nullable', 'string'],
                'aporta_a_campesena'                                => ['nullable', 'boolean'],
                'relacionado_estrategia_campesena'                  => ['nullable', 'boolean'],
                'justificacion_relacion_campesena'                  => ['nullable', 'string'],
                'lineas_estrategicas_convocatoria'                  => ['nullable', 'json'],
                'justificacion_lineas_estrategicas'                 => ['nullable', 'string'],
                'impacto_regional'                                  => ['nullable', 'boolean'],
                'justificacion_impacto_regional'                    => ['nullable', 'string'],
                'justificacion_mesas_sectoriales'                   => ['nullable', 'string'],
                'areas_cualificacion_mnc'                           => ['nullable', 'json'],
                'lineas_estrategicas_beneficiadas'                  => ['nullable', 'json'],
                'justificacion_lineas_estrategicas_beneficiadas'    => ['nullable', 'string'],
                'veredas_corregimientos'                            => ['nullable', 'json'],
            ];
        } else {
            return [
                'centro_formacion_id'                       => ['required', 'min:0', 'max:2147483647', 'integer', 'exists:centros_formacion,id'],
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
                'areas_cualificacion_mnc'                   => ['nullable', 'json'],
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
            'municipios'                        => is_array($this->municipios) && count($this->municipios) == 0 ? null : $this->municipios,
            'programas_formacion'               => is_array($this->programas_formacion) && count($this->programas_formacion) == 0 ? null : $this->programas_formacion,
            'lineas_estrategicas_convocatoria'  => json_encode($this->lineas_estrategicas_convocatoria),
            'areas_cualificacion_mnc'           => json_encode($this->areas_cualificacion_mnc),
            'lineas_estrategicas_beneficiadas'  => json_encode($this->lineas_estrategicas_beneficiadas),
        ]);
    }
}
