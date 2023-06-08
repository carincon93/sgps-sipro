<?php

namespace App\Policies;

use Illuminate\Auth\Access\HandlesAuthorization;
use App\Models\AmbienteModernizacion;
use App\Models\User;

class AmbienteModernizacionPolicy
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
        return true;

        if ($user->hasRole([4])) {
            return true;
        }
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
        // Quemado
        if ($user->id == 845) {
            return true;
        }

        return false;

        if ($user->hasRole([4])) {
            return true;
        }
    }

    /**
     * Determine whether the user can create models.
     *
     * @param  \App\Models\User  $user
     * @return mixed
     */
    public function create(User $user)
    {
        return true;

        if ($user->hasRole([4])) {
            return true;
        }
    }

    /**
     * Determine whether the user can update the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\AmbienteModernizacion  $ambienteModernizacion
     * @return mixed
     */
    public function update(User $user, AmbienteModernizacion $ambienteModernizacion)
    {
        return true;

        if ($user->hasRole(4) && $user->id == $ambienteModernizacion->dinamizador_sennova_id && $ambienteModernizacion->finalizado == false) {
            return true;
        }
    }

    /**
     * Determine whether the user can delete the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\AmbienteModernizacion  $ambienteModernizacion
     * @return mixed
     */
    public function delete(User $user, AmbienteModernizacion $ambienteModernizacion)
    {
        return true;

        if ($user->hasRole(4) && $user->id == $ambienteModernizacion->dinamizador_sennova_id && $ambienteModernizacion->finalizado == false) {
            return true;
        }
    }

    /**
     * Determine whether the user can restore the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\AmbienteModernizacion  $ambienteModernizacion
     * @return mixed
     */
    public function restore(User $user, AmbienteModernizacion $ambienteModernizacion)
    {
        //
    }

    /**
     * Determine whether the user can permanently delete the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\AmbienteModernizacion  $ambienteModernizacion
     * @return mixed
     */
    public function forceDelete(User $user, AmbienteModernizacion $ambienteModernizacion)
    {
        //
    }
}
