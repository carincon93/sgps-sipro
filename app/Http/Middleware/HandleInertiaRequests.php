<?php

namespace App\Http\Middleware;

use App\Models\AmbienteModernizacion;
use App\Models\Convocatoria;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Session;
use Inertia\Middleware;
use Tightenco\Ziggy\Ziggy;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): string|null
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return array_merge(parent::share($request), [
            'csrf_token'    => csrf_token(),
            'allowed'       => collect([
                'ambientes_modernizacion' => Gate::inspect('viewAny', [AmbienteModernizacion::class])->allowed()
            ]),
            'auth' => [
                'user'                  => $request->user() ? $request->user()->only('id', 'nombre', 'nombre_usuario', 'email', 'roles', 'can', 'can_by_user', 'informacion_completa', 'check_soportes_titulo_obtenido', 'check_certificados_formacion', 'centro_formacion_id') : null,
                'notificaciones'        => $request->user() ? $request->user()->unreadNotifications()->orderBy('created_at', 'DESC')->take(3)->get() : null,
                'numeroNotificaciones'  => $request->user() ? $request->user()->unreadNotifications()->count() : 0
            ],
            'flash' => [
                'success'   => fn () => $request->session()->get('success'),
                'error'     => fn () => $request->session()->get('error'),
                'warn'      => fn () => $request->session()->get('warn'),
            ],
            'ziggy' => function () use ($request) {
                return array_merge((new Ziggy)->toArray(), [
                    'location'  => $request->url(),
                    'query'     => $request->query()
                ]);
            },
        ]);
    }
}
