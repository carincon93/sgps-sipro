<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class TaTpViaticosMunicipioRequest extends FormRequest
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
            'municipio_id'              => ['required', 'min:0', 'max:2147483647', 'integer', 'exists:municipios,id'],
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

        if (is_array($this->municipio_id)) {
            $this->merge([
                'municipio_id' => $this->municipio_id['value'],
            ]);
        }

        if (is_array($this->proyecto_rol_sennova_id)) {
            $this->merge([
                'proyecto_rol_sennova_id' => $this->proyecto_rol_sennova_id['value'],
            ]);
        }

        if (is_array($this->distancia_municipio)) {
            $this->merge([
                'distancia_municipio' => $this->distancia_municipio['value'],
            ]);
        }

        if (is_array($this->frecuencia_semanal)) {
            $this->merge([
                'frecuencia_semanal' => $this->frecuencia_semanal['value'],
            ]);
        }
    }
}
