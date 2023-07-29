<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\API\ApiController;
use App\Http\Controllers\API\WebController;

use App\Http\Controllers\UserController;
use App\Http\Controllers\RegionalController;
use App\Http\Controllers\CentroFormacionController;
use App\Http\Controllers\ProgramaFormacionController;
use App\Http\Controllers\LineaProgramaticaController;
use App\Http\Controllers\RedConocimientoController;
use App\Http\Controllers\TematicaEstrategicaController;
use App\Http\Controllers\LineaTecnicaController;
use App\Http\Controllers\GrupoInvestigacionController;
use App\Http\Controllers\LineaInvestigacionController;
use App\Http\Controllers\SemilleroInvestigacionController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\ConvocatoriaController;
use App\Http\Controllers\ProyectoLinea66Controller;
use App\Http\Controllers\ArbolProyectoController;
use App\Http\Controllers\ProductoController;
use App\Http\Controllers\ProyectoController;
use App\Http\Controllers\ActividadController;
use App\Http\Controllers\AmbienteModernizacionController;
use App\Http\Controllers\ConvocatoriaRolSennovaController;
use App\Http\Controllers\RolSennovaController;
use App\Http\Controllers\ProyectoRolSennovaController;
use App\Http\Controllers\PrimerGrupoPresupuestalController;
use App\Http\Controllers\SegundoGrupoPresupuestalController;
use App\Http\Controllers\TercerGrupoPresupuestalController;
use App\Http\Controllers\PresupuestoSennovaController;
use App\Http\Controllers\ConvocatoriaPresupuestoController;
use App\Http\Controllers\ProyectoPresupuestoController;
use App\Http\Controllers\AnalisisRiesgoController;
use App\Http\Controllers\EntidadAliadaController;
use App\Http\Controllers\AnexoController;
use App\Http\Controllers\ArticulacionSennovaController;
use App\Http\Controllers\ProyectoLinea70Controller;
use App\Http\Controllers\ProyectoLinea69Controller;
use App\Http\Controllers\ProyectoAnexoController;
use App\Http\Controllers\UsoPresupuestalController;
use App\Http\Controllers\MiembroEntidadAliadaController;
use App\Http\Controllers\TecnoacademiaController;
use App\Http\Controllers\LineaTecnoacademiaController;
use App\Http\Controllers\MesaSectorialController;
use App\Http\Controllers\ProyectoLinea68Controller;
use App\Http\Controllers\ProyectoLinea65Controller;
use App\Http\Controllers\DisenoCurricularController;
use App\Http\Controllers\EdtController;
use App\Http\Controllers\ProyectoCapacidadInstaladaController;

use App\Http\Controllers\Evaluacion\EvaluacionController;
use App\Http\Controllers\InventarioEquipoController;

use App\Http\Controllers\Perfil\EstudioAcademicoController;
use App\Http\Controllers\Perfil\FormacionAcademicaSenaController;
use App\Http\Controllers\Perfil\ParticipacionGrupoInvestigacionSenaController;
use App\Http\Controllers\Perfil\ParticipacionProyectoSennovaController;

