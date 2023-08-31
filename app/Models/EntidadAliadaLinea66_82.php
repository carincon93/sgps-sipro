<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EntidadAliadaLinea66_82 extends Model
{
    use HasFactory;

    /**
     * table
     *
     * @var string
     */
    protected $table = 'entidades_aliadas_linea_66_82';

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
        'entidad_aliada_id',
        'descripcion_convenio',
        'grupo_investigacion',
        'codigo_gruplac',
        'enlace_gruplac',
        'actividades_transferencia_conocimiento',
        'carta_intencion',
        'carta_propiedad_intelectual',
        'recursos_especie',
        'descripcion_recursos_especie',
        'recursos_dinero',
        'descripcion_recursos_dinero',
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
     * Relationship with EntidadAliada
     *
     * @return object
     */
    public function entidadAliada()
    {
        return $this->belongsTo(EntidadAliada::class);
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
        $carta_intencion_file_info               = pathinfo($this->carta_intencion);
        $carta_propiedad_intelectual_file_info   = pathinfo($this->carta_propiedad_intelectual);

        $array_file_info = collect(['carta_intencion_filename' =>  $carta_intencion_file_info['filename'] ?? '', 'carta_propiedad_intelectual_filename' => $carta_propiedad_intelectual_file_info['filename'] ?? '']);

        return $array_file_info ?? '';
    }

    public function getExtensionAttribute()
    {
        $carta_intencion_file_info               = pathinfo($this->carta_intencion);
        $carta_propiedad_intelectual_file_info   = pathinfo($this->carta_propiedad_intelectual);

        $array_file_info = collect(['carta_intencion_extension' => $carta_intencion_file_info['extension'] ?? '', 'carta_propiedad_intelectual_extension' => $carta_propiedad_intelectual_file_info['extension'] ?? '']);

        return $array_file_info ?? '';
    }
}
