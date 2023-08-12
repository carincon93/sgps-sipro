<?php

namespace App\Http\Requests;

use App\Rules\MaxWords;
use Illuminate\Foundation\Http\FormRequest;

class ProyectoFormulario12Linea68Request extends FormRequest
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
                'titulo'                                    => ['required', 'string', new MaxWords(40)],
                'fecha_inicio'                              => ['required', 'date', 'date_format:Y-m-d', 'before:fecha_finalizacion'],
                'fecha_finalizacion'                        => ['required', 'date', 'date_format:Y-m-d', 'after:fecha_inicio'],
                'max_meses_ejecucion'                       => ['required', 'numeric', 'min:1', 'max:12'],
                'programas_formacion*'                      => ['required', 'array', 'exists:programas_formacion,id'],
            ];
        } else {
            return [
                'tipo_proyecto_linea_68_id'                 => ['required', 'min:0', 'max:2147483647', 'integer', 'exists:tipos_proyecto_linea_68,id'],
                'estado_sistema_gestion_id'                 => ['required', 'min:0', 'max:2147483647', 'integer', 'exists:estados_sistema_gestion,id'],
                'titulo'                                    => ['required', 'string', new MaxWords(40)],
                'fecha_inicio'                              => ['required', 'date', 'date_format:Y-m-d', 'before:fecha_finalizacion'],
                'fecha_finalizacion'                        => ['required', 'date', 'date_format:Y-m-d', 'after:fecha_inicio'],
                'max_meses_ejecucion'                       => ['required', 'numeric', 'min:1', 'max:12'],
                'sector_productivo'                         => ['required', 'min:0', 'max:2147483647', 'integer'],
                'nombre_area_tecnica'                       => ['required', 'string', 'max:191'],
                'rol_sennova'                               => ['required', 'min:0', 'max:2147483647', 'integer'],
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
