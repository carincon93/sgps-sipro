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
            'user_id'                           => ['required', 'min:0', 'max:2147483647', 'integer', 'exists:users,id'],
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
        $this->merge([
            'ha_formulado_proyectos_sennova' => $this->ha_formulado_proyectos_sennova == '1' ? 1 : 0,
        ]);

    }
}
