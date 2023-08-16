<?php

namespace App\Http\Controllers;

use App\Helpers\SelectHelper;
use App\Models\LaboratorioServicioTecnologico;
use App\Models\LineaTecnica;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class LaboratorioServicioTecnologicoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $this->authorize('viewAny', [LaboratorioServicioTecnologico::class]);

        return Inertia::render('LaboratoriosServiciosTecnologicos/Index', [
            'laboratorios_servicios_tecnologicos'   =>  LaboratorioServicioTecnologico::select('tipos_proyecto_linea_68.*')->with('centroFormacion.regional', 'lineaTecnica')
                                                            ->filterLaboratorioServicioTecnologico(request()->only('search'))->paginate(),
            'tipologias_st'                         =>  json_decode(Storage::get('json/tipologias-st.json'), true),
            'subclasificaciones_st'                 =>  json_decode(Storage::get('json/subclasificaciones-st.json'), true),
            'lineas_tecnicas'                       =>  LineaTecnica::select('id as value', 'nombre as label')->get(),
            'centros_formacion'                     =>  SelectHelper::centrosFormacion(),
            'allowed_to_create'                     =>  Gate::inspect('create', [LaboratorioServicioTecnologico::class])->allowed()
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
        $this->authorize('create', [LaboratorioServicioTecnologico::class]);

        $laboratorio_st = LaboratorioServicioTecnologico::create($request->all());

        $laboratorio_st->save();

        return back()->with('success', 'El recurso se ha creado correctamente.');
    }

    /**
     * Display the specified resource.
     */
    public function show(LaboratorioServicioTecnologico $laboratorio_st)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(LaboratorioServicioTecnologico $laboratorio_st)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, LaboratorioServicioTecnologico $laboratorio_st)
    {
        $this->authorize('update', [LaboratorioServicioTecnologico::class, $laboratorio_st]);

        $laboratorio_st->update($request->all());

        return back()->with('success', 'El recurso se ha modificado correctamente.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(LaboratorioServicioTecnologico $laboratorio_st)
    {
        $this->authorize('delete', [LaboratorioServicioTecnologico::class, $laboratorio_st]);

        $laboratorio_st->delete();

        return redirect()->route('lineas-tecnicas.index')->with('success', 'El recurso se ha eliminado correctamente.');
    }
}
