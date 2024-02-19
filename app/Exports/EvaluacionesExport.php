<?php

namespace App\Exports;

use App\Models\Convocatoria;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithTitle;

class EvaluacionesExport implements FromCollection, WithHeadings, WithMapping, WithStyles, ShouldAutoSize, WithTitle, ShouldAutoSize
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
        return $this->convocatoria->evaluaciones()->orderBy('evaluaciones.proyecto_id')->get();
    }

    /**
     * @var Invoice $evaluacion
     */
    public function map($evaluacion): array
    {
        $informacion_celdas = [
            $this->convocatoria->descripcion . ' ' . $this->convocatoria->year,
            $evaluacion->proyecto->tipoFormularioConvocatoria->nombre,
            $evaluacion->proyecto->codigo,
            $evaluacion->proyecto->centroFormacion->regional->nombre,
            $evaluacion->proyecto->centroFormacion->codigo,
            $evaluacion->proyecto->centroFormacion->nombre,
            $evaluacion->id,
            $evaluacion->evaluador->nombre,
            $evaluacion->evaluador->email,
            'N/A',
            $evaluacion->total_recomendaciones,
            $evaluacion->iniciado ? 'SI' : 'NO',
            $evaluacion->habilitado ? 'SI' : 'NO',
            $evaluacion->finalizado ? 'SI' : 'NO',
        ];

        $this->setEstadosEvaluacionPorFormulario($evaluacion, $informacion_celdas);

        return $informacion_celdas;
    }

    private function setEstadosEvaluacionPorFormulario($evaluacion, &$informacion_celdas)
    {
        if ($evaluacion->evaluacionesProyectoFormulario1Linea65()->exists()) {
            $informacion_celdas[9] = $evaluacion->evaluacionesProyectoFormulario1Linea65->sum(function ($record) {
                return (float) $record->puntaje;
            });
        }
        if ($evaluacion->evaluacionesProyectoFormulario3Linea61()->exists()) {
            $informacion_celdas[9] = $evaluacion->evaluacionesProyectoFormulario3Linea61->sum(function ($record) {
                return (float) $record->puntaje;
            });
        }
        if ($evaluacion->evaluacionesProyectoFormulario4Linea70()->exists()) {
            $informacion_celdas[9] = $evaluacion->evaluacionesProyectoFormulario4Linea70->sum(function ($record) {
                return (float) $record->puntaje;
            });
        }
        if ($evaluacion->evaluacionesProyectoFormulario5Linea69()->exists()) {
            $informacion_celdas[9] = $evaluacion->evaluacionesProyectoFormulario5Linea69->sum(function ($record) {
                return (float) $record->puntaje;
            });
        }
        if ($evaluacion->evaluacionesProyectoFormulario6Linea82()->exists()) {
            $informacion_celdas[9] = $evaluacion->evaluacionesProyectoFormulario6Linea82->sum(function ($record) {
                return (float) $record->puntaje;
            });
        }
        if ($evaluacion->evaluacionesProyectoFormulario7Linea23()->exists()) {
            $informacion_celdas[9] = $evaluacion->evaluacionesProyectoFormulario7Linea23->sum(function ($record) {
                return (float) $record->puntaje;
            });
        }
        if ($evaluacion->evaluacionesProyectoFormulario8Linea66()->exists()) {
            $informacion_celdas[9] = $evaluacion->evaluacionesProyectoFormulario8Linea66->sum(function ($record) {
                return (float) $record->puntaje;
            });
        }
        if ($evaluacion->evaluacionesProyectoFormulario9Linea23()->exists()) {
            $informacion_celdas[9] = $evaluacion->evaluacionesProyectoFormulario9Linea23->sum(function ($record) {
                return (float) $record->puntaje;
            });
        }
        if ($evaluacion->evaluacionesProyectoFormulario10Linea69()->exists()) {
            $informacion_celdas[9] = $evaluacion->evaluacionesProyectoFormulario10Linea69->sum(function ($record) {
                return (float) $record->puntaje;
            });
        }
        if ($evaluacion->evaluacionesProyectoFormulario12Linea68()->exists()) {
            $informacion_celdas[9] = $evaluacion->evaluacionesProyectoFormulario12Linea68->sum(function ($record) {
                return (float) $record->puntaje;
            });
        }
        if ($evaluacion->evaluacionesProyectoFormulario13Linea65()->exists()) {
            $informacion_celdas[9] = $evaluacion->evaluacionesProyectoFormulario13Linea65->sum(function ($record) {
                return (float) $record->puntaje;
            });
        }
        if ($evaluacion->evaluacionesProyectoFormulario15Linea65()->exists()) {
            $informacion_celdas[9] = $evaluacion->evaluacionesProyectoFormulario15Linea65->sum(function ($record) {
                return (float) $record->puntaje;
            });
        }
        if ($evaluacion->evaluacionesProyectoFormulario16Linea65()->exists()) {
            $informacion_celdas[9] = $evaluacion->evaluacionesProyectoFormulario16Linea65->sum(function ($record) {
                return (float) $record->puntaje;
            });
        }
        if ($evaluacion->evaluacionesProyectoFormulario17Linea69()->exists()) {
            $informacion_celdas[9] = $evaluacion->evaluacionesProyectoFormulario17Linea69->sum(function ($record) {
                return (float) $record->puntaje;
            });
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
            'Código de evaluación',
            'Evaluador',
            'Correo electrónico',
            'Puntaje',
            'ïtems por mejorar',
            '¿Evaluación iniciada?',
            '¿Evaluación habilitada?',
            '¿Evaluación finalizada?',
        ];
    }

    /**
     * @return string
     */
    public function title(): string
    {
        return  'Evaluaciones ' . $this->convocatoria->descripcion . ' '  . $this->convocatoria->year;
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
}
