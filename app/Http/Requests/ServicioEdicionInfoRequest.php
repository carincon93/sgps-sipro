<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ServicioEdicionInfoRequest extends FormRequest
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
            'servicio_edicion_info' => ['exclude_if:numero_items,null', 'exclude_if:codigo_uso_presupuestal,2010100600203101', 'required_if:codigo_uso_presupuestal,2020200800901', 'integer', 'min:0', 'max:32767'],
        ];
    }

    /**
     * Prepare the data for validation.
     *
     * @return void
     */
    protected function prepareForValidation()
    {
        if (is_array($this->servicio_edicion_info)) {
            $this->merge([
                'servicio_edicion_info' => $this->servicio_edicion_info['value'],
            ]);
        }
    }
}
