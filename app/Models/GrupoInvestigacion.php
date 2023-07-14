<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;

class GrupoInvestigacion extends Model
{
    use HasFactory;

    /**
     * table
     *
     * @var string
     */
    protected $table = 'grupos_investigacion';

    /**
     * appends
     *
     * @var array
     */
    protected $appends = ['categoria_minciencias_formateado', 'nombre_carpeta_sharepoint', 'ruta_final_sharepoint', 'allowed'];

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'centro_formacion_id',
        'nombre',
        'acronimo',
        'email',
        'enlace_gruplac',
        'codigo_minciencias',
        'categoria_minciencias',
        'mision',
        'vision',
        'fecha_creacion_grupo',
        'nombre_lider_grupo',
        'email_contacto',
        'programa_nal_ctei_principal',
        'programa_nal_ctei_secundaria',
        'reconocimientos_grupo_investigacion',
        'objetivo_general',
        'objetivos_especificos',
        'link_propio_grupo',
        'formato_gic_f_020',
        'formato_gic_f_032',
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
     * Relationship with CentroFormacion
     *
     * @return object
     */
    public function centroFormacion()
    {
        return $this->belongsTo(CentroFormacion::class);
    }

    /**
     * Relationship with LineaInvestigacion
     *
     * @return object
     */
    public function lineasInvestigacion()
    {
        return $this->hasMany(LineaInvestigacion::class);
    }

    /**
     * Relationship with RedConocimiento
     *
     * @return object
     */
    public function redesConocimiento()
    {
        return $this->belongsToMany(RedConocimiento::class, 'grupo_investigacion_red_conocimiento', 'grupo_investigacion_id', 'red_conocimiento_id');
    }

    /**
     * Relationship with Proyecto
     *
     * @return object
     */
    public function proyectos()
    {
        return $this->belongsToMany(Proyecto::class, 'proyecto_grupo_investigacion', 'grupo_investigacion_id', 'proyecto_id');
    }

    /**
     * Relationship with Idi
     *
     * @return object
     */
    public function idiEni()
    {
        return $this->hasMany(Idi::class);
    }

    /**
     * Filtrar registros
     *
     * @param  mixed $query
     * @param  mixed $filters
     * @return void
     */
    public function scopeFilterGrupoInvestigacion($query, array $filters)
    {
        $query->when($filters['search'] ?? null, function ($query, $search) {
            $search = str_replace(' ', '%%', $search);
            $search = str_replace('"', "", $search);
            $search = str_replace("'", "", $search);
            $query->join('centros_formacion', 'grupos_investigacion.centro_formacion_id', 'centros_formacion.id');
            $query->join('regionales', 'centros_formacion.regional_id', 'regionales.id');
            $query->whereRaw("unaccent(grupos_investigacion.nombre) ilike unaccent('%" . $search . "%')");
            $query->orWhereRaw("unaccent(centros_formacion.nombre) ilike unaccent('%" . $search . "%')");
            $query->orWhereRaw("unaccent(regionales.nombre) ilike unaccent('%" . $search . "%')");
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
     * getCategoriaMincienciasAttribute
     *
     * @param  mixed $value
     * @return void
     */
    public function getCategoriaMincienciasFormateadoAttribute()
    {
        $categoriaMinciencias = '';
        switch ($this->categoria_minciencias) {
            case 1:
                $categoriaMinciencias = 'A';
                break;
            case 2:
                $categoriaMinciencias = 'A1';
                break;
            case 3:
                $categoriaMinciencias = 'B';
                break;
            case 4:
                $categoriaMinciencias = 'C';
                break;
            case 5:
                $categoriaMinciencias = 'Reconocido';
                break;
            case 7:
                $categoriaMinciencias = 'Avalado SENA';
                break;
            default:
                break;
        }
        return $categoriaMinciencias;
    }

    public function getNombreAttribute($value)
    {
        return ucfirst($value);
    }

    public function getNombreCarpetaSharepointAttribute()
    {
        return trim(preg_replace('/[^A-Za-z0-9\-ÁÉÍÓÚáéíóúÑñ]/', ' ', mb_strtoupper($this->nombre)));
    }

    public function getRutaFinalSharepointAttribute()
    {
        $ruta = '';
        if ($this->centroFormacion) {
            $ruta = trim($this->centroFormacion->nombre_carpeta_sharepoint . '/' . $this->nombre_carpeta_sharepoint);
        }

        return $ruta;
    }

    public function getAllowedAttribute()
    {
        if (str_contains(request()->route()->uri, 'grupos-investigacion')) {

            $allowedToView      = Gate::inspect('view', [GrupoInvestigacion::class, $this]);
            $allowedToUpdate    = Gate::inspect('update', [GrupoInvestigacion::class, $this]);
            $allowedToDestroy   = Gate::inspect('delete', [GrupoInvestigacion::class, $this]);

            return collect(['to_view' => $allowedToView->allowed(), 'to_update' => $allowedToUpdate->allowed(), 'to_destroy' => $allowedToDestroy->allowed()]);
        }
    }
}
