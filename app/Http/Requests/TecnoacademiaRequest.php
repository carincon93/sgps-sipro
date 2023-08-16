<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class TecnoacademiaRequest extends FormRequest
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
            'centro_formacion_id'  => ['required', 'min:0', 'max:2147483647', 'integer', 'exists:centros_formacion,id'],
            'nombre'               => ['required', 'max:255'],
            'modalidad'            => ['required', 'max:2'],
            'foco'                 => ['required', 'string'],
            'fecha_creacion'       => ['required', 'date', 'date_format:Y-m-d'],
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
