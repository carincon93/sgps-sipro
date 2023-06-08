<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ConvocatoriaRolSennovaRequest extends FormRequest
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
            'linea_programatica_id' => ['required', 'min:0', 'max:2147483647', 'integer', 'exists:lineas_programaticas,id'],
            'rol_sennova_id'        => ['required', 'min:0', 'max:2147483647', 'integer', 'exists:roles_sennova,id'],
            'asignacion_mensual'    => ['required', 'min:0', 'max:2147483647'],
            'nivel_academico'       => ['required', 'integer', 'min:0', 'max:2147483647'],
            'experiencia'           => ['nullable', 'string'],
            'perfil'                => ['nullable', 'string'],
            'mensaje'               => ['nullable', 'string'],
        ];
    }

    /**
     * Prepare the data for validation.
     *
     * @return void
     */
    protected function prepareForValidation()
    {
        if (is_array($this->linea_programatica_id)) {
            $this->merge([
                'linea_programatica_id' => $this->linea_programatica_id['value'],
            ]);
        }

        if (is_array($this->rol_sennova_id)) {
            $this->merge([
                'rol_sennova_id' => $this->rol_sennova_id['value'],
            ]);
        }

        if (is_array($this->nivel_academico)) {
            $this->merge([
                'nivel_academico' => $this->nivel_academico['value'],
            ]);
        }
    }
}
