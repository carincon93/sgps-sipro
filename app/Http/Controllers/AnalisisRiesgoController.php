<?php

namespace App\Http\Controllers;

use App\Http\Requests\AnalisisRiesgoRequest;
use App\Models\Convocatoria;
use App\Models\Proyecto;
use App\Models\AnalisisRiesgo;
use App\Models\Evaluacion\Evaluacion;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class AnalisisRiesgoController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Convocatoria $convocatoria, Proyecto $proyecto)
    {
        $this->authorize('visualizar-proyecto-autor', $proyecto);

        if ($proyecto->convocatoria_id != $convocatoria->id) {
            return abort(404);
        }

        $proyecto->load('proyectoRolesSennova.proyectoRolesEvaluaciones', 'proyectoPresupuesto.proyectoPresupuestosEvaluaciones');
        // $proyecto->load('evaluaciones.evaluacionProyectoFormulario8Linea66');
        // $proyecto->load('evaluaciones.evaluacionProyectoFormulario4Linea70');

        $proyecto->tipoFormularioConvocatoria->lineaProgramatica;

        return Inertia::render('Convocatorias/Proyectos/AnalisisRiesgo/Index', [
            'convocatoria'           => $convocatoria->only('id', 'esta_activa', 'fase_formateada', 'fase', 'tipo_convocatoria', 'mostrar_recomendaciones'),
            'proyecto'               => $proyecto,
            'evaluacion'             => Evaluacion::find(request()->evaluacion_id),
            'analisis_riesgos'       => AnalisisRiesgo::where('proyecto_id', $proyecto->id)->orderBy('descripcion', 'ASC')
                ->filterAnalisisRiesgo(request()->only('search'))->paginate()->appends(['search' => request()->search]),
            'niveles_riesgo'         => json_decode(Storage::get('json/niveles-riesgo.json'), true),
            'tipos_riesgo'           => json_decode(Storage::get('json/tipos-riesgo.json'), true),
            'probabilidades_riesgo'  => json_decode(Storage::get('json/probabilidades-riesgo.json'), true),
            'impactos_riesgo'        => json_decode(Storage::get('json/impactos-riesgo.json'), true)
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

        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(AnalisisRiesgoRequest $request, Convocatoria $convocatoria, Proyecto $proyecto)
    {
        $this->authorize('modificar-proyecto-autor', $proyecto);

        $analisis_riesgo = new AnalisisRiesgo();
        $analisis_riesgo->nivel               = $request->nivel;
        $analisis_riesgo->tipo                = $request->tipo;
        $analisis_riesgo->descripcion         = $request->descripcion;
        $analisis_riesgo->probabilidad        = $request->probabilidad;
        $analisis_riesgo->impacto             = $request->impacto;
        $analisis_riesgo->efectos             = $request->efectos;
        $analisis_riesgo->medidas_mitigacion  = $request->medidas_mitigacion;
        $analisis_riesgo->proyecto()->associate($proyecto);

        $analisis_riesgo->save();

        return redirect()->route('convocatorias.proyectos.analisis-riesgos.index', [$convocatoria, $proyecto])->with('success', 'El recurso se ha creado correctamente.');
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\AnalisisRiesgo  $analisis_riesgo
     * @return \Illuminate\Http\Response
     */
    public function show(Convocatoria $convocatoria, Proyecto $proyecto, AnalisisRiesgo $analisis_riesgo)
    {
        $this->authorize('visualizar-proyecto-autor', $proyecto);

        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\AnalisisRiesgo  $analisis_riesgo
     * @return \Illuminate\Http\Response
     */
    public function edit(Convocatoria $convocatoria, Proyecto $proyecto, AnalisisRiesgo $analisis_riesgo)
    {
        $this->authorize('visualizar-proyecto-autor', $proyecto);

        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\AnalisisRiesgo  $analisis_riesgo
     * @return \Illuminate\Http\Response
     */
    public function update(AnalisisRiesgoRequest $request, Convocatoria $convocatoria, Proyecto $proyecto, AnalisisRiesgo $analisis_riesgo)
    {
        $this->authorize('modificar-proyecto-autor', $proyecto);

        $analisis_riesgo->nivel              = $request->nivel;
        $analisis_riesgo->tipo               = $request->tipo;
        $analisis_riesgo->descripcion        = $request->descripcion;
        $analisis_riesgo->probabilidad       = $request->probabilidad;
        $analisis_riesgo->impacto            = $request->impacto;
        $analisis_riesgo->efectos            = $request->efectos;
        $analisis_riesgo->medidas_mitigacion = $request->medidas_mitigacion;
        $analisis_riesgo->proyecto()->associate($proyecto);

        $analisis_riesgo->save();

        return back()->with('success', 'El recurso se ha actualizado correctamente.');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\AnalisisRiesgo  $analisis_riesgo
     * @return \Illuminate\Http\Response
     */
    public function destroy(Convocatoria $convocatoria, Proyecto $proyecto, AnalisisRiesgo $analisis_riesgo)
    {
        $this->authorize('modificar-proyecto-autor', $proyecto);

        $analisis_riesgo->delete();

        return redirect()->route('convocatorias.proyectos.analisis-riesgos.index', [$convocatoria, $proyecto])->with('success', 'El recurso se ha eliminado correctamente.');
    }
}
