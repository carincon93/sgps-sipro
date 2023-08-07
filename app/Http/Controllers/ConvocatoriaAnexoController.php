<?php

namespace App\Http\Controllers;

use App\Helpers\SharepointHelper;
use App\Helpers\SelectHelper;
use App\Http\Requests\ConvocatoriaAnexoRequest;
use App\Models\Anexo;
use App\Models\ConvocatoriaAnexo;
use App\Models\Convocatoria;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ConvocatoriaAnexoController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Convocatoria $convocatoria)
    {
        $this->authorize('viewAny', [ConvocatoriaAnexo::class]);

        return Inertia::render('Convocatorias/ConvocatoriaAnexos/Index', [
            'convocatoria'          => $convocatoria,
            'convocatoria_anexos'   => $convocatoria->convocatoriaAnexos()->with('anexo', 'lineaProgramatica')   ->where('convocatoria_anexos.linea_programatica_id', request()->linea_programatica_id)->get(),
            'anexos'                => Anexo::select('anexos.id as value', 'anexos.nombre as label')->get(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        $this->authorize('create', [ConvocatoriaAnexo::class]);

        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(ConvocatoriaAnexoRequest $request, Convocatoria $convocatoria)
    {
        $this->authorize('create', [ConvocatoriaAnexo::class]);

        $convocatoria_anexo = $convocatoria->convocatoriaAnexos()->create($request->validated());

        if ($request->hasFile('archivo')) {
            $this->saveFilesSharepoint($request, $convocatoria_anexo);
        }

        return back()->with('success', 'El recurso se ha creado correctamente.');
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\ConvocatoriaAnexo  $convocatoria_anexo
     * @return \Illuminate\Http\Response
     */
    public function show(ConvocatoriaAnexo $convocatoria_anexo)
    {
        $this->authorize('view', [ConvocatoriaAnexo::class, $convocatoria_anexo]);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\ConvocatoriaAnexo  $convocatoria_anexo
     * @return \Illuminate\Http\Response
     */
    public function edit(ConvocatoriaAnexo $convocatoria_anexo)
    {
        $this->authorize('update', [ConvocatoriaAnexo::class, $convocatoria_anexo]);

        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\ConvocatoriaAnexo  $convocatoria_anexo
     * @return \Illuminate\Http\Response
     */
    public function update(ConvocatoriaAnexoRequest $request, Convocatoria $convocatoria, ConvocatoriaAnexo $convocatoria_anexo)
    {
        $this->authorize('update', [ConvocatoriaAnexo::class, $convocatoria_anexo]);

        $convocatoria_anexo->update($request->validated());
        $convocatoria_anexo->save();


        if ($request->hasFile('archivo')) {
            $this->saveFilesSharepoint($request, $convocatoria_anexo);
        }

        return back()->with('success', 'El recurso se ha actualizado correctamente.');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\ConvocatoriaAnexo  $convocatoria_anexo
     * @return \Illuminate\Http\Response
     */
    public function destroy(Convocatoria $convocatoria, ConvocatoriaAnexo $convocatoria_anexo)
    {
        $this->authorize('delete', [ConvocatoriaAnexo::class, $convocatoria_anexo]);

        $convocatoria_anexo->delete();

        return back()->with('success', 'El recurso se ha eliminado correctamente.');
    }

    public function saveFilesSharepoint(Request $request, ConvocatoriaAnexo $convocatoria_anexo)
    {
        $request->validate([
            'archivo' => 'nullable|file|max:10240',
        ]);

        $response = [];

        if ($request->hasFile('archivo')) {
            $response = SharepointHelper::saveFilesSharepoint($request, $request->nombre, $convocatoria_anexo, $convocatoria_anexo->id . 'archivo');
        }

        if (count($response) > 0 && $response['success']) {
            return back()->with('success', 'Los archivos se han cargado correctamente');
        } else if (count($response) > 0 && $response['success'] == false) {
            return back()->with('error', 'No se han podido cargar los archivos. Por favor vuelva a intentar');
        }
    }

    public function downloadServerFile(Request $request, ConvocatoriaAnexo $convocatoria_anexo)
    {
        SharepointHelper::downloadServerFile($convocatoria_anexo, $request->formato);
    }

    public function downloadFileSharepoint(ConvocatoriaAnexo $convocatoria_anexo, $tipo_archivo)
    {
        $sharepoint_path = $convocatoria_anexo[$tipo_archivo];

        return SharepointHelper::downloadFile($sharepoint_path);
    }

    public function cambiarEstados(Request $request, Convocatoria $convocatoria, ConvocatoriaAnexo $convocatoria_anexo)
    {
        $this->authorize('update', [ConvocatoriaAnexo::class, $convocatoria_anexo]);

        if ($request->has('habilitado')) {
            $convocatoria_anexo->update(['habilitado' => $request->habilitado]);
        }

        if ($request->has('obligatorio')) {
            $convocatoria_anexo->update(['obligatorio' => $request->obligatorio]);
        }

        return back()->with('success', 'El recurso se ha actualizado correctamente.');
    }
}
