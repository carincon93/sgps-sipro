<?php

namespace App\Http\Controllers;

use App\Helpers\SelectHelper;
use App\Http\Requests\ActividadRequest;
use App\Models\Convocatoria;
use App\Models\Proyecto;
use App\Models\Actividad;
use App\Models\AulaMovil;
use App\Models\Evaluacion\CulturaInnovacionEvaluacion;
use App\Models\Evaluacion\Evaluacion;
use App\Models\Evaluacion\IdiEvaluacion;
use App\Models\Evaluacion\ServicioTecnologicoEvaluacion;
use App\Models\Evaluacion\TaEvaluacion;
use App\Models\Evaluacion\TpEvaluacion;
use App\Models\ProyectoPresupuesto;
use App\Models\ProyectoRolSennova;
use App\Models\Regional;
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

        $proyecto->load('evaluaciones.idiEvaluacion');
        $proyecto->load('evaluaciones.taEvaluacion');

        $objetivoEspecifico = $proyecto->causasDirectas()->with('objetivoEspecifico')->get()->pluck('objetivoEspecifico')->flatten()->filter();
        $proyecto->codigo_linea_programatica = $proyecto->lineaProgramatica->codigo;

        $resultados = $proyecto->efectosDirectos()->whereHas('resultado', function ($query) {
            $query->where('descripcion', '!=', null);
        })->with('resultado')->get()->pluck('resultado')->flatten();

        $productos = $resultados->map(function ($resultado) {
            return $resultado->productos;
        })->flatten();

        switch ($proyecto) {
            case $proyecto->idi()->exists():
                $proyecto->metodologia = $proyecto->idi->metodologia;
                break;
            case $proyecto->ta()->exists():
                $proyecto->metodologia                          = $proyecto->ta->metodologia;
                $proyecto->metodologia_local                    = $proyecto->ta->metodologia_local;
                $proyecto->otras_nuevas_instituciones           = $proyecto->ta->otras_nuevas_instituciones;
                $proyecto->otras_nombre_instituciones_programas = $proyecto->ta->otras_nombre_instituciones_programas;
                $proyecto->otras_nombre_instituciones           = $proyecto->ta->otras_nombre_instituciones;
                $proyecto->impacto_municipios                   = $proyecto->ta->impacto_municipios;
                $proyecto->nombre_instituciones                 = $proyecto->ta->nombre_instituciones;
                $proyecto->nombre_instituciones_programas       = $proyecto->ta->nombre_instituciones_programas;
                $proyecto->nuevas_instituciones                 = $proyecto->ta->nuevas_instituciones;
                $proyecto->proyeccion_nuevas_instituciones      = $proyecto->ta->proyeccion_nuevas_instituciones;
                $proyecto->proyeccion_articulacion_media        = $proyecto->ta->proyeccion_articulacion_media;
                $proyecto->proyectos_macro                      = $proyecto->ta->proyectos_macro;
                $proyecto->implementacion_modelo_pedagogico     = $proyecto->ta->implementacion_modelo_pedagogico;
                $proyecto->articulacion_plan_educacion          = $proyecto->ta->articulacion_plan_educacion;
                $proyecto->articulacion_territorios_stem        = $proyecto->ta->articulacion_territorios_stem;
                $proyectoMunicipios                             = $proyecto->municipios()->select('municipios.id as value', 'municipios.nombre as label', 'regionales.nombre as group', 'regionales.codigo')->join('regionales', 'regionales.id', 'municipios.regional_id')->get();
                $proyectoMunicipiosImpactar                     = $proyecto->municipiosAImpactar()->select('municipios.id as value', 'municipios.nombre as label', 'regionales.nombre as group', 'regionales.codigo')->join('regionales', 'regionales.id', 'municipios.regional_id')->get();
                $programasFormacion                             = SelectHelper::programasFormacion()->where('centro_formacion_id', $proyecto->centroFormacion->id)->values()->all();
                $modalidades                                    = json_decode(Storage::get('json/modalidades-estudio.json'), true);
                $nivelesFormacion                               = json_decode(Storage::get('json/nivel-formacion.json'), true);
                $proyectoDisenosCurriculares                    = $proyecto->disenosCurriculares()->selectRaw('disenos_curriculares.id as value, concat(disenos_curriculares.nombre, \' ∙ Código: \', disenos_curriculares.codigo) as label')->get();
                $proyectoProgramasFormacionArticulados          = $proyecto->taProgramasFormacion()->selectRaw('programas_formacion.id as value, concat(programas_formacion.nombre, chr(10), \'∙ Código: \', programas_formacion.codigo) as label')->where('programas_formacion.registro_calificado', true)->get();
                break;
            case $proyecto->tp()->exists():
                $proyecto->metodologia                              = $proyecto->tp->metodologia;
                $proyecto->metodologia_local                        = $proyecto->tp->metodologia_local;
                $proyecto->impacto_municipios                       = $proyecto->tp->impacto_municipios;
                $proyecto->estrategia_articulacion_prox_vigencia    = $proyecto->tp->estrategia_articulacion_prox_vigencia;
                $proyecto->alianzas_estrategicas                    = $proyecto->tp->alianzas_estrategicas;
                $proyecto->estrategia_divulgacion                   = $proyecto->tp->estrategia_divulgacion;
                $proyecto->promover_productividad                   = $proyecto->tp->promover_productividad;
                $proyecto->departamentos_atencion_talentos          = $proyecto->tp->departamentos_atencion_talentos;
                $proyecto->estrategia_atencion_talentos             = $proyecto->tp->estrategia_atencion_talentos;
                $proyectoMunicipios                                 = $proyecto->municipios()->select('municipios.id as value', 'municipios.nombre as label', 'regionales.nombre as group', 'regionales.codigo')->join('regionales', 'regionales.id', 'municipios.regional_id')->get();
                $talentosOtrosDepartamentos                         = $proyecto->tp->talentosOtrosDepartamentos()->select('regionales.id as value', 'regionales.nombre as label')->get();
                break;
            case $proyecto->culturaInnovacion()->exists():
                $proyecto->metodologia      = $proyecto->culturaInnovacion->metodologia;
                $proyecto->tipo_proyecto    = $proyecto->culturaInnovacion->tipo_proyecto;
                break;
            case $proyecto->servicioTecnologico()->exists():
                $proyecto->metodologia = $proyecto->servicioTecnologico->metodologia;
                break;
            default:
                break;
        }

        return Inertia::render('Convocatorias/Proyectos/Actividades/Index', [
            'convocatoria'      => $convocatoria->only('id', 'esta_activa', 'fase_formateada', 'fase', 'tipo_convocatoria', 'mostrar_recomendaciones', 'year', 'min_fecha_inicio_proyectos', 'max_fecha_finalizacion_proyectos'),
            'proyecto'          => $proyecto->only(
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
                'en_subsanacion',
                'evaluaciones',
                'mostrar_recomendaciones',
                'PdfVersiones',
                'all_files',
                'allowed',
                'tipo_proyecto'
            ),
            'filters'           => request()->all('search'),
            'actividades'       => Actividad::whereIn(
                'objetivo_especifico_id',
                $objetivoEspecifico->map(function ($objetivoEspecifico) {
                    return $objetivoEspecifico->id;
                })
            )->with('productos', 'proyectoPresupuesto', 'proyectoRolesSennova', 'objetivoEspecifico', 'objetivoEspecifico.resultados')->orderBy('objetivo_especifico_id', 'ASC')
                ->filterActividad(request()->only('search'))->paginate()->appends(['search' => request()->search]),
            'actividadesGantt'  => Actividad::whereIn(
                'objetivo_especifico_id',
                $objetivoEspecifico->map(function ($objetivoEspecifico) {
                    return $objetivoEspecifico->id;
                })
            )->where('fecha_inicio', '<>', null)->orderBy('fecha_inicio', 'ASC')->get(),
            'talentosOtrosDepartamentos'            => $talentosOtrosDepartamentos ?? null,
            'proyectoMunicipios'                    => $proyectoMunicipios ?? null,
            'proyectoMunicipiosImpactar'            => $proyectoMunicipiosImpactar ?? null,
            'programasFormacion'                    => $programasFormacion ?? null,
            'modalidades'                           => $modalidades ?? null,
            'nivelesFormacion'                      => $nivelesFormacion ?? null,
            'proyectoProgramasFormacionArticulados' => $proyectoProgramasFormacionArticulados ?? null,
            'proyectoDisenosCurriculares'           => $proyectoDisenosCurriculares ?? null,
            'regionales'                            => SelectHelper::regionales(),
            'municipios'                            => SelectHelper::municipios(),
            'disenosCurriculares'                   => SelectHelper::disenoCurriculares()->where('habilitado_convocatoria', true)->values()->all(),
            'tecnoacademiaRelacionada'              => $proyecto->tecnoacademiaLineasTecnoacademia()->first() ? $proyecto->tecnoacademiaLineasTecnoacademia()->first()->tecnoacademia : null,
            'aulasMoviles'                          => AulaMovil::where('ta_id', $proyecto->id)->get(),

            'proyectoPresupuesto'                   => ProyectoPresupuesto::select('proyecto_presupuesto.id as value', 'proyecto_presupuesto.descripcion as label')->where('proyecto_presupuesto.proyecto_id', $proyecto->id)->with('convocatoriaProyectoRubrosPresupuestales.presupuestoSennova.usoPresupuestal')->get(),
            'proyectoRoles'                         => ProyectoRolSennova::select('proyecto_rol_sennova.id as value', 'roles_sennova.nombre as label')
                                                        ->join('convocatoria_rol_sennova', 'proyecto_rol_sennova.convocatoria_rol_sennova_id', 'convocatoria_rol_sennova.id')
                                                        ->join('roles_sennova', 'convocatoria_rol_sennova.rol_sennova_id', 'roles_sennova.id')
                                                        ->where('proyecto_rol_sennova.proyecto_id', $proyecto->id)->with('convocatoriaRolSennova.rolSennova:id,nombre')->get(),
            'productos'                             => $productos,
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
            case $proyecto->idi()->exists():
                $idi              = $proyecto->idi;
                $idi->metodologia = $request->metodologia;

                $idi->save();
                break;
            case $proyecto->ta()->exists():
                $request->merge(['proyeccion_nuevas_instituciones' => $request->proyeccion_nuevas_instituciones['value']]);
                $request->merge(['proyeccion_articulacion_media' => $request->proyeccion_articulacion_media['value']]);

                if (is_array($request->programas_formacion_articulados)) {
                    if (isset($request->programas_formacion_articulados['value']) && is_numeric($request->programas_formacion_articulados['value'])) {
                        $request->merge([
                            'programas_formacion_articulados' => $request->programas_formacion_articulados['value'],
                        ]);
                    } else {
                        $programasFormacionArticulados = [];
                        foreach ($request->programas_formacion_articulados as $programaFormacion) {
                            if (is_array($programaFormacion)) {
                                array_push($programasFormacionArticulados, $programaFormacion['value']);
                            }
                        }
                        $request->merge(['programas_formacion_articulados' => $programasFormacionArticulados]);
                    }
                }

                if (is_array($request->diseno_curricular_id)) {
                    if (isset($request->diseno_curricular_id['value']) && is_numeric($request->diseno_curricular_id['value'])) {
                        $request->merge([
                            'diseno_curricular_id' => $request->diseno_curricular_id['value'],
                        ]);
                    } else {
                        $programasDisenoCurricular = [];
                        foreach ($request->diseno_curricular_id as $programaFormacion) {
                            if (is_array($programaFormacion)) {
                                array_push($programasDisenoCurricular, $programaFormacion['value']);
                            }
                        }
                        $request->merge(['diseno_curricular_id' => $programasDisenoCurricular]);
                    }
                }

                if (is_array($request->municipios)) {
                    if (isset($request->municipios['value']) && is_numeric($request->municipios['value'])) {
                        $request->merge([
                            'municipios' => $request->municipios['value'],
                        ]);
                    } else {
                        $municipios = [];
                        foreach ($request->municipios as $municipio) {
                            if (is_array($municipio)) {
                                array_push($municipios, $municipio['value']);
                            }
                        }
                        $request->merge(['municipios' => $municipios]);
                    }
                }

                if (is_array($request->municipios_impactar)) {
                    if (isset($request->municipios_impactar['value']) && is_numeric($request->municipios_impactar['value'])) {
                        $request->merge([
                            'municipios_impactar' => $request->municipios_impactar['value'],
                        ]);
                    } else {
                        $municipiosImpactar = [];
                        foreach ($request->municipios_impactar as $municipio) {
                            if (is_array($municipio)) {
                                array_push($municipiosImpactar, $municipio['value']);
                            }
                        }
                        $request->merge(['municipios_impactar' => $municipiosImpactar]);
                    }
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

                $ta                                         = $proyecto->ta;
                $ta->metodologia                            = $request->metodologia;
                $ta->metodologia_local                      = $request->metodologia_local;
                $ta->impacto_municipios                     = $request->impacto_municipios;
                $ta->numero_instituciones                   = is_array(json_decode($request->nombre_instituciones)) ? count(json_decode($request->nombre_instituciones)) : 0;
                $ta->nombre_instituciones                   = $request->nombre_instituciones;
                $ta->nombre_instituciones_programas         = $request->nombre_instituciones_programas;
                $ta->nuevas_instituciones                   = $request->nuevas_instituciones;
                $ta->proyeccion_nuevas_instituciones        = $request->proyeccion_nuevas_instituciones;
                $ta->proyeccion_articulacion_media          = $request->proyeccion_articulacion_media;
                $ta->otras_nuevas_instituciones             = $request->otras_nuevas_instituciones;
                $ta->otras_nombre_instituciones_programas   = $request->otras_nombre_instituciones_programas;
                $ta->otras_nombre_instituciones             = $request->otras_nombre_instituciones;
                $ta->implementacion_modelo_pedagogico       = $request->implementacion_modelo_pedagogico;
                $ta->articulacion_plan_educacion            = $request->articulacion_plan_educacion;
                $ta->articulacion_territorios_stem          = $request->articulacion_territorios_stem;
                $ta->proyectos_macro                        = $request->proyectos_macro;

                $ta->save();

                $ta->proyecto->municipios()->sync($request->municipios);
                $ta->proyecto->municipiosAImpactar()->sync($request->municipios_impactar);
                $ta->proyecto->taProgramasFormacion()->sync($request->programas_formacion_articulados);
                $ta->proyecto->disenosCurriculares()->sync($request->diseno_curricular_id);
                break;
            case $proyecto->tp()->exists():
                if (is_array($request->municipios)) {
                    if (isset($request->municipios['value']) && is_numeric($request->municipios['value'])) {
                        $request->merge([
                            'municipios' => $request->municipios['value'],
                        ]);
                    } else {
                        $municipios = [];
                        foreach ($request->municipios as $municipio) {
                            if (is_array($municipio)) {
                                array_push($municipios, $municipio['value']);
                            }
                        }
                        $request->merge(['municipios' => $municipios]);
                    }
                }

                if (is_array($request->talento_otros_departamentos)) {
                    if (isset($request->talento_otros_departamentos['value']) && is_numeric($request->talento_otros_departamentos['value'])) {
                        $request->merge([
                            'talento_otros_departamentos' => $request->talento_otros_departamentos['value'],
                        ]);
                    } else {
                        $talentosOtrosDepartamentos = [];
                        foreach ($request->talento_otros_departamentos as $departamento) {
                            if (is_array($departamento)) {
                                array_push($talentosOtrosDepartamentos, $departamento['value']);
                            }
                        }
                        $request->merge(['talento_otros_departamentos' => $talentosOtrosDepartamentos]);
                    }
                }

                $tp                                         = $proyecto->tp;
                $tp->metodologia                            = $request->metodologia;
                $tp->metodologia_local                      = $request->metodologia_local;
                $tp->impacto_municipios                     = $request->impacto_municipios;
                $tp->estrategia_articulacion_prox_vigencia  = $request->estrategia_articulacion_prox_vigencia;
                $tp->alianzas_estrategicas                  = $request->alianzas_estrategicas;
                $tp->estrategia_divulgacion                 = $request->estrategia_divulgacion;
                $tp->promover_productividad                 = $request->promover_productividad;
                $tp->estrategia_atencion_talentos           = $request->estrategia_atencion_talentos;

                $tp->save();

                $tp->proyecto->municipios()->sync($request->municipios);
                $tp->talentosOtrosDepartamentos()->sync($request->talento_otros_departamentos);

                break;
            case $proyecto->culturaInnovacion()->exists():
                $culturaInnovacion              = $proyecto->culturaInnovacion;
                $culturaInnovacion->metodologia = $request->metodologia;

                $culturaInnovacion->save();
                break;
            case $proyecto->servicioTecnologico()->exists():
                $servicioTecnologico              = $proyecto->servicioTecnologico;
                $servicioTecnologico->metodologia = $request->metodologia;

                $servicioTecnologico->save();
                break;
            default:
                break;
        }

        return back()->with('success', 'El recurso se ha guardado correctamente.');
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function showMetodologiaEvaluacion(Convocatoria $convocatoria, Evaluacion $evaluacion)
    {
        $this->authorize('visualizar-evaluacion-autor', $evaluacion);

        $objetivoEspecifico = $evaluacion->proyecto->causasDirectas()->with('objetivoEspecifico')->get()->pluck('objetivoEspecifico')->flatten()->filter();
        $evaluacion->proyecto->codigo_linea_programatica = $evaluacion->proyecto->lineaProgramatica->codigo;

        $otrasEvaluaciones = null;
        switch ($evaluacion->proyecto) {
            case $evaluacion->proyecto->idi()->exists():
                $evaluacion->proyecto->metodologia = $evaluacion->proyecto->idi->metodologia;
                $evaluacion->idiEvaluacion;
                $idi = $evaluacion->proyecto->idi;

                $otrasEvaluaciones = IdiEvaluacion::whereHas('evaluacion', function ($query) use ($idi) {
                    $query->where('evaluaciones.proyecto_id', $idi->id)->where('evaluaciones.habilitado', true);
                })->where('idi_evaluaciones.id', '!=', $evaluacion->idiEvaluacion->id)->first();
                break;
            case $evaluacion->proyecto->ta()->exists():
                $evaluacion->taEvaluacion;
                $ta = $evaluacion->proyecto->ta;

                $otrasEvaluaciones = TaEvaluacion::with('evaluacion.evaluador')->whereHas('evaluacion', function ($query) use ($ta) {
                    $query->where('evaluaciones.proyecto_id', $ta->id)->where('evaluaciones.habilitado', true);
                })->where('ta_evaluaciones.id', '!=', $evaluacion->taEvaluacion->id)->get();

                $evaluacion->proyecto->metodologia                          = $evaluacion->proyecto->ta->metodologia;
                $evaluacion->proyecto->metodologia_local                    = $evaluacion->proyecto->ta->metodologia_local;
                $evaluacion->proyecto->otras_nuevas_instituciones           = $evaluacion->proyecto->ta->otras_nuevas_instituciones;
                $evaluacion->proyecto->otras_nombre_instituciones_programas = $evaluacion->proyecto->ta->otras_nombre_instituciones_programas;
                $evaluacion->proyecto->otras_nombre_instituciones           = $evaluacion->proyecto->ta->otras_nombre_instituciones;
                $evaluacion->proyecto->impacto_municipios                   = $evaluacion->proyecto->ta->impacto_municipios;
                $evaluacion->proyecto->nombre_instituciones                 = $evaluacion->proyecto->ta->nombre_instituciones;
                $evaluacion->proyecto->nombre_instituciones_programas       = $evaluacion->proyecto->ta->nombre_instituciones_programas;
                $evaluacion->proyecto->nuevas_instituciones                 = $evaluacion->proyecto->ta->nuevas_instituciones;
                $evaluacion->proyecto->proyeccion_nuevas_instituciones      = $evaluacion->proyecto->ta->proyeccion_nuevas_instituciones;
                $evaluacion->proyecto->proyeccion_articulacion_media        = $evaluacion->proyecto->ta->proyeccion_articulacion_media;
                $evaluacion->proyecto->proyectos_macro                      = $evaluacion->proyecto->ta->proyectos_macro;
                $evaluacion->proyecto->implementacion_modelo_pedagogico     = $evaluacion->proyecto->ta->implementacion_modelo_pedagogico;
                $evaluacion->proyecto->articulacion_plan_educacion          = $evaluacion->proyecto->ta->articulacion_plan_educacion;
                $evaluacion->proyecto->articulacion_territorios_stem        = $evaluacion->proyecto->ta->articulacion_territorios_stem;
                $proyectoMunicipios                                         = $evaluacion->proyecto->municipios()->select('municipios.id as value', 'municipios.nombre as label', 'regionales.nombre as group', 'regionales.codigo')->join('regionales', 'regionales.id', 'municipios.regional_id')->get();
                $proyectoMunicipiosImpactar                                 = $evaluacion->proyecto->municipiosAImpactar()->select('municipios.id as value', 'municipios.nombre as label', 'regionales.nombre as group', 'regionales.codigo')->join('regionales', 'regionales.id', 'municipios.regional_id')->get();
                $programasFormacion                                         = SelectHelper::programasFormacion()->where('centro_formacion_id', $evaluacion->proyecto->centroFormacion->id)->values()->all();
                $modalidades                                                = json_decode(Storage::get('json/modalidades-estudio.json'), true);
                $nivelesFormacion                                           = json_decode(Storage::get('json/nivel-formacion.json'), true);
                $proyectoDisenosCurriculares                                = $evaluacion->proyecto->disenosCurriculares()->selectRaw('disenos_curriculares.id as value, concat(disenos_curriculares.nombre, \' ∙ Código: \', disenos_curriculares.codigo) as label')->get();
                $proyectoProgramasFormacionArticulados                      = $evaluacion->proyecto->taProgramasFormacion()->selectRaw('programas_formacion.id as value, concat(programas_formacion.nombre, chr(10), \'∙ Código: \', programas_formacion.codigo) as label')->where('programas_formacion.registro_calificado', true)->get();
                break;
            case $evaluacion->proyecto->tp()->exists():
                $evaluacion->tpEvaluacion;
                $tp = $evaluacion->proyecto->tp;

                $otrasEvaluaciones = TpEvaluacion::whereHas('evaluacion', function ($query) use ($tp) {
                    $query->where('evaluaciones.proyecto_id', $tp->id)->where('evaluaciones.habilitado', true);
                })->where('tp_evaluaciones.id', '!=', $evaluacion->tpEvaluacion->id)->first();

                $evaluacion->proyecto->metodologia                              = $evaluacion->proyecto->tp->metodologia;
                $evaluacion->proyecto->metodologia_local                        = $evaluacion->proyecto->tp->metodologia_local;
                $evaluacion->proyecto->impacto_municipios                       = $evaluacion->proyecto->tp->impacto_municipios;
                $evaluacion->proyecto->estrategia_articulacion_prox_vigencia    = $evaluacion->proyecto->tp->estrategia_articulacion_prox_vigencia;
                $evaluacion->proyecto->alianzas_estrategicas                    = $evaluacion->proyecto->tp->alianzas_estrategicas;
                $evaluacion->proyecto->estrategia_divulgacion                   = $evaluacion->proyecto->tp->estrategia_divulgacion;
                $evaluacion->proyecto->promover_productividad                   = $evaluacion->proyecto->tp->promover_productividad;
                $evaluacion->proyecto->departamentos_atencion_talentos          = $evaluacion->proyecto->tp->departamentos_atencion_talentos;
                $evaluacion->proyecto->estrategia_atencion_talentos             = $evaluacion->proyecto->tp->estrategia_atencion_talentos;
                $proyectoMunicipios                                             = $evaluacion->proyecto->municipios()->select('municipios.id as value', 'municipios.nombre as label', 'regionales.nombre as group', 'regionales.codigo')->join('regionales', 'regionales.id', 'municipios.regional_id')->get();
                $talentosOtrosDepartamentos                                     = $evaluacion->proyecto->tp->talentosOtrosDepartamentos()->select('regionales.id as value', 'regionales.nombre as label')->get();
                break;
            case $evaluacion->proyecto->culturaInnovacion()->exists():
                $evaluacion->proyecto->metodologia = $evaluacion->proyecto->culturaInnovacion->metodologia;

                $evaluacion->culturaInnovacionEvaluacion;
                $culturaInnovacion = $evaluacion->proyecto->culturaInnovacion;

                $otrasEvaluaciones = CulturaInnovacionEvaluacion::whereHas('evaluacion', function ($query) use ($culturaInnovacion) {
                    $query->where('evaluaciones.proyecto_id', $culturaInnovacion->id)->where('evaluaciones.habilitado', true);
                })->where('cultura_innovacion_evaluaciones.id', '!=', $evaluacion->culturaInnovacionEvaluacion->id)->first();
                break;
            case $evaluacion->proyecto->servicioTecnologico()->exists():
                $evaluacion->proyecto->metodologia = $evaluacion->proyecto->servicioTecnologico->metodologia;

                $servicioTecnologico = $evaluacion->proyecto->servicioTecnologico;

                $otrasEvaluaciones = ServicioTecnologicoEvaluacion::whereHas('evaluacion', function ($query) use ($servicioTecnologico) {
                    $query->where('evaluaciones.proyecto_id', $servicioTecnologico->id)->where('evaluaciones.habilitado', true);
                })->where('servicios_tecnologicos_evaluaciones.id', '!=', $evaluacion->servicioTecnologicoEvaluacion->id)->first();
                break;
            default:
                break;
        }

        return Inertia::render('Convocatorias/Evaluaciones/Actividades/Index', [
            'convocatoria'      => $convocatoria->only('id', 'esta_activa', 'fase_formateada', 'fase', 'tipo_convocatoria', 'mostrar_recomendaciones'),
            'evaluacion'        => $evaluacion,
            'otrasEvaluaciones' => $otrasEvaluaciones,
            'proyecto'          => $evaluacion->proyecto->only(
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
                'en_subsanacion',
                'evaluaciones',
                'mostrar_recomendaciones',
                'PdfVersiones',
                'all_files',
                'allowed',
                'tipo_proyecto',
                'cantidad_objetivos'
            ),
            'filters'           => request()->all('search'),
            'actividades'       => Actividad::whereIn(
                'objetivo_especifico_id',
                $objetivoEspecifico->map(function ($objetivoEspecifico) {
                    return $objetivoEspecifico->id;
                })
            )->with('objetivoEspecifico')->orderBy('objetivo_especifico_id', 'ASC')
                ->filterActividad(request()->only('search'))->paginate()->appends(['search' => request()->search]),
            'actividadesGantt'  => Actividad::whereIn(
                'objetivo_especifico_id',
                $objetivoEspecifico->map(function ($objetivoEspecifico) {
                    return $objetivoEspecifico->id;
                })
            )->where('fecha_inicio', '<>', null)->orderBy('fecha_inicio', 'ASC')->get(),
            'talentosOtrosDepartamentos'            => $talentosOtrosDepartamentos ?? null,
            'proyectoMunicipios'                    => $proyectoMunicipios ?? null,
            'proyectoMunicipiosImpactar'            => $proyectoMunicipiosImpactar ?? null,
            'programasFormacion'                    => $programasFormacion ?? null,
            'modalidades'                           => $modalidades ?? null,
            'nivelesFormacion'                      => $nivelesFormacion ?? null,
            'proyectoProgramasFormacionArticulados' => $proyectoProgramasFormacionArticulados ?? null,
            'proyectoDisenosCurriculares'           => $proyectoDisenosCurriculares ?? null,
            'regionales'                            => SelectHelper::regionales(),
            'departamentos'                         => Regional::select('regionales.id as value', 'regionales.nombre as label')->orderBy('nombre')->get(),
            'municipios'                            => SelectHelper::municipios(),
            'disenosCurriculares'                   => SelectHelper::disenoCurriculares()->where('habilitado_convocatoria', true)->values()->all(),
            'tecnoacademiaRelacionada'              => $evaluacion->proyecto->tecnoacademiaLineasTecnoacademia()->first() ? $evaluacion->proyecto->tecnoacademiaLineasTecnoacademia()->first()->tecnoacademia : null,
            'aulasMoviles'                          => AulaMovil::where('ta_id', $evaluacion->proyecto->id)->get(),
        ]);
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
            case $evaluacion->idiEvaluacion()->exists():
                $evaluacion->idiEvaluacion()->update([
                    'metodologia_puntaje'      => $request->metodologia_puntaje,
                    'metodologia_comentario'   => $request->metodologia_requiere_comentario == false ? $request->metodologia_comentario : null
                ]);
                break;
            case $evaluacion->culturaInnovacionEvaluacion()->exists():
                $evaluacion->culturaInnovacionEvaluacion()->update([
                    'metodologia_puntaje'      => $request->metodologia_puntaje,
                    'metodologia_comentario'   => $request->metodologia_requiere_comentario == false ? $request->metodologia_comentario : null
                ]);
                break;
            case $evaluacion->taEvaluacion()->exists():
                $evaluacion->taEvaluacion()->update([
                    'metodologia_comentario'        => $request->metodologia_requiere_comentario == false ? $request->metodologia_comentario : null,
                    'municipios_comentario'         => $request->municipios_requiere_comentario == false ? $request->municipios_comentario : null,
                    'instituciones_comentario'      => $request->instituciones_requiere_comentario == false ? $request->instituciones_comentario : null,
                    'proyectos_macro_comentario'    => $request->proyectos_macro_requiere_comentario == false ? $request->proyectos_macro_comentario : null
                ]);
                break;
            case $evaluacion->tpEvaluacion()->exists():
                $evaluacion->tpEvaluacion()->update([
                    'metodologia_comentario'   => $request->metodologia_requiere_comentario == false ? $request->metodologia_comentario : null,
                    'municipios_comentario'    => $request->municipios_requiere_comentario == false ? $request->municipios_comentario : null
                ]);
                break;

            case $evaluacion->servicioTecnologicoEvaluacion()->exists():
                $evaluacion->servicioTecnologicoEvaluacion()->update([
                    'metodologia_puntaje'      => $request->metodologia_puntaje,
                    'metodologia_comentario'   => $request->metodologia_requiere_comentario == false ? $request->metodologia_comentario : null,

                    'actividades_primer_obj_puntaje'      => $request->actividades_primer_obj_puntaje,
                    'actividades_primer_obj_comentario'   => $request->actividades_primer_obj_requiere_comentario == false ? $request->actividades_primer_obj_comentario : null,

                    'actividades_segundo_obj_puntaje'      => $request->actividades_segundo_obj_puntaje,
                    'actividades_segundo_obj_comentario'   => $request->actividades_segundo_obj_requiere_comentario == false ? $request->actividades_segundo_obj_comentario : null,

                    'actividades_tercer_obj_puntaje'      => $request->actividades_tercer_obj_puntaje,
                    'actividades_tercer_obj_comentario'   => $request->actividades_tercer_obj_requiere_comentario == false ? $request->actividades_tercer_obj_comentario : null,

                    'actividades_cuarto_obj_puntaje'      => $request->actividades_cuarto_obj_puntaje,
                    'actividades_cuarto_obj_comentario'   => $request->actividades_cuarto_obj_requiere_comentario == false ? $request->actividades_cuarto_obj_comentario : null,
                ]);
                break;
            default:
                break;
        }

        $evaluacion->save();

        return back()->with('success', 'El recurso se ha actualizado correctamente.');
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Actividad  $actividad
     * @return \Illuminate\Http\Response
     */
    public function actividadEvaluacion(Convocatoria $convocatoria, Evaluacion $evaluacion, Actividad $actividad)
    {
        $this->authorize('visualizar-evaluacion-autor', $evaluacion);

        $resultados = $evaluacion->proyecto->efectosDirectos()->whereHas('resultado', function ($query) {
            $query->where('descripcion', '!=', null);
        })->with('resultado')->get()->pluck('resultado')->flatten();

        $productos = $resultados->map(function ($resultado) {
            return $resultado->productos;
        })->flatten();

        return Inertia::render('Convocatorias/Evaluaciones/Actividades/Edit', [
            'convocatoria'                   => $convocatoria->only('id', 'esta_activa', 'fase_formateada', 'fase', 'tipo_convocatoria', 'min_fecha_inicio_proyectos', 'max_fecha_finalizacion_proyectos'),
            'evaluacion'                     => $evaluacion->only('id'),
            'proyecto'                       => $evaluacion->proyecto->only('id', 'fecha_inicio', 'fecha_finalizacion', 'finalizado'),
            'productos'                      => $productos,
            'proyectoPresupuesto'            => ProyectoPresupuesto::where('proyecto_id', $evaluacion->proyecto->id)->with('convocatoriaProyectoRubrosPresupuestales.presupuestoSennova.usoPresupuestal')->get(),
            'actividad'                      => $actividad,
            'productosRelacionados'          => $actividad->productos()->pluck('productos.id'),
            'proyectoPresupuestoRelacionado' => $actividad->proyectoPresupuesto()->pluck('proyecto_presupuesto.id')
        ]);
    }
}
