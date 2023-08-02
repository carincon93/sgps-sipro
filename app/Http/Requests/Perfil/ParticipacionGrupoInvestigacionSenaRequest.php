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
            'user_id'                                   => ['required', 'min:0', 'max:2147483647', 'integer', 'exists:users,id'],
            'pertenece_grupo_investigacion_centro'      => ['required', 'boolean'],
            'pertenece_semillero_investigacion_centro'  => ['required', 'boolean'],
            'grupo_investigacion_id'                    => ['nullable', 'min:0', 'max:2147483647', 'integer', 'exists:grupos_investigacion,id'],
            'semillero_investigacion_id'                => ['nullable', 'min:0', 'max:2147483647', 'integer', 'exists:semilleros_investigacion,id'],
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
            'pertenece_grupo_investigacion_centro' => $this->pertenece_grupo_investigacion_centro == '1' ? 1 : 0,
        ]);

        $this->merge([
            'pertenece_semillero_investigacion_centro' => $this->pertenece_semillero_investigacion_centro == '1' ? 1 : 0,
        ]);
    }
}
