<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ArticulacionSennovaColumnRequest extends FormRequest
{

    private $columnsRules = [
        'articulacion_centro_formacion'                             => ['required', 'string'],
        'lineas_medulares_centro'                                   => ['nullable', 'string'],
        'articulacion_programas_centro'                             => ['nullable', 'string'],
        'articulacion_bienestar_aprendiz'                           => ['nullable', 'string'],
        'favorecimiento_ruta_formacion'                             => ['nullable', 'string'],
        'lineas_investigacion'                                      => ['required', 'array'],
        'grupos_investigacion'                                      => ['required', 'array'],
        'semilleros_investigacion'                                  => ['nullable', 'array', 'min:0', 'max:2147483647', 'exists:semilleros_investigacion,id'],
        'disciplinas_subarea_conocimiento'                          => ['required', 'array', 'min:0', 'max:2147483647', 'exists:disciplinas_subarea_conocimiento,id'],
        'redes_conocimiento'                                        => ['required', 'array', 'min:0', 'max:2147483647', 'exists:redes_conocimiento,id'],
        'tematicas_estrategicas'                                    => ['required', 'array', 'min:0', 'max:2147483647', 'exists:tematicas_estrategicas,id'],
        'proyecto_idi_tecnoacademia_id'                             => ['required', 'array', 'min:0', 'max:2147483647', 'exists:proyectos_idi_tecnoacademia,id'],
        'actividades_economicas'                                    => ['required', 'array', 'min:0', 'max:2147483647', 'exists:actividades_economicas,id'],
        'articulacion_semillero'                                    => ['required', 'min:0', 'max:2', 'integer'],
        'semilleros_en_formalizacion'                               => ['nullable', 'json'],

        'proyectos_ejecucion'                                       => ['nullable', 'string'],
        'impacto_centros_formacion'                                 => ['nullable', 'string'],
        'impacto_centro_formacion'                                  => ['nullable', 'string'],
        'aportacion_semilleros_grupos'                              => ['nullable', 'string'],
        'proyeccion_con_st'                                         => ['nullable', 'string'],
        'proyeccion_extensionismo_tecnologico'                      => ['nullable', 'string'],
        'proyeccion_centros_desarrollo'                             => ['nullable', 'string'],
        'proyeccion_formacion_regional'                             => ['nullable', 'string'],

        'articulacion_semilleros_grupos_investigacion'              => ['nullable', 'string'],
        'articulacion_linea_68'                                     => ['nullable', 'string'],
        'articulacion_linea_69_y_hubs'                              => ['nullable', 'string'],
        'articulacion_centros_desarrollo_empresarial'               => ['nullable', 'string'],
        'contribucion_formacion_regional_nacional'                  => ['nullable', 'string'],
        'proyeccion_capacidades_tecnologicas_empresas'              => ['nullable', 'string'],

        'acciones_fortalecimiento_centro_regional'                  => ['nullable', 'string'],
        'contribucion_formacion_centro_regional'                    => ['nullable', 'string'],
        'acciones_participacion_aprendices'                         => ['nullable', 'string'],
        'acciones_aportes_por_edt'                                  => ['nullable', 'string'],
        'acciones_fortalecimiento_programas_calificados'            => ['nullable', 'string'],
        'acciones_categorizacion_grupos_investigacion'              => ['nullable', 'string'],
        'oportunidades_fortalecimiento_proyectos_sennova'           => ['nullable', 'string'],
        'proyeccion_articulacion_linea_68'                          => ['nullable', 'string'],
        'proyeccion_articulacion_linea_83'                          => ['nullable', 'string'],
        'oportunidades_fortalecimiento_convocatorias_innovacion'    => ['nullable', 'string'],
        'proyeccion_articulacion_centros_empresariales'             => ['nullable', 'string'],
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
        if ($this->columnsRules[$this->route('column')]) {
            return [
                $this->route('column') => $this->columnsRules[$this->route('column')]
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
