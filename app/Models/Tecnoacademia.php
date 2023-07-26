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
     * Relationship with ProyectoProyectoLinea66Tecnoacademia
     *
     * @return void
     */
    public function proyectosProyectoLinea66Tecnoacademia()
    {
        return $this->hasMany(ProyectoProyectoLinea66Tecnoacademia::class);
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

    public function getMetaAprendicesAttribute()
    {
        $valorEstandarizado = 0;
        $modalidad = $this->modalidad;
        if ($modalidad == 1) {
            $valorEstandarizado = 460000;
        } else if ($modalidad == 2) {
            $valorEstandarizado = 490000;
        } else if ($modalidad == 3) {
            $valorEstandarizado = 520000;
        }

        $total = 0;
        if ($valorEstandarizado > 0) {
            if (request()->route('proyecto') != null) {
                $total = request()->route('proyecto')->getPrecioProyectoAttribute() / $valorEstandarizado;
            }
        }

        return round($total);
    }

    public function getMaxValorMaterialesFormacionAttribute($value)
    {
        $total = 0;
        if ($value > 0) {
            $total = $value;
        } else {
            $valorAprendiz = 0;
            $modalidad = $this->modalidad;
            if ($modalidad == 1) {
                $valorAprendiz = 20000;
            } else if ($modalidad == 2) {
                $valorAprendiz = 35000;
            } else if ($modalidad == 3) {
                $valorAprendiz = 63000;
            }

            $total = round($this->getMetaAprendicesAttribute() * $valorAprendiz);
        }

        return $total;
    }

    public function getMaxValorBienestarAlumnosAttribute($value)
    {
        $total = 0;

        if ($value > 0) {
            $total = $value;
        } else {
            $total = round($this->getMetaAprendicesAttribute() * 10200);
        }
        return $total;
    }

    public function getNombreCarpetaSharepointAttribute()
    {
        return trim(preg_replace('/[^A-Za-z0-9\-ÁÉÍÓÚáéíóúÑñ]/', ' ', mb_strtoupper($this->nombre)));
    }

    public function getAllowedAttribute()
    {
        $allowedToView      = Gate::inspect('view', [Tecnoacademia::class, $this]);
        $allowedToUpdate    = Gate::inspect('update', [Tecnoacademia::class, $this]);
        $allowedToDestroy   = Gate::inspect('delete', [Tecnoacademia::class, $this]);

        return collect(['to_view' => $allowedToView->allowed(), 'to_update' => $allowedToUpdate->allowed(), 'to_destroy' => $allowedToDestroy->allowed()]);
    }
}
