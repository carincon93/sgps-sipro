<?php

namespace App\Http\Requests\Perfil;

use Illuminate\Foundation\Http\FormRequest;

class EstudioAcademicoRequest extends FormRequest
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
            'user_id'         => ['required', 'min:0', 'max:2147483647', 'integer', 'exists:users,id'],
            'grado_formacion' => ['required', 'integer', 'min:1', 'max:9'],
            'titulo_obtenido' => ['required', 'string', 'max:255'],
        ];
    }

     /**
     * Prepare the data for validation.
     *
     * @return void
     */
    protected function prepareForValidation()
    {
        if (is_array($this->grado_formacion)) {
            $this->merge([
                'grado_formacion' => $this->grado_formacion['value'],
            ]);
        }
    }
}
