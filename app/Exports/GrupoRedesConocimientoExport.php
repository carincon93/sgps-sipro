<?php

namespace App\Exports;

use App\Models\RedConocimiento;
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

class GrupoRedesConocimientoExport implements FromCollection, WithHeadings, WithMapping, WithStyles, WithProperties, WithColumnFormatting, WithTitle, ShouldAutoSize
{

    public function __construct()
    {
    }

    /**
     * @return \Illuminate\Support\Collection
     */
    public function collection()
    {
        return RedConocimiento::select('redes_conocimiento.*', 'grupos_investigacion.nombre as nombre_grupo', 'centros_formacion.codigo as codigo_centro', 'centros_formacion.nombre as nombre_centro')
            ->join('grupo_investigacion_red_conocimiento', 'redes_conocimiento.id', 'grupo_investigacion_red_conocimiento.red_conocimiento_id')
            ->join('grupos_investigacion', 'grupo_investigacion_red_conocimiento.grupo_investigacion_id', 'grupos_investigacion.id')
            ->join('centros_formacion', 'grupos_investigacion.centro_formacion_id', 'centros_formacion.id')
            ->get();
    }

    /**
     * @var Invoice $redConocimiento
     */
    public function map($redConocimiento): array
    {
        return [
            $redConocimiento->codigo_centro,
            $redConocimiento->nombre_centro,
            $redConocimiento->nombre_grupo,
            $redConocimiento->nombre,
        ];
    }

    public function headings(): array
    {
        return [
            'Código del centro de formación',
            'Centro de formación',
            'Grupo de investigación',
            'Nombre de la red de conocimiento',
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
        return 'Grupos de inv - Redes de conocimiento';
    }

    public function properties(): array
    {
        return [
            'title' => 'Grupos de inv - Redes de conocimiento',
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
