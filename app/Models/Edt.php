<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Edt extends Model
{
    use HasFactory;

    /**
     * table
     *
     * @var string
     */
    protected $table = 'edt';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'ta_id',
        'proyecto_presupuesto_id',
        'tipo_evento',
        'descripcion_evento',
        'descripcion_participacion_entidad',
        'publico_objetivo',
        'numero_asistentes',
        'estrategia_comunicacion',
        'nombre_evento',
        'fecha_evento',
        'organizador',
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
     * Relationship with Ta
     *
     * @return object
     */
    public function ta()
    {
        return $this->belongsTo(Ta::class);
    }

    /**
     * Relationship with ProyectoPresupuesto
     *
     * @return object
     */
    public function proyectoPresupuesto()
    {
        return $this->belongsTo(ProyectoPresupuesto::class);
    }

    /**
     * Filtrar registros
     *
     * @param  mixed $query
     * @param  mixed $filters
     * @return void
     */
    public function scopeFilterEdt($query, array $filters)
    {
        $query->when($filters['search'] ?? null, function ($query, $search) {
            $query->where('tipo_evento', 'ilike', '%' . $search . '%');
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
