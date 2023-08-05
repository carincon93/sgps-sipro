<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LineaProgramatica extends Model
{
    use HasFactory;

    /**
     * table
     *
     * @var string
     */
    protected $table = 'lineas_programaticas';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'nombre',
        'descripcion',
        'codigo',
        'categoria_proyecto'
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
        return $this->belongsTo(Proyecto::class);
    }

    /**
     * Relationship with RubroPresupuestal
     *
     * @return object
     */
    public function rubroPresupuestal()
    {
        return $this->hasMany(RubroPresupuestal::class);
    }

    /**
     * Relationship with ConvocatoriaRolSennova
     *
     * @return object
     */
    public function convocatoriaRolSennova()
    {
        return $this->hasMany(ConvocatoriaRolSennova::class);
    }

    /**
     * Relationship with CodigoProyectoSgps
     *
     * @return void
     */
    public function codigosProyectosSgps()
    {
        return $this->hasMany(CodigoProyectoSgps::class);
    }

    /**
     * Relationship with RolSennova
     *
     * @return void
     */
    public function rolesSennova()
    {
        return $this->hasMany(RolSennova::class);
    }

    /**
     * Relationship with ConvocatoriaAnexo
     *
     * @return object
     */
    public function convocatoriaAnexos()
    {
        return $this->belongsToMany(ConvocatoriaAnexo::class, 'convocatoria_anexos_linea_programatica', 'linea_programatica_id', 'convocatoria_anexo_id');
    }

    /**
     * Relationship with Convocatoria
     *
     * @return object
     */
    public function convocatorias()
    {
        return $this->belongsToMany(Convocatoria::class, 'convocatoria_lineas_programaticas', 'linea_programatica_id', 'convocatoria_id');
    }

    /**
     * Relationship with User
     *
     * @return object
     */
    public function activadores()
    {
        return $this->belongsToMany(User::class, 'activador_linea_programatica', 'linea_programatica_id', 'user_id');
    }

    /**
     * Filtrar registros
     *
     * @param  mixed $query
     * @param  mixed $filters
     * @return void
     */
    public function scopeFilterLineaProgramatica($query, array $filters)
    {
        $query->when($filters['search'] ?? null, function ($query, $search) {
            $search = str_replace(' ', '%%', $search);
            $search = str_replace('"', "", $search);
            $search = str_replace("'", "", $search);
            $query->whereRaw("unaccent(nombre) ilike unaccent('%" . $search . "%')");
            $query->orWhere('codigo', 'ilike', '%' . $search . '%');
            $query->orWhere('categoria_proyecto', 'ilike', '%' . $search . '%');
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
}
