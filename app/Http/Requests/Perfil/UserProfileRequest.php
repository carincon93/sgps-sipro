<?php

namespace App\Http\Requests\Perfil;

use App\Rules\Email;
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
            'nombre'                                => ['required', 'string', 'max:255'],
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
            'es_temporal_sennova'                   => ['nullable', 'boolean'],
            'fecha_resolucion_nombramiento'         => ['nullable', 'date_format:Y-m-d'],
            'fecha_acta_nombramiento'               => ['nullable', 'date_format:Y-m-d'],
            'nro_acta_nombramiento'                 => ['nullable', 'integer', 'min:0'],
            'grado_sennova'                         => ['nullable', 'integer', 'max:100'],
            'fecha_inicio_contrato'                 => ['required', 'date_format:Y-m-d', 'before:fecha_finalizacion_contrato'],
            'fecha_finalizacion_contrato'           => ['required', 'date_format:Y-m-d', 'after:fecha_inicio_contrato'],
            'asignacion_mensual'                    => ['required', 'integer', 'min:0'],
            'grupo_etnico'                          => ['nullable', 'integer'],
            'discapacidad'                          => ['nullable', 'integer'],
            'tiene_pasaporte_vigente'               => ['nullable', 'boolean'],
            'tiene_visa_vigente'                    => ['nullable', 'boolean'],
            'cvlac'                                 => ['nullable', 'string', 'max:255'],
            'link_sigep_ii'                         => ['nullable', 'string', 'max:255'],

            'experiencia_laboral_sena'              => ['required', 'integer', 'min:0'],
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
            'tiempo_por_rol'                        => ['required', 'json'],
            'roles_fuera_sennova'                   => ['nullable', 'json'],
            'red_conocimiento_id'                   => ['required', 'min:0', 'max:2147483647', 'integer', 'exists:redes_conocimiento,id'],
            'disciplina_subarea_conocimiento_id'    => ['required', 'min:0', 'max:2147483647', 'integer', 'exists:disciplinas_subarea_conocimiento,id'],

            'centro_formacion_id'                   => ['required', 'min:0', 'max:2147483647', 'integer', 'exists:centros_formacion,id'],
            'rol_sennova_id'                        => ['required', 'json'],
        ];
    }

    /**
     * Prepare the data for validation.
     *
     * @return void
     */
    protected function prepareForValidation()
    {
        if (is_array($this->tipo_documento)) {
            $this->merge([
                'tipo_documento' => $this->tipo_documento['value'],
            ]);
        }

        if (is_array($this->tipo_vinculacion)) {
            $this->merge([
                'tipo_vinculacion' => $this->tipo_vinculacion['value'],
            ]);
        }

        if (is_array($this->genero)) {
            $this->merge([
                'genero' => $this->genero['value'],
            ]);
        }

        if (is_array($this->nivel_ingles)) {
            $this->merge([
                'nivel_ingles' => $this->nivel_ingles['value'],
            ]);
        }

        if (is_array($this->grupo_etnico)) {
            $this->merge([
                'grupo_etnico' => $this->grupo_etnico['value'],
            ]);
        }

        if (is_array($this->discapacidad)) {
            $this->merge([
                'discapacidad' => $this->discapacidad['value'],
            ]);
        }

        if (is_array($this->es_temporal_sennova)) {
            $this->merge([
                'es_temporal_sennova' => $this->es_temporal_sennova['value'] == '1' ? 1 : 0,
            ]);
        }

        if (is_array($this->tiene_pasaporte_vigente)) {
            $this->merge([
                'tiene_pasaporte_vigente' => $this->tiene_pasaporte_vigente['value'] == '1' ? 1 : 0,
            ]);
        }

        if (is_array($this->tiene_visa_vigente)) {
            $this->merge([
                'tiene_visa_vigente' => $this->tiene_visa_vigente['value'] == '1' ? 1 : 0,
            ]);
        }

        if (is_array($this->centro_formacion_id)) {
            $this->merge([
                'centro_formacion_id' => $this->centro_formacion_id['value'],
            ]);
        }

        if (is_array($this->lugar_expedicion_id)) {
            $this->merge([
                'lugar_expedicion_id' => $this->lugar_expedicion_id['value'],
            ]);
        }

        if (is_array($this->red_conocimiento_id)) {
            $this->merge([
                'red_conocimiento_id' => $this->red_conocimiento_id['value'],
            ]);
        }

        if (is_array($this->disciplina_subarea_conocimiento_id)) {
            $this->merge([
                'disciplina_subarea_conocimiento_id' => $this->disciplina_subarea_conocimiento_id['value'],
            ]);
        }

        if (is_array($this->cursos_evaluacion_proyectos)) {
            $this->merge([
                'cursos_evaluacion_proyectos' => $this->cursos_evaluacion_proyectos['value'] == '1' ? 1 : 0,
            ]);
        }

        if (is_array($this->experiencia_como_evaluador)) {
            $this->merge([
                'experiencia_como_evaluador' => $this->experiencia_como_evaluador['value'] == '1' ? 1 : 0,
            ]);
        }

        if (is_array($this->participacion_como_evaluador_sennova)) {
            $this->merge([
                'participacion_como_evaluador_sennova' => $this->participacion_como_evaluador_sennova['value'] == '1' ? 1 : 0,
            ]);
        }

        if (is_array($this->conocimiento_iso_17025)) {
            $this->merge([
                'conocimiento_iso_17025' => $this->conocimiento_iso_17025['value'] == '1' ? 1 : 0,
            ]);
        }

        if (is_array($this->conocimiento_iso_19011)) {
            $this->merge([
                'conocimiento_iso_19011' => $this->conocimiento_iso_19011['value'] == '1' ? 1 : 0,
            ]);
        }

        if (is_array($this->conocimiento_iso_29119)) {
            $this->merge([
                'conocimiento_iso_29119' => $this->conocimiento_iso_29119['value'] == '1' ? 1 : 0,
            ]);
        }

        if (is_array($this->conocimiento_iso_9001)) {
            $this->merge([
                'conocimiento_iso_9001' => $this->conocimiento_iso_9001['value'] == '1' ? 1 : 0,
            ]);
        }

        if (is_array($this->experiencia_metodos_ensayo)) {
            $this->merge([
                'experiencia_metodos_ensayo' => $this->experiencia_metodos_ensayo['value'] == '1' ? 1 : 0,
            ]);
        }

        if (is_array($this->experiencia_metodos_calibracion)) {
            $this->merge([
                'experiencia_metodos_calibracion' => $this->experiencia_metodos_calibracion['value'] == '1' ? 1 : 0,
            ]);
        }

        if (is_array($this->experiencia_minima_metodos)) {
            $this->merge([
                'experiencia_minima_metodos' => $this->experiencia_minima_metodos['value'] == '1' ? 1 : 0,
            ]);
        }

        if (is_array($this->informacion_completa)) {
            $this->merge([
                'informacion_completa' => $this->informacion_completa['value'] == '1' ? 1 : 0,
            ]);
        }

        if (is_array($this->rol_sennova_id)) {
            if (isset($this->rol_sennova_id['value']) && is_numeric($this->rol_sennova_id['value'])) {
                $this->merge([
                    'rol_sennova_id' => $this->rol_sennova_id['value'],
                ]);
            } else {
                $rolesSennova = [];
                foreach ($this->rol_sennova_id as $rolSennova) {
                    if (is_array($rolSennova)) {
                        array_push($rolesSennova, $rolSennova['value']);
                    }
                }
                $this->merge(['rol_sennova_id' => json_encode($rolesSennova)]);
            }
        }
    }
}
