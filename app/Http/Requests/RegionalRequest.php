<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RegionalRequest extends FormRequest
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
                'region_id'             => ['required', 'min:0', 'max:2147483647', 'integer', 'exists:regiones,id'],
                'director_regional_id'  => ['required', 'min:0', 'max:2147483647', 'integer', 'exists:users,id'],
                'nombre'                => ['required', 'max:191', 'string'],
                'codigo'                => ['required', 'min:0', 'max:2147483647', 'integer', 'unique:regionales,codigo,' . $this->route('regional')->id . ',id'],
            ];
        } else {
            return [
                'region_id'             => ['required', 'min:0', 'max:2147483647', 'integer', 'exists:regiones,id'],
                'director_regional_id'  => ['required', 'min:0', 'max:2147483647', 'integer', 'exists:users,id'],
                'nombre'                => ['required', 'max:191', 'string'],
                'codigo'                => ['required', 'min:0', 'max:2147483647', 'integer']
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
        if (is_array($this->region_id)) {
            $this->merge([
                'region_id' => $this->region_id['value'],
            ]);
        }

        if (is_array($this->director_regional_id)) {
            $this->merge([
                'director_regional_id' => $this->director_regional_id['value'],
            ]);
        }
    }
}
