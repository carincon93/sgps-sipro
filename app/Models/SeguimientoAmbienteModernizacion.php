<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SeguimientoAmbienteModernizacion extends Model
{
    use HasFactory;

    /**
     * table
     *
     * @var string
     */
    protected $table = 'seguimientos_ambiente_modernizacion';

    /**
     * appends
     *
     * @var array
     */
    protected $appends = ['codigo'];

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'centro_formacion_id',
        'codigo_proyecto_sgps_id',
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
     * Relationship with centroFormacion
     *
     * @return object
     */
    public function centroFormacion()
    {
        return $this->belongsTo(CentroFormacion::class);
    }

    /**
     * Relationship with CodigoProyectoSgps
     *
     * @return object
     */
    public function codigoProyectoSgps()
    {
        return $this->belongsTo(CodigoProyectoSgps::class);
    }

    /**
     * Relationship with AmbienteModernizacion
     *
     * @return object
     */
    public function ambientesModernizacion()
    {
        return $this->hasMany(AmbienteModernizacion::class)->orderBy('created_at', 'DESC');
    }

    /**
     * Filtrar registros
     *
     * @param  mixed $query
     * @param  mixed $filters
     * @return void
     */
    public function scopeFilterSeguimientoAmbienteModernizacion($query, array $filters)
    {
        $query->when($filters['search'] ?? null, function ($query, $search) {
            $query->where('centro_formacion_id', 'ilike', '%' . $search . '%');
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

    /**
     * Get codigo e.g. SAMS-8000-2021
     *
     * @return string
     */
    public function getCodigoAttribute()
    {
        $numeroConsecutivo = sprintf("%04s", $this->id);
        $codigo = 'SAMS-SGPS-' . $numeroConsecutivo;

        return $codigo;
    }

    public function getNumeroSeguimientos()
    {
        $count = $this->ambientesModernizacion()->where('finalizado', true)->count();

        return $count == 0 ? 'Registro en borrador' : 'Registro número ' . $count . ' finalizado';
    }
}
