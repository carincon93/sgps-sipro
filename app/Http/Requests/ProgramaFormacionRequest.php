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
            'nombre'                => ['required', 'max:191'],
            'codigo'                => ['nullable', 'min:0', 'max:2147483647', 'integer'],
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
