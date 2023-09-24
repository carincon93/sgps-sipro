<?php

namespace App\Helpers;

use App\Models\Actividad;
use App\Models\ActividadEconomica;
use App\Models\Anexo;
use App\Models\AreaConocimiento;
use App\Models\ProyectoConvocatoria\AreaTematicaEni;
use App\Models\LineaInvestigacion;
use App\Models\RedConocimiento;
use App\Models\DisciplinaSubareaConocimiento;
use App\Models\TematicaEstrategica;
use App\Models\CentroFormacion;
use App\Models\CodigoProyectoSgps;
use App\Models\Convocatoria;
use App\Models\Region;
use App\Models\Regional;
use App\Models\GrupoInvestigacion;
use App\Models\SubtipologiaMinciencias;
use App\Models\LineaProgramatica;
use App\Models\ConvocatoriaRolSennova;
use App\Models\DisenoCurricular;
use App\Models\EstadoSistemaGestion;
use App\Models\HubInnovacion;
use App\Models\SegundoGrupoPresupuestal;
use App\Models\TercerGrupoPresupuestal;
use App\Models\Tecnoacademia;
use App\Models\LineaTecnoacademia;
use App\Models\MesaSectorial;
use App\Models\Municipio;
use App\Models\NodoTecnoparque;
use App\Models\PrimerGrupoPresupuestal;
use App\Models\ProgramaFormacion;
use App\Models\ProgramaSennova;
use App\Models\ProyectoIdiTecnoacademia;
use App\Models\RolSennova;
use App\Models\SemilleroInvestigacion;
use App\Models\SubareaConocimiento;
use App\Models\SubtipoProyectoCapacidadInstalada;
use App\Models\TipoBeneficiadoLinea70;
use App\Models\TipologiaAmbiente;
use App\Models\TipoProductoLinea66;
use App\Models\TipoProyectoCapacidadInstalada;
use App\Models\LaboratorioServicioTecnologico;
use App\Models\User;
use App\Models\UsoPresupuestal;
use Illuminate\Support\Facades\DB;

class SelectHelper
{
    /**
     * Web api
     *
     * Trae los centros de formación
     */
    public static function centrosFormacion()
    {
        return CentroFormacion::selectRaw("centros_formacion.id as value, CONCAT(centros_formacion.nombre, chr(10), ' Código: ', centros_formacion.codigo, chr(10), ' Regional: ', INITCAP(regionales.nombre)) as label, regionales.id as regional_id")->join('regionales', 'centros_formacion.regional_id', 'regionales.id')->orderBy('centros_formacion.nombre', 'ASC')->get();
    }

    /**
     * Web api
     *
     * Trae las actividades por resultado
     */
    public static function resultadosActividades()
    {
        return Actividad::select('actividades.id', 'actividades.descripcion', 'actividades.resultado_id')->distinct()->get();
    }

    /**
     * Web api
     *
     * Trae los tipos de beneficiados TA
     */
    public static function tiposBeneficiadosTa()
    {
        return TipoBeneficiadoLinea70::select('id as value', 'nombre as label')->orderBy('nombre', 'ASC')->get();
    }

    /**
     * Web api
     *
     * Trae los tipos de productos IDi
     */
    public static function tiposProductosIdi()
    {
        return TipoProductoLinea66::select('id as value', 'tipo as label')->get();
    }

    /**
     * Web api
     *
     * Trae el primer grupo presupuestal
     */
    public static function primerGrupoPresupuestal()
    {
        return PrimerGrupoPresupuestal::select('primer_grupo_presupuestal.id as value', 'primer_grupo_presupuestal.nombre as label')
            ->orderBy('primer_grupo_presupuestal.nombre', 'ASC')
            ->get();
    }

