<?php

namespace App\Policies;

use App\Models\Perfil\EstudioAcademico;
use Illuminate\Auth\Access\HandlesAuthorization;
use App\Models\User;

class EstudioAcademicoPolicy
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
        // 
    }

    /**
     * Determine whether the user can view the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\EstudioAcademico  $estudioAcademico
     * @return mixed
     */
    public function view(User $user, EstudioAcademico $estudioAcademico)
    {
        // 
    }

    /**
     * Determine whether the user can create models.
     *
     * @param  \App\Models\User  $user
     * @return mixed
     */
    public function create(User $user)
    {
        return true;
    }

    /**
     * Determine whether the user can update the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\EstudioAcademico  $estudioAcademico
     * @return mixed
     */
    public function update(User $user, EstudioAcademico $estudioAcademico)
    {
        if ( $user->id == $estudioAcademico->user_id ) {
            return true;
        }

        return false;
    }

    /**
     * Determine whether the user can delete the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\EstudioAcademico  $estudioAcademico
     * @return mixed
     */
    public function delete(User $user, EstudioAcademico $estudioAcademico)
    {
        if ( $user->id == $estudioAcademico->user_id ) {
            return true;
        }

        return false;
    }

    /**
     * Determine whether the user can restore the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\EstudioAcademico  $estudioAcademico
     * @return mixed
     */
    public function restore(User $user, EstudioAcademico $estudioAcademico)
    {
        //
    }

    /**
     * Determine whether the user can permanently delete the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\EstudioAcademico  $estudioAcademico
     * @return mixed
     */
    public function forceDelete(User $user, EstudioAcademico $estudioAcademico)
    {
        //
    }
}
