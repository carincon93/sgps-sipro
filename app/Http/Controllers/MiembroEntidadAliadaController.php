<?php

namespace App\Http\Controllers;

use App\Http\Requests\MiembroEntidadAliadaRequest;
use App\Models\Convocatoria;
use App\Models\Proyecto;
use App\Models\EntidadAliada;
use App\Models\MiembroEntidadAliada;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class MiembroEntidadAliadaController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Convocatoria $convocatoria, Proyecto $proyecto, EntidadAliada $entidadAliada)
    {
        $this->authorize('visualizar-proyecto-autor', $proyecto);

        // if ($proyecto->idi()->exists() && $proyecto->lineaProgramatica->codigo == 66 || $proyecto->idi()->exists() && $proyecto->lineaProgramatica->codigo == 82) {
            return Inertia::render('Convocatorias/Proyectos/EntidadesAliadas/MiembrosEntidadAliada/Index', [
                'convocatoria'          => $convocatoria->only('id', 'esta_activa', 'fase_formateada', 'fase', 'tipo_convocatoria'),
                'proyecto'              => $proyecto->only('id', 'modificable', 'mostrar_recomendaciones', 'allowed'),
                'entidadAliada'         => $entidadAliada,
                'filters'               => request()->all('search'),
                'miembrosEntidadAliada' => MiembroEntidadAliada::where('entidad_aliada_id', $entidadAliada->id)->orderBy('nombre', 'ASC')
                    ->filterMiembroEntidadAliada(request()->only('search'))->paginate()->appends(['search' => request()->search]),
                'tiposDocumento'        => json_decode(Storage::get('json/tipos-documento.json'), true),

            ]);
        // }
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create(Convocatoria $convocatoria, Proyecto $proyecto, EntidadAliada $entidadAliada)
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
    public function store(MiembroEntidadAliadaRequest $request, Convocatoria $convocatoria, Proyecto $proyecto, EntidadAliada $entidadAliada)
    {
        $this->authorize('modificar-proyecto-autor', $proyecto);

        $request->merge(['entidad_aliada_id' => $entidadAliada->id]);
        $miembroEntidadAliada = MiembroEntidadAliada::create($request->all());

        return redirect()->route('convocatorias.proyectos.entidades-aliadas.edit', [$convocatoria, $proyecto, $entidadAliada])->with('success', 'El recurso se ha creado correctamente.');
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\MiembroEntidadAliada  $miembroEntidadAliada
     * @return \Illuminate\Http\Response
     */
    public function show(Convocatoria $convocatoria, Proyecto $proyecto, EntidadAliada $entidadAliada, MiembroEntidadAliada $miembroEntidadAliada)
    {
        $this->authorize('visualizar-proyecto-autor', $proyecto);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\MiembroEntidadAliada  $miembroEntidadAliada
     * @return \Illuminate\Http\Response
     */
    public function edit(Convocatoria $convocatoria, Proyecto $proyecto, EntidadAliada $entidadAliada, MiembroEntidadAliada $miembroEntidadAliada)
    {
        $this->authorize('visualizar-proyecto-autor', $proyecto);

        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\MiembroEntidadAliada  $miembroEntidadAliada
     * @return \Illuminate\Http\Response
     */
    public function update(MiembroEntidadAliadaRequest $request, Convocatoria $convocatoria, Proyecto $proyecto, EntidadAliada $entidadAliada, MiembroEntidadAliada $miembroEntidadAliada)
    {
        $this->authorize('modificar-proyecto-autor', $proyecto);

        $miembroEntidadAliada->update($request->all());
        $miembroEntidadAliada->save();

        return back()->with('success', 'El recurso se ha actualizado correctamente.');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\MiembroEntidadAliada  $miembroEntidadAliada
     * @return \Illuminate\Http\Response
     */
    public function destroy(Convocatoria $convocatoria, Proyecto $proyecto, EntidadAliada $entidadAliada, MiembroEntidadAliada $miembroEntidadAliada)
    {
        $this->authorize('modificar-proyecto-autor', $proyecto);

        $miembroEntidadAliada->delete();

        return redirect()->back()->with('success', 'El recurso se ha eliminado correctamente.');
    }
}
