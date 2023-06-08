<?php

namespace App\Policies;

use Illuminate\Auth\Access\HandlesAuthorization;
use App\Models\ProyectoIdiTecnoacademia;
use App\Models\User;

class ProyectoIdiTecnoacademiaPolicy
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
        if ($user->hasRole([5, 10, 12, 22])) {
            return true;
        }

        return false;
    }

    /**
     * Determine whether the user can view the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\ProyectoIdiTecnoacademia  $proyectoIdiTecnoacademia
     * @return mixed
     */
    public function view(User $user, ProyectoIdiTecnoacademia $proyectoIdiTecnoacademia)
    {
        if ($user->hasRole([5, 10, 12, 22])) {
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
        if ($user->hasRole([5, 10, 12, 22])) {
            return true;
        }

        return false;
    }

    /**
     * Determine whether the user can update the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\ProyectoIdiTecnoacademia  $proyectoIdiTecnoacademia
     * @return mixed
     */
    public function update(User $user, ProyectoIdiTecnoacademia $proyectoIdiTecnoacademia)
    {
        if ($user->hasRole([5, 10, 12, 22]) && $proyectoIdiTecnoacademia->participantes()->where('user_id', $user->id)->where('autor_principal', true)->exists()) {
            return true;
        }

        return false;
    }

    /**
     * Determine whether the user can delete the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\ProyectoIdiTecnoacademia  $proyectoIdiTecnoacademia
     * @return mixed
     */
    public function delete(User $user, ProyectoIdiTecnoacademia $proyectoIdiTecnoacademia)
    {
        if ($user->hasRole([5, 10, 12, 22]) && $proyectoIdiTecnoacademia->participantes()->where('user_id', $user->id)->where('autor_principal', true)->exists()) {
            return true;
        }

        return false;
    }

    /**
     * Determine whether the user can restore the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\ProyectoIdiTecnoacademia  $proyectoIdiTecnoacademia
     * @return mixed
     */
    public function restore(User $user, ProyectoIdiTecnoacademia $proyectoIdiTecnoacademia)
    {
        //
    }

    /**
     * Determine whether the user can permanently delete the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\ProyectoIdiTecnoacademia  $proyectoIdiTecnoacademia
     * @return mixed
     */
    public function forceDelete(User $user, ProyectoIdiTecnoacademia $proyectoIdiTecnoacademia)
    {
        //
    }
}
