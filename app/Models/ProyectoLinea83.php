<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;
use DateTimeInterface;
use Illuminate\Support\Facades\Auth;

class ProyectoLinea83 extends Model
{
    use HasFactory;

    /**
     * table
     *
     * @var string
     */
    protected $table = 'proyectos_linea_83';

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
        'id',
        'titulo',
        'fecha_inicio',
        'fecha_finalizacion',
        'max_meses_ejecucion',
        'resumen',
        'antecedentes',
        'retos_prioridades',
        'contribucion_agenda_regional_competitividad',
        'aportes_conpes',
        'estado_actual_ecosistema_ctel',
        'logros_implementacion_ctel',
        'justificacion_pertinencia_territorio',
        'marco_conceptual',
        'bibliografia',
        'aporta_fortalecimiento_cadenas_agricolas',
        'estrategias_generacion_electrica',
        'estrategias_fortalecimiento_micronegocios',
        'estrategias_articulacion_campesinos',
        'impacto_centros_formacion',
        'articulacion_semilleros_grupos_investigacion',
        'articulacion_linea_68',
        'articulacion_linea_69_y_hubs',
        'articulacion_centros_desarrollo_empresarial',
        'contribucion_formacion_regional_nacional',
        'proyeccion_capacidades_tecnologicas_empresas',
        'identificacion_problema',
        'justificacion_problema',
        'problema_central',
        'objetivo_general',
        'metodologia',
        'departamentos_a_impactar',
        'estrategias_atencion_empresas_municipios',
        'estrategias_promover_logros',
        'estrategias_visibilizacion',
        'estrategias_productividad_agropecuaria_agroindustrial',
        'propuesta_sostenibilidad',
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
     * Filtrar registros
     *
     * @param  mixed $query
     * @param  mixed $filters
     * @return void
     */
    public function scopeFilterProyectoLinea83($query, array $filters)
    {
        $query->when($filters['search'] ?? null, function ($query, $search) {
            $search = str_replace('"', "", $search);
            $search = str_replace("'", "", $search);
            $search = str_replace(' ', '%%', $search);
            $query->where('resumen', 'ilike', '%' . $search . '%');
            if (is_numeric($search)) {
                $query->orWhere('proyectos_linea_83.id', $search - 8000);
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
        $auth_user = Auth::user();

        $proyectos_linea_83 = ProyectoLinea83::select('proyectos_linea_83.id', 'proyectos_linea_83.titulo', 'proyectos_linea_83.fecha_inicio', 'proyectos_linea_83.fecha_finalizacion')
            ->join('proyectos', 'proyectos_linea_83.id', 'proyectos.id')
            ->join('centros_formacion', 'proyectos.centro_formacion_id', 'centros_formacion.id')
            ->whereHas(
                'proyecto.centroFormacion',
                function ($query) use ($convocatoria, $auth_user) {

                    if ($auth_user->hasRole([2]) && !$auth_user->hasRole([1])) {
                        $query->where('centros_formacion.regional_id', $auth_user->centroFormacion->regional->id);
                        $query->where('proyectos.convocatoria_id', $convocatoria->id);
                    } else if ($auth_user->hasRole([3, 4, 21, 24, 27]) && !$auth_user->hasRole([1])) {
                        $query->where('centros_formacion.id', $auth_user->centro_formacion_id);
                        $query->where('proyectos.convocatoria_id', $convocatoria->id);

                        $query->join('proyectos', 'proyectos_linea_83.id', 'proyectos.id');
                        $query->join('proyecto_participantes', 'proyectos.id', 'proyecto_participantes.proyecto_id');
                        $query->orWhere('proyecto_participantes.user_id', $auth_user->id);
                        $query->where('proyectos.convocatoria_id', $convocatoria->id);
                    } else if ($auth_user->hasRole([1, 17, 23])) {
                        $query->where('proyectos.convocatoria_id', $convocatoria->id);
                    } else {
                        $query->join('proyectos', 'proyectos_linea_83.id', 'proyectos.id');
                        $query->join('proyecto_participantes', 'proyectos.id', 'proyecto_participantes.proyecto_id');
                        $query->where('proyecto_participantes.user_id', $auth_user->id);
                        $query->where('proyectos.convocatoria_id', $convocatoria->id);
                    }
                }
            )
            ->distinct()
            ->orderBy('proyectos_linea_83.id', 'ASC')
            ->filterProyectoLinea83(request()->only('search'))->paginate();

        $proyectos_linea_83->load('proyecto');
        $proyectos_linea_83->load('proyecto.evaluaciones');

        return $proyectos_linea_83;
    }
}
