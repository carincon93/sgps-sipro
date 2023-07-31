<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class InventarioEquipoRequest extends FormRequest
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
            'nombre'                    => ['required', 'string', 'max:255'],
            'marca'                     => ['required', 'string', 'max:255'],
            'serial'                    => ['required', 'string', 'max:255'],
            'codigo_interno'            => ['required', 'string', 'max:255'],
            'fecha_adquisicion'         => ['required', 'date', 'date_format:Y-m-d'],
            'estado'                    => ['required', 'integer', 'min:0', 'max:2147483647'],
            'uso_st'                    => ['required', 'integer', 'min:0', 'max:2147483647'],
            'uso_otra_dependencia'      => ['required', 'integer', 'min:0', 'max:2147483647'],
            'dependencia'               => ['nullable', 'string', 'max:255'],
            'descripcion'               => ['required', 'string', 'max:10000'],
            'mantenimiento_prox_year'   => ['required', 'integer', 'min:0', 'max:2147483647'],
            'calibracion_prox_year'     => ['required', 'integer', 'min:0', 'max:2147483647'],
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
