<?php

namespace App\Http\Controllers;

use App\Helpers\SelectHelper;
use App\Http\Requests\ProyectoRolSennovaRequest;
use App\Models\Convocatoria;
use App\Models\Proyecto;
use App\Models\ProyectoRolSennova;
use Illuminate\Http\Request;
use App\Http\Traits\ProyectoRolSennovaValidationTrait;
use App\Models\Actividad;
use App\Models\Evaluacion\Evaluacion;
use App\Models\Evaluacion\ProyectoRolEvaluacion;
use App\Models\LineaTecnoacademia;
use App\Models\LineaTecnoparque;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ProyectoRolSennovaController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Convocatoria $convocatoria, Proyecto $proyecto)
    {
        $this->authorize('visualizar-proyecto-autor', $proyecto);

        if ($proyecto->proyectoFormulario4Linea70()->exists()) {
            $proyecto->cantidad_instructores_planta     = $proyecto->proyectoFormulario4Linea70->cantidad_instructores_planta;
            $proyecto->cantidad_dinamizadores_planta    = $proyecto->proyectoFormulario4Linea70->cantidad_dinamizadores_planta;
            $proyecto->cantidad_psicopedagogos_planta   = $proyecto->proyectoFormulario4Linea70->cantidad_psicopedagogos_planta;
        }

        $proyecto->tipoFormularioConvocatoria->lineaProgramatica;

        $objetivos_especificos = $proyecto->causasDirectas()->with('objetivoEspecifico')->get()->pluck('objetivoEspecifico')->flatten()->filter();

        /**
         * Si el proyecto es de la línea programática 23 se prohibe el acceso. No requiere de roles SENNOVA
         */
        if ($proyecto->tipo_formulario_convocatoria_id == 7 || $proyecto->tipo_formulario_convocatoria_id == 9 || $proyecto->tipo_formulario_convocatoria_id == 1) {
            return redirect()->route('convocatorias.proyectos.arbol-objetivos', [$convocatoria, $proyecto])->with('error', 'Esta línea programática no requiere de roles SENNOVA');
        }

        return Inertia::render('Convocatorias/Proyectos/RolesSennova/Index', [
            'convocatoria'                  => $convocatoria->only('id', 'esta_activa', 'fase_formateada', 'fase', 'tipo_convocatoria', 'year'),
            'proyecto'                      => $proyecto,
            'evaluacion'                    => Evaluacion::find(request()->evaluacion_id),
            'proyecto_roles_sennova'        => ProyectoRolSennova::where('proyecto_id', $proyecto->id)->filterProyectoRolSennova(request()->only('search'))->with('convocatoriaRolSennova.rolSennova', 'proyectoRolesEvaluaciones.evaluacion', 'actividades', 'lineasTecnoacademia', 'lineasTecnoparque')->orderBy('proyecto_rol_sennova.id')->paginate(),
            'convocatoria_roles_sennova'    => SelectHelper::convocatoriaRolesSennova($convocatoria->id, $proyecto->tipo_formulario_convocatoria_id),
            'actividades'                   => Actividad::select('id as value', 'descripcion as label')->whereIn(
                                                    'objetivo_especifico_id',
                                                    $objetivos_especificos->map(function ($objetivoEspecifico) {
                                                        return $objetivoEspecifico->id;
                                                    })
                                                )->orderBy('actividades.descripcion')->with('objetivoEspecifico')->get(),
            'niveles_academicos'            => json_decode(Storage::get('json/niveles-academicos.json'), true)
        ]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create(Convocatoria $convocatoria, Proyecto $proyecto)
    {
        $this->authorize('visualizar-proyecto-autor', $proyecto);

        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(ProyectoRolSennovaRequest $request, Convocatoria $convocatoria, Proyecto $proyecto)
    {
        $this->authorize('modificar-proyecto-autor', $proyecto);

        /**
         * Todas las líneas
         */
        if (ProyectoRolSennovaValidationTrait::monitoriaValidation($request->convocatoria_rol_sennova_id, $proyecto, null, $request->numero_meses, $request->numero_roles)) {
            return back()->with('error', 'Ha superado el máximo de de 4 monitorías');
        }

        if (ProyectoRolSennovaValidationTrait::contratoAprendizajeValidation($request->convocatoria_rol_sennova_id, $proyecto, null, $request->numero_meses, $request->numero_roles)) {
            return back()->with('error', 'Máximo 1 contrato de aprendizaje por 6 meses');
        }

        $request->merge(['proyecto_id' => $proyecto->id]);
        $proyecto_rol_sennova = ProyectoRolSennova::create($request->all());
        $proyecto_rol_sennova->actividades()->sync($request->actividad_id);

        // if ($proyecto->lineaProgramatica->codigo == 70) {
        //     $request->validate(
        //         [
        //             'linea_tecnologica_id*' => 'nullable|min:0|max:2147483647|exists:lineas_tecnoacademia,id'
        //         ]
        //     );
        //     $proyecto_rol_sennova->lineasTecnoacademia()->sync($request->linea_tecnologica_id);
        // } else if ($proyecto->lineaProgramatica->codigo == 69) {
        //     $request->validate(
        //         [
        //             'linea_tecnologica_id*' => 'nullable|min:0|max:2147483647|exists:lineas_tecnoparque,id'
        //         ]
        //     );
        //     $proyecto_rol_sennova->lineasTecnoparque()->sync($request->linea_tecnologica_id);
        // }

        return redirect()->route('convocatorias.proyectos.proyecto-rol-sennova.index', [$convocatoria, $proyecto])->with('success', 'El recurso se ha creado correctamente.');
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\ProyectoRolSennova  $proyecto_rol_sennova
     * @return \Illuminate\Http\Response
     */
    public function show(Convocatoria $convocatoria, Proyecto $proyecto, ProyectoRolSennova $proyecto_rol_sennova)
    {
        $this->authorize('visualizar-proyecto-autor', $proyecto);

        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\ProyectoRolSennova  $proyecto_rol_sennova
     * @return \Illuminate\Http\Response
     */
    public function edit(Convocatoria $convocatoria, Proyecto $proyecto, ProyectoRolSennova $proyecto_rol_sennova)
    {
        $this->authorize('visualizar-proyecto-autor', $proyecto);

        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\ProyectoRolSennova  $proyecto_rol_sennova
     * @return \Illuminate\Http\Response
     */
    public function update(ProyectoRolSennovaRequest $request, Convocatoria $convocatoria, Proyecto $proyecto, ProyectoRolSennova $proyecto_rol_sennova)
    {
        $this->authorize('modificar-proyecto-autor', $proyecto);

        /**
         * Todas las líneas
         */
        if (ProyectoRolSennovaValidationTrait::monitoriaValidation($request->convocatoria_rol_sennova_id, $proyecto, $proyecto_rol_sennova, $request->numero_meses, $request->numero_roles)) {
            return back()->with('error', 'Ha superado el máximo de 4 monitorias');
        }

        if (ProyectoRolSennovaValidationTrait::contratoAprendizajeValidation($request->convocatoria_rol_sennova_id, $proyecto, $proyecto_rol_sennova, $request->numero_meses, $request->numero_roles)) {
            return back()->with('error', 'Máximo 1 contrato de aprendizaje por 6 meses');
        }

        $proyecto_rol_sennova->update($request->validated());
        $proyecto_rol_sennova->actividades()->sync($request->actividad_id);

        // if ($proyecto->lineaProgramatica->codigo == 70) {
        //     $request->validate(
        //         [
        //             'linea_tecnologica_id*' => 'nullable|min:0|max:2147483647|exists:lineas_tecnoacademia,id'
        //         ]
        //     );
        //     $proyecto_rol_sennova->lineasTecnoacademia()->sync($request->linea_tecnologica_id);
        // } else if ($proyecto->lineaProgramatica->codigo == 69) {
        //     $request->validate(
        //         [
        //             'linea_tecnologica_id*' => 'nullable|min:0|max:2147483647|exists:lineas_tecnoparque,id'
        //         ]
        //     );
        //     $proyecto_rol_sennova->lineasTecnoparque()->sync($request->linea_tecnologica_id);
        // }

        return back()->with('success', 'El recurso se ha actualizado correctamente.');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\ProyectoRolSennova  $proyecto_rol_sennova
     * @return \Illuminate\Http\Response
     */
    public function destroy(Convocatoria $convocatoria, Proyecto $proyecto, ProyectoRolSennova $proyecto_rol_sennova)
    {
        $this->authorize('modificar-proyecto-autor', $proyecto);

        $proyecto_rol_sennova->delete();

        return redirect()->route('convocatorias.proyectos.proyecto-rol-sennova.index', [$convocatoria, $proyecto])->with('success', 'El recurso se ha eliminado correctamente.');
    }

    public function updateEvaluacion(Request $request, Convocatoria $convocatoria, Evaluacion $evaluacion, ProyectoRolSennova $proyecto_rol_sennova)
    {
        $this->authorize('modificar-evaluacion-autor', $evaluacion);

        ProyectoRolEvaluacion::updateOrCreate(
            ['evaluacion_id' => $evaluacion->id, 'proyecto_rol_sennova_id' => $proyecto_rol_sennova->id],
            ['correcto' => $request->correcto, 'comentario' => $request->correcto == false ? $request->comentario : null]
        );

        return back()->with('success', 'El recurso se ha actualizado correctamente.');
    }
}
