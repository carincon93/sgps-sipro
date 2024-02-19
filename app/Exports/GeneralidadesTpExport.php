<?php

namespace App\Exports;

use App\Models\Convocatoria;
use App\Models\Tp;
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

class GeneralidadesTpExport implements FromCollection, WithHeadings, WithMapping, WithStyles, WithProperties, WithColumnFormatting, WithTitle, ShouldAutoSize
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
        return Tp::select('tp.*')->join('proyectos', 'tp.id', 'proyectos.id')
            ->where('proyectos.convocatoria_id', $this->convocatoria->id)
            ->get();
    }

    /**
     * @var Invoice $tp
     */
    public function map($tp): array
    {
        return [
            $this->convocatoria->descripcion,
            $proyectoLinea69->proyecto->centroFormacion->regional->nombre,
            $proyectoLinea69->proyecto->centroFormacion->codigo,
            $proyectoLinea69->proyecto->centroFormacion->nombre,
            $proyectoLinea69->proyecto->codigo,
            $proyectoLinea69->titulo,
            $proyectoLinea69->resumen,
            $proyectoLinea69->resumen_regional,
            $proyectoLinea69->antecedentes,
            $proyectoLinea69->antecedentes_regional,
            $proyectoLinea69->problema_central,
            $proyectoLinea69->justificacion_problema,
            $proyectoLinea69->retos_oportunidades,
            $proyectoLinea69->pertinencia_territorio,
            $proyectoLinea69->marco_conceptual,
            $proyectoLinea69->objetivo_general,
            $proyectoLinea69->metodologia,
            $proyectoLinea69->metodologia_local,
            $proyectoLinea69->impacto_municipios,
            $proyectoLinea69->fecha_inicio,
            $proyectoLinea69->fecha_finalizacion,
            $proyectoLinea69->propuesta_sostenibilidad,
            $proyectoLinea69->impacto_centro_formacion,
            $proyectoLinea69->bibliografia,
            ($proyectoLinea69->proyecto->finalizado) ? 'SI' : 'NO',
            ($proyectoLinea69->proyecto->habilitado_para_evaluar) ? 'SI' : 'NO',
            $proyectoLinea69->proyecto->estado_cord_sennova ? json_decode($proyectoLinea69->proyecto->estado_cord_sennova)->estado : ($proyectoLinea69->proyecto->proyectoLinea69()->exists() ? $proyectoLinea69->proyecto->estado_evaluacion_tp['estado'] : 'Sin información registrada'),
        ];
    }

    public function headings(): array
    {
        return [
            'Convocatoria',
            'Regional',
            'Código del centro',
            'Centro de formación',
            'Código del proyecto',
            'Título',
            'Resumen',
            'Resumen ejecutivo regional',
            'Antecedentes',
            'Complemento - Antecedentes regional',
            'Problema central',
            'Justificación del problema',
            'Descripción de retos y prioridades locales y regionales en los cuales el Tecnoparque tiene impacto',
            'Justificación y pertinencia en el territorio',
            'Marco conceptual',
            'Objetivo general',
            'Metodología',
            'Metodología local',
            'Descripción del beneficio en los municipios',
            'Fecha de inicio',
            'Fecha de finalización',
            'Propuesta de sostenibilidad',
            'Impacto en el centro de formación',
            'Bibliografía',
            'Finalizado',
            'Radicado',
            'Estado final',
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
        return 'Generalidades';
    }

    public function properties(): array
    {
        return [
            'title' => 'Proyectos TP',
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
