<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ConvocatoriaPresupuestoRequest extends FormRequest
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
            'rubro_presupuestal_id' => ['required', 'min:0', 'max:2147483647', 'integer', 'exists:rubros_presupuestales,id'],
            'linea_programatica_id' => ['required', 'min:0', 'max:2147483647', 'integer', 'exists:lineas_programaticas,id'],
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
