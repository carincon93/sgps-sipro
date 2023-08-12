<?php

namespace App\Http\Controllers;

use App\Helpers\SelectHelper;
use App\Http\Requests\CadenaValorColumnRequest;
use App\Http\Requests\ProgramaFormacionRequest;
use App\Http\Requests\ProponenteRequest;
use App\Http\Traits\ProyectoValidationTrait;
use App\Models\Convocatoria;
use App\Models\Evaluacion\Evaluacion;
use App\Models\User;
use App\Models\ProgramaFormacion;
use App\Models\Proyecto;
use App\Models\SemilleroInvestigacion;
use App\Models\ProyectoPdfVersion;
use App\Models\RolSennova;
use App\Notifications\ComentarioProyecto;
use App\Notifications\EvaluacionFinalizada;
use App\Notifications\ProyectoConfirmado;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
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
            'proyectos'   => Proyecto::selectRaw("id as value, concat('SGPS-', id + 8000, '-SIPRO') as label")->with('proyectosLinea66', 'proyectosLinea70', 'proyectosLinea69', 'proyectosLinea68', 'proyectosLinea65')->orderBy('id', 'ASC')->get(),
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

        $proyecto->update(['estado' => $proyecto->estado_evaluacion_idi ?? $proyecto->estado_evaluacion_proyecto_formulario_1_linea_65 ?? $proyecto->estado_evaluacion_ta ?? $proyecto->estado_evaluacion_tp ?? $proyecto->estado_evaluacion_proyecto_formulario_12_linea_68]);

        if ($request->subsanacion == true) {
            $request->merge(['subsanacion' => $request->subsanacion ? 'true' : 'false']) ;
            $proyecto->update(['estado' => $proyecto->estado]);
            sleep(2);
            $proyecto->update(
                [
                    'estado' => DB::raw("estado::jsonb || '{\"requiereSubsanar\":$request->subsanacion}'")
                ]
            );
        }

        if ($request->estado_cord_sennova) {
            $request->merge(['subsanacion' => $request->subsanacion ? 'true' : 'false']) ;
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

        $proyecto->load('evaluaciones.evaluacionProyectoLinea66');
        $proyecto->load('evaluaciones.evaluacionProyectoFormulario4Linea70');

        $proyecto->proyectoFormulario10Linea69;

        if ($proyecto->proyectoLinea66()->exists()) {
            $objetivo_general = $proyecto->proyectoLinea66->objetivo_general;
            $proyecto->propuesta_sostenibilidad = $proyecto->proyectoLinea66->propuesta_sostenibilidad;
        }

        if ($proyecto->proyectoFormulario4Linea70()->exists()) {
            $objetivo_general = $proyecto->proyectoFormulario4Linea70->objetivo_general;
            $proyecto->propuesta_sostenibilidad_social      = $proyecto->proyectoFormulario4Linea70->propuesta_sostenibilidad_social;
            $proyecto->propuesta_sostenibilidad_ambiental   = $proyecto->proyectoFormulario4Linea70->propuesta_sostenibilidad_ambiental;
            $proyecto->propuesta_sostenibilidad_financiera  = $proyecto->proyectoFormulario4Linea70->propuesta_sostenibilidad_financiera;
        }

        if ($proyecto->proyectoLinea69()->exists()) {
            $objetivo_general = $proyecto->proyectoLinea69->objetivo_general;
            $proyecto->propuesta_sostenibilidad = $proyecto->proyectoLinea69->propuesta_sostenibilidad;
        }

        if ($proyecto->proyectoFormulario12Linea68()->exists()) {
            $objetivo_general = $proyecto->proyectoFormulario12Linea68->objetivo_general;
            $proyecto->propuesta_sostenibilidad = $proyecto->proyectoFormulario12Linea68->propuesta_sostenibilidad;
            $proyecto->propuesta_sostenibilidad = $proyecto->proyectoFormulario12Linea68->propuesta_sostenibilidad;
        }

        if ($proyecto->proyectoLinea65()->exists()) {
            $objetivo_general                   = $proyecto->proyectoLinea65->objetivo_general;
            $proyecto->propuesta_sostenibilidad = $proyecto->proyectoLinea65->propuesta_sostenibilidad;
            $proyecto->tipo_proyecto            = $proyecto->proyectoLinea65->tipo_proyecto;
        }

        if ($proyecto->proyectoFormulario11Linea83()->exists()) {
            $objetivo_general                   = $proyecto->proyectoFormulario11Linea83->objetivo_general;
            $proyecto->propuesta_sostenibilidad = $proyecto->proyectoFormulario11Linea83->propuesta_sostenibilidad;
        }

        $objetivos = collect([]);
        $productos = collect([]);

        foreach ($proyecto->causasDirectas as $causa_directa) {
            $objetivos->push(['descripcion' => $causa_directa->objetivoEspecifico->descripcion, 'numero' => $causa_directa->objetivoEspecifico->numero]);
        }

        foreach ($proyecto->efectosDirectos as $efecto_directo) {
            if ($efecto_directo->resultado) {
                foreach ($efecto_directo->resultado->productos as $producto) {
                    $productos->prepend(['v' => 'prod' . $producto->id,  'f' => $producto->nombre, 'fkey' =>  'Objetivo específico ' . $efecto_directo->resultado->objetivoEspecifico->numero, 'tootlip' => 'prod' . $producto->id, 'actividades' => $producto->actividades->load('proyectoRolesSennova.convocatoriaRolSennova.rolSennova')]);
                }
            }
        }

        return Inertia::render('Convocatorias/Proyectos/CadenaValor/Index', [
            'convocatoria'      => $convocatoria->only('id', 'esta_activa', 'fase_formateada', 'fase', 'tipo_convocatoria', 'tipo_convocatoria', 'mostrar_recomendaciones'),
            'proyecto'          => $proyecto,
            'evaluacion'        => Evaluacion::find(request()->evaluacion_id),
            'productos'         => $productos,
            'objetivos'         => $objetivos,
            'objetivo_general'  => $objetivo_general ?? '',
        ]);
    }

    public function updateCadenaValorLongColumn(CadenaValorColumnRequest $request, Convocatoria $convocatoria, Proyecto $proyecto, $column)
    {
        $this->authorize('modificar-proyecto-autor', [$proyecto]);

        switch ($proyecto->tipo_formulario_convocatoria_id) {
            case 1:
                $proyecto->proyectoLinea65()->update($request->only($column));
                break;
            case 4:
                $proyecto->proyectoFormulario4Linea70()->update($request->only($column));
                break;
            case 5:
                $proyecto->proyectoLinea69()->update($request->only($column));
                break;
            case 6:
            case 7:
            case 8:
            case 9:
                $proyecto->proyectoLinea66()->update($request->only($column));
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
            case $evaluacion->evaluacionProyectoLinea66()->exists():
                $evaluacion->evaluacionProyectoLinea66()->update([
                    'cadena_valor_puntaje'      => $request->cadena_valor_puntaje,
                    'cadena_valor_comentario'   => $request->cadena_valor_requiere_comentario == false ? $request->cadena_valor_comentario : null
                ]);
                break;
            case $evaluacion->evaluacionProyectoFormulario1Linea65()->exists():
                $evaluacion->evaluacionProyectoFormulario1Linea65()->update([
                    'cadena_valor_puntaje'      => $request->cadena_valor_puntaje,
                    'cadena_valor_comentario'   => $request->cadena_valor_requiere_comentario == false ? $request->cadena_valor_comentario : null
                ]);
                break;
            case $evaluacion->evaluacionProyectoFormulario4Linea70()->exists():
                $evaluacion->evaluacionProyectoFormulario4Linea70()->update([
                    'cadena_valor_comentario'   => $request->cadena_valor_requiere_comentario == false ? $request->cadena_valor_comentario : null
                ]);
                break;
            case $evaluacion->evaluacionProyectoFormulario5Linea69()->exists():
                $evaluacion->evaluacionProyectoFormulario5Linea69()->update([
                    'cadena_valor_comentario'   => $request->cadena_valor_requiere_comentario == false ? $request->cadena_valor_comentario : null
                ]);
                break;

            case $evaluacion->evaluacionProyectoFormulario12Linea68()->exists():
                $evaluacion->evaluacionProyectoFormulario12Linea68()->update([
                    'propuesta_sostenibilidad_puntaje'      => $request->propuesta_sostenibilidad_puntaje,
                    'propuesta_sostenibilidad_comentario'   => $request->propuesta_sostenibilidad_requiere_comentario == false ? $request->propuesta_sostenibilidad_comentario : null,

                    'impacto_ambiental_puntaje'             => $request->impacto_ambiental_puntaje,
                    'impacto_ambiental_comentario'          => $request->impacto_ambiental_requiere_comentario == false ? $request->impacto_ambiental_comentario : null,

                    'impacto_social_centro_puntaje'         => $request->impacto_social_centro_puntaje,
                    'impacto_social_centro_comentario'      => $request->impacto_social_centro_requiere_comentario == false ? $request->impacto_social_centro_comentario : null,

                    'impacto_social_productivo_puntaje'     => $request->impacto_social_productivo_puntaje,
                    'impacto_social_productivo_comentario'  => $request->impacto_social_productivo_requiere_comentario == false ? $request->impacto_social_productivo_comentario : null,

                    'impacto_tecnologico_puntaje'           => $request->impacto_tecnologico_puntaje,
                    'impacto_tecnologico_comentario'        => $request->impacto_social_productivo_requiere_comentario == false ? $request->impacto_tecnologico_comentario : null,
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
            case $proyecto->proyectoLinea66()->exists():
                $request->validate([
                    'propuesta_sostenibilidad' => 'required|string|max:40000',
                ]);
                $proyecto_linea_66                            = $proyecto->proyectoLinea66;
                $proyecto_linea_66->propuesta_sostenibilidad  = $request->propuesta_sostenibilidad;

                $proyecto_linea_66->save();
                break;
            case $proyecto->proyectoFormulario4Linea70()->exists():
                $request->validate([
                    'propuesta_sostenibilidad_social'       => 'required|string|max:40000',
                    'propuesta_sostenibilidad_ambiental'    => 'required|string|max:40000',
                    'propuesta_sostenibilidad_financiera'   => 'required|string|max:40000',
                ]);
                $proyecto_linea_70 = $proyecto->proyectoFormulario4Linea70;
                $proyecto_linea_70->propuesta_sostenibilidad_social        = $request->propuesta_sostenibilidad_social;
                $proyecto_linea_70->propuesta_sostenibilidad_ambiental     = $request->propuesta_sostenibilidad_ambiental;
                $proyecto_linea_70->propuesta_sostenibilidad_financiera    = $request->propuesta_sostenibilidad_financiera;

                $proyecto_linea_70->save();
                break;
            case $proyecto->proyectoLinea69()->exists():
                $request->validate([
                    'propuesta_sostenibilidad' => 'required|string|max:40000',
                ]);
                $proyecto_linea_69                           = $proyecto->proyectoLinea69;
                $proyecto_linea_69->propuesta_sostenibilidad = $request->propuesta_sostenibilidad;

                $proyecto_linea_69->save();
                break;
            case $proyecto->proyectoLinea65()->exists():
                $request->validate([
                    'propuesta_sostenibilidad' => 'required|string|max:40000',
                ]);
                $proyecto_linea_65                              = $proyecto->proyectoLinea65;
                $proyecto_linea_65->propuesta_sostenibilidad    = $request->propuesta_sostenibilidad;

                $proyecto_linea_65->save();
                break;
            case $proyecto->proyectoFormulario11Linea83()->exists():
                $request->validate([
                    'propuesta_sostenibilidad' => 'required|string|max:40000',
                ]);
                $proyecto_linea_83                              = $proyecto->proyectoFormulario11Linea83;
                $proyecto_linea_83->propuesta_sostenibilidad    = $request->propuesta_sostenibilidad;

                $proyecto_linea_83->save();
                break;
            case $proyecto->proyectoFormulario12Linea68()->exists():
                $request->validate([
                    'propuesta_sostenibilidad' => 'required|string|max:40000',
                ]);
                $proyecto_linea_68                            = $proyecto->proyectoFormulario12Linea68;
                $proyecto_linea_68->propuesta_sostenibilidad  = $request->propuesta_sostenibilidad;

                $proyecto_linea_68->save();
                break;
            default:
                break;
        }

        return back()->with('success', 'El recurso se ha guardado correctamente.');
    }


    public function redireccionar(Request $request, Convocatoria $convocatoria)
    {
        switch (request()->tipo_formulario_convocatoria_id) {
            case 1:
                return redirect()->route('convocatorias.proyectos-formulario-1-linea-65.index', [$convocatoria, 'tipo_formulario_convocatoria_id' => request()->tipo_formulario_convocatoria_id]);
                break;
            case 4:
                return redirect()->route('convocatorias.proyectos-formulario-4-linea-70.index', [$convocatoria, 'tipo_formulario_convocatoria_id' => request()->tipo_formulario_convocatoria_id]);
                break;
            case 5:
                return redirect()->route('convocatorias.proyectos-formulario-5-linea-69.index', [$convocatoria, 'tipo_formulario_convocatoria_id' => request()->tipo_formulario_convocatoria_id]);
                break;
            case 6:
            case 7:
            case 8:
            case 9:
                return redirect()->route('convocatorias.proyectos-linea-66.index', [$convocatoria, 'tipo_formulario_convocatoria_id' => request()->tipo_formulario_convocatoria_id]);
                break;
            case 11:
                return redirect()->route('convocatorias.proyectos-formulario-11-linea-83.index', [$convocatoria, 'tipo_formulario_convocatoria_id' => request()->tipo_formulario_convocatoria_id]);
                break;
            case 12:
                return redirect()->route('convocatorias.proyectos-formulario-12-linea-68.index', [$convocatoria, 'tipo_formulario_convocatoria_id' => request()->tipo_formulario_convocatoria_id]);
                break;
            default:
                break;
        }
    }

    /**
     * Proyecto
     *
     * @param  mixed $convocatoria
     * @param  mixed $proyecto
     * @return void
     */
    public function edit(Request $request, Convocatoria $convocatoria, Proyecto $proyecto)
    {
        switch ($proyecto) {
            case $proyecto->proyectoLinea66()->exists():
                return $request->evaluacion_id ? redirect()->route('convocatorias.proyectos-linea-66.edit', [$convocatoria, $proyecto, 'evaluacion_id' => $request->evaluacion_id]) : redirect()->route('convocatorias.proyectos-linea-66.edit', [$convocatoria, $proyecto]);
                break;
            case $proyecto->proyectoFormulario4Linea70()->exists():
                return $request->evaluacion_id ? redirect()->route('convocatorias.proyectos-formulario-4-linea-70.edit', [$convocatoria, $proyecto, 'evaluacion_id' => $request->evaluacion_id]) : redirect()->route('convocatorias.proyectos-formulario-4-linea-70.edit', [$convocatoria, $proyecto]);
                break;
            case $proyecto->proyectoLinea69()->exists():
                return $request->evaluacion_id ? redirect()->route('convocatorias.proyectos-formulario-5-linea-69.edit', [$convocatoria, $proyecto, 'evaluacion_id' => $request->evaluacion_id]) : redirect()->route('convocatorias.proyectos-formulario-5-linea-69.edit', [$convocatoria, $proyecto]);
                break;
            case $proyecto->proyectoFormulario10Linea69()->exists():
                return $request->evaluacion_id ? redirect()->route('convocatorias.proyectos-formulario-5-linea-69.edit', [$convocatoria, $proyecto, 'evaluacion_id' => $request->evaluacion_id]) : redirect()->route('convocatorias.proyectos-formulario-10-linea-69.edit', [$convocatoria, $proyecto]);
                break;
            case $proyecto->proyectoFormulario12Linea68()->exists():
                return $request->evaluacion_id ? redirect()->route('convocatorias.proyectos-formulario-12-linea-68.edit', [$convocatoria, $proyecto, 'evaluacion_id' => $request->evaluacion_id]) : redirect()->route('convocatorias.proyectos-formulario-12-linea-68.edit', [$convocatoria, $proyecto]);
                break;
            case $proyecto->proyectoLinea65()->exists():
                return $request->evaluacion_id ? redirect()->route('convocatorias.proyectos-formulario-1-linea-65.edit', [$convocatoria, $proyecto, 'evaluacion_id' => $request->evaluacion_id]) : redirect()->route('convocatorias.proyectos-formulario-1-linea-65.edit', [$convocatoria, $proyecto]);
                break;
            case $proyecto->proyectoFormulario11Linea83()->exists():
                return $request->evaluacion_id ? redirect()->route('convocatorias.proyectos-formulario-11-linea-83.edit', [$convocatoria, $proyecto, 'evaluacion_id' => $request->evaluacion_id]) : redirect()->route('convocatorias.proyectos-formulario-11-linea-83.edit', [$convocatoria, $proyecto]);
                break;
            default:
                break;
        }
    }

    /**
     * Show resumen final del proyecto.
     *
     * @param  \App\Models\Proyecto  $proyecto
     * @return \Illuminate\Http\Response
     */
    public function resumenFinal(Convocatoria $convocatoria, Proyecto $proyecto)
    {
        $this->authorize('visualizar-proyecto-autor', [$proyecto]);

        $proyecto->precio_proyecto = $proyecto->precioProyecto;

        if ($proyecto->proyectoLinea65()->exists()) {
            $proyecto->tipo_proyecto = $proyecto->proyectoLinea65->tipo_proyecto;
        }

        return Inertia::render('Convocatorias/Proyectos/ResumenFinal', [
            'convocatoria'                  => $convocatoria->only('id', 'esta_activa', 'fase_formateada', 'fase', 'tipo_convocatoria', 'min_fecha_inicio_proyectos', 'max_fecha_finalizacion_proyectos'),
            'proyecto'                      => $proyecto->only('id', 'tipo_formulario_convocatoria_id', 'precio_proyecto', 'finalizado', 'modificable', 'habilitado_para_evaluar', 'mostrar_recomendaciones', 'PdfVersiones', 'all_files', 'allowed', 'tipo_proyecto'),
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
            case $evaluacion->evaluacionProyectoLinea66()->exists():
                $evaluacion->titulo_puntaje             = $evaluacion->evaluacionProyectoLinea66->titulo_puntaje;
                $evaluacion->video_puntaje              = $evaluacion->evaluacionProyectoLinea66->video_puntaje;
                $evaluacion->resumen_puntaje            = $evaluacion->evaluacionProyectoLinea66->resumen_puntaje;
                $evaluacion->problema_central_puntaje   = $evaluacion->evaluacionProyectoLinea66->problema_central_puntaje;
                $evaluacion->objetivos_puntaje          = $evaluacion->evaluacionProyectoLinea66->objetivos_puntaje;
                $evaluacion->metodologia_puntaje        = $evaluacion->evaluacionProyectoLinea66->metodologia_puntaje;
                $evaluacion->entidad_aliada_puntaje     = $evaluacion->evaluacionProyectoLinea66->entidad_aliada_puntaje;
                $evaluacion->resultados_puntaje         = $evaluacion->evaluacionProyectoLinea66->resultados_puntaje;
                $evaluacion->productos_puntaje          = $evaluacion->evaluacionProyectoLinea66->productos_puntaje;
                $evaluacion->cadena_valor_puntaje       = $evaluacion->evaluacionProyectoLinea66->cadena_valor_puntaje;
                $evaluacion->analisis_riesgos_puntaje   = $evaluacion->evaluacionProyectoLinea66->analisis_riesgos_puntaje;
                $evaluacion->ortografia_puntaje         = $evaluacion->evaluacionProyectoLinea66->ortografia_puntaje;
                $evaluacion->redaccion_puntaje          = $evaluacion->evaluacionProyectoLinea66->redaccion_puntaje;
                $evaluacion->normas_apa_puntaje         = $evaluacion->evaluacionProyectoLinea66->normas_apa_puntaje;
                break;
            case $evaluacion->evaluacionProyectoFormulario1Linea65()->exists():
                $evaluacion->titulo_puntaje             = $evaluacion->evaluacionProyectoFormulario1Linea65->titulo_puntaje;
                $evaluacion->video_puntaje              = $evaluacion->evaluacionProyectoFormulario1Linea65->video_puntaje;
                $evaluacion->resumen_puntaje            = $evaluacion->evaluacionProyectoFormulario1Linea65->resumen_puntaje;
                $evaluacion->problema_central_puntaje   = $evaluacion->evaluacionProyectoFormulario1Linea65->problema_central_puntaje;
                $evaluacion->objetivos_puntaje          = $evaluacion->evaluacionProyectoFormulario1Linea65->objetivos_puntaje;
                $evaluacion->metodologia_puntaje        = $evaluacion->evaluacionProyectoFormulario1Linea65->metodologia_puntaje;
                $evaluacion->entidad_aliada_puntaje     = $evaluacion->evaluacionProyectoFormulario1Linea65->entidad_aliada_puntaje;
                $evaluacion->resultados_puntaje         = $evaluacion->evaluacionProyectoFormulario1Linea65->resultados_puntaje;
                $evaluacion->productos_puntaje          = $evaluacion->evaluacionProyectoFormulario1Linea65->productos_puntaje;
                $evaluacion->cadena_valor_puntaje       = $evaluacion->evaluacionProyectoFormulario1Linea65->cadena_valor_puntaje;
                $evaluacion->analisis_riesgos_puntaje   = $evaluacion->evaluacionProyectoFormulario1Linea65->analisis_riesgos_puntaje;
                $evaluacion->ortografia_puntaje         = $evaluacion->evaluacionProyectoFormulario1Linea65->ortografia_puntaje;
                $evaluacion->redaccion_puntaje          = $evaluacion->evaluacionProyectoFormulario1Linea65->redaccion_puntaje;
                $evaluacion->normas_apa_puntaje         = $evaluacion->evaluacionProyectoFormulario1Linea65->normas_apa_puntaje;
                break;
            case $evaluacion->evaluacionProyectoFormulario12Linea68()->exists():
                $evaluacion->titulo_puntaje = $evaluacion->evaluacionProyectoFormulario12Linea68->titulo_puntaje;
                $evaluacion->resumen_puntaje = $evaluacion->evaluacionProyectoFormulario12Linea68->resumen_puntaje;
                $evaluacion->antecedentes_puntaje = $evaluacion->evaluacionProyectoFormulario12Linea68->antecedentes_puntaje;
                $evaluacion->justificacion_problema_puntaje = $evaluacion->evaluacionProyectoFormulario12Linea68->justificacion_problema_puntaje;
                $evaluacion->pregunta_formulacion_problema_puntaje = $evaluacion->evaluacionProyectoFormulario12Linea68->pregunta_formulacion_problema_puntaje;
                $evaluacion->propuesta_sostenibilidad_puntaje = $evaluacion->evaluacionProyectoFormulario12Linea68->propuesta_sostenibilidad_puntaje;
                $evaluacion->identificacion_problema_puntaje = $evaluacion->evaluacionProyectoFormulario12Linea68->identificacion_problema_puntaje;
                $evaluacion->arbol_problemas_puntaje = $evaluacion->evaluacionProyectoFormulario12Linea68->arbol_problemas_puntaje;
                $evaluacion->impacto_ambiental_puntaje = $evaluacion->evaluacionProyectoFormulario12Linea68->impacto_ambiental_puntaje;
                $evaluacion->impacto_social_centro_puntaje = $evaluacion->evaluacionProyectoFormulario12Linea68->impacto_social_centro_puntaje;
                $evaluacion->impacto_social_productivo_puntaje = $evaluacion->evaluacionProyectoFormulario12Linea68->impacto_social_productivo_puntaje;
                $evaluacion->impacto_tecnologico_puntaje = $evaluacion->evaluacionProyectoFormulario12Linea68->impacto_tecnologico_puntaje;
                $evaluacion->objetivo_general_puntaje = $evaluacion->evaluacionProyectoFormulario12Linea68->objetivo_general_puntaje;
                $evaluacion->primer_objetivo_puntaje = $evaluacion->evaluacionProyectoFormulario12Linea68->primer_objetivo_puntaje;
                $evaluacion->segundo_objetivo_puntaje = $evaluacion->evaluacionProyectoFormulario12Linea68->segundo_objetivo_puntaje;
                $evaluacion->tercer_objetivo_puntaje = $evaluacion->evaluacionProyectoFormulario12Linea68->tercer_objetivo_puntaje;
                $evaluacion->cuarto_objetivo_puntaje = $evaluacion->evaluacionProyectoFormulario12Linea68->cuarto_objetivo_puntaje;
                $evaluacion->resultados_primer_obj_puntaje = $evaluacion->evaluacionProyectoFormulario12Linea68->resultados_primer_obj_puntaje;
                $evaluacion->resultados_segundo_obj_puntaje = $evaluacion->evaluacionProyectoFormulario12Linea68->resultados_segundo_obj_puntaje;
                $evaluacion->resultados_tercer_obj_puntaje = $evaluacion->evaluacionProyectoFormulario12Linea68->resultados_tercer_obj_puntaje;
                $evaluacion->resultados_cuarto_obj_puntaje = $evaluacion->evaluacionProyectoFormulario12Linea68->resultados_cuarto_obj_puntaje;
                $evaluacion->metodologia_puntaje = $evaluacion->evaluacionProyectoFormulario12Linea68->metodologia_puntaje;
                $evaluacion->actividades_primer_obj_puntaje = $evaluacion->evaluacionProyectoFormulario12Linea68->actividades_primer_obj_puntaje;
                $evaluacion->actividades_segundo_obj_puntaje = $evaluacion->evaluacionProyectoFormulario12Linea68->actividades_segundo_obj_puntaje;
                $evaluacion->actividades_tercer_obj_puntaje = $evaluacion->evaluacionProyectoFormulario12Linea68->actividades_tercer_obj_puntaje;
                $evaluacion->actividades_cuarto_obj_puntaje = $evaluacion->evaluacionProyectoFormulario12Linea68->actividades_cuarto_obj_puntaje;
                $evaluacion->productos_primer_obj_puntaje = $evaluacion->evaluacionProyectoFormulario12Linea68->productos_primer_obj_puntaje;
                $evaluacion->productos_segundo_obj_puntaje = $evaluacion->evaluacionProyectoFormulario12Linea68->productos_segundo_obj_puntaje;
                $evaluacion->productos_tercer_obj_puntaje = $evaluacion->evaluacionProyectoFormulario12Linea68->productos_tercer_obj_puntaje;
                $evaluacion->productos_cuarto_obj_puntaje = $evaluacion->evaluacionProyectoFormulario12Linea68->productos_cuarto_obj_puntaje;

                $evaluacion->riesgos_objetivo_general_puntaje = $evaluacion->evaluacionProyectoFormulario12Linea68->riesgos_objetivo_general_puntaje;
                $evaluacion->riesgos_productos_puntaje = $evaluacion->evaluacionProyectoFormulario12Linea68->riesgos_productos_puntaje;
                $evaluacion->riesgos_actividades_puntaje = $evaluacion->evaluacionProyectoFormulario12Linea68->riesgos_actividades_puntaje;

                break;
            default:
                break;
        }

        return Inertia::render('Convocatorias/Evaluaciones/Summary', [
            'convocatoria' => $convocatoria->only('id', 'esta_activa', 'fase_formateada', 'fase', 'tipo_convocatoria', 'min_fecha_inicio_proyectos', 'max_fecha_finalizacion_proyectos', 'finalizado'),
            'evaluacion'   => $evaluacion,
            'proyecto'     => $evaluacion->proyecto->only('id', 'precio_proyecto', 'finalizado', 'modificable', 'habilitado_para_evaluar'),
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
        $auth_user = Auth::user();

        if (!Hash::check($request->password, $auth_user->password)) {
            return back()
                ->withErrors(['password' => __('The password is incorrect.')]);
        }

        $evaluacion->iniciado = false;
        $evaluacion->finalizado = true;
        $evaluacion->modificable = false;
        $evaluacion->save();

        $evaluacion->proyecto()->update(['estado' => $evaluacion->proyecto->estado_evaluacion_idi ?? $evaluacion->proyecto->estado_evaluacion_proyecto_formulario_1_linea_65 ?? $evaluacion->proyecto->estado_evaluacion_ta ?? $evaluacion->proyecto->estado_evaluacion_tp ?? $evaluacion->proyecto->estado_evaluacion_proyecto_formulario_12_linea_68]);

        $auth_user->notify(new EvaluacionFinalizada($convocatoria, $evaluacion->proyecto));

        return back()->with('success', 'La evaluación ha sido finalizada correctamente.');
    }

    public function preguntasFinales(Request $request, Convocatoria $convocatoria, Evaluacion $evaluacion)
    {
        if ($evaluacion->evaluacionProyectoLinea66()->exists()) {
            $evaluacion->evaluacionProyectoLinea66()->update([
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
        $auth_user = Auth::user();

        // if (!Hash::check($request->password, $auth_user->password)) {
        //     return back()
        //         ->withErrors(['password' => __('The password is incorrect.')]);
        // }

        if ($request->finalizado) {
            $proyecto->update([
                'modificable' => false,
                'finalizado'  => true,
            ]);

            return back()->with('success', 'Se ha finalizado el proyecto correctamente.');
        } else if ($request->modificar) {
            $proyecto->update([
                'modificable' => true,
                'finalizado'  => false,
            ]);

            return back()->with('success', 'El proyecto puede ser modificado nuevamente.');
        }
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
        $auth_user = Auth::user();

        if (!Hash::check($request->password, $auth_user->password)) {
            return back()
                ->withErrors(['password' => __('The password is incorrect.')]);
        }

        $proyecto->habilitado_para_evaluar = true;
        $proyecto->finalizado = true;
        $proyecto->modificable = false;
        $proyecto->save();

        $user = $proyecto->participantes()->where('es_formulador', true)->first();
        $user->notify(new ProyectoConfirmado($proyecto, $auth_user));

        return back()->with('success', 'Se ha confirmado el proyecto correctamente.');
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

        $proyecto->participantes;
        $proyecto->programasFormacion;
        $proyecto->semillerosInvestigacion;

        if ($proyecto->codigo_linea_programatica == 70) {
            return redirect()->route('convocatorias.proyectos-formulario-4-linea-70.edit', [$convocatoria, $proyecto])->with('error', 'Esta línea programática no requiere de participantes');
        } else if ($proyecto->codigo_linea_programatica == 69) {
            return redirect()->route('convocatorias.proyectos-formulario-5-linea-69.edit', [$convocatoria, $proyecto])->with('error', 'Esta línea programática no requiere de participantes');
        }

        $proyecto->load('participantes.centroFormacion.regional');
        $proyecto->load('semillerosInvestigacion.lineaInvestigacion.grupoInvestigacion');

        return Inertia::render('Convocatorias/Proyectos/Participantes/Index', [
            'convocatoria'                  => $convocatoria,
            'proyecto'                      => $proyecto->only('id', 'tipo_formulario_convocatoria_id', 'precio_proyecto', 'modificable', 'diff_meses', 'participantes', 'semillerosInvestigacion', 'mostrar_recomendaciones', 'PdfVersiones', 'all_files', 'allowed', 'fecha_inicio', 'fecha_finalizacion', 'tipo_proyecto'),
            'evaluacion'                    => Evaluacion::find(request()->evaluacion_id),
            'roles_sennova'                 => RolSennova::select('id as value', 'nombre as label')->orderBy('nombre', 'ASC')->get(),
            'nuevo_participante'            => User::select('users.id', 'users.nombre', 'users.email', 'users.centro_formacion_id')->with('centroFormacion', 'centroFormacion.regional')->orderBy('users.nombre', 'ASC')->filterUser(request()->only('search'))->first(),
            'nuevo_semillero_investigacion' => SemilleroInvestigacion::select('semilleros_investigacion.id', 'semilleros_investigacion.nombre', 'semilleros_investigacion.linea_investigacion_id')->with('lineaInvestigacion', 'lineaInvestigacion.grupoInvestigacion')->orderBy('semilleros_investigacion.nombre', 'ASC')->filterSemilleroInvestigacion(request()->only('search'))->first(),
            'centros_formacion'             => SelectHelper::centrosFormacion(),
            'autor_principal'               => $proyecto->participantes()->where('proyecto_participantes.es_formulador', true)->first(),
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

        if ($proyecto->proyectoFormulario4Linea70()->exists()) {
            $proyecto->proyectoFormulario4Linea70ProgramasFormacion()->attach($programaFormacion);
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

        if ($proyecto->codigo_linea_programatica == 65) {
            $proyecto->tipo_proyecto = $proyecto->proyectoLinea65->tipo_proyecto;
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
        $proyectos_id = collect([]);
        collect(json_decode($request->proyectos_id))->pluck('value')->map(function ($item) use ($proyectos_id) {
            return $proyectos_id->push($item - 8000);
        });

        $proyectos = Proyecto::whereIn('id', $proyectos_id)->get();

        if ($request->estado == 1) { // Subsanar
            foreach ($proyectos as $proyecto) {
                $proyecto->update(['estado' => $proyecto->estado_evaluacion_idi ?? $proyecto->estado_evaluacion_proyecto_formulario_1_linea_65 ?? $proyecto->estado_evaluacion_ta ?? $proyecto->estado_evaluacion_tp ?? $proyecto->estado_evaluacion_proyecto_formulario_12_linea_68]);
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

            Evaluacion::whereIn('proyecto_id', $proyectos_id)->where('habilitado', true)->update(['modificable' => false, 'finalizado' => true, 'iniciado' => false]);
        } else if ($request->estado == 2) { // Finalizar
            foreach ($proyectos as $proyecto) {
                $proyecto->update(['estado' => $proyecto->estado_evaluacion_idi ?? $proyecto->estado_evaluacion_proyecto_formulario_1_linea_65 ?? $proyecto->estado_evaluacion_ta ?? $proyecto->estado_evaluacion_tp ?? $proyecto->estado_evaluacion_proyecto_formulario_12_linea_68]);

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
                $proyecto->update(['estado' => $proyecto->estado_evaluacion_idi ?? $proyecto->estado_evaluacion_proyecto_formulario_1_linea_65 ?? $proyecto->estado_evaluacion_ta ?? $proyecto->estado_evaluacion_tp ?? $proyecto->estado_evaluacion_proyecto_formulario_12_linea_68]);

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

            Evaluacion::whereIn('proyecto_id', $proyectos_id)->where('habilitado', true)->update(['modificable' => true, 'finalizado' => false, 'iniciado' => true]);
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
            $proyecto->update(['estado' => $proyecto->estado_evaluacion_idi ?? $proyecto->estado_evaluacion_proyecto_formulario_1_linea_65 ?? $proyecto->estado_evaluacion_ta ?? $proyecto->estado_evaluacion_tp ?? $proyecto->estado_evaluacion_proyecto_formulario_12_linea_68]);
        }

        return back()->with('success', 'Se han actualizado los estados de los proyectos correctamente.');
    }
}
