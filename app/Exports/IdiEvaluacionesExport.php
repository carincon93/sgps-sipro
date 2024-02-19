<?php

namespace App\Exports;

use App\Models\Convocatoria;
use App\Models\Evaluacion\IdiEvaluacion;
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

class IdiEvaluacionesExport implements FromCollection, WithHeadings, WithMapping, WithStyles, WithProperties, WithColumnFormatting, WithTitle, ShouldAutoSize
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
        return IdiEvaluacion::select('evaluaciones_proyectos_linea_66.*')->join('evaluaciones', 'evaluaciones_proyectos_linea_66.id', 'evaluaciones.id')->join('proyectos', 'evaluaciones.proyecto_id', 'proyectos.id')->where('proyectos.convocatoria_id', $this->convocatoria->id)->get();
    }

    /**
     * @var Invoice $idiEvaluacion
     */
    public function map($idiEvaluacion): array
    {
        return [
            $idiEvaluacion->evaluacion->proyecto->centroFormacion->regional->nombre,
            $idiEvaluacion->evaluacion->proyecto->centroFormacion->codigo,
            $idiEvaluacion->evaluacion->proyecto->centroFormacion->nombre,
            $idiEvaluacion->evaluacion->proyecto->lineaProgramatica->codigo,
            $idiEvaluacion->evaluacion->evaluador->nombre,
            $idiEvaluacion->evaluacion->evaluador->numero_documento,
            $idiEvaluacion->evaluacion->evaluador->email,
            $idiEvaluacion->evaluacion->proyecto->codigo,
            $idiEvaluacion->evaluacion->proyecto->proyectoLinea66->titulo,
            $idiEvaluacion->titulo_comentario ? $idiEvaluacion->titulo_comentario : 'Cumple',
            $idiEvaluacion->video_comentario ? $idiEvaluacion->video_comentario : 'Cumple',
            $idiEvaluacion->resumen_comentario ? $idiEvaluacion->resumen_comentario : 'Cumple',
            $idiEvaluacion->problema_central_comentario ? $idiEvaluacion->problema_central_comentario : 'Cumple',
            $idiEvaluacion->objetivos_comentario ? $idiEvaluacion->objetivos_comentario : 'Cumple',
            $idiEvaluacion->metodologia_comentario ? $idiEvaluacion->metodologia_comentario : 'Cumple',
            $idiEvaluacion->entidad_aliada_comentario ? $idiEvaluacion->entidad_aliada_comentario : 'Cumple',
            $idiEvaluacion->resultados_comentario ? $idiEvaluacion->resultados_comentario : 'Cumple',
            $idiEvaluacion->productos_comentario ? $idiEvaluacion->productos_comentario : 'Cumple',
            $idiEvaluacion->cadena_valor_comentario ? $idiEvaluacion->cadena_valor_comentario : 'Cumple',
            $idiEvaluacion->analisis_riesgos_comentario ? $idiEvaluacion->analisis_riesgos_comentario : 'Cumple',
            $idiEvaluacion->ortografia_comentario ? $idiEvaluacion->ortografia_comentario : 'Cumple',
            $idiEvaluacion->redaccion_comentario ? $idiEvaluacion->redaccion_comentario : 'Cumple',
            $idiEvaluacion->normas_apa_comentario ? $idiEvaluacion->normas_apa_comentario : 'Cumple',
            $idiEvaluacion->justificacion_economia_naranja_comentario ? $idiEvaluacion->justificacion_economia_naranja_comentario : 'Cumple',
            $idiEvaluacion->justificacion_industria_4_comentario ? $idiEvaluacion->justificacion_industria_4_comentario : 'Cumple',
            $idiEvaluacion->bibliografia_comentario ? $idiEvaluacion->bibliografia_comentario : 'Cumple',
            $idiEvaluacion->fechas_comentario ? $idiEvaluacion->fechas_comentario : 'Cumple',
            $idiEvaluacion->justificacion_politica_discapacidad_comentario ? $idiEvaluacion->justificacion_politica_discapacidad_comentario : 'Cumple',
            $idiEvaluacion->actividad_economica_comentario ? $idiEvaluacion->actividad_economica_comentario : 'Cumple',
            $idiEvaluacion->disciplina_subarea_conocimiento_comentario ? $idiEvaluacion->disciplina_subarea_conocimiento_comentario : 'Cumple',
            $idiEvaluacion->red_conocimiento_comentario ? $idiEvaluacion->red_conocimiento_comentario : 'Cumple',
            $idiEvaluacion->tematica_estrategica_comentario ? $idiEvaluacion->tematica_estrategica_comentario : 'Cumple',
        ];
    }

    public function headings(): array
    {
        return [
            'Regional',
            'Código del centro de formación',
            'Centro de formación',
            'Línea programática',
            'Evaluador',
            'Número de documento',
            'Correo electrónico',
            'Código del proyecto',
            'Título del proyecto',
            'Título',
            'Video',
            'Resumen',
            'Problema central',
            'Objetivos',
            'Metodología',
            'Entidad aliada',
            'Resultados',
            'Productos',
            'Cadena de valor',
            'Análisis de riesgos',
            'Ortografía',
            'Redacción',
            'Normas APA',
            'Economía naranja',
            'Industria 4.0',
            'Bibliografía',
            'Fechas de ejecución',
            'Política de discapacidad',
            'Actividad económica',
            'Disciplina de la subaárea de conocimiento',
            'Red de conocimiento',
            'Temática estratégica'
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
        return 'I+D+i';
    }

    public function properties(): array
    {
        return [
            'title' => 'Comentarios evaluaciones de I+D+i',
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
