<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class IndicadorColumnRequest extends FormRequest
{
    private $columnsRules = [
        'productividad_beneficiaros'                => ['nullable','string'],
        'generacion_empleo_beneficiarios'           => ['nullable','string'],
        'creacion_nuevos_desarrollos'               => ['nullable','string'],
        'generacion_conocimientos_beneficiarios'    => ['nullable','string'],
        'generacion_valor_beneficiarios'            => ['nullable', 'string'],
        'fortalecimiento_programas_formacion'       => ['nullable', 'string'],
        'transferencia_tecnologias'                 => ['nullable', 'string'],
        'calidad_formacion'                         => ['nullable', 'string'],
        'impacto_ambiental_proyectos'               => ['nullable', 'string'],
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
