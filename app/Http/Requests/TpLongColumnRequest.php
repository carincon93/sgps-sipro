<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class TpLongColumnRequest extends FormRequest
{

    private $columnsRules = [
        'resumen'                                   => ['required', 'max:40000', 'string'],
        'resumen_regional'                          => ['required', 'max:40000', 'string'],
        'antecedentes'                              => ['required', 'max:40000', 'string'],
        'antecedentes_regional'                     => ['required', 'max:40000', 'string'],
        'marco_conceptual'                          => ['required', 'string'],
        'bibliografia'                              => ['required', 'string'],
        'impacto_centro_formacion'                  => ['required', 'string'],
        'retos_oportunidades'                       => ['required', 'max:40000', 'string'],
        'pertinencia_territorio'                    => ['required', 'max:40000', 'string'],
        'articulacion_agenda_competitividad'        => ['nullable', 'max:40000', 'string'],
        'aportes_linea_ocho_conpes'                 => ['nullable', 'max:40000', 'string'],
        'estado_ecosistema_ctel'                    => ['nullable', 'max:40000', 'string'],
        'logros_vigencia_anterior'                  => ['nullable', 'max:40000', 'string'],

        'impacto_centro_formacion'                  => ['nullable', 'max:40000', 'string'],
        'aportacion_semilleros_grupos'              => ['nullable', 'max:40000', 'string'],
        'proyeccion_con_st'                         => ['nullable', 'max:40000', 'string'],
        'proyeccion_extensionismo_tecnologico'      => ['nullable', 'max:40000', 'string'],
        'proyeccion_centros_desarrollo'             => ['nullable', 'max:40000', 'string'],
        'proyeccion_formacion_regional'             => ['nullable', 'max:40000', 'string'],

        'metodologia'                               => ['nullable', 'max:40000', 'string'],
        'metodologia_local'                         => ['nullable', 'max:40000', 'string'],
        'impacto_municipios'                        => ['nullable', 'max:40000', 'string'],
        'estrategia_articulacion_prox_vigencia'     => ['nullable', 'max:40000', 'string'],
        'alianzas_estrategicas'                     => ['nullable', 'max:40000', 'string'],
        'estrategia_divulgacion'                    => ['nullable', 'max:40000', 'string'],
        'promover_productividad'                    => ['nullable', 'max:40000', 'string'],
        'estrategia_atencion_talentos'              => ['nullable', 'max:40000', 'string'],
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
        $this->merge([
            'impacto_municipios' => $this->impacto_municipios,
        ]);
    }
}
