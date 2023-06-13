<?php

namespace App\Http\Controllers;

use App\Helpers\SharepointHelper;
use App\Helpers\SelectHelper;
use App\Http\Requests\AnexoRequest;
use App\Models\Anexo;
use App\Models\LineaProgramatica;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class AnexoController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $this->authorize('viewAny', [Anexo::class]);

        return Inertia::render('Anexos/Index', [
            'filters'  => request()->all('search'),
            'anexos'   => Anexo::orderBy('nombre', 'ASC')->with('convocatorias')
                ->filterAnexo(request()->only('search'))->paginate()->appends(['search' => request()->search]),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        $this->authorize('create', [Anexo::class]);

        return Inertia::render('Anexos/Create', [
            'lineasProgramaticas'   => LineaProgramatica::orderBy('nombre', 'ASC')->get(),
            'convocatorias'         => SelectHelper::convocatorias(),

        ]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(AnexoRequest $request)
    {
        $this->authorize('create', [Anexo::class]);

        $anexo = new Anexo();
        $anexo->nombre          = $request->nombre;
        $anexo->descripcion     = $request->descripcion;
        $anexo->obligatorio     = $request->obligatorio;
        $anexo->habilitado      = $request->habilitado;

        $anexo->save();

        $anexo->convocatorias()->sync($request->convocatoria_id);


        if ($request->hasFile('archivo')) {
            $this->saveFilesSharepoint($request, $anexo);
        }

        $anexo->lineasProgramaticas()->attach($request->linea_programatica_id);

        return redirect()->route('anexos.index')->with('success', 'El recurso se ha creado correctamente.');
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Anexo  $anexo
     * @return \Illuminate\Http\Response
     */
    public function show(Anexo $anexo)
    {
        $this->authorize('view', [Anexo::class, $anexo]);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Anexo  $anexo
     * @return \Illuminate\Http\Response
     */
    public function edit(Anexo $anexo)
    {
        $this->authorize('update', [Anexo::class, $anexo]);

        return Inertia::render('Anexos/Edit', [
            'anexo'                     => $anexo,
            'lineasProgramaticas'       => LineaProgramatica::orderBy('nombre', 'ASC')->get(),
            'anexoLineasProgramaticas'  => $anexo->lineasProgramaticas()->pluck('id'),
            'convocatorias'             => SelectHelper::convocatorias(),
            'convocatoriaAnexos'        => $anexo->convocatorias()->select('id as value', 'descripcion as label')->get()
        ]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Anexo  $anexo
     * @return \Illuminate\Http\Response
     */
    public function update(AnexoRequest $request, Anexo $anexo)
    {
        $this->authorize('update', [Anexo::class, $anexo]);

        $anexo->nombre          = $request->nombre;
        $anexo->descripcion     = $request->descripcion;
        $anexo->obligatorio     = $request->obligatorio;
        $anexo->habilitado      = $request->habilitado;

        $anexo->lineasProgramaticas()->sync($request->linea_programatica_id);

        $anexo->save();

        $anexo->convocatorias()->sync($request->convocatoria_id);

        if ($request->hasFile('archivo')) {
            $this->saveFilesSharepoint($request, $anexo);
        }

        return back()->with('success', 'El recurso se ha actualizado correctamente.');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Anexo  $anexo
     * @return \Illuminate\Http\Response
     */
    public function destroy(Anexo $anexo)
    {
        $this->authorize('delete', [Anexo::class, $anexo]);

        $anexo->delete();

        return redirect()->route('anexos.index')->with('success', 'El recurso se ha eliminado correctamente.');
    }

    public function saveFilesSharepoint(Request $request, Anexo $anexo)
    {
        $request->validate([
            'archivo' => 'nullable|file|max:10240',
        ]);

        $response = [];

        if ($request->hasFile('archivo')) {
            $response = SharepointHelper::saveFilesSharepoint($request, $request->nombre, $anexo, $anexo->id . 'archivo');
        }

        if (count($response) > 0 && $response['success']) {
            return back()->with('success', 'Los archivos se han cargado correctamente');
        } else if (count($response) > 0 && $response['success'] == false) {
            return back()->with('error', 'No se han podido cargar los archivos. Por favor vuelva a intentar');
        }
    }

    public function downloadServerFile(Request $request, Anexo $anexo)
    {
        SharepointHelper::downloadServerFile($anexo, $request->formato);
    }

    public function downloadFileSharepoint(Anexo $anexo, $tipoArchivo)
    {
        SharepointHelper::downloadFileSharepoint($anexo, $tipoArchivo);
    }
}
