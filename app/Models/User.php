<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;
use Spatie\Permission\Traits\HasRoles;
use Illuminate\Database\Eloquent\Builder;
// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, HasRoles;

    /**
     * appends
     *
     * @var array
     */
    protected $appends = ['can', 'can_by_user', 'allowed', 'nombre_carpeta_sharepoint'];

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'nombre',
        'email',
        'password',
        'tipo_documento',
        'numero_documento',
        'numero_celular',
        'habilitado',
        'tipo_vinculacion',
        'lugar_expedicion_id',
        'genero',
        'fecha_nacimiento',
        'horas_dedicadas',
        'meses_dedicados',
        'nivel_ingles',
        'fecha_resolucion_nombramiento',
        'fecha_acta_nombramiento',
        'nro_acta_nombramiento',
        'grado_sennova',
        'fecha_inicio_contrato',
        'fecha_finalizacion_contrato',
        'asignacion_mensual',
        'cvlac',
        'link_sigep_ii',
        'grupo_etnico',
        'discapacidad',
        'subarea_experiencia_laboral',

        'experiencia_laboral_sena',
        'cursos_evaluacion_proyectos',
        'cursos_de_evaluacion_realizados',
        'experiencia_como_evaluador',
        'numero_proyectos_evaluados',
        'participacion_como_evaluador_sennova',
        'conocimiento_iso_17025',
        'conocimiento_iso_19011',
        'conocimiento_iso_29119',
        'conocimiento_iso_9001',
        'experiencia_metodos_ensayo',
        'meses_experiencia_metodos_ensayo',
        'experiencia_metodos_calibracion',
        'meses_experiencia_metodos_calibracion',
        'experiencia_minima_metodos',
        'roles_fuera_sennova',
        'tiempo_por_rol',
        'autorizacion_datos',

        'informacion_completa',

        'red_conocimiento_id',
        'rol_sennova_id',
        'otros_roles_sennova',
        'disciplinas_subarea_conocimiento',
        'centro_formacion_id',
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password'          => 'hashed',
    ];

    /**
     * Relationship with Proyecto (participants)
     *
     * @return object
     */
    public function proyectos()
    {
        return $this->belongsToMany(Proyecto::class, 'proyecto_participantes', 'user_id', 'proyecto_id')
            ->withPivot([
                'user_id',
                'es_formulador',
                'cantidad_meses',
                'cantidad_horas',
                'rol_sennova'
            ]);
    }

    /**
     * Relationship with CentroFormacion
     *
     * @return object
     */
    public function centroFormacion()
    {
        return $this->belongsTo(CentroFormacion::class);
    }

    /**
     * Relationship with RedConocimiento
     *
     * @return object
     */
    public function redConocimiento()
    {
        return $this->belongsTo(RedConocimiento::class);
    }

    /**
     * Relationship with CentroFormacion
     *
     * @return object
     */
    public function dinamizadorCentroFormacion()
    {
        return $this->hasOne(CentroFormacion::class, 'dinamizador_sennova_id');
    }

    /**
     * Relationship with CentroFormacion
     *
     * @return object
     */
    public function subdirectorCentroFormacion()
    {
        return $this->hasOne(CentroFormacion::class, 'subdirector_id');
    }

    /**
     * Relationship with Regional
     *
     * @return object
     */
    public function directorRegional()
    {
        return $this->hasOne(Regional::class, 'director_regional_id');
    }

    /**
     * Relationship with User
     *
     * @return object
     */
    public function activadoresLineaProgramatica()
    {
        return $this->belongsToMany(LineaProgramatica::class, 'activador_linea_programatica', 'user_id', 'linea_programatica_id');
    }

    /**
     * Relationship with Evaluacion
     *
     * @return object
     */
    public function evaluaciones()
    {
        return $this->hasMany(\App\Models\Evaluacion\Evaluacion::class);
    }

    /**
     * Relationship with AmbienteModernizacion
     *
     * @return object
     */
    public function ambientesModernizacion()
    {
        return $this->hasMany(AmbienteModernizacion::class, 'dinamizador_sennova_id');
    }

    /**
     * Relationship with ProyectoCapacidadInstalada
     *
     * @return object
     */
    public function proyectosCapacidadInstalada()
    {
        return $this->belongsToMany(ProyectoCapacidadInstalada::class, 'proyecto_capacidad_instalada_integrante', 'user_id', 'proyecto_capacidad_instalada_id');
    }

    /**
     * Relationship with ProyectoIdiTecnoacademiaParticipante
     *
     * @return object
     */
    public function proyectosIdiTecnoacademiaParticipante()
    {
        return $this->belongsToMany(ProyectoIdiTecnoacademia::class, 'proyecto_idi_tecnoacademia_participante', 'user_id', 'proyecto_idi_tecnoacademia_id');
    }

    /**
     * Filtrar registros
     *
     * @param  mixed $query
     * @param  mixed $filters
     * @return void
     */
    public function scopeFilterUser($query, array $filters)
    {
        $query->when($filters['search'] ?? null, function ($query, $search) {
            $search = str_replace(' ', '%%', $search);
            $search = str_replace('"', "", $search);
            $search = str_replace("'", "", $search);
            $query->select('users.id', 'users.nombre', 'users.email', 'users.centro_formacion_id');
            $query->join('centros_formacion', 'users.centro_formacion_id', 'centros_formacion.id');
            $query->whereRaw("unaccent(users.nombre) ilike unaccent('%" . $search . "%')");
            $query->orWhere('users.email', 'ilike', '%' . $search . '%');
            $query->orWhere('users.numero_documento', 'ilike', '%' . $search . '%');
            $query->orWhere('centros_formacion.nombre', 'ilike', '%' . $search . '%');
        })->when($filters['roles'] ?? null, function ($query, $role) {
            $query->join('model_has_roles', 'users.id', 'model_has_roles.model_id');
            $query->join('roles', 'model_has_roles.role_id', 'roles.id');
            $query->where('roles.name', 'ilike', '%' . $role . '%');
        });
    }

    /**
     * getUpdatedAtAttribute
     *
     * @return void
     */
    public function getUpdatedAtAttribute($value)
    {
        return "Última modificación de este formulario: " . Carbon::parse($value, 'UTC')->timezone('America/Bogota')->timezone('America/Bogota')->locale('es')->isoFormat('DD [de] MMMM [de] YYYY [a las] HH:mm:ss');
    }

    /**
     * makePassword
     *
     * @param  mixed $numeroDocumento
     * @return void
     */
    public static function makePassword($numeroDocumento)
    {
        return bcrypt("sena$numeroDocumento*");
    }

    /**
     * getTipoVinculacionTextAttribute
     *
     * @return void
     */
    public function getTipoVinculacionTextAttribute()
    {
        $tipos_vinculacion = collect(json_decode(Storage::get('json/tipos-vinculacion.json'), true));
        return ($tipos_vinculacion->where('value', $this->tipo_vinculacion)->first()) ? $tipos_vinculacion->where('value', $this->tipo_vinculacion)->first()['label'] : 'Sin información registrada';
    }

    /**
     * getTipoDocumentoTextAttribute
     *
     * @return void
     */
    public function getTipoDocumentoTextAttribute()
    {
        $tipos_documentos = collect(json_decode(Storage::get('json/tipos-documento.json'), true));
        return ($tipos_documentos->where('value', $this->tipo_documento)->first()) ? $tipos_documentos->where('value', $this->tipo_documento)->first()['label'] : 'Sin información registrada';
    }

    /**
     * getPermissionsAttribute
     *
     * @return void
     */
    public function getCanAttribute()
    {
        return $this->getAllPermissions()->map(function ($t) {
            return ['id' => $t['id']];
        })->pluck('id');
    }

    /**
     * getPermissionsByUserAttribute
     *
     * @return void
     */
    public function getCanByUserAttribute()
    {
        return DB::table('model_has_permissions')->select('permission_id')->where('model_id', $this->id)->get()->pluck('permission_id');
    }

    /**
     * getUsersByRol
     *
     * @return object
     */
    public static function getUsersByRol()
    {
        /** @var \App\Models\User */
        $user = Auth::user();

        if ($user->hasRole(1)) {
            $users = User::select('users.id', 'users.nombre', 'users.email', 'centro_formacion_id')->with('roles', 'centroFormacion')->orderBy('nombre', 'ASC')
                ->filterUser(request()->only('search', 'roles'))->paginate();
        } else if ($user->hasRole([4, 21])) {
            if ($user->dinamizadorCentroFormacion()->exists()) {
                $centroFormacionId = $user->dinamizadorCentroFormacion->id;
            } else {
                $centroFormacionId = $user->centroFormacion->id;
            }
            $users = User::select('users.id', 'users.nombre', 'users.email', 'centro_formacion_id')->with('roles', 'centroFormacion')->where('centro_formacion_id', $centroFormacionId)->orderBy('nombre', 'ASC')
                ->filterUser(request()->only('search', 'roles'))->paginate();
        }

        if ($user->whereHas('roles', function (Builder $query) use ($user) {
            return $query->where('name', 'ilike', '%activador i+d+i%')->where('users.id', $user->id);
        })->first()) {
            $users = User::select('users.id', 'users.nombre', 'users.email', 'centro_formacion_id')->with('roles', 'centroFormacion')->whereHas('roles', function (Builder $query) {
                return $query->where('name', 'ilike', '%proponente i+d+i%');
            })->filterUser(request()->only('search', 'roles'))->paginate();
        }

        if ($user->whereHas('roles', function (Builder $query) use ($user) {
            return $query->where('name', 'ilike', '%activador cultura de la innovación%')->where('users.id', $user->id);
        })->first()) {
            $users = User::select('users.id', 'users.nombre', 'users.email', 'centro_formacion_id')->with('roles', 'centroFormacion')->whereHas('roles', function (Builder $query) {
                return $query->where('name', 'ilike', '%proponente cultura de la innovación%');
            })->filterUser(request()->only('search', 'roles'))->paginate();
        }

        if ($user->whereHas('roles', function (Builder $query) use ($user) {
            return $query->where('name', 'ilike', '%activador tecnoacademia%')->where('users.id', $user->id);
        })->first()) {
            $users = User::select('users.id', 'users.nombre', 'users.email', 'centro_formacion_id')->with('roles', 'centroFormacion')->whereHas('roles', function (Builder $query) {
                return $query->where('name', 'ilike', '%proponente tecnoacademia%');
            })->filterUser(request()->only('search', 'roles'))->paginate();
        }

        if ($user->whereHas('roles', function (Builder $query) use ($user) {
            return $query->where('name', 'ilike', '%activador tecnoparque%')->where('users.id', $user->id);
        })->first()) {
            $users = User::select('users.id', 'users.nombre', 'users.email', 'centro_formacion_id')->with('roles', 'centroFormacion')->whereHas('roles', function (Builder $query) {
                return $query->where('name', 'ilike', '%proponente tecnoparque%');
            })->filterUser(request()->only('search', 'roles'))->paginate();
        }

        if ($user->whereHas('roles', function (Builder $query) use ($user) {
            return $query->where('name', 'ilike', '%activador servicios tecnológicos%')->where('users.id', $user->id);
        })->first()) {
            $users = User::select('users.id', 'users.nombre', 'users.email', 'centro_formacion_id')->with('roles', 'centroFormacion')->whereHas('roles', function (Builder $query) {
                return $query->where('name', 'ilike', '%proponente servicios tecnológicos%');
            })->filterUser(request()->only('search', 'roles'))->paginate();
        }

        return $users;
    }

    public function getAllowedAttribute()
    {
        if (str_contains(request()->route()->uri, 'users')) {

            $allowedToView      = Gate::inspect('view', [User::class, $this]);
            $allowedToUpdate    = Gate::inspect('update', [User::class, $this]);
            $allowedToDestroy   = Gate::inspect('delete', [User::class, $this]);

            return collect(['to_view' => $allowedToView->allowed(), 'to_update' => $allowedToUpdate->allowed(), 'to_destroy' => $allowedToDestroy->allowed()]);
        }
    }

    public function getNombreCarpetaSharepointAttribute()
    {
        return trim(preg_replace('/[^A-Za-z0-9\-ÁÉÍÓÚáéíóúÑñ]/', ' ', mb_strtoupper($this->nombre)));
    }

    public function getNombreAttribute($value)
    {
        return ucwords($value);
    }
}
