<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreProyectoIdiTecnoacademiaRequest extends FormRequest
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
            'tecnoacademia_linea_tecnoacademia_id'      => ['required', 'array', 'exists:tecnoacademia_linea_tecnoacademia,id'],
            'tecnoacademia_id'                          => ['required', 'min:0', 'max:2147483647', 'integer', 'exists:tecnoacademias,id'],
            'semillero_investigacion_id'                => ['nullable', 'min:0', 'max:2147483647', 'integer', 'exists:semilleros_investigacion,id'],
            'proyecto_id'                               => ['nullable', 'min:0', 'max:2147483647', 'integer', 'exists:proyectos,id'],
            'titulo'                                    => ['required', 'string'],
            'fecha_inicio'                              => ['required', 'date', 'date_format:Y-m-d', 'before:fecha_finalizacion'],
            'fecha_finalizacion'                        => ['required', 'date', 'date_format:Y-m-d', 'after:fecha_inicio'],
            'resumen'                                   => ['required', 'string'],
            'palabras_clave'                            => ['required', 'json'],
            'especies'                                  => ['nullable', 'json'],
            'tiene_linea_investigacion'                 => ['required', 'boolean'],
            'lineas_investigacion'                      => ['required_if:tiene_linea_investigacion,1', 'nullable', 'json'],
            'proyecto_nuevo'                            => ['required', 'boolean'],
            'proyecto_con_continuidad'                  => ['required', 'boolean'],
            'productos_premios'                         => ['nullable', 'string'],
            'texto_exposicion'                          => ['required', 'string'],
            'resultados_obtenidos'                      => ['required', 'string'],
            'observaciones_resultados'                  => ['required', 'string'],
            'nombre_aprendices_vinculados'              => ['required', 'json'],
            'nombre_instituciones_educativas'           => ['nullable', 'json'],
            'programa_sennova_participante'             => ['required', 'array'],
            'programa_formacion_articulado_media'       => ['required', 'string', 'max:255'],
            'entidades_vinculadas'                      => ['nullable', 'json'],
            'fuente_recursos'                           => ['required', 'string', 'max:255'],
            'presupuesto'                               => ['required', 'numeric', 'min:0'],
            'hace_parte_de_semillero'                   => ['required', 'boolean'],
            'estado_proyecto'                           => ['required', 'integer', 'min:0', 'max:2147483647'],
            'poblacion_beneficiada'                     => ['required', 'string'],
            'otra_poblacion_beneficiada'                => ['nullable', 'string'],
            'nombre_centro_programa'                    => ['required', 'string', 'max:255'],
            'pdf_proyecto'                              => ['required', 'file', 'max:10000000', 'mimetypes:application/pdf'],
            'documentos_resultados'                     => ['nullable', 'file', 'max:10000000'],
            'municipios*'                               => ['required', 'integer', 'exists:municipios,id'],
            'beneficiados'                              => ['required', 'array'],
        ];
    }

    /**
     * Prepare the data for validation.
     *
     * @return void
     */
    protected function prepareForValidation()
    {
        if (is_array($this->tecnoacademia_id)) {
            $this->merge([
                'tecnoacademia_id' => $this->tecnoacademia_id['value'],
            ]);
        }

        if (is_array($this->semillero_investigacion_id)) {
            $this->merge([
                'semillero_investigacion_id' => $this->semillero_investigacion_id['value'],
            ]);
        }

        if (is_array($this->proyecto_id)) {
            $this->merge([
                'proyecto_id' => $this->proyecto_id['value'],
            ]);
        }

        if (is_array($this->estado_proyecto)) {
            $this->merge([
                'estado_proyecto' => $this->estado_proyecto['value'],
            ]);
        }

        if (is_array($this->programa_sennova_participante)) {
            if (isset($this->programa_sennova_participante['value']) && is_numeric($this->programa_sennova_participante['value'])) {
                $this->merge([
                    'programa_sennova_participante' => $this->programa_sennova_participante['value'],
                ]);
            } else {
                $programa_sennova_participante = [];
                foreach ($this->programa_sennova_participante as $programa) {
                    if (is_array($programa)) {
                        array_push($programa_sennova_participante, $programa['value']);
                    }
                }
                $this->merge(['programa_sennova_participante' => $programa_sennova_participante]);
            }
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

        if (is_array($this->tecnoacademia_linea_tecnoacademia_id)) {
            if (isset($this->tecnoacademia_linea_tecnoacademia_id['value']) && is_numeric($this->tecnoacademia_linea_tecnoacademia_id['value'])) {
                $this->merge([
                    'tecnoacademia_linea_tecnoacademia_id' => $this->tecnoacademia_linea_tecnoacademia_id['value'],
                ]);
            } else {
                $lineasTecnoacademiaRelacionados = [];
                foreach ($this->tecnoacademia_linea_tecnoacademia_id as $programaFormacion) {
                    if (is_array($programaFormacion)) {
                        array_push($lineasTecnoacademiaRelacionados, $programaFormacion['value']);
                    }
                }
                $this->merge(['tecnoacademia_linea_tecnoacademia_id' => $lineasTecnoacademiaRelacionados]);
            }
        }

        if (is_array($this->beneficiados)) {
            if (isset($this->beneficiados['value']) && is_numeric($this->beneficiados['value'])) {
                $this->merge([
                    'beneficiados' => $this->beneficiados['value'],
                ]);
            } else {
                $beneficiados = [];
                foreach ($this->beneficiados as $beneficiado) {
                    if (is_array($beneficiado)) {
                        array_push($beneficiados, $beneficiado['value']);
                    }
                }
                $this->merge(['beneficiados' => $beneficiados]);
            }
        }
    }
}
