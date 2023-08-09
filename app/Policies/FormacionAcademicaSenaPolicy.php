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
     * @param  \App\Models\FormacionAcademicaSena  $formacion_academica_sena
     * @return mixed
     */
    public function view(User $user, FormacionAcademicaSena $formacion_academica_sena)
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
     * @param  \App\Models\FormacionAcademicaSena  $formacion_academica_sena
     * @return mixed
     */
    public function update(User $user, FormacionAcademicaSena $formacion_academica_sena)
    {
        if ( $user->id == $formacion_academica_sena->user_id || $user->dinamizadorCentroFormacion && $user->dinamizadorCentroFormacion->id == $formacion_academica_sena->user->centroFormacion->id ) {
            return true;
        }
    }

    /**
     * Determine whether the user can delete the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\FormacionAcademicaSena  $formacion_academica_sena
     * @return mixed
     */
    public function delete(User $user, FormacionAcademicaSena $formacion_academica_sena)
    {
        if ( $user->id == $formacion_academica_sena->user_id || $user->dinamizadorCentroFormacion && $user->dinamizadorCentroFormacion->id == $formacion_academica_sena->user->centroFormacion->id ) {
            return true;
        }
    }

    /**
     * Determine whether the user can restore the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\FormacionAcademicaSena  $formacion_academica_sena
     * @return mixed
     */
    public function restore(User $user, FormacionAcademicaSena $formacion_academica_sena)
    {
        //
    }

    /**
     * Determine whether the user can permanently delete the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\FormacionAcademicaSena  $formacion_academica_sena
     * @return mixed
     */
    public function forceDelete(User $user, FormacionAcademicaSena $formacion_academica_sena)
    {
        //
    }
}
