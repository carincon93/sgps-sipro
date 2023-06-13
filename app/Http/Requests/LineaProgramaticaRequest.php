<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class LineaProgramaticaRequest extends FormRequest
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
            'codigo'                => ['required', 'min:0', 'max:2147483647', 'integer'],
            'descripcion'           => ['required'],
            'categoria_proyecto'    => ['required', 'max:191'],
            'activadores*'          => ['required', 'integer', 'min:0', 'max:2147483647', 'exists:users,id'],
        ];
    }

    /**
     * Prepare the data for validation.
     *
     * @return void
     */
    protected function prepareForValidation()
    {
        if (is_array($this->categoria_proyecto)) {
            $this->merge([
                'categoria_proyecto' => $this->categoria_proyecto['value'],
            ]);
        }

        if (is_array($this->activadores)) {
            if (isset($this->activadores['value']) && is_numeric($this->activadores['value'])) {
                $this->merge([
                    'activadores' => $this->activadores['value'],
                ]);
            } else {
                $activadores = [];
                foreach ($this->activadores as $lider) {
                    if (is_array($lider)) {
                        array_push($activadores, $lider['value']);
                    }
                }
                $this->merge(['activadores' => $activadores]);
            }
        }
    }
}
