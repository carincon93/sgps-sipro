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
        'ta_id',
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
     * Relationship with Ta
     *
     * @return object
     */
    public function ta()
    {
        return $this->belongsTo(Ta::class);
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
        $soatFileInfo               = pathinfo($this->soat);
        $tecnicomecanicaFileInfo    = pathinfo($this->tecnicomecanica);

        $arrayFileInfo = collect(['soatFilename' => $soatFileInfo['filename'], 'tecnicomecanicaFilename' => $tecnicomecanicaFileInfo['filename']]);

        return $arrayFileInfo ?? '';
    }

    public function getExtensionAttribute()
    {
        $soatFileInfo               = pathinfo($this->soat);
        $tecnicomecanicaFileInfo    = pathinfo($this->tecnicomecanica);

        $arrayFileInfo = collect(['soatExtension' => $soatFileInfo['extension'], 'tecnicomecanicaExtension' => $tecnicomecanicaFileInfo['extension']]);

        return $arrayFileInfo ?? '';
    }
}
