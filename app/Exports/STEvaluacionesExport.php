<?php

namespace App\Exports;

use App\Models\Convocatoria;
use App\Models\Evaluacion\IdiEvaluacion;
use App\Models\Evaluacion\ServicioTecnologicoEvaluacion;
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

class STEvaluacionesExport implements FromCollection, WithHeadings, WithMapping, WithStyles, WithProperties, WithColumnFormatting, WithTitle, ShouldAutoSize
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
        return ServicioTecnologicoEvaluacion::select('servicios_tecnologicos_evaluaciones.*')->join('evaluaciones', 'servicios_tecnologicos_evaluaciones.id', 'evaluaciones.id')->join('proyectos', 'evaluaciones.proyecto_id', 'proyectos.id')->where('proyectos.convocatoria_id', $this->convocatoria->id)
            ->get();
    }

    /**
     * @var Invoice $stEvaluacion
     */
    public function map($stEvaluacion): array
    {
        return [
            $stEvaluacion->evaluacion->proyecto->centroFormacion->regional->nombre,
            $stEvaluacion->evaluacion->proyecto->centroFormacion->codigo,
            $stEvaluacion->evaluacion->proyecto->centroFormacion->nombre,
            $stEvaluacion->evaluacion->proyecto->lineaProgramatica->codigo,
            $stEvaluacion->evaluacion->evaluador->nombre,
            $stEvaluacion->evaluacion->evaluador->numero_documento,
            $stEvaluacion->evaluacion->evaluador->email,
            $stEvaluacion->evaluacion->proyecto->codigo,
            $stEvaluacion->evaluacion->proyecto->proyectoLinea68->titulo,

            $stEvaluacion->titulo_comentario ? $stEvaluacion->titulo_comentario : 'Cumple',
            $stEvaluacion->resumen_comentario ? $stEvaluacion->resumen_comentario : 'Cumple',
            $stEvaluacion->antecedentes_comentario ? $stEvaluacion->antecedentes_comentario : 'Cumple',
            $stEvaluacion->justificacion_problema_comentario ? $stEvaluacion->justificacion_problema_comentario : 'Cumple',
            $stEvaluacion->pregunta_formulacion_problema_comentario ? $stEvaluacion->pregunta_formulacion_problema_comentario : 'Cumple',
            $stEvaluacion->fecha_ejecucion_comentario ? $stEvaluacion->fecha_ejecucion_comentario : 'Cumple',
            $stEvaluacion->propuesta_sostenibilidad_comentario ? $stEvaluacion->propuesta_sostenibilidad_comentario : 'Cumple',
            $stEvaluacion->identificacion_problema_comentario ? $stEvaluacion->identificacion_problema_comentario : 'Cumple',
            $stEvaluacion->arbol_problemas_comentario ? $stEvaluacion->arbol_problemas_comentario : 'Cumple',
            $stEvaluacion->video_comentario ? $stEvaluacion->video_comentario : 'Cumple',
            $stEvaluacion->especificaciones_area_comentario ? $stEvaluacion->especificaciones_area_comentario : 'Cumple',
            $stEvaluacion->ortografia_comentario ? $stEvaluacion->ortografia_comentario : 'Cumple',
            $stEvaluacion->redaccion_comentario ? $stEvaluacion->redaccion_comentario : 'Cumple',
            $stEvaluacion->normas_apa_comentario ? $stEvaluacion->normas_apa_comentario : 'Cumple',
            $stEvaluacion->arbol_objetivos_comentario ? $stEvaluacion->arbol_objetivos_comentario : 'Cumple',
            $stEvaluacion->impacto_ambiental_comentario ? $stEvaluacion->impacto_ambiental_comentario : 'Cumple',
            $stEvaluacion->impacto_social_centro_comentario ? $stEvaluacion->impacto_social_centro_comentario : 'Cumple',
            $stEvaluacion->impacto_social_productivo_comentario ? $stEvaluacion->impacto_social_productivo_comentario : 'Cumple',
            $stEvaluacion->impacto_tecnologico_comentario ? $stEvaluacion->impacto_tecnologico_comentario : 'Cumple',
            $stEvaluacion->riesgos_objetivo_general_comentario ? $stEvaluacion->riesgos_objetivo_general_comentario : 'Cumple',
            $stEvaluacion->riesgos_productos_comentario ? $stEvaluacion->riesgos_productos_comentario : 'Cumple',
            $stEvaluacion->riesgos_actividades_comentario ? $stEvaluacion->riesgos_actividades_comentario : 'Cumple',
            $stEvaluacion->objetivo_general_comentario ? $stEvaluacion->objetivo_general_comentario : 'Cumple',
            $stEvaluacion->primer_objetivo_comentario ? $stEvaluacion->primer_objetivo_comentario : 'Cumple',
            $stEvaluacion->segundo_objetivo_comentario ? $stEvaluacion->segundo_objetivo_comentario : 'Cumple',
            $stEvaluacion->tercer_objetivo_comentario ? $stEvaluacion->tercer_objetivo_comentario : 'Cumple',
            $stEvaluacion->cuarto_objetivo_comentario ? $stEvaluacion->cuarto_objetivo_comentario : 'Cumple',
            $stEvaluacion->resultados_primer_obj_comentario ? $stEvaluacion->resultados_primer_obj_comentario : 'Cumple',
            $stEvaluacion->resultados_segundo_obj_comentario ? $stEvaluacion->resultados_segundo_obj_comentario : 'Cumple',
            $stEvaluacion->resultados_tercer_obj_comentario ? $stEvaluacion->resultados_tercer_obj_comentario : 'Cumple',
            $stEvaluacion->resultados_cuarto_obj_comentario ? $stEvaluacion->resultados_cuarto_obj_comentario : 'Cumple',
            $stEvaluacion->metodologia_comentario ? $stEvaluacion->metodologia_comentario : 'Cumple',
            $stEvaluacion->actividades_primer_obj_comentario ? $stEvaluacion->actividades_primer_obj_comentario : 'Cumple',
            $stEvaluacion->actividades_segundo_obj_comentario ? $stEvaluacion->actividades_segundo_obj_comentario : 'Cumple',
            $stEvaluacion->actividades_tercer_obj_comentario ? $stEvaluacion->actividades_tercer_obj_comentario : 'Cumple',
            $stEvaluacion->actividades_cuarto_obj_comentario ? $stEvaluacion->actividades_cuarto_obj_comentario : 'Cumple',
            $stEvaluacion->productos_primer_obj_comentario ? $stEvaluacion->productos_primer_obj_comentario : 'Cumple',
            $stEvaluacion->productos_segundo_obj_comentario ? $stEvaluacion->productos_segundo_obj_comentario : 'Cumple',
            $stEvaluacion->productos_tercer_obj_comentario ? $stEvaluacion->productos_tercer_obj_comentario : 'Cumple',
            $stEvaluacion->productos_cuarto_obj_comentario ? $stEvaluacion->productos_cuarto_obj_comentario : 'Cumple',
            $stEvaluacion->cadena_valor_comentario ? $stEvaluacion->cadena_valor_comentario : 'Cumple',
            $stEvaluacion->bibliografia_comentario ? $stEvaluacion->bibliografia_comentario : 'Cumple',
            $stEvaluacion->anexos_comentario ? $stEvaluacion->anexos_comentario : 'Cumple',
            $stEvaluacion->inventario_equipos_comentario ? $stEvaluacion->inventario_equipos_comentario : 'Cumple',
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
            'Resumen',
            'Antecedentes',
            'Justificación problema',
            'Pregunta formulación del problema',
            'Fechas de ejecución',
            'Propuesta de sostenibilidad',
            'Identificación del problema',
            'Árbol de problemas',
            'Video',
            'Especificaciones del área',
            'Ortografía',
            'Redacción',
            'Normas APA',
            'Árbol de objetivos',
            'Impacto ambiental',
            'Impacto social en el centro de formación',
            'Impacto social en el sector productivo',
            'Impacto tecnológico',
            'Análisis de riesgos - nivel objetivo general',
            'Análisis de riesgos - nivel productos',
            'Análisis de riesgos - nivel actividades',
            'Objetivo general',
            'Primer objetivo específico',
            'Segundo objetivo específico',
            'Tercer objetivo específico',
            'Cuarto objetivo específico',
            'Resultados del primer objetivo',
            'Resultados del segundo objetivo',
            'Resultados del tercer objetivo',
            'Resultados del cuarto objetivo',
            'Metodología',
            'Actividades del primer objetivo',
            'Actividades del segundo objetivo',
            'Actividades del tercer objetivo',
            'Actividades del cuarto objetivo',
            'Productos del primer objetivo',
            'Productos del segundo objetivo',
            'Productos del tercer objetivo',
            'Productos del cuarto objetivo',
            'Cadena de valor',
            'Bibliografía',
            'Anexos',
            'Inventario de equipos',
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
        return 'ST';
    }

    public function properties(): array
    {
        return [
            'title' => 'Comentarios evaluaciones de ST',
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
