<?php

namespace App\Http\Requests\Perfil;

use Illuminate\Foundation\Http\FormRequest;

class ParticipacionProyectoSennovaRequest extends FormRequest
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
            'ha_formulado_proyectos_sennova'    => ['required', 'boolean'],
            'tipo_proyecto'                     => ['nullable', 'required_if:ha_formulado_proyectos_sennova,true', 'integer', 'min:1', 'max:9'],
            'fecha_inicio_proyecto'             => ['nullable', 'required_if:ha_formulado_proyectos_sennova,true', 'date_format:Y-m-d'],
            'fecha_finalizacion_proyecto'       => ['nullable', 'required_if:ha_formulado_proyectos_sennova,true', 'date_format:Y-m-d'],
            'titulo'                            => ['nullable', 'required_if:ha_formulado_proyectos_sennova,true', 'string'],
            'codigo_proyecto'                   => ['nullable', 'required_if:ha_formulado_proyectos_sennova,true', 'string', 'max:20'],
        ];
    }

    /**
     * Prepare the data for validation.
     *
     * @return void
     */
    protected function prepareForValidation()
    {
        if (is_array($this->ha_formulado_proyectos_sennova)) {
            $this->merge([
                'ha_formulado_proyectos_sennova' => $this->ha_formulado_proyectos_sennova['value'] == '1' ? 1 : 0,
            ]);
        }

        if (is_array($this->tipo_proyecto)) {
            $this->merge([
                'tipo_proyecto' => $this->tipo_proyecto['value'],
            ]);
        }
    }
}
