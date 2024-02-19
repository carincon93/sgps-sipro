<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\Exportable;
use Maatwebsite\Excel\Concerns\WithMultipleSheets;
use Maatwebsite\Excel\Concerns\WithTitle;
use App\Models\Convocatoria;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;

class InfoProyectoFormulario12Linea68Export implements WithMultipleSheets, WithTitle, ShouldAutoSize
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

        $sheets[] = new GeneralidadesProyectoFormulario12Linea68Export($this->convocatoria);
        $sheets[] = new AnalisisRiesgosExport($this->convocatoria, [12]);
        $sheets[] = new EfectosDirectosExport($this->convocatoria, [12]);
        $sheets[] = new CausasDirectasExport($this->convocatoria, [12]);
        $sheets[] = new ResultadosExport($this->convocatoria, [12]);
        $sheets[] = new ObjetivosEspecificosExport($this->convocatoria, [12]);
        $sheets[] = new ProductosExport($this->convocatoria, [12]);
        $sheets[] = new ProgramasFormacionCalificadosExport($this->convocatoria, [12]);
        // $sheets[] = new SemillerosInvestigacionExport($this->convocatoria, [12]);
        // $sheets[] = new AnexosExport($this->convocatoria, [12]);
        // $sheets[] = new EfectosIndirectosExport($this->convocatoria, [12]);
        // $sheets[] = new CausasIndirectasExport($this->convocatoria, [12]);
        // $sheets[] = new ImpactosExport($this->convocatoria, [12]);
        // $sheets[] = new ActividadesExport($this->convocatoria, [12]);
        // $sheets[] = new MunicipiosImpactadosExport($this->convocatoria, [12]);

        return $sheets;
    }

    /**
     * @return string
     */
    public function title(): string
    {
        return 'Proyectos Formulario 12';
    }
}
