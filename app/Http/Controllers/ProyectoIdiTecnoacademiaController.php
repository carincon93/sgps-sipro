<?php

namespace App\Http\Controllers;

use App\Helpers\SharepointHelper;
use App\Helpers\SelectHelper;
use App\Models\ProyectoIdiTecnoacademia;
use App\Http\Controllers\Controller;
use App\Http\Requests\ProyectoIdiTecnoacademiaProductoRequest;
use App\Http\Requests\StoreProyectoIdiTecnoacademiaRequest;
use App\Http\Requests\UpdateProyectoIdiTecnoacademiaRequest;
use App\Models\CentroFormacion;
use App\Models\Proyecto;
use App\Models\ProyectoIdiTecnoacademiaProducto;
use App\Models\User;
use App\Rules\Email;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ProyectoIdiTecnoacademiaController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $this->authorize('create', [ProyectoIdiTecnoacademia::class]);

        return Inertia::render('ProyectosIdiTecnoacademia/Index', [
            'filters'                   => request()->all('search'),
            'proyectosIdiTecnoacademia' => ProyectoIdiTecnoacademia::getProyectosPorRol()->appends(['search' => request()->search]),
            'allowed_to_create'           => Gate::inspect('create', [ProyectoIdiTecnoacademia::class])->allowed()
        ]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        $this->authorize('create', [ProyectoIdiTecnoacademia::class]);

        return Inertia::render('ProyectosIdiTecnoacademia/Create', [
            'tecnoacademias'                    => SelectHelper::tecnoacademias(),
            'programasSennova'                  => SelectHelper::programasSennova(),
            'semillerosInvestigacion'           => SelectHelper::semillerosInvestigacion(),
            'proyectos'                         => Proyecto::selectRaw("id as value, CONCAT('SGPS-', id + 8000) as label")->orderBy('id', 'ASC')->get(),
            'beneficiados'                      => SelectHelper::tiposBeneficiadosTa(),
            'regionales'                        => SelectHelper::regionales(),
            'lineasTecnoacademia'               => SelectHelper::lineasTecnoacademia(),
            'municipios'                        => SelectHelper::municipios(),
            'estadosProyectoIdiTecnoacademia'   => json_decode(Storage::get('json/estados-proyecto-idi-tecnoacademia.json'), true),
            'roles'                             => json_decode(Storage::get('json/roles-sennova-ta.json'), true),
            'allowed_to_create'                 => Gate::inspect('create', [ProyectoIdiTecnoacademia::class])->allowed()
        ]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(StoreProyectoIdiTecnoacademiaRequest $request)
    {
        $this->authorize('create', [ProyectoIdiTecnoacademia::class]);

        /** @var \App\Models\User */
        $auth_user = Auth::user();

        $proyectoIdiTecnoacademia = new ProyectoIdiTecnoacademia();
        $proyectoIdiTecnoacademia->titulo                               = $request->titulo;
        $proyectoIdiTecnoacademia->fecha_inicio                         = $request->fecha_inicio;
        $proyectoIdiTecnoacademia->fecha_finalizacion                   = $request->fecha_finalizacion;
        $proyectoIdiTecnoacademia->resumen                              = $request->resumen;
        $proyectoIdiTecnoacademia->palabras_clave                       = $request->palabras_clave;
        $proyectoIdiTecnoacademia->especies                             = $request->especies;
        $proyectoIdiTecnoacademia->tiene_linea_investigacion            = $request->tiene_linea_investigacion;
        $proyectoIdiTecnoacademia->lineas_investigacion                 = $request->lineas_investigacion;
        $proyectoIdiTecnoacademia->proyecto_nuevo                       = $request->proyecto_nuevo;
        $proyectoIdiTecnoacademia->proyecto_con_continuidad             = $request->proyecto_con_continuidad;
        $proyectoIdiTecnoacademia->productos_premios                    = $request->productos_premios;
        $proyectoIdiTecnoacademia->texto_exposicion                     = $request->texto_exposicion;
        $proyectoIdiTecnoacademia->resultados_obtenidos                 = $request->resultados_obtenidos;
        $proyectoIdiTecnoacademia->observaciones_resultados             = $request->observaciones_resultados;
        $proyectoIdiTecnoacademia->nombre_aprendices_vinculados         = $request->nombre_aprendices_vinculados;
        $proyectoIdiTecnoacademia->nombre_instituciones_educativas      = $request->nombre_instituciones_educativas;
        $proyectoIdiTecnoacademia->nuevas_instituciones_educativas      = $request->nuevas_instituciones_educativas;
        $proyectoIdiTecnoacademia->programa_formacion_articulado_media  = $request->programa_formacion_articulado_media;
        $proyectoIdiTecnoacademia->entidades_vinculadas                 = $request->entidades_vinculadas;
        $proyectoIdiTecnoacademia->fuente_recursos                      = $request->fuente_recursos;
        $proyectoIdiTecnoacademia->presupuesto                          = $request->presupuesto;
        $proyectoIdiTecnoacademia->hace_parte_de_semillero              = $request->hace_parte_de_semillero;
        $proyectoIdiTecnoacademia->estado_proyecto                      = $request->estado_proyecto;
        $proyectoIdiTecnoacademia->poblacion_beneficiada                = $request->poblacion_beneficiada;
        $proyectoIdiTecnoacademia->otra_poblacion_beneficiada           = $request->otra_poblacion_beneficiada;
        $proyectoIdiTecnoacademia->nombre_centro_programa               = $request->nombre_centro_programa;
        $proyectoIdiTecnoacademia->documentos_resultados                = '';
        $proyectoIdiTecnoacademia->pdf_proyecto                         = '';

        if ($request->proyecto_id) {
            $proyectoIdiTecnoacademia->proyecto()->associate($request->proyecto_id);
        }
        $proyectoIdiTecnoacademia->tecnoacademia()->associate($request->tecnoacademia_id);
        $proyectoIdiTecnoacademia->semilleroInvestigacion()->associate($request->semillero_investigacion_id);

        if ($proyectoIdiTecnoacademia->save()) {

            if ($request->hasFile('pdf_proyecto')) {
                return $this->saveFilesSharepoint($request, $proyectoIdiTecnoacademia);
            }

            if ($request->hasFile('documentos_resultados')) {
                return $this->saveFilesSharepoint($request, $proyectoIdiTecnoacademia);
            }

            $proyectoIdiTecnoacademia->municipios()->attach($request->municipios);
            $proyectoIdiTecnoacademia->programasSennova()->attach($request->programa_sennova_participante);
            $proyectoIdiTecnoacademia->beneficiados()->attach($request->beneficiados);
            $proyectoIdiTecnoacademia->lineas()->attach($request->tecnoacademia_linea_tecnoacademia_id);

            $proyectoIdiTecnoacademia->participantes()->attach($auth_user->id, ['rol_sennova' => $request->rol_sennova['value'], 'cantidad_meses' => $request->cantidad_meses, 'cantidad_horas' => $request->cantidad_horas, 'autor_principal' => true]);
        }

        return redirect()->route('proyectos-idi-tecnoacademia.participantes.index', $proyectoIdiTecnoacademia)->with('success', 'El recurso se ha creado correctamente.');
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\ProyectoIdiTecnoacademia  $proyectoIdiTecnoacademia
     * @return \Illuminate\Http\Response
     */
    public function show(ProyectoIdiTecnoacademia $proyectoIdiTecnoacademia)
    {
        $this->authorize('view', [ProyectoIdiTecnoacademia::class, $proyectoIdiTecnoacademia]);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\ProyectoIdiTecnoacademia  $proyectoIdiTecnoacademia
     * @return \Illuminate\Http\Response
     */
    public function edit(ProyectoIdiTecnoacademia $proyectoIdiTecnoacademia)
    {
        $this->authorize('update', [ProyectoIdiTecnoacademia::class, $proyectoIdiTecnoacademia]);

        return Inertia::render('ProyectosIdiTecnoacademia/Edit', [
            'proyectoIdiTecnoacademia'          => $proyectoIdiTecnoacademia,
            'tecnoacademias'                    => SelectHelper::tecnoacademias(),
            'programasSennova'                  => SelectHelper::programasSennova(),
            'semillerosInvestigacion'           => SelectHelper::semillerosInvestigacion(),
            'beneficiados'                      => SelectHelper::tiposBeneficiadosTa(),
            'proyectos'                         => Proyecto::selectRaw("id as value, id + 8000 as label")->orderBy('id', 'ASC')->get(),
            'regionales'                        => SelectHelper::regionales(),
            'lineasTecnoacademia'               => SelectHelper::lineasTecnoacademia()->where('tecnoacademia_id', $proyectoIdiTecnoacademia->tecnoacademia_id)->values()->all(),
            'municipios'                        => SelectHelper::municipios(),
            'lineasRelacionadas'                => $proyectoIdiTecnoacademia->lineas()->select('tecnoacademia_linea_tecnoacademia.id as value', 'lineas_tecnoacademia.nombre')->join('lineas_tecnoacademia', 'tecnoacademia_linea_tecnoacademia.linea_tecnoacademia_id', 'lineas_tecnoacademia.id')->get(),
            'programasRelacionados'             => $proyectoIdiTecnoacademia->programasSennova()->select('programas_sennova.id as value', 'programas_sennova.nombre as label')->get(),
            'beneficiadosRelacionados'          => $proyectoIdiTecnoacademia->beneficiados()->select('tipos_beneficiados_linea_70.id as value', 'tipos_beneficiados_linea_70.nombre as label')->get(),
            'municipiosRelacionados'            => $proyectoIdiTecnoacademia->municipios()->select('municipios.id as value', 'municipios.nombre as label', 'regionales.nombre as group', 'regionales.codigo')->join('regionales', 'regionales.id', 'municipios.regional_id')->get(),
            'autorPrincipal'                    => $proyectoIdiTecnoacademia->participantes()->where('proyecto_idi_tecnoacademia_participante.autor_principal', true)->first(),
            'estadosProyectoIdiTecnoacademia'   => json_decode(Storage::get('json/estados-proyecto-idi-tecnoacademia.json'), true),
            'roles'                             => json_decode(Storage::get('json/roles-sennova-ta.json'), true),
        ]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\ProyectoIdiTecnoacademia  $proyectoIdiTecnoacademia
     * @return \Illuminate\Http\Response
     */
    public function update(UpdateProyectoIdiTecnoacademiaRequest $request, ProyectoIdiTecnoacademia $proyectoIdiTecnoacademia)
    {
        $this->authorize('update', [ProyectoIdiTecnoacademia::class, $proyectoIdiTecnoacademia]);

        $proyectoIdiTecnoacademia->titulo                               = $request->titulo;
        $proyectoIdiTecnoacademia->fecha_inicio                         = $request->fecha_inicio;
        $proyectoIdiTecnoacademia->fecha_finalizacion                   = $request->fecha_finalizacion;
        $proyectoIdiTecnoacademia->resumen                              = $request->resumen;
        $proyectoIdiTecnoacademia->palabras_clave                       = $request->palabras_clave;
        $proyectoIdiTecnoacademia->especies                             = $request->especies;
        $proyectoIdiTecnoacademia->tiene_linea_investigacion            = $request->tiene_linea_investigacion;
        $proyectoIdiTecnoacademia->lineas_investigacion                 = $request->lineas_investigacion;
        $proyectoIdiTecnoacademia->proyecto_nuevo                       = $request->proyecto_nuevo;
        $proyectoIdiTecnoacademia->proyecto_con_continuidad             = $request->proyecto_con_continuidad;
        $proyectoIdiTecnoacademia->productos_premios                    = $request->productos_premios;
        $proyectoIdiTecnoacademia->texto_exposicion                     = $request->texto_exposicion;
        $proyectoIdiTecnoacademia->resultados_obtenidos                 = $request->resultados_obtenidos;
        $proyectoIdiTecnoacademia->observaciones_resultados             = $request->observaciones_resultados;
        $proyectoIdiTecnoacademia->nombre_aprendices_vinculados         = $request->nombre_aprendices_vinculados;
        $proyectoIdiTecnoacademia->nombre_instituciones_educativas      = $request->nombre_instituciones_educativas;
        $proyectoIdiTecnoacademia->nuevas_instituciones_educativas      = $request->nuevas_instituciones_educativas;
        $proyectoIdiTecnoacademia->programa_formacion_articulado_media  = $request->programa_formacion_articulado_media;
        $proyectoIdiTecnoacademia->entidades_vinculadas                 = $request->entidades_vinculadas;
        $proyectoIdiTecnoacademia->fuente_recursos                      = $request->fuente_recursos;
        $proyectoIdiTecnoacademia->presupuesto                          = $request->presupuesto;
        $proyectoIdiTecnoacademia->hace_parte_de_semillero              = $request->hace_parte_de_semillero;
        $proyectoIdiTecnoacademia->estado_proyecto                      = $request->estado_proyecto;
        $proyectoIdiTecnoacademia->poblacion_beneficiada                = $request->poblacion_beneficiada;
        $proyectoIdiTecnoacademia->otra_poblacion_beneficiada           = $request->otra_poblacion_beneficiada;
        $proyectoIdiTecnoacademia->nombre_centro_programa               = $request->nombre_centro_programa;

        if ($request->proyecto_id) {
            $proyectoIdiTecnoacademia->proyecto()->associate($request->proyecto_id);
        }

        $proyectoIdiTecnoacademia->tecnoacademia()->associate($request->tecnoacademia_id);
        $proyectoIdiTecnoacademia->semilleroInvestigacion()->associate($request->semillero_investigacion_id);

        if ($proyectoIdiTecnoacademia->save()) {
            if ($request->hasFile('pdf_proyecto')) {
                return $this->saveFilesSharepoint($request, $proyectoIdiTecnoacademia);
            }

            if ($request->hasFile('documentos_resultados')) {
                return $this->saveFilesSharepoint($request, $proyectoIdiTecnoacademia);
            }
        }

        $proyectoIdiTecnoacademia->municipios()->sync($request->municipios);
        $proyectoIdiTecnoacademia->programasSennova()->sync($request->programa_sennova_participante);
        $proyectoIdiTecnoacademia->beneficiados()->sync($request->beneficiados);
        $proyectoIdiTecnoacademia->lineas()->sync($request->tecnoacademia_linea_tecnoacademia_id);

        $autorPrincipal = $proyectoIdiTecnoacademia->participantes()->where('proyecto_idi_tecnoacademia_participante.autor_principal', true)->first();
        if ($autorPrincipal) {
            $proyectoIdiTecnoacademia->participantes()->updateExistingPivot($autorPrincipal->id, ['rol_sennova' => $request->rol_sennova['value'], 'cantidad_meses' => $request->cantidad_meses, 'cantidad_horas' => $request->cantidad_horas]);
        }

        return redirect()->route('proyectos-idi-tecnoacademia.participantes.index', $proyectoIdiTecnoacademia)->with('success', 'Por favor continue asociando los participantes.');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\ProyectoIdiTecnoacademia  $proyectoIdiTecnoacademia
     * @return \Illuminate\Http\Response
     */
    public function destroy(ProyectoIdiTecnoacademia $proyectoIdiTecnoacademia)
    {
        $this->authorize('update', [ProyectoIdiTecnoacademia::class, $proyectoIdiTecnoacademia]);

        $proyectoIdiTecnoacademia->delete();

        return redirect()->route('proyectos-idi-tecnoacademia.index')->with('success', 'El recurso se ha eliminado correctamente.');
    }

    public function saveFilesSharepoint(Request $request, ProyectoIdiTecnoacademia $proyectoIdiTecnoacademia)
    {
        $request->validate([
            'pdf_proyecto'          => 'nullable|file|max:10240|mimetypes:application/pdf',
            'documentos_resultados' => 'nullable|file|max:10240',
        ]);

        $response = [];

        if ($request->hasFile('pdf_proyecto')) {
            $response = SharepointHelper::saveFilesSharepoint($request, 'pdf_proyecto', $proyectoIdiTecnoacademia, $proyectoIdiTecnoacademia->id . 'pdf_proyecto');
        }

        if ($request->hasFile('documentos_resultados')) {
            $response = SharepointHelper::saveFilesSharepoint($request, 'documentos_resultados', $proyectoIdiTecnoacademia, $proyectoIdiTecnoacademia->id . 'documentos_resultados');
        }

        if (count($response) > 0 && $response['success']) {
            return back()->with('success', 'Los archivos se han cargado correctamente');
        } else if (count($response) > 0 && $response['success'] == false) {
            return back()->with('error', 'No se han podido cargar los archivos. Por favor vuelva a intentar');
        }
    }

    public function downloadServerFile(Request $request, ProyectoIdiTecnoacademia $proyectoIdiTecnoacademia)
    {
        SharepointHelper::downloadServerFile($proyectoIdiTecnoacademia, $request->formato);
    }

    public function downloadFileSharepoint(ProyectoIdiTecnoacademia $proyectoIdiTecnoacademia, $tipo_archivo)
    {
        $sharepoint_path = $proyectoIdiTecnoacademia[$tipo_archivo];

        return SharepointHelper::downloadFile($sharepoint_path);
    }

    /**
     * indexParticipantes
     *
     * @param  mixed $proyectoIdiTecnoacademia
     * @return void
     */
    public function indexParticipantes(ProyectoIdiTecnoacademia $proyectoIdiTecnoacademia)
    {
        $this->authorize('update', [ProyectoIdiTecnoacademia::class, $proyectoIdiTecnoacademia]);

        $proyectoIdiTecnoacademia->participantes;
        $proyectoIdiTecnoacademia->load('participantes.centroFormacion.regional');

        return Inertia::render('ProyectosIdiTecnoacademia/Participantes/Index', [
            'proyectoIdiTecnoacademia'      => $proyectoIdiTecnoacademia,
            'centrosFormacion'              => CentroFormacion::selectRaw('centros_formacion.id as value, concat(centros_formacion.nombre, chr(10), \'∙ Código: \', centros_formacion.codigo, chr(10), \'∙ Regional: \', regionales.nombre) as label')->join('regionales', 'centros_formacion.regional_id', 'regionales.id')->orderBy('centros_formacion.nombre', 'ASC')->get(),
            'tiposDocumento'                => json_decode(Storage::get('json/tipos-documento.json'), true),
            'tiposVinculacion'              => json_decode(Storage::get('json/tipos-vinculacion.json'), true),
            'roles'                         => json_decode(Storage::get('json/roles-sennova-ta.json'), true),
            'autorPrincipal'                => $proyectoIdiTecnoacademia->participantes()->where('proyecto_idi_tecnoacademia_participante.autor_principal', true)->first(),
        ]);
    }

    /**
     * filterParticipantes
     *
     * @param  mixed $request
     * @param  mixed $proyecto
     * @return void
     */
    public function filterParticipantes(Request $request, ProyectoIdiTecnoacademia $proyectoIdiTecnoacademia)
    {
        if (!empty($request->search_participante)) {
            $query = User::orderBy('users.nombre', 'ASC')
                ->filterUser(['search' => $request->search_participante])
                ->with('centroFormacion.regional')->take(6);

            if ($proyectoIdiTecnoacademia->participantes->count() > 0) {
                $query->whereNotIn('users.id', explode(',', $proyectoIdiTecnoacademia->participantes->implode('id', ',')));
            }

            $users = $query->get()->take(5);

            return $users->makeHidden('can', 'roles', 'user_name', 'permissions')->toJson();
        }

        return null;
    }

    /**
     * linkParticipante
     *
     * @param  mixed $request
     * @param  mixed $proyectoIdiTecnoacademia
     * @return void
     */
    public function linkParticipante(Request $request, ProyectoIdiTecnoacademia $proyectoIdiTecnoacademia)
    {
        $this->authorize('update', [ProyectoIdiTecnoacademia::class, $proyectoIdiTecnoacademia]);

        if ($proyectoIdiTecnoacademia->participantes()->where('proyecto_idi_tecnoacademia_participante.id', $request->user_id)->exists()) {
            return back()->with('error', 'El recurso ya está vinculado.');
        }

        $proyectoIdiTecnoacademia->participantes()->attach($request->user_id, ['rol_sennova' => $request->rol_sennova['value'], 'cantidad_meses' => $request->cantidad_meses, 'cantidad_horas' => $request->cantidad_horas]);
        return back()->with('success', 'El recurso se ha vinculado correctamente.');
    }

    /**
     * unlinkParticipante
     *
     * @param  mixed $request
     * @param  mixed $proyectoIdiTecnoacademia
     * @return void
     */
    public function unlinkParticipante(Request $request, ProyectoIdiTecnoacademia $proyectoIdiTecnoacademia)
    {
        $this->authorize('update', [ProyectoIdiTecnoacademia::class, $proyectoIdiTecnoacademia]);

        $request->validate(['user_id' => 'required']);

        if ($proyectoIdiTecnoacademia->participantes()->where('proyecto_idi_tecnoacademia_participante.user_id', $request->user_id)->exists()) {
            $proyectoIdiTecnoacademia->participantes()->detach($request->user_id);
            return back()->with('success', 'El recurso se ha desvinculado correctamente.');
        }
        return back()->with('success', 'El recurso ya está desvinculado.');
    }


    public function updateParticipante(Request $request, ProyectoIdiTecnoacademia $proyectoIdiTecnoacademia)
    {
        $this->authorize('update', [ProyectoIdiTecnoacademia::class, $proyectoIdiTecnoacademia]);

        if ($proyectoIdiTecnoacademia->participantes()->where('users.id', $request->user_id)->exists()) {
            $proyectoIdiTecnoacademia->participantes()->updateExistingPivot($request->user_id, ['rol_sennova' => $request->rol_sennova['value'], 'cantidad_meses' => $request->cantidad_meses, 'cantidad_horas' => $request->cantidad_horas]);
            return back()->with('success', 'El recurso se ha actualizado correctamente.');
        }
        return back()->with('error', 'El recurso ya está desvinculado.');
    }

    /**
     * registerParticipante
     *
     * @param  mixed $request
     * @param  mixed $proyectoIdiTecnoacademia
     * @return void
     */
    public function registerParticipante(Request $request, ProyectoIdiTecnoacademia $proyectoIdiTecnoacademia)
    {
        $this->authorize('update', [ProyectoIdiTecnoacademia::class, $proyectoIdiTecnoacademia]);

        $request->validate(
            [
                'centro_formacion_id'   => 'required', 'min:0', 'max:2147483647', 'integer', 'exists:centros_formacion,id',
                'nombre'                => 'required', 'max:255', 'string',
                'email'                 => 'required', 'max:255', new Email, 'unique:users,email', 'email',
                'tipo_documento'        => 'required', 'max:2',
                'numero_documento'      => 'required', 'min:0', 'unique:users,numero_documento', 'max:9223372036854775807', 'integer',
                'numero_celular'        => 'required', 'min:0', 'max:9223372036854775807', 'integer',
                'tipo_vinculacion'      => 'required', 'max:191',
                'autorizacion_datos'    => 'required', 'boolean'
            ]
        );

        $user = new User();

        $user->nombre               = $request->nombre;
        $user->email                = $request->email;
        $user->password             = $user::makePassword($request->numero_documento);
        $user->tipo_documento       = $request->tipo_documento['value'];
        $user->numero_documento     = $request->numero_documento;
        $user->numero_celular       = $request->numero_celular;
        $user->habilitado           = 0;
        $user->tipo_vinculacion     = $request->tipo_vinculacion['value'];
        $user->autorizacion_datos   = $request->autorizacion_datos;
        $user->centroFormacion()->associate($request->centro_formacion_id);

        $user->save();

        $user->assignRole(14);

        $data['user_id']        = $user->id;
        $data['rol_sennova']    = $request->rol_sennova;
        $data['cantidad_meses'] = $request->cantidad_meses;
        $data['cantidad_horas'] = $request->cantidad_horas;

        return $this->linkParticipante(new Request($data), $proyectoIdiTecnoacademia);
    }

    /**
     * indexProductos
     *
     * @param  mixed $proyectoIdiTecnoacademia
     * @return void
     */
    public function indexProductos(ProyectoIdiTecnoacademia $proyectoIdiTecnoacademia)
    {
        $this->authorize('update', [ProyectoIdiTecnoacademia::class, $proyectoIdiTecnoacademia]);

        return Inertia::render('ProyectosIdiTecnoacademia/Productos/Index', [
            'proyectoIdiTecnoacademia'    => $proyectoIdiTecnoacademia,
            'productos'                   => ProyectoIdiTecnoacademiaProducto::where('proyecto_idi_tecnoacademia_id', $proyectoIdiTecnoacademia->id)->with('tipoProductoIdi')->paginate(15)
        ]);
    }

    public function createProducto(ProyectoIdiTecnoacademia $proyectoIdiTecnoacademia)
    {
        $this->authorize('update', [ProyectoIdiTecnoacademia::class, $proyectoIdiTecnoacademia]);

        return Inertia::render('ProyectosIdiTecnoacademia/Productos/Create', [
            'proyectoIdiTecnoacademia' => $proyectoIdiTecnoacademia,
            'tiposProductos'           => SelectHelper::tiposProductosIdi(),
            'estadosProductos'         => json_decode(Storage::get('json/estados-productos-ta.json'), true),
        ]);
    }

    public function storeProducto(ProyectoIdiTecnoacademiaProductoRequest $request, ProyectoIdiTecnoacademia $proyectoIdiTecnoacademia)
    {
        $this->authorize('update', [ProyectoIdiTecnoacademia::class, $proyectoIdiTecnoacademia]);

        $producto = new ProyectoIdiTecnoacademiaProducto();

        $producto->descripcion          = $request->descripcion;
        $producto->estado               = $request->estado;
        $producto->link                 = $request->link;
        $producto->lugar                = $request->lugar;
        $producto->fecha_realizacion    = $request->fecha_realizacion;
        $producto->tipoProductoIdi()->associate($request->tipo_productos_linea_66_id);
        $producto->proyectoIdiTecnoacademia()->associate($proyectoIdiTecnoacademia);

        if ($producto->save()) {
            if ($request->hasFile('soporte')) {
                $this->saveFilesProductoSharepoint($request, $proyectoIdiTecnoacademia, $producto);
            }
        }

        return redirect()->route('proyectos-idi-tecnoacademia.productos.index', $proyectoIdiTecnoacademia)->with('success', 'El recurso se ha creado correctamente.');
    }

    public function editProducto(ProyectoIdiTecnoacademia $proyectoIdiTecnoacademia, ProyectoIdiTecnoacademiaProducto $producto)
    {
        $this->authorize('update', [ProyectoIdiTecnoacademia::class, $proyectoIdiTecnoacademia]);

        $producto->resultado;

        return Inertia::render('ProyectosIdiTecnoacademia/Productos/Edit', [
            'proyectoIdiTecnoacademia'  => $proyectoIdiTecnoacademia,
            'producto'                  => $producto,
            'tiposProductos'            => SelectHelper::tiposProductosIdi(),
            'estadosProductos'          => json_decode(Storage::get('json/estados-productos-ta.json'), true),
        ]);
    }

    public function updateProducto(ProyectoIdiTecnoacademiaProductoRequest $request, ProyectoIdiTecnoacademia $proyectoIdiTecnoacademia, ProyectoIdiTecnoacademiaProducto $producto)
    {
        $this->authorize('update', [ProyectoIdiTecnoacademia::class, $proyectoIdiTecnoacademia]);

        $producto->descripcion          = $request->descripcion;
        $producto->estado               = $request->estado;
        $producto->link                 = $request->link;
        $producto->lugar                = $request->lugar;
        $producto->fecha_realizacion    = $request->fecha_realizacion;
        $producto->tipoProductoIdi()->associate($request->tipo_productos_linea_66_id);
        $producto->proyectoIdiTecnoacademia()->associate($proyectoIdiTecnoacademia);

        if ($producto->save()) {
            if ($request->hasFile('soporte')) {
                $this->saveFilesProductoSharepoint($request, $proyectoIdiTecnoacademia, $producto);
            }
        }

        return redirect()->back()->with('success', 'El recurso se ha actualizado correctamente.');
    }

    public function destroyProducto(ProyectoIdiTecnoacademia $proyectoIdiTecnoacademia, ProyectoIdiTecnoacademiaProducto $producto)
    {
        $this->authorize('update', [ProyectoIdiTecnoacademia::class, $proyectoIdiTecnoacademia]);

        $producto->delete();

        return redirect()->route('proyectos-idi-tecnoacademia.productos.index', $proyectoIdiTecnoacademia)->with('success', 'El recurso se ha eliminado correctamente.');
    }

    public function saveFilesProductoSharepoint(Request $request, ProyectoIdiTecnoacademia $proyectoIdiTecnoacademia, ProyectoIdiTecnoacademiaProducto $producto)
    {
        $request->validate([
            'soporte' => 'nullable|file|max:10240',
        ]);

        $response = [];

        if ($request->hasFile('soporte')) {
            $response = SharepointHelper::saveFilesSharepoint($request, 'soporte', $producto, $producto->id . 'soporte');
        }

        if (($response) && $response['success']) {
            return back()->with('success', 'Los archivos se han cargado correctamente');
        } else if (count($response) > 0 && $response['success'] == false) {
            return back()->with('error', 'No se han podido cargar los archivos. Por favor vuelva a intentar');
        }
    }

    public function downloadServerFileProducto(Request $request, ProyectoIdiTecnoacademia $proyectoIdiTecnoacademia, ProyectoIdiTecnoacademiaProducto $producto)
    {
        SharepointHelper::downloadServerFile($producto, $request->formato);
    }

    public function downloadFileProductoSharepoint(ProyectoIdiTecnoacademia $proyectoIdiTecnoacademia, ProyectoIdiTecnoacademiaProducto $producto, $tipo_archivo)
    {
        $sharepoint_path = $producto[$tipo_archivo];

        return SharepointHelper::downloadFile($sharepoint_path);
    }

    public function cambiarAutorPrincipal(ProyectoIdiTecnoacademia $proyectoIdiTecnoacademia, $integrante)
    {
        DB::table('proyecto_idi_tecnoacademia_participante')->where('proyecto_idi_tecnoacademia_participante.proyecto_idi_tecnoacademia_id', $proyectoIdiTecnoacademia->id)->where('proyecto_idi_tecnoacademia_participante.autor_principal', true)->update(['proyecto_idi_tecnoacademia_participante.autor_principal' => null]);
        DB::table('proyecto_idi_tecnoacademia_participante')->where('proyecto_idi_tecnoacademia_participante.proyecto_idi_tecnoacademia_id', $proyectoIdiTecnoacademia->id)->where('proyecto_idi_tecnoacademia_participante.user_id', $integrante)->update(['proyecto_idi_tecnoacademia_participante.autor_principal' => true]);

        return back()->with('success', 'Se ha actualizado correctamente el autor principal.');
    }
}
