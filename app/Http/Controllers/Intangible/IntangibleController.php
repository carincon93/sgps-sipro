<?php

namespace App\Http\Controllers\Intangible;

use App\Models\Intangible\Intangible;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
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
            'intangibles'            => Intangible::orderBy('nombre', 'ASC')
                ->filterIntangible(request()->only('search'))->paginate()->appends(['search' => request()->search]),
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
        //
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
    public function update(Request $request, Intangible $intangible)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Intangible $intangible)
    {
        //
    }
}
