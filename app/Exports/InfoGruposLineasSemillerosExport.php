<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\Exportable;
use Maatwebsite\Excel\Concerns\WithMultipleSheets;
use Maatwebsite\Excel\Concerns\WithTitle;

class InfoGruposLineasSemillerosExport implements WithMultipleSheets, WithTitle
{
    use Exportable;

    protected $convocatoria;

    public function __construct()
    {
    }

    /**
     * @return array
     */
    public function sheets(): array
    {
        $sheets = [];

        $sheets[] = new GruposInvestigacionExport();
        $sheets[] = new LineasInvestigacionExport();
        $sheets[] = new GrupoRedesConocimientoExport();
        $sheets[] = new LineasInvestigacionProgramaFormacionExport();
        $sheets[] = new InfoSemillerosInvestigacionExport();
        $sheets[] = new SemilleroRedesConocimientoExport();
        $sheets[] = new SemillerosInvestigacionProgramaFormacionExport();
        $sheets[] = new SemillerosInvestigacionLineaInvestigacionExport();

        return $sheets;
    }

    /**
     * @return string
     */
    public function title(): string
    {
        return 'Información Grupos, líneas y semilleros';
    }
}
