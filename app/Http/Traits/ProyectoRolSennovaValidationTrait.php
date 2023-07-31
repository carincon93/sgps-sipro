<?php

namespace App\Http\Traits;

use App\Models\ConvocatoriaRolSennova;

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
