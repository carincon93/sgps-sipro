<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ProyectoLinea83ColumnRequest extends FormRequest
{
    private $columnsRules = [
        'fecha_inicio'                                  => ['required', 'date', 'date_format:Y-m-d', 'before:fecha_finalizacion'],
        'fecha_finalizacion'                            => ['required', 'date', 'date_format:Y-m-d', 'after:fecha_inicio'],
        'logros_vigencia_anterior'                      => ['nullable', 'string'],
        'resumen'                                       => ['required', 'string'],
        'antecedentes'                                  => ['required', 'string'],
        'marco_conceptual'                              => ['required', 'string'],
        'bibliografia'                                  => ['required', 'string'],
        'pertinencia_territorio'                        => ['required', 'string'],
        'titulo'                                        => ['nullable', 'string'],
        'retos_prioridades'                             => ['nullable', 'string'],
        'contribucion_agenda_regional_competitividad'   => ['nullable', 'string'],
        'aportes_conpes'                                => ['nullable', 'string'],
        'estado_actual_ecosistema_ctel'                 => ['nullable', 'string'],
        'logros_implementacion_ctel'                    => ['nullable', 'string'],
        'justificacion_pertinencia_territorio'          => ['nullable', 'string'],
        'aporta_fortalecimiento_cadenas_agricolas'      => ['nullable', 'string'],
        'estrategias_generacion_electrica'              => ['nullable', 'string'],
        'estrategias_fortalecimiento_micronegocios'     => ['nullable', 'string'],
        'estrategias_articulacion_campesinos'           => ['nullable', 'string'],
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
