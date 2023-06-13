<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\Exportable;
use Maatwebsite\Excel\Concerns\WithMultipleSheets;
use Maatwebsite\Excel\Concerns\WithTitle;
use App\Models\Convocatoria;

class InfoProyectosStExport implements WithMultipleSheets, WithTitle
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

        $sheets[] = new GeneralidadesStExport($this->convocatoria, [10]);
        $sheets[] = new AnalisisRiesgosExport($this->convocatoria, [10]);
        $sheets[] = new AnexosExport($this->convocatoria, [10]);
        $sheets[] = new EfectosDirectosExport($this->convocatoria, [10]);
        $sheets[] = new EfectosIndirectosExport($this->convocatoria, [10]);
        $sheets[] = new CausasDirectasExport($this->convocatoria, [10]);
        $sheets[] = new CausasIndirectasExport($this->convocatoria, [10]);
        $sheets[] = new ImpactosExport($this->convocatoria, [10]);
        $sheets[] = new ResultadosExport($this->convocatoria, [10]);
        $sheets[] = new ObjetivosEspecificosExport($this->convocatoria, [10]);
        $sheets[] = new ActividadesExport($this->convocatoria, [10]);
        $sheets[] = new ProductosStExport($this->convocatoria);
        $sheets[] = new ProgramasFormacionCalificadosExport($this->convocatoria, [10]);
        $sheets[] = new InventariosEquiposStExport($this->convocatoria);

        return $sheets;
    }

    /**
     * @return string
     */
    public function title(): string
    {
        return 'Proyectos Servicios Tecnológicos';
    }
}
