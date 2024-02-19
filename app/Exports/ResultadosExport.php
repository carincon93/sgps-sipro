<?php

namespace App\Exports;

use App\Models\Convocatoria;
use App\Models\Resultado;
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

class ResultadosExport implements FromCollection, WithHeadings, WithMapping, WithStyles, WithProperties, WithColumnFormatting, WithTitle, ShouldAutoSize
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
        return Resultado::select('resultados.*', 'proyectos.id as proyecto_id')
            ->join('efectos_directos', 'resultados.efecto_directo_id', 'efectos_directos.id')
            ->join('proyectos', 'efectos_directos.proyecto_id', 'proyectos.id')
            ->where('proyectos.convocatoria_id', $this->convocatoria->id)
            ->whereIn('proyectos.tipo_formulario_convocatoria_id', $this->tipo_formulario_convocatoria_id)
            ->orderBy('proyectos.id')
            ->get();
    }

    /**
     * @var Invoice $resultado
     */
    public function map($resultado): array
    {
        $impactos_descripciones = collect($resultado->efectoDirecto->efectosIndirectos)->map(function ($item) {
            return $item->impacto->descripcion;
        })->implode(' - Impacto: ');

        return [
            'SGPS-' . ($resultado->proyecto_id + 8000),
            $resultado->descripcion,
            $impactos_descripciones,
        ];
    }

    public function headings(): array
    {
        return [
            'Código del proyecto',
            'Descripción',
            'Impactos'
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
        return 'Resultados';
    }

    public function properties(): array
    {
        return [
            'title' => 'Resultados',
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
