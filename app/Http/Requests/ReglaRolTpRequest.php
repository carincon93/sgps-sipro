<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ReglaRolTpRequest extends FormRequest
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
            'nodo_tecnoparque_id'           => ['required', 'min:0', 'max:2147483647', 'integer', 'exists:nodos_tecnoparque,id'],
            'convocatoria_rol_sennova_id'   => ['required', 'min:0', 'max:2147483647', 'integer', 'exists:convocatoria_rol_sennova,id'],
            'maximo'                        => ['required', 'min:0', 'max:32767', 'integer'],
        ];
    }

    /**
     * Prepare the data for validation.
     *
     * @return void
     */
    protected function prepareForValidation()
    {
        if (is_array($this->nodo_tecnoparque_id)) {
            $this->merge([
                'nodo_tecnoparque_id' => $this->nodo_tecnoparque_id['value'],
            ]);
        }

        if (is_array($this->convocatoria_rol_sennova_id)) {
            $this->merge([
                'convocatoria_rol_sennova_id' => $this->convocatoria_rol_sennova_id['value'],
            ]);
        }
    }
}
