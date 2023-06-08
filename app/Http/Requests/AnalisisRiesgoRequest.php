<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AnalisisRiesgoRequest extends FormRequest
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
            'nivel'                => ['required', 'max:191'],
            'tipo'                 => ['required', 'max:191'],
            'descripcion'          => ['required', 'string'],
            'impacto'              => ['required', 'max:191'],
            'probabilidad'         => ['required', 'max:191'],
            'efectos'              => ['required', 'string'],
            'medidas_mitigacion'   => ['required', 'string'],
        ];
    }

    /**
     * Prepare the data for validation.
     *
     * @return void
     */
    protected function prepareForValidation()
    {
        if (is_array($this->nivel)) {
            $this->merge([
                'nivel' => $this->nivel['value'],
            ]);
        }

        if (is_array($this->tipo)) {
            $this->merge([
                'tipo' => $this->tipo['value'],
            ]);
        }

        if (is_array($this->impacto)) {
            $this->merge([
                'impacto' => $this->impacto['value'],
            ]);
        }

        if (is_array($this->probabilidad)) {
            $this->merge([
                'probabilidad' => $this->probabilidad['value'],
            ]);
        }
    }
}
