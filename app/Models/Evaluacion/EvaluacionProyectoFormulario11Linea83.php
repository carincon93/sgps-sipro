<?php

namespace App\Models\Evaluacion;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;

class EvaluacionProyectoFormulario11Linea83 extends Model
{
    use HasFactory;

    /**
     * table
     *
     * @var string
     */
    protected $table = 'evaluaciones_proyectos_linea_83';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'resumen_regional_comentario',
        'antecedentes_regional_comentario',
        'municipios_comentario',
        'fecha_ejecucion_comentario',
        'cadena_valor_comentario',
        'impacto_centro_formacion_comentario',
        'bibliografia_comentario',
        'retos_oportunidades_comentario',
        'pertinencia_territorio_comentario',
        'metodologia_comentario',
        'analisis_riesgos_comentario',
        'anexos_comentario',
        'productos_comentario',
        'arbol_problemas_comentario',
        'arbol_objetivos_comentario',
        'ortografia_comentario',
        'proyecto_presupuesto_comentario',
        'redaccion_comentario',
        'normas_apa_comentario',
        'articulacion_sennova_comentario'
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
     * Filtrar registros
     *
     * @param  mixed $query
     * @param  mixed $filters
     * @return void
     */
    public function scopeFilterEvaluacionProyectoFormulario11Linea83($query, array $filters)
    {
        $query->when($filters['search'] ?? null, function ($query, $search) {
            $search = str_replace('"', "", $search);
            $search = str_replace("'", "", $search);
            $search = str_replace(' ', '%%', $search);
            $query->whereRaw("unaccent(resumen) ilike unaccent('%" . $search . "%')");
        });
    }
}
