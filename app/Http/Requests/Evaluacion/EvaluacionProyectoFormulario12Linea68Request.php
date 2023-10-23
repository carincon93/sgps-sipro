<?php

namespace App\Http\Requests\Evaluacion;

use Illuminate\Foundation\Http\FormRequest;

class EvaluacionProyectoFormulario12Linea68Request extends FormRequest
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
            'fecha_ejecucion_comentario'                    => ['nullable', 'string'],
            'titulo_puntaje'                                => ['nullable', 'numeric', 'max:4'],
            'titulo_comentario'                             => ['nullable', 'string'],
            'resumen_puntaje'                               => ['nullable', 'numeric', 'max:3'],
            'resumen_comentario'                            => ['nullable', 'string'],
            'antecedentes_puntaje'                          => ['nullable', 'numeric', 'max:3'],
            'antecedentes_comentario'                       => ['nullable', 'string'],
            'identificacion_problema_puntaje'               => ['nullable', 'numeric', 'min:0', 'max:4'],
            'identificacion_problema_comentario'            => ['nullable', 'string'],
            'pregunta_formulacion_problema_puntaje'         => ['nullable', 'numeric', 'min:0', 'max:2'],
            'pregunta_formulacion_problema_comentario'      => ['nullable', 'string'],
            'justificacion_problema_puntaje'                => ['nullable', 'numeric', 'min:0', 'max:4'],
            'justificacion_problema_comentario'             => ['nullable', 'string'],
            'bibliografia_comentario'                       => ['nullable', 'string'],
            'ortografia_comentario'                         => ['nullable', 'string'],
            'redaccion_comentario'                          => ['nullable', 'string'],
            'normas_apa_comentario'                         => ['nullable', 'string'],
        ];
    }
}
