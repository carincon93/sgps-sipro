<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class EntidadAliadaRequest extends FormRequest
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
            'tipo'                                      => ['required'],
            'nombre'                                    => ['required', 'max:255'],
            'naturaleza'                                => ['required'],
            'tipo_empresa'                              => ['required'],
            'nit'                                       => ['required', 'max:11'],
        ];
    }

    /**
     * Prepare the data for validation.
     *
     * @return void
     */
    protected function prepareForValidation()
    {
        if (is_array($this->tipo)) {
            $this->merge([
                'tipo' => $this->tipo['value'],
            ]);
        }

        if (is_array($this->naturaleza)) {
            $this->merge([
                'naturaleza' => $this->naturaleza['value'],
            ]);
        }

        if (is_array($this->tipo_empresa)) {
            $this->merge([
                'tipo_empresa' => $this->tipo_empresa['value'],
            ]);
        }
    }
}
