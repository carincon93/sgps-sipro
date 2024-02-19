<?php

namespace App\Exports;

use App\Models\Convocatoria;
use App\Models\Producto;
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

class ProductosExport implements FromCollection, WithHeadings, WithMapping, WithStyles, WithProperties, WithColumnFormatting, WithTitle, ShouldAutoSize
{
    protected $convocatoria;
    protected $tipo_formulario_convocatoria_id;

    public function __construct(Convocatoria $convocatoria, $tipo_formulario_convocatoria_id)
    {
        $this->convocatoria = $convocatoria;
        $this->tipo_formulario_convocatoria_id = $tipo_formulario_convocatoria_id;
    }

    /**
     * @return \Illuminate\Support\Collection
     */
    public function collection()
    {


        return Producto::select('productos.*', 'proyectos.id as proyecto_id')
            ->join('resultados', 'productos.resultado_id', 'resultados.id')
            ->join('efectos_directos', 'resultados.efecto_directo_id', 'efectos_directos.id')
            ->join('proyectos', 'efectos_directos.proyecto_id', 'proyectos.id')
            ->where('proyectos.convocatoria_id', $this->convocatoria->id)
            ->whereIn('proyectos.tipo_formulario_convocatoria_id', $this->tipo_formulario_convocatoria_id)
            ->orderBy('proyectos.id')
            ->get();
    }

    /**
     * @var Invoice $producto
     */
    public function map($producto): array
    {
        return [
            'SGPS-' . ($producto->proyecto_id + 8000),
            $producto->nombre,
            $producto->fecha_inicio,
            $producto->fecha_finalizacion,
            $producto->unidad_indicador . ' / ' . $producto->meta_indicador,
            $producto->formula_indicador,
            $producto->medio_verificacion,
            $producto->productoMinciencias()->exists() ? $producto->productoMinciencias->subtipologiaMinciencias->tipologiaMincienciasnombre : 'N/A',
            $producto->productoMinciencias()->exists() ? $producto->productoMinciencias->subtipologiaMinciencias->nombre : 'N/A',
            $producto->productoMinciencias()->exists() ? $producto->productoMinciencias->trl : 'N/A',
            $producto->productoMinciencias()->exists() ? collect(json_decode(Storage::get('json/tipologia-minciencias.json'), true))->firstWhere('value', $producto->productoMinciencias->tipo)['label']  : 'N/A',
        ];
    }

    public function headings(): array
    {
        return [
            'Código del proyecto',
            'Descripción',
            'Fecha de inicio',
            'Fecha de finalización',
            'Unidad y Meta del Indicador',
            'Formula del Indicador',
            'Medio de verificación',
            'Tipología Minciencias',
            'Subtipología Minciencias',
            'TRL',
            'Tipo de producto',
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
        return 'Productos';
    }

    public function properties(): array
    {
        return [
            'title' => 'Productos',
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
