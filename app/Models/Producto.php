<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Producto extends Model
{
    use HasFactory;

    /**
     * table
     *
     * @var string
     */
    protected $table = 'productos';

    /**
     * appends
     *
     * @var array
     */
    protected $appends = ['year_inicio', 'mes_inicio', 'dia_inicio', 'year_finalizacion', 'mes_finalizacion', 'dia_finalizacion'];

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'resultado_id',
        'nombre',
        'fecha_inicio',
        'fecha_finalizacion',
        'indicador'
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
     * Relationship with Resultado
     *
     * @return object
     */
    public function resultado()
    {
        return $this->belongsTo(Resultado::class);
    }

    /**
     * Relationship with ProductoProyectoLinea66
     *
     * @return object
     */
    public function productoProyectoLinea66()
    {
        return $this->hasOne(ProductoProyectoLinea66::class);
    }

    /**
     * Relationship with ProductoProyectoLinea65
     *
     * @return object
     */
    public function productoProyectoLinea65()
    {
        return $this->hasOne(ProductoProyectoLinea65::class);
    }

    /**
     * Relationship with ProductoLinea69
     *
     * @return object
     */
    public function productoLinea69()
    {
        return $this->hasOne(ProductoLinea69::class);
    }

    /**
     * Relationship with ProductoLinea70
     *
     * @return object
     */
    public function productoLinea70()
    {
        return $this->hasOne(ProductoLinea70::class);
    }

    /**
     * Relationship with ProductoProyectoLinea68
     *
     * @return object
     */
    public function productoProyectoLinea68()
    {
        return $this->hasOne(ProductoProyectoLinea68::class);
    }

    /**
     * Relationship with Actividad
     *
     * @return object
     */
    public function actividades()
    {
        return $this->belongsToMany(Actividad::class, 'actividad_producto', 'producto_id', 'actividad_id');
    }

    /**
     * Filtrar registros
     *
     * @param  mixed $query
     * @param  mixed $filters
     * @return void
     */
    public function scopeFilterProducto($query, array $filters)
    {
        $query->when($filters['search'] ?? null, function ($query, $search) {
            $search = str_replace('"', "", $search);
            $search = str_replace("'", "", $search);
            $search = str_replace(' ', '%%', $search);
            $query->whereRaw("unaccent(nombre) ilike unaccent('%" . $search . "%')");
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

    public function getYearInicioAttribute()
    {
        return date('Y', strtotime($this->fecha_inicio));
    }

    public function getMesInicioAttribute()
    {
        return date('m', strtotime($this->fecha_inicio));
    }

    public function getDiaInicioAttribute()
    {
        return date('d', strtotime($this->fecha_inicio));
    }

    public function getYearFinalizacionAttribute()
    {
        return date('Y', strtotime($this->fecha_finalizacion));
    }

    public function getMesFinalizacionAttribute()
    {
        return date('m', strtotime($this->fecha_finalizacion));
    }

    public function getDiaFinalizacionAttribute()
    {
        return date('d', strtotime($this->fecha_finalizacion));
    }
}
