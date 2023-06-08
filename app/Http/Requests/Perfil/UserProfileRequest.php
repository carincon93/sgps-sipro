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
            'nombre'                        => ['required', 'string', 'max:255'],
            'email'                         => ['required', 'max:255', new Email, 'email', 'unique:users,email,' . auth()->user()->id . ',id'],
            'tipo_documento'                => ['required', 'max:2'],
            'tipo_vinculacion'              => ['required', 'max:191'],
            'numero_documento'              => ['required', 'min:55555', 'max:9999999999999', 'integer', 'unique:users,numero_documento,' . auth()->user()->id . ',id'],
            'numero_celular'                => ['required', 'min:0', 'max:9999999999', 'integer'],
            'autorizacion_datos'            => ['nullable', 'boolean'],
            'lugar_expedicion_id'           => ['required', 'min:0', 'max:2147483647', 'integer', 'exists:municipios,id'],
            'fecha_nacimiento'              => ['required', 'date'],
            'genero'                        => ['required', 'integer'],
            'tipo_vinculacion'              => ['nullable', 'integer'],
            'horas_dedicadas'               => ['nullable', 'integer', 'min:0'],
            'meses_dedicados'               => ['nullable', 'integer', 'min:0'],
            'nivel_ingles'                  => ['nullable', 'integer', 'min:0'],
            'es_temporal_sennova'           => ['nullable', 'boolean'],
            'fecha_resolucion_nombramiento' => ['nullable', 'date_format:Y-m-d'],
            'fecha_acta_nombramiento'       => ['nullable', 'date_format:Y-m-d'],
            'nro_acta_nombramiento'         => ['nullable', 'integer', 'min:0'],
            'grado_sennova'                 => ['nullable', 'integer', 'max:100'],
            'fecha_inicio_contrato'         => ['nullable', 'date_format:Y-m-d', 'before:fecha_finalizacion_contrato'],
            'fecha_finalizacion_contrato'   => ['nullable', 'date_format:Y-m-d', 'after:fecha_inicio_contrato'],
            'asignacion_mensual'            => ['nullable', 'integer', 'min:0'],
            'grupo_etnico'                  => ['nullable', 'integer'],
            'discapacidad'                  => ['nullable', 'integer'],
            'tiene_pasaporte_vigente'       => ['nullable', 'boolean'],
            'tiene_visa_vigente'            => ['nullable', 'boolean'],
            'cvlac'                         => ['nullable', 'string', 'max:255'],
            'link_sigep_ii'                 => ['nullable', 'string', 'max:255'],
            'centro_formacion_id'           => ['required', 'min:0', 'max:2147483647', 'integer', 'exists:centros_formacion,id'],
            'rol_sennova_id'                => ['required', 'json'],
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