    /**
     * Web api
     *
     * Trae los conceptos internos SENA
     */
    public static function segundoGrupoPresupuestal($convocatoria_id, $tipo_formulario_convocatoria_id, $nodo_tecnoparque_id = null)
    {
        $query = SegundoGrupoPresupuestal::selectRaw('DISTINCT(segundo_grupo_presupuestal.id) as value, segundo_grupo_presupuestal.nombre as label, segundo_grupo_presupuestal.codigo as codigo');
        $query->join('rubros_presupuestales', 'segundo_grupo_presupuestal.id', 'rubros_presupuestales.segundo_grupo_presupuestal_id');
        $query->join('convocatoria_presupuesto', 'rubros_presupuestales.id', 'convocatoria_presupuesto.rubro_presupuestal_id');
        $query->where('convocatoria_presupuesto.convocatoria_id', $convocatoria_id);
        $query->where('convocatoria_presupuesto.tipo_formulario_convocatoria_id', $tipo_formulario_convocatoria_id);

        if ($tipo_formulario_convocatoria_id == 17) {
            $ids = DB::table('topes_presupuestales_tecnoparque_conceptos_sena')->select('topes_presupuestales_tecnoparque_conceptos_sena.segundo_grupo_presupuestal_id')
                ->join('topes_presupuestales_nodos_tecnoparque', 'topes_presupuestales_tecnoparque_conceptos_sena.tope_presupuestal_nodo_tecnoparque_id', 'topes_presupuestales_nodos_tecnoparque.id')
                ->where('topes_presupuestales_nodos_tecnoparque.nodo_tecnoparque_id', $nodo_tecnoparque_id)
                ->where('topes_presupuestales_nodos_tecnoparque.convocatoria_id', $convocatoria_id)
                ->get()->pluck('segundo_grupo_presupuestal_id');

            $query->whereIn('segundo_grupo_presupuestal.id', $ids);
        }

        $query->orderBy('segundo_grupo_presupuestal.nombre', 'ASC');

        return $query->get();
    }

    /**
     * Web api
     *
     * Trae el tercer grupo presupuestal
     */
    public static function tercerGrupoPresupuestal($convocatoria, $tipo_formulario_convocatoria_id)
    {
        return TercerGrupoPresupuestal::selectRaw('DISTINCT(tercer_grupo_presupuestal.id) as value, tercer_grupo_presupuestal.nombre as label, rubros_presupuestales.segundo_grupo_presupuestal_id')
            ->join('rubros_presupuestales', 'tercer_grupo_presupuestal.id', 'rubros_presupuestales.tercer_grupo_presupuestal_id')
            ->join('convocatoria_presupuesto', 'rubros_presupuestales.id', 'convocatoria_presupuesto.rubro_presupuestal_id')
            ->where('convocatoria_presupuesto.convocatoria_id', $convocatoria)
            ->where('convocatoria_presupuesto.tipo_formulario_convocatoria_id', $tipo_formulario_convocatoria_id)
            ->orderBy('tercer_grupo_presupuestal.nombre', 'ASC')
            ->get();
    }

    /**
     * Web api
     *
     * Trae los usos presupuestales
     */
    public static function usosPresupuestales($convocatoria, $tipo_formulario_convocatoria_id)
    {
        return UsoPresupuestal::select('convocatoria_presupuesto.id as value', 'usos_presupuestales.descripcion as label', 'rubros_presupuestales.segundo_grupo_presupuestal_id', 'rubros_presupuestales.tercer_grupo_presupuestal_id', 'convocatoria_presupuesto.requiere_estudio_mercado', 'usos_presupuestales.codigo as codigo_uso_presupuestal')
            ->join('rubros_presupuestales', 'usos_presupuestales.id', 'rubros_presupuestales.uso_presupuestal_id')
            ->join('convocatoria_presupuesto', 'rubros_presupuestales.id', 'convocatoria_presupuesto.rubro_presupuestal_id')
            ->where('convocatoria_presupuesto.convocatoria_id', $convocatoria)
            ->where('convocatoria_presupuesto.tipo_formulario_convocatoria_id', $tipo_formulario_convocatoria_id)
            ->where('convocatoria_presupuesto.habilitado', true)
            ->orderBy('usos_presupuestales.descripcion', 'ASC')
            ->get();
    }

    /**
     * Web api
     *
     * Trae las líneas programáticas
     */
    public static function lineasProgramaticas()
    {
        return LineaProgramatica::selectRaw('lineas_programaticas.id as value, CONCAT(lineas_programaticas.nombre, chr(10), \' Código: \', lineas_programaticas.codigo) as label, lineas_programaticas.categoria_proyecto as categoria_proyecto')->get();
    }

