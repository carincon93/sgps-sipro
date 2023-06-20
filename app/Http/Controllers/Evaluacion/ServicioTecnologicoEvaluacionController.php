<?php

namespace App\Http\Controllers\Evaluacion;

use App\Helpers\SelectHelper;
use App\Models\Evaluacion\ServicioTecnologicoEvaluacion;
use App\Http\Controllers\Controller;
use App\Http\Requests\Evaluacion\ServicioTecnologicoEvaluacionRequest;
use App\Models\Convocatoria;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ServicioTecnologicoEvaluacionController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Convocatoria $convocatoria)
    {
        return Inertia::render('Convocatorias/Evaluaciones/ServiciosTecnologicos/Index', [
            'convocatoria'          => $convocatoria->only('id', 'esta_activa', 'fase_formateada', 'fase', 'tipo_convocatoria'),
            'filters'               => request()->all('search'),
            'serviciosTecnologicos' => ServicioTecnologicoEvaluacion::getProyectosPorEvaluador($convocatoria)->appends(['search' => request()->search]),
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
    public function store(ServicioTecnologicoEvaluacionRequest $request, Convocatoria $convocatoria)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Evaluacion\ServicioTecnologicoEvaluacion  $servicioTecnologicoEvaluacion
     * @return \Illuminate\Http\Response
     */
    public function show(Convocatoria $convocatoria, ServicioTecnologicoEvaluacion $servicioTecnologicoEvaluacion)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Evaluacion\ServicioTecnologicoEvaluacion  $servicioTecnologicoEvaluacion
     * @return \Illuminate\Http\Response
     */
    public function edit(Convocatoria $convocatoria, ServicioTecnologicoEvaluacion $servicioTecnologicoEvaluacion)
    {
        $this->authorize('visualizar-evaluacion-autor', $servicioTecnologicoEvaluacion->evaluacion);

        /** @var \App\Models\User */
        $authUser = Auth::user();

        $servicioTecnologicoEvaluacion->evaluacion->proyecto;
        $servicioTecnologico = $servicioTecnologicoEvaluacion->evaluacion->proyecto->servicioTecnologico;
        $servicioTecnologico->proyecto->pdfVersiones;
        $servicioTecnologico->proyecto->codigo_linea_programatica = $servicioTecnologico->proyecto->lineaProgramatica->codigo;
        $servicioTecnologico->proyecto->precio_proyecto           = $servicioTecnologico->proyecto->precioProyecto;

        $servicioTecnologico->proyecto->centroFormacion;

        if ($authUser->hasRole(13)) {
            $tipoProyectoSt = SelectHelper::tiposProyectosSt()->where('regional_id', $authUser->centroFormacion->regional_id)->values()->all();
        } else {
            $tipoProyectoSt = SelectHelper::tiposProyectosSt();
        }

        return Inertia::render('Convocatorias/Evaluaciones/ServiciosTecnologicos/Edit', [
            'convocatoria'                              => $convocatoria->only('id', 'esta_activa', 'fase_formateada', 'fase', 'tipo_convocatoria', 'min_fecha_inicio_proyectos_linea_68', 'max_fecha_finalizacion_proyectos_linea_68', 'fecha_maxima_st', 'mostrar_recomendaciones', 'year'),
            'servicioTecnologico'                       => $servicioTecnologico,
            'servicioTecnologicoEvaluacion'             => $servicioTecnologicoEvaluacion,
            'servicioTecnologicoSegundaEvaluacion'      => ServicioTecnologicoEvaluacion::whereHas('evaluacion', function ($query) use ($servicioTecnologico) {
                $query->where('evaluaciones.proyecto_id', $servicioTecnologico->id)->where('evaluaciones.habilitado', true);
            })->where('servicios_tecnologicos_evaluaciones.id', '!=', $servicioTecnologicoEvaluacion->id)->first(),
            'sectoresProductivos'                       => collect(json_decode(Storage::get('json/sectores-productivos.json'), true)),
            'tiposProyectoSt'                           => $tipoProyectoSt,
            'lineasProgramaticas'                       => SelectHelper::lineasProgramaticas(),
            'programasFormacionConRegistroCalificado'   => SelectHelper::programasFormacion()->where('registro_calificado', true)->where('centro_formacion_id', $servicioTecnologico->proyecto->centro_formacion_id)->values()->all(),
            'proyectoProgramasFormacion'                => $servicioTecnologico->proyecto->programasFormacion()->selectRaw('id as value, concat(programas_formacion.nombre, chr(10), \'∙ Código: \', programas_formacion.codigo) as label')->where('registro_calificado', true)->get(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Evaluacion\ServicioTecnologicoEvaluacion  $servicioTecnologicoEvaluacion
     * @return \Illuminate\Http\Response
     */
    public function update(ServicioTecnologicoEvaluacionRequest $request, Convocatoria $convocatoria, ServicioTecnologicoEvaluacion $servicioTecnologicoEvaluacion)
    {
        $this->authorize('modificar-evaluacion-autor', $servicioTecnologicoEvaluacion->evaluacion);

        $servicioTecnologicoEvaluacion->evaluacion()->update([
            'iniciado' => true,
            'clausula_confidencialidad' => $request->clausula_confidencialidad
        ]);

        $servicioTecnologicoEvaluacion->fecha_ejecucion_comentario                  = $request->fechas_requiere_comentario == false ? $request->fecha_ejecucion_comentario : null;

        $servicioTecnologicoEvaluacion->titulo_puntaje                              = $request->titulo_puntaje;
        $servicioTecnologicoEvaluacion->titulo_comentario                           = $request->titulo_requiere_comentario == false ? $request->titulo_comentario : null;
        $servicioTecnologicoEvaluacion->resumen_puntaje                             = $request->resumen_puntaje;
        $servicioTecnologicoEvaluacion->resumen_comentario                          = $request->resumen_requiere_comentario == false ? $request->resumen_comentario : null;
        $servicioTecnologicoEvaluacion->antecedentes_puntaje                        = $request->antecedentes_puntaje;
        $servicioTecnologicoEvaluacion->antecedentes_comentario                     = $request->antecedentes_requiere_comentario == false ? $request->antecedentes_comentario : null;

        $servicioTecnologicoEvaluacion->identificacion_problema_puntaje             = $request->identificacion_problema_puntaje;
        $servicioTecnologicoEvaluacion->identificacion_problema_comentario          = $request->identificacion_problema_requiere_comentario == false ? $request->identificacion_problema_comentario : null;

        $servicioTecnologicoEvaluacion->pregunta_formulacion_problema_puntaje       = $request->pregunta_formulacion_problema_puntaje;
        $servicioTecnologicoEvaluacion->pregunta_formulacion_problema_comentario    = $request->pregunta_formulacion_problema_requiere_comentario == false ? $request->pregunta_formulacion_problema_comentario : null;

        $servicioTecnologicoEvaluacion->justificacion_problema_puntaje              = $request->justificacion_problema_puntaje;
        $servicioTecnologicoEvaluacion->justificacion_problema_comentario           = $request->justificacion_problema_requiere_comentario == false ? $request->justificacion_problema_comentario : null;

        $servicioTecnologicoEvaluacion->bibliografia_comentario                     = $request->bibliografia_requiere_comentario == false ? $request->bibliografia_comentario : null;

        $servicioTecnologicoEvaluacion->ortografia_comentario                       = $request->ortografia_requiere_comentario == false ? $request->ortografia_comentario : null;
        $servicioTecnologicoEvaluacion->redaccion_comentario                        = $request->redaccion_requiere_comentario == false ? $request->redaccion_comentario : null;
        $servicioTecnologicoEvaluacion->normas_apa_comentario                       = $request->normas_apa_requiere_comentario == false ? $request->normas_apa_comentario : null;

        $servicioTecnologicoEvaluacion->save();

        return redirect()->back()->with('success', 'El recurso se ha actualizado correctamente.');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Evaluacion\ServicioTecnologicoEvaluacion  $servicioTecnologicoEvaluacion
     * @return \Illuminate\Http\Response
     */
    public function destroy(Convocatoria $convocatoria, ServicioTecnologicoEvaluacion $servicioTecnologicoEvaluacion)
    {
        $this->authorize('modificar-evaluacion-autor', $servicioTecnologicoEvaluacion->evaluacion);

        return redirect()->route('convocatorias.servicios-tecnologicos-evaluaciones.index', [$convocatoria])->with('error', 'El recurso se no se ha podido eliminar.');
    }
}
