<?php

namespace App\Models\Evaluacion;

use App\Models\Convocatoria;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Log;

class Evaluacion extends Model
{
    use HasFactory;

    /**
     * table
     *
     * @var string
     */
    protected $table = 'evaluaciones';

    /**
     * appends
     *
     * @var array
     */
    protected $appends = ['total_evaluacion', 'validar_evaluacion', 'total_recomendaciones', 'verificar_estado_evaluacion', 'estado_proyecto_por_evaluador', 'causal_rechazo_proyecto_formulario_8_linea_66', 'allowed'];

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'convocatoria_id',
        'proyecto_id',
        'user_id',
        'finalizado',
        'habilitado',
        'iniciado',
        'modificable',
        'clausula_confidencialidad',
        'justificacion_causal_rechazo',
        'comentario_formulador',
        'comentario_evaluador',
        'replicas',
        'estado',
        'evaluacion_final'
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
     * Relationship with Proyecto
     *
     * @return object
     */
    public function proyecto()
    {
        return $this->belongsTo(\App\Models\Proyecto::class);
    }

    /**
     * Relationship with Convocatoria
     *
     * @return object
     */
    public function convocatoria()
    {
        return $this->belongsTo(\App\Models\Convocatoria::class);
    }

    /**
     * Relationship with EvaluacionProyectoFormulario1Linea65
     *
     * @return object
     */
    public function evaluacionesProyectoFormulario1Linea65()
    {
        return $this->hasMany(EvaluacionProyectoFormulario1Linea65::class);
    }

    /**
     * Relationship with EvaluacionProyectoFormulario3Linea61
     *
     * @return object
     */
    public function evaluacionesProyectoFormulario3Linea61()
    {
        return $this->hasMany(EvaluacionProyectoFormulario3Linea61::class);
    }

    /**
     * Relationship with EvaluacionProyectoFormulario4Linea70
     *
     * @return object
     */
    public function evaluacionesProyectoFormulario4Linea70()
    {
        return $this->hasMany(EvaluacionProyectoFormulario4Linea70::class);
    }

    /**
     * Relationship with EvaluacionProyectoFormulario5Linea69
     *
     * @return object
     */
    public function evaluacionesProyectoFormulario5Linea69()
    {
        return $this->hasMany(EvaluacionProyectoFormulario5Linea69::class);
    }

    /**
     * Relationship with EvaluacionProyectoFormulario6Linea82
     *
     * @return object
     */
    public function evaluacionesProyectoFormulario6Linea82()
    {
        return $this->hasMany(EvaluacionProyectoFormulario6Linea82::class);
    }

    /**
     * Relationship with EvaluacionProyectoFormulario7Linea23
     *
     * @return object
     */
    public function evaluacionesProyectoFormulario7Linea23()
    {
        return $this->hasMany(EvaluacionProyectoFormulario7Linea23::class);
    }

    /**
     * Relationship with EvaluacionProyectoFormulario8Linea66
     *
     * @return object
     */
    public function evaluacionesProyectoFormulario8Linea66()
    {
        return $this->hasMany(EvaluacionProyectoFormulario8Linea66::class);
    }

    /**
     * Relationship with EvaluacionProyectoFormulario9Linea23
     *
     * @return object
     */
    public function evaluacionesProyectoFormulario9Linea23()
    {
        return $this->hasMany(EvaluacionProyectoFormulario9Linea23::class);
    }

    /**
     * Relationship with EvaluacionProyectoFormulario10Linea69
     *
     * @return object
     */
    public function evaluacionesProyectoFormulario10Linea69()
    {
        return $this->hasMany(EvaluacionProyectoFormulario10Linea69::class);
    }

    /**
     * Relationship with EvaluacionProyectoFormulario12Linea68
     *
     * @return object
     */
    public function evaluacionesProyectoFormulario12Linea68()
    {
        return $this->hasMany(EvaluacionProyectoFormulario12Linea68::class);
    }

    /**
     * Relationship with EvaluacionProyectoFormulario13Linea65
     *
     * @return object
     */
    public function evaluacionesProyectoFormulario13Linea65()
    {
        return $this->hasMany(EvaluacionProyectoFormulario13Linea65::class);
    }

