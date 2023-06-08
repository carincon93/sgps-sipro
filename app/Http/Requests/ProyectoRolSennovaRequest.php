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
        if (is_array($this->convocatoria_rol_sennova_id)) {
            $this->merge([
                'convocatoria_rol_sennova_id' => $this->convocatoria_rol_sennova_id['value'],
            ]);
        }

        if (is_array($this->numero_meses_monitorias)) {
            $this->merge([
                'numero_meses' => $this->numero_meses_monitorias['value'],
            ]);
        }

        if (is_array($this->numero_monitorias)) {
            $this->merge([
                'numero_roles' => $this->numero_monitorias['value'],
            ]);
        }

        $convocatoriaRolSennova = ConvocatoriaRolSennova::find($this->convocatoria_rol_sennova_id);
        $proyecto               = Proyecto::find($this->proyecto_id);
        if ($convocatoriaRolSennova && $convocatoriaRolSennova->rolSennova->nombre == 'aprendiz sennova (contrato aprendizaje)' && $proyecto && $proyecto->lineaProgramatica->codigo == 68) {
            $this->merge([
                'numero_meses' => 6,
            ]);
        }
    }
}
