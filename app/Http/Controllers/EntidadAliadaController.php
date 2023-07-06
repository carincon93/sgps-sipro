<?php

namespace App\Http\Controllers;

use App\Helpers\SharepointHelper;
use App\Http\Requests\EntidadAliadaRequest;
use App\Models\Convocatoria;
use App\Models\Proyecto;
use App\Models\EntidadAliada;
use App\Models\Actividad;
use App\Models\EntidadAliadaIdi;
use App\Models\EntidadAliadaTaTp;
use App\Models\Evaluacion\Evaluacion;
use App\Models\Evaluacion\TaEvaluacion;
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

        $proyecto->load('evaluaciones.idiEvaluacion');
        $proyecto->load('evaluaciones.taEvaluacion');

        $proyecto->codigo_linea_programatica = $proyecto->lineaProgramatica->codigo;

        if ($proyecto->codigo_linea_programatica == 70) {
            $proyecto->infraestructura_tecnoacademia = $proyecto->ta->infraestructura_tecnoacademia;
        }

        /**
         * Si el proyecto es de la línea programática 23 o 65 se prohibe el acceso. No requiere de entidades aliadas
         */
        if ($proyecto->codigo_linea_programatica == 23 || $proyecto->codigo_linea_programatica == 65 || $proyecto->codigo_linea_programatica == 68) {
            return redirect()->route('convocatorias.proyectos.analisis-riesgos.index', [$convocatoria, $proyecto])->with('error', 'Esta línea programática no requiere de entidades aliadas');
        }

        return Inertia::render('Convocatorias/Proyectos/EntidadesAliadas/Index', [
            'convocatoria'      => $convocatoria->only('id', 'esta_activa', 'fase_formateada', 'fase', 'tipo_convocatoria', 'mostrar_recomendaciones'),
            'proyecto'          => $proyecto->only('id', 'codigo_linea_programatica', 'precio_proyecto', 'modificable', 'infraestructura_tecnoacademia', 'evaluaciones', 'mostrar_recomendaciones', 'PdfVersiones', 'all_files', 'allowed'),
            'filters'           => request()->all('search'),
            'entidadesAliadas'  => EntidadAliada::where('proyecto_id', $proyecto->id)->orderBy('nombre', 'ASC')
                ->filterEntidadAliada(request()->only('search'))->select('id', 'nombre', 'tipo')->paginate(),
            'infraestructuraTecnoacademia'  => json_decode(Storage::get('json/infraestructura-tecnoacademia.json'), true)
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

        $objetivoEspecifico = $proyecto->causasDirectas()->with('objetivoEspecifico')->get()->pluck('objetivoEspecifico')->flatten()->filter();

        $proyecto->codigo_linea_programatica = $proyecto->lineaProgramatica->codigo;

        return Inertia::render('Convocatorias/Proyectos/EntidadesAliadas/Create', [
            'convocatoria'  => $convocatoria->only('id', 'esta_activa', 'fase_formateada', 'fase', 'tipo_convocatoria', 'tipo_convocatoria'),
            'proyecto'      => $proyecto->only('id', 'codigo_linea_programatica', 'modificable', 'mostrar_recomendaciones', 'allowed'),
            'actividades'   => Actividad::whereIn(
                'objetivo_especifico_id',
                $objetivoEspecifico->map(function ($objetivoEspecifico) {
                    return $objetivoEspecifico->id;
                })
            )->orderBy('fecha_inicio', 'ASC')->get(),
            'tiposEntidadAliada'            => json_decode(Storage::get('json/tipos-entidades-aliadas.json'), true),
            'naturalezaEntidadAliada'       => json_decode(Storage::get('json/naturaleza-empresa.json'), true),
            'tiposEmpresa'                  => json_decode(Storage::get('json/tipos-empresa.json'), true),
        ]);
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

        if ($proyecto->idi()->exists()) {
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

            $entidadAliadaIdi = EntidadAliadaIdi::create($request->all());

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
        } elseif ($proyecto->ta()->exists() || $proyecto->tp()->exists()) {
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

        $objetivoEspecificos = $proyecto->causasDirectas()->with('objetivoEspecifico')->get()->pluck('objetivoEspecifico')->flatten()->filter();

        $entidadAliada->miembrosEntidadAliada->only('id', 'nombre', 'email', 'numero_celular');
        $entidadAliada->entidadAliadaIdi;
        $entidadAliada->entidadAliadaTaTp;

        $proyecto->codigo_linea_programatica = $proyecto->lineaProgramatica->codigo;

        return Inertia::render('Convocatorias/Proyectos/EntidadesAliadas/Edit', [
            'convocatoria'    => $convocatoria->only('id', 'esta_activa', 'fase_formateada', 'fase', 'tipo_convocatoria'),
            'proyecto'        => $proyecto->only('id', 'modificable', 'codigo_linea_programatica', 'mostrar_recomendaciones', 'allowed'),
            'entidadAliada'   => $entidadAliada,
            'actividades'     => Actividad::whereIn(
                'objetivo_especifico_id',
                $objetivoEspecificos->map(function ($objetivoEspecifico) {
                    return $objetivoEspecifico->id;
                })
            )->orderBy('fecha_inicio', 'ASC')->get(),
            'actividadesRelacionadas'           => $entidadAliada->actividades()->pluck('actividades.id'),
            'objetivosEspecificosRelacionados'  => $entidadAliada->actividades()->with('objetivoEspecifico')->get()->pluck('objetivoEspecifico'),
            'tiposEntidadAliada'                => json_decode(Storage::get('json/tipos-entidades-aliadas.json'), true),
            'naturalezaEntidadAliada'           => json_decode(Storage::get('json/naturaleza-empresa.json'), true),
            'tiposEmpresa'                      => json_decode(Storage::get('json/tipos-empresa.json'), true),
        ]);
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

        if ($proyecto->idi()->exists()) {
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
        } elseif ($proyecto->ta()->exists() || $proyecto->tp()->exists()) {
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

    public function saveFilesSharepoint($tmpFile, $modulo, $modelo, $campoBd)
    {
        $entidadAliada  = $modelo;
        $proyecto       = Proyecto::find($entidadAliada->entidadAliada->proyecto_id);

        $entidadAliadaSharePoint = $proyecto->centroFormacion->nombre_carpeta_sharepoint . '/' . $proyecto->lineaProgramatica->codigo . '/' . $proyecto->codigo . '/ENTIDADES ALIADAS';

        $sharePointPath = "$modulo/$entidadAliadaSharePoint";

        SharepointHelper::saveFilesSharepoint($tmpFile, $modelo, $sharePointPath, $campoBd);
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

    public function downloadFileSharepoint(Convocatoria $convocatoria, Proyecto $proyecto, EntidadAliada $entidadAliada, $tipoArchivo)
    {
        $sharePointPath = '';
        if ($entidadAliada->entidadAliadaIdi()->exists()) {
            $sharePointPath = $entidadAliada->entidadAliadaIdi[$tipoArchivo];
        } else if ($entidadAliada->entidadAliadaTaTp()->exists()) {
            $sharePointPath = $entidadAliada->entidadAliadaTaTp[$tipoArchivo];
        }

        SharepointHelper::downloadFile($sharePointPath);
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function showEntidadesAliadasEvaluacion(Convocatoria $convocatoria, Evaluacion $evaluacion)
    {
        $this->authorize('visualizar-evaluacion-autor', $evaluacion);

        $evaluacion->proyecto->codigo_linea_programatica = $evaluacion->proyecto->lineaProgramatica->codigo;

        /**
         * Si el proyecto es de la línea programática 23 o 65 se prohibe el acceso. No requiere de entidades aliadas
         */
        if ($evaluacion->proyecto->codigo_linea_programatica == 23 || $evaluacion->proyecto->codigo_linea_programatica == 65 || $evaluacion->proyecto->codigo_linea_programatica == 68) {
            return redirect()->route('convocatorias.evaluaciones.analisis-riesgos', [$convocatoria, $evaluacion->proyecto])->with('error', 'Esta línea programática no requiere de entidades aliadas');
        }

        $tipo = 'Sin información';
        if ($evaluacion->idiEvaluacion()->exists() && $evaluacion->idiEvaluacion->entidad_aliada_verificada) {
            if ($evaluacion->proyecto->codigo_linea_programatica == 66) {
                $puntaje = 0;
                $tipo = '';
                $detener = false;
                foreach ($evaluacion->proyecto->entidadesAliadas as $entidadAliada) {
                    if ($entidadAliada->tipo == 'Universidad' || $entidadAliada->tipo == 'Centro de formación SENA') {
                        // Universidad / Centro de formación SENA
                        $puntaje = 5;
                        $detener = true;
                        $tipo = $entidadAliada->tipo;
                    } else if ($entidadAliada->tipo == 'Empresa' && $detener == false || $entidadAliada->tipo == 'Entidades sin ánimo de lucro' && $detener == false || $entidadAliada->tipo == 'Otra' && $detener == false) {
                        // Empresa / Entidades sin ánimo de lucro / Otra
                        $puntaje = 2.5;
                        $tipo = $entidadAliada->tipo;
                    }
                }

                $evaluacion->idiEvaluacion()->update([
                    'entidad_aliada_puntaje' => $puntaje
                ]);
            } else if ($evaluacion->proyecto->codigo_linea_programatica == 82) {
                $puntaje = 0;
                $tipo = '';
                $detener = false;
                foreach ($evaluacion->proyecto->entidadesAliadas as $entidadAliada) {
                    if ($entidadAliada->tipo == 'Empresa' || $entidadAliada->tipo == 'Entidades sin ánimo de lucro' || $entidadAliada->tipo == 'Otra' || $entidadAliada->tipo == 'Centro de formación SEN') {
                        // Empresa / Entidades sin ánimo de lucro / Otra / Centro de formación SENA
                        $puntaje = 5;
                        $detener = true;
                        $tipo = $entidadAliada->tipo;
                    } else if ($entidadAliada->tipo == 'Universidad' && $detener == false) {
                        // Universidad
                        $puntaje = 2.5;
                        $tipo = $entidadAliada->tipo;
                    }
                }

                $evaluacion->idiEvaluacion()->update([
                    'entidad_aliada_puntaje' => $puntaje
                ]);
            }

            $evaluacion->entidad_aliada_puntaje = $puntaje;
        } else {
            $evaluacion->entidad_aliada_puntaje = 0;
        }

        $otrasEvaluaciones = null;
        switch ($evaluacion->proyecto) {
            case $evaluacion->proyecto->ta()->exists():
                $ta = $evaluacion->proyecto->ta;

                $otrasEvaluaciones = TaEvaluacion::with('evaluacion.evaluador')->whereHas('evaluacion', function ($query) use ($ta) {
                    $query->where('evaluaciones.proyecto_id', $ta->id)->where('evaluaciones.habilitado', true);
                })->where('ta_evaluaciones.id', '!=', $evaluacion->taEvaluacion->id)->get();
                break;
            default:
                break;
        }

        return Inertia::render('Convocatorias/Evaluaciones/EntidadesAliadas/Index', [
            'convocatoria'      => $convocatoria->only('id', 'esta_activa', 'fase_formateada', 'fase', 'tipo_convocatoria'),
            'evaluacion'        => $evaluacion,
            'proyecto'          => $evaluacion->proyecto->only('id', 'codigo_linea_programatica', 'precio_proyecto', 'finalizado'),
            'tipoEntidad'       => $tipo,
            'otrasEvaluaciones' => $otrasEvaluaciones,
            'filters'           => request()->all('search'),
            'entidadesAliadas'  => EntidadAliada::where('proyecto_id', $evaluacion->proyecto->id)->orderBy('nombre', 'ASC')
                ->filterEntidadAliada(request()->only('search'))->select('id', 'nombre', 'tipo')->paginate(),
            'infraestructuraTecnoacademia'  => json_decode(Storage::get('json/infraestructura-tecnoacademia.json'), true)

        ]);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\EntidadAliada  $entidadAliada
     * @return \Illuminate\Http\Response
     */
    public function entidadAliadaEvaluacion(Convocatoria $convocatoria, Evaluacion $evaluacion, EntidadAliada $entidadAliada)
    {
        $this->authorize('visualizar-evaluacion-autor', $evaluacion);

        $objetivoEspecificos = $evaluacion->proyecto->causasDirectas()->with('objetivoEspecifico')->get()->pluck('objetivoEspecifico')->flatten()->filter();

        $entidadAliada->miembrosEntidadAliada->only('id', 'nombre', 'email', 'numero_celular');
        $entidadAliada->entidadAliadaIdi;
        $entidadAliada->entidadAliadaTaTp;

        $evaluacion->proyecto->codigo_linea_programatica = $evaluacion->proyecto->lineaProgramatica->codigo;

        return Inertia::render('Convocatorias/Evaluaciones/EntidadesAliadas/Edit', [
            'convocatoria'      => $convocatoria->only('id', 'esta_activa', 'fase_formateada', 'fase', 'tipo_convocatoria'),
            'evaluacion'        => $evaluacion->only('id'),
            'proyecto'          => $evaluacion->proyecto->only('id', 'codigo_linea_programatica'),
            'entidadAliada'     => $entidadAliada,
            'actividades'       => Actividad::whereIn(
                'objetivo_especifico_id',
                $objetivoEspecificos->map(function ($objetivoEspecifico) {
                    return $objetivoEspecifico->id;
                })
            )->orderBy('fecha_inicio', 'ASC')->get(),
            'actividadesRelacionadas'           => $entidadAliada->actividades()->pluck('actividades.id'),
            'objetivosEspecificosRelacionados'  => $entidadAliada->actividades()->with('objetivoEspecifico')->get()->pluck('objetivoEspecifico'),
            'tiposEntidadAliada'                => json_decode(Storage::get('json/tipos-entidades-aliadas.json'), true),
            'naturalezaEntidadAliada'           => json_decode(Storage::get('json/naturaleza-empresa.json'), true),
            'tiposEmpresa'                      => json_decode(Storage::get('json/tipos-empresa.json'), true),
            'infraestructuraTecnoacademia'      => json_decode(Storage::get('json/infraestructura-tecnoacademia.json'), true)
        ]);
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

        $evaluacion->taEvaluacion()->update([
            'entidad_aliada_comentario'   => $request->entidad_aliada_requiere_comentario == false ? $request->entidad_aliada_comentario : null
        ]);

        return back()->with('success', 'El recurso se ha actualizado correctamente.');
    }

    public function validarEntidadAliada(Request $request, Convocatoria $convocatoria, Evaluacion $evaluacion, EntidadAliada $entidadAliada)
    {
        if ($evaluacion->idiEvaluacion()->exists()) {
            $evaluacion->idiEvaluacion()->update([
                'entidad_aliada_verificada' => $request->entidad_aliada_verificada
            ]);
        }

        return back()->with('success', 'El recurso se ha actualizado correctamente.');
    }
}