    /**
     * Relationship with EvaluacionProyectoFormulario15Linea65
     *
     * @return object
     */
    public function evaluacionesProyectoFormulario15Linea65()
    {
        return $this->hasMany(EvaluacionProyectoFormulario15Linea65::class);
    }

    /**
     * Relationship with EvaluacionProyectoFormulario16Linea65
     *
     * @return object
     */
    public function evaluacionesProyectoFormulario16Linea65()
    {
        return $this->hasMany(EvaluacionProyectoFormulario16Linea65::class);
    }

    /**
     * Relationship with EvaluacionProyectoFormulario17Linea69
     *
     * @return object
     */
    public function evaluacionesProyectoFormulario17Linea69()
    {
        return $this->hasMany(EvaluacionProyectoFormulario17Linea69::class);
    }

    /**
     * Relationship with ProyectoRolEvaluacion
     *
     * @return object
     */
    public function proyectoRolesEvaluaciones()
    {
        return $this->hasMany(ProyectoRolEvaluacion::class);
    }

    /**
     * Relationship with ProyectoPresupuestoEvaluacion
     *
     * @return object
     */
    public function proyectoPresupuestosEvaluaciones()
    {
        return $this->hasMany(ProyectoPresupuestoEvaluacion::class);
    }

    /**
     * Relationship with User
     *
     * @return object
     */
    public function evaluador()
    {
        return $this->belongsTo(\App\Models\User::class, 'user_id');
    }

