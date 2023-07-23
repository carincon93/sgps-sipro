<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ProyectoPresupuestoRequest extends FormRequest
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
            'descripcion'   => ['required', 'string'],
            'justificacion' => ['required'],
        ];
    }

    /**
     * Prepare the data for validation.
     *
     * @return void
     */
    protected function prepareForValidation()
    {
        if (is_array($this->convocatoria_presupuesto_id)) {
            if (isset($this->convocatoria_presupuesto_id['value']) && is_numeric($this->convocatoria_presupuesto_id['value'])) {
                $this->merge([
                    'convocatoria_presupuesto_id' => $this->convocatoria_presupuesto_id['value'],
                ]);
            } else {
                $convocatoriaRubrosPresupuestales = [];
                foreach ($this->convocatoria_presupuesto_id as $convocatoriaPresupuesto) {
                    if (is_array($convocatoriaPresupuesto)) {
                        array_push($convocatoriaRubrosPresupuestales, $convocatoriaPresupuesto['value']);
                    }
                }
                $this->merge(['convocatoria_presupuesto_id' => $convocatoriaRubrosPresupuestales]);
            }
        }

        if (is_array($this->concepto_viaticos)) {
            $this->merge([
                'concepto_viaticos' => $this->concepto_viaticos['value'],
            ]);
        }
    }
}
