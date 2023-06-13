<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ProyectoCapacidadInstaladaEntidadAliadaRequest extends FormRequest
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
        if ($this->isMethod('PUT')) {
            return [
                'nombre'        => ['required', 'max:255'],
                'nit'           => ['required', 'max:15'],
                'documento'     => ['nullable', 'file', 'max:10240'],
            ];
        } else {
            return [
                'nombre'        => ['required', 'max:255'],
                'nit'           => ['required', 'max:15'],
                'documento'     => ['required', 'file', 'max:10240'],
            ];
        }
    }
}
