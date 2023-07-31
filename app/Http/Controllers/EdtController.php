<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\EdtRequest;
use App\Models\Convocatoria;
use App\Models\Edt;
use App\Models\Evaluacion\Evaluacion;
use App\Models\Evaluacion\EvaluacionProyectoLinea70;
use App\Models\Proyecto;
use App\Models\ProyectoPresupuesto;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class EdtController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Convocatoria $convocatoria, Proyecto $proyecto, ProyectoPresupuesto $presupuesto)
    {
        $this->authorize('visualizar-proyecto-autor', $proyecto);

        $proyecto->load('evaluaciones.evaluacionProyectoLinea70');


        $proyecto->codigo_linea_programatica = $proyecto->lineaProgramatica->codigo;

        /**
         * Si el proyecto es diferente de la línea programática 70 se prohibe el acceso. No requiere de edt
         */
        if ($proyecto->codigo_linea_programatica != 70) {
            return redirect()->route('convocatorias.proyectos.presupuesto.index', [$convocatoria, $proyecto])->with('error', 'Esta línea programática no requiere de edt');
        }

        return Inertia::render('Convocatorias/Proyectos/EDT/Index', [
            'convocatoria'          => $convocatoria->only('id', 'esta_activa', 'fase_formateada', 'fase', 'tipo_convocatoria'),
            'proyecto'              => $proyecto->only('id', 'codigo_linea_programatica', 'precio_proyecto', 'modificable',  'evaluaciones', 'mostrar_recomendaciones', 'PdfVersiones', 'all_files', 'allowed'),
            'evaluacion'            => Evaluacion::find(request()->evaluacion_id),
            'presupuesto'           => $presupuesto,
            'eventos'               => Edt::with('proyectoPresupuesto')->orderBy('descripcion_evento', 'ASC')->where('ta_id', $proyecto->id)
                                        ->filterEdt(request()->only('search'))->paginate(),
            'tiposEvento'           => json_decode(Storage::get('json/tipos-edt.json'), true),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create(Convocatoria $convocatoria, Proyecto $proyecto, ProyectoPresupuesto $presupuesto)
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
    public function store(EdtRequest $request, Convocatoria $convocatoria, Proyecto $proyecto, ProyectoPresupuesto $presupuesto)
    {
        $this->authorize('modificar-proyecto-autor', $proyecto);

        $request->merge(['ta_id' => $proyecto->id, 'proyecto_presupuesto_id' => $presupuesto->id]);
        $edt = Edt::create($request->all());

        return redirect()->route('convocatorias.proyectos.presupuesto.edt.index', [$convocatoria, $proyecto, $presupuesto])->with('success', 'El recurso se ha creado correctamente.');
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show(Convocatoria $convocatoria, Proyecto $proyecto, ProyectoPresupuesto $presupuesto, Edt $edt)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit(Convocatoria $convocatoria, Proyecto $proyecto, ProyectoPresupuesto $presupuesto, Edt $edt)
    {
        $this->authorize('visualizar-proyecto-autor', $proyecto);

        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(EdtRequest $request, Convocatoria $convocatoria, Proyecto $proyecto, ProyectoPresupuesto $presupuesto, Edt $edt)
    {
        $edt->update($request->all());
        $edt->save();

        return back()->with('success', 'El recurso se ha actualizado correctamente.');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(Convocatoria $convocatoria, Proyecto $proyecto, ProyectoPresupuesto $presupuesto, Edt $edt)
    {
        $this->authorize('modificar-proyecto-autor', $proyecto);

        $edt->delete();

        return redirect()->route('convocatorias.proyectos.presupuesto.edt.index', [$convocatoria, $proyecto, $presupuesto])->with('success', 'El recurso se ha eliminado correctamente.');
    }

    /**
     * updateEdtEvaluacion
     *
     * @param  mixed $request
     * @param  mixed $convocatoria
     * @param  mixed $evaluacion
     * @return void
     */
    public function updateEdtEvaluacion(Request $request, Convocatoria $convocatoria, Evaluacion $evaluacion)
    {
        $this->authorize('modificar-evaluacion-autor', $evaluacion);

        $evaluacion->evaluacionProyectoLinea70()->update([
            'edt_comentario'   => $request->edt_requiere_comentario == false ? $request->edt_comentario : null
        ]);

        return back()->with('success', 'El recurso se ha actualizado correctamente.');
    }
}
