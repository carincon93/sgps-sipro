<?php

namespace App\Exports;

use App\Models\Convocatoria;
use App\Models\GrupoInvestigacion;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use Maatwebsite\Excel\Concerns\WithTitle;
use PhpOffice\PhpSpreadsheet\Style\NumberFormat;
use Maatwebsite\Excel\Concerns\WithColumnFormatting;
use Maatwebsite\Excel\Concerns\WithProperties;

class GruposInvestigacionTaExport implements FromCollection, WithHeadings, WithMapping, WithStyles, WithProperties, WithColumnFormatting, WithTitle
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
        return GrupoInvestigacion::select('grupos_investigacion.*', 'centros_formacion.nombre as nombre_centro', 'proyectos.id as proyecto_id')
            ->join('proyecto_grupo_investigacion', 'grupos_investigacion.id', 'proyecto_grupo_investigacion.grupo_investigacion_id')
            ->join('centros_formacion', 'grupos_investigacion.centro_formacion_id', 'centros_formacion.id')
            ->join('proyectos', 'proyecto_grupo_investigacion.proyecto_id', 'proyectos.id')
            ->where('proyectos.convocatoria_id', $this->convocatoria->id)
            ->where('proyectos.linea_programatica_id', $this->lineaProgramaticaId)
            ->whereNotIn('proyectos.id', [1052, 1113])
            ->get();
    }

    /**
     * @var Invoice $grupoInvestigacion
     */
    public function map($grupoInvestigacion): array
    {
        return [
            'SGPS-' . ($grupoInvestigacion->proyecto_id + 8000),
            $grupoInvestigacion->nombre_centro,
            $grupoInvestigacion->nombre,
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
        return 'Grupos de investigación';
    }

    public function properties(): array
    {
        return [
            'title' => 'Grupos de investigación',
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
