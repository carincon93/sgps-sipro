<?php

namespace App\Http\Controllers\Evaluacion;

use App\Helpers\SelectHelper;
use App\Models\Evaluacion\TaEvaluacion;
use App\Http\Controllers\Controller;
use App\Http\Requests\Evaluacion\TaEvaluacionRequest;
use App\Models\Convocatoria;
use App\Models\DisenoCurricular;
use App\Models\Regional;
use App\Models\Tecnoacademia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class TaEvaluacionController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Convocatoria $convocatoria)
    {
        return Inertia::render('Convocatorias/Evaluaciones/Ta/Index', [
            'convocatoria'  => $convocatoria->only('id', 'esta_activa', 'fase_formateada', 'fase', 'tipo_convocatoria', 'tipo_convocatoria'),
            'filters'       => request()->all('search'),
            'ta'            => TaEvaluacion::getProyectosPorEvaluador($convocatoria)->appends(['search' => request()->search]),
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
    public function store(TaEvaluacionRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\TaEvaluacion  $taEvaluacion
     * @return \Illuminate\Http\Response
     */
    public function show(Convocatoria $convocatoria, TaEvaluacion $taEvaluacion)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\TaEvaluacion  $taEvaluacion
     * @return \Illuminate\Http\Response
     */
    public function edit(Convocatoria $convocatoria, TaEvaluacion $taEvaluacion)
    {
        $this->authorize('visualizar-evaluacion-autor', $taEvaluacion->evaluacion);

        /** @var \App\Models\User */
        $authUser = Auth::user();

        $taEvaluacion->evaluacion->proyecto;
        $ta = $taEvaluacion->evaluacion->proyecto->ta;
        $ta->proyecto->pdfVersiones;
        $ta->proyecto->codigo_linea_programatica = $ta->proyecto->lineaProgramatica->codigo;
        $ta->proyecto->precio_proyecto           = $ta->proyecto->precioProyecto;
        $ta->proyecto->centroFormacion;

        if ($authUser->hasRole(12) || $authUser->hasRole(5)) {
            $tecnoacademias = SelectHelper::tecnoacademias()->where('tecnoacademias.centro_formacion_id', $authUser->centroFormacion->id)->values()->all();
        } else {
            $tecnoacademias = SelectHelper::tecnoacademias();
        }

        return Inertia::render('Convocatorias/Evaluaciones/Ta/Edit', [
            'convocatoria'                              => $convocatoria->only('id', 'esta_activa', 'fase_formateada', 'fase', 'tipo_convocatoria', 'min_fecha_inicio_proyectos_linea_70', 'max_fecha_finalizacion_proyectos_linea_70', 'fecha_maxima_ta', 'year'),
            'ta'                                        => $ta,
            'taEvaluacion'                              => $taEvaluacion,
            'otrasEvaluaciones'                         => TaEvaluacion::with('evaluacion.evaluador')->whereHas('evaluacion', function ($query) use ($ta) {
                $query->where('evaluaciones.proyecto_id', $ta->id)->where('evaluaciones.habilitado', true);
            })->where('ta_evaluaciones.id', '!=', $taEvaluacion->id)->get(),
            'tecnoacademiaRelacionada'                  => $ta->proyecto->tecnoacademiaLineasTecnoacademia()->first() ? $ta->proyecto->tecnoacademiaLineasTecnoacademia()->first()->tecnoacademia : null,
            'lineasTecnoacademiaRelacionadas'           => $ta->proyecto->tecnoacademiaLineasTecnoacademia()->select('tecnoacademia_linea_tecnoacademia.id as value', 'lineas_tecnoacademia.nombre')->join('lineas_tecnoacademia', 'tecnoacademia_linea_tecnoacademia.linea_tecnoacademia_id', 'lineas_tecnoacademia.id')->get(),
            'regionales'                                => SelectHelper::regionales(),
            'lineasProgramaticas'                       => SelectHelper::lineasProgramaticas(),
            'lineasTecnoacademia'                       => SelectHelper::lineasTecnoacademia(),
            'disenosCurriculares'                       => SelectHelper::disenoCurriculares(),
            'municipios'                                => SelectHelper::municipios(),
            'disenosCurriculares'                       => SelectHelper::disenoCurriculares(),
            'programasFormacionSinRegistroCalificado'   => SelectHelper::programasFormacion()->where('registro_calificado', false)->values()->all(),
            'proyectoMunicipios'                        => $ta->proyecto->municipios()->select('municipios.id as value', 'municipios.nombre as label', 'regionales.nombre as group', 'regionales.codigo')->join('regionales', 'regionales.id', 'municipios.regional_id')->get(),
            'proyectoMunicipiosImpactar'                => $ta->proyecto->municipiosAImpactar()->select('municipios.id as value', 'municipios.nombre as label', 'regionales.nombre as group', 'regionales.codigo')->join('regionales', 'regionales.id', 'municipios.regional_id')->get(),
            'disenosCurricularesRelacionados'           => $ta->proyecto->disenosCurriculares()->selectRaw('id as value, concat(nombre, \' ∙ Código: \', codigo) as label')->get(),
            'programasFormacionSinRegistroRelacionados' => $ta->proyecto->taProgramasFormacion()->selectRaw('id as value, concat(programas_formacion.nombre, chr(10), \'∙ Código: \', programas_formacion.codigo) as label')->where('programas_formacion.registro_calificado', true)->get(),
            'tecnoacademias'                            => $tecnoacademias,
        ]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\TaEvaluacion  $taEvaluacion
     * @return \Illuminate\Http\Response
     */
    public function update(TaEvaluacionRequest $request, Convocatoria $convocatoria, TaEvaluacion $taEvaluacion)
    {
        $this->authorize('modificar-evaluacion-autor', $taEvaluacion->evaluacion);

        $taEvaluacion->evaluacion()->update([
            'iniciado' => true,
            'clausula_confidencialidad' => $request->clausula_confidencialidad
        ]);

        $taEvaluacion->resumen_regional_comentario              = $request->resumen_regional_requiere_comentario == false ? $request->resumen_regional_comentario : null;
        $taEvaluacion->antecedentes_tecnoacademia_comentario    = $request->antecedentes_tecnoacademia_requiere_comentario == false ? $request->antecedentes_tecnoacademia_comentario : null;
        $taEvaluacion->retos_oportunidades_comentario           = $request->retos_oportunidades_requiere_comentario == false ? $request->retos_oportunidades_comentario : null;
        $taEvaluacion->lineas_medulares_centro_comentario       = $request->lineas_medulares_centro_requiere_comentario == false ? $request->lineas_medulares_centro_comentario : null;
        $taEvaluacion->lineas_tecnologicas_centro_comentario    = $request->lineas_tecnologicas_centro_requiere_comentario == false ? $request->lineas_tecnologicas_centro_comentario : null;
        $taEvaluacion->municipios_comentario                    = $request->municipios_requiere_comentario == false ? $request->municipios_comentario : null;
        $taEvaluacion->instituciones_comentario                 = $request->instituciones_requiere_comentario == false ? $request->instituciones_comentario : null;
        $taEvaluacion->fecha_ejecucion_comentario               = $request->fecha_ejecucion_requiere_comentario == false ? $request->fecha_ejecucion_comentario : null;
        $taEvaluacion->proyectos_macro_comentario               = $request->proyectos_macro_requiere_comentario == false ? $request->proyectos_macro_comentario : null;
        $taEvaluacion->bibliografia_comentario                  = $request->bibliografia_requiere_comentario == false ? $request->bibliografia_comentario : null;
        $taEvaluacion->articulacion_centro_formacion_comentario = $request->articulacion_centro_formacion_requiere_comentario == false ? $request->articulacion_centro_formacion_comentario : null;

        $taEvaluacion->ortografia_comentario                    = $request->ortografia_requiere_comentario == false ? $request->ortografia_comentario : null;
        $taEvaluacion->redaccion_comentario                     = $request->redaccion_requiere_comentario == false ? $request->redaccion_comentario : null;
        $taEvaluacion->normas_apa_comentario                    = $request->normas_apa_requiere_comentario == false ? $request->normas_apa_comentario : null;

        $taEvaluacion->save();

        return redirect()->back()->with('success', 'El recurso ha sido actualizado correctamente.');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\TaEvaluacion  $taEvaluacion
     * @return \Illuminate\Http\Response
     */
    public function destroy(Convocatoria $convocatoria, TaEvaluacion $taEvaluacion)
    {
        $this->authorize('modificar-evaluacion-autor', $taEvaluacion->evaluacion);

        return redirect()->route('convocatorias.ta-evaluaciones.index', [$convocatoria])->with('error', 'El recurso se no se ha podido eliminar.');
    }
}
