<?php

namespace App\Http\Controllers;

use App\Helpers\SharepointHelper;
use App\Models\SoporteEstudioMercado;
use App\Http\Controllers\Controller;
use App\Http\Requests\SoporteEstudioMercadoRequest;
use App\Models\Convocatoria;
use App\Models\Evaluacion\Evaluacion;
use App\Models\Proyecto;
use App\Models\ProyectoPresupuesto;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SoporteEstudioMercadoController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Convocatoria $convocatoria, Proyecto $proyecto, ProyectoPresupuesto $presupuesto)
    {
        $this->authorize('visualizar-proyecto-autor', $proyecto);

        if ($proyecto->convocatoria_id != $convocatoria->id) {
            return abort(404);
        }

        /**
         * Denega el acceso si el rubro no requiere de estudio de mercado.
         */
        $rubros_requieren_estudio_mercado = true;
        $data = $presupuesto->convocatoriaProyectoRubrosPresupuestales()->select('convocatoria_presupuesto.id', 'convocatoria_presupuesto.requiere_estudio_mercado')->get()->pluck(['requiere_estudio_mercado']);

        foreach ($data as $item) {
            if (!$item) {
                $rubros_requieren_estudio_mercado = false;
                break;
            }
        }
        if (!$rubros_requieren_estudio_mercado) {
            return redirect()->route('convocatorias.proyectos.presupuesto.index', [$convocatoria, $proyecto]);
        }

        $proyecto->tipoFormularioConvocatoria->lineaProgramatica;
        $presupuesto->rubroPresupuestalProyectoLinea68;
        $presupuesto->load('convocatoriaProyectoRubrosPresupuestales.rubroPresupuestal.segundoGrupoPresupuestal', 'convocatoriaProyectoRubrosPresupuestales.rubroPresupuestal.usoPresupuestal');

        return Inertia::render('Convocatorias/Proyectos/ProyectoPresupuesto/SoportesEstudioMercado/Index', [
            'convocatoria'              => $convocatoria->only('id', 'esta_activa', 'fase_formateada', 'fase', 'tipo_convocatoria', 'year'),
            'proyecto'                  => $proyecto,
            'evaluacion'                => Evaluacion::find(request()->evaluacion_id),
            'proyecto_presupuesto'      => $presupuesto,
            'soportes_estudio_mercado'  => $presupuesto->soportesEstudioMercado,
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
    public function store(SoporteEstudioMercadoRequest $request, Convocatoria $convocatoria, Proyecto $proyecto, ProyectoPresupuesto $presupuesto)
    {
        $this->authorize('modificar-proyecto-autor', $proyecto);

        $empresa = $presupuesto->soportesEstudioMercado()->create([
            'concepto' => $request->concepto,
        ]);

        return back()->with('success', 'El recurso se ha creado correctamente.');
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\SoporteEstudioMercado  $soporte
     * @return \Illuminate\Http\Response
     */
    public function show(Convocatoria $convocatoria, Proyecto $proyecto, ProyectoPresupuesto $presupuesto, SoporteEstudioMercado $soporte)
    {
        $this->authorize('visualizar-proyecto-autor', $proyecto);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\SoporteEstudioMercado  $soporte
     * @return \Illuminate\Http\Response
     */
    public function edit(Convocatoria $convocatoria, Proyecto $proyecto, ProyectoPresupuesto $presupuesto, SoporteEstudioMercado $soporte)
    {
        $this->authorize('visualizar-proyecto-autor', $proyecto);

        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\SoporteEstudioMercado  $soporte
     * @return \Illuminate\Http\Response
     */
    public function update(SoporteEstudioMercadoRequest $request, Convocatoria $convocatoria, Proyecto $proyecto, ProyectoPresupuesto $presupuesto, SoporteEstudioMercado $soporte)
    {
        $this->authorize('modificar-proyecto-autor', $proyecto);

        $emrpesa = $soporte->update([
            'concepto' => $request->concepto
        ]);

        return back()->with('success', 'El recurso se ha actualizado correctamente.');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\SoporteEstudioMercado  $soporte
     * @return \Illuminate\Http\Response
     */
    public function destroy(Convocatoria $convocatoria, Proyecto $proyecto, ProyectoPresupuesto $presupuesto, SoporteEstudioMercado $soporte)
    {
        $this->authorize('modificar-proyecto-autor', $proyecto);

        SharepointHelper::deleteFile($soporte->soporte);
        $soporte->delete();

        return redirect()->route('convocatorias.proyectos.presupuesto.soportes.index', [$convocatoria, $proyecto, $presupuesto])->with('success', 'El recurso se ha eliminado correctamente.');
    }

    public function uploadSoporte(Request $request, Convocatoria $convocatoria, Proyecto $proyecto, ProyectoPresupuesto $presupuesto, SoporteEstudioMercado $soporte)
    {
        if ($request->hasFile('soporte')) {
            return $this->saveFilesSharepoint($request->soporte, mb_strtoupper($convocatoria->descripcion) . ' ' . $convocatoria->year, $soporte, 'soporte');
        }

        return back()->with('success', 'El soporte se ha cargado correctamente.');
    }

    public function soporteEstudioMercadoProyectoLinea68(SoporteEstudioMercadoRequest $request, Convocatoria $convocatoria, Proyecto $proyecto, ProyectoPresupuesto $presupuesto)
    {
        $this->authorize('modificar-proyecto-autor', $proyecto);

        $soporte = SoporteEstudioMercado::updateOrCreate(['id' => $request->id_estudio_mercado], [
            'concepto'                  => $request->conceptos_tecnicos,
            'proyecto_presupuesto_id'   => $presupuesto->id
        ]);

        if ($request->hasFile('soporte')) {
            return $this->saveFilesSharepoint($request->soporte, mb_strtoupper($convocatoria->descripcion) . ' ' . $convocatoria->year, $soporte, 'soporte');
        }

        return back()->with('success', 'El recurso se ha creado correctamente.');
    }

    public function saveFilesSharepoint($tmp_file, $modulo, $modelo, $campo_bd)
    {
        $estudio_mercado = $modelo;
        $proyecto        = Proyecto::find($estudio_mercado->proyectoPresupuesto->proyecto_id);

        $sharepoint_soporte_estudio_mercado = $proyecto->centroFormacion->nombre_carpeta_sharepoint . '/' . $proyecto->tipoFormularioConvocatoria->lineaProgramatica->codigo . '/' . $proyecto->codigo . '/ESTUDIOS MERCADO/COTIZACIONES';

        $sharepoint_path = "$modulo/$sharepoint_soporte_estudio_mercado";

        SharepointHelper::saveFilesSharepoint($tmp_file, $modelo, $sharepoint_path, $campo_bd);
    }

    public function downloadServerFile(Request $request, Convocatoria $convocatoria, Proyecto $proyecto, ProyectoPresupuesto $presupuesto, SoporteEstudioMercado $soporte)
    {
        SharepointHelper::downloadServerFile($soporte, $request->formato);
    }

    public function downloadFileSharepoint(Convocatoria $convocatoria, Proyecto $proyecto, ProyectoPresupuesto $presupuesto, SoporteEstudioMercado $soporte, $tipo_archivo)
    {
        $sharepoint_path = $soporte[$tipo_archivo];

        return SharepointHelper::downloadFile($sharepoint_path);
    }
}
