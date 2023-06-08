<?php

namespace App\Policies;

use Illuminate\Auth\Access\HandlesAuthorization;
use App\Models\Evaluacion\Evaluacion;
use App\Models\User;

class EvaluacionPolicy
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
        if ($user->hasRole([20, 18, 19, 5, 17])) {
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
        if ($user->hasRole([20, 18, 19, 5, 17])) {
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
        if ($user->hasRole([20, 18, 19, 5, 17])) {
            return true;
        }

        return false;
    }
    /**
     * Determine whether the user can update the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\Evaluacion  $evaluacion
     * @return mixed
     */
    public function update(User $user, Evaluacion $evaluacion)
    {
        if ($user->hasRole([20, 18, 19, 5, 17])) {
            return true;
        }

        return false;
    }

    /**
     * Determine whether the user can delete the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\Evaluacion  $evaluacion
     * @return mixed
     */
    public function delete(User $user, Evaluacion $evaluacion)
    {
        return false;
    }

    /**
     * Determine whether the user can restore the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\Evaluacion  $evaluacion
     * @return mixed
     */
    public function restore(User $user, Evaluacion $evaluacion)
    {
        //
    }

    /**
     * Determine whether the user can permanently delete the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\Evaluacion  $evaluacion
     * @return mixed
     */
    public function forceDelete(User $user, Evaluacion $evaluacion)
    {
        //
    }
}
