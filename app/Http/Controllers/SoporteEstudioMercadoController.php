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
use Illuminate\Support\Facades\Storage;
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

        /**
         * Denega el acceso si el rubro no requiere de estudio de mercado.
         */
        if (!$presupuesto->convocatoriaPresupuesto->presupuestoSennova->requiere_estudio_mercado && $presupuesto->convocatoriaPresupuesto->presupuestoSennova->usoPresupuestal->codigo != '020202008005096') {
            return redirect()->route('convocatorias.proyectos.presupuesto.edit', [$convocatoria, $proyecto, $presupuesto])->with('warn', 'Este rubro presupuestal no requiere estudio de mercado.');
        }

        return Inertia::render('Convocatorias/Proyectos/ProyectoPresupuesto/SoportesEstudioMercado/Index', [
            'convocatoria'              => $convocatoria->only('id', 'esta_activa', 'fase_formateada', 'fase', 'tipo_convocatoria', 'year'),
            'proyecto'                  => $proyecto->only('id', 'modificable', 'mostrar_recomendaciones', 'allowed'),
            'proyectoPresupuesto'       => $presupuesto->load('convocatoriaPresupuesto.presupuestoSennova.usoPresupuestal'),
            'filters'                   => request()->all('search'),
            'soportesEstudioMercado'    => $presupuesto->soportesEstudioMercado,
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

        return back();

        /**
         * Denega el acceso si el rubro no requiere de estudio de mercado.
         */
        if (!$presupuesto->convocatoriaPresupuesto->presupuestoSennova->requiere_estudio_mercado && $presupuesto->convocatoriaPresupuesto->presupuestoSennova->usoPresupuestal->codigo != '020202008005096') {
            return redirect()->route('convocatorias.proyectos.presupuesto.index', [$convocatoria, $proyecto]);
        }

        return Inertia::render('Convocatorias/Proyectos/ProyectoPresupuesto/SoportesEstudioMercado/Create', [
            'convocatoria'              => $convocatoria->only('id', 'esta_activa', 'fase_formateada', 'fase', 'tipo_convocatoria'),
            'proyecto'                  => $proyecto->only('id', 'modificable', 'mostrar_recomendaciones', 'allowed'),
            'proyectoPresupuesto'       => $presupuesto->load('convocatoriaPresupuesto.presupuestoSennova.usoPresupuestal', 'soportesEstudioMercado'),
        ]);
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


        $soportePrimerEmpresa = SoporteEstudioMercado::updateOrCreate(['id' => $request->id_primer_empresa], [
            'empresa'                   => $request->nombre_primer_empresa,
            'proyecto_presupuesto_id'   => $presupuesto->id
        ]);

        if ($request->hasFile('soporte_primer_empresa')) {
            $this->saveFilesSharepoint($request->soporte_primer_empresa, mb_strtoupper($convocatoria->descripcion) . ' ' . $convocatoria->year, $soportePrimerEmpresa, 'soporte');
        }

        $soporteSegundaEmpresa = SoporteEstudioMercado::updateOrCreate(['id' => $request->id_segunda_empresa], [
            'empresa'                   => $request->nombre_segunda_empresa,
            'proyecto_presupuesto_id'   => $presupuesto->id
        ]);
        if ($request->hasFile('soporte_segunda_empresa')) {
            $this->saveFilesSharepoint($request->soporte_segunda_empresa, mb_strtoupper($convocatoria->descripcion) . ' ' . $convocatoria->year, $soporteSegundaEmpresa, 'soporte');
        }

        if ($request->hasFile('soporte_tercer_empresa')) {
            $request->validate([
                'nombre_tercer_empresa' => 'max:191|string',
                'soporte_tecer_empresa' => 'nullable|file|max:10000000|mimetypes:application/zip,application/octet-stream,application/x-zip-compressed,multipart/x-zip,application/pdf',

            ]);

            $soporteTerceraEmpresa = SoporteEstudioMercado::updateOrCreate(['id' => $request->id_tercer_empresa], [
                'empresa'                   => $request->nombre_tercer_empresa,
                'proyecto_presupuesto_id'   => $presupuesto->id
            ]);
            if ($request->hasFile('soporte_tercer_empresa')) {
                $this->saveFilesSharepoint($request->soporte_tercer_empresa, mb_strtoupper($convocatoria->descripcion) . ' ' . $convocatoria->year, $soporteTerceraEmpresa, 'soporte');
            }
        }

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

        return back();

        /**
         * Denega el acceso si el rubro no requiere de estudio de mercado.
         */
        if (!$presupuesto->convocatoriaPresupuesto->presupuestoSennova->requiere_estudio_mercado && $presupuesto->convocatoriaPresupuesto->presupuestoSennova->usoPresupuestal->codigo != '020202008005096') {
            return redirect()->route('convocatorias.proyectos.presupuesto.index', [$convocatoria, $proyecto]);
        }

        return Inertia::render('Convocatorias/Proyectos/ProyectoPresupuesto/SoportesEstudioMercado/Edit', [
            'convocatoria'          => $convocatoria->only('id', 'esta_activa', 'fase_formateada', 'fase', 'tipo_convocatoria'),
            'proyecto'              => $proyecto->only('id', 'modificable', 'mostrar_recomendaciones', 'allowed'),
            'proyectoPresupuesto'   => $presupuesto->load('convocatoriaPresupuesto.presupuestoSennova.usoPresupuestal'),
            'soporteEstudioMercado' => $soporte
        ]);
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

        $soporte->soporte = $request->soporte;
        $soporte->empresa = $request->empresa;
        $soporte->save();

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

    public function saveFilesSharepoint($tmpFile, $modulo, $modelo, $campoBd)
    {
        $estudioMercado = $modelo;
        $proyecto       = Proyecto::find($estudioMercado->proyectoPresupuesto->proyecto_id);

        $soporteEstudioMercadoSharePoint = $proyecto->centroFormacion->nombre_carpeta_sharepoint . '/' . $proyecto->lineaProgramatica->codigo . '/' . $proyecto->codigo . '/ESTUDIOS MERCADO/COTIZACIONES';

        $sharePointPath = "$modulo/$soporteEstudioMercadoSharePoint";

        SharepointHelper::saveFilesSharepoint($tmpFile, $modelo, $sharePointPath, $campoBd);
    }

    public function downloadServerFile(Request $request, Convocatoria $convocatoria, Proyecto $proyecto, ProyectoPresupuesto $presupuesto, SoporteEstudioMercado $soporte)
    {
        SharepointHelper::downloadServerFile($soporte, $request->formato);
    }

    public function downloadFileSharepoint(Convocatoria $convocatoria, Proyecto $proyecto, ProyectoPresupuesto $presupuesto, SoporteEstudioMercado $soporte, $tipoArchivo)
    {
        $sharePointPath = $soporte[$tipoArchivo];

        SharepointHelper::downloadFile($sharePointPath);
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function soportesEvaluacion(Convocatoria $convocatoria, Evaluacion $evaluacion, ProyectoPresupuesto $presupuesto)
    {
        $this->authorize('visualizar-evaluacion-autor', $evaluacion);

        /**
         * Denega el acceso si el rubro no requiere de estudio de mercado.
         */
        if (!$presupuesto->convocatoriaPresupuesto->presupuestoSennova->requiere_estudio_mercado && $presupuesto->convocatoriaPresupuesto->presupuestoSennova->usoPresupuestal->codigo != '020202008005096') {
            return back()->with('error', 'Este rubro presupuestal no requiere estudio de mercado.');
        }

        $evaluacion->proyecto;

        return Inertia::render('Convocatorias/Evaluaciones/ProyectoPresupuesto/SoportesEstudioMercado/Index', [
            'convocatoria'              => $convocatoria->only('id', 'esta_activa', 'fase_formateada', 'fase', 'tipo_convocatoria', 'year'),
            'proyecto'                  => $evaluacion->proyecto->only('id', 'modificable', 'mostrar_recomendaciones', 'allowed'),
            'proyectoPresupuesto'       => $presupuesto->load('convocatoriaPresupuesto.presupuestoSennova.usoPresupuestal'),
            'filters'                   => request()->all('search'),
            'soportesEstudioMercado'    => $presupuesto->soportesEstudioMercado,
            'evaluacion'                => $evaluacion->only('id', 'proyecto'),
        ]);
    }
}
