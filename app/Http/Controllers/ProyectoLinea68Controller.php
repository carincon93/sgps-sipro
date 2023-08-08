<?php

namespace App\Http\Controllers;

use App\Helpers\SelectHelper;
use App\Models\ProyectoLinea68;
use App\Http\Controllers\Controller;
use App\Http\Requests\Evaluacion\EvaluacionProyectoLinea68Request;
use App\Http\Requests\ProyectoLinea68ColumnRequest;
use App\Http\Requests\ProyectoLinea68Request;
use App\Models\Convocatoria;
use App\Models\Evaluacion\EvaluacionProyectoLinea68;
use App\Models\Proyecto;
use App\Models\RolSennova;
use App\Models\TipoProyectoLinea68;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ProyectoLinea68Controller extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Convocatoria $convocatoria)
    {
        return Inertia::render('Convocatorias/Proyectos/ProyectosLinea68/Index', [
            'convocatoria'          => $convocatoria,
            'proyectos_linea_68'    => ProyectoLinea68::getProyectosPorRol($convocatoria)->appends(['search' => request()->search, 'estructuracion_proyectos' => request()->estructuracion_proyectos]),
            'allowed_to_create'     => Gate::inspect('formular-proyecto', [10, $convocatoria])->allowed()
        ]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create(Convocatoria $convocatoria)
    {
        $this->authorize('formular-proyecto', [10, $convocatoria]);

        /** @var \App\Models\User */
        $auth_user = Auth::user();

        if ($auth_user->hasRole(13)) {
            $tipo_proyecto_linea_66 = SelectHelper::tiposProyectosLinea68()->where('regional_id', $auth_user->centroFormacion->regional_id)->values()->all();
        } else {
            $tipo_proyecto_linea_66 = SelectHelper::tiposProyectosLinea68();
        }

        return Inertia::render('Convocatorias/Proyectos/ProyectosLinea68/Create', [
            'convocatoria'              => $convocatoria->only('id', 'esta_activa', 'fase_formateada', 'fase', 'tipo_convocatoria', 'year'),
            'sectores_productivos'      => collect(json_decode(Storage::get('json/sectores-productivos.json'), true)),
            'tipos_proyecto_linea_68'   => $tipo_proyecto_linea_66,
            'estados_sistema_gestion'   => SelectHelper::estadosSistemaGestion(),
            'roles_sennova'             => RolSennova::select('id as value', 'nombre as label')->orderBy('nombre', 'ASC')->get(),
            'allowed_to_create'         => Gate::inspect('formular-proyecto', [10, $convocatoria])->allowed()
        ]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(ProyectoLinea68Request $request, Convocatoria $convocatoria)
    {
        $this->authorize('formular-proyecto', [10, $convocatoria]);

        $tipo_proyecto_linea_66 = TipoProyectoLinea68::find($request->tipo_proyecto_linea_68_id);

        $proyecto = new Proyecto();
        $proyecto->centroFormacion()->associate($tipo_proyecto_linea_66->centro_formacion_id);
        $proyecto->lineaProgramatica()->associate(10);
        $proyecto->convocatoria()->associate($convocatoria);
        $proyecto->save();

        $proyecto_linea_68 = new ProyectoLinea68();
        $proyecto_linea_68->titulo                                = $request->titulo;
        $proyecto_linea_68->fecha_inicio                          = $request->fecha_inicio;
        $proyecto_linea_68->fecha_finalizacion                    = $request->fecha_finalizacion;
        $proyecto_linea_68->max_meses_ejecucion                   = $request->max_meses_ejecucion;
        $proyecto_linea_68->sector_productivo                     = $request->sector_productivo;
        $proyecto_linea_68->nombre_area_tecnica                   = $request->nombre_area_tecnica;
        $proyecto_linea_68->resumen                               = '';
        $proyecto_linea_68->antecedentes                          = '';
        $proyecto_linea_68->objetivo_general                      = null;
        $proyecto_linea_68->problema_central                      = null;
        $proyecto_linea_68->justificacion_problema                = null;
        $proyecto_linea_68->identificacion_problema               = null;
        $proyecto_linea_68->pregunta_formulacion_problema         = '';
        $proyecto_linea_68->metodologia                           = '';
        $proyecto_linea_68->propuesta_sostenibilidad              = '';
        $proyecto_linea_68->bibliografia                          = '';

        $proyecto_linea_68->tipoProyectoLinea68()->associate($request->tipo_proyecto_linea_68_id);
        $proyecto_linea_68->estadoSistemaGestion()->associate($request->estado_sistema_gestion_id);

        $proyecto->proyectoLinea68()->save($proyecto_linea_68);

        $proyecto->participantes()->attach(
            Auth::user()->id,
            [
                'es_formulador'     => true,
                'cantidad_meses'    => $request->max_meses_ejecucion,
                'cantidad_horas'    => 48,
                'rol_sennova'       => $request->rol_sennova,
            ]
        );

        return redirect()->route('convocatorias.proyectos-linea-68.edit', [$convocatoria, $proyecto_linea_68])->with('success', 'El recurso se ha creado correctamente. Por favor continue diligenciando la información.');
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\ProyectoLinea68  $proyecto_linea_68
     * @return \Illuminate\Http\Response
     */
    public function show(Convocatoria $convocatoria, ProyectoLinea68 $proyecto_linea_68)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\ProyectoLinea68  $proyecto_linea_68
     * @return \Illuminate\Http\Response
     */
    public function edit(Convocatoria $convocatoria, ProyectoLinea68 $proyecto_linea_68)
    {
        $this->authorize('visualizar-proyecto-autor', [$proyecto_linea_68->proyecto]);

        /** @var \App\Models\User */
        $auth_user = Auth::user();

        $proyecto_linea_68->load('proyecto.evaluaciones.evaluacionProyectoLinea68');

        $proyecto_linea_68->proyecto->codigo_linea_programatica     = $proyecto_linea_68->proyecto->lineaProgramatica->codigo;
        $proyecto_linea_68->proyecto->precio_proyecto               = $proyecto_linea_68->proyecto->precioProyecto;
        $proyecto_linea_68->proyecto->centroFormacion;
        $proyecto_linea_68->proyecto->programasFormacion;

        $proyecto_linea_68->mostrar_recomendaciones       = $proyecto_linea_68->proyecto->mostrar_recomendaciones;
        $proyecto_linea_68->mostrar_requiere_subsanacion  = $proyecto_linea_68->proyecto->mostrar_requiere_subsanacion;

        if ($auth_user->hasRole(13)) {
            $tipo_proyecto_linea_68 = SelectHelper::tiposProyectosLinea68()->where('regional_id', $auth_user->centroFormacion->regional_id)->values()->all();
        } else {
            $tipo_proyecto_linea_68 = SelectHelper::tiposProyectosLinea68();
        }

        return Inertia::render('Convocatorias/Proyectos/ProyectosLinea68/Edit', [
            'convocatoria'                                  => $convocatoria->only('id', 'esta_activa', 'fase_formateada', 'fase', 'tipo_convocatoria', 'year', 'mostrar_recomendaciones'),
            'proyecto_linea_68'                             => $proyecto_linea_68,
            'evaluacion'                                    => EvaluacionProyectoLinea68::find(request()->evaluacion_id),
            'lineas_programaticas'                          => SelectHelper::lineasProgramaticas()->where('categoria_proyecto', 3)->values()->all(),
            'estados_sistema_gestion'                       => SelectHelper::estadosSistemaGestion(),
            'programas_formacion_sin_registro_calificado'   => SelectHelper::programasFormacion()->where('registro_calificado', false)->values()->all(),
            'programas_formacion_con_registro_calificado'   => SelectHelper::programasFormacion()->where('registro_calificado', true)->where('centro_formacion_id', $proyecto_linea_68->proyecto->centro_formacion_id)->values()->all(),
            'sectores_productivos'                          => collect(json_decode(Storage::get('json/sectores-productivos.json'), true)),
            'municipios'                                    => SelectHelper::municipios(),
            'tipos_proyecto_linea_68'                       => $tipo_proyecto_linea_68,
            'roles_sennova'                                 => RolSennova::select('id as value', 'nombre as label')->orderBy('nombre', 'ASC')->get(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\ProyectoLinea68  $proyecto_linea_68
     * @return \Illuminate\Http\Response
     */
    public function update(ProyectoLinea68Request $request, Convocatoria $convocatoria, ProyectoLinea68 $proyecto_linea_68)
    {
        $this->authorize('modificar-proyecto-autor', [$proyecto_linea_68->proyecto]);

        $tipo_proyecto_linea_66 = TipoProyectoLinea68::find($request->tipo_proyecto_linea_68_id);

        $proyecto_linea_68->titulo                      = $request->titulo;
        $proyecto_linea_68->fecha_inicio                = $request->fecha_inicio;
        $proyecto_linea_68->fecha_finalizacion          = $request->fecha_finalizacion;
        $proyecto_linea_68->max_meses_ejecucion         = $request->max_meses_ejecucion;
        $proyecto_linea_68->resumen                     = $request->resumen;
        $proyecto_linea_68->antecedentes                = $request->antecedentes;
        $proyecto_linea_68->bibliografia                = $request->bibliografia;
        $proyecto_linea_68->municipios_influencia       = $request->municipios_influencia;
        $proyecto_linea_68->otras_zonas_influencia      = $request->otras_zonas_influencia;

        $proyecto_linea_68->nombre_area_tecnica         = $request->nombre_area_tecnica;
        $proyecto_linea_68->continuidad                 = $request->continuidad;

        $proyecto_linea_68->especificaciones_area       = $request->especificaciones_area;
        $proyecto_linea_68->infraestructura_adecuada    = $request->infraestructura_adecuada;
        $proyecto_linea_68->video                       = $request->video;

        $proyecto_linea_68->proyecto->centroFormacion()->associate($tipo_proyecto_linea_66->centro_formacion_id);

        $proyecto_linea_68->save();

        $proyecto_linea_68->proyecto->programasFormacion()->sync(array_merge($request->programas_formacion ? $request->programas_formacion : [], $request->programas_formacion_articulados ? $request->programas_formacion_articulados : []));

        return back()->with('success', 'El recurso se ha actualizado correctamente.');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\ProyectoLinea68  $proyecto_linea_68
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request, Convocatoria $convocatoria, ProyectoLinea68 $proyecto_linea_68)
    {
        $this->authorize('eliminar-proyecto-autor', [$proyecto_linea_68->proyecto]);

        // if (!Hash::check($request->password, Auth::user()->password)) {
        //     return back()
        //         ->withErrors(['password' => __('The password is incorrect.')]);
        // }

        $proyecto_linea_68->proyecto()->delete();

        return redirect()->route('convocatorias.proyectos-linea-68.index', [$convocatoria])->with('success', 'El recurso se ha eliminado correctamente.');
    }

    public function updateEvaluacion(EvaluacionProyectoLinea68Request $request, Convocatoria $convocatoria, EvaluacionProyectoLinea68 $evaluacion_proyecto_linea_68)
    {
        $this->authorize('modificar-evaluacion-autor', $evaluacion_proyecto_linea_68->evaluacion);

        $evaluacion_proyecto_linea_68->evaluacion()->update([
            'iniciado' => true,
            'clausula_confidencialidad' => $request->clausula_confidencialidad
        ]);

        $evaluacion_proyecto_linea_68->fecha_ejecucion_comentario                  = $request->fechas_requiere_comentario == false ? $request->fecha_ejecucion_comentario : null;

        $evaluacion_proyecto_linea_68->titulo_puntaje                              = $request->titulo_puntaje;
        $evaluacion_proyecto_linea_68->titulo_comentario                           = $request->titulo_requiere_comentario == false ? $request->titulo_comentario : null;
        $evaluacion_proyecto_linea_68->resumen_puntaje                             = $request->resumen_puntaje;
        $evaluacion_proyecto_linea_68->resumen_comentario                          = $request->resumen_requiere_comentario == false ? $request->resumen_comentario : null;
        $evaluacion_proyecto_linea_68->antecedentes_puntaje                        = $request->antecedentes_puntaje;
        $evaluacion_proyecto_linea_68->antecedentes_comentario                     = $request->antecedentes_requiere_comentario == false ? $request->antecedentes_comentario : null;

        $evaluacion_proyecto_linea_68->identificacion_problema_puntaje             = $request->identificacion_problema_puntaje;
        $evaluacion_proyecto_linea_68->identificacion_problema_comentario          = $request->identificacion_problema_requiere_comentario == false ? $request->identificacion_problema_comentario : null;

        $evaluacion_proyecto_linea_68->pregunta_formulacion_problema_puntaje       = $request->pregunta_formulacion_problema_puntaje;
        $evaluacion_proyecto_linea_68->pregunta_formulacion_problema_comentario    = $request->pregunta_formulacion_problema_requiere_comentario == false ? $request->pregunta_formulacion_problema_comentario : null;

        $evaluacion_proyecto_linea_68->justificacion_problema_puntaje              = $request->justificacion_problema_puntaje;
        $evaluacion_proyecto_linea_68->justificacion_problema_comentario           = $request->justificacion_problema_requiere_comentario == false ? $request->justificacion_problema_comentario : null;

        $evaluacion_proyecto_linea_68->bibliografia_comentario                     = $request->bibliografia_requiere_comentario == false ? $request->bibliografia_comentario : null;

        $evaluacion_proyecto_linea_68->ortografia_comentario                       = $request->ortografia_requiere_comentario == false ? $request->ortografia_comentario : null;
        $evaluacion_proyecto_linea_68->redaccion_comentario                        = $request->redaccion_requiere_comentario == false ? $request->redaccion_comentario : null;
        $evaluacion_proyecto_linea_68->normas_apa_comentario                       = $request->normas_apa_requiere_comentario == false ? $request->normas_apa_comentario : null;

        $evaluacion_proyecto_linea_68->save();

        return redirect()->back()->with('success', 'El recurso se ha actualizado correctamente.');
    }

    public function updateLongColumn(ProyectoLinea68ColumnRequest $request, Convocatoria $convocatoria, ProyectoLinea68 $proyecto_linea_68, $column)
    {
        $this->authorize('modificar-proyecto-autor', [$proyecto_linea_68->proyecto]);

        if ($column == 'programas_formacion' || $column == 'programas_formacion_articulados') {
            $proyecto_linea_68->proyecto->programasFormacion()->sync(array_merge($request->programas_formacion ? $request->programas_formacion : [], $request->programas_formacion_articulados ? $request->programas_formacion_articulados : []));

            return back();
        }

        $proyecto_linea_68->update($request->only($column));

        return back();
    }
}
