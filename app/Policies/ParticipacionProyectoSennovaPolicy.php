<?php

namespace App\Policies;

use App\Models\Perfil\ParticipacionProyectoSennova;
use Illuminate\Auth\Access\HandlesAuthorization;
use App\Models\User;

class ParticipacionProyectoSennovaPolicy
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
     * @param  \App\Models\ParticipacionProyectoSennova  $participacionProyectoSennova
     * @return mixed
     */
    public function view(User $user, ParticipacionProyectoSennova $participacionProyectoSennova)
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
     * @param  \App\Models\ParticipacionProyectoSennova  $participacionProyectoSennova
     * @return mixed
     */
    public function update(User $user, ParticipacionProyectoSennova $participacionProyectoSennova)
    {
        if ( $user->id == $participacionProyectoSennova->user_id ) {
            return true;
        }
    }

    /**
     * Determine whether the user can delete the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\ParticipacionProyectoSennova  $participacionProyectoSennova
     * @return mixed
     */
    public function delete(User $user, ParticipacionProyectoSennova $participacionProyectoSennova)
    {
        if ( $user->id == $participacionProyectoSennova->user_id ) {
            return true;
        }
    }

    /**
     * Determine whether the user can restore the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\ParticipacionProyectoSennova  $participacionProyectoSennova
     * @return mixed
     */
    public function restore(User $user, ParticipacionProyectoSennova $participacionProyectoSennova)
    {
        //
    }

    /**
     * Determine whether the user can permanently delete the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\ParticipacionProyectoSennova  $participacionProyectoSennova
     * @return mixed
     */
    public function forceDelete(User $user, ParticipacionProyectoSennova $participacionProyectoSennova)
    {
        //
    }
}
