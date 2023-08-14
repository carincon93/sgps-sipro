<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ProyectoFormulario16Linea65ColumnRequest extends FormRequest
{
    private $columnsRules = [
        'titulo'                                        => ['required', 'string'],
        'fecha_inicio'                                  => ['required', 'date', 'date_format:Y-m-d', 'before:fecha_finalizacion'],
        'fecha_finalizacion'                            => ['required', 'date', 'date_format:Y-m-d', 'after:fecha_inicio'],

        'resumen'                                       => ['required', 'max:40000', 'string'],
        'antecedentes'                                  => ['required', 'max:40000', 'string'],
        'marco_conceptual'                              => ['required', 'string'],
        'impacto_municipios'                            => ['required', 'string'],
        'impacto_centro_formacion'                      => ['required', 'string'],
        'bibliografia'                                  => ['required', 'string'],
        'atencion_pluralista_diferencial'               => ['nullable', 'string'],
        'centro_formacion_id'                           => ['required', 'min:0', 'max:2147483647', 'integer', 'exists:centros_formacion,id'],

        'numero_beneficiarios'                          => ['required', 'min:0', 'max:2147483647', 'integer'],
        'municipios'                                    => ['required', 'array'],
        'programas_formacion'                           => ['required', 'array'],
        'relacionado_plan_tecnologico'                  => ['required', 'min:0', 'max:3', 'integer'],
        'relacionado_agendas_competitividad'            => ['required', 'min:0', 'max:3', 'integer'],
        'relacionado_mesas_sectoriales'                 => ['required', 'min:0', 'max:3', 'integer'],
        'mesa_sectorial_id'                             => ['required_if:relacionado_mesas_sectoriales,1', 'array'],
        'eje_sennova'                                   => ['nullable', 'integer'],
        'areas_cualificacion_mnc'                       => ['nullable', 'json'],
        'aportacion_linea_transeversal_campesena'       => ['nullable', 'string'],
        'lineas_estrategicas_sena'                      => ['nullable', 'json'],
        'justificacion_aportes_lineas_estrategicas'     => ['nullable', 'string'],
        'lineas_programaticas_sennova'                  => ['nullable', 'json'],
        'disciplinas_conocimiento'                      => ['nullable', 'json'],
        'actividades_economicas'                        => ['nullable', 'json'],
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
            'municipios'                    => is_array($this->municipios) && count($this->municipios) == 0 ? null : $this->municipios,
            'programas_formacion'           => is_array($this->programas_formacion) && count($this->programas_formacion) == 0 ? null : $this->programas_formacion,
            'areas_cualificacion_mnc'       => json_encode($this->areas_cualificacion_mnc),
            'lineas_estrategicas_sena'      => json_encode($this->lineas_estrategicas_sena),
            'lineas_programaticas_sennova'  => json_encode($this->lineas_programaticas_sennova),
            'disciplinas_conocimiento'      => json_encode($this->disciplinas_conocimiento),
            'actividades_economicas'        => json_encode($this->actividades_economicas),
        ]);
    }
}
