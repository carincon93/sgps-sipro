<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\API\ApiController;

use App\Http\Controllers\ActividadController;
use App\Http\Controllers\AmbienteModernizacionController;
use App\Http\Controllers\AnalisisRiesgoController;
use App\Http\Controllers\AnexoController;
use App\Http\Controllers\ArbolProyectoController;
use App\Http\Controllers\ArticulacionSennovaController;
use App\Http\Controllers\CentroFormacionController;
use App\Http\Controllers\ConvocatoriaController;
use App\Http\Controllers\ConvocatoriaAnexoController;
use App\Http\Controllers\ConvocatoriaPresupuestoController;
use App\Http\Controllers\ConvocatoriaRolSennovaController;
use App\Http\Controllers\DisenoCurricularController;
use App\Http\Controllers\EdtController;
use App\Http\Controllers\EntidadAliadaController;
use App\Http\Controllers\GrupoInvestigacionController;
use App\Http\Controllers\InventarioEquipoController;
use App\Http\Controllers\LineaInvestigacionController;
use App\Http\Controllers\LineaProgramaticaController;
use App\Http\Controllers\LineaTecnicaController;
use App\Http\Controllers\LineaTecnoacademiaController;
use App\Http\Controllers\LineaTecnoparqueController;
use App\Http\Controllers\MesaSectorialController;
use App\Http\Controllers\MiembroEntidadAliadaController;
use App\Http\Controllers\NodoTecnoparqueController;
use App\Http\Controllers\PdfController;
use App\Http\Controllers\PrimerGrupoPresupuestalController;
use App\Http\Controllers\ProyectoAnexoController;
use App\Http\Controllers\ProyectoCapacidadInstaladaController;
use App\Http\Controllers\ProyectoController;
use App\Http\Controllers\ProyectoIdiTecnoacademiaController;
use App\Http\Controllers\ProyectoFormulario1Linea65Controller;
use App\Http\Controllers\ProyectoFormulario8Linea66Controller;
use App\Http\Controllers\ProyectoFormulario12Linea68Controller;
use App\Http\Controllers\ProyectoFormulario10Linea69Controller;
use App\Http\Controllers\ProyectoFormulario5Linea69Controller;
use App\Http\Controllers\ProyectoFormulario4Linea70Controller;
use App\Http\Controllers\ProyectoFormulario11Linea83Controller;
use App\Http\Controllers\ProyectoPresupuestoController;
use App\Http\Controllers\ProyectoRolSennovaController;
use App\Http\Controllers\ProductoController;
use App\Http\Controllers\ProgramaFormacionController;
use App\Http\Controllers\RedConocimientoController;
use App\Http\Controllers\RegionalController;
use App\Http\Controllers\ReporteController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\RolSennovaController;
use App\Http\Controllers\RubroPresupuestalController;
use App\Http\Controllers\SegundoGrupoPresupuestalController;
use App\Http\Controllers\SemilleroInvestigacionController;
use App\Http\Controllers\SoporteEstudioMercadoController;
use App\Http\Controllers\TecnoacademiaController;
use App\Http\Controllers\TematicaEstrategicaController;
use App\Http\Controllers\TercerGrupoPresupuestalController;
use App\Http\Controllers\UsoPresupuestalController;
use App\Http\Controllers\UserController;

