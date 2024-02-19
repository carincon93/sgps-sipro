<?php

namespace App\Exports;

use App\Models\Convocatoria;
use App\Models\InventarioEquipo;
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

class InventariosEquiposStExport implements FromCollection, WithHeadings, WithMapping, WithStyles, WithProperties, WithColumnFormatting, WithTitle, ShouldAutoSize
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
        return InventarioEquipo::select('inventario_equipos.*')
            ->join('proyectos', 'inventario_equipos.proyecto_id', 'proyectos.id')
            ->where('proyectos.convocatoria_id', $this->convocatoria->id)
            ->get();
    }

    /**
     * @var Invoice $inventarioEquipo
     */
    public function map($inventarioEquipo): array
    {
        return [
            'SGPS-' . ($inventarioEquipo->proyecto_id + 8000),
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
            'Código del proyecto',
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
        return [];
    }

    /**
     * @return string
     */
    public function title(): string
    {
        return 'Inventario de equipos';
    }

    public function properties(): array
    {
        return [
            'title' => 'Inventario de equipos',
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
