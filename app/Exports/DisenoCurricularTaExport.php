<?php

namespace App\Exports;

use App\Models\Convocatoria;
use App\Models\DisenoCurricular;
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

class DisenoCurricularTaExport implements FromCollection, WithHeadings, WithMapping, WithStyles, WithProperties, WithColumnFormatting, WithTitle, ShouldAutoSize
{
    protected $convocatoria;

    public function __construct(Convocatoria $convocatoria)
    {
        $this->convocatoria = $convocatoria;
    }

    /**
     * @return \Illuminate\Support\Collection
     */
    public function collection()
    {
        return DisenoCurricular::select('disenos_curriculares.*', 'proyectos.id as proyecto_id')
            ->join('proyecto_diseno_curricular', 'disenos_curriculares.id', 'proyecto_diseno_curricular.diseno_curricular_id')
            ->join('proyectos', 'proyecto_diseno_curricular.proyecto_id', 'proyectos.id')
            ->where('proyectos.convocatoria_id', $this->convocatoria->id)
            ->where('proyectos.linea_programatica_id', 5)
            ->get();
    }

    /**
     * @var Invoice $disCurricular
     */
    public function map($disCurricular): array
    {
        return [
            'SGPS-' . ($disCurricular->proyecto_id + 8000),
            $disCurricular->nombre,
            $disCurricular->codigo,

        ];
    }

    public function headings(): array
    {
        return [
            'Código del proyecto',
            'Nombre',
            'Código',
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
        return 'Diseño curricular';
    }

    public function properties(): array
    {
        return [
            'title' => 'Diseño curricular',
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
