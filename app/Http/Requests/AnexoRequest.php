<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AnexoRequest extends FormRequest
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
            'linea_programatica_id*'    => ['required', 'min:0', 'max:2147483647', 'integer', 'exists:lineas_programaticas,id'],
            'convocatoria_id*'          => ['required', 'min:0', 'max:2147483647', 'integer', 'exists:convocatorias,id'],
            'nombre'                    => ['required', 'max:191', 'string'],
            'descripcion'               => ['required', 'string'],
            'archivo'                   => ['nullable', 'file', 'max:10240'],
            'obligatorio'               => ['required', 'boolean'],
            'habilitado'                => ['required', 'boolean'],
        ];
    }

    /**
     * Prepare the data for validation.
     *
     * @return void
     */
    protected function prepareForValidation()
    {
        if (is_array($this->convocatoria_id)) {
            if (isset($this->convocatoria_id['value']) && is_numeric($this->convocatoria_id['value'])) {
                $this->merge([
                    'convocatoria_id' => $this->convocatoria_id['value'],
                ]);
            } else {
                $convocatoria_id = [];
                foreach ($this->convocatoria_id as $convocatoria) {
                    if (is_array($convocatoria)) {
                        array_push($convocatoria_id, $convocatoria['value']);
                    }
                }
                $this->merge(['convocatoria_id' => $convocatoria_id]);
            }
        }
    }
}
