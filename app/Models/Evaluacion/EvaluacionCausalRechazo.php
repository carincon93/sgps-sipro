<?php

namespace App\Models\Evaluacion;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EvaluacionCausalRechazo extends Model
{
    use HasFactory;

    /**
     * table
     *
     * @var string
     */
    protected $table = 'evaluacion_causales_rechazo';

    /**
     * appends
     *
     * @var array
     */
    protected $appends = ['causal_rechazo_formateado'];

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'evaluacion_id',
        'causal_rechazo'
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
     * @return void
     */
    public function evaluacion()
    {
        return $this->belongsTo(Evaluacion::class);
    }

    /**
     * Filtrar registros
     *
     * @param  mixed $query
     * @param  mixed $filters
     * @return void
     */
    public function scopeFilterEvaluacionCausalRechazo($query, array $filters)
    {
        $query->when($filters['search'] ?? null, function ($query, $search) {
            $query->where('id', 'ilike', '%' . $search . '%');
        });
    }

    /**
     * getCausalRechazoFormateadoAttribute
     *
     * @return void
     */
    public function getCausalRechazoFormateadoAttribute()
    {
        switch ($this->causal_rechazo) {
            case '1':
                return 'El proyecto se inscribe en alguna de las líneas de la Estrategia Regional, pero su formulación obedece a los objetivos de otra línea. Ejemplo: se formula un proyecto de la Estrategia Regional con el objeto de modernizar un ambiente de formación y se verifica que el proyecto se enfoca en la prestación de nuevos servicios tecnológicos.';
                break;
            case '2':
                return 'En la formulación del proyecto se consideran como actividades principales y no como productos resultados de investigación, la realización de actividades de divulgación tecnológica como congresos, simposios, semanarios, entre otros.';
                break;
            case '3':
                return 'Se verifique que el proyecto y sus productos resultados de investigación sean parte de una tesis doctoral, de maestría o de pregrado.';
                break;
            case '4':
                return 'Se verifique una posible vulneración de los derechos de uno o varios autores que debe ser validada por la Coordinación SENNOVA.';
                break;
            default:
                # code...
                break;
        }
    }
}
