<?php

namespace App\Http\Requests\Evaluacion;

use Illuminate\Foundation\Http\FormRequest;

class EvaluacionProyectoFormulario3Linea61Request extends FormRequest
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
            'titulo_puntaje'                                    => ['nullable', 'numeric', 'max:1'],
            'titulo_comentario'                                 => ['nullable', 'string'],
            'video_puntaje'                                     => ['nullable', 'numeric', 'max:1'],
            'video_comentario'                                  => ['nullable', 'string'],
            'resumen_puntaje'                                   => ['nullable', 'numeric', 'max:2'],
            'resumen_comentario'                                => ['nullable', 'string'],
            'antecedentes_puntaje'                              => ['nullable', 'numeric', 'max:15'],
            'antecedentes_comentario'                           => ['nullable', 'string'],
            'problema_central_puntaje'                          => ['nullable', 'integer', 'max:0'],
            'problema_central_comentario'                       => ['nullable', 'string'],
            'ortografia_puntaje'                                => ['nullable', 'numeric'],
            'ortografia_comentario'                             => ['nullable', 'string'],
            'redaccion_puntaje'                                 => ['nullable', 'numeric'],
            'redaccion_comentario'                              => ['nullable', 'string'],
            'normas_apa_puntaje'                                => ['nullable', 'numeric'],
            'normas_apa_comentario'                             => ['nullable', 'string'],
            'justificacion_economia_naranja_comentario'         => ['nullable', 'string'],
            'justificacion_industria_4_comentario'              => ['nullable', 'string'],
            'bibliografia_comentario'                           => ['nullable', 'string'],
            'fechas_comentario'                                 => ['nullable', 'string'],
            'justificacion_politica_discapacidad_comentario'    => ['nullable', 'string'],
            'actividad_economica_comentario'                    => ['nullable', 'string'],
            'area_conocimiento_comentario'                      => ['nullable', 'string'],
            'tematica_estrategica_comentario'                   => ['nullable', 'string'],
        ];
    }
}
