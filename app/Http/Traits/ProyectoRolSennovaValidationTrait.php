<?php

namespace App\Http\Traits;

use App\Models\CentroFormacion;
use App\Models\ConvocatoriaRolSennova;
use App\Models\LineaProgramatica;
use App\Models\ProyectoRolSennova;
use App\Models\ReglaRolCultura;

trait ProyectoRolSennovaValidationTrait
{
    public static function monitoriaValidation($convocatoriaRolSennova, $proyecto, $proyectoRolSennova, $numeroMeses, $numeroRoles)
    {
        $convocatoriaRolSennova = ConvocatoriaRolSennova::find($convocatoriaRolSennova);
        if (stripos($convocatoriaRolSennova->rolSennova->nombre, 'monitor') !== false) {
            // Trae la suma del número de monitorías requeridos
            $numeroRolesSaved = $proyecto->proyectoRolesSennova()->selectRaw('sum(proyecto_rol_sennova.numero_roles) as qty')
                ->join('convocatoria_rol_sennova', 'proyecto_rol_sennova.convocatoria_rol_sennova_id', 'convocatoria_rol_sennova.id')
                ->join('roles_sennova', 'convocatoria_rol_sennova.rol_sennova_id', 'roles_sennova.id')
                ->where('roles_sennova.nombre', 'ilike', '%monitor%')->first()->qty;

            // Si se va a actualizar, se trae la suma del número de monitorías requeridos del recurso a actualizar y se resta al número total de todos los monitorías para no afectar la suma de lo que viene en el form
            if ($proyectoRolSennova) {
                $numeroRolesSaved -= $proyecto->proyectoRolesSennova()->selectRaw('sum(proyecto_rol_sennova.numero_roles) as qty')
                    ->join('convocatoria_rol_sennova', 'proyecto_rol_sennova.convocatoria_rol_sennova_id', 'convocatoria_rol_sennova.id')
                    ->join('roles_sennova', 'convocatoria_rol_sennova.rol_sennova_id', 'roles_sennova.id')
                    ->where('roles_sennova.nombre', 'ilike', '%monitor%')->where('proyecto_rol_sennova.id', $proyectoRolSennova->id)->first()->qty;
            }

            if ($numeroRoles + $numeroRolesSaved <= 4) {
                return false;
            } else {
                return true;
            }
        }

        return false;
    }

    public static function contratoAprendizajeValidation($convocatoriaRolSennova, $proyecto, $proyectoRolSennova, $numeroMeses, $numeroRoles)
    {
        $convocatoriaRolSennova = ConvocatoriaRolSennova::find($convocatoriaRolSennova);
        if (stripos($convocatoriaRolSennova->rolSennova->nombre, 'Aprendiz sennova (contrato aprendizaje)') !== false) {
            // Trae la suma del número de monitorías requeridos
            $numeroRolesSaved = $proyecto->proyectoRolesSennova()->select('roles_sennova.*')
                ->join('convocatoria_rol_sennova', 'proyecto_rol_sennova.convocatoria_rol_sennova_id', 'convocatoria_rol_sennova.id')
                ->join('roles_sennova', 'convocatoria_rol_sennova.rol_sennova_id', 'roles_sennova.id')
                ->where('roles_sennova.nombre', 'ilike', '%Aprendiz sennova (contrato aprendizaje)%')
                ->count();

            // Si se va a actualizar, se trae la suma del número de monitorías requeridos del recurso a actualizar y se resta al número total de todos los monitorías para no afectar la suma de lo que viene en el form
            if ($proyectoRolSennova) {
                $numeroRolesSaved -= $proyecto->proyectoRolesSennova()->selectRaw('sum(proyecto_rol_sennova.numero_roles) as qty')
                    ->join('convocatoria_rol_sennova', 'proyecto_rol_sennova.convocatoria_rol_sennova_id', 'convocatoria_rol_sennova.id')
                    ->join('roles_sennova', 'convocatoria_rol_sennova.rol_sennova_id', 'roles_sennova.id')
                    ->where('roles_sennova.nombre', 'ilike', '%Aprendiz sennova (contrato aprendizaje)%')
                    ->where('proyecto_rol_sennova.id', $proyectoRolSennova->id)->first()->qty;
            }

            if (
                $proyecto->proyectoRolesSennova()->where('roles_sennova.nombre', 'like', '%Aprendiz sennova (contrato aprendizaje)%')->join('convocatoria_rol_sennova', 'proyecto_rol_sennova.convocatoria_rol_sennova_id', 'convocatoria_rol_sennova.id')
                ->join('roles_sennova', 'convocatoria_rol_sennova.rol_sennova_id', 'roles_sennova.id')->count() > 1 ||  ($numeroRolesSaved + $numeroRoles) > 1
            ) {
                return true;
            }



            if ($numeroMeses == 6 && $numeroRoles <= 1) {
                return false;
            } else {
                return true;
            }
        }

        return false;
    }

