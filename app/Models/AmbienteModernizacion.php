<?php

namespace App\Models;

use App\Helpers\SharepointHelper;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;
use Illuminate\Support\Facades\Gate;

class AmbienteModernizacion extends Model
{
    use HasFactory;

    /**
     * table
     *
     * @var string
     */
    protected $table = 'ambientes_modernizacion';

    /**
     * appends
     *
     * @var array
     */
    protected $appends = ['year_modernizacion', 'fecha_seguimiento', 'estado', 'ruta_final_sharepoint', 'allowed'];

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'seguimiento_ambiente_modernizacion_id',
        'tipologia_ambiente_id',
        'linea_investigacion_id',
        'nombre_ambiente',
        'disciplina_subarea_conocimiento_id',
        'red_conocimiento_id',
        'actividad_economica_id',
        'tematica_estrategica_id',
        'alineado_mesas_sectoriales',
        'financiado_anteriormente',
        'estado_general_maquinaria',
        'razon_estado_general',
        'ambiente_activo',
        'justificacion_ambiente_inactivo',
        'ambiente_activo_procesos_idi',
        'numero_proyectos_beneficiados',
        'ambiente_formacion_complementaria',
        'numero_total_cursos_comp',
        'numero_cursos_empresas',
        'datos_empresa',
        'cursos_complementarios',
        'coordenada_latitud_ambiente',
        'coordenada_longitud_ambiente',
        'impacto_procesos_formacion',
        'pertinencia_sector_productivo',
        'palabras_clave_ambiente',
        'observaciones_generales_ambiente',
        'soporte_fotos_ambiente',
        'numero_tecnicas_tecnologias',
        'numero_personas_certificadas',
        'numero_publicaciones',
        'numero_aprendices_beneficiados',
        'productividad_beneficiarios',
        'generacion_empleo',
        'creacion_empresas',
        'incorporacion_nuevos_conocimientos',
        'valor_agregado_entidades',
        'fortalecimiento_programas_formacion',
        'transferencia_tecnologias',
        'cod_proyectos_beneficiados',
        'cobertura_perntinencia_formacion',
        'dinamizador_sennova_id',
        'finalizado',
        'pdf_path'
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
     * Relationship with SeguimientoAmbienteModernizacion
     *
     * @return object
     */
    public function seguimientoAmbienteModernizacion()
    {
        return $this->belongsTo(SeguimientoAmbienteModernizacion::class);
    }

    /**
     * Relationship with tipologiaAmbiente
     *
     * @return object
     */
    public function tipologiaAmbiente()
    {
        return $this->belongsTo(TipologiaAmbiente::class);
    }

    /**
     * Relationship with disciplinaSubareaConocimiento
     *
     * @return object
     */
    public function disciplinaSubareaConocimiento()
    {
        return $this->belongsTo(DisciplinaSubareaConocimiento::class);
    }

    /**
     * Relationship with redConocimiento
     *
     * @return object
     */
    public function redConocimiento()
    {
        return $this->belongsTo(RedConocimiento::class);
    }

    /**
     * Relationship with actividadEconomica
     *
     * @return object
     */
    public function actividadEconomica()
    {
        return $this->belongsTo(ActividadEconomica::class);
    }

    /**
     * Relationship with lineaInvestigacion
     *
     * @return object
     */
    public function lineaInvestigacion()
    {
        return $this->belongsTo(LineaInvestigacion::class);
    }

    /**
     * Relationship with tematicaEstrategica
     *
     * @return object
     */
    public function tematicaEstrategica()
    {
        return $this->belongsTo(TematicaEstrategica::class);
    }

    /**
     * Relationship with User
     *
     * @return object
     */
    public function dinamizadorSennova()
    {
        return $this->belongsTo(User::class, 'dinamizador_sennova_id');
    }

    /**
     * Relationship with MesaSectorial
     *
     * @return object
     */
    public function mesasSectoriales()
    {
        return $this->belongsToMany(MesaSectorial::class, 'ambiente_modernizacion_mesa_sectorial', 'ambiente_modernizacion_id', 'mesa_sectorial_id');
    }

    /**
     * Relationship with CodigoProyectoSgps
     *
     * @return object
     */
    public function codigosProyectosSgps()
    {
        return $this->belongsToMany(CodigoProyectoSgps::class, 'ambiente_modernizacion_cod_proyectos', 'ambiente_modernizacion_id', 'codigo_proyecto_sgps_id');
    }

    /**
     * Relationship with ProgramaFormacion
     *
     * @return object
     */
    public function programasFormacion()
    {
        return $this->belongsToMany(ProgramaFormacion::class, 'ambiente_modernizacion_programa_formacion', 'ambiente_modernizacion_id', 'programa_formacion_id');
    }

    /**
     * Relationship with SemilleroInvestigacion
     *
     * @return object
     */
    public function semillerosInvestigacion()
    {
        return $this->belongsToMany(SemilleroInvestigacion::class, 'ambiente_modernizacion_semillero_investigacion', 'ambiente_modernizacion_id', 'semillero_investigacion_id');
    }

    /**
     * Filtrar registros
     *
     * @param  mixed $query
     * @param  mixed $filters
     * @return void
     */
    public function scopeFilterAmbienteModernizacion($query, array $filters)
    {
        $query->when($filters['search'] ?? null, function ($query, $search) {
            $query->where('nombre_ambiente', 'ilike', '%' . $search . '%');
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

    public function getYearModernizacionAttribute()
    {
        return date('Y', strtotime($this->created_at));
    }

    /**
     * getFechaSeguimientoAttribute
     *
     * @return void
     */
    public function getFechaSeguimientoAttribute()
    {
        return Carbon::parse($this->created_at, 'UTC')->locale('es')->isoFormat('DD [de] MMMM [de] YYYY');
    }

    public function getEstadoAttribute()
    {
        return $this->seguimientoAmbienteModernizacion->getNumeroSeguimientos();
    }

    public function getNombreCarpetaSharepointAttribute()
    {
        $cleaned = SharepointHelper::cleanWordsFromSpecialCharcters($this->seguimientoAmbienteModernizacion->codigo);

        // Convert to uppercase
        return strtoupper($cleaned);
    }

    public function getRutaFinalSharepointAttribute()
    {
        $ruta = '';
        if ($this->seguimientoAmbienteModernizacion) {
            $ruta = trim($this->seguimientoAmbienteModernizacion->centroFormacion->nombre_carpeta_sharepoint . '/SEGUIMIENTOS-POSTCIERRE-AMBIENTES-MODERNZIACION/' . $this->nombre_carpeta_sharepoint);
        }

        return $ruta;
    }

    public function getAllowedAttribute()
    {
        if (str_contains(request()->route()->uri, 'ambientes-modernizacion')) {

            $allowed_to_view      = Gate::inspect('view', [AmbienteModernizacion::class, $this]);
            $allowed_to_update    = Gate::inspect('update', [AmbienteModernizacion::class, $this]);
            $allowed_to_destroy   = Gate::inspect('delete', [AmbienteModernizacion::class, $this]);

            return collect(['to_view' => $allowed_to_view->allowed(), 'to_update' => $allowed_to_update->allowed(), 'to_destroy' => $allowed_to_destroy->allowed()]);
        }
    }
}
