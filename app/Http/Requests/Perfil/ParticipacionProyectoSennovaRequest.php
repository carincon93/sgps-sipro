<?php

namespace App\Http\Requests\Perfil;

use Illuminate\Foundation\Http\FormRequest;

class ParticipacionProyectoSennovaRequest extends FormRequest
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
            'tipo_proyecto'                 => ['required', 'integer', 'min:1', 'max:9'],
            'fecha_inicio_proyecto'         => ['required', 'date_format:Y-m-d'],
            'fecha_finalizacion_proyecto'   => ['required', 'date_format:Y-m-d'],
            'titulo'                        => ['required', 'string'],
            'codigo_proyecto'               => ['required', 'string', 'max:20'],
        ];
    }

    /**
     * Prepare the data for validation.
     *
     * @return void
     */
    protected function prepareForValidation()
    {
        if (is_array($this->tipo_proyecto)) {
            $this->merge([
                'tipo_proyecto' => $this->tipo_proyecto['value'],
            ]);
        }
    }
}
