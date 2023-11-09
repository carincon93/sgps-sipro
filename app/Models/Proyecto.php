<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;

class Proyecto extends Model
{
    use HasFactory;

    /**
     * table
     *
     * @var string
     */
    protected $table = 'proyectos';

    /**
     * appends
     *
     * @var array
     */
    protected $appends = ['codigo', 'diff_meses', 'precio_proyecto', 'total_roles_sennova', 'fecha_inicio', 'fecha_finalizacion', 'estado_evaluacion_proyecto', 'cantidad_objetivos', 'total_proyecto_presupuesto_aprobado', 'total_roles_sennova_aprobado', 'precio_proyecto_aprobado', 'total_proyecto_presupuesto', 'lista_archivos', 'allowed', 'resultados', 'filename', 'extension'];

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'convocatoria_id',
        'centro_formacion_id',
        'tipo_formulario_convocatoria_id',
        'finalizado',
        'modificable',
        'habilitado_para_evaluar',
        'en_subsanacion',
        'estructuracion_proyectos',
        'estado',
        'estado_cord_sennova',
        'mostrar_recomendaciones',
        'mostrar_requiere_subsanacion',
        'en_evaluacion',
        'arboles_completos',
        'imagen',
        'video',
        'nuevo_titulo',
        'ods',
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
     * Relationship with Convocatoria
     *
     * @return object
     */
    public function convocatoria()
    {
        return $this->belongsTo(Convocatoria::class);
    }

