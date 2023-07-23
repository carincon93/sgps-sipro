<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Actividad;
use App\Models\ActividadEconomica;
use App\Models\AreaConocimiento;
use App\Models\LineaInvestigacion;
use App\Models\RedConocimiento;
use App\Models\DisciplinaSubareaConocimiento;
use App\Models\TematicaEstrategica;
use App\Models\CentroFormacion;
use App\Models\Region;
use App\Models\Regional;
use App\Models\GrupoInvestigacion;
use App\Models\SubtipologiaMinciencias;
use App\Models\LineaProgramatica;
use App\Models\ConvocatoriaRolSennova;
use App\Models\EstadoSistemaGestion;
use App\Models\SegundoGrupoPresupuestal;
use App\Models\TercerGrupoPresupuestal;
use App\Models\PresupuestoSennova;
use App\Models\Tecnoacademia;
use App\Models\LineaTecnoacademia;
use App\Models\Municipio;
use App\Models\NodoTecnoparque;
use App\Models\ProgramaFormacion;
use App\Models\Proyecto;
use App\Models\SemilleroInvestigacion;
use App\Models\SubareaConocimiento;
use App\Models\SubtipoProyectoCapacidadInstalada;
use App\Models\TipoProyectoCapacidadInstalada;
use App\Models\TipoProyectoSt;
use App\Models\User;

class WebController extends Controller
{
    public function redirectLogin()
    {
        return redirect()->route('login');
    }

    public function dashboard()
    {
        return Inertia::render('Dashboard');
    }

    public function centrosFormacion()
    {
        return response(CentroFormacion::selectRaw('centros_formacion.id as value, concat(centros_formacion.nombre, chr(10), \'∙ Código: \', centros_formacion.codigo, chr(10), \'∙ Regional: \', regionales.nombre) as label')->join('regionales', 'centros_formacion.regional_id', 'regionales.id')->orderBy('centros_formacion.nombre', 'ASC')->get());
    }

    // Trae los centros de formación - Cultura innovación
    public function culturaInnovacionCentrosFormacion($value = '')
    {
        return response(CentroFormacion::selectRaw('centros_formacion.id as value, concat(centros_formacion.nombre, chr(10), \'∙ Código: \', centros_formacion.codigo, chr(10), \'∙ Regional: \', regionales.nombre) as label')
            ->join('regionales', 'centros_formacion.regional_id', 'regionales.id')
            ->whereIn('centros_formacion.codigo', [
                9309,
                9503,
                9230,
                9124,
                9120,
                9222,
                9116,
                9548,
                9401,
                9403,
                9303,
                9310,
                9529,
                9121
            ])
            ->orderBy('centros_formacion.nombre', 'ASC')->get());
    }

    // Trae las actividades por resultado
    public function resultadosActividades($resultado)
    {
        return response(Actividad::select('actividades.id', 'actividades.descripcion', 'actividades.resultado_id')
            ->where('actividades.resultado_id', $resultado)
            ->distinct()
            ->get());
    }

    // Trae los conceptos internos SENA
    public function segundoGrupoPresupuestal($lineaProgramatica)
    {
        return response(SegundoGrupoPresupuestal::select('segundo_grupo_presupuestal.id as value', 'segundo_grupo_presupuestal.nombre as label')
            ->join('presupuesto_sennova', 'segundo_grupo_presupuestal.id', 'presupuesto_sennova.segundo_grupo_presupuestal_id')
            ->where('presupuesto_sennova.linea_programatica_id', $lineaProgramatica)
            ->where('presupuesto_sennova.habilitado', true)
            ->groupBy('segundo_grupo_presupuestal.id')
            ->orderBy('segundo_grupo_presupuestal.nombre', 'ASC')
            ->get());
    }

    public function tercerGrupoPresupuestal($segundoGrupoPresupuestal)
    {
        return response(TercerGrupoPresupuestal::selectRaw('DISTINCT(tercer_grupo_presupuestal.id) as value, tercer_grupo_presupuestal.nombre as label')
            ->join('presupuesto_sennova', 'tercer_grupo_presupuestal.id', 'presupuesto_sennova.tercer_grupo_presupuestal_id')
            ->where('presupuesto_sennova.segundo_grupo_presupuestal_id', $segundoGrupoPresupuestal)
            ->get());
    }

