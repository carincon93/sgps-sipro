<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ProyectoLinea83Request extends FormRequest
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
        if ($this->isMethod('PUT')) {
            return [
                'fecha_inicio'                              => ['required', 'date', 'date_format:Y-m-d', 'before:fecha_finalizacion'],
                'fecha_finalizacion'                        => ['required', 'date', 'date_format:Y-m-d', 'after:fecha_inicio'],
                'max_meses_ejecucion'                       => ['required', 'numeric', 'min:1', 'max:12'],
                'municipios*'                               => ['required', 'integer', 'min:0', 'max:2147483647', 'exists:municipios,id'],
            ];
        } else {
            return [
                'titulo'                                    => ['required', 'string'],
                'centro_formacion_id'                       => ['required', 'min:0', 'max:2147483647', 'exists:centros_formacion,id'],
                'fecha_inicio'                              => ['required', 'date', 'date_format:Y-m-d', 'before:fecha_finalizacion'],
                'fecha_finalizacion'                        => ['required', 'date', 'date_format:Y-m-d', 'after:fecha_inicio'],
                'max_meses_ejecucion'                       => ['required', 'numeric', 'min:1', 'max:12'],
                'rol_sennova'                               => ['required', 'min:0', 'max:2147483647', 'integer'],
                'cantidad_horas'                            => ['required', 'numeric', 'min:1', 'max:168'],
                'cantidad_meses'                            => ['required', 'numeric', 'min:1', 'max:12'],
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
