<?php

namespace App\Http\Controllers;

use App\Models\ReglaRolSt;
use App\Http\Controllers\Controller;
use App\Http\Requests\ReglaRolStRequest;
use App\Models\RolSennova;
use App\Models\TipoProyectoSt;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReglaRolStController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $this->authorize('viewAny', [ReglaRolSt::class]);

        return Inertia::render('ReglasRolesSt/Index', [
            'filters'           => request()->all('search'),
            'reglasRolesSt'     => ReglaRolSt::selectRaw("reglas_roles_st.id, reglas_roles_st.maximo, roles_sennova.nombre as nombre_rol, centros_formacion.nombre as nombre_centro, CASE tipos_proyecto_st.tipo_proyecto
                WHEN '1' THEN	'A'
                WHEN '2' THEN	'B'
            END as tipo_proyecto")->join('roles_sennova', 'reglas_roles_st.rol_sennova_id', 'roles_sennova.id')->join('tipos_proyecto_st', 'reglas_roles_st.tipo_proyecto_st_id', 'tipos_proyecto_st.id')->join('centros_formacion', 'tipos_proyecto_st.centro_formacion_id', 'centros_formacion.id')->orderBy('roles_sennova.nombre', 'ASC')
                ->filterReglaRolSt(request()->only('search'))->paginate()->appends(['search' => request()->search]),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        $this->authorize('create', [ReglaRolSt::class]);

        return Inertia::render('ReglasRolesSt/Create', [
            'rolesSt'           => RolSennova::select('id as value', 'nombre as label')->whereIn('id', [3, 31, 30, 32, 29, 36, 37, 38, 39, 40, 41, 42, 43, 44])->get(),
            'tiposProyectoSt'   => TipoProyectoSt::selectRaw("tipos_proyecto_st.id as value, CASE tipos_proyecto_st.tipo_proyecto
                WHEN '1' THEN	concat(centros_formacion.nombre, chr(10), '∙ Tipo de proyecto: A', chr(10), '∙ Línea técnica: ', lineas_tecnicas.nombre)
                WHEN '2' THEN	concat(centros_formacion.nombre, chr(10), '∙ Tipo de proyecto: B', chr(10), '∙ Línea técnica: ', lineas_tecnicas.nombre)
            END as label")->join('centros_formacion', 'tipos_proyecto_st.centro_formacion_id', 'centros_formacion.id')->join('lineas_tecnicas', 'tipos_proyecto_st.linea_tecnica_id', 'lineas_tecnicas.id')->get()
        ]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(ReglaRolStRequest $request)
    {
        $this->authorize('create', [ReglaRolSt::class]);

        $reglaRolSt = new ReglaRolSt();
        $reglaRolSt->maximo = $request->maximo;
        $reglaRolSt->tipoProyectoSt()->associate($request->tipo_proyecto_st_id);
        $reglaRolSt->rolSennova()->associate($request->rol_sennova_id);

        $reglaRolSt->save();

        return redirect()->route('reglas-roles-st.index')->with('success', 'El recurso se ha creado correctamente.');
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\ReglaRolSt  $reglaRolSt
     * @return \Illuminate\Http\Response
     */
    public function show(ReglaRolSt $reglaRolSt)
    {
        $this->authorize('view', [ReglaRolSt::class, $reglaRolSt]);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\ReglaRolSt  $reglaRolSt
     * @return \Illuminate\Http\Response
     */
    public function edit(ReglaRolSt $reglaRolSt)
    {
        $this->authorize('update', [ReglaRolSt::class, $reglaRolSt]);

        return Inertia::render('ReglasRolesSt/Edit', [
            'rolesSt'           => RolSennova::select('id as value', 'nombre as label')->whereIn('id', [3, 31, 30, 32, 29, 36, 37, 38, 39, 40, 41, 42, 43, 44])->get(),
            'reglaRolSt'        => $reglaRolSt,
            'tiposProyectoSt'   => TipoProyectoSt::selectRaw("tipos_proyecto_st.id as value, CASE tipos_proyecto_st.tipo_proyecto
                WHEN '1' THEN	concat(centros_formacion.nombre, chr(10), '∙ Tipo de proyecto: A', chr(10), '∙ Línea técnica: ', lineas_tecnicas.nombre)
                WHEN '2' THEN	concat(centros_formacion.nombre, chr(10), '∙ Tipo de proyecto: B', chr(10), '∙ Línea técnica: ', lineas_tecnicas.nombre)
            END as label")->join('centros_formacion', 'tipos_proyecto_st.centro_formacion_id', 'centros_formacion.id')->join('lineas_tecnicas', 'tipos_proyecto_st.linea_tecnica_id', 'lineas_tecnicas.id')->get()
        ]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\ReglaRolSt  $reglaRolSt
     * @return \Illuminate\Http\Response
     */
    public function update(ReglaRolStRequest $request, ReglaRolSt $reglaRolSt)
    {
        $this->authorize('update', [ReglaRolSt::class, $reglaRolSt]);

        $reglaRolSt->maximo = $request->maximo;
        $reglaRolSt->tipoProyectoSt()->associate($request->tipo_proyecto_st_id);
        $reglaRolSt->rolSennova()->associate($request->rol_sennova_id);

        $reglaRolSt->save();

        return back()->with('success', 'El recurso se ha actualizado correctamente.');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\ReglaRolSt  $reglaRolSt
     * @return \Illuminate\Http\Response
     */
    public function destroy(ReglaRolSt $reglaRolSt)
    {
        $this->authorize('delete', [ReglaRolSt::class, $reglaRolSt]);

        $reglaRolSt->delete();

        return redirect()->route('reglas-roles-st.index')->with('success', 'El recurso se ha eliminado correctamente.');
    }
}
