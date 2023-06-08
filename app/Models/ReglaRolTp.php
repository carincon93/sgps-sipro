<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ReglaRolTp extends Model
{
    use HasFactory;

    /**
     * table
     *
     * @var string
     */
    protected $table = 'reglas_roles_tp';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'convocatoria_rol_sennova_id',
        'nodo_tecnoparque_id',
        'maximo'
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
     * Relationship with NodoTecnoparque
     *
     * @return object
     */
    public function nodoTecnoparque()
    {
        return $this->belongsTo(NodoTecnoparque::class);
    }

    /**
     * Relationship with ConvocatoriaRolSennova
     *
     * @return object
     */
    public function convocatoriaRolSennova()
    {
        return $this->belongsTo(ConvocatoriaRolSennova::class);
    }

    /**
     * Filtrar registros
     *
     * @param  mixed $query
     * @param  mixed $filters
     * @return void
     */
    public function scopeFilterReglaRolTp($query, array $filters)
    {
        $query->when($filters['search'] ?? null, function ($query, $search) {
            $query->where('roles_sennova.nombre', 'ilike', '%' . $search . '%');
            $query->orWhere('nodos_tecnoparque.nombre', 'ilike', '%' . $search . '%');
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
