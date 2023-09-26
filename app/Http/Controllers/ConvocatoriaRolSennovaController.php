<?php

namespace App\Http\Controllers;

use App\Helpers\SelectHelper;
use App\Http\Requests\ConvocatoriaRolSennovaRequest;
use App\Models\Convocatoria;
use App\Models\ConvocatoriaRolSennova;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ConvocatoriaRolSennovaController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Convocatoria $convocatoria)
    {
        $this->authorize('viewAny', [ConvocatoriaRolSennova::class]);

        return Inertia::render('Convocatorias/ConvocatoriaRolesSennova/Index', [
            'filters'                       => request()->all('search'),
            'convocatoria'                  => $convocatoria,
            'convocatoria_roles_sennova'    => $convocatoria->convocatoriaRolesSennova()
                ->select('convocatoria_rol_sennova.*')
                ->join('roles_sennova', 'convocatoria_rol_sennova.rol_sennova_id', 'roles_sennova.id')
                ->where('convocatoria_rol_sennova.tipo_formulario_convocatoria_id', request()->tipo_formulario_convocatoria_id)
                ->orderBy('roles_sennova.nombre', 'ASC')
                ->orderBy('convocatoria_rol_sennova.id', 'ASC')
                ->with('rolSennova')
                ->filterConvocatoriaRolSennova(request()->only('search'))
                ->paginate(50)
                ->appends(['search' => request()->search]),
            'niveles_academicos'            => json_decode(Storage::get('json/niveles-academicos.json'), true),
            'roles_sennova'                 => SelectHelper::rolesSennova(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create(Convocatoria $convocatoria)
    {
        $this->authorize('create', [ConvocatoriaRolSennova::class]);

        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(ConvocatoriaRolSennovaRequest $request, Convocatoria $convocatoria)
    {
        $this->authorize('create', [ConvocatoriaRolSennova::class]);

        // if ($convocatoria->convocatoriaRolesSennova()->where('rol_sennova_id', $request->rol_sennova_id)->where('nivel_academico', $request->nivel_academico)->where('tipo_formulario_convocatoria_id', $request->tipo_formulario_convocatoria_id)->count() > 0) {
        //     return back()->with('success', 'Error: Ya ha agregado un rol con el mismo nivel académico. Por favor seleccione un rol o nivel académico diferente.');
        // }

        $convocatoria_rol_sennova = $convocatoria->convocatoriaRolesSennova()->create($request->validated());

        return back()->with('success', 'El recurso se ha creado correctamente.');
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\ConvocatoriaRolSennova  $convocatoria_rol_sennova
     * @return \Illuminate\Http\Response
     */
    public function show(Convocatoria $convocatoria, ConvocatoriaRolSennova $convocatoria_rol_sennova)
    {
        $this->authorize('view', [ConvocatoriaRolSennova::class, $convocatoria_rol_sennova]);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\ConvocatoriaRolSennova  $convocatoria_rol_sennova
     * @return \Illuminate\Http\Response
     */
    public function edit(Convocatoria $convocatoria, ConvocatoriaRolSennova $convocatoria_rol_sennova)
    {
        $this->authorize('update', [ConvocatoriaRolSennova::class, $convocatoria_rol_sennova]);

        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\ConvocatoriaRolSennova  $convocatoria_rol_sennova
     * @return \Illuminate\Http\Response
     */
    public function update(ConvocatoriaRolSennovaRequest $request, Convocatoria $convocatoria, ConvocatoriaRolSennova $convocatoria_rol_sennova)
    {
        $this->authorize('update', [ConvocatoriaRolSennova::class, $convocatoria_rol_sennova]);

        // if ($convocatoria_rol_sennova->nivel_academico != $request->nivel_academico && $convocatoria->convocatoriaRolesSennova()->where('rol_sennova_id', $request->rol_sennova_id)->where('nivel_academico', $request->nivel_academico)->where('tipo_formulario_convocatoria_id', $request->tipo_formulario_convocatoria_id)->count() > 0) {
        //     return back()->with('success', 'Error: Ya ha agregado un rol con el mismo nivel académico. Por favor seleccione un rol o nivel académico diferente.');
        // }

        $convocatoria_rol_sennova->update($request->validated());
        $convocatoria_rol_sennova->save();

        return back()->with('success', 'El recurso se ha actualizado correctamente.');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\ConvocatoriaRolSennova  $convocatoria_rol_sennova
     * @return \Illuminate\Http\Response
     */
    public function destroy(Convocatoria $convocatoria, ConvocatoriaRolSennova $convocatoria_rol_sennova)
    {
        $this->authorize('delete', [ConvocatoriaRolSennova::class, $convocatoria_rol_sennova]);

        $convocatoria_rol_sennova->delete();

        return back()->with('success', 'El recurso se ha eliminado correctamente.');
    }

    public function cambiarEstados(Request $request, Convocatoria $convocatoria, ConvocatoriaRolSennova $convocatoria_rol_sennova)
    {
        $this->authorize('update', [ConvocatoriaRolSennova::class, $convocatoria_rol_sennova]);

        if ($request->filled('habilitado')) {
            $convocatoria_rol_sennova->update(['habilitado' => $request->habilitado]);

            !$request->habilitado ? $convocatoria_rol_sennova->update(['sumar_al_presupuesto' => false]) : $convocatoria_rol_sennova->update(['sumar_al_presupuesto' => true]);
        }

        if ($request->filled('sumar_al_presupuesto')) {
            $convocatoria_rol_sennova->update(['sumar_al_presupuesto' => $request->sumar_al_presupuesto]);
        }

        return back()->with('success', 'El recurso se ha actualizado correctamente.');
    }
}
