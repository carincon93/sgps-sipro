<?php

namespace App\Http\Controllers;

use App\Helpers\SharepointHelper;
use App\Http\Requests\EntidadAliadaRequest;
use App\Models\Convocatoria;
use App\Models\Proyecto;
use App\Models\EntidadAliada;
use App\Models\Actividad;
use App\Models\Evaluacion\Evaluacion;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class EntidadAliadaController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Convocatoria $convocatoria, Proyecto $proyecto)
    {
        $this->authorize('visualizar-proyecto-autor', $proyecto);

        $proyecto->load('evaluaciones.evaluacionProyectoFormulario8Linea66');
        $proyecto->load('evaluaciones.evaluacionProyectoFormulario4Linea70');

        $objetivo_especificos = $proyecto->causasDirectas()->with('objetivoEspecifico')->get()->pluck('objetivoEspecifico')->flatten()->filter();

        /**
         * Si el proyecto es de la línea programática 23 o 65 se prohibe el acceso. No requiere de entidades aliadas
         */
        if ($proyecto->tipo_formulario_convocatoria_id == 7 || $proyecto->tipo_formulario_convocatoria_id == 9 || $proyecto->tipo_formulario_convocatoria_id == 1 || $proyecto->tipo_formulario_convocatoria_id == 13 || $proyecto->tipo_formulario_convocatoria_id == 15 ||  $proyecto->tipo_formulario_convocatoria_id == 16 || $proyecto->tipo_formulario_convocatoria_id == 12) {
            return redirect()->route('convocatorias.proyectos.analisis-riesgos.index', [$convocatoria, $proyecto])->with('error', 'Esta línea programática no requiere de entidades aliadas');
        }

        return Inertia::render('Convocatorias/Proyectos/EntidadesAliadas/Index', [
            'convocatoria'                  =>  $convocatoria->only('id', 'esta_activa', 'fase_formateada', 'fase', 'tipo_convocatoria', 'mostrar_recomendaciones'),
            'proyecto'                      =>  $proyecto->only('id', 'tipo_formulario_convocatoria_id', 'precio_proyecto', 'modificable', 'evaluaciones', 'mostrar_recomendaciones', 'all_files', 'allowed'),
            'evaluacion'                    =>  Evaluacion::find(request()->evaluacion_id),
            'entidades_aliadas'             =>  EntidadAliada::where('proyecto_id', $proyecto->id)->orderBy('nombre', 'ASC')
                                                    ->filterEntidadAliada(request()->only('search'))->with('actividades', 'actividades.objetivoEspecifico', 'miembrosEntidadAliada', 'entidadAliadaLinea66', 'entidadAliadaLinea69', 'entidadAliadaLinea70', 'entidadAliadaLinea83')->paginate(),
            'actividades'                   =>  Actividad::select('id as value', 'descripcion as label')->whereIn(
                                                    'objetivo_especifico_id',
                                                    $objetivo_especificos->map(function ($objetivo_especifico) {
                                                        return $objetivo_especifico->id;
                                                    })
                                                )->orderBy('fecha_inicio', 'ASC')->get(),
            'tipos_entidad_aliada'          =>  json_decode(Storage::get('json/tipos-entidades-aliadas.json'), true),
            'naturaleza_entidad_aliada'     =>  json_decode(Storage::get('json/naturaleza-empresa.json'), true),
            'tipos_empresa'                 =>  json_decode(Storage::get('json/tipos-empresa.json'), true),
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
    public function store(EntidadAliadaRequest $request, Convocatoria $convocatoria, Proyecto $proyecto)
    {
        $this->authorize('modificar-proyecto-autor', $proyecto);

        $entidad_aliada = new EntidadAliada();
        $entidad_aliada->tipo         = $request->tipo;
        $entidad_aliada->nombre       = $request->nombre;
        $entidad_aliada->naturaleza   = $request->naturaleza;
        $entidad_aliada->tipo_empresa = $request->tipo_empresa;
        $entidad_aliada->nit          = $request->nit;

        $entidad_aliada->proyecto()->associate($proyecto);

        $entidad_aliada->save();
        $request->merge(['entidad_aliada_id' => $entidad_aliada->id]);

        switch ($proyecto->tipo_formulario_convocatoria_id) {
            case 4:
                 $request->validate([
                    'fecha_inicio_convenio'         => 'required|date|date_format:Y-m-d|before:fecha_fin_convenio',
                    'fecha_fin_convenio'            => 'required|date|date_format:Y-m-d|after:fecha_inicio_convenio',
                ]);

                $entidad_aliada_linea_70 = $entidad_aliada->entidadAliadaLinea70()->create($request->only('fecha_inicio_convenio', 'fecha_fin_convenio'));
                return back()->with('success', 'El recurso se ha creado correctamente.');
                break;
            case 5:
                $request->validate([
                    'fecha_inicio_convenio'         => 'required|date|date_format:Y-m-d|before:fecha_fin_convenio',
                    'fecha_fin_convenio'            => 'required|date|date_format:Y-m-d|after:fecha_inicio_convenio',
                ]);

                $entidad_aliada_linea_69 = $entidad_aliada->EntidadAliadaLinea69()->create($request->only('fecha_inicio_convenio', 'fecha_fin_convenio'));
                return back()->with('success', 'El recurso se ha creado correctamente.');
                break;
            case 8:
                $request->validate([
                    'descripcion_convenio'                      => 'nullable|string',
                    'grupo_investigacion'                       => 'nullable|max:191',
                    'codigo_gruplac'                            => 'nullable|max:191',
                    'enlace_gruplac'                            => 'nullable|url|string',
                    'actividades_transferencia_conocimiento'    => 'required|max:10000',
                    'recursos_especie'                          => 'required|numeric',
                    'descripcion_recursos_especie'              => 'required|string',
                    'recursos_dinero'                           => 'required|numeric',
                    'descripcion_recursos_dinero'               => 'required|string',
                    'actividad_id*'                             => 'required|min:0|max:2147483647|integer|exists:actividades,id',
                ]);

                $entidad_aliada_linea_66 = $entidad_aliada->EntidadAliadaLinea66()->create($request->only('descripcion_convenio', 'grupo_investigacion', 'codigo_gruplac', 'enlace_gruplac', 'actividades_transferencia_conocimiento', 'recursos_especie', 'descripcion_recursos_especie', 'recursos_dinero', 'descripcion_recursos_dinero'));

                $entidad_aliada->actividades()->attach($request->actividad_id);

                return back()->with('success', 'El recurso se ha creado correctamente.');
                break;
            case 11:
                $request->validate([
                    'fecha_inicio_convenio'         => 'required|date|date_format:Y-m-d|before:fecha_fin_convenio',
                    'fecha_fin_convenio'            => 'required|date|date_format:Y-m-d|after:fecha_inicio_convenio',
                ]);

                $entidad_aliada_linea_83 = $entidad_aliada->entidadAliadaLinea83()->create($request->only('fecha_inicio_convenio', 'fecha_fin_convenio'));
                return back()->with('success', 'El recurso se ha creado correctamente.');
                break;
            default:
                break;
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\EntidadAliada  $entidad_aliada
     * @return \Illuminate\Http\Response
     */
    public function show(Convocatoria $convocatoria, Proyecto $proyecto, EntidadAliada $entidad_aliada)
    {
        $this->authorize('visualizar-proyecto-autor', $proyecto);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\EntidadAliada  $entidad_aliada
     * @return \Illuminate\Http\Response
     */
    public function edit(Convocatoria $convocatoria, Proyecto $proyecto, EntidadAliada $entidad_aliada)
    {
        $this->authorize('visualizar-proyecto-autor', $proyecto);

        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\EntidadAliada  $entidad_aliada
     * @return \Illuminate\Http\Response
     */
    public function update(EntidadAliadaRequest $request, Convocatoria $convocatoria, Proyecto $proyecto, EntidadAliada $entidad_aliada)
    {
        $this->authorize('modificar-proyecto-autor', $proyecto);

        $entidad_aliada->tipo         = $request->tipo;
        $entidad_aliada->nombre       = $request->nombre;
        $entidad_aliada->naturaleza   = $request->naturaleza;
        $entidad_aliada->tipo_empresa = $request->tipo_empresa;
        $entidad_aliada->nit          = $request->nit;

        $entidad_aliada->save();

        switch ($proyecto->tipo_formulario_convocatoria_id) {
            case 4:
                 $request->validate([
                    'fecha_inicio_convenio'         => 'required|date|date_format:Y-m-d|before:fecha_fin_convenio',
                    'fecha_fin_convenio'            => 'required|date|date_format:Y-m-d|after:fecha_inicio_convenio',
                ]);

                $entidad_aliada_linea_70 = $entidad_aliada->entidadAliadaLinea70()->update($request->only('fecha_inicio_convenio', 'fecha_fin_convenio'));
                return back()->with('success', 'El recurso se ha creado correctamente.');
                break;
            case 5:
                $request->validate([
                    'fecha_inicio_convenio'         => 'required|date|date_format:Y-m-d|before:fecha_fin_convenio',
                    'fecha_fin_convenio'            => 'required|date|date_format:Y-m-d|after:fecha_inicio_convenio',
                ]);

                $entidad_aliada_linea_69 = $entidad_aliada->EntidadAliadaLinea69()->update($request->only('fecha_inicio_convenio', 'fecha_fin_convenio'));
                return back()->with('success', 'El recurso se ha creado correctamente.');
                break;
            case 8:
                $request->validate([
                    'descripcion_convenio'                      => 'nullable|string',
                    'grupo_investigacion'                       => 'nullable|max:191',
                    'codigo_gruplac'                            => 'nullable|max:191',
                    'enlace_gruplac'                            => 'nullable|url|string',
                    'actividades_transferencia_conocimiento'    => 'required|max:10000',
                    'recursos_especie'                          => 'required|numeric',
                    'descripcion_recursos_especie'              => 'required|string',
                    'recursos_dinero'                           => 'required|numeric',
                    'descripcion_recursos_dinero'               => 'required|string',
                    'actividad_id*'                             => 'required|min:0|max:2147483647|integer|exists:actividades,id',
                ]);

                $entidad_aliada_linea_66 = $entidad_aliada->EntidadAliadaLinea66()->update($request->only('descripcion_convenio', 'grupo_investigacion', 'codigo_gruplac', 'enlace_gruplac', 'actividades_transferencia_conocimiento', 'recursos_especie', 'descripcion_recursos_especie', 'recursos_dinero', 'descripcion_recursos_dinero'));

                $entidad_aliada->actividades()->attach($request->actividad_id);

                return back()->with('success', 'El recurso se ha creado correctamente.');
                break;
            case 11:
                $request->validate([
                    'fecha_inicio_convenio'         => 'required|date|date_format:Y-m-d|before:fecha_fin_convenio',
                    'fecha_fin_convenio'            => 'required|date|date_format:Y-m-d|after:fecha_inicio_convenio',
                ]);

                $entidad_aliada_linea_83 = $entidad_aliada->entidadAliadaLinea83()->update($request->only('fecha_inicio_convenio', 'fecha_fin_convenio'));
                return back()->with('success', 'El recurso se ha creado correctamente.');
                break;
            default:
                break;
        }

        return back()->with('success', 'El recurso se ha actualizado correctamente.');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\EntidadAliada  $entidad_aliada
     * @return \Illuminate\Http\Response
     */
    public function destroy(Convocatoria $convocatoria, Proyecto $proyecto, EntidadAliada $entidad_aliada)
    {
        $this->authorize('modificar-proyecto-autor', $proyecto);

        $entidad_aliada->delete();

        return redirect()->route('convocatorias.proyectos.entidades-aliadas.index', [$convocatoria, $proyecto])->with('success', 'El recurso se ha eliminado correctamente.');
    }

    public function uploadCartaIntencion(Request $request, Convocatoria $convocatoria, Proyecto $proyecto, EntidadAliada $entidad_aliada)
    {
        $modelo = null;
        switch ($proyecto) {
            case $proyecto->proyectoFormulario8Linea66()->exists():
                $modelo = $entidad_aliada->entidadAliadaLinea66;
                break;
            default:
                break;
        }

        $request->validate([
            'carta_intencion' => 'nullable|file|max:10240',
        ]);
        if ($request->hasFile('carta_intencion')) {
            return $this->saveFilesSharepoint($request->carta_intencion, mb_strtoupper($convocatoria->descripcion) . ' ' . $convocatoria->year, $modelo, 'carta_intencion');
        }
    }

    public function uploadCartaPropiedadIntelectual(Request $request, Convocatoria $convocatoria, Proyecto $proyecto, EntidadAliada $entidad_aliada)
    {
        $modelo = null;
        switch ($proyecto) {
            case $proyecto->proyectoFormulario8Linea66()->exists():
                $modelo = $entidad_aliada->entidadAliadaLinea66;
                break;
            default:
                break;
        }

        $request->validate([
            'carta_propiedad_intelectual' => 'nullable|file|max:10240',
        ]);

        if ($request->hasFile('carta_propiedad_intelectual')) {
            return $this->saveFilesSharepoint($request->carta_propiedad_intelectual, mb_strtoupper($convocatoria->descripcion) . ' ' . $convocatoria->year, $modelo, 'carta_propiedad_intelectual');
        }
    }

    public function uploadSoporteConvenio(Request $request, Convocatoria $convocatoria, Proyecto $proyecto, EntidadAliada $entidad_aliada)
    {
        $modelo = null;
        switch ($proyecto) {
            case $proyecto->proyectoFormulario5Linea69()->exists():
                $modelo = $entidad_aliada->entidadAliadaLinea69;
                break;
            case $proyecto->proyectoFormulario4Linea70()->exists():
                $modelo = $entidad_aliada->entidadAliadaLinea70;
                break;
            case $proyecto->proyectoFormulario11Linea83()->exists():
                $modelo = $entidad_aliada->entidadAliadaLinea83;
                break;
            default:
                break;
        }
        $request->validate([
            'soporte_convenio' => 'nullable|file|max:10240',
        ]);

        if ($request->hasFile('soporte_convenio')) {
            return $this->saveFilesSharepoint($request->soporte_convenio, mb_strtoupper($convocatoria->descripcion) . ' ' . $convocatoria->year, $modelo, 'soporte_convenio');
        }
    }

    public function saveFilesSharepoint($tmp_file, $modulo, $modelo, $campo_bd)
    {
        $entidad_aliada = $modelo;
        $proyecto       = Proyecto::find($entidad_aliada->entidadAliada->proyecto_id);

        $sharepoint_entidad_aliada  = $proyecto->centroFormacion->nombre_carpeta_sharepoint . '/' . $proyecto->tipoFormularioConvocatoria->lineaProgramatica->codigo . '/' . $proyecto->codigo . '/ENTIDADES ALIADAS';

        $sharepoint_path            = "$modulo/$sharepoint_entidad_aliada";

        SharepointHelper::saveFilesSharepoint($tmp_file, $modelo, $sharepoint_path, $campo_bd);
    }

    public function downloadServerFile(Request $request, Convocatoria $convocatoria, Proyecto $proyecto, EntidadAliada $entidad_aliada)
    {
        if ($entidad_aliada->entidadAliadaLinea66()->exists()) {
            $entidad_aliada->entidadAliadaLinea66->ruta_final_sharepoint = $proyecto->centroFormacion->nombre_carpeta_sharepoint . '/' . $proyecto->tipoFormularioConvocatoria->lineaProgramatica->codigo . '/' . $proyecto->codigo . '/ENTIDADES ALIADAS';
            SharepointHelper::downloadServerFile($entidad_aliada->entidadAliadaLinea66, $request->formato);
        } else if ($entidad_aliada->entidadAliadaLinea69()->exists()) {
            $entidad_aliada->entidadAliadaLinea69->ruta_final_sharepoint = $proyecto->centroFormacion->nombre_carpeta_sharepoint . '/' . $proyecto->tipoFormularioConvocatoria->lineaProgramatica->codigo . '/' . $proyecto->codigo . '/ENTIDADES ALIADAS';
            SharepointHelper::downloadServerFile($entidad_aliada->entidadAliadaLinea69, $request->formato);
        } else if ($entidad_aliada->entidadAliadaLinea70()->exists()) {
            $entidad_aliada->entidadAliadaLinea70->ruta_final_sharepoint = $proyecto->centroFormacion->nombre_carpeta_sharepoint . '/' . $proyecto->tipoFormularioConvocatoria->lineaProgramatica->codigo . '/' . $proyecto->codigo . '/ENTIDADES ALIADAS';
            SharepointHelper::downloadServerFile($entidad_aliada->entidadAliadaLinea70, $request->formato);
        }
    }

    public function downloadFileSharepoint(Convocatoria $convocatoria, Proyecto $proyecto, EntidadAliada $entidad_aliada, $tipo_archivo)
    {
        $sharepoint_path = '';
        if ($entidad_aliada->entidadAliadaLinea66()->exists()) {
            $sharepoint_path = $entidad_aliada->entidadAliadaLinea66[$tipo_archivo];
        } else if ($entidad_aliada->entidadAliadaLinea69()->exists()) {
            $sharepoint_path = $entidad_aliada->entidadAliadaLinea69[$tipo_archivo];
        } else if ($entidad_aliada->entidadAliadaLinea70()->exists()) {
            $sharepoint_path = $entidad_aliada->entidadAliadaLinea70[$tipo_archivo];
        } else if ($entidad_aliada->entidadAliadaLinea83()->exists()) {
            $sharepoint_path = $entidad_aliada->entidadAliadaLinea83[$tipo_archivo];
        }

        return SharepointHelper::downloadFile($sharepoint_path);
    }

    /**
     * updateEntidadAliadaEvaluacion
     *
     * @param  mixed $request
     * @param  mixed $convocatoria
     * @param  mixed $evaluacion
     * @return void
     */
    public function updateEntidadAliadaEvaluacion(Request $request, Convocatoria $convocatoria, Evaluacion $evaluacion)
    {
        $this->authorize('modificar-evaluacion-autor', $evaluacion);

        $tipo = 'Sin información';
        if ($evaluacion->evaluacionProyectoFormulario8Linea66()->exists() && $evaluacion->evaluacionProyectoFormulario8Linea66->entidad_aliada_verificada) {
            if ($evaluacion->proyecto->codigo_linea_programatica == 66) {
                $puntaje = 0;
                $tipo = '';
                $detener = false;
                foreach ($evaluacion->proyecto->entidadesAliadas as $entidad_aliada) {
                    if ($entidad_aliada->tipo == 'Universidad' || $entidad_aliada->tipo == 'Centro de formación SENA') {
                        // Universidad / Centro de formación SENA
                        $puntaje = 5;
                        $detener = true;
                        $tipo = $entidad_aliada->tipo;
                    } else if ($entidad_aliada->tipo == 'Empresa' && $detener == false || $entidad_aliada->tipo == 'Entidades sin ánimo de lucro' && $detener == false || $entidad_aliada->tipo == 'Otra' && $detener == false) {
                        // Empresa / Entidades sin ánimo de lucro / Otra
                        $puntaje = 2.5;
                        $tipo = $entidad_aliada->tipo;
                    }
                }

                $evaluacion->evaluacionProyectoFormulario8Linea66()->update([
                    'entidad_aliada_puntaje' => $puntaje
                ]);
            } else if ($evaluacion->proyecto->codigo_linea_programatica == 82) {
                $puntaje = 0;
                $tipo = '';
                $detener = false;
                foreach ($evaluacion->proyecto->entidadesAliadas as $entidad_aliada) {
                    if ($entidad_aliada->tipo == 'Empresa' || $entidad_aliada->tipo == 'Entidades sin ánimo de lucro' || $entidad_aliada->tipo == 'Otra' || $entidad_aliada->tipo == 'Centro de formación SEN') {
                        // Empresa / Entidades sin ánimo de lucro / Otra / Centro de formación SENA
                        $puntaje = 5;
                        $detener = true;
                        $tipo = $entidad_aliada->tipo;
                    } else if ($entidad_aliada->tipo == 'Universidad' && $detener == false) {
                        // Universidad
                        $puntaje = 2.5;
                        $tipo = $entidad_aliada->tipo;
                    }
                }

                $evaluacion->evaluacionProyectoFormulario8Linea66()->update([
                    'entidad_aliada_puntaje' => $puntaje
                ]);
            }

            $evaluacion->entidad_aliada_puntaje = $puntaje;
        } else {
            $evaluacion->entidad_aliada_puntaje = 0;
        }

        $evaluacion->evaluacionProyectoFormulario4Linea70()->update([
            'entidad_aliada_comentario'   => $request->entidad_aliada_requiere_comentario == false ? $request->entidad_aliada_comentario : null
        ]);

        return back()->with('success', 'El recurso se ha actualizado correctamente.');
    }

    public function validarEntidadAliada(Request $request, Convocatoria $convocatoria, Evaluacion $evaluacion, EntidadAliada $entidad_aliada)
    {
        if ($evaluacion->evaluacionProyectoFormulario8Linea66()->exists()) {
            $evaluacion->evaluacionProyectoFormulario8Linea66()->update([
                'entidad_aliada_verificada' => $request->entidad_aliada_verificada
            ]);
        }

        return back()->with('success', 'El recurso se ha actualizado correctamente.');
    }
}
