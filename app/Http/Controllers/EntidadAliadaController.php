<?php

namespace App\Http\Controllers;

use App\Helpers\SharepointHelper;
use App\Http\Requests\EntidadAliadaRequest;
use App\Models\Convocatoria;
use App\Models\Proyecto;
use App\Models\EntidadAliada;
use App\Models\Actividad;
use App\Models\EntidadAliadaLinea66;
use App\Models\EntidadAliadaTaTp;
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

        $objetivoEspecificos = $proyecto->causasDirectas()->with('objetivoEspecifico')->get()->pluck('objetivoEspecifico')->flatten()->filter();

        /**
         * Si el proyecto es de la línea programática 23 o 65 se prohibe el acceso. No requiere de entidades aliadas
         */
        if ($proyecto->codigo_linea_programatica == 23 || $proyecto->codigo_linea_programatica == 65 || $proyecto->codigo_linea_programatica == 68) {
            return redirect()->route('convocatorias.proyectos.analisis-riesgos.index', [$convocatoria, $proyecto])->with('error', 'Esta línea programática no requiere de entidades aliadas');
        }

        return Inertia::render('Convocatorias/Proyectos/EntidadesAliadas/Index', [
            'convocatoria'                  =>  $convocatoria->only('id', 'esta_activa', 'fase_formateada', 'fase', 'tipo_convocatoria', 'mostrar_recomendaciones'),
            'proyecto'                      =>  $proyecto->only('id', 'codigo_linea_programatica', 'precio_proyecto', 'modificable', 'evaluaciones', 'mostrar_recomendaciones', 'PdfVersiones', 'all_files', 'allowed'),
            'filters'                       =>  request()->all('search'),
            'entidadesAliadas'              =>  EntidadAliada::where('proyecto_id', $proyecto->id)->orderBy('nombre', 'ASC')
                                                ->filterEntidadAliada(request()->only('search'))->with('actividades', 'actividades.objetivoEspecifico', 'miembrosEntidadAliada', 'entidadAliadaIdi', 'entidadAliadaTaTp')->paginate(),
            'actividades'                   =>  Actividad::whereIn(
                                                    'objetivo_especifico_id',
                                                    $objetivoEspecificos->map(function ($objetivoEspecifico) {
                                                        return $objetivoEspecifico->id;
                                                    })
                                                )->orderBy('fecha_inicio', 'ASC')->get(),
            'tiposEntidadAliada'            =>  json_decode(Storage::get('json/tipos-entidades-aliadas.json'), true),
            'naturalezaEntidadAliada'       =>  json_decode(Storage::get('json/naturaleza-empresa.json'), true),
            'tiposEmpresa'                  =>  json_decode(Storage::get('json/tipos-empresa.json'), true),
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


        $entidadAliada = new EntidadAliada();
        $entidadAliada->tipo         = $request->tipo;
        $entidadAliada->nombre       = $request->nombre;
        $entidadAliada->naturaleza   = $request->naturaleza;
        $entidadAliada->tipo_empresa = $request->tipo_empresa;
        $entidadAliada->nit          = $request->nit;

        $entidadAliada->proyecto()->associate($proyecto);

        $entidadAliada->save();
        $request->merge(['entidad_aliada_id' => $entidadAliada->id]);

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

            $entidadAliadaIdi = EntidadAliadaLinea66::create($request->all());

            $entidadAliada->actividades()->attach($request->actividad_id);

             $request->validate([
                'carta_intencion'                           => 'required_if:tipo_convocatoria,1|nullable|file|max:10240',
                'carta_propiedad_intelectual'               => 'required_if:tipo_convocatoria,1|nullable|file|max:10240',
            ]);
            if ($request->hasFile('carta_intencion')) {
                $this->saveFilesSharepoint($request->carta_intencion, mb_strtoupper($convocatoria->descripcion) . ' ' . $convocatoria->year, $entidadAliadaIdi, 'carta_intencion');
            }

            if ($request->hasFile('carta_propiedad_intelectual')) {
                $this->saveFilesSharepoint($request->carta_propiedad_intelectual, mb_strtoupper($convocatoria->descripcion) . ' ' . $convocatoria->year, $entidadAliadaIdi, 'carta_propiedad_intelectual');
            }

            return redirect()->route('convocatorias.proyectos.entidades-aliadas.edit', [$convocatoria, $proyecto, $entidadAliada])->with('success', 'El recurso se ha creado correctamente.');
        } elseif ($proyecto->proyectoLinea70()->exists() || $proyecto->proyectoLinea69()->exists()) {
            $request->validate([
                'fecha_inicio_convenio'         => 'required|date|date_format:Y-m-d|before:fecha_fin_convenio',
                'fecha_fin_convenio'            => 'required|date|date_format:Y-m-d|after:fecha_inicio_convenio',
            ]);

            $entidadAliadaTaTp = EntidadAliadaTaTp::create($request->all());

            $request->validate([
                'soporte_convenio' > 'nullable|file|max:10240',
            ]);
            if ($request->hasFile('soporte_convenio')) {
                $this->saveFilesSharepoint($request->soporte_convenio, mb_strtoupper($convocatoria->descripcion) . ' ' . $convocatoria->year, $entidadAliadaTaTp, 'soporte_convenio');
            }

            return redirect()->route('convocatorias.proyectos.entidades-aliadas.index', [$convocatoria, $proyecto])->with('success', 'El recurso se ha creado correctamente.');
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\EntidadAliada  $entidadAliada
     * @return \Illuminate\Http\Response
     */
    public function show(Convocatoria $convocatoria, Proyecto $proyecto, EntidadAliada $entidadAliada)
    {
        $this->authorize('visualizar-proyecto-autor', $proyecto);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\EntidadAliada  $entidadAliada
     * @return \Illuminate\Http\Response
     */
    public function edit(Convocatoria $convocatoria, Proyecto $proyecto, EntidadAliada $entidadAliada)
    {
        $this->authorize('visualizar-proyecto-autor', $proyecto);

        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\EntidadAliada  $entidadAliada
     * @return \Illuminate\Http\Response
     */
    public function update(EntidadAliadaRequest $request, Convocatoria $convocatoria, Proyecto $proyecto, EntidadAliada $entidadAliada)
    {
        $this->authorize('modificar-proyecto-autor', $proyecto);

        $entidadAliada->tipo         = $request->tipo;
        $entidadAliada->nombre       = $request->nombre;
        $entidadAliada->naturaleza   = $request->naturaleza;
        $entidadAliada->tipo_empresa = $request->tipo_empresa;
        $entidadAliada->nit          = $request->nit;

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

            $entidadAliadaIdi = $entidadAliada->entidadAliadaIdi;

            $entidadAliadaIdi->update($request->all());

            $entidadAliada->actividades()->attach($request->actividad_id);

             $request->validate([
                'carta_intencion'                           => 'required_if:tipo_convocatoria,1|nullable|file|max:10240',
                'carta_propiedad_intelectual'               => 'required_if:tipo_convocatoria,1|nullable|file|max:10240',
            ]);
            if ($request->hasFile('carta_intencion')) {
                $this->saveFilesSharepoint($request->carta_intencion, mb_strtoupper($convocatoria->descripcion) . ' ' . $convocatoria->year, $entidadAliadaIdi, 'carta_intencion');
            }

            if ($request->hasFile('carta_propiedad_intelectual')) {
                $this->saveFilesSharepoint($request->carta_propiedad_intelectual, mb_strtoupper($convocatoria->descripcion) . ' ' . $convocatoria->year, $entidadAliadaIdi, 'carta_propiedad_intelectual');
            }

            return redirect()->route('convocatorias.proyectos.entidades-aliadas.edit', [$convocatoria, $proyecto, $entidadAliada])->with('success', 'El recurso se ha creado correctamente.');
        } elseif ($proyecto->proyectoLinea70()->exists() || $proyecto->proyectoLinea69()->exists()) {
            $request->validate([
                'fecha_inicio_convenio'         => 'required|date|date_format:Y-m-d|before:fecha_fin_convenio',
                'fecha_fin_convenio'            => 'required|date|date_format:Y-m-d|after:fecha_inicio_convenio',
            ]);

            $entidadAliadaTaTp = $entidadAliada->entidadAliadaTaTp;

            $entidadAliadaTaTp->update($request->all());

            $request->validate([
                'soporte_convenio' > 'nullable|file|max:10240',
            ]);
            if ($request->hasFile('soporte_convenio')) {
                $this->saveFilesSharepoint($request->soporte_convenio, mb_strtoupper($convocatoria->descripcion) . ' ' . $convocatoria->year, $entidadAliadaTaTp, 'soporte_convenio');
            }

            return redirect()->route('convocatorias.proyectos.entidades-aliadas.index', [$convocatoria, $proyecto])->with('success', 'El recurso se ha creado correctamente.');
        }

        return back()->with('success', 'El recurso se ha actualizado correctamente.');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\EntidadAliada  $entidadAliada
     * @return \Illuminate\Http\Response
     */
    public function destroy(Convocatoria $convocatoria, Proyecto $proyecto, EntidadAliada $entidadAliada)
    {
        $this->authorize('modificar-proyecto-autor', $proyecto);

        $entidadAliada->delete();

        return redirect()->route('convocatorias.proyectos.entidades-aliadas.index', [$convocatoria, $proyecto])->with('success', 'El recurso se ha eliminado correctamente.');
    }

    public function saveFilesSharepoint($tmp_file, $modulo, $modelo, $campo_bd)
    {
        $entidadAliada  = $modelo;
        $proyecto       = Proyecto::find($entidadAliada->entidadAliada->proyecto_id);

        $entidadAliadaSharePoint = $proyecto->centroFormacion->nombre_carpeta_sharepoint . '/' . $proyecto->lineaProgramatica->codigo . '/' . $proyecto->codigo . '/ENTIDADES ALIADAS';

        $sharepoint_path = "$modulo/$entidadAliadaSharePoint";

        SharepointHelper::saveFilesSharepoint($tmp_file, $modelo, $sharepoint_path, $campo_bd);
    }

    public function downloadServerFile(Request $request, Convocatoria $convocatoria, Proyecto $proyecto, EntidadAliada $entidadAliada)
    {
        if ($entidadAliada->entidadAliadaIdi()->exists()) {
            $entidadAliada->entidadAliadaIdi->ruta_final_sharepoint = $proyecto->centroFormacion->nombre_carpeta_sharepoint . '/' . $proyecto->lineaProgramatica->codigo . '/' . $proyecto->codigo . '/ENTIDADES ALIADAS';
            SharepointHelper::downloadServerFile($entidadAliada->entidadAliadaIdi, $request->formato);
        } else if ($entidadAliada->entidadAliadaTaTp()->exists()) {
            $entidadAliada->entidadAliadaTaTp->ruta_final_sharepoint = $proyecto->centroFormacion->nombre_carpeta_sharepoint . '/' . $proyecto->lineaProgramatica->codigo . '/' . $proyecto->codigo . '/ENTIDADES ALIADAS';
            SharepointHelper::downloadServerFile($entidadAliada->entidadAliadaTaTp, $request->formato);
        }
    }

    public function downloadFileSharepoint(Convocatoria $convocatoria, Proyecto $proyecto, EntidadAliada $entidadAliada, $tipo_archivo)
    {
        $sharepoint_path = '';
        if ($entidadAliada->entidadAliadaIdi()->exists()) {
            $sharepoint_path = $entidadAliada->entidadAliadaIdi[$tipo_archivo];
        } else if ($entidadAliada->entidadAliadaTaTp()->exists()) {
            $sharepoint_path = $entidadAliada->entidadAliadaTaTp[$tipo_archivo];
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

    public function validarEntidadAliada(Request $request, Convocatoria $convocatoria, Evaluacion $evaluacion, EntidadAliada $entidadAliada)
    {
        if ($evaluacion->evaluacionProyectoLinea66()->exists()) {
            $evaluacion->evaluacionProyectoLinea66()->update([
                'entidad_aliada_verificada' => $request->entidad_aliada_verificada
            ]);
        }

        return back()->with('success', 'El recurso se ha actualizado correctamente.');
    }
}
