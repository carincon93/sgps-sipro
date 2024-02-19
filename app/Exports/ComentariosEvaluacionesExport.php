<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\Exportable;
use Maatwebsite\Excel\Concerns\WithMultipleSheets;
use Maatwebsite\Excel\Concerns\WithTitle;
use App\Models\Convocatoria;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;

class ComentariosEvaluacionesExport implements WithMultipleSheets, WithTitle, ShouldAutoSize
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

        $sheets[] = new IdiEvaluacionesExport($this->convocatoria);
        $sheets[] = new CulturaInnovacionEvaluacionesExport($this->convocatoria);
        $sheets[] = new STEvaluacionesExport($this->convocatoria);
        $sheets[] = new TAEvaluacionesExport($this->convocatoria);
        $sheets[] = new TPEvaluacionesExport($this->convocatoria);

        return $sheets;
    }

    /**
     * @return string
     */
    public function title(): string
    {
        return 'Comentarios evaluaciones';
    }
}
