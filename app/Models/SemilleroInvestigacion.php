<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;

class SemilleroInvestigacion extends Model
{
    use HasFactory;

    /**
     * table
     *
     * @var string
     */
    protected $table = 'semilleros_investigacion';

    /**
     * appends
     *
     * @var array
     */
    protected $appends = ['nombre_carpeta_sharepoint', 'allowed', 'ruta_final_sharepoint'];

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'linea_investigacion_id',
        'nombre',
        'codigo',
        'fecha_creacion_semillero',
        'nombre_lider_semillero',
        'email_contacto',
        'reconocimientos_semillero_investigacion',
        'vision',
        'mision',
        'objetivo_general',
        'objetivos_especificos',
        'link_semillero',
        'formato_gic_f_021',
        'formato_gic_f_032',
        'formato_aval_semillero',
        'es_semillero_tecnoacademia'
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
     * Relationship with LineaInvestigacion
     *
     * @return object
     */
    public function lineaInvestigacion()
    {
        return $this->belongsTo(LineaInvestigacion::class);
    }

    /**
     * Relationship with Proyecto
     *
     * @return object
     */
    public function proyectos()
    {
        return $this->belongsToMany(Proyecto::class, 'proyecto_semillero_investigacion', 'semillero_investigacion_id', 'proyecto_id');
    }

    /**
     * Relationship with AmbienteModernizacion
     *
     * @return object
     */
    public function ambientesModernizacion()
    {
        return $this->belongsToMany(AmbienteModernizacion::class, 'ambiente_modernizacion_semillero_investigacion', 'semillero_investigacion_id', 'ambiente_modernizacion_id');
    }

    /**
     * Relationship with RedConocimiento
     *
     * @return object
     */
    public function redesConocimiento()
    {
        return $this->belongsToMany(RedConocimiento::class, 'semillero_investigacion_red_conocimiento', 'semillero_investigacion_id', 'red_conocimiento_id');
    }

    /**
     * Relationship with ProgramaFormacion
     *
     * @return object
     */
    public function programasFormacion()
    {
        return $this->belongsToMany(ProgramaFormacion::class, 'semillero_investigacion_programa_formacion', 'semillero_investigacion_id', 'programa_formacion_id');
    }

    /**
     * Relationship with LineaInvestigacion
     *
     * @return object
     */
    public function lineasInvestigacionArticulados()
    {
        return $this->belongsToMany(LineaInvestigacion::class, 'semillero_investigacion_linea_investigacion', 'semillero_investigacion_id', 'linea_investigacion_id');
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
     * Relationship with ProyectoIdiTecnoacademia
     *
     * @return void
     */
    public function proyectosIdiTecnoacademia()
    {
        return $this->hasMany(ProyectoIdiTecnoacademia::class);
    }

    /**
     * Relationship with ParticipacionGrupoInvestigacionSena
     *
     * @return void
     */
    public function participacionesGruposInvestigacionSena()
    {
        return $this->hasMany(ParticipacionGrupoInvestigacionSena::class);
    }

    /**
     * Filtrar registros
     *
     * @param  mixed $query
     * @param  mixed $filters
     * @return void
     */
    public function scopeFilterSemilleroInvestigacion($query, array $filters)
    {
        $query->when($filters['search'] ?? null, function ($query, $search) {
            $search = str_replace(' ', '%%', $search);
            $search = str_replace('"', "", $search);
            $search = str_replace("'", "", $search);

            $query->whereRaw("unaccent(semilleros_investigacion.nombre) ilike unaccent('%" . $search . "%')");
        });
    }

    public function getNombreAttribute($value)
    {
        return ucfirst($value);
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

    public function getNombreCarpetaSharepointAttribute()
    {
        return trim(preg_replace('/[^A-Za-z0-9\-ÁÉÍÓÚáéíóúÑñ]/', ' ', mb_strtoupper($this->nombre)));
    }

    public function getRutaFinalSharepointAttribute()
    {
        $ruta = '';
        if ($this->lineaInvestigacion) {
            $ruta = trim($this->lineaInvestigacion->grupoInvestigacion->centroFormacion->nombre_carpeta_sharepoint . '/' . $this->lineaInvestigacion->grupoInvestigacion->nombre_carpeta_sharepoint . '/' . $this->nombre_carpeta_sharepoint);
        }

        return $ruta;
    }

    public function getAllowedAttribute()
    {
        if (str_contains(request()->route()->uri, 'semilleros-investigacion')) {

            $allowedToView      = Gate::inspect('view', [SemilleroInvestigacion::class, $this]);
            $allowedToUpdate    = Gate::inspect('update', [SemilleroInvestigacion::class, $this]);
            $allowedToDestroy   = Gate::inspect('delete', [SemilleroInvestigacion::class, $this]);

            return collect(['to_view' => $allowedToView->allowed(), 'to_update' => $allowedToUpdate->allowed(), 'to_destroy' => $allowedToDestroy->allowed()]);
        }
    }
}
