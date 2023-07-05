<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ConvocatoriaRequest extends FormRequest
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
            'descripcion'                  => ['required'],
            'esta_activa'                  => ['required_if:tipo_convocatoria,1', 'nullable', 'boolean'],
            'year'                         => ['required', 'integer', 'max:' . date('Y') + 2],
            'lineas_programaticas_activas' => ['nullable', 'json'],
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
            'year' => date('Y', strtotime($this->year))
        ]);

        if (is_array($this->tipo_convocatoria)) {
            $this->merge([
                'tipo_convocatoria' => $this->tipo_convocatoria['value']
            ]);
        }

        if (is_array($this->lineas_programaticas_activas)) {
            $this->merge([
                'lineas_programaticas_activas' => json_encode($this->lineas_programaticas_activas)
            ]);
        }
    }
}
