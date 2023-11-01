<?php

namespace App\Http\Controllers;

use App\Helpers\SharepointHelper;
use App\Helpers\SelectHelper;
use App\Http\Requests\ProyectoAnexoRequest;
use App\Models\Convocatoria;
use App\Models\Proyecto;
use App\Models\Anexo;
use App\Models\ConvocatoriaAnexo;
use App\Models\Evaluacion\Evaluacion;
use App\Models\ProyectoAnexo;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ProyectoAnexoController extends Controller
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

        if (request()->filled('evaluacion_id')) {
            $evaluacion = Evaluacion::find(request()->evaluacion_id);

            $this->authorize('modificar-evaluacion-autor', [$evaluacion]);

            $items_evaluacion = $evaluacion->getItemsAEvaluar($convocatoria->id, $proyecto->tipo_formulario_convocatoria_id);
        }

        $proyecto->load('proyectoRolesSennova.proyectoRolesEvaluaciones', 'proyectoPresupuesto.proyectoPresupuestosEvaluaciones');
        // $proyecto->load('evaluaciones.evaluacionProyectoFormulario8Linea66');
        // $proyecto->load('evaluaciones.evaluacionProyectoFormulario4Linea70');

        $proyecto->tipoFormularioConvocatoria->lineaProgramatica;

        return Inertia::render('Convocatorias/Proyectos/Anexos/Index', [
            'convocatoria'          =>  $convocatoria->only('id', 'esta_activa', 'fase_formateada', 'fase', 'tipo_convocatoria', 'mostrar_recomendaciones'),
            'proyecto'              =>  $proyecto,
            'evaluacion'            => $items_evaluacion ?? [],
            'proyecto_anexo'        =>  $proyecto->proyectoAnexo()->select('proyecto_anexo.*', 'anexos.nombre')->join('convocatoria_anexos', 'proyecto_anexo.convocatoria_anexo_id', 'convocatoria_anexos.id')->join('anexos', 'convocatoria_anexos.anexo_id', 'anexos.id')->get(),
            'convocatoria_anexos'   =>  ConvocatoriaAnexo::where('convocatoria_id', $convocatoria->id)
                ->where('tipo_formulario_convocatoria_id', $proyecto->tipo_formulario_convocatoria_id)
                ->where('habilitado', true)
                ->with('anexo')
                ->get(),
            'mime_types'            => json_decode(Storage::get('json/mime-types.json'), true),
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
    public function store(ProyectoAnexoRequest $request, Convocatoria $convocatoria, Proyecto $proyecto)
    {
        $this->authorize('modificar-proyecto-autor', $proyecto);

        $proyecto_anexo = ProyectoAnexo::updateOrCreate(
            ['proyecto_id'  => $proyecto->id, 'convocatoria_anexo_id' => $request->convocatoria_anexo_id],
        );

        if ($request->hasFile('archivo')) {
            return $this->saveFilesSharepoint($request->archivo, mb_strtoupper($convocatoria->descripcion) . ' ' . $convocatoria->year, $proyecto_anexo, 'archivo');
        }

        return back()->with('success', 'El recurso se ha creado correctamente.');
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\ProyectoAnexo  $proyecto_anexo
     * @return \Illuminate\Http\Response
     */
    public function show(Convocatoria $convocatoria, Proyecto $proyecto, ProyectoAnexo $proyecto_anexo)
    {
        $this->authorize('visualizar-proyecto-autor', $proyecto);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\ProyectoAnexo  $proyecto_anexo
     * @return \Illuminate\Http\Response
     */
    public function edit(Convocatoria $convocatoria, Proyecto $proyecto, ProyectoAnexo $proyecto_anexo)
    {
        $this->authorize('visualizar-proyecto-autor', $proyecto);

        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\ProyectoAnexo  $proyecto_anexo
     * @return \Illuminate\Http\Response
     */
    public function update(ProyectoAnexoRequest $request, Convocatoria $convocatoria, Proyecto $proyecto, ProyectoAnexo $proyecto_anexo)
    {
        $this->authorize('modificar-proyecto-autor', $proyecto);

        return back()->with('success', 'El recurso se ha actualizado correctamente.');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\ProyectoAnexo  $proyecto_anexo
     * @return \Illuminate\Http\Response
     */
    public function destroy(Convocatoria $convocatoria, Proyecto $proyecto, ProyectoAnexo $proyecto_anexo)
    {
        $this->authorize('modificar-proyecto-autor', $proyecto);

        $proyecto_anexo->delete();

        return redirect()->route('convocatorias.proyectos.proyecto-anexos.index', [$convocatoria, $proyecto])->with('success', 'El recurso se ha eliminado correctamente.');
    }

    public function saveFilesSharepoint($tmp_file, $modulo, $modelo, $campo_bd)
    {
        $anexo              = $modelo;
        $proyecto           = Proyecto::find($anexo->proyecto_id);

        $sharepoint_anexo   = $proyecto->centroFormacion->nombre_carpeta_sharepoint . '/' . $proyecto->tipoFormularioConvocatoria->lineaProgramatica->codigo . '/' . $proyecto->codigo . '/ANEXOS';

        $sharepoint_path    = "$modulo/$sharepoint_anexo";

        SharepointHelper::saveFilesSharepoint($tmp_file, $modelo, $sharepoint_path, $campo_bd);
    }

    public function downloadServerFile(Request $request, Convocatoria $convocatoria, Proyecto $proyecto, ProyectoAnexo $proyecto_anexo)
    {
        SharepointHelper::downloadServerFile($proyecto_anexo, $request->formato);
    }

    public function downloadFileSharepoint(Convocatoria $convocatoria, Proyecto $proyecto, ProyectoAnexo $proyecto_anexo, $tipo_archivo)
    {
        $sharepoint_path = $proyecto_anexo[$tipo_archivo];

        return SharepointHelper::downloadFile($sharepoint_path);
    }
}
