<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ProyectoLinea69ColumnRequest extends FormRequest
{

    private $columnsRules = [
        'fecha_inicio'                       => ['required', 'date', 'date_format:Y-m-d', 'before:fecha_finalizacion'],
        'fecha_finalizacion'                 => ['required', 'date', 'date_format:Y-m-d', 'after:fecha_inicio'],
        'articulacion_agenda_competitividad' => ['nullable','string'],
        'aportes_linea_ocho_conpes'          => ['nullable','string'],
        'estado_ecosistema_ctel'             => ['nullable','string'],
        'logros_vigencia_anterior'           => ['nullable','string'],
        'resumen'                            => ['required','string'],
        'resumen_regional'                   => ['required','string'],
        'antecedentes'                       => ['required','string'],
        'antecedentes_regional'              => ['required','string'],
        'marco_conceptual'                   => ['required', 'string'],
        'bibliografia'                       => ['required', 'string'],
        'retos_oportunidades'                => ['required','string'],
        'pertinencia_territorio'             => ['required','string'],
        'pdf_proyecto_general'               => ['nullable','file'],
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
