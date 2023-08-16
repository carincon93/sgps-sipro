<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ProyectoFormulario17Linea69Request extends FormRequest
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
                'nodo_tecnoparque_id'                           => ['required', 'min:0', 'max:2147483647', 'exists:nodos_tecnoparque,id'],
                'fecha_inicio'                                  => ['required', 'date', 'date_format:Y-m-d', 'before:fecha_finalizacion'],
                'fecha_finalizacion'                            => ['required', 'date', 'date_format:Y-m-d', 'after:fecha_inicio'],
                'max_meses_ejecucion'                           => ['required', 'numeric', 'min:1', 'max:12'],

                'resumen'                                       => ['nullable','string'],
                'resumen_regional'                              => ['nullable','string'],
                'antecedentes'                                  => ['nullable','string'],
                'antecedentes_regional'                         => ['nullable','string'],
                'logros_vigencia_anterior'                      => ['nullable','string'],
                'contexto_general'                              => ['nullable','string'],
                'retos_locales_regionales'                      => ['nullable','string'],
                'estado_actual_departamento'                    => ['nullable','string'],
                'contribucion_desarrollo_empresas'              => ['nullable','string'],
                'contribucion_agenda_regional_competitividad'   => ['nullable','string'],
                'aportes_conpes_4011'                           => ['nullable','string'],
                'aportes_conpes_4080'                           => ['nullable','string'],
                'situacion_actual_produccion_agricola'          => ['nullable','string'],
                'aportes_alternativas_generacion_electrica'     => ['nullable','string'],
                'aportes_impulso_economia_popular'              => ['nullable','string'],
                'justificacion_pertinencia'                     => ['nullable','string'],
                'acciones_estrategias_campesena'                => ['nullable','string'],
                'bibliografia'                                  => ['nullable','string'],
            ];
        } else {
            return [
                'nodo_tecnoparque_id'                       => ['required', 'min:0', 'max:2147483647', 'exists:nodos_tecnoparque,id'],
                'fecha_inicio'                              => ['required', 'date', 'date_format:Y-m-d', 'before:fecha_finalizacion'],
                'fecha_finalizacion'                        => ['required', 'date', 'date_format:Y-m-d', 'after:fecha_inicio'],
                'max_meses_ejecucion'                       => ['required', 'numeric', 'min:1', 'max:12'],
                'rol_sennova'                               => ['required', 'min:0', 'max:2147483647', 'integer'],
                'cantidad_horas'                            => ['required', 'numeric', 'min:1', 'max:168'],
                'cantidad_meses'                            => ['required', 'numeric', 'min:1', 'max:12'],
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
        //
    }
}
