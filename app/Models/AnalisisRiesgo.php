<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AnalisisRiesgo extends Model
{
    use HasFactory;

    /**
     * table
     *
     * @var string
     */
    protected $table = 'analisis_riesgos';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'nivel',
        'tipo',
        'descripcion',
        'impacto',
        'probabilidad',
        'efectos',
        'medidas_mitigacion'
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
     * Relationship with Project
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
    public function scopeFilterAnalisisRiesgo($query, array $filters)
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
        return "Última modificación de este formulario: " . Carbon::parse($value, 'UTC')->timezone('America/Bogota')->timezone('America/Bogota')->locale('es')->isoFormat('DD [de] MMMM [de] YYYY [a las] HH:mm:ss');
    }

    /**
     * getNivelAttribute
     *
     * @param  mixed $value
     * @return void
     */
    public function getNivelAttribute($value)
    {
        switch ($value) {
            case 1:
                $value = 'A nivel del objetivo general';
                break;
            case 2:
                $value = 'A nivel de productos';
                break;
            case 3:
                $value = 'A nivel de actividades';
                break;
            default:
                break;
        }
        return $value;
    }

    /**
     * getTipoAttribute
     *
     * @param  mixed $value
     * @return void
     */
    public function getTipoAttribute($value)
    {
        switch ($value) {
            case 1:
                $value = 'Mercado';
                break;
            case 2:
                $value = 'Operacionales';
                break;
            case 3:
                $value = 'Legales';
                break;
            case 4:
                $value = 'Administrativos';
                break;
            default:
                break;
        }
        return $value;
    }

    /**
     * getProbabilidadAttribute
     *
     * @param  mixed $value
     * @return void
     */
    public function getProbabilidadAttribute($value)
    {
        switch ($value) {
            case 1:
                $value = 'Posible';
                break;
            case 2:
                $value = 'Probable';
                break;
            default:
                break;
        }
        return $value;
    }

    /**
     * getImpactoAttribute
     *
     * @param  mixed $value
     * @return void
     */
    public function getImpactoAttribute($value)
    {
        switch ($value) {
            case 1:
                $value = 'Alto';
                break;
            case 2:
                $value = 'Moderado';
                break;
            case 3:
                $value = 'Leve';
                break;
            default:
                break;
        }

        return $value;
    }
}
