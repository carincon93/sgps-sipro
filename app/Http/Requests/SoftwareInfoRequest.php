<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SoftwareInfoRequest extends FormRequest
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
            'proyecto_presupuesto_id'   => ['required', 'min:0', 'max:2147483647', 'integer', 'exists:proyecto_presupuesto,id'],
            'tipo_licencia'             => ['required', 'integer', 'min:0', 'max:32767'],
            'tipo_software'             => ['required', 'integer', 'min:0', 'max:32767'],
            'fecha_inicio'              => ['required', 'date', 'date_format:Y-m-d', 'before:fecha_finalizacion'],
            'fecha_finalizacion'        => ['required', 'date', 'date_format:Y-m-d', 'after:fecha_inicio'],
        ];
    }
}
