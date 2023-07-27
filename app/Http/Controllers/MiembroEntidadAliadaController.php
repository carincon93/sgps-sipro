<?php

namespace App\Http\Controllers;

use App\Http\Requests\MiembroEntidadAliadaRequest;
use App\Models\Convocatoria;
use App\Models\Proyecto;
use App\Models\EntidadAliada;
use App\Models\Evaluacion\Evaluacion;
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
    public function index(Convocatoria $convocatoria, Proyecto $proyecto, EntidadAliada $entidad_aliada)
    {
        $this->authorize('visualizar-proyecto-autor', $proyecto);

        $proyecto->codigo_linea_programatica = $proyecto->lineaProgramatica->codigo;

        return Inertia::render('Convocatorias/Proyectos/EntidadesAliadas/MiembrosEntidadAliada/Index', [
            'convocatoria'              => $convocatoria->only('id', 'esta_activa', 'fase_formateada', 'fase', 'tipo_convocatoria'),
            'proyecto'                  => $proyecto->only('id', 'modificable', 'mostrar_recomendaciones', 'codigo_linea_programatica', 'allowed'),
            'evaluacion'                => Evaluacion::find(request()->evaluacion_id),
            'entidad_aliada'            => $entidad_aliada,
            'miembros_entidad_aliada'   => MiembroEntidadAliada::where('entidad_aliada_id', $entidad_aliada->id)->orderBy('nombre', 'ASC')
                                            ->filterMiembroEntidadAliada(request()->only('search'))->paginate()->appends(['search' => request()->search]),
            'tipos_documento'           => json_decode(Storage::get('json/tipos-documento.json'), true),

        ]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create(Convocatoria $convocatoria, Proyecto $proyecto, EntidadAliada $entidad_aliada)
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
    public function store(MiembroEntidadAliadaRequest $request, Convocatoria $convocatoria, Proyecto $proyecto, EntidadAliada $entidad_aliada)
    {
        $this->authorize('modificar-proyecto-autor', $proyecto);

        $request->merge(['entidad_aliada_id' => $entidad_aliada->id]);
        $miembro_entidad_aliada = MiembroEntidadAliada::create($request->all());

        return redirect()->route('convocatorias.proyectos.entidades-aliadas.edit', [$convocatoria, $proyecto, $entidad_aliada])->with('success', 'El recurso se ha creado correctamente.');
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\MiembroEntidadAliada  $miembro_entidad_aliada
     * @return \Illuminate\Http\Response
     */
    public function show(Convocatoria $convocatoria, Proyecto $proyecto, EntidadAliada $entidad_aliada, MiembroEntidadAliada $miembro_entidad_aliada)
    {
        $this->authorize('visualizar-proyecto-autor', $proyecto);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\MiembroEntidadAliada  $miembro_entidad_aliada
     * @return \Illuminate\Http\Response
     */
    public function edit(Convocatoria $convocatoria, Proyecto $proyecto, EntidadAliada $entidad_aliada, MiembroEntidadAliada $miembro_entidad_aliada)
    {
        $this->authorize('visualizar-proyecto-autor', $proyecto);

        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\MiembroEntidadAliada  $miembro_entidad_aliada
     * @return \Illuminate\Http\Response
     */
    public function update(MiembroEntidadAliadaRequest $request, Convocatoria $convocatoria, Proyecto $proyecto, EntidadAliada $entidad_aliada, MiembroEntidadAliada $miembro_entidad_aliada)
    {
        $this->authorize('modificar-proyecto-autor', $proyecto);

        $miembro_entidad_aliada->update($request->all());
        $miembro_entidad_aliada->save();

        return back()->with('success', 'El recurso se ha actualizado correctamente.');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\MiembroEntidadAliada  $miembro_entidad_aliada
     * @return \Illuminate\Http\Response
     */
    public function destroy(Convocatoria $convocatoria, Proyecto $proyecto, EntidadAliada $entidad_aliada, MiembroEntidadAliada $miembro_entidad_aliada)
    {
        $this->authorize('modificar-proyecto-autor', $proyecto);

        $miembro_entidad_aliada->delete();

        return redirect()->back()->with('success', 'El recurso se ha eliminado correctamente.');
    }
}
