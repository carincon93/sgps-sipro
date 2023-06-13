<?php

namespace App\Exports;

use App\Models\Convocatoria;
use App\Models\ProgramaFormacion;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use Maatwebsite\Excel\Concerns\WithTitle;
use PhpOffice\PhpSpreadsheet\Style\NumberFormat;
use Maatwebsite\Excel\Concerns\WithColumnFormatting;
use Maatwebsite\Excel\Concerns\WithProperties;

class ProgramasFormacionTaExport implements FromCollection, WithHeadings, WithMapping, WithStyles, WithProperties, WithColumnFormatting, WithTitle
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
        return ProgramaFormacion::select('programas_formacion.*', 'proyectos.id as proyecto_id')
            ->join('ta_programa_formacion', 'programas_formacion.id', 'ta_programa_formacion.programa_formacion_id')
            ->join('proyectos', 'ta_programa_formacion.proyecto_id', 'proyectos.id')
            ->where('proyectos.linea_programatica_id', 5)
            ->where('proyectos.convocatoria_id', $this->convocatoria->id)
            ->whereNotIn('proyectos.id', [1052, 1113])
            ->get();
    }

    /**
     * @var Invoice $programaFormacion
     */
    public function map($programaFormacion): array
    {
        return [
            'SGPS-' . ($programaFormacion->proyecto_id + 8000),
            $programaFormacion->nombre,

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
        return 'Programas de formación articulados';
    }

    public function properties(): array
    {
        return [
            'title' => 'Programas de formación articulados',
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
