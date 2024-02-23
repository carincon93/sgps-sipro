<?php

namespace App\Exports;

use App\Models\Convocatoria;
use App\Models\Municipio;
use App\Models\ProyectoFormulario12Linea68;
use Illuminate\Support\Facades\Storage;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Style\Border;
use Maatwebsite\Excel\Concerns\WithTitle;
use PhpOffice\PhpSpreadsheet\Style\NumberFormat;
use Maatwebsite\Excel\Concerns\WithColumnFormatting;
use Maatwebsite\Excel\Concerns\WithProperties;


class GeneralidadesProyectoFormulario12Linea68Export implements FromCollection, WithHeadings, WithMapping, WithStyles, WithProperties, WithColumnFormatting, WithTitle, ShouldAutoSize
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
        return ProyectoFormulario12Linea68::selectRaw("proyectos_formulario_12_linea_68.*, CASE tipos_proyecto_linea_68.tipo_proyecto
                        WHEN '1' THEN   concat('∙ Tipo de proyecto: A', chr(10), '∙ Línea técnica: ', lineas_tecnicas.nombre)
                        WHEN '2' THEN   concat('∙ Tipo de proyecto: B', chr(10), '∙ Línea técnica: ', lineas_tecnicas.nombre)
                    END as tipo_proyecto,
                    CASE tipos_proyecto_linea_68.tipologia
                        WHEN '1' THEN 'Especiales'
                        WHEN '2' THEN 'Laboratorios'
                        WHEN '3' THEN 'Técnicos'
                    END as tipologia,
                    CASE tipos_proyecto_linea_68.subclasificacion
                        WHEN '1' THEN 'Automatización y TICs'
                        WHEN '2' THEN 'Calibración'
                        WHEN '3' THEN 'Consultoría técnica'
                        WHEN '4' THEN 'Ensayo'
                        WHEN '5' THEN 'Fabricación especial'
                        WHEN '6' THEN 'Seguridad y salud en el trabajo'
                        WHEN '7' THEN 'Servicios de salud'
                    END as subclasificacion")
            ->join('tipos_proyecto_linea_68', 'proyectos_formulario_12_linea_68.tipo_proyecto_linea_68_id', 'tipos_proyecto_linea_68.id')
            ->join('lineas_tecnicas', 'tipos_proyecto_linea_68.linea_tecnica_id', 'lineas_tecnicas.id')
            ->join('proyectos', 'proyectos_formulario_12_linea_68.id', 'proyectos.id')
            ->where('proyectos.convocatoria_id', $this->convocatoria->id)
            ->orderBy('proyectos.id')
            ->get();
    }

    /**
     * @var Invoice $proyecto_formulario_12_linea_68
     */
    public function map($proyecto_formulario_12_linea_68): array
    {
        return [
            $this->convocatoria->descripcion . ' ' . $this->convocatoria->year,
            $proyecto_formulario_12_linea_68->proyecto->centroFormacion->regional->nombre,
            $proyecto_formulario_12_linea_68->proyecto->centroFormacion->codigo,
            $proyecto_formulario_12_linea_68->proyecto->centroFormacion->nombre,
            $proyecto_formulario_12_linea_68->proyecto->codigo,
            $proyecto_formulario_12_linea_68->titulo,
            $proyecto_formulario_12_linea_68->tipo_proyecto,
            $proyecto_formulario_12_linea_68->tipologia,
            $proyecto_formulario_12_linea_68->subclasificacion,
            $proyecto_formulario_12_linea_68->estadoSistemaGestion->estado,
            collect(json_decode(Storage::get('json/sectores-productivos.json'), true))->firstWhere('value', $proyecto_formulario_12_linea_68->sector_productivo)['label'],
            $proyecto_formulario_12_linea_68->resumen,
            $proyecto_formulario_12_linea_68->antecedentes,
            $proyecto_formulario_12_linea_68->continuidad,
            $proyecto_formulario_12_linea_68->problema_central,
            $proyecto_formulario_12_linea_68->justificacion_problema,
            $proyecto_formulario_12_linea_68->identificacion_problema,
            $proyecto_formulario_12_linea_68->pregunta_formulacion_problema,
            $proyecto_formulario_12_linea_68->objetivo_general,
            $proyecto_formulario_12_linea_68->metodologia,
            $proyecto_formulario_12_linea_68->fecha_inicio,
            $proyecto_formulario_12_linea_68->fecha_finalizacion,
            $proyecto_formulario_12_linea_68->propuesta_sostenibilidad,
            $proyecto_formulario_12_linea_68->municipios_influencia ? Municipio::whereIn('id', $proyecto_formulario_12_linea_68->municipios_influencia)->pluck('nombre')->implode(', ') : null,
            $proyecto_formulario_12_linea_68->otras_zonas_influencia,
            $proyecto_formulario_12_linea_68->video,
            $proyecto_formulario_12_linea_68->especificaciones_area,
            $proyecto_formulario_12_linea_68->infraestructura_adecuada === TRUE  ? 'SI' : 'NO',
            $proyecto_formulario_12_linea_68->bibliografia,
            $proyecto_formulario_12_linea_68->proyecto->participantes()->firstWhere('es_formulador', true) ? mb_strtoupper($proyecto_formulario_12_linea_68->proyecto->participantes()->firstWhere('es_formulador', true)->nombre) : 'Sin información registrada',
            ($proyecto_formulario_12_linea_68->proyecto->finalizado) ? 'SI' : 'NO',
            ($proyecto_formulario_12_linea_68->proyecto->radicado) ? 'SI' : 'NO',
            $this->estadoEvaluacion($proyecto_formulario_12_linea_68->proyecto->estadoEvaluacionProyecto)
        ];
    }

    public function headings(): array
    {
        return [
            'Convocatoria',
            'Código del centro',
            'Regional',
            'Centro de formación',
            'Código del proyecto',
            'Título',
            'Tipo de proyecto',
            'Tipología',
            'Subclasificación',
            'Estado del sistema de gestión',
            'Estrategia SENA priorizada',
            'Resumen',
            'Antecedentes',
            'Último proyecto financiado',
            'Problema central',
            'Justificación del problema',
            'Identificación del problema',
            'Pregunta de formulación del proyecto',
            'Objetivo general',
            'Metodología',
            'Fecha de inicio',
            'Fecha de finalización',
            'Propuesta de sostenibilidad',
            'Zona de influencia',
            'Otras zonas de influencia',
            'Video',
            'Especificaciones del área',
            '¿Cuenta con la infraestructura adecuada?',
            'Bibliografía',
            'Autor(a) principal',
            'Finalizado',
            'Priorizado',
            'Estado evaluación',
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
            'title' => 'Proyectos Formulario 12',
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

    private function estadoEvaluacion($proyecto_estado_evaluacion)
    {
        $estado_evaluacion = '';
        foreach ($proyecto_estado_evaluacion as $key => $value) {
            $estado_evaluacion .= $key . ': ' . $value . ', ';
        }

        // Remove the trailing comma and space
        return $estado_evaluacion = rtrim($estado_evaluacion, ', ');
    }
}
