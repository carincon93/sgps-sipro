<?php

namespace App\Models\Evaluacion;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PreguntaEvaluacionFormulario4Linea70 extends Model
{
    use HasFactory;

    /**
     * table
     *
     * @var string
     */
    protected $table = 'preguntas_evaluacion_formulario_4_linea_70';

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
     * Relationship with EvaluacionProyectoFormulario4Linea70
     *
     * @return object
     */
    public function evaluacionesProyectoFormulario4Linea70()
    {
        return $this->hasMany(EvaluacionProyectoFormulario4Linea70::class);
    }

    public function getConvocatoriasIdAttribute($value)
    {
        return json_decode($value);
    }
}
