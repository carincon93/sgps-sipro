<?php

namespace App\Http\Controllers;

use App\Helpers\SharepointHelper;
use App\Helpers\SelectHelper;
use App\Http\Requests\ProyectoAnexoRequest;
use App\Models\Convocatoria;
use App\Models\Proyecto;
use App\Models\Anexo;
use App\Models\Evaluacion\Evaluacion;
use App\Models\ProyectoAnexo;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProyectoAnexoController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Convocatoria $convocatoria, Proyecto $proyecto)
    {
        $this->authorize('visualizar-proyecto-autor', $proyecto);

        $proyecto->load('evaluaciones.evaluacionProyectoLinea66');
        $proyecto->load('evaluaciones.evaluacionProyectoLinea70');

        $proyecto->codigo_linea_programatica = $proyecto->lineaProgramatica->codigo;
        $proyecto->codigo_linea_programatica == 68 ? $proyecto->infraestructura_adecuada = $proyecto->proyectoLinea68->infraestructura_adecuada : $proyecto->infraestructura_adecuada = null;
        $proyecto->codigo_linea_programatica == 68 ? $proyecto->especificaciones_area = $proyecto->proyectoLinea68->especificaciones_area : $proyecto->especificaciones_area = null;
        $proyecto->codigo_linea_programatica == 68 ? $proyecto->video = $proyecto->proyectoLinea68->video : $proyecto->video = null;

        if ($proyecto->codigo_linea_programatica == 65) {
            $proyecto->tipo_proyecto = $proyecto->proyectoLinea65->tipo_proyecto;
        }

        return Inertia::render('Convocatorias/Proyectos/Anexos/Index', [
            'convocatoria'      => $convocatoria->only('id', 'esta_activa', 'fase_formateada', 'fase', 'tipo_convocatoria', 'mostrar_recomendaciones'),
            'proyecto'          => $proyecto->only('id', 'codigo_linea_programatica', 'precio_proyecto', 'modificable', 'video', 'infraestructura_adecuada', 'especificaciones_area', 'en_subsanacion', 'evaluaciones', 'mostrar_recomendaciones', 'PdfVersiones', 'all_files', 'allowed', 'tipo_proyecto'),
            'evaluacion'        => Evaluacion::find(request()->evaluacion_id),
            'proyecto_anexo'    => $proyecto->proyectoAnexo()->select('proyecto_anexo.*', 'anexos.nombre')->join('anexos', 'proyecto_anexo.anexo_id', 'anexos.id')->get(),
            'anexos'            => Anexo::select('anexos.id', 'anexos.nombre', 'anexos.archivo', 'anexos.obligatorio', 'anexos.habilitado')
                                    ->join('anexo_lineas_programaticas', 'anexos.id', 'anexo_lineas_programaticas.anexo_id')
                                    ->join('convocatoria_anexos', 'anexos.id', 'convocatoria_anexos.anexo_id')
                                    ->where('anexo_lineas_programaticas.linea_programatica_id', $proyecto->lineaProgramatica->id)
                                    ->where('convocatoria_anexos.convocatoria_id', $convocatoria->id)
                                    ->filterAnexo(request()->only('search'))->paginate()->appends(['search' => request()->search])
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

        return Inertia::render('Convocatorias/Proyectos/Anexos/Create', [
            'convocatoria'  => $convocatoria->only('id', 'esta_activa', 'fase_formateada', 'fase', 'tipo_convocatoria', 'tipo_convocatoria'),
            'proyecto'      => $proyecto->only('id', 'modificable', 'mostrar_recomendaciones'),
            'anexos'        => SelectHelper::anexos()->where('linea_programatica_id', $proyecto->lineaProgramatica->id)->where('convocatoria_id', $convocatoria->id)->values()->all()
        ]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(ProyectoAnexoRequest $request, Convocatoria $convocatoria, Proyecto $proyecto)
    {
        $this->authorize('modificar-proyecto-autor', $proyecto);

        $anexo = Anexo::select('id', 'nombre')->where('id', $request->anexo_id)->first();

        $proyecto_anexo = ProyectoAnexo::updateOrCreate(
            ['proyecto_id'  => $proyecto->id, 'anexo_id' => $anexo->id],
        );

        if ($request->hasFile('archivo')) {
            $this->saveFilesSharepoint($request->archivo, mb_strtoupper($convocatoria->descripcion) . ' ' . $convocatoria->year, $proyecto_anexo, 'archivo');
        }

        return back()->with('success', 'El recurso se ha creado correctamente.');
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\ProyectoAnexo  $proyecto_anexo
     * @return \Illuminate\Http\Response
     */
    public function show(Convocatoria $convocatoria, Proyecto $proyecto, ProyectoAnexo $proyecto_anexo)
    {
        $this->authorize('visualizar-proyecto-autor', $proyecto);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\ProyectoAnexo  $proyecto_anexo
     * @return \Illuminate\Http\Response
     */
    public function edit(Convocatoria $convocatoria, Proyecto $proyecto, ProyectoAnexo $proyecto_anexo)
    {
        $this->authorize('visualizar-proyecto-autor', $proyecto);

        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\ProyectoAnexo  $proyecto_anexo
     * @return \Illuminate\Http\Response
     */
    public function update(ProyectoAnexoRequest $request, Convocatoria $convocatoria, Proyecto $proyecto, ProyectoAnexo $proyecto_anexo)
    {
        $this->authorize('modificar-proyecto-autor', $proyecto);

        return back()->with('success', 'El recurso se ha actualizado correctamente.');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\ProyectoAnexo  $proyecto_anexo
     * @return \Illuminate\Http\Response
     */
    public function destroy(Convocatoria $convocatoria, Proyecto $proyecto, ProyectoAnexo $proyecto_anexo)
    {
        $this->authorize('modificar-proyecto-autor', $proyecto);

        $proyecto_anexo->delete();

        return redirect()->route('convocatorias.proyectos.proyecto-anexos.index', [$convocatoria, $proyecto])->with('success', 'El recurso se ha eliminado correctamente.');
    }

    public function saveFilesSharepoint($tmp_file, $modulo, $modelo, $campo_bd)
    {
        $anexo              = $modelo;
        $proyecto           = Proyecto::find($anexo->proyecto_id);

        $sharepoint_anexo   = $proyecto->centroFormacion->nombre_carpeta_sharepoint . '/' . $proyecto->lineaProgramatica->codigo . '/' . $proyecto->codigo . '/ANEXOS';

        $sharepoint_path    = "$modulo/$sharepoint_anexo";

        SharepointHelper::saveFilesSharepoint($tmp_file, $modelo, $sharepoint_path, $campo_bd);
    }

    public function downloadServerFile(Request $request, Convocatoria $convocatoria, Proyecto $proyecto, ProyectoAnexo $proyecto_anexo)
    {
        SharepointHelper::downloadServerFile($proyecto_anexo, $request->formato);
    }

    public function downloadFileSharepoint(Convocatoria $convocatoria, Proyecto $proyecto, ProyectoAnexo $proyecto_anexo, $tipo_archivo)
    {
        $sharepoint_path = $proyecto_anexo[$tipo_archivo];

        return SharepointHelper::downloadFile($sharepoint_path);
    }

    /**
     * updateAnexosEvaluacion
     *
     * @param  mixed $request
     * @param  mixed $convocatoria
     * @param  mixed $evaluacion
     * @return void
     */
    public function updateAnexosEvaluacion(Request $request, Convocatoria $convocatoria, Evaluacion $evaluacion)
    {
        $this->authorize('modificar-evaluacion-autor', $evaluacion);

        switch ($evaluacion) {
            case $evaluacion->evaluacionProyectoLinea66()->exists():
                $evaluacion->evaluacionProyectoLinea66()->update([
                    'anexos_comentario'   => $request->anexos_requiere_comentario == false ? $request->anexos_comentario : null
                ]);
                break;
            case $evaluacion->evaluacionProyectoLinea65()->exists():
                $evaluacion->evaluacionProyectoLinea65()->update([
                    'anexos_comentario'   => $request->anexos_requiere_comentario == false ? $request->anexos_comentario : null
                ]);
                break;
            case $evaluacion->evaluacionProyectoLinea70()->exists():
                $evaluacion->evaluacionProyectoLinea70()->update([
                    'anexos_comentario'   => $request->anexos_requiere_comentario == false ? $request->anexos_comentario : null
                ]);
                break;
            case $evaluacion->evaluacionProyectoLinea69()->exists():
                $evaluacion->evaluacionProyectoLinea69()->update([
                    'anexos_comentario'   => $request->anexos_requiere_comentario == false ? $request->anexos_comentario : null
                ]);
                break;
            case $evaluacion->evaluacionProyectoLinea68()->exists():
                $evaluacion->evaluacionProyectoLinea68()->update([
                    'anexos_comentario'                     => $request->anexos_requiere_comentario == false ? $request->anexos_comentario : null,
                    'video_comentario'                      => $request->video_requiere_comentario == false ? $request->video_comentario : null,
                    'especificaciones_area_comentario'      => $request->especificaciones_area_requiere_comentario == false ? $request->especificaciones_area_comentario : null,
                ]);
                break;
            default:
                break;
        }

        $evaluacion->save();

        return back()->with('success', 'El recurso se ha actualizado correctamente.');
    }
}
