<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\Exportable;
use Maatwebsite\Excel\Concerns\WithMultipleSheets;
use Maatwebsite\Excel\Concerns\WithTitle;

class InfoProyectosCapacidadInstaladaExport implements WithMultipleSheets, WithTitle
{
    use Exportable;

    public function __construct()
    {
        // 
    }

    /**
     * @return array
     */
    public function sheets(): array
    {
        $sheets = [];

        $sheets[] = new ProyectosCapacidadInstaladaExport();
        $sheets[] = new ProyectosCapacidadInstaladaProgramasFormacionImpactadosExport();
        $sheets[] = new ProyectosCapacidadInstaladaProgramasFormacionArticuladosExport();
        $sheets[] = new ProyectosCapacidadInstaladaEntidadesAliadasExport();
        $sheets[] = new ProyectosCapacidadInstaladaObjetivosEspecificosExport();

        return $sheets;
    }

    /**
     * @return string
     */
    public function title(): string
    {
        return 'Proyectos de capacidad instalada';
    }
}
