<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CodigoProyectoSgps extends Model
{
    use HasFactory;

    /**
     * table
     *
     * @var string
     */
    protected $table = 'codigos_proyectos_sgps';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'codigo_sgps',
        'year_ejecucion',
        'centro_formacion_id',
        'linea_programatica_id',
        'titulo'
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
     * Relationship with LineaProgramatica
     *
     * @return void
     */
    public function lineaProgramatica()
    {
        return $this->belongsTo(LineaProgramatica::class);
    }

    /**
     * Relationship with SeguimientoAmbienteModernizacion
     *
     * @return object
     */
    public function seguimientosAmbienteModernizacion()
    {
        return $this->hasMany(SeguimientoAmbienteModernizacion::class);
    }

    /**
     * Relationship with AmbienteModernizacion
     *
     * @return object
     */
    public function ambientesModernizacionCod()
    {
        return $this->belongsToMany(AmbienteModernizacion::class, 'ambiente_modernizacion_cod_proyectos', 'codigo_proyecto_sgps_id', 'ambiente_modernizacion_id');
    }

    /**
     * Relationship with AmbienteModernizacion
     *
     * @return object
     */
    public function ambientesModernizacionCodBeneficiados()
    {
        return $this->belongsToMany(AmbienteModernizacion::class, 'ambiente_modernizacion_cod_proyectos_beneficiados', 'codigo_proyecto_sgps_id', 'ambiente_modernizacion_id');
    }

    /**
     * Filtrar registros
     *
     * @param  mixed $query
     * @param  mixed $filters
     * @return void
     */
    public function scopeFilterCodigoProyectoSgps($query, array $filters)
    {
        $query->when($filters['search'] ?? null, function ($query, $search) {
            $query->where('titulo', 'ilike', '%' . $search . '%');
        });
    }

    /**
     * getUpdatedAtAttribute
     *
     * @return void
     */
    public function getUpdatedAtAttribute($value)
    {
        return "Última modificación de este formulario: " . Carbon::parse($value, 'UTC')->timezone('America/Bogota')->timezone('America/Bogota')->locale('es')->isoFormat('DD [de] MMMM [de] YYYY [a las] HH:mm:ss');
    }
}
