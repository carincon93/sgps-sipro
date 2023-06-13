<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ProyectoIdiTecnoacademiaProductoRequest extends FormRequest
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
            'tipo_producto_idi_id'  => ['required', 'min:0', 'max:2147483647', 'exists:tipos_producto_idi,id'],
            'fecha_realizacion'     => ['nullable', 'date', 'date_format:Y-m-d'],
            'estado'                => ['required', 'integer', 'min:0', 'max:2147483647'],
            'lugar'                 => ['nullable', 'string', 'max:255'],
            'descripcion'           => ['required', 'string'],
            'link'                  => ['nullable', 'url', 'string'],
            'soporte'               => ['nullable', 'file', 'max:10000000'],
        ];
    }

    /**
     * Prepare the data for validation.
     *
     * @return void
     */
    protected function prepareForValidation()
    {
        if (is_array($this->estado)) {
            $this->merge([
                'estado' => $this->estado['value'],
            ]);
        }

        if (is_array($this->tipo_producto_idi_id)) {
            $this->merge([
                'tipo_producto_idi_id' => $this->tipo_producto_idi_id['value'],
            ]);
        }
    }
}
