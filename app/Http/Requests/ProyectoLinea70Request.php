<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ProyectoLinea70Request extends FormRequest
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
                'tecnoacademia_linea_tecnoacademia_id*'     => ['required', 'min:0', 'max:2147483647', 'exists:tecnoacademia_linea_tecnoacademia,id'],
                'fecha_inicio'                              => ['required', 'date', 'date_format:Y-m-d', 'before:fecha_finalizacion'],
                'fecha_finalizacion'                        => ['required', 'date', 'date_format:Y-m-d', 'after:fecha_inicio'],
                'max_meses_ejecucion'                       => ['required', 'numeric', 'min:1', 'max:12'],
            ];
        } else {
            return [
                'tecnoacademia_linea_tecnoacademia_id*'     => ['required', 'min:0', 'max:2147483647', 'exists:tecnoacademia_linea_tecnoacademia,id'],
                'fecha_inicio'                              => ['required', 'date', 'date_format:Y-m-d', 'before:fecha_finalizacion'],
                'fecha_finalizacion'                        => ['required', 'date', 'date_format:Y-m-d', 'after:fecha_inicio'],
                'max_meses_ejecucion'                       => ['required', 'numeric', 'min:1', 'max:12'],
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
        if (is_array($this->tecnoacademia_linea_tecnoacademia_id)) {
            $this->merge([
                'tecnoacademia_linea_tecnoacademia_id' => json_encode($this->tecnoacademia_linea_tecnoacademia_id)
            ]);
        }
    }
}
