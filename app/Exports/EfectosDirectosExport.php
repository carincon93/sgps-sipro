<?php

namespace App\Exports;

use App\Models\Convocatoria;
use App\Models\EfectoDirecto;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use Maatwebsite\Excel\Concerns\WithTitle;
use PhpOffice\PhpSpreadsheet\Style\NumberFormat;
use Maatwebsite\Excel\Concerns\WithColumnFormatting;
use Maatwebsite\Excel\Concerns\WithProperties;

class EfectosDirectosExport implements FromCollection, WithHeadings, WithMapping, WithStyles, WithProperties, WithColumnFormatting, WithTitle
{
    protected $convocatoria;

    public function __construct(Convocatoria $convocatoria, $lineasProgramaticasId)
    {
        $this->convocatoria = $convocatoria;
        $this->lineasProgramaticasId = $lineasProgramaticasId;
    }

    /**
     * @return \Illuminate\Support\Collection
     */
    public function collection()
    {
        return EfectoDirecto::select('efectos_directos.*', 'proyectos.id as proyecto_id')
            ->join('proyectos', 'efectos_directos.proyecto_id', 'proyectos.id')
            ->where('proyectos.convocatoria_id', $this->convocatoria->id)
            ->whereIn('proyectos.linea_programatica_id', $this->lineasProgramaticasId)
            ->whereNotIn('proyectos.id', [1052, 1113])
            ->get();
    }

    /**
     * @var Invoice $efectoDirecto
     */
    public function map($efectoDirecto): array
    {
        return [
            'SGPS-' . ($efectoDirecto->proyecto_id + 8000),
            $efectoDirecto->descripcion,
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
        return 'Efectos directos';
    }

    public function properties(): array
    {
        return [
            'title' => 'Efectos directos',
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
