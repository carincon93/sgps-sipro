<?php

namespace App\Exports;

use App\Models\AnalisisRiesgo;
use App\Models\Convocatoria;
use Illuminate\Support\Facades\Storage;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use Maatwebsite\Excel\Concerns\WithTitle;
use PhpOffice\PhpSpreadsheet\Style\NumberFormat;
use Maatwebsite\Excel\Concerns\WithColumnFormatting;
use Maatwebsite\Excel\Concerns\WithProperties;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Style\Fill;

class AnalisisRiesgosExport implements FromCollection, WithHeadings, WithMapping, WithStyles, WithProperties, WithColumnFormatting, WithTitle, ShouldAutoSize
{
    protected $convocatoria;
    protected $tipo_formulario_convocatoria_id;

    public function __construct(Convocatoria $convocatoria,  $tipo_formulario_convocatoria_id)
    {
        $this->convocatoria = $convocatoria;
        $this->tipo_formulario_convocatoria_id = $tipo_formulario_convocatoria_id;
    }

    /**
     * @return \Illuminate\Support\Collection
     */
    public function collection()
    {
        return AnalisisRiesgo::select('analisis_riesgos.*', 'proyectos.id as proyecto_id')
            ->join('proyectos', 'analisis_riesgos.id', 'proyectos.id')
            ->where('proyectos.convocatoria_id', $this->convocatoria->id)
            ->whereIn('proyectos.tipo_formulario_convocatoria_id', $this->tipo_formulario_convocatoria_id)
            ->orderBy('proyectos.id')
            ->get();
    }

    /**
     * @var Invoice $analisisRiesgo
     */
    public function map($analisisRiesgo): array
    {
        return [
            'SGPS-' . ($analisisRiesgo->proyecto_id + 8000),
            collect(json_decode(Storage::get('json/niveles-riesgo.json'), true))->firstWhere('value', $analisisRiesgo->nivel)['label'],
            collect(json_decode(Storage::get('json/tipos-riesgo.json'), true))->firstWhere('value', $analisisRiesgo->tipo)['label'],
            $analisisRiesgo->descripcion,
            collect(json_decode(Storage::get('json/impactos-riesgo.json'), true))->firstWhere('value', $analisisRiesgo->impacto)['label'],
            collect(json_decode(Storage::get('json/probabilidades-riesgo.json'), true))->firstWhere('value', $analisisRiesgo->probabilidad)['label'],
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
        $sheet->getStyle('A1:' . $sheet->getHighestColumn() . '1')->applyFromArray([
            'font' => [
                'bold' => true,
                'color' => ['rgb' => '000000'],
            ],
            'fill' => [
                'fillType'   => Fill::FILL_SOLID,
                'startColor' => ['rgb' => 'edfdf3'],
            ],

        ]);

        $sheet->getStyle('A1:Z' . ($sheet->getHighestRow()))->applyFromArray([
            'borders' => [
                'allBorders' => [
                    'borderStyle' => Border::BORDER_THIN,
                    'color' => ['rgb' => '000000'],
                ],
            ],
        ]);
    }
}
