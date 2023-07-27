<?php

namespace App\Http\Requests\Perfil;

use Illuminate\Foundation\Http\FormRequest;

class FormacionAcademicaSenaRequest extends FormRequest
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
            'egresado_sena'                 => ['required', 'boolean'],
            'modalidad_sena'                => ['required', 'integer', 'min:0', 'max:9'],
            'nivel_sena'                    => ['required', 'integer', 'min:0', 'max:9'],
            'titulo_obtenido'               => ['required', 'string', 'max:255'],
            'fecha_inicio_formacion'        => ['required', 'before:fecha_finalizacion_formacion'],
            'fecha_finalizacion_formacion'  => ['required', 'after:fecha_inicio_formacion'],
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
            'egresado_sena' => $this->egresado_sena == '1' ? 1 : 0,
        ]);
    }
}
