<?php

namespace App\Exports;

use App\Models\SemilleroInvestigacion;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use Maatwebsite\Excel\Concerns\WithTitle;
use PhpOffice\PhpSpreadsheet\Style\NumberFormat;
use Maatwebsite\Excel\Concerns\WithColumnFormatting;
use Maatwebsite\Excel\Concerns\WithProperties;

class InfoSemillerosInvestigacionExport implements FromCollection, WithHeadings, WithMapping, WithStyles, WithProperties, WithColumnFormatting, WithTitle
{
    public function __construct()
    {
    }

    /**
     * @return \Illuminate\Support\Collection
     */
    public function collection()
    {
        return SemilleroInvestigacion::select('semilleros_investigacion.*', 'centros_formacion.codigo as codigo_centro', 'centros_formacion.nombre as nombre_centro', 'grupos_investigacion.nombre as nombre_grupo', 'grupos_investigacion.id as grupo_investigacion_id')
            ->join('lineas_investigacion', 'semilleros_investigacion.linea_investigacion_id', 'lineas_investigacion.id')
            ->join('grupos_investigacion', 'lineas_investigacion.grupo_investigacion_id', 'grupos_investigacion.id')
            ->join('centros_formacion', 'grupos_investigacion.centro_formacion_id', 'centros_formacion.id')
            ->get();
    }

    /**
     * @var Invoice $semilleroInvestigacion
     */
    public function map($semilleroInvestigacion): array
    {
        return [
            $semilleroInvestigacion->codigo_centro,
            $semilleroInvestigacion->nombre_centro,
            $semilleroInvestigacion->nombre_grupo,
            $semilleroInvestigacion->nombre,
            $semilleroInvestigacion->codigo,
            $semilleroInvestigacion->fecha_creacion_semillero,
            $semilleroInvestigacion->nombre_lider_semillero,
            $semilleroInvestigacion->email_contacto,
            $semilleroInvestigacion->reconocimientos_semillero_investigacion,
            $semilleroInvestigacion->vision,
            $semilleroInvestigacion->mision,
            $semilleroInvestigacion->objetivo_general,
            $semilleroInvestigacion->objetivos_especificos,
            $semilleroInvestigacion->link_semillero,
            $semilleroInvestigacion->formato_gic_f_021,
            $semilleroInvestigacion->formato_gic_f_032,
            $semilleroInvestigacion->formato_aval_semillero,
            $semilleroInvestigacion->es_semillero_tecnoacademia == 1 ? 'Si' : ($semilleroInvestigacion->es_semillero_tecnoacademia == 2 ? 'No' : ''),
        ];
    }

    public function headings(): array
    {
        return [
            'Código del centro de formación',
            'Centro de formación',
            'Grupo de investigación',
            'Nombre del semillero de investigación',
            'Código',
            'Fecha de creacion del semillero',
            'Nombre líder del semillero',
            'Correo de contacto',
            'Reconocimientos del semillero de investigación',
            'Visión',
            'Misión',
            'Objetivo general',
            'Objetivos específicos',
            'Link del semillero',
            'Formato GIC - F - 021',
            'Formato GIC -F - 032',
            'Formato aval de semillero',
            'TecnoAcademia',
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
        return 'Semilleros de investigación';
    }

    public function properties(): array
    {
        return [
            'title' => 'Semilleros de investigación',
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
