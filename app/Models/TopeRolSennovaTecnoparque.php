<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TopeRolSennovaTecnoparque extends Model
{
    use HasFactory;

    /**
     * table
     *
     * @var string
     */
    protected $table = 'topes_roles_nodos_tecnoparque';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'nodo_tecnoparque_id',
        'convocatoria_rol_sennova_id',
        'cantidad_maxima'
    ];

    /**
     * Relationship with NodoTecnoparque
     *
     * @return object
     */
    public function nodoTecnoparque()
    {
        return $this->belongsTo(NodoTecnoparque::class);
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

