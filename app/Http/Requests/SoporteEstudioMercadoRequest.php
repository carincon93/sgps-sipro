<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SoporteEstudioMercadoRequest extends FormRequest
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
            'concepto'                  => ['nullable', 'max:191', 'string'],
            'nombre_primer_empresa'     => ['nullable', 'max:191', 'string'],
            'nombre_segunda_empresa'    => ['nullable', 'max:191', 'string'],
            'nombre_tercer_empresa'     => ['nullable', 'max:191', 'string'],
            'soporte_primer_empresa'    => ['nullable', 'file', 'max:10000000', 'mimetypes:application/zip,application/octet-stream,application/x-zip-compressed,multipart/x-zip,application/pdf'],
            'soporte_segunda_empresa'   => ['nullable', 'file', 'max:10000000', 'mimetypes:application/zip,application/octet-stream,application/x-zip-compressed,multipart/x-zip,application/pdf'],
            'soporte_tercer_empresa'    => ['nullable', 'file', 'max:10000000', 'mimetypes:application/zip,application/octet-stream,application/x-zip-compressed,multipart/x-zip,application/pdf'],
            'soporte'                   => ['nullable', 'file', 'max:10000000', 'mimetypes:application/zip,application/octet-stream,application/x-zip-compressed,multipart/x-zip,application/pdf'],
        ];
    }
}
