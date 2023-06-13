<?php

namespace App\Policies;

use Illuminate\Auth\Access\HandlesAuthorization;
use App\Models\ProyectoCapacidadInstalada;
use App\Models\User;

class ProyectoCapacidadInstaladaPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view any models.
     *
     * @param  \App\Models\User  $user
     * @return mixed
     */
    public function viewAny(User $user)
    {
        if ($user->hasRole([4, 6])) {
            return true;
        }

        return false;
    }

    /**
     * Determine whether the user can view the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\ProyectoCapacidadInstalada  $proyectoCapacidadInstalada
     * @return mixed
     */
    public function view(User $user, ProyectoCapacidadInstalada $proyectoCapacidadInstalada)
    {
        if ($user->getAllPermissions()->where('id', 22)->first() || $user->hasRole([4]) && $user->dinamizadorCentroFormacion && $proyectoCapacidadInstalada->semilleroInvestigacion->lineaInvestigacion->grupoInvestigacion->centroFormacion->id == $user->dinamizadorCentroFormacion->id || $proyectoCapacidadInstalada->integrantes()->where('proyecto_capacidad_instalada_integrante.user_id', $user->id)->exists()) {
            return true;
        }

        return false;
    }

    /**
     * Determine whether the user can create models.
     *
     * @param  \App\Models\User  $user
     * @return mixed
     */
    public function create(User $user)
    {
        if ($user->hasRole([4, 6])) {
            return true;
        }

        return false;
    }

    /**
     * Determine whether the user can update the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\ProyectoCapacidadInstalada  $proyectoCapacidadInstalada
     * @return mixed
     */
    public function update(User $user, ProyectoCapacidadInstalada $proyectoCapacidadInstalada)
    {
        if ($proyectoCapacidadInstalada->estado_proyecto && $proyectoCapacidadInstalada->estado_proyecto == 'Finalizado') {
            return false;
        }

        if ($user->hasRole([4]) && $user->dinamizadorCentroFormacion && $proyectoCapacidadInstalada->semilleroInvestigacion->lineaInvestigacion->grupoInvestigacion->centroFormacion->id == $user->dinamizadorCentroFormacion->id) {
            return true;
        }

        if ($proyectoCapacidadInstalada->integrantes()->where('proyecto_capacidad_instalada_integrante.user_id', $user->id)->where('proyecto_capacidad_instalada_integrante.autor_principal', true)->exists()) {
            return true;
        }

        return false;
    }

    /**
     * Determine whether the user can delete the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\ProyectoCapacidadInstalada  $proyectoCapacidadInstalada
     * @return mixed
     */
    public function delete(User $user, ProyectoCapacidadInstalada $proyectoCapacidadInstalada)
    {
        if ($user->hasRole([4]) && $user->dinamizadorCentroFormacion && $proyectoCapacidadInstalada->semilleroInvestigacion->lineaInvestigacion->grupoInvestigacion->centroFormacion->id == $user->dinamizadorCentroFormacion->id) {
            return true;
        }

        if ($proyectoCapacidadInstalada->integrantes()->where('proyecto_capacidad_instalada_integrante.user_id', $user->id)->where('proyecto_capacidad_instalada_integrante.autor_principal', true)->exists()) {
            return true;
        }

        return false;
    }

    /**
     * Determine whether the user can restore the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\ProyectoCapacidadInstalada  $proyectoCapacidadInstalada
     * @return mixed
     */
    public function restore(User $user, ProyectoCapacidadInstalada $proyectoCapacidadInstalada)
    {
        //
    }

    /**
     * Determine whether the user can permanently delete the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\ProyectoCapacidadInstalada  $proyectoCapacidadInstalada
     * @return mixed
     */
    public function forceDelete(User $user, ProyectoCapacidadInstalada $proyectoCapacidadInstalada)
    {
        //
    }
}
