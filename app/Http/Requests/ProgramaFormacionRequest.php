<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ProgramaFormacionRequest extends FormRequest
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
            // 'centro_formacion_id'   => ['required', 'min:0', 'max:2147483647', 'integer', 'exists:centros_formacion,id'],
            'nombre'                => ['required', 'max:191'],
            'codigo'                => ['required', 'min:0', 'max:2147483647', 'integer'],
            'modalidad'             => ['required', 'integer', 'min:0', 'max:10'],
            'nivel_formacion'       => ['required', 'integer', 'min:0', 'max:10'],
            'registro_calificado'   => ['nullable', 'boolean'],
        ];
    }

    /**
     * Prepare the data for validation.
     *
     * @return void
     */
    protected function prepareForValidation()
    {
        $this->merge([
            'nombre' => mb_strtolower($this->nombre),
        ]);
    }
}
