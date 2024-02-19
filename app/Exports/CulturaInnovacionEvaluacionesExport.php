<?php

namespace App\Exports;

use App\Models\Convocatoria;
use App\Models\Evaluacion\CulturaInnovacionEvaluacion;
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

class CulturaInnovacionEvaluacionesExport implements FromCollection, WithHeadings, WithMapping, WithStyles, WithProperties, WithColumnFormatting, WithTitle, ShouldAutoSize
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
        return CulturaInnovacionEvaluacion::select('evaluaciones_proyectos_formulario_1_linea_65..*')->join('evaluaciones', 'evaluaciones_proyectos_formulario_1_linea_65..id', 'evaluaciones.id')->join('proyectos', 'evaluaciones.proyecto_id', 'proyectos.id')->where('proyectos.convocatoria_id', $this->convocatoria->id)->get();
    }

    /**
     * @var Invoice $proyectoLinea65Evaluacion
     */
    public function map($proyectoLinea65Evaluacion): array
    {
        return [
            $proyectoLinea65Evaluacion->evaluacion->proyecto->centroFormacion->regional->nombre,
            $proyectoLinea65Evaluacion->evaluacion->proyecto->centroFormacion->codigo,
            $proyectoLinea65Evaluacion->evaluacion->proyecto->centroFormacion->nombre,
            $proyectoLinea65Evaluacion->evaluacion->proyecto->lineaProgramatica->codigo,
            $proyectoLinea65Evaluacion->evaluacion->evaluador->nombre,
            $proyectoLinea65Evaluacion->evaluacion->evaluador->numero_documento,
            $proyectoLinea65Evaluacion->evaluacion->evaluador->email,
            $proyectoLinea65Evaluacion->evaluacion->proyecto->codigo,
            $proyectoLinea65Evaluacion->evaluacion->proyecto->proyectoLinea65->titulo,
            $proyectoLinea65Evaluacion->titulo_comentario ? $proyectoLinea65Evaluacion->titulo_comentario : 'Cumple',
            $proyectoLinea65Evaluacion->video_comentario ? $proyectoLinea65Evaluacion->video_comentario : 'Cumple',
            $proyectoLinea65Evaluacion->resumen_comentario ? $proyectoLinea65Evaluacion->resumen_comentario : 'Cumple',
            $proyectoLinea65Evaluacion->problema_central_comentario ? $proyectoLinea65Evaluacion->problema_central_comentario : 'Cumple',
            $proyectoLinea65Evaluacion->objetivos_comentario ? $proyectoLinea65Evaluacion->objetivos_comentario : 'Cumple',
            $proyectoLinea65Evaluacion->metodologia_comentario ? $proyectoLinea65Evaluacion->metodologia_comentario : 'Cumple',
            $proyectoLinea65Evaluacion->entidad_aliada_comentario ? $proyectoLinea65Evaluacion->entidad_aliada_comentario : 'Cumple',
            $proyectoLinea65Evaluacion->resultados_comentario ? $proyectoLinea65Evaluacion->resultados_comentario : 'Cumple',
            $proyectoLinea65Evaluacion->productos_comentario ? $proyectoLinea65Evaluacion->productos_comentario : 'Cumple',
            $proyectoLinea65Evaluacion->cadena_valor_comentario ? $proyectoLinea65Evaluacion->cadena_valor_comentario : 'Cumple',
            $proyectoLinea65Evaluacion->analisis_riesgos_comentario ? $proyectoLinea65Evaluacion->analisis_riesgos_comentario : 'Cumple',
            $proyectoLinea65Evaluacion->ortografia_comentario ? $proyectoLinea65Evaluacion->ortografia_comentario : 'Cumple',
            $proyectoLinea65Evaluacion->redaccion_comentario ? $proyectoLinea65Evaluacion->redaccion_comentario : 'Cumple',
            $proyectoLinea65Evaluacion->normas_apa_comentario ? $proyectoLinea65Evaluacion->normas_apa_comentario : 'Cumple',
            $proyectoLinea65Evaluacion->justificacion_economia_naranja_comentario ? $proyectoLinea65Evaluacion->justificacion_economia_naranja_comentario : 'Cumple',
            $proyectoLinea65Evaluacion->justificacion_industria_4_comentario ? $proyectoLinea65Evaluacion->justificacion_industria_4_comentario : 'Cumple',
            $proyectoLinea65Evaluacion->bibliografia_comentario ? $proyectoLinea65Evaluacion->bibliografia_comentario : 'Cumple',
            $proyectoLinea65Evaluacion->fechas_comentario ? $proyectoLinea65Evaluacion->fechas_comentario : 'Cumple',
            $proyectoLinea65Evaluacion->justificacion_politica_discapacidad_comentario ? $proyectoLinea65Evaluacion->justificacion_politica_discapacidad_comentario : 'Cumple',
            $proyectoLinea65Evaluacion->actividad_economica_comentario ? $proyectoLinea65Evaluacion->actividad_economica_comentario : 'Cumple',
            $proyectoLinea65Evaluacion->area_conocimiento_comentario ? $proyectoLinea65Evaluacion->area_conocimiento_comentario : 'Cumple',
            $proyectoLinea65Evaluacion->tematica_estrategica_comentario ? $proyectoLinea65Evaluacion->tematica_estrategica_comentario : 'Cumple',

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
            'Área de conocimiento',
            'Temática estratégica',
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
        return 'Cultura de la Innovación';
    }

    public function properties(): array
    {
        return [
            'title' => 'Comentarios evaluaciones de Cultura de la Innovación',
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
