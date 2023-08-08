<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class MetodologiaColumnRequest extends FormRequest
{

    private $columnsRules = [
        'articulacion_centro_formacion'             => ['required', 'string'],
        'lineas_medulares_centro'                   => ['nullable', 'string'],
        'articulacion_programas_centro'             => ['nullable', 'string'],
        'articulacion_bienestar_aprendiz'           => ['nullable', 'string'],
        'favorecimiento_ruta_formacion'             => ['nullable', 'string'],
        'lineas_investigacion'                      => ['required', 'array', 'min:0', 'max:2147483647', 'exists:lineas_investigacion,id'],
        'grupos_investigacion'                      => ['required', 'array', 'min:0', 'max:2147483647', 'exists:grupos_investigacion,id'],
        'semilleros_investigacion'                  => ['nullable', 'array', 'min:0', 'max:2147483647', 'exists:semilleros_investigacion,id'],
        'disciplinas_subarea_conocimiento'          => ['required', 'array', 'min:0', 'max:2147483647', 'exists:disciplinas_subarea_conocimiento,id'],
        'redes_conocimiento'                        => ['required', 'array', 'min:0', 'max:2147483647', 'exists:redes_conocimiento,id'],
        'tematicas_estrategicas'                    => ['required', 'array', 'min:0', 'max:2147483647', 'exists:tematicas_estrategicas,id'],
        'proyecto_idi_tecnoacademia_id'             => ['required', 'array', 'min:0', 'max:2147483647', 'exists:proyectos_idi_tecnoacademia,id'],
        'actividades_economicas'                    => ['required', 'array', 'min:0', 'max:2147483647', 'exists:actividades_economicas,id'],
        'articulacion_semillero'                    => ['required', 'min:0', 'max:2', 'integer'],
        'semilleros_en_formalizacion'               => ['nullable', 'json'],

        'proyectos_ejecucion'                       => ['nullable', 'string'],
        'impacto_centro_formacion'                  => ['nullable', 'string'],
        'aportacion_semilleros_grupos'              => ['nullable', 'string'],
        'proyeccion_con_st'                         => ['nullable', 'string'],
        'proyeccion_extensionismo_tecnologico'      => ['nullable', 'string'],
        'proyeccion_centros_desarrollo'             => ['nullable', 'string'],
        'proyeccion_formacion_regional'             => ['nullable', 'string'],

        'metodologia'                                           => ['nullable', 'string'],
        'metodologia_local'                                     => ['nullable', 'string'],
        'municipios'                                            => ['nullable', 'array'],
        'municipios_impactar'                                   => ['nullable', 'array'],
        'otras_nuevas_instituciones'                            => ['nullable', 'string'],
        'otras_nombre_instituciones_programas'                  => ['nullable', 'string'],
        'otras_nombre_instituciones'                            => ['nullable', 'string'],
        'impacto_municipios'                                    => ['nullable', 'string'],
        'nombre_instituciones'                                  => ['nullable', 'string'],
        'nombre_instituciones_programas'                        => ['nullable', 'string'],
        'nuevas_instituciones'                                  => ['nullable', 'string'],
        'proyeccion_nuevas_instituciones'                       => ['nullable', 'integer'],
        'proyeccion_articulacion_media'                         => ['nullable', 'integer'],
        'proyectos_macro'                                       => ['nullable', 'string'],
        'implementacion_modelo_pedagogico'                      => ['nullable', 'string'],
        'articulacion_plan_educacion'                           => ['nullable', 'string'],
        'articulacion_territorios_stem'                         => ['nullable', 'string'],
        'programas_formacion_articulados'                       => ['nullable', 'array'],
        'diseno_curricular_id'                                  => ['nullable', 'array'],
        'estrategia_articulacion_prox_vigencia'                 => ['nullable', 'string'],
        'alianzas_estrategicas'                                 => ['nullable', 'string'],
        'estrategia_divulgacion'                                => ['nullable', 'string'],
        'promover_productividad'                                => ['nullable', 'string'],
        'estrategia_atencion_talentos'                          => ['nullable', 'string'],
        'talento_otros_departamentos'                           => ['nullable', 'string'],
        'areas_cualificacion_mnc'                               => ['nullable', 'string'],
        'talentos_otros_departamentos'                          => ['nullable', 'string'],
        'acciones_mejoramiento_idic'                            => ['nullable', 'string'],
        'municipios_beneficiados_vigencia_anterior'             => ['nullable', 'string'],
        'beneficio_municipios_vigencia_anterior'                => ['nullable', 'string'],
        'municipios_beneficiados_vigencia_actual'               => ['nullable', 'string'],
        'estrategia_articulacion_pbts'                          => ['nullable', 'string'],
        'numero_empresas_atendidas'                             => ['nullable', 'string'],
        'analisis_impacto_sector_empresarial'                   => ['nullable', 'string'],
        'numero_emprendedores_atendidos'                        => ['nullable', 'string'],
        'analisis_impacto_regional'                             => ['nullable', 'string'],
        'gestion_alianzas_estrategicas'                         => ['nullable', 'string'],
        'integracion_plan_tecnologico'                          => ['nullable', 'string'],
        'estrategias_productividad_agropecuaria'                => ['nullable', 'string'],
        'acciones_estrategia_campesena'                         => ['nullable', 'string'],
        'estrategia_campesena_campesinos'                       => ['nullable', 'string'],
        'acciones_fortalecimiento_economia_popular'             => ['nullable', 'string'],
        'acciones_fortalecimiento_idi'                          => ['nullable', 'string'],
        'departamentos_a_impactar'                              => ['nullable', 'array'],
        'estrategias_atencion_empresas_municipios'              => ['nullable', 'string'],
        'estrategias_promover_logros'                           => ['nullable', 'string'],
        'estrategias_visibilizacion'                            => ['nullable', 'string'],
        'estrategias_productividad_agropecuaria_agroindustrial' => ['nullable', 'string'],
    ];
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
        if ($this->columnsRules[$this->is_array ? $this->route('column').''  : $this->route('column')]) {
            return [
                $this->route('column') => $this->columnsRules[$this->is_array ? $this->route('column').''  : $this->route('column')]
            ];
        } else {
            return [
                'column' => 'required'
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
        //
    }
}
