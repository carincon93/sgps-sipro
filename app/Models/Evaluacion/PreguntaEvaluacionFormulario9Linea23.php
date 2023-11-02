<?php

namespace App\Models\Evaluacion;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PreguntaEvaluacionFormulario9Linea23 extends Model
{
    use HasFactory;

    /**
     * table
     *
     * @var string
     */
    protected $table = 'preguntas_evaluacion_formulario_9_linea_23';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'campo',
        'criterio',
        'puntaje_maximo',
        'convocatorias_id'
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
     * Relationship with EvaluacionProyectoFormulario9Linea23
     *
     * @return object
     */
    public function evaluacionesProyectoFormulario9Linea23()
    {
        return $this->hasMany(EvaluacionProyectoFormulario9Linea23::class);
    }

    public function getConvocatoriasIdAttribute($value)
    {
        return json_decode($value);
    }
}
