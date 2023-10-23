<?php

namespace App\Exports;

use App\Models\Convocatoria;
use App\Models\Evaluacion\Evaluacion;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use PhpOffice\PhpSpreadsheet\Style\NumberFormat;
use Maatwebsite\Excel\Concerns\WithColumnFormatting;
use Maatwebsite\Excel\Concerns\WithProperties;

class EvaluacionesExport implements FromCollection, WithHeadings, WithMapping, WithStyles, WithProperties, WithColumnFormatting
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
        return Evaluacion::select('evaluaciones.*')->join('proyectos', 'evaluaciones.proyecto_id', 'proyectos.id')->where('proyectos.convocatoria_id', $this->convocatoria->id)->whereNotIn('proyectos.id', [1052, 1113])->get();
    }

    /**
     * @var Invoice $evaluacion
     */
    public function map($evaluacion): array
    {
        return [
            $evaluacion->proyecto->centroFormacion->regional->nombre,
            $evaluacion->proyecto->centroFormacion->codigo,
            $evaluacion->proyecto->centroFormacion->nombre,
            $evaluacion->id,
            $evaluacion->proyecto->codigo,
            $evaluacion->proyecto->lineaProgramatica->codigo,
            $evaluacion->evaluador->nombre,
            $evaluacion->evaluador->numero_documento,
            $evaluacion->evaluador->email,
            $evaluacion->proyecto->proyectoLinea66()->exists() ? $evaluacion->proyecto->estadoEvaluacionIdi($evaluacion->getTotalEvaluacionAttribute(), $evaluacion->getTotalRecomendacionesAttribute(), null, $evaluacion->causal_rechazo_idi)['estado'] : ($evaluacion->proyecto->proyectoLinea65()->exists() ? $evaluacion->proyecto->estadoEvaluacionCulturaInnovacion($evaluacion->getTotalEvaluacionAttribute(), $evaluacion->getTotalRecomendacionesAttribute(), null)['estado'] : ($evaluacion->proyecto->proyectoLinea70()->exists() ? $evaluacion->proyecto->estado_evaluacion_ta['estado'] : ($evaluacion->proyecto->proyectoLinea69()->exists() ? $evaluacion->proyecto->estado_evaluacion_tp['estado'] : ($evaluacion->proyecto->proyectoLinea68()->exists() ? $evaluacion->proyecto->estadoEvaluacionServiciosTecnologicos($evaluacion->getTotalEvaluacionAttribute(), $evaluacion->getTotalRecomendacionesAttribute(), null)['estado'] : 'Sin información registrada')))),
            $evaluacion->proyecto->proyectoLinea66()->exists() ? $evaluacion->getTotalEvaluacionAttribute() : ($evaluacion->proyecto->proyectoLinea65()->exists() ? $evaluacion->getTotalEvaluacionAttribute() : ($evaluacion->proyecto->proyectoLinea68()->exists() ? $evaluacion->getTotalEvaluacionAttribute() : 'Sin información registrada')),
            $evaluacion->getTotalRecomendacionesAttribute(),
            $evaluacion->evaluacionCausalesRechazo()->count() > 0 ? $evaluacion->evaluacionCausalesRechazo()->get()->map(function ($causalesRechazo) {
                return  strtr(utf8_decode($causalesRechazo->causal_rechazo_formateado), utf8_decode('àáâãäçèéêëìíîïñòóôõöùúûüýÿÀÁÂÃÄÇÈÉÊËÌÍÎÏÑÒÓÔÕÖÙÚÛÜÝ'), 'aaaaaceeeeiiiinooooouuuuyyAAAAACEEEEIIIINOOOOOUUUUY');
            }) : 'Sin causal de rechazo',
            $evaluacion->getVerificarEstadoEvaluacionAttribute(),
            $evaluacion->habilitado ? 'Evaluación habilitada' : 'Evaluación deshabilitada',
            $this->mapParticipantes($evaluacion->proyecto->participantes),
        ];
    }

    public function headings(): array
    {
        return [
            'Regional',
            'Código Centro de formación',
            'Centro de formación',
            'Evaluación ID',
            'Código proyecto',
            'Línea programática',
            'Evaluador',
            'Número de documento',
            'Correo electrónico',
            'Estado proyecto',
            'Puntaje',
            'Total recomendaciones',
            'Causales de rechazo',
            'Estado evaluación',
            'Habilitado',
            'Autores'
        ];
    }

    public function columnFormats(): array
    {
        return [
            'O' => NumberFormat::FORMAT_CURRENCY_USD_SIMPLE,
            'P' => NumberFormat::FORMAT_CURRENCY_USD_SIMPLE,
            'Q' => NumberFormat::FORMAT_CURRENCY_USD_SIMPLE,
        ];
    }

    public function properties(): array
    {
        return [
            'title' => 'Evaluaciones Convocatoria SENNOVA',
        ];
    }

    public function styles(Worksheet $sheet)
    {
        return [
            // Style the first row as bold text.
            1    => ['font' => ['bold' => true]],
        ];
    }

    private function mapParticipantes($participantes)
    {
        $mapParticipantes = [];

        foreach ($participantes as $participante) {
            array_push($mapParticipantes, [
                'nombre'        => strtr(utf8_decode($participante->nombre), utf8_decode('àáâãäçèéêëìíîïñòóôõöùúûüýÿÀÁÂÃÄÇÈÉÊËÌÍÎÏÑÒÓÔÕÖÙÚÛÜÝ'), 'aaaaaceeeeiiiinooooouuuuyyAAAAACEEEEIIIINOOOOOUUUUY'),
                'documento'     => $participante->numero_documento,
                'correo'        => $participante->email,
                'vinculacion'   => $participante->tipo_vinculacion_text,
                'meses'         => $participante->pivot->cantidad_meses,
                'horas'         => $participante->pivot->cantidad_horas,
            ]);
        }
        return $mapParticipantes;
    }
}
