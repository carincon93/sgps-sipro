<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreAmbienteModernizacionRequest extends FormRequest
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
            'codigo_proyecto_sgps_id'               => ['required', 'min:0', 'max:2147483647999', 'integer', 'exists:codigos_proyectos_sgps,id'],
            'red_conocimiento_id'                   => ['required', 'min:0', 'max:2147483647999', 'integer', 'exists:redes_conocimiento,id'],
            'linea_investigacion_id'                => ['required', 'min:0', 'max:2147483647999', 'integer', 'exists:lineas_investigacion,id'],
            'disciplina_subarea_conocimiento_id'    => ['required', 'min:0', 'max:2147483647999', 'integer', 'exists:disciplinas_subarea_conocimiento,id'],
            'tematica_estrategica_id'               => ['required', 'min:0', 'max:2147483647999', 'integer', 'exists:tematicas_estrategicas,id'],
            'mesa_sectorial_id*'                    => ['nullable', 'min:0', 'max:2147483647999', 'integer', 'exists:mesas_sectoriales,id'],
            'tipologia_ambiente_id'                 => ['required', 'min:0', 'max:2147483647999', 'integer', 'exists:tipologias_ambientes,id'],
            'financiado_anteriormente'              => ['required', 'boolean'],
            'nombre_ambiente'                       => ['required', 'string'],
            'alineado_mesas_sectoriales'            => ['required', 'boolean'],
        ];
    }

    /**
     * Prepare the data for validation.
     *
     * @return void
     */
    protected function prepareForValidation()
    {
        if (is_array($this->disciplina_subarea_conocimiento_id)) {
            $this->merge([
                'disciplina_subarea_conocimiento_id' => $this->disciplina_subarea_conocimiento_id['value'],
            ]);
        }

        if (is_array($this->actividad_economica_id)) {
            $this->merge([
                'actividad_economica_id' => $this->actividad_economica_id['value'],
            ]);
        }

        if (is_array($this->linea_investigacion_id)) {
            $this->merge([
                'linea_investigacion_id' => $this->linea_investigacion_id['value'],
            ]);
        }

        if (is_array($this->red_conocimiento_id)) {
            $this->merge([
                'red_conocimiento_id' => $this->red_conocimiento_id['value'],
            ]);
        }

        if (is_array($this->tematica_estrategica_id)) {
            $this->merge([
                'tematica_estrategica_id' => $this->tematica_estrategica_id['value'],
            ]);
        }

        if (is_array($this->codigo_proyecto_sgps_id)) {
            $this->merge([
                'codigo_proyecto_sgps_id' => $this->codigo_proyecto_sgps_id['value'],
            ]);
        }

        if (is_array($this->tipologia_ambiente_id)) {
            $this->merge([
                'tipologia_ambiente_id' => $this->tipologia_ambiente_id['value'],
            ]);
        }

        if (is_array($this->financiado_anteriormente)) {
            $this->merge([
                'financiado_anteriormente' => $this->financiado_anteriormente['value'] == '1' ? 1 : 0,
            ]);
        }

        if (is_array($this->alineado_mesas_sectoriales)) {
            $this->merge([
                'alineado_mesas_sectoriales' => $this->alineado_mesas_sectoriales['value'] == '1' ? 1 : 0,
            ]);
        }

        if ($this->alineado_mesas_sectoriales == 0) {
            $this->merge([
                'mesa_sectorial_id' => $this->mesa_sectorial_id = null,
            ]);
        }
    }
}
