<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\ProyectoPdfVersion;
use App\Models\Proyecto;

class GenerateTodosProyectosPdf extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'versioning:project-all';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Create version for generate PDF of all projects finalized';

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
        $projects = Proyecto::where('finalizado', true)->get();
        foreach ($projects as $project) {
            $version = $project->codigo . '-PDF-' . \Carbon\Carbon::now()->format('YmdHis');
            $project->PdfVersiones()->save(new ProyectoPdfVersion(['version' => $version]));
        }
    }
}
