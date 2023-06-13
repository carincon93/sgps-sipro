<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ConvocatoriaPresupuestoRequest extends FormRequest
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
            'presupuesto_sennova_id' => ['required', 'min:0', 'max:2147483647', 'integer', 'exists:presupuesto_sennova,id'],
        ];
    }

    /**
     * Prepare the data for validation.
     *
     * @return void
     */
    protected function prepareForValidation()
    {
        if (is_array($this->presupuesto_sennova_id)) {
            $this->merge([
                'presupuesto_sennova_id' => $this->presupuesto_sennova_id['value'],
            ]);
        }
    }
}
