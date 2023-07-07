<?php

namespace App\Http\Controllers\Evaluacion;

use App\Helpers\SelectHelper;
use App\Models\Evaluacion\IdiEvaluacion;
use App\Http\Controllers\Controller;
use App\Http\Requests\Evaluacion\IdiEvaluacionRequest;
use App\Models\Convocatoria;
use App\Models\MesaSectorial;
use App\Models\Tecnoacademia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class IdiEvaluacionController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Convocatoria $convocatoria)
    {
        return Inertia::render('Convocatorias/Evaluaciones/Idi/Index', [
            'convocatoria'  => $convocatoria->only('id', 'esta_activa', 'fase_formateada', 'fase', 'tipo_convocatoria', 'tipo_convocatoria'),
            'filters'       => request()->all('search'),
            'evaluaciones'  => IdiEvaluacion::getProyectosPorEvaluador($convocatoria)->appends(['search' => request()->search]),
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
    public function store(IdiEvaluacionRequest $request, Convocatoria $convocatoria)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Idi  $idi
     * @return \Illuminate\Http\Response
     */
    public function show(Convocatoria $convocatoria, IdiEvaluacion $idiEvaluacion)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Idi  $idi
     * @return \Illuminate\Http\Response
     */
    public function edit(Convocatoria $convocatoria, IdiEvaluacion $idiEvaluacion)
    {
        $this->authorize('visualizar-evaluacion-autor', $idiEvaluacion->evaluacion);

        $idiEvaluacion->evaluacion->proyecto;
        $idi = $idiEvaluacion->evaluacion->proyecto->idi;
        $idi->proyecto->pdfVersiones;
        $idi->proyecto->codigo_linea_programatica = $idi->proyecto->lineaProgramatica->codigo;
        $idi->proyecto->precio_proyecto           = $idi->proyecto->precioProyecto;

        $idi->disciplinaSubareaConocimiento->subareaConocimiento->areaConocimiento;
        $idi->proyecto->centroFormacion;

        return Inertia::render('Convocatorias/Evaluaciones/Idi/Edit', [
            'convocatoria'                              => $convocatoria->only('id', 'esta_activa', 'fase_formateada', 'fase', 'tipo_convocatoria', 'min_fecha_inicio_proyectos_idi', 'max_fecha_finalizacion_proyectos_idi', 'campos_convocatoria', 'year'),
            'idi'                                       => $idi,
            'idiEvaluacion'                             => $idiEvaluacion,
            'idiSegundaEvaluacion'                      => IdiEvaluacion::whereHas('evaluacion', function ($query) use ($idi) {
                $query->where('evaluaciones.proyecto_id', $idi->id)->where('evaluaciones.habilitado', true);
            })->where('idi_evaluaciones.id', '!=', $idiEvaluacion->id)->first(),
            'mesasSectorialesRelacionadas'              => $idi->mesasSectoriales()->pluck('mesas_sectoriales.id'),
            'lineasTecnoacademiaRelacionadas'           => $idi->proyecto->tecnoacademiaLineasTecnoacademia()->pluck('tecnoacademia_linea_tecnoacademia.id'),
            'tecnoacademia'                             => $idi->proyecto->tecnoacademiaLineasTecnoacademia()->first() ? $idi->proyecto->tecnoacademiaLineasTecnoacademia()->first()->tecnoacademia->only('id', 'nombre') : null,
            'mesasSectoriales'                          => MesaSectorial::select('id', 'nombre')->get('id'),
            'tecnoacademias'                            => SelectHelper::tecnoacademias(),
            'areasConocimiento'                         => SelectHelper::areasConocimiento(),
            'subareasConocimiento'                      => SelectHelper::subareasConocimiento(),
            'disciplinasSubareaConocimiento'            => SelectHelper::disciplinasSubareaConocimiento(),
            'lineasProgramaticas'                       => SelectHelper::lineasProgramaticas(),
            'redesConocimiento'                         => SelectHelper::redesConocimiento(),
            'actividadesEconomicas'                     => SelectHelper::actividadesEconomicas(),
            'tematicasEstrategicas'                     => SelectHelper::tematicasEstrategicas(),
            'municipios'                                => SelectHelper::municipios(),
            'programasFormacionConRegistroCalificado'   => SelectHelper::programasFormacion()->where('registro_calificado', true)->where('centro_formacion_id', $idi->proyecto->centro_formacion_id)->values()->all(),
            'programasFormacionSinRegistroCalificado'   => SelectHelper::programasFormacion()->where('registro_calificado', false)->values()->all(),
            'opcionesIDiDropdown'                       => json_decode(Storage::get('json/opciones-aplica-no-aplica.json'), true),
            'proyectoMunicipios'                        => $idi->proyecto->municipios()->select('municipios.id as value', 'municipios.nombre as label', 'regionales.nombre as group')->join('regionales', 'regionales.id', 'municipios.regional_id')->get(),
            'programasFormacionConRegistroRelacionados' => $idi->proyecto->programasFormacion()->selectRaw('id as value, concat(programas_formacion.nombre, chr(10), \'∙ Código: \', programas_formacion.codigo) as label')->where('registro_calificado', true)->get(),
            'programasFormacionSinRegistroRelacionados' => $idi->proyecto->programasFormacion()->selectRaw('id as value, concat(programas_formacion.nombre, chr(10), \'∙ Código: \', programas_formacion.codigo) as label')->where('registro_calificado', false)->get(),
            'lineasTecnoacademia'                       => SelectHelper::lineasTecnoacademia(),
            'lineasInvestigacion'                       => SelectHelper::lineasInvestigacion()->where('centro_formacion_id', $idi->proyecto->centro_formacion_id)->values()->all(),
            'gruposInvestigacion'                       => SelectHelper::gruposInvestigacion()->where('value', 126)->values()->all(),
            'areasTematicasEni'                         => SelectHelper::areasTematicasEni(),
            'lineasInvestigacionEni'                    => SelectHelper::lineasInvestigacion()->where('grupo_investigacion_id', 126)->values()->all(),
            'proyectoAreasTematicasEni'                 => $idi->areasTematicasEni()->select('areas_tematicas_eni.id as value', 'areas_tematicas_eni.nombre as label')->get(),
            'proyectoLineasInvestigacionEni'            => $idi->lineasInvestigacionEni()->select('lineas_investigacion.id as value', 'lineas_investigacion.nombre as label')->get(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Idi  $idi
     * @return \Illuminate\Http\Response
     */
    public function update(IdiEvaluacionRequest $request, Convocatoria $convocatoria, IdiEvaluacion $idiEvaluacion)
    {
        $this->authorize('modificar-evaluacion-autor', $idiEvaluacion->evaluacion);

        $idiEvaluacion->evaluacion()->update([
            'iniciado' => true,
            'clausula_confidencialidad' => $request->clausula_confidencialidad
        ]);

        $idiEvaluacion->titulo_puntaje              = $request->titulo_puntaje;
        $idiEvaluacion->titulo_comentario           = $request->titulo_requiere_comentario == false ? $request->titulo_comentario : null;
        $idiEvaluacion->video_puntaje               = $request->video_puntaje;
        $idiEvaluacion->video_comentario            = $request->video_requiere_comentario == false ? $request->video_comentario : null;
        $idiEvaluacion->resumen_puntaje             = $request->resumen_puntaje;
        $idiEvaluacion->resumen_comentario          = $request->resumen_requiere_comentario == false ? $request->resumen_comentario : null;
        $idiEvaluacion->ortografia_puntaje          = $request->ortografia_puntaje;
        $idiEvaluacion->ortografia_comentario       = $request->ortografia_requiere_comentario == false ? $request->ortografia_comentario : null;
        $idiEvaluacion->redaccion_puntaje           = $request->redaccion_puntaje;
        $idiEvaluacion->redaccion_comentario        = $request->redaccion_requiere_comentario == false ? $request->redaccion_comentario : null;
        $idiEvaluacion->normas_apa_puntaje          = $request->normas_apa_puntaje;
        $idiEvaluacion->normas_apa_comentario       = $request->normas_apa_requiere_comentario == false ? $request->normas_apa_comentario : null;

        $idiEvaluacion->justificacion_economia_naranja_comentario = $request->justificacion_economia_naranja_requiere_comentario == false ? $request->justificacion_economia_naranja_comentario : null;
        $idiEvaluacion->justificacion_industria_4_comentario = $request->justificacion_industria_4_requiere_comentario == false ? $request->justificacion_industria_4_comentario : null;
        $idiEvaluacion->bibliografia_comentario = $request->bibliografia_requiere_comentario == false ? $request->bibliografia_comentario : null;
        $idiEvaluacion->fechas_comentario = $request->fechas_requiere_comentario == false ? $request->fechas_comentario : null;
        $idiEvaluacion->justificacion_politica_discapacidad_comentario = $request->justificacion_politica_discapacidad_requiere_comentario == false ? $request->justificacion_politica_discapacidad_comentario : null;
        $idiEvaluacion->actividad_economica_comentario = $request->actividad_economica_requiere_comentario == false ? $request->actividad_economica_comentario : null;
        $idiEvaluacion->disciplina_subarea_conocimiento_comentario = $request->disciplina_subarea_conocimiento_requiere_comentario == false ? $request->disciplina_subarea_conocimiento_comentario : null;
        $idiEvaluacion->red_conocimiento_comentario = $request->red_conocimiento_requiere_comentario == false ? $request->red_conocimiento_comentario : null;
        $idiEvaluacion->tematica_estrategica_comentario = $request->tematica_estrategica_requiere_comentario == false ? $request->tematica_estrategica_comentario : null;

        $idiEvaluacion->save();

        return back()->with('success', 'El recurso se ha actualizado correctamente.');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Idi  $idi
     * @return \Illuminate\Http\Response
     */
    public function destroy(Convocatoria $convocatoria, IdiEvaluacion $idiEvaluacion)
    {
        $this->authorize('modificar-evaluacion-autor', $idiEvaluacion->evaluacion);

        return redirect()->route('convocatorias.idi-evaluaciones.index', [$convocatoria])->with('error', 'El recurso se no se ha podido eliminar.');
    }
}
