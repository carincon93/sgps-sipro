<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use App\Rules\FechaInicioProyecto;
use App\Rules\FechaFinalizacionProyecto;

class ProductoRequest extends FormRequest
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
            'resultado_id'       => ['required', 'min:0', 'max:2147483647', 'integer', 'exists:resultados,id'],
            'nombre'             => ['required', 'string'],
            'fecha_inicio'       => ['required', 'date', 'date_format:Y-m-d', 'before:fecha_finalizacion'],
            'fecha_finalizacion' => ['required', 'date', 'date_format:Y-m-d', 'after:fecha_inicio'],
            'unidad_indicador'   => ['required', 'string'],
            'meta_indicador'     => ['required', 'integer'],
            'medio_verificacion' => ['required', 'string'],
            'formula_indicador'  => ['required', 'string'],
            'actividad_id*'      => ['required', 'min:0', 'max:2147483647', 'integer', 'exists:actividades,id'],
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
