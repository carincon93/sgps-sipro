<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ConvocatoriaRolSennova extends Model
{
    use HasFactory;

    /**
     * table
     *
     * @var string
     */
    protected $table = 'convocatoria_rol_sennova';

    /**
     * appends
     *
     * @var array
     */
    protected $appends = [];

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'tipo_formulario_convocatoria_id',
        'convocatoria_id',
        'rol_sennova_id',
        'asignacion_mensual',
        'experiencia',
        'nivel_academico',
        'sumar_al_presupuesto',
        'perfil',
        'mensaje',
        'habilitado',
        'meses_maximos'
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
     * Relationship with Convocatoria
     *
     * @return object
     */
    public function convocatoria()
    {
        return $this->belongsTo(Convocatoria::class);
    }

    /**
     * Relationship with RolSennova
     *
     * @return object
     */
    public function rolSennova()
    {
        return $this->belongsTo(RolSennova::class);
    }

    /**
     * Relationship with TipoFormularioConvocatoria
     *
     * @return object
     */
    public function tipoFormularioConvocatoria()
    {
        return $this->belongsTo(TipoFormularioConvocatoria::class);
    }

    /**
     * Relationship with ProyectoRolSennova
     *
     * @return object
     */
    public function proyectoRolesSennova()
    {
        return $this->hasMany(ProyectoRolSennova::class);
    }

    /**
     * Relationship with TopeRolSennovaTecnoparque
     *
     * @return object
     */
    public function topesRolesSennovaTecnoparque()
    {
        return $this->hasMany(TopeRolSennovaTecnoparque::class);
    }

    /**
     * Relationship with TopeRolSennovaHubInnovacion
     *
     * @return object
     */
    public function topesRolesSennovaHubInnovacion()
    {
        return $this->hasMany(TopeRolSennovaHubInnovacion::class);
    }

    /**
     * Relationship with TopeRolSennovaTecnoacademia
     *
     * @return object
     */
    public function topesRolesSennovaTecnoacademia()
    {
        return $this->hasMany(TopeRolSennovaTecnoacademia::class);
    }

    /**
     * Relationship with TopeRolSennovaFormulario13
     *
     * @return object
     */
    public function topesRolesSennovaFormulario13()
    {
        return $this->hasMany(TopeRolSennovaFormulario13::class);
    }

    /**
     * Relationship with TopeRolSennovaFormulario15
     *
     * @return object
     */
    public function topesRolesSennovaFormulario15()
    {
        return $this->hasMany(TopeRolSennovaFormulario15::class);
    }

    /**
     * Relationship with TopeRolSennovaFormulario16
     *
     * @return object
     */
    public function topesRolesSennovaFormulario16()
    {
        return $this->hasMany(TopeRolSennovaFormulario16::class);
    }

    /**
     * Filtrar registros
     *
     * @param  mixed $query
     * @param  mixed $filters
     * @return void
     */
    public function scopeFilterConvocatoriaRolSennova($query, array $filters)
    {
        $query->when($filters['search'] ?? null, function ($query, $search) {
            $search = str_replace('"', "", $search);
            $search = str_replace("'", "", $search);
            $search = str_replace(' ', '%%', $search);
            $query->whereRaw("unaccent(roles_sennova.nombre) ilike unaccent('%" . $search . "%')");
            $query->orWhereRaw("unaccent(lineas_programaticas.nombre) ilike unaccent('%" . $search . "%')");
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

    public function getNivelAcademicoFormateadoAttribute()
    {
        $nivelAcademico = "";

        switch ($this->nivel_academico) {
            case 1:
                $nivelAcademico =  "técnico";
                break;
            case 2:
                $nivelAcademico =  "tecnólogo";
                break;
            case 3:
                $nivelAcademico =  "pregrado";
                break;
            case 4:
                $nivelAcademico =  "especalización";
                break;
            case 5:
                $nivelAcademico =  "maestría";
                break;
            case 6:
                $nivelAcademico =  "doctorado";
                break;
            case 7:
                $nivelAcademico =  "ninguno";
                break;
            case 8:
                $nivelAcademico =  "especialización";
                break;
            case 9:
                $nivelAcademico =  "con especialización";
                break;
            default:
                break;
        }

        return $nivelAcademico;
    }
}
