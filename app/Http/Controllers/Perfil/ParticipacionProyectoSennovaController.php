<?php

namespace App\Http\Controllers\Perfil;

use App\Models\Perfil\ParticipacionProyectoSennova;
use App\Http\Controllers\Controller;
use App\Http\Requests\Perfil\ParticipacionProyectoSennovaRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ParticipacionProyectoSennovaController extends Controller
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
        $this->authorize('create', [ParticipacionProyectoSennova::class]);

        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(ParticipacionProyectoSennovaRequest $request)
    {
        $this->authorize('create', [ParticipacionProyectoSennova::class]);

        $request->merge(['user_id' => Auth::user()->id]);

        $participacionPs = ParticipacionProyectoSennova::create($request->all());

        return back()->with('success', 'El recurso se ha creado correctamente.');
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\ParticipacionProyectoSennova  $participacionPs
     * @return \Illuminate\Http\Response
     */
    public function show(ParticipacionProyectoSennova $participacionPs)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\ParticipacionProyectoSennova  $participacionPs
     * @return \Illuminate\Http\Response
     */
    public function edit(ParticipacionProyectoSennova $participacionPs)
    {
        $this->authorize('update', [ParticipacionProyectoSennova::class, $participacionPs]);

        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\ParticipacionProyectoSennova  $participacionPs
     * @return \Illuminate\Http\Response
     */
    public function update(ParticipacionProyectoSennovaRequest $request, ParticipacionProyectoSennova $participacionPs)
    {
        $this->authorize('update', [ParticipacionProyectoSennova::class, $participacionPs]);

        $participacionPs->update($request->validated());

        return redirect()->back()->with('success', 'El recurso se ha actualizado correctamente.');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\ParticipacionProyectoSennova  $participacionPs
     * @return \Illuminate\Http\Response
     */
    public function destroy(ParticipacionProyectoSennova $participacionPs)
    {
        $this->authorize('delete', [ParticipacionProyectoSennova::class, $participacionPs]);

        $participacionPs->delete();

        return back()->with('success', 'El recurso se ha eliminado correctamente.');
    }
}
