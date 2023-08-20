<?php

namespace App\Models\Perfil;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class EstudioAcademico extends Model
{
    use HasFactory;

    /**
     * appends
     *
     * @var array
     */
    protected $appends = ['filename', 'extension', 'estudio_academico_text'];

    /**
     * table
     *
     * @var string
     */
    protected $table = 'estudios_academicos';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'grado_formacion',
        'titulo_obtenido',
        'soporte_titulo_obtenido',
        'user_id',
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

    public function getFilenameAttribute()
    {
        $file_info = pathinfo($this->soporte_titulo_obtenido);

        return $file_info['filename'] ?? '';
    }

    public function getExtensionAttribute()
    {
        $file_info = pathinfo($this->soporte_titulo_obtenido);

        return $file_info['extension'] ?? '';
    }

    public function getTituloObtenidoTextAttribute()
    {
        $file_path  = 'json/niveles-academicos.json';
        $id         = $this->grado_formacion;
        $key        = 'label';

        return $this->grado_formacion ? $this->getJsonItem($file_path, $id, $key) : null;
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

    public function getEstudioAcademicoTextAttribute()
    {
        return '(' . $this->grado_formacion_text . ') ' . $this->titulo_obtenido;
    }
}
