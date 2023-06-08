<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TipoProyectoSt extends Model
{
    use HasFactory;

    /**
     * table
     *
     * @var string
     */
    protected $table = 'tipos_proyecto_st';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'centro_formacion_id',
        'tipologia',
        'subclasificacion',
        'linea_tecnica_id',
        'tipo_proyecto',
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
     * Relationship with CentroFormacion
     *
     * @return void
     */
    public function centroFormacion()
    {
        return $this->belongsTo(CentroFormacion::class);
    }

    /**
     * Relationship with LineaTecnica
     *
     * @return void
     */
    public function lineaTecnica()
    {
        return $this->belongsTo(LineaTecnica::class);
    }

    /**
     * Relationship with ServicioTecnologico
     *
     * @return object
     */
    public function serviciosTecnologicos()
    {
        return $this->hasMany(ServicioTecnologico::class);
    }

    /**
     * Relationship with ReglaRolSt
     *
     * @return object
     */
    public function reglasRolesSt()
    {
        return $this->hasMany(ReglaRolSt::class);
    }

    /**
     * Filtrar registros
     *
     * @param  mixed $query
     * @param  mixed $filters
     * @return void
     */
    public function scopeFilterTipoProyectoSt($query, array $filters)
    {
        $query->when($filters['search'] ?? null, function ($query, $search) {
            $query->where('tipologia', 'ilike', '%' . $search . '%');
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
}
