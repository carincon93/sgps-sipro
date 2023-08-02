<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SubtipologiaMinciencias extends Model
{
    use HasFactory;

    /**
     * table
     *
     * @var string
     */
    protected $table = 'subtipologias_minciencias';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'tipologica_minciencias_id',
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
     * Relationship with TipologiaMinciencias
     *
     * @return object
     */
    public function tipologiaMinciencias()
    {
        return $this->belongsTo(TipologiaMinciencias::class);
    }

    /**
     * Relationship with ProductoMincienciasLinea65
     *
     * @return object
     */
    public function productosMincienciasLinea65()
    {
        return $this->hasMany(ProductoMincienciasLinea65::class);
    }

    /**
     * Relationship with ProductoMincienciasLinea66
     *
     * @return object
     */
    public function productosMincienciasLinea66()
    {
        return $this->hasMany(ProductoMincienciasLinea66::class);
    }

    /**
     * Relationship with ProductoMincienciasLinea68
     *
     * @return object
     */
    public function productosMincienciasLinea68()
    {
        return $this->hasMany(ProductoMincienciasLinea68::class);
    }

    /**
     * Relationship with ProductoMincienciasLinea69
     *
     * @return object
     */
    public function productosMincienciasLinea69()
    {
        return $this->hasMany(ProductoMincienciasLinea69::class);
    }

    /**
     * Filtrar registros
     *
     * @param  mixed $query
     * @param  mixed $filters
     * @return void
     */
    public function scopeFilterSubtipologiaMinciencias($query, array $filters)
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
}
