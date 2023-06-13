<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ProponenteRequest extends FormRequest
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
            'user_id'           => ['required', 'integer', 'min:0', 'max:2147483647', 'exists:users,id'],
            'rol_sennova'       => ['required', 'min:0', 'max:2147483647', 'integer'],
            'cantidad_horas'    => ['required', 'numeric', 'min:1', 'max:168'],
            'cantidad_meses'    => ['required', 'numeric', 'min:1', 'max:12'],
        ];
    }

    /**
     * Prepare the data for validation.
     *
     * @return void
     */
    protected function prepareForValidation()
    {
        if (is_array($this->rol_sennova)) {
            $this->merge([
                'rol_sennova' => $this->rol_sennova['value'],
            ]);
        }
    }
}
