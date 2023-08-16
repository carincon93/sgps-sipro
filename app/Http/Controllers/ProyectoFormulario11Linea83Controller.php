<?php

namespace App\Http\Controllers;

use App\Helpers\SharepointHelper;
use App\Helpers\SelectHelper;
use App\Models\Convocatoria;
use App\Models\Proyecto;
use App\Http\Controllers\Controller;
use App\Http\Requests\Evaluacion\EvaluacionProyectoFormulario11Linea83Request;
use App\Http\Requests\ProyectoFormulario11Linea83ColumnRequest;
use App\Http\Requests\ProyectoFormulario11Linea83Request;
use App\Models\Evaluacion\EvaluacionProyectoFormulario11Linea83;
use App\Models\LineaProgramatica;
use App\Models\ProyectoFormulario11Linea83;
use App\Models\RolSennova;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
class ProyectoFormulario11Linea83Controller extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Convocatoria $convocatoria)
    {
        return Inertia::render('Convocatorias/Proyectos/ProyectosFormulario11Linea83/Index', [
            'convocatoria'                      => $convocatoria->only('id', 'esta_activa', 'fase_formateada', 'fase', 'tipo_convocatoria', 'year'),
            'proyectos_formulario_11_linea_83'  => ProyectoFormulario11Linea83::getProyectosPorRol($convocatoria)->appends(['search' => request()->search]),
            'allowed_to_create'                 => Gate::inspect('formular-proyecto', [11, $convocatoria])->allowed()
        ]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create(Convocatoria $convocatoria)
    {
        $this->authorize('formular-proyecto', [11, $convocatoria]);

        /** @var \App\Models\User */
        $auth_user = Auth::user();

        if ($auth_user->hasRole(6)) {
            $centros_formacion = SelectHelper::centrosFormacion()->where('regional_id', $auth_user->centroFormacion->regional->id)->values()->all();
        } else {
            $centros_formacion = SelectHelper::centrosFormacion();
        }

        return Inertia::render('Convocatorias/Proyectos/ProyectosFormulario11Linea83/Create', [
            'convocatoria'          => $convocatoria->only('id', 'esta_activa', 'fase_formateada', 'fase', 'tipo_convocatoria', 'year'),
            'centros_formacion'     => $centros_formacion,
            'roles_sennova'         => RolSennova::select('id as value', 'nombre as label')->orderBy('nombre', 'ASC')->get(),
            'allowed_to_create'     => Gate::inspect('formular-proyecto', [11, $convocatoria])->allowed()
        ]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(ProyectoFormulario11Linea83Request $request, Convocatoria $convocatoria)
    {
        $this->authorize('formular-proyecto', [11, $convocatoria]);

        $proyecto = new Proyecto();
        $proyecto->arboles_completos = false;
        $proyecto->centroFormacion()->associate($request->centro_formacion_id);
        $proyecto->tipoFormularioConvocatoria()->associate(11);
        $proyecto->convocatoria()->associate($convocatoria);
        $proyecto->save();

        $proyecto->participantes()->attach(
            Auth::user()->id,
            [
                'es_formulador'     => true,
                'cantidad_meses'    => $request->cantidad_meses,
                'cantidad_horas'    => $request->cantidad_horas,
                'rol_sennova'       => $request->rol_sennova,
            ]
        );

        $proyecto->proyectoFormulario11Linea83()->create([
            'titulo'                => $request->titulo,
            'fecha_inicio'          => $request->fecha_inicio,
            'fecha_finalizacion'    => $request->fecha_finalizacion,
        ]);

        return redirect()->route('convocatorias.proyectos-formulario-11-linea-83.edit', [$convocatoria, $proyecto])->with('success', 'El recurso se ha creado correctamente.');

    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\ProyectoFormulario11Linea83 $proyecto_formulario_11_linea_83
     * @return \Illuminate\Http\Response
     */
    public function show(Convocatoria $convocatoria, ProyectoFormulario11Linea83 $proyecto_formulario_11_linea_83)
    {
        $this->authorize('visualizar-proyecto-autor', [$proyecto_formulario_11_linea_83->proyecto]);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\ProyectoFormulario11Linea83 $proyecto_formulario_11_linea_83
     * @return \Illuminate\Http\Response
     */
    public function edit(Convocatoria $convocatoria, ProyectoFormulario11Linea83 $proyecto_formulario_11_linea_83)
    {
        $this->authorize('visualizar-proyecto-autor', [$proyecto_formulario_11_linea_83->proyecto]);

        /** @var \App\Models\User */
        $auth_user = Auth::user();

        $proyecto_formulario_11_linea_83->load('proyecto.evaluaciones.evaluacionProyectoFormulario11Linea83');

        $proyecto_formulario_11_linea_83->proyecto->precio_proyecto               = $proyecto_formulario_11_linea_83->proyecto->precioProyecto;
        $proyecto_formulario_11_linea_83->proyecto->centroFormacion;
        $proyecto_formulario_11_linea_83->proyecto->allowed;

        $proyecto_formulario_11_linea_83->mostrar_recomendaciones                 = $proyecto_formulario_11_linea_83->proyecto->mostrar_recomendaciones;
        $proyecto_formulario_11_linea_83->mostrar_requiere_subsanacion            = $proyecto_formulario_11_linea_83->proyecto->mostrar_requiere_subsanacion;

          if ($auth_user->hasRole(16)) {
            $nodos_tecnoparque = SelectHelper::nodosTecnoparque()->where('regional_id', $auth_user->centroFormacion->regional_id)->values()->all();
        } else {
            $nodos_tecnoparque = SelectHelper::nodosTecnoparque();
        }

        return Inertia::render('Convocatorias/Proyectos/ProyectosFormulario11Linea83/Edit', [
            'convocatoria'                      => $convocatoria->only('id', 'esta_activa', 'fase_formateada', 'fase', 'tipo_convocatoria', 'mostrar_recomendaciones', 'year', 'descripcion'),
            'proyecto_formulario_11_linea_83'   => $proyecto_formulario_11_linea_83,
            // 'evaluacion'            => EvaluacionProyectoFormulario11Linea83::find(request()->evaluacion_id),
            'regionales'                        => SelectHelper::regionales(),
            'lineas_programaticas'              => LineaProgramatica::selectRaw('id as value, concat(nombre, \' ∙ \', codigo) as label, codigo')->where('lineas_programaticas.categoria_proyecto', 1)->get(),
            'nodos_tecnoparque'                 => SelectHelper::nodosTecnoparque()->where('centro_formacion_id', $proyecto_formulario_11_linea_83->proyecto->centroFormacion->id)->values()->all(),
            'roles_sennova'                     => RolSennova::select('id as value', 'nombre as label')->orderBy('nombre', 'ASC')->get(),
            'nodos_tecnoparque'                 => $nodos_tecnoparque,
        ]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\ProyectoFormulario11Linea83 $proyecto_formulario_11_linea_83
     * @return \Illuminate\Http\Response
     */
    public function update(ProyectoFormulario11Linea83Request $request, Convocatoria $convocatoria, ProyectoFormulario11Linea83 $proyecto_formulario_11_linea_83)
    {
        $this->authorize('modificar-proyecto-autor', [$proyecto_formulario_11_linea_83->proyecto]);

        $proyecto_formulario_11_linea_83->fecha_inicio                                    = $request->fecha_inicio;
        $proyecto_formulario_11_linea_83->fecha_finalizacion                              = $request->fecha_finalizacion;
        $proyecto_formulario_11_linea_83->resumen                                         = $request->resumen;
        $proyecto_formulario_11_linea_83->antecedentes                                    = $request->antecedentes;
        $proyecto_formulario_11_linea_83->retos_prioridades                               = $request->retos_prioridades;
        $proyecto_formulario_11_linea_83->contribucion_agenda_regional_competitividad     = $request->contribucion_agenda_regional_competitividad;
        $proyecto_formulario_11_linea_83->aportes_conpes                                  = $request->aportes_conpes;
        $proyecto_formulario_11_linea_83->estado_actual_ecosistema_ctel                   = $request->estado_actual_ecosistema_ctel;
        $proyecto_formulario_11_linea_83->logros_implementacion_ctel                      = $request->logros_implementacion_ctel;
        $proyecto_formulario_11_linea_83->justificacion_pertinencia_territorio            = $request->justificacion_pertinencia_territorio;
        $proyecto_formulario_11_linea_83->marco_conceptual                                = $request->marco_conceptual;
        $proyecto_formulario_11_linea_83->bibliografia                                    = $request->bibliografia;

        $proyecto_formulario_11_linea_83->aporta_fortalecimiento_cadenas_agricolas        = $request->aporta_fortalecimiento_cadenas_agricolas;
        $proyecto_formulario_11_linea_83->estrategias_generacion_electrica                = $request->estrategias_generacion_electrica;
        $proyecto_formulario_11_linea_83->estrategias_fortalecimiento_micronegocios       = $request->estrategias_fortalecimiento_micronegocios;
        $proyecto_formulario_11_linea_83->estrategias_articulacion_campesinos             = $request->estrategias_articulacion_campesinos;

        $proyecto_formulario_11_linea_83->save();

        return back()->with('success', 'El recurso se ha actualizado correctamente.');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\ProyectoFormulario11Linea83 $proyecto_formulario_11_linea_83
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request, Convocatoria $convocatoria, ProyectoFormulario11Linea83 $proyecto_formulario_11_linea_83)
    {
        // Proyecto base
        if ($proyecto_formulario_11_linea_83->proyecto_base) {
            return back()->with('error', 'Este proyecto no se puede eliminar.');
        }

        $this->authorize('eliminar-proyecto-autor', [$proyecto_formulario_11_linea_83->proyecto]);

        // if (!Hash::check($request->password, Auth::user()->password)) {
        //     return back()
        //         ->withErrors(['password' => __('The password is incorrect.')]);
        // }

        $proyecto_formulario_11_linea_83->proyecto()->delete();

        return redirect()->route('convocatorias.proyectos-formulario-11-linea-83.index', [$convocatoria])->with('success', 'El recurso se ha eliminado correctamente.');
    }

    public function updateEvaluacion(EvaluacionProyectoFormulario11Linea83Request $request, Convocatoria $convocatoria, EvaluacionProyectoFormulario11Linea83 $evaluacion_proyecto_formulario_11_linea_83)
    {
        $this->authorize('modificar-evaluacion-autor', $evaluacion_proyecto_formulario_11_linea_83->evaluacion);

        $evaluacion_proyecto_formulario_11_linea_83->evaluacion()->update([
            'iniciado' => true,
            'clausula_confidencialidad' => $request->clausula_confidencialidad
        ]);

        $evaluacion_proyecto_formulario_11_linea_83->resumen_regional_comentario = $request->resumen_regional_requiere_comentario == false ? $request->resumen_regional_comentario : null;
        $evaluacion_proyecto_formulario_11_linea_83->antecedentes_regional_comentario = $request->antecedentes_regional_requiere_comentario == false ? $request->antecedentes_regional_comentario : null;
        $evaluacion_proyecto_formulario_11_linea_83->municipios_comentario = $request->municipios_requiere_comentario == false ? $request->municipios_comentario : null;
        $evaluacion_proyecto_formulario_11_linea_83->fecha_ejecucion_comentario = $request->fecha_ejecucion_requiere_comentario == false ? $request->fecha_ejecucion_comentario : null;
        $evaluacion_proyecto_formulario_11_linea_83->cadena_valor_comentario = $request->cadena_valor_requiere_comentario == false ? $request->cadena_valor_comentario : null;
        $evaluacion_proyecto_formulario_11_linea_83->bibliografia_comentario = $request->bibliografia_requiere_comentario == false ? $request->bibliografia_comentario : null;
        $evaluacion_proyecto_formulario_11_linea_83->retos_oportunidades_comentario = $request->retos_oportunidades_requiere_comentario == false ? $request->retos_oportunidades_comentario : null;
        $evaluacion_proyecto_formulario_11_linea_83->pertinencia_territorio_comentario = $request->pertinencia_territorio_requiere_comentario == false ? $request->pertinencia_territorio_comentario : null;
        $evaluacion_proyecto_formulario_11_linea_83->ortografia_comentario = $request->ortografia_requiere_comentario == false ? $request->ortografia_comentario : null;
        $evaluacion_proyecto_formulario_11_linea_83->redaccion_comentario = $request->redaccion_requiere_comentario == false ? $request->redaccion_comentario : null;
        $evaluacion_proyecto_formulario_11_linea_83->normas_apa_comentario = $request->normas_apa_requiere_comentario == false ? $request->normas_apa_comentario : null;

        $evaluacion_proyecto_formulario_11_linea_83->save();

        return redirect()->back()->with('success', 'El recurso ha sido actualizado correctamente.');
    }

    public function saveFilesSharepoint($tmp_file, $modulo, $modelo, $campo_bd)
    {
        $proyecto_formulario_11_linea_83              = $modelo;
        $proyecto                           = Proyecto::find($proyecto_formulario_11_linea_83->proyecto->id);

        $sharepoint_proyecto_formulario_11_linea_83   = $proyecto->centroFormacion->nombre_carpeta_sharepoint . '/' . $proyecto->tipoFormularioConvocatoria->lineaProgramatica->codigo . '/' . $proyecto->codigo . '/PDF Proyecto';

        $sharepoint_path                    = "$modulo/$sharepoint_proyecto_formulario_11_linea_83";

        SharepointHelper::saveFilesSharepoint($tmp_file, $modelo, $sharepoint_path, $campo_bd);
    }

    public function downloadFileSharepoint(Convocatoria $convocatoria, ProyectoFormulario11Linea83 $proyecto_formulario_11_linea_83, $tipo_archivo)
    {
        $sharepoint_path = $proyecto_formulario_11_linea_83[$tipo_archivo];

        return SharepointHelper::downloadFile($sharepoint_path);
    }

    public function updateMetodologiaProyectoFormulario11Linea83(Request $request, Convocatoria $convocatoria, Proyecto $proyecto)
    {
        $this->authorize('modificar-proyecto-autor', $proyecto);

        $proyecto->proyectoFormulario11Linea83()->update($request->all());

        $proyecto->save();

        return back()->with('success', 'El recurso se ha guardado correctamente.');
    }

    public function updateLongColumn(ProyectoFormulario11Linea83ColumnRequest $request, Convocatoria $convocatoria, ProyectoFormulario11Linea83 $proyecto_formulario_11_linea_83, $column)
    {
        $this->authorize('modificar-proyecto-autor', [$proyecto_formulario_11_linea_83->proyecto]);

        $proyecto_formulario_11_linea_83->update($request->only($column));

        return back();
    }
}
