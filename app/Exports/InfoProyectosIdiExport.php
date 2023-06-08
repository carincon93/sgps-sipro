<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\Exportable;
use Maatwebsite\Excel\Concerns\WithMultipleSheets;
use Maatwebsite\Excel\Concerns\WithTitle;
use App\Models\Convocatoria;

class InfoProyectosIdiExport implements WithMultipleSheets, WithTitle
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

        $sheets[] = new GeneralidadesIdiExport($this->convocatoria);
        $sheets[] = new SemillerosInvestigacionExport($this->convocatoria, [1, 2, 29, 3]);
        $sheets[] = new AnalisisRiesgosExport($this->convocatoria, [1, 2, 29, 3]);
        $sheets[] = new AnexosExport($this->convocatoria, [1, 2, 29, 3]);
        $sheets[] = new EfectosDirectosExport($this->convocatoria, [1, 2, 29, 3]);
        $sheets[] = new EfectosIndirectosExport($this->convocatoria, [1, 2, 29, 3]);
        $sheets[] = new CausasDirectasExport($this->convocatoria, [1, 2, 29, 3]);
        $sheets[] = new CausasIndirectasExport($this->convocatoria, [1, 2, 29, 3]);
        $sheets[] = new ImpactosExport($this->convocatoria, [1, 2, 29, 3]);
        $sheets[] = new ResultadosExport($this->convocatoria, [1, 2, 29, 3]);
        $sheets[] = new ObjetivosEspecificosExport($this->convocatoria, [1, 2, 29, 3]);
        $sheets[] = new ActividadesExport($this->convocatoria, [1, 2, 29, 3]);
        $sheets[] = new ProductosIdiExport($this->convocatoria);
        $sheets[] = new MunicipiosImpactadosExport($this->convocatoria, [1, 2, 29, 3]);
        $sheets[] = new ProgramasFormacionArticuladosExport($this->convocatoria);
        $sheets[] = new ProgramasFormacionCalificadosExport($this->convocatoria, [1, 2, 29, 3]);
        $sheets[] = new EntidadesAliadasIdiExport($this->convocatoria);

        return $sheets;
    }

    /**
     * @return string
     */
    public function title(): string
    {
        return 'Proyectos I+D+i';
    }
}
