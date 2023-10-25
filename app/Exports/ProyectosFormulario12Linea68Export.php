<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\Exportable;
use Maatwebsite\Excel\Concerns\WithMultipleSheets;
use Maatwebsite\Excel\Concerns\WithTitle;
use App\Models\Convocatoria;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use PhpOffice\PhpSpreadsheet\Style\NumberFormat;
use Maatwebsite\Excel\Concerns\WithColumnFormatting;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;


class ProyectosFormulario12Linea68Export implements WithTitle, FromCollection, WithHeadings, WithMapping, WithStyles, WithColumnFormatting, ShouldAutoSize
{
    use Exportable;

    protected $convocatoria;
    protected $tipo_formulario_convocatoria_id;

    public function __construct(Convocatoria $convocatoria, $tipo_formulario_convocatoria_id)
    {
        $this->convocatoria                     = $convocatoria;
        $this->tipo_formulario_convocatoria_id  = $tipo_formulario_convocatoria_id;
    }

    /**
     * @return \Illuminate\Support\Collection
     */
    public function collection()
    {
        return $this->convocatoria->proyectos()->where('proyectos.tipo_formulario_convocatoria_id', $this->tipo_formulario_convocatoria_id)->get();
    }

    /**
     * @var Invoice $proyecto
     */
    public function map($proyecto): array
    {
        $titulo                     = '';
        $objetivo_general           = '';
        $continuidad                = '';
        $nombre_area_tecnica        = '';

        if ($proyecto->proyectoFormulario12Linea68()->exists()) {
            $titulo                     = $proyecto->proyectoFormulario12Linea68->titulo;
            $objetivo_general           = $proyecto->proyectoFormulario12Linea68->objetivo_general;
            $continuidad                = $proyecto->proyectoFormulario12Linea68->continuidad;
            $nombre_area_tecnica        = $proyecto->proyectoFormulario12Linea68->nombre_area_tecnica;
        }

        return [
            $this->convocatoria->descripcion . ' ' . $this->convocatoria->year,
            $proyecto->codigo,
            $proyecto->centroFormacion->regional->nombre,
            $proyecto->centroFormacion->codigo,
            $proyecto->centroFormacion->nombre,
            $proyecto->tipoFormularioConvocatoria->nombre,
            mb_strtoupper($titulo),
            $nombre_area_tecnica,
            $objetivo_general,
            $continuidad,
            $proyecto->total_proyecto_presupuesto,
            $proyecto->total_roles_sennova,
            $proyecto->total_proyecto_presupuesto + $proyecto->total_roles_sennova,
            ($proyecto->finalizado) ? 'SI' : 'NO',
            $proyecto->participantes()->firstWhere('es_formulador', true) ? mb_strtoupper($proyecto->participantes()->firstWhere('es_formulador', true)->nombre) : 'Sin información registrada',
        ];
    }

    public function headings(): array
    {
        return [
            'Convocatoria',
            'Código SGPS',
            'Regional',
            'Código del centro formación',
            'Centro de formación',
            'Formulario',
            'Título',
            'Nombre del área técnica',
            'Objetivo general',
            'Continuidad',
            'Total valor rubros presupuestales',
            'Total valor roles',
            'Total valor del proyecto',
            'Finalizado',
            'Autor(a) principal',
        ];
    }

    public function columnFormats(): array
    {
        return [
            'J' => NumberFormat::FORMAT_CURRENCY_USD,
            'K' => NumberFormat::FORMAT_CURRENCY_USD,
            'L' => NumberFormat::FORMAT_CURRENCY_USD,
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
    }

    /**
     * @return string
     */
    public function title(): string
    {
        return 'Proyectos Form 12 Línea 68';
    }
}
