<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TopePresupuestalFormulario7 extends Model
{
    use HasFactory;

    /**
     * table
     *
     * @var string
     */
    protected $table = 'topes_presupuestales_formulario_7_concepto_sena';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'convocatoria_id',
        'segundo_grupo_presupuestal_id',
        'valor',
        'porcentaje'
    ];

    /**
     * Relationship with SegundoGrupoPresupuestal
     *
     * @return object
     */
    public function segundoGrupoPresupuestal()
    {
        return $this->belongsTo(SegundoGrupoPresupuestal::class);
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
}
