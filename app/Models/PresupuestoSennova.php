<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PresupuestoSennova extends Model
{
    use HasFactory;

    /**
     * table
     *
     * @var string
     */
    protected $table = 'presupuesto_sennova';

    /**
     * appends
     *
     * @var array
     */
    public $appends = ['codigo'];

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'primer_grupo_presupuestal_id',
        'segundo_grupo_presupuestal_id',
        'tercer_grupo_presupuestal_id',
        'uso_presupuestal_id',
        'linea_programatica_id',
        'requiere_estudio_mercado',
        'sumar_al_presupuesto',
        'mensaje',
        'habilitado'
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
     * Relationship with PrimerGrupoPresupuestal
     *
     * @return object
     */
    public function primerGrupoPresupuestal()
    {
        return $this->belongsTo(PrimerGrupoPresupuestal::class);
    }

    /**
     * Relationship with SegundoGrupoPresupuestal
     *
     * @return object
     */
    public function segundoGrupoPresupuestal()
    {
        return $this->belongsTo(SegundoGrupoPresupuestal::class);
    }

    /**
     * Relationship with TercerGrupoPresupuestal
     *
     * @return object
     */
    public function tercerGrupoPresupuestal()
    {
        return $this->belongsTo(TercerGrupoPresupuestal::class);
    }

    /**
     * Relationship with UsoPresupuestal
     *
     * @return object
     */
    public function usoPresupuestal()
    {
        return $this->belongsTo(UsoPresupuestal::class);
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
     * Relationship with ConvocatoriaPresupuesto
     *
     * @return object
     */
    public function convocatoriaPresupuesto()
    {
        return $this->hasMany(ConvocatoriaPresupuesto::class);
    }

    /**
     * Filtrar registros
     *
     * @param  mixed $query
     * @param  mixed $filters
     * @return void
     */
    public function scopeFilterPresupuestoSennova($query, array $filters)
    {
        $query->when($filters['search'] ?? null, function ($query, $search) {
            $search = str_replace('"', "", $search);
            $search = str_replace("'", "", $search);
            $search = str_replace(' ', '%%', $search);
            $query->whereRaw("unaccent(mensaje) ilike unaccent('%" . $search . "%')");
            $query->orWhere('lineas_programaticas.codigo', 'ilike', $search);
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
     * getCodigoAttribute
     *
     * @return void
     */
    public function getCodigoAttribute()
    {
        return 'PS-' . sprintf("%04s", $this->id) . '-' . date('Y', strtotime($this->created_at));
    }
}
