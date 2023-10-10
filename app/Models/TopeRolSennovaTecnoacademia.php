<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TopeRolSennovaTecnoacademia extends Model
{
    use HasFactory;

    /**
     * table
     *
     * @var string
     */
    protected $table = 'topes_roles_tecnoacademias';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'tecnoacademia_id',
        'convocatoria_rol_sennova_id',
        'cantidad_maxima',
        'meses_maximos'
    ];

    /**
     * Relationship with Tecnoacademia
     *
     * @return object
     */
    public function tecnoacademia()
    {
        return $this->belongsTo(Tecnoacademia::class);
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
