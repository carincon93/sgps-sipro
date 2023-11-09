<?php

namespace App\Http\Controllers;

use App\Helpers\FunctionsHelper;
use App\Helpers\SharepointHelper;
use App\Helpers\SelectHelper;
use App\Models\Convocatoria;
use App\Models\Proyecto;
use App\Models\TecnoAcademia;
use App\Http\Controllers\Controller;
use App\Http\Requests\AulaMovilRequest;
use App\Http\Requests\Evaluacion\EvaluacionProyectoFormulario4Linea70Request;
use App\Http\Requests\ProyectoFormulario4Linea70Request;
use App\Models\Actividad;
use App\Models\AulaMovil;
use App\Models\Evaluacion\Evaluacion;
use App\Models\Evaluacion\EvaluacionProyectoFormulario4Linea70;
use App\Models\ProyectoFormulario4Linea70;
use App\Models\RolSennova;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ProyectoFormulario4Linea70Controller extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Convocatoria $convocatoria)
    {
        return Inertia::render('Convocatorias/Proyectos/ProyectosFormulario4Linea70/Index', [
            'convocatoria'                      => $convocatoria->only('id', 'esta_activa', 'fase_formateada', 'fase', 'tipo_convocatoria', 'year'),
            'proyectos_formulario_4_linea_70'   => ProyectoFormulario4Linea70::getProyectosPorRol($convocatoria)->appends(['search' => request()->search, 'estructuracion_proyectos' => request()->estructuracion_proyectos]),
            'allowed_to_create'                 => Gate::inspect('formular-proyecto', [5, $convocatoria])->allowed()
        ]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create(Convocatoria $convocatoria)
    {
        $this->authorize('formular-proyecto', [5, $convocatoria]);

        /** @var \App\Models\User */
        $auth_user = Auth::user();

        if ($auth_user->hasRole([10, 12])) {
            $tecnoacademias = SelectHelper::tecnoacademias()->where('regional_id', $auth_user->centroFormacion->regional->id)->values()->all();
        } else {
            $tecnoacademias = SelectHelper::tecnoacademias();
        }

        return Inertia::render('Convocatorias/Proyectos/ProyectosFormulario4Linea70/Create', [
            'convocatoria'                      => $convocatoria->only('id', 'esta_activa', 'fase_formateada', 'fase', 'tipo_convocatoria', 'year'),
            'tecnoacademias'                    => $tecnoacademias,
            'lineas_tecnoacademia'              => SelectHelper::lineasTecnoacademia(),
            'roles_sennova'                     => RolSennova::select('id as value', 'nombre as label')->orderBy('nombre', 'ASC')->get(),
            'infraestructura_tecnoacademia'     => json_decode(Storage::get('json/infraestructura-tecnoacademia.json'), true),
            'allowed_to_create'                 => Gate::inspect('formular-proyecto', [5, $convocatoria])->allowed()
        ]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(ProyectoFormulario4Linea70Request $request, Convocatoria $convocatoria, Proyecto $proyecto)
    {
        $this->authorize('formular-proyecto', [5, $convocatoria]);

        $tecnoAcademia = TecnoAcademia::find($request->tecnoacademia_id);

        $proyecto = new Proyecto();
        $proyecto->arboles_completos = true;
        $proyecto->centroFormacion()->associate($tecnoAcademia->centro_formacion_id);
        $proyecto->tipoFormularioConvocatoria()->associate(4);
        $proyecto->convocatoria()->associate($convocatoria);
        $proyecto->save();

        $proyecto->tecnoacademiaLineasTecnoacademia()->sync($request->tecnoacademia_linea_tecnoacademia_id);

        $proyecto->participantes()->attach(
            Auth::user()->id,
            [
                'es_formulador'     => true,
                'cantidad_meses'    => $request->cantidad_meses,
                'cantidad_horas'    => $request->cantidad_horas,
                'rol_sennova'       => $request->rol_sennova,
            ]
        );

        if ($convocatoria->proyectos()->whereHas('proyectoFormulario4Linea70')->count() == 0) {
            $proyecto->proyectoFormulario4Linea70()->create([
                'tecnoacademia_id'      => $request->tecnoacademia_id,
                'fecha_inicio'          => $request->fecha_inicio,
                'fecha_finalizacion'    => $request->fecha_finalizacion,
                'proyecto_base'         => true
            ]);
            return redirect()->route('convocatorias.proyectos-formulario-4-linea-70.edit', [$convocatoria, $proyecto])->with('success', 'El recurso se ha creado correctamente. Este es el proyecto base, por favor defina los campos con información precargada.');
        }

        $proyecto_a_replicar = $convocatoria->proyectos()
            ->whereHas('proyectoFormulario4Linea70', function ($query) {
                $query->where('proyecto_base', true);
            })
            ->first();

        $nuevo_proyecto_formulario_4_linea_70 = $this->replicateRow($request, $proyecto_a_replicar->proyectoFormulario4Linea70, $proyecto);

        if ($nuevo_proyecto_formulario_4_linea_70) {
            return redirect()->route('convocatorias.proyectos-formulario-4-linea-70.edit', [$convocatoria, $proyecto])->with('success', 'El recurso se ha creado correctamente.');
        } else {
            return back()->with('error', 'No hay un proyecto base generado. Por favor notifique al activador(a) de la línea.');
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\ProyectoFormulario4Linea70 $proyecto_formulario_4_linea_70
     * @return \Illuminate\Http\Response
     */
    public function show(Convocatoria $convocatoria, ProyectoFormulario4Linea70 $proyecto_formulario_4_linea_70)
    {
        $this->authorize('visualizar-proyecto-autor', [$proyecto_formulario_4_linea_70->proyecto]);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\ProyectoFormulario4Linea70 $proyecto_formulario_4_linea_70
     * @return \Illuminate\Http\Response
     */
    public function edit(Convocatoria $convocatoria, ProyectoFormulario4Linea70 $proyecto_formulario_4_linea_70)
    {
        $this->authorize('visualizar-proyecto-autor', [$proyecto_formulario_4_linea_70->proyecto]);

        if ($proyecto_formulario_4_linea_70->proyecto->convocatoria_id != $convocatoria->id) {
            return abort(404);
        }

        if (request()->filled('evaluacion_id')) {
            $evaluacion = Evaluacion::find(request()->evaluacion_id);

            $this->authorize('modificar-evaluacion-autor', [$evaluacion]);

            $items_evaluacion = $evaluacion->getItemsAEvaluar($convocatoria->id, $proyecto_formulario_4_linea_70->proyecto->tipo_formulario_convocatoria_id);
        }

        $proyecto_formulario_4_linea_70->load('proyecto.proyectoRolesSennova.proyectoRolesEvaluaciones', 'proyecto.proyectoPresupuesto.proyectoPresupuestosEvaluaciones');
        // $proyecto_formulario_4_linea_70->load('proyecto.evaluaciones.evaluacionProyectoFormulario4Linea70');

        $proyecto_formulario_4_linea_70->proyecto->precio_proyecto           = $proyecto_formulario_4_linea_70->proyecto->precioProyecto;
        $proyecto_formulario_4_linea_70->proyecto->centroFormacion;
        $proyecto_formulario_4_linea_70->proyecto->participantes;
        $proyecto_formulario_4_linea_70->proyecto->tipoFormularioConvocatoria->lineaProgramatica;
        $proyecto_formulario_4_linea_70->proyecto->tecnoacademiaLineasTecnoacademia;

        $proyecto_formulario_4_linea_70->mostrar_recomendaciones        = $proyecto_formulario_4_linea_70->proyecto->mostrar_recomendaciones;
        $proyecto_formulario_4_linea_70->mostrar_requiere_subsanacion   = $proyecto_formulario_4_linea_70->proyecto->mostrar_requiere_subsanacion;

        return Inertia::render('Convocatorias/Proyectos/ProyectosFormulario4Linea70/Edit', [
            'convocatoria'                          => $convocatoria,
            'proyecto_formulario_4_linea_70'        => $proyecto_formulario_4_linea_70,
            'centros_formacion'                     => SelectHelper::centrosFormacion(),
            'evaluacion'                            => $items_evaluacion ?? [],
            'tecnoacademias'                        => SelectHelper::tecnoacademias(),
            'tecnoacademia'                         => $proyecto_formulario_4_linea_70->proyecto->tecnoacademiaLineasTecnoacademia()->first() ? $proyecto_formulario_4_linea_70->proyecto->tecnoacademiaLineasTecnoacademia()->first()->tecnoacademia->only('id', 'nombre') : null,
            'lineas_programaticas'                  => SelectHelper::lineasProgramaticas(),
            'lineas_tecnoacademia'                  => SelectHelper::lineasTecnoacademia(),
            'roles_sennova'                         => RolSennova::select('id as value', 'nombre as label')->orderBy('nombre', 'ASC')->get(),
            'infraestructura_tecnoacademia'         => json_decode(Storage::get('json/infraestructura-tecnoacademia.json'), true),
        ]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\ProyectoFormulario4Linea70 $proyecto_formulario_4_linea_70
     * @return \Illuminate\Http\Response
     */
    public function update(ProyectoFormulario4Linea70Request $request, Convocatoria $convocatoria, ProyectoFormulario4Linea70 $proyecto_formulario_4_linea_70)
    {
        $this->authorize('modificar-proyecto-autor', [$proyecto_formulario_4_linea_70->proyecto]);

        $proyecto_formulario_4_linea_70->tecnoacademia()->associate($request->tecnoacademia_id);
        $proyecto_formulario_4_linea_70->fecha_inicio                           = $request->fecha_inicio;
        $proyecto_formulario_4_linea_70->fecha_finalizacion                     = $request->fecha_finalizacion;
        $proyecto_formulario_4_linea_70->max_meses_ejecucion                    = $request->max_meses_ejecucion;

        $proyecto_formulario_4_linea_70->logros_vigencia_anterior               = $request->logros_vigencia_anterior;
        $proyecto_formulario_4_linea_70->resumen                                = $request->resumen;
        $proyecto_formulario_4_linea_70->resumen_regional                       = $request->resumen_regional;
        $proyecto_formulario_4_linea_70->antecedentes                           = $request->antecedentes;
        $proyecto_formulario_4_linea_70->antecedentes_tecnoacademia             = $request->antecedentes_tecnoacademia;
        $proyecto_formulario_4_linea_70->justificacion_problema                 = $request->justificacion_problema;
        $proyecto_formulario_4_linea_70->marco_conceptual                       = $request->marco_conceptual;
        $proyecto_formulario_4_linea_70->bibliografia                           = $request->bibliografia;
        $proyecto_formulario_4_linea_70->pertinencia_territorio                 = $request->pertinencia_territorio;
        $proyecto_formulario_4_linea_70->retos_oportunidades                    = $request->retos_oportunidades;
        $proyecto_formulario_4_linea_70->lineas_tecnologicas_centro             = $request->lineas_tecnologicas_centro;
        $proyecto_formulario_4_linea_70->logros_vigencia_anterior               = $request->logros_vigencia_anterior;
        $proyecto_formulario_4_linea_70->infraestructura_tecnoacademia          = $request->infraestructura_tecnoacademia;

        $proyecto_formulario_4_linea_70->save();

        $proyecto_formulario_4_linea_70->proyecto->tecnoacademiaLineasTecnoacademia()->sync($request->tecnoacademia_linea_tecnoacademia_id);

        return back()->with('success', 'El recurso se ha actualizado correctamente.');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\ProyectoFormulario4Linea70 $proyecto_formulario_4_linea_70
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request, Convocatoria $convocatoria, ProyectoFormulario4Linea70 $proyecto_formulario_4_linea_70)
    {
        if ($proyecto_formulario_4_linea_70->proyecto_base) {
            return back()->with('error', 'Este proyecto no se puede eliminar.');
        }

        $this->authorize('eliminar-proyecto-autor', [$proyecto_formulario_4_linea_70->proyecto]);

        // if (!Hash::check($request->password, Auth::user()->password)) {
        //     return back()
        //         ->withErrors(['password' => __('The password is incorrect.')]);
        // }

        $proyecto_formulario_4_linea_70->proyecto()->delete();

        return back()->with('success', 'El recurso se ha eliminado correctamente.');
    }

    public function updateEvaluacion(EvaluacionProyectoFormulario4Linea70Request $request, Convocatoria $convocatoria)
    {
        $evaluacion = Evaluacion::find($request->evaluacion_id);

        $this->authorize('modificar-evaluacion-autor', $evaluacion);

        $items_evaluacion_filtrados = [];
        $temp_array = [];

        foreach ($request->all() as $key => $value) {
            // Check if the key starts with "form_"
            if (strpos($key, "form_") === 0) {
                $temp_array[$key] = $value;

                // When tempArray has 4 items, add it to the resultArray and reset tempArray
                if (count($temp_array) === 5) {
                    $items_evaluacion_filtrados[] = $temp_array;
                    $temp_array = [];
                }
            }
        }

        // If there are any remaining items in tempArray, add it to the resultArray
        if (!empty($temp_array)) {
            $items_evaluacion_filtrados[] = $temp_array;
        }

        $evaluacion->update([
            'iniciado'                  => true,
            'clausula_confidencialidad' => $request->clausula_confidencialidad
        ]);

        foreach ($items_evaluacion_filtrados as $item) {
            $pregunta_id = last($item);

            EvaluacionProyectoFormulario4Linea70::updateOrCreate(
                [
                    'id'            => $item['form_evaluacion_id_pregunta_id_' . $pregunta_id],
                    'pregunta_id'   => $pregunta_id,
                    'evaluacion_id' => $request->evaluacion_id
                ],
                [
                    'comentario'    => $item['form_requiere_comentario_pregunta_id_' . $pregunta_id] ? $item['form_comentario_pregunta_id_' . $pregunta_id] : null,
                    'puntaje'       => $item['form_puntaje_pregunta_id_' . $pregunta_id],
                ],
            );
        }

        return redirect()->back()->with('success', 'El recurso ha sido actualizado correctamente.');
    }

    public function updateLongColumn(Request $request, Convocatoria $convocatoria, ProyectoFormulario4Linea70 $proyecto_formulario_4_linea_70, $column)
    {
        $this->authorize('modificar-proyecto-autor', [$proyecto_formulario_4_linea_70->proyecto]);

        if ($column == 'fecha_inicio') {
            $proyecto_formulario_4_linea_70->update([
                'max_meses_ejecucion' => FunctionsHelper::diffMonths($request->fecha_inicio, $proyecto_formulario_4_linea_70->fecha_finalizacion)
            ]);
        } elseif ($column == 'fecha_finalizacion') {
            $proyecto_formulario_4_linea_70->update([
                'max_meses_ejecucion' => FunctionsHelper::diffMonths($proyecto_formulario_4_linea_70->fecha_inicio, $request->fecha_finalizacion)
            ]);
        }

        if ($column == 'tecnoacademia_linea_tecnoacademia_id') {
            $proyecto_formulario_4_linea_70->proyecto->tecnoacademiaLineasTecnoacademia()->sync($request->only($column)[$column]);

            return back();
        }

        $proyecto_formulario_4_linea_70->update($request->only($column));

        return back();
    }

    /**
     * updateCantidadRolesTa
     *
     * @param  mixed $request
     * @param  mixed $convocatoria
     * @param  mixed $proyecto
     * @return void
     */
    public function updateCantidadRolesTa(Request $request, Convocatoria $convocatoria, Proyecto $proyecto)
    {
        $this->authorize('modificar-proyecto-autor', $proyecto);

        $request->validate([
            'cantidad_instructores_planta'    => 'required|integer|min:0|max:32767',
            'cantidad_dinamizadores_planta'   => 'required|integer|min:0|max:32767',
            'cantidad_psicopedagogos_planta'  => 'required|integer|min:0|max:32767'
        ]);

        $proyecto->proyectoFormulario4Linea70()->update([
            'cantidad_instructores_planta'   => $request->cantidad_instructores_planta,
            'cantidad_dinamizadores_planta'  => $request->cantidad_dinamizadores_planta,
            'cantidad_psicopedagogos_planta' => $request->cantidad_psicopedagogos_planta
        ]);

        return back()->with('success', 'El recurso se ha actualizado correctamente.');
    }

    public function storeAulaMovil(AulaMovilRequest $request, Convocatoria $convocatoria, ProyectoFormulario4Linea70 $proyecto_formulario_4_linea_70)
    {
        $aula_movil = $proyecto_formulario_4_linea_70->aulasMoviles()->create($request->validated());

        return back()->with('success', 'El recurso se ha creado correctamente');
    }

    public function updateAulaMovil(AulaMovilRequest $request, Convocatoria $convocatoria, ProyectoFormulario4Linea70 $proyecto_formulario_4_linea_70, AulaMovil $aula_movil)
    {
        $aula_movil->update($request->validated());

        return back()->with('success', 'El recurso se ha modificado correctamente');
    }

    public function destroyAulaMovil(Convocatoria $convocatoria, ProyectoFormulario4Linea70 $proyecto_formulario_4_linea_70, AulaMovil $aula_movil)
    {
        $this->authorize('modificar-proyecto-autor', [$proyecto_formulario_4_linea_70->proyecto]);

        $aula_movil->delete();

        return back()->with('success', 'El recurso se ha eliminado correctamente.');
    }

    public function uploadSoat(Request $request, Convocatoria $convocatoria, Proyecto $proyecto, AulaMovil $aula_movil)
    {
        if ($request->hasFile('soat')) {
            $request->validate([
                'soat' => 'nullable|file|max:10240|mimetypes:application/pdf',
            ]);

            return $this->saveFilesSharepoint($request->soat, mb_strtoupper($convocatoria->descripcion) . ' ' . $convocatoria->year, $aula_movil, $proyecto, 'soat');
        }
    }

    public function uploadTecnicomecanica(Request $request, Convocatoria $convocatoria, Proyecto $proyecto, AulaMovil $aula_movil)
    {
        if ($request->hasFile('tecnicomecanica')) {
            $request->validate([
                'tecnicomecanica' => 'nullable|file|max:10240|mimetypes:application/pdf',
            ]);

            return $this->saveFilesSharepoint($request->tecnicomecanica, mb_strtoupper($convocatoria->descripcion) . ' ' . $convocatoria->year, $aula_movil, $proyecto, 'tecnicomecanica');
        }
    }

    public function saveFilesSharepoint($tmp_file, $modulo, $modelo, $proyecto, $campo_bd)
    {
        $sharepoint_aula_movil  = $proyecto->centroFormacion->nombre_carpeta_sharepoint . '/' . $proyecto->tipoFormularioConvocatoria->lineaProgramatica->codigo . '/' . $proyecto->codigo . '/AULAS MOVILES';

        $sharepoint_path        = "$modulo/$sharepoint_aula_movil";

        SharepointHelper::saveFilesSharepoint($tmp_file, $modelo, $sharepoint_path, $campo_bd);
    }

    public function downloadFileSharepoint(Convocatoria $convocatoria, ProyectoFormulario4Linea70 $proyecto_formulario_4_linea_70, AulaMovil $aula_movil, $tipo_archivo)
    {
        $sharepoint_path = $aula_movil[$tipo_archivo];

        return SharepointHelper::downloadFile($sharepoint_path);
    }

    /**
     *
     */
    public function replicateRow($request, $proyecto_formulario_4_linea_70, $proyecto)
    {
        if ($proyecto_formulario_4_linea_70) {
            $clone = $proyecto_formulario_4_linea_70->replicate()->fill([
                'id'                            => $proyecto->id,
                'fecha_inicio'                  => $request->fecha_inicio,
                'fecha_finalizacion'            => $request->fecha_finalizacion,
                'max_meses_ejecucion'           => $request->max_meses_ejecucion,
                'tecnoacademia_id'              => $request->tecnoacademia_id,
                'infraestructura_tecnoacademia' => $request->infraestructura_tecnoacademia,
                'proyecto_base'                 => false
            ]);
            $clone->push();

            //load relations on EXISTING MODEL
            $proyecto_formulario_4_linea_70->load(
                'tematicasEstrategicas',
                'disciplinasSubareaConocimiento',
                'actividadesEconomicas'
            );

            //re-sync everything hasMany
            // foreach ($proyecto_formulario_4_linea_70->edt as $edt) {
            //     $clone->edt()->create($edt->toArray());
            // }

            //re-sync everything hasMany
            $objetivos_especificos = collect([]);
            $nuevas_actividades = collect([]);
            foreach ($proyecto_formulario_4_linea_70->proyecto->causasDirectas as $causa_directa) {
                $nueva_causa_directa = $clone->proyecto->causasDirectas()->create($causa_directa->toArray());
                $nuevo_objetivo_especifico = $nueva_causa_directa->objetivoEspecifico()->create($causa_directa->objetivoEspecifico->toArray());
                $objetivos_especificos->push($nuevo_objetivo_especifico);

                foreach ($causa_directa->causasIndirectas as $key => $causa_indirecta) {
                    $nueva_causa_indirecta = $nueva_causa_directa->causasIndirectas()->create($causa_indirecta->toArray());
                    $nueva_actividad = $nueva_causa_indirecta->actividad()->create([
                        'objetivo_especifico_id'    => $nuevo_objetivo_especifico->id,
                        'resultado_id'              => null,
                        'causa_indirecta_id'        => $nueva_causa_indirecta->id,
                        'fecha_inicio'              => $causa_indirecta->actividad->fecha_inicio,
                        'fecha_finalizacion'        => $causa_indirecta->actividad->fecha_finalizacion,
                        'descripcion'               => $causa_indirecta->actividad->descripcion,
                    ]);

                    $nuevas_actividades->push([
                        'actividad_id'                  => $nueva_actividad->id,
                        'objetivo_especifico_id'        => $nueva_actividad->objetivo_especifico_id,
                        'resultado_antiguo'             => optional($causa_indirecta->actividad->resultado)->descripcion,
                        'objetivo_especifico_antiguo'   => optional($causa_indirecta->actividad->objetivoEspecifico)->numero,
                        'causa_indirecta_id'            => $nueva_actividad->causa_indirecta_id,
                        'descripcion_actividad'         => $nueva_actividad->descripcion
                    ]);
                }
            }

            //re-sync everything hasMany
            $resultados = collect([]);
            $productos = collect([]);
            $nuevos_productos = collect([]);
            foreach ($proyecto_formulario_4_linea_70->proyecto->efectosDirectos as $key => $efecto_directo) {
                $nuevo_efecto_directo = $clone->proyecto->efectosDirectos()->create($efecto_directo->toArray());
                $nuevo_resultado = $nuevo_efecto_directo->resultado()->create([
                    'objetivo_especifico_id'    => $objetivos_especificos->where('numero', $efecto_directo->resultado->objetivoEspecifico->numero)->where('descripcion', $efecto_directo->resultado->objetivoEspecifico->descripcion)->first()->id,
                    'descripcion'               => $efecto_directo->resultado->descripcion,
                ]);
                $resultados->push($nuevo_resultado);

                foreach ($efecto_directo->resultado->productos as $producto) {
                    $productos->push($producto->load('actividades'));
                    $nuevo_producto = $nuevo_resultado->productos()->create($producto->toArray());
                    $nuevos_productos->push($nuevo_producto);

                    if ($producto->productoMinciencias()->exists()) {
                        $nuevo_producto->productoMinciencias()->create($producto->productoMinciencias->toArray());
                    }
                }

                foreach ($efecto_directo->efectosIndirectos as $efecto_indirecto) {
                    $nuevo_efecto_indirecto = $nuevo_efecto_directo->efectosIndirectos()->create($efecto_indirecto->toArray());
                    $nuevo_efecto_indirecto->impacto()->create($efecto_indirecto->impacto->toArray());
                }
            }

            foreach ($nuevas_actividades as $key => $actividad) {
                Actividad::where('id', $actividad['actividad_id'])->update([
                    'resultado_id' => $resultados->where('descripcion', $actividad['resultado_antiguo'])->first() ? $resultados->where('descripcion', $actividad['resultado_antiguo'])->first()->id : null
                ]);
            }

            //re-sync everything hasMany
            foreach ($proyecto_formulario_4_linea_70->proyecto->analisisRiesgos as $analisis_riesgo) {
                $clone->proyecto->analisisRiesgos()->create($analisis_riesgo->toArray());
            }

            // re-sync productos->actividades
            foreach ($nuevos_productos as $nuevo_producto) {
                if ($nuevas_actividades->whereIn('descripcion_actividad', $productos->where('nombre', $nuevo_producto->nombre)->first())) {
                    $nuevo_producto->actividades()->sync($nuevas_actividades->whereIn('descripcion_actividad', $productos->where('nombre', $nuevo_producto->nombre)->first()->actividades->pluck('descripcion')->toArray())->pluck('actividad_id')->toArray());
                }
            }

            //re-sync everything belongsToMany
            foreach ($proyecto_formulario_4_linea_70->getRelations() as $relation_name => $values) {
                if ($relation_name != 'edt' && $relation_name != 'proyecto') {
                    $clone->{$relation_name}()->sync($values);
                }
            }
            //re-sync everything belongsToMany
            $clone->proyecto->semillerosInvestigacion()->sync($proyecto_formulario_4_linea_70->proyecto->semillerosInvestigacion()->pluck('semilleros_investigacion.id'));

            //re-sync everything belongsToMany
            $clone->proyecto->gruposInvestigacion()->sync($proyecto_formulario_4_linea_70->proyecto->gruposInvestigacion()->pluck('grupos_investigacion.id'));

            //re-sync everything belongsToMany
            $clone->proyecto->municipios()->sync($proyecto_formulario_4_linea_70->proyecto->municipios()->pluck('municipios.id'));

            //re-sync everything belongsToMany
            $clone->proyecto->municipiosAImpactar()->sync($proyecto_formulario_4_linea_70->proyecto->municipiosAImpactar()->pluck('municipios.id'));

            //re-sync everything belongsToMany
            $clone->proyecto->disenosCurriculares()->sync($proyecto_formulario_4_linea_70->proyecto->disenosCurriculares()->pluck('disenos_curriculares.id'));

            //re-sync everything belongsToMany
            $clone->proyecto->programasFormacion()->sync($proyecto_formulario_4_linea_70->proyecto->programasFormacion()->pluck('programas_formacion.id'));

            $clone->save();

            return $clone;
        } else {
            return false;
        }
    }

    public function savePdfSharepoint(Request $request, ProyectoFormulario4Linea70 $proyecto_formulario_4_linea_70)
    {
        $request->validate([
            'pdf_proyecto_general' => 'nullable|file|max:10240',
        ]);

        $response = [];

        if ($request->hasFile('pdf_proyecto_general')) {
            $proyecto_formulario_4_linea_70->ruta_final_sharepoint = $proyecto_formulario_4_linea_70->proyecto->centroFormacion->nombre_carpeta_sharepoint . '/' . $proyecto_formulario_4_linea_70->proyecto->tipoFormularioConvocatoria->lineaProgramatica->codigo . '/' . $proyecto_formulario_4_linea_70->proyecto->codigo . '/PDF Proyecto';

            $response = SharepointHelper::saveFilesSharepoint($request, 'pdf_proyecto_general', $proyecto_formulario_4_linea_70, $proyecto_formulario_4_linea_70->id . 'pdf_proyecto_general');
        }

        if (count($response) > 0 && $response['success']) {
            return back()->with('success', 'Los archivos se han cargado correctamente');
        } else if (count($response) > 0 && $response['success'] == false) {
            return back()->with('error', 'No se han podido cargar los archivos. Por favor vuelva a intentar');
        }
    }

    public function downloadPdfSharepoint(Convocatoria $convocatoria, ProyectoFormulario4Linea70 $proyecto_formulario_4_linea_70, $tipo_archivo)
    {
        $sharepoint_path = $proyecto_formulario_4_linea_70[$tipo_archivo];

        return SharepointHelper::downloadFile($sharepoint_path);
    }

    public function updateMetodologiaProyectoFormulario4Linea70(Request $request, Convocatoria $convocatoria, Proyecto $proyecto)
    {
        $this->authorize('modificar-proyecto-autor', $proyecto);

        $request->merge([
            'proyeccion_nuevas_instituciones'   => $request->proyeccion_nuevas_instituciones,
            'proyeccion_articulacion_media'     => $request->proyeccion_articulacion_media,
            'nombre_instituciones'              => json_decode($request->nombre_instituciones)
        ]);

        $proyecto->proyectoFormulario4Linea70()->update($request->except('municipios', 'municipios_impactar', 'programas_formacion_articulados', 'diseno_curricular_id'));

        $proyecto->municipios()->sync($request->municipios);
        $proyecto->municipiosAImpactar()->sync($request->municipios_impactar);
        $proyecto->programasFormacion()->sync($request->programas_formacion_articulados);
        $proyecto->disenosCurriculares()->sync($request->diseno_curricular_id);

        return back()->with('success', 'El recurso se ha guardado correctamente.');
    }
}
