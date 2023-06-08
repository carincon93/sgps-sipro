<?php

namespace App\Exports;

use App\Models\Convocatoria;
use App\Models\Municipio;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use Maatwebsite\Excel\Concerns\WithTitle;
use PhpOffice\PhpSpreadsheet\Style\NumberFormat;
use Maatwebsite\Excel\Concerns\WithColumnFormatting;
use Maatwebsite\Excel\Concerns\WithProperties;

class MunicipiosAImpactarTaExport implements FromCollection, WithHeadings, WithMapping, WithStyles, WithProperties, WithColumnFormatting, WithTitle
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
        return Municipio::select('municipios.*', 'proyectos.id as proyecto_id')
            ->join('proyecto_municipio_impactar', 'municipios.id', 'proyecto_municipio_impactar.municipio_id')
            ->join('proyectos', 'proyecto_municipio_impactar.proyecto_id', 'proyectos.id')
            ->where('proyectos.linea_programatica_id', $this->lineaProgramaticaId)
            ->where('proyectos.convocatoria_id', $this->convocatoria->id)
            ->whereNotIn('proyectos.id', [1052, 1113])
            ->get();
    }

    /**
     * @var Invoice $municipio
     */
    public function map($municipio): array
    {
        return [
            'SGPS-' . ($municipio->proyecto_id + 8000),
            $municipio->nombre,
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
        return 'Municipios a impactar';
    }

    public function properties(): array
    {
        return [
            'title' => 'Municipios a impactar',
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
