<?php

namespace App\Exports;

use App\Models\RedConocimiento;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use Maatwebsite\Excel\Concerns\WithTitle;
use PhpOffice\PhpSpreadsheet\Style\NumberFormat;
use Maatwebsite\Excel\Concerns\WithColumnFormatting;
use Maatwebsite\Excel\Concerns\WithProperties;

class SemilleroRedesConocimientoExport implements FromCollection, WithHeadings, WithMapping, WithStyles, WithProperties, WithColumnFormatting, WithTitle
{

    public function __construct()
    {
    }

    /**
     * @return \Illuminate\Support\Collection
     */
    public function collection()
    {
        return RedConocimiento::select('redes_conocimiento.*', 'grupos_investigacion.nombre as nombre_grupo', 'semilleros_investigacion.nombre as nombre_semillero', 'lineas_investigacion.nombre as nombre_linea', 'centros_formacion.codigo as codigo_centro', 'centros_formacion.nombre as nombre_centro')
            ->join('semillero_investigacion_red_conocimiento', 'redes_conocimiento.id', 'semillero_investigacion_red_conocimiento.red_conocimiento_id')
            ->join('semilleros_investigacion', 'semillero_investigacion_red_conocimiento.semillero_investigacion_id', 'semilleros_investigacion.id')
            ->join('lineas_investigacion', 'semilleros_investigacion.linea_investigacion_id', 'lineas_investigacion.id')
            ->join('grupos_investigacion', 'lineas_investigacion.grupo_investigacion_id', 'grupos_investigacion.id')
            ->join('centros_formacion', 'grupos_investigacion.centro_formacion_id', 'centros_formacion.id')
            ->get();
    }

    /**
     * @var Invoice $redConocimiento
     */
    public function map($redConocimiento): array
    {
        return [
            $redConocimiento->codigo_centro,
            $redConocimiento->nombre_centro,
            $redConocimiento->nombre_grupo,
            $redConocimiento->nombre_linea,
            $redConocimiento->nombre_semillero,
            $redConocimiento->nombre,
        ];
    }

    public function headings(): array
    {
        return [
            'Código del centro de formación',
            'Centro de formación',
            'Grupo de investigación',
            'Línea de investigación',
            'Semillero de investigación',
            'Nombre de la red de conocimiento',
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
        return 'Semilleros de inv - Redes de conocimiento';
    }

    public function properties(): array
    {
        return [
            'title' => 'Semilleros de inv - Redes de conocimiento',
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
