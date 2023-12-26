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
        'visible',
        'mostrar_recomendaciones',
        'hora_finalizacion_fase',
        'tipo_convocatoria',
        'year',
        'permitir_nuevos_proyectos'
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
     * Relationship with ConvocatoriaAnexo
     *
     * @return object
     */
    public function convocatoriaAnexos()
    {
        return $this->hasMany(ConvocatoriaAnexo::class);
    }

    /**
     * Relationship with TopePresupuestalNodoTecnoparque
     *
     * @return object
     */
    public function topesPresupuestalesNodosTecnoparque()
    {
        return $this->hasMany(TopePresupuestalNodoTecnoparque::class);
    }

    /**
     * Relationship with TopePresupuestalFormulario7
     *
     * @return object
     */
    public function topesPresupuestalesFormulario7()
    {
        return $this->hasMany(TopePresupuestalFormulario7::class);
    }

    /**
     * Relationship with TipoFormularioConvocatoria
     *
     * @return object
     */
    public function tiposFormularioConvocatoria()
    {
        return $this->belongsToMany(TipoFormularioConvocatoria::class, 'convocatoria_tipos_formularios', 'convocatoria_id', 'tipo_formulario_convocatoria_id')->withPivot([
            'visible',
            'mostrar_resultados'
        ]);
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

    public function getLineasProgramaticasActivasAttribute($value)
    {
        return json_decode($value);
    }
}
