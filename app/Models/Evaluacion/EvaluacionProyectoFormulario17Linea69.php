<?php

namespace App\Models\Evaluacion;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;

class EvaluacionProyectoFormulario17Linea69 extends Model
{
    use HasFactory;

    /**
     * table
     *
     * @var string
     */
    protected $table = 'evaluaciones_proyectos_formulario_17_linea_69';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'pregunta_id',
        'evaluacion_id',
        'puntaje',
        'comentario'
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
     * Relationship with Evaluacion
     *
     * @return object
     */
    public function evaluacion()
    {
        return $this->belongsTo(Evaluacion::class, 'id');
    }

    /**
     * Relationship with PreguntaEvaluacionFormulario17Linea69
     *
     * @return object
     */
    public function preguntaEvaluacionFormulario17Linea69()
    {
        return $this->belongsTo(PreguntaEvaluacionFormulario17Linea69::class, 'pregunta_id');
    }

    /**
     * Filtrar registros
     *
     * @param  mixed $query
     * @param  mixed $filters
     * @return void
     */
    public function scopeFilterEvaluacionProyectoFormulario5Linea69($query, array $filters)
    {
        $query->when($filters['search'] ?? null, function ($query, $search) {
            $search = str_replace('"', "", $search);
            $search = str_replace("'", "", $search);
            $search = str_replace(' ', '%%', $search);
            $query->whereRaw("unaccent(resumen) ilike unaccent('%" . $search . "%')");
        });
    }
}
