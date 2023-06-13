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
            'resultado_id'                  => ['required', 'min:0', 'max:2147483647', 'integer', 'exists:resultados,id'],
            'nombre'                        => ['required', 'string'],
            'fecha_inicio'                  => ['required', 'date', 'date_format:Y-m-d', 'before:fecha_finalizacion', new FechaInicioProyecto($this->route('convocatoria'), null, $this->route('proyecto'))],
            'fecha_finalizacion'            => ['required', 'date', 'date_format:Y-m-d', 'after:fecha_inicio', new FechaFinalizacionProyecto($this->route('convocatoria'), null, $this->route('proyecto'))],
            'indicador'                     => ['required', 'string'],
            'actividad_id*'                 => ['required', 'min:0', 'max:2147483647', 'integer', 'exists:actividades,id'],
        ];
    }

    /**
     * Prepare the data for validation.
     *
     * @return void
     */
    protected function prepareForValidation()
    {
        if (is_array($this->resultado_id)) {
            $this->merge([
                'resultado_id' => $this->resultado_id['value'],
            ]);
        }

        if (is_array($this->subtipologia_minciencias_id)) {
            $this->merge([
                'subtipologia_minciencias_id' => $this->subtipologia_minciencias_id['value'],
            ]);
        }

        if (is_array($this->tipo)) {
            $this->merge([
                'tipo' => $this->tipo['value'],
            ]);
        }
    }
}
