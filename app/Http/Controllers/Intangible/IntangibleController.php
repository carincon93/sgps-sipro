<?php

namespace App\Http\Controllers\Intangible;

use App\Models\Intangible\Intangible;
use App\Http\Controllers\Controller;
use App\Http\Requests\Intangible\IntangibleRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class IntangibleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $this->authorize('viewAny', [Intangible::class]);

        return Inertia::render('Intangibles/Index', [
            'intangibles'            => Intangible::filterIntangible(request()->only('search'))->paginate()->appends(['search' => request()->search]),
            'tipos_intangibles'      => json_decode(Storage::get('json/tipos-intangibles.json'), true),

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
    public function store(IntangibleRequest $request)
    {
        $this->authorize('create', [Intangible::class]);

        $intangible = Intangible::create($request->validated());

        return back()->with('success', 'El recurso se ha creado correctamente.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Intangible $intangible)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Intangible $intangible)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(IntangibleRequest $request, Intangible $intangible)
    {
        $this->authorize('update', [Intangible::class, $intangible]);

        $intangible->update($request->validated());

        return back()->with('success', 'El recurso se ha actualizado correctamente.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Intangible $intangible)
    {
        $this->authorize('delete', [Intangible::class, $intangible]);

        $intangible->delete();

        return back()->with('success', 'El recurso se ha eliminado correctamente.');
    }
}
