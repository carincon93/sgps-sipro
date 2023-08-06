<?php

namespace App\Policies;

use App\Models\ConvocatoriaRolSennova;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class ConvocatoriaRolSennovaPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        if ($user->hasRole([1, 20, 18, 19, 5, 17])) {
            return true;
        }

        return false;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, ConvocatoriaRolSennova $convocatoria_rol_sennova): bool
    {
        if ($user->hasRole([1, 20, 18, 19, 5, 17])) {
            return true;
        }

        return false;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        if ($user->hasRole([1, 20, 18, 19, 5, 17])) {
            return true;
        }

        return false;
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, ConvocatoriaRolSennova $convocatoria_rol_sennova): bool
    {
        if ($user->hasRole([1, 20, 18, 19, 5, 17])) {
            return true;
        }

        return false;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, ConvocatoriaRolSennova $convocatoria_rol_sennova): bool
    {
        if ($user->hasRole([1, 20, 18, 19, 5, 17])) {
            return true;
        }

        return false;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, ConvocatoriaRolSennova $convocatoria_rol_sennova): bool
    {
        //
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, ConvocatoriaRolSennova $convocatoria_rol_sennova): bool
    {
        //
    }
}
