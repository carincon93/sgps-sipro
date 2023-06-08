<?php

namespace App\Http\Requests\Evaluacion;

use Illuminate\Foundation\Http\FormRequest;

class EvaluacionRequest extends FormRequest
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
                'user_id'       => ['required', 'integer', 'min:0', 'max:2147483647', 'exists:users,id'],
                'habilitado'    => ['required', 'boolean'],
                // 'finalizado'    => ['required', 'boolean'],
            ];
        } else {
            return [
                'proyecto_id'   => ['required', 'integer', 'min:0', 'max:2147483647', 'exists:proyectos,id'],
                'user_id'       => ['required', 'integer', 'min:0', 'max:2147483647', 'exists:users,id'],
                'habilitado'    => ['required', 'boolean'],
                // 'finalizado'    => ['required', 'boolean'],
            ];
        }
    }

    /**
     * Prepare the data for validation.
     *
     * @return void
     */
    protected function prepareForValidation()
    {
        if (is_array($this->proyecto_id)) {
            $this->merge([
                'proyecto_id' => $this->proyecto_id['value'],
            ]);
        }

        if (is_array($this->user_id)) {
            $this->merge([
                'user_id' => $this->user_id['value'],
            ]);
        }
    }
}
