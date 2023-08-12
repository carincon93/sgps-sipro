<?php

namespace App\Http\Requests\Evaluacion;

use Illuminate\Foundation\Http\FormRequest;

class EvaluacionProyectoFormulario4Linea70Request extends FormRequest
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
            'resumen_regional_comentario'               => ['nullable', 'string'],
            'antecedentes_tecnoacademia_comentario'     => ['nullable', 'string'],
            'retos_oportunidades_comentario'            => ['nullable', 'string'],
            'metodologia_comentario'                    => ['nullable', 'string'],
            'lineas_medulares_centro_comentario'        => ['nullable', 'string'],
            'lineas_tecnologicas_centro_comentario'     => ['nullable', 'string'],
            'articulacion_sennova_comentario'           => ['nullable', 'string'],
            'municipios_comentario'                     => ['nullable', 'string'],
            'instituciones_comentario'                  => ['nullable', 'string'],
            'fecha_ejecucion_comentario'                => ['nullable', 'string'],
            'cadena_valor_comentario'                   => ['nullable', 'string'],
            'analisis_riesgos_comentario'               => ['nullable', 'string'],
            'anexos_comentario'                         => ['nullable', 'string'],
            'proyectos_macro_comentario'                => ['nullable', 'string'],
            'productos_comentario'                      => ['nullable', 'string'],
            'bibliografia_comentario'                   => ['nullable', 'string'],
            'ortografia_comentario'                     => ['nullable', 'string'],
            'redaccion_comentario'                      => ['nullable', 'string'],
            'normas_apa_comentario'                     => ['nullable', 'string'],
        ];
    }
}
