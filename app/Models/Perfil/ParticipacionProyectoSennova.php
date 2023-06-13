<?php

namespace App\Models\Perfil;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class ParticipacionProyectoSennova extends Model
{
    use HasFactory;

    /**
     * appends
     *
     * @var array
     */
    protected $appends = ['tipo_proyecto_text'];

    /**
     * table
     *
     * @var string
     */
    protected $table = 'participaciones_proyectos_sennova';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'tipo_proyecto',
        'codigo_proyecto',
        'titulo',
        'fecha_inicio_proyecto',
        'fecha_finalizacion_proyecto',
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


    public function getTipoProyectoTextAttribute()
    {
        $filePath   = "json/tipos-proyectos.json";
        $id         = $this->tipo_proyecto;
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
}
