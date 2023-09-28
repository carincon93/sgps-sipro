<?php

namespace App\Http\Controllers;

use App\Helpers\SelectHelper;
use App\Models\Convocatoria;
use App\Models\ConvocatoriaTipoFormulario;
use App\Models\MontoMaximoFormulario1Regional;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class MontoMaximoFormulario1RegionalController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Convocatoria $convocatoria)
    {
        $this->authorize('viewAny', [MontoMaximoFormulario1Regional::class]);

        return Inertia::render('Convocatorias/MontosMaximosFormulario1Regional/Index', [
            'convocatoria'                  => $convocatoria,
            'montos_maximos_por_regional'   => MontoMaximoFormulario1Regional::select('monto_maximo_formulario_1_regional.*')->with('regional')->join('convocatoria_tipos_formularios', 'monto_maximo_formulario_1_regional.convocatoria_tipo_formulario_id', 'convocatoria_tipos_formularios.id')->where('convocatoria_tipos_formularios.convocatoria_id', $convocatoria->id)->orderBy('monto_maximo_formulario_1_regional.regional_id')->get(),
            'regionales'                    => SelectHelper::regionales(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Convocatoria $convocatoria)
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request, Convocatoria $convocatoria)
    {
        $convocatoria_tipo_formulario = ConvocatoriaTipoFormulario::where('convocatoria_id', $convocatoria->id)->where('tipo_formulario_convocatoria_id', $request->tipo_formulario_convocatoria_id)->first();

        $convocatoria_tipo_formulario->montosMaximosFormulario1()->create($request->all());

        return back()->with('success', 'El recurso se ha creado correctamente.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Convocatoria $convocatoria, MontoMaximoFormulario1Regional $monto_maximo_regional)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Convocatoria $convocatoria, MontoMaximoFormulario1Regional $monto_maximo_regional)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Convocatoria $convocatoria, MontoMaximoFormulario1Regional $monto_maximo_regional)
    {
        $monto_maximo_regional->update($request->all());

        return back()->with('success', 'El recurso se ha modificado correctamente.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Convocatoria $convocatoria, MontoMaximoFormulario1Regional $monto_maximo_regional)
    {
        $monto_maximo_regional->delete();

        return back()->with('success', 'El recurso se ha eliminado correctamente.');
    }
}
