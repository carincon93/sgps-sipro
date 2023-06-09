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
     * Relationship with EntidadAliadaIdi
     *
     * @return object
     */
    public function entidadAliadaIdi()
    {
        return $this->hasOne(EntidadAliadaIdi::class);
    }

    /**
     * Relationship with EntidadAliadaTa
     *
     * @return object
     */
    public function entidadAliadaTaTp()
    {
        return $this->hasOne(EntidadAliadaTaTp::class);
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
                $value = 'Empresa';
                break;
            case 2:
                $value = 'Universidad';
                break;
            case 3:
                $value = 'Entidades sin ánimo de lucro';
                break;
            case 4:
                $value = 'Centro de formación SENA';
                break;
            case 5:
                $value = 'Otra';
                break;
            default:
                break;
        }
        return $value;
    }

    /**
     * getNaturalezaAttribute
     *
     * @param  mixed $value
     * @return void
     */
    public function getNaturalezaAttribute($value)
    {
        switch ($value) {
            case 1:
                $value = 'Pública';
                break;
            case 2:
                $value = 'Privado';
                break;
            case 3:
                $value = 'Mixta';
                break;
            case 4:
                $value = 'ONG';
                break;
            default:
                break;
        }
        return $value;
    }

    /**
     * getTipoEmpresaAttribute
     *
     * @param  mixed $value
     * @return void
     */
    public function getTipoEmpresaAttribute($value)
    {
        switch ($value) {
            case 1:
                $value = 'Microempresa';
                break;
            case 2:
                $value = 'Pequeña';
                break;
            case 3:
                $value = 'Mediana';
                break;
            case 4:
                $value = 'Grande';
                break;
            default:
                break;
        }
        return $value;
    }
}
