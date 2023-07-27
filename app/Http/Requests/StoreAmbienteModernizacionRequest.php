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
        $this->merge([
            'financiado_anteriormente' => $this->financiado_anteriormente == '1' ? 1 : 0,
        ]);

        $this->merge([
            'alineado_mesas_sectoriales' => $this->alineado_mesas_sectoriales == '1' ? 1 : 0,
        ]);

        if ($this->alineado_mesas_sectoriales == 0) {
            $this->merge([
                'mesa_sectorial_id' => $this->mesa_sectorial_id = null,
            ]);
        }
    }
}
