<?php

namespace App\Exports;

use App\Models\Convocatoria;
use App\Models\Evaluacion\TpEvaluacion;
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

class TPEvaluacionesExport implements FromCollection, WithHeadings, WithMapping, WithStyles, WithProperties, WithColumnFormatting, WithTitle, ShouldAutoSize
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
        return TpEvaluacion::select('tp_evaluaciones.*')->join('evaluaciones', 'tp_evaluaciones.id', 'evaluaciones.id')->join('proyectos', 'evaluaciones.proyecto_id', 'proyectos.id')->where('proyectos.convocatoria_id', $this->convocatoria->id)->get();
    }

    /**
     * @var Invoice $tpEvaluacion
     */
    public function map($tpEvaluacion): array
    {
        return [
            $tpEvaluacion->evaluacion->proyecto->centroFormacion->regional->nombre,
            $tpEvaluacion->evaluacion->proyecto->centroFormacion->codigo,
            $tpEvaluacion->evaluacion->proyecto->centroFormacion->nombre,
            $tpEvaluacion->evaluacion->proyecto->lineaProgramatica->codigo,
            $tpEvaluacion->evaluacion->evaluador->nombre,
            $tpEvaluacion->evaluacion->evaluador->numero_documento,
            $tpEvaluacion->evaluacion->evaluador->email,
            $tpEvaluacion->evaluacion->proyecto->codigo,
            $tpEvaluacion->evaluacion->proyecto->proyectoLinea69->titulo,
            $tpEvaluacion->resumen_regional_comentario ? $tpEvaluacion->resumen_regional_comentario : 'Cumple',
            $tpEvaluacion->antecedentes_regional_comentario ? $tpEvaluacion->antecedentes_regional_comentario : 'Cumple',
            $tpEvaluacion->municipios_comentario ? $tpEvaluacion->municipios_comentario : 'Cumple',
            $tpEvaluacion->fecha_ejecucion_comentario ? $tpEvaluacion->fecha_ejecucion_comentario : 'Cumple',
            $tpEvaluacion->cadena_valor_comentario ? $tpEvaluacion->cadena_valor_comentario : 'Cumple',
            $tpEvaluacion->impacto_centro_formacion_comentario ? $tpEvaluacion->impacto_centro_formacion_comentario : 'Cumple',
            $tpEvaluacion->bibliografia_comentario ? $tpEvaluacion->bibliografia_comentario : 'Cumple',
            $tpEvaluacion->retos_oportunidades_comentario ? $tpEvaluacion->retos_oportunidades_comentario : 'Cumple',
            $tpEvaluacion->pertinencia_territorio_comentario ? $tpEvaluacion->pertinencia_territorio_comentario : 'Cumple',
            $tpEvaluacion->metodologia_comentario ? $tpEvaluacion->metodologia_comentario : 'Cumple',
            $tpEvaluacion->analisis_riesgos_comentario ? $tpEvaluacion->analisis_riesgos_comentario : 'Cumple',
            $tpEvaluacion->anexos_comentario ? $tpEvaluacion->anexos_comentario : 'Cumple',
            $tpEvaluacion->productos_comentario ? $tpEvaluacion->productos_comentario : 'Cumple',
            $tpEvaluacion->arbol_problemas_comentario ? $tpEvaluacion->arbol_problemas_comentario : 'Cumple',
            $tpEvaluacion->arbol_objetivos_comentario ? $tpEvaluacion->arbol_objetivos_comentario : 'Cumple',
            $tpEvaluacion->ortografia_comentario ? $tpEvaluacion->ortografia_comentario : 'Cumple',
            $tpEvaluacion->proyecto_presupuesto_comentario ? $tpEvaluacion->proyecto_presupuesto_comentario : 'Cumple',
            $tpEvaluacion->redaccion_comentario ? $tpEvaluacion->redaccion_comentario : 'Cumple',
            $tpEvaluacion->normas_apa_comentario ? $tpEvaluacion->normas_apa_comentario : 'Cumple',
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
            'Resumen regional',
            'Antecedentes regional',
            'Municipios a impactar',
            'Fechas de ejecución',
            'Cadena de valor',
            'Impacto en el centro de formación',
            'Bibliografía',
            'Retos y oportunidades',
            'Pertinencia territorio',
            'Metodología',
            'Análisis de riesgos',
            'Anexos',
            'Productos',
            'Árbol de problemas',
            'Árbol de objetivos',
            'Ortografía',
            'Presupuesto',
            'Redacción',
            'Normas APA',
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
        return 'TP';
    }

    public function properties(): array
    {
        return [
            'title' => 'Comentarios evaluaciones de TP',
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
