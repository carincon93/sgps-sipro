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

        $proyecto->load('evaluaciones.evaluacionProyectoFormulario8Linea66');
        $proyecto->load('evaluaciones.evaluacionProyectoFormulario4Linea70');

        return Inertia::render('Convocatorias/Proyectos/AnalisisRiesgo/Index', [
            'convocatoria'           => $convocatoria->only('id', 'esta_activa', 'fase_formateada', 'fase', 'tipo_convocatoria', 'mostrar_recomendaciones'),
            'proyecto'               => $proyecto->only('id', 'tipo_formulario_convocatoria_id', 'precio_proyecto', 'modificable', 'en_subsanacion', 'evaluaciones', 'mostrar_recomendaciones', 'PdfVersiones', 'all_files', 'allowed', 'tipo_proyecto'),
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

    /**
     * updateAnalisisRiesgosEvaluacion
     *
     * @param  mixed $request
     * @param  mixed $convocatoria
     * @param  mixed $evaluacion
     * @return void
     */
    public function updateAnalisisRiesgosEvaluacion(Request $request, Convocatoria $convocatoria, Evaluacion $evaluacion)
    {
        $this->authorize('modificar-evaluacion-autor', $evaluacion);

        switch ($evaluacion) {
            case $evaluacion->evaluacionProyectoFormulario8Linea66()->exists():
                $evaluacion->evaluacionProyectoFormulario8Linea66()->update([
                    'analisis_riesgos_puntaje'      => $request->analisis_riesgos_puntaje,
                    'analisis_riesgos_comentario'   => $request->analisis_riesgos_requiere_comentario == false ? $request->analisis_riesgos_comentario : null
                ]);
                break;
            case $evaluacion->evaluacionProyectoFormulario1Linea65()->exists():
                $evaluacion->evaluacionProyectoFormulario1Linea65()->update([
                    'analisis_riesgos_puntaje'      => $request->analisis_riesgos_puntaje,
                    'analisis_riesgos_comentario'   => $request->analisis_riesgos_requiere_comentario == false ? $request->analisis_riesgos_comentario : null
                ]);
                break;

            case $evaluacion->evaluacionProyectoFormulario4Linea70()->exists():
                $evaluacion->evaluacionProyectoFormulario4Linea70()->update([
                    'analisis_riesgos_comentario'   => $request->analisis_riesgos_requiere_comentario == false ? $request->analisis_riesgos_comentario : null
                ]);
                break;
            case $evaluacion->evaluacionProyectoFormulario5Linea69()->exists():
                $evaluacion->evaluacionProyectoFormulario5Linea69()->update([
                    'analisis_riesgos_comentario'   => $request->analisis_riesgos_requiere_comentario == false ? $request->analisis_riesgos_comentario : null
                ]);
                break;

            case $evaluacion->evaluacionProyectoFormulario12Linea68()->exists():
                $evaluacion->evaluacionProyectoFormulario12Linea68()->update([
                    'riesgos_objetivo_general_puntaje'      => $request->riesgos_objetivo_general_puntaje,
                    'riesgos_objetivo_general_comentario'   => $request->riesgos_objetivo_general_requiere_comentario == false ? $request->riesgos_objetivo_general_comentario : null,

                    'riesgos_productos_puntaje'             => $request->riesgos_productos_puntaje,
                    'riesgos_productos_comentario'          => $request->riesgos_productos_requiere_comentario == false ? $request->riesgos_productos_comentario : null,

                    'riesgos_actividades_puntaje'           => $request->riesgos_actividades_puntaje,
                    'riesgos_actividades_comentario'        => $request->riesgos_actividades_requiere_comentario == false ? $request->riesgos_actividades_comentario : null,
                ]);
                break;
            default:
                break;
        }

        $evaluacion->save();

        return back()->with('success', 'El recurso se ha actualizado correctamente.');
    }
}
