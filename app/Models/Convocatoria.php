<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;
use Illuminate\Support\Facades\Storage;

class Convocatoria extends Model
{
    use HasFactory;

    /**
     * table
     *
     * @var string
     */
    protected $table = 'convocatorias';

    /**
     * appends
     *
     * @var array
     */
    public $appends = ['year', 'fecha_maxima_idi', 'fecha_maxima_cultura', 'fecha_maxima_ta', 'fecha_maxima_tp', 'fecha_maxima_st', 'fase_formateada', 'campos_convocatoria'];

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'descripcion',
        'esta_activa',
        'fecha_finalizacion_fase',
        'fase',
        'mostrar_recomendaciones',
        'hora_finalizacion_fase',
        'tipo_convocatoria',
        'lineas_programaticas_activas',
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
    public function proyectos()
    {
        return $this->hasMany(Proyecto::class);
    }

    /**
     * Relationship with Evaluacion
     *
     * @return object
     */
    public function evaluaciones()
    {
        return $this->hasMany(\App\Models\Evaluacion\Evaluacion::class);
    }

    /**
     * Relationship with ConvocatoriaRolSennova
     *
     * @return object
     */
    public function convocatoriaRolesSennova()
    {
        return $this->hasMany(ConvocatoriaRolSennova::class);
    }

    /**
     * Relationship with ConvocatoriaPresupuesto
     *
     * @return object
     */
    public function convocatoriaPresupuestos()
    {
        return $this->hasMany(ConvocatoriaPresupuesto::class);
    }

    /**
     * Relationship with Anexo
     *
     * @return object
     */
    public function anexos()
    {
        return $this->belongsToMany(Anexo::class, 'convocatoria_anexos', 'convocatoria_id', 'anexo_id');
    }

    /**
     * Filtrar registros
     *
     * @param  mixed $query
     * @param  mixed $filters
     * @return void
     */
    public function scopeFilterConvocatoria($query, array $filters)
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
     * getYearAttribute
     *
     * @return void
     */
    public function getYearAttribute()
    {
        return $this->max_fecha_finalizacion_proyectos_idi ? date('Y', strtotime($this->max_fecha_finalizacion_proyectos_idi)) : date('Y');
    }

    /**
     * getFaseFormateadaAttribute
     *
     * @return void
     */
    public function getFaseFormateadaAttribute()
    {
        $fase = null;
        $fechaLimite = Carbon::parse($this->fecha_finalizacion_fase, 'UTC')->locale('es')->isoFormat('DD [de] MMMM [de] YYYY') . ' a las ' . $this->hora_finalizacion_fase;
        switch ($this->fase) {
            case 1:
                $fase = 'Fase de formulación hasta el <br />' . $fechaLimite;
                break;
            case 2:
                $fase = 'Fase de primera evaluación hasta el <br />' . $fechaLimite;
                break;
            case 3:
                $fase = 'Fase de subsanación hasta el <br />' . $fechaLimite;
                break;
            case 4:
                $fase = 'Fase de segunda evaluación hasta el <br />' . $fechaLimite;
                break;
            case 5:
                $fase = 'La convocatoria finalizó el <br />' . $fechaLimite;
                break;
            default:
                break;
        }
        return $fase;
    }


    /**
     * getFechaMaximaIdiAttribute
     *
     * @return void
     */
    public function getFechaMaximaIdiAttribute()
    {
        return "Las fechas de ejecución deben estar dentro del rango: " . Carbon::parse($this->min_fecha_inicio_proyectos_idi, 'UTC')->locale('es')->isoFormat('DD [de] MMMM [de] YYYY') . " y " . Carbon::parse($this->max_fecha_finalizacion_proyectos_idi, 'UTC')->locale('es')->isoFormat('DD [de] MMMM [de] YYYY') . ".";
    }

    /**
     * getFechaMaximaCulturaAttribute
     *
     * @return void
     */
    public function getFechaMaximaCulturaAttribute()
    {
        return "Las fechas de ejecución deben estar dentro del rango: " . Carbon::parse($this->min_fecha_inicio_proyectos_linea_65, 'UTC')->locale('es')->isoFormat('DD [de] MMMM [de] YYYY') . " y " . Carbon::parse($this->max_fecha_finalizacion_proyectos_cultura, 'UTC')->locale('es')->isoFormat('DD [de] MMMM [de] YYYY') . ".";
    }

    /**
     * getFechaMaximaTaAttribute
     *
     * @return void
     */
    public function getFechaMaximaTaAttribute()
    {
        return "Las fechas de ejecución deben estar dentro del rango: " . Carbon::parse($this->min_fecha_inicio_proyectos_linea_70, 'UTC')->locale('es')->isoFormat('DD [de] MMMM [de] YYYY') . " y " . Carbon::parse($this->max_fecha_finalizacion_proyectos_linea_70, 'UTC')->locale('es')->isoFormat('DD [de] MMMM [de] YYYY') . ".";
    }

    /**
     * getFechaMaximaTpAttribute
     *
     * @return void
     */
    public function getFechaMaximaTpAttribute()
    {
        return "Las fechas de ejecución deben estar dentro del rango: " . Carbon::parse($this->min_fecha_inicio_proyectos_linea_69, 'UTC')->locale('es')->isoFormat('DD [de] MMMM [de] YYYY') . " y " . Carbon::parse($this->max_fecha_finalizacion_proyectos_linea_69, 'UTC')->locale('es')->isoFormat('DD [de] MMMM [de] YYYY') . ".";
    }

    /**
     * getFechaMaximaStAttribute
     *
     * @return void
     */
    public function getFechaMaximaStAttribute()
    {
        return "Las fechas de ejecución deben estar dentro del rango: " . Carbon::parse($this->min_fecha_inicio_proyectos_linea_68, 'UTC')->locale('es')->isoFormat('DD [de] MMMM [de] YYYY') . " y " . Carbon::parse($this->max_fecha_finalizacion_proyectos_linea_68, 'UTC')->locale('es')->isoFormat('DD [de] MMMM [de] YYYY') . ".";
    }

    public function getCamposConvocatoriaAttribute()
    {
        return json_decode(Storage::get('json/campos-convocatoria.json'), true);
    }
}
