<?php

namespace App\Http\Controllers;

use App\Helpers\SelectHelper;
use App\Http\Requests\ActividadRequest;
use App\Models\Convocatoria;
use App\Models\Proyecto;
use App\Models\Actividad;
use App\Models\AulaMovil;
use App\Models\Evaluacion\Evaluacion;
use App\Models\ProyectoPresupuesto;
use App\Models\ProyectoRolSennova;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ActividadController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Convocatoria $convocatoria, Proyecto $proyecto, Request $request)
    {
        $this->authorize('visualizar-proyecto-autor', $proyecto);

        $proyecto->load('evaluaciones.evaluacionProyectoLinea66');
        $proyecto->load('evaluaciones.evaluacionProyectoLinea70');

        $objetivo_especifico                    = $proyecto->causasDirectas()->with('objetivoEspecifico')->get()->pluck('objetivoEspecifico')->flatten()->filter();
        $proyecto->codigo_linea_programatica    = $proyecto->lineaProgramatica->codigo;

        $resultados = $proyecto->efectosDirectos()->whereHas('resultado', function ($query) {
                        $query->where('descripcion', '!=', null);
                    })->with('resultado')->get()->pluck('resultado')->flatten();

        $productos  = $resultados->map(function ($resultado) {
                        return $resultado->productos;
                    })->flatten();

        switch ($proyecto) {
            case $proyecto->proyectoLinea66()->exists():
                $proyecto->metodologia = $proyecto->proyectoLinea66->metodologia;
                break;
            case $proyecto->proyectoLinea70()->exists():
                $proyecto->metodologia                          = $proyecto->proyectoLinea70->metodologia;
                $proyecto->metodologia_local                    = $proyecto->proyectoLinea70->metodologia_local;
                $proyecto->otras_nuevas_instituciones           = $proyecto->proyectoLinea70->otras_nuevas_instituciones;
                $proyecto->otras_nombre_instituciones_programas = $proyecto->proyectoLinea70->otras_nombre_instituciones_programas;
                $proyecto->otras_nombre_instituciones           = $proyecto->proyectoLinea70->otras_nombre_instituciones;
                $proyecto->impacto_municipios                   = $proyecto->proyectoLinea70->impacto_municipios;
                $proyecto->nombre_instituciones                 = $proyecto->proyectoLinea70->nombre_instituciones;
                $proyecto->nombre_instituciones_programas       = $proyecto->proyectoLinea70->nombre_instituciones_programas;
                $proyecto->nuevas_instituciones                 = $proyecto->proyectoLinea70->nuevas_instituciones;
                $proyecto->proyeccion_nuevas_instituciones      = $proyecto->proyectoLinea70->proyeccion_nuevas_instituciones;
                $proyecto->proyeccion_articulacion_media        = $proyecto->proyectoLinea70->proyeccion_articulacion_media;
                $proyecto->proyectos_macro                      = $proyecto->proyectoLinea70->proyectos_macro;
                $proyecto->implementacion_modelo_pedagogico     = $proyecto->proyectoLinea70->implementacion_modelo_pedagogico;
                $proyecto->articulacion_plan_educacion          = $proyecto->proyectoLinea70->articulacion_plan_educacion;
                $proyecto->articulacion_territorios_stem        = $proyecto->proyectoLinea70->articulacion_territorios_stem;
                $programas_formacion                            = SelectHelper::programasFormacion()->where('centro_formacion_id', $proyecto->centroFormacion->id)->values()->all();
                $modalidades                                    = json_decode(Storage::get('json/modalidades-estudio.json'), true);
                $niveles_formacion                              = json_decode(Storage::get('json/nivel-formacion.json'), true);

                $proyecto->municipios;
                $proyecto->municipiosAImpactar;
                $proyecto->disenosCurriculares;
                $proyecto->programasFormacionLinea70;

                break;
            case $proyecto->proyectoLinea69()->exists():
                $proyecto->metodologia                              = $proyecto->proyectoLinea69->metodologia;
                $proyecto->metodologia_local                        = $proyecto->proyectoLinea69->metodologia_local;
                $proyecto->impacto_municipios                       = $proyecto->proyectoLinea69->impacto_municipios;
                $proyecto->estrategia_articulacion_prox_vigencia    = $proyecto->proyectoLinea69->estrategia_articulacion_prox_vigencia;
                $proyecto->alianzas_estrategicas                    = $proyecto->proyectoLinea69->alianzas_estrategicas;
                $proyecto->estrategia_divulgacion                   = $proyecto->proyectoLinea69->estrategia_divulgacion;
                $proyecto->promover_productividad                   = $proyecto->proyectoLinea69->promover_productividad;
                $proyecto->departamentos_atencion_talentos          = $proyecto->proyectoLinea69->departamentos_atencion_talentos;
                $proyecto->estrategia_atencion_talentos             = $proyecto->proyectoLinea69->estrategia_atencion_talentos;
                break;
            case $proyecto->proyectoLinea65()->exists():
                $proyecto->metodologia      = $proyecto->proyectoLinea65->metodologia;
                $proyecto->tipo_proyecto    = $proyecto->proyectoLinea65->tipo_proyecto;
                break;
            case $proyecto->proyectoLinea68()->exists():
                $proyecto->metodologia = $proyecto->proyectoLinea68->metodologia;
                break;
            default:
                break;
        }

        return Inertia::render('Convocatorias/Proyectos/Actividades/Index', [
            'convocatoria'              => $convocatoria->only('id', 'esta_activa', 'fase_formateada', 'fase', 'tipo_convocatoria', 'mostrar_recomendaciones', 'year', 'min_fecha_inicio_proyectos', 'max_fecha_finalizacion_proyectos'),
            'proyecto'                  => $proyecto->only(
                                            'id',
                                            'codigo_linea_programatica',
                                            'precio_proyecto',
                                            'modificable',
                                            'metodologia',
                                            'metodologia_local',
                                            'otras_nuevas_instituciones',
                                            'otras_nombre_instituciones_programas',
                                            'otras_nombre_instituciones',
                                            'impacto_municipios',
                                            'nombre_instituciones',
                                            'nombre_instituciones_programas',
                                            'nuevas_instituciones',
                                            'proyeccion_nuevas_instituciones',
                                            'proyeccion_articulacion_media',
                                            'proyectos_macro',
                                            'implementacion_modelo_pedagogico',
                                            'articulacion_plan_educacion',
                                            'articulacion_territorios_stem',
                                            'impacto_municipios_tp',
                                            'estrategia_articulacion_prox_vigencia',
                                            'alianzas_estrategicas',
                                            'estrategia_divulgacion',
                                            'promover_productividad',
                                            'departamentos_atencion_talentos',
                                            'estrategia_atencion_talentos',
                                            'municipios',
                                            'municipiosAImpactar',
                                            'disenosCurriculares',
                                            'programasFormacionLinea70',
                                            'en_subsanacion',
                                            'evaluaciones',
                                            'mostrar_recomendaciones',
                                            'allowed',
                                            'tipo_proyecto'
                                        ),
            'evaluacion'                => Evaluacion::find(request()->evaluacion_id),
            'actividades'               => Actividad::whereIn(
                                            'objetivo_especifico_id',
                                                $objetivo_especifico->map(function ($objetivo_especifico) {
                                                    return $objetivo_especifico->id;
                                                })
                                            )->with('productos', 'proyectoPresupuesto', 'proyectoRolesSennova', 'objetivoEspecifico', 'objetivoEspecifico.resultados')->orderBy('objetivo_especifico_id', 'ASC')
                                            ->filterActividad(request()->only('search'))->paginate()->appends(['search' => request()->search]),
            'actividadesGantt'          => Actividad::whereIn(
                                            'objetivo_especifico_id',
                                                $objetivo_especifico->map(function ($objetivo_especifico) {
                                                    return $objetivo_especifico->id;
                                                })
                                            )->where('fecha_inicio', '<>', null)->orderBy('fecha_inicio', 'ASC')->get(),
            'programas_formacion'       => $programas_formacion ?? [],
            'modalidades'               => $modalidades ?? [],
            'niveles_formacion'         => $niveles_formacion ?? [],
            'regionales'                => SelectHelper::regionales(),
            'municipios'                => SelectHelper::municipios(),
            'disenos_curriculares'      => SelectHelper::disenoCurriculares()->where('habilitado_convocatoria', true)->values()->all(),
            'tecnoacademia_relacionada' => $proyecto->tecnoacademiaLineasTecnoacademia()->first() ? $proyecto->tecnoacademiaLineasTecnoacademia()->first()->tecnoacademia : null,
            'aulas_moviles'             => AulaMovil::where('ta_id', $proyecto->id)->get(),

            'proyecto_presupuesto'      => ProyectoPresupuesto::select('proyecto_presupuesto.id as value', 'proyecto_presupuesto.descripcion as label')->where('proyecto_presupuesto.proyecto_id', $proyecto->id)->with('convocatoriaProyectoRubrosPresupuestales.presupuestoSennova.usoPresupuestal')->get(),
            'proyecto_roles'            => ProyectoRolSennova::select('proyecto_rol_sennova.id as value', 'roles_sennova.nombre as label')
                                            ->join('convocatoria_rol_sennova', 'proyecto_rol_sennova.convocatoria_rol_sennova_id', 'convocatoria_rol_sennova.id')
                                            ->join('roles_sennova', 'convocatoria_rol_sennova.rol_sennova_id', 'roles_sennova.id')
                                            ->where('proyecto_rol_sennova.proyecto_id', $proyecto->id)->with('convocatoriaRolSennova.rolSennova:id,nombre')->get(),
            'productos'                 => $productos,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create(Convocatoria $convocatoria, Proyecto $proyecto)
    {
        $this->authorize('visualizar-proyecto-autor', $proyecto);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(ActividadRequest $request, Convocatoria $convocatoria, Proyecto $proyecto)
    {
        $this->authorize('modificar-proyecto-autor', $proyecto);

        return redirect()->route('convocatorias.proyectos.actividades.index')->with('success', 'El recurso se ha creado correctamente.');
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Actividad  $actividad
     * @return \Illuminate\Http\Response
     */
    public function show(Convocatoria $convocatoria, Proyecto $proyecto, Actividad $actividad)
    {
        $this->authorize('visualizar-proyecto-autor', $proyecto);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Actividad  $actividad
     * @return \Illuminate\Http\Response
     */
    public function edit(Convocatoria $convocatoria, Proyecto $proyecto, Actividad $actividad)
    {
        $this->authorize('visualizar-proyecto-autor', $proyecto);

        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Actividad  $actividad
     * @return \Illuminate\Http\Response
     */
    public function update(ActividadRequest $request,  Convocatoria $convocatoria, Proyecto $proyecto, Actividad $actividad)
    {
        $this->authorize('modificar-proyecto-autor', $proyecto);

        $actividad->descripcion         = $request->descripcion;
        $actividad->fecha_inicio        = $request->fecha_inicio;
        $actividad->fecha_finalizacion  = $request->fecha_finalizacion;
        $actividad->resultado()->associate($request->resultado_id);

        $actividad->save();

        $actividad->proyectoPresupuesto()->sync($request->proyecto_presupuesto_id);
        $actividad->proyectoRolesSennova()->sync($request->proyecto_rol_sennova_id);

        return back()->with('success', 'El recurso se ha actualizado correctamente.');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Actividad  $actividad
     * @return \Illuminate\Http\Response
     */
    public function destroy(Convocatoria $convocatoria, Proyecto $proyecto, Actividad $actividad)
    {
        $this->authorize('modificar-proyecto-autor', $proyecto);
        $actividad->delete();

        return redirect()->route('convocatorias.proyectos.actividades.index', [$convocatoria, $proyecto])->with('success', 'El recurso se ha eliminado correctamente.');
    }

    /**
     * updateMetodologia
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Proyecto  $proyecto
     * @return \Illuminate\Http\Response
     */
    public function updateMetodologia(Request $request, Convocatoria $convocatoria, Proyecto $proyecto)
    {
        $this->authorize('modificar-proyecto-autor', $proyecto);

        $request->validate([
            'metodologia' => 'required|string|max:20000',
        ]);

        switch ($proyecto) {
            case $proyecto->proyectoLinea66()->exists():
                $proyecto_linea_66              = $proyecto->proyectoLinea66;
                $proyecto_linea_66->metodologia = $request->metodologia;

                $proyecto_linea_66->save();
                break;
            case $proyecto->proyectoLinea70()->exists():
                $request->merge(['proyeccion_nuevas_instituciones' => $request->proyeccion_nuevas_instituciones]);
                $request->merge(['proyeccion_articulacion_media' => $request->proyeccion_articulacion_media]);

                if (is_array($request->programas_formacion_articulados)) {
                    $request->merge([
                        'programas_formacion_articulados' => json_encode($request->programas_formacion_articulados)
                    ]);
                }

                if (is_array($request->diseno_curricular_id)) {
                    $request->merge([
                        'diseno_curricular_id' => json_encode($request->diseno_curricular_id)
                    ]);
                }

                if (is_array($request->municipios)) {
                    $request->merge([
                        'municipios' => json_encode($request->municipios)
                    ]);
                }

                if (is_array($request->municipios_impactar)) {
                    $request->merge([
                        'municipios_impactar' => json_encode($request->municipios_impactar)
                    ]);
                }

                $request->validate([
                    'municipios*'                               => 'required|integer|exists:municipios,id',
                    'municipios_impactar*'                      => 'required|integer|exists:municipios,id',
                    'nombre_instituciones'                      => 'nullable|json',
                    'nombre_instituciones_programas'            => 'required_if:otras_nombre_instituciones_programas,null|nullable|json',
                    'nuevas_instituciones'                      => 'nullable|json',
                    'proyeccion_nuevas_instituciones'           => 'required|min:0|max:3|integer',
                    'proyeccion_articulacion_media'             => 'required|min:0|max:3|integer',
                    'programas_formacion_articulados*'          => 'required|integer|exists:programas_formacion,id',
                    'diseno_curricular_id*'                     => 'required|integer|exists:disenos_curriculares,id',
                ]);

                $proyecto_linea_70                                         = $proyecto->proyectoLinea70;
                $proyecto_linea_70->metodologia                            = $request->metodologia;
                $proyecto_linea_70->metodologia_local                      = $request->metodologia_local;
                $proyecto_linea_70->impacto_municipios                     = $request->impacto_municipios;
                $proyecto_linea_70->numero_instituciones                   = is_array(json_decode($request->nombre_instituciones)) ? count(json_decode($request->nombre_instituciones)) : 0;
                $proyecto_linea_70->nombre_instituciones                   = $request->nombre_instituciones;
                $proyecto_linea_70->nombre_instituciones_programas         = $request->nombre_instituciones_programas;
                $proyecto_linea_70->nuevas_instituciones                   = $request->nuevas_instituciones;
                $proyecto_linea_70->proyeccion_nuevas_instituciones        = $request->proyeccion_nuevas_instituciones;
                $proyecto_linea_70->proyeccion_articulacion_media          = $request->proyeccion_articulacion_media;
                $proyecto_linea_70->otras_nuevas_instituciones             = $request->otras_nuevas_instituciones;
                $proyecto_linea_70->otras_nombre_instituciones_programas   = $request->otras_nombre_instituciones_programas;
                $proyecto_linea_70->otras_nombre_instituciones             = $request->otras_nombre_instituciones;
                $proyecto_linea_70->implementacion_modelo_pedagogico       = $request->implementacion_modelo_pedagogico;
                $proyecto_linea_70->articulacion_plan_educacion            = $request->articulacion_plan_educacion;
                $proyecto_linea_70->articulacion_territorios_stem          = $request->articulacion_territorios_stem;
                $proyecto_linea_70->proyectos_macro                        = $request->proyectos_macro;

                $proyecto_linea_70->save();

                $proyecto_linea_70->proyecto->municipios()->sync($request->municipios);
                $proyecto_linea_70->proyecto->municipiosAImpactar()->sync($request->municipios_impactar);
                $proyecto_linea_70->proyecto->programasFormacionLinea70()->sync($request->programas_formacion_articulados);
                $proyecto_linea_70->proyecto->disenosCurriculares()->sync($request->diseno_curricular_id);
                break;
            case $proyecto->proyectoLinea69()->exists():
                if (is_array($request->municipios)) {
                    $request->merge([
                        'municipios' => json_encode($request->municipios)
                    ]);
                }

                if (is_array($request->talento_otros_departamentos)) {
                    $request->merge([
                        'talento_otros_departamentos' => json_encode($request->talento_otros_departamentos)
                    ]);
                }


                $proyecto_linea_69                                         = $proyecto->proyectoLinea69;
                $proyecto_linea_69->metodologia                            = $request->metodologia;
                $proyecto_linea_69->metodologia_local                      = $request->metodologia_local;
                $proyecto_linea_69->impacto_municipios                     = $request->impacto_municipios;
                $proyecto_linea_69->estrategia_articulacion_prox_vigencia  = $request->estrategia_articulacion_prox_vigencia;
                $proyecto_linea_69->alianzas_estrategicas                  = $request->alianzas_estrategicas;
                $proyecto_linea_69->estrategia_divulgacion                 = $request->estrategia_divulgacion;
                $proyecto_linea_69->promover_productividad                 = $request->promover_productividad;
                $proyecto_linea_69->estrategia_atencion_talentos           = $request->estrategia_atencion_talentos;

                $proyecto_linea_69->save();

                $proyecto_linea_69->proyecto->municipios()->sync($request->municipios);
                $proyecto_linea_69->talentosOtrosDepartamentos()->sync($request->talento_otros_departamentos);

                break;
            case $proyecto->proyectoLinea65()->exists():
                $proyecto_linea_65              = $proyecto->proyectoLinea65;
                $proyecto_linea_65->metodologia = $request->metodologia;

                $proyecto_linea_65->save();
                break;
            case $proyecto->proyectoLinea68()->exists():
                $proyecto_linea_68              = $proyecto->proyectoLinea68;
                $proyecto_linea_68->metodologia = $request->metodologia;

                $proyecto_linea_68->save();
                break;
            default:
                break;
        }

        return back()->with('success', 'El recurso se ha guardado correctamente.');
    }

    /**
     * updateMetodologiaEvaluacion
     *
     * @param  mixed $request
     * @param  mixed $convocatoria
     * @param  mixed $evaluacion
     * @return void
     */
    public function updateMetodologiaEvaluacion(Request $request, Convocatoria $convocatoria, Evaluacion $evaluacion)
    {
        $this->authorize('modificar-evaluacion-autor', $evaluacion);

        switch ($evaluacion) {
            case $evaluacion->evaluacionProyectoLinea66()->exists():
                $evaluacion->evaluacionProyectoLinea66()->update([
                    'metodologia_puntaje'      => $request->metodologia_puntaje,
                    'metodologia_comentario'   => $request->metodologia_requiere_comentario == false ? $request->metodologia_comentario : null
                ]);
                break;
            case $evaluacion->evaluacionProyectoLinea65()->exists():
                $evaluacion->evaluacionProyectoLinea65()->update([
                    'metodologia_puntaje'      => $request->metodologia_puntaje,
                    'metodologia_comentario'   => $request->metodologia_requiere_comentario == false ? $request->metodologia_comentario : null
                ]);
                break;
            case $evaluacion->evaluacionProyectoLinea70()->exists():
                $evaluacion->evaluacionProyectoLinea70()->update([
                    'metodologia_comentario'        => $request->metodologia_requiere_comentario == false ? $request->metodologia_comentario : null,
                    'municipios_comentario'         => $request->municipios_requiere_comentario == false ? $request->municipios_comentario : null,
                    'instituciones_comentario'      => $request->instituciones_requiere_comentario == false ? $request->instituciones_comentario : null,
                    'proyectos_macro_comentario'    => $request->proyectos_macro_requiere_comentario == false ? $request->proyectos_macro_comentario : null
                ]);
                break;
            case $evaluacion->evaluacionProyectoLinea69()->exists():
                $evaluacion->evaluacionProyectoLinea69()->update([
                    'metodologia_comentario'   => $request->metodologia_requiere_comentario == false ? $request->metodologia_comentario : null,
                    'municipios_comentario'    => $request->municipios_requiere_comentario == false ? $request->municipios_comentario : null
                ]);
                break;

            case $evaluacion->evaluacionProyectoLinea68()->exists():
                $evaluacion->evaluacionProyectoLinea68()->update([
                    'metodologia_puntaje'                   => $request->metodologia_puntaje,
                    'metodologia_comentario'                => $request->metodologia_requiere_comentario == false ? $request->metodologia_comentario : null,

                    'actividades_primer_obj_puntaje'        => $request->actividades_primer_obj_puntaje,
                    'actividades_primer_obj_comentario'     => $request->actividades_primer_obj_requiere_comentario == false ? $request->actividades_primer_obj_comentario : null,

                    'actividades_segundo_obj_puntaje'       => $request->actividades_segundo_obj_puntaje,
                    'actividades_segundo_obj_comentario'    => $request->actividades_segundo_obj_requiere_comentario == false ? $request->actividades_segundo_obj_comentario : null,

                    'actividades_tercer_obj_puntaje'        => $request->actividades_tercer_obj_puntaje,
                    'actividades_tercer_obj_comentario'     => $request->actividades_tercer_obj_requiere_comentario == false ? $request->actividades_tercer_obj_comentario : null,

                    'actividades_cuarto_obj_puntaje'        => $request->actividades_cuarto_obj_puntaje,
                    'actividades_cuarto_obj_comentario'     => $request->actividades_cuarto_obj_requiere_comentario == false ? $request->actividades_cuarto_obj_comentario : null,
                ]);
                break;
            default:
                break;
        }

        $evaluacion->save();

        return back()->with('success', 'El recurso se ha actualizado correctamente.');
    }
}
