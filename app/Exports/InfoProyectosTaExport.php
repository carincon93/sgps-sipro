<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\Exportable;
use Maatwebsite\Excel\Concerns\WithMultipleSheets;
use Maatwebsite\Excel\Concerns\WithTitle;
use App\Models\Convocatoria;

class InfoProyectosTaExport implements WithMultipleSheets, WithTitle
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

        $sheets[] = new GeneralidadesTaExport($this->convocatoria);
        $sheets[] = new GruposInvestigacionTaExport($this->convocatoria, 5);
        $sheets[] = new SemillerosInvestigacionExport($this->convocatoria, [5]);
        $sheets[] = new LineasInvestigacionTaExport($this->convocatoria, 5);
        $sheets[] = new DisciplinasSubareaConocimientoTaExport($this->convocatoria);
        $sheets[] = new RedesConocimientoTaExport($this->convocatoria);
        $sheets[] = new TematicasEstrategicasTaExport($this->convocatoria);
        $sheets[] = new ActividadesEconomicasTaExport($this->convocatoria);
        $sheets[] = new ProgramasFormacionTaExport($this->convocatoria);
        $sheets[] = new EdtTaExport($this->convocatoria);
        $sheets[] = new ProductosTaExport($this->convocatoria, 5);
        $sheets[] = new AnalisisRiesgosExport($this->convocatoria, [5]);
        $sheets[] = new EntidadesAliadasTaExport($this->convocatoria);
        $sheets[] = new AnexosExport($this->convocatoria, [5]);
        $sheets[] = new EfectosDirectosExport($this->convocatoria, [5]);
        $sheets[] = new EfectosIndirectosExport($this->convocatoria, [5]);
        $sheets[] = new CausasDirectasExport($this->convocatoria, [5]);
        $sheets[] = new CausasIndirectasExport($this->convocatoria, [5]);
        $sheets[] = new ImpactosExport($this->convocatoria, [5]);
        $sheets[] = new ResultadosExport($this->convocatoria, [5]);
        $sheets[] = new ObjetivosEspecificosExport($this->convocatoria, [5]);
        $sheets[] = new ActividadesExport($this->convocatoria, [5]);
        $sheets[] = new DisenoCurricularTaExport($this->convocatoria);
        $sheets[] = new MunicipiosImpactadosExport($this->convocatoria, [5]);
        $sheets[] = new MunicipiosAImpactarTaExport($this->convocatoria, 5);

        return $sheets;
    }

    /**
     * @return string
     */
    public function title(): string
    {
        return 'Proyectos TA';
    }
}
