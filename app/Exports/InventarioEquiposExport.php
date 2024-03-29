<?php

namespace App\Exports;

use App\Models\Proyecto;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use PhpOffice\PhpSpreadsheet\Style\NumberFormat;
use Maatwebsite\Excel\Concerns\WithColumnFormatting;
use Maatwebsite\Excel\Concerns\WithProperties;

class InventarioEquiposExport implements FromCollection, WithHeadings, WithMapping, WithStyles, WithProperties, WithColumnFormatting, ShouldAutoSize
{
    protected $proyecto;

    public function __construct(Proyecto $proyecto)
    {
        $this->proyecto = $proyecto;
    }

    /**
     * @return \Illuminate\Support\Collection
     */
    public function collection()
    {
        return $this->proyecto->inventarioEquipos;
    }

    /**
     * @var Invoice $inventarioEquipo
     */
    public function map($inventarioEquipo): array
    {
        return [
            $inventarioEquipo->proyecto->codigo,
            $inventarioEquipo->nombre,
            $inventarioEquipo->marca,
            $inventarioEquipo->serial,
            $inventarioEquipo->codigo_interno,
            $inventarioEquipo->fecha_adquisicion,
            $inventarioEquipo->estado_formateado,
            $inventarioEquipo->uso_st == '1' ? 'Si' : 'No',
            $inventarioEquipo->uso_otra_dependencia == '1' ? 'Si' : 'No',
            $inventarioEquipo->dependencia ? $inventarioEquipo->dependencia : 'N/A',
            $inventarioEquipo->descripcion,
            $inventarioEquipo->mantenimiento_prox_year == '1' ? 'Si' : 'No',
            $inventarioEquipo->calibracion_prox_year == '1' ? 'Si' : 'No',
        ];
    }

    public function headings(): array
    {
        return [
            'Código',
            'Nombre',
            'Marca',
            'Serial',
            'Código interno',
            'Fecha de adquisición',
            'Estado',
            '¿Uso exclusivo de Servicios tecnológicos?',
            '¿Otra dependencia que usa el equipo?',
            'Dependencia',
            'Descripción',
            '¿Para el próximo año el equipo necesita mantenimiento?',
            '¿Para el próximo año el equipo necesita calibración?',
        ];
    }

    public function columnFormats(): array
    {
        return [
            'O' => NumberFormat::FORMAT_CURRENCY_USD,
            'P' => NumberFormat::FORMAT_CURRENCY_USD,
            'Q' => NumberFormat::FORMAT_CURRENCY_USD,
        ];
    }

    public function properties(): array
    {
        return [
            'title' => 'Invetario equipos SGPS-' . $this->proyecto->codigo,
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
