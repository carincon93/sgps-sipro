<?php

namespace App\Http\Traits;

use App\Models\ConvocatoriaRolSennova;
use App\Models\ProyectoRolSennova;
use App\Models\ReglaRolTp;

trait ProyectoRolTpValidationTrait
{
    public static function rolTpValidation($proyecto, $nodoTecnoparqueId, $convocatoriaRolSennovaId, $proyectoRolSennovaId, $cantidadRoles)
    {
        $tecnoparqueRoles = ReglaRolTp::where('nodo_tecnoparque_id', $nodoTecnoparqueId)->get();

        $convocatoriaRolSennova = ConvocatoriaRolSennova::find($convocatoriaRolSennovaId);

        $proyectoRolSennovaBd = ProyectoRolSennova::find($proyectoRolSennovaId);

        $proyectoRolesSennova = ProyectoRolSennova::select('proyecto_rol_sennova.id', 'proyecto_rol_sennova.numero_roles')->join('convocatoria_rol_sennova', 'proyecto_rol_sennova.convocatoria_rol_sennova_id', 'convocatoria_rol_sennova.id')->where('convocatoria_rol_sennova.rol_sennova_id', $convocatoriaRolSennova->rolSennova->id)->where('proyecto_id', $proyecto->id)->get();

        if ($convocatoriaRolSennova->rol_sennova_id == 7) {
            if ($tecnoparqueRoles) {
                if ($tecnoparqueRoles->where('convocatoria_rol_sennova_id', $convocatoriaRolSennova->id)->first()) {
                } else {
                    return true;
                }
                foreach ($tecnoparqueRoles as $tecnoparqueRol) {
                    if ($convocatoriaRolSennova->id == $tecnoparqueRol->convocatoriaRolSennova->id && $cantidadRoles > $tecnoparqueRol->maximo) {
                        return true;
                    }
                }
            }
        } else {
            if (count($proyectoRolesSennova) > 0) {
                foreach ($proyectoRolesSennova as $proyectoRolSennova) {
                    if ($proyectoRolSennovaBd && $proyectoRolSennovaBd->id == $proyectoRolSennova->id) {
                        $proyectoRolSennova->numero_roles = 0;
                    }
                    $cantidadRoles += $proyectoRolSennova->numero_roles;
                }
            }

            if ($tecnoparqueRoles) {
                $count = 0;
                // Valida si el rol ta está en el array
                foreach ($tecnoparqueRoles as $tecnoparqueRol) {
                    if ($convocatoriaRolSennova->rolSennova->id == $tecnoparqueRol->convocatoriaRolSennova->rol_sennova_id) {
                        $count--;
                    } else {
                        $count++;
                    }
                }

                foreach ($tecnoparqueRoles as $rol) {
                    if ($convocatoriaRolSennova->rolSennova->id == $rol->convocatoriaRolSennova->rol_sennova_id && $cantidadRoles > $rol->maximo) {
                        return true;
                    }
                }
            }

            // Valida si el rol tp está en el array
            if ($count == count($tecnoparqueRoles)) {
                return true;
            }

            return false;
        }
    }
}
