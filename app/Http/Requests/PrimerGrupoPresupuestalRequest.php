<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PrimerGrupoPresupuestalRequest extends FormRequest
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
            'nombre'    => ['required', 'string'],
            'cta'       => ['required', 'integer', 'min:0', 'max:99'],
            'bpin'      => ['required', 'string', 'max:20'],
        ];
    }
}
