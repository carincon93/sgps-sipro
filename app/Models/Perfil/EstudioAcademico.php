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
    protected $appends = ['grado_formacion_text', 'filename_soporte_titulo_obtenido'];

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

    public function getGradoFormacionTextAttribute()
    {
        $data   = json_decode(Storage::get("json/niveles-academicos.json"), true);
        $id     = $this->grado_formacion;

        $where = function ($item) use ($id) {
            return $item['value'] == $id;
        };

        $filteredData = array_filter($data, $where);

        return reset($filteredData)['label'];
    }

    public function getFilenameSoporteTituloObtenidoAttribute()
    {
        $pathExplode = explode('/', $this->soporte_titulo_obtenido);

        return end($pathExplode);
    }
}
