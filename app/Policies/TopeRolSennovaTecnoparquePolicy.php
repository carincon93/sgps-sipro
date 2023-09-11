<?php

namespace App\Policies;

use App\Models\TopeRolSennovaTecnoparque;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class TopeRolSennovaTecnoparquePolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        if ($user->hasRole([1, 17])) {
            return true;
        }

        return false;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, TopeRolSennovaTecnoparque $tope_rol_sennova_tecnoparque): bool
    {
        if ($user->hasRole([1, 17])) {
            return true;
        }

        return false;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        if ($user->hasRole([1, 17])) {
            return true;
        }

        return false;
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, TopeRolSennovaTecnoparque $tope_rol_sennova_tecnoparque): bool
    {
        if ($user->hasRole([1, 17])) {
            return true;
        }

        return false;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, TopeRolSennovaTecnoparque $tope_rol_sennova_tecnoparque): bool
    {
        if ($user->hasRole([1, 17])) {
            return true;
        }

        return false;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, TopeRolSennovaTecnoparque $tope_rol_sennova_tecnoparque): bool
    {
        //
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, TopeRolSennovaTecnoparque $tope_rol_sennova_tecnoparque): bool
    {
        //
    }
}
