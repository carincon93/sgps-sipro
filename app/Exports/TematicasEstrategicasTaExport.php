<?php

namespace App\Exports;

use App\Models\Convocatoria;
use App\Models\TematicaEstrategica;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use Maatwebsite\Excel\Concerns\WithTitle;
use PhpOffice\PhpSpreadsheet\Style\NumberFormat;
use Maatwebsite\Excel\Concerns\WithColumnFormatting;
use Maatwebsite\Excel\Concerns\WithProperties;

class TematicasEstrategicasTaExport implements FromCollection, WithHeadings, WithMapping, WithStyles, WithProperties, WithColumnFormatting, WithTitle
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
        return TematicaEstrategica::select('tematicas_estrategicas.*', 'ta.id as ta_id', 'proyectos.id as proyecto_id')
            ->join('ta_tematica_estrategica', 'tematicas_estrategicas.id', 'ta_tematica_estrategica.tematica_estrategica_id')
            ->join('ta', 'ta_tematica_estrategica.ta_id', 'ta.id')
            ->join('proyectos', 'ta.id', 'proyectos.id')
            ->where('proyectos.linea_programatica_id', 5)
            ->where('proyectos.convocatoria_id', $this->convocatoria->id)
            ->whereNotIn('proyectos.id', [1052, 1113])
            ->get();
    }

    /**
     * @var Invoice $tematicaEstrategica
     */
    public function map($tematicaEstrategica): array
    {
        return [
            'SGPS-' . ($tematicaEstrategica->proyecto_id + 8000),
            $tematicaEstrategica->nombre,

        ];
    }

    public function headings(): array
    {
        return [
            'Código del proyecto',
            'Nombre',
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
        return 'Temáticas estratégicas';
    }

    public function properties(): array
    {
        return [
            'title' => 'Temáticas estratégicas',
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
