<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreGrupoInvestigacionRequest extends FormRequest
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
            'centro_formacion_id'                   => ['required', 'min:0', 'max:2147483647', 'integer', 'exists:centros_formacion,id'],
            'nombre'                                => ['required', 'max:191', 'string'],
            'acronimo'                              => ['nullable', 'max:191'],
            'email'                                 => ['required', 'max:191', 'email'],
            'enlace_gruplac'                        => ['required', 'url', 'string'],
            'codigo_minciencias'                    => ['required', 'max:10', 'string', 'unique:grupos_investigacion,codigo_minciencias'],
            'categoria_minciencias'                 => ['required', 'max:16'],
            'mision'                                => ['required', 'string'],
            'vision'                                => ['required', 'string'],
            'fecha_creacion_grupo'                  => ['required', 'date', 'date_format:Y-m-d'],
            'nombre_lider_grupo'                    => ['required', 'string', 'max:191'],
            'email_contacto'                        => ['required', 'max:191', 'email'],
            'programa_nal_ctei_principal'           => ['required', 'string', 'max:191'],
            'programa_nal_ctei_secundaria'          => ['required', 'string', 'max:191'],
            'reconocimientos_grupo_investigacion'   => ['required', 'string'],
            'objetivo_general'                      => ['required', 'string'],
            'objetivos_especificos'                 => ['required', 'string'],
            'link_propio_grupo'                     => ['nullable', 'url', 'string'],
            'redes_conocimiento'                    => ['required']
        ];
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
