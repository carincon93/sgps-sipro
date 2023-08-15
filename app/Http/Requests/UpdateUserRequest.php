<?php

namespace App\Http\Requests;

use App\Models\User;
use App\Rules\Email;
use App\Rules\ValidUtf8;
use Illuminate\Foundation\Http\FormRequest;

class UpdateUserRequest extends FormRequest
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
            'user_id'                               => ['required', 'min:0', 'max:2147483647', 'integer', 'exists:users,id'],
            'centro_formacion_id'                   => ['required', 'min:0', 'max:2147483647', 'integer', 'exists:centros_formacion,id'],
            'nombre'                                => ['required', 'max:255', 'string'],
            'email'                                 => ['required', 'max:255', new Email, 'email', 'unique:users,email,' . $this->route('user')->id . ',id'],
            'tipo_documento'                        => ['required', 'max:2'],
            'numero_documento'                      => ['required', 'min:0', 'min:0', 'max:2147483647', 'integer', 'unique:users,numero_documento,' . $this->route('user')->id . ',id'],
            'lugar_expedicion_id'                   => ['required', 'min:0', 'min:0', 'max:2147483647', 'integer', 'exists:municipios,id'],
            'numero_celular'                        => ['required', 'min:0', 'min:0', 'max:3999999999', 'integer'],
            'fecha_nacimiento'                      => ['required', 'date'],
            'genero'                                => ['required', 'integer', 'min:0', 'max:99'],
            'tipo_vinculacion'                      => ['required', 'max:191'],
            'autorizacion_datos'                    => ['required', 'boolean'],
            'horas_dedicadas'                       => ['nullable', 'integer', 'min:0', 'max:32767'],
            'meses_dedicados'                       => ['nullable', 'integer', 'min:0', 'max:32767'],
            'nivel_ingles'                          => ['nullable', 'integer', 'min:0', 'max:99'],
            'fecha_resolucion_nombramiento'         => ['nullable', 'date_format:Y-m-d'],
            'fecha_acta_nombramiento'               => ['nullable', 'date_format:Y-m-d'],
            'nro_acta_nombramiento'                 => ['nullable', 'integer', 'min:0', 'max:9999999999'],
            'fecha_inicio_contrato'                 => ['nullable', 'date_format:Y-m-d', 'before:fecha_finalizacion_contrato'],
            'fecha_finalizacion_contrato'           => ['nullable', 'date_format:Y-m-d', 'after:fecha_inicio_contrato'],
            'asignacion_mensual'                    => ['nullable', 'integer', 'min:0', 'max:2147483647'],
            'grupo_etnico'                          => ['nullable', 'integer', 'min:0', 'max:99'],
            'discapacidad'                          => ['nullable', 'integer', 'min:0', 'max:99'],
            'cvlac'                                 => ['nullable', 'string', 'max:255'],
            'link_sigep_ii'                         => ['nullable', 'string', 'max:255'],
            'experiencia_laboral_sena'              => ['nullable', 'integer', 'min:0', 'max:32767'],
            'cursos_evaluacion_proyectos'           => ['nullable', 'boolean'],
            'cursos_de_evaluacion_realizados'       => ['nullable', 'json'],
            'experiencia_como_evaluador'            => ['nullable', 'boolean'],
            'numero_proyectos_evaluados'            => ['nullable', 'integer', 'min:0', 'max:32767'],
            'participacion_como_evaluador_sennova'  => ['nullable', 'boolean'],
            'conocimiento_iso_17025'                => ['nullable', 'boolean'],
            'conocimiento_iso_19011'                => ['nullable', 'boolean'],
            'conocimiento_iso_29119'                => ['nullable', 'boolean'],
            'conocimiento_iso_9001'                 => ['nullable', 'boolean'],
            'experiencia_metodos_ensayo'            => ['nullable', 'boolean'],
            'meses_experiencia_metodos_ensayo'      => ['nullable', 'integer', 'min:0', 'max:32767'],
            'experiencia_metodos_calibracion'       => ['nullable', 'boolean'],
            'meses_experiencia_metodos_calibracion' => ['nullable', 'integer', 'min:0', 'max:32767'],
            'red_conocimiento_id'                   => ['nullable', 'min:0', 'max:2147483647', 'integer', 'exists:redes_conocimiento,id'],
            'experiencia_minima_metodos'            => ['nullable', 'boolean'],
            'informacion_completa'                  => ['nullable', 'boolean'],
            'tiempo_por_rol'                        => ['nullable', 'json'],
            'roles_fuera_sennova'                   => ['nullable', 'json'],
            'disciplinas_subarea_conocimiento'      => ['nullable', 'json'],
            'subarea_experiencia_laboral'           => ['nullable', 'integer', 'min:0', 'max:99'],
            'otros_roles_sennova'                   => ['nullable', 'json'],
            'rol_sennova_id'                        => ['nullable', 'min:0', 'max:2147483647', 'integer', 'exists:roles_sennova,id'],
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
            'asignacion_mensual'                    => (int) $this->asignacion_mensual,
        ]);

        if ($this->default_password) {
            $this->merge(['password' => User::makePassword($this->numero_documento)]);
        }
    }
}