    /**
     * Relationship with TipoFormularioConvocatoria
     *
     * @return object
     */
    public function tipoFormularioConvocatoria()
    {
        return $this->belongsTo(TipoFormularioConvocatoria::class);
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
     * Relationship with ProyectoFormulario7Linea23
     *
     * @return object
     */
    public function proyectoFormulario7Linea23()
    {
        return $this->hasOne(ProyectoFormulario7Linea23::class, 'id');
    }

    /**
     * Relationship with ProyectoFormulario9Linea23
     *
     * @return object
     */
    public function proyectoFormulario9Linea23()
    {
        return $this->hasOne(ProyectoFormulario9Linea23::class, 'id');
    }

    /**
     * Relationship with ProyectoFormulario3Linea61
     *
     * @return object
     */
    public function proyectoFormulario3Linea61()
    {
        return $this->hasOne(ProyectoFormulario3Linea61::class, 'id');
    }

    /**
     * Relationship with ProyectoFormulario1Linea65
     *
     * @return object
     */
    public function proyectoFormulario1Linea65()
    {
        return $this->hasOne(ProyectoFormulario1Linea65::class, 'id');
    }

    /**
     * Relationship with ProyectoFormulario13Linea65
     *
     * @return object
     */
    public function proyectoFormulario13Linea65()
    {
        return $this->hasOne(ProyectoFormulario13Linea65::class, 'id');
    }

    /**
     * Relationship with ProyectoFormulario15Linea65
     *
     * @return object
     */
    public function proyectoFormulario15Linea65()
    {
        return $this->hasOne(ProyectoFormulario15Linea65::class, 'id');
    }

    /**
     * Relationship with ProyectoFormulario16Linea65
     *
     * @return object
     */
    public function proyectoFormulario16Linea65()
    {
        return $this->hasOne(ProyectoFormulario16Linea65::class, 'id');
    }

    /**
     * Relationship with ProyectoFormulario8Linea66
     *
     * @return object
     */
    public function proyectoFormulario8Linea66()
    {
        return $this->hasOne(ProyectoFormulario8Linea66::class, 'id');
    }

    /**
     * Relationship with ProyectoFormulario12Linea68
     *
     * @return object
     */
    public function proyectoFormulario12Linea68()
    {
        return $this->hasOne(ProyectoFormulario12Linea68::class, 'id');
    }

    /**
     * Relationship with ProyectoFormulario5Linea69
     *
     * @return object
     */
    public function proyectoFormulario5Linea69()
    {
        return $this->hasOne(ProyectoFormulario5Linea69::class, 'id');
    }

    /**
     * Relationship with ProyectoFormulario10Linea69
     *
     * @return object
     */
    public function proyectoFormulario10Linea69()
    {
        return $this->hasOne(ProyectoFormulario10Linea69::class, 'id');
    }

    /**
     * Relationship with ProyectoFormulario17Linea69
     *
     * @return object
     */
    public function proyectoFormulario17Linea69()
    {
        return $this->hasOne(ProyectoFormulario17Linea69::class, 'id');
    }

    /**
     * Relationship with ProyectoFormulario4Linea70
     *
     * @return object
     */
    public function proyectoFormulario4Linea70()
    {
        return $this->hasOne(ProyectoFormulario4Linea70::class, 'id');
    }

    /**
     * Relationship with ProyectoFormulario6Linea82
     *
     * @return object
     */
    public function proyectoFormulario6Linea82()
    {
        return $this->hasOne(ProyectoFormulario6Linea82::class, 'id');
    }

    /**
     * Relationship with ProyectoFormulario11Linea83
     *
     * @return object
     */
    public function proyectoFormulario11Linea83()
    {
        return $this->hasOne(ProyectoFormulario11Linea83::class, 'id');
    }

    /**
     * Relationship with ProyectoDemo
     *
     * @return object
     */
    public function proyectoDemo()
    {
        return $this->hasOne(ProyectoDemo::class);
    }

    /**
     * Relationship with EntidadAliada
     *
     * @return object
     */
    public function entidadesAliadas()
    {
        return $this->hasMany(EntidadAliada::class);
    }

    /**
     * Relationship with Municipio
     *
     * @return object
     */
    public function municipios()
    {
        return $this->belongsToMany(Municipio::class, 'proyecto_municipio', 'proyecto_id', 'municipio_id')->orderBy('municipios.nombre', 'ASC');
    }

    /**
     * Relationship with Municipio
     *
     * @return object
     */
    public function municipiosAImpactar()
    {
        return $this->belongsToMany(Municipio::class, 'proyecto_municipio_impactar', 'proyecto_id', 'municipio_id')->orderBy('municipios.nombre', 'ASC');
    }

    /**
     * Relationship with CausaDirecta
     *
     * @return object
     */
    public function causasDirectas()
    {
        return $this->hasMany(CausaDirecta::class)->orderBy('id', 'ASC');
    }

    /**
     * Relationship with EfectoDirecto
     *
     * @return object
     */
    public function efectosDirectos()
    {
        return $this->hasMany(EfectoDirecto::class)->orderBy('id', 'ASC');
    }

    /**
     * Relationship with ProyectoAnexo
     *
     * @return object
     */
    public function proyectoAnexo()
    {
        return $this->hasMany(ProyectoAnexo::class);
    }

    /**
     * Relationship with AnalisisRiesgo
     *
     * @return object
     */
    public function analisisRiesgos()
    {
        return $this->hasMany(AnalisisRiesgo::class);
    }

    /**
     * Relationship with ProyectoPresupuesto
     *
     * @return object
     */
    public function proyectoPresupuesto()
    {
        return $this->hasMany(ProyectoPresupuesto::class);
    }

    /**
     * Relationship with ProyectoRolSennova
     *
     * @return object
     */
    public function proyectoRolesSennova()
    {
        return $this->hasMany(ProyectoRolSennova::class);
    }

    /**
     * Relationship with InventarioEquipo
     *
     * @return object
     */
    public function inventarioEquipos()
    {
        return $this->hasMany(InventarioEquipo::class);
    }

    /**
     * Relationship with Evaluacion
     *
     * @return object
     */
    public function evaluaciones()
    {
        return $this->hasMany(\App\Models\Evaluacion\Evaluacion::class)->orderBy('id');
    }

    /**
     * Relationship with ProgramaFormacion
     *
     * @return object
     */
    public function programasFormacion()
    {
        return $this->belongsToMany(ProgramaFormacion::class, 'proyecto_programa_formacion', 'proyecto_id', 'programa_formacion_id');
    }

    /**
     * Relationship with GrupoInvestigacion
     *
     * @return object
     */
    public function gruposInvestigacion()
    {
        return $this->belongsToMany(GrupoInvestigacion::class, 'proyecto_grupo_investigacion', 'proyecto_id', 'grupo_investigacion_id');
    }

    /**
     * Relationship with LineaInvestigacion
     *
     * @return object
     */
    public function lineasInvestigacion()
    {
        return $this->belongsToMany(LineaInvestigacion::class, 'proyecto_linea_investigacion', 'proyecto_id', 'linea_investigacion_id');
    }

    /**
     * Relationship with SemilleroInvestigacion
     *
     * @return object
     */
    public function semillerosInvestigacion()
    {
        return $this->belongsToMany(SemilleroInvestigacion::class, 'proyecto_semillero_investigacion', 'proyecto_id', 'semillero_investigacion_id');
    }

    /**
     * Relationship with TecnoacademiaLineasTecnoacademia
     *
     * @return object
     */
    public function tecnoacademiaLineasTecnoacademia()
    {
        return $this->belongsToMany(TecnoacademiaLineaTecnoacademia::class, 'proyecto_linea_tecnoacademia', 'proyecto_id', 'tecnoacademia_linea_tecnoacademia_id');
    }

    /**
     * Relationship with DisenoCurricular
     *
     * @return object
     */
    public function disenosCurriculares()
    {
        return $this->belongsToMany(DisenoCurricular::class, 'proyecto_diseno_curricular', 'proyecto_id', 'diseno_curricular_id');
    }

    /**
     * Relationship with RedConocimiento
     *
     * @return object
     */
    public function redesConocimiento()
    {
        return $this->belongsToMany(RedConocimiento::class, 'proyecto_red_conocimiento', 'proyecto_id', 'red_conocimiento_id');
    }

    /**
     * Relationship with MesaSectorial
     *
     * @return object
     */
    public function mesasSectoriales()
    {
        return $this->belongsToMany(MesaSectorial::class, 'proyecto_mesa_sectorial', 'proyecto_id', 'mesa_sectorial_id');
    }

    /**
     * Relationship with participantes
     *
     * @return object
     */
    public function participantes()
    {
        return $this->belongsToMany(User::class, 'proyecto_participantes', 'proyecto_id', 'user_id')
            ->withPivot([
                'user_id',
                'es_formulador',
                'cantidad_meses',
                'cantidad_horas',
                'rol_sennova'
            ]);
    }

    /**
     * Filtrar registros
     *
     * @param  mixed $query
     * @param  mixed $filters
     * @return void
     */
    public function scopeFilterProyecto($query, array $filters)
    {
        $query->when($filters['search'] ?? null, function ($query, $search) {
            if (strpos($search, 'SGPS-') !== false) {
                $parts = explode('-', $search);

                $filteredParts = array_filter($parts, function ($part) {
                    return $part !== 'SGPS' && $part !== '2022';
                });

                $search = (int) implode('-', $filteredParts);
            }

            $search = str_replace('-', "", $search);
            $search = str_replace('"', "", $search);
            $search = str_replace("'", "", $search);
            $search = str_replace(' ', '%%', $search);

            if (preg_match('/^\d+$/', $search)) {
                $query->where('proyectos.id', $search - 8000);
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
        return "Última modificación de este formulario: " . Carbon::parse($value, 'UTC')->timezone('America/Bogota')->timezone('America/Bogota')->locale('es')->isoFormat('DD [de] MMMM [de] YYYY [a las] HH:mm:ss');
    }

    /**
     * getProyectosPorRol
     *
     * @return object
     */
    public static function getProyectosPorRol()
    {
        /** @var \App\Models\User */
        $auth_user = Auth::user();

        $proyectos = Proyecto::with(
            'proyectoFormulario1Linea65:id,titulo,fecha_inicio,fecha_finalizacion',
            'proyectoFormulario3Linea61:id,titulo,fecha_inicio,fecha_finalizacion',
            'proyectoFormulario4Linea70:id,tecnoacademia_id,fecha_inicio,fecha_finalizacion',
            'proyectoFormulario5Linea69:id,nodo_tecnoparque_id,fecha_inicio,fecha_finalizacion',
            'proyectoFormulario6Linea82:id,titulo,fecha_inicio,fecha_finalizacion',
            'proyectoFormulario7Linea23:id,titulo,fecha_inicio,fecha_finalizacion',
            'proyectoFormulario8Linea66:id,titulo,fecha_inicio,fecha_finalizacion',
            'proyectoFormulario9Linea23:id,titulo,fecha_inicio,fecha_finalizacion',
            'proyectoFormulario10Linea69:id,hub_innovacion_id,fecha_inicio,fecha_finalizacion',
            'proyectoFormulario11Linea83:id,titulo,fecha_inicio,fecha_finalizacion',
            'proyectoFormulario12Linea68:id,titulo,fecha_inicio,fecha_finalizacion',
            'proyectoFormulario13Linea65:id,titulo,fecha_inicio,fecha_finalizacion',
            'proyectoFormulario15Linea65:id,titulo,fecha_inicio,fecha_finalizacion',
            'proyectoFormulario16Linea65:id,titulo,fecha_inicio,fecha_finalizacion',
            'proyectoFormulario17Linea69:id,nodo_tecnoparque_id,fecha_inicio,fecha_finalizacion',
            'convocatoria',
        )->whereHas(
            'centroFormacion',
            function ($query) use ($auth_user) {
                if ($auth_user->hasRole([2]) && !$auth_user->hasRole([1])) {
                    $query->where('centros_formacion.regional_id', $auth_user->centroFormacion->regional->id);
                } else if ($auth_user->hasRole([3, 4, 21, 27]) && !$auth_user->hasRole([1])) {
                    $query->join('proyecto_participantes', 'proyectos.id', 'proyecto_participantes.proyecto_id');

                    $query->where('centros_formacion.id', $auth_user->centro_formacion_id);
                    $query->orWhere('proyecto_participantes.user_id', $auth_user->id);
                } else if ($auth_user->hasRole([1, 20, 23])) {
                } else {
                    $query->join('proyecto_participantes', 'proyectos.id', 'proyecto_participantes.proyecto_id');
                    $query->where('proyecto_participantes.user_id', $auth_user->id);
                }
            }
        )
            ->distinct('proyectos.id')
            ->orderBy('proyectos.id', 'DESC')
            ->filterProyecto(request()->only('search'))
            ->paginate();


        $proyectos->load('evaluaciones');

        return $proyectos;
    }

    public function getFilenameAttribute()
    {
        $imagen   = pathinfo($this->imagen);

        $array_file_info = collect(['imagen_filename' =>  $imagen['filename'] ?? '']);

        return $array_file_info ?? '';
    }

    public function getExtensionAttribute()
    {
        $imagen   = pathinfo($this->imagen);

        $array_file_info = collect(['imagen_extension' => $imagen['extension'] ?? '']);

        return $array_file_info ?? '';
    }

    public function getOdsAttribute($value)
    {
        return json_decode($value);
    }

    public static function getLog($proyecto_id)
    {
        return DB::table('notifications')->select('data', 'created_at')->whereRaw("data->>'proyectoId' = '" . $proyecto_id . "'")->where('type', '!=', 'App\Notifications\EvaluacionFinalizada')->orderBy('created_at', 'DESC')->get();
    }

    /**
     * Relationship with ProyectoPdfVersion
     *
     * @return object
     */
    public function PdfVersiones()
    {
        return $this->hasMany(ProyectoPdfVersion::class);
    }

    /**
     * Get codigo e.g. SGPS-8000-2021
     *
     * @return string
     */
    public function getCodigoAttribute()
    {
        // Initialize $fecha_finalizacion to null
        $fecha_finalizacion = null;

        // Define an array of relationships to check
        $relationships = [
            'proyectoFormulario1Linea65',
            'proyectoFormulario3Linea61',
            'proyectoFormulario4Linea70',
            'proyectoFormulario5Linea69',
            'proyectoFormulario6Linea82',
            'proyectoFormulario7Linea23',
            'proyectoFormulario8Linea66',
            'proyectoFormulario9Linea23',
            'proyectoFormulario10Linea69',
            'proyectoFormulario11Linea83',
            'proyectoFormulario12Linea68',
            'proyectoFormulario13Linea65',
            'proyectoFormulario15Linea65',
            'proyectoFormulario16Linea65',
            'proyectoFormulario17Linea69',
        ];

        // Loop through the relationships and update $fecha_finalizacion if the relationship exists
        foreach ($relationships as $relationship) {
            if ($this->$relationship()->exists()) {
                $fecha = $this->$relationship->fecha_finalizacion;
                if ($fecha_finalizacion === null || $fecha > $fecha_finalizacion) {
                    $fecha_finalizacion = $fecha;
                }
            }
        }

        // Generate the codigo using $fecha_finalizacion
        $codigo = $fecha_finalizacion ? 'SGPS-' . ($this->id + 8000) . '-' . date('Y', strtotime($fecha_finalizacion)) : null;

        return $codigo;
    }

    public function getFechaInicioAttribute()
    {
        // Define an array of relationships to check
        $relationships = [
            'proyectoFormulario1Linea65',
            'proyectoFormulario3Linea61',
            'proyectoFormulario4Linea70',
            'proyectoFormulario5Linea69',
            'proyectoFormulario6Linea82',
            'proyectoFormulario7Linea23',
            'proyectoFormulario8Linea66',
            'proyectoFormulario9Linea23',
            'proyectoFormulario10Linea69',
            'proyectoFormulario11Linea83',
            'proyectoFormulario12Linea68',
            'proyectoFormulario13Linea65',
            'proyectoFormulario15Linea65',
            'proyectoFormulario16Linea65',
            'proyectoFormulario17Linea69',
        ];

        // Initialize $fecha_inicio to null
        $fecha_inicio = null;

        // Loop through the relationships and update $fecha_inicio if the relationship exists
        foreach ($relationships as $relationship) {
            if ($this->$relationship()->exists()) {
                $fecha = $this->$relationship->fecha_inicio;
                if ($fecha_inicio === null || $fecha < $fecha_inicio) {
                    $fecha_inicio = $fecha;
                }
            }
        }

        return $fecha_inicio;
    }

    public function getFechaFinalizacionAttribute()
    {
        // Define an array of relationships to check
        $relationships = [
            'proyectoFormulario1Linea65',
            'proyectoFormulario3Linea61',
            'proyectoFormulario4Linea70',
            'proyectoFormulario5Linea69',
            'proyectoFormulario6Linea82',
            'proyectoFormulario7Linea23',
            'proyectoFormulario8Linea66',
            'proyectoFormulario9Linea23',
            'proyectoFormulario10Linea69',
            'proyectoFormulario11Linea83',
            'proyectoFormulario12Linea68',
            'proyectoFormulario13Linea65',
            'proyectoFormulario15Linea65',
            'proyectoFormulario16Linea65',
            'proyectoFormulario17Linea69',
        ];

        // Initialize $fecha_finalizacion to null
        $fecha_finalizacion = null;

        // Loop through the relationships and update $fecha_finalizacion if the relationship exists
        foreach ($relationships as $relationship) {
            if ($this->$relationship()->exists()) {
                $fecha = $this->$relationship->fecha_finalizacion;
                if ($fecha_finalizacion === null || $fecha > $fecha_finalizacion) {
                    $fecha_finalizacion = $fecha;
                }
            }
        }

        return $fecha_finalizacion;
    }

    /**
     * getDiffMesesAttribute
     *
     * @return int
     */
    public function getDiffMesesAttribute()
    {
        // Define an array of relationships to check
        $relationships = [
            'proyectoFormulario1Linea65',
            'proyectoFormulario3Linea61',
            'proyectoFormulario4Linea70',
            'proyectoFormulario5Linea69',
            'proyectoFormulario6Linea82',
            'proyectoFormulario7Linea23',
            'proyectoFormulario8Linea66',
            'proyectoFormulario9Linea23',
            'proyectoFormulario10Linea69',
            'proyectoFormulario11Linea83',
            'proyectoFormulario12Linea68',
            'proyectoFormulario13Linea65',
            'proyectoFormulario15Linea65',
            'proyectoFormulario16Linea65',
            'proyectoFormulario17Linea69',
        ];

        $cantidad_meses_ejecucion = 0;

        // Loop through the relationships and update $cantidad_meses_ejecucion if the relationship exists
        foreach ($relationships as $relationship) {
            if ($this->$relationship()->exists()) {
                $max_meses_ejecucion = $this->$relationship->max_meses_ejecucion;
                if ($max_meses_ejecucion > $cantidad_meses_ejecucion) {
                    $cantidad_meses_ejecucion = $max_meses_ejecucion;
                }
            }
        }

        return $cantidad_meses_ejecucion;
    }

    /**
     * getTotalProyectoPresupuestoAttribute
     *
     * @return int
     */
    public function getTotalProyectoPresupuestoAttribute()
    {
        $total = 0;

        $rubros_suman_al_presupuesto = true;
        foreach ($this->proyectoPresupuesto as $proyecto_presupuesto) {
            $data = $proyecto_presupuesto->convocatoriaProyectoRubrosPresupuestales()->select('convocatoria_presupuesto.id', 'convocatoria_presupuesto.sumar_al_presupuesto')->get()->pluck(['sumar_al_presupuesto']);

            foreach ($data as $item) {
                if (!$item) {
                    $rubros_suman_al_presupuesto = false;
                    break;
                }
            }

            if ($rubros_suman_al_presupuesto) {
                $total += $proyecto_presupuesto->valor_total;
            }
        }

        return $total;
    }

    /**
     * getTotalRolesSennovaAttribute
     *
     * @return int
     */
    public function getTotalRolesSennovaAttribute()
    {
        $total = 0;

        foreach ($this->proyectoRolesSennova as $proyecto_rol_sennova) {
            if ($proyecto_rol_sennova->convocatoriaRolSennova->sumar_al_presupuesto) {
                $total += $proyecto_rol_sennova->getTotalRolSennova();
            }
        }

        return $total;
    }

    /**
     * getTotalProyectoPresupuestoAprobadoAttribute
     *
     * @return int
     */
    public function getTotalProyectoPresupuestoAprobadoAttribute()
    {
        $total = 0;

        $rubros_suman_al_presupuesto = true;
        foreach ($this->proyectoPresupuesto as $proyecto_presupuesto) {
            $data = $proyecto_presupuesto->convocatoriaProyectoRubrosPresupuestales()->select('convocatoria_presupuesto.id', 'convocatoria_presupuesto.sumar_al_presupuesto')->get()->pluck(['sumar_al_presupuesto']);

            foreach ($data as $item) {
                if (!$item) {
                    $rubros_suman_al_presupuesto = false;
                    break;
                }
            }

            if ($rubros_suman_al_presupuesto && $proyecto_presupuesto->getPresupuestoAprobadoAttribute()) {
                $total += $proyecto_presupuesto->valor_total;
            }
        }

        return $total;
    }

    /**
     * getTotalRolesSennovaAprobadoAttribute
     *
     * @return int
     */
    public function getTotalRolesSennovaAprobadoAttribute()
    {
        $total = 0;

        foreach ($this->proyectoRolesSennova as $proyecto_rol_sennova) {
            if ($proyecto_rol_sennova->convocatoriaRolSennova->sumar_al_presupuesto && $proyecto_rol_sennova->getRolAprobadoAttribute()) {
                $total += $proyecto_rol_sennova->getTotalRolSennova();
            }
        }

        return $total;
    }

    /**
     * getPrecioProyectoAprobadoAttribute
     *
     * @return int
     */
    public function getPrecioProyectoAprobadoAttribute()
    {
        $total = 0;

        $total = $this->getTotalProyectoPresupuestoAprobadoAttribute() + $this->getTotalRolesSennovaAprobadoAttribute();

        return $total;
    }

    /**
     * getPrecioProyecto
     *
     * @return int
     */
    public function getPrecioProyectoAttribute()
    {
        return $this->getTotalProyectoPresupuestoAttribute() + $this->getTotalRolesSennovaAttribute();
    }

    public function getCantidadObjetivosAttribute()
    {
        $numero_objetivos = 0;

        foreach ($this->causasDirectas as $causa_directa) {
            strlen($causa_directa->objetivoEspecifico->descripcion) > 10 ? $numero_objetivos++ : null;
        }

        return $numero_objetivos;
    }

    /**
     * getEstadoEvaluacionProyectoAttribute
     *
     * @return void
     */
    public function getEstadoEvaluacionProyectoAttribute()
    {
        $evaluaciones               = $this->evaluaciones()->where('habilitado', true)->get();
        $evaluaciones_finalizadas   = $this->evaluaciones()->where('habilitado', true)->where('finalizado', true)->count();

        $puntaje_total = 0;
        $total_recomendaciones = 0;
        $cantidad_evaluaciones = count($evaluaciones);
        // $estado_evaluacion = '';
        // $causal_rechazo  = null;
        // $requiere_subsanar = false;
        // $total_presupuestos_evaluados = 0;

        // $estados = array(1, 2);

        foreach ($evaluaciones as $evaluacion) {
            $puntaje_total          += $evaluacion->total_evaluacion;
            $total_recomendaciones  += $evaluacion->total_recomendaciones;
        }

        $cantidad_evaluaciones > 0 ? $puntaje_total = $puntaje_total / $cantidad_evaluaciones : $puntaje_total = 0;

        // $sq = 0;
        // $sq = $this->getDesviacionEstandarAttribute();
        // $alerta = null;
        // if (in_array(2, $estados) && $sq >= 25  || in_array(3, $estados) && $sq >= 25) {
        //     if (in_array(2, $estados)) {
        //         $estadoArr = 'Pre-aprobado';
        //     } else if (in_array(3, $estados)) {
        //         $estadoArr = 'Pre-aprobado con observaciones';
        //     }
        //     $alerta = "Hay una evaluación en estado '{$estadoArr}' y la desviación estándar de las {$cantidad_evaluaciones} evaluaciones es {$sq}.";
        // }


        // if ($causal_rechazo == null && $cantidad_evaluaciones > 0) {
        //     $estado_evaluacion = $this->estadoEvaluacionProyectoFormulario8Linea66($puntaje_total, $total_recomendaciones, $requiere_subsanar, null)['estado'];
        //     $requiere_subsanar = $this->estadoEvaluacionProyectoFormulario8Linea66($puntaje_total, $total_recomendaciones, $requiere_subsanar, null)['requiere_subsanar'];
        // } else {
        //     $estado_evaluacion = $causal_rechazo;
        // }

        // if ($cantidad_evaluaciones == 0) {
        //     $estados_evaluacion = collect(json_decode(Storage::get('json/estados-evaluacion.json'), true));
        //     $estado_evaluacion  = $estados_evaluacion->where('value', 1)->first()['label'];
        // }

        // if ($this->estado_cord_sennova != NULL && request()->isMethod('GET')) {
        //     $estados_evaluacion = collect(json_decode($this->estado_cord_sennova, true));
        //     $estado_evaluacion  = $estados_evaluacion['estado'];
        // }

        // return collect(['estado' => $estado_evaluacion, 'puntaje' => $puntaje_total, 'numero_recomendaciones' => $total_recomendaciones, 'evaluaciones_habilitadas' => $cantidad_evaluaciones, 'evaluaciones_finalizadas' => $evaluaciones_finalizadas, 'requiere_subsanar' => $requiere_subsanar, 'alerta' => $alerta]);

        return collect(['puntaje' => $puntaje_total, 'numero_recomendaciones' => $total_recomendaciones, 'evaluaciones_habilitadas' => $cantidad_evaluaciones, 'evaluaciones_finalizadas' => $evaluaciones_finalizadas]);
    }

    /**
     * getEstadoEvaluacionProyectoFormulario6Linea82Attribute - Estrategia regional
     *
     * @return void
     */
    public function getEstadoEvaluacionProyectoFormulario6Linea82Attribute()
    {
        if ($this->proyectoFormulario6Linea82()->exists()) {
            $evaluaciones               = $this->evaluaciones()->where('habilitado', true)->get();
            $evaluaciones_finalizadas   = $this->evaluaciones()->where('habilitado', true)->where('finalizado', true)->count();

            $puntaje_total                  = 0;
            $total_recomendaciones          = 0;
            $estado_evaluacion              = '';
            $causal_rechazo                 = null;
            $requiere_subsanar              = false;
            $total_presupuestos_evaluados   = 0;

            $estados = array(1, 2);

            foreach ($evaluaciones as $key => $evaluacion) {
                $puntaje_total          += $evaluacion->total_evaluacion;
                $total_recomendaciones  += $evaluacion->total_recomendaciones;

                array_push($estados, $this->estadoEvaluacionProyectoFormulario6Linea82($evaluacion->total_evaluacion, $total_recomendaciones, $requiere_subsanar, null)['id']);

                if ($causal_rechazo == null && $evaluacion->proyectoPresupuestosEvaluaciones()->count() > 0 && $this->convocatoria->fase == 5) {
                    $this->precio_proyecto - $this->getPrecioProyectoAprobadoAttribute() >= floor($this->precio_proyecto * 0.8) ? $causal_rechazo = 'Rechazado - No cumple con el presupuesto' : $causal_rechazo = null;
                }
            }

            $cantidad_evaluaciones = count($evaluaciones);

            $sq = 0;
            $sq = $this->getDesviacionEstandarAttribute();
            $alerta = null;
            if (in_array(2, $estados) && $sq >= 25  || in_array(3, $estados) && $sq >= 25) {
                if (in_array(2, $estados)) {
                    $estadoArr = 'Pre-aprobado';
                } else if (in_array(3, $estados)) {
                    $estadoArr = 'Pre-aprobado con observaciones';
                }
                $alerta = "Hay una evaluación en estado '{$estadoArr}' y la desviación estándar de las {$cantidad_evaluaciones} evaluaciones es {$sq}.";
            }

            $cantidad_evaluaciones > 0 ? $puntaje_total = $puntaje_total / $cantidad_evaluaciones : $puntaje_total = 0;

            if ($causal_rechazo == null && $cantidad_evaluaciones > 0) {
                $estado_evaluacion = $this->estadoEvaluacionProyectoFormulario8Linea66($puntaje_total, $total_recomendaciones, $requiere_subsanar, null)['estado'];
                $requiere_subsanar = $this->estadoEvaluacionProyectoFormulario8Linea66($puntaje_total, $total_recomendaciones, $requiere_subsanar, null)['requiere_subsanar'];
            } else {
                $estado_evaluacion = $causal_rechazo;
            }

            if ($cantidad_evaluaciones == 0) {
                $estados_evaluacion = collect(json_decode(Storage::get('json/estados-evaluacion.json'), true));
                $estado_evaluacion  = $estados_evaluacion->where('value', 1)->first()['label'];
            }

            if ($this->estado_cord_sennova != NULL && request()->isMethod('GET')) {
                $estados_evaluacion = collect(json_decode($this->estado_cord_sennova, true));
                $estado_evaluacion  = $estados_evaluacion['estado'];
            }

            return collect(['estado' => $estado_evaluacion, 'puntaje' => $puntaje_total, 'numero_recomendaciones' => $total_recomendaciones, 'evaluaciones_habilitadas' => $cantidad_evaluaciones, 'evaluaciones_finalizadas' => $evaluaciones_finalizadas, 'requiere_subsanar' => $requiere_subsanar, 'alerta' => $alerta]);
        }
    }

    /**
     * getEstadoEvaluacionProyectoFormulario1Linea65Attribute
     *
     * @return void
     */
    public function getEstadoEvaluacionProyectoFormulario1Linea65Attribute()
    {
        if ($this->proyectoFormulario1Linea65()->exists()) {

            $evaluaciones                   = $this->evaluaciones()->where('habilitado', true)->get();
            $evaluaciones_finalizadas       = $this->evaluaciones()->where('habilitado', true)->where('finalizado', true)->count();

            $puntaje_total                  = 0;
            $total_recomendaciones          = 0;
            $estado_evaluacion              = '';
            $causal_rechazo                 = null;
            $requiere_subsanar              = false;
            $total_presupuestos_evaluados   = 0;
            $count_presupuesto_no_aprobado  = 0;

            $estados = array(1, 2);

            foreach ($evaluaciones as $evaluacion) {
                $puntaje_total += $evaluacion->total_evaluacion;
                $total_recomendaciones += $evaluacion->total_recomendaciones;

                // Sumar los presupuesto no aprobados
                $total_presupuestos_evaluados += $evaluacion->proyectoPresupuestosEvaluaciones()->count();

                foreach ($evaluacion->proyectoPresupuestosEvaluaciones()->get() as $presupuesto_evaluacion) {
                    $presupuesto_evaluacion->correcto == false ? $count_presupuesto_no_aprobado++ : null;
                }

                array_push($estados, $this->estadoEvaluacionProyectoFormulario1Linea65($evaluacion->total_evaluacion, $total_recomendaciones, $requiere_subsanar)['id']);
            }

            $cantidad_evaluaciones = count($evaluaciones);

            $sq = 0;
            $sq = $this->getDesviacionEstandarAttribute();
            $alerta = null;
            if (in_array(2, $estados) && $sq >= 25  || in_array(3, $estados) && $sq >= 25) {
                if (in_array(2, $estados)) {
                    $estadoArr = 'Pre-aprobado';
                } else if (in_array(3, $estados)) {
                    $estadoArr = 'Pre-aprobado con observaciones';
                }
                $alerta = "Hay una evaluación en estado '{$estadoArr}' y la desviación estándar de las {$cantidad_evaluaciones} evaluaciones es {$sq}.";
            }

            $cantidad_evaluaciones > 0 ? $puntaje_total = $puntaje_total / $cantidad_evaluaciones : $puntaje_total = 0;

            if ($causal_rechazo == null && $cantidad_evaluaciones > 0) {
                $estado_evaluacion = $this->estadoEvaluacionProyectoFormulario1Linea65($puntaje_total, $total_recomendaciones, $requiere_subsanar)['estado'];
                $requiere_subsanar = $this->estadoEvaluacionProyectoFormulario1Linea65($puntaje_total, $total_recomendaciones, $requiere_subsanar)['requiere_subsanar'];
            } else {
                $estado_evaluacion = $causal_rechazo;
            }

            if ($cantidad_evaluaciones == 0) {
                $estados_evaluacion = collect(json_decode(Storage::get('json/estados-evaluacion.json'), true));
                $estado_evaluacion  = $estados_evaluacion->where('value', 1)->first()['label'];
            }

            if ($this->estado_cord_sennova != NULL && request()->isMethod('GET')) {
                $estados_evaluacion = collect(json_decode($this->estado_cord_sennova, true));
                $estado_evaluacion  = $estados_evaluacion['estado'];
            }

            return collect(['estado' => $estado_evaluacion, 'puntaje' => $puntaje_total, 'numero_recomendaciones' => $total_recomendaciones, 'evaluaciones_habilitadas' => $cantidad_evaluaciones, 'evaluaciones_finalizadas' => $evaluaciones_finalizadas, 'requiere_subsanar' => $requiere_subsanar, 'alerta' => $alerta]);
        }
    }

    /**
     * getEstadoEvaluacionProyectoFormulario12Linea68Attribute - Estrategia regional
     *
     * @return void
     */
    public function getEstadoEvaluacionProyectoFormulario12Linea68Attribute()
    {
        if ($this->proyectoFormulario12Linea68()->exists()) {

            $evaluaciones                   = $this->evaluaciones()->where('habilitado', true)->get();
            $evaluaciones_finalizadas       = $this->evaluaciones()->where('habilitado', true)->where('finalizado', true)->count();

            $puntaje_total                  = 0;
            $total_recomendaciones          = 0;
            $estado_evaluacion              = '';
            $causal_rechazo                 = null;
            $requiere_subsanar              = false;
            $total_presupuestos_evaluados   = 0;
            $count_presupuesto_no_aprobado  = 0;

            $estados = array(1, 2);

            foreach ($evaluaciones as $evaluacion) {
                $puntaje_total += $evaluacion->total_evaluacion;
                $total_recomendaciones += $evaluacion->total_recomendaciones;

                // Sumar los presupuesto no aprobados
                $total_presupuestos_evaluados += $evaluacion->proyectoPresupuestosEvaluaciones()->count();
                foreach ($evaluacion->proyectoPresupuestosEvaluaciones()->get() as $presupuesto_evaluacion) {
                    $presupuesto_evaluacion->correcto == false ? $count_presupuesto_no_aprobado++ : null;
                }

                array_push($estados, $this->estadoEvaluacionProyectoFormulario12Linea68($evaluacion->total_evaluacion, $total_recomendaciones, $requiere_subsanar)['id']);

                if ($causal_rechazo == null) {
                    // switch ($evaluacion) {
                    //     case $evaluacion->evaluacionProyectoFormulario12Linea68()->exists():
                    //         if ($evaluacion->evaluacionCausalesRechazo()->where('causal_rechazo', '=', 4)->first()) {
                    //             $causal_rechazo = 'En revisión por Cord. SENNOVA';
                    //         } else if ($evaluacion->evaluacionCausalesRechazo()->whereIn('causal_rechazo', [1, 2, 3])->first()) {
                    //             $causal_rechazo = 'Rechazado - Causal de rechazo';
                    //         }

                    //         if ($evaluacion->evaluacionProyectoFormulario12Linea68->anexos_comentario != null) {
                    //             $requiere_subsanar = true;
                    //         }
                    //         break;

                    //     default:
                    //         break;
                    // }
                }

                // if ($causal_rechazo == null && $evaluacion->proyectoPresupuestosEvaluaciones()->count() > 0) {
                //     $count_presupuesto_no_aprobado >= floor($total_presupuestos_evaluados * 0.8) ? $causal_rechazo = 'Rechazado - No cumple con el presupuesto' : $causal_rechazo = null;
                // }
            }

            $cantidad_evaluaciones = count($evaluaciones);

            $sq = 0;
            $sq = $this->getDesviacionEstandarAttribute();
            $alerta = null;
            if (in_array(2, $estados) && $sq >= 25  || in_array(3, $estados) && $sq >= 25) {
                if (in_array(2, $estados)) {
                    $estadoArr = 'Pre-aprobado';
                } else if (in_array(3, $estados)) {
                    $estadoArr = 'Pre-aprobado con observaciones';
                }
                $alerta = "Hay una evaluación en estado '{$estadoArr}' y la desviación estándar de las {$cantidad_evaluaciones} evaluaciones es {$sq}.";
            }

            $cantidad_evaluaciones > 0 ? $puntaje_total = $puntaje_total / $cantidad_evaluaciones : $puntaje_total = 0;

            if ($causal_rechazo == null && $cantidad_evaluaciones > 0) {
                $estado_evaluacion = $this->estadoEvaluacionProyectoFormulario12Linea68($puntaje_total, $total_recomendaciones, $requiere_subsanar)['estado'];
                $requiere_subsanar = $this->estadoEvaluacionProyectoFormulario12Linea68($puntaje_total, $total_recomendaciones, $requiere_subsanar)['requiere_subsanar'];
            } else {
                $estado_evaluacion = $causal_rechazo;
            }

            if ($cantidad_evaluaciones == 0) {
                $estados_evaluacion = collect(json_decode(Storage::get('json/estados_evaluacion_st.json'), true));
                $estado_evaluacion = $estados_evaluacion->where('value', 1)->first()['label'];
            }

            if ($this->estado_cord_sennova != NULL && request()->isMethod('GET')) {
                $estados_evaluacion = collect(json_decode($this->estado_cord_sennova, true));
                $estado_evaluacion = $estados_evaluacion['estado'];
            }

            return collect(['estado' => $estado_evaluacion, 'puntaje' => $puntaje_total, 'numero_recomendaciones' => $total_recomendaciones, 'evaluaciones_habilitadas' => $cantidad_evaluaciones, 'evaluaciones_finalizadas' => $evaluaciones_finalizadas, 'requiere_subsanar' => $requiere_subsanar, 'alerta' => $alerta]);
        }
    }

    /**
     * getEstadoEvaluacionProyectoFormulario4Linea70Attribute - Tecnoacademia
     *
     * @return void
     */
    public function getEstadoEvaluacionProyectoFormulario4Linea70Attribute()
    {
        if ($this->proyectoFormulario4Linea70()->exists()) {

            $evaluaciones = $this->evaluaciones()->where('habilitado', true)->get();
            $evaluaciones_finalizadas = $this->evaluaciones()->where('habilitado', true)->where('finalizado', true)->count();
            $cantidad_evaluaciones = count($evaluaciones);

            $total_recomendaciones = 0;
            $requiere_subsanar = false;
            $total_presupuestos_evaluados = 0;
            $count_presupuesto_no_aprobado = 0;

            foreach ($evaluaciones as $evaluacion) {
                $total_recomendaciones += $evaluacion->total_recomendaciones;

                // if ($evaluacion->evaluacionProyectoFormulario4Linea70->anexos_comentario != null) {
                //     $requiere_subsanar = true;
                // }

                // Sumar los presupuestos no aprobados
                $total_presupuestos_evaluados += $evaluacion->proyectoPresupuestosEvaluaciones()->count();
                foreach ($evaluacion->proyectoPresupuestosEvaluaciones()->get() as $presupuesto_evaluacion) {
                    $presupuesto_evaluacion->correcto == false ? $count_presupuesto_no_aprobado++ : null;
                }
            }

            $estado_evaluacion = null;

            $estado_evaluacion = $total_recomendaciones == 0 &&  $evaluaciones_finalizadas > 0 ? 'Cumple' : ($total_recomendaciones == 0 &&  $evaluaciones_finalizadas == 0 ? 'No priorizado' : 'Proyecto con asignación de apoyo técnico para la formulación');
            $requiere_subsanar = $total_recomendaciones == 0 &&  $evaluaciones_finalizadas > 0 ? false : ($total_recomendaciones == 0 &&  $evaluaciones_finalizadas == 0 ? false : true);

            if ($this->estado_cord_sennova != NULL && request()->isMethod('GET')) {
                $estados_evaluacion = collect(json_decode($this->estado_cord_sennova, true));
                $estado_evaluacion = $estados_evaluacion['estado'];
            }

            return collect(['estado' => $estado_evaluacion, 'numero_recomendaciones' => $total_recomendaciones, 'evaluaciones_habilitadas' => $cantidad_evaluaciones, 'evaluaciones_finalizadas' => $evaluaciones_finalizadas, 'requiere_subsanar' => $requiere_subsanar, 'alerta' => null]);
        }
    }

    /**
     * getEstadoEvaluacionProyectoFormulario5Linea69Attribute - Tecnoacademia
     *
     * @return void
     */
    public function getEstadoEvaluacionProyectoFormulario5Linea69Attribute()
    {
        if ($this->proyectoFormulario5Linea69()->exists()) {
            $evaluaciones               = $this->evaluaciones()->where('habilitado', true)->get();
            $evaluaciones_finalizadas   = $this->evaluaciones()->where('habilitado', true)->where('finalizado', true)->count();
            $cantidad_evaluaciones      = count($evaluaciones);

            $total_recomendaciones          = 0;
            $requiere_subsanar              = false;
            $total_presupuestos_evaluados   = 0;
            $count_presupuesto_no_aprobado  = 0;


            foreach ($evaluaciones as $evaluacion) {
                $total_recomendaciones += $evaluacion->total_recomendaciones;

                // if ($evaluacion->evaluacionProyectoFormulario5Linea69->anexos_comentario != null) {
                //     $requiere_subsanar = true;
                // }

                // Sumar los presupuestos no aprobados
                $total_presupuestos_evaluados += $evaluacion->proyectoPresupuestosEvaluaciones()->count();
                foreach ($evaluacion->proyectoPresupuestosEvaluaciones()->get() as $presupuesto_evaluacion) {
                    $presupuesto_evaluacion->correcto == false ? $count_presupuesto_no_aprobado++ : null;
                }
            }

            $estado_evaluacion = null;

            $estado_evaluacion = $total_recomendaciones == 0 &&  $evaluaciones_finalizadas > 0 ? 'Cumple' : ($total_recomendaciones == 0 &&  $evaluaciones_finalizadas == 0 ? 'No priorizado' : 'Proyecto con asignación de apoyo técnico para la formulación');
            $requiere_subsanar = $total_recomendaciones == 0 &&  $evaluaciones_finalizadas > 0 ? false : ($total_recomendaciones == 0 &&  $evaluaciones_finalizadas == 0 ? false : true);

            if ($this->estado_cord_sennova != NULL && request()->isMethod('GET')) {
                $estados_evaluacion = collect(json_decode($this->estado_cord_sennova, true));
                $estado_evaluacion = $estados_evaluacion['estado'];
            }

            return collect(['estado' => $estado_evaluacion, 'numero_recomendaciones' => $total_recomendaciones, 'evaluaciones_habilitadas' => $cantidad_evaluaciones, 'evaluaciones_finalizadas' => $evaluaciones_finalizadas, 'requiere_subsanar' => $requiere_subsanar, 'alerta' => null]);
        }
    }

    /**
     * estadoEvaluacionProyectoFormulario8Linea66
     *
     * @param  mixed $puntaje_total
     * @param  mixed $total_recomendaciones
     * @param  mixed $requiere_subsanar
     * @param  mixed $causal_rechazo
     * @return void
     */
    public function estadoEvaluacionProyectoFormulario8Linea66($puntaje_total, $total_recomendaciones, $requiere_subsanar, $causal_rechazo)
    {
        $estados_evaluacion = collect(json_decode(Storage::get('json/estados-evaluacion.json'), true));

        $id = null;
        $estado_evaluacion = '';
        if ($puntaje_total == 0 && $total_recomendaciones == 0) {
            $estado_evaluacion = $estados_evaluacion->where('value', 1)->first()['label'];
            $id = $estados_evaluacion->where('value', 1)->first()['value'];
        } elseif ($puntaje_total >= 91 && $total_recomendaciones == 0) { // Preaprobado - No requiere ser subsanado
            $estado_evaluacion = $estados_evaluacion->where('value', 2)->first()['label'];
            $id = $estados_evaluacion->where('value', 2)->first()['value'];
        } elseif ($puntaje_total >= 91 && $total_recomendaciones > 0) { // Pre-aprobado con observaciones
            $estado_evaluacion = $estados_evaluacion->where('value', 3)->first()['label'];
            $id = $estados_evaluacion->where('value', 3)->first()['value'];
            $requiere_subsanar = true;
        } elseif ($puntaje_total >= 70 && $puntaje_total < 91 && $total_recomendaciones == 0) { // Pre-aprobado con observaciones
            $estado_evaluacion = $estados_evaluacion->where('value', 3)->first()['label'];
            $id = $estados_evaluacion->where('value', 3)->first()['value'];
            $requiere_subsanar = true;
        } elseif ($puntaje_total >= 70 && $puntaje_total < 91 && $total_recomendaciones > 0) { // Pre-aprobado con observaciones
            $estado_evaluacion = $estados_evaluacion->where('value', 3)->first()['label'];
            $id = $estados_evaluacion->where('value', 3)->first()['value'];
            $requiere_subsanar = true;
        } elseif ($puntaje_total < 70) { // Rechazado - No requiere ser subsanado
            $estado_evaluacion = $estados_evaluacion->where('value', 4)->first()['label'];
            $id = $estados_evaluacion->where('value', 4)->first()['value'];
            $requiere_subsanar = false;
        }

        if ($causal_rechazo) {
            $estado_evaluacion = $causal_rechazo;
        }

        return collect(['id' => $id, 'estado' => $estado_evaluacion, 'requiere_subsanar' => $requiere_subsanar]);
    }

    /**
     * estadoEvaluacionProyectoFormulario6Linea82
     *
     * @param  mixed $puntaje_total
     * @param  mixed $total_recomendaciones
     * @param  mixed $requiere_subsanar
     * @param  mixed $causal_rechazo
     * @return void
     */
    public function estadoEvaluacionProyectoFormulario6Linea82($puntaje_total, $total_recomendaciones, $requiere_subsanar, $causal_rechazo)
    {
        $estados_evaluacion = collect(json_decode(Storage::get('json/estados-evaluacion.json'), true));

        $id = null;
        $estado_evaluacion = '';
        if ($puntaje_total == 0 && $total_recomendaciones == 0) {
            $estado_evaluacion = $estados_evaluacion->where('value', 1)->first()['label'];
            $id = $estados_evaluacion->where('value', 1)->first()['value'];
        } elseif ($puntaje_total >= 91 && $total_recomendaciones == 0) { // Preaprobado - No requiere ser subsanado
            $estado_evaluacion = $estados_evaluacion->where('value', 2)->first()['label'];
            $id = $estados_evaluacion->where('value', 2)->first()['value'];
        } elseif ($puntaje_total >= 91 && $total_recomendaciones > 0) { // Pre-aprobado con observaciones
            $estado_evaluacion = $estados_evaluacion->where('value', 3)->first()['label'];
            $id = $estados_evaluacion->where('value', 3)->first()['value'];
            $requiere_subsanar = true;
        } elseif ($puntaje_total >= 70 && $puntaje_total < 91 && $total_recomendaciones == 0) { // Pre-aprobado con observaciones
            $estado_evaluacion = $estados_evaluacion->where('value', 3)->first()['label'];
            $id = $estados_evaluacion->where('value', 3)->first()['value'];
            $requiere_subsanar = true;
        } elseif ($puntaje_total >= 70 && $puntaje_total < 91 && $total_recomendaciones > 0) { // Pre-aprobado con observaciones
            $estado_evaluacion = $estados_evaluacion->where('value', 3)->first()['label'];
            $id = $estados_evaluacion->where('value', 3)->first()['value'];
            $requiere_subsanar = true;
        } elseif ($puntaje_total < 70) { // Rechazado - No requiere ser subsanado
            $estado_evaluacion = $estados_evaluacion->where('value', 4)->first()['label'];
            $id = $estados_evaluacion->where('value', 4)->first()['value'];
            $requiere_subsanar = false;
        }

        if ($causal_rechazo) {
            $estado_evaluacion = $causal_rechazo;
        }

        return collect(['id' => $id, 'estado' => $estado_evaluacion, 'requiere_subsanar' => $requiere_subsanar]);
    }

    /**
     * estadoEvaluacionProyectoFormulario8Linea66
     *
     * @param  mixed $puntaje_total
     * @param  mixed $total_recomendaciones
     * @param  mixed $requiere_subsanar
     * @return void
     */
    public function estadoEvaluacionProyectoFormulario12Linea68($puntaje_total, $total_recomendaciones, $requiere_subsanar)
    {
        $estados_evaluacion = collect(json_decode(Storage::get('json/estados_evaluacion_st.json'), true));

        $id = null;
        $estado_evaluacion = '';
        if ($puntaje_total == 0 && $total_recomendaciones == 0) {
            $estado_evaluacion = $estados_evaluacion->where('value', 1)->first()['label'];
            $id = $estados_evaluacion->where('value', 1)->first()['value'];
        } elseif ($puntaje_total >= 90 && $total_recomendaciones == 0) { // Pre-aprobado
            $estado_evaluacion = $estados_evaluacion->where('value', 2)->first()['label'];
            $id = $estados_evaluacion->where('value', 2)->first()['value'];
        } elseif ($puntaje_total >= 90 && $total_recomendaciones >= 0) { // Pre-aprobado con observaciones
            $estado_evaluacion = $estados_evaluacion->where('value', 5)->first()['label'];
            $id = $estados_evaluacion->where('value', 5)->first()['value'];
            $requiere_subsanar = true;
        } elseif ($puntaje_total >= 70 && $puntaje_total < 90 && $total_recomendaciones >= 0) { // Pre-aprobado con observaciones
            $estado_evaluacion = $estados_evaluacion->where('value', 5)->first()['label'];
            $id = $estados_evaluacion->where('value', 5)->first()['value'];
            $requiere_subsanar = true;
        } elseif ($puntaje_total >= 0 && $puntaje_total <= 69 && $total_recomendaciones >= 0) { // Rechazado
            $estado_evaluacion = $estados_evaluacion->where('value', 3)->first()['label'];
            $id = $estados_evaluacion->where('value', 3)->first()['value'];
        }

        return collect(['id' => $id, 'estado' => $estado_evaluacion, 'requiere_subsanar' => $requiere_subsanar]);
    }

    /**
     * estadoEvaluacionProyectoFormulario1Linea65
     *
     * @param  mixed $puntaje_total
     * @param  mixed $total_recomendaciones
     * @param  mixed $requiere_subsanar
     * @return void
     */
    public function estadoEvaluacionProyectoFormulario1Linea65($puntaje_total, $total_recomendaciones, $requiere_subsanar)
    {
        $id = null;
        $estado_evaluacion = '';
        if ($puntaje_total == 0 && $total_recomendaciones == 0) {
            $estado_evaluacion = 'No priorizado anexo 1C. Comuníquese con el Dinamizador SENNOVA.';
            $id = 1;
        } elseif ($puntaje_total >= 70) { // Cumple
            $estado_evaluacion = 'Cumple';
            $id = 2;
        } elseif ($puntaje_total >= 0 && $puntaje_total <= 69) { // Cumple
            $estado_evaluacion = 'Proyecto con asignación de apoyo técnico para la formulación';
            $id = 2;
        }

        $requiere_subsanar = $total_recomendaciones > 0 ? true : false;

        return collect(['id' => $id, 'estado' => $estado_evaluacion, 'requiere_subsanar' => $requiere_subsanar]);
    }

    public function getDesviacionEstandarAttribute()
    {
        $evaluaciones = $this->evaluaciones()->where('habilitado', true)->get();
        $nums = [];
        $sample = true;
        $dvst = 0;

        foreach ($evaluaciones as $evaluacion) {
            array_push($nums, $evaluacion->total_evaluacion);
        }
        if (count($nums) > 0 && ($sample ? count($nums) - 1 : count($nums)) > 0) {
            $fMean = array_sum($nums) / count($nums);
            $fVariance = 0.0;
            foreach ($nums as $i) {
                $fVariance += pow($i - $fMean, 2);
            }

            $fVariance /= ($sample ? count($nums) - 1 : count($nums));

            $dvst = (float) sqrt($fVariance);
        }

        return $dvst;
    }

    public function getListaArchivosAttribute()
    {
        $collect = collect([]);

        foreach ($this->proyectoPresupuesto()->get() as $presupuesto) {
            if ($presupuesto->formato_estudio_mercado) {
                $collect->push(['id' => $presupuesto->id, 'tipo_archivo' => 'formato_estudio_mercado', 'modulo' => 'Estudio de mercado #' . $presupuesto->id, 'path' => $presupuesto->formato_estudio_mercado, 'filename' => pathinfo($presupuesto->formato_estudio_mercado)['filename'], 'extension' => pathinfo($presupuesto->formato_estudio_mercado)['extension']]);
            }

            foreach ($presupuesto->soportesEstudioMercado()->get() as $estudio_mercado) {
                if ($estudio_mercado->soporte) {
                    $collect->push(['id' => $estudio_mercado->id, 'tipo_archivo' => 'soporte', 'modulo' => 'Soporte / Cotización', 'nombre' => $estudio_mercado->concepto, 'path' => $estudio_mercado->soporte, 'filename' => pathinfo($estudio_mercado->soporte)['filename'], 'extension' => pathinfo($estudio_mercado->soporte)['extension']]);
                }
            }
        }

        foreach ($this->entidadesAliadas()->get() as $entidad_aliada) {
            if ($entidad_aliada->entidadAliadaLinea66_82()->exists()) {
                if ($entidad_aliada->entidadAliadaLinea66_82->carta_intencion) {
                    $collect->push(['id' => $entidad_aliada->id, 'tipo_archivo' => 'carta_intencion', 'modulo' => 'Entidad aliada', 'nombre' => $entidad_aliada->nombre, 'path' => $entidad_aliada->entidadAliadaLinea66_82->carta_intencion, 'filename' => pathinfo($entidad_aliada->entidadAliadaLinea66_82->carta_intencion)['filename'], 'extension' => pathinfo($entidad_aliada->entidadAliadaLinea66_82->carta_intencion)['extension']]);
                }

                if ($entidad_aliada->entidadAliadaLinea66_82->carta_propiedad_intelectual) {
                    $collect->push(['id' => $entidad_aliada->id, 'tipo_archivo' => 'carta_propiedad_intelectual', 'modulo' => 'Entidad aliada', 'nombre' => $entidad_aliada->nombre, 'path' => $entidad_aliada->entidadAliadaLinea66_82->carta_propiedad_intelectual, 'filename' => pathinfo($entidad_aliada->entidadAliadaLinea66_82->carta_propiedad_intelectual)['filename'], 'extension' => pathinfo($entidad_aliada->entidadAliadaLinea66_82->carta_propiedad_intelectual)['extension']]);
                }
            } else if ($entidad_aliada->entidadAliadaLinea69()->exists() && $entidad_aliada->entidadAliadaLinea69->soporte_convenio) {
                $collect->push(['id' => $entidad_aliada->id, 'tipo_archivo' => 'soporte_convenio', 'modulo' => 'Entidad aliada', 'nombre' => $entidad_aliada->nombre, 'path' => $entidad_aliada->entidadAliadaLinea69->soporte_convenio, 'filename' => pathinfo($entidad_aliada->entidadAliadaLinea69->soporte_convenio)['filename'], 'extension' => pathinfo($entidad_aliada->entidadAliadaLinea69->soporte_convenio)['extension']]);
            } else if ($entidad_aliada->entidadAliadaLinea70()->exists() && $entidad_aliada->entidadAliadaLinea70->soporte_convenio) {
                $collect->push(['id' => $entidad_aliada->id, 'tipo_archivo' => 'soporte_convenio', 'modulo' => 'Entidad aliada', 'nombre' => $entidad_aliada->nombre, 'path' => $entidad_aliada->entidadAliadaLinea70->soporte_convenio, 'filename' => pathinfo($entidad_aliada->entidadAliadaLinea70->soporte_convenio)['filename'], 'extension' => pathinfo($entidad_aliada->entidadAliadaLinea70->soporte_convenio)['extension']]);
            }
        }

        foreach ($this->proyectoAnexo()->with('convocatoriaAnexo')->get() as $proyecto_anexo) {
            if ($proyecto_anexo && $proyecto_anexo->archivo) {
                $collect->push(['id' => $proyecto_anexo->id, 'tipo_archivo' => 'archivo', 'modulo' => 'Anexo', 'nombre' => $proyecto_anexo->convocatoriaAnexo->anexo->nombre, 'path' => $proyecto_anexo->archivo, 'filename' => optional(pathinfo($proyecto_anexo->archivo))['filename'], 'extension' => optional(pathinfo($proyecto_anexo->archivo))['extension']]);
            }
        }

        if ($this->proyectoFormulario4Linea70()->exists()) {
            foreach ($this->proyectoFormulario4Linea70->aulasMoviles as $aula_movil) {
                if ($aula_movil) {
                    if ($aula_movil->soat) {
                        $collect->push(['id' => $aula_movil->id, 'tipo_archivo' => 'SOAT', 'modulo' => 'Aula móvil', 'nombre' => 'Placa: ' . $aula_movil->placa, 'path' => $aula_movil->soat, 'filename' => pathinfo($aula_movil->soat)['filename'], 'extension' => pathinfo($aula_movil->soat)['extension']]);
                    }

                    if ($aula_movil->tecnicomecanica) {
                        $collect->push(['id' => $aula_movil->id, 'tipo_archivo' => 'Técnico mecánica', 'modulo' => 'Aula móvil', 'nombre' => 'Placa: ' . $aula_movil->placa, 'path' => $aula_movil->tecnicomecanica, 'filename' => pathinfo($aula_movil->tecnicomecanica)['filename'], 'extension' => pathinfo($aula_movil->tecnicomecanica)['extension']]);
                    }
                }
            }
        }

        return $collect;
    }

    public function getResultadosAttribute()
    {
        return Resultado::select('objetivos_especificos.numero', 'resultados.*')->join('efectos_directos', 'resultados.efecto_directo_id', 'efectos_directos.id')
            ->join('objetivos_especificos', 'resultados.objetivo_especifico_id', 'objetivos_especificos.id')
            ->where('efectos_directos.proyecto_id', $this->id)
            ->orderBy('objetivos_especificos.numero')
            ->get();
    }

    public function getAllowedAttribute()
    {
        $allowed_to_view      = Gate::inspect('visualizar-proyecto-autor', $this);
        $allowed_to_update    = Gate::inspect('modificar-proyecto-autor', $this);
        $allowed_to_destroy   = Gate::inspect('eliminar-proyecto-autor', $this);

        return collect(['to_view' => $allowed_to_view->allowed(), 'to_update' => $allowed_to_update->allowed(), 'to_destroy' => $allowed_to_destroy->allowed()]);
    }
}
