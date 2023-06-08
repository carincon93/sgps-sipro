<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class InventarioEquipo extends Model
{
    use HasFactory;

    /**
     * table
     *
     * @var string
     */
    protected $table = 'inventario_equipos';

    /**
     * appends
     *
     * @var array
     */
    public $appends = ['estado_formateado'];

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'proyecto_id',
        'nombre',
        'marca',
        'serial',
        'codigo_interno',
        'fecha_adquisicion',
        'estado',
        'uso_st',
        'uso_otra_dependencia',
        'dependencia',
        'descripcion',
        'mantenimiento_prox_year',
        'calibracion_prox_year'
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
     * Filtrar registros
     *
     * @param  mixed $query
     * @param  mixed $filters
     * @return void
     */
    public function scopeFilterInventarioEquipo($query, array $filters)
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

    /**
     * getEstadoFormateadoAttribute
     *
     * @return void
     */
    public function getEstadoFormateadoAttribute()
    {
        switch ($this->estado) {
            case '1':
                return 'Bueno, en uso';
                break;
            case '2':
                return 'Bueno, sin uso';
                break;
            case '3':
                return 'En uso, sin mantenimiento';
                break;
            case '4':
                return 'Para dar de baja';
                break;
            default:
                # code...
                break;
        }
    }
}
