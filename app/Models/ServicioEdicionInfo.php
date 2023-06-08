<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ServicioEdicionInfo extends Model
{
    use HasFactory;

    /**
     * table
     *
     * @var string
     */
    protected $table = 'servicios_edicion_info';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'proyecto_presupuesto_id',
        'info'
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
     * Relationship with ProyectoPresupuesto
     *
     * @return void
     */
    public function proyectoPresupuesto()
    {
        return $this->belongsTo(ProyectoPresupuesto::class);
    }

    /**
     * Filtrar registros
     *
     * @param  mixed $query
     * @param  mixed $filters
     * @return void
     */
    public function scopeFilterServicioEdicionInfo($query, array $filters)
    {
        $query->when($filters['search'] ?? null, function ($query, $search) {
            $search = str_replace('"', "", $search);
            $search = str_replace("'", "", $search);
            $search = str_replace(' ', '%%', $search);
            $query->where('info', 'ilike', '%' . $search . '%');
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
     * getNivelAttribute
     *
     * @param  mixed $value
     * @return void
     */
    public function getInfoAttribute($value)
    {
        switch ($value) {
            case 1:
                $value = 'Ingeniería y Tecnología';
                break;
            case 2:
                $value = 'Ciencias Agrícolas';
                break;
            case 3:
                $value = 'Ciencias Sociales';
                break;
            case 4:
                $value = 'Ciencias Naturales';
                break;
            case 5:
                $value = 'Ciencias Médicas y de Salud';
                break;
            case 6:
                $value = 'Multidisciplinario y humanidades';
                break;
            case 7:
                $value = 'Industrias Creativas, cuarta revolución y sostenibilidad y medio ambiente';
                break;
            case 8:
                $value = 'Niños y jóvenes';
                break;
            default:
                break;
        }
        return $value;
    }
}
