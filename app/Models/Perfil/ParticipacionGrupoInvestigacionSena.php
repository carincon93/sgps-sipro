<?php

namespace App\Models\Perfil;

use App\Models\GrupoInvestigacion;
use App\Models\SemilleroInvestigacion;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ParticipacionGrupoInvestigacionSena extends Model
{
    use HasFactory;

    /**
     * table
     *
     * @var string
     */
    protected $table = 'participaciones_grupos_investigacion_sena';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'pertenece_grupo_investigacion_centro',
        'pertenece_semillero_investigacion_centro',
        'grupo_investigacion_id',
        'semillero_investigacion_id',
        'user_id'
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        //
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        //
    ];

    /**
     * Relationship with User
     *
     * @return object
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Relationship with GrupoInvestigacion
     *
     * @return object
     */
    public function grupoInvestigacion()
    {
        return $this->belongsTo(GrupoInvestigacion::class);
    }

    /**
     * Relationship with SemilleroInvestigacion
     *
     * @return object
     */
    public function semilleroInvestigacion()
    {
        return $this->belongsTo(SemilleroInvestigacion::class);
    }
}
