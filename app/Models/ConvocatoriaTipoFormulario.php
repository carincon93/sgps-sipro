<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ConvocatoriaTipoFormulario extends Model
{
    use HasFactory;

    /**
     * table
     *
     * @var string
     */
    protected $table = 'convocatoria_tipos_formularios';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'convocatoria_id',
        'tipo_formulario_convocatoria_id',
    ];

    /**
     * Relationship with MontoMaximoFormulario1Regional
     *
     * @return object
     */
    public function montosMaximosFormulario1()
    {
        return $this->hasMany(MontoMaximoFormulario1Regional::class);
    }
}
