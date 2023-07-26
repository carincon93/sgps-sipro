<?php

namespace App\Http\Controllers;

use App\Helpers\SharepointHelper;
use App\Http\Requests\EntidadAliadaRequest;
use App\Models\Convocatoria;
use App\Models\Proyecto;
use App\Models\EntidadAliada;
use App\Models\Actividad;
use App\Models\EntidadAliadaLinea66;
use App\Models\EntidadAliadaLinea69;
use App\Models\EntidadAliadaLinea70;
use App\Models\Evaluacion\Evaluacion;
use App\Models\Evaluacion\EvaluacionProyectoLinea70;
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

        $proyecto->load('evaluaciones.evaluacionProyectoLinea66');
        $proyecto->load('evaluaciones.evaluacionProyectoLinea70');

        $proyecto->codigo_linea_programatica = $proyecto->lineaProgramatica->codigo;

        $objetivo_especificos = $proyecto->causasDirectas()->with('objetivoEspecifico')->get()->pluck('objetivoEspecifico')->flatten()->filter();

        /**
         * Si el proyecto es de la línea programática 23 o 65 se prohibe el acceso. No requiere de entidades aliadas
         */
        if ($proyecto->codigo_linea_programatica == 23 || $proyecto->codigo_linea_programatica == 65 || $proyecto->codigo_linea_programatica == 68) {
            return redirect()->route('convocatorias.proyectos.analisis-riesgos.index', [$convocatoria, $proyecto])->with('error', 'Esta línea programática no requiere de entidades aliadas');
        }

        return Inertia::render('Convocatorias/Proyectos/EntidadesAliadas/Index', [
            'convocatoria'                  =>  $convocatoria->only('id', 'esta_activa', 'fase_formateada', 'fase', 'tipo_convocatoria', 'mostrar_recomendaciones'),
            'proyecto'                      =>  $proyecto->only('id', 'codigo_linea_programatica', 'precio_proyecto', 'modificable', 'evaluaciones', 'mostrar_recomendaciones', 'PdfVersiones', 'all_files', 'allowed'),
            'entidades_aliadas'             =>  EntidadAliada::where('proyecto_id', $proyecto->id)->orderBy('nombre', 'ASC')
                                                ->filterEntidadAliada(request()->only('search'))->with('actividades', 'actividades.objetivoEspecifico', 'miembrosEntidadAliada', 'entidadAliadaLinea66', 'entidadAliadaLinea69', 'entidadAliadaLinea70')->paginate(),
            'actividades'                   =>  Actividad::whereIn(
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

        if ($proyecto->proyectoLinea66()->exists()) {
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

            $entidad_aliada_linea_66 = EntidadAliadaLinea66::create($request->all());

            $entidad_aliada->actividades()->attach($request->actividad_id);

             $request->validate([
                'carta_intencion'                           => 'required_if:tipo_convocatoria,1|nullable|file|max:10240',
                'carta_propiedad_intelectual'               => 'required_if:tipo_convocatoria,1|nullable|file|max:10240',
            ]);
            if ($request->hasFile('carta_intencion')) {
                $this->saveFilesSharepoint($request->carta_intencion, mb_strtoupper($convocatoria->descripcion) . ' ' . $convocatoria->year, $entidad_aliada_linea_66, 'carta_intencion');
            }

            if ($request->hasFile('carta_propiedad_intelectual')) {
                $this->saveFilesSharepoint($request->carta_propiedad_intelectual, mb_strtoupper($convocatoria->descripcion) . ' ' . $convocatoria->year, $entidad_aliada_linea_66, 'carta_propiedad_intelectual');
            }

            return redirect()->route('convocatorias.proyectos.entidades-aliadas.edit', [$convocatoria, $proyecto, $entidad_aliada])->with('success', 'El recurso se ha creado correctamente.');
        } elseif ($proyecto->proyectoLinea69()->exists()) {
            $request->validate([
                'fecha_inicio_convenio'         => 'required|date|date_format:Y-m-d|before:fecha_fin_convenio',
                'fecha_fin_convenio'            => 'required|date|date_format:Y-m-d|after:fecha_inicio_convenio',
            ]);

            $entidad_aliada_linea_69 = EntidadAliadaLinea69::create($request->all());

            $request->validate([
                'soporte_convenio' > 'nullable|file|max:10240',
            ]);
            if ($request->hasFile('soporte_convenio')) {
                $this->saveFilesSharepoint($request->soporte_convenio, mb_strtoupper($convocatoria->descripcion) . ' ' . $convocatoria->year, $entidad_aliada_linea_69, 'soporte_convenio');
            }

            return redirect()->route('convocatorias.proyectos.entidades-aliadas.index', [$convocatoria, $proyecto])->with('success', 'El recurso se ha creado correctamente.');
        } elseif ($proyecto->proyectoLinea70()->exists()) {
            $request->validate([
                'fecha_inicio_convenio'         => 'required|date|date_format:Y-m-d|before:fecha_fin_convenio',
                'fecha_fin_convenio'            => 'required|date|date_format:Y-m-d|after:fecha_inicio_convenio',
            ]);

            $entidad_aliada_linea_70 = EntidadAliadaLinea70::create($request->all());

            $request->validate([
                'soporte_convenio' > 'nullable|file|max:10240',
            ]);
            if ($request->hasFile('soporte_convenio')) {
                $this->saveFilesSharepoint($request->soporte_convenio, mb_strtoupper($convocatoria->descripcion) . ' ' . $convocatoria->year, $entidad_aliada_linea_70, 'soporte_convenio');
            }

            return redirect()->route('convocatorias.proyectos.entidades-aliadas.index', [$convocatoria, $proyecto])->with('success', 'El recurso se ha creado correctamente.');
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

        if ($proyecto->proyectoLinea66()->exists()) {
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

            $entidad_aliada_linea_66 = $entidad_aliada->entidadAliadaLinea66;

            $entidad_aliada_linea_66->update($request->all());

            $entidad_aliada->actividades()->attach($request->actividad_id);

             $request->validate([
                'carta_intencion'                           => 'required_if:tipo_convocatoria,1|nullable|file|max:10240',
                'carta_propiedad_intelectual'               => 'required_if:tipo_convocatoria,1|nullable|file|max:10240',
            ]);
            if ($request->hasFile('carta_intencion')) {
                $this->saveFilesSharepoint($request->carta_intencion, mb_strtoupper($convocatoria->descripcion) . ' ' . $convocatoria->year, $entidad_aliada_linea_66, 'carta_intencion');
            }

            if ($request->hasFile('carta_propiedad_intelectual')) {
                $this->saveFilesSharepoint($request->carta_propiedad_intelectual, mb_strtoupper($convocatoria->descripcion) . ' ' . $convocatoria->year, $entidad_aliada_linea_66, 'carta_propiedad_intelectual');
            }

            return redirect()->route('convocatorias.proyectos.entidades-aliadas.edit', [$convocatoria, $proyecto, $entidad_aliada])->with('success', 'El recurso se ha creado correctamente.');
        } elseif ($proyecto->proyectoLinea69()->exists()) {
            $request->validate([
                'fecha_inicio_convenio'         => 'required|date|date_format:Y-m-d|before:fecha_fin_convenio',
                'fecha_fin_convenio'            => 'required|date|date_format:Y-m-d|after:fecha_inicio_convenio',
            ]);

            $entidad_aliada_linea_69 = $entidad_aliada->entidadAliadaLinea69;

            $entidad_aliada_linea_69->update($request->all());

            $request->validate([
                'soporte_convenio' > 'nullable|file|max:10240',
            ]);
            if ($request->hasFile('soporte_convenio')) {
                $this->saveFilesSharepoint($request->soporte_convenio, mb_strtoupper($convocatoria->descripcion) . ' ' . $convocatoria->year, $entidad_aliada_linea_69, 'soporte_convenio');
            }

            return redirect()->route('convocatorias.proyectos.entidades-aliadas.index', [$convocatoria, $proyecto])->with('success', 'El recurso se ha creado correctamente.');
        } elseif ($proyecto->proyectoLinea70()->exists()) {
            $request->validate([
                'fecha_inicio_convenio'         => 'required|date|date_format:Y-m-d|before:fecha_fin_convenio',
                'fecha_fin_convenio'            => 'required|date|date_format:Y-m-d|after:fecha_inicio_convenio',
            ]);

            $entidad_aliada_linea_70 = $entidad_aliada->entidadAliadaLinea70;

            $entidad_aliada_linea_70->update($request->all());

            $request->validate([
                'soporte_convenio' > 'nullable|file|max:10240',
            ]);
            if ($request->hasFile('soporte_convenio')) {
                $this->saveFilesSharepoint($request->soporte_convenio, mb_strtoupper($convocatoria->descripcion) . ' ' . $convocatoria->year, $entidad_aliada_linea_70, 'soporte_convenio');
            }

            return redirect()->route('convocatorias.proyectos.entidades-aliadas.index', [$convocatoria, $proyecto])->with('success', 'El recurso se ha creado correctamente.');
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

    public function saveFilesSharepoint($tmp_file, $modulo, $modelo, $campo_bd)
    {
        $entidad_aliada = $modelo;
        $proyecto       = Proyecto::find($entidad_aliada->entidadAliada->proyecto_id);

        $sharepoint_entidad_aliada  = $proyecto->centroFormacion->nombre_carpeta_sharepoint . '/' . $proyecto->lineaProgramatica->codigo . '/' . $proyecto->codigo . '/ENTIDADES ALIADAS';

        $sharepoint_path            = "$modulo/$sharepoint_entidad_aliada";

        SharepointHelper::saveFilesSharepoint($tmp_file, $modelo, $sharepoint_path, $campo_bd);
    }

    public function downloadServerFile(Request $request, Convocatoria $convocatoria, Proyecto $proyecto, EntidadAliada $entidad_aliada)
    {
        if ($entidad_aliada->entidadAliadaLinea66()->exists()) {
            $entidad_aliada->entidadAliadaLinea66->ruta_final_sharepoint = $proyecto->centroFormacion->nombre_carpeta_sharepoint . '/' . $proyecto->lineaProgramatica->codigo . '/' . $proyecto->codigo . '/ENTIDADES ALIADAS';
            SharepointHelper::downloadServerFile($entidad_aliada->entidadAliadaLinea66, $request->formato);
        } else if ($entidad_aliada->entidadAliadaLinea69()->exists()) {
            $entidad_aliada->entidadAliadaLinea69->ruta_final_sharepoint = $proyecto->centroFormacion->nombre_carpeta_sharepoint . '/' . $proyecto->lineaProgramatica->codigo . '/' . $proyecto->codigo . '/ENTIDADES ALIADAS';
            SharepointHelper::downloadServerFile($entidad_aliada->entidadAliadaLinea69, $request->formato);
        } else if ($entidad_aliada->entidadAliadaLinea70()->exists()) {
            $entidad_aliada->entidadAliadaLinea70->ruta_final_sharepoint = $proyecto->centroFormacion->nombre_carpeta_sharepoint . '/' . $proyecto->lineaProgramatica->codigo . '/' . $proyecto->codigo . '/ENTIDADES ALIADAS';
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
        }

        SharepointHelper::downloadFile($sharepoint_path);
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

        $evaluacion->evaluacionProyectoLinea70()->update([
            'entidad_aliada_comentario'   => $request->entidad_aliada_requiere_comentario == false ? $request->entidad_aliada_comentario : null
        ]);

        return back()->with('success', 'El recurso se ha actualizado correctamente.');
    }

    public function validarEntidadAliada(Request $request, Convocatoria $convocatoria, Evaluacion $evaluacion, EntidadAliada $entidad_aliada)
    {
        if ($evaluacion->evaluacionProyectoLinea66()->exists()) {
            $evaluacion->evaluacionProyectoLinea66()->update([
                'entidad_aliada_verificada' => $request->entidad_aliada_verificada
            ]);
        }

        return back()->with('success', 'El recurso se ha actualizado correctamente.');
    }
}
