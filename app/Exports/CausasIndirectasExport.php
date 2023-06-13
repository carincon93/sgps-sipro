<?php

namespace App\Exports;

use App\Models\Convocatoria;
use App\Models\CausaIndirecta;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use Maatwebsite\Excel\Concerns\WithTitle;
use PhpOffice\PhpSpreadsheet\Style\NumberFormat;
use Maatwebsite\Excel\Concerns\WithColumnFormatting;
use Maatwebsite\Excel\Concerns\WithProperties;

class CausasIndirectasExport implements FromCollection, WithHeadings, WithMapping, WithStyles, WithProperties, WithColumnFormatting, WithTitle
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
        return CausaIndirecta::select('causas_indirectas.*', 'proyectos.id as proyecto_id')
            ->join('causas_directas', 'causas_indirectas.causa_directa_id', 'causas_directas.id')
            ->join('proyectos', 'causas_directas.proyecto_id', 'proyectos.id')
            ->where('proyectos.convocatoria_id', $this->convocatoria->id)
            ->whereIn('proyectos.linea_programatica_id', $this->lineasProgramaticasId)
            ->whereNotIn('proyectos.id', [1052, 1113])
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
        return 'Causas indirectas';
    }

    public function properties(): array
    {
        return [
            'title' => 'Causas indirectas',
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
