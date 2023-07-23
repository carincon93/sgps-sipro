<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PresupuestoSennovaRequest extends FormRequest
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
            'primer_grupo_presupuestal_id'     => ['required', 'min:0', 'max:2147483647', 'integer', 'exists:primer_grupo_presupuestal,id'],
            'segundo_grupo_presupuestal_id'    => ['required', 'min:0', 'max:2147483647', 'integer', 'exists:segundo_grupo_presupuestal,id'],
            'tercer_grupo_presupuestal_id'     => ['required', 'min:0', 'max:2147483647', 'integer', 'exists:tercer_grupo_presupuestal,id'],
            'uso_presupuestal_id'              => ['required', 'min:0', 'max:2147483647', 'integer', 'exists:usos_presupuestales,id'],
            'linea_programatica_id'            => ['required', 'min:0', 'max:2147483647', 'integer', 'exists:lineas_programaticas,id'],
        ];
    }

    /**
     * Prepare the data for validation.
     *
     * @return void
     */
    protected function prepareForValidation()
    {
        if (is_array($this->primer_grupo_presupuestal_id)) {
            $this->merge([
                'primer_grupo_presupuestal_id' => $this->primer_grupo_presupuestal_id['value'],
            ]);
        }

        if (is_array($this->segundo_grupo_presupuestal_id)) {
            $this->merge([
                'segundo_grupo_presupuestal_id' => $this->segundo_grupo_presupuestal_id['value'],
            ]);
        }

        if (is_array($this->tercer_grupo_presupuestal_id)) {
            $this->merge([
                'tercer_grupo_presupuestal_id' => $this->tercer_grupo_presupuestal_id['value'],
            ]);
        }

        if (is_array($this->uso_presupuestal_id)) {
            $this->merge([
                'uso_presupuestal_id' => $this->uso_presupuestal_id['value'],
            ]);
        }

        if (is_array($this->linea_programatica_id)) {
            $this->merge([
                'linea_programatica_id' => $this->linea_programatica_id['value'],
            ]);
        }
    }
}
