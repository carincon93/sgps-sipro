<?php

namespace App\Http\Controllers\API;

use App\Models\ReglaRolCultura;
use App\Http\Controllers\Controller;
use App\Http\Resources\ReglaRolCulturaResource;
use App\Http\Requests\ReglaRolCulturaRequest;
use Illuminate\Http\Request;

class ReglaRolCulturaController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return ReglaRolCulturaResource::collection(ReglaRolCultura::orderBy('fieldName')->get());
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(ReglaRolCulturaRequest $request)
    {
        $this->authorize('create', [ReglaRolCultura::class]);

        $reglaRolCultura = new ReglaRolCultura();
        $reglaRolCultura->fieldName = $request->get('fieldName');
        $reglaRolCultura->fieldName = $request->get('fieldName');
        $reglaRolCultura->fieldName = $request->get('fieldName');

        $reglaRolCultura->save();

        return new ReglaRolCulturaResource($reglaRolCultura);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\ReglaRolCultura  $reglaRolCultura
     * @return \Illuminate\Http\Response
     */
    public function show(ReglaRolCultura $reglaRolCultura)
    {
        $this->authorize('view', [ReglaRolCultura::class]);

        return new ReglaRolCulturaResource($reglaRolCultura);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\ReglaRolCultura  $reglaRolCultura
     * @return \Illuminate\Http\Response
     */
    public function update(ReglaRolCulturaRequest $request, ReglaRolCultura $reglaRolCultura)
    {
        $this->authorize('update', [ReglaRolCultura::class]);

        $reglaRolCultura->fieldName = $request->get('fieldName');
        $reglaRolCultura->fieldName = $request->get('fieldName');
        $reglaRolCultura->fieldName = $request->get('fieldName');

        $reglaRolCultura->save();

        return new ReglaRolCulturaResource($reglaRolCultura);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\ReglaRolCultura  $reglaRolCultura
     * @return \Illuminate\Http\Response
     */
    public function destroy(ReglaRolCultura $reglaRolCultura)
    {
        $this->authorize('delete', [ReglaRolCultura::class]);

        $reglaRolCultura->delete();

        return response()->json(null, 204);
    }
}