    // Trae los usos presupuestales
    public function usosPresupuestales($convocatoria, $lineaProgramatica, $segundoGrupoPresupuestal, $tercerGrupoPresupuestal)
    {
        return response(PresupuestoSennova::select('convocatoria_presupuesto.id as value', 'usos_presupuestales.descripcion as label', 'usos_presupuestales.codigo')
            ->join('usos_presupuestales', 'presupuesto_sennova.uso_presupuestal_id', 'usos_presupuestales.id')
            ->join('convocatoria_presupuesto', 'presupuesto_sennova.id', 'convocatoria_presupuesto.presupuesto_sennova_id')
            ->where('convocatoria_presupuesto.convocatoria_id', $convocatoria)
            ->where('presupuesto_sennova.linea_programatica_id', $lineaProgramatica)
            ->where('presupuesto_sennova.segundo_grupo_presupuestal_id', $segundoGrupoPresupuestal)
            ->where('presupuesto_sennova.tercer_grupo_presupuestal_id', $tercerGrupoPresupuestal)
            ->orderBy('usos_presupuestales.descripcion', 'ASC')->get());
    }

    public function rolesSennova($convocatoria, $proyectoId, $lineaProgramatica)
    {
        $proyecto = Proyecto::find($proyectoId);
        if ($proyecto->servicioTecnologico()->exists()) {
            $rol = '';
            $tipologiaSt = '';
            if ($proyecto->servicioTecnologico->estadoSistemaGestion->id == 1) {
                $rol = 'responsable de servicios tecnológicos (laboratorio)';
            }

            if ($proyecto->servicioTecnologico->tipoProyectoSt->tipologia == 1) {
                $tipologiaSt = '%especiales%';
            } else if ($proyecto->servicioTecnologico->tipoProyectoSt->tipologia == 2) {
                $tipologiaSt = '%laboratorio%';
            } else if ($proyecto->servicioTecnologico->tipoProyectoSt->tipologia == 3) {
                $tipologiaSt = '%técnicos%';
            }
            return response(ConvocatoriaRolSennova::selectRaw("convocatoria_rol_sennova.id as value, convocatoria_rol_sennova.perfil, convocatoria_rol_sennova.mensaje,
                 nivel_academico
                    WHEN '7' THEN   concat(roles_sennova.nombre, chr(10), '∙ ', 'Nivel académico: Ninguno', chr(10), '∙ ', convocatoria_rol_sennova.experiencia, chr(10), '∙ Asignación mensual: ', convocatoria_rol_sennova.asignacion_mensual)
                    WHEN '1' THEN   concat(roles_sennova.nombre, chr(10), '∙ ', 'Nivel académico: Técnico', chr(10), '∙ ', convocatoria_rol_sennova.experiencia, chr(10), '∙ Asignación mensual: ', convocatoria_rol_sennova.asignacion_mensual)
                    WHEN '2' THEN   concat(roles_sennova.nombre, chr(10), '∙ ', 'Nivel académico: Tecnólogo', chr(10), '∙ ', convocatoria_rol_sennova.experiencia, chr(10), '∙ Asignación mensual: ', convocatoria_rol_sennova.asignacion_mensual)
                  CASE  WHEN '3' THEN   concat(roles_sennova.nombre, chr(10), '∙ ', 'Nivel académico: Pregrado', chr(10), '∙ ', convocatoria_rol_sennova.experiencia, chr(10), '∙ Asignación mensual: ', convocatoria_rol_sennova.asignacion_mensual)
                    WHEN '4' THEN   concat(roles_sennova.nombre, chr(10), '∙ ', 'Nivel académico: Especalización', chr(10), '∙ ', convocatoria_rol_sennova.experiencia, chr(10), '∙ Asignación mensual: ', convocatoria_rol_sennova.asignacion_mensual)
                    WHEN '5' THEN   concat(roles_sennova.nombre, chr(10), '∙ ', 'Nivel académico: Maestría', chr(10), '∙ ', convocatoria_rol_sennova.experiencia, chr(10), '∙ Asignación mensual: ', convocatoria_rol_sennova.asignacion_mensual)
                    WHEN '6' THEN   concat(roles_sennova.nombre, chr(10), '∙ ', 'Nivel académico: Doctorado', chr(10), '∙ ', convocatoria_rol_sennova.experiencia, chr(10), '∙ Asignación mensual: ', convocatoria_rol_sennova.asignacion_mensual)
                    WHEN '8' THEN   concat(roles_sennova.nombre, chr(10), '∙ ', 'Nivel académico: Técnico con especialización', chr(10), '∙ ', convocatoria_rol_sennova.experiencia, chr(10), '∙ Asignación mensual: ', convocatoria_rol_sennova.asignacion_mensual)
                    WHEN '9' THEN   concat(roles_sennova.nombre, chr(10), '∙ ', 'Nivel académico: Tecnólogo con especialización', chr(10), '∙ ', convocatoria_rol_sennova.experiencia, chr(10), '∙ Asignación mensual: ', convocatoria_rol_sennova.asignacion_mensual)
                END as label")
                ->join('roles_sennova', 'convocatoria_rol_sennova.rol_sennova_id', 'roles_sennova.id')
                ->where('roles_sennova.nombre', 'like', $tipologiaSt)
                ->where('roles_sennova.nombre', '!=', $rol)
                ->orWhere('roles_sennova.nombre', 'like', '%aprendiz sennova (contrato aprendizaje)%')
                ->where('convocatoria_rol_sennova.linea_programatica_id', $lineaProgramatica)
                ->where('convocatoria_rol_sennova.convocatoria_id', $convocatoria)
                ->orderBy('roles_sennova.nombre')->get());
        }

        return response(ConvocatoriaRolSennova::selectRaw("convocatoria_rol_sennova.id as value, convocatoria_rol_sennova.perfil, convocatoria_rol_sennova.mensaje,
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
            ->join('roles_sennova', 'convocatoria_rol_sennova.rol_sennova_id', 'roles_sennova.id')
            ->where('convocatoria_rol_sennova.linea_programatica_id', $lineaProgramatica)
            ->where('convocatoria_rol_sennova.convocatoria_id', $convocatoria)
            ->orderBy('roles_sennova.nombre')->get());
    }

    /**
     * Programas de formación
     *
     */
    public function programasFormacion($centroFormacion)
    {
        return response(ProgramaFormacion::selectRaw('id as value, concat(programas_formacion.nombre, chr(10), \'∙ Código: \', programas_formacion.codigo) as label')->where('centro_formacion_id', $centroFormacion)->orderBy('nombre', 'ASC')->get());
    }

    /**
     * Estados de sistema de gestión
     *
     */
    public function estadosSistemaGestion($tipoProyectoSt)
    {
        $tipoProyectoStInfo = TipoProyectoSt::find($tipoProyectoSt);
        return response(EstadoSistemaGestion::selectRaw("id as value, CASE tipo_proyecto
            WHEN '1' THEN   concat(estados_sistema_gestion.estado, chr(10), '∙ Categoría A')
            WHEN '2' THEN   concat(estados_sistema_gestion.estado, chr(10), '∙ Categoría B')
        END as label")->where('tipo_proyecto', $tipoProyectoStInfo->tipo_proyecto)->orderBy('id', 'ASC')->get());
    }

    /**
     * Regionales
     *
     * Trae las regiones
     */
    public function regiones()
    {
        return response(Region::select('id as value', 'nombre as label')->orderBy('nombre', 'ASC')->get());
    }

    /**
     * Trae las regionales
     */
    public function regionales()
    {
        return response(Regional::select('id as value', 'nombre as label')->orderBy('nombre', 'ASC')->get());
    }

    /**
     * Trae los centros de formación por regional
     */
    public function centrosFormacionRegional($regional)
    {
        return response(CentroFormacion::selectRaw('centros_formacion.id as value, concat(centros_formacion.nombre, chr(10), \'∙ Código: \', centros_formacion.codigo) as label')->where('centros_formacion.regional_id', $regional)->orderBy('centros_formacion.nombre', 'ASC')->get());
    }

    /**
     * Trae los centros de formación por grupo de investigación
     */
    public function centrosFormacionGrupoInvestigacion(GrupoInvestigacion $grupoInvestigacion)
    {
        return response(CentroFormacion::selectRaw('centros_formacion.id as value, concat(centros_formacion.nombre, chr(10), \'∙ Código: \', centros_formacion.codigo) as label')->where('centros_formacion.id', $grupoInvestigacion->centro_formacion_id)->orderBy('centros_formacion.nombre', 'ASC')->first());
    }

    /**
     * Centros de formación
     *
     * Trae los subdirectores
     */
    function subdirectores($rol)
    {
        return response(User::select('users.id as value', 'users.nombre as label')
            ->join('model_has_roles', 'users.id', 'model_has_roles.model_id')
            ->join('roles', 'model_has_roles.role_id', 'roles.id')
            ->where('roles.name', 'ilike', '%' . $rol . '%')
            ->orderBy('users.nombre', 'ASC')->get());
    }

    /**
     * Líneas de investigación
     *
     * Trae los grupos de investigación
     *
     */
    public function gruposInvestigacion()
    {
        return response(GrupoInvestigacion::selectRaw('grupos_investigacion.id as value, concat(grupos_investigacion.nombre, chr(10), \'∙ Acrónimo: \', grupos_investigacion.acronimo, chr(10), \'∙ Centro de formación: \', centros_formacion.nombre, chr(10), \'∙ Regional: \', regionales.nombre) as label')->join('centros_formacion', 'grupos_investigacion.centro_formacion_id', 'centros_formacion.id')->join('regionales', 'centros_formacion.regional_id', 'regionales.id')->get());
    }

    /**
     * Semilleros de investigación
     *
     * Trae las líneas de investigación
     */
    public function lineasInvestigacion($centroFormacion)
    {
        return response(LineaInvestigacion::selectRaw('lineas_investigacion.id as value, concat(lineas_investigacion.nombre, chr(10), \'∙ Grupo de investigación: \', grupos_investigacion.nombre, chr(10)) as label')->join('grupos_investigacion', 'lineas_investigacion.grupo_investigacion_id', 'grupos_investigacion.id')->join('centros_formacion', 'grupos_investigacion.centro_formacion_id', 'centros_formacion.id')->join('regionales', 'centros_formacion.regional_id', 'regionales.id')->where('centros_formacion.id', $centroFormacion)->get());
    }

    //municipios
    public function municipios()
    {
        return response(Municipio::select('municipios.id as value', 'municipios.nombre as label', 'regionales.nombre as group', 'regionales.codigo')
            ->join('regionales', 'regionales.id', 'municipios.regional_id')
            ->get());
    }

    /**
     * Web api
     *
     * Trae las Tecnoacademias
     */
    public function tecnoacademias()
    {
        return response(Tecnoacademia::select('tecnoacademias.id as value', 'tecnoacademias.nombre as label')->get());
    }

    /**
     * Web api
     *
     * Trae las tecnoacademias por centro de formacion
     */
    public function tecnoacademiasCentroFormacion($centroFormacion)
    {
        return response(Tecnoacademia::selectRaw("tecnoacademias.id as value, CASE modalidad
                WHEN '1' THEN   concat(tecnoacademias.nombre, chr(10), '∙ Modalidad: itinerante', chr(10), '∙ Centro de formación: ', centros_formacion.nombre)
                WHEN '2' THEN   concat(tecnoacademias.nombre, chr(10), '∙ Modalidad: itinerante - vehículo', chr(10), '∙ Centro de formación: ', centros_formacion.nombre)
                WHEN '3' THEN   concat(tecnoacademias.nombre, chr(10), '∙ Modalidad: fija con extensión', chr(10), '∙ Centro de formación: ', centros_formacion.nombre)
            END as label, centros_formacion.id as centro_formacion_id")
            ->join('centros_formacion', 'tecnoacademias.centro_formacion_id', 'centros_formacion.id')
            ->where('tecnoacademias.centro_formacion_id', $centroFormacion)->get());
    }

    /**
     * Web api
     *
     * Trae las líneas tecnoacademia
     */
    public function lineasTecnoacademia($tecnoacademia)
    {
        return response(LineaTecnoacademia::select('tecnoacademia_linea_tecnoacademia.id as value', 'lineas_tecnoacademia.nombre as label')->join('tecnoacademia_linea_tecnoacademia', 'lineas_tecnoacademia.id', 'tecnoacademia_linea_tecnoacademia.linea_tecnoacademia_id')->where('tecnoacademia_linea_tecnoacademia.tecnoacademia_id', $tecnoacademia)->get());
    }

    /**
     * Web api
     *
     * Trae los nodos tecnoparque
     */
    public function nodosTecnoparque($centroFormacion)
    {
        return response(NodoTecnoparque::select('nodos_tecnoparque.id as value', 'nodos_tecnoparque.nombre as label')->where('nodos_tecnoparque.centro_formacion_id', $centroFormacion)->get());
    }

    /**
     * Web api
     *
     * Trae las líneas programáticas
     */
    public function líneasProgramaticas($categoriaProyecto)
    {
        if ($categoriaProyecto) {
            return response(LineaProgramatica::selectRaw('id as value, concat(nombre, \' ∙ \', codigo) as label, codigo')
                ->where('lineas_programaticas.categoria_proyecto', 'ilike', '%' . $categoriaProyecto . '%')
                ->get());
        } else {
            return response(LineaProgramatica::select('id as value', 'nombre as label')
                ->get());
        }
    }

    /**
     * Web api
     *
     * Trae las redes de conocimiento
     */
    public function redesConocimiento()
    {
        return response(RedConocimiento::select('redes_conocimiento.id as value', 'redes_conocimiento.nombre as label')->orderBy('nombre', 'ASC')->get());
    }

    /**
     * Web api
     *
     * Trae los programas de formación por línea de investigación
     */
    public function líneaInvestigacionProgramaFormacion($lineaInvestigacionId)
    {
        return response(ProgramaFormacion::select('programas_formacion.id as value', 'programas_formacion.nombre as label')->join('linea_investigacion_programa_formacion', 'programas_formacion.id', 'linea_investigacion_programa_formacion.programa_formacion_id')->where('linea_investigacion_programa_formacion.linea_investigacion_id', $lineaInvestigacionId)->orderBy('nombre', 'ASC')->get());
    }

    /**
     * Web api
     *
     * Trae las áreas de conocimiento
     */
    public function areasConocimiento()
    {
        return response(AreaConocimiento::select('areas_conocimiento.id as value', 'areas_conocimiento.nombre as label')->orderBy('nombre', 'ASC')->get());
    }

    /**
     * Web api
     *
     * Trae las subáreas de conocimiento
     */
    public function subareasConocimiento($areaConocimiento)
    {
        return response(SubareaConocimiento::select('subareas_conocimiento.id as value', 'subareas_conocimiento.nombre as label')->where('subareas_conocimiento.area_conocimiento_id', $areaConocimiento)->orderBy('nombre', 'ASC')->get());
    }

    /**
     * Web api
     *
     * Trae las disciplinas de subáreas de conocimiento
     */
    public function disciplinasSubareaConocimiento($subareaConocimiento)
    {
        return response(DisciplinaSubareaConocimiento::select('disciplinas_subarea_conocimiento.id as value', 'disciplinas_subarea_conocimiento.nombre as label')->where('disciplinas_subarea_conocimiento.subarea_conocimiento_id', $subareaConocimiento)->orderBy('nombre', 'ASC')->get());
    }

    /**
     * Web api
     *
     * Trae los tipos de proyecto de capacidad instalada
     */
    public function tiposProyectoCapacidadInstalada()
    {
        return response(TipoProyectoCapacidadInstalada::select('tipos_proyecto_capacidad_instalada.id as value', 'tipos_proyecto_capacidad_instalada.tipo as label')->orderBy('tipo', 'ASC')->get());
    }

    /**
     * Web api
     *
     * Trae los subtipos de proyecto de capacidad instalada
     */
    public function subtiposProyectoCapacidadInstalada($tipoProyCapacidadInstalada)
    {
        return response(SubtipoProyectoCapacidadInstalada::select('subtipos_proyecto_capacidad_instalada.id as value', 'subtipos_proyecto_capacidad_instalada.subtipo as label')->where('subtipos_proyecto_capacidad_instalada.tipo_proyecto_capacidad_instalada_id', $tipoProyCapacidadInstalada)->orderBy('subtipo', 'ASC')->get());
    }

    /**
     * Web api
     *
     * Trae los semilleros de investigacion
     */
    public function semillerosInvestigacion($lineaInvestigacion)
    {
        return response(SemilleroInvestigacion::select('semilleros_investigacion.id as value', 'semilleros_investigacion.nombre as label')->where('semilleros_investigacion.linea_investigacion_id', $lineaInvestigacion)->orderBy('nombre', 'ASC')->get());
    }

    /**
     * Web api
     *
     * Trae los actividades económicas
     */
    public function actividadesEconomicas()
    {
        return response(ActividadEconomica::select('actividades_economicas.id as value', 'actividades_economicas.nombre as label')->orderBy('nombre', 'ASC')->get());
    }

    /**
     * Web api
     *
     * Trae las temáticas estrategicas SENA
     */
    public function tematicasEstrategicas()
    {
        return response(TematicaEstrategica::select('tematicas_estrategicas.id as value', 'tematicas_estrategicas.nombre as label')->orderBy('nombre', 'ASC')->get());
    }

    /**
     * Web api
     *
     * Trae las subtipologías Minciencias
     */
    public function subtipologiasMinciencias()
    {
        return response(SubtipologiaMinciencias::selectRaw('subtipologias_minciencias.id as value, concat(subtipologias_minciencias.nombre, chr(10), \'∙ Tipología Minciencias: \', tipologias_minciencias.nombre) as label')->join('tipologias_minciencias', 'subtipologias_minciencias.tipologia_minciencias_id', 'tipologias_minciencias.id')->orderBy('subtipologias_minciencias.nombre')->get());
    }
}
