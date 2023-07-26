<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProyectoIdiTecnoacademiaProducto extends Model
{
    use HasFactory;

    /**
     * table
     *
     * @var string
     */
    protected $table = 'proyecto_idi_tecnoacademia_productos';

    /**
     * appends
     *
     * @var array
     */
    protected $appends = ['ruta_final_sharepoint'];

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'proyecto_idi_tecnoacademia_id',
        'tipo_producto_idi_id',
        'estado',
        'soporte',
        'link',
        'lugar',
        'fecha_realizacion'
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
     * Relationship with ProyectoProyectoLinea66Tecnoacademia
     *
     * @return object
     */
    public function proyectoProyectoLinea66Tecnoacademia()
    {
        return $this->belongsTo(ProyectoProyectoLinea66Tecnoacademia::class);
    }

    /**
     * Relationship with TipoProductoProyectoLinea66
     *
     * @return object
     */
    public function tipoProductoProyectoLinea66()
    {
        return $this->belongsTo(TipoProductoProyectoLinea66::class);
    }

    /**
     * Filtrar registros
     *
     * @param  mixed $query
     * @param  mixed $filters
     * @return void
     */
    public function scopeFilterProyectoIdiTecnoacademiaProducto($query, array $filters)
    {
        $query->when($filters['search'] ?? null, function ($query, $search) {
            $query->where('estado', 'ilike', '%' . $search . '%');
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

    public function getRutaFinalSharepointAttribute()
    {
        $ruta = '';
        if ($this->proyectoProyectoLinea66Tecnoacademia) {
            $ruta = trim($this->proyectoProyectoLinea66Tecnoacademia->ruta_final_sharepoint . '/PRODUCTOS/');
        }

        return $ruta;
    }
}
