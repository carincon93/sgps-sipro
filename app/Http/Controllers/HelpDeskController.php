<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Inertia\Inertia;

class HelpDeskController extends Controller
{
    /**
     * Show the form for reporting a new issue.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        return Inertia::render('HelpDesk/Create');
    }

    /**
     * Report issue and create a card in Trello.
     *
     */
    public function report(Request $request)
    {
        $request->validate([
            'email'         => 'required|email',
            'archivo'       => 'required|url|string',
            'descripcion'   => 'required'
        ]);

        $descripcion    = $request->get('descripcion');
        $email          = $request->get('email');
        $file           = $request->get('archivo');

        $cardResponse = Http::post('https://api.trello.com/1/cards', [
            'key'       => 'eebbb4b8a1d8302e70dd02a4a7f9d81d',
            'token'     => '3b75378981e2a5dea40fbc2296ec9e99468efef3980e896e14b483f564ddefcb',
            'idList'    => '603a99d2b6ddfb7a2f801d03',
            'name'      => 'Reporte de fallo ' . date('Y-m-d H:i:s'),
            'desc'      => $descripcion . " - Correo electrónico {$email} - Archivo {$file}",
            'pos'       => 'top',
            'due'       => date("Y-m-d H:i:s", strtotime("+1 hours"))
        ]);

        Http::post('https://discord.com/api/webhooks/815068465903697940/mwMaxy7lHPvD3j7KPi0itjaLOrKEC8sbl9_6IISCIlCTwNhHpvQh7QHgYQ9k9JglxrKy', [
            'username'  => 'Taco',
            'content'   => "¡Hola! Han reportado un nuevo requerimiento o fallo, por favor revísalo en el siguiente enlace {$cardResponse->json()['shortUrl']}",
        ]);

        if ($cardResponse->ok()) {
            $message = 'El área de sistemas ha sido notificado del error. En breve recibirá una respuesta al correo.';
        }

        return back()->with('status', $message ?? 'Ha ocurrido un error. Intentelo de nuevo más tarde');
    }
}
