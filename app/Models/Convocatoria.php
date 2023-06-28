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
    public $appends = ['fase_formateada', 'campos_convocatoria'];

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
        'year'
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

    public function getCamposConvocatoriaAttribute()
    {
        return json_decode(Storage::get('json/campos-convocatoria.json'), true);
    }
}
