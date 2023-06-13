<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ReglaRolTaRequest extends FormRequest
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
            'tecnoacademia_id'              => ['required', 'min:0', 'max:2147483647', 'integer', 'exists:tecnoacademias,id'],
            'convocatoria_rol_sennova_id'   => ['required', 'min:0', 'max:2147483647', 'integer', 'exists:convocatoria_rol_sennova,id'],
            'maximo'                        => ['required', 'min:0', 'max:32767', 'integer'],
        ];
    }

    /**
     * Prepare the data for validation.
     *
     * @return void
     */
    protected function prepareForValidation()
    {
        if (is_array($this->tecnoacademia_id)) {
            $this->merge([
                'tecnoacademia_id' => $this->tecnoacademia_id['value'],
            ]);
        }

        if (is_array($this->convocatoria_rol_sennova_id)) {
            $this->merge([
                'convocatoria_rol_sennova_id' => $this->convocatoria_rol_sennova_id['value'],
            ]);
        }
    }
}
