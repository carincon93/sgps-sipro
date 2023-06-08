<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use App\Rules\MaxWords;
use App\Rules\FechaInicioProyecto;
use App\Rules\FechaFinalizacionProyecto;

class IdiLongColumnRequest extends FormRequest
{

    private $columnsRules = [
        'resumen'                                   => ['required', 'max:40000', 'string'],
        'antecedentes'                              => ['required', 'max:40000', 'string'],
        'marco_conceptual'                          => ['required', 'string'],
        'justificacion_industria_4'                 => ['nullable', 'string'],
        'justificacion_economia_naranja'            => ['nullable', 'string'],
        'justificacion_politica_discapacidad'       => ['nullable', 'string'],
        'atencion_pluralista_diferencial'           => ['nullable', 'string'],
        'impacto_sector_agricola'                   => ['nullable', 'string'],
        'bibliografia'                              => ['required', 'string'],
        'impacto_municipios'                        => ['required', 'string'],
        'impacto_centro_formacion'                  => ['required', 'string'],
        'productividad_beneficiaros'                => ['nullable', 'string'],
        'productividad_beneficiaros'                => ['nullable', 'string'],
        'generacion_empleo_beneficiarios'           => ['nullable', 'string'],
        'creacion_nuevos_desarrollos'               => ['nullable', 'string'],
        'generacion_conocimientos_beneficiarios'    => ['nullable', 'string'],
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
    }
}
