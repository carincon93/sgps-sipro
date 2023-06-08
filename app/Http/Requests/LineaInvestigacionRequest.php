<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class LineaInvestigacionRequest extends FormRequest
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
            'nombre'                => ['required', 'max:191', 'string'],
            'programas_formacion'   => ['required'],
        ];
    }

    /**
     * Prepare the data for validation.
     *
     * @return void
     */
    protected function prepareForValidation()
    {
        if (is_array($this->programas_formacion)) {
            if (isset($this->programas_formacion['value']) && is_numeric($this->programas_formacion['value'])) {
                $this->merge([
                    'programas_formacion' => $this->programas_formacion['value'],
                ]);
            } else {
                $programas_formacion = [];
                foreach ($this->programas_formacion as $programa_formacion) {
                    if (is_array($programa_formacion)) {
                        array_push($programas_formacion, $programa_formacion['value']);
                    }
                }
                $this->merge(['programas_formacion' => $programas_formacion]);
            }
        }
    }
}
