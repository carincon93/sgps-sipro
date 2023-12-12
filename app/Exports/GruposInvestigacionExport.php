<?php

namespace App\Exports;

use App\Models\Convocatoria;
use App\Models\GrupoInvestigacion;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use Maatwebsite\Excel\Concerns\WithTitle;
use PhpOffice\PhpSpreadsheet\Style\NumberFormat;
use Maatwebsite\Excel\Concerns\WithColumnFormatting;
use Maatwebsite\Excel\Concerns\WithProperties;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Style\Style;
use PhpOffice\PhpSpreadsheet\Style\Color;
use PhpOffice\PhpSpreadsheet\Style\Border;

class GruposInvestigacionExport implements FromCollection, WithHeadings, WithMapping, WithStyles, WithProperties, WithColumnFormatting, WithTitle, ShouldAutoSize
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
            $grupoInvestigacion->centroFormacion->regional->nombre,
            $grupoInvestigacion->codigo_centro,
            $grupoInvestigacion->nombre_centro,
            $grupoInvestigacion->nombre,
            $grupoInvestigacion->acronimo,
            $grupoInvestigacion->centroFormacion->dinamizadorSennova->nombre,
            $grupoInvestigacion->centroFormacion->dinamizadorSennova->email,
            $grupoInvestigacion->email,
            $grupoInvestigacion->enlace_gruplac,
            $grupoInvestigacion->codigo_minciencias,
            $grupoInvestigacion->categoria_minciencias_text,
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
            $grupoInvestigacion->lineasInvestigacion
                ->flatMap(function ($lineaInvestigacion) {
                    return $lineaInvestigacion->semillerosInvestigacion->pluck('nombre');
                })
                ->implode(', ')
        ];
    }

    public function headings(): array
    {
        return [
            'Regional',
            'Código del centro de formación',
            'Centro de formación',
            'Nombre del grupo de investigación',
            'Acrónimo',
            'Dinamizador/a SENNOVA',
            'Correo del Dinamizador/a SENNOVA',
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
            'Semilleros de investigación'
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
        $sheet->getStyle('A1:' . $sheet->getHighestColumn() . '1')->applyFromArray([
            'font' => [
                'bold' => true,
                'color' => ['rgb' => '000000'],
            ],
            'fill' => [
                'fillType'   => Fill::FILL_SOLID,
                'startColor' => ['rgb' => 'edfdf3'],
            ],

        ]);

        $sheet->getStyle('A1:Z' . ($sheet->getHighestRow()))->applyFromArray([
            'borders' => [
                'allBorders' => [
                    'borderStyle' => Border::BORDER_THIN,
                    'color' => ['rgb' => '000000'],
                ],
            ],
        ]);
    }
}
