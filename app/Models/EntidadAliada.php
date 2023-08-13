<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EntidadAliada extends Model
{
    use HasFactory;

    /**
     * table
     *
     * @var string
     */
    protected $table = 'entidades_aliadas';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'tipo',
        'nombre',
        'naturaleza',
        'tipo_empresa',
        'nit'
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
     * Relationship with Proyecto
     *
     * @return object
     */
    public function proyecto()
    {
        return $this->belongsTo(Proyecto::class);
    }

    /**
     * Relationship with EntidadAliadaLinea66
     *
     * @return object
     */
    public function entidadAliadaLinea66()
    {
        return $this->hasOne(EntidadAliadaLinea66::class);
    }

    /**
     * Relationship with EntidadAliadaLinea69
     *
     * @return object
     */
    public function entidadAliadaLinea69()
    {
        return $this->hasOne(EntidadAliadaLinea69::class);
    }

    /**
     * Relationship with EntidadAliadaLinea70
     *
     * @return object
     */
    public function entidadAliadaLinea70()
    {
        return $this->hasOne(EntidadAliadaLinea70::class);
    }

    /**
     * Relationship with Actividad
     *
     * @return object
     */
    public function actividades()
    {
        return $this->belongsToMany(Actividad::class, 'actividad_entidad_aliada', 'entidad_aliada_id', 'actividad_id');
    }

    /**
     * Relationship with MiembroEntidadAliada
     *
     * @return object
     */
    public function miembrosEntidadAliada()
    {
        return $this->hasMany(MiembroEntidadAliada::class);
    }

    /**
     * Filtrar registros
     *
     * @param  mixed $query
     * @param  mixed $filters
     * @return void
     */
    public function scopeFilterEntidadAliada($query, array $filters)
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
        return "Última modificación de este formulario: " . Carbon::parse($value, 'UTC')->timezone('America/Bogota')->timezone('America/Bogota')->locale('es')->isoFormat('DD [de] MMMM [de] YYYY [a las] HH:mm:ss');
    }
}
