<?php

namespace App\Http\Requests;

use App\Rules\FechaFinalizacionProyecto;
use App\Rules\FechaInicioProyecto;
use App\Rules\MaxWords;
use Illuminate\Foundation\Http\FormRequest;

class ServicioTecnologicoRequest extends FormRequest
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
                'titulo'                                    => ['required', 'string', new MaxWords(40)],
                'fecha_inicio'                              => ['required', 'date', 'date_format:Y-m-d', 'before:fecha_finalizacion'],
                'fecha_finalizacion'                        => ['required', 'date', 'date_format:Y-m-d', 'after:fecha_inicio'],
                'max_meses_ejecucion'                       => ['required', 'numeric', 'min:1', 'max:12'],
                'pregunta_formulacion_problema'             => ['required', 'string', new MaxWords(50)],
                'programas_formacion*'                      => ['required', 'integer', 'min:0', 'max:2147483647', 'exists:programas_formacion,id'],
            ];
        } else {
            return [
                'tipo_proyecto_st_id'                       => ['required', 'min:0', 'max:2147483647', 'integer', 'exists:tipos_proyecto_st,id'],
                'estado_sistema_gestion_id'                 => ['required', 'min:0', 'max:2147483647', 'integer', 'exists:estados_sistema_gestion,id'],
                'titulo'                                    => ['required', 'string', new MaxWords(40)],
                'fecha_inicio'                              => ['required', 'date', 'date_format:Y-m-d', 'before:fecha_finalizacion'],
                'fecha_finalizacion'                        => ['required', 'date', 'date_format:Y-m-d', 'after:fecha_inicio'],
                'max_meses_ejecucion'                       => ['required', 'numeric', 'min:1', 'max:12'],
                'rol_sennova'                               => ['required', 'min:0', 'max:2147483647', 'integer'],
                'sector_productivo'                         => ['required', 'min:0', 'max:2147483647', 'integer'],
                'nombre_area_tecnica'                       => ['required', 'string', 'max:191']
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
        if (is_string($this->titulo)) {
            $this->merge([
                'titulo' => ucfirst(mb_strtolower($this->titulo)),
            ]);
        }

        if (is_array($this->tipo_proyecto_st_id)) {
            $this->merge([
                'tipo_proyecto_st_id' => $this->tipo_proyecto_st_id['value'],
            ]);
        }

        if (is_array($this->estado_sistema_gestion_id)) {
            $this->merge([
                'estado_sistema_gestion_id' => $this->estado_sistema_gestion_id['value'],
            ]);
        }

        if (is_array($this->sector_productivo)) {
            $this->merge([
                'sector_productivo' => $this->sector_productivo['value'],
            ]);
        }

        if (is_array($this->rol_sennova)) {
            $this->merge([
                'rol_sennova' => $this->rol_sennova['value'],
            ]);
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
    }
}
