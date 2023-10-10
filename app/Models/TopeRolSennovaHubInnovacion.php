<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TopeRolSennovaHubInnovacion extends Model
{
    use HasFactory;

    /**
     * table
     *
     * @var string
     */
    protected $table = 'topes_roles_hubs_innovacion';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'hub_innovacion_id',
        'convocatoria_rol_sennova_id',
        'cantidad_maxima',
        'meses_maximos'
    ];

    /**
     * Relationship with HubInnovacion
     *
     * @return object
     */
    public function hubInnovacion()
    {
        return $this->belongsTo(HubInnovacion::class);
    }

    /**
     * Relationship with ConvocatoriaRolSennova
     *
     * @return object
     */
    public function convocatoriaRolSennova()
    {
        return $this->belongsTo(ConvocatoriaRolSennova::class);
    }
}
