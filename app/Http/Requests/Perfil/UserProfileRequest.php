<?php

namespace App\Http\Requests\Perfil;

use App\Rules\Email;
use App\Rules\ValidUtf8;
use Illuminate\Foundation\Http\FormRequest;

class UserProfileRequest extends FormRequest
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
            'nombre'                                => ['required', 'string', 'max:255', new ValidUtf8],
            'email'                                 => ['required', 'max:255', new Email, 'email', 'unique:users,email,' . auth()->user()->id . ',id'],
            'tipo_documento'                        => ['required', 'max:2'],
            'tipo_vinculacion'                      => ['required', 'max:191'],
            'numero_documento'                      => ['required', 'min:55555', 'max:9999999999999', 'integer', 'unique:users,numero_documento,' . auth()->user()->id . ',id'],
            'numero_celular'                        => ['required', 'min:0', 'max:9999999999', 'integer'],
            'autorizacion_datos'                    => ['nullable', 'boolean'],
            'lugar_expedicion_id'                   => ['required', 'min:0', 'max:2147483647', 'integer', 'exists:municipios,id'],
            'fecha_nacimiento'                      => ['required', 'date'],
            'genero'                                => ['required', 'integer'],
            'tipo_vinculacion'                      => ['nullable', 'integer'],
            'horas_dedicadas'                       => ['nullable', 'integer', 'min:0'],
            'meses_dedicados'                       => ['nullable', 'integer', 'min:0'],
            'nivel_ingles'                          => ['nullable', 'integer', 'min:0'],
            'fecha_resolucion_nombramiento'         => ['nullable', 'date_format:Y-m-d'],
            'fecha_acta_nombramiento'               => ['nullable', 'date_format:Y-m-d'],
            'nro_acta_nombramiento'                 => ['nullable', 'integer', 'min:0'],
            'fecha_inicio_contrato'                 => ['nullable', 'date_format:Y-m-d', 'before:fecha_finalizacion_contrato'],
            'fecha_finalizacion_contrato'           => ['nullable', 'date_format:Y-m-d', 'after:fecha_inicio_contrato'],
            'asignacion_mensual'                    => ['nullable', 'integer', 'min:0'],
            'grupo_etnico'                          => ['nullable', 'integer'],
            'discapacidad'                          => ['nullable', 'integer'],
            'subarea_experiencia_laboral'           => ['nullable', 'integer'],
            'tiene_pasaporte_vigente'               => ['nullable', 'boolean'],
            'tiene_visa_vigente'                    => ['nullable', 'boolean'],
            'cvlac'                                 => ['nullable', 'string', 'max:255'],
            'link_sigep_ii'                         => ['nullable', 'string', 'max:255'],

            'experiencia_laboral_sena'              => ['nullable', 'integer', 'min:0'],
            'cursos_evaluacion_proyectos'           => ['nullable', 'boolean'],
            'cursos_de_evaluacion_realizados'       => ['nullable', 'json'],
            'experiencia_como_evaluador'            => ['nullable', 'boolean'],
            'numero_proyectos_evaluados'            => ['nullable', 'integer', 'min:0'],
            'participacion_como_evaluador_sennova'  => ['nullable', 'boolean'],
            'conocimiento_iso_17025'                => ['nullable', 'boolean'],
            'conocimiento_iso_19011'                => ['nullable', 'boolean'],
            'conocimiento_iso_29119'                => ['nullable', 'boolean'],
            'conocimiento_iso_9001'                 => ['nullable', 'boolean'],
            'experiencia_metodos_ensayo'            => ['nullable', 'boolean'],
            'meses_experiencia_metodos_ensayo'      => ['nullable', 'integer', 'min:0'],
            'experiencia_metodos_calibracion'       => ['nullable', 'boolean'],
            'meses_experiencia_metodos_calibracion' => ['nullable', 'integer', 'min:0'],
            'experiencia_minima_metodos'            => ['nullable', 'boolean'],
            'autorizacion_datos'                    => ['nullable', 'boolean'],
            'informacion_completa'                  => ['nullable', 'boolean'],
            'tiempo_por_rol'                        => ['nullable', 'json'],
            'roles_fuera_sennova'                   => ['nullable', 'json'],
            'red_conocimiento_id'                   => ['nullable', 'min:0', 'max:2147483647', 'integer', 'exists:redes_conocimiento,id'],
            'disciplinas_subarea_conocimiento'      => ['nullable', 'json'],

            'centro_formacion_id'                   => ['required', 'min:0', 'max:2147483647', 'integer', 'exists:centros_formacion,id'],
            'rol_sennova_id'                        => ['nullable', 'min:0', 'max:2147483647', 'integer', 'exists:roles_sennova,id'],
            'otros_roles_sennova'                   => ['nullable', 'json'],
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
            'informacion_completa'                  => $this->informacion_completa == '1' ? 1 : 0,
            'asignacion_mensual'                    => (int) $this->asignacion_mensual,
        ]);
    }
}
