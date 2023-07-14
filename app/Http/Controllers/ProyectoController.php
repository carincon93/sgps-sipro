<?php

namespace App\Http\Controllers;

use App\Helpers\SharepointHelper;
use App\Helpers\SelectHelper;
use App\Http\Requests\NuevoProponenteRequest;
use App\Http\Requests\ProgramaFormacionRequest;
use App\Http\Requests\ProponenteRequest;
use App\Http\Traits\ProyectoValidationTrait;
use App\Models\Convocatoria;
use App\Models\Evaluacion\CulturaInnovacionEvaluacion;
use App\Models\Evaluacion\Evaluacion;
use App\Models\Evaluacion\IdiEvaluacion;
use App\Models\Evaluacion\ServicioTecnologicoEvaluacion;
use App\Models\Evaluacion\TaEvaluacion;
use App\Models\Evaluacion\TpEvaluacion;
use App\Models\Impacto;
use App\Models\User;
use App\Models\ProgramaFormacion;
use App\Models\Proyecto;
use App\Models\SemilleroInvestigacion;
use App\Models\ProyectoPdfVersion;
use App\Models\RolSennova;
use App\Notifications\ComentarioProyecto;
use App\Notifications\EvaluacionFinalizada;
use App\Notifications\ProyectoFinalizado;
use App\Notifications\ProyectoConfirmado;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ProyectoController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return Inertia::render('Proyectos/Index', [
            'filters'       => request()->all('search'),
            'convocatorias' => SelectHelper::convocatorias(),
            'proyectos'     => Proyecto::with('PdfVersiones', 'convocatoria')->orderBy('id', 'ASC')->filterProyecto(request()->only('search'))->paginate()->appends(['search' => request()->search]),
            'proyectosId'   => Proyecto::selectRaw("id + 8000 as codigo_only")->orderBy('id', 'ASC')->get()->pluck('codigo_only')->flatten('codigo_only')
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Evaluacion\Proyecto $proyecto
     * @return \Illuminate\Http\Response
     */
    public function editProyecto(Proyecto $proyecto)
    {
        $proyecto->load('evaluaciones');
        $proyecto->load('evaluaciones.evaluador');

        $proyecto->evaluacionesHabilitadas = $proyecto->evaluaciones()->where('habilitado', true)->count();

        return Inertia::render('Proyectos/Edit', [
            'proyecto'    => $proyecto,
            'proyectos'   => Proyecto::selectRaw("id as value, concat('SGPS-', id + 8000, '-SIPRO') as label")->with('idi', 'ta', 'tp', 'servicioTecnologico', 'culturaInnovacion')->orderBy('id', 'ASC')->get(),
            'evaluadores' => User::select('users.id as value', 'users.nombre as label')->join('model_has_roles', 'users.id', 'model_has_roles.model_id')->join('roles', 'model_has_roles.role_id', 'roles.id')->where('roles.id', 11)->get()
        ]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Evaluacion\Proyecto  $proyecto
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Proyecto $proyecto)
    {
        if ($request->en_evaluacion == true && $request->subsanacion == true) {
            return back()->with('error', 'Se ha producido un error por tener estado de subsanación y evaluación habilitados a la misma vez.');
        }

        if ($request->subsanacion == true) {
            $proyecto->habilitado_para_evaluar  = false;
            $proyecto->modificable              = true;
            $proyecto->finalizado               = false;
            $proyecto->mostrar_recomendaciones  = true;
            $proyecto->evaluaciones()->update(['finalizado' => true, 'modificable' => false, 'iniciado' => false]);
        } else {
            $proyecto->habilitado_para_evaluar  = true;
            $proyecto->modificable              = false;
            $proyecto->finalizado               = true;
            $proyecto->mostrar_recomendaciones  = $request->mostrar_recomendaciones;
        }

        $proyecto->en_evaluacion   = $request->en_evaluacion;
        $proyecto->radicado        = $request->radicado;

        $proyecto->save();

        $proyecto->update(['estado' => $proyecto->estado_evaluacion_idi ?? $proyecto->estado_evaluacion_cultura_innovacion ?? $proyecto->estado_evaluacion_ta ?? $proyecto->estado_evaluacion_tp ?? $proyecto->estado_evaluacion_servicios_tecnologicos]);

        if ($request->subsanacion == true) {
            $request->subsanacion = $request->subsanacion ? 'true' : 'false';
            $proyecto->update(['estado' => $proyecto->estado]);
            sleep(2);
            $proyecto->update(
                [
                    'estado' => DB::raw("estado::jsonb || '{\"requiereSubsanar\":$request->subsanacion}'")
                ]
            );
        }

        if ($request->estado_cord_sennova) {
            $request->subsanacion = $request->subsanacion ? 'true' : 'false';
            $proyecto->update(['estado_cord_sennova' => $proyecto->estado]);
            sleep(2);
            $proyecto->update(
                [
                    'estado_cord_sennova' => DB::raw("estado_cord_sennova::jsonb || '{\"requiereSubsanar\":$request->subsanacion, \"estado\": \"$request->estado_cord_sennova\"}'")
                ]
            );
        }

        return back()->with('success', 'El recurso se ha actualizado correctamente.');
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function activos()
    {
        return Inertia::render('Proyectos/Activos', [
            'proyectos' => Proyecto::where('modificable', true)->orderBy('id', 'ASC')->paginate(),
        ]);
    }

    /**
     * showCadenaValor
     *
     * @param  mixed $convocatoria
     * @param  mixed $proyecto
     * @return void
     */
    public function showCadenaValor(Request $request, Convocatoria $convocatoria, Proyecto $proyecto)
    {
        $this->authorize('visualizar-proyecto-autor', $proyecto);

        $proyecto->load('evaluaciones.idiEvaluacion');
        $proyecto->load('evaluaciones.taEvaluacion');

        $proyecto->codigo_linea_programatica = $proyecto->lineaProgramatica->codigo;

        if ($proyecto->idi()->exists()) {
            $objetivoGeneral = $proyecto->idi->objetivo_general;
            $proyecto->propuesta_sostenibilidad = $proyecto->idi->propuesta_sostenibilidad;
        }

        if ($proyecto->ta()->exists()) {
            $objetivoGeneral = $proyecto->ta->objetivo_general;
            $proyecto->propuesta_sostenibilidad_social      = $proyecto->ta->propuesta_sostenibilidad_social;
            $proyecto->propuesta_sostenibilidad_ambiental   = $proyecto->ta->propuesta_sostenibilidad_ambiental;
            $proyecto->propuesta_sostenibilidad_financiera  = $proyecto->ta->propuesta_sostenibilidad_financiera;
        }

        if ($proyecto->tp()->exists()) {
            $objetivoGeneral = $proyecto->tp->objetivo_general;
            $proyecto->propuesta_sostenibilidad = $proyecto->tp->propuesta_sostenibilidad;
        }

        if ($proyecto->servicioTecnologico()->exists()) {
            $objetivoGeneral = $proyecto->servicioTecnologico->objetivo_general;
            $proyecto->propuesta_sostenibilidad = $proyecto->servicioTecnologico->propuesta_sostenibilidad;
            $proyecto->propuesta_sostenibilidad = $proyecto->servicioTecnologico->propuesta_sostenibilidad;
        }

        if ($proyecto->culturaInnovacion()->exists()) {
            $objetivoGeneral                    = $proyecto->culturaInnovacion->objetivo_general;
            $proyecto->propuesta_sostenibilidad = $proyecto->culturaInnovacion->propuesta_sostenibilidad;
            $proyecto->tipo_proyecto            = $proyecto->culturaInnovacion->tipo_proyecto;
        }

        $objetivos = collect([]);
        $productos = collect([]);

        foreach ($proyecto->causasDirectas as $causaDirecta) {
            $objetivos->push(['descripcion' => $causaDirecta->objetivoEspecifico->descripcion, 'numero' => $causaDirecta->objetivoEspecifico->numero]);
        }

        foreach ($proyecto->efectosDirectos as $efectoDirecto) {
            foreach ($efectoDirecto->resultado->productos as $producto) {
                $productos->prepend(['v' => 'prod' . $producto->id,  'f' => $producto->nombre, 'fkey' =>  'Objetivo específico ' . $efectoDirecto->resultado->objetivoEspecifico->numero, 'tootlip' => 'prod' . $producto->id, 'actividades' => $producto->actividades->load('proyectoRolesSennova.convocatoriaRolSennova.rolSennova')]);
            }
        }

        return Inertia::render('Convocatorias/Proyectos/CadenaValor/Index', [
            'convocatoria'      => $convocatoria->only('id', 'esta_activa', 'fase_formateada', 'fase', 'tipo_convocatoria', 'tipo_convocatoria', 'mostrar_recomendaciones'),
            'proyecto'          => $proyecto->only('id', 'codigo_linea_programatica', 'precio_proyecto', 'propuesta_sostenibilidad', 'propuesta_sostenibilidad_social', 'propuesta_sostenibilidad_ambiental', 'propuesta_sostenibilidad_financiera', 'modificable', 'en_subsanacion', 'evaluaciones', 'mostrar_recomendaciones', 'PdfVersiones', 'all_files', 'allowed', 'updated_at', 'tipo_proyecto'),
            'productos'         => $productos,
            'objetivos'         => $objetivos,
            'objetivoGeneral'   => $objetivoGeneral,
            'to_pdf'            => ($request->to_pdf == 1) ? true : false
        ]);
    }

    /**
     * showCadenaValorEvaluacion
     *
     * @param  mixed $convocatoria
     * @param  mixed $proyecto
     * @return void
     */
    public function showCadenaValorEvaluacion(Convocatoria $convocatoria, Evaluacion $evaluacion)
    {
        $this->authorize('visualizar-evaluacion-autor', $evaluacion);

        $evaluacion->proyecto->codigo_linea_programatica = $evaluacion->proyecto->lineaProgramatica->codigo;

        $efectosIndirectos = $evaluacion->proyecto->efectosDirectos()->with('efectosIndirectos')->get()->pluck('efectosIndirectos')->flatten()->filter();

        switch ($evaluacion->proyecto) {
            case $evaluacion->proyecto->idi()->exists():
                $objetivoGeneral = $evaluacion->proyecto->idi->objetivo_general;
                $evaluacion->proyecto->propuesta_sostenibilidad = $evaluacion->proyecto->idi->propuesta_sostenibilidad;

                $evaluacion->idiEvaluacion;
                $idi = $evaluacion->proyecto->idi;

                $segundaEvaluacion = IdiEvaluacion::whereHas('evaluacion', function ($query) use ($idi) {
                    $query->where('evaluaciones.proyecto_id', $idi->id)->where('evaluaciones.habilitado', true);
                })->where('idi_evaluaciones.id', '!=', $evaluacion->idiEvaluacion->id)->first();
                break;
            case $evaluacion->proyecto->ta()->exists():
                $objetivoGeneral = $evaluacion->proyecto->ta->objetivo_general;
                $evaluacion->proyecto->propuesta_sostenibilidad_social      = $evaluacion->proyecto->ta->propuesta_sostenibilidad_social;
                $evaluacion->proyecto->propuesta_sostenibilidad_ambiental   = $evaluacion->proyecto->ta->propuesta_sostenibilidad_ambiental;
                $evaluacion->proyecto->propuesta_sostenibilidad_financiera  = $evaluacion->proyecto->ta->propuesta_sostenibilidad_financiera;

                $evaluacion->taEvaluacion;
                $ta = $evaluacion->proyecto->ta;

                $segundaEvaluacion = TaEvaluacion::whereHas('evaluacion', function ($query) use ($ta) {
                    $query->where('evaluaciones.proyecto_id', $ta->id)->where('evaluaciones.habilitado', true);
                })->where('ta_evaluaciones.id', '!=', $evaluacion->taEvaluacion->id)->first();
                break;
            case $evaluacion->proyecto->tp()->exists():
                $objetivoGeneral = $evaluacion->proyecto->tp->objetivo_general;
                $evaluacion->proyecto->propuesta_sostenibilidad = $evaluacion->proyecto->tp->propuesta_sostenibilidad;

                $evaluacion->tpEvaluacion;
                $tp = $evaluacion->proyecto->tp;

                $segundaEvaluacion = TpEvaluacion::whereHas('evaluacion', function ($query) use ($tp) {
                    $query->where('evaluaciones.proyecto_id', $tp->id)->where('evaluaciones.habilitado', true);
                })->where('tp_evaluaciones.id', '!=', $evaluacion->tpEvaluacion->id)->first();
                break;

            case $evaluacion->proyecto->servicioTecnologico()->exists():
                $objetivoGeneral = $evaluacion->proyecto->servicioTecnologico->objetivo_general;
                $evaluacion->proyecto->propuesta_sostenibilidad = $evaluacion->proyecto->servicioTecnologico->propuesta_sostenibilidad;

                $servicioTecnologico = $evaluacion->proyecto->servicioTecnologico;

                $segundaEvaluacion = ServicioTecnologicoEvaluacion::whereHas('evaluacion', function ($query) use ($servicioTecnologico) {
                    $query->where('evaluaciones.proyecto_id', $servicioTecnologico->id)->where('evaluaciones.habilitado', true);
                })->where('servicios_tecnologicos_evaluaciones.id', '!=', $evaluacion->servicioTecnologicoEvaluacion->id)->first();
                break;

            case $evaluacion->proyecto->culturaInnovacion()->exists():
                $objetivoGeneral = $evaluacion->proyecto->culturaInnovacion->objetivo_general;
                $evaluacion->proyecto->propuesta_sostenibilidad = $evaluacion->proyecto->culturaInnovacion->propuesta_sostenibilidad;

                $evaluacion->culturaInnovacionEvaluacion;
                $culturaInnovacion = $evaluacion->proyecto->culturaInnovacion;

                $segundaEvaluacion = CulturaInnovacionEvaluacion::whereHas('evaluacion', function ($query) use ($culturaInnovacion) {
                    $query->where('evaluaciones.proyecto_id', $culturaInnovacion->id)->where('evaluaciones.habilitado', true);
                })->where('cultura_innovacion_evaluaciones.id', '!=', $evaluacion->culturaInnovacionEvaluacion->id)->first();

                break;
            default:
                break;
        }

        $objetivos = collect([]);
        $productos = collect([]);

        foreach ($evaluacion->proyecto->causasDirectas as $causaDirecta) {
            $objetivos->push(['descripcion' => $causaDirecta->objetivoEspecifico->descripcion, 'numero' => $causaDirecta->objetivoEspecifico->numero]);
        }

        foreach ($evaluacion->proyecto->efectosDirectos as $efectoDirecto) {
            foreach ($efectoDirecto->resultado->productos as $producto) {
                $productos->prepend(['v' => 'prod' . $producto->id,  'f' => $producto->nombre, 'fkey' =>  'Objetivo específico ' . $efectoDirecto->resultado->objetivoEspecifico->numero, 'tootlip' => 'prod' . $producto->id, 'actividades' => $producto->actividades->load('proyectoRolesSennova.convocatoriaRolSennova.rolSennova')]);
            }
        }

        return Inertia::render('Convocatorias/Evaluaciones/CadenaValor/Index', [
            'convocatoria'      => $convocatoria->only('id', 'esta_activa', 'fase_formateada', 'fase', 'tipo_convocatoria'),
            'evaluacion'        => $evaluacion,
            'segundaEvaluacion' => $segundaEvaluacion,
            'proyecto'          => $evaluacion->proyecto,
            'productos'         => $productos,
            'objetivoGeneral'   => $objetivoGeneral,
            'objetivos'         => $objetivos,
            'impactos'          => Impacto::whereIn(
                'efecto_indirecto_id',
                $efectosIndirectos->map(function ($efectosIndirecto) {
                    return $efectosIndirecto->id;
                })
            )->orderBy('tipo', 'ASC')->get()
        ]);
    }

    /**
     * updateCadenaValorEvaluacion
     *
     * @param  mixed $request
     * @param  mixed $convocatoria
     * @param  mixed $evaluacion
     * @return void
     */
    public function updateCadenaValorEvaluacion(Request $request, Convocatoria $convocatoria, Evaluacion $evaluacion)
    {
        $this->authorize('modificar-evaluacion-autor', $evaluacion);

        switch ($evaluacion) {
            case $evaluacion->idiEvaluacion()->exists():
                $evaluacion->idiEvaluacion()->update([
                    'cadena_valor_puntaje'      => $request->cadena_valor_puntaje,
                    'cadena_valor_comentario'   => $request->cadena_valor_requiere_comentario == false ? $request->cadena_valor_comentario : null
                ]);
                break;
            case $evaluacion->culturaInnovacionEvaluacion()->exists():
                $evaluacion->culturaInnovacionEvaluacion()->update([
                    'cadena_valor_puntaje'      => $request->cadena_valor_puntaje,
                    'cadena_valor_comentario'   => $request->cadena_valor_requiere_comentario == false ? $request->cadena_valor_comentario : null
                ]);
                break;
            case $evaluacion->taEvaluacion()->exists():
                $evaluacion->taEvaluacion()->update([
                    'cadena_valor_comentario'   => $request->cadena_valor_requiere_comentario == false ? $request->cadena_valor_comentario : null
                ]);
                break;
            case $evaluacion->tpEvaluacion()->exists():
                $evaluacion->tpEvaluacion()->update([
                    'cadena_valor_comentario'   => $request->cadena_valor_requiere_comentario == false ? $request->cadena_valor_comentario : null
                ]);
                break;

            case $evaluacion->servicioTecnologicoEvaluacion()->exists():
                $evaluacion->servicioTecnologicoEvaluacion()->update([
                    'propuesta_sostenibilidad_puntaje'      => $request->propuesta_sostenibilidad_puntaje,
                    'propuesta_sostenibilidad_comentario'   => $request->propuesta_sostenibilidad_requiere_comentario == false ? $request->propuesta_sostenibilidad_comentario : null,

                    'impacto_ambiental_puntaje'      => $request->impacto_ambiental_puntaje,
                    'impacto_ambiental_comentario'   => $request->impacto_ambiental_requiere_comentario == false ? $request->impacto_ambiental_comentario : null,

                    'impacto_social_centro_puntaje'      => $request->impacto_social_centro_puntaje,
                    'impacto_social_centro_comentario'   => $request->impacto_social_centro_requiere_comentario == false ? $request->impacto_social_centro_comentario : null,

                    'impacto_social_productivo_puntaje'      => $request->impacto_social_productivo_puntaje,
                    'impacto_social_productivo_comentario'   => $request->impacto_social_productivo_requiere_comentario == false ? $request->impacto_social_productivo_comentario : null,

                    'impacto_tecnologico_puntaje'      => $request->impacto_tecnologico_puntaje,
                    'impacto_tecnologico_comentario'   => $request->impacto_social_productivo_requiere_comentario == false ? $request->impacto_tecnologico_comentario : null,
                ]);
                break;
            default:
                break;
        }

        $evaluacion->save();

        return back()->with('success', 'El recurso se ha actualizado correctamente.');
    }

    public function updatePropuestaSostenibilidad(Request $request, Convocatoria $convocatoria, Proyecto $proyecto)
    {
        $this->authorize('modificar-proyecto-autor', $proyecto);

        switch ($proyecto) {
            case $proyecto->idi()->exists():
                $request->validate([
                    'propuesta_sostenibilidad' => 'required|string|max:40000',
                ]);
                $idi                            = $proyecto->idi;
                $idi->propuesta_sostenibilidad  = $request->propuesta_sostenibilidad;

                $idi->save();
                break;
            case $proyecto->ta()->exists():
                $request->validate([
                    'propuesta_sostenibilidad_social'       => 'required|string|max:40000',
                    'propuesta_sostenibilidad_ambiental'    => 'required|string|max:40000',
                    'propuesta_sostenibilidad_financiera'   => 'required|string|max:40000',
                ]);
                $ta = $proyecto->ta;
                $ta->propuesta_sostenibilidad_social        = $request->propuesta_sostenibilidad_social;
                $ta->propuesta_sostenibilidad_ambiental     = $request->propuesta_sostenibilidad_ambiental;
                $ta->propuesta_sostenibilidad_financiera    = $request->propuesta_sostenibilidad_financiera;

                $ta->save();
                break;
            case $proyecto->tp()->exists():
                $request->validate([
                    'propuesta_sostenibilidad' => 'required|string|max:40000',
                ]);
                $tp                           = $proyecto->tp;
                $tp->propuesta_sostenibilidad = $request->propuesta_sostenibilidad;

                $tp->save();
                break;
            case $proyecto->culturaInnovacion()->exists():
                $request->validate([
                    'propuesta_sostenibilidad' => 'required|string|max:40000',
                ]);
                $culturaInnovacion                              = $proyecto->culturaInnovacion;
                $culturaInnovacion->propuesta_sostenibilidad    = $request->propuesta_sostenibilidad;

                $culturaInnovacion->save();
                break;
            case $proyecto->servicioTecnologico()->exists():
                $request->validate([
                    'propuesta_sostenibilidad' => 'required|string|max:40000',
                ]);
                $servicioTecnologico                            = $proyecto->servicioTecnologico;
                $servicioTecnologico->propuesta_sostenibilidad  = $request->propuesta_sostenibilidad;

                $servicioTecnologico->save();
                break;
            default:
                break;
        }

        return back()->with('success', 'El recurso se ha guardado correctamente.');
    }

    /**
     * Proyecto
     *
     * @param  mixed $convocatoria
     * @param  mixed $proyecto
     * @return void
     */
    public function edit(Convocatoria $convocatoria, Proyecto $proyecto)
    {
        switch ($proyecto) {
            case $proyecto->idi()->exists():
                return redirect()->route('convocatorias.idi.edit', [$convocatoria, $proyecto]);
                break;
            case $proyecto->ta()->exists():
                return redirect()->route('convocatorias.ta.edit', [$convocatoria, $proyecto]);
                break;
            case $proyecto->tp()->exists():
                return redirect()->route('convocatorias.tp.edit', [$convocatoria, $proyecto]);
                break;
            case $proyecto->servicioTecnologico()->exists():
                return redirect()->route('convocatorias.servicios-tecnologicos.edit', [$convocatoria, $proyecto]);
                break;
            case $proyecto->culturaInnovacion()->exists():
                return redirect()->route('convocatorias.cultura-innovacion.edit', [$convocatoria, $proyecto]);
                break;
            default:
                break;
        }
    }

    /**
     * Show summary.
     *
     * @param  \App\Models\Proyecto  $proyecto
     * @return \Illuminate\Http\Response
     */
    public function summary(Convocatoria $convocatoria, Proyecto $proyecto)
    {
        $this->authorize('visualizar-proyecto-autor', [$proyecto]);

        $proyecto->codigo_linea_programatica = $proyecto->lineaProgramatica->codigo;
        $proyecto->precio_proyecto           = $proyecto->precioProyecto;

        $proyecto->logs = $proyecto::getLog($proyecto->id);

        if ($proyecto->culturaInnovacion()->exists()) {
            $proyecto->tipo_proyecto = $proyecto->culturaInnovacion->tipo_proyecto;
        }

        return Inertia::render('Convocatorias/Proyectos/Summary', [
            'convocatoria'                  => $convocatoria->only('id', 'esta_activa', 'fase_formateada', 'fase', 'tipo_convocatoria', 'min_fecha_inicio_proyectos', 'max_fecha_finalizacion_proyectos'),
            'proyecto'                      => $proyecto->only('id', 'precio_proyecto', 'codigo_linea_programatica', 'logs', 'finalizado', 'modificable', 'habilitado_para_evaluar', 'mostrar_recomendaciones', 'PdfVersiones', 'all_files', 'allowed', 'tipo_proyecto'),
            'problemaCentral'               => ProyectoValidationTrait::problemaCentral($proyecto),
            'efectosDirectos'               => ProyectoValidationTrait::efectosDirectos($proyecto),
            'causasIndirectas'              => ProyectoValidationTrait::causasIndirectas($proyecto),
            'causasDirectas'                => ProyectoValidationTrait::causasDirectas($proyecto),
            'efectosIndirectos'             => ProyectoValidationTrait::efectosIndirectos($proyecto),
            'objetivoGeneral'               => ProyectoValidationTrait::objetivoGeneral($proyecto),
            'resultados'                    => ProyectoValidationTrait::resultados($proyecto),
            'objetivosEspecificos'          => ProyectoValidationTrait::objetivosEspecificos($proyecto),
            'actividades'                   => ProyectoValidationTrait::actividades($proyecto),
            'impactos'                      => ProyectoValidationTrait::impactos($proyecto),
            'edt'                           => ProyectoValidationTrait::edt($proyecto),
            // 'actividadesPresupuesto'    => ProyectoValidationTrait::actividadesPresupuesto($proyecto),
            'resultadoProducto'             => ProyectoValidationTrait::resultadoProducto($proyecto),
            'analisisRiesgo'                => ProyectoValidationTrait::analisisRiesgo($proyecto),
            'anexos'                        => ProyectoValidationTrait::anexos($proyecto),
            'generalidades'                 => ProyectoValidationTrait::generalidades($proyecto),
            'metodologia'                   => ProyectoValidationTrait::metodologia($proyecto),
            'propuestaSostenibilidad'       => ProyectoValidationTrait::propuestaSostenibilidad($proyecto),
            'productosActividades'          => ProyectoValidationTrait::productosActividades($proyecto),
            'articulacionSennova'           => ProyectoValidationTrait::articulacionSennova($proyecto),
            'soportesEstudioMercado'        => ProyectoValidationTrait::soportesEstudioMercado($proyecto),
            'estudiosMercadoArchivo'        => ProyectoValidationTrait::estudiosMercadoArchivo($proyecto),
            'minInstructoresInvestigadores' => ProyectoValidationTrait::minInstructoresInvestigadores($proyecto),
            'minAprendicesEnSemilleros'     => ProyectoValidationTrait::minAprendicesEnSemilleros($proyecto),
            'versiones'                     => $proyecto->PdfVersiones,
        ]);
    }

    /**
     * Show summaryEvaluacion.
     *
     * @param  \App\Models\Evaluacion  $evaluacion
     * @return \Illuminate\Http\Response
     */
    public function summaryEvaluacion(Convocatoria $convocatoria, Evaluacion $evaluacion)
    {
        $this->authorize('visualizar-evaluacion-autor', $evaluacion);

        $evaluacion->proyecto->codigo_linea_programatica = $evaluacion->proyecto->lineaProgramatica->codigo;
        $evaluacion->proyecto->precio_proyecto           = $evaluacion->proyecto->precioProyecto;

        $evaluacion->proyecto->logs = $evaluacion->proyecto::getLog($evaluacion->proyecto->id);

        switch ($evaluacion) {
            case $evaluacion->idiEvaluacion()->exists():
                $evaluacion->titulo_puntaje             = $evaluacion->idiEvaluacion->titulo_puntaje;
                $evaluacion->video_puntaje              = $evaluacion->idiEvaluacion->video_puntaje;
                $evaluacion->resumen_puntaje            = $evaluacion->idiEvaluacion->resumen_puntaje;
                $evaluacion->problema_central_puntaje   = $evaluacion->idiEvaluacion->problema_central_puntaje;
                $evaluacion->objetivos_puntaje          = $evaluacion->idiEvaluacion->objetivos_puntaje;
                $evaluacion->metodologia_puntaje        = $evaluacion->idiEvaluacion->metodologia_puntaje;
                $evaluacion->entidad_aliada_puntaje     = $evaluacion->idiEvaluacion->entidad_aliada_puntaje;
                $evaluacion->resultados_puntaje         = $evaluacion->idiEvaluacion->resultados_puntaje;
                $evaluacion->productos_puntaje          = $evaluacion->idiEvaluacion->productos_puntaje;
                $evaluacion->cadena_valor_puntaje       = $evaluacion->idiEvaluacion->cadena_valor_puntaje;
                $evaluacion->analisis_riesgos_puntaje   = $evaluacion->idiEvaluacion->analisis_riesgos_puntaje;
                $evaluacion->ortografia_puntaje         = $evaluacion->idiEvaluacion->ortografia_puntaje;
                $evaluacion->redaccion_puntaje          = $evaluacion->idiEvaluacion->redaccion_puntaje;
                $evaluacion->normas_apa_puntaje         = $evaluacion->idiEvaluacion->normas_apa_puntaje;
                break;
            case $evaluacion->culturaInnovacionEvaluacion()->exists():
                $evaluacion->titulo_puntaje             = $evaluacion->culturaInnovacionEvaluacion->titulo_puntaje;
                $evaluacion->video_puntaje              = $evaluacion->culturaInnovacionEvaluacion->video_puntaje;
                $evaluacion->resumen_puntaje            = $evaluacion->culturaInnovacionEvaluacion->resumen_puntaje;
                $evaluacion->problema_central_puntaje   = $evaluacion->culturaInnovacionEvaluacion->problema_central_puntaje;
                $evaluacion->objetivos_puntaje          = $evaluacion->culturaInnovacionEvaluacion->objetivos_puntaje;
                $evaluacion->metodologia_puntaje        = $evaluacion->culturaInnovacionEvaluacion->metodologia_puntaje;
                $evaluacion->entidad_aliada_puntaje     = $evaluacion->culturaInnovacionEvaluacion->entidad_aliada_puntaje;
                $evaluacion->resultados_puntaje         = $evaluacion->culturaInnovacionEvaluacion->resultados_puntaje;
                $evaluacion->productos_puntaje          = $evaluacion->culturaInnovacionEvaluacion->productos_puntaje;
                $evaluacion->cadena_valor_puntaje       = $evaluacion->culturaInnovacionEvaluacion->cadena_valor_puntaje;
                $evaluacion->analisis_riesgos_puntaje   = $evaluacion->culturaInnovacionEvaluacion->analisis_riesgos_puntaje;
                $evaluacion->ortografia_puntaje         = $evaluacion->culturaInnovacionEvaluacion->ortografia_puntaje;
                $evaluacion->redaccion_puntaje          = $evaluacion->culturaInnovacionEvaluacion->redaccion_puntaje;
                $evaluacion->normas_apa_puntaje         = $evaluacion->culturaInnovacionEvaluacion->normas_apa_puntaje;
                break;
            case $evaluacion->servicioTecnologicoEvaluacion()->exists():
                $evaluacion->titulo_puntaje = $evaluacion->servicioTecnologicoEvaluacion->titulo_puntaje;
                $evaluacion->resumen_puntaje = $evaluacion->servicioTecnologicoEvaluacion->resumen_puntaje;
                $evaluacion->antecedentes_puntaje = $evaluacion->servicioTecnologicoEvaluacion->antecedentes_puntaje;
                $evaluacion->justificacion_problema_puntaje = $evaluacion->servicioTecnologicoEvaluacion->justificacion_problema_puntaje;
                $evaluacion->pregunta_formulacion_problema_puntaje = $evaluacion->servicioTecnologicoEvaluacion->pregunta_formulacion_problema_puntaje;
                $evaluacion->propuesta_sostenibilidad_puntaje = $evaluacion->servicioTecnologicoEvaluacion->propuesta_sostenibilidad_puntaje;
                $evaluacion->identificacion_problema_puntaje = $evaluacion->servicioTecnologicoEvaluacion->identificacion_problema_puntaje;
                $evaluacion->arbol_problemas_puntaje = $evaluacion->servicioTecnologicoEvaluacion->arbol_problemas_puntaje;
                $evaluacion->impacto_ambiental_puntaje = $evaluacion->servicioTecnologicoEvaluacion->impacto_ambiental_puntaje;
                $evaluacion->impacto_social_centro_puntaje = $evaluacion->servicioTecnologicoEvaluacion->impacto_social_centro_puntaje;
                $evaluacion->impacto_social_productivo_puntaje = $evaluacion->servicioTecnologicoEvaluacion->impacto_social_productivo_puntaje;
                $evaluacion->impacto_tecnologico_puntaje = $evaluacion->servicioTecnologicoEvaluacion->impacto_tecnologico_puntaje;
                $evaluacion->objetivo_general_puntaje = $evaluacion->servicioTecnologicoEvaluacion->objetivo_general_puntaje;
                $evaluacion->primer_objetivo_puntaje = $evaluacion->servicioTecnologicoEvaluacion->primer_objetivo_puntaje;
                $evaluacion->segundo_objetivo_puntaje = $evaluacion->servicioTecnologicoEvaluacion->segundo_objetivo_puntaje;
                $evaluacion->tercer_objetivo_puntaje = $evaluacion->servicioTecnologicoEvaluacion->tercer_objetivo_puntaje;
                $evaluacion->cuarto_objetivo_puntaje = $evaluacion->servicioTecnologicoEvaluacion->cuarto_objetivo_puntaje;
                $evaluacion->resultados_primer_obj_puntaje = $evaluacion->servicioTecnologicoEvaluacion->resultados_primer_obj_puntaje;
                $evaluacion->resultados_segundo_obj_puntaje = $evaluacion->servicioTecnologicoEvaluacion->resultados_segundo_obj_puntaje;
                $evaluacion->resultados_tercer_obj_puntaje = $evaluacion->servicioTecnologicoEvaluacion->resultados_tercer_obj_puntaje;
                $evaluacion->resultados_cuarto_obj_puntaje = $evaluacion->servicioTecnologicoEvaluacion->resultados_cuarto_obj_puntaje;
                $evaluacion->metodologia_puntaje = $evaluacion->servicioTecnologicoEvaluacion->metodologia_puntaje;
                $evaluacion->actividades_primer_obj_puntaje = $evaluacion->servicioTecnologicoEvaluacion->actividades_primer_obj_puntaje;
                $evaluacion->actividades_segundo_obj_puntaje = $evaluacion->servicioTecnologicoEvaluacion->actividades_segundo_obj_puntaje;
                $evaluacion->actividades_tercer_obj_puntaje = $evaluacion->servicioTecnologicoEvaluacion->actividades_tercer_obj_puntaje;
                $evaluacion->actividades_cuarto_obj_puntaje = $evaluacion->servicioTecnologicoEvaluacion->actividades_cuarto_obj_puntaje;
                $evaluacion->productos_primer_obj_puntaje = $evaluacion->servicioTecnologicoEvaluacion->productos_primer_obj_puntaje;
                $evaluacion->productos_segundo_obj_puntaje = $evaluacion->servicioTecnologicoEvaluacion->productos_segundo_obj_puntaje;
                $evaluacion->productos_tercer_obj_puntaje = $evaluacion->servicioTecnologicoEvaluacion->productos_tercer_obj_puntaje;
                $evaluacion->productos_cuarto_obj_puntaje = $evaluacion->servicioTecnologicoEvaluacion->productos_cuarto_obj_puntaje;

                $evaluacion->riesgos_objetivo_general_puntaje = $evaluacion->servicioTecnologicoEvaluacion->riesgos_objetivo_general_puntaje;
                $evaluacion->riesgos_productos_puntaje = $evaluacion->servicioTecnologicoEvaluacion->riesgos_productos_puntaje;
                $evaluacion->riesgos_actividades_puntaje = $evaluacion->servicioTecnologicoEvaluacion->riesgos_actividades_puntaje;

                break;
            default:
                break;
        }

        return Inertia::render('Convocatorias/Evaluaciones/Summary', [
            'convocatoria' => $convocatoria->only('id', 'esta_activa', 'fase_formateada', 'fase', 'tipo_convocatoria', 'min_fecha_inicio_proyectos', 'max_fecha_finalizacion_proyectos', 'finalizado'),
            'evaluacion'   => $evaluacion,
            'proyecto'     => $evaluacion->proyecto->only('id', 'precio_proyecto', 'codigo_linea_programatica', 'logs', 'finalizado', 'modificable', 'habilitado_para_evaluar'),
            'versiones'    => $evaluacion->proyecto->PdfVersiones,
        ]);
    }

    /**
     * Finalizar evaluación.
     *
     * @param  \App\Models\Proyecto  $proyecto
     * @return \Illuminate\Http\Response
     */
    public function finalizarEvaluacion(Request $request, Convocatoria $convocatoria, Evaluacion $evaluacion)
    {
        /** @var \App\Models\User */
        $authUser = Auth::user();

        if (!Hash::check($request->password, $authUser->password)) {
            return back()
                ->withErrors(['password' => __('The password is incorrect.')]);
        }

        $evaluacion->iniciado = false;
        $evaluacion->finalizado = true;
        $evaluacion->modificable = false;
        $evaluacion->save();

        $evaluacion->proyecto()->update(['estado' => $evaluacion->proyecto->estado_evaluacion_idi ?? $evaluacion->proyecto->estado_evaluacion_cultura_innovacion ?? $evaluacion->proyecto->estado_evaluacion_ta ?? $evaluacion->proyecto->estado_evaluacion_tp ?? $evaluacion->proyecto->estado_evaluacion_servicios_tecnologicos]);

        $authUser->notify(new EvaluacionFinalizada($convocatoria, $evaluacion->proyecto));

        return back()->with('success', 'La evaluación ha sido finalizada correctamente.');
    }

    public function preguntasFinales(Request $request, Convocatoria $convocatoria, Evaluacion $evaluacion)
    {
        if ($evaluacion->idiEvaluacion()->exists()) {
            $evaluacion->idiEvaluacion()->update([
                'impacto_sector_agricola'       => $request->tieneImpactoSectorAgricola ?  $request->impacto_sector_agricola : '',
                'impacto_poblacion_campesina'   => $request->tieneImpactoPoblacionCampesina ? $request->impacto_poblacion_campesina : '',
            ]);
            return back()->with('success', 'Se ha guardado la información correctamente.');
        }

        return back()->with('error', 'No se ha podigo guardar.');
    }


    /**
     * Enviar el proyecto al dinamizador a cargo.
     *
     * @param  \App\Models\Proyecto  $proyecto
     * @return \Illuminate\Http\Response
     */
    public function finalizarProyecto(Request $request, Convocatoria $convocatoria, Proyecto $proyecto)
    {
        $this->authorize('visualizar-proyecto-autor', [$proyecto]);

        /** @var \App\Models\User */
        $authUser = Auth::user();

        if (!Hash::check($request->password, $authUser->password)) {
            return back()
                ->withErrors(['password' => __('The password is incorrect.')]);
        }

        $proyecto->modificable = false;
        $proyecto->finalizado = true;
        $proyecto->save();

        $proyecto->centroFormacion->dinamizadorSennova->notify(new ProyectoFinalizado($convocatoria, $proyecto));

        $version = $proyecto->codigo . '-PDF-' . \Carbon\Carbon::now()->format('YmdHis');
        $proyecto->PdfVersiones()->save(new ProyectoPdfVersion(['version' => $version]));

        return back()->with('success', 'Se ha finalizado el proyecto correctamente.');
    }

    /**
     * Enviar proyecto a evaluación.
     *
     * @param  \App\Models\Proyecto  $proyecto
     * @return \Illuminate\Http\Response
     */
    public function enviarAEvaluacion(Request $request, Convocatoria $convocatoria, Proyecto $proyecto)
    {
        $this->authorize('validar-dinamizador', [$proyecto]);

        /** @var \App\Models\User */
        $authUser = Auth::user();

        if (!Hash::check($request->password, $authUser->password)) {
            return back()
                ->withErrors(['password' => __('The password is incorrect.')]);
        }

        $proyecto->habilitado_para_evaluar = true;
        $proyecto->finalizado = true;
        $proyecto->modificable = false;
        $proyecto->save();

        $user = $proyecto->participantes()->where('es_formulador', true)->first();
        $user->notify(new ProyectoConfirmado($proyecto, $authUser));

        return back()->with('success', 'Se ha confirmado el proyecto correctamente.');
    }

    /**
     * El dinamizador devuelve el proyecto al proponente con algún comentario.
     *
     * @param  \App\Models\Proyecto  $proyecto
     * @return \Illuminate\Http\Response
     */
    public function devolverProyecto(Request $request, Convocatoria $convocatoria, Proyecto $proyecto)
    {
        $this->authorize('validar-dinamizador', [$proyecto]);

        $proyecto->habilitado_para_evaluar = false;
        $proyecto->finalizado = false;
        $proyecto->modificable = true;
        $proyecto->save();

        $user = $proyecto->participantes()->where('es_formulador', true)->first();
        $user->notify(new ComentarioProyecto($convocatoria, $proyecto, $request->comentario));

        return back()->with('success', 'Se ha notificado al proponente.');
    }

    /**
     * participantes
     *
     * @param  mixed $convocatoria
     * @param  mixed $proyecto
     * @return void
     */
    public function participantes(Convocatoria $convocatoria, Proyecto $proyecto)
    {
        $this->authorize('visualizar-proyecto-autor', $proyecto);

        $proyecto->codigo_linea_programatica = $proyecto->lineaProgramatica->codigo;
        $proyecto->participantes;
        $proyecto->programasFormacion;
        $proyecto->semillerosInvestigacion;
        $proyecto->PdfVersiones;

        if ($proyecto->codigo_linea_programatica == 70) {
            return redirect()->route('convocatorias.ta.edit', [$convocatoria, $proyecto])->with('error', 'Esta línea programática no requiere de participantes');
        } else if ($proyecto->codigo_linea_programatica == 69) {
            return redirect()->route('convocatorias.tp.edit', [$convocatoria, $proyecto])->with('error', 'Esta línea programática no requiere de participantes');
        }

        $proyecto->load('participantes.centroFormacion.regional');
        $proyecto->load('semillerosInvestigacion.lineaInvestigacion.grupoInvestigacion');

        return Inertia::render('Convocatorias/Proyectos/Participantes/Index', [
            'convocatoria'                  => $convocatoria,
            'proyecto'                      => $proyecto->only('id', 'codigo_linea_programatica', 'precio_proyecto', 'modificable', 'diff_meses', 'participantes', 'semillerosInvestigacion', 'mostrar_recomendaciones', 'PdfVersiones', 'all_files', 'allowed', 'fecha_inicio', 'fecha_finalizacion', 'tipo_proyecto'),
            'rolesSennova'                  => RolSennova::select('id as value', 'nombre as label')->orderBy('nombre', 'ASC')->get(),
            'nuevoParticipante'             => User::select('users.id', 'users.nombre', 'users.email', 'users.centro_formacion_id')->with('centroFormacion', 'centroFormacion.regional')->orderBy('users.nombre', 'ASC')->filterUser(request()->only('search'))->first(),
            'nuevoSemilleroInvestigacion'   => SemilleroInvestigacion::select('semilleros_investigacion.id', 'semilleros_investigacion.nombre', 'semilleros_investigacion.linea_investigacion_id')->with('lineaInvestigacion', 'lineaInvestigacion.grupoInvestigacion')->orderBy('semilleros_investigacion.nombre', 'ASC')->filterSemilleroInvestigacion(request()->only('search'))->first(),
            'centrosFormacion'              => SelectHelper::centrosFormacion(),
            'autorPrincipal'                => $proyecto->participantes()->where('proyecto_participantes.es_formulador', true)->first(),
        ]);
    }

    /**
     * participantesEvaluacion
     *
     * @param  mixed $convocatoria
     * @param  mixed $evaluacion
     * @return void
     */
    public function participantesEvaluacion(Convocatoria $convocatoria, Evaluacion $evaluacion)
    {
        $this->authorize('visualizar-evaluacion-autor', $evaluacion);

        $evaluacion->proyecto->codigo_linea_programatica = $evaluacion->proyecto->lineaProgramatica->codigo;
        $evaluacion->proyecto->participantes;
        $evaluacion->proyecto->programasFormacion;
        $evaluacion->proyecto->semillerosInvestigacion;

        if ($evaluacion->proyecto->codigo_linea_programatica == 70) {
            return back()->with('error', 'Esta línea programática no requiere de participantes');
        }

        if ($evaluacion->proyecto->codigo_linea_programatica == 23 || $evaluacion->proyecto->codigo_linea_programatica == 65 || $evaluacion->proyecto->codigo_linea_programatica == 66 || $evaluacion->proyecto->codigo_linea_programatica == 82) {
            $rolesSennova = collect(json_decode(Storage::get('json/roles-sennova-idi.json'), true));
        } elseif ($evaluacion->proyecto->codigo_linea_programatica == 70) {
            $rolesSennova = collect(json_decode(Storage::get('json/roles-sennova-ta.json'), true));
        } elseif ($evaluacion->proyecto->codigo_linea_programatica == 69) {
            $rolesSennova = collect(json_decode(Storage::get('json/roles-sennova-tp.json'), true));
        } elseif ($evaluacion->proyecto->codigo_linea_programatica == 68) {
            $rolesSennova = collect(json_decode(Storage::get('json/roles-sennova-st.json'), true));
        }

        $evaluacion->proyecto->load('participantes.centroFormacion.regional');
        $evaluacion->proyecto->load('semillerosInvestigacion.lineaInvestigacion.grupoInvestigacion');

        return Inertia::render('Convocatorias/Evaluaciones/Participantes/Index', [
            'convocatoria'          => $convocatoria,
            'evaluacion'            => $evaluacion->only('id'),
            'proyecto'              => $evaluacion->proyecto->only('id', 'codigo_linea_programatica', 'precio_proyecto', 'finalizado', 'diff_meses', 'participantes', 'semillerosInvestigacion'),
            'tiposDocumento'        => json_decode(Storage::get('json/tipos-documento.json'), true),
            'tiposVinculacion'      => json_decode(Storage::get('json/tipos-vinculacion.json'), true),
            'roles'                 => $rolesSennova,
        ]);
    }

    /**
     * linkParticipante
     *
     * @param  mixed $request
     * @param  mixed $convocatoria
     * @param  mixed $proyecto
     * @return void
     */
    public function linkParticipante(ProponenteRequest $request, Convocatoria $convocatoria, Proyecto $proyecto)
    {
        $this->authorize('modificar-proyecto-autor', [$proyecto]);

        $data = $request->only('cantidad_horas', 'cantidad_meses', 'rol_sennova');

        if ($proyecto->participantes()->where('proyecto_participantes.user_id', $request->user_id)->exists()) {
            return back()->with('error', 'El recurso ya está vinculado.');
        }

        $proyecto->participantes()->attach($request->user_id, $data);
        return back()->with('success', 'El recurso se ha vinculado correctamente.');
    }

    /**
     * unlinkParticipante
     *
     * @param  mixed $request
     * @param  mixed $convocatoria
     * @param  mixed $proyecto
     * @return void
     */
    public function unlinkParticipante( Convocatoria $convocatoria, Proyecto $proyecto, User $user)
    {
        $this->authorize('modificar-proyecto-autor', [$proyecto]);

        try {
            if ($proyecto->participantes()->where('user_id', $user->id)->exists()) {
                $proyecto->participantes()->detach($user->id);
                return back()->with('success', 'El recurso se ha desvinculado correctamente.');
            }
            return back()->with('success', 'El recurso ya está desvinculado.');
        } catch (\Throwable $th) {
            return back()->with('error', 'Oops! Algo salió mal.');
        }
        return back()->with('error', 'Oops! Algo salió mal.');
    }

    /**
     * updateParticipante
     *
     * @param  mixed $request
     * @param  mixed $convocatoria
     * @param  mixed $proyecto
     * @return void
     */
    public function updateParticipante(ProponenteRequest $request, Convocatoria $convocatoria, Proyecto $proyecto)
    {
        $this->authorize('modificar-proyecto-autor', [$proyecto]);

        try {
            $participante = $proyecto->participantes()->where('users.id', $request->user_id)->first();

            if ($participante) {
                $proyecto->participantes()
                    ->updateExistingPivot($request->user_id, ['rol_sennova' => $request->rol_sennova, 'cantidad_meses' => $request->cantidad_meses, 'cantidad_horas' => $request->cantidad_horas]);

                return back()->with('success', 'El recurso se ha actualizado correctamente.');
            }
        } catch (\Throwable $th) {
            return back()->with('error', 'Oops! Algo salió mal.');
        }

        return back()->with('error', 'Oops! Algo salió mal.');
    }

    /**
     * linkSemilleroInvestigacion
     *
     * @param  mixed $convocatoria
     * @param  mixed $proyecto
     * @return void
     */
    public function linkSemilleroInvestigacion(Convocatoria $convocatoria, Proyecto $proyecto, SemilleroInvestigacion $semilleroInvestigacion)
    {
        $this->authorize('modificar-proyecto-autor', [$proyecto]);

        try {
            if ($proyecto->semillerosInvestigacion()->where('semilleros_investigacion.id', $semilleroInvestigacion->id)->exists()) {
                return back()->with('error', 'El recurso ya está vinculado.');
            }
            $proyecto->semillerosInvestigacion()->attach($semilleroInvestigacion->id);
            return back()->with('success', 'El recurso se ha vinculado correctamente.');
        } catch (\Throwable $th) {
            dd($th);
            return back()->with('error', 'Oops! Algo salió mal.');
        }

        return back()->with('error', 'Oops! Algo salió mal.');
    }

    /**
     * unlinkSemilleroInvestigacion
     *
     * @param  mixed $convocatoria
     * @param  mixed $proyecto
     * @return void
     */
    public function unlinkSemilleroInvestigacion(Convocatoria $convocatoria, Proyecto $proyecto, SemilleroInvestigacion $semilleroInvestigacion)
    {
        $this->authorize('modificar-proyecto-autor', [$proyecto]);

        try {
            if ($proyecto->semillerosInvestigacion()->where('semilleros_investigacion.id', $semilleroInvestigacion->id)->exists()) {
                $proyecto->semillerosInvestigacion()->detach($semilleroInvestigacion->id);
                return back()->with('success', 'El recurso se ha desvinculado correctamente.');
            }
            return back()->with('success', 'El recurso ya está desvinculado.');
        } catch (\Throwable $th) {
            return back()->with('error', 'Oops! Algo salió mal.');
        }
        return back()->with('error', 'Oops! Algo salió mal.');
    }

    /**
     * filterProgramasFormacion
     *
     * @param  mixed $request
     * @param  mixed $convocatoria
     * @param  mixed $proyecto
     * @return void
     */
    public function filterProgramasFormacion(Request $request, Convocatoria $convocatoria, Proyecto $proyecto)
    {
        if (!empty($request->search_programa_formacion)) {
            $query = ProgramaFormacion::select('programas_formacion.id', 'programas_formacion.nombre', 'programas_formacion.codigo', 'programas_formacion.modalidad', 'programas_formacion.centro_formacion_id')->orderBy('programas_formacion.nombre', 'ASC')
                ->filterProgramaFormacion(['search' => $request->search_programa_formacion])
                ->with('centroFormacion.regional');

            if ($proyecto->programasFormacion->count() > 0) {
                $query->whereNotIn('programas_formacion.id', explode(',', $proyecto->programasFormacion->implode('id', ',')));
            }

            $programasFormacion = $query->get()->take(5);

            return $programasFormacion->makeHidden('created_at', 'updated_at')->toJson();
        }

        return null;
    }

    /**
     * linkProgramaFormacion
     *
     * @param  mixed $request
     * @param  mixed $convocatoria
     * @param  mixed $proyecto
     * @return void
     */
    public function linkProgramaFormacion(Request $request, Convocatoria $convocatoria, Proyecto $proyecto)
    {
        $this->authorize('modificar-proyecto-autor', [$proyecto]);

        $request->validate(['programa_formacion_id' => 'required']);

        try {
            if ($proyecto->programasFormacion()->where('id', $request->programa_formacion_id)->exists()) {
                return back()->with('error', 'El recurso ya está vinculado.');
            }
            $proyecto->programasFormacion()->attach($request->programa_formacion_id);
            return back()->with('success', 'El recurso se ha vinculado correctamente.');
        } catch (\Throwable $th) {
            return back()->with('error', 'Oops! Algo salió mal.');
        }

        return back()->with('error', 'Oops! Algo salió mal.');
    }

    /**
     * unlinkProgramaFormacion
     *
     * @param  mixed $request
     * @param  mixed $convocatoria
     * @param  mixed $proyecto
     * @return void
     */
    public function unlinkProgramaFormacion(Request $request, Convocatoria $convocatoria, Proyecto $proyecto)
    {
        $this->authorize('modificar-proyecto-autor', [$proyecto]);

        $request->validate(['programa_formacion_id' => 'required']);

        try {
            if ($proyecto->programasFormacion()->where('id', $request->programa_formacion_id)->exists()) {
                $proyecto->programasFormacion()->detach($request->programa_formacion_id);
                return back()->with('success', 'El recurso se ha desvinculado correctamente.');
            }
            return back()->with('success', 'El recurso ya está desvinculado.');
        } catch (\Throwable $th) {
            return back()->with('error', 'Oops! Algo salió mal.');
        }
        return back()->with('error', 'Oops! Algo salió mal.');
    }

    /**
     * downloadManualUsuario
     *
     * @param  mixed $convocatoria
     * @param  mixed $proyecto
     * @param  mixed $proyectoAnexo
     * @return void
     */
    public function downloadManualUsuario()
    {
        return response()->download(storage_path("app/manual-usuario/Manual_de_usuario.pdf"));
    }

    /**
     * storeProgramaFormacion
     *
     * @param  mixed $request
     * @param  mixed $convocatoria
     * @param  mixed $proyecto
     * @return void
     */
    public function storeProgramaFormacion(ProgramaFormacionRequest $request, Convocatoria $convocatoria, Proyecto $proyecto)
    {
        $this->authorize('modificar-proyecto-autor', [$proyecto]);

        $programaFormacion = new ProgramaFormacion();
        $programaFormacion->nombre              = $request->nombre;
        $programaFormacion->codigo              = $request->codigo;
        $programaFormacion->modalidad           = $request->modalidad;
        $programaFormacion->nivel_formacion     = $request->nivel_formacion;
        $programaFormacion->centroFormacion()->associate($request->centro_formacion_id);

        $programaFormacion->save();

        if ($proyecto->ta()->exists()) {
            $proyecto->taProgramasFormacion()->attach($programaFormacion);
        }

        return back()->with('success', 'El recurso se ha creado correctamente.');
    }

    /**
     * descargarPdf
     *
     * @param  mixed $convocatoria
     * @param  mixed $proyecto
     * @param  mixed $version
     * @return void
     */
    public function descargarPdf(Convocatoria $convocatoria, Proyecto $proyecto, $version)
    {
        return response()->download(storage_path("app/convocatorias/" . $convocatoria->id . "/" . $proyecto->id . "/" . $version . ".pdf"));
    }

    /**
     * showComentariosGeneralesForm
     *
     * @param  mixed $convocatoria
     * @param  mixed $evaluacion
     * @return void
     */
    public function showComentariosGeneralesForm(Convocatoria $convocatoria, Proyecto $proyecto)
    {
        $this->authorize('visualizar-proyecto-autor', $proyecto);

        $proyecto->codigo_linea_programatica = $proyecto->lineaProgramatica->codigo;

        if ($proyecto->codigo_linea_programatica == 65) {
            $proyecto->tipo_proyecto = $proyecto->culturaInnovacion->tipo_proyecto;
        }

        $proyecto->evaluaciones->load('evaluacionCausalesRechazo');

        $proyecto->PdfVersiones;
        $proyecto->all_files;

        return Inertia::render('Convocatorias/Proyectos/ComentariosGenerales', [
            'convocatoria'                  => $convocatoria->only('id', 'esta_activa', 'fase_formateada', 'fase', 'tipo_convocatoria'),
            'evaluaciones'                  => $proyecto->evaluaciones,
            'proyecto'                      => $proyecto,
        ]);
    }

    /**
     * udpdateComentariosGenerales
     *
     * @param  mixed $convocatoria
     * @param  mixed $evaluacion
     * @return void
     */
    public function udpdateComentariosGenerales(Request $request, Convocatoria $convocatoria, $evaluacion)
    {
        $evaluacion = Evaluacion::find($evaluacion);

        $this->authorize('modificar-proyecto-autor', $evaluacion->proyecto);

        $evaluacion->update(
            ['evaluacion_id' => $evaluacion->id, 'replicas' => $request->replicas],
        );

        return back()->with('success', 'El recurso se ha actualizado correctamente.');
    }

    /**
     * udpdateEstadosProyectos
     *
     * @param  mixed $request
     * @return void
     */
    public function udpdateEstadosProyectos(Request $request)
    {
        $proyectosId = collect([]);
        collect(json_decode($request->proyectos_id))->pluck('value')->map(function ($item) use ($proyectosId) {
            return $proyectosId->push($item - 8000);
        });

        $proyectos = Proyecto::whereIn('id', $proyectosId)->get();

        if ($request->estado == 1) { // Subsanar
            foreach ($proyectos as $proyecto) {
                $proyecto->update(['estado' => $proyecto->estado_evaluacion_idi ?? $proyecto->estado_evaluacion_cultura_innovacion ?? $proyecto->estado_evaluacion_ta ?? $proyecto->estado_evaluacion_tp ?? $proyecto->estado_evaluacion_servicios_tecnologicos]);
                sleep(2);

                $proyecto->update(
                    [
                        'modificable'                   => true,
                        'mostrar_recomendaciones'       => true,
                        'mostrar_requiere_subsanacion'  => true,
                        'habilitado_para_evaluar'       => false,
                        'en_evaluacion'                 => false,
                        'finalizado'                    => false,
                        'estado'                        => DB::raw("estado::jsonb || '{\"requiereSubsanar\":true}'"),
                        'estado_cord_sennova'           => DB::raw("'{\"estado\": \"$request->estado_cord_sennova\"}'")
                    ]
                );
            }

            Evaluacion::whereIn('proyecto_id', $proyectosId)->where('habilitado', true)->update(['modificable' => false, 'finalizado' => true, 'iniciado' => false]);
        } else if ($request->estado == 2) { // Finalizar
            foreach ($proyectos as $proyecto) {
                $proyecto->update(['estado' => $proyecto->estado_evaluacion_idi ?? $proyecto->estado_evaluacion_cultura_innovacion ?? $proyecto->estado_evaluacion_ta ?? $proyecto->estado_evaluacion_tp ?? $proyecto->estado_evaluacion_servicios_tecnologicos]);

                sleep(2);
                $proyecto->update(
                    [
                        'modificable'                   => false,
                        'mostrar_recomendaciones'       => true,
                        'mostrar_requiere_subsanacion'  => true,
                        'habilitado_para_evaluar'       => false,
                        'en_evaluacion'                 => false,
                        'finalizado'                    => true,
                        'estado'                        => DB::raw("estado::jsonb || '{\"requiereSubsanar\":false}'"),
                        'estado_cord_sennova'           => DB::raw("'{\"estado\": \"$request->estado_cord_sennova\"}'")
                    ]
                );
            }
        } else if ($request->estado == 3) { // Evaluar
            foreach ($proyectos as $proyecto) {
                $proyecto->update(['estado' => $proyecto->estado_evaluacion_idi ?? $proyecto->estado_evaluacion_cultura_innovacion ?? $proyecto->estado_evaluacion_ta ?? $proyecto->estado_evaluacion_tp ?? $proyecto->estado_evaluacion_servicios_tecnologicos]);

                sleep(2);
                $proyecto->update(
                    [
                        'modificable'                   => false,
                        'mostrar_recomendaciones'       => false,
                        'mostrar_requiere_subsanacion'  => false,
                        'habilitado_para_evaluar'       => true,
                        'en_evaluacion'                 => true,
                        'finalizado'                    => true,
                        'estado_cord_sennova'           => DB::raw("'{\"estado\": \"$request->estado_cord_sennova\"}'")
                    ]
                );
            }

            Evaluacion::whereIn('proyecto_id', $proyectosId)->where('habilitado', true)->update(['modificable' => true, 'finalizado' => false, 'iniciado' => true]);
        }

        return back()->with('success', 'El recurso se ha actualizado correctamente.');
    }

    public function cambiarAutorPrincipal(Convocatoria $convocatoria, Proyecto $proyecto, $integrante)
    {
        DB::table('proyecto_participantes')->where('proyecto_participantes.proyecto_id', $proyecto->id)->where('proyecto_participantes.es_formulador', true)->update(['proyecto_participantes.es_formulador' => null]);
        DB::table('proyecto_participantes')->where('proyecto_participantes.proyecto_id', $proyecto->id)->where('proyecto_participantes.user_id', $integrante)->update(['proyecto_participantes.es_formulador' => true]);

        return back()->with('success', 'Se ha actualizado correctamente el autor principal.');
    }


    public function actualizarEstadosTodosProyectos(Request $request)
    {
        $proyectos = Proyecto::where('convocatoria_id', $request->convocatoria_id)->get();
        foreach ($proyectos as $proyecto) {
            $proyecto->update(['estado' => $proyecto->estado_evaluacion_idi ?? $proyecto->estado_evaluacion_cultura_innovacion ?? $proyecto->estado_evaluacion_ta ?? $proyecto->estado_evaluacion_tp ?? $proyecto->estado_evaluacion_servicios_tecnologicos]);
        }

        return back()->with('success', 'Se han actualizado los estados de los proyectos correctamente.');
    }
}
