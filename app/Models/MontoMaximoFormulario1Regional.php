<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MontoMaximoFormulario1Regional extends Model
{
    use HasFactory;

    /**
     * table
     *
     * @var string
     */
    protected $table = 'monto_maximo_formulario_1_regional';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'regional_id',
        'convocatoria_tipo_formulario_id',
        'monto_maximo',
    ];

    /**
     * Relationship with Regional
     *
     * @return object
     */
    public function regional()
    {
        return $this->belongsTo(Regional::class);
    }

    /**
     * Relationship with ConvocatoriaTipoFormulario
     *
     * @return object
     */
    public function convocatoriaTipoFormulario()
    {
        return $this->belongsTo(ConvocatoriaTipoFormulario::class);
    }
}
