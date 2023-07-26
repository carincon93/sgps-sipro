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
        $rubrosRequierenEstudioMercado = true;
        $data = $presupuesto->convocatoriaProyectoRubrosPresupuestales()->select('convocatoria_presupuesto.id', 'convocatoria_presupuesto.requiere_estudio_mercado')->get()->pluck(['requiere_estudio_mercado']);

        foreach ($data as $item) {
            if (!$item) {
                $rubrosRequierenEstudioMercado = false;
                break;
            }
        }
        if (!$rubrosRequierenEstudioMercado) {
            return redirect()->route('convocatorias.proyectos.presupuesto.index', [$convocatoria, $proyecto]);
        }

        return Inertia::render('Convocatorias/Proyectos/ProyectoPresupuesto/SoportesEstudioMercado/Index', [
            'convocatoria'              => $convocatoria->only('id', 'esta_activa', 'fase_formateada', 'fase', 'tipo_convocatoria', 'year'),
            'proyecto'                  => $proyecto->only('id', 'modificable', 'mostrar_recomendaciones', 'allowed'),
            'proyectoPresupuesto'       => $presupuesto->load('convocatoriaProyectoRubrosPresupuestales.presupuestoSennova.usoPresupuestal'),
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

    public function saveFilesSharepoint($tmp_file, $modulo, $modelo, $campo_bd)
    {
        $estudioMercado = $modelo;
        $proyecto       = Proyecto::find($estudioMercado->proyectoPresupuesto->proyecto_id);

        $soporteEstudioMercadoSharePoint = $proyecto->centroFormacion->nombre_carpeta_sharepoint . '/' . $proyecto->lineaProgramatica->codigo . '/' . $proyecto->codigo . '/ESTUDIOS MERCADO/COTIZACIONES';

        $sharepoint_path = "$modulo/$soporteEstudioMercadoSharePoint";

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
