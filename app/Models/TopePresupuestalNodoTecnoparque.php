<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TopePresupuestalNodoTecnoparque extends Model
{
    use HasFactory;

    /**
     * table
     *
     * @var string
     */
    protected $table = 'topes_presupuestales_nodos_tecnoparque';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'convocatoria_id',
        'nodo_tecnoparque_id',
        'valor'
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
     * Relationship with Convocatoria
     *
     * @return object
     */
    public function convocatoria()
    {
        return $this->belongsTo(Convocatoria::class);
    }

    /**
     * Relationship with SegundoGrupoPresupuestal
     *
     * @return object
     */
    public function segundoGrupoPresupuestal()
    {
        return $this->belongsToMany(SegundoGrupoPresupuestal::class, 'topes_presupuestales_tecnoparque_conceptos_sena', 'tope_presupuestal_nodo_tecnoparque_id', 'segundo_grupo_presupuestal_id');
    }
}

