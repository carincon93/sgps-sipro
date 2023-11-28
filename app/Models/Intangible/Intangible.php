<?php

namespace App\Models\Intangible;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Intangible extends Model
{
    use HasFactory;

    /**
     * table
     *
     * @var string
     */
    protected $table = 'intangibles_sennova';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'codigo_intangible',
        'fecha_cierre_vigencia',
        'fecha_cierre_vigencia_presupuestal',
        'tipo_intangible',
        'clase_intangible',
        'nombre_intangible',
        'recurso_controlado',
        'observacion_recurso',
        'potencial_servicios',
        'observacion_potencial_servicios',
        'fiabilidad',
        'observacion_fiabilidad',
        'identificar',
        'observacion_identificar',
        'monetario',
        'observacion_monetario',
        'apariencia_fisica',
        'observacion_apariencia_fisica',
        'uso_mas_vigencias',
        'observacion_uso_vigencias',
        'actividades_entidad',
        'observacion_actividades_entidad',
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
     * Filtrar registros
     *
     * @param  mixed $query
     * @param  mixed $filters
     * @return void
     */
    public function scopeFilterIntangible($query, array $filters)
    {
        $query->when($filters['search'] ?? null, function ($query, $search) {
            $search = str_replace('"', "", $search);
            $search = str_replace("'", "", $search);
            $search = str_replace(' ', '%%', $search);
            $query->whereRaw("unaccent(nombre_intangible) ilike unaccent('%" . $search . "%')");
            $query->orWhere('codigo_intangible', 'ilike', '%' . $search . '%');
        });
    }

    /**
     * getUpdatedAtAttribute
     *
     * @return void
     */
    public function getUpdatedAtAttribute($value)
    {
        return "Última modificación de este formulario: " . Carbon::parse($value, 'UTC')->timezone('America/Bogota')->locale('es')->isoFormat('DD [de] MMMM [de] YYYY [a las] HH:mm:ss');
    }

    public function getNombreAttribute($value)
    {
        return ucfirst($value);
    }
}