use App\Http\Controllers\SoporteEstudioMercadoController;
use App\Http\Controllers\PdfController;
use App\Http\Controllers\ProyectoIdiTecnoacademiaController;
use App\Http\Controllers\ReporteController;
use App\Http\Controllers\LineaTecnoparqueController;
use App\Http\Controllers\NodoTecnoparqueController;
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
Route::get('web-api/centros-formacion', [WebController::class, 'centrosFormacion'])->name('web-api.centros-formacion');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('manual-usuario/download', [ProyectoController::class, 'downloadManualUsuario'])->name('manual-usuario.download');

    Route::get('/', [WebController::class, 'dashboard'])->name('dashboard');

    Route::get('/proyectos/{proyecto}/download-any-file/{fileId}/{file}', [ProyectoController::class, 'downloadFileSharepoint'])->name('proyectos.download-any-file');

    // Notificaciones
    Route::get('notificaciones', [UserController::class, 'showAllNotifications'])->name('notificaciones.index');
    Route::post('notificaciones/marcar-leido', [UserController::class, 'markAsReadNotification'])->name('notificaciones.marcar-leido');

    // Redirecciona según el tipo de proyecto
    Route::get('convocatorias/{convocatoria}/proyectos/{proyecto}/editar', [ProyectoController::class, 'edit'])->name('convocatorias.proyectos.edit');

    //Exporta resumen proyecto PDF
    Route::get('convocatorias/{convocatoria}/proyectos/{proyecto}/pdf', [PdfController::class, 'generateResumenProyecto'])->name('convocatorias.proyectos.pdf');

    //Exporta proyecto post-cierre del ambiente de modernizacion en PDF
    Route::get('ambientes-modernizacion/{ambiente_modernizacion}/pdf', [AmbienteModernizacionController::class, 'descargarPdfAmbienteModernizacion'])->name('ambientes-modernizacion.descargar-pdf');

    Route::resource('estudios-academicos', EstudioAcademicoController::class)->parameters(['estudios-academicos' => 'estudio-academico'])->except(['index', 'show'])->withoutMiddleware(['auth', 'verified']);
    Route::resource('formaciones-academicas-sena', FormacionAcademicaSenaController::class)->parameters(['formaciones-academicas-sena' => 'formacion-academica-sena'])->except(['index', 'show'])->withoutMiddleware(['auth', 'verified']);
    Route::resource('participaciones-grupos-investigacion-sena', ParticipacionGrupoInvestigacionSenaController::class)->parameters(['participaciones-grupos-investigacion-sena' => 'participacion-gis'])->except(['index', 'show'])->withoutMiddleware(['auth', 'verified']);
    Route::resource('participaciones-proyectos-sennova', ParticipacionProyectoSennovaController::class)->parameters(['participaciones-proyectos-sennova' => 'participacion-ps'])->except(['index', 'show'])->withoutMiddleware(['auth', 'verified']);
    Route::put('/users/perfil', [UserController::class, 'changeUserProfile'])->name('users.change-user-profile');
    Route::put('/users/cambiar-password', [UserController::class, 'cambiarPassword'])->name('users.cambiar-password');
    Route::get('/users/perfil', [UserController::class, 'showPerfil'])->name('users.perfil');

    // Muestra los participantes
    Route::post('convocatorias/{convocatoria}/proyectos/{proyecto}/participantes/{integrante}/cambiar-autor-principal', [ProyectoController::class, 'cambiarAutorPrincipal'])->name('convocatorias.proyectos.participantes.nuevo-autor-principal');
    Route::get('convocatorias/{convocatoria}/proyectos/{proyecto}/participantes', [ProyectoController::class, 'participantes'])->name('convocatorias.proyectos.participantes');
    Route::post('convocatorias/{convocatoria}/proyectos/{proyecto}/participantes/users/link', [ProyectoController::class, 'linkParticipante'])->name('convocatorias.proyectos.participantes.users.link');
    Route::put('convocatorias/{convocatoria}/proyectos/{proyecto}/participantes/users/link', [ProyectoController::class, 'updateParticipante'])->name('convocatorias.proyectos.participantes.users.update');
    Route::delete('convocatorias/{convocatoria}/proyectos/{proyecto}/participantes/users/{user}/unlink', [ProyectoController::class, 'unlinkParticipante'])->name('convocatorias.proyectos.participantes.users.unlink');

    // Vincula y filtra los programas
    Route::post('convocatorias/{convocatoria}/proyectos/{proyecto}/participantes/programas-formacion', [ProyectoController::class, 'filterProgramasFormacion'])->name('convocatorias.proyectos.participantes.programas-formacion');
    Route::post('convocatorias/{convocatoria}/proyectos/{proyecto}/participantes/programas-formacion/link', [ProyectoController::class, 'linkProgramaFormacion'])->name('convocatorias.proyectos.participantes.programas-formacion.link');
    Route::delete('convocatorias/{convocatoria}/proyectos/{proyecto}/participantes/programas-formacion/unlink', [ProyectoController::class, 'unlinkProgramaFormacion'])->name('convocatorias.proyectos.participantes.programas-formacion.unlink');

    // Vincula y filtra los semilleros
    Route::post('convocatorias/{convocatoria}/proyectos/{proyecto}/participantes/semilleros-investigacion', [ProyectoController::class, 'filterSemillerosInvestigacion'])->name('convocatorias.proyectos.participantes.semilleros-investigacion');
    Route::post('convocatorias/{convocatoria}/proyectos/{proyecto}/participantes/semilleros-investigacion/{semillero_investigacion}/link', [ProyectoController::class, 'linkSemilleroInvestigacion'])->name('convocatorias.proyectos.participantes.semilleros-investigacion.link');
    Route::delete('convocatorias/{convocatoria}/proyectos/{proyecto}/participantes/semilleros-investigacion/{semillero_investigacion}/unlink', [ProyectoController::class, 'unlinkSemilleroInvestigacion'])->name('convocatorias.proyectos.participantes.semilleros-investigacion.unlink');

    Route::put('convocatorias/{convocatoria}/proyectos/{proyecto}/cadena-valor/propuesta-sostenibilidad', [ProyectoController::class, 'updatePropuestaSostenibilidad'])->name('convocatorias.proyectos.propuesta-sostenibilidad');
    Route::get('convocatorias/{convocatoria}/proyectos/{proyecto}/cadena-valor', [ProyectoController::class, 'showCadenaValor'])->name('convocatorias.proyectos.cadena-valor');

    // Trae las actividades por resultado
    Route::get('web-api/resultados/{resultado}/actividades', [WebController::class, 'resultadosActividades'])->name('web-api.resultados.actividades');

    // Trae los conceptos internos SENA
    Route::get('web-api/segundo-grupo-presupuestal/{linea_programatica}', [WebController::class, 'segundoGrupoPresupuestal'])->name('web-api.segundo-grupo-presupuestal');

    Route::get('web-api/tercer-grupo-presupuestal/{segundo_grupo_presupuestal}', [WebController::class, 'tercerGrupoPresupuestal'])->name('web-api.tercer-grupo-presupuestal');

    // Trae los usos presupuestales
    Route::get('web-api/convocatorias/{convocatoria}/lineas-programaticas/{linea_programatica}/presupuesto-sennova/segundo-grupo-presupuestal/{segundo_grupo_presupuestal}/tercer-grupo-presupuestal/{tercer_grupo_presupuestal}', [WebController::class, 'usosPresupuestales'])->name('web-api.usos-presupuestales');

    Route::get('web-api/convocatorias/{convocatoria}/proyectos/{proyecto}/{linea_programatica}/roles-sennova', [WebController::class, 'rolesSennova'])->name('web-api.convocatorias.roles-sennova');

    /**
     * Programas de formación
     *
     */
    Route::get('web-api/centros-formacion/{centro_formacion}/programas-formacion', [WebController::class, 'programasFormacion'])->name('web-api.programas-formacion');

    /**
     * Estados de sistema de gestión
     *
     */
    Route::get('web-api/estados-sistema-gestion/{tipo_proyecto_st}', [WebController::class, 'estadosSistemaGestion'])->name('web-api.estados-sistema-gestion');

    /**
     * Regionales
     *
     * Trae las regiones
     */
    Route::get('web-api/regiones', [WebController::class, 'regiones'])->name('web-api.regiones');

    /**
     * Trae las regionales
     */
    Route::get('web-api/regionales', [WebController::class, 'regionales'])->name('web-api.regionales');

    Route::resource('regionales', RegionalController::class)->parameters(['regionales' => 'regional'])->except(['show']);

    /**
     * Trae los centros de formación por regional
     */
    Route::get('web-api/regional/{regional}/centros-formacion', [WebController::class, 'centrosFormacionRegional'])->name('web-api.centros-formacion-ejecutor');

    /**
     * Centros de formación
     *
     * Trae los subdirectores
     */
    Route::get('web-api/users/{rol}', [WebController::class, 'subdirectores'])->name('web-api.users');

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
     * Anexos
     *
     */
    Route::get('anexos/{anexo}/download-file-sharepoint/{tipo_archivo}', [AnexoController::class, 'downloadFileSharepoint'])->name('anexos.download-file-sharepoint');
    Route::get('anexos/{anexo}/download/{formato}', [AnexoController::class, 'downloadServerFile'])->name('anexos.download');
    Route::resource('anexos', AnexoController::class)->parameters(['anexos' => 'anexo'])->except(['show']);

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
     * Grupos de investigación
     *
     */
    Route::get('grupos-investigacion/{grupo_investigacion}/download-file-sharepoint/{tipo_archivo}', [GrupoInvestigacionController::class, 'downloadFileSharepoint'])->name('grupos-investigacion.download-file-sharepoint');
    Route::get('grupos-investigacion/{grupo_investigacion}/download/{formato}', [GrupoInvestigacionController::class, 'downloadServerFile'])->name('grupos-investigacion.download');
    Route::resource('grupos-investigacion', GrupoInvestigacionController::class)->parameters(['grupos-investigacion' => 'grupo-investigacion'])->except(['show']);

    /**
     * Líneas de investigación
     *
     * Trae las líneas de investigación
     *
     */
    Route::get('web-api/grupos-investigacion', [WebController::class, 'gruposInvestigacion'])->name('web-api.grupos-investigacion');

    Route::get('web-api/centros-formacion-grupo-investigacion/{grupo_investigacion}', [WebController::class, 'centrosFormacionGrupoInvestigacion'])->name('web-api.centros-formacion-grupo-investigacion');

    Route::resource('grupos-investigacion.lineas-investigacion', LineaInvestigacionController::class)->parameters(['grupos-investigacion' => 'grupo-investigacion', 'lineas-investigacion' => 'linea-investigacion'])->except(['show']);

    /**
     * Semilleros de investigación
     *
     * Trae los semilleros de investigación
     */
    Route::get('web-api/lineas-investigacion/{centro_formacion}', [WebController::class, 'lineasInvestigacion'])->name('web-api.lineas-investigacion');

    Route::get('grupos-investigacion/{grupo_investigacion}/semilleros-investigacion/{semillero_investigacion}/download-file-sharepoint/{tipo_archivo}', [SemilleroInvestigacionController::class, 'downloadFileSharepoint'])->name('semilleros-investigacion.download-file-sharepoint');
    Route::get('grupos-investigacion/{grupo_investigacion}/semilleros-investigacion/{semillero_investigacion}/download/{formato}', [SemilleroInvestigacionController::class, 'downloadServerFile'])->name('grupos-investigacion.semilleros-investigacion.download');
    Route::resource('grupos-investigacion.semilleros-investigacion', SemilleroInvestigacionController::class)->parameters(['grupos-investigacion' => 'grupo-investigacion', 'semilleros-investigacion' => 'semillero-investigacion'])->except(['show']);

    Route::resource('grupos-investigacion.semilleros-investigacion', SemilleroInvestigacionController::class)->parameters(['grupos-investigacion' => 'grupo-investigacion', 'semilleros-investigacion' => 'semillero-investigacion'])->except(['show']);

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
     * Web api
     *
     */
    Route::get('web-api/municipios', [WebController::class, 'municipios'])->name('web-api.municipios');

    /**
     * Web api
     *
     * Trae las Tecnoacademias
     */
    Route::get('web-api/tecnoacademias', [WebController::class, 'tecnoacademias'])->name('web-api.tecnoacademias');

    /**
     * Web api
     *
     * Trae las tecnoacademias centro_formacion
     */
    Route::get('web-api/centros-formacion/{centro_formacion}/tecnoacademias', [WebController::class, 'tecnoacademiasCentroFormacion'])->name('web-api.centros-formacion.tecnoacademias');

    /**
     * Web api
     *
     * Trae las líneas tecnoacademia
     */
    Route::get('web-api/tecnoacademias/{tecnoacademia}/lineas-tecnoacademia', [WebController::class, 'líneasTecnoacademia'])->name('web-api.tecnoacademias.lineas-tecnoacademia');

    /**
     * Web api
     *
     * Trae los nodos tecnoparque
     */
    Route::get('web-api/nodos-tecnoparque/{centro_formacion}', [WebController::class, 'nodosTecnoparque'])->name('web-api.nodos-tecnoparque');

    /**
     * Web api
     *
     * Trae las líneas programáticas
     */
    Route::get('web-api/lineas-programaticas/{categoria_proyecto}', [WebController::class, 'líneasProgramaticas'])->name('web-api.lineas-programaticas');

    /**
     * Web api
     *
     * Trae los programas de formación por línea de investigación
     */
    Route::get('web-api/linea-investigacion-programa-formacion/{linea_investigacion}', [WebController::class, 'líneaInvestigacionProgramaFormacion'])->name('web-api.linea-investigacion-programa-formacion');

    /**
     * Web api
     *
     * Trae las redes de conocimiento
     */
    Route::get('web-api/redes-conocimiento', [WebController::class, 'redesConocimiento'])->name('web-api.redes-conocimiento');

    /**
     * Web api
     *
     * Trae las áreas de conocimiento
     */
    Route::get('web-api/areas-conocimiento', [WebController::class, 'areasConocimiento'])->name('web-api.areas-conocimiento');

    /**
     * Web api
     *
     * Trae las subáreas de conocimiento
     */
    Route::get('web-api/subareas-conocimiento/{area_conocimiento}', [WebController::class, 'subareasConocimiento'])->name('web-api.subareas-conocimiento');

    /**
     * Web api
     *
     * Trae las disciplinas de subáreas de conocimiento
     */
    Route::get('web-api/disciplinas-subarea-conocimiento/{subarea_conocimiento}', [WebController::class, 'disciplinasSubareaConocimiento'])->name('web-api.disciplinas-subarea-conocimiento');

    /**
     * Web api
     *
     * Trae los tipos de proyectos de capacidad instalada
     */
    Route::get('web-api/tipos-proyecto-capacidad-instalada', [WebController::class, 'tiposProyectoCapacidadInstalada'])->name('web-api.tipos-proyecto-capacidad-instalada');

    /**
     * Web api
     *
     * Trae los subtipos de proyectos de capacidad instalada
     */
    Route::get('web-api/subtipos-proyecto-capacidad-instalada/{tipo_proy_capacidad_instalada}', [WebController::class, 'subtiposProyectoCapacidadInstalada'])->name('web-api.subtipos-proyecto-capacidad-instalada');

    /**
     * Web api
     *
     * Trae los semilleros de investigación
     */
    Route::get('web-api/semilleros-conocimiento/{linea_investigacion}', [WebController::class, 'semillerosInvestigacion'])->name('web-api.semilleros-investigacion');

    /**
     * Web api
     *
     * Trae los actividades económicas
     */
    Route::get('web-api/actividades-economicas', [WebController::class, 'actividadesEconomicas'])->name('web-api.actividades-economicas');

    /**
     * Web api
     *
     * Trae las temáticas estrategicas SENA
     */
    Route::get('web-api/tematicas-estrategicas', [WebController::class, 'tematicasEstrategicas'])->name('web-api.tematicas-estrategicas');

    /**
     * Web api
     *
     * Trae las subtipologías Minciencias
     */
    Route::get('web-api/subtipologias-minciencias', [WebController::class, 'subtipologiasMinciencias'])->name('web-api.subtipologias-minciencias');

    Route::get('convocatorias/{convocatoria}/proyectos/{proyecto}/finalizar-proyecto', [ProyectoController::class, 'summary'])->name('convocatorias.proyectos.summary');
    Route::put('convocatorias/{convocatoria}/proyectos/{proyecto}/finalizar-proyecto', [ProyectoController::class, 'finalizarProyecto'])->name('convocatorias.proyectos.finish');
    Route::put('convocatorias/{convocatoria}/proyectos/{proyecto}/enviar-proyecto-evaluar', [ProyectoController::class, 'enviarAEvaluacion'])->name('convocatorias.proyectos.send');
    Route::put('convocatorias/{convocatoria}/proyectos/{proyecto}/comentario-proyecto', [ProyectoController::class, 'devolverProyecto'])->name('convocatorias.proyectos.return-project');
    Route::get('convocatorias/{convocatoria}/proyectos/{proyecto}/descargar-version/{version}', [ProyectoController::class, 'descargarPdf'])->name('convocatorias.proyectos.version');

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
    Route::resource('convocatorias.proyectos.entidades-aliadas', EntidadAliadaController::class)->parameters(['convocatorias' => 'convocatoria', 'proyectos' => 'proyecto', 'entidades-aliadas' => 'entidad-aliada'])->except(['show']);
    Route::resource('convocatorias.proyectos.entidades-aliadas.miembros-entidad-aliada', MiembroEntidadAliadaController::class)->parameters(['convocatorias' => 'convocatoria', 'proyectos' => 'proyecto', 'entidades-aliadas' => 'entidad-aliada', 'miembros-entidad-aliada' => 'miembro-entidad-aliada'])->except(['show']);

    /**
     * Articulación SENNOVA
     *
     */
    Route::get('convocatorias/{convocatoria}/proyectos/{proyecto}/articulacion', [ArticulacionSennovaController::class, 'showArticulacionSennova'])->name('convocatorias.proyectos.articulacion-sennova');
    Route::post('convocatorias/{convocatoria}/proyectos/{proyecto}/articulacion', [ArticulacionSennovaController::class, 'storeArticulacionSennova'])->name('convocatorias.proyectos.articulacion-sennova.store');

    /**
     * Idi
     *
     */
    Route::post('convocatorias/{convocatoria}/proyectos-linea-66/{proyecto_linea_66}/indicadores', [ProyectoLinea66Controller::class, 'storeIndicadores'])->name('convocatorias.proyectos-linea-66.indicadores.store');
    Route::get('convocatorias/{convocatoria}/proyectos-linea-66/{proyecto_linea_66}/indicadores', [ProyectoLinea66Controller::class, 'showIndicadores'])->name('convocatorias.proyectos-linea-66.indicadores');
    Route::put('convocatorias/{convocatoria}/proyectos-linea-66/{proyecto_linea_66}/column/{column}', [ProyectoLinea66Controller::class, 'updateLongColumn'])->name('convocatorias.proyectos-linea-66.updateLongColumn');
    Route::resource('convocatorias.proyectos-linea-66', ProyectoLinea66Controller::class)->parameters(['convocatorias' => 'convocatoria', 'proyectos-linea-66' => 'proyecto-linea-66'])->except(['show']);

    /**
     * Cultura innovacion - Estrategia Nacional
     *
     */
    Route::post('convocatorias/{convocatoria}/proyectos-linea-65/{proyecto_linea_65}/column/{column}', [ProyectoLinea65Controller::class, 'updateLongColumn'])->name('convocatorias.proyectos-linea-65.updateLongColumn');
    Route::resource('convocatorias.proyectos-linea-65', ProyectoLinea65Controller::class)->parameters(['convocatorias' => 'convocatoria', 'proyectos-linea-65' => 'proyecto-linea-65'])->except(['show']);

    /**
     * Tp - Estrategia nacional
     *
     */
    Route::get('convocatorias/{convocatoria}/proyectos-linea-69/{proyecto_linea_69}/download-file-sharepoint/{tipo_archivo}', [ProyectoLinea69Controller::class, 'downloadFileSharepoint'])->name('convocatorias.proyectos-linea-69.download-file-sharepoint');
    Route::resource('convocatorias.proyectos-linea-69', ProyectoLinea69Controller::class)->parameters(['convocatorias' => 'convocatoria', 'proyectos-linea-69' => 'proyecto-linea-69'])->except(['show']);
    Route::put('convocatorias/{convocatoria}/tp/{tp}/column/{column}', [ProyectoLinea69Controller::class, 'updateLongColumn'])->name('convocatorias.proyectos-linea-69.updateLongColumn');

    /**
     * Ta - Estrategia nacional
     *
     */
    Route::get('convocatorias/{convocatoria}/proyectos-linea-70/{proyecto_linea_70}/download-pdf-sharepoint/{tipo_archivo}', [ProyectoLinea70Controller::class, 'downloadPdfSharepoint'])->name('convocatorias.proyectos-linea-70.download-pdf-sharepoint');
    Route::post('convocatorias/{convocatoria}/proyectos-linea-70/{proyecto_linea_70}/aulas-moviles/', [ProyectoLinea70Controller::class, 'aulaMovilStore'])->name('convocatorias.proyectos-linea-70.aulas-moviles.store');
    Route::delete('convocatorias/{convocatoria}/proyectos-linea-70/{proyecto_linea_70}/aulas-moviles/{aula_movil}', [ProyectoLinea70Controller::class, 'destroyAulaMovil'])->name('convocatorias.proyectos-linea-70.aulas-moviles.destroy');
    Route::get('convocatorias/{convocatoria}/proyectos-linea-70/{proyecto_linea_70}/aulas-moviles/{aula_movil}/download-file-sharepoint/{tipo_archivo}', [ProyectoLinea70Controller::class, 'downloadFileSharepoint'])->name('convocatorias.proyectos-linea-70.aulas-moviles.download-file-sharepoint');
    Route::post('convocatorias/{convocatoria}/proyectos/{proyecto}/programas-formacion', [ProyectoController::class, 'storeProgramaFormacion'])->name('convocatorias.proyectos.programas-formacion.store');
    Route::post('convocatorias/{convocatoria}/proyectos/{proyecto}/discurriculares', [DisenoCurricularController::class, 'storeDisCurricular'])->name('convocatorias.proyectos.dis-curriculares.store');
    Route::put('convocatorias/{convocatoria}/proyectos/{proyecto}/rol/sennova/ta', [ProyectoLinea70Controller::class, 'updateCantidadRolesTa'])->name('convocatorias.proyectos.rol-sennova-ta.update');
    Route::put('convocatorias/{convocatoria}/proyectos-linea-70/{proyecto_linea_70}/column/{column}', [ProyectoLinea70Controller::class, 'updateLongColumn'])->name('convocatorias.proyectos-linea-70.updateLongColumn');

    Route::resource('convocatorias.proyectos.presupuesto.edt', EdtController::class)->parameters(['convocatorias' => 'convocatoria', 'proyectos' => 'proyecto', 'presupuesto' => 'presupuesto', 'edt' => 'edt'])->except(['show']);
    Route::resource('convocatorias.proyectos-linea-70', ProyectoLinea70Controller::class)->parameters(['convocatorias' => 'convocatoria', 'proyectos-linea-70' => 'proyecto-linea-70'])->except(['show']);

    /**
     * Servicios tecnológicos - Estrategia  nacional
     *
     */
    Route::put('convocatorias/{convocatoria}/proyectos-linea-68/{proyecto_linea_68}/infraestructura', [ProyectoLinea68Controller::class, 'updateEspecificacionesInfraestructura'])->name('convocatorias.proyectos-linea-68.infraestructura');
    Route::resource('convocatorias.proyectos-linea-68', ProyectoLinea68Controller::class)->parameters(['convocatorias' => 'convocatoria', 'proyectos-linea-68' => 'proyecto-linea-68'])->except(['show']);
    Route::put('convocatorias/{convocatoria}/proyectos-linea-68/{proyecto_linea_68}/column/{column}', [ProyectoLinea68Controller::class, 'updateLongColumn'])->name('convocatorias.proyectos-linea-68.updateLongColumn');

    /**
     * Convocatorias
     *
     */
    Route::get('nuevos-proyectos-ta-tp', [ConvocatoriaController::class, 'nuevosProyectosTaTp'])->name('nuevos-proyectos-ta-tp');
    Route::get('convocatorias/{convocatoria}/lineas-programaticas', [ConvocatoriaController::class, 'lineasProgramaticas'])->name('convocatorias.lineas-programaticas');
    Route::put('convocatorias/{convocatoria}/update-fase', [ConvocatoriaController::class, 'updateFase'])->name('convocatorias.update-fase');

    Route::get('convocatorias/{convocatoria}/lineas-programaticas/{linea_programatica}', [ConvocatoriaController::class, 'proyectosPorLineaProgramatica'])->name('convocatorias.lineas-programaticas.proyectos');
    Route::get('convocatorias/{convocatoria}/lineas-programaticas', [ConvocatoriaController::class, 'lineasProgramaticas'])->name('convocatorias.lineas-programaticas.index');

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
    // Actualiza el problema general del proyecto en el arbol de problemas
    Route::post('proyectos/{proyecto}/objetivo-general', [ArbolProyectoController::class, 'updateObjetivoGeneral'])->name('proyectos.objetivo-general');
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

    /**
     * Productos
     *
     */
    Route::resource('convocatorias.proyectos.productos', ProductoController::class)->parameters(['convocatorias' => 'convocatoria', 'proyectos' => 'proyecto', 'productos' => 'producto'])->except(['show']);

    /**
     * Actividades
     *
     */
    Route::put('convocatorias/{convocatoria}/proyectos/{proyecto}/actividades/metodologia', [ActividadController::class, 'updateMetodologia'])->name('convocatorias.proyectos.metodologia');
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

    Route::get('convocatorias/{convocatoria}/proyectos/{proyecto}/presupuesto/{presupuesto}/municipios', [ProyectoPresupuestoController::class, 'indexMunicipiosAVisitar'])->name('convocatorias.proyectos.presupuesto.municipios.index');
    Route::post('convocatorias/{convocatoria}/proyectos/{proyecto}/presupuesto/{presupuesto}/municipios', [ProyectoPresupuestoController::class, 'storeMunicipiosAVisitar'])->name('convocatorias.proyectos.presupuesto.municipios.store');
    Route::put('convocatorias/{convocatoria}/proyectos/{proyecto}/presupuesto/{presupuesto}/municipios/{taTpViaticosMunicipio}', [ProyectoPresupuestoController::class, 'updateMunicipiosAVisitar'])->name('convocatorias.proyectos.presupuesto.municipios.update');
    Route::delete('convocatorias/{convocatoria}/proyectos/{proyecto}/presupuesto/{presupuesto}/municipios/{taTpViaticosMunicipio}', [ProyectoPresupuestoController::class, 'destroyMunicipioAVisitar'])->name('convocatorias.proyectos.presupuesto.municipios.destroy');

    Route::resource('convocatorias.proyectos.presupuesto', ProyectoPresupuestoController::class)->parameters(['convocatorias' => 'convocatoria', 'proyectos' => 'proyecto', 'presupuesto' => 'presupuesto'])->except(['show']);

    /**
     * Soportes de estudio de mercado
     *
     */
    Route::get('convocatorias/{convocatoria}/proyectos/{proyecto}/presupuesto/{presupuesto}/soportes/{soporte}/download-file-sharepoint/{tipo_archivo}', [SoporteEstudioMercadoController::class, 'downloadFileSharepoint'])->name('convocatorias.proyectos.presupuesto.soportes.download-file-sharepoint');
    Route::get('convocatorias/{convocatoria}/proyectos/{proyecto}/presupuesto/{presupuesto}/soportes/{soporte}/download/{formato}', [SoporteEstudioMercadoController::class, 'downloadServerFile'])->name('convocatorias.proyectos.presupuesto.soportes.download');
    Route::resource('convocatorias.proyectos.presupuesto.soportes', SoporteEstudioMercadoController::class)->parameters(['convocatorias' => 'convocatoria', 'proyectos' => 'proyecto', 'presupuesto' => 'presupuesto', 'soportes' => 'soporte'])->except(['show']);

    /**
     * Rol SENNOVA de convocatoria
     *
     */
    Route::resource('convocatorias.convocatoria-rol-sennova',  ConvocatoriaRolSennovaController::class)->parameters(['convocatorias' => 'convocatoria', 'convocatoria-rol-sennova' => 'convocatoria-rol-sennova'])->except(['show']);

    /**
     * Presupuesto de convocatoria
     *
     */
    Route::resource('convocatorias.convocatoria-presupuesto',  ConvocatoriaPresupuestoController::class)->parameters(['convocatorias' => 'convocatoria', 'convocatoria-presupuesto' => 'convocatoria-presupuesto'])->except(['show']);

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
    Route::resource('presupuesto-sennova',  PresupuestoSennovaController::class)->parameters(['presupuesto-sennova' => 'presupuesto-sennova'])->except(['show']);

    Route::get('configuracion-presupuesto-sennova',  [PresupuestoSennovaController::class, 'configuracionPresupuestoSennova'])->name('configuracion-presupuesto-sennova');


    /**
     * Roles SENNOVA
     *
     */
    Route::resource('roles-sennova',  RolSennovaController::class)->parameters(['roles-sennova' => 'rol-sennova'])->except(['show']);

    /**
     * Usuarios
     *
     */
    Route::get('users/obtener-numero-notificaciones', [UserController::class, 'getNumeroNotificaciones'])->name('users.get-numero-notificaciones');
    Route::get('users/online', [UserController::class, 'enLinea'])->name('users.online');
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
    Route::put('ambientes-modernizacion/{ambiente_modernizacion}/column/{column}', [AmbienteModernizacionController::class, 'updateLongColumn'])->name('ambientes-modernizacion.updateLongColumn');
    Route::get('ambientes-modernizacion/{ambiente_modernizacion}/download', [AmbienteModernizacionController::class, 'download'])->name('ambientes-modernizacion.download');
    Route::get('ambientes-modernizacion/{ambiente_modernizacion}/download-file-sharepoint/{tipo_archivo}', [AmbienteModernizacionController::class, 'downloadFileSharepoint'])->name('ambientes-modernizacion.download-file-sharepoint');
    Route::post('ambientes-modernizacion/{ambiente_modernizacion}/equipos-ambiente-modernizacion/store', [AmbienteModernizacionController::class, 'equiposStore'])->name('equipos-ambiente-modernizacion.store');
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
    Route::put('convocatorias/{convocatoria}/proyectos/{proyecto}/update-evaluacion', [ProyectoLinea66Controller::class, 'updateEvaluacion'])->name('convocatorias.evaluaciones-proyecto-linea-66.update');

    Route::resource('evaluaciones', EvaluacionController::class)->parameters(['evaluaciones' => 'evaluacion'])->except(['show']);

    /**
     * Reportes
     *
     */
    Route::get('reportes', [ReporteController::class, 'index'])->name('reportes.index');
    Route::get('reportes/convocatoria/{convocatoria}/resumen', [ReporteController::class, 'resumenProyectos'])->name('reportes.resumen-proyectos');
    Route::get('reportes/convocatoria/{convocatoria}/presupuestos-roles', [ReporteController::class, 'resumenPresupuestos'])->name('reportes.resumePresupuestos');
    Route::get('reportes/convocatoria/{convocatoria}/reportes/evaluaciones', [ReporteController::class, 'evaluacionesExcel'])->name('reportes.evaluaciones');
    Route::get('reportes/convocatoria/{convocatoria}/comentarios-evaluaciones', [ReporteController::class, 'comentariosEvaluacionesExcel'])->name('reportes.comentarios-evaluaciones');
    Route::get('proyectos/{proyecto}/invetario-equipos', [InventarioEquipoController::class, 'inventarioEquiposExcel'])->name('reportes.inventario-equipos');
    Route::get('reportes/convocatoria/{convocatoria}/resumen-presupuesto-aprobado', [ReporteController::class, 'EvaluacionesProyectosPresupuestoExport'])->name('reportes.resumeProyectoPresupuestoAprobado');
    Route::get('reportes/convocatoria/{convocatoria}/proyectos-ta', [ReporteController::class, 'proyectosTaExport'])->name('reportes.proyectos-ta');
    Route::get('reportes/convocatoria/{convocatoria}/proyectos-idi', [ReporteController::class, 'proyectosIdiExport'])->name('reportes.proyectos-idi');
    Route::get('reportes/convocatoria/{convocatoria}/proyectos-tp', [ReporteController::class, 'proyectosTpExport'])->name('reportes.proyectos-tp');
    Route::get('reportes/convocatoria/{convocatoria}/proyectos-st', [ReporteController::class, 'proyectosStExport'])->name('reportes.proyectos-st');
    Route::get('reportes/convocatoria/{convocatoria}/proyectos-cultura-innovacion', [ReporteController::class, 'proyectosCulturaInnovacionExport'])->name('reportes.proyectos-cultura-innovacion');
    Route::get('reportes/grupos-lineas-semilleros', [ReporteController::class, 'gruposLineasSemillerosExport'])->name('reportes.grupos-lineas-semilleros');
    Route::get('reportes/proyectos-capacidad-instalada', [ReporteController::class, 'proyectosCapacidadInstaladaExport'])->name('reportes.proyectos-capacidad-instalada');

    /**
     * Nodos Tecnoparque
     *
     */
    Route::resource('nodos-tecnoparque', NodoTecnoparqueController::class)->parameters(['nodos-tecnoparque' => 'nodo-tecnoparque']);


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
