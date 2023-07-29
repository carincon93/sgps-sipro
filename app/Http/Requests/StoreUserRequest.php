<?php

namespace App\Http\Requests;

use App\Models\User;
use App\Rules\Email;
use Illuminate\Foundation\Http\FormRequest;

class StoreUserRequest extends FormRequest
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
            'centro_formacion_id'   => ['required', 'min:0', 'max:2147483647', 'integer', 'exists:centros_formacion,id'],
            'nombre'                => ['required', 'max:255', 'string'],
            'email'                 => ['required', 'max:255', new Email, 'unique:users,email', 'email'],
            'tipo_documento'        => ['required', 'max:2'],
            'numero_documento'      => ['required', 'min:55555', 'unique:users,numero_documento', 'max:9223372036854775807', 'integer'],
            'numero_celular'        => ['required', 'min:0', 'max:9223372036854775807', 'integer'],
            'tipo_vinculacion'      => ['required', 'max:191'],
            'autorizacion_datos'    => ['required', 'boolean'],
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
            'nombre'                                => mb_strtolower($this->nombre),
            'email'                                 => mb_strtolower($this->email),
            'password'                              => User::makePassword($this->numero_documento),
            'habilitado'                            => true,
            'cursos_de_evaluacion_realizados'       => json_encode($this->cursos_de_evaluacion_realizados),
            'tiempo_por_rol'                        => json_encode($this->tiempo_por_rol),
            'roles_fuera_sennova'                   => json_encode($this->roles_fuera_sennova),
            'otros_roles_sennova'                   => json_encode($this->otros_roles_sennova),
            'disciplinas_subarea_conocimiento'      => json_encode($this->disciplinas_subarea_conocimiento),
            'informacion_completa'                  => $this->informacion_completa == '1' ? 1 : 0,
            'cursos_evaluacion_proyectos'           => $this->cursos_evaluacion_proyectos == '1' ? 1 : 0,
            'experiencia_como_evaluador'            => $this->experiencia_como_evaluador == '1' ? 1 : 0,
            'participacion_como_evaluador_sennova'  => $this->participacion_como_evaluador_sennova == '1' ? 1 : 0,
            'conocimiento_iso_17025'                => $this->conocimiento_iso_17025 == '1' ? 1 : 0,
            'conocimiento_iso_19011'                => $this->conocimiento_iso_19011 == '1' ? 1 : 0,
            'conocimiento_iso_29119'                => $this->conocimiento_iso_29119 == '1' ? 1 : 0,
            'conocimiento_iso_9001'                 => $this->conocimiento_iso_9001 == '1' ? 1 : 0,
            'experiencia_metodos_ensayo'            => $this->experiencia_metodos_ensayo == '1' ? 1 : 0,
            'experiencia_metodos_calibracion'       => $this->experiencia_metodos_calibracion == '1' ? 1 : 0,
            'experiencia_minima_metodos'            => $this->experiencia_minima_metodos == '1' ? 1 : 0,
        ]);
    }
}
