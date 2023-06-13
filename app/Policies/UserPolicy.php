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
    public function update(User $user, $proponente)
    {
        if ($this->checkRole($user, 'activador i+d+i') && $this->checkRole($proponente, 'proponente i+d+i') || $this->checkRole($user, 'activador cultura de la innovación') && $this->checkRole($proponente, 'proponente cultura de la innovación') || $this->checkRole($user, 'activador tecnoacademia') && $this->checkRole($proponente, 'proponente tecnoacademia') || $this->checkRole($user, 'activador tecnoparque') && $this->checkRole($proponente, 'proponente tecnoparque') || $this->checkRole($user, 'activador servicios tecnológicos') && $this->checkRole($proponente, 'proponente servicios tecnológicos')) {
            return true;
        }

        if ($user->dinamizadorCentroFormacion && $user->dinamizadorCentroFormacion->id == $proponente->centroFormacion->id || $user->hasRole(21) && $user->centroFormacion->id == $proponente->centroFormacion->id) {
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
            return $query->where('name', 'ilike', '%' . $rol . '%')->where('users.id', $user->id);
        })->first();

        return $userRole && $userRole->exists() ? true : false;
    }
}
