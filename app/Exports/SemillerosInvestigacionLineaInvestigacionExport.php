<?php

namespace App\Exports;

use App\Models\LineaInvestigacion;
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

class SemillerosInvestigacionLineaInvestigacionExport implements FromCollection, WithHeadings, WithMapping, WithStyles, WithProperties, WithColumnFormatting, WithTitle, ShouldAutoSize
{

    public function __construct()
    {
    }

    /**
     * @return \Illuminate\Support\Collection
     */
    public function collection()
    {
        return LineaInvestigacion::select('lineas_investigacion.*', 'grupos_investigacion.nombre as nombre_grupo', 'semilleros_investigacion.nombre as nombre_semillero', 'centros_formacion.codigo as codigo_centro', 'centros_formacion.nombre as nombre_centro')
            ->join('semillero_investigacion_linea_investigacion', 'lineas_investigacion.id', 'semillero_investigacion_linea_investigacion.linea_investigacion_id')
            ->join('semilleros_investigacion', 'semillero_investigacion_linea_investigacion.semillero_investigacion_id', 'semilleros_investigacion.id')
            ->join('grupos_investigacion', 'lineas_investigacion.grupo_investigacion_id', 'grupos_investigacion.id')
            ->join('centros_formacion', 'grupos_investigacion.centro_formacion_id', 'centros_formacion.id')
            ->get();
    }

    /**
     * @var Invoice $lineaInvestigacion
     */
    public function map($lineaInvestigacion): array
    {
        return [
            $lineaInvestigacion->codigo_centro,
            $lineaInvestigacion->nombre_centro,
            $lineaInvestigacion->nombre_grupo,
            $lineaInvestigacion->nombre_semillero,
            $lineaInvestigacion->nombre,
        ];
    }

    public function headings(): array
    {
        return [
            'Código del centro de formación',
            'Centro de formación',
            'Grupo de investigación',
            'Semillero de investigación',
            'Nombre de la línea de investigación',
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
        return 'Semilleros inv - Lineas de investigación articulados';
    }

    public function properties(): array
    {
        return [
            'title' => 'Semilleros inv - Lineas de investigación articulados',
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
