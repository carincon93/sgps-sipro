<?php

namespace App\Http\Requests;

use App\Rules\MaxWords;
use Illuminate\Foundation\Http\FormRequest;

class ProyectoFormulario3Linea61Request extends FormRequest
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
                'titulo'                                        => ['required', 'string', new MaxWords(20)],
                'fecha_inicio'                                  => ['required', 'date', 'date_format:Y-m-d', 'before:fecha_finalizacion'],
                'fecha_finalizacion'                            => ['required', 'date', 'date_format:Y-m-d', 'after:fecha_inicio'],
                'max_meses_ejecucion'                           => ['required', 'numeric', 'min:1', 'max:12'],
                'centro_formacion_id'                           => ['required', 'min:0', 'max:2147483647', 'integer', 'exists:centros_formacion,id'],
                'tematica_estrategica_id'                       => ['required', 'min:0', 'max:2147483647', 'integer', 'exists:tematicas_estrategicas,id'],
                'actividad_economica_id'                        => ['required', 'min:0', 'max:2147483647', 'integer', 'exists:actividades_economicas,id'],
                'video'                                         => ['nullable', 'string', 'url'],
                'numero_aprendices'                             => ['required', 'min:0', 'max:2147483647', 'integer'],
                'tipo_evento'                                   => ['nullable', 'min:1', 'max:3', 'integer'],
                'aportacion_produccion_agricola'                => ['nullable', 'string'],
                'aportacion_transicion_energetica'              => ['nullable', 'string'],
                'municipios*'                                   => ['required', 'integer', 'min:0', 'max:2147483647', 'exists:municipios,id'],
                'programas_formacion*'                          => ['required', 'integer', 'min:0', 'max:2147483647', 'exists:programas_formacion,id'],
                'relacionado_plan_tecnologico'                  => ['required', 'min:0', 'max:3', 'integer'],
                'relacionado_agendas_competitividad'            => ['required', 'min:0', 'max:3', 'integer'],
                'relacionado_mesas_sectoriales'                 => ['required', 'min:0', 'max:3', 'integer'],
                'relacionado_tecnoacademia'                     => ['required', 'min:0', 'max:3', 'integer'],
                'linea_tecnologica_id*'                         => ['required_if:relacionado_tecnoacademia,1', 'min:0', 'max:2147483647', 'exists:lineas_tecnoacademia,id'],
                'mesa_sectorial_id*'                            => ['required_if:relacionado_mesas_sectoriales,1', 'min:0', 'max:2147483647', 'exists:mesas_sectoriales,id'],
                'resumen'                                       => ['required', 'max:40000', 'string'],
                'antecedentes'                                  => ['required', 'max:40000', 'string'],
                'marco_conceptual'                              => ['required', 'string'],
                'impacto_municipios'                            => ['required', 'string'],
                'impacto_centro_formacion'                      => ['required', 'string'],
                'bibliografia'                                  => ['required', 'string'],
                'atencion_pluralista_diferencial'               => ['nullable', 'string'],
                'justificacion_politica_discapacidad'           => ['nullable', 'string'],
                'aportacion_linea_transeversal_campesena'       => ['nullable', 'string'],
            ];
        } else {
            return [
                'centro_formacion_id'                           => ['required', 'min:0', 'max:2147483647', 'integer', 'exists:centros_formacion,id'],
                'titulo'                                        => ['required', 'string', new MaxWords(20)],
                'fecha_inicio'                                  => ['required', 'date', 'date_format:Y-m-d', 'before:fecha_finalizacion'],
                'fecha_finalizacion'                            => ['required', 'date', 'date_format:Y-m-d', 'after:fecha_inicio'],
                'max_meses_ejecucion'                           => ['required', 'numeric', 'min:1', 'max:12'],
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
        ]);
    }
}
