<?php

namespace App\Http\Controllers;

use App\Models\LaboratorioServicioTecnologico;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
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
            'laboratorios_servicios_tecnologicos'   =>  LaboratorioServicioTecnologico::selectRaw("tipos_proyecto_linea_68.id, CASE subclasificacion
                                                                    WHEN '1' THEN	CONCAT(centros_formacion.nombre, ' - ', centros_formacion.codigo,chr(10), '∙ Automatización y TICs', chr(10), '∙ Línea técnica: ', lineas_tecnicas.nombre)
                                                                    WHEN '2' THEN	CONCAT(centros_formacion.nombre, ' - ', centros_formacion.codigo,chr(10), '∙ Calibración', chr(10), '∙ Línea técnica: ', lineas_tecnicas.nombre)
                                                                    WHEN '3' THEN	CONCAT(centros_formacion.nombre, ' - ', centros_formacion.codigo,chr(10), '∙ Consultoría técnica', chr(10), '∙ Línea técnica: ', lineas_tecnicas.nombre)
                                                                    WHEN '4' THEN	CONCAT(centros_formacion.nombre, ' - ', centros_formacion.codigo,chr(10), '∙ Ensayo', chr(10), '∙ Línea técnica: ', lineas_tecnicas.nombre)
                                                                    WHEN '5' THEN	CONCAT(centros_formacion.nombre, ' - ', centros_formacion.codigo,chr(10), '∙ Fabricación especial', chr(10), '∙ Línea técnica: ', lineas_tecnicas.nombre)
                                                                    WHEN '6' THEN	CONCAT(centros_formacion.nombre, ' - ', centros_formacion.codigo,chr(10), '∙ Seguridad y salud en el trabajo', chr(10), '∙ Línea técnica: ', lineas_tecnicas.nombre)
                                                                    WHEN '7' THEN	CONCAT(centros_formacion.nombre, ' - ', centros_formacion.codigo,chr(10), '∙ Servicios de salud', chr(10), '∙ Línea técnica: ', lineas_tecnicas.nombre)
                                                                END as laboratorio, regionales.nombre as regional_nombre")
                                                            ->join('centros_formacion', 'tipos_proyecto_linea_68.centro_formacion_id', 'centros_formacion.id')
                                                            ->join('regionales', 'centros_formacion.regional_id', 'regionales.id')
                                                            ->join('lineas_tecnicas', 'tipos_proyecto_linea_68.linea_tecnica_id', 'lineas_tecnicas.id')
                                                            ->filterLaboratorioServicioTecnologico(request()->only('search'))->orderBy('regionales.nombre')->paginate(),
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
        //
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
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(LaboratorioServicioTecnologico $laboratorio_st)
    {
        //
    }
}
