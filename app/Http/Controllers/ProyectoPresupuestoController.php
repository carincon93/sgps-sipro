<?php

namespace App\Http\Controllers;

use App\Helpers\SharepointHelper;
use App\Helpers\SelectHelper;
use App\Http\Requests\ProyectoPresupuestoRequest;
use App\Http\Requests\TaTpViaticosMunicipioRequest;
use App\Models\Convocatoria;
use App\Models\SegundoGrupoPresupuestal;
use App\Models\Proyecto;
use App\Models\ProyectoPresupuesto;
use App\Models\SoftwareInfo;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use App\Models\Evaluacion\Evaluacion;
use App\Models\Evaluacion\ProyectoPresupuestoEvaluacion;
use App\Models\ServicioEdicionInfo;
use App\Models\TaTpViaticosMunicipio;
use Inertia\Inertia;

class ProyectoPresupuestoController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Convocatoria $convocatoria, Proyecto $proyecto)
    {
        $this->authorize('visualizar-proyecto-autor', $proyecto);

        $proyecto->codigo_linea_programatica = $proyecto->lineaProgramatica->codigo;

        return Inertia::render('Convocatorias/Proyectos/ProyectoPresupuesto/Index', [
            'convocatoria'              => $convocatoria->only('id', 'esta_activa', 'fase_formateada', 'fase', 'tipo_convocatoria', 'mostrar_recomendaciones', 'campos_convocatoria'),
            'proyecto'                  => $proyecto->only('id', 'codigo_linea_programatica', 'precio_proyecto', 'modificable', 'codigo', 'diff_meses', 'total_proyecto_presupuesto', 'total_maquinaria_industrial', 'total_servicios_especiales_construccion', 'total_viaticos', 'total_mantenimiento_maquinaria', 'en_subsanacion', 'mostrar_recomendaciones', 'PdfVersiones', 'all_files', 'allowed'),
            'rubrosPresupuestales'      => ProyectoPresupuesto::select('proyecto_presupuesto.*')->where('proyecto_presupuesto.proyecto_id', $proyecto->id)
                                            ->filterProyectoPresupuesto(request()->only('search', 'presupuestos'))
                                            ->with('convocatoriaPresupuesto.presupuestoSennova.usoPresupuestal:id,descripcion,codigo', 'proyectoPresupuestosEvaluaciones.evaluacion', 'softwareInfo', 'servicioEdicionInfo', 'taTpViaticosMunicipios', 'convocatoriaPresupuesto.presupuestoSennova.tercerGrupoPresupuestal:id,nombre', 'convocatoriaPresupuesto.presupuestoSennova.segundoGrupoPresupuestal:id,nombre,codigo', 'convocatoriaPresupuesto.presupuestoSennova.usoPresupuestal:id,descripcion')
                                            ->orderBy('proyecto_presupuesto.id')
                                            ->paginate()
                                            ->appends(['search' => request()->search, 'presupuestos' => request()->presupuestos]),
            'segundoGrupoPresupuestal'  => SelectHelper::segundoGrupoPresupuestal($convocatoria->id, $proyecto->lineaProgramatica->id),
            'tercerGrupoPresupuestal'   => SelectHelper::tercerGrupoPresupuestal($convocatoria->id, $proyecto->lineaProgramatica->id),
            'usosPresupuestales'        => SelectHelper::usosPresupuestales($convocatoria->id, $proyecto->lineaProgramatica->id),
            'municipios'                => SelectHelper::municipios(),
            'tiposLicencia'             => json_decode(Storage::get('json/tipos-licencia-software.json'), true),
            'opcionesServiciosEdicion'  => json_decode(Storage::get('json/opciones-servicios-edicion.json'), true),
            'tiposSoftware'             => json_decode(Storage::get('json/tipos-software.json'), true),
            'conceptosViaticos'         => json_decode(Storage::get('json/conceptos-viaticos.json'), true),
            'distanciasMunicipios'      => json_decode(Storage::get('json/distancia-municipios.json'), true),
            'frecuenciasSemanales'      => json_decode(Storage::get('json/frecuencias-semanales-visita.json'), true),
            'proyectoRolesSennova'      => $proyecto->proyectoRolesSennova()->selectRaw("proyecto_rol_sennova.id as value, convocatoria_rol_sennova.perfil, convocatoria_rol_sennova.mensaje,
                                            CASE nivel_academico
                                                WHEN '7' THEN   concat(roles_sennova.nombre, chr(10), '∙ ', 'Nivel académico: Ninguno', chr(10), '∙ ', convocatoria_rol_sennova.experiencia, chr(10), '∙ Asignación mensual: ', convocatoria_rol_sennova.asignacion_mensual)
                                                WHEN '1' THEN   concat(roles_sennova.nombre, chr(10), '∙ ', 'Nivel académico: Técnico', chr(10), '∙ ', convocatoria_rol_sennova.experiencia, chr(10), '∙ Asignación mensual: ', convocatoria_rol_sennova.asignacion_mensual)
                                                WHEN '2' THEN   concat(roles_sennova.nombre, chr(10), '∙ ', 'Nivel académico: Tecnólogo', chr(10), '∙ ', convocatoria_rol_sennova.experiencia, chr(10), '∙ Asignación mensual: ', convocatoria_rol_sennova.asignacion_mensual)
                                                WHEN '3' THEN   concat(roles_sennova.nombre, chr(10), '∙ ', 'Nivel académico: Pregrado', chr(10), '∙ ', convocatoria_rol_sennova.experiencia, chr(10), '∙ Asignación mensual: ', convocatoria_rol_sennova.asignacion_mensual)
                                                WHEN '4' THEN   concat(roles_sennova.nombre, chr(10), '∙ ', 'Nivel académico: Especalización', chr(10), '∙ ', convocatoria_rol_sennova.experiencia, chr(10), '∙ Asignación mensual: ', convocatoria_rol_sennova.asignacion_mensual)
                                                WHEN '5' THEN   concat(roles_sennova.nombre, chr(10), '∙ ', 'Nivel académico: Maestría', chr(10), '∙ ', convocatoria_rol_sennova.experiencia, chr(10), '∙ Asignación mensual: ', convocatoria_rol_sennova.asignacion_mensual)
                                                WHEN '6' THEN   concat(roles_sennova.nombre, chr(10), '∙ ', 'Nivel académico: Doctorado', chr(10), '∙ ', convocatoria_rol_sennova.experiencia, chr(10), '∙ Asignación mensual: ', convocatoria_rol_sennova.asignacion_mensual)
                                                WHEN '8' THEN   concat(roles_sennova.nombre, chr(10), '∙ ', 'Nivel académico: Técnico con especialización', chr(10), '∙ ', convocatoria_rol_sennova.experiencia, chr(10), '∙ Asignación mensual: ', convocatoria_rol_sennova.asignacion_mensual)
                                                WHEN '9' THEN   concat(roles_sennova.nombre, chr(10), '∙ ', 'Nivel académico: Tecnólogo con especialización', chr(10), '∙ ', convocatoria_rol_sennova.experiencia, chr(10), '∙ Asignación mensual: ', convocatoria_rol_sennova.asignacion_mensual)
                                            END as label")
                                            ->join('convocatoria_rol_sennova', 'proyecto_rol_sennova.convocatoria_rol_sennova_id', 'convocatoria_rol_sennova.id')
                                            ->join('roles_sennova', 'convocatoria_rol_sennova.rol_sennova_id', 'roles_sennova.id')
                                            ->get()
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
    public function store(ProyectoPresupuestoRequest $request, Convocatoria $convocatoria, Proyecto $proyecto)
    {
        $this->authorize('modificar-proyecto-autor', $proyecto);

        $request->merge(['proyecto_id' => $proyecto->id]);
        $presupuesto = ProyectoPresupuesto::create($request->all());

        $presupuesto->convocatoriaProyectoRubrosPresupuestales()->sync($request->convocatoria_presupuesto_id);

        if ($request->codigo_uso_presupuestal == '2010100600203101') {
            $request->validate([
                'tipo_licencia'             => 'required|integer',
                'tipo_licencia'             => 'required|integer',
                'tipo_software'             => 'required|integer',
                'fecha_inicio'              => 'required|date|date_format:Y-m-d|before:fecha_finalizacion',
                'fecha_finalizacion'        => 'required|date|date_format:Y-m-d|after:fecha_inicio',
            ]);

            $softwareInfo = new SoftwareInfo();
            $softwareInfo->tipo_licencia        = $request->tipo_licencia;
            $softwareInfo->tipo_software        = $request->tipo_software;
            $softwareInfo->fecha_inicio         = $request->fecha_inicio;
            $softwareInfo->fecha_finalizacion   = $request->fecha_finalizacion;

            $presupuesto->softwareInfo()->save($softwareInfo);
        } else if ($request->codigo_uso_presupuestal == '2020200800901') {
            $servicioEdicionInfo = new ServicioEdicionInfo();
            $servicioEdicionInfo->info = $request->servicio_edicion_info;

            $presupuesto->servicioEdicionInfo()->save($servicioEdicionInfo);
        }

        return back()->with('success', 'El recurso se ha creado correctamente.');
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\ProyectoPresupuesto  $presupuesto
     * @return \Illuminate\Http\Response
     */
    public function show(Convocatoria $convocatoria, Proyecto $proyecto, ProyectoPresupuesto $presupuesto)
    {
        $this->authorize('visualizar-proyecto-autor', $proyecto);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\ProyectoPresupuesto  $presupuesto
     * @return \Illuminate\Http\Response
     */
    public function edit(Convocatoria $convocatoria, Proyecto $proyecto, ProyectoPresupuesto $presupuesto)
    {
        $this->authorize('visualizar-proyecto-autor', $proyecto);

        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\ProyectoPresupuesto  $presupuesto
     * @return \Illuminate\Http\Response
     */
    public function update(ProyectoPresupuestoRequest $request, Convocatoria $convocatoria, Proyecto $proyecto, ProyectoPresupuesto $presupuesto)
    {
        $this->authorize('modificar-proyecto-autor', $proyecto);

        if ($request->requiere_estudio_mercado == false) {
            foreach ($presupuesto->soportesEstudioMercado() as $soporteEstudioMercado) {
                $soporteEstudioMercado->delete();
            }
        }

        $presupuesto->fill($request->all());
        $presupuesto->save();

        $presupuesto->convocatoriaProyectoRubrosPresupuestales()->sync($request->convocatoria_presupuesto_id);

        $softwareInfo = SoftwareInfo::where('proyecto_presupuesto_id', $presupuesto->id)->first();
        if ($request->codigo_uso_presupuestal == '2010100600203101') {
            $request->validate([
                'tipo_licencia'             => 'required|integer',
                'tipo_licencia'             => 'required|integer',
                'tipo_software'             => 'required|integer',
                'fecha_inicio'              => 'required|date|date_format:Y-m-d|before:fecha_finalizacion',
                'fecha_finalizacion'        => 'required|date|date_format:Y-m-d|after:fecha_inicio',
            ]);

            $presupuesto->softwareInfo()->updateOrCreate(
                ['id' => $softwareInfo ? $softwareInfo->id : null],
                [
                    'tipo_licencia'      => $request->tipo_licencia,
                    'tipo_software'      => $request->tipo_software,
                    'fecha_inicio'       => $request->fecha_inicio,
                    'fecha_finalizacion' => $request->fecha_finalizacion
                ]
            );
        } else {
            $presupuesto->softwareInfo()->delete();
        }

        $servicioEdicionInfo = ServicioEdicionInfo::where('proyecto_presupuesto_id', $presupuesto->id)->first();
        if ($request->codigo_uso_presupuestal == '2020200800901') {
            $presupuesto->servicioEdicionInfo()->updateOrCreate(
                ['id' => $servicioEdicionInfo ? $servicioEdicionInfo->id : null],
                [
                    'info' => $request->servicio_edicion_info,
                ]
            );
        } else {
            $presupuesto->servicioEdicionInfo()->delete();
        }

        return back()->with('success', 'El recurso se ha actualizado correctamente.');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\ProyectoPresupuesto  $presupuesto
     * @return \Illuminate\Http\Response
     */
    public function destroy(Convocatoria $convocatoria, Proyecto $proyecto, ProyectoPresupuesto $presupuesto)
    {
        $this->authorize('modificar-proyecto-autor', $proyecto);

        $presupuesto->delete();

        return redirect()->route('convocatorias.proyectos.presupuesto.index', [$convocatoria, $proyecto])->with('success', 'El recurso se ha eliminado correctamente.');
    }

    public function storeEstudioMercado(Request $request, Convocatoria $convocatoria, Proyecto $proyecto, ProyectoPresupuesto $presupuesto)
    {
        $request->validate([
            'valor_total'             => 'nullable|min:0|numeric',
            'formato_estudio_mercado' => 'nullable|file|max:10000000|mimetypes:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        ]);

        if ($request->hasFile('formato_estudio_mercado')) {
            $this->saveFilesSharepoint($request->formato_estudio_mercado, mb_strtoupper($convocatoria->descripcion) . ' ' . $convocatoria->year, $presupuesto, 'formato_estudio_mercado');
        }

        $presupuesto->update(['valor_total' => $request->valor_total]);

        return back()->with('success', 'El recurso se ha actualizado correctamente.');
    }

    public function saveFilesSharepoint($tmpFile, $modulo, $modelo, $campoBd)
    {
        $presupuesto = $modelo;
        $proyecto    = Proyecto::find($presupuesto->proyecto_id);

        $estudioMercadoSharePoint = $proyecto->centroFormacion->nombre_carpeta_sharepoint . '/' . $proyecto->lineaProgramatica->codigo . '/' . $proyecto->codigo . '/ESTUDIOS MERCADO';

        $sharePointPath = "$modulo/$estudioMercadoSharePoint";

        SharepointHelper::saveFilesSharepoint($tmpFile, $modelo, $sharePointPath, $campoBd);
    }

    public function downloadServerFile(Request $request, Convocatoria $convocatoria, Proyecto $proyecto, ProyectoPresupuesto $presupuesto)
    {
        SharepointHelper::downloadServerFile($presupuesto, $request->formato);
    }

    public function downloadFileSharepoint(Convocatoria $convocatoria, Proyecto $proyecto, ProyectoPresupuesto $presupuesto, $tipoArchivo)
    {
        $sharePointPath = $presupuesto[$tipoArchivo];

        return SharepointHelper::downloadFile($sharePointPath);
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function proyectoPresupuestoEvaluacion(Convocatoria $convocatoria, Evaluacion $evaluacion)
    {
        $this->authorize('visualizar-evaluacion-autor', $evaluacion);

        $evaluacion->load('taEvaluacion');
        $evaluacion->load('tpEvaluacion');

        $evaluacion->proyecto->codigo_linea_programatica = $evaluacion->proyecto->lineaProgramatica->codigo;

        return Inertia::render('Convocatorias/Evaluaciones/ProyectoPresupuesto/Index', [
            'convocatoria'              => $convocatoria->only('id', 'esta_activa', 'fase_formateada', 'fase', 'tipo_convocatoria', 'year'),
            'evaluacion'                => $evaluacion,
            'proyecto'                  => $evaluacion->proyecto->only('id', 'codigo_linea_programatica', 'precio_proyecto', 'finalizado', 'codigo', 'diff_meses', 'total_proyecto_presupuesto'),
            'filters'                   => request()->all('search', 'presupuestos'),
            'proyectoPresupuesto'       => ProyectoPresupuesto::select('proyecto_presupuesto.id', 'proyecto_presupuesto.descripcion', 'proyecto_presupuesto.proyecto_id', 'proyecto_presupuesto.valor_total')->where('proyecto_id', $evaluacion->proyecto->id)->filterProyectoPresupuesto(request()->only('search', 'presupuestos'))->with('proyectoPresupuestosEvaluaciones')->orderBy('proyecto_presupuesto.id')->paginate()->appends(['search' => request()->search, 'presupuestos' => request()->presupuestos]),
            'segundoGrupoPresupuestal'  => SegundoGrupoPresupuestal::orderBy('nombre', 'ASC')->get('nombre'),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\ProyectoPresupuesto  $proyectoRolSennova
     * @return \Illuminate\Http\Response
     */
    public function evaluacionForm(Convocatoria $convocatoria, Evaluacion $evaluacion, ProyectoPresupuesto $presupuesto)
    {
        $this->authorize('visualizar-evaluacion-autor', $evaluacion);

        $presupuesto->load('actividades');
        $presupuesto->load('soportesEstudioMercado');
        $presupuesto->softwareInfo;
        $presupuesto->servicioEdicionInfo;
        $evaluacion->proyecto->lineaProgramatica;
        $proyecto = $evaluacion->proyecto;
        $presupuesto->taTpViaticosPresupuesto;

        return Inertia::render('Convocatorias/Evaluaciones/ProyectoPresupuesto/Edit', [
            'convocatoria'                  => $convocatoria->only('id', 'esta_activa', 'fase_formateada', 'fase', 'tipo_convocatoria', 'year', 'campos_convocatoria'),
            'evaluacion'                    => $evaluacion->only('id', 'iniciado', 'finalizado', 'habilitado', 'modificable', 'proyecto'),
            'proyecto'                      => $evaluacion->proyecto,
            'proyectoPresupuesto'           => $presupuesto,
            'tiposLicencia'                 => json_decode(Storage::get('json/tipos-licencia-software.json'), true),
            'opcionesServiciosEdicion'      => json_decode(Storage::get('json/opciones-servicios-edicion.json'), true),
            'tiposSoftware'                 => json_decode(Storage::get('json/tipos-software.json'), true),
            'proyectoPresupuestoEvaluacion' => ProyectoPresupuestoEvaluacion::where('evaluacion_id', $evaluacion->id)->where('proyecto_presupuesto_id', $presupuesto->id)->first(),
            'segundoGrupoPresupuestal'      => SelectHelper::segundoGrupoPresupuestal($convocatoria->id, $proyecto->lineaProgramatica->id),
            'tercerGrupoPresupuestal'       => SelectHelper::tercerGrupoPresupuestal($convocatoria->id, $proyecto->lineaProgramatica->id),
            'usosPresupuestales'            => SelectHelper::usosPresupuestales($convocatoria->id, $proyecto->lineaProgramatica->id),
            'municipios'                    => SelectHelper::municipios(),
            'conceptosViaticos'             => json_decode(Storage::get('json/conceptos-viaticos.json'), true),
            'distanciasMunicipios'          => json_decode(Storage::get('json/distancia-municipios.json'), true),
            'frecuenciasSemanales'          => json_decode(Storage::get('json/frecuencias-semanales-visita.json'), true),
            'proyectoRolesSennova'          => $proyectoRolesSennova ?? null,
            'taTpViaticosMunicipios'        => $presupuesto->taTpViaticosMunicipios()->exists() ? $presupuesto->taTpViaticosMunicipios()->with('municipio')->get() : collect([])
        ]);
    }

    public function updateEvaluacion(Request $request, Convocatoria $convocatoria, Evaluacion $evaluacion, ProyectoPresupuesto $presupuesto)
    {
        $this->authorize('modificar-evaluacion-autor', $evaluacion);

        ProyectoPresupuestoEvaluacion::updateOrCreate(
            ['evaluacion_id' => $evaluacion->id, 'proyecto_presupuesto_id' => $presupuesto->id],
            ['correcto' => $request->correcto, 'comentario' => $request->correcto == false ? $request->comentario : null]
        );

        return back()->with('success', 'El recurso se ha actualizado correctamente.');
    }

    public function updatedProyectoPresupuestoEvaluacion(Request $request, Convocatoria $convocatoria, Evaluacion $evaluacion)
    {
        $this->authorize('modificar-evaluacion-autor', $evaluacion);

        if ($evaluacion->taEvaluacion()->exists()) {
            $evaluacion->taEvaluacion()->update(
                ['proyecto_presupuesto_comentario' => $request->proyecto_presupuesto_comentario]
            );
        } else if ($evaluacion->tpEvaluacion()->exists()) {
            $evaluacion->tpEvaluacion()->update(
                ['proyecto_presupuesto_comentario' => $request->proyecto_presupuesto_comentario]
            );
        }

        foreach ($evaluacion->proyecto->proyectoPresupuesto()->get() as $proyectoPresupuesto) {
            ProyectoPresupuestoEvaluacion::updateOrCreate(
                [
                    'evaluacion_id' => $evaluacion->id, 'proyecto_presupuesto_id' => $proyectoPresupuesto->id,
                ],
                [
                    'comentario' => $request->proyecto_presupuesto_requiere_comentario == false ? $request->proyecto_presupuesto_comentario : null,
                    'correcto' => $request->proyecto_presupuesto_requiere_comentario == false ? false : true,
                ]
            );
        }

        return back()->with('success', 'El recurso se ha actualizado correctamente.');
    }

    public function municipiosAVisitar(TaTpViaticosMunicipioRequest $request, Convocatoria $convocatoria, Proyecto $proyecto, ProyectoPresupuesto $presupuesto)
    {
        $presupuesto->taTpViaticosMunicipios()->updateOrCreate(
            [
                'proyecto_presupuesto_id'  => $presupuesto->id,
                'municipio_id'            => $request->municipio_id,
                'proyecto_rol_sennova_id' => $request->proyecto_rol_sennova_id,
            ],
            [
                'actividad_a_realizar'    => $request->actividad_a_realizar,
                'distancia_municipio'     => $request->distancia_municipio,
                'frecuencia_semanal'      => $request->frecuencia_semanal,
                'numero_visitas'          => $request->numero_visitas,
            ]
        );

        return back()->with('success', 'El recurso se ha actualizado correctamente.');
    }

    public function eliminarMunicipio(Convocatoria $convocatoria, Proyecto $proyecto, ProyectoPresupuesto $presupuesto, TaTpViaticosMunicipio $taTpViaticosMunicipio)
    {
        $taTpViaticosMunicipio->delete();

        return back()->with('success', 'El recurso se ha eliminado correctamente.');
    }
}
