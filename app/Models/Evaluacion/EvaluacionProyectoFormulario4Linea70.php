<?php

namespace App\Models\Evaluacion;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EvaluacionProyectoFormulario4Linea70 extends Model
{
    use HasFactory;

    /**
     * table
     *
     * @var string
     */
    protected $table = 'evaluaciones_proyectos_linea_70';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'resumen_regional_comentario',
        'antecedentes_tecnoacademia_comentario',
        'retos_oportunidades_comentario',
        'metodologia_comentario',
        'lineas_medulares_centro_comentario',
        'lineas_tecnologicas_centro_comentario',
        'articulacion_sennova_comentario',
        'municipios_comentario',
        'instituciones_comentario',
        'fecha_ejecucion_comentario',
        'cadena_valor_comentario',
        'analisis_riesgos_comentario',
        'anexos_comentario',
        'proyectos_macro_comentario',
        'bibliografia_comentario',
        'productos_comentario',
        'entidad_aliada_comentario',
        'edt_comentario',
        'articulacion_centro_formacion_comentario',
        'proyecto_presupuesto_comentario',
        'ortografia_comentario',
        'redaccion_comentario',
        'normas_apa_comentario',
        'impacto_centro_formacion_comentario'
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
    public function scopeFilterEvaluacionProyectoFormulario4Linea70($query, array $filters)
    {
        $query->when($filters['search'] ?? null, function ($query, $search) {
            $search = str_replace('"', "", $search);
            $search = str_replace("'", "", $search);
            $search = str_replace(' ', '%%', $search);
            $query->whereRaw("unaccent(resumen) ilike unaccent('%" . $search . "%')");
        });
    }
}
