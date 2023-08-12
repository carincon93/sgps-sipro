<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AulaMovil extends Model
{
    use HasFactory;

    /**
     * table
     *
     * @var string
     */
    protected $table = 'aulas_moviles';

    /**
     * appends
     *
     * @var array
     */
    protected $appends = ['filename', 'extension'];

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'proeycto_linea70_id',
        'placa',
        'modelo',
        'logros_vigencia',
        'numero_municipios_visitados',
        'numero_aprendices_beneficiados',
        'estado',
        'modulos_interactivos',
        'acciones_a_desarrollar',
        'numero_aprendices_a_beneficiar',
        'recursos_mantenimiento',
        'soat',
        'tecnicomecanica',
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
     * Relationship with ProyectoFormulario4Linea70
     *
     * @return object
     */
    public function proyectoFormulario4Linea70()
    {
        return $this->belongsTo(ProyectoFormulario4Linea70::class);
    }

    /**
     * Filtrar registros
     *
     * @param  mixed $query
     * @param  mixed $filters
     * @return void
     */
    public function scopeFilterAulaMovil($query, array $filters)
    {
        $query->when($filters['search'] ?? null, function ($query, $search) {
            $query->where('placa', 'ilike', '%' . $search . '%');
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

    public function getFilenameAttribute()
    {
        $soat_file_info               = pathinfo($this->soat);
        $tecnicomecanica_file_info    = pathinfo($this->tecnicomecanica);

        $array_file_info = collect(['soat_filename' => $soat_file_info['filename'] ?? '', 'tecnicomecanica_filename' => $tecnicomecanica_file_info['filename'] ?? '']);

        return $array_file_info ?? '';
    }

    public function getExtensionAttribute()
    {
        $soat_file_info               = pathinfo($this->soat);
        $tecnicomecanica_file_info    = pathinfo($this->tecnicomecanica);

        $array_file_info = collect(['soat_extension' => $soat_file_info['extension'] ?? '', 'tecnicomecanica_extension' => $tecnicomecanica_file_info['extension'] ?? '']);

        return $array_file_info ?? '';
    }
}
