<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ProyectoFormulario4Linea70ColumnRequest extends FormRequest
{

    private $columnsRules = [
        'fecha_inicio'                              => ['required', 'date', 'date_format:Y-m-d', 'before:fecha_finalizacion'],
        'fecha_finalizacion'                        => ['required', 'date', 'date_format:Y-m-d', 'after:fecha_inicio'],
        'logros_vigencia_anterior'                  => ['nullable', 'string'],
        'resumen'                                   => ['required', 'max:40000', 'string'],
        'resumen_regional'                          => ['required', 'max:40000', 'string'],
        'antecedentes'                              => ['required', 'max:40000', 'string'],
        'antecedentes_tecnoacademia'                => ['required', 'max:40000', 'string'],
        'justificacion_problema'                    => ['required', 'max:40000', 'string'],
        'marco_conceptual'                          => ['required', 'string'],
        'bibliografia'                              => ['required', 'string'],
        'pertinencia_territorio'                    => ['required', 'max:40000', 'string'],
        'retos_oportunidades'                       => ['required', 'max:40000', 'string'],
        'lineas_tecnologicas_centro'                => ['nullable', 'string'],
        'tecnoacademia_linea_tecnoacademia_id*'     => ['required', 'min:0', 'max:2147483647', 'exists:tecnoacademia_linea_tecnoacademia,id'],
        'infraestructura_tecnoacademia'             => ['nullable', 'integer'],
        'pdf_proyecto_general'                      => ['nullable','file'],

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
