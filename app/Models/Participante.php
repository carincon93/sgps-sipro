<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Relations\Pivot;

class Participante extends Pivot
{
    /**
     * table
     *
     * @var string
     */
    protected $table = 'proyecto_participantes';

    /**
     * appneds
     *
     * @var array
     */
    protected $appneds = ['rol_sennova_participante'];

    protected $fillable = [
        'proyecto_id',
        'user_id',
        'cantidad_meses',
        'cantidad_horas',
        'rol_id'
    ];

    /**
     * Relationship with User
     *
     * @return object
     */
    public function participante()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Relationship with Proyecto
     *
     * @return object
     */
    public function proyecto()
    {
        return $this->belongsTo(Proyecto::class);
    }

    /**
     * Relationship with Role
     *
     * @return object
     */
    public function rol()
    {
        return $this->belongsTo(Role::class);
    }

    /**
     * getUpdatedAtAttribute
     *
     * @return void
     */
    public function getUpdatedAtAttribute($value)
    {
        return "Última modificación de este formulario: " . Carbon::parse($value, 'UTC')->timezone('America/Bogota')->locale('es')->isoFormat('DD [de] MMMM [de] YYYY [a las] HH:mm:ss');
    }
}