    /**
     * Web api
     *
     * Trae los anexos
     */
    public static function anexos()
    {
        // return Anexo::select('anexos.id as value', 'anexos.nombre as label', 'anexo_lineas_programaticas.linea_programatica_id', 'convocatoria_anexos.convocatoria_id')
        //     ->join('anexo_lineas_programaticas', 'anexos.id', 'anexo_lineas_programaticas.anexo_id')
        //     ->join('convocatoria_anexos', 'anexos.id', 'convocatoria_anexos.anexo_id')
        //     ->get();
    }

    /**
     * Web api
     *
     * Trae los Hubs de innovacion
     */
    public static function hubsInnovacion()
    {
        return HubInnovacion::select('id as value', 'nombre as label')->get();
    }

    /**
     * Web api
     *
     * Trae los tipos de proyectos ST
     */
    public static function laboratoriosServiciosTecnologicos()
    {
        return LaboratorioServicioTecnologico::selectRaw("tipos_proyecto_linea_68.id as value, CASE subclasificacion
                    WHEN '1' THEN	CONCAT(centros_formacion.nombre, ' - ', centros_formacion.codigo,chr(10), ' Automatización y TICs', chr(10), ' Línea técnica: ', lineas_tecnicas.nombre)
                    WHEN '2' THEN	CONCAT(centros_formacion.nombre, ' - ', centros_formacion.codigo,chr(10), ' Calibración', chr(10), ' Línea técnica: ', lineas_tecnicas.nombre)
                    WHEN '3' THEN	CONCAT(centros_formacion.nombre, ' - ', centros_formacion.codigo,chr(10), ' Consultoría técnica', chr(10), ' Línea técnica: ', lineas_tecnicas.nombre)
                    WHEN '4' THEN	CONCAT(centros_formacion.nombre, ' - ', centros_formacion.codigo,chr(10), ' Ensayo', chr(10), ' Línea técnica: ', lineas_tecnicas.nombre)
                    WHEN '5' THEN	CONCAT(centros_formacion.nombre, ' - ', centros_formacion.codigo,chr(10), ' Fabricación especial', chr(10), ' Línea técnica: ', lineas_tecnicas.nombre)
                    WHEN '6' THEN	CONCAT(centros_formacion.nombre, ' - ', centros_formacion.codigo,chr(10), ' Seguridad y salud en el trabajo', chr(10), ' Línea técnica: ', lineas_tecnicas.nombre)
                    WHEN '7' THEN	CONCAT(centros_formacion.nombre, ' - ', centros_formacion.codigo,chr(10), ' Servicios de salud', chr(10), ' Línea técnica: ', lineas_tecnicas.nombre)
                END as label, centros_formacion.regional_id as regional_id")
            ->join('centros_formacion', 'tipos_proyecto_linea_68.centro_formacion_id', 'centros_formacion.id')
            ->join('lineas_tecnicas', 'tipos_proyecto_linea_68.linea_tecnica_id', 'lineas_tecnicas.id')->get();
    }

    /**
     * Web api
     *
     * Trae los programas de formación
     */
    public static function programasFormacion()
    {
        return ProgramaFormacion::selectRaw('programas_formacion.id as value, CONCAT(programas_formacion.nombre) as label, programas_formacion.registro_calificado')->orderBy('programas_formacion.nombre', 'ASC')->get();
    }

    /**
     * Web api
     *
     * Estados de sistema de gestión
     *
     */
    public static function estadosSistemaGestion()
    {
        return EstadoSistemaGestion::selectRaw("id as value, CASE tipo_proyecto
            WHEN '1' THEN   CONCAT(estados_sistema_gestion.estado, chr(10), ' Categoría A')
            WHEN '2' THEN   CONCAT(estados_sistema_gestion.estado, chr(10), ' Categoría B')
        END as label")->orderBy('id', 'ASC')->get();
    }

    /**
     * Web api
     *
     * Trae las regiones
     */
    public static function regiones()
    {
        return Region::select('id as value', 'nombre as label')->orderBy('nombre', 'ASC')->get();
    }

    /**
     * Web api
     *
     * Trae las regionales
     */
    public static function regionales()
    {
        return Regional::select('id as value', 'nombre as label', 'codigo')->orderBy('nombre', 'ASC')->get();
    }

    /**
     * Web api
     *
     * Trae los grupos de investigación
     *
     */
    public static function gruposInvestigacion()
    {
        return GrupoInvestigacion::selectRaw('grupos_investigacion.id as value, CONCAT(grupos_investigacion.nombre, chr(10), \' Acrónimo: \', grupos_investigacion.acronimo, chr(10), \' Centro de formación: \', centros_formacion.nombre, chr(10), \' Regional: \', regionales.nombre) as label, centros_formacion.id as centro_formacion_id, regionales.id as regional_id')->join('centros_formacion', 'grupos_investigacion.centro_formacion_id', 'centros_formacion.id')->join('regionales', 'centros_formacion.regional_id', 'regionales.id')->get();
    }

    /**
     * Web api
     *
     * Trae las líneas de investigación
     */
    public static function lineasInvestigacion()
    {
        return LineaInvestigacion::selectRaw('lineas_investigacion.id as value, CONCAT(lineas_investigacion.nombre, chr(10), \' Grupo de investigación: \', grupos_investigacion.nombre, chr(10)) as label, centros_formacion.id as centro_formacion_id, lineas_investigacion.grupo_investigacion_id')->join('grupos_investigacion', 'lineas_investigacion.grupo_investigacion_id', 'grupos_investigacion.id')->join('centros_formacion', 'grupos_investigacion.centro_formacion_id', 'centros_formacion.id')->join('regionales', 'centros_formacion.regional_id', 'regionales.id')->get();
    }

    /**
     * Web api
     *
     * Trae los municipios
     */
    public static function municipios()
    {
        return Municipio::selectRaw("municipios.id as value, municipios.nombre as label, INITCAP(regionales.nombre) as group")->join('regionales', 'regionales.id', 'municipios.regional_id')->get();
    }

    /**
     * Web api
     *
     * Trae los areasTematicasEni
     */
    public static function areasTematicasEni()
    {
        return AreaTematicaEni::select('id as value', 'nombre as label')->get();
    }

    /**
     * Web api
     *
     * Trae las Tecnoacademias
     */
    public static function tecnoacademias()
    {
        return Tecnoacademia::selectRaw("tecnoacademias.id as value, CASE modalidad
                WHEN '1' THEN	CONCAT(tecnoacademias.nombre, chr(10), ' Modalidad: itinerante', chr(10), ' Centro de formación: ', centros_formacion.codigo, ' - ', centros_formacion.nombre)
                WHEN '2' THEN	CONCAT(tecnoacademias.nombre, chr(10), ' Modalidad: itinerante - vehículo', chr(10), ' Centro de formación: ', centros_formacion.codigo, ' - ', centros_formacion.nombre)
                WHEN '3' THEN	CONCAT(tecnoacademias.nombre, chr(10), ' Modalidad: fija con extensión', chr(10), ' Centro de formación: ', centros_formacion.codigo, ' - ', centros_formacion.nombre)
            END as label, centros_formacion.id as centro_formacion_id, centros_formacion.regional_id as regional_id")
            ->join('centros_formacion', 'tecnoacademias.centro_formacion_id', 'centros_formacion.id')
            ->get();
    }

    /**
     * Web api
     *
     * Trae las líneas tecnoacademia
     */
    public static function lineasTecnoacademia()
    {
        return LineaTecnoacademia::select('tecnoacademia_linea_tecnoacademia.id as value', 'lineas_tecnoacademia.nombre as label', 'tecnoacademia_linea_tecnoacademia.tecnoacademia_id as tecnoacademia_id')->join('tecnoacademia_linea_tecnoacademia', 'lineas_tecnoacademia.id', 'tecnoacademia_linea_tecnoacademia.linea_tecnoacademia_id')->get();
    }

    /**
     * Web api
     *
     * Trae las líneas tecnoacademia
     */
    public static function proyectosIdiTecnoacademia()
    {
        return ProyectoIdiTecnoacademia::selectRaw('proyectos_idi_tecnoacademia.id as value, CONCAT(\'IDITA-\', proyectos_idi_tecnoacademia.id, \'  \', proyectos_idi_tecnoacademia.titulo) as label, proyectos_idi_tecnoacademia.tecnoacademia_id as tecnoacademia_id')->get();
    }

    /**
     * Web api
     *
     * Trae los nodos tecnoparque
     */
    public static function nodosTecnoparque()
    {
        return NodoTecnoparque::select('nodos_tecnoparque.id as value', 'nodos_tecnoparque.nombre as label', 'nodos_tecnoparque.centro_formacion_id', 'centros_formacion.regional_id')->join('centros_formacion', 'nodos_tecnoparque.centro_formacion_id', 'centros_formacion.id')->orderBy('nodos_tecnoparque.nombre', 'ASC')->get();
    }

    /**
     * Web api
     *
     * Trae las líneas programáticas
     */
    public static function líneasProgramaticas()
    {
        return LineaProgramatica::selectRaw('id as value, CONCAT(nombre, \'  \', codigo) as label, codigo')->orderBy('nombre', 'ASC')->get();
    }

    /**
     * Web api
     *
     * Trae las redes de conocimiento
     */
    public static function redesConocimiento()
    {
        return RedConocimiento::select('redes_conocimiento.id as value', 'redes_conocimiento.nombre as label')->orderBy('redes_conocimiento.nombre', 'ASC')->get();
    }

    /**
     * Web api
     *
     * Trae los programas de formación por línea de investigación
     */
    public static function líneaInvestigacionProgramaFormacion()
    {
        return ProgramaFormacion::select('programas_formacion.id as value', 'programas_formacion.nombre as label')->orderBy('programas_formacion.nombre', 'ASC')->get();
    }

    /**
     * Web api
     *
     * Trae las áreas de conocimiento
     */
    public static function areasConocimiento()
    {
        return AreaConocimiento::select('areas_conocimiento.id as value', 'areas_conocimiento.nombre as label')->orderBy('areas_conocimiento.nombre', 'ASC')->get();
    }

    /**
     * Web api
     *
     * Trae las subáreas de conocimiento
     */
    public static function subareasConocimiento()
    {
        return SubareaConocimiento::select('subareas_conocimiento.id as value', 'subareas_conocimiento.nombre as label', 'subareas_conocimiento.area_conocimiento_id')->orderBy('subareas_conocimiento.nombre', 'ASC')->get();
    }

    /**
     * Web api
     *
     * Trae las disciplinas de subáreas de conocimiento
     */
    public static function disciplinasSubareaConocimiento()
    {
        return DisciplinaSubareaConocimiento::select('disciplinas_subarea_conocimiento.id as value', 'disciplinas_subarea_conocimiento.nombre as label', 'disciplinas_subarea_conocimiento.subarea_conocimiento_id')->orderBy('nombre', 'ASC')->get();
    }

    /**
     * Web api
     *
     * Trae los tipos de proyecto de capacidad instalada
     */
    public static function tiposProyectoCapacidadInstalada()
    {
        return TipoProyectoCapacidadInstalada::select('tipos_proyecto_capacidad_instalada.id as value', 'tipos_proyecto_capacidad_instalada.tipo as label')->orderBy('tipos_proyecto_capacidad_instalada.tipo', 'ASC')->get();
    }

    /**
     * Web api
     *
     * Trae los subtipos de proyecto de capacidad instalada
     */
    public static function subtiposProyectoCapacidadInstalada()
    {
        return SubtipoProyectoCapacidadInstalada::select('subtipos_proyecto_capacidad_instalada.id as value', 'subtipos_proyecto_capacidad_instalada.subtipo as label', 'subtipos_proyecto_capacidad_instalada.tipo_proyecto_capacidad_instalada_id')->orderBy('subtipos_proyecto_capacidad_instalada.subtipo', 'ASC')->get();
    }

    /**
     * Web api
     *
     * Trae las áreas de conocimiento
     */
    public static function mesasSectoriales()
    {
        return MesaSectorial::select('mesas_sectoriales.id as value', 'mesas_sectoriales.nombre as label')->orderBy('mesas_sectoriales.nombre', 'ASC')->get();
    }

    /**
     * Web api
     *
     * Trae los semilleros de investigacion
     */
    public static function semillerosInvestigacion()
    {
        return SemilleroInvestigacion::selectRaw('semilleros_investigacion.id as value, CONCAT(semilleros_investigacion.nombre, chr(10), \' Grupo de investigación: \', grupos_investigacion.nombre, chr(10)) as label, grupos_investigacion.centro_formacion_id as centro_formacion_id, lineas_investigacion.id as linea_investigacion_id')
            ->join('lineas_investigacion', 'semilleros_investigacion.linea_investigacion_id', 'lineas_investigacion.id')
            ->join('grupos_investigacion', 'lineas_investigacion.grupo_investigacion_id', 'grupos_investigacion.id')
            ->orderBy('semilleros_investigacion.nombre', 'ASC')->get();
    }

    /**
     * Web api
     *
     * Trae las actividades económicas
     */
    public static function actividadesEconomicas()
    {
        return ActividadEconomica::select('actividades_economicas.id as value', 'actividades_economicas.nombre as label')->orderBy('actividades_economicas.nombre', 'ASC')->get();
    }

    /**
     * Web api
     *
     * Trae las temáticas estrategicas SENA
     */
    public static function tematicasEstrategicas()
    {
        return TematicaEstrategica::select('tematicas_estrategicas.id as value', 'tematicas_estrategicas.nombre as label')->orderBy('tematicas_estrategicas.nombre', 'ASC')->get();
    }

    /**
     * Web api
     *
     * Trae los diseños curriculares
     */
    public static function disenoCurriculares()
    {
        return DisenoCurricular::selectRaw('id as value, CONCAT(nombre, \'  Código: \', codigo) as label, habilitado_convocatoria')->get();
    }

    /**
     * Web api
     *
     * Trae los programas SENNOVA
     */
    public static function programasSennova()
    {
        return ProgramaSennova::select('id as value', 'nombre as label')->orderBy('nombre', 'ASC')->get();
    }

    /**
     * Web api
     *
     * Trae los codigos de proyectos SGPS
     */
    public static function codigoProyectoSgps()
    {
        return  CodigoProyectoSgps::select('seguimientos_ambiente_modernizacion.codigo_proyecto_sgps_id', 'codigos_proyectos_sgps.codigo_sgps', 'codigos_proyectos_sgps.titulo', 'codigos_proyectos_sgps.year_ejecucion', 'lineas_programaticas.codigo', 'codigos_proyectos_sgps.centro_formacion_id', 'seguimientos_ambiente_modernizacion.codigo_proyecto_sgps_id')
            ->leftJoin('seguimientos_ambiente_modernizacion', 'codigos_proyectos_sgps.id', 'seguimientos_ambiente_modernizacion.codigo_proyecto_sgps_id')
            ->join('lineas_programaticas', 'codigos_proyectos_sgps.linea_programatica_id', 'lineas_programaticas.id')
            ->get();
    }

    /**
     * Web api
     *
     * Trae las subtipologías Minciencias
     */
    public static function subtipologiasMinciencias()
    {
        return SubtipologiaMinciencias::selectRaw('subtipologias_minciencias.id as value, CONCAT(subtipologias_minciencias.nombre, chr(10), \' Tipología Minciencias: \', tipologias_minciencias.nombre) as label')->join('tipologias_minciencias', 'subtipologias_minciencias.tipologia_minciencias_id', 'tipologias_minciencias.id')->orderBy('subtipologias_minciencias.nombre')->get();
    }

    /**
     * Web api
     *
     * Trae las tipologías del ambiente
     */
    public static function tipologiasAmbiente()
    {
        return TipologiaAmbiente::select('tipologias_ambientes.id as value', 'tipologias_ambientes.tipo as label')->orderBy('tipologias_ambientes.tipo', 'ASC')->get();
    }

    /**
     * Web api
     *
     * Trae las convocatorias
     */
    public static function convocatorias()
    {
        return Convocatoria::selectRaw("id as value, CONCAT(descripcion, ' ', year) as label")->orderBy('id', 'DESC')->get();
    }

    /**
     * Web api
     *
     * Trae los roles SENNOVA
     */
    public static function rolesSennova()
    {
        return RolSennova::select('id as value', 'nombre as label')->orderBy('nombre', 'ASC')->get();
    }

    /**
     * Web api
     *
     * Trae los usuarios por rol
     */
    public static function usuariosPorRol($rol)
    {
        $query = User::select('users.id as value', 'users.nombre as label');
        $query->join('model_has_roles', 'users.id', 'model_has_roles.model_id');
        $query->join('roles', 'model_has_roles.role_id', 'roles.id');
        $query->where('roles.name', 'ilike', '%' . $rol . '%');
        if (auth()->user()->hasRole([4])) {
            $query->where('users.centro_formacion_id', auth()->user()->centro_formacion_id);
        }
        $query->orderBy('users.nombre', 'ASC');

        return $query->get();
    }

    public static function convocatoriaRolesSennova($convocatoria_id, $tipo_formulario_convocatoria_id, $proyecto = null)
    {
        $query =    ConvocatoriaRolSennova::selectRaw("convocatoria_rol_sennova.id as value,
                        CASE nivel_academico
                            WHEN '7' THEN   CONCAT(roles_sennova.nombre, chr(10), 'Experiencia: ', convocatoria_rol_sennova.experiencia, chr(10), 'Asignación mensual: ', convocatoria_rol_sennova.asignacion_mensual)
                            WHEN '1' THEN   CONCAT(roles_sennova.nombre, ' (Técnico)', chr(10), 'Experiencia: ', convocatoria_rol_sennova.experiencia, chr(10), 'Asignación mensual: ', convocatoria_rol_sennova.asignacion_mensual)
                            WHEN '2' THEN   CONCAT(roles_sennova.nombre, ' (Tecnólogo)', chr(10), 'Experiencia: ', convocatoria_rol_sennova.experiencia, chr(10), 'Asignación mensual: ', convocatoria_rol_sennova.asignacion_mensual)
                            WHEN '3' THEN   CONCAT(roles_sennova.nombre, ' (Pregrado)', chr(10), 'Experiencia: ', convocatoria_rol_sennova.experiencia, chr(10), 'Asignación mensual: ', convocatoria_rol_sennova.asignacion_mensual)
                            WHEN '4' THEN   CONCAT(roles_sennova.nombre, ' (Especalización)', chr(10), 'Experiencia: ', convocatoria_rol_sennova.experiencia, chr(10), 'Asignación mensual: ', convocatoria_rol_sennova.asignacion_mensual)
                            WHEN '5' THEN   CONCAT(roles_sennova.nombre, ' (Maestría)', chr(10), 'Experiencia: ', convocatoria_rol_sennova.experiencia, chr(10), 'Asignación mensual: ', convocatoria_rol_sennova.asignacion_mensual)
                            WHEN '6' THEN   CONCAT(roles_sennova.nombre, ' (Doctorado)', chr(10), 'Experiencia: ', convocatoria_rol_sennova.experiencia, chr(10), 'Asignación mensual: ', convocatoria_rol_sennova.asignacion_mensual)
                            WHEN '8' THEN   CONCAT(roles_sennova.nombre, ' (Técnico con especialización)', chr(10), 'Experiencia: ', convocatoria_rol_sennova.experiencia, chr(10), 'Asignación mensual: ', convocatoria_rol_sennova.asignacion_mensual)
                            WHEN '9' THEN   CONCAT(roles_sennova.nombre, ' (Tecnólogo con especialización)', chr(10), 'Experiencia: ', convocatoria_rol_sennova.experiencia, chr(10), 'Asignación mensual: ', convocatoria_rol_sennova.asignacion_mensual)
                        END as label");

        if ($tipo_formulario_convocatoria_id == 17 && $proyecto) {
            $nodo_tecnoparque = $proyecto->proyectoFormulario17Linea69->nodoTecnoparque()->first();

            $query->join('topes_roles_nodos_tecnoparque', 'convocatoria_rol_sennova.id', 'topes_roles_nodos_tecnoparque.convocatoria_rol_sennova_id');
            $query->where('topes_roles_nodos_tecnoparque.nodo_tecnoparque_id', $nodo_tecnoparque->id);
        }

        if ($tipo_formulario_convocatoria_id == 10 && $proyecto) {
            $hub_innovacion = $proyecto->proyectoFormulario10Linea69->hubInnovacion()->first();

            $query->join('topes_roles_hubs_innovacion', 'convocatoria_rol_sennova.id', 'topes_roles_hubs_innovacion.convocatoria_rol_sennova_id');
            $query->where('topes_roles_hubs_innovacion.hub_innovacion_id', $hub_innovacion->id);
        }

        $query->join('roles_sennova', 'convocatoria_rol_sennova.rol_sennova_id', 'roles_sennova.id');

        if ($proyecto) {
            $query->whereNotIn('convocatoria_rol_sennova.id', $proyecto->proyectoRolesSennova()->pluck('convocatoria_rol_sennova_id')->toArray());
        }

        $query->where('convocatoria_rol_sennova.tipo_formulario_convocatoria_id', $tipo_formulario_convocatoria_id);
        $query->where('convocatoria_rol_sennova.convocatoria_id', $convocatoria_id);

        return $query->orderBy('roles_sennova.nombre')->get();
    }
}
