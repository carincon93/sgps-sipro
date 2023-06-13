<?php

namespace App\Exports;

use App\Models\Convocatoria;
use App\Models\LineaInvestigacion;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use Maatwebsite\Excel\Concerns\WithTitle;
use PhpOffice\PhpSpreadsheet\Style\NumberFormat;
use Maatwebsite\Excel\Concerns\WithColumnFormatting;
use Maatwebsite\Excel\Concerns\WithProperties;

class LineasInvestigacionTaExport implements FromCollection, WithHeadings, WithMapping, WithStyles, WithProperties, WithColumnFormatting, WithTitle
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
        return LineaInvestigacion::select('lineas_investigacion.*', 'centros_formacion.nombre as nombre_centro', 'proyectos.id as proyecto_id')
            ->join('proyecto_linea_investigacion', 'lineas_investigacion.id', 'proyecto_linea_investigacion.linea_investigacion_id')
            ->join('grupos_investigacion', 'lineas_investigacion.grupo_investigacion_id', 'grupos_investigacion.id')
            ->join('centros_formacion', 'grupos_investigacion.centro_formacion_id', 'centros_formacion.id')
            ->join('proyectos', 'proyecto_linea_investigacion.proyecto_id', 'proyectos.id')
            ->where('proyectos.convocatoria_id', $this->convocatoria->id)
            ->where('proyectos.linea_programatica_id', $this->lineaProgramaticaId)
            ->whereNotIn('proyectos.id', [1052, 1113])
            ->get();
    }

    /**
     * @var Invoice $lineaInvestigacion
     */
    public function map($lineaInvestigacion): array
    {
        return [
            'SGPS-' . ($lineaInvestigacion->proyecto_id + 8000),
            $lineaInvestigacion->nombre_centro,
            $lineaInvestigacion->nombre,
        ];
    }

    public function headings(): array
    {
        return [
            'Código del proyecto',
            'Centro de formación',
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
        return 'Líneas de investigación';
    }

    public function properties(): array
    {
        return [
            'title' => 'Líneas de investigación',
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
