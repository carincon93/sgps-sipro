<?php

namespace App\Http\Controllers\Evaluacion;

use App\Helpers\SelectHelper;
use App\Models\Evaluacion\CulturaInnovacionEvaluacion;
use App\Http\Controllers\Controller;
use App\Http\Requests\Evaluacion\CulturaInnovacionEvaluacionRequest;
use App\Models\AreaConocimiento;
use App\Models\Convocatoria;
use App\Models\MesaSectorial;
use App\Models\Tecnoacademia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class CulturaInnovacionEvaluacionController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Convocatoria $convocatoria)
    {
        return Inertia::render('Convocatorias/Evaluaciones/CulturaInnovacion/Index', [
            'convocatoria'      => $convocatoria->only('id', 'esta_activa', 'fase_formateada', 'fase', 'tipo_convocatoria'),
            'filters'           => request()->all('search'),
            'culturaInnovacion' => CulturaInnovacionEvaluacion::getProyectosPorEvaluador($convocatoria)->appends(['search' => request()->search]),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create(Convocatoria $convocatoria)
    {
        // 
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Convocatoria $convocatoria, CulturaInnovacionEvaluacionRequest $request)
    {
        // 
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Evaluacion\CulturaInnovacionEvaluacion  $culturaInnovacionEvaluacion
     * @return \Illuminate\Http\Response
     */
    public function show(Convocatoria $convocatoria, CulturaInnovacionEvaluacion $culturaInnovacionEvaluacion)
    {
        // 
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Evaluacion\CulturaInnovacionEvaluacion  $culturaInnovacionEvaluacion
     * @return \Illuminate\Http\Response
     */
    public function edit(Convocatoria $convocatoria, CulturaInnovacionEvaluacion $culturaInnovacionEvaluacion)
    {
        $this->authorize('visualizar-evaluacion-autor', $culturaInnovacionEvaluacion->evaluacion);

        $culturaInnovacionEvaluacion->evaluacion->proyecto;
        $culturaInnovacion                                      = $culturaInnovacionEvaluacion->evaluacion->proyecto->culturaInnovacion;
        $culturaInnovacion->proyecto->pdfVersiones;
        $culturaInnovacion->proyecto->codigo_linea_programatica = $culturaInnovacion->proyecto->lineaProgramatica->codigo;
        $culturaInnovacion->proyecto->precio_proyecto           = $culturaInnovacion->proyecto->precioProyecto;
        $culturaInnovacion->proyecto->centroFormacion;

        return Inertia::render('Convocatorias/Evaluaciones/CulturaInnovacion/Edit', [
            'convocatoria'                              => $convocatoria->only('id', 'esta_activa', 'fase_formateada', 'fase', 'tipo_convocatoria', 'min_fecha_inicio_proyectos_cultura', 'max_fecha_finalizacion_proyectos_cultura', 'campos_convocatoria', 'year'),
            'culturaInnovacion'                         => $culturaInnovacion,
            'culturaInnovacionEvaluacion'               => $culturaInnovacionEvaluacion,
            'mesasSectorialesRelacionadas'              => $culturaInnovacion->mesasSectoriales()->pluck('id'),
            'lineasTecnoacademiaRelacionadas'           => $culturaInnovacion->tecnoacademiaLineasTecnoacademia()->pluck('id'),
            'tecnoacademia'                             => $culturaInnovacion->tecnoacademiaLineasTecnoacademia()->first() ? $culturaInnovacion->tecnoacademiaLineasTecnoacademia()->first()->tecnoacademia->only('id', 'nombre') : null,
            'mesasSectoriales'                          => MesaSectorial::select('id', 'nombre')->get('id'),
            'areasConocimiento'                         => SelectHelper::areasConocimiento(),
            'tecnoacademias'                            => SelectHelper::tecnoacademias(),
            'municipios'                                => SelectHelper::municipios(),
            'lineasProgramaticas'                       => SelectHelper::lineasProgramaticas()->where('categoria_proyecto', 5)->values()->all(),
            'actividadesEconomicas'                     => SelectHelper::actividadesEconomicas(),
            'tematicasEstrategicas'                     => SelectHelper::tematicasEstrategicas(),
            'lineasTecnoacademia'                       => SelectHelper::lineasTecnoacademia(),
            'lineasInvestigacion'                       => SelectHelper::lineasInvestigacion()->where('centro_formacion_id', $culturaInnovacion->proyecto->centro_formacion_id)->values()->all(),
            'tiposProyectos'                            => json_decode(Storage::get('json/tipos-proyectos-cultura.json'), true),
            'tiposEventos'                              => json_decode(Storage::get('json/tipos-eventos-cultura.json'), true),
            'programasFormacionConRegistroCalificado'   => SelectHelper::programasFormacion()->where('registro_calificado', true)->where('centro_formacion_id', $culturaInnovacion->proyecto->centro_formacion_id)->values()->all(),
            'programasFormacionSinRegistroCalificado'   => SelectHelper::programasFormacion()->where('registro_calificado', false)->values()->all(),
            'opcionesAplicaNoAplica'                    => json_decode(Storage::get('json/opciones-aplica-no-aplica.json'), true),
            'proyectoMunicipios'                        => $culturaInnovacion->proyecto->municipios()->select('municipios.id as value', 'municipios.nombre as label', 'regionales.nombre as group')->join('regionales', 'regionales.id', 'municipios.regional_id')->get(),
            'programasFormacionConRegistroRelacionados' => $culturaInnovacion->proyecto->programasFormacion()->selectRaw('id as value, concat(programas_formacion.nombre, chr(10), \'∙ Código: \', programas_formacion.codigo) as label')->where('registro_calificado', true)->get(),
            'programasFormacionSinRegistroRelacionados' => $culturaInnovacion->proyecto->programasFormacion()->selectRaw('id as value, concat(programas_formacion.nombre, chr(10), \'∙ Código: \', programas_formacion.codigo) as label')->where('registro_calificado', false)->get(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Evaluacion\CulturaInnovacionEvaluacion  $culturaInnovacionEvaluacion
     * @return \Illuminate\Http\Response
     */
    public function update(CulturaInnovacionEvaluacionRequest $request, Convocatoria $convocatoria, CulturaInnovacionEvaluacion $culturaInnovacionEvaluacion)
    {
        $this->authorize('modificar-evaluacion-autor', $culturaInnovacionEvaluacion->evaluacion);

        $culturaInnovacionEvaluacion->evaluacion()->update([
            'iniciado' => true,
            'clausula_confidencialidad' => $request->clausula_confidencialidad

        ]);

        $culturaInnovacionEvaluacion->titulo_puntaje              = $request->titulo_puntaje;
        $culturaInnovacionEvaluacion->titulo_comentario           = $request->titulo_requiere_comentario == false ? $request->titulo_comentario : null;
        $culturaInnovacionEvaluacion->video_puntaje               = $request->video_puntaje;
        $culturaInnovacionEvaluacion->video_comentario            = $request->video_requiere_comentario == false ? $request->video_comentario : null;

        $culturaInnovacionEvaluacion->antecedentes_puntaje        = $request->antecedentes_puntaje;
        $culturaInnovacionEvaluacion->antecedentes_comentario     = $request->antecedentes_requiere_comentario == false ? $request->antecedentes_comentario : null;

        $culturaInnovacionEvaluacion->resumen_puntaje             = $request->resumen_puntaje;
        $culturaInnovacionEvaluacion->resumen_comentario          = $request->resumen_requiere_comentario == false ? $request->resumen_comentario : null;
        $culturaInnovacionEvaluacion->ortografia_puntaje          = $request->ortografia_puntaje;
        $culturaInnovacionEvaluacion->ortografia_comentario       = $request->ortografia_requiere_comentario == false ? $request->ortografia_comentario : null;
        $culturaInnovacionEvaluacion->redaccion_puntaje           = $request->redaccion_puntaje;
        $culturaInnovacionEvaluacion->redaccion_comentario        = $request->redaccion_requiere_comentario == false ? $request->redaccion_comentario : null;
        $culturaInnovacionEvaluacion->normas_apa_puntaje          = $request->normas_apa_puntaje;
        $culturaInnovacionEvaluacion->normas_apa_comentario       = $request->normas_apa_requiere_comentario == false ? $request->normas_apa_comentario : null;

        $culturaInnovacionEvaluacion->justificacion_economia_naranja_comentario         = $request->justificacion_economia_naranja_requiere_comentario == false ? $request->justificacion_economia_naranja_comentario : null;
        $culturaInnovacionEvaluacion->justificacion_industria_4_comentario              = $request->justificacion_industria_4_requiere_comentario == false ? $request->justificacion_industria_4_comentario : null;
        $culturaInnovacionEvaluacion->bibliografia_comentario                           = $request->bibliografia_requiere_comentario == false ? $request->bibliografia_comentario : null;
        $culturaInnovacionEvaluacion->fechas_comentario                                 = $request->fechas_requiere_comentario == false ? $request->fechas_comentario : null;
        $culturaInnovacionEvaluacion->justificacion_politica_discapacidad_comentario    = $request->justificacion_politica_discapacidad_requiere_comentario == false ? $request->justificacion_politica_discapacidad_comentario : null;
        $culturaInnovacionEvaluacion->actividad_economica_comentario                    = $request->actividad_economica_requiere_comentario == false ? $request->actividad_economica_comentario : null;
        $culturaInnovacionEvaluacion->area_conocimiento_comentario                      = $request->area_conocimiento_requiere_comentario == false ? $request->area_conocimiento_comentario : null;
        $culturaInnovacionEvaluacion->tematica_estrategica_comentario                   = $request->tematica_estrategica_requiere_comentario == false ? $request->tematica_estrategica_comentario : null;

        $culturaInnovacionEvaluacion->save();

        return back()->with('success', 'El recurso se ha actualizado correctamente.');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Evaluacion\CulturaInnovacionEvaluacion  $culturaInnovacionEvaluacion
     * @return \Illuminate\Http\Response
     */
    public function destroy(Convocatoria $convocatoria, CulturaInnovacionEvaluacion $culturaInnovacionEvaluacion)
    {
        $this->authorize('modificar-evaluacion-autor', $culturaInnovacionEvaluacion->evaluacion);

        return redirect()->route('resourceRoute.index')->with('error', 'El recurso se no se ha podido eliminar.');
    }
}
