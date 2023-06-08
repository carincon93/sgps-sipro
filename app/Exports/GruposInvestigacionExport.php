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

class GruposInvestigacionExport implements FromCollection, WithHeadings, WithMapping, WithStyles, WithProperties, WithColumnFormatting, WithTitle
{
    protected $convocatoria;

    public function __construct()
    {
    }

    /**
     * @return \Illuminate\Support\Collection
     */
    public function collection()
    {
        return GrupoInvestigacion::select('grupos_investigacion.*',  'centros_formacion.codigo as codigo_centro', 'centros_formacion.nombre as nombre_centro')
            ->distinct('grupos_investigacion.id')
            ->join('lineas_investigacion', 'grupos_investigacion.id', 'lineas_investigacion.grupo_investigacion_id')
            ->join('centros_formacion', 'grupos_investigacion.centro_formacion_id', 'centros_formacion.id')
            ->get();
    }

    /**
     * @var Invoice $grupoInvestigacion
     */
    public function map($grupoInvestigacion): array
    {
        return [
            $grupoInvestigacion->codigo_centro,
            $grupoInvestigacion->nombre_centro,
            $grupoInvestigacion->nombre,
            $grupoInvestigacion->acronimo,
            $grupoInvestigacion->email,
            $grupoInvestigacion->enlace_gruplac,
            $grupoInvestigacion->codigo_minciencias,
            $grupoInvestigacion->categoria_minciencias_formateado,
            $grupoInvestigacion->mision,
            $grupoInvestigacion->vision,
            $grupoInvestigacion->fecha_creacion_grupo,
            $grupoInvestigacion->nombre_lider_grupo,
            $grupoInvestigacion->email_contacto,
            $grupoInvestigacion->programa_nal_ctei_principal,
            $grupoInvestigacion->programa_nal_ctei_secundaria,
            $grupoInvestigacion->reconocimientos_grupo_investigacion,
            $grupoInvestigacion->objetivo_general,
            $grupoInvestigacion->objetivos_especificos,
            $grupoInvestigacion->link_propio_grupo,
            $grupoInvestigacion->formato_gic_f_020,
            $grupoInvestigacion->formato_gic_f_032,
        ];
    }

    public function headings(): array
    {
        return [
            'Código del centro de formación',
            'Centro de formación',
            'Nombre del grupo de investigación',
            'Acrónimo',
            'Correo electrónico',
            'Enlace GrupLAC',
            'Codigo Minciencias',
            'Categoría Minciencias',
            'Misión',
            'Visión',
            'Fecha de creacion del grupo',
            'Nombre líder del grupo',
            'Correo de contacto',
            'Programa Nal. CTeI (Principal',
            'Programa Nal. CTeI (Secundaria)',
            'Reconocimientos del grupo de investigación',
            'Objetivo general',
            'Objetivos especificos',
            'Link propio del grupo',
            'Formato GIC – F – 020',
            'Formato GIC – F – 032',
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
