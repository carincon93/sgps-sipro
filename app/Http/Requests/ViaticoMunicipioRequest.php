<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ViaticoMunicipioRequest extends FormRequest
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
        return [
            'proyecto_rol_sennova_id'   => ['required', 'min:0', 'max:2147483647', 'integer', 'exists:proyecto_rol_sennova,id'],
            'municipios'                => ['required', 'json'],
            'frecuencia_semanal'        => ['required', 'min:0', 'max:2147483647', 'integer'],
            'numero_visitas'            => ['required', 'min:0', 'max:2147483647', 'integer'],
            'distancia_municipio'       => ['required', 'min:0', 'max:2147483647', 'integer'],
            'actividad_a_realizar'      => ['required', 'string'],
        ];
    }

    /**
     * Prepare the data for validation.
     *
     * @return void
     */
    protected function prepareForValidation()
    {
        $this->merge([
            'municipios' => json_encode($this->municipios)
        ]);
    }
}
