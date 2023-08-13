<?php

namespace App\Http\Controllers;

use App\Models\HubInnovacion;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Gate;

class HubInnovacionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
         $this->authorize('viewAny', [HubInnovacion::class]);

        return Inertia::render('HubsInnovacion/Index', [
            'hubs_innovacion'       =>  HubInnovacion::filterHubInnovacion(request()->only('search'))->orderBy('nombre')->paginate(),
            'allowed_to_create'     =>  Gate::inspect('create', [HubInnovacion::class])->allowed()
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $hub_innovacion = HubInnovacion::create($request->all());

        return back()->with('success', 'El recurso se ha creado correctamente.');
    }

    /**
     * Display the specified resource.
     */
    public function show(HubInnovacion $hub_innovacion)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(HubInnovacion $hub_innovacion)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, HubInnovacion $hub_innovacion)
    {
        $hub_innovacion->update($request->all());

        return back()->with('success', 'El recurso se ha modificado correctamente.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(HubInnovacion $hub_innovacion)
    {
        $hub_innovacion->delete();

        return back()->with('success', 'El recurso se ha creado correctamente.');
    }
}
