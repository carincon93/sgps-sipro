<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ObjetivoEspecifico extends Model
{
    use HasFactory;

    /**
     * table
     *
     * @var string
     */
    protected $table = 'objetivos_especificos';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'causa_directa_id',
        'descripcion',
        'numero'
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
     * Relationship with CausaDirecta
     *
     * @return object
     */
    public function causaDirecta()
    {
        return $this->belongsTo(CausaDirecta::class);
    }

    /**
     * Relationship with Resultado
     *
     * @return object
     */
    public function resultados()
    {
        return $this->hasMany(Resultado::class);
    }

    /**
     * Relationship with Actividad
     *
     * @return object
     */
    public function actividades()
    {
        return $this->hasMany(Actividad::class);
    }

    /**
     * Filtrar registros
     *
     * @param  mixed $query
     * @param  mixed $filters
     * @return void
     */
    public function scopeFilterObjetivoEspecifico($query, array $filters)
    {
        $query->when($filters['search'] ?? null, function ($query, $search) {
            $search = str_replace('"', "", $search);
            $search = str_replace("'", "", $search);
            $search = str_replace(' ', '%%', $search);
            $query->whereRaw("unaccent(descripcion) ilike unaccent('%" . $search . "%')");
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
