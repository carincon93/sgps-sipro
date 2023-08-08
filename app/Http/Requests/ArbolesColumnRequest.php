<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ArbolesColumnRequest extends FormRequest
{
    private $columnsRules = [
        'problema_central'              => ['nullable','string'],
        'justificacion_problema'        => ['nullable','string'],
        'identificacion_problema'       => ['nullable','string'],
        'pregunta_formulacion_problema' => ['nullable','string'],
        'objetivo_general'              => ['nullable','string'],
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
