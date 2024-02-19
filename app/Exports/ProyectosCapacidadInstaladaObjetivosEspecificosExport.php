<?php

namespace App\Exports;

use App\Models\ProyectoCapacidadInstaladaObjetivoEspecifico;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use PhpOffice\PhpSpreadsheet\Style\NumberFormat;
use Maatwebsite\Excel\Concerns\WithColumnFormatting;
use Maatwebsite\Excel\Concerns\WithProperties;
use Illuminate\Support\Facades\Storage;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithTitle;

class ProyectosCapacidadInstaladaObjetivosEspecificosExport implements FromCollection, WithHeadings, WithMapping, WithStyles, WithProperties, WithColumnFormatting, WithTitle, ShouldAutoSize
{
    protected $datos;

    public function __construct()
    {
        // 
    }

    /**
     * @return \Illuminate\Support\Collection
     */
    public function collection()
    {
        return ProyectoCapacidadInstaladaObjetivoEspecifico::orderBy('proyecto_capacidad_instalada_id')->get();
    }

    /**
     * @var Invoice $proyecto
     */
    public function map($objetivoEspecifico): array
    {
        return [
            $objetivoEspecifico->proyectoCapacidadInstalada->codigo,
            $objetivoEspecifico->descripcion,
            $objetivoEspecifico->resultado->descripcion
        ];
    }

    public function headings(): array
    {
        return [
            'Código del proyecto',
            'Objetivo específico',
            'Resultado',
        ];
    }

    public function columnFormats(): array
    {
        return [
            // 
        ];
    }

    /**
     * @return string
     */
    public function title(): string
    {
        return 'Objetivos específicos y resultados';
    }

    public function properties(): array
    {
        return [
            'title' => 'Objetivos específicos y resultados',
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
