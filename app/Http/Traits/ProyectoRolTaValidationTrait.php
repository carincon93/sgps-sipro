<?php

namespace App\Http\Traits;

use App\Models\ConvocatoriaRolSennova;
use App\Models\ProyectoRolSennova;
use App\Models\ReglaRolTa;

trait ProyectoRolTaValidationTrait
{
    public static function rolTaValidation($proyecto, $tecnoacademiaId, $convocatoriaRolSennovaId, $proyectoRolSennovaId, $cantidadRoles)
    {
        $tecnoacademiaRoles = ReglaRolTa::where('tecnoacademia_id', $tecnoacademiaId)->get();

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

        if ($tecnoacademiaRoles) {
            $count = 0;
            // Valida si el rol ta está en el array
            foreach ($tecnoacademiaRoles as $tecnoacademiaRol) {
                if ($convocatoriaRolSennova->rolSennova->id == $tecnoacademiaRol->convocatoriaRolSennova->rol_sennova_id) {
                    $count--;
                } else {
                    $count++;
                }
            }

            foreach ($tecnoacademiaRoles as $rol) {
                if ($convocatoriaRolSennova->rolSennova->id == $rol->convocatoriaRolSennova->rol_sennova_id && $cantidadRoles > $rol->maximo) {
                    return true;
                }
            }
        }

        // Valida si el rol ta está en el array
        if ($count == count($tecnoacademiaRoles)) {
            return true;
        }

        return false;
    }

    public static function contratoAprendizajeValidation($convocatoriaRolSennova, $proyecto, $proyectoRolSennova, $numeroMeses, $numeroRoles)
    {
        $convocatoriaRolSennova = ConvocatoriaRolSennova::find($convocatoriaRolSennova);
        if (stripos($convocatoriaRolSennova->rolSennova->nombre, 'Aprendiz sennova (contrato aprendizaje)') !== false) {
            // Trae la suma del número de monitorías requeridos
            $numeroRolesSaved = $proyecto->proyectoRolesSennova()->selectRaw('sum(proyecto_rol_sennova.numero_roles) as qty')
                ->join('convocatoria_rol_sennova', 'proyecto_rol_sennova.convocatoria_rol_sennova_id', 'convocatoria_rol_sennova.id')
                ->join('roles_sennova', 'convocatoria_rol_sennova.rol_sennova_id', 'roles_sennova.id')
                ->where('roles_sennova.nombre', 'like', '%Aprendiz sennova (contrato aprendizaje)%')->first()->qty;

            // Si se va a actualizar, se trae la suma del número de monitorías requeridos del recurso a actualizar y se resta al número total de todos los monitorías para no afectar la suma de lo que viene en el form
            if ($proyectoRolSennova) {
                $numeroRolesSaved -= $proyecto->proyectoRolesSennova()->selectRaw('sum(proyecto_rol_sennova.numero_roles) as qty')
                    ->join('convocatoria_rol_sennova', 'proyecto_rol_sennova.convocatoria_rol_sennova_id', 'convocatoria_rol_sennova.id')
                    ->join('roles_sennova', 'convocatoria_rol_sennova.rol_sennova_id', 'roles_sennova.id')
                    ->where('roles_sennova.nombre', 'like', '%Aprendiz sennova (contrato aprendizaje)%')->where('proyecto_rol_sennova.id', $proyectoRolSennova->id)->first()->qty;
            }

            if (
                $proyecto->proyectoRolesSennova()->where('roles_sennova.nombre', 'like', '%Aprendiz sennova (contrato aprendizaje)%')->join('convocatoria_rol_sennova', 'proyecto_rol_sennova.convocatoria_rol_sennova_id', 'convocatoria_rol_sennova.id')
                ->join('roles_sennova', 'convocatoria_rol_sennova.rol_sennova_id', 'roles_sennova.id')->count() > 4 ||  ($numeroRolesSaved + $numeroRoles) > 4
            ) {
                return true;
            }

            if ($numeroMeses == 6 && $numeroRoles <= 4) {
                return false;
            } else {
                return true;
            }
        }

        return false;
    }
}
