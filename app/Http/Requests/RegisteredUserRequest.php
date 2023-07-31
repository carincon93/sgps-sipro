<?php

namespace App\Http\Requests;

use App\Rules\Email;
use Illuminate\Foundation\Http\FormRequest;

class RegisteredUserRequest extends FormRequest
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
            'centro_formacion_id'   => ['required', 'min:0', 'max:2147483647', 'integer', 'exists:centros_formacion,id'],
            'nombre'                => ['required', 'string', 'max:255'],
            'email'                 => ['required', 'string', new Email, 'email', 'max:255', 'unique:users'],
            'password'              => ['required', 'string', 'confirmed', 'min:8'],
            'tipo_documento'        => ['required', 'max:2'],
            'tipo_vinculacion'      => ['required', 'max:191'],
            'numero_documento'      => ['required', 'min:0', 'unique:users,numero_documento', 'max:9223372036854775807', 'integer'],
            'numero_celular'        => ['required', 'min:0', 'max:9223372036854775807', 'integer'],
            'autorizacion_datos'    => ['required', 'boolean'],
            'lugar_expedicion_id'   => ['required', 'min:0', 'max:2147483647', 'integer', 'exists:municipios,id'],
            'fecha_nacimiento'      => ['required', 'date'],
            'genero'                => ['required', 'integer'],
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
            'habilitado' => 1,
        ]);
    }
}
