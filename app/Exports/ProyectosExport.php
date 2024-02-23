<?php

namespace App\Exports;

use App\Models\Convocatoria;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use PhpOffice\PhpSpreadsheet\Style\NumberFormat;
use Maatwebsite\Excel\Concerns\WithColumnFormatting;
use Maatwebsite\Excel\Concerns\WithProperties;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithTitle;

class ProyectosExport implements FromCollection, WithHeadings, WithMapping, WithStyles, WithColumnFormatting, ShouldAutoSize, WithTitle
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
        return $this->convocatoria->proyectos()->get();
    }

    /**
     * @var Invoice $proyecto
     */
    public function map($proyecto): array
    {
        $informacion_celdas = [
            $this->convocatoria->descripcion . ' ' . $this->convocatoria->year,
            $proyecto->tipoFormularioConvocatoria->nombre,
            $proyecto->codigo,
            $proyecto->centroFormacion->regional->nombre,
            $proyecto->centroFormacion->codigo,
            $proyecto->centroFormacion->nombre,
            'N/A', // Default value for $titulo
            'N/A', // Default value for $redes_conocimiento
            'N/A', // Default value for $area_conocimiento
            'N/A', // Default value for $subarea_conocimiento
            'N/A', // Default value for $disciplina_conocimiento
            '',    // Default value for $objetivo_general
            '',    // Default value for $campesena
            '',    // Default value for $lineas
            $proyecto->total_proyecto_presupuesto,
            $proyecto->total_roles_sennova,
            $proyecto->total_proyecto_presupuesto + $proyecto->total_roles_sennova,
            $proyecto->finalizado ? 'SI' : 'NO',
            $proyecto->radicado ? 'SI' : 'NO',
            $proyecto->participantes()->firstWhere('es_formulador', true) ? mb_strtoupper($proyecto->participantes()->firstWhere('es_formulador', true)->nombre) : 'Sin información registrada',
            $proyecto->evaluaciones->count(),
            $this->estadoEvaluacion($proyecto->estadoEvaluacionProyecto),
            $proyecto->finalizado_en_primera_fase ? 'SI' : 'NO',
            $proyecto->finalizado_en_subsanacion ? 'SI' : 'NO'
        ];

        $this->setRedesConocimiento($proyecto, $informacion_celdas);
        $this->setTituloYObjetivoGeneral($proyecto, $informacion_celdas);
        $this->setDisciplinaSubareaAreaConocimiento($proyecto, $informacion_celdas);

        return $informacion_celdas;
    }

    private function setRedesConocimiento($proyecto, &$informacion_celdas)
    {
        if ($proyecto->proyectoFormulario1Linea65()->exists()) {
            $informacion_celdas[7] = $proyecto->redesConocimiento->implode(', ');
        } elseif ($proyecto->proyectoFormulario6Linea82()->exists()) {
            $informacion_celdas[7] = $proyecto->proyectoFormulario6Linea82->redConocimiento->nombre;
        } elseif ($proyecto->proyectoFormulario8Linea66()->exists()) {
            $informacion_celdas[7] = $proyecto->proyectoFormulario8Linea66->redConocimiento->nombre;
        }
    }

    private function setTituloYObjetivoGeneral($proyecto, &$informacion_celdas)
    {
        $formularios = [
            ['formd_id' => 1, 'linea' => 65],
            ['formd_id' => 3, 'linea' => 61],
            ['formd_id' => 4, 'linea' => 70],
            ['formd_id' => 5, 'linea' => 69],
            ['formd_id' => 6, 'linea' => 82],
            ['formd_id' => 7, 'linea' => 23],
            ['formd_id' => 8, 'linea' => 66],
            ['formd_id' => 9, 'linea' => 23],
            ['formd_id' => 10, 'linea' => 69],
            ['formd_id' => 12, 'linea' => 68],
            ['formd_id' => 13, 'linea' => 65],
            ['formd_id' => 15, 'linea' => 65],
            ['formd_id' => 16, 'linea' => 65],
            ['formd_id' => 17, 'linea' => 69],
        ];

        foreach ($formularios as $formulario) {
            $formd_id   = $formulario['formd_id'];
            $linea      = $formulario['linea'];

            $formulario_method = "proyectoFormulario{$formd_id}Linea{$linea}";

            if ($proyecto->$formulario_method()->exists()) {
                $informacion_celdas[6]   = mb_strtoupper($proyecto->$formulario_method->titulo);
                $informacion_celdas[11]  = $proyecto->$formulario_method->objetivo_general;
                break;
            }
        }

        if (
            $proyecto->proyectoFormulario7Linea23()->exists() ||
            $proyecto->proyectoFormulario9Linea23()->exists() ||
            $proyecto->proyectoFormulario6Linea82()->exists() ||
            $proyecto->proyectoFormulario8Linea66()->exists()
        ) {
            $informacion_celdas[12] = (
                $proyecto->proyectoFormulario7Linea23->aporta_a_campesena ??
                $proyecto->proyectoFormulario9Linea23->aporta_a_campesena ??
                optional($proyecto->proyectoFormulario6Linea82)->relacionado_estrategia_campesena ??
                optional($proyecto->proyectoFormulario8Linea66)->relacionado_estrategia_campesena
            ) ? 'Si' : 'No';
        }

        if (
            $proyecto->proyectoFormulario16Linea65()->exists() ||
            $proyecto->proyectoFormulario1Linea65()->exists() ||
            $proyecto->proyectoFormulario15Linea65()->exists() ||
            $proyecto->proyectoFormulario13Linea65()->exists() ||
            $proyecto->proyectoFormulario6Linea82()->exists() ||
            $proyecto->proyectoFormulario8Linea66()->exists() ||
            $proyecto->proyectoFormulario7Linea23()->exists() ||
            $proyecto->proyectoFormulario9Linea23()->exists()
        ) {
            $informacion_celdas[13] = (
                $proyecto->proyectoFormulario16Linea65->lineas_estrategicas_sena_text ??
                $proyecto->proyectoFormulario1Linea65->lineas_estrategicas_sena_text ??
                $proyecto->proyectoFormulario15Linea65->lineas_estrategicas_sena_text ??
                $proyecto->proyectoFormulario13Linea65->lineas_estrategicas_sena_text ??
                $proyecto->proyectoFormulario6Linea82->lineas_estrategicas_beneficiadas_text ??
                $proyecto->proyectoFormulario8Linea66->lineas_estrategicas_beneficiadas_text ??
                $proyecto->proyectoFormulario7Linea23->lineas_estrategicas_beneficiadas_text ??
                $proyecto->proyectoFormulario9Linea23->lineas_estrategicas_beneficiadas_text
            );
        }
    }

    private function setDisciplinaSubareaAreaConocimiento($proyecto, &$informacion_celdas)
    {
        $formularios = [
            ['formd_id' => 1, 'linea' => 65],
            ['formd_id' => 6, 'linea' => 82],
            ['formd_id' => 8, 'linea' => 66],
            ['formd_id' => 13, 'linea' => 65],
        ];

        foreach ($formularios as $formulario) {
            $formd_id   = $formulario['formd_id'];
            $linea      = $formulario['linea'];

            $formulario_method = "proyectoFormulario{$formd_id}Linea{$linea}";

            if ($proyecto->$formulario_method()->exists()) {
                $disciplinaSubarea  = $proyecto->$formulario_method->disciplinaSubareaConocimiento;
                $informacion_celdas[8]       = optional(optional(optional($disciplinaSubarea)->subareaConocimiento)->areaConocimiento)->nombre;
                $informacion_celdas[9]       = optional(optional($disciplinaSubarea)->subareaConocimiento)->nombre;
                $informacion_celdas[10]      = optional($disciplinaSubarea)->nombre;
                break;
            }

            if ($proyecto->proyectoFormulario4Linea70()->exists()) {
                $informacion_celdas[10]    = $proyecto->proyectoFormulario4Linea70->disciplinasSubareaConocimiento()->get()->pluck('nombre')->implode(', ');
                break;
            }
        }
    }

    public function headings(): array
    {
        return [
            'Convocatoria',
            'Formulario',
            'Código SGPS',
            'Regional',
            'Código del centro formación',
            'Centro de formación',
            'Título',
            'Red de conocimiento',
            'Área de conocimiento',
            'Subárea de conocimiento',
            'Disciplina de conocimiento',
            'Objetivo general',
            '¿Aporta a CAMPESENA?',
            'Líneas estratégicas',
            'Total valor rubros presupuestales',
            'Total valor roles',
            'Total valor del proyecto',
            'Finalizado',
            'Priorizado',
            'Autor(a) principal',
            '# Evaluaciones asignadas',
            'Estado de la evaluación',
            'Finalizado en primera fase',
            'Finalizado en subsanación'
        ];
    }

    public function columnFormats(): array
    {
        return [
            'M' => NumberFormat::FORMAT_CURRENCY_USD,
            'N' => NumberFormat::FORMAT_CURRENCY_USD,
            'O' => NumberFormat::FORMAT_CURRENCY_USD,
        ];
    }

    /**
     * @return string
     */
    public function title(): string
    {
        return  $this->convocatoria->descripcion . ' '  . $this->convocatoria->year;
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
