<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DisciplinaSubareaConocimiento extends Model
{
    use HasFactory;

    /**
     * table
     *
     * @var string
     */
    protected $table = 'disciplinas_subarea_conocimiento';


    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'subarea_conocimiento_id',
        'nombre'
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
     * Relationship with SubareaConocimiento
     *
     * @return object
     */
    public function subareaConocimiento()
    {
        return $this->belongsTo(SubareaConocimiento::class);
    }

    /**
     * Relationship with Idi
     *
     * @return object
     */
    public function idi()
    {
        return $this->hasMany(Idi::class);
    }

    /**
     * Relationship with AmbienteModernizacion
     *
     * @return object
     */
    public function ambientesModernizacion()
    {
        return $this->hasMany(AmbienteModernizacion::class);
    }

    /**
     * Relationship with ProyectoCapacidadInstalada
     *
     * @return void
     */
    public function proyectosCapacidadInstalada()
    {
        return $this->hasMany(ProyectoCapacidadInstalada::class);
    }

    /**
     * Relationship with Ta
     *
     * @return object
     */
    public function ta()
    {
        return $this->belongsToMany(Ta::class, 'ta_disciplina_subarea_conocimiento', 'disciplina_subarea_conocimiento_id', 'ta_id');
    }

    /**
     * Filtrar registros
     *
     * @param  mixed $query
     * @param  mixed $filters
     * @return void
     */
    public function scopeFilterDisciplinaSubareaConocimiento($query, array $filters)
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
}
