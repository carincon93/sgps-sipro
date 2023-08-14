<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class MiembroEntidadAliadaRequest extends FormRequest
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
            'nombre'                => ['required', 'max:255', 'string'],
            'email'                 => ['required', 'max:255', 'email'],
            'tipo_documento'        => ['required', 'max:2'],
            'numero_documento'      => ['required', 'min:0', 'max:2147483647', 'integer'],
            'numero_celular'        => ['required', 'min:0', 'max:2147483647', 'integer'],
            'autorizacion_datos'    => ['required', 'boolean']
        ];
    }

    /**
     * Prepare the data for validation.
     *
     * @return void
     */
    protected function prepareForValidation()
    {
        if (is_array($this->tipo_documento)) {
            $this->merge([
                'tipo_documento' => $this->tipo_documento['value'],
            ]);
        }

        $this->merge([
            'nombre' => mb_strtolower($this->nombre),
        ]);

        $this->merge([
            'email' => mb_strtolower($this->email),
        ]);
    }
}
