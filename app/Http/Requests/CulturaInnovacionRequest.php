<?php

namespace App\Http\Requests;

use App\Rules\FechaFinalizacionProyecto;
use App\Rules\FechaInicioProyecto;
use App\Rules\MaxWords;
use Illuminate\Foundation\Http\FormRequest;

class CulturaInnovacionRequest extends FormRequest
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
                'tipo_proyecto'                             => ['required', 'min:1', 'max:2', 'integer'],
                'tipo_evento'                               => ['nullable', 'min:1', 'max:3', 'integer'],
                'centro_formacion_id'                       => ['required', 'min:0', 'max:2147483647', 'integer', 'exists:centros_formacion,id'],
                'linea_programatica_id'                     => ['required', 'min:0', 'max:2147483647', 'integer', 'exists:lineas_programaticas,id'],
                'linea_investigacion_id'                    => ['required', 'min:0', 'max:2147483647', 'integer', 'exists:lineas_investigacion,id'],
                'area_conocimiento_id'                      => ['required', 'min:0', 'max:2147483647', 'integer', 'exists:areas_conocimiento,id'],
                'tematica_estrategica_id'                   => ['required', 'min:0', 'max:2147483647', 'integer', 'exists:tematicas_estrategicas,id'],
                'actividad_economica_id'                    => ['required', 'min:0', 'max:2147483647', 'integer', 'exists:actividades_economicas,id'],
                'titulo'                                    => ['required', 'string', new MaxWords(20)],
                'fecha_inicio'                              => ['required', 'date', 'date_format:Y-m-d', 'before:fecha_finalizacion'],
                'fecha_finalizacion'                        => ['required', 'date', 'date_format:Y-m-d', 'after:fecha_inicio'],
                'max_meses_ejecucion'                       => ['required', 'numeric', 'min:1', 'max:12'],
                'video'                                     => ['nullable', 'string', 'url'],
                'muestreo'                                  => ['required', 'max:191'],
                'actividades_muestreo'                      => ['nullable', 'max:191'],
                'objetivo_muestreo'                         => ['nullable', 'max:191'],
                'recoleccion_especimenes'                   => ['required', 'min:1', 'max:2', 'integer'],
                'numero_aprendices'                         => ['required', 'min:0', 'max:9223372036854775807', 'integer'],
                'municipios*'                               => ['required', 'integer', 'min:0', 'max:2147483647', 'exists:municipios,id'],
                'programas_formacion*'                      => ['required', 'integer', 'min:0', 'max:2147483647', 'exists:programas_formacion,id'],
                'programas_formacion_articulados*'          => ['nullable', 'integer', 'min:0', 'max:2147483647', 'exists:programas_formacion,id'],
                'relacionado_plan_tecnologico'              => ['required', 'min:0', 'max:3', 'integer'],
                'relacionado_agendas_competitividad'        => ['required', 'min:0', 'max:3', 'integer'],
                'relacionado_mesas_sectoriales'             => ['required', 'min:0', 'max:3', 'integer'],
                'relacionado_tecnoacademia'                 => ['required', 'min:0', 'max:3', 'integer'],
                'mesa_sectorial_id*'                        => ['required_if:relacionado_mesas_sectoriales,1', 'min:0', 'max:2147483647', 'exists:mesas_sectoriales,id'],
                'linea_tecnologica_id*'                     => ['required_if:relacionado_tecnoacademia,1', 'min:0', 'max:2147483647', 'exists:lineas_tecnoacademia,id']
            ];
        } else {
            return [
                'tipo_proyecto'                             => ['required', 'min:1', 'max:2', 'integer'],
                'tipo_evento'                               => ['nullable', 'min:1', 'max:3', 'integer'],
                'centro_formacion_id'                       => ['required', 'min:0', 'max:2147483647', 'integer', 'exists:centros_formacion,id'],
                'linea_programatica_id'                     => ['required', 'min:0', 'max:2147483647', 'integer', 'exists:lineas_programaticas,id'],
                'linea_investigacion_id'                    => ['required', 'min:0', 'max:2147483647', 'integer', 'exists:lineas_investigacion,id'],
                'area_conocimiento_id'                      => ['required', 'min:0', 'max:2147483647', 'integer', 'exists:areas_conocimiento,id'],
                'tematica_estrategica_id'                   => ['required', 'min:0', 'max:2147483647', 'integer', 'exists:tematicas_estrategicas,id'],
                'titulo'                                    => ['required', 'string', new MaxWords(20)],
                'fecha_inicio'                              => ['required', 'date', 'date_format:Y-m-d', 'before:fecha_finalizacion'],
                'fecha_finalizacion'                        => ['required', 'date', 'date_format:Y-m-d', 'after:fecha_inicio'],
                'max_meses_ejecucion'                       => ['required', 'numeric', 'min:1', 'max:12'],
                'actividad_economica_id'                    => ['required', 'min:0', 'max:2147483647', 'integer', 'exists:actividades_economicas,id'],
                'rol_sennova'                               => ['required', 'min:0', 'max:2147483647', 'integer', 'exists:roles_sennova,id'],
                'cantidad_horas'                            => ['required', 'numeric', 'min:1', 'max:168'],
                'cantidad_meses'                            => ['required', 'numeric', 'min:1', 'max:12'],
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
        if (is_array($this->tipo_proyecto)) {
            $this->merge([
                'tipo_proyecto' => $this->tipo_proyecto['value'],
            ]);
        }

        if (is_array($this->actividad_economica_id)) {
            $this->merge([
                'actividad_economica_id' => $this->actividad_economica_id['value'],
            ]);
        }

        if (is_array($this->area_conocimiento_id)) {
            $this->merge([
                'area_conocimiento_id' => $this->area_conocimiento_id['value'],
            ]);
        }

        if (is_array($this->linea_investigacion_id)) {
            $this->merge([
                'linea_investigacion_id' => $this->linea_investigacion_id['value'],
            ]);
        }

        if (is_array($this->linea_programatica_id)) {
            $this->merge([
                'linea_programatica_id' => $this->linea_programatica_id['value'],
            ]);
        }

        if (is_array($this->tematica_estrategica_id)) {
            $this->merge([
                'tematica_estrategica_id' => $this->tematica_estrategica_id['value'],
            ]);
        }

        if (is_array($this->tipo_evento)) {
            $this->merge([
                'tipo_evento' => $this->tipo_evento['value'],
            ]);
        }

        if (is_string($this->titulo)) {
            $this->merge([
                'titulo' => ucfirst(mb_strtolower($this->titulo)),
            ]);
        }

        if (is_array($this->centro_formacion_id)) {
            $this->merge([
                'centro_formacion_id' => $this->centro_formacion_id['value'],
            ]);
        }

        if (is_array($this->rol_sennova)) {
            $this->merge([
                'rol_sennova' => $this->rol_sennova['value'],
            ]);
        }

        if (is_array($this->recoleccion_especimenes)) {
            $this->merge([
                'recoleccion_especimenes' => $this->recoleccion_especimenes['value'],
            ]);
        }

        if (is_array($this->relacionado_plan_tecnologico)) {
            $this->merge([
                'relacionado_plan_tecnologico' => $this->relacionado_plan_tecnologico['value'],
            ]);
        }

        if (is_array($this->relacionado_agendas_competitividad)) {
            $this->merge([
                'relacionado_agendas_competitividad' => $this->relacionado_agendas_competitividad['value'],
            ]);
        }

        if (is_array($this->relacionado_mesas_sectoriales)) {
            $this->merge([
                'relacionado_mesas_sectoriales' => $this->relacionado_mesas_sectoriales['value'],
            ]);
        }

        if (is_array($this->relacionado_tecnoacademia)) {
            $this->merge([
                'relacionado_tecnoacademia' => $this->relacionado_tecnoacademia['value'],
            ]);
        }

        if (is_array($this->municipios)) {
            if (isset($this->municipios['value']) && is_numeric($this->municipios['value'])) {
                $this->merge([
                    'municipios' => $this->municipios['value'],
                ]);
            } else {
                $municipios = [];
                foreach ($this->municipios as $municipio) {
                    if (is_array($municipio)) {
                        array_push($municipios, $municipio['value']);
                    }
                }
                $this->merge(['municipios' => $municipios]);
            }
        }

        if (is_array($this->programas_formacion)) {
            if (isset($this->programas_formacion['value']) && is_numeric($this->programas_formacion['value'])) {
                $this->merge([
                    'programas_formacion' => $this->programas_formacion['value'],
                ]);
            } else {
                $programasFormacion = [];
                foreach ($this->programas_formacion as $programaFormacion) {
                    if (is_array($programaFormacion)) {
                        array_push($programasFormacion, $programaFormacion['value']);
                    }
                }
                $this->merge(['programas_formacion' => $programasFormacion]);
            }
        }

        if (is_array($this->programas_formacion_articulados)) {
            if (isset($this->programas_formacion_articulados['value']) && is_numeric($this->programas_formacion_articulados['value'])) {
                $this->merge([
                    'programas_formacion_articulados' => $this->programas_formacion_articulados['value'],
                ]);
            } else {
                $programasFormacionArticulados = [];
                foreach ($this->programas_formacion_articulados as $programaFormacion) {
                    if (is_array($programaFormacion)) {
                        array_push($programasFormacionArticulados, $programaFormacion['value']);
                    }
                }
                $this->merge(['programas_formacion_articulados' => $programasFormacionArticulados]);
            }
        }
    }
}
