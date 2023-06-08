<?php

namespace App\Exports;

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

class SemillerosInvestigacionProgramaFormacionExport implements FromCollection, WithHeadings, WithMapping, WithStyles, WithProperties, WithColumnFormatting, WithTitle
{

    public function __construct()
    {
    }

    /**
     * @return \Illuminate\Support\Collection
     */
    public function collection()
    {
        return ProgramaFormacion::selectRaw("programas_formacion.*, grupos_investigacion.nombre as nombre_grupo, semilleros_investigacion.nombre as nombre_semillero, centros_formacion.codigo as codigo_centro, centros_formacion.nombre as nombre_centro, CASE programas_formacion.modalidad
            WHEN '1' THEN 'Presencial'
            WHEN '2' THEN 'A distancia'
            WHEN '3' THEN 'Virtual'
            WHEN '4' THEN 'Presencial / Virtual'
            END as modalidad, CASE programas_formacion.nivel_formacion
            WHEN '1' THEN 'Tecnología'
            WHEN '2' THEN 'Especialización técnica profesional'
            WHEN '3' THEN 'Especialización tecnológica'
            WHEN '4' THEN 'Técnico'
            WHEN '5' THEN 'Auxiliar'
            WHEN '6' THEN 'Operario'
            WHEN '7' THEN 'Profundización técnica'
            END as nivel_formacion")
            ->join('semillero_investigacion_programa_formacion', 'programas_formacion.id', 'semillero_investigacion_programa_formacion.programa_formacion_id')
            ->join('semilleros_investigacion', 'semillero_investigacion_programa_formacion.semillero_investigacion_id', 'semilleros_investigacion.id')
            ->join('lineas_investigacion', 'semilleros_investigacion.linea_investigacion_id', 'lineas_investigacion.id')
            ->join('grupos_investigacion', 'lineas_investigacion.grupo_investigacion_id', 'grupos_investigacion.id')
            ->join('centros_formacion', 'grupos_investigacion.centro_formacion_id', 'centros_formacion.id')
            ->get();
    }

    /**
     * @var Invoice $programaFormacion
     */
    public function map($programaFormacion): array
    {
        return [
            $programaFormacion->codigo_centro,
            $programaFormacion->nombre_centro,
            $programaFormacion->nombre_grupo,
            $programaFormacion->nombre_semillero,
            $programaFormacion->nombre,
            $programaFormacion->codigo,
            $programaFormacion->modalidad,
            $programaFormacion->nivel_formacion,
        ];
    }

    public function headings(): array
    {
        return [
            'Código del centro de formación',
            'Centro de formación',
            'Grupo de investigación',
            'Semillero de investigación',
            'Nombre del programa de formación',
            'Código',
            'Modalidad',
            'Nivel de formación',
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
        return 'Semilleros inv - Lineas y programas de formación';
    }

    public function properties(): array
    {
        return [
            'title' => 'Semilleros inv - Lineas y programas de formación',
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
