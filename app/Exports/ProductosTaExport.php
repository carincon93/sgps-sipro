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

class ProductosTaExport implements FromCollection, WithHeadings, WithMapping, WithStyles, WithProperties, WithColumnFormatting, WithTitle
{
    protected $convocatoria;

    public function __construct(Convocatoria $convocatoria, $lineaProgramaticaId)
    {
        $this->convocatoria = $convocatoria;
        $this->lineaProgramaticaId = $lineaProgramaticaId;
    }

    /**
     * @return \Illuminate\Support\Collection
     */
    public function collection()
    {
        return Producto::select('productos.*', 'producto_ta_tp.*', 'proyectos.id as proyecto_id')
            ->join('producto_ta_tp', 'productos.id', 'producto_ta_tp.producto_id')
            ->join('resultados', 'productos.resultado_id', 'resultados.id')
            ->join('objetivos_especificos', 'resultados.objetivo_especifico_id', 'objetivos_especificos.id')
            ->join('causas_directas', 'objetivos_especificos.causa_directa_id', 'causas_directas.id')
            ->join('proyectos', 'causas_directas.proyecto_id', 'proyectos.id')
            ->where('proyectos.convocatoria_id', $this->convocatoria->id)
            ->where('proyectos.linea_programatica_id', $this->lineaProgramaticaId)
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
            $producto->valor_proyectado,
            $producto->indicador,
            $producto->medio_verificacion,
        ];
    }

    public function headings(): array
    {
        return [
            'Código del proyecto',
            'Descripción',
            'Fecha de inicio',
            'Fecha de finalización',
            'Meta',
            'Indicador',
            'Medio de verificación',
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
