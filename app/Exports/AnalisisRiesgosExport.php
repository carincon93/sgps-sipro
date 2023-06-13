<?php

namespace App\Exports;

use App\Models\AnalisisRiesgo;
use App\Models\Convocatoria;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use Maatwebsite\Excel\Concerns\WithTitle;
use PhpOffice\PhpSpreadsheet\Style\NumberFormat;
use Maatwebsite\Excel\Concerns\WithColumnFormatting;
use Maatwebsite\Excel\Concerns\WithProperties;

class AnalisisRiesgosExport implements FromCollection, WithHeadings, WithMapping, WithStyles, WithProperties, WithColumnFormatting, WithTitle
{
    protected $convocatoria;

    public function __construct(Convocatoria $convocatoria, $lineasProgramaticasId)
    {
        $this->convocatoria = $convocatoria;
        $this->lineasProgramaticasId = $lineasProgramaticasId;
    }

    /**
     * @return \Illuminate\Support\Collection
     */
    public function collection()
    {
        return AnalisisRiesgo::select('analisis_riesgos.*', 'proyectos.id as proyecto_id')
            ->join('proyectos', 'analisis_riesgos.id', 'proyectos.id')
            ->where('proyectos.convocatoria_id', $this->convocatoria->id)
            ->whereIn('proyectos.linea_programatica_id', $this->lineasProgramaticasId)
            ->whereNotIn('proyectos.id', [1052, 1113])
            ->get();
    }

    /**
     * @var Invoice $analisisRiesgo
     */
    public function map($analisisRiesgo): array
    {
        return [
            'SGPS-' . ($analisisRiesgo->proyecto_id + 8000),
            $analisisRiesgo->nivel,
            $analisisRiesgo->tipo,
            $analisisRiesgo->descripcion,
            $analisisRiesgo->impacto,
            $analisisRiesgo->probabilidad,
            $analisisRiesgo->efectos,
            $analisisRiesgo->medidas_mitigacion,
        ];
    }

    public function headings(): array
    {
        return [
            'Código del proyecto',
            'Nivel',
            'Tipo',
            'Descripción',
            'Impacto',
            'Probabilidad',
            'Efectos',
            'Medidas de mitigación',
        ];
    }

    public function columnFormats(): array
    {
        return [];
    }

    /**
     * @return string
     */
    public function title(): string
    {
        return 'Análisis de riesgos';
    }

    public function properties(): array
    {
        return [
            'title' => 'Análisis de riesgos',
        ];
    }

    public function styles(Worksheet $sheet)
    {
        return [
            // Style the first row as bold text.
            1    => ['font' => ['bold' => true]],
        ];
    }
}
