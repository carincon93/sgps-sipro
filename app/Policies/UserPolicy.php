<?php

namespace App\Policies;

use Illuminate\Auth\Access\HandlesAuthorization;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;

class UserPolicy
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
        if ($user->hasRole([4, 21, 17, 18, 20, 19, 5])) {
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
        if ($user->hasRole([4, 21, 17, 18, 20, 19, 5])) {
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
        if ($user->hasRole([4, 21, 17, 18, 20, 19, 5])) {
            return true;
        }

        return false;
    }

    /**
     * Determine whether the user can update the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\User  $model
     * @return mixed
     */
    public function update(User $user, $usuario_a_editar)
    {
        if ($user->id == $usuario_a_editar->id) {
            return true;
        }

        if ($this->checkRole($user, 18) && $this->checkRole($usuario_a_editar, 6) || $this->checkRole($user, 20) && $this->checkRole($usuario_a_editar, 15) || $this->checkRole($user, 5) && $this->checkRole($usuario_a_editar, 12) || $this->checkRole($user, 17) && $this->checkRole($usuario_a_editar, 16) || $this->checkRole($user, 19) && $this->checkRole($usuario_a_editar, 13)) {
            return true;
        }

        if ($user->dinamizadorCentroFormacion && $user->dinamizadorCentroFormacion->id == $usuario_a_editar->centroFormacion->id || $user->hasRole(21) && $user->centroFormacion->id == $usuario_a_editar->centroFormacion->id) {
            return true;
        }

        return false;
    }

    /**
     * Determine whether the user can delete the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\User  $model
     * @return mixed
     */
    public function delete(User $user)
    {
        return false;
    }

    /**
     * Determine whether the user can restore the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\User  $model
     * @return mixed
     */
    public function restore(User $user)
    {
        //
    }

    /**
     * Determine whether the user can permanently delete the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\User  $model
     * @return mixed
     */
    public function forceDelete(User $user)
    {
        //
    }

    public function checkRole($user, $rol)
    {
        $userRole = $user->whereHas('roles', function (Builder $query) use ($user, $rol) {
            return $query->where('id', $rol)->where('users.id', $user->id);
        })->first();

        return $userRole && $userRole->exists() ? true : false;
    }
}
