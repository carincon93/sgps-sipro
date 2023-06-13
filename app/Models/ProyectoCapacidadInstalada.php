<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;

class ProyectoCapacidadInstalada extends Model
{
    use HasFactory;

    /**
     * table
     *
     * @var string
     */
    protected $table = 'proyectos_capacidad_instalada';

    /**
     * appends
     *
     * @var array
     */
    protected $appends = ['fecha_ejecucion', 'codigo', 'beneficiados_text', 'allowed', 'ruta_final_sharepoint'];

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'semillero_investigacion_id',
        'subtipo_proyecto_capacidad_instalada_id',
        'estado_proyecto',
        'titulo',
        'red_conocimiento_id',
        'actividad_economica_id',
        'disciplina_subarea_conocimiento_id',
        'beneficia_a',
        'fecha_inicio',
        'fecha_finalizacion',
        'planteamiento_problema',
        'justificacion',
        'objetivo_general',
        'metodologia',
        'infraestructura_desarrollo_proyecto',
        'materiales_formacion_a_usar',
        'conclusiones',
        'bibliografia',
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        //
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        //
    ];

    /**
     * Relationship with SemilleroInvestigacion
     *
     * @return object
     */
    public function semilleroInvestigacion()
    {
        return $this->belongsTo(SemilleroInvestigacion::class);
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
     * Relationship with DisciplinaSubareaConocimiento
     *
     * @return object
     */
    public function disciplinaSubareaConocimiento()
    {
        return $this->belongsTo(DisciplinaSubareaConocimiento::class);
    }

    /**
     * Relationship with SubtipoProyectoCapacidadInstalada
     *
     * @return object
     */
    public function subtipoProyectoCapacidadInstalada()
    {
        return $this->belongsTo(SubtipoProyectoCapacidadInstalada::class);
    }

    /**
     * Relationship with ActividadEconomica
     *
     * @return object
     */
    public function actividadEconomica()
    {
        return $this->belongsTo(ActividadEconomica::class);
    }

    /**
     * Relationship with ProgramaFormacion
     *
     * @return object
     */
    public function programasFormacion()
    {
        return $this->belongsToMany(ProgramaFormacion::class, 'proyecto_capacidad_programa_formacion', 'proyecto_capacidad_instalada_id', 'programa_formacion_id');
    }

    /**
     * Relationship with ProyectoCapacidadInstaladaEntidadAliada
     *
     * @return object
     */
    public function entidadesAliadas()
    {
        return $this->hasMany(ProyectoCapacidadInstaladaEntidadAliada::class);
    }

    /**
     * Relationship with ProyectoCapacidadInstaladaObjetivoEspecifico
     *
     * @return object
     */
    public function objetivosEspecificos()
    {
        return $this->hasMany(ProyectoCapacidadInstaladaObjetivoEspecifico::class);
    }

    /**
     * Relationship with User
     *
     * @return object
     */
    public function integrantes()
    {
        return $this->belongsToMany(User::class, 'proyecto_capacidad_instalada_integrante', 'proyecto_capacidad_instalada_id', 'user_id')->withPivot('rol_sennova', 'cantidad_meses', 'cantidad_horas', 'autor_principal');
    }

    /**
     * Filtrar registros
     *
     * @param  mixed $query
     * @param  mixed $filters
     * @return void
     */
    public function scopeFilterProyectoCapacidadInstalada($query, array $filters)
    {
        $query->when($filters['search'] ?? null, function ($query, $search) {
            $query->where('titulo', 'ilike', '%' . $search . '%');
        });
    }

    /**
     * getUpdatedAtAttribute
     *
     * @return void
     */
    public function getUpdatedAtAttribute($value)
    {
        return "Última modificación de este formulario: " . Carbon::parse($value, 'UTC')->timezone('America/Bogota')->locale('es')->isoFormat('DD [de] MMMM [de] YYYY [a las] HH:mm:ss');
    }

    /**
     * getFechaEjecucionAttribute
     *
     * @return void
     */
    public function getFechaEjecucionAttribute()
    {
        $fecha_inicio       = Carbon::parse($this->fecha_inicio, 'UTC')->locale('es')->isoFormat('DD [de] MMMM [de] YYYY');
        $fecha_finalizacion = Carbon::parse($this->fecha_finalizacion, 'UTC')->locale('es')->isoFormat('DD [de] MMMM [de] YYYY');
        return "$fecha_inicio al $fecha_finalizacion";
    }

    /**
     * getEstadoProyectoAttribute
     *
     * @param  mixed $value
     * @return void
     */
    public function getEstadoProyectoAttribute($value)
    {
        switch ($value) {
            case 1:
                $value = 'Propuesta';
                break;
            case 2:
                $value = 'En ejecución';
                break;
            case 3:
                $value = 'Finalizado';
                break;
            default:
                break;
        }
        return $value;
    }

    /**
     * getProyectosPorRol
     *
     * @return object
     */
    public static function getProyectosPorRol()
    {
        /** @var \App\Models\User */
        $authUser = Auth::user();

        if ($authUser->hasRole(1) || $authUser->getAllPermissions()->where('id', 22)->first()) { // Admin
            $proyectoCapacidadInstalada = ProyectoCapacidadInstalada::select('proyectos_capacidad_instalada.*')
                ->distinct('proyectos_capacidad_instalada.id')
                ->orderBy('proyectos_capacidad_instalada.id', 'ASC')
                ->filterProyectoCapacidadInstalada(request()->only('search'))->paginate();
        } else if ($authUser->hasRole(4) && $authUser->dinamizadorCentroFormacion || $authUser->hasRole(3) && $authUser->subdirectorCentroFormacion || $authUser->hasRole(21)) { // Dinamizador SENNOVA o Subdirector de centro
            $centroFormacionId = null;
            if ($authUser->hasRole(4)) {
                $centroFormacionId = $authUser->dinamizadorCentroFormacion->id;
            } else if ($authUser->hasRole(21)) {
                $centroFormacionId = $authUser->centroFormacion->id;
            } else if ($authUser->hasRole(3)) {
                $centroFormacionId = $authUser->subdirectorCentroFormacion->id;
            }

            $proyectoCapacidadInstalada = ProyectoCapacidadInstalada::select('proyectos_capacidad_instalada.*')
                ->join('semilleros_investigacion', 'proyectos_capacidad_instalada.semillero_investigacion_id', 'semilleros_investigacion.id')
                ->join('lineas_investigacion', 'semilleros_investigacion.linea_investigacion_id', 'lineas_investigacion.id')
                ->join('grupos_investigacion', 'lineas_investigacion.grupo_investigacion_id', 'grupos_investigacion.id')
                ->join('centros_formacion', 'grupos_investigacion.centro_formacion_id', 'centros_formacion.id')
                ->where('centros_formacion.id', $centroFormacionId)
                ->distinct('proyectos_capacidad_instalada.id')
                ->orderBy('proyectos_capacidad_instalada.id', 'ASC')
                ->filterProyectoCapacidadInstalada(request()->only('search'))->paginate();
        } else {
            $proyectoCapacidadInstalada = ProyectoCapacidadInstalada::select('proyectos_capacidad_instalada.*')
                ->join('proyecto_capacidad_instalada_integrante', 'proyectos_capacidad_instalada.id', 'proyecto_capacidad_instalada_integrante.proyecto_capacidad_instalada_id')
                ->where('proyecto_capacidad_instalada_integrante.user_id', $authUser->id)
                ->distinct('proyectos_capacidad_instalada.id')
                ->orderBy('proyectos_capacidad_instalada.id', 'ASC')
                ->filterProyectoCapacidadInstalada(request()->only('search'))->paginate();
        }
        return $proyectoCapacidadInstalada;
    }

    /**
     * Get codigo e.g. cAPP-00011
     *
     * @return string
     */
    public function getCodigoAttribute()
    {
        $numeroConsecutivo = sprintf("%05s", $this->id);
        $codigo = 'CAP-' . $numeroConsecutivo;

        return $codigo;
    }

    /**
     *
     * @return string
     */
    public function getBeneficiadosTextAttribute()
    {
        $beneficiado = '';

        switch ($this->beneficia_a) {
            case 1:
                $beneficiado = 'Centro de formación';
                break;
            case 2:
                $beneficiado = 'Empresas';
                break;
            case 3:
                $beneficiado = 'Emprendedores';
                break;
            case 4:
                $beneficiado = 'Comunidades desplazadas';
                break;
            case 5:
                $beneficiado = 'Comunidades vulnerables';
                break;
            case 6:
                $beneficiado = 'Dirigido a mujeres';
                break;
            case 7:
                $beneficiado = 'Población con habilidades diversas';
                break;
            case 8:
                $beneficiado = 'Población indígena';
                break;
            case 9:
                $beneficiado = 'Víctimas del conflicto armado';
                break;
            case 10:
                $beneficiado = 'Ninguna';
                break;
            case 11:
                $beneficiado = 'Otra';
                break;

            default:
                break;
        }

        return $beneficiado;
    }

    public function getRutaFinalSharepointAttribute()
    {
        $ruta = '';
        if ($this->semilleroInvestigacion) {
            $ruta = trim($this->semilleroInvestigacion->lineaInvestigacion->grupoInvestigacion->centroFormacion->nombre_carpeta_sharepoint . '/PROYECTOS-CAPACIDAD-INSTALADA/' . $this->codigo);
        }

        return $ruta;
    }

    public function getAllowedAttribute()
    {
        if (str_contains(request()->route()->uri, 'proyectos-capacidad-instalada')) {

            $allowedToView      = Gate::inspect('view', [ProyectoCapacidadInstalada::class, $this]);
            $allowedToUpdate    = Gate::inspect('update', [ProyectoCapacidadInstalada::class, $this]);
            $allowedToDestroy   = Gate::inspect('delete', [ProyectoCapacidadInstalada::class, $this]);

            return collect(['to_view' => $allowedToView->allowed(), 'to_update' => $allowedToUpdate->allowed(), 'to_destroy' => $allowedToDestroy->allowed()]);
        }
    }
}