    /**
     * Relationship with EvaluacionCausalRechazo
     *
     * @return object
     */
    public function evaluacionCausalesRechazo()
    {
        return $this->hasMany(EvaluacionCausalRechazo::class);
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

    public function getItemsAEvaluar($convocatoria_id, $tipo_formulario_convocatoria_id)
    {
        $items_db_evaluacion = [];

        $relationship_name = '';
        switch ($tipo_formulario_convocatoria_id) {
            case 1:
                $items_db_evaluacion = EvaluacionProyectoFormulario1Linea65::select('evaluaciones_proyectos_formulario_1_linea_65.*')->with('evaluacion.proyecto', 'preguntaEvaluacionFormulario1Linea65')->join('preguntas_evaluacion_formulario_1_linea_65', 'evaluaciones_proyectos_formulario_1_linea_65.pregunta_id',  'preguntas_evaluacion_formulario_1_linea_65.id')->where('evaluacion_id', $this->id)->whereJsonContains('preguntas_evaluacion_formulario_1_linea_65.convocatorias_id', $convocatoria_id)->orderBy('preguntas_evaluacion_formulario_1_linea_65.id', 'ASC')->get();
                $relationship_name = 'preguntaEvaluacionFormulario1Linea65';
                break;
            case 3:
                $items_db_evaluacion = EvaluacionProyectoFormulario3Linea61::select('evaluaciones_proyectos_formulario_3_linea_61.*')->with('evaluacion.proyecto', 'preguntaEvaluacionFormulario3Linea61')->join('preguntas_evaluacion_formulario_3_linea_61', 'evaluaciones_proyectos_formulario_3_linea_61.pregunta_id',  'preguntas_evaluacion_formulario_3_linea_61.id')->where('evaluacion_id', $this->id)->whereJsonContains('preguntas_evaluacion_formulario_3_linea_61.convocatorias_id', $convocatoria_id)->orderBy('preguntas_evaluacion_formulario_3_linea_61.id', 'ASC')->get();
                $relationship_name = 'preguntaEvaluacionFormulario3Linea61';
                break;
            case 4:
                $items_db_evaluacion = EvaluacionProyectoFormulario4Linea70::select('evaluaciones_proyectos_formulario_4_linea_70.*')->with('preguntaEvaluacionFormulario4Linea70')->join('preguntas_evaluacion_formulario_4_linea_70', 'evaluaciones_proyectos_formulario_4_linea_70.pregunta_id',  'preguntas_evaluacion_formulario_4_linea_70.id')->where('evaluacion_id', $this->id)->whereJsonContains('preguntas_evaluacion_formulario_4_linea_70.convocatorias_id', $convocatoria_id)->orderBy('preguntas_evaluacion_formulario_4_linea_70.id', 'ASC')->get();
                $relationship_name = 'preguntaEvaluacionFormulario4Linea70';
                break;
            case 5:
                $items_db_evaluacion = EvaluacionProyectoFormulario5Linea69::select('evaluaciones_proyectos_formulario_5_linea_69.*')->with('preguntaEvaluacionFormulario5Linea69')->join('preguntas_evaluacion_formulario_5_linea_69', 'evaluaciones_proyectos_formulario_5_linea_69.pregunta_id',  'preguntas_evaluacion_formulario_5_linea_69.id')->where('evaluacion_id', $this->id)->whereJsonContains('preguntas_evaluacion_formulario_5_linea_69.convocatorias_id', $convocatoria_id)->orderBy('preguntas_evaluacion_formulario_5_linea_69.id', 'ASC')->get();
                $relationship_name = 'preguntaEvaluacionFormulario5Linea69';
                break;
            case 6:
                $items_db_evaluacion = EvaluacionProyectoFormulario6Linea82::select('evaluaciones_proyectos_formulario_6_linea_82.*')->with('preguntaEvaluacionFormulario6Linea82')->join('preguntas_evaluacion_formulario_6_linea_82', 'evaluaciones_proyectos_formulario_6_linea_82.pregunta_id',  'preguntas_evaluacion_formulario_6_linea_82.id')->where('evaluacion_id', $this->id)->whereJsonContains('preguntas_evaluacion_formulario_6_linea_82.convocatorias_id', $convocatoria_id)->orderBy('preguntas_evaluacion_formulario_6_linea_82.id', 'ASC')->get();
                $relationship_name = 'preguntaEvaluacionFormulario6Linea82';
                break;
            case 7:
                $items_db_evaluacion = EvaluacionProyectoFormulario7Linea23::select('evaluaciones_proyectos_formulario_7_linea_23.*')->with('preguntaEvaluacionFormulario7Linea23')->join('preguntas_evaluacion_formulario_7_linea_23', 'evaluaciones_proyectos_formulario_7_linea_23.pregunta_id',  'preguntas_evaluacion_formulario_7_linea_23.id')->where('evaluacion_id', $this->id)->whereJsonContains('preguntas_evaluacion_formulario_7_linea_23.convocatorias_id', $convocatoria_id)->orderBy('preguntas_evaluacion_formulario_7_linea_23.id', 'ASC')->get();
                $relationship_name = 'preguntaEvaluacionFormulario7Linea23';
                break;
            case 8:
                $items_db_evaluacion = EvaluacionProyectoFormulario8Linea66::select('evaluaciones_proyectos_formulario_8_linea_66.*')->with('preguntaEvaluacionFormulario8Linea66')->join('preguntas_evaluacion_formulario_8_linea_66', 'evaluaciones_proyectos_formulario_8_linea_66.pregunta_id',  'preguntas_evaluacion_formulario_8_linea_66.id')->where('evaluacion_id', $this->id)->whereJsonContains('preguntas_evaluacion_formulario_8_linea_66.convocatorias_id', $convocatoria_id)->orderBy('preguntas_evaluacion_formulario_8_linea_66.id', 'ASC')->get();
                $relationship_name = 'preguntaEvaluacionFormulario8Linea66';
                break;
            case 9:
                $items_db_evaluacion = EvaluacionProyectoFormulario9Linea23::select('evaluaciones_proyectos_formulario_9_linea_23.*')->with('preguntaEvaluacionFormulario9Linea23')->join('preguntas_evaluacion_formulario_9_linea_23', 'evaluaciones_proyectos_formulario_9_linea_23.pregunta_id',  'preguntas_evaluacion_formulario_9_linea_23.id')->where('evaluacion_id', $this->id)->whereJsonContains('preguntas_evaluacion_formulario_9_linea_23.convocatorias_id', $convocatoria_id)->orderBy('preguntas_evaluacion_formulario_9_linea_23.id', 'ASC')->get();
                $relationship_name = 'preguntaEvaluacionFormulario9Linea23';
                break;
            case 10:
                $items_db_evaluacion = EvaluacionProyectoFormulario10Linea69::select('evaluaciones_proyectos_formulario_10_linea_69.*')->with('preguntaEvaluacionFormulario10Linea69')->join('preguntas_evaluacion_formulario_10_linea_69', 'evaluaciones_proyectos_formulario_10_linea_69.pregunta_id',  'preguntas_evaluacion_formulario_10_linea_69.id')->where('evaluacion_id', $this->id)->whereJsonContains('preguntas_evaluacion_formulario_10_linea_69.convocatorias_id', $convocatoria_id)->orderBy('preguntas_evaluacion_formulario_10_linea_69.id', 'ASC')->get();
                $relationship_name = 'preguntaEvaluacionFormulario10Linea69';
                break;
            case 12:
                $items_db_evaluacion = EvaluacionProyectoFormulario12Linea68::select('evaluaciones_proyectos_formulario_12_linea_68.*')->with('preguntaEvaluacionFormulario12Linea68')->join('preguntas_evaluacion_formulario_12_linea_68', 'evaluaciones_proyectos_formulario_12_linea_68.pregunta_id',  'preguntas_evaluacion_formulario_12_linea_68.id')->where('evaluacion_id', $this->id)->whereJsonContains('preguntas_evaluacion_formulario_12_linea_68.convocatorias_id', $convocatoria_id)->orderBy('preguntas_evaluacion_formulario_12_linea_68.id', 'ASC')->get();
                $relationship_name = 'preguntaEvaluacionFormulario12Linea68';
                break;
            case 13:
                $items_db_evaluacion = EvaluacionProyectoFormulario13Linea65::select('evaluaciones_proyectos_formulario_13_linea_65.*')->with('preguntaEvaluacionFormulario13Linea65')->join('preguntas_evaluacion_formulario_13_linea_65', 'evaluaciones_proyectos_formulario_13_linea_65.pregunta_id',  'preguntas_evaluacion_formulario_13_linea_65.id')->where('evaluacion_id', $this->id)->whereJsonContains('preguntas_evaluacion_formulario_13_linea_65.convocatorias_id', $convocatoria_id)->orderBy('preguntas_evaluacion_formulario_13_linea_65.id', 'ASC')->get();
                $relationship_name = 'preguntaEvaluacionFormulario13Linea65';
                break;
            case 15:
                $items_db_evaluacion = EvaluacionProyectoFormulario15Linea65::select('evaluaciones_proyectos_formulario_15_linea_65.*')->with('preguntaEvaluacionFormulario15Linea65')->join('preguntas_evaluacion_formulario_15_linea_65', 'evaluaciones_proyectos_formulario_15_linea_65.pregunta_id',  'preguntas_evaluacion_formulario_15_linea_65.id')->where('evaluacion_id', $this->id)->whereJsonContains('preguntas_evaluacion_formulario_15_linea_65.convocatorias_id', $convocatoria_id)->orderBy('preguntas_evaluacion_formulario_15_linea_65.id', 'ASC')->get();
                $relationship_name = 'preguntaEvaluacionFormulario15Linea65';
                break;
            case 16:
                $items_db_evaluacion = EvaluacionProyectoFormulario16Linea65::select('evaluaciones_proyectos_formulario_16_linea_65.*')->with('preguntaEvaluacionFormulario16Linea65')->join('preguntas_evaluacion_formulario_16_linea_65', 'evaluaciones_proyectos_formulario_16_linea_65.pregunta_id',  'preguntas_evaluacion_formulario_16_linea_65.id')->where('evaluacion_id', $this->id)->whereJsonContains('preguntas_evaluacion_formulario_16_linea_65.convocatorias_id', $convocatoria_id)->orderBy('preguntas_evaluacion_formulario_16_linea_65.id', 'ASC')->get();
                $relationship_name = 'preguntaEvaluacionFormulario16Linea65';
                break;
            case 17:
                $items_db_evaluacion = EvaluacionProyectoFormulario17Linea69::select('evaluaciones_proyectos_formulario_17_linea_69.*')->with('preguntaEvaluacionFormulario17Linea69')->join('preguntas_evaluacion_formulario_17_linea_69', 'evaluaciones_proyectos_formulario_17_linea_69.pregunta_id',  'preguntas_evaluacion_formulario_17_linea_69.id')->where('evaluacion_id', $this->id)->whereJsonContains('preguntas_evaluacion_formulario_17_linea_69.convocatorias_id', $convocatoria_id)->orderBy('preguntas_evaluacion_formulario_17_linea_69.id', 'ASC')->get();
                $relationship_name = 'preguntaEvaluacionFormulario17Linea69';
                break;
            default:
                break;
        }

        $items_evaluacion = collect([]);

        foreach ($items_db_evaluacion as $item) {
            $items_evaluacion->push([
                'form_evaluacion_id_pregunta_id_' . $item->pregunta_id          => $item->id,
                'form_puntaje_pregunta_id_' . $item->pregunta_id                => $item->puntaje,
                'form_comentario_pregunta_id_' . $item->pregunta_id             => $item->comentario,
                'form_requiere_comentario_pregunta_id_' . $item->pregunta_id    => $item->comentario ? true : false,
                'form_id_pregunta_id_' . $item->pregunta_id                     => $item->pregunta_id,
                'pregunta_id'                                                   => $item->pregunta_id,
                'tipo_formulario_convocatoria_id'                               => $this->proyecto->tipo_formulario_convocatoria_id,
                'evaluacion_id'                                                 => $this->id,
                'campo_pregunta_id_' . $item->pregunta_id                       => $item->{$relationship_name}->campo,
                'puntaje_maximo_pregunta_id_' . $item->pregunta_id              => $item->{$relationship_name}->puntaje_maximo,
                'criterio_pregunta_id_' . $item->pregunta_id                    => $item->{$relationship_name}->criterio,
                'allowed'                                                       => $this->allowed,
                'finalizado'                                                    => $this->finalizado,
                'clausula_confidencialidad'                                     => $this->clausula_confidencialidad,
                'puntaje_total'                                                 => $items_db_evaluacion->sum('puntaje')
            ]);
        }

        return $items_evaluacion;
    }

    /**
     * getProyectosPorRol
     *
     * @return object
     */
    public static function getEvaluacionesPorRol()
    {
        /** @var \App\Models\User */
        $auth_user = Auth::user();

        $query = Evaluacion::with(
            [
                'proyecto.proyectoFormulario1Linea65:id,titulo,fecha_inicio,fecha_finalizacion',
                'proyecto.proyectoFormulario3Linea61:id,titulo,fecha_inicio,fecha_finalizacion',
                'proyecto.proyectoFormulario4Linea70:id,tecnoacademia_id,fecha_inicio,fecha_finalizacion',
                'proyecto.proyectoFormulario5Linea69:id,nodo_tecnoparque_id,fecha_inicio,fecha_finalizacion',
                'proyecto.proyectoFormulario6Linea82:id,titulo,fecha_inicio,fecha_finalizacion',
                'proyecto.proyectoFormulario7Linea23:id,titulo,fecha_inicio,fecha_finalizacion',
                'proyecto.proyectoFormulario8Linea66:id,titulo,fecha_inicio,fecha_finalizacion',
                'proyecto.proyectoFormulario9Linea23:id,titulo,fecha_inicio,fecha_finalizacion',
                'proyecto.proyectoFormulario10Linea69:id,hub_innovacion_id,fecha_inicio,fecha_finalizacion',
                'proyecto.proyectoFormulario11Linea83:id,titulo,fecha_inicio,fecha_finalizacion',
                'proyecto.proyectoFormulario12Linea68:id,titulo,fecha_inicio,fecha_finalizacion',
                'proyecto.proyectoFormulario13Linea65:id,titulo,fecha_inicio,fecha_finalizacion',
                'proyecto.proyectoFormulario15Linea65:id,titulo,fecha_inicio,fecha_finalizacion',
                'proyecto.proyectoFormulario16Linea65:id,titulo,fecha_inicio,fecha_finalizacion',
                'proyecto.proyectoFormulario17Linea69:id,nodo_tecnoparque_id,fecha_inicio,fecha_finalizacion',
                'proyecto.convocatoria',
                'proyecto.centroFormacion',
                'evaluador:id,nombre'
            ]
        );
        if ($auth_user->hasRole([11, 33]) && !$auth_user->hasRole([1, 5, 17, 18, 19])) {
            $query->where('user_id', $auth_user->id);
        }
        $query->orderBy('id', 'DESC');
        $query->orderBy('iniciado', 'ASC');
        $query->orderBy('habilitado', 'DESC');
        $query->filterEvaluacion(request()->only('search', 'estado'));
        $query->paginate();

        return $query->paginate();
    }

    /**
     * getVerificarEstadoEvaluacionAttribute
     *
     * @return void
     */
    public function getVerificarEstadoEvaluacionAttribute()
    {
        $estado = null;
        // if ($this->evaluacionProyectoFormulario8Linea66 && $this->proyecto->proyectoFormulario8Linea66()->exists()) {
        //     $estado = $this->finalizado ? 'Finalizado' : ($this->evaluacionProyectoFormulario8Linea66->updated_at == null ? 'Sin evaluar' : 'Evaluación iniciada');
        // } else if ($this->evaluacionProyectoFormulario6Linea82 && $this->proyecto->proyectoFormulario6Linea82()->exists()) {
        //     $estado = $this->finalizado ? 'Finalizado' : ($this->evaluacionProyectoFormulario6Linea82->updated_at == null ? 'Sin evaluar' : 'Evaluación iniciada');
        // } else if ($this->evaluacionProyectoFormulario1Linea65 && $this->proyecto->proyectoFormulario1Linea65()->exists()) {
        //     $estado = $this->finalizado ? 'Finalizado' : ($this->evaluacionProyectoFormulario1Linea65->updated_at == null ? 'Sin evaluar' : 'Evaluación iniciada');
        // } else if ($this->evaluacionProyectoFormulario4Linea70 && $this->proyecto->proyectoFormulario4Linea70()->exists()) {
        //     $estado = $this->finalizado ? 'Finalizado' : ($this->evaluacionProyectoFormulario4Linea70->updated_at == null ? 'Sin evaluar' : 'Evaluación iniciada');
        // } else if ($this->evaluacionProyectoFormulario5Linea69 && $this->proyecto->proyectoFormulario5Linea69()->exists()) {
        //     $estado = $this->finalizado ? 'Finalizado' : ($this->evaluacionProyectoFormulario5Linea69->updated_at == null ? 'Sin evaluar' : 'Evaluación iniciada');
        // } else if ($this->evaluacionProyectoFormulario12Linea68 && $this->proyecto->proyectoFormulario12Linea68()->exists()) {
        //     $estado = $this->finalizado ? 'Finalizado' : ($this->evaluacionProyectoFormulario12Linea68->updated_at == null ? 'Sin evaluar' : 'Evaluación iniciada');
        // }

        return $estado;
    }

    public function getTotalEvaluacionAttribute()
    {
        $nombres_formularios = [
            'Formulario1Linea65',
            'Formulario6Linea82',
            'Formulario8Linea66',
            'Formulario12Linea68',
        ];

        $total = 0;

        foreach ($nombres_formularios as $nombre_formulario) {
            $evaluacion = $this->getEvaluacion($nombre_formulario);

            if ($evaluacion) {
                $total += $this->getFormPuntaje($evaluacion);
            }
        }

        return round($total, 2);
    }

    protected function getEvaluacion($nombre_form)
    {
        $nombre_relacion = 'evaluacionProyecto' . $nombre_form;

        return $this->evaluacionExists($nombre_relacion) ? $this->$nombre_relacion : null;
    }

    protected function evaluacionExists($nombre_relacion)
    {
        return $this->$nombre_relacion && $this->$nombre_relacion()->exists();
    }

    protected function getFormPuntaje($evaluacion)
    {
        $puntaje_campos = [];

        return collect($puntaje_campos)->sum(fn ($field) => $evaluacion->$field);
    }

    public function getTotalRecomendacionesAttribute()
    {
        $total = 0;

        $total += $this->proyectoPresupuestosEvaluaciones()->where('correcto', false)->count();
        $total += $this->proyectoRolesEvaluaciones()->where('correcto', false)->count();

        return $total;
    }

    public function getValidarEvaluacionAttribute()
    {
        $itemsPorEvaluar = [];
        $countRolesSinEvaluar = 0;

        if ($this->proyecto && $this->proyecto->tipoFormularioConvocatoria->lineaProgramatica->codigo != 23) {
            foreach ($this->proyecto->proyectoRolesSennova as $proyectoRol) {
                !$proyectoRol->proyectoRolesEvaluaciones()->where('evaluacion_id', $this->id)->first() ? $countRolesSinEvaluar++ : null;
            }
        }

        $countRolesSinEvaluar > 0 ? array_push($itemsPorEvaluar, 'Hay ' . $countRolesSinEvaluar . ' rol(es) sin evaluar') : null;

        $countPresupuestosSinEvaluar = 0;
        if ($this->proyecto) {
            foreach ($this->proyecto->proyectoPresupuesto as $proyectoPresupuesto) {
                !$proyectoPresupuesto->proyectoPresupuestosEvaluaciones()->where('evaluacion_id', $this->id)->first() ? $countPresupuestosSinEvaluar++ : null;
            }
        }

        $countPresupuestosSinEvaluar > 0 ? array_push($itemsPorEvaluar, 'Hay ' . $countPresupuestosSinEvaluar . ' rubro(s) presupuestal(es) sin evaluar') : null;

        return $itemsPorEvaluar;
    }

    public function getEstadoProyectoPorEvaluadorAttribute()
    {
        // if ($this->evaluacionProyectoFormulario8Linea66()->exists()) {
        //     $causal_rechazo = null;
        //     if ($this->evaluacionCausalesRechazo()->where('causal_rechazo', '=', 4)->first()) {
        //         $causal_rechazo = 'En revisión por Cord. SENNOVA';
        //     } else if ($this->evaluacionCausalesRechazo()->whereIn('causal_rechazo', [1, 2, 3])->first()) {
        //         $causal_rechazo = 'Rechazado - Por causal de rechazo';
        //     }
        //     return $this->proyecto->estadoEvaluacionProyectoFormulario8Linea66($this->total_evaluacion, $this->total_recomendaciones, null, $causal_rechazo);
        // } else if ($this->evaluacionProyectoFormulario6Linea82()->exists()) {
        //     $causal_rechazo = null;
        //     if ($this->evaluacionCausalesRechazo()->where('causal_rechazo', '=', 4)->first()) {
        //         $causal_rechazo = 'En revisión por Cord. SENNOVA';
        //     } else if ($this->evaluacionCausalesRechazo()->whereIn('causal_rechazo', [1, 2, 3])->first()) {
        //         $causal_rechazo = 'Rechazado - Por causal de rechazo';
        //     }
        //     return $this->proyecto->estadoEvaluacionProyectoFormulario6Linea82($this->total_evaluacion, $this->total_recomendaciones, null, $causal_rechazo);
        // } else if ($this->evaluacionProyectoFormulario12Linea68()->exists()) {
        //     return $this->proyecto->estadoEvaluacionProyectoFormulario12Linea68($this->total_evaluacion, $this->total_recomendaciones, null);
        // } else if ($this->evaluacionProyectoFormulario1Linea65()->exists()) {
        //     return $this->proyecto->estadoEvaluacionProyectoFormulario1Linea65($this->total_evaluacion, $this->total_recomendaciones, null);
        // }
    }

    public function getCausalRechazoProyectoFormulario8Linea66Attribute()
    {
        $causal_rechazo = null;
        // if ($this->evaluacionProyectoFormulario8Linea66()->exists()) {
        //     if ($this->evaluacionCausalesRechazo()->where('causal_rechazo', '=', 4)->first()) {
        //         $causal_rechazo = 'En revisión por Cord. SENNOVA';
        //     } else if ($this->evaluacionCausalesRechazo()->whereIn('causal_rechazo', [1, 2, 3])->first()) {
        //         $causal_rechazo = 'Rechazado - Por causal de rechazo';
        //     }
        // }
        return $causal_rechazo;
    }

    /**
     * Filtrar registros
     *
     * @param  mixed $query
     * @param  mixed $filters
     * @return void
     */
    public function scopeFilterEvaluacion($query, array $filters)
    {
        $query->when($filters['search'] ?? null, function ($query, $search) {
            $search = str_replace('"', "", $search);
            $search = str_replace("'", "", $search);
            $search = str_replace(' ', '%%', $search);

            $query->select('users.nombre', 'evaluaciones.*');
            $query->join('users', 'evaluaciones.user_id', 'users.id');
            $query->where('users.nombre', 'ilike', '%' . $search . '%');
            if (is_numeric($search)) {
                $query->orWhere('evaluaciones.proyecto_id', $search - 8000);
            }
        })->when($filters['estado'] ?? null, function ($query, $estado) {
            // if ($estado == 'finalizados idi') {
            //     $query->join('evaluaciones_proyectos_formulario_8_linea_66', 'evaluaciones.id', 'evaluaciones_proyectos_formulario_8_linea_66.id');
            //     $query->where('evaluaciones.finalizado', true);
            // } else if ($estado == 'finalizados cultira innovacion') {
            //     $query->join('evaluaciones_proyectos_formulario_1_linea_65', 'evaluaciones.id', 'evaluaciones_proyectos_formulario_1_linea_65.id');
            //     $query->where('evaluaciones.finalizado', true);
            // } else if ($estado == 'finalizados ta') {
            //     $query->join('evaluaciones_proyectos_formulario_4_linea_70', 'evaluaciones.id', 'evaluaciones_proyectos_formulario_4_linea_70.id');
            //     $query->where('evaluaciones.finalizado', true);
            // } else if ($estado == 'finalizados tp') {
            //     $query->join('evaluaciones_proyectos_formulario_5_linea_69', 'evaluaciones.id', 'evaluaciones_proyectos_formulario_5_linea_69.id');
            //     $query->where('evaluaciones.finalizado', true);
            // } else if ($estado == 'finalizados st') {
            //     $query->join('evaluaciones_proyectos_formulario_12_linea_68', 'evaluaciones.id', 'evaluaciones_proyectos_formulario_12_linea_68.id');
            //     $query->where('evaluaciones.finalizado', true);
            // } else if ($estado == 'sin evaluar idi') {
            //     $query->join('evaluaciones_proyectos_formulario_8_linea_66', 'evaluaciones.id', 'evaluaciones_proyectos_formulario_8_linea_66.id');
            //     $query->where('evaluaciones_proyectos_formulario_8_linea_66.updated_at', null);
            // } else if ($estado == 'sin evaluar cultura innovacion') {
            //     $query->join('evaluaciones_proyectos_formulario_1_linea_65', 'evaluaciones.id', 'evaluaciones_proyectos_formulario_1_linea_65.id');
            //     $query->where('evaluaciones_proyectos_formulario_1_linea_65.updated_at', null);
            // } else if ($estado == 'sin evaluar ta') {
            //     $query->join('evaluaciones_proyectos_formulario_4_linea_70', 'evaluaciones.id', 'evaluaciones_proyectos_formulario_4_linea_70.id');
            //     $query->where('evaluaciones_proyectos_formulario_4_linea_70.updated_at', null);
            // } else if ($estado == 'sin evaluar tp') {
            //     $query->join('evaluaciones_proyectos_formulario_5_linea_69', 'evaluaciones.id', 'evaluaciones_proyectos_formulario_5_linea_69.id');
            //     $query->where('evaluaciones_proyectos_formulario_5_linea_69.updated_at', null);
            // } else if ($estado == 'sin evaluar st') {
            //     $query->join('evaluaciones_proyectos_formulario_12_linea_68', 'evaluaciones.id', 'evaluaciones_proyectos_formulario_12_linea_68.id');
            //     $query->where('evaluaciones_proyectos_formulario_12_linea_68.updated_at', null);
            // }
        });
    }

    public function getAllowedAttribute()
    {
        $allowed_to_view      = Gate::inspect('visualizar-evaluacion-autor', $this);
        $allowed_to_update    = Gate::inspect('modificar-evaluacion-autor', $this);
        $allowed_To_destroy   = $allowed_to_update;

        return collect(['to_view' => $allowed_to_view->allowed(), 'to_update' => $allowed_to_update->allowed(), 'to_destroy' => $allowed_To_destroy->allowed()]);
    }
}
