<?php

namespace App\Http\Controllers;

use App\Models\ReglaRolCultura;
use App\Http\Controllers\Controller;
use App\Http\Requests\ReglaRolCulturaRequest;
use App\Models\CentroFormacion;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReglaRolCulturaController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $this->authorize('viewAny', [ReglaRolCultura::class]);

        return Inertia::render('ReglasRolesCultura/Index', [
            'filters'               => request()->all('search'),
            'reglasRolesCultura'    => ReglaRolCultura::select('reglas_roles_cultura.id', 'centros_formacion.nombre as nombre_centro_formacion', 'centros_formacion.codigo')->join('centros_formacion', 'reglas_roles_cultura.centro_formacion_id', 'centros_formacion.id')->orderBy('centros_formacion.nombre', 'ASC')
                ->filterReglaRolCultura(request()->only('search'))->paginate()->appends(['search' => request()->search]),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        $this->authorize('create', [ReglaRolCultura::class]);

        return Inertia::render('ReglasRolesCultura/Create', [
            'centrosFormacion' => CentroFormacion::selectRaw('centros_formacion.id as value, concat(centros_formacion.nombre, chr(10), \'∙ Código: \', centros_formacion.codigo) as label')->orderBy('centros_formacion.nombre', 'ASC')->get()
        ]);
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

        $reglaRolCultura->auxiliar_editorial = $request->auxiliar_editorial;
        $reglaRolCultura->gestor_editorial = $request->gestor_editorial;
        $reglaRolCultura->experto_tematico = $request->experto_tematico;

        $reglaRolCultura->centroFormacion()->associate($request->centro_formacion_id);

        $reglaRolCultura->save();

        return redirect()->route('reglas-roles-cultura.index')->with('success', 'El recurso se ha creado correctamente.');
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\ReglaRolCultura  $reglaRolCultura
     * @return \Illuminate\Http\Response
     */
    public function show(ReglaRolCultura $reglaRolCultura)
    {
        $this->authorize('view', [ReglaRolCultura::class, $reglaRolCultura]);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\ReglaRolCultura  $reglaRolCultura
     * @return \Illuminate\Http\Response
     */
    public function edit(ReglaRolCultura $reglaRolCultura)
    {
        $this->authorize('update', [ReglaRolCultura::class, $reglaRolCultura]);

        return Inertia::render('ReglasRolesCultura/Edit', [
            'reglaRolCultura'   => $reglaRolCultura,
            'centrosFormacion'  => CentroFormacion::selectRaw('centros_formacion.id as value, concat(centros_formacion.nombre, chr(10), \'∙ Código: \', centros_formacion.codigo) as label')->orderBy('centros_formacion.nombre', 'ASC')->get()
        ]);
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
        $this->authorize('update', [ReglaRolCultura::class, $reglaRolCultura]);

        $reglaRolCultura->auxiliar_editorial = $request->auxiliar_editorial;
        $reglaRolCultura->gestor_editorial = $request->gestor_editorial;
        $reglaRolCultura->experto_tematico = $request->experto_tematico;

        $reglaRolCultura->centroFormacion()->associate($request->centro_formacion_id);

        $reglaRolCultura->save();

        return back()->with('success', 'El recurso se ha actualizado correctamente.');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\ReglaRolCultura  $reglaRolCultura
     * @return \Illuminate\Http\Response
     */
    public function destroy(ReglaRolCultura $reglaRolCultura)
    {
        $this->authorize('delete', [ReglaRolCultura::class, $reglaRolCultura]);

        $reglaRolCultura->delete();

        return redirect()->route('reglas-roles-cultura.index')->with('success', 'El recurso se ha eliminado correctamente.');
    }
}
