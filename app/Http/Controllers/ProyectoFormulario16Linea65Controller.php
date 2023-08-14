<?php

namespace App\Http\Controllers;

use App\Helpers\SelectHelper;
use App\Models\Proyecto;
use App\Models\ProyectoFormulario16Linea65;
use App\Models\Convocatoria;
use App\Models\MesaSectorial;
use App\Http\Requests\Evaluacion\EvaluacionProyectoFormulario16Linea65Request;
use App\Http\Requests\ProyectoFormulario16Linea65ColumnRequest;
use App\Http\Requests\ProyectoFormulario16Linea65Request;
use App\Models\ActividadEconomica;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use App\Models\CentroFormacion;
use App\Models\DisciplinaSubareaConocimiento;
use App\Models\Evaluacion\EvaluacionProyectoFormulario16Linea65;
use App\Models\RolSennova;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class ProyectoFormulario16Linea65Controller extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Convocatoria $convocatoria)
    {
        return Inertia::render('Convocatorias/Proyectos/ProyectosFormulario16Linea65/Index', [
            'convocatoria'                      => $convocatoria->only('id', 'esta_activa', 'fase_formateada', 'fase', 'tipo_convocatoria', 'year'),
            'proyectos_formulario_16_linea_65'  => ProyectoFormulario16Linea65::getProyectosPorRol($convocatoria)->appends(['search' => request()->search, 'estructuracion_proyectos' => request()->estructuracion_proyectos]),
            'allowed_to_create'                 => Gate::inspect('formular-proyecto', [9, $convocatoria])->allowed()
        ]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create(Convocatoria $convocatoria)
    {
        $this->authorize('formular-proyecto', [9, $convocatoria]);

        $centros_formacion = CentroFormacion::selectRaw('centros_formacion.id as value, concat(centros_formacion.nombre, chr(10), \'∙ Código: \', centros_formacion.codigo) as label')->orderBy('centros_formacion.nombre', 'ASC')->get();

        return Inertia::render('Convocatorias/Proyectos/ProyectosFormulario16Linea65/Create', [
            'convocatoria'              => $convocatoria->only('id', 'esta_activa', 'fase_formateada', 'fase', 'year'),
            'centros_formacion'         => $centros_formacion,
            'lineas_investigacion'      => SelectHelper::lineasInvestigacion(),
            'areas_cualificacion_mnc'   => json_decode(Storage::get('json/areas-cualificacion-mnc.json'), true),
            'ejes_sennova'              => json_decode(Storage::get('json/ejes-sennova.json'), true),
            'roles_sennova'             => RolSennova::select('id as value', 'nombre as label')->orderBy('nombre', 'ASC')->get(),
            'allowed_to_create'         => Gate::inspect('formular-proyecto', [9, $convocatoria])->allowed()
        ]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(ProyectoFormulario16Linea65Request $request, Convocatoria $convocatoria)
    {
        $this->authorize('formular-proyecto', [9, $convocatoria]);

        $proyecto = new Proyecto();
        $proyecto->centroFormacion()->associate($request->centro_formacion_id);
        $proyecto->tipoFormularioConvocatoria()->associate(16);
        $proyecto->convocatoria()->associate($convocatoria);
        $proyecto->save();

        $proyecto_formulario_16_linea_65 = new ProyectoFormulario16Linea65();
        $proyecto_formulario_16_linea_65->titulo                              = $request->titulo;
        $proyecto_formulario_16_linea_65->fecha_inicio                        = $request->fecha_inicio;
        $proyecto_formulario_16_linea_65->fecha_finalizacion                  = $request->fecha_finalizacion;
        $proyecto_formulario_16_linea_65->eje_sennova                         = $request->eje_sennova;
        $proyecto_formulario_16_linea_65->areas_cualificacion_mnc             = $request->areas_cualificacion_mnc;

        $proyecto_formulario_16_linea_65->max_meses_ejecucion                 = $request->max_meses_ejecucion;
        $proyecto_formulario_16_linea_65->justificacion_politica_discapacidad = null;
        $proyecto_formulario_16_linea_65->resumen                             = '';
        $proyecto_formulario_16_linea_65->antecedentes                        = '';
        $proyecto_formulario_16_linea_65->marco_conceptual                    = '';
        $proyecto_formulario_16_linea_65->metodologia                         = '';
        $proyecto_formulario_16_linea_65->propuesta_sostenibilidad            = '';
        $proyecto_formulario_16_linea_65->bibliografia                        = '';
        $proyecto_formulario_16_linea_65->numero_beneficiarios                = 0;
        $proyecto_formulario_16_linea_65->impacto_municipios                  = '';
        $proyecto_formulario_16_linea_65->impacto_centro_formacion            = '';

        $proyecto_formulario_16_linea_65->relacionado_plan_tecnologico        = 2;
        $proyecto_formulario_16_linea_65->relacionado_agendas_competitividad  = 2;
        $proyecto_formulario_16_linea_65->relacionado_mesas_sectoriales       = 2;

        $proyecto_formulario_16_linea_65->disciplinas_conocimiento            = DisciplinaSubareaConocimiento::select('id')->get()->pluck('id')->toJson();
        $proyecto_formulario_16_linea_65->actividades_economicas              = ActividadEconomica::select('id')->get()->pluck('id')->toJson();

        $proyecto->proyectoFormulario16Linea65()->save($proyecto_formulario_16_linea_65);

        $proyecto->participantes()->attach(
            Auth::user()->id,
            [
                'es_formulador'     => true,
                'cantidad_meses'    => $request->cantidad_meses,
                'cantidad_horas'    => $request->cantidad_horas,
                'rol_sennova'       => $request->rol_sennova,
            ]
        );

        return redirect()->route('convocatorias.proyectos-formulario-16-linea-65.edit', [$convocatoria, $proyecto_formulario_16_linea_65])->with('success', 'El recurso se ha creado correctamente. Por favor continue diligenciando la información.');
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\ProyectoFormulario16Linea65  $proyecto_formulario_16_linea_65
     * @return \Illuminate\Http\Response
     */
    public function show(Convocatoria $convocatoria, ProyectoFormulario16Linea65 $proyecto_formulario_16_linea_65)
    {
        $this->authorize('visualizar-proyecto-autor', [$proyecto_formulario_16_linea_65->proyecto]);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\ProyectoFormulario16Linea65  $proyecto_formulario_16_linea_65
     * @return \Illuminate\Http\Response
     */
    public function edit(Convocatoria $convocatoria, ProyectoFormulario16Linea65 $proyecto_formulario_16_linea_65)
    {
        $this->authorize('visualizar-proyecto-autor', [$proyecto_formulario_16_linea_65->proyecto]);

        // $proyecto_formulario_16_linea_65->load('proyecto.evaluaciones.evaluacion_proyecto_formulario_16_linea_65');

        $proyecto_formulario_16_linea_65->proyecto->precio_proyecto           = $proyecto_formulario_16_linea_65->proyecto->precioProyecto;
        $proyecto_formulario_16_linea_65->proyecto->centroFormacion;
        $proyecto_formulario_16_linea_65->proyecto->municipios;
        $proyecto_formulario_16_linea_65->proyecto->programasFormacion;
        $proyecto_formulario_16_linea_65->proyecto->mesasSectoriales;
        $proyecto_formulario_16_linea_65->proyecto->tipoFormularioConvocatoria->lineaProgramatica;

        $proyecto_formulario_16_linea_65->mostrar_recomendaciones             = $proyecto_formulario_16_linea_65->proyecto->mostrar_recomendaciones;
        $proyecto_formulario_16_linea_65->mostrar_requiere_subsanacion        = $proyecto_formulario_16_linea_65->proyecto->mostrar_requiere_subsanacion;

        return Inertia::render('Convocatorias/Proyectos/ProyectosFormulario16Linea65/Edit', [
            'convocatoria'                                  => $convocatoria->only('id', 'esta_activa', 'fase_formateada', 'fase', 'year', 'tipo_convocatoria', 'mostrar_recomendaciones', 'campos_convocatoria'),
            'proyecto_formulario_16_linea_65'               => $proyecto_formulario_16_linea_65,
            'evaluacion'                                    => EvaluacionProyectoFormulario16Linea65::find(request()->evaluacion_id),
            'mesas_sectoriales'                             => MesaSectorial::select('id as value', 'nombre as label')->get('id'),
            'lineas_programaticas'                          => SelectHelper::lineasProgramaticas(),
            'areas_cualificacion_mnc'                       => json_decode(Storage::get('json/areas-cualificacion-mnc.json'), true),
            'lineas_estrategicas_sena'                      => json_decode(Storage::get('json/lineas-estrategicas.json'), true),
            'ejes_sennova'                                  => json_decode(Storage::get('json/ejes-sennova.json'), true),
            'municipios'                                    => SelectHelper::municipios(),
            'programas_formacion_con_registro_calificado'   => SelectHelper::programasFormacion()->where('registro_calificado', true)->where('centro_formacion_id', $proyecto_formulario_16_linea_65->proyecto->centro_formacion_id)->values()->all(),
            'programas_formacion_sin_registro_calificado'   => SelectHelper::programasFormacion()->where('registro_calificado', false)->values()->all(),
            'roles_sennova'                                 => RolSennova::select('id as value', 'nombre as label')->orderBy('nombre', 'ASC')->get(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\ProyectoFormulario16Linea65  $proyecto_formulario_16_linea_65
     * @return \Illuminate\Http\Response
     */
    public function update(ProyectoFormulario16Linea65Request $request, Convocatoria $convocatoria, ProyectoFormulario16Linea65 $proyecto_formulario_16_linea_65)
    {
        $this->authorize('modificar-proyecto-autor', [$proyecto_formulario_16_linea_65->proyecto]);

        $proyecto_formulario_16_linea_65->titulo                                    = $request->titulo;
        $proyecto_formulario_16_linea_65->fecha_inicio                              = $request->fecha_inicio;
        $proyecto_formulario_16_linea_65->fecha_finalizacion                        = $request->fecha_finalizacion;
        $proyecto_formulario_16_linea_65->max_meses_ejecucion                       = $request->max_meses_ejecucion;

        $proyecto_formulario_16_linea_65->numero_beneficiarios                      = $request->numero_beneficiarios;

        $proyecto_formulario_16_linea_65->resumen                                   = $request->resumen;
        $proyecto_formulario_16_linea_65->antecedentes                              = $request->antecedentes;
        $proyecto_formulario_16_linea_65->marco_conceptual                          = $request->marco_conceptual;

        $proyecto_formulario_16_linea_65->justificacion_politica_discapacidad       = $request->justificacion_politica_discapacidad;
        $proyecto_formulario_16_linea_65->impacto_municipios                        = $request->impacto_municipios;
        $proyecto_formulario_16_linea_65->impacto_centro_formacion                  = $request->impacto_centro_formacion;
        $proyecto_formulario_16_linea_65->bibliografia                              = $request->bibliografia;
        $proyecto_formulario_16_linea_65->atencion_pluralista_diferencial           = $request->atencion_pluralista_diferencial;

        $proyecto_formulario_16_linea_65->relacionado_plan_tecnologico              = $request->relacionado_plan_tecnologico;
        $proyecto_formulario_16_linea_65->relacionado_agendas_competitividad        = $request->relacionado_agendas_competitividad;
        $proyecto_formulario_16_linea_65->relacionado_mesas_sectoriales             = $request->relacionado_mesas_sectoriales;

        $proyecto_formulario_16_linea_65->eje_sennova                               = $request->eje_sennova;
        $proyecto_formulario_16_linea_65->areas_cualificacion_mnc                   = $request->areas_cualificacion_mnc;
        $proyecto_formulario_16_linea_65->aportacion_linea_transeversal_campesena   = $request->aportacion_linea_transeversal_campesena;
        $proyecto_formulario_16_linea_65->lineas_estrategicas_sena                  = $request->lineas_estrategicas_sena;
        $proyecto_formulario_16_linea_65->justificacion_aportes_lineas_estrategicas = $request->justificacion_aportes_lineas_estrategicas;
        $proyecto_formulario_16_linea_65->lineas_programaticas_sennova              = $request->lineas_programaticas_sennova;

        $proyecto_formulario_16_linea_65->save();

        $proyecto_formulario_16_linea_65->proyecto->municipios()->sync($request->municipios);
        $proyecto_formulario_16_linea_65->proyecto->programasFormacion()->sync(array_merge($request->programas_formacion ? $request->programas_formacion : [], $request->programas_formacion_articulados ? $request->programas_formacion_articulados : []));

        $request->relacionado_mesas_sectoriales == 1 ? $proyecto_formulario_16_linea_65->proyecto->mesasSectoriales()->sync($request->mesa_sectorial_id) : $proyecto_formulario_16_linea_65->proyecto->mesasSectoriales()->detach();

        return back()->with('success', 'El recurso se ha actualizado correctamente.');
    }

    public function updateLongColumn(ProyectoFormulario16Linea65ColumnRequest $request, Convocatoria $convocatoria, ProyectoFormulario16Linea65 $proyecto_formulario_16_linea_65, $column)
    {
        $this->authorize('modificar-proyecto-autor', [$proyecto_formulario_16_linea_65->proyecto]);

        if ($column == 'programas_formacion' || $column == 'programas_formacion_articulados') {
            $proyecto_formulario_16_linea_65->proyecto->programasFormacion()->sync(array_merge($request->programas_formacion ? $request->programas_formacion : [], $request->programas_formacion_articulados ? $request->programas_formacion_articulados : []));
            return back();
        }

        if ($column == 'municipios') {
            $proyecto_formulario_16_linea_65->proyecto->municipios()->sync($request->only($column)[$column]);
            return back();
        }

        if ($column == 'mesa_sectorial_id') {
            $proyecto_formulario_16_linea_65->proyecto->mesasSectoriales()->sync($request->only($column)[$column]);
            return back();
        }

        $proyecto_formulario_16_linea_65->update($request->only($column));

        return back();
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\ProyectoFormulario16Linea65  $proyecto_formulario_16_linea_65
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request, Convocatoria $convocatoria, ProyectoFormulario16Linea65 $proyecto_formulario_16_linea_65)
    {
        $this->authorize('eliminar-proyecto-autor', [$proyecto_formulario_16_linea_65->proyecto]);

        // if (!Hash::check($request->password, Auth::user()->password)) {
        //     return back()
        //         ->withErrors(['password' => __('The password is incorrect.')]);
        // }

        $proyecto_formulario_16_linea_65->proyecto()->delete();

        return back()->with('success', 'El recurso se ha eliminado correctamente.');
    }

    public function updateEvaluacion(EvaluacionProyectoFormulario16Linea65Request $request, Convocatoria $convocatoria, EvaluacionProyectoFormulario16Linea65 $evaluacion_proyecto_formulario_16_linea_65)
    {
        $this->authorize('modificar-evaluacion-autor', $evaluacion_proyecto_formulario_16_linea_65->evaluacion);

        $evaluacion_proyecto_formulario_16_linea_65->evaluacion()->update([
            'iniciado' => true,
            'clausula_confidencialidad' => $request->clausula_confidencialidad

        ]);

        $evaluacion_proyecto_formulario_16_linea_65->titulo_puntaje                                      = $request->titulo_puntaje;
        $evaluacion_proyecto_formulario_16_linea_65->titulo_comentario                                   = $request->titulo_requiere_comentario == false ? $request->titulo_comentario : null;
        $evaluacion_proyecto_formulario_16_linea_65->video_puntaje                                       = $request->video_puntaje;
        $evaluacion_proyecto_formulario_16_linea_65->video_comentario                                    = $request->video_requiere_comentario == false ? $request->video_comentario : null;

        $evaluacion_proyecto_formulario_16_linea_65->antecedentes_puntaje                                = $request->antecedentes_puntaje;
        $evaluacion_proyecto_formulario_16_linea_65->antecedentes_comentario                             = $request->antecedentes_requiere_comentario == false ? $request->antecedentes_comentario : null;

        $evaluacion_proyecto_formulario_16_linea_65->resumen_puntaje                                     = $request->resumen_puntaje;
        $evaluacion_proyecto_formulario_16_linea_65->resumen_comentario                                  = $request->resumen_requiere_comentario == false ? $request->resumen_comentario : null;
        $evaluacion_proyecto_formulario_16_linea_65->ortografia_puntaje                                  = $request->ortografia_puntaje;
        $evaluacion_proyecto_formulario_16_linea_65->ortografia_comentario                               = $request->ortografia_requiere_comentario == false ? $request->ortografia_comentario : null;
        $evaluacion_proyecto_formulario_16_linea_65->redaccion_puntaje                                   = $request->redaccion_puntaje;
        $evaluacion_proyecto_formulario_16_linea_65->redaccion_comentario                                = $request->redaccion_requiere_comentario == false ? $request->redaccion_comentario : null;
        $evaluacion_proyecto_formulario_16_linea_65->normas_apa_puntaje                                  = $request->normas_apa_puntaje;
        $evaluacion_proyecto_formulario_16_linea_65->normas_apa_comentario                               = $request->normas_apa_requiere_comentario == false ? $request->normas_apa_comentario : null;

        $evaluacion_proyecto_formulario_16_linea_65->justificacion_economia_naranja_comentario           = $request->justificacion_economia_naranja_requiere_comentario == false ? $request->justificacion_economia_naranja_comentario : null;
        $evaluacion_proyecto_formulario_16_linea_65->justificacion_industria_4_comentario                = $request->justificacion_industria_4_requiere_comentario == false ? $request->justificacion_industria_4_comentario : null;
        $evaluacion_proyecto_formulario_16_linea_65->bibliografia_comentario                             = $request->bibliografia_requiere_comentario == false ? $request->bibliografia_comentario : null;
        $evaluacion_proyecto_formulario_16_linea_65->fechas_comentario                                   = $request->fechas_requiere_comentario == false ? $request->fechas_comentario : null;
        $evaluacion_proyecto_formulario_16_linea_65->justificacion_politica_discapacidad_comentario      = $request->justificacion_politica_discapacidad_requiere_comentario == false ? $request->justificacion_politica_discapacidad_comentario : null;
        $evaluacion_proyecto_formulario_16_linea_65->actividad_economica_comentario                      = $request->actividad_economica_requiere_comentario == false ? $request->actividad_economica_comentario : null;
        $evaluacion_proyecto_formulario_16_linea_65->area_conocimiento_comentario                        = $request->area_conocimiento_requiere_comentario == false ? $request->area_conocimiento_comentario : null;
        $evaluacion_proyecto_formulario_16_linea_65->tematica_estrategica_comentario                     = $request->tematica_estrategica_requiere_comentario == false ? $request->tematica_estrategica_comentario : null;

        $evaluacion_proyecto_formulario_16_linea_65->save();

        return back()->with('success', 'El recurso se ha actualizado correctamente.');
    }
}
