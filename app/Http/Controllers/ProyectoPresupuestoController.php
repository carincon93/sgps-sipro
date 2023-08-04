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

        dd(SelectHelper::segundoGrupoPresupuestal($convocatoria->id, $proyecto->lineaProgramatica->id));

        return Inertia::render('Convocatorias/Proyectos/ProyectoPresupuesto/Index', [
            'convocatoria'                      =>  $convocatoria->only('id', 'esta_activa', 'fase_formateada', 'fase', 'tipo_convocatoria', 'mostrar_recomendaciones', 'campos_convocatoria'),
            'proyecto'                          =>  $proyecto->only('id', 'codigo_linea_programatica', 'precio_proyecto', 'modificable', 'codigo', 'diff_meses', 'total_proyecto_presupuesto', 'en_subsanacion', 'mostrar_recomendaciones', 'PdfVersiones', 'all_files', 'allowed'),
            'evaluacion'                        =>  Evaluacion::find(request()->evaluacion_id),
            'rubros_presupuestales'             =>  ProyectoPresupuesto::select('proyecto_presupuesto.*')
                                                        ->where('proyecto_id', $proyecto->id)
                                                        ->filterProyectoPresupuesto(request()->only('search', 'presupuestos'))
                                                        ->with('convocatoriaProyectoRubrosPresupuestales.presupuestoSennova.usoPresupuestal', 'convocatoriaProyectoRubrosPresupuestales.presupuestoSennova.segundoGrupoPresupuestal', 'proyectoPresupuestosEvaluaciones.evaluacion', 'softwareInfo', 'servicioEdicionInfo')
                                                        ->orderBy('proyecto_presupuesto.id')
                                                        ->paginate()
                                                        ->appends(['search' => request()->search, 'presupuestos' => request()->presupuestos]),
            'segundo_grupo_presupuestal'        =>  SelectHelper::segundoGrupoPresupuestal($convocatoria->id, $proyecto->lineaProgramatica->id),
            'tercer_grupo_presupuestal'         =>  SelectHelper::tercerGrupoPresupuestal($convocatoria->id, $proyecto->lineaProgramatica->id),
            'usos_presupuestales'               =>  SelectHelper::usosPresupuestales($convocatoria->id, $proyecto->lineaProgramatica->id),
            'tipos_licencia'                    =>  json_decode(Storage::get('json/tipos-licencia-software.json'), true),
            'opciones_servicios_edicion'        =>  json_decode(Storage::get('json/opciones-servicios-edicion.json'), true),
            'tipos_software'                    =>  json_decode(Storage::get('json/tipos-software.json'), true),
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

        if ($request->tipo_software) {
            $request->validate([
                'tipo_licencia'             => 'required|integer',
                'tipo_licencia'             => 'required|integer',
                'tipo_software'             => 'required|integer',
                'fecha_inicio'              => 'required|date|date_format:Y-m-d|before:fecha_finalizacion',
                'fecha_finalizacion'        => 'required|date|date_format:Y-m-d|after:fecha_inicio',
            ]);

            $software_info = new SoftwareInfo();
            $software_info->tipo_licencia        = $request->tipo_licencia;
            $software_info->tipo_software        = $request->tipo_software;
            $software_info->fecha_inicio         = $request->fecha_inicio;
            $software_info->fecha_finalizacion   = $request->fecha_finalizacion;

            $presupuesto->softwareInfo()->save($software_info);
        } else if ($request->servicio_edicion_info) {
            $servicio_edicion_info = new ServicioEdicionInfo();
            $servicio_edicion_info->info = $request->servicio_edicion_info;

            $presupuesto->servicioEdicionInfo()->save($servicio_edicion_info);
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

        if ($request->tipo_licencia) {
            $request->validate([
                'tipo_licencia'             => 'required|integer',
                'tipo_licencia'             => 'required|integer',
                'tipo_software'             => 'required|integer',
                'fecha_inicio'              => 'required|date|date_format:Y-m-d|before:fecha_finalizacion',
                'fecha_finalizacion'        => 'required|date|date_format:Y-m-d|after:fecha_inicio',
            ]);

            $software_info = SoftwareInfo::where('proyecto_presupuesto_id', $presupuesto->id)->first();
            $presupuesto->softwareInfo()->updateOrCreate(
                ['id' => $software_info ? $software_info->id : null],
                [
                    'tipo_licencia'      => $request->tipo_licencia,
                    'tipo_software'      => $request->tipo_software,
                    'fecha_inicio'       => $request->fecha_inicio,
                    'fecha_finalizacion' => $request->fecha_finalizacion
                ]
            );
        } else {
            $presupuesto->servicioEdicionInfo()->delete();
        }

        if ($request->servicio_edicion_info) {
            $servicio_edicion_info = ServicioEdicionInfo::where('proyecto_presupuesto_id', $presupuesto->id)->first();

            $presupuesto->servicioEdicionInfo()->updateOrCreate(
                ['id' => $servicio_edicion_info ? $servicio_edicion_info->id : null],
                [
                    'info' => $request->servicio_edicion_info,
                ]
            );
        } else {
            $presupuesto->softwareInfo()->delete();
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

    public function saveFilesSharepoint($tmp_file, $modulo, $modelo, $campo_bd)
    {
        $presupuesto = $modelo;
        $proyecto    = Proyecto::find($presupuesto->proyecto_id);

        $sharepoint_estudio_mercado = $proyecto->centroFormacion->nombre_carpeta_sharepoint . '/' . $proyecto->lineaProgramatica->codigo . '/' . $proyecto->codigo . '/ESTUDIOS MERCADO';

        $sharepoint_path            = "$modulo/$sharepoint_estudio_mercado";

        SharepointHelper::saveFilesSharepoint($tmp_file, $modelo, $sharepoint_path, $campo_bd);
    }

    public function downloadServerFile(Request $request, Convocatoria $convocatoria, Proyecto $proyecto, ProyectoPresupuesto $presupuesto)
    {
        SharepointHelper::downloadServerFile($presupuesto, $request->formato);
    }

    public function downloadFileSharepoint(Convocatoria $convocatoria, Proyecto $proyecto, ProyectoPresupuesto $presupuesto, $tipo_archivo)
    {
        $sharepoint_path = $presupuesto[$tipo_archivo];

        return SharepointHelper::downloadFile($sharepoint_path);
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

        if ($evaluacion->evaluacionProyectoLinea70()->exists()) {
            $evaluacion->evaluacionProyectoLinea70()->update(
                ['proyecto_presupuesto_comentario' => $request->proyecto_presupuesto_comentario]
            );
        } else if ($evaluacion->evaluacionProyectoLinea69()->exists()) {
            $evaluacion->evaluacionProyectoLinea69()->update(
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

    public function indexMunicipiosAVisitar(Convocatoria $convocatoria, Proyecto $proyecto, ProyectoPresupuesto $presupuesto)
    {
        $this->authorize('visualizar-proyecto-autor', $proyecto);

        $proyecto->codigo_linea_programatica = $proyecto->lineaProgramatica->codigo;

        return Inertia::render('Convocatorias/Proyectos/Municipios/Index', [
            'convocatoria'                  =>  $convocatoria->only('id', 'esta_activa', 'fase_formateada', 'fase', 'tipo_convocatoria'),
            'proyecto'                      =>  $proyecto->only('id', 'codigo_linea_programatica', 'precio_proyecto', 'modificable',  'evaluaciones', 'mostrar_recomendaciones', 'PdfVersiones', 'all_files', 'allowed'),
            'presupuesto'                   =>  $presupuesto,
            'conceptos_viaticos'            =>  json_decode(Storage::get('json/conceptos-viaticos.json'), true),
            'distancias_municipios'         =>  json_decode(Storage::get('json/distancia-municipios.json'), true),
            'frecuencias_semanales'         =>  json_decode(Storage::get('json/frecuencias-semanales-visita.json'), true),
            'municipios'                    =>  SelectHelper::municipios(),
            'ta_tp_viaticos_municipios'     =>  $presupuesto->taTpViaticosMunicipios()->exists() ? $presupuesto->taTpViaticosMunicipios()->get() : collect([]),
            'proyecto_roles_sennova'        =>  $proyecto->proyectoRolesSennova()->selectRaw("proyecto_rol_sennova.id as value, convocatoria_rol_sennova.perfil, convocatoria_rol_sennova.mensaje,
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

    public function storeMunicipiosAVisitar(TaTpViaticosMunicipioRequest $request, Convocatoria $convocatoria, Proyecto $proyecto, ProyectoPresupuesto $presupuesto)
    {
        $request->merge(['proyecto_presupuesto_id' => $presupuesto->id]);
        $ta_tp_viaticos_municipio = TaTpViaticosMunicipio::create($request->validated());

        return back()->with('success', 'El recurso se ha creado correctamente.');
    }

    public function updateMunicipiosAVisitar(TaTpViaticosMunicipioRequest $request, Convocatoria $convocatoria, Proyecto $proyecto, ProyectoPresupuesto $presupuesto, TaTpViaticosMunicipio $ta_tp_viaticos_municipio)
    {
        $ta_tp_viaticos_municipio->update($request->validated());

        return back()->with('success', 'El recurso se ha actualizado correctamente.');
    }

    public function destroyMunicipioAVisitar(Convocatoria $convocatoria, Proyecto $proyecto, ProyectoPresupuesto $presupuesto, TaTpViaticosMunicipio $ta_tp_viaticos_municipio)
    {
        $ta_tp_viaticos_municipio->delete();

        return back()->with('success', 'El recurso se ha eliminado correctamente.');
    }
}
