<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ProyectoFormulario17Linea69ColumnRequest extends FormRequest
{
    private $columnsRules = [
        'nodo_tecnoparque_id'                           => ['required', 'min:0', 'max:2147483647', 'exists:nodos_tecnoparque,id'],
        'fecha_inicio'                                  => ['required', 'date', 'date_format:Y-m-d', 'before:fecha_finalizacion'],
        'fecha_finalizacion'                            => ['required', 'date', 'date_format:Y-m-d', 'after:fecha_inicio'],
        'logros_vigencia_anterior'                      => ['nullable','string'],
        'resumen'                                       => ['required','string'],
        'resumen_regional'                              => ['required','string'],
        'antecedentes'                                  => ['required','string'],
        'antecedentes_regional'                         => ['required','string'],
        'marco_conceptual'                              => ['required','string'],
        'bibliografia'                                  => ['required','string'],
        'retos_oportunidades'                           => ['required','string'],
        'pertinencia_territorio'                        => ['required','string'],
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
        if ($this->columnsRules[$this->is_array ? $this->route('column').'*' : $this->route('column')]) {
            return [
                $this->route('column') => $this->columnsRules[$this->is_array ? $this->route('column').'*' : $this->route('column')]
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
        //
    }
}
