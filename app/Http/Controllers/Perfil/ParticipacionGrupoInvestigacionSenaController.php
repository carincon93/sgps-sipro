<?php

namespace App\Http\Controllers\Perfil;

use App\Models\Perfil\ParticipacionGrupoInvestigacionSena;
use App\Http\Controllers\Controller;
use App\Http\Requests\Perfil\ParticipacionGrupoInvestigacionSenaRequest;
use App\Models\GrupoInvestigacion;
use App\Models\SemilleroInvestigacion;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ParticipacionGrupoInvestigacionSenaController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        // 
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        $this->authorize('create', [ParticipacionGrupoInvestigacionSena::class]);

        return Inertia::render('Users/Perfil/ParticipacionesGruposInvestigacionSena/Create', [
            'gruposInvestigacion'      => GrupoInvestigacion::selectRaw('grupos_investigacion.id as value, concat(grupos_investigacion.nombre, chr(10), \'∙ Código: \', grupos_investigacion.codigo_minciencias) as label')->orderBy('grupos_investigacion.nombre', 'ASC')->get(),
            'semillerosInvestigacion'  => SemilleroInvestigacion::selectRaw('semilleros_investigacion.id as value, concat(semilleros_investigacion.nombre, chr(10), \'∙ Código: \', semilleros_investigacion.codigo) as label')->orderBy('semilleros_investigacion.nombre', 'ASC')->get(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(ParticipacionGrupoInvestigacionSenaRequest $request)
    {
        $this->authorize('create', [ParticipacionGrupoInvestigacionSena::class]);

        $request->merge(['user_id' => Auth::user()->id]);

        $participacionGis = ParticipacionGrupoInvestigacionSena::create($request->all());

        return redirect()->route('users.change-user-profile')->with('success', 'El recurso se ha creado correctamente.');
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\ParticipacionGrupoInvestigacionSena  $participacionGis
     * @return \Illuminate\Http\Response
     */
    public function show(ParticipacionGrupoInvestigacionSena $participacionGis)
    {
        // 
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\ParticipacionGrupoInvestigacionSena  $participacionGis
     * @return \Illuminate\Http\Response
     */
    public function edit(ParticipacionGrupoInvestigacionSena $participacionGis)
    {
        $this->authorize('update', [ParticipacionGrupoInvestigacionSena::class, $participacionGis]);

        return Inertia::render('Users/Perfil/ParticipacionesGruposInvestigacionSena/Edit', [
            'participacionGrupoInvestigacionSena'   => $participacionGis,
            'gruposInvestigacion'                   => GrupoInvestigacion::selectRaw('grupos_investigacion.id as value, concat(grupos_investigacion.nombre, chr(10), \'∙ Código: \', grupos_investigacion.codigo_minciencias) as label')->orderBy('grupos_investigacion.nombre', 'ASC')->get(),
            'semillerosInvestigacion'               => SemilleroInvestigacion::selectRaw('semilleros_investigacion.id as value, concat(semilleros_investigacion.nombre, chr(10), \'∙ Código: \', semilleros_investigacion.codigo) as label')->orderBy('semilleros_investigacion.nombre', 'ASC')->get(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\ParticipacionGrupoInvestigacionSena  $participacionGis
     * @return \Illuminate\Http\Response
     */
    public function update(ParticipacionGrupoInvestigacionSenaRequest $request, ParticipacionGrupoInvestigacionSena $participacionGis)
    {
        $this->authorize('update', [ParticipacionGrupoInvestigacionSena::class, $participacionGis]);

        $participacionGis->update($request->validated());

        return redirect()->back()->with('success', 'El recurso se ha actualizado correctamente.');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\ParticipacionGrupoInvestigacionSena  $participacionGis
     * @return \Illuminate\Http\Response
     */
    public function destroy(ParticipacionGrupoInvestigacionSena $participacionGis)
    {
        $this->authorize('delete', [ParticipacionGrupoInvestigacionSena::class, $participacionGis]);

        $participacionGis->delete();

        return redirect()->route('users.change-user-profile')->with('success', 'El recurso se ha eliminado correctamente.');
    }
}
