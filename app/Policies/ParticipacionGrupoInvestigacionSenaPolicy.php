<?php

namespace App\Policies;

use App\Models\Perfil\ParticipacionGrupoInvestigacionSena;
use Illuminate\Auth\Access\HandlesAuthorization;
use App\Models\User;

class ParticipacionGrupoInvestigacionSenaPolicy
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
     * @param  \App\Models\ParticipacionGrupoInvestigacionSena  $participacionGrupoInvestigacionSena
     * @return mixed
     */
    public function view(User $user, ParticipacionGrupoInvestigacionSena $participacionGrupoInvestigacionSena)
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
     * @param  \App\Models\ParticipacionGrupoInvestigacionSena  $participacionGrupoInvestigacionSena
     * @return mixed
     */
    public function update(User $user, ParticipacionGrupoInvestigacionSena $participacionGrupoInvestigacionSena)
    {
        if ( $user->id == $participacionGrupoInvestigacionSena->user_id ) {
            return true;
        }
    }

    /**
     * Determine whether the user can delete the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\ParticipacionGrupoInvestigacionSena  $participacionGrupoInvestigacionSena
     * @return mixed
     */
    public function delete(User $user, ParticipacionGrupoInvestigacionSena $participacionGrupoInvestigacionSena)
    {
        if ( $user->id == $participacionGrupoInvestigacionSena->user_id ) {
            return true;
        }
    }

    /**
     * Determine whether the user can restore the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\ParticipacionGrupoInvestigacionSena  $participacionGrupoInvestigacionSena
     * @return mixed
     */
    public function restore(User $user, ParticipacionGrupoInvestigacionSena $participacionGrupoInvestigacionSena)
    {
        //
    }

    /**
     * Determine whether the user can permanently delete the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\ParticipacionGrupoInvestigacionSena  $participacionGrupoInvestigacionSena
     * @return mixed
     */
    public function forceDelete(User $user, ParticipacionGrupoInvestigacionSena $participacionGrupoInvestigacionSena)
    {
        //
    }
}
