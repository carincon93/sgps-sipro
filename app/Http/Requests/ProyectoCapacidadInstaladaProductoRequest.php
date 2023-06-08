<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ProyectoCapacidadInstaladaProductoRequest extends FormRequest
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
            'descripcion'           => ['required', 'string'],
            'resultado_id'          => ['required', 'min:0', 'max:2147483647', 'integer', 'exists:proyectos_capacidad_resultado,id'],
            'tipologia_minciencias' => ['required', 'integer', 'min:0', 'max:2147483647']
        ];
    }

    /**
     * Prepare the data for validation.
     *
     * @return void
     */
    protected function prepareForValidation()
    {
        if (is_array($this->tipologia_minciencias)) {
            $this->merge([
                'tipologia_minciencias' => $this->tipologia_minciencias['value'],
            ]);
        }

        if (is_array($this->resultado_id)) {
            $this->merge([
                'resultado_id' => $this->resultado_id['value'],
            ]);
        }
    }
}
