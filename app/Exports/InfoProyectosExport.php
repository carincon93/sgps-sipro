<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\Exportable;
use Maatwebsite\Excel\Concerns\WithMultipleSheets;
use Maatwebsite\Excel\Concerns\WithTitle;
use App\Models\Convocatoria;

class InfoProyectosExport implements WithMultipleSheets, WithTitle
{
    use Exportable;

    protected $convocatoria;

    public function __construct(Convocatoria $convocatoria)
    {
        $this->convocatoria = $convocatoria;
    }

    /**
     * @return array
     */
    public function sheets(): array
    {
        $sheets = [];

        $sheets[] = new ProyectosExport($this->convocatoria);
        $sheets[] = new EntidadesAliadasIdiExport($this->convocatoria);
        $sheets[] = new EntidadesAliadasTaExport($this->convocatoria);
        $sheets[] = new ProgramasFormacionArticuladosExport($this->convocatoria);
        $sheets[] = new ProgramasFormacionCalificadosExport($this->convocatoria, [1, 2, 29, 3, 9, 10]);

        return $sheets;
    }

    /**
     * @return string
     */
    public function title(): string
    {
        return 'Proyectos';
    }
}
