<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class PasswordResetLinkController extends Controller
{
    /**
     * Display the password reset link request view.
     *
     * @return \Illuminate\View\View
     */
    public function create()
    {
        return Inertia::render('Auth/ForgotPassword', [
            'status' => session('status'),
        ]);
    }

    /**
     * Handle an incoming password reset link request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request)
    {
        $request->validate([
            'email'             => 'required|email|exists:users,email',
            'numero_documento'  => 'required|integer|exists:users,numero_documento',
        ]);

        // We will send the password reset link to this user. Once we have attempted
        // to send the link, we will examine the response then see the message we
        // need to show to the user. Finally, we'll send out a proper response.
        // $status = Password::sendResetLink(
        //     $request->only('email')
        // );


        // if ($status == Password::RESET_LINK_SENT) {
        //     return back()->with('status', __($status));
        // }

        // throw ValidationException::withMessages([
        //     'email' => [trans($status)],
        // ]);

        $user = User::where('email', $request->email)->where('numero_documento', $request->numero_documento)->first();

        if ($user && $request->email == $user->email && $request->numero_documento == $user->numero_documento) {
            $user->update([
                'password' => $user::makePassword($request->numero_documento)
            ]);
            return back()->with('success', 'Se ha restablecido la contraseña.');
        }

        return back()->with('error', 'No se ha podido restablecer la contraseña.');
    }
}
