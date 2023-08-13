<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LineaTecnoacademia extends Model
{
    use HasFactory;

    /**
     * table
     *
     * @var string
     */
    protected $table = 'lineas_tecnoacademia';


    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'tecnoacademia_id',
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
     * Relationship with Tecnoacademia
     *
     * @return object
     */
    public function tecnoacademias()
    {
        return $this->belongsToMany(Tecnoacademia::class, 'tecnoacademia_linea_tecnoacademia', 'linea_tecnoacademia_id', 'tecnoacademia_id');
    }

    /**
     * Relationship with Proyecto
     *
     * @return object
     */
    public function proyectosLinea66()
    {
        return $this->belongsToMany(Proyecto::class, 'proyecto_linea_tecnoacademia', 'tecnoacademia_linea_tecnoacademia_id', 'proyecto_id');
    }

    /**
     * Relationship with ProyectoRolSennova
     *
     * @return object
     */
    public function proyectoRolesSennova()
    {
        return $this->belongsToMany(ProyectoRolSennova::class, 'proyecto_rol_sennova_linea_tecnoacademia', 'linea_tecnoacademia_id', 'proyecto_rol_sennova_id');
    }

    /**
     * Relationship with ProyectoFormulario4Linea70
     *
     * @return object
     */
    public function proyectosLinea70()
    {
        return $this->hasMany(ProyectoFormulario4Linea70::class);
    }

    /**
     * Filtrar registros
     *
     * @param  mixed $query
     * @param  mixed $filters
     * @return void
     */
    public function scopeFilterLineaTecnoacademia($query, array $filters)
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
