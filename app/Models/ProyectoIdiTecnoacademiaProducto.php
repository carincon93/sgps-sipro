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
        'tipo_productos_linea_66_id',
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
     * Relationship with ProyectoIdiTecnoacademia
     *
     * @return object
     */
    public function proyectoProyectoFormulario8Linea66Tecnoacademia()
    {
        return $this->belongsTo(ProyectoIdiTecnoacademia::class);
    }

    /**
     * Relationship with TipoProductoProyectoFormulario8Linea66
     *
     * @return object
     */
    public function tipoProductoProyectoFormulario8Linea66()
    {
        return $this->belongsTo(TipoProductoProyectoFormulario8Linea66::class);
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
        if ($this->proyectoProyectoFormulario8Linea66Tecnoacademia) {
            $ruta = trim($this->proyectoProyectoFormulario8Linea66Tecnoacademia->ruta_final_sharepoint . '/PRODUCTOS/');
        }

        return $ruta;
    }
}
