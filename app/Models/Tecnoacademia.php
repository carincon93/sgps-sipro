<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Gate;

class Tecnoacademia extends Model
{
    use HasFactory;

    /**
     * table
     *
     * @var string
     */
    protected $table = 'tecnoacademias';

    /**
     * appends
     *
     * @var array
     */
    protected $appends = ['nombre_carpeta_sharepoint', 'allowed'];


    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'nombre',
        'modalidad',
        'fecha_creacion',
        'foco',
        'linea_tecnoacademia_id',
        'centro_formacion_id',
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
     * Relationship with CentroFormacion
     *
     * @return object
     */
    public function centroFormacion()
    {
        return $this->belongsTo(CentroFormacion::class);
    }

    /**
     * Relationship with LineaTecnoacademia
     *
     * @return object
     */
    public function lineasTecnoacademia()
    {
        return $this->belongsToMany(LineaTecnoacademia::class, 'tecnoacademia_linea_tecnoacademia', 'tecnoacademia_id', 'linea_tecnoacademia_id');
    }

    /**
     * Relationship with ProyectoIdiTecnoacademia
     *
     * @return void
     */
    public function proyectosIdiTecnoacademia()
    {
        return $this->hasMany(ProyectoIdiTecnoacademia::class);
    }

    /**
     * Relationship with Municipio
     *
     * @return object
     */
    public function municipios()
    {
        return $this->belongsToMany(Municipio::class, 'proyecto_idi_tecnoacademia_municipio', 'proyecto_idi_tecnoacademia_linea_id', 'municipio_id')->orderBy('municipios.nombre', 'ASC');
    }

    /**
     * Filtrar registros
     *
     * @param  mixed $query
     * @param  mixed $filters
     * @return void
     */
    public function scopeFilterTecnoacademia($query, array $filters)
    {
        $query->when($filters['search'] ?? null, function ($query, $search) {
            $search = str_replace('"', "", $search);
            $search = str_replace("'", "", $search);
            $search = str_replace(' ', '%%', $search);
            $query->join('centros_formacion', 'tecnoacademias.centro_formacion_id', 'centros_formacion.id');
            $query->whereRaw("unaccent(tecnoacademias.nombre) ilike unaccent('%" . $search . "%')");
            $query->orWhereRaw("unaccent(centros_formacion.nombre) ilike unaccent('%" . $search . "%')");
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

    public function getNombreCarpetaSharepointAttribute()
    {
        return trim(preg_replace('/[^A-Za-z0-9\-ÁÉÍÓÚáéíóúÑñ]/', ' ', mb_strtoupper($this->nombre)));
    }

    public function getAllowedAttribute()
    {
        $allowed_to_view      = Gate::inspect('view', [Tecnoacademia::class, $this]);
        $allowed_to_update    = Gate::inspect('update', [Tecnoacademia::class, $this]);
        $allowed_to_destroy   = Gate::inspect('delete', [Tecnoacademia::class, $this]);

        return collect(['to_view' => $allowed_to_view->allowed(), 'to_update' => $allowed_to_update->allowed(), 'to_destroy' => $allowed_to_destroy->allowed()]);
    }
}
