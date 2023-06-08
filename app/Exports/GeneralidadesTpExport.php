<?php

namespace App\Exports;

use App\Models\Convocatoria;
use App\Models\Tp;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use Maatwebsite\Excel\Concerns\WithTitle;
use PhpOffice\PhpSpreadsheet\Style\NumberFormat;
use Maatwebsite\Excel\Concerns\WithColumnFormatting;
use Maatwebsite\Excel\Concerns\WithProperties;

class GeneralidadesTpExport implements FromCollection, WithHeadings, WithMapping, WithStyles, WithProperties, WithColumnFormatting, WithTitle
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
            ->whereNotIn('tp.id', [1052, 1113])
            ->get();
    }

    /**
     * @var Invoice $tp
     */
    public function map($tp): array
    {
        return [
            $this->convocatoria->descripcion,
            $tp->proyecto->centroFormacion->regional->nombre,
            $tp->proyecto->centroFormacion->codigo,
            $tp->proyecto->centroFormacion->nombre,
            $tp->proyecto->codigo,
            $tp->titulo,
            $tp->resumen,
            $tp->resumen_regional,
            $tp->antecedentes,
            $tp->antecedentes_regional,
            $tp->problema_central,
            $tp->justificacion_problema,
            $tp->retos_oportunidades,
            $tp->pertinencia_territorio,
            $tp->marco_conceptual,
            $tp->objetivo_general,
            $tp->metodologia,
            $tp->metodologia_local,
            $tp->impacto_municipios,
            $tp->fecha_inicio,
            $tp->fecha_finalizacion,
            $tp->propuesta_sostenibilidad,
            $tp->impacto_centro_formacion,
            $tp->bibliografia,
            ($tp->proyecto->finalizado) ? 'SI' : 'NO',
            ($tp->proyecto->habilitado_para_evaluar) ? 'SI' : 'NO',
            $tp->proyecto->estado_cord_sennova ? json_decode($tp->proyecto->estado_cord_sennova)->estado : ($tp->proyecto->tp()->exists() ? $tp->proyecto->estado_evaluacion_tp['estado'] : 'Sin información registrada'),
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
        return [
            // Style the first row as bold text.
            1    => ['font' => ['bold' => true]],
        ];
    }
}
