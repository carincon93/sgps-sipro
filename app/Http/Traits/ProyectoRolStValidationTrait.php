<?php

namespace App\Http\Traits;

use App\Models\ConvocatoriaRolSennova;
use App\Models\ProyectoRolSennova;
use App\Models\ReglaRolSt;

trait ProyectoRolStValidationTrait
{
    public static function rolStValidation($proyecto, $tipoProyectoStId, $convocatoriaRolSennovaId, $proyectoRolSennovaId, $cantidadRoles)
    {
        $stRoles = ReglaRolSt::where('tipo_proyecto_st_id', $tipoProyectoStId)->get();

        $convocatoriaRolSennova = ConvocatoriaRolSennova::find($convocatoriaRolSennovaId);

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

        if ($stRoles) {
            $count = 0;
            // Valida si el rol ta está en el array
            foreach ($stRoles as $stRol) {
                if ($convocatoriaRolSennova->rolSennova->id == $stRol->rol_sennova_id) {
                    $count--;
                } else {
                    $count++;
                }
            }

            foreach ($stRoles as $rol) {
                if ($convocatoriaRolSennova->rolSennova->id == $rol->rol_sennova_id && $cantidadRoles > $rol->maximo) {
                    return true;
                }
            }
        }

        // Valida si el rol ta está en el array
        if ($count == count($stRoles)) {
            return true;
        }

        return false;
    }
}
