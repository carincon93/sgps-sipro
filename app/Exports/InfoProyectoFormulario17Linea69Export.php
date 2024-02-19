<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\Exportable;
use Maatwebsite\Excel\Concerns\WithMultipleSheets;
use Maatwebsite\Excel\Concerns\WithTitle;
use App\Models\Convocatoria;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;

class InfoProyectoFormulario17Linea69Export implements WithMultipleSheets, WithTitle, ShouldAutoSize
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

        $sheets[] = new GeneralidadesTpExport($this->convocatoria);
        $sheets[] = new SemillerosInvestigacionExport($this->convocatoria, [4]);
        $sheets[] = new AnalisisRiesgosExport($this->convocatoria, [4]);
        $sheets[] = new AnexosExport($this->convocatoria, [4]);
        $sheets[] = new EfectosDirectosExport($this->convocatoria, [4]);
        $sheets[] = new EfectosIndirectosExport($this->convocatoria, [4]);
        $sheets[] = new CausasDirectasExport($this->convocatoria, [4]);
        $sheets[] = new CausasIndirectasExport($this->convocatoria, [4]);
        $sheets[] = new ImpactosExport($this->convocatoria, [4]);
        $sheets[] = new ResultadosExport($this->convocatoria, [4]);
        $sheets[] = new ObjetivosEspecificosExport($this->convocatoria, [4]);
        $sheets[] = new ActividadesExport($this->convocatoria, [4]);
        $sheets[] = new ProductosTaExport($this->convocatoria, 4);
        $sheets[] = new MunicipiosImpactadosExport($this->convocatoria, [4]);

        return $sheets;
    }

    /**
     * @return string
     */
    public function title(): string
    {
        return 'Proyectos TP';
    }
}
