<?php

namespace App\Http\Controllers;

use App\Helpers\SelectHelper;
use App\Helpers\SharepointHelper;
use App\Http\Requests\Perfil\UserProfileRequest;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Models\CentroFormacion;
use App\Models\DisciplinaSubareaConocimiento;
use App\Models\Municipio;
use App\Models\Perfil\EstudioAcademico;
use App\Models\Perfil\FormacionAcademicaSena;
use App\Models\Perfil\ParticipacionGrupoInvestigacionSena;
use App\Models\Perfil\ParticipacionProyectoSennova;
use App\Models\RedConocimiento;
use App\Models\Role;
use App\Models\RolSennova;
use App\Models\User;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $this->authorize('viewAny', [User::class]);

        return Inertia::render('Users/Index', [
            'filters'           => request()->all('search', 'roles'),
            'usuarios'          => User::getUsersByRol()->appends(['search' => request()->search, 'roles' => request()->roles]),
            'roles'             => Role::orderBy('name', 'ASC')->get(),
            'allowedToCreate'   => Gate::inspect('create', [User::class])->allowed()
        ]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        $this->authorize('create', [User::class]);

        return Inertia::render('Users/Create', [
            'tiposDocumento'        => json_decode(Storage::get('json/tipos-documento.json'), true),
            'tiposVinculacion'      => json_decode(Storage::get('json/tipos-vinculacion.json'), true),
            'roles'                 => Role::select('id', 'name')->get('id'),
            'centrosFormacion'      => SelectHelper::centrosFormacion(),
            'allowedToCreate'       => Gate::inspect('create', [User::class])->allowed()
        ]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(StoreUserRequest $request)
    {
        $this->authorize('create', [User::class]);

        $user = new User();

        $user->nombre               = $request->nombre;
        $user->email                = $request->email;
        $user->password             = $user::makePassword($request->numero_documento);
        $user->tipo_documento       = $request->tipo_documento;
        $user->numero_documento     = $request->numero_documento;
        $user->numero_celular       = $request->numero_celular;
        $user->habilitado           = $request->habilitado;
        $user->tipo_vinculacion     = $request->tipo_vinculacion;
        $user->autorizacion_datos   = $request->autorizacion_datos;
        $user->centroFormacion()->associate($request->centro_formacion_id);

        $user->save();

        if (in_array(4, $request->role_id)) {
            CentroFormacion::where('id', $request->centro_formacion_id)->update(['dinamizador_sennova_id' => $user->id]);
        }

        $user->assignRole($request->role_id);
        $user->syncPermissions($request->permission_id);

        return redirect()->route('users.index')->with('success', 'El recurso se ha creado correctamente.');
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\User  $user
     * @return \Illuminate\Http\Response
     */
    public function show(User $user)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\User  $user
     * @return \Illuminate\Http\Response
     */
    public function edit(Request $request, User $user)
    {
        $this->authorize('update', [User::class, $user]);

        /** @var \App\Models\User */
        $authUser = Auth::user();

        if ($request->notificacion) {
            $notificacion = $authUser->unreadNotifications()->where('id', $request->notificacion)->first();
            if ($notificacion) {
                $notificacion->markAsRead();
            }
        }

        if ($user->dinamizadorCentroFormacion) {
            $user->dinamizador_centro_formacion_id = $user->dinamizadorCentroFormacion->id;
        }

        $proyectos = $user->proyectos->load('idi', 'tp.nodoTecnoparque', 'tecnoacademiaLineasTecnoacademia.tecnoacademia', 'culturaInnovacion', 'servicioTecnologico');

        if ($user->hasRole([2, 3, 4, 21])) {
            $proyectos->where('centro_formacion_id', $user->centro_formacion_id);
        }

        return Inertia::render('Users/Edit', [
            'usuario'               => $user,
            'tiposDocumento'        => json_decode(Storage::get('json/tipos-documento.json'), true),
            'tiposVinculacion'      => json_decode(Storage::get('json/tipos-vinculacion.json'), true),
            'rolesRelacionados'     => $user->roles()->pluck('id'),
            'permisosRelacionados'  => $user->permissions()->pluck('id'),
            'roles'                 => Role::getRolesByRol(),
            'proyectos'             => $proyectos,
            'centrosFormacion'      => SelectHelper::centrosFormacion()
        ]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\User  $user
     * @return \Illuminate\Http\Response
     */
    public function update(UpdateUserRequest $request, User $user)
    {
        $this->authorize('update', [User::class, $user]);

        $user->nombre               = $request->nombre;
        $user->email                = $request->email;
        $user->tipo_documento       = $request->tipo_documento;
        $user->numero_documento     = $request->numero_documento;
        $user->numero_celular       = $request->numero_celular;
        $user->habilitado           = $request->habilitado;
        $user->tipo_vinculacion     = $request->tipo_vinculacion;
        $user->autorizacion_datos   = $request->autorizacion_datos;
        $user->centroFormacion()->associate($request->centro_formacion_id);

        if ($request->default_password) {
            $user->password = $user::makePassword($request->numero_documento);
        }

        $user->save();

        if (in_array(4, $request->role_id)) {
            CentroFormacion::where('id', $request->centro_formacion_id)->update(['dinamizador_sennova_id' => $user->id]);
        }

        $user->syncRoles($request->role_id);
        $user->syncPermissions($request->permission_id);

        return back()->with('success', 'El recurso se ha actualizado correctamente.');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\User  $user
     * @return \Illuminate\Http\Response
     */
    public function destroy(User $user)
    {
        $this->authorize('delete', [User::class, $user]);

        try {
            if ($user->hasRole(1)) {
                return back()->with('error', 'No se puede eliminar el recurso debido a que hay información relacionada. Comuníquese con el administrador del sistema.');
            }
            $user->delete();
        } catch (QueryException $e) {
            return back()->with('error', 'No se puede eliminar el recurso debido a que está asociado a uno o varios proyectos.');
        }

        return redirect()->route('users.index')->with('success', 'El recurso se ha eliminado correctamente.');
    }

    /**
     * Show user's perfil.
     *
     * @param  \App\User  $user
     * @return \Illuminate\Http\Response
     */
    public function showPerfil()
    {
        /** @var \App\Models\User */
        $authUser = User::where('id', Auth::user()->id)->first();

        return Inertia::render('Users/Perfil', [
            'user'                                      => $authUser,
            'tiposDocumento'                            => json_decode(Storage::get('json/tipos-documento.json'), true),
            'tiposVinculacion'                          => json_decode(Storage::get('json/tipos-vinculacion.json'), true),
            'nivelesIngles'                             => json_decode(Storage::get('json/niveles-ingles.json'), true),
            'opcionesGenero'                            => json_decode(Storage::get('json/generos.json'), true),
            'gruposEtnicos'                             => json_decode(Storage::get('json/grupos-etnicos.json'), true),
            'tiposDiscapacidad'                         => json_decode(Storage::get('json/tipos-discapacidad.json'), true),
            'subareasExperiencia'                       => json_decode(Storage::get('json/subareas-experiencia.json'), true),
            'municipios'                                => Municipio::selectRaw('id as value, nombre as label')->get(),
            'rolesSennova'                              => RolSennova::selectRaw('id as value, nombre as label')->distinct('nombre')->get(),
            'redesConocimiento'                         => RedConocimiento::selectRaw('id as value, nombre as label')->get(),
            'disciplinasConocimiento'                   => DisciplinaSubareaConocimiento::selectRaw('id as value, nombre as label')->orderBy('nombre', 'ASC')->get(),
            'centrosFormacion'                          => CentroFormacion::selectRaw('centros_formacion.id as value, concat(centros_formacion.nombre, chr(10), \'∙ Código: \', centros_formacion.codigo, chr(10), \'∙ Regional: \', INITCAP(regionales.nombre)) as label')->join('regionales', 'centros_formacion.regional_id', 'regionales.id')->orderBy('centros_formacion.nombre', 'ASC')->get(),
            'estudiosAcademicos'                        => EstudioAcademico::where('user_id', $authUser->id)->get(),
            'formacionesAcademicasSena'                 => FormacionAcademicaSena::where('user_id', $authUser->id)->get(),
            'rolesSennovaRelacionados'                  => RolSennova::select('roles_sennova.id as value', 'roles_sennova.nombre as label')->whereIn('id', [json_decode($authUser->rol_sennova_id)])->get(),
            'participacionesGruposInvestigacionSena'    => ParticipacionGrupoInvestigacionSena::with('semilleroInvestigacion', 'grupoInvestigacion')->where('user_id', $authUser->id)->get(),
            'participacionesProyectosSennova'           => ParticipacionProyectoSennova::where('user_id', $authUser->id)->get(),
            'disciplinasConocimientoRelacionadas'       => DisciplinaSubareaConocimiento::selectRaw('id as value, nombre as label')->whereIn('id', [json_decode($authUser->disciplinas_subarea_conocimiento)])->orderBy('nombre', 'ASC')->get(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\User  $user
     * @return \Illuminate\Http\Response
     */
    public function changeUserProfile(UserProfileRequest $request)
    {
        /** @var \App\Models\User */
        $authUser = Auth::user();

        $authUser->update($request->all());

        if ($request->hasFile('certificado_ingles')) {
            // CENSO2023 Quemado
            $this->saveFilesSharepoint($request->certificado_ingles, 'CENSO2023', $authUser, 'certificado_ingles');
        }

        if ($request->hasFile('archivo_acta_resolucion')) {
            // CENSO2023 Quemado
            $this->saveFilesSharepoint($request->archivo_acta_resolucion, 'CENSO2023', $authUser, 'archivo_acta_resolucion');
        }

        // $authUser->syncRoles($request->role_id);

        return back()->with('success', 'El recurso se ha actualizado correctamente.');
    }

    /**
     * Change user's password.
     *
     * @param  \App\User  $user
     * @return \Illuminate\Http\Response
     */
    public function changePassword(Request $request)
    {
        $request->validate([
            'password' => 'required|string|min:6|different:old_password|confirmed'
        ]);

        /** @var \App\Models\User */
        $authUser = Auth::user();

        if (Hash::check($request->get('old_password'), $authUser->password)) {
            $authUser->password = Hash::make($request->get('password'));
            $authUser->save();
            $message = 'La contraseña se ha actualizado correctamente.';
            $status = 'success';
        } else {
            $message = 'La contraseña actual no coincide.';
            $status = 'error';
        }

        return back()->with($status, $message);
    }

    /**
     * showAllNotifications
     *
     * @param  \App\User  $user
     * @return \Illuminate\Http\Response
     */
    public function showAllNotifications()
    {
        /** @var \App\Models\User */
        $authUser = Auth::user();

        return Inertia::render('Users/Notifications/Index', [
            'filters'           => request()->all('search'),
            'notificaciones'    => $authUser->notifications()->paginate(15)
        ]);
    }

    /**
     * markAsReadNotification
     *
     * @param  mixed $request
     * @return void
     */
    public function markAsReadNotification(Request $request)
    {
        /** @var \App\Models\User */
        $authUser = Auth::user();

        if ($request->notificacion) {
            $notificacion = $authUser->unreadNotifications()->where('id', $request->notificacion)->first();
            if ($notificacion) {
                $notificacion->markAsRead();
            }
        }

        return back();
    }

    public function getNumeroNotificaciones()
    {
        /** @var \App\Models\User */
        $authUser = Auth::user();

        return response()->json(['numeroNotificaciones' => $authUser->unreadNotifications()->count(), 'notificaciones' => $authUser->unreadNotifications()->orderBy('created_at', 'DESC')->take(3)->get()]);
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function enLinea()
    {
        $this->authorize('viewAny', [User::class]);

        return Inertia::render('Users/UsersActivos', [
            'filters'   => request()->all('search'),
            'usuarios'  => User::with('centroFormacion')->join('sessions', 'users.id', 'sessions.user_id')->paginate()
        ]);
    }

    public function saveFilesSharepoint($tmpFile, $modulo, $modelo, $campoBd)
    {
        $user = Auth::user();

        $centroFormacionSharePoint = $user->centroFormacion->nombre_carpeta_sharepoint;

        $sharePointPath = "$modulo/$centroFormacionSharePoint/$user->nombre_carpeta_sharepoint";
        SharepointHelper::saveFilesSharepoint($tmpFile, $modelo, $sharePointPath, $campoBd);
    }
}
