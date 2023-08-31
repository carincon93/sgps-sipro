<?php

namespace App\Policies;

use App\Models\CentroFormacion;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class CentroFormacionPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        if ($user->hasRole([2, 4, 21, 17, 18, 20, 19, 5])) {
            return true;
        }

        return false;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, CentroFormacion $centroFormacion): bool
    {
        return false;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return false;
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, CentroFormacion $centroFormacion): bool
    {
        if ($user->dinamizadorCentroFormacion && $user->dinamizadorCentroFormacion->id == $centroFormacion->id ) {
            return true;
        }

        return false;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, CentroFormacion $centroFormacion): bool
    {
        return false;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, CentroFormacion $centroFormacion): bool
    {
        //
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, CentroFormacion $centroFormacion): bool
    {
        //
    }
}
