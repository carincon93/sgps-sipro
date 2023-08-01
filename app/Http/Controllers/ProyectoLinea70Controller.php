<?php

namespace App\Http\Controllers;

use App\Helpers\SharepointHelper;
use App\Helpers\SelectHelper;
use App\Models\Convocatoria;
use App\Models\Proyecto;
use App\Models\TecnoAcademia;
use App\Http\Controllers\Controller;
use App\Http\Requests\Evaluacion\EvaluacionProyectoLinea70Request;
use App\Http\Requests\TaLongColumnRequest;
use App\Http\Requests\ProyectoLinea70Request;
use App\Models\Actividad;
use App\Models\AulaMovil;
use App\Models\Evaluacion\EvaluacionProyectoLinea70;
use App\Models\ProyectoLinea70;
use App\Models\RolSennova;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ProyectoLinea70Controller extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Convocatoria $convocatoria)
    {
        return Inertia::render('Convocatorias/Proyectos/ProyectosLinea70/Index', [
            'convocatoria'          => $convocatoria->only('id', 'esta_activa', 'fase_formateada', 'fase', 'tipo_convocatoria', 'tipo_convocatoria'),
            'filters'               => request()->all('search', 'estructuracion_proyectos'),
            'proyectos_linea_70'    => ProyectoLinea70::getProyectosPorRol($convocatoria)->appends(['search' => request()->search, 'estructuracion_proyectos' => request()->estructuracion_proyectos]),
            'allowed_to_create'     => Gate::inspect('formular-proyecto', [5, $convocatoria])->allowed()
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

        return Inertia::render('Convocatorias/Proyectos/ProyectosLinea70/Create', [
            'convocatoria'           => $convocatoria->only('id', 'esta_activa', 'fase_formateada', 'fase', 'tipo_convocatoria'),
            'tecnoacademias'         => $tecnoacademias,
            'lineas_tecnoacademia'   => SelectHelper::lineasTecnoacademia(),
            'roles_sennova'          => RolSennova::select('id as value', 'nombre as label')->orderBy('nombre', 'ASC')->get(),
            'allowed_to_create'      => Gate::inspect('formular-proyecto', [5, $convocatoria])->allowed()
        ]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(ProyectoLinea70Request $request, Convocatoria $convocatoria, Proyecto $proyecto)
    {
        $this->authorize('formular-proyecto', [5, $convocatoria]);

        $tecnoAcademia = TecnoAcademia::find($request->tecnoacademia_id);

        $proyecto = new Proyecto();
        $proyecto->arboles_completos = true;
        $proyecto->centroFormacion()->associate($tecnoAcademia->centro_formacion_id);
        $proyecto->lineaProgramatica()->associate(5);
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

        $proyecto_a_replicar = ProyectoLinea70::where('proyecto_base', true)->first();


        $nuevo_proyecto_linea_70 = $this->replicateRow($request, $proyecto_a_replicar, $proyecto);

        if ($nuevo_proyecto_linea_70) {
            return redirect()->route('convocatorias.proyectos-linea-70.edit', [$convocatoria, $nuevo_proyecto_linea_70])->with('success', 'El recurso se ha creado correctamente.');
        } else {
            return back()->with('error', 'No hay un proyecto base generado. Por favor notifique al activador(a) de la línea.');
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Ta  $ta
     * @return \Illuminate\Http\Response
     */
    public function show(Convocatoria $convocatoria, ProyectoLinea70 $proyecto_linea_70)
    {
        $this->authorize('visualizar-proyecto-autor', [$proyecto_linea_70->proyecto]);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Ta  $ta
     * @return \Illuminate\Http\Response
     */
    public function edit(Convocatoria $convocatoria, ProyectoLinea70 $proyecto_linea_70)
    {
        $this->authorize('visualizar-proyecto-autor', [$proyecto_linea_70->proyecto]);

        $proyecto_linea_70->load('proyecto.evaluaciones.evaluacionProyectoLinea70');

        $proyecto_linea_70->proyecto->codigo_linea_programatica = $proyecto_linea_70->proyecto->lineaProgramatica->codigo;
        $proyecto_linea_70->proyecto->precio_proyecto           = $proyecto_linea_70->proyecto->precioProyecto;
        $proyecto_linea_70->proyecto->centroFormacion;
        $proyecto_linea_70->proyecto->tecnoacademiaLineasTecnoacademia;;

        $proyecto_linea_70->mostrar_recomendaciones        = $proyecto_linea_70->proyecto->mostrar_recomendaciones;
        $proyecto_linea_70->mostrar_requiere_subsanacion   = $proyecto_linea_70->proyecto->mostrar_requiere_subsanacion;

        return Inertia::render('Convocatorias/Proyectos/ProyectosLinea70/Edit', [
            'convocatoria'                          => $convocatoria->only('id', 'esta_activa', 'fase_formateada', 'fase', 'year', 'tipo_convocatoria', 'mostrar_recomendaciones', 'descripcion'),
            'proyecto_linea_70'                     => $proyecto_linea_70,
            'tecnoacademias'                        => SelectHelper::tecnoacademias(),
            'tecnoacademia'                         => $proyecto_linea_70->proyecto->tecnoacademiaLineasTecnoacademia()->first() ? $proyecto_linea_70->proyecto->tecnoacademiaLineasTecnoacademia()->first()->tecnoacademia->only('id', 'nombre') : null,
            'evaluacion'                            => EvaluacionProyectoLinea70::find(request()->evaluacion_id),
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
     * @param  \App\Models\Ta  $ta
     * @return \Illuminate\Http\Response
     */
    public function update(ProyectoLinea70Request $request, Convocatoria $convocatoria, ProyectoLinea70 $proyecto_linea_70)
    {
        $this->authorize('modificar-proyecto-autor', [$proyecto_linea_70->proyecto]);

        $proyecto_linea_70->fecha_inicio                           = $request->fecha_inicio;
        $proyecto_linea_70->fecha_finalizacion                     = $request->fecha_finalizacion;
        $proyecto_linea_70->max_meses_ejecucion                    = $request->max_meses_ejecucion;

        $proyecto_linea_70->logros_vigencia_anterior               = $request->logros_vigencia_anterior;
        $proyecto_linea_70->resumen                                = $request->resumen;
        $proyecto_linea_70->resumen_regional                       = $request->resumen_regional;
        $proyecto_linea_70->antecedentes                           = $request->antecedentes;
        $proyecto_linea_70->antecedentes_tecnoacademia             = $request->antecedentes_tecnoacademia;
        $proyecto_linea_70->justificacion_problema                 = $request->justificacion_problema;
        $proyecto_linea_70->marco_conceptual                       = $request->marco_conceptual;
        $proyecto_linea_70->bibliografia                           = $request->bibliografia;
        $proyecto_linea_70->pertinencia_territorio                 = $request->pertinencia_territorio;
        $proyecto_linea_70->retos_oportunidades                    = $request->retos_oportunidades;
        $proyecto_linea_70->lineas_tecnologicas_centro             = $request->lineas_tecnologicas_centro;
        $proyecto_linea_70->logros_vigencia_anterior               = $request->logros_vigencia_anterior;
        $proyecto_linea_70->infraestructura_tecnoacademia          = $request->infraestructura_tecnoacademia;
        $proyecto_linea_70->proyecto->tecnoacademiaLineasTecnoacademia()->sync($request->tecnoacademia_linea_tecnoacademia_id);

        $proyecto_linea_70->save();

        $proyecto = $proyecto_linea_70->proyecto();
        if ($request->hasFile('pdf_proyecto_general')) {
            $this->saveFilesSharepoint($request->pdf_proyecto_general, mb_strtoupper($convocatoria->descripcion) . ' ' . $convocatoria->year, $proyecto_linea_70, $proyecto, 'pdf_proyecto_general');
        }

        return back()->with('success', 'El recurso se ha actualizado correctamente.');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Ta  $ta
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request, Convocatoria $convocatoria, ProyectoLinea70 $proyecto_linea_70)
    {
        if ($proyecto_linea_70->proyecto_base) {
            return back()->with('error', 'Este proyecto no se puede eliminar.');
        }

        $this->authorize('eliminar-proyecto-autor', [$proyecto_linea_70->proyecto]);

        // if (!Hash::check($request->password, Auth::user()->password)) {
        //     return back()
        //         ->withErrors(['password' => __('The password is incorrect.')]);
        // }

        $proyecto_linea_70->proyecto()->delete();

        return redirect()->route('convocatorias.proyectos-linea-70.index', [$convocatoria])->with('success', 'El recurso se ha eliminado correctamente.');
    }

    public function updateEvaluacion(EvaluacionProyectoLinea70Request $request, Convocatoria $convocatoria, EvaluacionProyectoLinea70 $evaluacion_proyecto_linea_70)
    {
        $this->authorize('modificar-evaluacion-autor', $evaluacion_proyecto_linea_70->evaluacion);

        $evaluacion_proyecto_linea_70->evaluacion()->update([
            'iniciado' => true,
            'clausula_confidencialidad' => $request->clausula_confidencialidad
        ]);

        $evaluacion_proyecto_linea_70->resumen_regional_comentario              = $request->resumen_regional_requiere_comentario == false ? $request->resumen_regional_comentario : null;
        $evaluacion_proyecto_linea_70->antecedentes_tecnoacademia_comentario    = $request->antecedentes_tecnoacademia_requiere_comentario == false ? $request->antecedentes_tecnoacademia_comentario : null;
        $evaluacion_proyecto_linea_70->retos_oportunidades_comentario           = $request->retos_oportunidades_requiere_comentario == false ? $request->retos_oportunidades_comentario : null;
        $evaluacion_proyecto_linea_70->lineas_medulares_centro_comentario       = $request->lineas_medulares_centro_requiere_comentario == false ? $request->lineas_medulares_centro_comentario : null;
        $evaluacion_proyecto_linea_70->lineas_tecnologicas_centro_comentario    = $request->lineas_tecnologicas_centro_requiere_comentario == false ? $request->lineas_tecnologicas_centro_comentario : null;
        $evaluacion_proyecto_linea_70->municipios_comentario                    = $request->municipios_requiere_comentario == false ? $request->municipios_comentario : null;
        $evaluacion_proyecto_linea_70->instituciones_comentario                 = $request->instituciones_requiere_comentario == false ? $request->instituciones_comentario : null;
        $evaluacion_proyecto_linea_70->fecha_ejecucion_comentario               = $request->fecha_ejecucion_requiere_comentario == false ? $request->fecha_ejecucion_comentario : null;
        $evaluacion_proyecto_linea_70->proyectos_macro_comentario               = $request->proyectos_macro_requiere_comentario == false ? $request->proyectos_macro_comentario : null;
        $evaluacion_proyecto_linea_70->bibliografia_comentario                  = $request->bibliografia_requiere_comentario == false ? $request->bibliografia_comentario : null;
        $evaluacion_proyecto_linea_70->articulacion_centro_formacion_comentario = $request->articulacion_centro_formacion_requiere_comentario == false ? $request->articulacion_centro_formacion_comentario : null;

        $evaluacion_proyecto_linea_70->ortografia_comentario                    = $request->ortografia_requiere_comentario == false ? $request->ortografia_comentario : null;
        $evaluacion_proyecto_linea_70->redaccion_comentario                     = $request->redaccion_requiere_comentario == false ? $request->redaccion_comentario : null;
        $evaluacion_proyecto_linea_70->normas_apa_comentario                    = $request->normas_apa_requiere_comentario == false ? $request->normas_apa_comentario : null;

        $evaluacion_proyecto_linea_70->save();

        return redirect()->back()->with('success', 'El recurso ha sido actualizado correctamente.');
    }

    public function updateLongColumn(TaLongColumnRequest $request, Convocatoria $convocatoria, ProyectoLinea70 $proyecto_linea_70, $column)
    {
        $this->authorize('modificar-proyecto-autor', [$proyecto_linea_70->proyecto]);

        $proyecto_linea_70->update($request->only($column));

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
        $this->authorize('modificar-proyecto-autor', [$proyecto]);

        $request->validate([
            'cantidad_instructores_planta'    => 'required|integer|min:0|max:32767',
            'cantidad_dinamizadores_planta'   => 'required|integer|min:0|max:32767',
            'cantidad_psicopedagogos_planta'  => 'required|integer|min:0|max:32767'
        ]);

        $proyecto->proyectoLinea70()->update([
            'cantidad_instructores_planta'   => $request->cantidad_instructores_planta,
            'cantidad_dinamizadores_planta'  => $request->cantidad_dinamizadores_planta,
            'cantidad_psicopedagogos_planta' => $request->cantidad_psicopedagogos_planta
        ]);

        return back()->with('success', 'El recurso se ha actualizado correctamente.');
    }

    public function aulaMovilStore(Request $request, Convocatoria $convocatoria, ProyectoLinea70 $proyecto_linea_70)
    {
         $request->validate([
            'soat'              => 'nullable|file|max:10240|mimetypes:application/pdf',
            'tecnicomecanica'   => 'nullable|file|max:10240|mimetypes:application/pdf',
        ]);

        $request->merge(['ta_id' => $proyecto_linea_70->id]);
        $aula_movil = AulaMovil::updateOrCreate(['id' => $request->id], $request->all());

        $proyecto = $proyecto_linea_70->proyecto();
        if ($request->hasFile('soat')) {
            $this->saveFilesSharepoint($request->soat, mb_strtoupper($convocatoria->descripcion) . ' ' . $convocatoria->year, $aula_movil, $proyecto, 'soat');
        }

        if ($request->hasFile('tecnicomecanica')) {
            $this->saveFilesSharepoint($request->tecnicomecanica, mb_strtoupper($convocatoria->descripcion) . ' ' . $convocatoria->year, $aula_movil, $proyecto, 'tecnicomecanica');
        }

        return back()->with('success', $request-> id ? 'El recurso se ha modificado correctamente' : 'El recurso se ha creado correctamente');
    }

    public function saveFilesSharepoint($tmp_file, $modulo, $modelo, $proyecto, $campo_bd)
    {
        $sharepoint_aula_movil  = $proyecto->centroFormacion->nombre_carpeta_sharepoint . '/' . $proyecto->lineaProgramatica->codigo . '/' . $proyecto->codigo . '/AULAS MOVILES';

        $sharepoint_path        = "$modulo/$sharepoint_aula_movil";

        SharepointHelper::saveFilesSharepoint($tmp_file, $modelo, $sharepoint_path, $campo_bd);
    }

    public function downloadFileSharepoint(Convocatoria $convocatoria, ProyectoLinea70 $proyecto_linea_70, AulaMovil $aula_movil, $tipo_archivo)
    {
        $sharepoint_path = $aula_movil[$tipo_archivo];

        return SharepointHelper::downloadFile($sharepoint_path);
    }

    public function destroyAulaMovil(Convocatoria $convocatoria, ProyectoLinea70 $proyecto_linea_70, AulaMovil $aula_movil)
    {
        $this->authorize('modificar-proyecto-autor', [$proyecto_linea_70->proyecto]);

        $aula_movil->delete();

        return back()->with('success', 'El recurso se ha eliminado correctamente.');
    }

    /**
     *
     */
    public function replicateRow($request, $proyecto_linea_70, $proyecto)
    {
        if ($proyecto_linea_70) {
            $clone = $proyecto_linea_70->replicate()->fill([
                'id'                    => $proyecto->id,
                'fecha_inicio'          => $request->fecha_inicio,
                'fecha_finalizacion'    => $request->fecha_finalizacion,
                'max_meses_ejecucion'   => $request->max_meses_ejecucion,
                'proyecto_base'         => false
            ]);
            $clone->push();

            //load relations on EXISTING MODEL
            $proyecto_linea_70->load(
                'tematicasEstrategicas',
                'disciplinasSubareaConocimiento',
                'redesConocimiento',
                'actividadesEconomicas'
            );

            //re-sync everything hasMany
            foreach ($proyecto_linea_70->edt as $edt) {
                $clone->edt()->create($edt->toArray());
            }

            //re-sync everything hasMany
            $objetivos_especificos = collect([]);
            $nuevas_actividades = [];
            foreach ($proyecto_linea_70->proyecto->causasDirectas as $causa_directa) {
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

                    array_push(
                        $nuevas_actividades,
                        [
                            'actividad_id'                  => $nueva_actividad->id,
                            'objetivo_especifico_id'        => $nueva_actividad->objetivo_especifico_id,
                            'resultado_antiguo'             => $causa_indirecta->actividad->resultado->descripcion,
                            'objetivo_especifico_antiguo'   => $causa_indirecta->actividad->objetivoEspecifico->numero,
                            'causa_indirecta_id'            => $nueva_actividad->causa_indirecta_id,
                            'descripcion_actividad'         => $nueva_actividad->descripcion
                        ]
                    );
                }
            }

            //re-sync everything hasMany
            $resultados = collect([]);
            foreach ($proyecto_linea_70->proyecto->efectosDirectos as $key => $efecto_directo) {
                $nuevo_efecto_directo = $clone->proyecto->efectosDirectos()->create($efecto_directo->toArray());
                $nuevo_resultado = $nuevo_efecto_directo->resultado()->create([
                    'objetivo_especifico_id'    => $objetivos_especificos->where('numero', $efecto_directo->resultado->objetivoEspecifico->numero)->where('descripcion', $efecto_directo->resultado->objetivoEspecifico->descripcion)->first()->id,
                    'descripcion'               => $efecto_directo->resultado->descripcion,
                ]);
                $resultados->push($nuevo_resultado);

                foreach ($efecto_directo->resultado->productos as $producto) {
                    $nuevo_producto = $nuevo_resultado->productos()->create($producto->toArray());

                    $nuevo_producto->productoLinea70()->create($producto->productoLinea70->toArray());
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
            foreach ($proyecto_linea_70->proyecto->analisisRiesgos as $analisis_riesgo) {
                $clone->proyecto->analisisRiesgos()->create($analisis_riesgo->toArray());
            }

            //re-sync everything belongsToMany
            foreach ($proyecto_linea_70->getRelations() as $relation_name => $values) {
                if ($relation_name != 'edt' && $relation_name != 'proyecto') {
                    $clone->{$relation_name}()->sync($values);
                }
            }

            //re-sync everything belongsToMany
            foreach ($proyecto_linea_70->proyecto->municipios as $municipio => $values) {
                $clone->proyecto->municipios()->sync($values);
            }

            //re-sync everything belongsToMany
            foreach ($proyecto_linea_70->proyecto->municipiosAImpactar as $municipio => $values) {
                $clone->proyecto->municipiosAImpactar()->sync($values);
            }

            //re-sync everything belongsToMany
            foreach ($proyecto_linea_70->proyecto->municipiosAImpactar as $municipio => $values) {
                $clone->proyecto->municipiosAImpactar()->sync($values);
            }

            //re-sync everything belongsToMany
            foreach ($proyecto_linea_70->proyecto->disenosCurriculares as $diseno_curricular => $values) {
                $clone->proyecto->disenosCurriculares()->sync($values);
            }

            //re-sync everything belongsToMany
            foreach ($proyecto_linea_70->proyecto->programasFormacionLinea70 as $programa_formacion => $values) {
                $clone->proyecto->programasFormacionLinea70()->sync($values);
            }

            $clone->save();

            return $clone;
        } else {
            return false;
        }
    }

    public function savePdfSharepoint(Request $request, ProyectoLinea70 $proyecto_linea_70)
    {
        $request->validate([
            'pdf_proyecto_general' => 'nullable|file|max:10240',
        ]);

        $response = [];

        if ($request->hasFile('pdf_proyecto_general')) {
            $proyecto_linea_70->ruta_final_sharepoint = $proyecto_linea_70->proyecto->centroFormacion->nombre_carpeta_sharepoint . '/' . $proyecto_linea_70->proyecto->lineaProgramatica->codigo . '/' . $proyecto_linea_70->proyecto->codigo . '/PDF Proyecto';

            $response = SharepointHelper::saveFilesSharepoint($request, 'pdf_proyecto_general', $proyecto_linea_70, $proyecto_linea_70->id . 'pdf_proyecto_general');
        }

        if (count($response) > 0 && $response['success']) {
            return back()->with('success', 'Los archivos se han cargado correctamente');
        } else if (count($response) > 0 && $response['success'] == false) {
            return back()->with('error', 'No se han podido cargar los archivos. Por favor vuelva a intentar');
        }
    }

    public function downloadPdfSharepoint(Convocatoria $convocatoria, ProyectoLinea70 $proyecto_linea_70, $tipo_archivo)
    {
        $sharepoint_path = $proyecto_linea_70[$tipo_archivo];

        return SharepointHelper::downloadFile($sharepoint_path);
    }
}
