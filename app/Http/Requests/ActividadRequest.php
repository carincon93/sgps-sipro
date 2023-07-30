<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use App\Rules\FechaInicioProyecto;
use App\Rules\FechaFinalizacionProyecto;

class ActividadRequest extends FormRequest
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
            'objetivo_especifico_id'            => ['nullable', 'min:0', 'max:2147483647', 'integer', 'exists:objetivos_especificos,id'],
            'resultado_id'                      => ['nullable', 'min:0', 'max:2147483647', 'integer', 'exists:resultados,id'],
            'proyecto_presupuesto_id*'          => ['required_if:requiere_rubros,1', 'nullable', 'min:0', 'max:2147483647', 'exists:proyecto_presupuesto,id'],
            'descripcion'                       => ['required', 'string'],
            'fecha_inicio'                      => ['required', 'date', 'date_format:Y-m-d', 'before:fecha_finalizacion'],
            'fecha_finalizacion'                => ['required', 'date', 'date_format:Y-m-d', 'after:fecha_inicio'],
        ];
    }

    /**
     * Prepare the data for validation.
     *
     * @return void
     */
    protected function prepareForValidation()
    {
        $this->merge([
            'requiere_rubros' => $this->requiere_rubros == '1' ? 1 : 0,
            'resultado_id' => $this->resultado_id,
        ]);
    }
}
