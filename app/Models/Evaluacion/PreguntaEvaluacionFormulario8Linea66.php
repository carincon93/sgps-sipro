<?php

namespace App\Models\Evaluacion;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PreguntaEvaluacionFormulario8Linea66 extends Model
{
    use HasFactory;

    /**
     * table
     *
     * @var string
     */
    protected $table = 'preguntas_evaluacion_formulario_8_linea_66';

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
     * Relationship with EvaluacionProyectoFormulario8Linea66
     *
     * @return object
     */
    public function evaluacionesProyectoFormulario8Linea66()
    {
        return $this->hasMany(EvaluacionProyectoFormulario8Linea66::class);
    }

    public function getConvocatoriasIdAttribute($value)
    {
        return json_decode($value);
    }
}
