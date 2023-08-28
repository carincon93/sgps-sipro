<?php

namespace App\Models;

use App\Models\Perfil\EstudioAcademico;
use App\Models\Perfil\FormacionAcademicaSena;
use App\Models\Perfil\ParticipacionGrupoInvestigacionSena;
use App\Models\Perfil\ParticipacionProyectoSennova;
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
use Illuminate\Support\Facades\Log;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, HasRoles;

    /**
     * appends
     *
     * @var array
     */
    protected $appends = ['can', 'can_by_user', 'allowed', 'nombre_carpeta_sharepoint', 'check_soportes_titulo_obtenido', 'check_certificados_formacion', 'tipo_documento_text', 'tipo_vinculacion_text', 'genero_text', 'nivel_ingles_text', 'discapacidad_text', 'roles_fuera_sennova_text', 'tiempo_por_rol_text', 'cursos_de_evaluacion_realizados_text'];

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
        'subarea_experiencia_id',

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
     * Relationship with RolSennova
     *
     * @return object
     */
    public function rolSennova()
    {
        return $this->belongsTo(RolSennova::class);
    }

    /**
     * Relationship with SubareaExperiencia
     *
     * @return object
     */
    public function subareaExperiencia()
    {
        return $this->belongsTo(SubareaExperiencia::class);
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
     * Relationship with EstudioAcademico
     *
     * @return object
     */
    public function estudiosAcademicos()
    {
        return $this->hasMany(EstudioAcademico::class);
    }

    /**
     * Relationship with FormacionAcademicaSena
     *
     * @return object
     */
    public function formacionesAcademicasSena()
    {
        return $this->hasMany(FormacionAcademicaSena::class);
    }

    /**
     * Relationship with ParticipacionGrupoInvestigacionSena
     *
     * @return object
     */
    public function participacionesGruposInvestigacionSena()
    {
        return $this->hasMany(ParticipacionGrupoInvestigacionSena::class);
    }

    /**
     * Relationship with ParticipacionProyectoSennova
     *
     * @return object
     */
    public function participacionesProyectoSennova()
    {
        return $this->hasMany(ParticipacionProyectoSennova::class);
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
     * Relationship with ProyectoIdiTecnoacademia
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

    public function getTipoVinculacionTextAttribute()
    {
        $file_path  = 'json/tipos-vinculacion.json';
        $id         = $this->tipo_vinculacion;
        $key        = 'label';

        return $this->tipo_vinculacion ? $this->getJsonItem($file_path, $id, $key) : null;
    }

    public function getTipoDocumentoTextAttribute()
    {
        $file_path  = 'json/tipos-documento.json';
        $id         = $this->tipo_documento;
        $key        = 'label';

        return $this->tipo_documento ? $this->getJsonItem($file_path, $id, $key) : null;
    }

    public function getNivelInglesTextAttribute()
    {
        $file_path  = 'json/niveles-ingles.json';
        $id         = $this->nivel_ingles;
        $key        = 'label';

        return $this->nivel_ingles ? $this->getJsonItem($file_path, $id, $key) : null;
    }

    public function getGeneroTextAttribute()
    {
        $file_path  = 'json/generos.json';
        $id         = $this->genero;
        $key        = 'label';

        return $this->genero ? $this->getJsonItem($file_path, $id, $key) : null;
    }

    public function getGrupoEtnicoTextAttribute()
    {
        $file_path  = 'json/grupos-etnicos.json';
        $id         = $this->grupo_etnico;
        $key        = 'label';

        return $this->grupo_etnico ? $this->getJsonItem($file_path, $id, $key) : null;
    }

    public function getDiscapacidadTextAttribute()
    {
        $file_path  = 'json/tipos-discapacidad.json';
        $id         = $this->discapacidad;
        $key        = 'label';

        return $this->discapacidad ? $this->getJsonItem($file_path, $id, $key) : null;
    }

    private function getJsonItem($file_path, $id, $key)
    {
        $data   = json_decode(Storage::get($file_path), true);

        $where = function ($item) use ($id) {
            return $item['value'] == $id;
        };

        $filtered_data = array_filter($data, $where);

        return $filtered_data ? reset($filtered_data)[$key] : null;
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
        $auth_user = Auth::user();

        $users = [];
        if ($auth_user->hasRole([1, 21, 17, 18, 20, 19, 5])) {
            $users = User::select('users.id', 'users.nombre', 'users.email', 'centro_formacion_id')->with('roles', 'centroFormacion.regional')->orderBy('nombre', 'ASC')
                ->filterUser(request()->only('search', 'roles'))->paginate();
        } else if ($auth_user->hasRole([3, 4, 21])) {
            if ($auth_user->dinamizadorCentroFormacion()->exists()) {
                $centro_formacion_id = $auth_user->dinamizadorCentroFormacion->id;
            } else {
                $centro_formacion_id = $auth_user->centroFormacion->id;
            }
            $users = User::select('users.id', 'users.nombre', 'users.email', 'centro_formacion_id')->with('roles', 'centroFormacion.regional')->where('centro_formacion_id', $centro_formacion_id)->orderBy('nombre', 'ASC')
                ->filterUser(request()->only('search', 'roles'))->paginate();
        }

        // Director regional
        if ($auth_user->hasRole([2])) {
            $users = User::select('users.id', 'users.nombre', 'users.email', 'users.centro_formacion_id')->join('centros_formacion', 'users.centro_formacion_id', 'centros_formacion.id')->where('centros_formacion.regional_id', $auth_user->centroFormacion->regional_id)->with('roles', 'centroFormacion')->filterUser(request()->only('search', 'roles'))->paginate();
        }

        return $users;
    }

    public function getAllowedAttribute()
    {
        if (str_contains(request()->route()->uri, 'users')) {

            $allowed_to_view      = Gate::inspect('view', [User::class, $this]);
            $allowed_to_update    = Gate::inspect('update', [User::class, $this]);
            $allowed_to_destroy   = Gate::inspect('delete', [User::class, $this]);

            return collect(['to_view' => $allowed_to_view->allowed(), 'to_update' => $allowed_to_update->allowed(), 'to_destroy' => $allowed_to_destroy->allowed()]);
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

    public function getDisciplinasSubareaConocimientoAttribute($value)
    {
        return json_decode($value);
    }

    public function getOtrosRolesSennovaAttribute($value)
    {
        return json_decode($value);
    }

    public function getRolesFueraSennovaAttribute($value)
    {
        return json_decode($value);
    }

    public function getCursosDeEvaluacionRealizadosAttribute($value)
    {
        return json_decode($value);
    }

    public function getCursosDeEvaluacionRealizadosTextAttribute()
    {
        return is_array(json_decode($this->cursos_de_evaluacion_realizados)) ? implode(',' , array_column(json_decode($this->cursos_de_evaluacion_realizados), 'value')) : null;
    }

    public function getRolesFueraSennovaTextAttribute()
    {
        return is_array(json_decode($this->roles_fuera_sennova)) ? implode(',' , array_column(json_decode($this->roles_fuera_sennova), 'value')) : null;
    }

    public function getTiempoPorRolAttribute($value)
    {
        return json_decode($value);
    }

    public function getTiempoPorRolTextAttribute()
    {
        return is_array($this->tiempo_por_rol) ? implode(',' , array_column($this->tiempo_por_rol, 'value')) : null;
    }

    public function getCheckSoportesTituloObtenidoAttribute()
    {
        $count = 0;
        foreach ($this->estudiosAcademicos as $estudio_academico) {
            if ($estudio_academico->soporte_titulo_obtenido == null) {
                $count++;
            }
        }

        return $count;
    }

    public function getCheckCertificadosFormacionAttribute()
    {
        $count = 0;
        foreach ($this->formacionesAcademicasSena as $formacion_academica_sena) {
            if ($formacion_academica_sena->certificado_formacion == null) {
                $count++;
            }
        }

        return $count;
    }
}
