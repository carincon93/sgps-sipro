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
    protected $appends = ['fechas_formacion', 'extension', 'filename', 'formacion_academica_sena_text'];

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

    public function getFilenameAttribute()
    {
        $file_info = pathinfo($this->certificado_formacion);

        return $file_info['filename'] ?? '';
    }

    public function getExtensionAttribute()
    {
        $file_info = pathinfo($this->certificado_formacion);

        return $file_info['extension'] ?? '';
    }

    public function getModalidadSenaTextAttribute()
    {
        $file_path  = 'json/modalidades-estudio.json';
        $id         = $this->modalidad_sena;
        $key        = 'label';

        return $this->modalidad_sena ? $this->getJsonItem($file_path, $id, $key) : null;
    }

    public function getNivelSenaTextAttribute()
    {
        $file_path  = 'json/niveles-formacion.json';
        $id         = $this->nivel_sena;
        $key        = 'label';

        return $this->nivel_sena ? $this->getJsonItem($file_path, $id, $key) : null;
    }

    public function getFormacionAcademicaSenaTextAttribute()
    {
        $egresado_sena = $this->egresado_sena ? 'Si' : 'No';

        return '¿Es egresaso SENA?' . $egresado_sena . ' - Modalidad: ' . $this->modalidad_sena_text . ' - Nivel: ' . $this->nivel_sena_text . ' - Título: ' . $this->titulo_obtenido;
    }

    private function getJsonItem($file_path, $id, $key)
    {
        $data   = json_decode(Storage::get($file_path), true);

        $where = function ($item) use ($id) {
            return $item['value'] == $id;
        };

        $filtered_data = array_filter($data, $where);

        return reset($filtered_data)[$key];
    }
}