use App\Http\Controllers\Evaluacion\EvaluacionController;
use App\Http\Controllers\HubInnovacionController;
use App\Http\Controllers\LaboratorioServicioTecnologicoController;
use App\Http\Controllers\Perfil\EstudioAcademicoController;
use App\Http\Controllers\Perfil\FormacionAcademicaSenaController;
use App\Http\Controllers\Perfil\ParticipacionGrupoInvestigacionSenaController;
use App\Http\Controllers\Perfil\ParticipacionProyectoSennovaController;
use App\Http\Controllers\ProyectoFormulario13Linea65Controller;
use App\Http\Controllers\ProyectoFormulario15Linea65Controller;
use App\Http\Controllers\ProyectoFormulario16Linea65Controller;
use App\Http\Controllers\ProyectoFormulario17Linea69Controller;
use App\Http\Controllers\ProyectoFormulario3Linea61Controller;
use App\Http\Controllers\ProyectoFormulario6Linea82Controller;
use App\Http\Controllers\ProyectoFormulario7Linea23Controller;
use App\Http\Controllers\ProyectoFormulario9Linea23Controller;
use App\Http\Controllers\TopePresupuestalNodoTecnoparqueController;
use App\Http\Controllers\TopeRolSennovaTecnoparqueController;
use App\Models\AulaMovil;
use App\Models\Convocatoria;
use App\Models\EntidadAliada;
use App\Models\GrupoInvestigacion;
use App\Models\LineaInvestigacion;
use App\Models\Proyecto;
use App\Models\Role;
use App\Models\SemilleroInvestigacion;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/
/**
 * Trae los centros de formación
 */
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('manual-usuario/download', [ProyectoController::class, 'downloadManualUsuario'])->name('manual-usuario.download');

    Route::get('/', function () {
        return Inertia::render('Dashboard', [
            'roles_sistema' => Role::whereIn('id', [6, 12, 13, 15, 16])->get()
        ]);
    })->name('dashboard');

    Route::get('/proyectos/{proyecto}/download-any-file/{fileId}/{file}', [ProyectoController::class, 'downloadFileSharepoint'])->name('proyectos.download-any-file');


    //Exporta proyecto post-cierre del ambiente de modernizacion en PDF
    Route::get('ambientes-modernizacion/{ambiente_modernizacion}/pdf', [AmbienteModernizacionController::class, 'descargarPdfAmbienteModernizacion'])->name('ambientes-modernizacion.descargar-pdf');

    /**
     * Trae las regionales
     *
     */
    Route::resource('regionales', RegionalController::class)->parameters(['regionales' => 'regional'])->except(['show']);

    /**
     * Centros de formación
     *
     */
    Route::resource('centros-formacion', CentroFormacionController::class)->except(['show'])->parameters(['centros-formacion' => 'centro-formacion']);

    /**
     * Programas de formación
     *
     */
    Route::resource('programas-formacion', ProgramaFormacionController::class)->parameters(['programas-formacion' => 'programa-formacion'])->except(['show']);

    /**
     * Temáticas estratégicas
     *
     */
    Route::resource('tematicas-estrategicas', TematicaEstrategicaController::class)->parameters(['tematicas-estrategicas' => 'tematica-estrategica'])->except(['show']);

    /**
     * Líneas técnicas
     *
     */
    Route::resource('lineas-tecnicas', LineaTecnicaController::class)->parameters(['lineas-tecnicas' => 'linea-tecnica'])->except(['show']);

    /**
     * Líneas programáticas
     *
     */
    Route::resource('lineas-programaticas', LineaProgramaticaController::class)->parameters(['lineas-programaticas' => 'linea-programatica'])->except(['show']);

    /**
     * Redes de conocimiento
     *
     */
    Route::resource('redes-conocimiento', RedConocimientoController::class)->parameters(['redes-conocimiento' => 'red-conocimiento'])->except(['show']);

    /**
     * Tecnoacademias
     *
     */
    Route::resource('tecnoacademias', TecnoacademiaController::class)->parameters(['tecnoacademias' => 'tecnoacademia'])->except(['show']);

    /**
     * Líneas Tecnoparque
     *
     */
    Route::resource('lineas-tecnoparque', LineaTecnoparqueController::class)->parameters(['lineas-tecnoparque' => 'linea-tecnoparque'])->except(['show']);

    /**
     * Líneas Tecnoacademia
     *
     */
    Route::resource('lineas-tecnoacademia', LineaTecnoacademiaController::class)->parameters(['lineas-tecnoacademia' => 'linea-tecnoacademia'])->except(['show']);

    /**
     * Hubs de innovacion
     *
     */
    Route::resource('hubs-innovacion', HubInnovacionController::class)->parameters(['hubs-innovacion' => 'hub-innovacion']);

    /**
     * Nodos Tecnoparque
     *
     */
    Route::resource('nodos-tecnoparque', NodoTecnoparqueController::class)->parameters(['nodos-tecnoparque' => 'nodo-tecnoparque']);

    /**
     * Laboratorios de Servicios Tecnológicos
     *
     */
    Route::resource('laboratorios-servicios-tecnologicos', LaboratorioServicioTecnologicoController::class)->parameters(['laboratorios-servicios-tecnologicos' => 'laboratorio-st']);

    /**
     * Grupos de investigación
     *
     */
    Route::get('grupos-investigacion/{grupo_investigacion}/download-file-sharepoint/{tipo_archivo}', [GrupoInvestigacionController::class, 'downloadFileSharepoint'])->name('grupos-investigacion.download-file-sharepoint');
    Route::get('grupos-investigacion/{grupo_investigacion}/download/{formato}', [GrupoInvestigacionController::class, 'downloadServerFile'])->name('grupos-investigacion.download');
    Route::put('grupos-investigacion/{grupo_investigacion}/upload-formato', function (GrupoInvestigacion $grupo_investigacion) {
        $controller = app(GrupoInvestigacionController::class);

        if (request()->hasFile('formato_gic_f_020')) {
            return $controller->uploadFormatoGicF020(request(), $grupo_investigacion);
        } elseif (request()->hasFile('formato_gic_f_032')) {
            return $controller->uploadFormatoGicF032(request(), $grupo_investigacion);
        } else {
            abort(404);
        }
    })->name('grupos-investigacion.upload-formato');

    Route::resource('grupos-investigacion', GrupoInvestigacionController::class)->parameters(['grupos-investigacion' => 'grupo-investigacion']);

    /**
     * Líneas de investigación
     *
     */
    Route::resource('grupos-investigacion.lineas-investigacion', LineaInvestigacionController::class)->parameters(['grupos-investigacion' => 'grupo-investigacion', 'lineas-investigacion' => 'linea-investigacion'])->except(['show']);

    /**
     * Semilleros de investigación
     *
     */
    Route::get('grupos-investigacion/{grupo_investigacion}/lineas-investigacion/{linea_investigacion}/semilleros-investigacion/{semillero_investigacion}/download-file-sharepoint/{tipo_archivo}', [SemilleroInvestigacionController::class, 'downloadFileSharepoint'])->name('grupos-investigacion.lineas-investigacion.semilleros-investigacion.download-file-sharepoint');
    Route::get('grupos-investigacion/{grupo_investigacion}/lineas-investigacion/{linea_investigacion}/semilleros-investigacion/{semillero_investigacion}/download/{formato}', [SemilleroInvestigacionController::class, 'downloadServerFile'])->name('grupos-investigacion.semilleros-investigacion.download');
    Route::get('semilleros-investigacion', [SemilleroInvestigacionController::class, 'semillerosInvestigacionNivelNacional'])->name('semilleros-investigacion.nivel-nacional');
    Route::put('grupos-investigacion/{grupo_investigacion}/lineas-investigacion/{linea_investigacion}/semilleros-investigacion/{semillero_investigacion}/upload-formato', function (GrupoInvestigacion $grupo_investigacion, LineaInvestigacion $linea_investigacion, SemilleroInvestigacion $semillero_investigacion) {
        $controller = app(SemilleroInvestigacionController::class);

        if (request()->hasFile('formato_gic_f_021')) {
            return $controller->uploadFormatoGicF021(request(), $semillero_investigacion);
        } elseif (request()->hasFile('formato_gic_f_032')) {
            return $controller->uploadFormatoGicF032(request(), $semillero_investigacion);
        } elseif (request()->hasFile('formato_aval_semillero')) {
            return $controller->uploadFormatoAvalSemillero(request(), $semillero_investigacion);
        } else {
            abort(404);
        }
    })->name('grupos-investigacion.lineas-investigacion.semilleros-investigacion.upload-formato');
    Route::resource('grupos-investigacion.lineas-investigacion.semilleros-investigacion', SemilleroInvestigacionController::class)->parameters(['grupos-investigacion' => 'grupo-investigacion', 'lineas-investigacion' => 'linea-investigacion', 'semilleros-investigacion' => 'semillero-investigacion'])->except(['show']);

    /**
     * Proyectos de capacidad instalada
     *
     */
    Route::post('proyectos-capacidad-instalada/{proyecto_capacidad_instalada}/{integrante}', [ProyectoCapacidadInstaladaController::class, 'cambiarAutorPrincipal'])->name('proyectos-capacidad-instalada.nuevo-autor-principal');
    Route::put('proyectos-capacidad-instalada/{proyecto_capacidad_instalada}/column/{column}', [ProyectoCapacidadInstaladaController::class, 'updateLongColumn'])->name('proyectos-capacidad-instalada.updateLongColumn');
    Route::get('proyectos-capacidad-instalada/{proyecto_capacidad_instalada}/objetivos-especificos', [ProyectoCapacidadInstaladaController::class, 'indexObjetivosEspecificos'])->name('proyectos-capacidad-instalada.objetivos-especificos.index');
    Route::get('proyectos-capacidad-instalada/{proyecto_capacidad_instalada}/objetivos-especificos/crear', [ProyectoCapacidadInstaladaController::class, 'createObjetivoEspecifico'])->name('proyectos-capacidad-instalada.objetivos-especificos.create');
    Route::post('proyectos-capacidad-instalada/{proyecto_capacidad_instalada}/objetivos-especificos/crear', [ProyectoCapacidadInstaladaController::class, 'storeObjetivoEspecifico'])->name('proyectos-capacidad-instalada.objetivos-especificos.store');
    Route::get('proyectos-capacidad-instalada/{proyecto_capacidad_instalada}/objetivos-especificos/{objetivo_especifico}/editar', [ProyectoCapacidadInstaladaController::class, 'editObjetivoEspecifico'])->name('proyectos-capacidad-instalada.objetivos-especificos.edit');
    Route::put('proyectos-capacidad-instalada/{proyecto_capacidad_instalada}/objetivos-especificos/{objetivo_especifico}/editar', [ProyectoCapacidadInstaladaController::class, 'updateObjetivoEspecifico'])->name('proyectos-capacidad-instalada.objetivos-especificos.update');
    Route::delete('proyectos-capacidad-instalada/{proyecto_capacidad_instalada}/objetivos-especificos/{objetivo_especifico}', [ProyectoCapacidadInstaladaController::class, 'destroyObjetivoEspecifico'])->name('proyectos-capacidad-instalada.objetivos-especificos.destroy');

    Route::get('proyectos-capacidad-instalada/{proyecto_capacidad_instalada}/integrantes', [ProyectoCapacidadInstaladaController::class, 'indexIntegrantes'])->name('proyectos-capacidad-instalada.integrantes.index');
    Route::post('proyectos-capacidad-instalada/{proyecto_capacidad_instalada}/integrantes/users', [ProyectoCapacidadInstaladaController::class, 'filterIntegrantes'])->name('proyectos-capacidad-instalada.integrantes.users');
    Route::post('proyectos-capacidad-instalada/{proyecto_capacidad_instalada}/integrantes/users/link', [ProyectoCapacidadInstaladaController::class, 'linkIntegrante'])->name('proyectos-capacidad-instalada.integrantes.users.link');
    Route::delete('proyectos-capacidad-instalada/{proyecto_capacidad_instalada}/integrantes/users/unlink', [ProyectoCapacidadInstaladaController::class, 'unlinkIntegrante'])->name('proyectos-capacidad-instalada.integrantes.users.unlink');
    Route::post('proyectos-capacidad-instalada/{proyecto_capacidad_instalada}/integrantes/users/register', [ProyectoCapacidadInstaladaController::class, 'registerIntegrante'])->name('proyectos-capacidad-instalada.integrantes.users.register');

    Route::get('proyectos-capacidad-instalada/{proyecto_capacidad_instalada}/entidades-aliadas/crear', [ProyectoCapacidadInstaladaController::class, 'createEntidadAliada'])->name('proyectos-capacidad-instalada.entidades-aliadas.create');
    Route::post('proyectos-capacidad-instalada/{proyecto_capacidad_instalada}/entidades-aliadas/crear', [ProyectoCapacidadInstaladaController::class, 'storeEntidadAliada'])->name('proyectos-capacidad-instalada.entidades-aliadas.store');

    Route::get('proyectos-capacidad-instalada/{proyecto_capacidad_instalada}/entidades-aliadas/{entidad_aliada}/download', [ProyectoCapacidadInstaladaController::class, 'download'])->name('proyectos-capacidad-instalada.entidades-aliadas.download');
    Route::get('proyectos-capacidad-instalada/{proyecto_capacidad_instalada}/entidades-aliadas/{entidad_aliada}/editar', [ProyectoCapacidadInstaladaController::class, 'editEntidadAliada'])->name('proyectos-capacidad-instalada.entidades-aliadas.edit');
    Route::put('proyectos-capacidad-instalada/{proyecto_capacidad_instalada}/entidades-aliadas/{entidad_aliada}/editar', [ProyectoCapacidadInstaladaController::class, 'updateEntidadAliada'])->name('proyectos-capacidad-instalada.entidades-aliadas.update');
    Route::delete('proyectos-capacidad-instalada/{proyecto_capacidad_instalada}/entidades-aliadas/{entidad_aliada}', [ProyectoCapacidadInstaladaController::class, 'destroyEntidadAliada'])->name('proyectos-capacidad-instalada.entidades-aliadas.destroy');

    Route::get('proyectos-capacidad-instalada/{proyecto_capacidad_instalada}/productos', [ProyectoCapacidadInstaladaController::class, 'indexProductos'])->name('proyectos-capacidad-instalada.productos.index');
    Route::get('proyectos-capacidad-instalada/{proyecto_capacidad_instalada}/productos/crear', [ProyectoCapacidadInstaladaController::class, 'createProducto'])->name('proyectos-capacidad-instalada.productos.create');
    Route::post('proyectos-capacidad-instalada/{proyecto_capacidad_instalada}/productos/crear', [ProyectoCapacidadInstaladaController::class, 'storeProducto'])->name('proyectos-capacidad-instalada.productos.store');
    Route::get('proyectos-capacidad-instalada/{proyecto_capacidad_instalada}/productos/{producto}/editar', [ProyectoCapacidadInstaladaController::class, 'editProducto'])->name('proyectos-capacidad-instalada.productos.edit');
    Route::put('proyectos-capacidad-instalada/{proyecto_capacidad_instalada}/productos/{producto}/editar', [ProyectoCapacidadInstaladaController::class, 'updateProducto'])->name('proyectos-capacidad-instalada.productos.update');
    Route::delete('proyectos-capacidad-instalada/{proyecto_capacidad_instalada}/productos/{producto}', [ProyectoCapacidadInstaladaController::class, 'destroyProducto'])->name('proyectos-capacidad-instalada.productos.destroy');

    Route::post('proyectos-capacidad-instalada/{proyecto_capacidad_instalada}/finalizar/proyecto', [ProyectoCapacidadInstaladaController::class, 'storeFinalizar'])->name('proyectos-capacidad-instalada.store.finalizar');
    Route::get('proyectos-capacidad-instalada/{proyecto_capacidad_instalada}/finalizar', [ProyectoCapacidadInstaladaController::class, 'finalizar'])->name('proyectos-capacidad-instalada.finalizar');

    Route::resource('proyectos-capacidad-instalada', ProyectoCapacidadInstaladaController::class)->parameters(['proyectos-capacidad-instalada' => 'proyecto-capacidad-instalada'])->except(['show']);

    /**
     * Proyectos I+D+i de Tecnoacademias
     *
     */
    Route::post('proyectos-idi-tecnoacademia/{proyecto_idi_tecnoacademia}/{integrante}', [ProyectoIdiTecnoacademiaController::class, 'cambiarAutorPrincipal'])->name('proyectos-idi-tecnoacademia.nuevo-autor-principal');
    Route::get('proyectos-idi-tecnoacademia/{proyecto_idi_tecnoacademia}/download-file-sharepoint/{tipo_archivo}', [ProyectoIdiTecnoacademiaController::class, 'downloadFileSharepoint'])->name('proyectos-idi-tecnoacademia.download-file-sharepoint');
    Route::get('proyectos-idi-tecnoacademia/{proyecto_idi_tecnoacademia}/download/{formato}', [ProyectoIdiTecnoacademiaController::class, 'downloadServerFile'])->name('proyectos-idi-tecnoacademia.download');

    Route::get('proyectos-idi-tecnoacademia/{proyecto_idi_tecnoacademia}/productos/{producto}/download-file-sharepoint/{tipo_archivo}', [ProyectoIdiTecnoacademiaController::class, 'downloadFileProductoSharepoint'])->name('proyectos-idi-tecnoacademia.productos.download-file-sharepoint');
    Route::get('proyectos-idi-tecnoacademia/{proyecto_idi_tecnoacademia}/productos/{producto}/download/{formato}', [ProyectoIdiTecnoacademiaController::class, 'downloadServerFileProducto'])->name('proyectos-idi-tecnoacademia.productos.download');
    Route::get('proyectos-idi-tecnoacademia/{proyecto_idi_tecnoacademia}/productos', [ProyectoIdiTecnoacademiaController::class, 'indexProductos'])->name('proyectos-idi-tecnoacademia.productos.index');
    Route::get('proyectos-idi-tecnoacademia/{proyecto_idi_tecnoacademia}/productos/crear', [ProyectoIdiTecnoacademiaController::class, 'createProducto'])->name('proyectos-idi-tecnoacademia.productos.create');
    Route::post('proyectos-idi-tecnoacademia/{proyecto_idi_tecnoacademia}/productos/crear', [ProyectoIdiTecnoacademiaController::class, 'storeProducto'])->name('proyectos-idi-tecnoacademia.productos.store');
    Route::get('proyectos-idi-tecnoacademia/{proyecto_idi_tecnoacademia}/productos/{producto}/editar', [ProyectoIdiTecnoacademiaController::class, 'editProducto'])->name('proyectos-idi-tecnoacademia.productos.edit');
    Route::put('proyectos-idi-tecnoacademia/{proyecto_idi_tecnoacademia}/productos/{producto}/editar', [ProyectoIdiTecnoacademiaController::class, 'updateProducto'])->name('proyectos-idi-tecnoacademia.productos.update');
    Route::delete('proyectos-idi-tecnoacademia/{proyecto_idi_tecnoacademia}/productos/{producto}', [ProyectoIdiTecnoacademiaController::class, 'destroyProducto'])->name('proyectos-idi-tecnoacademia.productos.destroy');

    Route::get('proyectos-idi-tecnoacademia/{proyecto_idi_tecnoacademia}/participantes', [ProyectoIdiTecnoacademiaController::class, 'indexParticipantes'])->name('proyectos-idi-tecnoacademia.participantes.index');

    Route::post('proyectos-idi-tecnoacademia/{proyecto_idi_tecnoacademia}/participantes/users', [ProyectoIdiTecnoacademiaController::class, 'filterParticipantes'])->name('proyectos-idi-tecnoacademia.participantes.users');
    Route::post('proyectos-idi-tecnoacademia/{proyecto_idi_tecnoacademia}/participantes/users/link', [ProyectoIdiTecnoacademiaController::class, 'linkParticipante'])->name('proyectos-idi-tecnoacademia.participantes.users.link');
    Route::put('proyectos-idi-tecnoacademia/{proyecto_idi_tecnoacademia}/participantes/users/link', [ProyectoIdiTecnoacademiaController::class, 'updateParticipante'])->name('proyectos-idi-tecnoacademia.participantes.users.update');
    Route::delete('proyectos-idi-tecnoacademia/{proyecto_idi_tecnoacademia}/participantes/users/unlink', [ProyectoIdiTecnoacademiaController::class, 'unlinkParticipante'])->name('proyectos-idi-tecnoacademia.participantes.users.unlink');
    Route::post('proyectos-idi-tecnoacademia/{proyecto_idi_tecnoacademia}/participantes/users/register', [ProyectoIdiTecnoacademiaController::class, 'registerParticipante'])->name('proyectos-idi-tecnoacademia.participantes.users.register');

    Route::resource('proyectos-idi-tecnoacademia', ProyectoIdiTecnoacademiaController::class)->parameters(['proyectos-idi-tecnoacademia' => 'proyecto-idi-tecnoacademia']);

    /**
     * Mesas sectoriales
     *
     */
    Route::resource('mesas-sectoriales', MesaSectorialController::class)->parameters(['mesas-sectoriales' => 'mesa-sectorial'])->except(['show']);

    /**
     * Finalizar formulación de proyectos
     *
     */
    Route::get('convocatorias/{convocatoria}/proyectos/{proyecto}/finalizar-proyecto', [ProyectoController::class, 'resumenFinal'])->name('convocatorias.proyectos.resumen-final');
    Route::put('convocatorias/{convocatoria}/proyectos/{proyecto}/finalizar-proyecto', [ProyectoController::class, 'finalizarProyecto'])->name('convocatorias.proyectos.finalizar');
    Route::put('convocatorias/{convocatoria}/proyectos/{proyecto}/radicar-proyecto', [ProyectoController::class, 'radicarProyecto'])->name('convocatorias.proyectos.radicar');
    Route::put('convocatorias/{convocatoria}/proyectos/{proyecto}/comentario-proyecto', [ProyectoController::class, 'devolverProyecto'])->name('convocatorias.proyectos.return-project');
    Route::get('convocatorias/{convocatoria}/proyectos/{proyecto}/descargar-version/{version}', [ProyectoController::class, 'descargarPdf'])->name('convocatorias.proyectos.version');
    Route::get('convocatorias/{convocatoria}/proyectos/redireccionar}', [ProyectoController::class, 'redireccionar'])->name('convocatorias.proyectos.index');

    /**
     * Inventario equipos - Estrategia regional
     *
     */
    Route::resource('convocatorias.proyectos.inventario-equipos', InventarioEquipoController::class)->parameters(['convocatorias' => 'convocatoria', 'proyectos' => 'proyecto', 'inventario-equipos' => 'inventario-equipo'])->except(['show']);

    /**
     * Entidades aliadas
     *
     */
    Route::get('convocatorias/{convocatoria}/proyectos/{proyecto}/entidades-aliadas/{entidad_aliada}/download-file-sharepoint/{tipo_archivo}', [EntidadAliadaController::class, 'downloadFileSharepoint'])->name('convocatorias.proyectos.entidades-aliadas.download-file-sharepoint');
    Route::get('convocatorias/{convocatoria}/proyectos/{proyecto}/entidades-aliadas/{entidad_aliada}/download/{formato}', [EntidadAliadaController::class, 'downloadServerFile'])->name('convocatorias.proyectos.entidades-aliadas.download');
    Route::put('convocatorias/{convocatoria}/proyectos/{proyecto}/entidades-aliadas/{entidad_aliada}/upload-soporte', function (Convocatoria $convocatoria, Proyecto $proyecto, EntidadAliada $entidad_aliada) {
        $controller = app(EntidadAliadaController::class);

        if (request()->hasFile('carta_intencion')) {
            return $controller->uploadCartaIntencion(request(), $convocatoria, $proyecto, $entidad_aliada);
        } elseif (request()->hasFile('carta_propiedad_intelectual')) {
            return $controller->uploadCartaPropiedadIntelectual(request(), $convocatoria, $proyecto, $entidad_aliada);
        } elseif (request()->hasFile('soporte_convenio')) {
            return $controller->uploadSoporteConvenio(request(), $convocatoria, $proyecto, $entidad_aliada);
        } else {
            abort(404);
        }
    })->name('convocatorias.proyectos.entidades-aliadas.upload-soporte');
    Route::resource('convocatorias.proyectos.entidades-aliadas', EntidadAliadaController::class)->parameters(['convocatorias' => 'convocatoria', 'proyectos' => 'proyecto', 'entidades-aliadas' => 'entidad-aliada'])->except(['show']);
    Route::resource('convocatorias.proyectos.entidades-aliadas.miembros-entidad-aliada', MiembroEntidadAliadaController::class)->parameters(['convocatorias' => 'convocatoria', 'proyectos' => 'proyecto', 'entidades-aliadas' => 'entidad-aliada', 'miembros-entidad-aliada' => 'miembro-entidad-aliada'])->except(['show']);

    /**
     * Articulación SENNOVA
     *
     */
    Route::put('convocatorias/{convocatoria}/proyectos/{proyecto}/articulacion/column/{column}', [ArticulacionSennovaController::class, 'updateLongColumn'])->name('convocatorias.proyectos.articulacion-sennova.updateLongColumn');
    Route::get('convocatorias/{convocatoria}/proyectos/{proyecto}/articulacion', [ArticulacionSennovaController::class, 'showArticulacionSennova'])->name('convocatorias.proyectos.articulacion-sennova');
    Route::post('convocatorias/{convocatoria}/proyectos/{proyecto}/articulacion', [ArticulacionSennovaController::class, 'storeArticulacionSennova'])->name('convocatorias.proyectos.articulacion-sennova.store');
    Route::post('convocatorias/{convocatoria}/proyectos/{proyecto}/articulacion-proyectos-formulario-10-linea-69', [ArticulacionSennovaController::class, 'storeArticulacionSennovaProyectosFormulario10Linea69'])->name('convocatorias.proyectos.articulacion-sennova-formulario-10-linea-69.store');
    Route::post('convocatorias/{convocatoria}/proyectos/{proyecto}/articulacion-proyectos-formulario-17-linea-69', [ArticulacionSennovaController::class, 'storeArticulacionSennovaProyectosFormulario17Linea69'])->name('convocatorias.proyectos.articulacion-sennova-proyectos-formulario-17-linea-69.store');
    Route::post('convocatorias/{convocatoria}/proyectos/{proyecto}/articulacion-proyectos-formulario-11-linea-83', [ArticulacionSennovaController::class, 'storeArticulacionSennovaProyectosLinea83'])->name('convocatorias.proyectos.articulacion-sennova-proyectos-formulario-11-linea-83.store');

    /**
     * Indicadores
     *
     */
    Route::put('convocatorias/{convocatoria}/proyectos/{proyecto}/indicadores/column/{column}', [ProyectoController::class, 'updateIndicadoresLongColumn'])->name('convocatorias.proyectos.indicadores.updateLongColumn');
    Route::post('convocatorias/{convocatoria}/proyectos/{proyecto}/indicadores', [ProyectoController::class, 'storeIndicadores'])->name('convocatorias.proyectos.indicadores.store');
    Route::get('convocatorias/{convocatoria}/proyectos/{proyecto}/indicadores', [ProyectoController::class, 'showIndicadores'])->name('convocatorias.proyectos.indicadores');

    /**
     * Línea programática 23 - Estrategia regional
     *
     */
    Route::put('convocatorias/{convocatoria}/proyectos-formulario-7-linea-23/{proyecto_formulario_7_linea_23}/column/{column}', [ProyectoFormulario7Linea23Controller::class, 'updateLongColumn'])->name('convocatorias.proyectos-formulario-7-linea-23.updateLongColumn');
    Route::resource('convocatorias.proyectos-formulario-7-linea-23', ProyectoFormulario7Linea23Controller::class)->parameters(['convocatorias' => 'convocatoria', 'proyectos-formulario-7-linea-23' => 'proyecto-formulario-7-linea-23'])->except(['show']);

    /**
     * Línea programática 23 - Estrategia regional
     *
     */
    Route::put('convocatorias/{convocatoria}/proyectos-formulario-9-linea-23/{proyecto_formulario_9_linea_23}/column/{column}', [ProyectoFormulario9Linea23Controller::class, 'updateLongColumn'])->name('convocatorias.proyectos-formulario-9-linea-23.updateLongColumn');
    Route::resource('convocatorias.proyectos-formulario-9-linea-23', ProyectoFormulario9Linea23Controller::class)->parameters(['convocatorias' => 'convocatoria', 'proyectos-formulario-9-linea-23' => 'proyecto-formulario-9-linea-23'])->except(['show']);

    /**
     * Línea programática 65 - Estrategia nacional
     *
     */
    Route::put('convocatorias/{convocatoria}/proyectos-formulario-1-linea-65/{proyecto_formulario_1_linea_65}/column/{column}', [ProyectoFormulario1Linea65Controller::class, 'updateLongColumn'])->name('convocatorias.proyectos-formulario-1-linea-65.updateLongColumn');
    Route::resource('convocatorias.proyectos-formulario-1-linea-65', ProyectoFormulario1Linea65Controller::class)->parameters(['convocatorias' => 'convocatoria', 'proyectos-formulario-1-linea-65' => 'proyecto-formulario-1-linea-65'])->except(['show']);

    /**
     * Línea programática 65 - Estrategia nacional
     *
     */
    Route::put('convocatorias/{convocatoria}/proyectos-formulario-13-linea-65/{proyecto_formulario_13_linea_65}/column/{column}', [ProyectoFormulario13Linea65Controller::class, 'updateLongColumn'])->name('convocatorias.proyectos-formulario-13-linea-65.updateLongColumn');
    Route::resource('convocatorias.proyectos-formulario-13-linea-65', ProyectoFormulario13Linea65Controller::class)->parameters(['convocatorias' => 'convocatoria', 'proyectos-formulario-13-linea-65' => 'proyecto-formulario-13-linea-65'])->except(['show']);

    /**
     * Línea programática 65 - Estrategia nacional
     *
     */
    Route::put('convocatorias/{convocatoria}/proyectos-formulario-15-linea-65/{proyecto_formulario_15_linea_65}/column/{column}', [ProyectoFormulario15Linea65Controller::class, 'updateLongColumn'])->name('convocatorias.proyectos-formulario-15-linea-65.updateLongColumn');
    Route::resource('convocatorias.proyectos-formulario-15-linea-65', ProyectoFormulario15Linea65Controller::class)->parameters(['convocatorias' => 'convocatoria', 'proyectos-formulario-15-linea-65' => 'proyecto-formulario-15-linea-65'])->except(['show']);

    /**
     * Línea programática 65 - Estrategia nacional
     *
     */
    Route::put('convocatorias/{convocatoria}/proyectos-formulario-16-linea-65/{proyecto_formulario_16_linea_65}/column/{column}', [ProyectoFormulario16Linea65Controller::class, 'updateLongColumn'])->name('convocatorias.proyectos-formulario-16-linea-65.updateLongColumn');
    Route::resource('convocatorias.proyectos-formulario-16-linea-65', ProyectoFormulario16Linea65Controller::class)->parameters(['convocatorias' => 'convocatoria', 'proyectos-formulario-16-linea-65' => 'proyecto-formulario-16-linea-65'])->except(['show']);

    /**
     * Línea programática 65 - Estrategia nacional
     *
     */
    Route::put('convocatorias/{convocatoria}/proyectos-formulario-3-linea-61/{proyecto_formulario_3_linea_61}/column/{column}', [ProyectoFormulario3Linea61Controller::class, 'updateLongColumn'])->name('convocatorias.proyectos-formulario-3-linea-61.updateLongColumn');
    Route::resource('convocatorias.proyectos-formulario-3-linea-61', ProyectoFormulario3Linea61Controller::class)->parameters(['convocatorias' => 'convocatoria', 'proyectos-formulario-3-linea-61' => 'proyecto-formulario-3-linea-61'])->except(['show']);

    /**
     * Línea programática 66 - Estrategia regional
     *
     */
    Route::put('convocatorias/{convocatoria}/proyectos-formulario-8-linea-66/{proyecto_formulario_8_linea_66}/column/{column}', [ProyectoFormulario8Linea66Controller::class, 'updateLongColumn'])->name('convocatorias.proyectos-formulario-8-linea-66.updateLongColumn');
    Route::resource('convocatorias.proyectos-formulario-8-linea-66', ProyectoFormulario8Linea66Controller::class)->parameters(['convocatorias' => 'convocatoria', 'proyectos-formulario-8-linea-66' => 'proyecto-formulario-8-linea-66'])->except(['show']);

    /**
     * Línea programática 68 - Estrategia nacional
     *
     */
    Route::resource('convocatorias.proyectos-formulario-12-linea-68', ProyectoFormulario12Linea68Controller::class)->parameters(['convocatorias' => 'convocatoria', 'proyectos-formulario-12-linea-68' => 'proyecto-formulario-12-linea-68'])->except(['show']);
    Route::put('convocatorias/{convocatoria}/proyectos-formulario-12-linea-68/{proyecto_formulario_12_linea_68}/column/{column}', [ProyectoFormulario12Linea68Controller::class, 'updateLongColumn'])->name('convocatorias.proyectos-formulario-12-linea-68.updateLongColumn');

    /**
     * Línea programática 69 - Estrategia nacional
     *
     */
    Route::get('convocatorias/{convocatoria}/proyectos-formulario-5-linea-69/{proyecto_formulario_5_linea_69}/download-file-sharepoint/{tipo_archivo}', [ProyectoFormulario5Linea69Controller::class, 'downloadFileSharepoint'])->name('convocatorias.proyectos-formulario-5-linea-69.download-file-sharepoint');
    Route::put('convocatorias/{convocatoria}proyectos-formulario-5-linea-69/{proyecto_formulario_5_linea_69}/column/{column}', [ProyectoFormulario5Linea69Controller::class, 'updateLongColumn'])->name('convocatorias.proyectos-formulario-5-linea-69.updateLongColumn');
    Route::resource('convocatorias.proyectos-formulario-5-linea-69', ProyectoFormulario5Linea69Controller::class)->parameters(['convocatorias' => 'convocatoria', 'proyectos-formulario-5-linea-69' => 'proyecto-formulario-5-linea-69'])->except(['show']);

    /**
     * Línea programática 69 Hubs - Estrategia nacional
     *
     */
    Route::get('convocatorias/{convocatoria}/proyectos-formulario-10-linea-69/{proyecto_formulario_10_linea_69}/download-file-sharepoint/{tipo_archivo}', [ProyectoFormulario10Linea69Controller::class, 'downloadFileSharepoint'])->name('convocatorias.proyectos-formulario-10-linea-69.download-file-sharepoint');
    Route::put('convocatorias/{convocatoria}proyectos-formulario-10-linea-69/{proyecto_formulario_10_linea_69}/column/{column}', [ProyectoFormulario10Linea69Controller::class, 'updateLongColumn'])->name('convocatorias.proyectos-formulario-10-linea-69.updateLongColumn');
    Route::resource('convocatorias.proyectos-formulario-10-linea-69', ProyectoFormulario10Linea69Controller::class)->parameters(['convocatorias' => 'convocatoria', 'proyectos-formulario-10-linea-69' => 'proyecto-formulario-10-linea-69'])->except(['show']);

    /**
     * Línea programática 69 Hubs - Estrategia nacional
     *
     */
    Route::get('convocatorias/{convocatoria}/proyectos-formulario-17-linea-69/{proyecto_formulario_17_linea_69}/download-file-sharepoint/{tipo_archivo}', [ProyectoFormulario17Linea69Controller::class, 'downloadFileSharepoint'])->name('convocatorias.proyectos-formulario-17-linea-69.download-file-sharepoint');
    Route::put('convocatorias/{convocatoria}proyectos-formulario-17-linea-69/{proyecto_formulario_17_linea_69}/column/{column}', [ProyectoFormulario17Linea69Controller::class, 'updateLongColumn'])->name('convocatorias.proyectos-formulario-17-linea-69.updateLongColumn');
    Route::resource('convocatorias.proyectos-formulario-17-linea-69', ProyectoFormulario17Linea69Controller::class)->parameters(['convocatorias' => 'convocatoria', 'proyectos-formulario-17-linea-69' => 'proyecto-formulario-17-linea-69'])->except(['show']);

    /**
     * Línea programática 70 - Estrategia nacional
     *
     */
    Route::post('convocatorias/{convocatoria}/proyectos/{proyecto}/programas-formacion', [ProyectoController::class, 'storeProgramaFormacion'])->name('convocatorias.proyectos.programas-formacion.store');
    Route::post('convocatorias/{convocatoria}/proyectos/{proyecto}/discurriculares', [DisenoCurricularController::class, 'storeDisCurricular'])->name('convocatorias.proyectos.dis-curriculares.store');
    Route::put('convocatorias/{convocatoria}/proyectos/{proyecto}/rol/sennova/ta', [ProyectoFormulario4Linea70Controller::class, 'updateCantidadRolesTa'])->name('convocatorias.proyectos.rol-sennova-ta.update');
    Route::get('convocatorias/{convocatoria}/proyectos-formulario-4-linea-70/{proyecto_formulario_4_linea_70}/download-pdf-sharepoint/{tipo_archivo}', [ProyectoFormulario4Linea70Controller::class, 'downloadPdfSharepoint'])->name('convocatorias.proyectos-formulario-4-linea-70.download-file-sharepoint');
    Route::put('convocatorias/{convocatoria}/proyectos/{proyecto}/aulas-moviles/{aula_movil}/upload-archivo', function (Convocatoria $convocatoria, Proyecto $proyecto, AulaMovil $aula_movil) {
        $controller = app(ProyectoFormulario4Linea70Controller::class);

        if (request()->hasFile('soat')) {
            return $controller->uploadSoat(request(), $convocatoria, $proyecto, $aula_movil);
        } elseif (request()->hasFile('tecnicomecanica')) {
            return $controller->uploadTecnicomecanica(request(), $convocatoria, $proyecto, $aula_movil);
        } else {
            abort(404);
        }
    })->name('convocatorias.proyectos-formulario-4-linea-70.aulas-moviles.upload-archivo');
    Route::post('convocatorias/{convocatoria}/proyectos-formulario-4-linea-70/{proyecto_formulario_4_linea_70}/aulas-moviles/', [ProyectoFormulario4Linea70Controller::class, 'storeAulaMovil'])->name('convocatorias.proyectos-formulario-4-linea-70.aulas-moviles.store');
    Route::put('convocatorias/{convocatoria}/proyectos-formulario-4-linea-70/{proyecto_formulario_4_linea_70}/aulas-moviles/{aula_movil}', [ProyectoFormulario4Linea70Controller::class, 'updateAulaMovil'])->name('convocatorias.proyectos-formulario-4-linea-70.aulas-moviles.update');
    Route::delete('convocatorias/{convocatoria}/proyectos-formulario-4-linea-70/{proyecto_formulario_4_linea_70}/aulas-moviles/{aula_movil}', [ProyectoFormulario4Linea70Controller::class, 'destroyAulaMovil'])->name('convocatorias.proyectos-formulario-4-linea-70.aulas-moviles.destroy');

    Route::put('convocatorias/{convocatoria}/proyectos-formulario-4-linea-70/{proyecto_formulario_4_linea_70}/column/{column}', [ProyectoFormulario4Linea70Controller::class, 'updateLongColumn'])->name('convocatorias.proyectos-formulario-4-linea-70.updateLongColumn');
    Route::get('convocatorias/{convocatoria}/proyectos-formulario-4-linea-70/{proyecto_formulario_4_linea_70}/aulas-moviles/{aula_movil}/download-file-sharepoint/{tipo_archivo}', [ProyectoFormulario4Linea70Controller::class, 'downloadFileSharepoint'])->name('convocatorias.proyectos-formulario-4-linea-70.aulas-moviles.download-file-sharepoint');

    Route::resource('convocatorias.proyectos.presupuesto.edt', EdtController::class)->parameters(['convocatorias' => 'convocatoria', 'proyectos' => 'proyecto', 'presupuesto' => 'presupuesto', 'edt' => 'edt'])->except(['show']);
    Route::resource('convocatorias.proyectos-formulario-4-linea-70', ProyectoFormulario4Linea70Controller::class)->parameters(['convocatorias' => 'convocatoria', 'proyectos-formulario-4-linea-70' => 'proyecto-formulario-4-linea-70'])->except(['show']);

    /**
     * Línea programática 82 - Estrategia regional
     *
     */
    Route::put('convocatorias/{convocatoria}/proyectos-formulario-6-linea-82/{proyecto_formulario_6_linea_82}/column/{column}', [ProyectoFormulario6Linea82Controller::class, 'updateLongColumn'])->name('convocatorias.proyectos-formulario-6-linea-82.updateLongColumn');
    Route::resource('convocatorias.proyectos-formulario-6-linea-82', ProyectoFormulario6Linea82Controller::class)->parameters(['convocatorias' => 'convocatoria', 'proyectos-formulario-6-linea-82' => 'proyecto-formulario-6-linea-82'])->except(['show']);

    /**
     * Línea programática 83 - Estrategia nacional
     *
     */
    Route::get('convocatorias/{convocatoria}/proyectos-formulario-11-linea-83/{proyecto_formulario_11_linea_83}/download-file-sharepoint/{tipo_archivo}', [ProyectoFormulario11Linea83Controller::class, 'downloadFileSharepoint'])->name('convocatorias.proyectos-formulario-11-linea-83.download-file-sharepoint');
    Route::put('convocatorias/{convocatoria}proyectos-formulario-11-linea-83/{proyecto_formulario_11_linea_83}/column/{column}', [ProyectoFormulario11Linea83Controller::class, 'updateLongColumn'])->name('convocatorias.proyectos-formulario-11-linea-83.updateLongColumn');
    Route::resource('convocatorias.proyectos-formulario-11-linea-83', ProyectoFormulario11Linea83Controller::class)->parameters(['convocatorias' => 'convocatoria', 'proyectos-formulario-11-linea-83' => 'proyecto-formulario-11-linea-83'])->except(['show']);

    /**
     * Convocatorias
     *
     */
    Route::get('nuevos-proyectos-ta-tp', [ConvocatoriaController::class, 'nuevosProyectosTaTp'])->name('nuevos-proyectos-ta-tp');
    Route::put('convocatorias/{convocatoria}/update-fase', [ConvocatoriaController::class, 'updateFase'])->name('convocatorias.update-fase');

    Route::get('convocatorias/{convocatoria}/tipos-formulario-convocatoria/{tipo_formulario_convocatoria}', [ConvocatoriaController::class, 'proyectosPorTipoFormulario'])->name('convocatorias.tipos-formulario-convocatoria.proyectos');
    Route::get('convocatorias/{convocatoria}/tipos-formulario-convocatoria', [ConvocatoriaController::class, 'tiposFormularioConvocatoria'])->name('convocatorias.tipos-formulario-convocatoria');

    Route::resource('convocatorias.topes-roles-sennova-tecnoparques', TopeRolSennovaTecnoparqueController::class)->parameters(['convocatorias' => 'convocatoria', 'topes-roles-sennova-tecnoparques' => 'tope-rol-sennova-tecnoparque'])->except(['show']);
    Route::resource('convocatorias.topes-presupuestales-tecnoparque', TopePresupuestalNodoTecnoparqueController::class)->parameters(['convocatorias' => 'convocatoria', 'topes-presupuestales-tecnoparque' => 'tope-presupuestal-tecnoparque'])->except(['show']);
    Route::resource('convocatorias', ConvocatoriaController::class)->parameters(['convocatorias' => 'convocatoria'])->except(['show']);

    /**
     * Comentarios generales
     *
     */
    Route::get('convocatorias/{convocatoria}/proyectos/{proyecto}/comentarios-generales', [ProyectoController::class, 'showComentariosGeneralesForm'])->name('convocatorias.proyectos.comentarios-generales-form');
    Route::post('convocatorias/{convocatoria}/{evaluacion}/comentarios-generales', [ProyectoController::class, 'udpdateComentariosGenerales'])->name('convocatorias.proyectos.update-comentarios');

    /**
     * Muestra el árbol de objetivos
     *
     */
    Route::get('convocatorias/{convocatoria}/proyectos/{proyecto}/arbol-objetivos', [ArbolProyectoController::class, 'showArbolObjetivos'])->name('convocatorias.proyectos.arbol-objetivos');
    // Actualiza el impacto en el arbol de objetivos
    Route::post('proyectos/{proyecto}/impacto/{impacto}', [ArbolProyectoController::class, 'updateImpacto'])->name('proyectos.impacto');
    Route::delete('proyectos/{proyecto}/impacto/{impacto}/destroy', [ArbolProyectoController::class, 'destroyImpacto'])->name('proyectos.impacto.destroy');
    // Actualiza el impacto en el arbol de objetivos
    Route::post('proyectos/{proyecto}/resultado/{resultado}', [ArbolProyectoController::class, 'updateResultado'])->name('proyectos.resultado');
    Route::delete('proyectos/{proyecto}/resultado/{resultado}/destroy', [ArbolProyectoController::class, 'destroyResultado'])->name('proyectos.resultado.destroy');
    // Actualiza el objetivo especifico en el arbol de objetivos
    Route::post('proyectos/{proyecto}/objetivo-especifico/{objetivo_especifico}', [ArbolProyectoController::class, 'updateObjetivoEspecifico'])->name('proyectos.objetivo-especifico');
    Route::delete('proyectos/{proyecto}/objetivo-especifico/{objetivo_especifico}/destroy', [ArbolProyectoController::class, 'destroyObjetivoEspecifico'])->name('proyectos.objetivo-especifico.destroy');
    // Actualiza la actividad en el arbol de objetivos
    Route::post('convocatorias/{convocatoria}/proyectos/{proyecto}/actividad/{actividad}', [ArbolProyectoController::class, 'updateActividad'])->name('proyectos.actividad');
    Route::delete('proyectos/{proyecto}/actividad/{actividad}/destroy', [ArbolProyectoController::class, 'destroyActividad'])->name('proyectos.actividad.destroy');

    /**
     * Muestra el árbol de problemas
     *
     */
    Route::put('convocatorias/{convocatoria}/proyectos/{proyecto}/arboles/column/{column}', [ArbolProyectoController::class, 'updateLongColumn'])->name('convocatorias.proyectos.arboles.updateLongColumn');
    Route::get('convocatorias/{convocatoria}/proyectos/{proyecto}/arbol-problemas', [ArbolProyectoController::class, 'showArbolProblemas'])->name('convocatorias.proyectos.arbol-problemas');
    // Actualiza el problema general del proyecto en el arbol de problemas
    Route::post('proyectos/{proyecto}/problema-central', [ArbolProyectoController::class, 'updateProblemaCentral'])->name('proyectos.problema-central');
    // Actualiza efecto directo en el arbol de problemas
    Route::post('proyectos/{proyecto}/efecto-directo/', [ArbolProyectoController::class, 'newEfectoDirecto'])->name('proyectos.new-efecto-directo');
    Route::post('proyectos/{proyecto}/efecto-directo/{efecto_directo}', [ArbolProyectoController::class, 'updateEfectoDirecto'])->name('proyectos.efecto-directo');
    Route::delete('proyectos/{proyecto}/efecto-directo/{efecto_directo}/destroy', [ArbolProyectoController::class, 'destroyEfectoDirecto'])->name('proyectos.efecto-directo.destroy');
    // Crea o Actualiza efecto indirecto en el arbol de problemas
    Route::post('proyectos/{proyecto}/efecto-indirecto/{efecto_directo}', [ArbolProyectoController::class, 'createOrUpdateEfectoIndirecto'])->name('proyectos.efecto-indirecto');
    Route::delete('proyectos/{proyecto}/efecto-indirecto/{efecto_indirecto}/destroy', [ArbolProyectoController::class, 'destroyEfectoIndirecto'])->name('proyectos.efecto-indirecto.destroy');

    // Actualiza causa directa en el arbol de problemas
    Route::post('proyectos/{proyecto}/causa-directa/', [ArbolProyectoController::class, 'newCausaDirecta'])->name('proyectos.new-causa-directa');
    Route::post('proyectos/{proyecto}/causa-directa/{causa_directa}', [ArbolProyectoController::class, 'updateCausaDirecta'])->name('proyectos.causa-directa');
    Route::delete('proyectos/{proyecto}/causa-directa/{causa_directa}/destroy', [ArbolProyectoController::class, 'destroyCausaDirecta'])->name('proyectos.causa-directa.destroy');
    // Crea o Actualiza causa indirecta en el arbol de problemas
    Route::post('proyectos/{proyecto}/causa-indirecta/{causa_directa}', [ArbolProyectoController::class, 'createOrUpdateCausaIndirecta'])->name('proyectos.causa-indirecta');
    Route::delete('proyectos/{proyecto}/causa-indirecta/{causa_indirecta}/destroy', [ArbolProyectoController::class, 'destroyCausaIndirecta'])->name('proyectos.causa-indirecta.destroy');

    // Muestra los participantes
    Route::post('convocatorias/{convocatoria}/proyectos/{proyecto}/participantes/{integrante}/cambiar-autor-principal', [ProyectoController::class, 'cambiarAutorPrincipal'])->name('convocatorias.proyectos.participantes.nuevo-autor-principal');
    Route::post('convocatorias/{convocatoria}/proyectos/{proyecto}/participantes/users/link', [ProyectoController::class, 'linkParticipante'])->name('convocatorias.proyectos.participantes.users.link');
    Route::put('convocatorias/{convocatoria}/proyectos/{proyecto}/participantes/users/link', [ProyectoController::class, 'updateParticipante'])->name('convocatorias.proyectos.participantes.users.update');
    Route::delete('convocatorias/{convocatoria}/proyectos/{proyecto}/participantes/users/{user}/unlink', [ProyectoController::class, 'unlinkParticipante'])->name('convocatorias.proyectos.participantes.users.unlink');
    Route::get('convocatorias/{convocatoria}/proyectos/{proyecto}/participantes', [ProyectoController::class, 'participantes'])->name('convocatorias.proyectos.participantes');

    // Vincula y filtra los programas
    Route::post('convocatorias/{convocatoria}/proyectos/{proyecto}/participantes/programas-formacion', [ProyectoController::class, 'filterProgramasFormacion'])->name('convocatorias.proyectos.participantes.programas-formacion');
    Route::post('convocatorias/{convocatoria}/proyectos/{proyecto}/participantes/programas-formacion/link', [ProyectoController::class, 'linkProgramaFormacion'])->name('convocatorias.proyectos.participantes.programas-formacion.link');
    Route::delete('convocatorias/{convocatoria}/proyectos/{proyecto}/participantes/programas-formacion/unlink', [ProyectoController::class, 'unlinkProgramaFormacion'])->name('convocatorias.proyectos.participantes.programas-formacion.unlink');

    // Vincula y filtra los semilleros
    Route::post('convocatorias/{convocatoria}/proyectos/{proyecto}/participantes/semilleros-investigacion', [ProyectoController::class, 'filterSemillerosInvestigacion'])->name('convocatorias.proyectos.participantes.semilleros-investigacion');
    Route::post('convocatorias/{convocatoria}/proyectos/{proyecto}/participantes/semilleros-investigacion/{semillero_investigacion}/link', [ProyectoController::class, 'linkSemilleroInvestigacion'])->name('convocatorias.proyectos.participantes.semilleros-investigacion.link');
    Route::delete('convocatorias/{convocatoria}/proyectos/{proyecto}/participantes/semilleros-investigacion/{semillero_investigacion}/unlink', [ProyectoController::class, 'unlinkSemilleroInvestigacion'])->name('convocatorias.proyectos.participantes.semilleros-investigacion.unlink');

    Route::put('convocatorias/{convocatoria}/proyectos/{proyecto}/cadena-valor/propuesta-sostenibilidad', [ProyectoController::class, 'updatePropuestaSostenibilidad'])->name('convocatorias.proyectos.propuesta-sostenibilidad');
    Route::put('convocatorias/{convocatoria}/proyectos/{proyecto}/cadena-valor/column/{column}', [ProyectoController::class, 'updateCadenaValorLongColumn'])->name('convocatorias.proyectos.cadena-valor.updateLongColumn');
    Route::get('convocatorias/{convocatoria}/proyectos/{proyecto}/cadena-valor', [ProyectoController::class, 'showCadenaValor'])->name('convocatorias.proyectos.cadena-valor');

    // Redirecciona según el tipo de proyecto
    Route::get('convocatorias/{convocatoria}/proyectos/{proyecto}/editar', [ProyectoController::class, 'edit'])->name('convocatorias.proyectos.edit');

    //Exporta resumen proyecto PDF
    Route::get('convocatorias/{convocatoria}/proyectos/{proyecto}/pdf-formulario1-linea65', [PdfController::class, 'generarPdfFormulario1Linea65'])->name('convocatorias.proyectos.pdf-formulario1-linea65');
    Route::get('convocatorias/{convocatoria}/proyectos/{proyecto}/pdf-formulario3-linea61', [PdfController::class, 'generarPdfFormulario3Linea61'])->name('convocatorias.proyectos.pdf-formulario3-linea61');
    Route::get('convocatorias/{convocatoria}/proyectos/{proyecto}/pdf-formulario4-linea70', [PdfController::class, 'generarPdfFormulario4Linea70'])->name('convocatorias.proyectos.pdf-formulario4-linea70');
    Route::get('convocatorias/{convocatoria}/proyectos/{proyecto}/pdf-formulario5-linea69', [PdfController::class, 'generarPdfFormulario5Linea69'])->name('convocatorias.proyectos.pdf-formulario5-linea69');
    Route::get('convocatorias/{convocatoria}/proyectos/{proyecto}/pdf-formulario6-linea82', [PdfController::class, 'generarPdfFormulario6Linea82'])->name('convocatorias.proyectos.pdf-formulario6-linea82');
    Route::get('convocatorias/{convocatoria}/proyectos/{proyecto}/pdf-formulario7-linea23', [PdfController::class, 'generarPdfFormulario7Linea23'])->name('convocatorias.proyectos.pdf-formulario7-linea23');
    Route::get('convocatorias/{convocatoria}/proyectos/{proyecto}/pdf-formulario8-linea66', [PdfController::class, 'generarPdfFormulario8Linea66'])->name('convocatorias.proyectos.pdf-formulario8-linea66');
    Route::get('convocatorias/{convocatoria}/proyectos/{proyecto}/pdf-formulario9-linea23', [PdfController::class, 'generarPdfFormulario9Linea23'])->name('convocatorias.proyectos.pdf-formulario9-linea23');
    Route::get('convocatorias/{convocatoria}/proyectos/{proyecto}/pdf-formulario10-linea69', [PdfController::class, 'generarPdfFormulario10Linea69'])->name('convocatorias.proyectos.pdf-formulario10-linea69');
    Route::get('convocatorias/{convocatoria}/proyectos/{proyecto}/pdf-formulario11-linea83', [PdfController::class, 'generarPdfFormulario11Linea83'])->name('convocatorias.proyectos.pdf-formulario11-linea83');
    Route::get('convocatorias/{convocatoria}/proyectos/{proyecto}/pdf-formulario12-linea68', [PdfController::class, 'generarPdfFormulario12Linea68'])->name('convocatorias.proyectos.pdf-formulario12-linea68');
    Route::get('convocatorias/{convocatoria}/proyectos/{proyecto}/pdf-formulario13-linea65', [PdfController::class, 'generarPdfFormulario13Linea65'])->name('convocatorias.proyectos.pdf-formulario13-linea65');
    Route::get('convocatorias/{convocatoria}/proyectos/{proyecto}/pdf-formulario15-linea65', [PdfController::class, 'generarPdfFormulario15Linea65'])->name('convocatorias.proyectos.pdf-formulario15-linea65');
    Route::get('convocatorias/{convocatoria}/proyectos/{proyecto}/pdf-formulario16-linea65', [PdfController::class, 'generarPdfFormulario16Linea65'])->name('convocatorias.proyectos.pdf-formulario16-linea65');
    Route::get('convocatorias/{convocatoria}/proyectos/{proyecto}/pdf-formulario17-linea69', [PdfController::class, 'generarPdfFormulario17Linea69'])->name('convocatorias.proyectos.pdf-formulario17-linea69');

    /**
     * Productos
     *
     */
    Route::resource('convocatorias.proyectos.productos', ProductoController::class)->parameters(['convocatorias' => 'convocatoria', 'proyectos' => 'proyecto', 'productos' => 'producto'])->except(['show']);

    /**
     * Metodología y Actividades
     *
     */
    Route::put('convocatorias/{convocatoria}/proyectos/{proyecto}/actividades/metodologia/column/{column}', [ActividadController::class, 'updateLongColumn'])->name('convocatorias.proyectos.metodologia.updateLongColumn');
    Route::put('convocatorias/{convocatoria}/proyectos/{proyecto}/actividades/metodologia', [ActividadController::class, 'updateMetodologia'])->name('convocatorias.proyectos.metodologia');
    Route::put('convocatorias/{convocatoria}/proyectos/{proyecto}/actividades/metodologia-proyecto-formulario-4-linea-70', [ProyectoFormulario4Linea70Controller::class, 'updateMetodologiaProyectoFormulario4Linea70'])->name('convocatorias.proyectos.metodologia-proyecto-formulario-4-linea-70');
    Route::put('convocatorias/{convocatoria}/proyectos/{proyecto}/actividades/metodologia-proyecto-formulario-5-linea-69', [ProyectoFormulario5Linea69Controller::class, 'updateMetodologiaProyectoFormulario5Linea69'])->name('convocatorias.proyectos.metodologia-proyecto-formulario-5-linea-69');
    Route::put('convocatorias/{convocatoria}/proyectos/{proyecto}/actividades/metodologia-proyecto-formulario-10-linea-69', [ProyectoFormulario10Linea69Controller::class, 'updateMetodologiaProyectoFormulario10Linea69'])->name('convocatorias.proyectos.metodologia-proyecto-formulario-10-linea-69');
    Route::put('convocatorias/{convocatoria}/proyectos/{proyecto}/actividades/metodologia-proyecto-formulario-17-linea-69', [ProyectoFormulario17Linea69Controller::class, 'updateMetodologiaProyectoFormulario17Linea69'])->name('convocatorias.proyectos.metodologia-proyecto-formulario-17-linea-69');
    Route::put('convocatorias/{convocatoria}/proyectos/{proyecto}/actividades/metodologia-proyecto-formulario-11-linea-83', [ProyectoFormulario11Linea83Controller::class, 'updateMetodologiaProyectoFormulario11Linea83'])->name('convocatorias.proyectos.metodologia-proyecto-formulario-11-linea-83');
    Route::post('convocatorias/{convocatoria}/proyectos/{proyecto}/actividades/{actividad}/link-rubros-presupuestales', [ActividadController::class, 'linkRubrosPresupuestales'])->name('convocatorias.proyectos.actividades.link-rubros-presupuestales');
    Route::resource('convocatorias.proyectos.actividades', ActividadController::class)->parameters(['convocatorias' => 'convocatoria', 'proyectos' => 'proyecto', 'actividades' => 'actividad'])->except(['show']);

    /**
     * Roles SENNOVA de proyecto
     *
     */
    Route::resource('convocatorias.proyectos.proyecto-rol-sennova', ProyectoRolSennovaController::class)->parameters(['convocatorias' => 'convocatoria', 'proyectos' => 'proyecto', 'proyecto-rol-sennova' => 'proyecto-rol-sennova'])->except(['show']);

    /**
     * Análisis de riesgos
     *
     */
    Route::resource('convocatorias.proyectos.analisis-riesgos', AnalisisRiesgoController::class)->parameters(['analisis-riesgos' => 'analisis-riesgo'])->except(['show']);

    /**
     * Anexos de proyecto
     *
     */
    Route::get('convocatorias/{convocatoria}/proyectos/{proyecto}/proyecto-anexos/{proyecto_anexo}/download-file-sharepoint/{tipo_archivo}', [ProyectoAnexoController::class, 'downloadFileSharepoint'])->name('convocatorias.proyectos.proyecto-anexos.download-file-sharepoint');
    Route::get('convocatorias/{convocatoria}/proyectos/{proyecto}/proyecto-anexos/{proyecto_anexo}/download/{formato}', [ProyectoAnexoController::class, 'downloadServerFile'])->name('convocatorias.proyectos.proyecto-anexos.download');
    Route::resource('convocatorias.proyectos.proyecto-anexos', ProyectoAnexoController::class)->parameters(['proyecto-anexos' => 'proyecto-anexo'])->except(['show']);

    /**
     * Presupuesto de proyecto
     *
     */
    Route::get('convocatorias/{convocatoria}/proyectos/{proyecto}/presupuesto/{presupuesto}/download-file-sharepoint/{tipo_archivo}', [ProyectoPresupuestoController::class, 'downloadFileSharepoint'])->name('convocatorias.proyectos.presupuesto.download-file-sharepoint');
    Route::get('convocatorias/{convocatoria}/proyectos/{proyecto}/presupuesto/{presupuesto}/download/{formato}', [ProyectoPresupuestoController::class, 'downloadServerFile'])->name('convocatorias.proyectos.presupuesto.download');
    Route::post('convocatorias/{convocatoria}/proyectos/{proyecto}/presupuesto/{presupuesto}/estudio-mercado', [ProyectoPresupuestoController::class, 'storeEstudioMercado'])->name('convocatorias.proyectos.presupuesto.estudio-mercado.store');

    Route::post('convocatorias/{convocatoria}/proyectos/{proyecto}/presupuesto/{presupuesto}/concepto-viaticos', [ProyectoPresupuestoController::class, 'storeConceptoViaticos'])->name('convocatorias.proyectos.presupuesto.concepto-viaticos');
    Route::post('convocatorias/{convocatoria}/proyectos/{proyecto}/presupuesto/{presupuesto}/software-info', [ProyectoPresupuestoController::class, 'updateOrCreateSoftwareInfo'])->name('convocatorias.proyectos.presupuesto.software-info');
    Route::post('convocatorias/{convocatoria}/proyectos/{proyecto}/presupuesto/{presupuesto}/nodos-editoriales', [ProyectoPresupuestoController::class, 'updateOrCreateNodoEditorialInfo'])->name('convocatorias.proyectos.presupuesto.nodos-editoriales');


    Route::get('convocatorias/{convocatoria}/proyectos/{proyecto}/presupuesto/{presupuesto}/municipios', [ProyectoPresupuestoController::class, 'indexMunicipiosAVisitar'])->name('convocatorias.proyectos.presupuesto.municipios.index');
    Route::post('convocatorias/{convocatoria}/proyectos/{proyecto}/presupuesto/{presupuesto}/municipios', [ProyectoPresupuestoController::class, 'storeMunicipiosAVisitar'])->name('convocatorias.proyectos.presupuesto.municipios.store');
    Route::put('convocatorias/{convocatoria}/proyectos/{proyecto}/presupuesto/{presupuesto}/municipios/{viatico_municipio}', [ProyectoPresupuestoController::class, 'updateMunicipiosAVisitar'])->name('convocatorias.proyectos.presupuesto.municipios.update');
    Route::delete('convocatorias/{convocatoria}/proyectos/{proyecto}/presupuesto/{presupuesto}/municipios/{viatico_municipio}', [ProyectoPresupuestoController::class, 'destroyMunicipioAVisitar'])->name('convocatorias.proyectos.presupuesto.municipios.destroy');

    Route::resource('convocatorias.proyectos.presupuesto', ProyectoPresupuestoController::class)->parameters(['convocatorias' => 'convocatoria', 'proyectos' => 'proyecto', 'presupuesto' => 'presupuesto'])->except(['show']);

    /**
     * Soportes de estudio de mercado
     *
     */
    Route::get('convocatorias/{convocatoria}/proyectos/{proyecto}/presupuesto/{presupuesto}/soportes/{soporte}/download-file-sharepoint/{tipo_archivo}', [SoporteEstudioMercadoController::class, 'downloadFileSharepoint'])->name('convocatorias.proyectos.presupuesto.soportes.download-file-sharepoint');
    Route::get('convocatorias/{convocatoria}/proyectos/{proyecto}/presupuesto/{presupuesto}/soportes/{soporte}/download/{formato}', [SoporteEstudioMercadoController::class, 'downloadServerFile'])->name('convocatorias.proyectos.presupuesto.soportes.download');
    Route::post('convocatorias/{convocatoria}/proyectos/{proyecto}/presupuesto/{presupuesto}/soporte-proyecto-linea-68', [SoporteEstudioMercadoController::class, 'soporteEstudioMercadoProyectoLinea68'])->name('convocatorias.proyectos.presupuesto.soportes-proyecto-linea-68.store');
    Route::post('convocatorias/{convocatoria}/proyectos/{proyecto}/presupuesto/{presupuesto}/soportes/{soporte}/upload-soporte', [SoporteEstudioMercadoController::class, 'uploadSoporte'])->name('convocatorias.proyectos.presupuesto.soportes.upload-soporte');
    Route::resource('convocatorias.proyectos.presupuesto.soportes', SoporteEstudioMercadoController::class)->parameters(['convocatorias' => 'convocatoria', 'proyectos' => 'proyecto', 'presupuesto' => 'presupuesto', 'soportes' => 'soporte'])->except(['show']);

    /**
     * Rol SENNOVA de convocatoria
     *
     */
    Route::put('convocatorias/{convocatoria}/convocatoria-roles-sennova/{convocatoria_rol_sennova}/cambiar-estados',  [ConvocatoriaRolSennovaController::class, 'cambiarEstados'])->name('convocatorias.convocatoria-roles-sennova.cambiar-estados');
    Route::resource('convocatorias.convocatoria-roles-sennova',  ConvocatoriaRolSennovaController::class)->parameters(['convocatorias' => 'convocatoria', 'convocatoria-roles-sennova' => 'convocatoria-rol-sennova'])->except(['show']);

    /**
     * Presupuesto de convocatoria
     *
     */
    Route::post('convocatorias/{convocatoria}/convocatoria-rubros-presupuestales/rubros-completos',  [ConvocatoriaPresupuestoController::class, 'storeRubrosCompletos'])->name('convocatorias.convocatoria-rubros-presupuestales.store-rubros-completos');
    Route::put('convocatorias/{convocatoria}/convocatoria-rubros-presupuestales/{convocatoria_rubro_presupuestal}/cambiar-estados',  [ConvocatoriaPresupuestoController::class, 'cambiarEstados'])->name('convocatorias.convocatoria-rubros-presupuestales.cambiar-estados');
    Route::resource('convocatorias.convocatoria-rubros-presupuestales',  ConvocatoriaPresupuestoController::class)->parameters(['convocatorias' => 'convocatoria', 'convocatoria-rubros-presupuestales' => 'convocatoria-rubro-presupuestal'])->except(['show']);

    /**
     * Anexos
     *
     */
    Route::put('convocatorias/{convocatoria}/convocatoria-anexos/{convocatoria_anexo}/cambiar-estados',  [ConvocatoriaAnexoController::class, 'cambiarEstados'])->name('convocatorias.convocatoria-anexos.cambiar-estados');
    Route::resource('convocatorias.convocatoria-anexos', ConvocatoriaAnexoController::class)->parameters(['convocatorias' => 'convocatoria', 'convocatoria-anexos' => 'convocatoria-anexo'])->except(['show']);

    Route::get('anexos/{anexo}/download-file-sharepoint/archivo', [AnexoController::class, 'downloadFileSharepoint'])->name('anexos.download-file-sharepoint');
    Route::post('anexos/{anexo}/upload-archivo',  [AnexoController::class, 'uploadArchivo'])->name('anexos.upload-archivo');
    Route::resource('anexos',  AnexoController::class)->parameters(['anexos' => 'anexo'])->except(['show', 'create', 'edit']);

    /**
     * Primer grupo presupuestal
     *
     */
    Route::resource('primer-grupo-presupuestal',  PrimerGrupoPresupuestalController::class)->parameters(['primer-grupo-presupuestal' => 'primer-grupo-presupuestal'])->except(['show']);

    /**
     * Segundo grupo presupuestal
     *
     */
    Route::resource('segundo-grupo-presupuestal',  SegundoGrupoPresupuestalController::class)->parameters(['segundo-grupo-presupuestal' => 'segundo-grupo-presupuestal'])->except(['show']);

    /**
     * Tercer grupo presupuestal
     *
     */
    Route::resource('tercer-grupo-presupuestal',  TercerGrupoPresupuestalController::class)->parameters(['tercer-grupo-presupuestal' => 'tercer-grupo-presupuestal'])->except(['show']);

    /**
     * Usos presupuestales
     *
     */
    Route::resource('usos-presupuestales',  UsoPresupuestalController::class)->parameters(['usos-presupuestales' => 'uso-presupuestal'])->except(['show']);

    /**
     * Presupuesto SENNOVA
     *
     */
    Route::resource('rubros-presupuestales',  RubroPresupuestalController::class)->parameters(['rubros-presupuestales' => 'rubro-presupuestal'])->except(['show']);

    Route::get('configuracion-presupuesto-sennova',  [RubroPresupuestalController::class, 'configuracionRubroPresupuestal'])->name('configuracion-presupuesto-sennova');

    /**
     * Roles SENNOVA
     *
     */
    Route::resource('roles-sennova',  RolSennovaController::class)->parameters(['roles-sennova' => 'rol-sennova'])->except(['show']);

    /**
     * Usuarios
     *
     */
    Route::get('estudios-academicos/{estudio_academico}/download-file-sharepoint/{tipo_archivo}', [EstudioAcademicoController::class, 'downloadFileSharepoint'])->name('estudios-academicos.download-file-sharepoint');
    Route::put('estudios-academicos/{estudio_academico}/upload-soporte-titulo-obtenido', [EstudioAcademicoController::class, 'uploadSoporteTituloObtenido'])->name('estudios-academicos.upload-soporte-titulo-obtenido');
    Route::resource('estudios-academicos', EstudioAcademicoController::class)->parameters(['estudios-academicos' => 'estudio-academico'])->except(['index', 'show'])->withoutMiddleware(['auth', 'verified']);

    Route::get('formaciones-academicas-sena/{formacion_academica_sena}/download-file-sharepoint/{tipo_archivo}', [FormacionAcademicaSenaController::class, 'downloadFileSharepoint'])->name('formaciones-academicas-sena.download-file-sharepoint');
    Route::put('formaciones-academicas-sena/{formacion_academica_sena}/upload-certificado-formacion', [FormacionAcademicaSenaController::class, 'uploadCertificadoFormacion'])->name('formaciones-academicas-sena.upload-certificado-formacion');
    Route::resource('formaciones-academicas-sena', FormacionAcademicaSenaController::class)->parameters(['formaciones-academicas-sena' => 'formacion-academica-sena'])->except(['index', 'show'])->withoutMiddleware(['auth', 'verified']);

    Route::resource('participaciones-grupos-investigacion-sena', ParticipacionGrupoInvestigacionSenaController::class)->parameters(['participaciones-grupos-investigacion-sena' => 'participacion-gis'])->except(['index', 'show'])->withoutMiddleware(['auth', 'verified']);
    Route::resource('participaciones-proyectos-sennova', ParticipacionProyectoSennovaController::class)->parameters(['participaciones-proyectos-sennova' => 'participacion-ps'])->except(['index', 'show'])->withoutMiddleware(['auth', 'verified']);

    Route::get('/users/perfil', [UserController::class, 'showPerfil'])->name('users.perfil');
    Route::put('/users/cambiar-password', [UserController::class, 'cambiarPassword'])->name('users.cambiar-password');
    Route::put('/users/asignacion-roles', [UserController::class, 'asignacionRoles'])->name('users.asignacion-roles');
    Route::put('/users/informacion-completa', [UserController::class, 'informacionUsuarioCompleta'])->name('users.informacion-completa');
    Route::put('/users/habilitar-usuario', [UserController::class, 'habilitarUsuario'])->name('users.habilitar-usuario');
    Route::resource('users',  UserController::class)->except(['show']);

    /**
     * Roles de sistema
     *
     */
    Route::resource('roles', RoleController::class)->except(['show']);

    /**
     * Proyectos modernización
     *
     */
    Route::get('ambientes-modernizacion/{ambiente_modernizacion}/download', [AmbienteModernizacionController::class, 'download'])->name('ambientes-modernizacion.download');
    Route::get('ambientes-modernizacion/{ambiente_modernizacion}/download-file-sharepoint/{tipo_archivo}', [AmbienteModernizacionController::class, 'downloadFileSharepoint'])->name('ambientes-modernizacion.download-file-sharepoint');

    Route::get('seguimientos-ambiente-modernizacion/{seguimiento}/equipos-ambiente-modernizacion', [AmbienteModernizacionController::class, 'listaEquipos'])->name('equipos-ambiente-modernizacion.index');
    Route::post('seguimientos-ambiente-modernizacion/{seguimiento}/equipos-ambiente-modernizacion/store', [AmbienteModernizacionController::class, 'updateCreateEquipo'])->name('equipos-ambiente-modernizacion.update-create-equipo');
    Route::post('seguimientos-ambiente-modernizacion/{seguimiento}/replicate', [AmbienteModernizacionController::class, 'replicateRow'])->name('seguimientos-ambiente-modernizacion.replicate');
    Route::delete('ambientes-modernizacion/equipos-ambiente-modernizacion/{equipo_ambiente_modernizacion}/destroy', [AmbienteModernizacionController::class, 'destroyEquipo'])->name('equipos-ambiente-modernizacion.destroy');
    Route::resource('ambientes-modernizacion', AmbienteModernizacionController::class)->parameters(['ambientes-modernizacion' => 'ambiente-modernizacion'])->except(['show']);

    /**
     * Proyectos
     *
     */
    Route::get('proyectos/activos', [ProyectoController::class, 'activos'])->name('proyectos.activos');
    Route::get('proyectos', [ProyectoController::class, 'index'])->name('proyectos.index');
    Route::get('proyectos/{proyecto}/editar', [ProyectoController::class, 'editProyecto'])->name('proyectos.edit');
    Route::put('proyectos/{proyecto}/editar', [ProyectoController::class, 'update'])->name('proyectos.update');
    Route::post('proyectos/actualizar-estados-proyectos', [ProyectoController::class, 'udpdateEstadosProyectos'])->name('proyectos.update.actualizar-estados-proyectos');
    Route::post('proyectos/actualizar-estados-todos-proyectos', [ProyectoController::class, 'actualizarEstadosTodosProyectos'])->name('proyectos.update.actualizar-estados-todos-proyectos');

    /**
     * Evaluaciones
     *
     */
    Route::put('convocatorias/{convocatoria}/evaluaciones/{evaluacion}/proyecto-rol-sennova/{proyecto_rol_sennova}', [ProyectoRolSennovaController::class, 'updateEvaluacion'])->name('convocatorias.evaluaciones.proyecto-rol-sennova.update');

    Route::put('convocatorias/{convocatoria}/evaluaciones/{evaluacion}/articulacion', [ArticulacionSennovaController::class, 'updatedArticulacionSennovaEvaluacion'])->name('convocatorias.evaluaciones.articulacion-sennova.guardar-evaluacion');

    Route::put('convocatorias/{convocatoria}/evaluaciones/{evaluacion}/presupuesto', [ProyectoPresupuestoController::class, 'updatedProyectoPresupuestoEvaluacion'])->name('convocatorias.evaluaciones.proyecto-presupuesto.guardar-evaluacion');
    Route::put('convocatorias/{convocatoria}/evaluaciones/{evaluacion}/presupuesto/{presupuesto}', [ProyectoPresupuestoController::class, 'updateEvaluacion'])->name('convocatorias.evaluaciones.presupuesto.update');

    Route::put('convocatorias/{convocatoria}/evaluaciones/{evaluacion}/edt', [EdtController::class, 'updateEdtEvaluacion'])->name('convocatorias.evaluaciones.edt.guardar-evaluacion');

    Route::put('convocatorias/{convocatoria}/evaluaciones/{evaluacion}/inventario-equipos', [InventarioEquipoController::class, 'updateInventarioEquiposEvaluacion'])->name('convocatorias.evaluaciones.inventario-equipos.guardar-evaluacion');

    Route::put('convocatorias/{convocatoria}/evaluaciones/{evaluacion}/anexos', [ProyectoAnexoController::class, 'updateAnexosEvaluacion'])->name('convocatorias.evaluaciones.anexos.guardar-evaluacion');

    Route::put('convocatorias/{convocatoria}/evaluaciones/{evaluacion}/entidades-aliadas/verificar', [EntidadAliadaController::class, 'validarEntidadAliada'])->name('convocatorias.evaluaciones.entidades-aliadas.verificar');
    Route::put('convocatorias/{convocatoria}/evaluaciones/{evaluacion}/entidades-aliadas', [EntidadAliadaController::class, 'updateEntidadAliadaEvaluacion'])->name('convocatorias.evaluaciones.entidades-aliadas.guardar-evaluacion');

    Route::put('convocatorias/{convocatoria}/evaluaciones/{evaluacion}/actividades', [ActividadController::class, 'updateMetodologiaEvaluacion'])->name('convocatorias.evaluaciones.actividades.guardar-evaluacion');

    Route::put('convocatorias/{convocatoria}/evaluaciones/{evaluacion}/productos', [ProductoController::class, 'updateProductosEvaluacion'])->name('convocatorias.evaluaciones.productos.guardar-evaluacion');

    Route::put('convocatorias/{convocatoria}/evaluaciones/{evaluacion}/analisis-riesgos', [AnalisisRiesgoController::class, 'updateAnalisisRiesgosEvaluacion'])->name('convocatorias.evaluaciones.analisis-riesgos.guardar-evaluacion');

    Route::put('convocatorias/{convocatoria}/evaluaciones/{evaluacion}/arbol-problemas', [ArbolProyectoController::class, 'updateArbolProblemasEvaluacion'])->name('convocatorias.evaluaciones.arbol-problemas.guardar-evaluacion');
    Route::put('convocatorias/{convocatoria}/evaluaciones/{evaluacion}/arbol-objetivos', [ArbolProyectoController::class, 'updateArbolObjetivosEvaluacion'])->name('convocatorias.evaluaciones.arbol-objetivos.guardar-evaluacion');

    Route::get('convocatorias/{convocatoria}/evaluaciones/{evaluacion}/finalizar-evaluacion', [ProyectoController::class, 'summaryEvaluacion'])->name('convocatorias.evaluaciones.summary');
    Route::put('convocatorias/{convocatoria}/evaluaciones/{evaluacion}/cadena-valor', [ProyectoController::class, 'updateCadenaValorEvaluacion'])->name('convocatorias.evaluaciones.cadena-valor.guardar-evaluacion');
    Route::put('convocatorias/{convocatoria}/evaluaciones/{evaluacion}/finalizar-evaluacion', [ProyectoController::class, 'finalizarEvaluacion'])->name('convocatorias.evaluaciones.finish');
    Route::put('convocatorias/{convocatoria}/evaluaciones/{evaluacion}/preguntas-finales', [ProyectoController::class, 'preguntasFinales'])->name('convocatorias.evaluaciones.preguntas-finales');

    Route::get('evaluaciones/activas', [EvaluacionController::class, 'activas'])->name('evaluaciones.activas');
    Route::post('evaluaciones/actualizar-estados-evaluaciones', [EvaluacionController::class, 'udpdateEstadosEvaluaciones'])->name('evaluaciones.update.actualizar-estados-evaluaciones');
    Route::post('convocatorias/evaluaciones/deshabilitar-evaluaciones', [EvaluacionController::class, 'deshabilitarEvaluacionesNoIniciadas'])->name('convocatorias.evaluaciones.deshabilitar');
    Route::post('convocatorias/{convocatoria}/evaluaciones/{evaluacion}/comentarios-generales', [EvaluacionController::class, 'udpdateComentariosGenerales'])->name('convocatorias.evaluaciones.update-comentarios-generales');
    Route::post('convocatorias/{convocatoria}/evaluaciones/{evaluacion}/causales-rechazo', [EvaluacionController::class, 'updateCausalRechazo'])->name('convocatorias.evaluaciones.update-causal-rechazo');

    // Evaluación de proyectos de la línea 66
    Route::put('convocatorias/{convocatoria}/proyectos/{proyecto}/update-evaluacion', [ProyectoFormulario8Linea66Controller::class, 'updateEvaluacion'])->name('convocatorias.evaluaciones-proyecto-linea-66.update');

    Route::resource('evaluaciones', EvaluacionController::class)->parameters(['evaluaciones' => 'evaluacion'])->except(['show']);

    /**
     * Reportes
     *
     */
    Route::post('reportes/censo-sennova', [ReporteController::class, 'censoSennova'])->name('reportes.censo-sennova');
    Route::get('reportes/grupos-investigacion', [ReporteController::class, 'gruposInvestigacion'])->name('reportes.grupos-investigacion');

    Route::get('reportes', [ReporteController::class, 'index'])->name('reportes.index');
    Route::get('reportes/convocatoria/{convocatoria}/resumen', [ReporteController::class, 'resumenProyectos'])->name('reportes.resumen-proyectos');
    Route::get('reportes/convocatoria/{convocatoria}/presupuestos-roles', [ReporteController::class, 'resumenPresupuestos'])->name('reportes.resumePresupuestos');
    Route::get('reportes/convocatoria/{convocatoria}/reportes/evaluaciones', [ReporteController::class, 'evaluacionesExcel'])->name('reportes.evaluaciones');
    Route::get('reportes/convocatoria/{convocatoria}/comentarios-evaluaciones', [ReporteController::class, 'comentariosEvaluacionesExcel'])->name('reportes.comentarios-evaluaciones');
    Route::get('reportes/convocatoria/{convocatoria}/resumen-presupuesto-aprobado', [ReporteController::class, 'EvaluacionesProyectosPresupuestoExport'])->name('reportes.resumeProyectoPresupuestoAprobado');
    Route::get('reportes/convocatoria/{convocatoria}/proyectos-ta', [ReporteController::class, 'proyectosTaExport'])->name('reportes.proyectos-ta');
    Route::get('reportes/convocatoria/{convocatoria}/proyectos-idi', [ReporteController::class, 'proyectosIdiExport'])->name('reportes.proyectos-idi');
    Route::get('reportes/convocatoria/{convocatoria}/proyectos-tp', [ReporteController::class, 'proyectosTpExport'])->name('reportes.proyectos-tp');
    Route::get('reportes/convocatoria/{convocatoria}/proyectos-st', [ReporteController::class, 'proyectosStExport'])->name('reportes.proyectos-st');
    Route::get('reportes/convocatoria/{convocatoria}/proyectos-cultura-innovacion', [ReporteController::class, 'proyectosCulturaInnovacionExport'])->name('reportes.proyectos-cultura-innovacion');
    Route::get('reportes/grupos-lineas-semilleros', [ReporteController::class, 'gruposLineasSemillerosExport'])->name('reportes.grupos-lineas-semilleros');
    Route::get('reportes/proyectos-capacidad-instalada', [ReporteController::class, 'proyectosCapacidadInstaladaExport'])->name('reportes.proyectos-capacidad-instalada');

    /**
     * Tokens
     *
     */
    Route::prefix('tokens')->group(function () {
        Route::post('create', [ApiController::class, 'CreateToken'])->name('tokens.create');
    });
});

Route::middleware(['checkToken'])->name('v1.')->prefix('api/v1')->group(function () {
    // API Resources
    Route::get('user_sennova', [ApiController::class, 'isUserSennova'])->name('user_sennova');
    Route::get('user_sennova/{id}/projects', [ApiController::class, 'projectsByUser'])->name('projects_by_user');
    Route::get('center/{id}/projects', [ApiController::class, 'projectsByCenter'])->name('projects_by_center');
    Route::get('projects/{id}', [ApiController::class, 'summaryProject'])->name('project');
});

require __DIR__ . '/auth.php';
