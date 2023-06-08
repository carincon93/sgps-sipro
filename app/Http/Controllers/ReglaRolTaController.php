<?php

namespace App\Http\Controllers;

use App\Helpers\SelectHelper;
use App\Models\ReglaRolTa;
use App\Http\Controllers\Controller;
use App\Http\Requests\ReglaRolTaRequest;
use App\Models\ConvocatoriaRolSennova;
use App\Models\Tecnoacademia;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReglaRolTaController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $this->authorize('viewAny', [ReglaRolTa::class]);

        return Inertia::render('ReglasRolesTa/Index', [
            'filters'       => request()->all('search'),
            'reglasRolesTa' => ReglaRolTa::selectRaw("reglas_roles_ta.id, reglas_roles_ta.maximo, CASE convocatoria_rol_sennova.nivel_academico
                WHEN '7' THEN	concat(roles_sennova.nombre, ' - Nivel académico: Ninguno')
                WHEN '1' THEN	concat(roles_sennova.nombre, ' - Nivel académico: Técnico')
                WHEN '2' THEN	concat(roles_sennova.nombre, ' - Nivel académico: Tecnólogo')
                WHEN '3' THEN	concat(roles_sennova.nombre, ' - Nivel académico: Pregrado')
                WHEN '4' THEN	concat(roles_sennova.nombre, ' - Nivel académico: Especalización')
                WHEN '5' THEN	concat(roles_sennova.nombre, ' - Nivel académico: Maestría')
                WHEN '6' THEN	concat(roles_sennova.nombre, ' - Nivel académico: Doctorado')
                WHEN '8' THEN	concat(roles_sennova.nombre, ' - Nivel académico: Técnico con especialización')
                WHEN '9' THEN	concat(roles_sennova.nombre, ' - Nivel académico: Tecnólogo con especialización')
            END as nombre_rol, tecnoacademias.nombre as nombre_tecnoacademia")->join('convocatoria_rol_sennova', 'reglas_roles_ta.convocatoria_rol_sennova_id', 'convocatoria_rol_sennova.id')->join('roles_sennova', 'convocatoria_rol_sennova.rol_sennova_id', 'roles_sennova.id')->join('tecnoacademias', 'reglas_roles_ta.tecnoacademia_id', 'tecnoacademias.id')->orderBy('roles_sennova.nombre', 'ASC')
                ->filterReglaRolTa(request()->only('search'))->paginate()->appends(['search' => request()->search]),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        $this->authorize('create', [ReglaRolTa::class]);

        return Inertia::render('ReglasRolesTa/Create', [
            'rolesTa'           => ConvocatoriaRolSennova::selectRaw("convocatoria_rol_sennova.id as value, CASE convocatoria_rol_sennova.nivel_academico
                WHEN '7' THEN	concat(roles_sennova.nombre, ' - Nivel académico: Ninguno')
                WHEN '1' THEN	concat(roles_sennova.nombre, ' - Nivel académico: Técnico')
                WHEN '2' THEN	concat(roles_sennova.nombre, ' - Nivel académico: Tecnólogo')
                WHEN '3' THEN	concat(roles_sennova.nombre, ' - Nivel académico: Pregrado')
                WHEN '4' THEN	concat(roles_sennova.nombre, ' - Nivel académico: Especalización')
                WHEN '5' THEN	concat(roles_sennova.nombre, ' - Nivel académico: Maestría')
                WHEN '6' THEN	concat(roles_sennova.nombre, ' - Nivel académico: Doctorado')
                WHEN '8' THEN	concat(roles_sennova.nombre, ' - Nivel académico: Técnico con especialización')
                WHEN '9' THEN	concat(roles_sennova.nombre, ' - Nivel académico: Tecnólogo con especialización')
            END as label")->join('roles_sennova', 'convocatoria_rol_sennova.rol_sennova_id', 'roles_sennova.id')->whereIn('roles_sennova.id', [3, 9, 10, 11, 12, 13, 14, 16, 28])->where('convocatoria_rol_sennova.linea_programatica_id', 5)->get(),
            'tecnoacademias'    => SelectHelper::tecnoacademias()
        ]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(ReglaRolTaRequest $request)
    {
        $this->authorize('create', [ReglaRolTa::class]);

        $reglaRolTa = new ReglaRolTa();
        $reglaRolTa->maximo = $request->maximo;
        $reglaRolTa->tecnoacademia()->associate($request->tecnoacademia_id);
        $reglaRolTa->convocatoriaRolSennova()->associate($request->convocatoria_rol_sennova_id);

        $reglaRolTa->save();

        return redirect()->route('reglas-roles-ta.index')->with('success', 'El recurso se ha creado correctamente.');
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\ReglaRolTa  $reglaRolTa
     * @return \Illuminate\Http\Response
     */
    public function show(ReglaRolTa $reglaRolTa)
    {
        $this->authorize('view', [ReglaRolTa::class, $reglaRolTa]);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\ReglaRolTa  $reglaRolTa
     * @return \Illuminate\Http\Response
     */
    public function edit(ReglaRolTa $reglaRolTa)
    {
        $this->authorize('update', [ReglaRolTa::class, $reglaRolTa]);

        return Inertia::render('ReglasRolesTa/Edit', [
            'reglaRolTa'        => $reglaRolTa,
            'rolesTa'           => ConvocatoriaRolSennova::selectRaw("convocatoria_rol_sennova.id as value, CASE convocatoria_rol_sennova.nivel_academico
                WHEN '7' THEN	concat(roles_sennova.nombre, ' - Nivel académico: Ninguno')
                WHEN '1' THEN	concat(roles_sennova.nombre, ' - Nivel académico: Técnico')
                WHEN '2' THEN	concat(roles_sennova.nombre, ' - Nivel académico: Tecnólogo')
                WHEN '3' THEN	concat(roles_sennova.nombre, ' - Nivel académico: Pregrado')
                WHEN '4' THEN	concat(roles_sennova.nombre, ' - Nivel académico: Especalización')
                WHEN '5' THEN	concat(roles_sennova.nombre, ' - Nivel académico: Maestría')
                WHEN '6' THEN	concat(roles_sennova.nombre, ' - Nivel académico: Doctorado')
                WHEN '8' THEN	concat(roles_sennova.nombre, ' - Nivel académico: Técnico con especialización')
                WHEN '9' THEN	concat(roles_sennova.nombre, ' - Nivel académico: Tecnólogo con especialización')
            END as label")->join('roles_sennova', 'convocatoria_rol_sennova.rol_sennova_id', 'roles_sennova.id')->whereIn('roles_sennova.id', [3, 9, 10, 11, 12, 13, 14, 16, 28])->where('convocatoria_rol_sennova.linea_programatica_id', 5)->get(),
            'tecnoacademias'    => SelectHelper::tecnoacademias()
        ]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\ReglaRolTa  $reglaRolTa
     * @return \Illuminate\Http\Response
     */
    public function update(ReglaRolTaRequest $request, ReglaRolTa $reglaRolTa)
    {
        $this->authorize('update', [ReglaRolTa::class, $reglaRolTa]);

        $reglaRolTa->maximo = $request->maximo;
        $reglaRolTa->tecnoacademia()->associate($request->tecnoacademia_id);
        $reglaRolTa->convocatoriaRolSennova()->associate($request->convocatoria_rol_sennova_id);

        $reglaRolTa->save();

        return back()->with('success', 'El recurso se ha actualizado correctamente.');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\ReglaRolTa  $reglaRolTa
     * @return \Illuminate\Http\Response
     */
    public function destroy(ReglaRolTa $reglaRolTa)
    {
        $this->authorize('delete', [ReglaRolTa::class, $reglaRolTa]);

        $reglaRolTa->delete();

        return redirect()->route('reglas-roles-ta.index')->with('success', 'El recurso se ha eliminado correctamente.');
    }
}
