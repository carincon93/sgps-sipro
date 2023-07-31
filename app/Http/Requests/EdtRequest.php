<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class EdtRequest extends FormRequest
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
            'tipo_evento'                       => ['required', 'max:2'],
            'descripcion_evento'                => ['required', 'max:40000', 'string'],
            'descripcion_participacion_entidad' => ['required', 'max:40000', 'string'],
            'publico_objetivo'                  => ['required', 'string', 'max:255'],
            'numero_asistentes'                 => ['required', 'integer', 'min:0', 'max:2147483647'],
            'estrategia_comunicacion'           => ['required', 'string', 'max:255'],
            'nombre_evento'                     => ['required', 'string', 'max:255'],
            'organizador'                       => ['required', 'string', 'max:191'],
            'fecha_evento'                      => ['required', 'date'],
        ];
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
