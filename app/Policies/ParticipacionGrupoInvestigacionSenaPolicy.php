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
     * @param  \App\Models\ParticipacionGrupoInvestigacionSena  $participacion_grupo_investigacion_sena
     * @return mixed
     */
    public function view(User $user, ParticipacionGrupoInvestigacionSena $participacion_grupo_investigacion_sena)
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
     * @param  \App\Models\ParticipacionGrupoInvestigacionSena  $participacion_grupo_investigacion_sena
     * @return mixed
     */
    public function update(User $user, ParticipacionGrupoInvestigacionSena $participacion_grupo_investigacion_sena)
    {
        if ( $user->id == $participacion_grupo_investigacion_sena->user_id || $user->dinamizadorCentroFormacion && $user->dinamizadorCentroFormacion->id == $participacion_grupo_investigacion_sena->user->centroFormacion->id ) {
            return true;
        }
    }

    /**
     * Determine whether the user can delete the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\ParticipacionGrupoInvestigacionSena  $participacion_grupo_investigacion_sena
     * @return mixed
     */
    public function delete(User $user, ParticipacionGrupoInvestigacionSena $participacion_grupo_investigacion_sena)
    {
        if ( $user->id == $participacion_grupo_investigacion_sena->user_id ) {
            return true;
        }
    }

    /**
     * Determine whether the user can restore the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\ParticipacionGrupoInvestigacionSena  $participacion_grupo_investigacion_sena
     * @return mixed
     */
    public function restore(User $user, ParticipacionGrupoInvestigacionSena $participacion_grupo_investigacion_sena)
    {
        //
    }

    /**
     * Determine whether the user can permanently delete the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\ParticipacionGrupoInvestigacionSena  $participacion_grupo_investigacion_sena
     * @return mixed
     */
    public function forceDelete(User $user, ParticipacionGrupoInvestigacionSena $participacion_grupo_investigacion_sena)
    {
        //
    }
}
