<?php

namespace App\Policies;

use App\Models\LineaTecnica;
use Illuminate\Auth\Access\HandlesAuthorization;
use App\Models\User;

class LineaTecnicaPolicy
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
        if ($user->hasRole([19])) {
            return true;
        }

        return false;
    }

    /**
     * Determine whether the user can view the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\LineaTecnica  $lineaTecnica
     * @return mixed
     */
    public function view(User $user, LineaTecnica $lineaTecnica)
    {
        if ($user->hasRole([19])) {
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
        if ($user->hasRole([19])) {
            return true;
        }

        return false;
    }

    /**
     * Determine whether the user can update the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\LineaTecnica  $lineaTecnica
     * @return mixed
     */
    public function update(User $user, LineaTecnica $lineaTecnica)
    {
        if ($user->hasRole([19])) {
            return true;
        }

        return false;
    }

    /**
     * Determine whether the user can delete the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\LineaTecnica  $lineaTecnica
     * @return mixed
     */
    public function delete(User $user, LineaTecnica $lineaTecnica)
    {
        if ($user->hasRole([19])) {
            return true;
        }

        return false;
    }

    /**
     * Determine whether the user can restore the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\LineaTecnica  $lineaTecnica
     * @return mixed
     */
    public function restore(User $user, LineaTecnica $lineaTecnica)
    {
        //
    }

    /**
     * Determine whether the user can permanently delete the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\LineaTecnica  $lineaTecnica
     * @return mixed
     */
    public function forceDelete(User $user, LineaTecnica $lineaTecnica)
    {
        //
    }
}
