<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SemilleroInvestigacionRequest extends FormRequest
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
        if ($this->isMethod('PUT')) {
            return [
                'es_semillero_tecnoacademia'                => ['required', 'min:0', 'max:3', 'integer'],
                'linea_investigacion_id'                    => ['required', 'min:0', 'max:2147483647999', 'integer', 'exists:lineas_investigacion,id'],
                'nombre'                                    => ['required', 'max:191'],
                'fecha_creacion_semillero'                  => ['required', 'date', 'date_format:Y-m-d'],
                'nombre_lider_semillero'                    => ['required', 'max:191'],
                'email_contacto'                            => ['required', 'max:191', 'email'],
                'reconocimientos_semillero_investigacion'   => ['required'],
                'vision'                                    => ['required'],
                'mision'                                    => ['required'],
                'objetivos_especificos'                     => ['required'],
                'objetivo_general'                          => ['required'],
                'link_semillero'                            => ['nullable', 'url', 'string'],
                'formato_gic_f_021'                         => ['nullable', 'file', 'max:10240'],
                'formato_gic_f_032'                         => ['nullable', 'file', 'max:10240'],
                'formato_aval_semillero'                    => ['nullable', 'file', 'max:10240'],
                'redes_conocimiento'                        => ['required'],
                'programas_formacion'                       => ['required'],
                'lineas_investigacion'                      => ['required'],
            ];
        } else {
            return [
                'es_semillero_tecnoacademia'                => ['required', 'min:0', 'max:3', 'integer'],
                'linea_investigacion_id'                    => ['required', 'min:0', 'max:2147483647999', 'integer', 'exists:lineas_investigacion,id'],
                'nombre'                                    => ['required', 'max:191'],
                'fecha_creacion_semillero'                  => ['required', 'date', 'date_format:Y-m-d'],
                'nombre_lider_semillero'                    => ['required', 'max:191'],
                'email_contacto'                            => ['required', 'max:191', 'email'],
                'reconocimientos_semillero_investigacion'   => ['required'],
                'vision'                                    => ['required'],
                'mision'                                    => ['required'],
                'objetivos_especificos'                     => ['required'],
                'objetivo_general'                          => ['required'],
                'link_semillero'                            => ['nullable', 'url', 'string'],
                'redes_conocimiento'                        => ['required'],
                'programas_formacion'                       => ['required'],
                'lineas_investigacion'                      => ['required'],
            ];
        }
    }

    /**
     * Prepare the data for validation.
     *
     * @return void
     */
    protected function prepareForValidation()
    {
        if (is_array($this->es_semillero_tecnoacademia)) {
            $this->merge([
                'es_semillero_tecnoacademia' => $this->es_semillero_tecnoacademia['value'],
            ]);
        }

        if (is_array($this->linea_investigacion_id)) {
            $this->merge([
                'linea_investigacion_id' => $this->linea_investigacion_id['value'],
            ]);
        }

        if (is_array($this->redes_conocimiento)) {
            if (isset($this->redes_conocimiento['value']) && is_numeric($this->redes_conocimiento['value'])) {
                $this->merge([
                    'redes_conocimiento' => $this->redes_conocimiento['value'],
                ]);
            } else {
                $redes_conocimiento = [];
                foreach ($this->redes_conocimiento as $red_conocimiento) {
                    if (is_array($red_conocimiento)) {
                        array_push($redes_conocimiento, $red_conocimiento['value']);
                    }
                }
                $this->merge(['redes_conocimiento' => $redes_conocimiento]);
            }
        }

        if (is_array($this->programas_formacion)) {
            if (isset($this->programas_formacion['value']) && is_numeric($this->programas_formacion['value'])) {
                $this->merge([
                    'programas_formacion' => $this->programas_formacion['value'],
                ]);
            } else {
                $programas_formacion = [];
                foreach ($this->programas_formacion as $programa_formacion) {
                    if (is_array($programa_formacion)) {
                        array_push($programas_formacion, $programa_formacion['value']);
                    }
                }
                $this->merge(['programas_formacion' => $programas_formacion]);
            }
        }

        if (is_array($this->lineas_investigacion)) {
            if (isset($this->lineas_investigacion['value']) && is_numeric($this->lineas_investigacion['value'])) {
                $this->merge([
                    'lineas_investigacion' => $this->lineas_investigacion['value'],
                ]);
            } else {
                $lineasInvestigacion = [];
                foreach ($this->lineas_investigacion as $lineaInvestigacion) {
                    if (is_array($lineaInvestigacion)) {
                        array_push($lineasInvestigacion, $lineaInvestigacion['value']);
                    }
                }
                $this->merge(['lineas_investigacion' => $lineasInvestigacion]);
            }
        }
    }
}
