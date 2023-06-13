<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ReglaRolStRequest extends FormRequest
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
            'tipo_proyecto_st_id'   => ['required', 'min:0', 'max:2147483647', 'integer', 'exists:tipos_proyecto_st,id'],
            'rol_sennova_id'        => ['required', 'min:0', 'max:2147483647', 'integer', 'exists:roles_sennova,id'],
            'maximo'                => ['required', 'min:0', 'max:32767', 'integer'],
        ];
    }

    /**
     * Prepare the data for validation.
     *
     * @return void
     */
    protected function prepareForValidation()
    {
        if (is_array($this->tipo_proyecto_st_id)) {
            $this->merge([
                'tipo_proyecto_st_id' => $this->tipo_proyecto_st_id['value'],
            ]);
        }

        if (is_array($this->rol_sennova_id)) {
            $this->merge([
                'rol_sennova_id' => $this->rol_sennova_id['value'],
            ]);
        }
    }
}
