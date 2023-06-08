<?php

namespace App\Policies;

use Illuminate\Auth\Access\HandlesAuthorization;
use App\Models\SemilleroInvestigacion;
use App\Models\User;

class SemilleroInvestigacionPolicy
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
        // if ($user->hasRole([4, 21, 20, 18, 19, 5, 17])) {
        //     return true;
        // }

        return true;
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
        // if ($user->hasRole([4, 21, 20, 18, 19, 5, 17])) {
        //     return true;
        // }

        return true;
    }

    /**
     * Determine whether the user can create models.
     *
     * @param  \App\Models\User  $user
     * @return mixed
     */
    public function create(User $user)
    {
        if ($user->hasRole([4, 21, 20, 18, 19, 5, 17, 27, 27])) {
            return true;
        }

        return false;
    }

    /**
     * Determine whether the user can update the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\SemilleroInvestigacion  $semilleroInvestigacion
     * @return mixed
     */
    public function update(User $user, SemilleroInvestigacion $semilleroInvestigacion)
    {
        if ($user->hasRole([20, 18, 19, 5, 17]) || $user->hasRole(4) && $semilleroInvestigacion->lineaInvestigacion()->exists() && $user->dinamizadorCentroFormacion->id == $semilleroInvestigacion->lineaInvestigacion->grupoInvestigacion->centroFormacion->id || $user->hasRole(21) && $semilleroInvestigacion->lineaInvestigacion()->exists() && $user->centroFormacion->id == $semilleroInvestigacion->lineaInvestigacion->grupoInvestigacion->centroFormacion->id || $user->hasRole(27) && $semilleroInvestigacion->lineaInvestigacion()->exists() && $user->centro_formacion_id == $semilleroInvestigacion->lineaInvestigacion->grupoInvestigacion->centroFormacion->id) {
            return true;
        }

        return false;
    }

    /**
     * Determine whether the user can delete the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\SemilleroInvestigacion  $semilleroInvestigacion
     * @return mixed
     */
    public function delete(User $user, SemilleroInvestigacion $semilleroInvestigacion)
    {
        if ($user->hasRole([4, 21, 20, 18, 19, 5, 17, 27, 27])) {
            return true;
        }

        return false;
    }

    /**
     * Determine whether the user can restore the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\SemilleroInvestigacion  $semilleroInvestigacion
     * @return mixed
     */
    public function restore(User $user, SemilleroInvestigacion $semilleroInvestigacion)
    {
        //
    }

    /**
     * Determine whether the user can permanently delete the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\SemilleroInvestigacion  $semilleroInvestigacion
     * @return mixed
     */
    public function forceDelete(User $user, SemilleroInvestigacion $semilleroInvestigacion)
    {
        //
    }
}
