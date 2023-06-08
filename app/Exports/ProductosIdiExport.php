<?php

namespace App\Exports;

use App\Models\Convocatoria;
use App\Models\Producto;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use Maatwebsite\Excel\Concerns\WithTitle;
use PhpOffice\PhpSpreadsheet\Style\NumberFormat;
use Maatwebsite\Excel\Concerns\WithColumnFormatting;
use Maatwebsite\Excel\Concerns\WithProperties;

class ProductosIdiExport implements FromCollection, WithHeadings, WithMapping, WithStyles, WithProperties, WithColumnFormatting, WithTitle
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
        return Producto::selectRaw("productos.*, producto_idi.*, proyectos.id as proyecto_id, subtipologias_minciencias.nombre as subtipologia_minciencias, CASE producto_idi.tipo
            WHEN '1' THEN 'Generación del conocimiento (GNC)'
            WHEN '2' THEN 'Desarrollo tecnólogico (DT)'
            WHEN '3' THEN 'Apropiación social del conocimiento (ASC)'
            WHEN '4' THEN 'Formación de recurso humano (FRH)'
            END as tipo")
            ->join('producto_idi', 'productos.id', 'producto_idi.producto_id')
            ->join('subtipologias_minciencias', 'producto_idi.subtipologia_minciencias_id', 'subtipologias_minciencias.id')
            ->join('resultados', 'productos.resultado_id', 'resultados.id')
            ->join('objetivos_especificos', 'resultados.objetivo_especifico_id', 'objetivos_especificos.id')
            ->join('causas_directas', 'objetivos_especificos.causa_directa_id', 'causas_directas.id')
            ->join('proyectos', 'causas_directas.proyecto_id', 'proyectos.id')
            ->whereNotIn('proyectos.id', [1052, 1113])
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
            $producto->indicador,
            $producto->tipo,
            $producto->subtipologia_minciencias,
        ];
    }

    public function headings(): array
    {
        return [
            'Código del proyecto',
            'Descripción',
            'Fecha de inicio',
            'Fecha de finalización',
            'Indicador',
            'Tipo',
            'Subtipología MinCiencias',
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
        return [
            // Style the first row as bold text.
            1    => ['font' => ['bold' => true]],
        ];
    }
}
