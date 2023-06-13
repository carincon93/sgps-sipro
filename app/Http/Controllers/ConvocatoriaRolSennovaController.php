<?php

namespace App\Http\Controllers;

use App\Helpers\SelectHelper;
use App\Http\Requests\ConvocatoriaRolSennovaRequest;
use App\Models\Convocatoria;
use App\Models\ConvocatoriaRolSennova;
use App\Models\RolSennova;
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
            'filters'                   => request()->all('search'),
            'convocatoria'              => $convocatoria,
            'convocatoriaRolesSennova'  => $convocatoria->convocatoriaRolesSennova()
                ->selectRaw("convocatoria_rol_sennova.id, lineas_programaticas.nombre as linea_programatica_nombre, convocatoria_rol_sennova.asignacion_mensual, CASE convocatoria_rol_sennova.nivel_academico
                        WHEN '7' THEN	concat(roles_sennova.nombre, ' - Nivel académico: Ninguno')
                        WHEN '1' THEN	concat(roles_sennova.nombre, ' - Nivel académico: Técnico')
                        WHEN '2' THEN	concat(roles_sennova.nombre, ' - Nivel académico: Tecnólogo')
                        WHEN '3' THEN	concat(roles_sennova.nombre, ' - Nivel académico: Pregrado')
                        WHEN '4' THEN	concat(roles_sennova.nombre, ' - Nivel académico: Especalización')
                        WHEN '5' THEN	concat(roles_sennova.nombre, ' - Nivel académico: Maestría')
                        WHEN '6' THEN	concat(roles_sennova.nombre, ' - Nivel académico: Doctorado')
                        WHEN '8' THEN	concat(roles_sennova.nombre, ' - Nivel académico: Técnico con especialización')
                        WHEN '9' THEN	concat(roles_sennova.nombre, ' - Nivel académico: Tecnólogo con especialización')
                    END as nombre")->join('roles_sennova', 'convocatoria_rol_sennova.rol_sennova_id', 'roles_sennova.id')
                ->join('lineas_programaticas', 'lineas_programaticas.id', 'convocatoria_rol_sennova.linea_programatica_id')
                ->filterConvocatoriaRolSennova(request()->only('search'))->paginate()->appends(['search' => request()->search]),
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

        return Inertia::render('Convocatorias/ConvocatoriaRolesSennova/Create', [
            'convocatoria'          => $convocatoria->only('id', 'esta_activa', 'fase_formateada', 'fase', 'tipo_convocatoria'),
            'nivelesAcademicos'     => json_decode(Storage::get('json/niveles-academicos.json'), true),
            'rolesSennova'          => SelectHelper::rolesSennova(),
            'lineasProgramaticas'   => SelectHelper::lineasProgramaticas()
        ]);
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

        $convocatoriaRolSennova = new ConvocatoriaRolSennova();
        $convocatoriaRolSennova->asignacion_mensual     = $request->asignacion_mensual;
        $convocatoriaRolSennova->nivel_academico        = $request->nivel_academico;
        $convocatoriaRolSennova->perfil                 = $request->perfil;
        $convocatoriaRolSennova->mensaje                = $request->mensaje;
        $convocatoriaRolSennova->experiencia            = $request->experiencia;
        $convocatoriaRolSennova->convocatoria()->associate($convocatoria);
        $convocatoriaRolSennova->rolSennova()->associate($request->rol_sennova_id);
        $convocatoriaRolSennova->lineaProgramatica()->associate($request->linea_programatica_id);

        $convocatoriaRolSennova->save();

        return redirect()->route('convocatorias.convocatoria-rol-sennova.index', [$convocatoria])->with('success', 'El recurso se ha creado correctamente.');
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\ConvocatoriaRolSennova  $convocatoriaRolSennova
     * @return \Illuminate\Http\Response
     */
    public function show(Convocatoria $convocatoria, ConvocatoriaRolSennova $convocatoriaRolSennova)
    {
        $this->authorize('view', [ConvocatoriaRolSennova::class, $convocatoriaRolSennova]);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\ConvocatoriaRolSennova  $convocatoriaRolSennova
     * @return \Illuminate\Http\Response
     */
    public function edit(Convocatoria $convocatoria, ConvocatoriaRolSennova $convocatoriaRolSennova)
    {
        $this->authorize('update', [ConvocatoriaRolSennova::class, $convocatoriaRolSennova]);

        $convocatoriaRolSennova->rolSennova;

        return Inertia::render('Convocatorias/ConvocatoriaRolesSennova/Edit', [
            'convocatoria'              => $convocatoria->only('id', 'esta_activa', 'fase_formateada', 'fase', 'tipo_convocatoria'),
            'convocatoriaRolSennova'    => $convocatoriaRolSennova,
            'nivelesAcademicos'         => json_decode(Storage::get('json/niveles-academicos.json'), true),
            'rolesSennova'              => SelectHelper::rolesSennova(),
            'lineasProgramaticas'       => SelectHelper::lineasProgramaticas()
        ]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\ConvocatoriaRolSennova  $convocatoriaRolSennova
     * @return \Illuminate\Http\Response
     */
    public function update(ConvocatoriaRolSennovaRequest $request, Convocatoria $convocatoria, ConvocatoriaRolSennova $convocatoriaRolSennova)
    {
        $this->authorize('update', [ConvocatoriaRolSennova::class, $convocatoriaRolSennova]);

        $convocatoriaRolSennova->asignacion_mensual     = $request->asignacion_mensual;
        $convocatoriaRolSennova->nivel_academico        = $request->nivel_academico;
        $convocatoriaRolSennova->perfil                 = $request->perfil;
        $convocatoriaRolSennova->mensaje                = $request->mensaje;
        $convocatoriaRolSennova->experiencia            = $request->experiencia;
        $convocatoriaRolSennova->convocatoria()->associate($convocatoria);
        $convocatoriaRolSennova->rolSennova()->associate($request->rol_sennova_id);
        $convocatoriaRolSennova->lineaProgramatica()->associate($request->linea_programatica_id);

        $convocatoriaRolSennova->save();

        return back()->with('success', 'El recurso se ha actualizado correctamente.');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\ConvocatoriaRolSennova  $convocatoriaRolSennova
     * @return \Illuminate\Http\Response
     */
    public function destroy(Convocatoria $convocatoria, ConvocatoriaRolSennova $convocatoriaRolSennova)
    {
        $this->authorize('delete', [ConvocatoriaRolSennova::class, $convocatoriaRolSennova]);

        $convocatoriaRolSennova->delete();

        return back()->with('success', 'El recurso se ha eliminado correctamente.');
    }
}
