<?php

namespace App\Http\Controllers;

use App\Helpers\SelectHelper;
use App\Models\ServicioTecnologico;
use App\Http\Controllers\Controller;
use App\Http\Requests\ServicioTecnologicoLongColumnRequest;
use App\Http\Requests\ServicioTecnologicoRequest;
use App\Models\Convocatoria;
use App\Models\Proyecto;
use App\Models\RolSennova;
use App\Models\TipoProyectoSt;
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
            'filters'               => request()->all('search', 'estructuracion_proyectos'),
            'serviciosTecnologicos' => ServicioTecnologico::getProyectosPorRol($convocatoria)->appends(['search' => request()->search, 'estructuracion_proyectos' => request()->estructuracion_proyectos]),
            'allowedToCreate'       => Gate::inspect('formular-proyecto', [10, $convocatoria])->allowed()
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
        $authUser = Auth::user();

        if ($authUser->hasRole(13)) {
            $tipoProyectoSt = SelectHelper::tiposProyectosSt()->where('regional_id', $authUser->centroFormacion->regional_id)->values()->all();
        } else {
            $tipoProyectoSt = SelectHelper::tiposProyectosSt();
        }

        return Inertia::render('Convocatorias/Proyectos/ProyectosLinea68/Create', [
            'convocatoria'              => $convocatoria->only('id', 'esta_activa', 'fase_formateada', 'fase', 'tipo_convocatoria', 'min_fecha_inicio_proyectos_linea_68', 'max_fecha_finalizacion_proyectos_linea_68', 'fecha_maxima_st'),
            'sectoresProductivos'       => collect(json_decode(Storage::get('json/sectores-productivos.json'), true)),
            'tiposProyectoSt'           => $tipoProyectoSt,
            'estadosSistemaGestion'     => SelectHelper::estadosSistemaGestion(),
            'rolesSennova'              => RolSennova::select('id as value', 'nombre as label')->orderBy('nombre', 'ASC')->get(),
            'allowedToCreate'           => Gate::inspect('formular-proyecto', [10, $convocatoria])->allowed()
        ]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(ServicioTecnologicoRequest $request, Convocatoria $convocatoria)
    {
        $this->authorize('formular-proyecto', [10, $convocatoria]);

        $tipoProyectoSt = TipoProyectoSt::find($request->tipo_proyecto_st_id);

        $proyecto = new Proyecto();
        $proyecto->centroFormacion()->associate($tipoProyectoSt->centro_formacion_id);
        $proyecto->lineaProgramatica()->associate(10);
        $proyecto->convocatoria()->associate($convocatoria);
        $proyecto->save();

        $servicioTecnologico = new ServicioTecnologico();
        $servicioTecnologico->titulo                                = $request->titulo;
        $servicioTecnologico->fecha_inicio                          = $request->fecha_inicio;
        $servicioTecnologico->fecha_finalizacion                    = $request->fecha_finalizacion;
        $servicioTecnologico->max_meses_ejecucion                   = $request->max_meses_ejecucion;
        $servicioTecnologico->sector_productivo                     = $request->sector_productivo;
        $servicioTecnologico->nombre_area_tecnica                   = $request->nombre_area_tecnica;
        $servicioTecnologico->resumen                               = '';
        $servicioTecnologico->antecedentes                          = '';
        $servicioTecnologico->objetivo_general                      = null;
        $servicioTecnologico->problema_central                      = null;
        $servicioTecnologico->justificacion_problema                = null;
        $servicioTecnologico->identificacion_problema               = null;
        $servicioTecnologico->pregunta_formulacion_problema         = '';
        $servicioTecnologico->metodologia                           = '';
        $servicioTecnologico->propuesta_sostenibilidad              = '';
        $servicioTecnologico->bibliografia                          = '';

        $servicioTecnologico->tipoProyectoSt()->associate($request->tipo_proyecto_st_id);
        $servicioTecnologico->estadoSistemaGestion()->associate($request->estado_sistema_gestion_id);

        $proyecto->servicioTecnologico()->save($servicioTecnologico);

        $proyecto->participantes()->attach(
            Auth::user()->id,
            [
                'es_formulador'     => true,
                'cantidad_meses'    => $request->max_meses_ejecucion,
                'cantidad_horas'    => 48,
                'rol_sennova'       => $request->rol_sennova,
            ]
        );

        return redirect()->route('convocatorias.servicios-tecnologicos.edit', [$convocatoria, $servicioTecnologico])->with('success', 'El recurso se ha creado correctamente. Por favor continue diligenciando la información.');
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\ServicioTecnologico  $servicioTecnologico
     * @return \Illuminate\Http\Response
     */
    public function show(Convocatoria $convocatoria, ServicioTecnologico $servicioTecnologico)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\ServicioTecnologico  $servicioTecnologico
     * @return \Illuminate\Http\Response
     */
    public function edit(Convocatoria $convocatoria, ServicioTecnologico $servicioTecnologico)
    {
        $this->authorize('visualizar-proyecto-autor', [$servicioTecnologico->proyecto]);

        /** @var \App\Models\User */
        $authUser = Auth::user();

        $servicioTecnologico->load('proyecto.evaluaciones.servicioTecnologicoEvaluacion');

        $servicioTecnologico->codigo_linea_programatica     = $servicioTecnologico->proyecto->lineaProgramatica->codigo;
        $servicioTecnologico->precio_proyecto               = $servicioTecnologico->proyecto->precioProyecto;
        $servicioTecnologico->proyecto->centroFormacion;

        $servicioTecnologico->mostrar_recomendaciones       = $servicioTecnologico->proyecto->mostrar_recomendaciones;
        $servicioTecnologico->mostrar_requiere_subsanacion  = $servicioTecnologico->proyecto->mostrar_requiere_subsanacion;

        if ($authUser->hasRole(13)) {
            $tipoProyectoSt = SelectHelper::tiposProyectosSt()->where('regional_id', $authUser->centroFormacion->regional_id)->values()->all();
        } else {
            $tipoProyectoSt = SelectHelper::tiposProyectosSt();
        }

        return Inertia::render('Convocatorias/Proyectos/ProyectosLinea68/Edit', [
            'convocatoria'                              => $convocatoria->only('id', 'esta_activa', 'fase_formateada', 'fase', 'tipo_convocatoria', 'min_fecha_inicio_proyectos_linea_68', 'max_fecha_finalizacion_proyectos_linea_68', 'fecha_maxima_st', 'mostrar_recomendaciones'),
            'proyectoLinea68'                           => $servicioTecnologico,
            'lineasProgramaticas'                       => SelectHelper::lineasProgramaticas()->where('categoria_proyecto', 3)->values()->all(),
            'estadosSistemaGestion'                     => SelectHelper::estadosSistemaGestion(),
            'programasFormacionConRegistroCalificado'   => SelectHelper::programasFormacion()->where('registro_calificado', true)->where('centro_formacion_id', $servicioTecnologico->proyecto->centro_formacion_id)->values()->all(),
            'sectoresProductivos'                       => collect(json_decode(Storage::get('json/sectores-productivos.json'), true)),
            'tiposProyectoSt'                           => $tipoProyectoSt,
            'proyectoProgramasFormacion'                => $servicioTecnologico->proyecto->programasFormacion()->selectRaw('programas_formacion.id as value, concat(programas_formacion.nombre, chr(10), \'∙ Código: \', programas_formacion.codigo) as label')->where('programas_formacion.registro_calificado', true)->get(),
            'rolesSennova'                              => RolSennova::select('id as value', 'nombre as label')->orderBy('nombre', 'ASC')->get(),
            'versiones'                                 => $servicioTecnologico->proyecto->PdfVersiones,
        ]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\ServicioTecnologico  $servicioTecnologico
     * @return \Illuminate\Http\Response
     */
    public function update(ServicioTecnologicoRequest $request, Convocatoria $convocatoria, ServicioTecnologico $servicioTecnologico)
    {
        $this->authorize('modificar-proyecto-autor', [$servicioTecnologico->proyecto]);

        $servicioTecnologico->titulo                        = $request->titulo;
        $servicioTecnologico->fecha_inicio                  = $request->fecha_inicio;
        $servicioTecnologico->fecha_finalizacion            = $request->fecha_finalizacion;
        $servicioTecnologico->max_meses_ejecucion           = $request->max_meses_ejecucion;
        $servicioTecnologico->pregunta_formulacion_problema = $request->pregunta_formulacion_problema;
        $servicioTecnologico->resumen                       = $request->resumen;
        $servicioTecnologico->antecedentes                  = $request->antecedentes;
        $servicioTecnologico->identificacion_problema       = $request->identificacion_problema;
        $servicioTecnologico->justificacion_problema        = $request->justificacion_problema;
        $servicioTecnologico->bibliografia                  = $request->bibliografia;
        $servicioTecnologico->zona_influencia               = $request->zona_influencia;
        $servicioTecnologico->nombre_area_tecnica           = $request->nombre_area_tecnica;

        $servicioTecnologico->proyecto->programasFormacion()->sync($request->programas_formacion);

        $servicioTecnologico->save();

        return back()->with('success', 'El recurso se ha actualizado correctamente.');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\ServicioTecnologico  $servicioTecnologico
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request, Convocatoria $convocatoria, ServicioTecnologico $servicioTecnologico)
    {
        $this->authorize('eliminar-proyecto-autor', [$servicioTecnologico->proyecto]);

        if (!Hash::check($request->password, Auth::user()->password)) {
            return back()
                ->withErrors(['password' => __('The password is incorrect.')]);
        }

        $servicioTecnologico->proyecto()->delete();

        return redirect()->route('convocatorias.servicios-tecnologicos.index', [$convocatoria])->with('success', 'El recurso se ha eliminado correctamente.');
    }

    public function updateLongColumn(ServicioTecnologicoLongColumnRequest $request, Convocatoria $convocatoria, ServicioTecnologico $servicioTecnologico, $column)
    {
        $this->authorize('modificar-proyecto-autor', [$servicioTecnologico->proyecto]);

        $servicioTecnologico->update($request->only($column));

        return back();
    }

    /**
     * updateEspecificacionesInfraestructura
     *
     * @param  mixed $request
     * @param  mixed $convocatoria
     * @param  mixed $servicioTecnologico
     * @return void
     */
    public function updateEspecificacionesInfraestructura(Request $request, Convocatoria $convocatoria, ServicioTecnologico $servicioTecnologico)
    {
        $this->authorize('modificar-proyecto-autor', [$servicioTecnologico->proyecto]);

        $request->validate([
            'especificaciones_area'     => 'required|string|max:40000',
            'infraestructura_adecuada'  => 'required|boolean',
            'video'                     => 'nullable|string|url',
        ]);

        $servicioTecnologico->update([
            'especificaciones_area'     => $request->especificaciones_area,
            'infraestructura_adecuada'  => $request->infraestructura_adecuada,
            'video'                     => $request->video
        ]);

        return back()->with('success', 'El recurso se ha guardado correctamente.');
    }
}
