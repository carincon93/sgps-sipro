<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Facades\Auth;
use Spatie\Permission\Models\Role as SpatieRole;

class Role extends SpatieRole
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name',
        'description',
        'guard_name',
        'visible_participantes'
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
     * Relationship with Proyecto (participants)
     *
     * @return object
     */
    public function participante()
    {
        return $this->hasMany(Participante::class);
    }

    /**
     * Filtrar registros
     *
     * @param  mixed $query
     * @param  mixed $filters
     * @return void
     */
    public function scopeFilterRole($query, array $filters)
    {
        $query->when($filters['search'] ?? null, function ($query, $search) {
            $search = str_replace('"', "", $search);
            $search = str_replace("'", "", $search);
            $search = str_replace(' ', '%%', $search);
            $query->whereRaw("unaccent(name) ilike unaccent('%" . $search . "%')");
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

    /**
     * getRolesByRol
     *
     * @return void
     */
    public static function getRolesByRol()
    {
        /** @var \App\Models\User */
        $authUser = Auth::user();

        $roles = [];
        if ($authUser->hasRole([28, 4, 22, 24, 2, 11, 10, 9, 7, 25, 21, 27, 14, 15, 13, 16, 12, 6])) {
            $roles = Role::select('id', 'name')->where('name', 'ilike', '%proponente%')->whereNotIn('id', [1])->orderBy('name')->get('id');
        } else if ($authUser->hasRole([5, 17, 18, 19, 20])) {
            $roles = Role::select('id', 'name')->orderBy('name')->whereNotIn('id', [1])->get('id');
        } else if ($authUser->hasRole([5, 17, 18, 19, 20])) {
            $roles = Role::select('id', 'name')->orderBy('name')->get('id');
        }

        return $roles;
    }
}
