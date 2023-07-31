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
        if ($this->isMethod('PUT')) {
            return [
                'descripcion'                   => ['required'],
                'esta_activa'                   => ['required_if:tipo_convocatoria,1', 'nullable', 'boolean'],
                'year'                          => ['required', 'integer', 'max:' . date('Y') + 2],
                'fase'                          => ['required', 'integer'],
                'lineas_programaticas_activas'  => ['nullable', 'json'],
                'visible'                       => ['nullable', 'boolean'],
                'fecha_finalizacion_fase'       => ['required', 'date'],
                'hora_finalizacion_fase'        => ['required'],
            ];
        } else {
            return [
                'descripcion'                   => ['required'],
                'esta_activa'                   => ['required_if:tipo_convocatoria,1', 'nullable', 'boolean'],
                'year'                          => ['required', 'integer', 'max:' . date('Y') + 2],
                'fase'                          => ['required', 'integer'],
                'lineas_programaticas_activas'  => ['nullable', 'json'],
                'visible'                       => ['nullable', 'boolean'],
                'fecha_finalizacion_fase'       => ['required', 'date'],
                'hora_finalizacion_fase'        => ['required'],
                'tipo_convocatoria'             => ['required', 'integer'],
                'convocatoria_id'               => ['required', 'min:0', 'max:2147483647', 'integer', 'exists:convocatorias,id'],
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
        $this->merge([
            'fase'                         => 1,
            'lineas_programaticas_activas' => json_encode($this->lineas_programaticas_activas)
        ]);
    }
}