    /**
     * culturaInnovacion
     *
     * @param  mixed $centroFormacionId
     * @param  mixed $lineaProgramaticaId
     * @return void
     */
    public static function culturaInnovacionNumeroProyectos($centroFormacionId, $lineaProgramaticaId)
    {
        $centroFormacion = CentroFormacion::find($centroFormacionId);
        $lineaProgramatica = LineaProgramatica::find($lineaProgramaticaId);

        if (in_array($centroFormacion->codigo, [9309, 9503, 9230, 9124, 9525, 9222, 9212, 9116, 9517, 9401, 9403, 9303, 9310, 9529, 9308]) && $lineaProgramatica->codigo == 65) {
            foreach ($centroFormacion->proyectos as $proyecto) {
                if ($proyecto->lineaProgramatica->codigo == 65) {
                    return true;
                }
            }
        }

        return false;
    }

    public static function culturaInnovacionRoles($proyecto, $convocatoriaRolSennovaId, $proyectoRolSennovaId, $cantidadRoles)
    {
        $convocatoriaRolSennova = ConvocatoriaRolSennova::find($convocatoriaRolSennovaId);
        $centroFormacion = ReglaRolCultura::where('centro_formacion_id', $proyecto->centroFormacion->id)->first();

        if ($centroFormacion && $convocatoriaRolSennova) {

            $proyectoRolSennovaBd = ProyectoRolSennova::find($proyectoRolSennovaId);

            $proyectoRolesSennova = ProyectoRolSennova::select('proyecto_rol_sennova.id', 'proyecto_rol_sennova.numero_roles')->join('convocatoria_rol_sennova', 'proyecto_rol_sennova.convocatoria_rol_sennova_id', 'convocatoria_rol_sennova.id')->where('convocatoria_rol_sennova.rol_sennova_id', $convocatoriaRolSennova->rolSennova->id)->where('proyecto_id', $proyecto->id)->get();
            if (count($proyectoRolesSennova) > 0) {
                foreach ($proyectoRolesSennova as $proyectoRolSennova) {
                    if ($proyectoRolSennovaBd && $proyectoRolSennovaBd->id == $proyectoRolSennova->id) {
                        $proyectoRolSennova->numero_roles = 0;
                    }
                    $cantidadRoles += $proyectoRolSennova->numero_roles;
                }
            }

            $count = 0;
            // Valida si el rol ta está en el array
            foreach ($proyectoRolesSennova as $rol) {
                if ($convocatoriaRolSennova->rolSennova->id == $rol->rol_sennova_id) {
                    $count--;
                } else {
                    $count++;
                }

                // 27 auxiliar editorial
                if ($convocatoriaRolSennova->rolSennova->id == 27 && ($cantidadRoles) > $centroFormacion->auxiliar_editorial) {
                    return true;
                }

                // 26 gestor editorial
                if ($convocatoriaRolSennova->rolSennova->id == 26 && ($cantidadRoles) > $centroFormacion->gestor_editorial) {
                    return true;
                }

                // 25 experto temático en producción científica
                if ($convocatoriaRolSennova->rolSennova->id == 25 && ($cantidadRoles) > $centroFormacion->experto_tematico) {
                    return true;
                }
            }
        }

        return false;
    }

    /**
     * serviciosTecnologicosRoles
     *
     * @param  mixed $proyecto
     * @param  mixed $rolSennovaId
     * @param  mixed $numeroRoles
     * @return boolean
     */
    public static function serviciosTecnologicosRoles($proyecto, $rolSennovaId, $numeroRoles)
    {
        $rolSennova = self::reglasServiciosTecnologicos($rolSennovaId);

        if ($numeroRoles > $rolSennova['cantidad']) {
            return true;
        }

        return false;
    }

    /**
     * reglasServiciosTecnologicos
     *
     * @param  mixed $rolSennovaId
     * @return object
     */
    public static function reglasServiciosTecnologicos($rolSennovaId)
    {
        $convocatoriaRolSennova = ConvocatoriaRolSennova::find($rolSennovaId);

        $reglas = '[
            { "rolSennovaId": 17, "cantidad": 1},
            { "rolSennovaId": 18, "cantidad": 1},
            { "rolSennovaId": 19, "cantidad": 1},
            { "rolSennovaId": 20, "cantidad": 1},
            { "rolSennovaId": 21, "cantidad": 4},
            { "rolSennovaId": 22, "cantidad": 4},
            { "rolSennovaId": 23, "cantidad": 10},
            { "rolSennovaId": 24, "cantidad": 10},
            { "rolSennovaId": 3 , "cantidad": 2}
       ]';

        return collect(json_decode($reglas, true))->where('rolSennovaId', $convocatoriaRolSennova->rolSennova->id)->first();
    }

    /**
     * totalRolesSennova
     *
     * Obtiene la cantidad total de un rol sennova
     * 
     * @param  mixed $proyecto
     * @param  mixed $codigo
     * @return int
     */
    public static function totalRolesSennova($proyecto, $rolSennovaId)
    {
        $total = 0;

        foreach ($proyecto->proyectoRolesSennova as $rolSennova) {
            if ($rolSennova->convocatoriaRolSennova->rolSennova->id == $rolSennovaId) {
                $total++;
            }
        }

        return $total;
    }
}
