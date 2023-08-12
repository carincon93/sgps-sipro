<?php

namespace App\Http\Requests;

use App\Models\ConvocatoriaRolSennova;
use App\Models\Proyecto;
use Illuminate\Foundation\Http\FormRequest;

class ProyectoRolSennovaRequest extends FormRequest
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
            'convocatoria_rol_sennova_id'   => ['required', 'min:0', 'max:2147483647', 'integer', 'exists:convocatoria_rol_sennova,id'],
            'descripcion'                   => ['nullable', 'string'],
            'experiencia'                   => ['nullable', 'string'],
            'formacion'                     => ['nullable', 'string'],
            'educacion'                     => ['nullable', 'string'],
            'numero_meses'                  => ['required', 'min:0', 'max:12'],
            'numero_roles'                  => ['required', 'min:0', 'max:32767', 'integer'],
            'actividad_id*'                 => ['nullable', 'min:0', 'max:2147483647', 'exists:actividades,id'],
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
