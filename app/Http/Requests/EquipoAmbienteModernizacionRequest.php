<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class EquipoAmbienteModernizacionRequest extends FormRequest
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
            'numero_inventario_equipo'      => ['required', 'string', 'max:100'],
            'descripcion_tecnica_equipo'    => ['required', 'string'],
            'estado_equipo'                 => ['required', 'string', 'max:50'],
            'observaciones_generales'       => ['required', 'string'],
            'nombre_equipo'                 => ['required', 'string', 'max:191'],
            'equipo_en_funcionamiento'      => ['required', 'integer', 'min:1', 'max:12'],
            'marca'                         => ['required', 'string', 'max:191'],
            'horas_promedio_uso'            => ['required', 'min:1'],
            'frecuencia_mantenimiento'      => ['required', 'string', 'max:50'],
            'year_adquisicion'              => ['required', 'integer', 'min:0', 'max:3099'],
            'nombre_cuentadante'            => ['required', 'string', 'max:100'],
            'cedula_cuentadante'            => ['required', 'integer', 'min:0', 'max:9223372036854775807'],
            'rol_cuentadante'               => ['required', 'string', 'max:50'],
        ];
    }

    /**
     * Prepare the data for validation.
     *
     * @return void
     */
    protected function prepareForValidation()
    {
        if (is_array($this->estado_equipo)) {
            $this->merge([
                'estado_equipo' => $this->estado_equipo['value'],
            ]);
        }

        if (is_array($this->frecuencia_mantenimiento)) {
            $this->merge([
                'frecuencia_mantenimiento' => $this->frecuencia_mantenimiento['value'],
            ]);
        }

        if (is_array($this->equipo_en_funcionamiento)) {
            $this->merge([
                'equipo_en_funcionamiento' => $this->equipo_en_funcionamiento['value'],
            ]);
        }

        if (is_array($this->year_adquisicion)) {
            $this->merge([
                'year_adquisicion' => $this->year_adquisicion['value'],
            ]);
        }

        if (is_array($this->rol_cuentadante)) {
            $this->merge([
                'rol_cuentadante' => $this->rol_cuentadante['label'],
            ]);
        }
    }
}
