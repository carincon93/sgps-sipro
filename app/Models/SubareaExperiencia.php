<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SubareaExperiencia extends Model
{
    use HasFactory;

     /**
     * table
     *
     * @var string
     */
    protected $table = 'subareas_experiencia';

    /**
     * appends
     *
     * @var array
     */
    protected $appends = [
        //
    ];

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'nombre',
        'area_experiencia_id'
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
     * Relationship with AreaExperiencia
     *
     * @return object
     */
    public function areaExperiencia()
    {
        return $this->belongsTo(AreaExperiencia::class);
    }

    /**
     * Relationship with User
     *
     * @return object
     */
    public function users()
    {
        return $this->hasMany(User::class);
    }

    /**
     * Filtrar registros
     *
     * @param  mixed $query
     * @param  mixed $filters
     * @return void
     */
    public function scopeFilterSubareaExperiencia($query, array $filters)
    {
        $query->when($filters['search'] ?? null, function ($query, $search) {
            $search = str_replace('"', "", $search);
            $search = str_replace("'", "", $search);
            $search = str_replace(' ', '%%', $search);
            $query->whereRaw("unaccent(descripcion) ilike unaccent('%" . $search . "%')");
        });
    }
}
