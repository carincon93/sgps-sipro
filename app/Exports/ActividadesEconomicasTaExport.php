<?php

namespace App\Exports;

use App\Models\Convocatoria;
use App\Models\ActividadEconomica;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use Maatwebsite\Excel\Concerns\WithTitle;
use PhpOffice\PhpSpreadsheet\Style\NumberFormat;
use Maatwebsite\Excel\Concerns\WithColumnFormatting;
use Maatwebsite\Excel\Concerns\WithProperties;

class ActividadesEconomicasTaExport implements FromCollection, WithHeadings, WithMapping, WithStyles, WithProperties, WithColumnFormatting, WithTitle
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
        return ActividadEconomica::select('actividades_economicas.*', 'ta.id as ta_id', 'proyectos.id as proyecto_id')
            ->join('ta_actividad_economica', 'actividades_economicas.id', 'ta_actividad_economica.actividad_economica_id')
            ->join('ta', 'ta_actividad_economica.ta_id', 'ta.id')
            ->join('proyectos', 'ta.id', 'proyectos.id')
            ->where('proyectos.linea_programatica_id', 5)
            ->where('proyectos.convocatoria_id', $this->convocatoria->id)
            ->whereNotIn('proyectos.id', [1052, 1113])
            ->get();
    }

    /**
     * @var Invoice $actividadEconomica
     */
    public function map($actividadEconomica): array
    {
        return [
            'SGPS-' . ($actividadEconomica->proyecto_id + 8000),
            $actividadEconomica->nombre,

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
        return 'Actividades económicas';
    }

    public function properties(): array
    {
        return [
            'title' => 'Actividades económicas',
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
