<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\PdfController;
use App\Models\ProyectoPdfVersion;
use App\Notifications\ProyectoVersion;

class GenerateProyectoPdf extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'versionamiento:proyecto';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Generar versión PDF del proyecto';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $pdfVersion = ProyectoPdfVersion::where('estado', 0)->orderBy('created_at', 'asc')->first();

        if (!empty($pdfVersion)) {
            PdfController::generateResumenProyecto($pdfVersion->proyecto->convocatoria, $pdfVersion->proyecto, $pdfVersion->version);
            $same = ProyectoPdfVersion::find($pdfVersion->id);
            // if (!empty($same) && $same->estado == 1) {
            //     $user = $pdfVersion->proyecto->participantes()->where('es_formulador', true)->first();
            //     if (!empty($user)) {
            //         $user->notify(new ProyectoVersion($same));
            //     }
            // }
        }
    }
}
