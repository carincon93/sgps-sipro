<?php

namespace App\Policies;

use Illuminate\Auth\Access\HandlesAuthorization;
use App\Models\GrupoInvestigacion;
use App\Models\User;

class GrupoInvestigacionPolicy
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
        // if ($user->hasRole([4])) {
        //     return true;
        // }

        return true;
    }

    /**
     * Determine whether the user can view the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\User  $model
     * @return mixed
     */
    public function view(User $user)
    {
        // if ($user->hasRole([4])) {
        //     return true;
        // }

        return true;
    }

    /**
     * Determine whether the user can create models.
     *
     * @param  \App\Models\User  $user
     * @return mixed
     */
    public function create(User $user)
    {
        if ($user->hasRole([4])) {
            return true;
        }

        return false;
    }

    /**
     * Determine whether the user can update the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\GrupoInvestigacion  $grupoInvestigacion
     * @return mixed
     */
    public function update(User $user, GrupoInvestigacion $grupoInvestigacion)
    {
        if ($user->hasRole(4) && $user->dinamizadorCentroFormacion && optional($user->dinamizadorCentroFormacion)->id == optional($grupoInvestigacion->centroFormacion)->id) {
            return true;
        }

        return false;
    }

    /**
     * Determine whether the user can delete the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\GrupoInvestigacion  $grupoInvestigacion
     * @return mixed
     */
    public function delete(User $user, GrupoInvestigacion $grupoInvestigacion)
    {
        return false;
    }

    /**
     * Determine whether the user can restore the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\GrupoInvestigacion  $grupoInvestigacion
     * @return mixed
     */
    public function restore(User $user, GrupoInvestigacion $grupoInvestigacion)
    {
        //
    }

    /**
     * Determine whether the user can permanently delete the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\GrupoInvestigacion  $grupoInvestigacion
     * @return mixed
     */
    public function forceDelete(User $user, GrupoInvestigacion $grupoInvestigacion)
    {
        //
    }
}
