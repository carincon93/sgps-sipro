<?php

namespace App\Models;

use Carbon\Carbon;
use DateTimeInterface;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;

class ServicioTecnologico extends Model
{
    use HasFactory;

    /**
     * table
     *
     * @var string
     */
    protected $table = 'servicios_tecnologicos';

    /**
     * appends
     *
     * @var array
     */
    protected $appends = ['fecha_ejecucion'];

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'tipo_proyecto_st_id',
        'titulo',
        'resumen',
        'nombre_area_tecnica',
        'antecedentes',
        'problema_central',
        'justificacion_problema',
        'identificacion_problema',
        'pregunta_formulacion_problema',
        'objetivo_general',
        'metodologia',
        'fecha_inicio',
        'fecha_finalizacion',
        'propuesta_sostenibilidad',
        'zona_influencia',
        'bibliografia',
        'max_meses_ejecucion',
        'video',
        'especificaciones_area',
        'infraestructura_adecuada',
        'estado_sistema_gestion_id'
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
     * Prepare a date for array / JSON serialization.
     *
     * @param  \DateTimeInterface  $date
     * @return string
     */
    protected function serializeDate(DateTimeInterface $date)
    {
        return $date->format('Y-m-d H:i:s');
    }

    /**
     * Relationship with Proyecto
     *
     * @return object
     */
    public function proyecto()
    {
        return $this->belongsTo(Proyecto::class, 'id');
    }

    /**
     * Relationship with TipoProyectoSt
     *
     * @return object
     */
    public function tipoProyectoSt()
    {
        return $this->belongsTo(TipoProyectoSt::class);
    }

    /**
     * Relationship with EstadoSistemaGestion
     *
     * @return object
     */
    public function estadoSistemaGestion()
    {
        return $this->belongsTo(EstadoSistemaGestion::class);
    }

    /**
     * Filtrar registros
     *
     * @param  mixed $query
     * @param  mixed $filters
     * @return void
     */
    public function scopeFilterServicioTecnologico($query, array $filters)
    {
        $query->when($filters['search'] ?? null, function ($query, $search) {
            $search = str_replace('"', "", $search);
            $search = str_replace("'", "", $search);
            $search = str_replace(' ', '%%', $search);
            $query->whereRaw("unaccent(titulo) ilike unaccent('%" . $search . "%')");
            if (is_numeric($search)) {
                $query->orWhere('servicios_tecnologicos.id', $search - 8000);
            }
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
     * getProyectosPorRol
     *
     * @param  mixed $convocatoria
     * @return object
     */
    public static function getProyectosPorRol($convocatoria)
    {
        /** @var \App\Models\User */
        $authUser = Auth::user();

        $servicioTecnologico = ServicioTecnologico::select('servicios_tecnologicos.id', 'servicios_tecnologicos.titulo', 'servicios_tecnologicos.fecha_inicio', 'servicios_tecnologicos.fecha_finalizacion')
            ->join('proyectos', 'servicios_tecnologicos.id', 'proyectos.id')
            ->where('proyectos.convocatoria_id', $convocatoria->id)
            ->whereHas(
                'proyecto.centroFormacion',
                function ($query) use ($convocatoria, $authUser) {
                    if ($authUser->hasRole([2])) {
                        $query->where('centros_formacion.regional_id', $authUser->centroFormacion->regional->id);
                        $query->where('proyectos.convocatoria_id', $convocatoria->id);
                    } else if ($authUser->hasRole([3, 4, 21, 27])) {
                        $query->where('centros_formacion.id', $authUser->centro_formacion_id);
                        $query->where('proyectos.convocatoria_id', $convocatoria->id);
                    } else if ($authUser->hasRole([1, 19, 23])) {
                        $query->where('proyectos.convocatoria_id', $convocatoria->id);
                    } else {
                        $query->join('proyectos', 'servicios_tecnologicos.id', 'proyectos.id');
                        $query->join('proyecto_participantes', 'proyectos.id', 'proyecto_participantes.proyecto_id');
                        $query->where('proyecto_participantes.user_id', $authUser->id);
                        $query->where('proyectos.convocatoria_id', $convocatoria->id);
                    }
                }
            )
            ->distinct()
            ->orderBy('servicios_tecnologicos.id', 'ASC')
            ->filterServicioTecnologico(request()->only('search'))->paginate();


        $servicioTecnologico->load('proyecto');

        return $servicioTecnologico;
    }
}
