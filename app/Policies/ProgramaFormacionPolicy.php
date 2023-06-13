<?php

namespace App\Policies;

use Illuminate\Auth\Access\HandlesAuthorization;
use App\Models\ProgramaFormacion;
use App\Models\User;

class ProgramaFormacionPolicy
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
        if ($user->hasRole([4, 21, 20, 18, 19, 5, 17])) {
            return true;
        }

        return false;
    }

    /**
     * Determine whether the user can view the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\ProgramaFormacion  $programaFormacion
     * @return mixed
     */
    public function view(User $user, ProgramaFormacion $programaFormacion)
    {
        if ($user->hasRole([20, 18, 17, 19, 5]) || $user->hasRole([4, 21]) && $user->centro_formacion_id == $programaFormacion->centro_formacion_id) {
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
        if ($user->hasRole([4, 21, 20, 18, 19, 5, 17])) {
            return true;
        }

        return false;
    }

    /**
     * Determine whether the user can update the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\ProgramaFormacion  $programaFormacion
     * @return mixed
     */
    public function update(User $user, ProgramaFormacion $programaFormacion)
    {
        if ($user->hasRole([20, 18, 19, 5, 17]) || $user->hasRole([4, 21]) && $user->centro_formacion_id == $programaFormacion->centro_formacion_id) {
            return true;
        }

        return false;
    }

    /**
     * Determine whether the user can delete the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\ProgramaFormacion  $programaFormacion
     * @return mixed
     */
    public function delete(User $user, ProgramaFormacion $programaFormacion)
    {
        if ($user->hasRole([20, 18, 19, 5, 17]) || $user->hasRole([4, 21]) && $user->centro_formacion_id == $programaFormacion->centro_formacion_id) {
            return true;
        }

        return false;
    }

    /**
     * Determine whether the user can restore the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\ProgramaFormacion  $programaFormacion
     * @return mixed
     */
    public function restore(User $user, ProgramaFormacion $programaFormacion)
    {
        //
    }

    /**
     * Determine whether the user can permanently delete the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\ProgramaFormacion  $programaFormacion
     * @return mixed
     */
    public function forceDelete(User $user, ProgramaFormacion $programaFormacion)
    {
        //
    }
}
