<?php

namespace App\Http\Controllers;

use App\Helpers\SelectHelper;
use App\Helpers\SharepointHelper;
use App\Http\Requests\Perfil\UserProfileRequest;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Models\CentroFormacion;
use App\Models\DisciplinaSubareaConocimiento;
use App\Models\GrupoInvestigacion;
use App\Models\Municipio;
use App\Models\Perfil\EstudioAcademico;
use App\Models\Perfil\FormacionAcademicaSena;
use App\Models\Perfil\ParticipacionGrupoInvestigacionSena;
use App\Models\Perfil\ParticipacionProyectoSennova;
use App\Models\RedConocimiento;
use App\Models\Role;
use App\Models\RolSennova;
use App\Models\SemilleroInvestigacion;
use App\Models\SubareaExperiencia;
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
            'allowed_to_create'   => Gate::inspect('create', [User::class])->allowed()
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
            'allowed_to_create'       => Gate::inspect('create', [User::class])->allowed()
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
        $auth_user = Auth::user();

        $proyectos = $user->proyectos->load('proyectoLinea65', 'proyectoLinea66', 'proyectoLinea68', 'proyectoLinea69.nodoTecnoparque', 'tecnoacademiaLineasTecnoacademia.tecnoacademia', );

        if ($user->hasRole([2, 3, 4, 21])) {
            $proyectos->where('centro_formacion_id', $user->centro_formacion_id);
        }

        return Inertia::render('Users/Edit', [
            'usuario'               => $user,
            // 'rolesRelacionados'     => $user->roles()->pluck('id'),
            // 'permisosRelacionados'  => $user->permissions()->pluck('id'),
            // 'roles'                 => Role::getRolesByRol(),
            // 'proyectos'             => $proyectos,
            'centros_formacion'      => SelectHelper::centrosFormacion(),
            'tipos_documento'                               =>  json_decode(Storage::get('json/tipos-documento.json'), true),
            'tipos_vinculacion'                             =>  json_decode(Storage::get('json/tipos-vinculacion.json'), true),
            'niveles_ingles'                                =>  json_decode(Storage::get('json/niveles-ingles.json'), true),
            'opciones_genero'                               =>  json_decode(Storage::get('json/generos.json'), true),
            'grupos_etnicos'                                =>  json_decode(Storage::get('json/grupos-etnicos.json'), true),
            'tipos_discapacidad'                            =>  json_decode(Storage::get('json/tipos-discapacidad.json'), true),
            'subareas_experiencia'                          =>  SubareaExperiencia::selectRaw("subareas_experiencia.id as value, CONCAT(subareas_experiencia.nombre,' - Área de experiencia: ', areas_experiencia.nombre) as label")->join('areas_experiencia', 'subareas_experiencia.area_experiencia_id', 'areas_experiencia.id')->orderBy('subareas_experiencia.nombre', 'ASC')->get(),
            'municipios'                                    =>  Municipio::selectRaw('id as value, nombre as label')->get(),
            'roles_sennova'                                 =>  RolSennova::selectRaw("roles_sennova.id as value, CASE
                                                                    WHEN linea_programatica_id IS NOT NULL THEN CONCAT(roles_sennova.nombre,  chr(10), ' - Línea programática ', lineas_programaticas.codigo)
                                                                    ELSE roles_sennova.nombre
                                                                END as label")->leftJoin('lineas_programaticas', 'roles_sennova.linea_programatica_id', 'lineas_programaticas.id')->distinct('roles_sennova.nombre')->get(),
            'redes_conocimiento'                            =>  RedConocimiento::selectRaw('id as value, nombre as label')->get(),
            'disciplinas_conocimiento'                      =>  DisciplinaSubareaConocimiento::selectRaw('id as value, nombre as label')->orderBy('nombre', 'ASC')->get(),
            'estudios_academicos'                           =>  EstudioAcademico::where('user_id', $auth_user->id)->get(),
            'formaciones_academicas_sena'                   =>  FormacionAcademicaSena::where('user_id', $auth_user->id)->get(),
            'participaciones_grupos_investigacion_sena'     =>  ParticipacionGrupoInvestigacionSena::with('semilleroInvestigacion', 'grupoInvestigacion')->where('user_id', $auth_user->id)->get(),
            'participaciones_proyectos_sennova'             =>  ParticipacionProyectoSennova::where('user_id', $auth_user->id)->get(),
            'niveles_academicos'                            => json_decode(Storage::get('json/niveles-academicos.json'), true),
            'niveles_formacion'                             => json_decode(Storage::get('json/niveles-formacion.json'), true),
            'modalidades_estudio'                           => json_decode(Storage::get('json/modalidades-estudio.json'), true),
            'grupos_investigacion'                          => GrupoInvestigacion::selectRaw('grupos_investigacion.id as value, concat(grupos_investigacion.nombre, chr(10), \'∙ Código: \', grupos_investigacion.codigo_minciencias) as label')->orderBy('grupos_investigacion.nombre', 'ASC')->get(),
            'semilleros_investigacion'                      => SemilleroInvestigacion::selectRaw('semilleros_investigacion.id as value, concat(semilleros_investigacion.nombre, chr(10), \'∙ Código: \', semilleros_investigacion.codigo) as label')->orderBy('semilleros_investigacion.nombre', 'ASC')->get(),
            'tipos_proyectos'                               => json_decode(Storage::get('json/tipos-proyectos.json'), true),
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
        $auth_user = User::where('id', Auth::user()->id)->first();

        return Inertia::render('Users/Perfil', [
            'user'                                      => $auth_user,
            'tiposDocumento'                            => json_decode(Storage::get('json/tipos-documento.json'), true),
            'tiposVinculacion'                          => json_decode(Storage::get('json/tipos-vinculacion.json'), true),
            'nivelesIngles'                             => json_decode(Storage::get('json/niveles-ingles.json'), true),
            'opcionesGenero'                            => json_decode(Storage::get('json/generos.json'), true),
            'gruposEtnicos'                             => json_decode(Storage::get('json/grupos-etnicos.json'), true),
            'tiposDiscapacidad'                         => json_decode(Storage::get('json/tipos-discapacidad.json'), true),
            'subareasExperiencia'                       => SubareaExperiencia::selectRaw("subareas_experiencia.id as value, CONCAT(subareas_experiencia.nombre,' - Área de experiencia: ', areas_experiencia.nombre) as label")->join('areas_experiencia', 'subareas_experiencia.area_experiencia_id', 'areas_experiencia.id')->orderBy('subareas_experiencia.nombre', 'ASC')->get(),
            'municipios'                                => Municipio::selectRaw('id as value, nombre as label')->get(),
            'rolesSennova'                              => RolSennova::selectRaw("roles_sennova.id as value, CASE
                                                                WHEN linea_programatica_id IS NOT NULL THEN CONCAT(roles_sennova.nombre,  chr(10), ' - Línea programática ', lineas_programaticas.codigo)
                                                                ELSE roles_sennova.nombre
                                                            END as label")->leftJoin('lineas_programaticas', 'roles_sennova.linea_programatica_id', 'lineas_programaticas.id')->distinct('roles_sennova.nombre')->get(),
            'redesConocimiento'                         => RedConocimiento::selectRaw('id as value, nombre as label')->get(),
            'disciplinasConocimiento'                   => DisciplinaSubareaConocimiento::selectRaw('id as value, nombre as label')->orderBy('nombre', 'ASC')->get(),
            'centrosFormacion'                          => CentroFormacion::selectRaw('centros_formacion.id as value, CONCAT(centros_formacion.nombre, chr(10), \'∙ Código: \', centros_formacion.codigo, chr(10), \'∙ Regional: \', INITCAP(regionales.nombre)) as label')->join('regionales', 'centros_formacion.regional_id', 'regionales.id')->orderBy('centros_formacion.nombre', 'ASC')->get(),
            'estudiosAcademicos'                        => EstudioAcademico::where('user_id', $auth_user->id)->get(),
            'formacionesAcademicasSena'                 => FormacionAcademicaSena::where('user_id', $auth_user->id)->get(),
            'rolesSennovaRelacionados'                  => RolSennova::select('roles_sennova.id as value', 'roles_sennova.nombre as label')->whereIn('id', [json_decode($auth_user->rol_sennova_id)])->get(),
            'participacionesGruposInvestigacionSena'    => ParticipacionGrupoInvestigacionSena::with('semilleroInvestigacion', 'grupoInvestigacion')->where('user_id', $auth_user->id)->get(),
            'participacionesProyectosSennova'           => ParticipacionProyectoSennova::where('user_id', $auth_user->id)->get(),
            'disciplinasConocimientoRelacionadas'       => DisciplinaSubareaConocimiento::selectRaw('id as value, nombre as label')->whereIn('id', $auth_user->disciplinas_subarea_conocimiento ? json_decode($auth_user->disciplinas_subarea_conocimiento) : [])->orderBy('nombre', 'ASC')->get(),
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
        $auth_user = Auth::user();

        $auth_user->update($request->all());

        if ($request->hasFile('certificado_ingles')) {
            // CENSO2023 Quemado
            $this->saveFilesSharepoint($request->certificado_ingles, 'CENSO2023', $auth_user, 'certificado_ingles');
        }

        if ($request->hasFile('archivo_acta_resolucion')) {
            // CENSO2023 Quemado
            $this->saveFilesSharepoint($request->archivo_acta_resolucion, 'CENSO2023', $auth_user, 'archivo_acta_resolucion');
        }

        // $auth_user->syncRoles($request->role_id);

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
        $auth_user = Auth::user();

        if (Hash::check($request->get('old_password'), $auth_user->password)) {
            $auth_user->password = Hash::make($request->get('password'));
            $auth_user->save();
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
        $auth_user = Auth::user();

        return Inertia::render('Users/Notifications/Index', [
            'filters'           => request()->all('search'),
            'notificaciones'    => $auth_user->notifications()->paginate(15)
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
        $auth_user = Auth::user();

        if ($request->notificacion) {
            $notificacion = $auth_user->unreadNotifications()->where('id', $request->notificacion)->first();
            if ($notificacion) {
                $notificacion->markAsRead();
            }
        }

        return back();
    }

    public function getNumeroNotificaciones()
    {
        /** @var \App\Models\User */
        $auth_user = Auth::user();

        return response()->json(['numeroNotificaciones' => $auth_user->unreadNotifications()->count(), 'notificaciones' => $auth_user->unreadNotifications()->orderBy('created_at', 'DESC')->take(3)->get()]);
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

    public function saveFilesSharepoint($tmp_file, $modulo, $modelo, $campo_bd)
    {
        $user = Auth::user();

        $centroFormacionSharePoint = $user->centroFormacion->nombre_carpeta_sharepoint;

        $sharepoint_path = "$modulo/$centroFormacionSharePoint/$user->nombre_carpeta_sharepoint";
        SharepointHelper::saveFilesSharepoint($tmp_file, $modelo, $sharepoint_path, $campo_bd);
    }
}
