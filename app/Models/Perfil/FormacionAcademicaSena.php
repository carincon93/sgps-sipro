<?php

namespace App\Models\Perfil;

use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class FormacionAcademicaSena extends Model
{
    use HasFactory;

     /**
     * appends
     *
     * @var array
     */
    protected $appends = ['fechas_formacion', 'egresado_sena_text', 'modalidad_sena_text', 'nivel_sena_text', 'filename_certificado_formacion'];

    /**
     * table
     *
     * @var string
     */
    protected $table = 'formaciones_academicas_sena';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'egresado_sena',
        'modalidad_sena',
        'nivel_sena',
        'titulo_obtenido',
        'fecha_inicio_formacion',
        'fecha_finalizacion_formacion',
        'certificado_formacion',
        'user_id'
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
     * Relationship with User
     *
     * @return object
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * getUpdatedAtAttribute
     *
     * @return void
     */
    public function getFechasFormacionAttribute()
    {
        $fechaInicio        = Carbon::parse($this->fecha_inicio_formacion, 'UTC')->timezone('America/Bogota')->timezone('America/Bogota')->locale('es')->isoFormat('DD [de] MMMM [de] YYYY');
        $fechaFinalizacion  = Carbon::parse($this->fecha_finalizacion_formacion, 'UTC')->timezone('America/Bogota')->timezone('America/Bogota')->locale('es')->isoFormat('DD [de] MMMM [de] YYYY');

        return "Del $fechaInicio al $fechaFinalizacion";
    }

    public function getEgresadoSenaTextAttribute()
    {
        return $this->egresado_sena ? 'Si' : 'No';
    }

    public function getModalidadSenaTextAttribute()
    {
        $filePath   = "json/modalidades-estudio.json";
        $id         = $this->modalidad_sena;
        $key        = "label";

        return $this->getJsonItem($filePath, $id, $key);
    }

    public function getNivelSenaTextAttribute()
    {
        $filePath   = "json/niveles-formacion.json";
        $id         = $this->nivel_sena;
        $key        = "label";

        return $this->getJsonItem($filePath, $id, $key);
    }

    private function getJsonItem($filePath, $id, $key)
    {
        $data   = json_decode(Storage::get($filePath), true);

        $where = function ($item) use ($id) {
            return $item['value'] == $id;
        };

        $filteredData = array_filter($data, $where);

        return reset($filteredData)[$key];
    }

    public function getFilenameCertificadoFormacionAttribute()
    {
        $pathExplode = explode('/', $this->certificado_formacion);

        return end($pathExplode);
    }
}
