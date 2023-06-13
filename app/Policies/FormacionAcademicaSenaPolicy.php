<?php

namespace App\Policies;

use App\Models\Perfil\FormacionAcademicaSena;
use Illuminate\Auth\Access\HandlesAuthorization;
use App\Models\User;

class FormacionAcademicaSenaPolicy
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
     * @param  \App\Models\FormacionAcademicaSena  $formacionAcademicaSena
     * @return mixed
     */
    public function view(User $user, FormacionAcademicaSena $formacionAcademicaSena)
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
     * @param  \App\Models\FormacionAcademicaSena  $formacionAcademicaSena
     * @return mixed
     */
    public function update(User $user, FormacionAcademicaSena $formacionAcademicaSena)
    {
        if ( $user->id == $formacionAcademicaSena->user_id ) {
            return true;
        }
    }

    /**
     * Determine whether the user can delete the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\FormacionAcademicaSena  $formacionAcademicaSena
     * @return mixed
     */
    public function delete(User $user, FormacionAcademicaSena $formacionAcademicaSena)
    {
        if ( $user->id == $formacionAcademicaSena->user_id ) {
            return true;
        }
    }

    /**
     * Determine whether the user can restore the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\FormacionAcademicaSena  $formacionAcademicaSena
     * @return mixed
     */
    public function restore(User $user, FormacionAcademicaSena $formacionAcademicaSena)
    {
        //
    }

    /**
     * Determine whether the user can permanently delete the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\FormacionAcademicaSena  $formacionAcademicaSena
     * @return mixed
     */
    public function forceDelete(User $user, FormacionAcademicaSena $formacionAcademicaSena)
    {
        //
    }
}
