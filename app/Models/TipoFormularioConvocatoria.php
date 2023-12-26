<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TipoFormularioConvocatoria extends Model
{
    use HasFactory;

    /**
     * table
     *
     * @var string
     */
    protected $table = 'tipos_formulario_convocatoria';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'nombre',
        'habilitado',
        'linea_programatica_id'
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
     * Relationship with LineaProgramatica
     *
     * @return object
     */
    public function lineaProgramatica()
    {
        return $this->belongsTo(LineaProgramatica::class);
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
     * Relationship with ConvocatoriaPresupuesto
     *
     * @return object
     */
    public function convocatoriaRubrosPresupuestales()
    {
        return $this->hasMany(ConvocatoriaPresupuesto::class);
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
     * Relationship with TipoFormularioConvocatoria
     *
     * @return object
     */
    public function tiposFormularioConvocatoria()
    {
        return $this->belongsToMany(Convocatoria::class, 'convocatoria_tipos_formularios', 'tipo_formulario_convocatoria_id', 'convocatoria_id')->withPivot([
            'visible',
            'mostrar_resultados'
        ]);
    }
}
