<?php

namespace App\Exports;

use App\Models\Convocatoria;
use App\Models\EfectoIndirecto;
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

class EfectosIndirectosExport implements FromCollection, WithHeadings, WithMapping, WithStyles, WithProperties, WithColumnFormatting, WithTitle, ShouldAutoSize
{
    protected $convocatoria;

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
        return EfectoIndirecto::select('efectos_indirectos.*', 'proyectos.id as proyecto_id')
            ->join('efectos_directos', 'efectos_indirectos.efecto_directo_id', 'efectos_directos.id')
            ->join('proyectos', 'efectos_directos.proyecto_id', 'proyectos.id')
            ->whereIn('proyectos.tipo_formulario_convocatoria_id', $this->tipo_formulario_convocatoria_id)
            ->where('proyectos.convocatoria_id', $this->convocatoria->id)
            ->get();
    }

    /**
     * @var Invoice $efectoIndirecto
     */
    public function map($efectoIndirecto): array
    {
        return [
            'SGPS-' . ($efectoIndirecto->proyecto_id + 8000),
            $efectoIndirecto->descripcion,
        ];
    }

    public function headings(): array
    {
        return [
            'Código del proyecto',
            'Descripción',
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
        return 'Efectos indirectos';
    }

    public function properties(): array
    {
        return [
            'title' => 'Efectos indirectos',
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
