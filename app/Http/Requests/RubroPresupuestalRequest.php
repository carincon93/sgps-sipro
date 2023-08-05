<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RubroPresupuestalRequest extends FormRequest
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
        ];
    }

    /**
     * Prepare the data for validation.
     *
     * @return void
     */
    protected function prepareForValidation()
    {
        //
    }
}
