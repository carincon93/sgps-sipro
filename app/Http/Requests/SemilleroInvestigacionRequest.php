<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SemilleroInvestigacionRequest extends FormRequest
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
            'es_semillero_tecnoacademia'                => ['required', 'min:0', 'max:3', 'integer'],
            'linea_investigacion_id'                    => ['required', 'min:0', 'max:2147483647999', 'integer', 'exists:lineas_investigacion,id'],
            'nombre'                                    => ['required', 'max:191'],
            'fecha_creacion_semillero'                  => ['required', 'date', 'date_format:Y-m-d'],
            'nombre_lider_semillero'                    => ['required', 'max:191'],
            'email_contacto'                            => ['required', 'max:191', 'email'],
            'reconocimientos_semillero_investigacion'   => ['required'],
            'vision'                                    => ['required'],
            'mision'                                    => ['required'],
            'objetivos_especificos'                     => ['required'],
            'objetivo_general'                          => ['required'],
            'link_semillero'                            => ['nullable', 'url', 'string'],
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
            'es_semillero_tecnoacademia' => $this->es_semillero_tecnoacademia == '1' ? 1 : 0,
        ]);
    }
}
