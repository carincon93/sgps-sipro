<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CadenaValorColumnRequest extends FormRequest
{
    private $columnsRules = [
        'propuesta_sostenibilidad'            => ['nullable','string'],
        'propuesta_sostenibilidad_social'     => ['nullable','string'],
        'propuesta_sostenibilidad_ambiental'  => ['nullable','string'],
        'propuesta_sostenibilidad_financiera' => ['nullable','string'],
    ];
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
        if ($this->columnsRules[$this->is_array ? $this->route('column').'*' : $this->route('column')]) {
            return [
                $this->route('column') => $this->columnsRules[$this->is_array ? $this->route('column').'*' : $this->route('column')]
            ];
        } else {
            return [
                'column' => 'required'
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
        //
    }
}
