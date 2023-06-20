<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RolSennovaRequest extends FormRequest
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
            'nombre'                => ['required', 'max:191'],
            'sumar_al_presupuesto'  => ['required', 'boolean'],
            'linea_programatica_id' => ['nullable', 'min:0', 'max:2147483647', 'integer', 'exists:lineas_programaticas,id'],
        ];
    }

    /**
     * Prepare the data for validation.
     *
     * @return void
     */
    protected function prepareForValidation()
    {
        if (is_array($this->linea_programatica_id)) {
            $this->merge([
                'linea_programatica_id' => $this->linea_programatica_id['value'],
            ]);
        }
    }
}
