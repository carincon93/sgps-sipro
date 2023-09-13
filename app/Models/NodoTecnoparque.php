<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Gate;

class NodoTecnoparque extends Model
{
    use HasFactory;

    /**
     * table
     *
     * @var string
     */
    protected $table = 'nodos_tecnoparque';

    /**
     * appends
     *
     * @var array
     */
    protected $appends = ['nombre_carpeta_sharepoint', 'allowed'];

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'centro_formacion_id',
        'nombre',
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
     * Relationship with ProyectoFormulario5Linea69
     *
     * @return object
     */
    public function proyectoFormulario5Linea69()
    {
        return $this->hasOne(ProyectoFormulario5Linea69::class);
    }

    /**
     * Relationship with ProyectoFormulario17Linea69
     *
     * @return object
     */
    public function proyectoFormulario17Linea69()
    {
        return $this->hasOne(ProyectoFormulario17Linea69::class, 'id');
    }

    /**
     * Relationship with TopeRolSennovaTecnoparque
     *
     * @return object
     */
    public function topesRolesSennovaTecnoparque()
    {
        return $this->hasMany(TopeRolSennovaTecnoparque::class, 'id');
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
     * Filtrar registros
     *
     * @param  mixed $query
     * @param  mixed $filters
     * @return void
     */
    public function scopeFilterNodoTecnoparque($query, array $filters)
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
        return "Última modificación de este formulario: " . Carbon::parse($value, 'UTC')->timezone('America/Bogota')->locale('es')->isoFormat('DD [de] MMMM [de] YYYY [a las] HH:mm:ss');
    }

    public function getNombreCarpetaSharepointAttribute()
    {
        return trim(preg_replace('/[^A-Za-z0-9\-ÁÉÍÓÚáéíóúÑñ]/', ' ', mb_strtoupper($this->nombre)));
    }

    public function getNombreAttribute($value)
    {
        return ucfirst($value);
    }

    public function getAllowedAttribute()
    {
        $allowed_to_view      = Gate::inspect('view', [NodoTecnoparque::class, $this]);
        $allowed_to_update    = Gate::inspect('update', [NodoTecnoparque::class, $this]);
        $allowed_to_destroy   = Gate::inspect('delete', [NodoTecnoparque::class, $this]);

        return collect(['to_view' => $allowed_to_view->allowed(), 'to_update' => $allowed_to_update->allowed(), 'to_destroy' => $allowed_to_destroy->allowed()]);
    }
}
