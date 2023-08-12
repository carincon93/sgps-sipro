<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProyectoRolSennova extends Model
{
    use HasFactory;

    /**
     * table
     *
     * @var string
     */
    protected $table = 'proyecto_rol_sennova';

    /**
     * appends
     *
     * @var array
     */
    protected $appends = ['rol_aprobado'];

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'proyecto_id',
        'convocatoria_rol_sennova_id',
        'descripcion',
        'numero_meses',
        'numero_roles',
        'educacion',
        'formacion',
        'experiencia',
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
     * Relationship with ConvocatoriaRolSennova
     *
     * @return object
     */
    public function convocatoriaRolSennova()
    {
        return $this->belongsTo(ConvocatoriaRolSennova::class);
    }


    /**
     * Relationship with Actividad
     *
     * @return object
     */
    public function actividades()
    {
        return $this->belongsToMany(Actividad::class, 'actividad_proyecto_rol', 'proyecto_rol_sennova_id', 'actividad_id');
    }

    /**
     * Relationship with LineaTecnoacademia
     *
     * @return object
     */
    public function lineasTecnoacademia()
    {
        return $this->belongsToMany(LineaTecnoacademia::class, 'proyecto_rol_sennova_linea_tecnoacademia', 'proyecto_rol_sennova_id', 'linea_tecnoacademia_id');
    }

    /**
     * Relationship with LineaTecnoparque
     *
     * @return object
     */
    public function lineasTecnoparque()
    {
        return $this->belongsToMany(LineaTecnoparque::class, 'proyecto_rol_sennova_linea_tecnoparque', 'proyecto_rol_sennova_id', 'linea_tecnoparque_id');
    }

    /**
     * Relationship with ProyectoRolEvaluacion
     *
     * @return object
     */
    public function proyectoRolesEvaluaciones()
    {
        return $this->hasMany(\App\Models\Evaluacion\ProyectoRolEvaluacion::class);
    }

    /**
     * Relationship with ViaticoMunicipio
     *
     * @return object
     */
    public function viaticosMunicipio()
    {
        return $this->hasMany(ViaticoMunicipio::class);
    }

    /**
     * Filtrar registros
     *
     * @param  mixed $query
     * @param  mixed $filters
     * @return void
     */
    public function scopeFilterProyectoRolSennova($query, array $filters)
    {
        $query->when($filters['search'] ?? null, function ($query, $search) {
            $search = str_replace('"', "", $search);
            $search = str_replace("'", "", $search);
            $search = str_replace(' ', '%%', $search);
            $query->join('convocatoria_rol_sennova', 'proyecto_rol_sennova.convocatoria_rol_sennova_id', 'convocatoria_rol_sennova.id');
            $query->join('roles_sennova', 'convocatoria_rol_sennova.rol_sennova_id', 'roles_sennova.id');
            $query->whereRaw("unaccent(roles_sennova.nombre) ilike unaccent('%" . $search . "%')");
            $query->orWhere('convocatoria_rol_sennova.asignacion_mensual', 'ilike', '%' . $search . '%');
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
     * getTotalRolSennova
     *
     * @return int
     */
    public function getTotalRolSennova()
    {
        return ($this->numero_meses * $this->convocatoriaRolSennova->asignacion_mensual) * $this->numero_roles;
    }

    /**
     * getTotalRolActividadesSennova
     *
     * @return int
     */
    public function getTotalRolActividadesSennova()
    {
        $total = 0;
        $countProductos = 0;
        foreach ($this->actividades()->get() as $actividad) {
            $countProductos += $actividad->productos()->count();
        }

        if ($countProductos > 0) {
            $total = $this->getTotalRolSennova() / $countProductos;
        }

        return $total;
    }

    public function getRolAprobadoAttribute()
    {
        $estado = '';

        if ($this->proyectoRolesEvaluaciones()->count() > 0 && $this->proyectoRolesEvaluaciones()->where('correcto', true)->count() > 0) {
            $estado = 'Aprobado';
        } else if ($this->proyectoRolesEvaluaciones()->count() > 0 && $this->proyectoRolesEvaluaciones()->where('correcto', false)->count() == $this->proyectoRolesEvaluaciones()->count()) {
            $estado = 'Rechazado';
        } else if ($this->proyectoRolesEvaluaciones()->count() == 0) {
            $estado = 'Sin evaluar';
        }


        return $estado;
    }
}
