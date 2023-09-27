<?php

namespace App\Http\Traits;

use App\Models\ConvocatoriaRolSennova;

trait ProyectoRolSennovaValidationTrait
{
    public static function monitoriaValidation($convocatoria_rol_sennova, $proyecto, $proyecto_rol_sennova, $numero_meses, $numero_roles)
    {
        $convocatoria_rol_sennova = ConvocatoriaRolSennova::find($convocatoria_rol_sennova);
        if (stripos($convocatoria_rol_sennova->rolSennova->nombre, 'monitor') !== false) {
            // Trae la suma del número de monitorías requeridos
            $numero_roles_bd = $proyecto->proyectoRolesSennova()->selectRaw('sum(proyecto_rol_sennova.numero_roles) as qty')
                ->join('convocatoria_rol_sennova', 'proyecto_rol_sennova.convocatoria_rol_sennova_id', 'convocatoria_rol_sennova.id')
                ->join('roles_sennova', 'convocatoria_rol_sennova.rol_sennova_id', 'roles_sennova.id')
                ->where('roles_sennova.nombre', 'ilike', '%monitor%')->first()->qty;

            // Si se va a actualizar, se trae la suma del número de monitorías requeridos del recurso a actualizar y se resta al número total de todos los monitorías para no afectar la suma de lo que viene en el form
            if ($proyecto_rol_sennova) {
                $numero_roles_bd -= $proyecto->proyectoRolesSennova()->selectRaw('sum(proyecto_rol_sennova.numero_roles) as qty')
                    ->join('convocatoria_rol_sennova', 'proyecto_rol_sennova.convocatoria_rol_sennova_id', 'convocatoria_rol_sennova.id')
                    ->join('roles_sennova', 'convocatoria_rol_sennova.rol_sennova_id', 'roles_sennova.id')
                    ->where('roles_sennova.nombre', 'ilike', '%monitor%')->where('proyecto_rol_sennova.id', $proyecto_rol_sennova->id)->first()->qty;
            }

            if ($numero_roles + $numero_roles_bd <= 4) {
                return false;
            } else {
                return true;
            }
        }

        return false;
    }

    public static function contratoAprendizajeValidation($convocatoria_rol_sennova, $proyecto, $proyecto_rol_sennova, $numero_meses, $numero_roles)
    {
        $convocatoria_rol_sennova = ConvocatoriaRolSennova::find($convocatoria_rol_sennova);
        if (stripos($convocatoria_rol_sennova->rolSennova->nombre, 'Aprendiz sennova (contrato aprendizaje)') !== false) {
            // Trae la suma del número de monitorías requeridos
            $numero_roles_bd = $proyecto->proyectoRolesSennova()->select('roles_sennova.*')
                ->join('convocatoria_rol_sennova', 'proyecto_rol_sennova.convocatoria_rol_sennova_id', 'convocatoria_rol_sennova.id')
                ->join('roles_sennova', 'convocatoria_rol_sennova.rol_sennova_id', 'roles_sennova.id')
                ->where('roles_sennova.nombre', 'ilike', '%Aprendiz sennova (contrato aprendizaje)%')
                ->count();

            // Si se va a actualizar, se trae la suma del número de monitorías requeridos del recurso a actualizar y se resta al número total de todos los monitorías para no afectar la suma de lo que viene en el form
            if ($proyecto_rol_sennova) {
                $numero_roles_bd -= $proyecto->proyectoRolesSennova()->selectRaw('sum(proyecto_rol_sennova.numero_roles) as qty')
                    ->join('convocatoria_rol_sennova', 'proyecto_rol_sennova.convocatoria_rol_sennova_id', 'convocatoria_rol_sennova.id')
                    ->join('roles_sennova', 'convocatoria_rol_sennova.rol_sennova_id', 'roles_sennova.id')
                    ->where('roles_sennova.nombre', 'ilike', '%Aprendiz sennova (contrato aprendizaje)%')
                    ->where('proyecto_rol_sennova.id', $proyecto_rol_sennova->id)->first()->qty;
            }

            if (
                $proyecto->proyectoRolesSennova()->where('roles_sennova.nombre', 'like', '%Aprendiz sennova (contrato aprendizaje)%')->join('convocatoria_rol_sennova', 'proyecto_rol_sennova.convocatoria_rol_sennova_id', 'convocatoria_rol_sennova.id')
                ->join('roles_sennova', 'convocatoria_rol_sennova.rol_sennova_id', 'roles_sennova.id')->count() > 1 ||  ($numero_roles_bd + $numero_roles) > 1
            ) {
                return true;
            }

            if ($numero_meses == 6 && $numero_roles <= 1) {
                return false;
            } else {
                return true;
            }
        }

        return false;
    }

    public static function topesRolesSennovaTecnoparqueValidation($convocatoria, $proyecto)
    {
        $nodo_tecnoparque = $proyecto->proyectoFormulario17Linea69->nodoTecnoparque()->first();

        foreach ($proyecto->proyectoRolesSennova as $proyecto_rol_sennova) {
            if ($proyecto_rol_sennova->convocatoriaRolSennova->topesRolesSennovaTecnoparque()->exists()) {
                if ($proyecto_rol_sennova->numero_roles > $proyecto_rol_sennova->convocatoriaRolSennova->topesRolesSennovaTecnoparque()->where('nodo_tecnoparque_id', $nodo_tecnoparque->id)->first()->cantidad_maxima) {
                    return false;
                }
            }
        }

        return true;
    }

    public static function topesRolesSennovaHubInnovacionValidation($convocatoria, $proyecto)
    {
        $hub_innovacion = $proyecto->proyectoFormulario10Linea69->hubInnovacion()->first();


        foreach ($proyecto->proyectoRolesSennova as $proyecto_rol_sennova) {
            if ($proyecto_rol_sennova->convocatoriaRolSennova->topesRolesSennovaHubInnovacion()->exists()) {

                if ($proyecto_rol_sennova->numero_roles > $proyecto_rol_sennova->convocatoriaRolSennova->topesRolesSennovaHubInnovacion()->where('hub_innovacion_id', $hub_innovacion->id)->first()->cantidad_maxima) {
                    return false;
                }
            }
        }

        return true;
    }

    public static function topesRolesSennovaFormulario13Validation($convocatoria, $proyecto)
    {
        foreach ($proyecto->proyectoRolesSennova as $proyecto_rol_sennova) {
            if ($proyecto_rol_sennova->convocatoriaRolSennova->topesRolesSennovaFormulario13()->exists()) {

                if ($proyecto_rol_sennova->numero_roles > $proyecto_rol_sennova->convocatoriaRolSennova->topesRolesSennovaFormulario13()->where('centro_formacion_id', $proyecto->centro_formacion_id)->first()->cantidad_maxima) {
                    return false;
                }
            }
        }

        return true;
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
    public static function totalRolesSennova($proyecto, $rol_sennova_id)
    {
        $total = 0;

        foreach ($proyecto->proyectoRolesSennova as $rol_sennova) {
            if ($rol_sennova->convocatoriaRolSennova->rolSennova->id == $rol_sennova_id) {
                $total++;
            }
        }

        return $total;
    }
}
