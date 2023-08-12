<?php

namespace App\Http\Controllers;

use App\Helpers\SelectHelper;
use App\Http\Requests\ActividadRequest;
use App\Http\Requests\MetodologiaColumnRequest;
use App\Models\Convocatoria;
use App\Models\Proyecto;
use App\Models\Actividad;
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

        $proyecto->load('evaluaciones.evaluacionProyectoFormulario8Linea66');
        $proyecto->load('evaluaciones.evaluacionProyectoFormulario4Linea70');

        $objetivo_especifico                    = $proyecto->causasDirectas()->with('objetivoEspecifico')->get()->pluck('objetivoEspecifico')->flatten()->filter();

        $resultados = $proyecto->efectosDirectos()->whereHas('resultado', function ($query) {
                        $query->where('descripcion', '!=', null);
                    })->with('resultado')->get()->pluck('resultado')->flatten();

        $productos  = $resultados->map(function ($resultado) {
                        return $resultado->productos;
                    })->flatten();

        $proyecto->proyectoFormulario10Linea69;
        $proyecto->proyectoFormulario11Linea83;

        switch ($proyecto) {
            case $proyecto->proyectoFormulario8Linea66()->exists():
                $proyecto->metodologia = $proyecto->proyectoFormulario8Linea66->metodologia;
                break;
            case $proyecto->proyectoFormulario4Linea70()->exists():
                $proyecto->metodologia                          = $proyecto->proyectoFormulario4Linea70->metodologia;
                $proyecto->metodologia_local                    = $proyecto->proyectoFormulario4Linea70->metodologia_local;
                $proyecto->otras_nuevas_instituciones           = $proyecto->proyectoFormulario4Linea70->otras_nuevas_instituciones;
                $proyecto->otras_nombre_instituciones_programas = $proyecto->proyectoFormulario4Linea70->otras_nombre_instituciones_programas;
                $proyecto->otras_nombre_instituciones           = $proyecto->proyectoFormulario4Linea70->otras_nombre_instituciones;
                $proyecto->impacto_municipios                   = $proyecto->proyectoFormulario4Linea70->impacto_municipios;
                $proyecto->nombre_instituciones                 = $proyecto->proyectoFormulario4Linea70->nombre_instituciones;
                $proyecto->nombre_instituciones_programas       = $proyecto->proyectoFormulario4Linea70->nombre_instituciones_programas;
                $proyecto->nuevas_instituciones                 = $proyecto->proyectoFormulario4Linea70->nuevas_instituciones;
                $proyecto->proyeccion_nuevas_instituciones      = $proyecto->proyectoFormulario4Linea70->proyeccion_nuevas_instituciones;
                $proyecto->proyeccion_articulacion_media        = $proyecto->proyectoFormulario4Linea70->proyeccion_articulacion_media;
                $proyecto->proyectos_macro                      = $proyecto->proyectoFormulario4Linea70->proyectos_macro;
                $proyecto->implementacion_modelo_pedagogico     = $proyecto->proyectoFormulario4Linea70->implementacion_modelo_pedagogico;
                $proyecto->articulacion_plan_educacion          = $proyecto->proyectoFormulario4Linea70->articulacion_plan_educacion;
                $proyecto->articulacion_territorios_stem        = $proyecto->proyectoFormulario4Linea70->articulacion_territorios_stem;
                $programas_formacion                            = SelectHelper::programasFormacion()->where('centro_formacion_id', $proyecto->centroFormacion->id)->values()->all();
                $modalidades                                    = json_decode(Storage::get('json/modalidades-estudio.json'), true);
                $niveles_formacion                              = json_decode(Storage::get('json/nivel-formacion.json'), true);

                $proyecto->municipios;
                $proyecto->municipiosAImpactar;
                $proyecto->disenosCurriculares;
                $proyecto->programasFormacion;

                break;
            case $proyecto->proyectoFormulario5Linea69()->exists():
                $proyecto->metodologia                              = $proyecto->proyectoFormulario5Linea69->metodologia;
                $proyecto->metodologia_local                        = $proyecto->proyectoFormulario5Linea69->metodologia_local;
                $proyecto->impacto_municipios                       = $proyecto->proyectoFormulario5Linea69->impacto_municipios;
                $proyecto->estrategia_articulacion_prox_vigencia    = $proyecto->proyectoFormulario5Linea69->estrategia_articulacion_prox_vigencia;
                $proyecto->alianzas_estrategicas                    = $proyecto->proyectoFormulario5Linea69->alianzas_estrategicas;
                $proyecto->estrategia_divulgacion                   = $proyecto->proyectoFormulario5Linea69->estrategia_divulgacion;
                $proyecto->promover_productividad                   = $proyecto->proyectoFormulario5Linea69->promover_productividad;
                $proyecto->departamentos_atencion_talentos          = $proyecto->proyectoFormulario5Linea69->departamentos_atencion_talentos;
                $proyecto->estrategia_atencion_talentos             = $proyecto->proyectoFormulario5Linea69->estrategia_atencion_talentos;
                break;

            case $proyecto->proyectoFormulario1Linea65()->exists():
                $proyecto->metodologia      = $proyecto->proyectoFormulario1Linea65->metodologia;
                $proyecto->tipo_proyecto    = $proyecto->proyectoFormulario1Linea65->tipo_proyecto;
                break;
            case $proyecto->proyectoFormulario12Linea68()->exists():
                $proyecto->metodologia = $proyecto->proyectoFormulario12Linea68->metodologia;
                break;
            default:
                break;
        }

        return Inertia::render('Convocatorias/Proyectos/Actividades/Index', [
            'convocatoria'              => $convocatoria->only('id', 'esta_activa', 'fase_formateada', 'fase', 'tipo_convocatoria', 'mostrar_recomendaciones', 'year'),
            'proyecto'                  => $proyecto,
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
            'proyecto_presupuesto'      => ProyectoPresupuesto::select('proyecto_presupuesto.id as value', 'proyecto_presupuesto.descripcion as label')->where('proyecto_presupuesto.proyecto_id', $proyecto->id)->with('convocatoriaProyectoRubrosPresupuestales.rubroPresupuestal.usoPresupuestal')->get(),
            'proyecto_roles'            => ProyectoRolSennova::select('proyecto_rol_sennova.id as value', 'roles_sennova.nombre as label')
                                            ->join('convocatoria_rol_sennova', 'proyecto_rol_sennova.convocatoria_rol_sennova_id', 'convocatoria_rol_sennova.id')
                                            ->join('roles_sennova', 'convocatoria_rol_sennova.rol_sennova_id', 'roles_sennova.id')
                                            ->where('proyecto_rol_sennova.proyecto_id', $proyecto->id)->with('convocatoriaRolSennova.rolSennova:id,nombre')->get(),
            'productos'                 => $productos,
            'areas_cualificacion_mnc'   => json_decode(Storage::get('json/areas-cualificacion-mnc.json'), true),

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
            case $proyecto->proyectoFormulario8Linea66()->exists():
                $proyecto_formulario_8_linea_66              = $proyecto->proyectoFormulario8Linea66;
                $proyecto_formulario_8_linea_66->metodologia = $request->metodologia;

                $proyecto_formulario_8_linea_66->save();
                break;
            case $proyecto->proyectoFormulario4Linea70()->exists():
                $request->merge(['proyeccion_nuevas_instituciones' => $request->proyeccion_nuevas_instituciones]);
                $request->merge(['proyeccion_articulacion_media' => $request->proyeccion_articulacion_media]);

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

                $proyecto_linea_70                                         = $proyecto->proyectoFormulario4Linea70;
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
            case $proyecto->proyectoFormulario5Linea69()->exists():
                $proyecto_linea_69                                         = $proyecto->proyectoFormulario5Linea69;
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

            case $proyecto->proyectoFormulario10Linea69()->exists():
                $proyecto_hub_linea_69                                                  = $proyecto->proyectoFormulario10Linea69;
                $proyecto_hub_linea_69->metodologia                                     = $request->metodologia;
                $proyecto_hub_linea_69->metodologia_local                               = $request->metodologia_local;
                $proyecto_hub_linea_69->areas_cualificacion_mnc                         = $request->areas_cualificacion_mnc;
                $proyecto_hub_linea_69->talentos_otros_departamentos                    = $request->talentos_otros_departamentos;
                $proyecto_hub_linea_69->estrategia_atencion_talentos                    = $request->estrategia_atencion_talentos;
                $proyecto_hub_linea_69->acciones_mejoramiento_idic                      = $request->acciones_mejoramiento_idic;
                $proyecto_hub_linea_69->municipios_beneficiados_vigencia_anterior       = $request->municipios_beneficiados_vigencia_anterior;
                $proyecto_hub_linea_69->beneficio_municipios_vigencia_anterior          = $request->beneficio_municipios_vigencia_anterior;
                $proyecto_hub_linea_69->municipios_beneficiados_vigencia_actual         = $request->municipios_beneficiados_vigencia_actual;
                $proyecto_hub_linea_69->estrategia_articulacion_pbts                    = $request->estrategia_articulacion_pbts;
                $proyecto_hub_linea_69->numero_empresas_atendidas                       = $request->numero_empresas_atendidas;
                $proyecto_hub_linea_69->analisis_impacto_sector_empresarial             = $request->analisis_impacto_sector_empresarial;
                $proyecto_hub_linea_69->numero_emprendedores_atendidos                  = $request->numero_emprendedores_atendidos;
                $proyecto_hub_linea_69->analisis_impacto_regional                       = $request->analisis_impacto_regional;
                $proyecto_hub_linea_69->gestion_alianzas_estrategicas                   = $request->gestion_alianzas_estrategicas;
                $proyecto_hub_linea_69->estrategias_visibilizacion                      = $request->estrategias_visibilizacion;
                $proyecto_hub_linea_69->integracion_plan_tecnologico                    = $request->integracion_plan_tecnologico;
                $proyecto_hub_linea_69->estrategias_productividad_agropecuaria          = $request->estrategias_productividad_agropecuaria;
                $proyecto_hub_linea_69->acciones_estrategia_campesena                   = $request->acciones_estrategia_campesena;
                $proyecto_hub_linea_69->estrategia_campesena_campesinos                 = $request->estrategia_campesena_campesinos;
                $proyecto_hub_linea_69->acciones_fortalecimiento_economia_popular       = $request->acciones_fortalecimiento_economia_popular;
                $proyecto_hub_linea_69->acciones_fortalecimiento_idi                    = $request->acciones_fortalecimiento_idi;

                $proyecto_hub_linea_69->save();

                break;



            case $proyecto->proyectoFormulario1Linea65()->exists():
                $proyecto_linea_65              = $proyecto->proyectoFormulario1Linea65;
                $proyecto_linea_65->metodologia = $request->metodologia;

                $proyecto_linea_65->save();
                break;
            case $proyecto->proyectoFormulario12Linea68()->exists():
                $proyecto_linea_68              = $proyecto->proyectoFormulario12Linea68;
                $proyecto_linea_68->metodologia = $request->metodologia;

                $proyecto_linea_68->save();
                break;
            default:
                break;
        }

        return back()->with('success', 'El recurso se ha guardado correctamente.');
    }

    public function updateMetodologiaProyectoHub(Request $request, Convocatoria $convocatoria, Proyecto $proyecto)
    {
        $this->authorize('modificar-proyecto-autor', $proyecto);

        $proyecto_hub_linea_69                                                  = $proyecto->proyectoFormulario10Linea69;
        $proyecto_hub_linea_69->metodologia                                     = $request->metodologia;
        $proyecto_hub_linea_69->metodologia_local                               = $request->metodologia_local;
        $proyecto_hub_linea_69->areas_cualificacion_mnc                         = $request->areas_cualificacion_mnc;
        $proyecto_hub_linea_69->talentos_otros_departamentos                    = $request->talentos_otros_departamentos;
        $proyecto_hub_linea_69->estrategia_atencion_talentos                    = $request->estrategia_atencion_talentos;
        $proyecto_hub_linea_69->acciones_mejoramiento_idic                      = $request->acciones_mejoramiento_idic;
        $proyecto_hub_linea_69->municipios_beneficiados_vigencia_anterior       = $request->municipios_beneficiados_vigencia_anterior;
        $proyecto_hub_linea_69->beneficio_municipios_vigencia_anterior          = $request->beneficio_municipios_vigencia_anterior;
        $proyecto_hub_linea_69->municipios_beneficiados_vigencia_actual         = $request->municipios_beneficiados_vigencia_actual;
        $proyecto_hub_linea_69->estrategia_articulacion_pbts                    = $request->estrategia_articulacion_pbts;
        $proyecto_hub_linea_69->numero_empresas_atendidas                       = $request->numero_empresas_atendidas;
        $proyecto_hub_linea_69->analisis_impacto_sector_empresarial             = $request->analisis_impacto_sector_empresarial;
        $proyecto_hub_linea_69->numero_emprendedores_atendidos                  = $request->numero_emprendedores_atendidos;
        $proyecto_hub_linea_69->analisis_impacto_regional                       = $request->analisis_impacto_regional;
        $proyecto_hub_linea_69->gestion_alianzas_estrategicas                   = $request->gestion_alianzas_estrategicas;
        $proyecto_hub_linea_69->estrategias_visibilizacion                      = $request->estrategias_visibilizacion;
        $proyecto_hub_linea_69->integracion_plan_tecnologico                    = $request->integracion_plan_tecnologico;
        $proyecto_hub_linea_69->estrategias_productividad_agropecuaria          = $request->estrategias_productividad_agropecuaria;
        $proyecto_hub_linea_69->acciones_estrategia_campesena                   = $request->acciones_estrategia_campesena;
        $proyecto_hub_linea_69->estrategia_campesena_campesinos                 = $request->estrategia_campesena_campesinos;
        $proyecto_hub_linea_69->acciones_fortalecimiento_economia_popular       = $request->acciones_fortalecimiento_economia_popular;
        $proyecto_hub_linea_69->acciones_fortalecimiento_idi                    = $request->acciones_fortalecimiento_idi;

        $proyecto_hub_linea_69->save();

        return back()->with('success', 'El recurso se ha guardado correctamente.');
    }

    public function updateMetodologiaProyectoFormulario11Linea83(Request $request, Convocatoria $convocatoria, Proyecto $proyecto)
    {
        $this->authorize('modificar-proyecto-autor', $proyecto);

        $proyecto_linea_83                                                          = $proyecto->proyectoFormulario11Linea83;
        $proyecto_linea_83->metodologia                                             = $request->metodologia;
        $proyecto_linea_83->departamentos_a_impactar                                = $request->departamentos_a_impactar;
        $proyecto_linea_83->estrategias_atencion_empresas_municipios                = $request->estrategias_atencion_empresas_municipios;
        $proyecto_linea_83->estrategias_promover_logros                             = $request->estrategias_promover_logros;
        $proyecto_linea_83->estrategias_visibilizacion                              = $request->estrategias_visibilizacion;
        $proyecto_linea_83->estrategias_productividad_agropecuaria_agroindustrial   = $request->estrategias_productividad_agropecuaria_agroindustrial;

        $proyecto_linea_83->save();

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
            case $evaluacion->evaluacionProyectoFormulario8Linea66()->exists():
                $evaluacion->evaluacionProyectoFormulario8Linea66()->update([
                    'metodologia_puntaje'                   => $request->metodologia_puntaje,
                    'metodologia_comentario'                => $request->metodologia_requiere_comentario == false ? $request->metodologia_comentario : null
                ]);
                break;
            case $evaluacion->evaluacionProyectoFormulario1Linea65()->exists():
                $evaluacion->evaluacionProyectoFormulario1Linea65()->update([
                    'metodologia_puntaje'                   => $request->metodologia_puntaje,
                    'metodologia_comentario'                => $request->metodologia_requiere_comentario == false ? $request->metodologia_comentario : null
                ]);
                break;
            case $evaluacion->evaluacionProyectoFormulario4Linea70()->exists():
                $evaluacion->evaluacionProyectoFormulario4Linea70()->update([
                    'metodologia_comentario'                => $request->metodologia_requiere_comentario == false ? $request->metodologia_comentario : null,
                    'municipios_comentario'                 => $request->municipios_requiere_comentario == false ? $request->municipios_comentario : null,
                    'instituciones_comentario'              => $request->instituciones_requiere_comentario == false ? $request->instituciones_comentario : null,
                    'proyectos_macro_comentario'            => $request->proyectos_macro_requiere_comentario == false ? $request->proyectos_macro_comentario : null
                ]);
                break;
            case $evaluacion->evaluacionProyectoFormulario5Linea69()->exists():
                $evaluacion->evaluacionProyectoFormulario5Linea69()->update([
                    'metodologia_comentario'                => $request->metodologia_requiere_comentario == false ? $request->metodologia_comentario : null,
                    'municipios_comentario'                 => $request->municipios_requiere_comentario == false ? $request->municipios_comentario : null
                ]);
                break;

            case $evaluacion->evaluacionProyectoFormulario12Linea68()->exists():
                $evaluacion->evaluacionProyectoFormulario12Linea68()->update([
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

    public function updateLongColumn(MetodologiaColumnRequest $request, Convocatoria $convocatoria, Proyecto $proyecto, $column)
    {
        $this->authorize('modificar-proyecto-autor', [$proyecto]);

        switch ($proyecto->tipo_formulario_convocatoria_id) {
            case 1:
                $proyecto->proyectoFormulario1Linea65()->update($request->only($column));
                break;
            case 4:
                if ($column == 'municipios_impactar') {
                    $proyecto->municipiosAImpactar()->sync($request->only($column)[$column]);
                    break;
                }

                if ($column == 'municipios') {
                    $proyecto->municipios()->sync($request->only($column)[$column]);
                    break;
                }

                if ($column == 'programas_formacion_articulados') {
                    $proyecto->programasFormacion()->sync($request->only($column)[$column]);
                    break;
                }

                if ($column == 'diseno_curricular_id') {
                    $proyecto->disenosCurriculares()->sync($request->only($column)[$column]);
                    break;
                }

                $proyecto->proyectoFormulario4Linea70()->update($request->only($column));
                break;
            case 5:
                if ($column == 'talento_otros_departamentos') {
                    $proyecto->proyectoFormulario5Linea69->talentosOtrosDepartamentos()->sync($request->only($column)[$column]);
                    break;
                }

                if ($column == 'municipios') {
                    $proyecto->municipios()->sync($request->only($column)[$column]);
                    break;
                }

                $proyecto->proyectoFormulario5Linea69()->update($request->only($column));
                break;
            case 6:
            case 7:
            case 8:
            case 9:
                $proyecto->proyectoFormulario8Linea66()->update($request->only($column));
                break;
            case 11:
                $proyecto->proyectoFormulario11Linea83()->update($request->only($column));
                break;
            case 12:
                $proyecto->proyectoFormulario12Linea68()->update($request->only($column));
                break;
            default:
                break;
        }

        return back();
    }
}
