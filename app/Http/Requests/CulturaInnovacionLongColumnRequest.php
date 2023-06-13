<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use App\Rules\MaxWords;
use App\Rules\FechaInicioProyecto;
use App\Rules\FechaFinalizacionProyecto;

class CulturaInnovacionLongColumnRequest extends FormRequest
{

    private $columnsRules = [
        'resumen'                                   => ['required', 'max:40000', 'string'],
        'antecedentes'                              => ['required', 'max:40000', 'string'],
        'marco_conceptual'                          => ['required', 'string'],
        'justificacion_industria_4'                 => ['nullable', 'string'],
        'justificacion_economia_naranja'            => ['nullable', 'string'],
        'justificacion_politica_discapacidad'       => ['nullable', 'string'],
        'impacto_municipios'                        => ['required', 'string'],
        'impacto_centro_formacion'                  => ['required', 'string'],
        'bibliografia'                              => ['required', 'string'],
        'atencion_pluralista_diferencial'           => ['nullable', 'string'],
        'impacto_sector_agricola'                   => ['nullable', 'string'],
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
