<?php

namespace App\Models;

use Carbon\Carbon;
use DateTimeInterface;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;

class ProyectoFormulario12Linea68 extends Model
{
    use HasFactory;

    /**
     * table
     *
     * @var string
     */
    protected $table = 'proyectos_formulario_12_linea_68';

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
        'municipios_influencia',
        'otras_zonas_influencia',
        'bibliografia',
        'max_meses_ejecucion',
        'video',
        'especificaciones_area',
        'infraestructura_adecuada',
        'estado_sistema_gestion_id',
        'tipo_proyecto_linea_68_id',
        'sector_productivo',
        'continuidad'
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
     * Relationship with LaboratorioServicioTecnologico
     *
     * @return object
     */
    public function tipoProyectoLinea68()
    {
        return $this->belongsTo(LaboratorioServicioTecnologico::class, 'tipo_proyecto_linea_68_id');
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
    public function scopeFilterProyectoFormulario12Linea68($query, array $filters)
    {
        $query->when($filters['search'] ?? null, function ($query, $search) {
            $search = str_replace('"', "", $search);
            $search = str_replace("'", "", $search);
            $search = str_replace(' ', '%%', $search);
            $query->whereRaw("unaccent(titulo) ilike unaccent('%" . $search . "%')");
            if (is_numeric($search)) {
                $query->orWhere('proyectos_formulario_12_linea_68.id', $search - 8000);
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

        $proyectos_formulario_12_linea_68 = ProyectoFormulario12Linea68::select('proyectos_formulario_12_linea_68.id', 'proyectos_formulario_12_linea_68.titulo', 'proyectos_formulario_12_linea_68.fecha_inicio', 'proyectos_formulario_12_linea_68.fecha_finalizacion')
            ->join('proyectos', 'proyectos_formulario_12_linea_68.id', 'proyectos.id')
            ->where('proyectos.convocatoria_id', $convocatoria->id)
            ->whereHas(
                'proyecto.centroFormacion',
                function ($query) use ($convocatoria, $auth_user) {
                    if ($auth_user->hasRole([2]) && !$auth_user->hasRole([1])) {
                        $query->where('centros_formacion.regional_id', $auth_user->centroFormacion->regional->id);
                        $query->where('proyectos.convocatoria_id', $convocatoria->id);
                    } else if ($auth_user->hasRole([3, 4, 21, 27]) && !$auth_user->hasRole([1])) {
                        $query->join('proyectos', 'proyectos_formulario_12_linea_68.id', 'proyectos.id');
                        $query->join('proyecto_participantes', 'proyectos.id', 'proyecto_participantes.proyecto_id');

                        $query->where('centros_formacion.id', $auth_user->centro_formacion_id);
                        $query->where('proyectos.convocatoria_id', $convocatoria->id);
                        $query->orWhere('proyecto_participantes.user_id', $auth_user->id);
                        $query->where('proyectos.convocatoria_id', $convocatoria->id);
                    } else if ($auth_user->hasRole([1, 19, 23])) {
                        $query->where('proyectos.convocatoria_id', $convocatoria->id);
                    } else {
                        $query->join('proyectos', 'proyectos_formulario_12_linea_68.id', 'proyectos.id');
                        $query->join('proyecto_participantes', 'proyectos.id', 'proyecto_participantes.proyecto_id');
                        $query->where('proyecto_participantes.user_id', $auth_user->id);
                        $query->where('proyectos.convocatoria_id', $convocatoria->id);
                    }
                }
            )
            ->distinct()
            ->orderBy('proyectos_formulario_12_linea_68.id', 'ASC')
            ->filterProyectoFormulario12Linea68(request()->only('search'))->paginate();


        $proyectos_formulario_12_linea_68->load('proyecto');
        $proyectos_formulario_12_linea_68->load('proyecto.evaluaciones');

        return $proyectos_formulario_12_linea_68;
    }

        public function getMunicipiosInfluenciaAttribute($value)
    {
        return json_decode($value);
    }
}
