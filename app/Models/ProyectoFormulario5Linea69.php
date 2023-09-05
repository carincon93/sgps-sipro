<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;
use DateTimeInterface;
use Illuminate\Support\Facades\Auth;

class ProyectoFormulario5Linea69 extends Model
{
    use HasFactory;

    /**
     * table
     *
     * @var string
     */
    protected $table = 'proyectos_formulario_5_linea_69';

    /**
     * appends
     *
     * @var array
     */
    protected $appends = ['titulo', 'fecha_ejecucion', 'filename', 'extension'];

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'id',
        'nodo_tecnoparque_id',
        'resumen',
        'resumen_regional',
        'antecedentes',
        'antecedentes_regional',
        'problema_central',
        'justificacion_problema',
        'retos_oportunidades',
        'pertinencia_territorio',
        'marco_conceptual',
        'objetivo_general',
        'metodologia',
        'metodologia_local',
        'impacto_municipios',
        'fecha_inicio',
        'fecha_finalizacion',
        'propuesta_sostenibilidad',
        'impacto_centro_formacion',
        'bibliografia',
        'identificacion_problema',
        'aportacion_semilleros_grupos',
        'proyeccion_con_st',
        'proyeccion_extensionismo_tecnologico',
        'proyeccion_centros_desarrollo',
        'proyeccion_formacion_regional',
        'articulacion_agenda_competitividad',
        'aportes_linea_ocho_conpes',
        'estado_ecosistema_ctel',
        'logros_vigencia_anterior',
        'estrategia_articulacion_prox_vigencia',
        'alianzas_estrategicas',
        'estrategia_divulgacion',
        'promover_productividad',
        'departamentos_atencion_talentos',
        'estrategia_atencion_talentos',
        'numero_instituciones',
        'nombre_instituciones',
        'talento_otros_municipios',
        'max_meses_ejecucion',
        'modificable',
        'pdf_proyecto_general',
        'proyecto_base',
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
     * Relationship with NodoTecnoparque
     *
     * @return object
     */
    public function nodoTecnoparque()
    {
        return $this->belongsTo(NodoTecnoparque::class)->orderBy('nombre');
    }

    /**
     * Relationship with Regional
     *
     * @return object
     */
    public function talentosOtrosDepartamentos()
    {
        return $this->belongsToMany(Regional::class, 'talentos_otros_departamentos', 'proyecto_formulario_5_linea_69_id', 'regional_id');
    }

    /**
     * Filtrar registros
     *
     * @param  mixed $query
     * @param  mixed $filters
     * @return void
     */
    public function scopeFilterProyectoFormulario5Linea69($query, array $filters)
    {
        $query->when($filters['search'] ?? null, function ($query, $search) {
            $search = str_replace('"', "", $search);
            $search = str_replace("'", "", $search);
            $search = str_replace(' ', '%%', $search);
            $query->where('resumen', 'ilike', '%' . $search . '%');
            if (is_numeric($search)) {
                $query->orWhere('proyectos_formulario_5_linea_69.id', $search - 8000);
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
     * getTituloAttribute
     *
     * @return void
     */
    public function getTituloAttribute()
    {
        return "Red Tecnoparque Nodo " . ucfirst($this->nodoTecnoparque->nombre) . " Vigencia " . date('Y', strtotime($this->fecha_inicio));
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

        $proyectos_formulario_5_linea_69 = ProyectoFormulario5Linea69::select('proyectos_formulario_5_linea_69.id', 'proyectos_formulario_5_linea_69.nodo_tecnoparque_id', 'proyectos_formulario_5_linea_69.fecha_inicio', 'proyectos_formulario_5_linea_69.fecha_finalizacion', 'proyectos_formulario_5_linea_69.proyecto_base')
            ->join('proyectos', 'proyectos_formulario_5_linea_69.id', 'proyectos.id')
            ->join('centros_formacion', 'proyectos.centro_formacion_id', 'centros_formacion.id')
            ->whereHas(
                'proyecto.centroFormacion',
                function ($query) use ($convocatoria, $auth_user) {

                    if ($auth_user->hasRole([2]) && !$auth_user->hasRole([1])) {
                        $query->where('centros_formacion.regional_id', $auth_user->centroFormacion->regional->id);
                        $query->where('proyectos.convocatoria_id', $convocatoria->id);
                    } else if ($auth_user->hasRole([3, 4, 21, 24, 27]) && !$auth_user->hasRole([1])) {
                        $query->join('proyectos', 'proyectos_formulario_5_linea_69.id', 'proyectos.id');
                        $query->join('proyecto_participantes', 'proyectos.id', 'proyecto_participantes.proyecto_id');

                        $query->where('centros_formacion.id', $auth_user->centro_formacion_id);
                        $query->where('proyectos.convocatoria_id', $convocatoria->id);
                        $query->orWhere('proyecto_participantes.user_id', $auth_user->id);
                        $query->where('proyectos.convocatoria_id', $convocatoria->id);
                    } else if ($auth_user->hasRole([1, 17, 23])) {
                        $query->where('proyectos.convocatoria_id', $convocatoria->id);
                    } else {
                        $query->join('proyectos', 'proyectos_formulario_5_linea_69.id', 'proyectos.id');
                        $query->join('proyecto_participantes', 'proyectos.id', 'proyecto_participantes.proyecto_id');
                        $query->where('proyecto_participantes.user_id', $auth_user->id);
                        $query->where('proyectos.convocatoria_id', $convocatoria->id);
                    }
                }
            )
            ->distinct()
            ->orderBy('proyectos_formulario_5_linea_69.id', 'ASC')
            ->filterProyectoFormulario5Linea69(request()->only('search'))->paginate();

        $proyectos_formulario_5_linea_69->load('proyecto');
        $proyectos_formulario_5_linea_69->load('nodoTecnoparque');
        $proyectos_formulario_5_linea_69->load('proyecto.evaluaciones');

        return $proyectos_formulario_5_linea_69;
    }

    public function getFilenameAttribute()
    {
        $fileInfo = pathinfo($this->pdf_proyecto_general);

        return $fileInfo['filename'] ?? '';
    }

    public function getExtensionAttribute()
    {
        $fileInfo = pathinfo($this->pdf_proyecto_general);

        return $fileInfo['extension'] ?? '';
    }
}
