<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ProyectoLinea66ColumnRequest extends FormRequest
{
    private $columnsRules = [
        'resumen'                                               => ['required', 'string'],
        'antecedentes'                                          => ['required', 'string'],
        'marco_conceptual'                                      => ['required', 'string'],
        'justificacion_industria_4'                             => ['nullable', 'string'],
        'justificacion_economia_naranja'                        => ['nullable', 'string'],
        'justificacion_politica_discapacidad'                   => ['nullable', 'string'],
        'atencion_pluralista_diferencial'                       => ['nullable', 'string'],
        'impacto_sector_agricola'                               => ['nullable', 'string'],
        'bibliografia'                                          => ['required', 'string'],
        'impacto_municipios'                                    => ['required', 'string'],
        'impacto_centro_formacion'                              => ['required', 'string'],
        'fecha_inicio'                                          => ['required', 'date', 'date_format:Y-m-d', 'before:fecha_finalizacion'],
        'fecha_finalizacion'                                    => ['required', 'date', 'date_format:Y-m-d', 'after:fecha_inicio'],
        'justificacion_proyecto_investigacion_pedagogica'       => ['nullable', 'string'],
        'centro_formacion_id'                                   => ['required', 'min:0', 'max:2147483647', 'integer', 'exists:centros_formacion,id'],
        'linea_programatica_id'                                 => ['required', 'min:0', 'max:2147483647', 'integer', 'exists:lineas_programaticas,id'],
        'linea_investigacion_id'                                => ['required', 'min:0', 'max:2147483647', 'integer', 'exists:lineas_investigacion,id'],
        'disciplina_subarea_conocimiento_id'                    => ['required', 'min:0', 'max:2147483647', 'integer', 'exists:disciplinas_subarea_conocimiento,id'],
        'tematica_estrategica_id'                               => ['required', 'min:0', 'max:2147483647', 'integer', 'exists:tematicas_estrategicas,id'],
        'red_conocimiento_id'                                   => ['required', 'min:0', 'max:2147483647', 'integer', 'exists:redes_conocimiento,id'],
        'actividad_economica_id'                                => ['required', 'min:0', 'max:2147483647', 'integer', 'exists:actividades_economicas,id'],
        'titulo'                                                => ['required', 'string'],
        'max_meses_ejecucion'                                   => ['required', 'numeric', 'min:1', 'max:12'],
        'video'                                                 => ['nullable', 'string', 'url'],
        'muestreo'                                              => ['required', 'max:191'],
        'actividades_muestreo'                                  => ['nullable', 'max:191'],
        'objetivo_muestreo'                                     => ['nullable', 'max:191'],
        'recoleccion_especimenes'                               => ['required', 'min:1', 'max:2', 'integer'],
        'numero_aprendices'                                     => ['required', 'min:0', 'max:2147483647', 'integer'],
        'municipios'                                            => ['required', 'array'],
        'programas_formacion'                                   => ['required', 'array'],
        'relacionado_plan_tecnologico'                          => ['required', 'min:0', 'max:3', 'integer'],
        'relacionado_agendas_competitividad'                    => ['required', 'min:0', 'max:3', 'integer'],
        'relacionado_mesas_sectoriales'                         => ['required', 'min:0', 'max:3', 'integer'],
        'relacionado_tecnoacademia'                             => ['required', 'min:0', 'max:3', 'integer'],
        'mesa_sectorial_id'                                     => ['required_if:relacionado_mesas_sectoriales,1'],
        'linea_tecnologica_id'                                  => ['required_if:relacionado_tecnoacademia,1'],
        'proyecto_investigacion_pedagogica'                     => ['nullable', 'boolean'],
        'articulacion_eni'                                      => ['nullable', 'boolean'],
        'area_tematica_eni_id'                                  => ['nullable', 'array', 'exists:areas_tematicas_eni,id'],
        'linea_investigacion_eni_id'                            => ['nullable', 'array', 'exists:lineas_investigacion,id'],
        'grupo_investigacion_eni_id'                            => ['nullable', 'array', 'exists:grupos_investigacion,id'],
        'aporta_a_campesena'                                    => ['nullable', 'boolean'],
        'relacionado_estrategia_campesena'                      => ['nullable', 'boolean'],
        'justificacion_relacion_campesena'                      => ['nullable', 'string'],
        'lineas_estrategicas_convocatoria'                      => ['nullable', 'json'],
        'justificacion_lineas_estrategicas'                     => ['nullable', 'string'],
        'impacto_regional'                                      => ['nullable', 'boolean'],
        'justificacion_impacto_regional'                        => ['nullable', 'string'],
        'justificacion_mesas_sectoriales'                       => ['nullable', 'string'],
        'areas_cualificacion_mnc*'                              => ['nullable', 'json'],
        'lineas_estrategicas_beneficiadas'                      => ['nullable', 'json'],
        'justificacion_lineas_estrategicas_beneficiadas'        => ['nullable', 'string'],
        'veredas_corregimientos*'                               => ['nullable', 'json'],
    ];

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
        if ($this->columnsRules[$this->route('column')]) {
            return [
                $this->route('column') => $this->columnsRules[$this->route('column')]
            ];
        } else {
            return [
                'column' => 'required'
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
            'area_tematica_eni_id'              => is_array($this->area_tematica_eni_id) && count($this->area_tematica_eni_id) == 0 ? null : $this->area_tematica_eni_id,
            'linea_investigacion_eni_id'        => is_array($this->linea_investigacion_eni_id) && count($this->linea_investigacion_eni_id) == 0 ? null : $this->linea_investigacion_eni_id,

            'lineas_estrategicas_convocatoria'  => json_encode($this->lineas_estrategicas_convocatoria),
            'areas_cualificacion_mnc'           => json_encode($this->areas_cualificacion_mnc),
            'lineas_estrategicas_beneficiadas'  => json_encode($this->lineas_estrategicas_beneficiadas),
        ]);
    }
}
