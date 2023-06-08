<?php

namespace App\Exports;

use App\Models\Convocatoria;
use App\Models\DisciplinaSubareaConocimiento;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use Maatwebsite\Excel\Concerns\WithTitle;
use PhpOffice\PhpSpreadsheet\Style\NumberFormat;
use Maatwebsite\Excel\Concerns\WithColumnFormatting;
use Maatwebsite\Excel\Concerns\WithProperties;

class DisciplinasSubareaConocimientoTaExport implements FromCollection, WithHeadings, WithMapping, WithStyles, WithProperties, WithColumnFormatting, WithTitle
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
        return DisciplinaSubareaConocimiento::select('disciplinas_subarea_conocimiento.*', 'ta.id as ta_id', 'proyectos.id as proyecto_id')
            ->join('ta_disciplina_subarea_conocimiento', 'disciplinas_subarea_conocimiento.id', 'ta_disciplina_subarea_conocimiento.disciplina_subarea_conocimiento_id')
            ->join('ta', 'ta_disciplina_subarea_conocimiento.ta_id', 'ta.id')
            ->join('proyectos', 'ta.id', 'proyectos.id')
            ->where('proyectos.linea_programatica_id', 5)
            ->where('proyectos.convocatoria_id', $this->convocatoria->id)
            ->whereNotIn('proyectos.id', [1052, 1113])
            ->get();
    }

    /**
     * @var Invoice $disciplinaSubareaConocimiento
     */
    public function map($disciplinaSubareaConocimiento): array
    {
        return [
            'SGPS-' . ($disciplinaSubareaConocimiento->proyecto_id + 8000),
            $disciplinaSubareaConocimiento->nombre,

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
        return 'Disciplinas subárea de conocimiento';
    }

    public function properties(): array
    {
        return [
            'title' => 'Disciplinas subárea de conocimiento',
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
