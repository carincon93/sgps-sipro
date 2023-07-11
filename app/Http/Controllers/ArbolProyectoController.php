<?php

namespace App\Http\Controllers;

use App\Http\Requests\ActividadRequest;
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
use App\Models\Evaluacion\CulturaInnovacionEvaluacion;
use App\Models\Evaluacion\Evaluacion;
use App\Models\Evaluacion\IdiEvaluacion;
use App\Models\Evaluacion\ServicioTecnologicoEvaluacion;
use App\Models\Evaluacion\TaEvaluacion;
use App\Models\Evaluacion\TpEvaluacion;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ArbolProyectoController extends Controller
{
    /**
     * generateTree
     *
     * @param  mixed $proyecto
     * @return void
     */
    private function generateTree(Proyecto $proyecto)
    {
        if ($proyecto->arboles_completos == false) {
            // 1. Generar mínimo 3 causas directas -> 3 objetivos específicos
            for ($i = 0; $i < 3; $i++) {
                $causaDirecta = $proyecto->causasDirectas()->create([
                    ['descripcion' => null],
                ]);

                $objetivoEspecifico = $causaDirecta->objetivoEspecifico()->create([
                    'descripcion'       => null,
                    'numero'            => $i + 1,
                ]);

                // 2. Generar mínimo 3 efectos directos -> 3 resultados
                $efectoDirecto = $proyecto->efectosDirectos()->create([
                    ['descripcion' => null],
                ]);

                $efectoDirecto->resultado()->create([
                    'descripcion'            => null,
                    'objetivo_especifico_id' => $objetivoEspecifico->id
                ]);

                // 3. Generar mínimo 1 efectos indirecto -> 1 impacto
                $efectoIndirecto = $efectoDirecto->efectosIndirectos()->create([
                    ['descripcion' => null],
                ]);

                $efectoIndirecto->impacto()->create([
                    ['descripcion' => null],
                ]);

                // 4. Generar mínimo 1 causa indirecta -> 1 actividad
                $causaIndirecta = $causaDirecta->causasIndirectas()->create([
                    ['descripcion' => null],
                ]);

                $causaIndirecta->actividad()->create([
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

        $proyecto->load('evaluaciones.idiEvaluacion');

        $this->generateTree($proyecto);
        $efectosDirectos = $proyecto->efectosDirectos()->with('efectosIndirectos:id,efecto_directo_id,descripcion')->get();
        $causasDirectas  = $proyecto->causasDirectas()->with('causasIndirectas')->get();
        $proyecto->codigo_linea_programatica = $proyecto->lineaProgramatica->codigo;

        switch ($proyecto) {
            case $proyecto->idi()->exists():
                $proyecto->problema_central         = $proyecto->idi->problema_central;
                $proyecto->justificacion_problema   = $proyecto->idi->justificacion_problema;
                $proyecto->identificacion_problema  = $proyecto->idi->identificacion_problema;
                $proyecto->objetivo_general         = $proyecto->idi->objetivo_general;
                break;
            case $proyecto->ta()->exists():
                $proyecto->problema_central         = $proyecto->ta->problema_central;
                $proyecto->objetivo_general         = $proyecto->ta->objetivo_general;
                $proyecto->proyecto_base            = $proyecto->ta->proyecto_base;

                break;
            case $proyecto->tp()->exists():
                $proyecto->justificacion_problema   = $proyecto->tp->justificacion_problema;
                $proyecto->identificacion_problema  = $proyecto->tp->identificacion_problema;
                $proyecto->problema_central         = $proyecto->tp->problema_central;
                $proyecto->objetivo_general         = $proyecto->tp->objetivo_general;
                $proyecto->proyecto_base            = $proyecto->tp->proyecto_base;
                break;
            case $proyecto->servicioTecnologico()->exists():
                $proyecto->problema_central = $proyecto->servicioTecnologico->problema_central;
                break;
            case $proyecto->culturaInnovacion()->exists():
                $proyecto->problema_central         = $proyecto->culturaInnovacion->problema_central;
                $proyecto->justificacion_problema   = $proyecto->culturaInnovacion->justificacion_problema;
                $proyecto->identificacion_problema  = $proyecto->culturaInnovacion->identificacion_problema;
                $proyecto->objetivo_general         = $proyecto->culturaInnovacion->objetivo_general;
                $proyecto->tipo_proyecto            = $proyecto->culturaInnovacion->tipo_proyecto;
                break;
            default:
                break;
        }

        return Inertia::render('Convocatorias/Proyectos/ArbolesProyecto/ArbolProblemas', [
            'convocatoria'      => $convocatoria->only('id', 'esta_activa', 'fase_formateada', 'fase', 'tipo_convocatoria', 'mostrar_recomendaciones'),
            'proyecto'          => $proyecto->only('id', 'precio_proyecto', 'identificacion_problema', 'problema_central', 'justificacion_problema', 'pregunta_formulacion_problema', 'objetivo_general', 'codigo_linea_programatica', 'modificable', 'en_subsanacion', 'evaluaciones', 'mostrar_recomendaciones', 'PdfVersiones', 'all_files', 'allowed', 'tipo_proyecto', 'proyecto_base'),
            'efectosDirectos'   => $efectosDirectos,
            'causasDirectas'    => $causasDirectas,
        ]);
    }

    /**
     * showArbolProblemasEvaluacion
     *
     * @param  mixed $convocatoria
     * @param  mixed $proyecto
     * @return void
     */
    public function showArbolProblemasEvaluacion(Convocatoria $convocatoria, Evaluacion $evaluacion)
    {
        $this->authorize('visualizar-evaluacion-autor', $evaluacion);

        $efectosDirectos = $evaluacion->proyecto->efectosDirectos()->with('efectosIndirectos:id,efecto_directo_id,descripcion')->get();
        $causasDirectas  = $evaluacion->proyecto->causasDirectas()->with('causasIndirectas')->get();
        $evaluacion->proyecto->codigo_linea_programatica = $evaluacion->proyecto->lineaProgramatica->codigo;

        switch ($evaluacion->proyecto) {
            case $evaluacion->proyecto->idi()->exists():
                $evaluacion->proyecto->antecedentes             = $evaluacion->proyecto->idi->antecedentes;
                $evaluacion->proyecto->marco_conceptual         = $evaluacion->proyecto->idi->marco_conceptual;
                $evaluacion->proyecto->problema_central         = $evaluacion->proyecto->idi->problema_central;
                $evaluacion->proyecto->justificacion_problema   = $evaluacion->proyecto->idi->justificacion_problema;
                $evaluacion->proyecto->identificacion_problema  = $evaluacion->proyecto->idi->identificacion_problema;
                $evaluacion->idiEvaluacion;
                $idi = $evaluacion->proyecto->idi;

                $segundaEvaluacion = IdiEvaluacion::whereHas('evaluacion', function ($query) use ($idi) {
                    $query->where('evaluaciones.proyecto_id', $idi->id)->where('evaluaciones.habilitado', true);
                })->where('idi_evaluaciones.id', '!=', $evaluacion->idiEvaluacion->id)->first();
                break;
            case $evaluacion->proyecto->ta()->exists():
                $evaluacion->proyecto->problema_central = $evaluacion->proyecto->ta->problema_central;
                $evaluacion->taEvaluacion;
                $ta = $evaluacion->proyecto->ta;

                $segundaEvaluacion = TaEvaluacion::whereHas('evaluacion', function ($query) use ($ta) {
                    $query->where('evaluaciones.proyecto_id', $ta->id)->where('evaluaciones.habilitado', true);
                })->where('ta_evaluaciones.id', '!=', $evaluacion->taEvaluacion->id)->first();
                break;
            case $evaluacion->proyecto->tp()->exists():
                $evaluacion->proyecto->justificacion_problema   = $evaluacion->proyecto->tp->justificacion_problema;
                $evaluacion->proyecto->identificacion_problema  = $evaluacion->proyecto->tp->identificacion_problema;
                $evaluacion->proyecto->problema_central         = $evaluacion->proyecto->tp->problema_central;
                $evaluacion->tpEvaluacion;
                $tp = $evaluacion->proyecto->tp;

                $segundaEvaluacion = TpEvaluacion::whereHas('evaluacion', function ($query) use ($tp) {
                    $query->where('evaluaciones.proyecto_id', $tp->id)->where('evaluaciones.habilitado', true);
                })->where('tp_evaluaciones.id', '!=', $evaluacion->tpEvaluacion->id)->first();
                break;
            case $evaluacion->proyecto->servicioTecnologico()->exists():
                $evaluacion->proyecto->problema_central = $evaluacion->proyecto->servicioTecnologico->problema_central;

                $evaluacion->servicioTecnologicoEvaluacion;
                $servicioTecnologico = $evaluacion->proyecto->servicioTecnologico;

                $segundaEvaluacion = ServicioTecnologicoEvaluacion::whereHas('evaluacion', function ($query) use ($servicioTecnologico) {
                    $query->where('evaluaciones.proyecto_id', $servicioTecnologico->id)->where('evaluaciones.habilitado', true);
                })->where('servicios_tecnologicos_evaluaciones.id', '!=', $evaluacion->servicioTecnologicoEvaluacion->id)->first();
                break;
            case $evaluacion->proyecto->culturaInnovacion()->exists():
                $evaluacion->proyecto->problema_central         = $evaluacion->proyecto->culturaInnovacion->problema_central;
                $evaluacion->proyecto->justificacion_problema   = $evaluacion->proyecto->culturaInnovacion->justificacion_problema;
                $evaluacion->proyecto->identificacion_problema  = $evaluacion->proyecto->culturaInnovacion->identificacion_problema;

                $evaluacion->culturaInnovacionEvaluacion;
                $culturaInnovacion = $evaluacion->proyecto->culturaInnovacion;

                $segundaEvaluacion = CulturaInnovacionEvaluacion::whereHas('evaluacion', function ($query) use ($culturaInnovacion) {
                    $query->where('evaluaciones.proyecto_id', $culturaInnovacion->id)->where('evaluaciones.habilitado', true);
                })->where('cultura_innovacion_evaluaciones.id', '!=', $evaluacion->culturaInnovacionEvaluacion->id)->first();
                break;
            default:
                break;
        }

        return Inertia::render('Convocatorias/Evaluaciones/ArbolesProyecto/ArbolProblemas', [
            'convocatoria'      => $convocatoria->only('id', 'esta_activa', 'fase_formateada', 'fase', 'tipo_convocatoria', 'mostrar_recomendaciones'),
            'evaluacion'        => $evaluacion,
            'segundaEvaluacion' => $segundaEvaluacion,
            'proyecto'          => $evaluacion->proyecto->only('id', 'precio_proyecto', 'identificacion_problema', 'problema_central', 'justificacion_problema', 'pregunta_formulacion_problema', 'antecedentes', 'marco_conceptual', 'codigo_linea_programatica', 'finalizado', 'allowed'),
            'efectosDirectos'   => $efectosDirectos,
            'causasDirectas'    => $causasDirectas,
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
            case $evaluacion->idiEvaluacion()->exists():
                $evaluacion->idiEvaluacion()->update([
                    'problema_central_puntaje'      => $request->problema_central_puntaje,
                    'problema_central_comentario'   => $request->problema_central_requiere_comentario == false ? $request->problema_central_comentario : null
                ]);
                break;
            case $evaluacion->culturaInnovacionEvaluacion()->exists():
                $evaluacion->culturaInnovacionEvaluacion()->update([
                    'problema_central_puntaje'      => $request->problema_central_puntaje,
                    'problema_central_comentario'   => $request->problema_central_requiere_comentario == false ? $request->problema_central_comentario : null
                ]);
                break;
            case $evaluacion->tpEvaluacion()->exists():
                $evaluacion->tpEvaluacion()->update([
                    'arbol_problemas_comentario'   => $request->arbol_problemas_requiere_comentario == false ? $request->arbol_problemas_comentario : null
                ]);
                break;
            case $evaluacion->servicioTecnologicoEvaluacion()->exists():
                $evaluacion->servicioTecnologicoEvaluacion()->update([
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
     * updateProblem
     *
     * @param  mixed $request
     * @param  mixed $proyecto
     * @return void
     */
    public function updateProblemaCentral(Request $request, Proyecto $proyecto)
    {
        $this->authorize('modificar-proyecto-autor', $proyecto);

        /** @var \App\Models\User */
        $authUser = Auth::user();

        // if ($proyecto->lineaProgramatica->codigo == 69 && $authUser->hasRole([1, 5, 17]) == false || $proyecto->lineaProgramatica->codigo == 70 && $authUser->hasRole([1, 5, 17]) == false) {
        if ($authUser->hasRole([1]) == false && $proyecto->lineaProgramatica->codigo == 69 && $proyecto->tp->proyecto_base == false && (string)$authUser->can_by_user->search(24) === "" || $authUser->hasRole([1]) == false && $proyecto->lineaProgramatica->codigo == 70 && $proyecto->ta->proyecto_base == false && (string)$authUser->can_by_user->search(23) === "") {
            return back()->with('error', 'No se puede actualizar este recurso debido a que es información predefinida.');
        }

        switch ($proyecto) {
            case $proyecto->idi()->exists():
                $request->validate([
                    'identificacion_problema'   => 'required|string|max:40000',
                    'problema_central'          => 'required|string|max:40000',
                    'justificacion_problema'    => 'required|string|max:40000',
                    'objetivo_general'          => 'required|string|max:40000',
                ]);

                $idi = $proyecto->idi;
                $idi->identificacion_problema   = $request->identificacion_problema;
                $idi->problema_central          = $request->problema_central;
                $idi->justificacion_problema    = $request->justificacion_problema;
                $idi->objetivo_general          = $request->objetivo_general;

                $idi->save();
                break;
            case $proyecto->ta()->exists():
                $ta = $proyecto->ta;

                $request->validate([
                    'problema_central' => 'required|string|max:40000',
                    'objetivo_general' => 'required|string|max:40000',

                ]);
                $ta->problema_central = $request->problema_central;
                $ta->objetivo_general = $request->objetivo_general;

                $ta->save();
                break;
            case $proyecto->tp()->exists():
                $tp = $proyecto->tp;
                $request->validate([
                    'identificacion_problema'   => 'required|string|max:40000',
                    'problema_central'          => 'required|string|max:40000',
                    'justificacion_problema'    => 'required|string|max:40000',
                    'objetivo_general'          => 'required|string|max:40000',
                ]);
                $tp->identificacion_problema    = $request->identificacion_problema;
                $tp->justificacion_problema     = $request->justificacion_problema;
                $tp->problema_central           = $request->problema_central;
                $tp->objetivo_general           = $request->objetivo_general;


                $tp->save();
                break;

            case $proyecto->culturaInnovacion()->exists():
                $request->validate([
                    'identificacion_problema'  => 'required|string|max:40000',
                    'problema_central'         => 'required|string|max:40000',
                    'justificacion_problema'   => 'required|string|max:40000',
                    'objetivo_general'         => 'required|string|max:40000',
                ]);

                $culturaInnovacion = $proyecto->culturaInnovacion;
                $culturaInnovacion->identificacion_problema  = $request->identificacion_problema;
                $culturaInnovacion->problema_central         = $request->problema_central;
                $culturaInnovacion->justificacion_problema   = $request->justificacion_problema;
                $culturaInnovacion->objetivo_general         = $request->objetivo_general;

                $culturaInnovacion->save();
                break;
            case $proyecto->servicioTecnologico()->exists():
                $request->validate([
                    'problema_central' => 'required|string|max:40000',
                    'objetivo_general' => 'required|string|max:40000',
                ]);
                $servicioTecnologico                   = $proyecto->servicioTecnologico;
                $servicioTecnologico->problema_central = $request->problema_central;
                $servicioTecnologico->objetivo_general = $request->objetivo_general;

                $servicioTecnologico->save();
                break;
            default:
                break;
        }

        return back()->with('success', 'El recurso se ha guardado correctamente.');
    }

    public function newEfectoDirecto(EfectoDirectoRequest $request, Proyecto $proyecto)
    {
        $this->authorize('modificar-proyecto-autor', $proyecto);

        /** @var \App\Models\User */
        $authUser = Auth::user();

        // if ($proyecto->lineaProgramatica->codigo == 69 && $authUser->hasRole([1, 5, 17]) == false || $proyecto->lineaProgramatica->codigo == 70 && $authUser->hasRole([1, 5, 17]) == false) {
        if ($authUser->hasRole([1]) == false && $proyecto->lineaProgramatica->codigo == 69 && $proyecto->tp->proyecto_base == false && (string)$authUser->can_by_user->search(24) === "" || $authUser->hasRole([1]) == false && $proyecto->lineaProgramatica->codigo == 70 && $proyecto->ta->proyecto_base == false && (string)$authUser->can_by_user->search(23) === "") {
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
        $authUser = Auth::user();

        if ($authUser->hasRole([1]) == false && $proyecto->lineaProgramatica->codigo == 69 && $proyecto->tp->proyecto_base == false && (string)$authUser->can_by_user->search(24) === "" || $authUser->hasRole([1]) == false && $proyecto->lineaProgramatica->codigo == 70 && $proyecto->ta->proyecto_base == false && (string)$authUser->can_by_user->search(23) === "") {
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
        $authUser = Auth::user();

        // if ($proyecto->lineaProgramatica->codigo == 69 && $authUser->hasRole([1, 5, 17]) == false || $proyecto->lineaProgramatica->codigo == 70 && $authUser->hasRole([1, 5, 17]) == false) {
        if ($authUser->hasRole([1]) == false && $proyecto->lineaProgramatica->codigo == 69 && $proyecto->tp->proyecto_base == false && (string)$authUser->can_by_user->search(24) === "" || $authUser->hasRole([1]) == false && $proyecto->lineaProgramatica->codigo == 70 && $proyecto->ta->proyecto_base == false && (string)$authUser->can_by_user->search(23) === "") {
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
        $authUser = Auth::user();

        if ($authUser->hasRole([1]) == false && $proyecto->lineaProgramatica->codigo == 69 && $proyecto->tp->proyecto_base == false && (string)$authUser->can_by_user->search(24) === "" || $authUser->hasRole([1]) == false && $proyecto->lineaProgramatica->codigo == 70 && $proyecto->ta->proyecto_base == false && (string)$authUser->can_by_user->search(23) === "") {
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
        $authUser = Auth::user();

        if ($authUser->hasRole([1]) == false && $proyecto->lineaProgramatica->codigo == 69 && $proyecto->tp->proyecto_base == false && (string)$authUser->can_by_user->search(24) === "" || $authUser->hasRole([1]) == false && $proyecto->lineaProgramatica->codigo == 70 && $proyecto->ta->proyecto_base == false && (string)$authUser->can_by_user->search(23) === "") {
            return back()->with('error', 'No se puede eliminar este recurso debido a que es información predefinida.');
        }

        $efectoIndirecto->delete();

        return back()->with('success', 'El recurso se ha eliminado correctamente.');
    }

    public function newCausaDirecta(CausaDirectaRequest $request, Proyecto $proyecto)
    {
        $this->authorize('modificar-proyecto-autor', $proyecto);

        /** @var \App\Models\User */
        $authUser = Auth::user();

        if ($authUser->hasRole([1]) == false && $proyecto->lineaProgramatica->codigo == 69 && $proyecto->tp->proyecto_base == false && (string)$authUser->can_by_user->search(24) === "" || $authUser->hasRole([1]) == false && $proyecto->lineaProgramatica->codigo == 70 && $proyecto->ta->proyecto_base == false && (string)$authUser->can_by_user->search(23) === "") {
            return back()->with('error', 'No se puede actualizar este recurso debido a que es información predefinida.');
        }

        if ($proyecto->lineaProgramatica->codigo == 23 && $proyecto->causasDirectas()->count() > 3 || $proyecto->lineaProgramatica->codigo == 66 && $proyecto->causasDirectas()->count() > 3  || $proyecto->lineaProgramatica->codigo == 82 && $proyecto->causasDirectas()->count() > 3) {
            return back()->with('error', 'No se ha podido generar porque ha superado la cantidad máxima permitida de 4 ítems.');
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
        $authUser = Auth::user();

        // if ($proyecto->lineaProgramatica->codigo == 69 && $authUser->hasRole([1, 5, 17]) == false || $proyecto->lineaProgramatica->codigo == 70 && $authUser->hasRole([1, 5, 17]) == false) {
        if ($authUser->hasRole([1]) == false && $proyecto->lineaProgramatica->codigo == 69 && $proyecto->tp->proyecto_base == false && (string)$authUser->can_by_user->search(24) === "" || $authUser->hasRole([1]) == false && $proyecto->lineaProgramatica->codigo == 70 && $proyecto->ta->proyecto_base == false && (string)$authUser->can_by_user->search(23) === "") {
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
        $authUser = Auth::user();

        // if ($proyecto->lineaProgramatica->codigo == 69 && $authUser->hasRole([1, 5, 17]) == false || $proyecto->lineaProgramatica->codigo == 70 && $authUser->hasRole([1, 5, 17]) == false) {
        if ($authUser->hasRole([1]) == false && $proyecto->lineaProgramatica->codigo == 69 && $proyecto->tp->proyecto_base == false && (string)$authUser->can_by_user->search(24) === "" || $authUser->hasRole([1]) == false && $proyecto->lineaProgramatica->codigo == 70 && $proyecto->ta->proyecto_base == false && (string)$authUser->can_by_user->search(23) === "") {
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
        $authUser = Auth::user();

        // if ($proyecto->lineaProgramatica->codigo == 69 && $authUser->hasRole([1, 5, 17]) == false || $proyecto->lineaProgramatica->codigo == 70 && $authUser->hasRole([1, 5, 17]) == false) {
        if ($authUser->hasRole([1]) == false && $proyecto->lineaProgramatica->codigo == 69 && $proyecto->tp->proyecto_base == false && (string)$authUser->can_by_user->search(24) === "" || $authUser->hasRole([1]) == false && $proyecto->lineaProgramatica->codigo == 70 && $proyecto->ta->proyecto_base == false && (string)$authUser->can_by_user->search(23) === "") {
            return back()->with('error', 'No se puede actualizar este recurso debido a que es información predefinida.');
        }

        $causaIndirecta = $causaDirecta->causasIndirectas()->updateOrCreate(
            ['id'           => $request->id],
            ['descripcion'  => $request->descripcion]
        );

        if (empty($causaIndirecta->actividad)) {
            $causaIndirecta->actividad()->create([
                ['descripcion' => null],
            ]);
        }

        return back()->with('success', 'El recurso se ha generado correctamente.');
    }

    /**
     * destroyCausaIndirecta
     *
     * @param  mixed $proyecto
     * @param  mixed $causaIndirecta
     * @return void
     */
    public function destroyCausaIndirecta(Proyecto $proyecto, CausaIndirecta $causaIndirecta)
    {
        $this->authorize('modificar-proyecto-autor', $proyecto);

        /** @var \App\Models\User */
        $authUser = Auth::user();

        if ($authUser->hasRole([1]) == false && $proyecto->lineaProgramatica->codigo == 69 && $proyecto->tp->proyecto_base == false && (string)$authUser->can_by_user->search(24) === "" || $authUser->hasRole([1]) == false && $proyecto->lineaProgramatica->codigo == 70 && $proyecto->ta->proyecto_base == false && (string)$authUser->can_by_user->search(23) === "") {
            return back()->with('error', 'No se puede eliminar este recurso debido a que es información predefinida.');
        }

        $causaIndirecta->delete();

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

        $proyecto->load('evaluaciones.idiEvaluacion');

        $efectosDirectos    = $proyecto->efectosDirectos()->with('efectosIndirectos.impacto', 'resultado')->get();

        $causasDirectas     = $proyecto->causasDirectas()->with('causasIndirectas.actividad', 'objetivoEspecifico')->get();
        $objetivoEspecifico = $proyecto->causasDirectas()->with('objetivoEspecifico')->get()->pluck('objetivoEspecifico')->flatten()->filter();

        $proyecto->codigo_linea_programatica = $proyecto->lineaProgramatica->codigo;
        switch ($proyecto) {
            case $proyecto->idi()->exists():
                $proyecto->problema_central         = $proyecto->idi->problema_central;
                $proyecto->identificacion_problema  = $proyecto->idi->identificacion_problema;
                $proyecto->objetivo_general         = $proyecto->idi->objetivo_general;
                $tiposImpacto = json_decode(Storage::get('json/tipos-impacto.json'), true);
                break;
            case $proyecto->ta()->exists():
                $proyecto->problema_central         = $proyecto->ta->problema_central;
                $proyecto->identificacion_problema  = $proyecto->ta->identificacion_problema;
                $proyecto->objetivo_general         = $proyecto->ta->objetivo_general;
                $proyecto->proyecto_base            = $proyecto->ta->proyecto_base;
                $tiposImpacto = json_decode(Storage::get('json/tipos-impacto.json'), true);
                break;
            case $proyecto->tp()->exists():
                $proyecto->problema_central         = $proyecto->tp->problema_central;
                $proyecto->identificacion_problema  = $proyecto->tp->identificacion_problema;
                $proyecto->objetivo_general         = $proyecto->tp->objetivo_general;
                $proyecto->proyecto_base            = $proyecto->tp->proyecto_base;
                $tiposImpacto = json_decode(Storage::get('json/tipos-impacto.json'), true);
                break;
            case $proyecto->culturaInnovacion()->exists():
                $proyecto->problema_central         = $proyecto->culturaInnovacion->problema_central;
                $proyecto->identificacion_problema  = $proyecto->culturaInnovacion->identificacion_problema;
                $proyecto->objetivo_general         = $proyecto->culturaInnovacion->objetivo_general;
                $proyecto->tipo_proyecto            = $proyecto->culturaInnovacion->tipo_proyecto;

                $tiposImpacto = json_decode(Storage::get('json/tipos-impacto.json'), true);
                break;
            case $proyecto->servicioTecnologico()->exists():
                $proyecto->objetivo_general   = $proyecto->servicioTecnologico->objetivo_general;
                $proyecto->problema_central   = $proyecto->servicioTecnologico->problema_central;
                $tiposImpacto = json_decode(Storage::get('json/tipos-impacto-st.json'), true);
                break;
            default:
                break;
        }

        $objetivosEspecificos = $proyecto->causasDirectas()->with('objetivoEspecifico')->get()->pluck('objetivoEspecifico')->flatten()->filter();

        $arrObjetivosEspecificos = collect([]);
        $objetivosEspecificos->map(function ($objetivoEspecifico) use ($arrObjetivosEspecificos) {
            $arrObjetivosEspecificos->push(['value' => $objetivoEspecifico->id, 'label' => $objetivoEspecifico->descripcion ? 'Objetivo específico #' . $objetivoEspecifico->numero . ': ' . $objetivoEspecifico->descripcion : 'Objetivo específico #' . $objetivoEspecifico->numero . ': Sin descripción aún']);
        });


        return Inertia::render('Convocatorias/Proyectos/ArbolesProyecto/ArbolObjetivos', [
            'convocatoria'          => $convocatoria->only('id', 'esta_activa', 'fase_formateada', 'fase', 'tipo_convocatoria'),
            'proyecto'              => $proyecto->only('id', 'codigo_linea_programatica', 'precio_proyecto', 'identificacion_problema', 'problema_central', 'objetivo_general', 'fecha_inicio', 'fecha_finalizacion', 'modificable', 'en_subsanacion', 'evaluaciones', 'mostrar_recomendaciones', 'PdfVersiones', 'all_files', 'allowed', 'resultados', 'tipo_proyecto', 'proyecto_base'),
            'efectosDirectos'       => $efectosDirectos,
            'causasDirectas'        => $causasDirectas,
            'tiposImpacto'          => $tiposImpacto,
            'resultados'            => Resultado::select('id as value', 'descripcion as label', 'objetivo_especifico_id')->whereIn(
                'objetivo_especifico_id',
                $objetivoEspecifico->map(function ($objetivoEspecifico) {
                    return $objetivoEspecifico->id;
                })
            )->get(),
            'objetivosEspecificos'  => $arrObjetivosEspecificos,
        ]);
    }

    /**
     * showArbolObjetivosEvaluacion
     *
     * @param  mixed $convocatoria
     * @param  mixed $proyecto
     * @return void
     */
    public function showArbolObjetivosEvaluacion(Convocatoria $convocatoria, Evaluacion $evaluacion)
    {
        $this->authorize('visualizar-evaluacion-autor', $evaluacion);

        $efectosDirectos  = $evaluacion->proyecto->efectosDirectos()->with('efectosIndirectos.impacto', 'resultado')->get();
        $causasDirectas   = $evaluacion->proyecto->causasDirectas()->with('causasIndirectas.actividad', 'objetivoEspecifico')->get();

        $objetivoEspecifico = $evaluacion->proyecto->causasDirectas()->with('objetivoEspecifico')->get()->pluck('objetivoEspecifico')->flatten()->filter();

        $evaluacion->proyecto->codigo_linea_programatica = $evaluacion->proyecto->lineaProgramatica->codigo;
        switch ($evaluacion->proyecto) {
            case $evaluacion->proyecto->idi()->exists():
                $evaluacion->proyecto->problema_central         = $evaluacion->proyecto->idi->problema_central;
                $evaluacion->proyecto->identificacion_problema  = $evaluacion->proyecto->idi->identificacion_problema;
                $evaluacion->proyecto->objetivo_general         = $evaluacion->proyecto->idi->objetivo_general;
                $tiposImpacto = json_decode(Storage::get('json/tipos-impacto.json'), true);
                $evaluacion->idiEvaluacion;
                $idi = $evaluacion->proyecto->idi;

                $segundaEvaluacion = IdiEvaluacion::whereHas('evaluacion', function ($query) use ($idi) {
                    $query->where('evaluaciones.proyecto_id', $idi->id)->where('evaluaciones.habilitado', true);
                })->where('idi_evaluaciones.id', '!=', $evaluacion->idiEvaluacion->id)->first();
                break;
            case $evaluacion->proyecto->ta()->exists():
                $evaluacion->proyecto->problema_central         = $evaluacion->proyecto->ta->problema_central;
                $evaluacion->proyecto->identificacion_problema  = $evaluacion->proyecto->ta->identificacion_problema;
                $evaluacion->proyecto->objetivo_general         = $evaluacion->proyecto->ta->objetivo_general;
                $evaluacion->taEvaluacion;
                $ta = $evaluacion->proyecto->ta;

                $segundaEvaluacion = TaEvaluacion::whereHas('evaluacion', function ($query) use ($ta) {
                    $query->where('evaluaciones.proyecto_id', $ta->id)->where('evaluaciones.habilitado', true);
                })->where('ta_evaluaciones.id', '!=', $evaluacion->taEvaluacion->id)->first();

                $tiposImpacto = json_decode(Storage::get('json/tipos-impacto.json'), true);
                break;
            case $evaluacion->proyecto->tp()->exists():
                $evaluacion->proyecto->problema_central         = $evaluacion->proyecto->tp->problema_central;
                $evaluacion->proyecto->identificacion_problema  = $evaluacion->proyecto->tp->identificacion_problema;
                $evaluacion->proyecto->objetivo_general         = $evaluacion->proyecto->tp->objetivo_general;

                $evaluacion->tpEvaluacion;
                $tp = $evaluacion->proyecto->tp;

                $segundaEvaluacion = TpEvaluacion::whereHas('evaluacion', function ($query) use ($tp) {
                    $query->where('evaluaciones.proyecto_id', $tp->id)->where('evaluaciones.habilitado', true);
                })->where('tp_evaluaciones.id', '!=', $evaluacion->tpEvaluacion->id)->first();


                $tiposImpacto = json_decode(Storage::get('json/tipos-impacto.json'), true);
                break;
            case $evaluacion->proyecto->culturaInnovacion()->exists():
                $evaluacion->proyecto->problema_central         = $evaluacion->proyecto->culturaInnovacion->problema_central;
                $evaluacion->proyecto->identificacion_problema  = $evaluacion->proyecto->culturaInnovacion->identificacion_problema;
                $evaluacion->proyecto->objetivo_general         = $evaluacion->proyecto->culturaInnovacion->objetivo_general;
                $tiposImpacto = json_decode(Storage::get('json/tipos-impacto.json'), true);

                $evaluacion->culturaInnovacionEvaluacion;
                $culturaInnovacion = $evaluacion->proyecto->culturaInnovacion;

                $segundaEvaluacion = CulturaInnovacionEvaluacion::whereHas('evaluacion', function ($query) use ($culturaInnovacion) {
                    $query->where('evaluaciones.proyecto_id', $culturaInnovacion->id)->where('evaluaciones.habilitado', true);
                })->where('cultura_innovacion_evaluaciones.id', '!=', $evaluacion->culturaInnovacionEvaluacion->id)->first();
                break;
            case $evaluacion->proyecto->servicioTecnologico()->exists():
                $evaluacion->proyecto->objetivo_general   = $evaluacion->proyecto->servicioTecnologico->objetivo_general;
                $evaluacion->proyecto->problema_central   = $evaluacion->proyecto->servicioTecnologico->problema_central;
                $tiposImpacto = json_decode(Storage::get('json/tipos-impacto-st.json'), true);

                $servicioTecnologico = $evaluacion->proyecto->servicioTecnologico;

                $segundaEvaluacion = ServicioTecnologicoEvaluacion::whereHas('evaluacion', function ($query) use ($servicioTecnologico) {
                    $query->where('evaluaciones.proyecto_id', $servicioTecnologico->id)->where('evaluaciones.habilitado', true);
                })->where('servicios_tecnologicos_evaluaciones.id', '!=', $evaluacion->servicioTecnologicoEvaluacion->id)->first();
                break;
            default:
                break;
        }


        $objetivosEspecificos = $evaluacion->proyecto->causasDirectas()->with('objetivoEspecifico')->get()->pluck('objetivoEspecifico')->flatten()->filter();

        $arrObjetivosEspecificos = collect([]);
        $objetivosEspecificos->map(function ($objetivoEspecifico) use ($arrObjetivosEspecificos) {
            $arrObjetivosEspecificos->push(['value' => $objetivoEspecifico->id, 'label' => $objetivoEspecifico->descripcion]);
        });

        return Inertia::render('Convocatorias/Evaluaciones/ArbolesProyecto/ArbolObjetivos', [
            'convocatoria'      => $convocatoria->only('id', 'esta_activa', 'fase_formateada', 'fase', 'tipo_convocatoria', 'min_fecha_inicio_proyectos', 'max_fecha_finalizacion_proyectos'),
            'evaluacion'        => $evaluacion,
            'segundaEvaluacion' => $segundaEvaluacion,
            'proyecto'          => $evaluacion->proyecto->only('id', 'codigo_linea_programatica', 'precio_proyecto', 'identificacion_problema', 'problema_central', 'objetivo_general', 'fecha_inicio', 'fecha_finalizacion', 'finalizado', 'cantidad_objetivos', 'allowed'),
            'efectosDirectos'   => $efectosDirectos,
            'causasDirectas'    => $causasDirectas,
            'tiposImpacto'      => $tiposImpacto,
            'resultados'        => Resultado::select('id as value', 'descripcion as label', 'objetivo_especifico_id')->whereIn(
                'objetivo_especifico_id',
                $objetivoEspecifico->map(function ($objetivoEspecifico) {
                    return $objetivoEspecifico->id;
                })
            )->get(),
            'objetivosEspecificos'  => $arrObjetivosEspecificos,
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
            case $evaluacion->idiEvaluacion()->exists():
                $evaluacion->idiEvaluacion()->update([
                    'objetivos_puntaje'      => $request->objetivos_puntaje,
                    'objetivos_comentario'   => $request->objetivos_requiere_comentario == false ? $request->objetivos_comentario : null,
                    'resultados_puntaje'     => $request->resultados_puntaje,
                    'resultados_comentario'  => $request->resultados_requiere_comentario == false ? $request->resultados_comentario : null
                ]);
                break;
            case $evaluacion->culturaInnovacionEvaluacion()->exists():
                $evaluacion->culturaInnovacionEvaluacion()->update([
                    'objetivos_puntaje'      => $request->objetivos_puntaje,
                    'objetivos_comentario'   => $request->objetivos_requiere_comentario == false ? $request->objetivos_comentario : null,
                    'resultados_puntaje'     => $request->resultados_puntaje,
                    'resultados_comentario'  => $request->resultados_requiere_comentario == false ? $request->resultados_comentario : null
                ]);
                break;
            case $evaluacion->tpEvaluacion()->exists():
                $evaluacion->tpEvaluacion()->update([
                    'arbol_objetivos_comentario'   => $request->arbol_objetivos_requiere_comentario == false ? $request->arbol_objetivos_comentario : null,
                ]);
                break;

            case $evaluacion->servicioTecnologicoEvaluacion()->exists():
                $evaluacion->servicioTecnologicoEvaluacion()->update([
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
     * updateObjetivoGeneral
     *
     * @param  mixed $request
     * @param  mixed $proyecto
     * @return void
     */
    public function updateObjetivoGeneral(Request $request, Proyecto $proyecto)
    {
        $this->authorize('modificar-proyecto-autor', $proyecto);

        /** @var \App\Models\User */
        $authUser = Auth::user();

        // if ($proyecto->lineaProgramatica->codigo == 69 && $authUser->hasRole([1, 5, 17]) == false || $proyecto->lineaProgramatica->codigo == 70 && $authUser->hasRole([1, 5, 17]) == false) {
        if ($authUser->hasRole([1]) == false && $proyecto->lineaProgramatica->codigo == 69 && $proyecto->tp->proyecto_base == false && (string)$authUser->can_by_user->search(24) === "" || $authUser->hasRole([1]) == false && $proyecto->lineaProgramatica->codigo == 70 && $proyecto->ta->proyecto_base == false && (string)$authUser->can_by_user->search(23) === "") {
            return back()->with('error', 'No se puede actualizar este recurso debido a que es información predefinida.');
        }

        $request->validate([
            'objetivo_general' => 'required|string',
        ]);

        switch ($proyecto) {
            case $proyecto->idi()->exists():
                $idi                   = $proyecto->idi;
                $idi->objetivo_general = $request->objetivo_general;

                $idi->save();
                break;
            case $proyecto->ta()->exists():
                $ta                   = $proyecto->ta;
                $ta->objetivo_general = $request->objetivo_general;

                $ta->save();
                break;
            case $proyecto->tp()->exists():
                $tp                   = $proyecto->tp;
                $tp->objetivo_general = $request->objetivo_general;

                $tp->save();
                break;
            case $proyecto->culturaInnovacion()->exists():
                $culturaInnovacion                   = $proyecto->culturaInnovacion;
                $culturaInnovacion->objetivo_general = $request->objetivo_general;

                $culturaInnovacion->save();
                break;
            case $proyecto->servicioTecnologico()->exists():
                $servicioTecnologico                   = $proyecto->servicioTecnologico;
                $servicioTecnologico->objetivo_general = $request->objetivo_general;

                $servicioTecnologico->save();
                break;
            default:
                break;
        }

        return back()->with('success', 'El recurso se ha guardado correctamente.');
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
        $authUser = Auth::user();

        if ($authUser->hasRole([1]) == false && $proyecto->lineaProgramatica->codigo == 69 && $proyecto->tp->proyecto_base == false && (string)$authUser->can_by_user->search(24) === "" || $authUser->hasRole([1]) == false && $proyecto->lineaProgramatica->codigo == 70 && $proyecto->ta->proyecto_base == false && (string)$authUser->can_by_user->search(23) === "") {
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
        $authUser = Auth::user();

        // if ($proyecto->lineaProgramatica->codigo == 69 && $authUser->hasRole([1, 5, 17]) == false || $proyecto->lineaProgramatica->codigo == 70 && $authUser->hasRole([1, 5, 17]) == false) {
        if ($authUser->hasRole([1]) == false && $proyecto->lineaProgramatica->codigo == 69 && $proyecto->tp->proyecto_base == false && (string)$authUser->can_by_user->search(24) === "" || $authUser->hasRole([1]) == false && $proyecto->lineaProgramatica->codigo == 70 && $proyecto->ta->proyecto_base == false && (string)$authUser->can_by_user->search(23) === "") {
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
        $authUser = Auth::user();

        if ($authUser->hasRole([1]) == false && $proyecto->lineaProgramatica->codigo == 69 && $proyecto->tp->proyecto_base == false && (string)$authUser->can_by_user->search(24) === "" || $authUser->hasRole([1]) == false && $proyecto->lineaProgramatica->codigo == 70 && $proyecto->ta->proyecto_base == false && (string)$authUser->can_by_user->search(23) === "") {
            return back()->with('error', 'No se puede actualizar este recurso debido a que es información predefinida.');
        }

        $resultado->fill($request->validated());

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
        $authUser = Auth::user();

        // if ($proyecto->lineaProgramatica->codigo == 69 && $authUser->hasRole([1, 5, 17]) == false || $proyecto->lineaProgramatica->codigo == 70 && $authUser->hasRole([1, 5, 17]) == false) {
        if ($authUser->hasRole([1]) == false && $proyecto->lineaProgramatica->codigo == 69 && $proyecto->tp->proyecto_base == false && (string)$authUser->can_by_user->search(24) === "" || $authUser->hasRole([1]) == false && $proyecto->lineaProgramatica->codigo == 70 && $proyecto->ta->proyecto_base == false && (string)$authUser->can_by_user->search(23) === "") {
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
     * @param  mixed $objetivoEspecifico
     * @return void
     */
    public function updateObjetivoEspecifico(ObjetivoEspecificoRequest $request, Proyecto $proyecto, ObjetivoEspecifico $objetivoEspecifico)
    {
        $this->authorize('modificar-proyecto-autor', $proyecto);

        /** @var \App\Models\User */
        $authUser = Auth::user();

        // if ($proyecto->lineaProgramatica->codigo == 69 && $authUser->hasRole([1, 5, 17]) == false || $proyecto->lineaProgramatica->codigo == 70 && $authUser->hasRole([1, 5, 17]) == false) {
        if ($authUser->hasRole([1]) == false && $proyecto->lineaProgramatica->codigo == 69 && $proyecto->tp->proyecto_base == false && (string)$authUser->can_by_user->search(24) === "" || $authUser->hasRole([1]) == false && $proyecto->lineaProgramatica->codigo == 70 && $proyecto->ta->proyecto_base == false && (string)$authUser->can_by_user->search(23) === "") {
            return back()->with('error', 'No se puede actualizar este recurso debido a que es información predefinida.');
        }

        $objetivoEspecifico->fill($request->validated());

        if ($objetivoEspecifico->save()) {
            return back()->with('success', 'El recurso se ha guardado correctamente.');
        }

        return back()->with('error', 'Hubo un error mientras se actualizaba el objetivo específico. Vuelva a intentar.');
    }

    /**
     * destroyObjetivoEspecifico
     *
     * @param  mixed $request
     * @param  mixed $proyecto
     * @param  mixed $objetivoEspecifico
     * @return void
     */
    public function destroyObjetivoEspecifico(Proyecto $proyecto, ObjetivoEspecifico $objetivoEspecifico)
    {
        $this->authorize('modificar-proyecto-autor', $proyecto);

        /** @var \App\Models\User */
        $authUser = Auth::user();

        // if ($proyecto->lineaProgramatica->codigo == 69 && $authUser->hasRole([1, 5, 17]) == false || $proyecto->lineaProgramatica->codigo == 70 && $authUser->hasRole([1, 5, 17]) == false) {
        if ($authUser->hasRole([1]) == false && $proyecto->lineaProgramatica->codigo == 69 && $proyecto->tp->proyecto_base == false && (string)$authUser->can_by_user->search(24) === "" || $authUser->hasRole([1]) == false && $proyecto->lineaProgramatica->codigo == 70 && $proyecto->ta->proyecto_base == false && (string)$authUser->can_by_user->search(23) === "") {
            return back()->with('error', 'No se puede eliminar este recurso debido a que es información predefinida.');
        }

        $objetivoEspecifico->causaDirecta()->delete();
        $objetivoEspecifico->delete();

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
        $authUser = Auth::user();

        if ($authUser->hasRole([1]) == false && $proyecto->lineaProgramatica->codigo == 69 && $proyecto->tp->proyecto_base == false && (string)$authUser->can_by_user->search(24) === "" || $authUser->hasRole([1]) == false && $proyecto->lineaProgramatica->codigo == 70 && $proyecto->ta->proyecto_base == false && (string)$authUser->can_by_user->search(23) === "") {
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
        $authUser = Auth::user();

        // if ($proyecto->lineaProgramatica->codigo == 69 && $authUser->hasRole([1, 5, 17]) == false || $proyecto->lineaProgramatica->codigo == 70 && $authUser->hasRole([1, 5, 17]) == false) {
        if ($authUser->hasRole([1]) == false && $proyecto->lineaProgramatica->codigo == 69 && $proyecto->tp->proyecto_base == false && (string)$authUser->can_by_user->search(24) === "" || $authUser->hasRole([1]) == false && $proyecto->lineaProgramatica->codigo == 70 && $proyecto->ta->proyecto_base == false && (string)$authUser->can_by_user->search(23) === "") {
            return back()->with('error', 'No se puede eliminar este recurso debido a que es información predefinida.');
        }

        $actividad->causaIndirecta()->delete();
        $actividad->delete();

        return back()->with('success', 'El recurso se ha eliminado correctamente.');
    }
}
