<?php

namespace App\Policies;

use Illuminate\Auth\Access\HandlesAuthorization;
use App\Models\NodoTecnoparque;
use App\Models\User;

class NodoTecnoparquePolicy
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
        if ($user->hasRole(17)) {
            return true;
        }

        return false;
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
        if ($user->hasRole(17)) {
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
        if ($user->hasRole(17)) {
            return true;
        }

        return false;
    }
    /**
     * Determine whether the user can update the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\NodoTecnoparque  $nodoTecnoparque
     * @return mixed
     */
    public function update(User $user, NodoTecnoparque $nodoTecnoparque)
    {
        if ($user->hasRole(17)) {
            return true;
        }

        return false;
    }

    /**
     * Determine whether the user can delete the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\NodoTecnoparque  $nodoTecnoparque
     * @return mixed
     */
    public function delete(User $user, NodoTecnoparque $nodoTecnoparque)
    {
        return false;
    }

    /**
     * Determine whether the user can restore the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\NodoTecnoparque  $nodoTecnoparque
     * @return mixed
     */
    public function restore(User $user, NodoTecnoparque $nodoTecnoparque)
    {
        //
    }

    /**
     * Determine whether the user can permanently delete the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\NodoTecnoparque  $nodoTecnoparque
     * @return mixed
     */
    public function forceDelete(User $user, NodoTecnoparque $nodoTecnoparque)
    {
        //
    }
}
