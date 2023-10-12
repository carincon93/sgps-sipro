<?php

namespace App\Http\Controllers;

use App\Helpers\SelectHelper;
use App\Http\Requests\ActividadRequest;
use App\Http\Requests\MetodologiaColumnRequest;
use App\Models\Convocatoria;
use App\Models\Proyecto;
use App\Models\Actividad;
use App\Models\Evaluacion\Evaluacion;
use App\Models\ProyectoPresupuesto;
use App\Models\ProyectoRolSennova;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ActividadController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Convocatoria $convocatoria, Proyecto $proyecto, Request $request)
    {
        $this->authorize('visualizar-proyecto-autor', $proyecto);

        if ($proyecto->convocatoria_id != $convocatoria->id) {
            return abort(404);
        }


        $objetivo_especifico = $proyecto->causasDirectas()->with('objetivoEspecifico')->get()->pluck('objetivoEspecifico')->flatten()->filter();

        $resultados = $proyecto->efectosDirectos()->whereHas('resultado', function ($query) {
            $query->where('descripcion', '!=', null);
        })->with('resultado')->get()->pluck('resultado')->flatten();

        $productos  = $resultados->map(function ($resultado) {
            return $resultado->productos;
        })->flatten();

        $proyecto->load('proyectoRolesSennova.proyectoRolesEvaluaciones', 'proyectoPresupuesto.proyectoPresupuestosEvaluaciones');
        // $proyecto->load('evaluaciones.evaluacionProyectoFormulario8Linea66');
        // $proyecto->load('evaluaciones.evaluacionProyectoFormulario4Linea70');

        $proyecto->municipios;
        $proyecto->municipiosAImpactar;
        $proyecto->programasFormacion;
        $proyecto->disenosCurriculares;
        $proyecto->tipoFormularioConvocatoria->lineaProgramatica;

        $proyecto->proyectoFormulario1Linea65;
        $proyecto->proyectoFormulario3Linea61;
        $proyecto->proyectoFormulario4Linea70;
        $proyecto->proyectoFormulario5Linea69;
        $proyecto->proyectoFormulario6Linea82;
        $proyecto->proyectoFormulario7Linea23;
        $proyecto->proyectoFormulario8Linea66;
        $proyecto->proyectoFormulario9Linea23;
        $proyecto->proyectoFormulario10Linea69;
        $proyecto->proyectoFormulario11Linea83;
        $proyecto->proyectoFormulario12Linea65;
        $proyecto->proyectoFormulario13Linea65;
        $proyecto->proyectoFormulario15Linea65;
        $proyecto->proyectoFormulario16Linea65;
        $proyecto->proyectoFormulario17Linea69;

        return Inertia::render('Convocatorias/Proyectos/Actividades/Index', [
            'convocatoria'              => $convocatoria->only('id', 'esta_activa', 'fase_formateada', 'fase', 'tipo_convocatoria', 'mostrar_recomendaciones', 'year'),
            'proyecto'                  => $proyecto,
            'evaluacion'                => Evaluacion::find(request()->evaluacion_id),
            'actividades'               => Actividad::whereIn(
                'objetivo_especifico_id',
                $objetivo_especifico->map(function ($objetivo_especifico) {
                    return $objetivo_especifico->id;
                })
            )->with('productos', 'proyectoPresupuesto', 'proyectoRolesSennova', 'objetivoEspecifico', 'objetivoEspecifico.resultados')->orderBy('id', 'DESC')
                ->filterActividad(request()->only('search'))->get(),
            'actividades_gantt'         =>  Actividad::whereIn(
                'objetivo_especifico_id',
                $objetivo_especifico->map(function ($objetivo_especifico) {
                    return $objetivo_especifico->id;
                })
            )->where('fecha_inicio', '<>', null)->orderBy('fecha_inicio', 'ASC')->get(),
            'programas_formacion'       => $programas_formacion ?? [],
            'modalidades'               => $modalidades ?? [],
            'niveles_formacion'         => $niveles_formacion ?? [],
            'regionales'                => SelectHelper::regionales(),
            'municipios'                => SelectHelper::municipios(),
            'disenos_curriculares'      => SelectHelper::disenoCurriculares()->where('habilitado_convocatoria', true)->values()->all(),
            'proyecto_presupuesto'      => ProyectoPresupuesto::select('proyecto_presupuesto.id as value', 'proyecto_presupuesto.descripcion as label')->where('proyecto_presupuesto.proyecto_id', $proyecto->id)->with('convocatoriaProyectoRubrosPresupuestales.rubroPresupuestal.usoPresupuestal')->get(),
            'proyecto_roles'            => ProyectoRolSennova::select('proyecto_rol_sennova.id as value', 'roles_sennova.nombre as label')
                ->join('convocatoria_rol_sennova', 'proyecto_rol_sennova.convocatoria_rol_sennova_id', 'convocatoria_rol_sennova.id')
                ->join('roles_sennova', 'convocatoria_rol_sennova.rol_sennova_id', 'roles_sennova.id')
                ->where('proyecto_rol_sennova.proyecto_id', $proyecto->id)->with('convocatoriaRolSennova.rolSennova:id,nombre')->get(),
            'productos'                 => $productos,
            'areas_cualificacion_mnc'   => json_decode(Storage::get('json/areas-cualificacion-mnc.json'), true),

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
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(ActividadRequest $request, Convocatoria $convocatoria, Proyecto $proyecto)
    {
        $this->authorize('modificar-proyecto-autor', $proyecto);

        return redirect()->route('convocatorias.proyectos.actividades.index')->with('success', 'El recurso se ha creado correctamente.');
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Actividad  $actividad
     * @return \Illuminate\Http\Response
     */
    public function show(Convocatoria $convocatoria, Proyecto $proyecto, Actividad $actividad)
    {
        $this->authorize('visualizar-proyecto-autor', $proyecto);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Actividad  $actividad
     * @return \Illuminate\Http\Response
     */
    public function edit(Convocatoria $convocatoria, Proyecto $proyecto, Actividad $actividad)
    {
        $this->authorize('visualizar-proyecto-autor', $proyecto);

        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Actividad  $actividad
     * @return \Illuminate\Http\Response
     */
    public function update(ActividadRequest $request,  Convocatoria $convocatoria, Proyecto $proyecto, Actividad $actividad)
    {
        $this->authorize('modificar-proyecto-autor', $proyecto);

        $actividad->descripcion         = $request->descripcion;
        $actividad->fecha_inicio        = $request->fecha_inicio;
        $actividad->fecha_finalizacion  = $request->fecha_finalizacion;
        $actividad->resultado()->associate($request->resultado_id);

        $actividad->save();

        $actividad->proyectoRolesSennova()->sync($request->proyecto_rol_sennova_id);

        return back()->with('success', 'El recurso se ha actualizado correctamente.');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Actividad  $actividad
     * @return \Illuminate\Http\Response
     */
    public function destroy(Convocatoria $convocatoria, Proyecto $proyecto, Actividad $actividad)
    {
        $this->authorize('modificar-proyecto-autor', $proyecto);
        $actividad->delete();

        return redirect()->route('convocatorias.proyectos.actividades.index', [$convocatoria, $proyecto])->with('success', 'El recurso se ha eliminado correctamente.');
    }

    public function linkRubrosPresupuestales(Request $request,  Convocatoria $convocatoria, Proyecto $proyecto, Actividad $actividad)
    {
        $actividad->proyectoPresupuesto()->sync($request->proyecto_presupuesto_id);

        return back()->with('success', 'Los rubros presupuestales se han asociado correctamente.');
    }

    /**
     * updateMetodologia
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Proyecto  $proyecto
     * @return \Illuminate\Http\Response
     */
    public function updateMetodologia(Request $request, Convocatoria $convocatoria, Proyecto $proyecto)
    {
        $this->authorize('modificar-proyecto-autor', $proyecto);

        $request->validate([
            'metodologia' => 'required|string|max:20000',
        ]);

        switch ($proyecto->tipo_formulario_convocatoria_id) {
            case 1:
                $proyecto->proyectoFormulario1Linea65()->update($request->only('metodologia'));
                break;
            case 3:
                $proyecto->proyectoFormulario3Linea61()->update($request->only('metodologia'));
                break;
            case 6:
                $proyecto->proyectoFormulario6Linea82()->update($request->only('metodologia'));
                break;
            case 7:
                $proyecto->proyectoFormulario7Linea23()->update($request->only('metodologia'));
                break;
            case 8:
                $proyecto->proyectoFormulario8Linea66()->update($request->only('metodologia'));
                break;
            case 9:
                $proyecto->proyectoFormulario9Linea23()->update($request->only('metodologia'));
                break;
            case 12:
                $proyecto->proyectoFormulario12Linea68()->update($request->only('metodologia'));
                break;
            case 13:
                $proyecto->proyectoFormulario13Linea65()->update($request->only('metodologia'));
                break;
            case 15:
                $proyecto->proyectoFormulario15Linea65()->update($request->only('metodologia'));
                break;
            case 16:
                $proyecto->proyectoFormulario16Linea65()->update($request->only('metodologia'));
                break;
            default:
                break;
        }
        return back()->with('success', 'El recurso se ha guardado correctamente.');
    }

    public function updateLongColumn(MetodologiaColumnRequest $request, Convocatoria $convocatoria, Proyecto $proyecto, $column)
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
                if ($column == 'municipios_impactar') {
                    $proyecto->municipiosAImpactar()->sync($request->only($column)[$column]);
                    break;
                }

                if ($column == 'municipios') {
                    $proyecto->municipios()->sync($request->only($column)[$column]);
                    break;
                }

                if ($column == 'programas_formacion_articulados') {
                    $proyecto->programasFormacion()->sync($request->only($column)[$column]);
                    break;
                }

                if ($column == 'diseno_curricular_id') {
                    $proyecto->disenosCurriculares()->sync($request->only($column)[$column]);
                    break;
                }

                $proyecto->proyectoFormulario4Linea70()->update($request->only($column));
                break;
            case 5:
                if ($column == 'talento_otros_departamentos') {
                    $proyecto->proyectoFormulario5Linea69->talentosOtrosDepartamentos()->sync($request->only($column)[$column]);
                    break;
                }

                if ($column == 'municipios') {
                    $proyecto->municipios()->sync($request->only($column)[$column]);
                    break;
                }

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
