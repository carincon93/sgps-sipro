<?php

namespace App\Policies;

use App\Models\HubInnovacion;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class HubInnovacionPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        if ($user->hasRole([21, 18, 19, 5, 17])) {
            return true;
        }

        return false;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, HubInnovacion $hubInnovacion): bool
    {
        if ($user->hasRole([21, 18, 19, 5, 17])) {
            return true;
        }

        return false;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        if ($user->hasRole([21, 18, 19, 5, 17])) {
            return true;
        }

        return false;
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, HubInnovacion $hubInnovacion): bool
    {
        if ($user->hasRole([21, 18, 19, 5, 17])) {
            return true;
        }

        return false;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, HubInnovacion $hubInnovacion): bool
    {
        if ($user->hasRole([21, 18, 19, 5, 17])) {
            return true;
        }

        return false;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, HubInnovacion $hubInnovacion): bool
    {
        //
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, HubInnovacion $hubInnovacion): bool
    {
        //
    }
}
