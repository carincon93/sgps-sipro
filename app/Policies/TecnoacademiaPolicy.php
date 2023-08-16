<?php

namespace App\Policies;

use Illuminate\Auth\Access\HandlesAuthorization;
use App\Models\Tecnoacademia;
use App\Models\User;

class TecnoacademiaPolicy
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
        if ($user->hasRole([21, 18, 19, 5, 17])) {
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
        if ($user->hasRole([21, 18, 19, 5, 17])) {
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
        if ($user->hasRole([21, 18, 19, 5, 17])) {
            return true;
        }

        return false;
    }
    /**
     * Determine whether the user can update the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\Tecnoacademia  $tecnoacademia
     * @return mixed
     */
    public function update(User $user, Tecnoacademia $tecnoacademia)
    {
        if ($user->hasRole([21, 18, 19, 5, 17])) {
            return true;
        }

        return false;
    }

    /**
     * Determine whether the user can delete the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\Tecnoacademia  $tecnoacademia
     * @return mixed
     */
    public function delete(User $user, Tecnoacademia $tecnoacademia)
    {
        return false;
    }

    /**
     * Determine whether the user can restore the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\Tecnoacademia  $tecnoacademia
     * @return mixed
     */
    public function restore(User $user, Tecnoacademia $tecnoacademia)
    {
        //
    }

    /**
     * Determine whether the user can permanently delete the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\Tecnoacademia  $tecnoacademia
     * @return mixed
     */
    public function forceDelete(User $user, Tecnoacademia $tecnoacademia)
    {
        //
    }
}
