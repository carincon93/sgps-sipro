<?php

namespace App\Http\Controllers;

use App\Http\Requests\ActividadRequest;
use App\Http\Requests\ArbolesColumnRequest;
use App\Models\Convocatoria;
use App\Models\Proyecto;
use App\Models\EfectoDirecto;
use App\Models\EfectoIndirecto;
use App\Models\CausaDirecta;
use App\Models\CausaIndirecta;
use App\Models\Resultado;
use App\Models\Impacto;
use App\Models\ObjetivoEspecifico;
use App\Models\Actividad;
use App\Http\Requests\CausaDirectaRequest;
use App\Http\Requests\EfectoDirectoRequest;
use App\Http\Requests\EfectoIndirectoRequest;
use App\Http\Requests\CausaIndirectaRequest;

use App\Http\Requests\ImpactoRequest;
use App\Http\Requests\ObjetivoEspecificoRequest;
use App\Http\Requests\ResultadoRequest;
use App\Models\Evaluacion\Evaluacion;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ArbolProyectoController extends Controller
{
    /**
     * generarArboles
     *
     * @param  mixed $proyecto
     * @return void
     */
    private function generarArboles(Proyecto $proyecto)
    {
        if ($proyecto->arboles_completos == false) {
            // 1. Generar mínimo 3 causas directas -> 3 objetivos específicos
            for ($i = 0; $i < 3; $i++) {
                $causaDirecta = $proyecto->causasDirectas()->create([
                    ['descripcion' => null],
                ]);

                $objetivo_especifico = $causaDirecta->objetivoEspecifico()->create([
                    'descripcion'       => null,
                    'numero'            => $i + 1,
                ]);

                // 2. Generar mínimo 3 efectos directos -> 3 resultados
                $efectoDirecto = $proyecto->efectosDirectos()->create([
                    ['descripcion' => null],
                ]);

                $efectoDirecto->resultado()->create([
                    'descripcion'            => null,
                    'objetivo_especifico_id' => $objetivo_especifico->id
                ]);

                // 3. Generar mínimo 1 efectos indirecto -> 1 impacto
                $efectoIndirecto = $efectoDirecto->efectosIndirectos()->create([
                    ['descripcion' => null],
                ]);

                $efectoIndirecto->impacto()->create([
                    ['descripcion' => null],
                ]);

                // 4. Generar mínimo 1 causa indirecta -> 1 actividad
                $causa_indirecta = $causaDirecta->causasIndirectas()->create([
                    ['descripcion' => null],
                ]);

                $causa_indirecta->actividad()->create([
                    ['descripcion' => null],
                ]);
            }

            $proyecto->update(['arboles_completos' => true]);
        }
    }

    /**
     * showArbolProblemas
     *
     * @param  mixed $convocatoria
     * @param  mixed $proyecto
     * @return void
     */
    public function showArbolProblemas(Request $request, Convocatoria $convocatoria, Proyecto $proyecto)
    {
        $this->authorize('visualizar-proyecto-autor', $proyecto);

        if ($proyecto->convocatoria_id != $convocatoria->id) {
            return abort(404);
        }

        $this->generarArboles($proyecto);

        // $proyecto->load('evaluaciones.evaluacionProyectoFormulario8Linea66');

        $proyecto->tipoFormularioConvocatoria->lineaProgramatica;
        $proyecto->participantes;

        $proyecto_form_fields = [
            'proyectoFormulario7Linea23'    => ['problema_central', 'justificacion_problema', 'identificacion_problema', 'objetivo_general'],
            'proyectoFormulario9Linea23'    => ['problema_central', 'justificacion_problema', 'identificacion_problema', 'objetivo_general'],
            'proyectoFormulario1Linea65'    => ['problema_central', 'justificacion_problema', 'identificacion_problema', 'objetivo_general', 'tipo_proyecto'],
            'proyectoFormulario13Linea65'   => ['problema_central', 'justificacion_problema', 'identificacion_problema', 'objetivo_general', 'tipo_proyecto'],
            'proyectoFormulario15Linea65'   => ['problema_central', 'justificacion_problema', 'identificacion_problema', 'objetivo_general', 'tipo_proyecto'],
            'proyectoFormulario16Linea65'   => ['problema_central', 'justificacion_problema', 'identificacion_problema', 'objetivo_general', 'tipo_proyecto'],
            'proyectoFormulario8Linea66'    => ['problema_central', 'justificacion_problema', 'identificacion_problema', 'objetivo_general'],
            'proyectoFormulario12Linea68'   => ['objetivo_general', 'problema_central', 'pregunta_formulacion_problema', 'identificacion_problema', 'justificacion_problema'],
            'proyectoFormulario5Linea69'    => ['justificacion_problema', 'identificacion_problema', 'problema_central', 'objetivo_general', 'proyecto_base'],
            'proyectoFormulario10Linea69'   => ['justificacion_problema', 'identificacion_problema', 'problema_central', 'objetivo_general', 'proyecto_base'],
            'proyectoFormulario17Linea69'   => ['justificacion_problema', 'identificacion_problema', 'problema_central', 'objetivo_general', 'proyecto_base'],
            'proyectoFormulario4Linea70'    => ['identificacion_problema', 'problema_central', 'objetivo_general', 'proyecto_base'],
            'proyectoFormulario6Linea82'    => ['problema_central', 'justificacion_problema', 'identificacion_problema', 'objetivo_general'],
            'proyectoFormulario11Linea83'   => ['problema_central', 'justificacion_problema', 'identificacion_problema', 'objetivo_general'],
        ];

        foreach ($proyecto_form_fields as $form_method => $fields) {
            if ($proyecto->$form_method()->exists()) {
                foreach ($fields as $field) {
                    $proyecto->$field = $proyecto->$form_method->$field;
                }
                break;
            }
        }

        return Inertia::render('Convocatorias/Proyectos/ArbolesProyecto/ArbolProblemas', [
            'convocatoria'      => $convocatoria->only('id', 'esta_activa', 'fase_formateada', 'fase', 'tipo_convocatoria', 'mostrar_recomendaciones'),
            'proyecto'          => $proyecto,
            'evaluacion'        => Evaluacion::find(request()->evaluacion_id),
        ]);
    }

    /**
     * updateArbolProblemasEvaluacion
     *
     * @param  mixed $request
     * @param  mixed $convocatoria
     * @param  mixed $evaluacion
     * @return void
     */
    public function updateArbolProblemasEvaluacion(Request $request, Convocatoria $convocatoria, Evaluacion $evaluacion)
    {
        $this->authorize('modificar-evaluacion-autor', $evaluacion);

        switch ($evaluacion) {
            case $evaluacion->evaluacionProyectoFormulario8Linea66()->exists():
                $evaluacion->evaluacionProyectoFormulario8Linea66()->update([
                    'problema_central_puntaje'      => $request->problema_central_puntaje,
                    'problema_central_comentario'   => $request->problema_central_requiere_comentario == false ? $request->problema_central_comentario : null
                ]);
                break;
            case $evaluacion->evaluacionProyectoFormulario1Linea65()->exists():
                $evaluacion->evaluacionProyectoFormulario1Linea65()->update([
                    'problema_central_puntaje'      => $request->problema_central_puntaje,
                    'problema_central_comentario'   => $request->problema_central_requiere_comentario == false ? $request->problema_central_comentario : null
                ]);
                break;
            case $evaluacion->evaluacionProyectoFormulario5Linea69()->exists():
                $evaluacion->evaluacionProyectoFormulario5Linea69()->update([
                    'arbol_problemas_comentario'   => $request->arbol_problemas_requiere_comentario == false ? $request->arbol_problemas_comentario : null
                ]);
                break;
            case $evaluacion->evaluacionProyectoFormulario12Linea68()->exists():
                $evaluacion->evaluacionProyectoFormulario12Linea68()->update([
                    'arbol_problemas_puntaje'      => $request->arbol_problemas_puntaje,
                    'arbol_problemas_comentario'   => $request->arbol_problemas_requiere_comentario == false ? $request->arbol_problemas_comentario : null
                ]);
                break;
            default:
                break;
        }

        return back()->with('success', 'El recurso se ha actualizado correctamente.');
    }

    /**
     * updateArbolProblemas
     *
     * @param  mixed $request
     * @param  mixed $proyecto
     * @return void
     */
    public function updateProblemaCentral(Request $request, Proyecto $proyecto)
    {
        $this->authorize('modificar-proyecto-autor', $proyecto);

        $forms_proyecto = [
            'proyectoFormulario7Linea23' => [
                'fields' => ['identificacion_problema', 'problema_central', 'justificacion_problema', 'objetivo_general'],
            ],
            'proyectoFormulario9Linea23' => [
                'fields' => ['identificacion_problema', 'problema_central', 'justificacion_problema', 'objetivo_general'],
            ],
            'proyectoFormulario1Linea65' => [
                'fields' => ['identificacion_problema', 'problema_central', 'justificacion_problema', 'objetivo_general'],
            ],
            'proyectoFormulario13Linea65' => [
                'fields' => ['identificacion_problema', 'problema_central', 'justificacion_problema', 'objetivo_general'],
            ],
            'proyectoFormulario15Linea65' => [
                'fields' => ['identificacion_problema', 'problema_central', 'justificacion_problema', 'objetivo_general'],
            ],
            'proyectoFormulario16Linea65' => [
                'fields' => ['identificacion_problema', 'problema_central', 'justificacion_problema', 'objetivo_general'],
            ],
            'proyectoFormulario8Linea66' => [
                'fields' => ['identificacion_problema', 'problema_central', 'justificacion_problema', 'objetivo_general'],
            ],
            'proyectoFormulario12Linea68' => [
                'fields' => ['problema_central', 'objetivo_general', 'pregunta_formulacion_problema', 'identificacion_problema', 'justificacion_problema'],
            ],
            'proyectoFormulario5Linea69' => [
                'fields' => ['identificacion_problema', 'problema_central', 'justificacion_problema', 'objetivo_general'],
            ],
            'proyectoFormulario10Linea69' => [
                'fields' => ['identificacion_problema', 'problema_central', 'justificacion_problema', 'objetivo_general'],
            ],
            'proyectoFormulario17Linea69' => [
                'fields' => ['identificacion_problema', 'problema_central', 'justificacion_problema', 'objetivo_general'],
            ],
            'proyectoFormulario4Linea70' => [
                'fields' => ['problema_central', 'objetivo_general'],
            ],
            'proyectoFormulario11Linea83' => [
                'fields' => ['problema_central', 'objetivo_general', 'identificacion_problema', 'justificacion_problema'],
            ],
        ];

        foreach ($forms_proyecto as $form_method => $form_fields) {
            if ($proyecto->$form_method()->exists()) {
                $request->validate(array_fill_keys($form_fields['fields'], 'required|string|max:40000'));

                $form_proyecto = $proyecto->$form_method;
                foreach ($form_fields['fields'] as $field) {
                    $form_proyecto->$field = $request->$field;
                }

                $form_proyecto->save();
                break;
            }
        }
        return back()->with('success', 'El recurso se ha guardado correctamente.');
    }

    public function newEfectoDirecto(EfectoDirectoRequest $request, Proyecto $proyecto)
    {
        $this->authorize('modificar-proyecto-autor', $proyecto);

        /** @var \App\Models\User */
        $auth_user = Auth::user();

        if ($auth_user->hasRole([1]) == false && $proyecto->tipo_formulario_convocatoria_id == 5 && $proyecto->proyectoFormulario5Linea69->proyecto_base == false && (string)$auth_user->can_by_user->search(24) === "" || $auth_user->hasRole([1]) == false && $proyecto->tipo_formulario_convocatoria_id == 4 && $proyecto->proyectoFormulario4Linea70->proyecto_base == false && (string)$auth_user->can_by_user->search(23) === "") {
            return back()->with('error', 'No se puede actualizar este recurso debido a que es información predefinida.');
        }

        $efectoDirecto = $proyecto->efectosDirectos()->create([
            'descripcion' => null
        ]);

        $efectoDirecto->resultado()->create([
            'descripcion' => null
        ]);

        return back()->with('success', 'El recurso se ha generado correctamente.');
    }

    /**
     * updateEfectoDirecto
     *
     * @param  mixed $request
     * @param  mixed $proyecto
     * @param  mixed $efectoDirecto
     * @return void
     */
    public function updateEfectoDirecto(EfectoDirectoRequest $request, Proyecto $proyecto, EfectoDirecto $efectoDirecto)
    {
        $this->authorize('modificar-proyecto-autor', $proyecto);

        /** @var \App\Models\User */
        $auth_user = Auth::user();

        if ($auth_user->hasRole([1]) == false && $proyecto->tipo_formulario_convocatoria_id == 5 && $proyecto->proyectoFormulario5Linea69->proyecto_base == false && (string)$auth_user->can_by_user->search(24) === "" || $auth_user->hasRole([1]) == false && $proyecto->tipo_formulario_convocatoria_id == 4 && $proyecto->proyectoFormulario4Linea70->proyecto_base == false && (string)$auth_user->can_by_user->search(23) === "") {
            return back()->with('error', 'No se puede actualizar este recurso debido a que es información predefinida.');
        }

        $efectoDirecto->descripcion = $request->descripcion;

        $efectoDirecto->save();

        return back()->with('success', 'El recurso se ha guardado correctamente.');
    }

    /**
     * destroyEfectoDirecto
     *
     * @param  mixed $proyecto
     * @param  mixed $efectoDirecto
     * @return void
     */
    public function destroyEfectoDirecto(Proyecto $proyecto, EfectoDirecto $efectoDirecto)
    {
        $this->authorize('modificar-proyecto-autor', $proyecto);

        /** @var \App\Models\User */
        $auth_user = Auth::user();

        // if ($proyecto->tipo_formulario_convocatoria_id == 5 && $auth_user->hasRole([1, 5, 17]) == false || $proyecto->tipo_formulario_convocatoria_id == 4 && $auth_user->hasRole([1, 5, 17]) == false) {
        if ($auth_user->hasRole([1]) == false && $proyecto->tipo_formulario_convocatoria_id == 5 && $proyecto->proyectoFormulario5Linea69->proyecto_base == false && (string)$auth_user->can_by_user->search(24) === "" || $auth_user->hasRole([1]) == false && $proyecto->tipo_formulario_convocatoria_id == 4 && $proyecto->proyectoFormulario4Linea70->proyecto_base == false && (string)$auth_user->can_by_user->search(23) === "") {
            return back()->with('error', 'No se puede eliminar este recurso debido a que es información predefinida.');
        }

        $efectoDirecto->delete();

        return back()->with('success', 'El recurso se ha eliminado correctamente.');
    }

    /**
     * createOrUpdateEfectoIndirecto
     *
     * @param  mixed $request
     * @param  mixed $proyecto
     * @param  mixed $efectoDirecto
     * @return void
     */
    public function createOrUpdateEfectoIndirecto(EfectoIndirectoRequest $request, Proyecto $proyecto, EfectoDirecto $efectoDirecto)
    {
        $this->authorize('modificar-proyecto-autor', $proyecto);

        /** @var \App\Models\User */
        $auth_user = Auth::user();

        if ($auth_user->hasRole([1]) == false && $proyecto->tipo_formulario_convocatoria_id == 5 && $proyecto->proyectoFormulario5Linea69->proyecto_base == false && (string)$auth_user->can_by_user->search(24) === "" || $auth_user->hasRole([1]) == false && $proyecto->tipo_formulario_convocatoria_id == 4 && $proyecto->proyectoFormulario4Linea70->proyecto_base == false && (string)$auth_user->can_by_user->search(23) === "") {
            return back()->with('error', 'No se puede actualizar este recurso debido a que es información predefinida.');
        }

        $efectoIndirecto = $efectoDirecto->efectosIndirectos()->updateOrCreate(
            ['id'           => $request->id],
            ['descripcion'  => $request->descripcion]
        );

        if (empty($efectoIndirecto->impacto)) {
            $efectoIndirecto->impacto()->create([
                ['descripcion' => null],
            ]);
        }

        return back()->with('success', 'El recurso se ha generado correctamente.');
    }

    /**
     * destroyEfectoIndirecto
     *
     * @param  mixed $proyecto
     * @param  mixed $efectoDirecto
     * @return void
     */
    public function destroyEfectoIndirecto(Proyecto $proyecto, EfectoIndirecto $efectoIndirecto)
    {
        $this->authorize('modificar-proyecto-autor', $proyecto);

        /** @var \App\Models\User */
        $auth_user = Auth::user();

        if ($auth_user->hasRole([1]) == false && $proyecto->tipo_formulario_convocatoria_id == 5 && $proyecto->proyectoFormulario5Linea69->proyecto_base == false && (string)$auth_user->can_by_user->search(24) === "" || $auth_user->hasRole([1]) == false && $proyecto->tipo_formulario_convocatoria_id == 4 && $proyecto->proyectoFormulario4Linea70->proyecto_base == false && (string)$auth_user->can_by_user->search(23) === "") {
            return back()->with('error', 'No se puede eliminar este recurso debido a que es información predefinida.');
        }

        $efectoIndirecto->delete();

        return back()->with('success', 'El recurso se ha eliminado correctamente.');
    }

    public function newCausaDirecta(CausaDirectaRequest $request, Proyecto $proyecto)
    {
        $this->authorize('modificar-proyecto-autor', $proyecto);

        /** @var \App\Models\User */
        $auth_user = Auth::user();

        if ($auth_user->hasRole([1]) == false && $proyecto->tipo_formulario_convocatoria_id == 5 && $proyecto->proyectoFormulario5Linea69->proyecto_base == false && (string)$auth_user->can_by_user->search(24) === "" || $auth_user->hasRole([1]) == false && $proyecto->tipo_formulario_convocatoria_id == 4 && $proyecto->proyectoFormulario4Linea70->proyecto_base == false && (string)$auth_user->can_by_user->search(23) === "") {
            return back()->with('error', 'No se puede actualizar este recurso debido a que es información predefinida.');
        }

        $causaDirecta = $proyecto->causasDirectas()->create([
            'descripcion' => null
        ]);

        if (empty($causaDirecta->objetivoEspecifico)) {
            $causaDirecta->objetivoEspecifico()->create(
                [
                    'descripcion' => null,
                    'numero' => $proyecto->causasDirectas()->count(),
                ],
            );
        }

        return back()->with('success', 'El recurso se ha creado correctamente.');
    }

    /**
     * updateCausaDirecta
     *
     * @param  mixed $request
     * @param  mixed $proyecto
     * @param  mixed $causaDirecta
     * @return void
     */
    public function updateCausaDirecta(CausaDirectaRequest $request, Proyecto $proyecto, CausaDirecta $causaDirecta)
    {
        $this->authorize('modificar-proyecto-autor', $proyecto);

        /** @var \App\Models\User */
        $auth_user = Auth::user();

        // if ($proyecto->tipo_formulario_convocatoria_id == 5 && $auth_user->hasRole([1, 5, 17]) == false || $proyecto->tipo_formulario_convocatoria_id == 4 && $auth_user->hasRole([1, 5, 17]) == false) {
        if ($auth_user->hasRole([1]) == false && $proyecto->tipo_formulario_convocatoria_id == 5 && $proyecto->proyectoFormulario5Linea69->proyecto_base == false && (string)$auth_user->can_by_user->search(24) === "" || $auth_user->hasRole([1]) == false && $proyecto->tipo_formulario_convocatoria_id == 4 && $proyecto->proyectoFormulario4Linea70->proyecto_base == false && (string)$auth_user->can_by_user->search(23) === "") {
            return back()->with('error', 'No se puede actualizar este recurso debido a que es información predefinida.');
        }

        $causaDirecta->descripcion = $request->descripcion;

        $causaDirecta->save();

        return back()->with('success', 'El recurso se ha guardado correctamente.');
    }

    /**
     * destroyCausaDirecta
     *
     * @param  mixed $proyecto
     * @param  mixed $efectoDirecto
     * @return void
     */
    public function destroyCausaDirecta(Proyecto $proyecto, CausaDirecta $causaDirecta)
    {
        $this->authorize('modificar-proyecto-autor', $proyecto);

        /** @var \App\Models\User */
        $auth_user = Auth::user();

        // if ($proyecto->tipo_formulario_convocatoria_id == 5 && $auth_user->hasRole([1, 5, 17]) == false || $proyecto->tipo_formulario_convocatoria_id == 4 && $auth_user->hasRole([1, 5, 17]) == false) {
        if ($auth_user->hasRole([1]) == false && $proyecto->tipo_formulario_convocatoria_id == 5 && $proyecto->proyectoFormulario5Linea69->proyecto_base == false && (string)$auth_user->can_by_user->search(24) === "" || $auth_user->hasRole([1]) == false && $proyecto->tipo_formulario_convocatoria_id == 4 && $proyecto->proyectoFormulario4Linea70->proyecto_base == false && (string)$auth_user->can_by_user->search(23) === "") {
            return back()->with('error', 'No se puede eliminar este recurso debido a que es información predefinida.');
        }

        $causaDirecta->delete();

        return back()->with('success', 'El recurso se ha eliminado correctamente.');
    }

    /**
     * createOrUpdateCausaIndirecta
     *
     * @param  mixed $request
     * @param  mixed $proyecto
     * @param  mixed $causaDirecta
     * @return void
     */
    public function createOrUpdateCausaIndirecta(CausaIndirectaRequest $request, Proyecto $proyecto, CausaDirecta $causaDirecta)
    {
        $this->authorize('modificar-proyecto-autor', $proyecto);

        /** @var \App\Models\User */
        $auth_user = Auth::user();

        // if ($proyecto->tipo_formulario_convocatoria_id == 5 && $auth_user->hasRole([1, 5, 17]) == false || $proyecto->tipo_formulario_convocatoria_id == 4 && $auth_user->hasRole([1, 5, 17]) == false) {
        if ($auth_user->hasRole([1]) == false && $proyecto->tipo_formulario_convocatoria_id == 5 && $proyecto->proyectoFormulario5Linea69->proyecto_base == false && (string)$auth_user->can_by_user->search(24) === "" || $auth_user->hasRole([1]) == false && $proyecto->tipo_formulario_convocatoria_id == 4 && $proyecto->proyectoFormulario4Linea70->proyecto_base == false && (string)$auth_user->can_by_user->search(23) === "") {
            return back()->with('error', 'No se puede actualizar este recurso debido a que es información predefinida.');
        }

        $causa_indirecta = $causaDirecta->causasIndirectas()->updateOrCreate(
            ['id'           => $request->id],
            ['descripcion'  => $request->descripcion]
        );

        if (empty($causa_indirecta->actividad)) {
            $causa_indirecta->actividad()->create([
                ['descripcion' => null],
            ]);
        }

        return back()->with('success', 'El recurso se ha generado correctamente.');
    }

    /**
     * destroyCausaIndirecta
     *
     * @param  mixed $proyecto
     * @param  mixed $causa_indirecta
     * @return void
     */
    public function destroyCausaIndirecta(Proyecto $proyecto, CausaIndirecta $causa_indirecta)
    {
        $this->authorize('modificar-proyecto-autor', $proyecto);

        /** @var \App\Models\User */
        $auth_user = Auth::user();

        if ($auth_user->hasRole([1]) == false && $proyecto->tipo_formulario_convocatoria_id == 5 && $proyecto->proyectoFormulario5Linea69->proyecto_base == false && (string)$auth_user->can_by_user->search(24) === "" || $auth_user->hasRole([1]) == false && $proyecto->tipo_formulario_convocatoria_id == 4 && $proyecto->proyectoFormulario4Linea70->proyecto_base == false && (string)$auth_user->can_by_user->search(23) === "") {
            return back()->with('error', 'No se puede eliminar este recurso debido a que es información predefinida.');
        }

        $causa_indirecta->delete();

        return back()->with('success', 'El recurso se ha eliminado correctamente.');
    }

    /**
     * showArbolObjetivos
     *
     * @param  mixed $convocatoria
     * @param  mixed $proyecto
     * @return void
     */
    public function showArbolObjetivos(Request $request, Convocatoria $convocatoria, Proyecto $proyecto)
    {
        $this->authorize('visualizar-proyecto-autor', $proyecto);

        if ($proyecto->convocatoria_id != $convocatoria->id) {
            return abort(404);
        }

        $this->generarArboles($proyecto);

        // $proyecto->load('evaluaciones.evaluacionProyectoFormulario8Linea66');

        $proyecto->tipoFormularioConvocatoria->lineaProgramatica;
        $proyecto->participantes;

        $tipos_impacto          = json_decode(Storage::get('json/tipos-impacto.json'), true);

        $efectos_directos       = $proyecto->efectosDirectos()->with('efectosIndirectos.impacto', 'resultado.objetivoEspecifico')->get();

        $causas_directas        = $proyecto->causasDirectas()->with('causasIndirectas.actividad', 'objetivoEspecifico')->get();
        $objetivo_especifico    = $proyecto->causasDirectas()->with('objetivoEspecifico')->get()->pluck('objetivoEspecifico')->flatten()->filter();

        $objetivos_especificos  = $proyecto->causasDirectas()->with('objetivoEspecifico')->get()->pluck('objetivoEspecifico')->flatten()->filter();

        $arr_objetivos_especificos = collect([]);
        $objetivos_especificos->map(function ($objetivo_especifico) use ($arr_objetivos_especificos) {
            $arr_objetivos_especificos->push(['value' => $objetivo_especifico->id, 'label' => $objetivo_especifico->descripcion ? 'Objetivo específico #' . $objetivo_especifico->numero . ': ' . $objetivo_especifico->descripcion : 'Objetivo específico #' . $objetivo_especifico->numero . ': Sin descripción aún']);
        });

        return Inertia::render('Convocatorias/Proyectos/ArbolesProyecto/ArbolObjetivos', [
            'convocatoria'          =>  $convocatoria->only('id', 'esta_activa', 'fase_formateada', 'fase', 'tipo_convocatoria'),
            'proyecto'              =>  $proyecto,
            'evaluacion'            =>  Evaluacion::find(request()->evaluacion_id),
            'efectos_directos'      =>  $efectos_directos,
            'causas_directas'       =>  $causas_directas,
            'tipos_impacto'         =>  $tipos_impacto ?? [],
            'resultados'            =>  Resultado::select('id as value', 'descripcion as label', 'objetivo_especifico_id')->whereIn(
                                        'objetivo_especifico_id',
                                        $objetivo_especifico->map(function ($objetivo_especifico) {
                                            return $objetivo_especifico->id;
                                        })
                                    )->get(),
            'objetivos_especificos' => $arr_objetivos_especificos,
        ]);
    }

    /**
     * updateArbolObjetivosEvaluacion
     *
     * @param  mixed $request
     * @param  mixed $convocatoria
     * @param  mixed $evaluacion
     * @return void
     */
    public function updateArbolObjetivosEvaluacion(Request $request, Convocatoria $convocatoria, Evaluacion $evaluacion)
    {
        $this->authorize('modificar-evaluacion-autor', $evaluacion);

        switch ($evaluacion) {
            case $evaluacion->evaluacionProyectoFormulario8Linea66()->exists():
                $evaluacion->evaluacionProyectoFormulario8Linea66()->update([
                    'objetivos_puntaje'      => $request->objetivos_puntaje,
                    'objetivos_comentario'   => $request->objetivos_requiere_comentario == false ? $request->objetivos_comentario : null,
                    'resultados_puntaje'     => $request->resultados_puntaje,
                    'resultados_comentario'  => $request->resultados_requiere_comentario == false ? $request->resultados_comentario : null
                ]);
                break;
            case $evaluacion->evaluacionProyectoFormulario1Linea65()->exists():
                $evaluacion->evaluacionProyectoFormulario1Linea65()->update([
                    'objetivos_puntaje'      => $request->objetivos_puntaje,
                    'objetivos_comentario'   => $request->objetivos_requiere_comentario == false ? $request->objetivos_comentario : null,
                    'resultados_puntaje'     => $request->resultados_puntaje,
                    'resultados_comentario'  => $request->resultados_requiere_comentario == false ? $request->resultados_comentario : null
                ]);
                break;
            case $evaluacion->evaluacionProyectoFormulario5Linea69()->exists():
                $evaluacion->evaluacionProyectoFormulario5Linea69()->update([
                    'arbol_objetivos_comentario'   => $request->arbol_objetivos_requiere_comentario == false ? $request->arbol_objetivos_comentario : null,
                ]);
                break;

            case $evaluacion->evaluacionProyectoFormulario12Linea68()->exists():
                $evaluacion->evaluacionProyectoFormulario12Linea68()->update([
                    'objetivo_general_puntaje'          => $request->objetivo_general_puntaje,
                    'objetivo_general_comentario'       => $request->objetivo_general_requiere_comentario == false ? $request->objetivo_general_comentario : null,

                    'primer_objetivo_puntaje'           => $request->primer_objetivo_puntaje,
                    'primer_objetivo_comentario'        => $request->primer_objetivo_requiere_comentario == false ? $request->primer_objetivo_comentario : null,

                    'segundo_objetivo_puntaje'          => $request->segundo_objetivo_puntaje,
                    'segundo_objetivo_comentario'       => $request->segundo_objetivo_requiere_comentario == false ? $request->segundo_objetivo_comentario : null,

                    'tercer_objetivo_puntaje'           => $request->tercer_objetivo_puntaje,
                    'tercer_objetivo_comentario'        => $request->tercer_objetivo_requiere_comentario == false ? $request->tercer_objetivo_comentario : null,

                    'cuarto_objetivo_puntaje'           => $request->cuarto_objetivo_puntaje,
                    'cuarto_objetivo_comentario'        => $request->cuarto_objetivo_requiere_comentario == false ? $request->cuarto_objetivo_comentario : null,

                    'resultados_primer_obj_puntaje'     => $request->resultados_primer_obj_puntaje,
                    'resultados_primer_obj_comentario'  => $request->resultados_primer_obj_requiere_comentario == false ? $request->resultados_primer_obj_comentario : null,

                    'resultados_segundo_obj_puntaje'    => $request->resultados_segundo_obj_puntaje,
                    'resultados_segundo_obj_comentario' => $request->resultados_segundo_obj_requiere_comentario == false ? $request->resultados_segundo_obj_comentario : null,

                    'resultados_tercer_obj_puntaje'     => $request->resultados_tercer_obj_puntaje,
                    'resultados_tercer_obj_comentario'  => $request->resultados_tercer_obj_requiere_comentario == false ? $request->resultados_tercer_obj_comentario : null,

                    'resultados_cuarto_obj_puntaje'     => $request->resultados_cuarto_obj_puntaje,
                    'resultados_cuarto_obj_comentario'  => $request->resultados_cuarto_obj_requiere_comentario == false ? $request->resultados_cuarto_obj_comentario : null
                ]);
                break;
            default:
                break;
        }

        $evaluacion->save();

        return back()->with('success', 'El recurso se ha actualizado correctamente.');
    }

    /**
     * updateImpacto
     *
     * @param  mixed $request
     * @param  mixed $proyecto
     * @param  mixed $impacto
     * @return void
     */
    public function updateImpacto(ImpactoRequest $request, Proyecto $proyecto, Impacto $impacto)
    {
        $this->authorize('modificar-proyecto-autor', $proyecto);

        /** @var \App\Models\User */
        $auth_user = Auth::user();

        if ($auth_user->hasRole([1]) == false && $proyecto->tipo_formulario_convocatoria_id == 5 && $proyecto->proyectoFormulario5Linea69->proyecto_base == false && (string)$auth_user->can_by_user->search(24) === "" || $auth_user->hasRole([1]) == false && $proyecto->tipo_formulario_convocatoria_id == 4 && $proyecto->proyectoFormulario4Linea70->proyecto_base == false && (string)$auth_user->can_by_user->search(23) === "") {
            return back()->with('error', 'No se puede actualizar este recurso debido a que es información predefinida.');
        }

        $impacto->update($request->validated());

        return back()->with('success', 'El recurso se ha guardado correctamente.');
    }

    /**
     * destroyImpacto
     *
     * @param  mixed $request
     * @param  mixed $proyecto
     * @param  mixed $impacto
     * @return void
     */
    public function destroyImpacto(Proyecto $proyecto, Impacto $impacto)
    {
        $this->authorize('modificar-proyecto-autor', $proyecto);

        /** @var \App\Models\User */
        $auth_user = Auth::user();

        // if ($proyecto->tipo_formulario_convocatoria_id == 5 && $auth_user->hasRole([1, 5, 17]) == false || $proyecto->tipo_formulario_convocatoria_id == 4 && $auth_user->hasRole([1, 5, 17]) == false) {
        if ($auth_user->hasRole([1]) == false && $proyecto->tipo_formulario_convocatoria_id == 5 && $proyecto->proyectoFormulario5Linea69->proyecto_base == false && (string)$auth_user->can_by_user->search(24) === "" || $auth_user->hasRole([1]) == false && $proyecto->tipo_formulario_convocatoria_id == 4 && $proyecto->proyectoFormulario4Linea70->proyecto_base == false && (string)$auth_user->can_by_user->search(23) === "") {
            return back()->with('error', 'No se puede eliminar este recurso debido a que es información predefinida.');
        }

        $impacto->efectoIndirecto()->delete();
        $impacto->delete();

        return back()->with('success', 'El recurso se ha eliminado correctamente.');
    }

    /**
     * updateResultado
     *
     * @param  mixed $request
     * @param  mixed $proyecto
     * @param  mixed $resultado
     * @return void
     */
    public function updateResultado(ResultadoRequest $request, Proyecto $proyecto, Resultado $resultado)
    {
        $this->authorize('modificar-proyecto-autor', $proyecto);

        /** @var \App\Models\User */
        $auth_user = Auth::user();

        if ($auth_user->hasRole([1]) == false && $proyecto->tipo_formulario_convocatoria_id == 5 && $proyecto->proyectoFormulario5Linea69->proyecto_base == false && (string)$auth_user->can_by_user->search(24) === "" || $auth_user->hasRole([1]) == false && $proyecto->tipo_formulario_convocatoria_id == 4 && $proyecto->proyectoFormulario4Linea70->proyecto_base == false && (string)$auth_user->can_by_user->search(23) === "") {
            return back()->with('error', 'No se puede actualizar este recurso debido a que es información predefinida.');
        }

        $resultado->fill($request->validated());

        // $resultado->objetivoEspecifico->actividades()->update(['resultado_id' => $resultado->id]);

        if ($resultado->save()) {
            return back()->with('success', 'El recurso se ha guardado correctamente.');
        }

        return back()->with('error', 'Hubo un error mientras se actualizaba el resultado. Vuelva a intentar');
    }

    /**
     * destroyResultado
     *
     * @param  mixed $request
     * @param  mixed $proyecto
     * @param  mixed $resultado
     * @return void
     */
    public function destroyResultado(Proyecto $proyecto, Resultado $resultado)
    {
        $this->authorize('modificar-proyecto-autor', $proyecto);

        /** @var \App\Models\User */
        $auth_user = Auth::user();

        // if ($proyecto->tipo_formulario_convocatoria_id == 5 && $auth_user->hasRole([1, 5, 17]) == false || $proyecto->tipo_formulario_convocatoria_id == 4 && $auth_user->hasRole([1, 5, 17]) == false) {
        if ($auth_user->hasRole([1]) == false && $proyecto->tipo_formulario_convocatoria_id == 5 && $proyecto->proyectoFormulario5Linea69->proyecto_base == false && (string)$auth_user->can_by_user->search(24) === "" || $auth_user->hasRole([1]) == false && $proyecto->tipo_formulario_convocatoria_id == 4 && $proyecto->proyectoFormulario4Linea70->proyecto_base == false && (string)$auth_user->can_by_user->search(23) === "") {
            return back()->with('error', 'No se puede eliminar este recurso debido a que es información predefinida.');
        }

        $resultado->efectoDirecto()->delete();
        $resultado->delete();

        return back()->with('success', 'El recurso se ha eliminado correctamente.');
    }

    /**
     * updateObjetivoEspecifico
     *
     * @param  mixed $request
     * @param  mixed $proyecto
     * @param  mixed $objetivo_especifico
     * @return void
     */
    public function updateObjetivoEspecifico(ObjetivoEspecificoRequest $request, Proyecto $proyecto, ObjetivoEspecifico $objetivo_especifico)
    {
        $this->authorize('modificar-proyecto-autor', $proyecto);

        /** @var \App\Models\User */
        $auth_user = Auth::user();

        // if ($proyecto->tipo_formulario_convocatoria_id == 5 && $auth_user->hasRole([1, 5, 17]) == false || $proyecto->tipo_formulario_convocatoria_id == 4 && $auth_user->hasRole([1, 5, 17]) == false) {
        if ($auth_user->hasRole([1]) == false && $proyecto->tipo_formulario_convocatoria_id == 5 && $proyecto->proyectoFormulario5Linea69->proyecto_base == false && (string)$auth_user->can_by_user->search(24) === "" || $auth_user->hasRole([1]) == false && $proyecto->tipo_formulario_convocatoria_id == 4 && $proyecto->proyectoFormulario4Linea70->proyecto_base == false && (string)$auth_user->can_by_user->search(23) === "") {
            return back()->with('error', 'No se puede actualizar este recurso debido a que es información predefinida.');
        }

        $objetivo_especifico->fill($request->validated());

        if ($objetivo_especifico->save()) {
            return back()->with('success', 'El recurso se ha guardado correctamente.');
        }

        return back()->with('error', 'Hubo un error mientras se actualizaba el objetivo específico. Vuelva a intentar.');
    }

    /**
     * destroyObjetivoEspecifico
     *
     * @param  mixed $request
     * @param  mixed $proyecto
     * @param  mixed $objetivo_especifico
     * @return void
     */
    public function destroyObjetivoEspecifico(Proyecto $proyecto, ObjetivoEspecifico $objetivo_especifico)
    {
        $this->authorize('modificar-proyecto-autor', $proyecto);

        /** @var \App\Models\User */
        $auth_user = Auth::user();

        // if ($proyecto->tipo_formulario_convocatoria_id == 5 && $auth_user->hasRole([1, 5, 17]) == false || $proyecto->tipo_formulario_convocatoria_id == 4 && $auth_user->hasRole([1, 5, 17]) == false) {
        if ($auth_user->hasRole([1]) == false && $proyecto->tipo_formulario_convocatoria_id == 5 && $proyecto->proyectoFormulario5Linea69->proyecto_base == false && (string)$auth_user->can_by_user->search(24) === "" || $auth_user->hasRole([1]) == false && $proyecto->tipo_formulario_convocatoria_id == 4 && $proyecto->proyectoFormulario4Linea70->proyecto_base == false && (string)$auth_user->can_by_user->search(23) === "") {
            return back()->with('error', 'No se puede eliminar este recurso debido a que es información predefinida.');
        }

        $objetivo_especifico->causaDirecta()->delete();
        $objetivo_especifico->delete();

        return back()->with('success', 'El recurso se ha eliminado correctamente.');
    }

    /**
     * updateActividad
     *
     * @param  mixed $request
     * @param  mixed $convocatoria
     * @param  mixed $proyecto
     * @param  mixed $actividad
     * @return void
     */
    public function updateActividad(ActividadRequest $request, Convocatoria $convocatoria, Proyecto $proyecto, Actividad $actividad)
    {
        $this->authorize('modificar-proyecto-autor', $proyecto);

        /** @var \App\Models\User */
        $auth_user = Auth::user();

        if ($auth_user->hasRole([1]) == false && $proyecto->tipo_formulario_convocatoria_id == 5 && $proyecto->proyectoFormulario5Linea69->proyecto_base == false && (string)$auth_user->can_by_user->search(24) === "" || $auth_user->hasRole([1]) == false && $proyecto->tipo_formulario_convocatoria_id == 4 && $proyecto->proyectoFormulario4Linea70->proyecto_base == false && (string)$auth_user->can_by_user->search(23) === "") {
            return back()->with('error', 'No se puede actualizar este recurso debido a que es información predefinida.');
        }

        $actividad->update($request->validated());

        if ($actividad->save()) {
            return back()->with('success', 'El recurso se ha guardado correctamente.');
        }

        return back()->with('error', 'Hubo un error mientras se actulizaba la actividad. Vuelva a intentar');
    }

    /**
     * destroyActividad
     *
     * @param  mixed $request
     * @param  mixed $proyecto
     * @param  mixed $actividad
     * @return void
     */
    public function destroyActividad(Proyecto $proyecto, Actividad $actividad)
    {
        $this->authorize('modificar-proyecto-autor', $proyecto);

        /** @var \App\Models\User */
        $auth_user = Auth::user();

        // if ($proyecto->tipo_formulario_convocatoria_id == 5 && $auth_user->hasRole([1, 5, 17]) == false || $proyecto->tipo_formulario_convocatoria_id == 4 && $auth_user->hasRole([1, 5, 17]) == false) {
        if ($auth_user->hasRole([1]) == false && $proyecto->tipo_formulario_convocatoria_id == 5 && $proyecto->proyectoFormulario5Linea69->proyecto_base == false && (string)$auth_user->can_by_user->search(24) === "" || $auth_user->hasRole([1]) == false && $proyecto->tipo_formulario_convocatoria_id == 4 && $proyecto->proyectoFormulario4Linea70->proyecto_base == false && (string)$auth_user->can_by_user->search(23) === "") {
            return back()->with('error', 'No se puede eliminar este recurso debido a que es información predefinida.');
        }

        $actividad->causaIndirecta()->delete();
        $actividad->delete();

        return back()->with('success', 'El recurso se ha eliminado correctamente.');
    }

    public function updateLongColumn(ArbolesColumnRequest $request, Convocatoria $convocatoria, Proyecto $proyecto, $column)
    {
        $this->authorize('modificar-proyecto-autor', $proyecto);

        switch ($proyecto->tipo_formulario_convocatoria_id) {
            case 1:
                $proyecto->proyectoFormulario1Linea65()->update($request->only($column));
                break;
            case 3:
                $proyecto->proyectoFormulario3Linea61()->update($request->only($column));
                break;
            case 4:
                $proyecto->proyectoFormulario4Linea70()->update($request->only($column));
                break;
            case 5:
                $proyecto->proyectoFormulario5Linea69()->update($request->only($column));
                break;
            case 6:
                $proyecto->proyectoFormulario6Linea82()->update($request->only($column));
                break;
            case 7:
                $proyecto->proyectoFormulario7Linea23()->update($request->only($column));
                break;
            case 8:
                $proyecto->proyectoFormulario8Linea66()->update($request->only($column));
                break;
            case 9:
                $proyecto->proyectoFormulario9Linea23()->update($request->only($column));
                break;
            case 10:
                $proyecto->proyectoFormulario10Linea69()->update($request->only($column));
                break;
            case 11:
                $proyecto->proyectoFormulario11Linea83()->update($request->only($column));
                break;
            case 12:
                $proyecto->proyectoFormulario12Linea68()->update($request->only($column));
                break;
            case 13:
                $proyecto->proyectoFormulario13Linea65()->update($request->only($column));
                break;
            case 15:
                $proyecto->proyectoFormulario15Linea65()->update($request->only($column));
                break;
            case 16:
                $proyecto->proyectoFormulario16Linea65()->update($request->only($column));
                break;
            case 17:
                $proyecto->proyectoFormulario17Linea69()->update($request->only($column));
                break;
            default:
                break;
        }

        return back();
    }
}
