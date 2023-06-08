<?php

namespace App\Http\Requests\Perfil;

use Illuminate\Foundation\Http\FormRequest;

class ParticipacionGrupoInvestigacionSenaRequest extends FormRequest
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
            'pertenece_grupo_investigacion_centro'      => ['required', 'boolean'],
            'pertenece_semillero_investigacion_centro'  => ['required', 'boolean'],
            'grupo_investigacion_id'                    => ['required', 'min:0', 'max:2147483647', 'integer', 'exists:grupos_investigacion,id'],
            'semillero_investigacion_id'                => ['required', 'min:0', 'max:2147483647', 'integer', 'exists:semilleros_investigacion,id'],
        ];
    }

    /**
     * Prepare the data for validation.
     *
     * @return void
     */
    protected function prepareForValidation()
    {
        if (is_array($this->pertenece_grupo_investigacion_centro)) {
            $this->merge([
                'pertenece_grupo_investigacion_centro' => $this->pertenece_grupo_investigacion_centro['value'] == '1' ? 1 : 0,
            ]);
        }

        if (is_array($this->pertenece_semillero_investigacion_centro)) {
            $this->merge([
                'pertenece_semillero_investigacion_centro' => $this->pertenece_semillero_investigacion_centro['value'] == '1' ? 1 : 0,
            ]);
        }

        if (is_array($this->grupo_investigacion_id)) {
            $this->merge([
                'grupo_investigacion_id' => $this->grupo_investigacion_id['value'],
            ]);
        }

        if (is_array($this->semillero_investigacion_id)) {
            $this->merge([
                'semillero_investigacion_id' => $this->semillero_investigacion_id['value'],
            ]);
        }
    }
}
