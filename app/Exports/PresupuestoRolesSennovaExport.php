<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\Exportable;
use Maatwebsite\Excel\Concerns\WithMultipleSheets;
use Maatwebsite\Excel\Concerns\WithTitle;
use App\Models\Convocatoria;

class PresupuestoRolesSennovaExport implements WithMultipleSheets, WithTitle
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

        $sheets[] = new PresupuestosExport($this->convocatoria);
        $sheets[] = new RolesSennovaExport($this->convocatoria);

        return $sheets;
    }

    /**
     * @return string
     */
    public function title(): string
    {
        return 'Rúbrica presupuestal y roles SENNOVA';
    }
}
