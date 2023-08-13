<?php

namespace App\Models\ProyectoConvocatoria;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AreaTematicaEni extends Model
{
    use HasFactory;

    /**
     * table
     *
     * @var string
     */
    protected $table = 'areas_tematicas_eni';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'nombre'
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
     * Relationship with ProyectoFormulario8Linea66
     *
     * @return object
     */
    public function proyectos()
    {
        return $this->belongsToMany(ProyectoFormulario8Linea66::class, 'proyecto_linea_66_areas_tematicas_eni', 'area_tematica_eni_id', 'proyecto_linea_66_id');
    }

    /**
     * Filtrar registros
     *
     * @param  mixed $query
     * @param  mixed $filters
     * @return void
     */
    public function scopeFilterAreaTematicaEni($query, array $filters)
    {
        $query->when($filters['search'] ?? null, function ($query, $search) {
            $query->where('nombre', 'ilike', '%' . $search . '%');
        });
    }
}
