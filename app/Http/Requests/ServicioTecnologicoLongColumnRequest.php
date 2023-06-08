<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use App\Rules\MaxWords;
use App\Rules\FechaInicioProyecto;
use App\Rules\FechaFinalizacionProyecto;

class ServicioTecnologicoLongColumnRequest extends FormRequest
{

    private $columnsRules = [
        'resumen'                                   => ['required', 'max:1000', 'string'],
        'antecedentes'                              => ['required', 'max:10000', 'string'],
        'identificacion_problema'                   => ['required', 'max:5000', 'string'],
        'justificacion_problema'                    => ['required', 'max:5000', 'string'],
        'bibliografia'                              => ['required', 'string'],
        'pregunta_formulacion_problema'             => ['required', 'string'],
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
