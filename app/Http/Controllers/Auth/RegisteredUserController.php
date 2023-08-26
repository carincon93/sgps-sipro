<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\RegisteredUserRequest;
use App\Models\CentroFormacion;
use App\Models\Municipio;
use App\Models\Role;
use App\Models\User;
use App\Providers\RouteServiceProvider;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(Request $request): Response
    {
        return Inertia::render('Auth/Register', [
            'centros_formacion'     => CentroFormacion::selectRaw('centros_formacion.id as value, concat(centros_formacion.nombre, chr(10), \'Código: \', centros_formacion.codigo, chr(10), \'Regional: \', regionales.nombre) as label')->join('regionales', 'centros_formacion.regional_id', 'regionales.id')->orderBy('centros_formacion.nombre', 'ASC')->get(),
            'roles'                 => Role::select('id', 'name')->where('name', 'ilike', "%Proponente%")->orWhere('name', 'ilike', "%Aprendiz%")->orWhere('name', 'ilike', "%Facilitador%")->orWhere('name', 'ilike', "%Evaluador%")->get(),
            'opciones_genero'       => json_decode(Storage::get('json/generos.json'), true),
            'municipios'            => Municipio::selectRaw('id as value, nombre as label')->get(),
            'tipos_documento'       => json_decode(Storage::get('json/tipos-documento.json'), true),
            'tipos_vinculacion'     => json_decode(Storage::get('json/tipos-vinculacion.json'), true),
            'user'                  => User::where('numero_documento', $request->numero_documento)->first()
        ]);
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(RegisteredUserRequest $request): RedirectResponse
    {
        $user = User::create([
            'nombre'                => $request->nombre,
            'email'                 => $request->email,
            'password'              => Hash::make($request->password),
            'tipo_documento'        => $request->tipo_documento,
            'numero_documento'      => $request->numero_documento,
            'numero_celular'        => $request->numero_celular,
            'habilitado'            => true,
            'tipo_vinculacion'      => $request->tipo_vinculacion,
            'autorizacion_datos'    => $request->autorizacion_datos,
            'centro_formacion_id'   => $request->centro_formacion_id,
            'lugar_expedicion_id'   => $request->lugar_expedicion_id,
            'genero'                => $request->genero,
            'fecha_nacimiento'      => $request->fecha_nacimiento
        ]);

        event(new Registered($user));

        Auth::login($user);

        return redirect(RouteServiceProvider::HOME);
    }
}
