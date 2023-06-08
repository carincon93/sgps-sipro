<?php

namespace App\Exports;

use App\Models\Convocatoria;
use App\Models\Edt;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use Maatwebsite\Excel\Concerns\WithTitle;
use PhpOffice\PhpSpreadsheet\Style\NumberFormat;
use Maatwebsite\Excel\Concerns\WithColumnFormatting;
use Maatwebsite\Excel\Concerns\WithProperties;

class EdtTaExport implements FromCollection, WithHeadings, WithMapping, WithStyles, WithProperties, WithColumnFormatting, WithTitle
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
        return Edt::selectRaw("edt.*, ta.id as ta_id, proyectos.id as proyecto_id, CASE edt.tipo_evento
            WHEN '1' THEN 'Presencial'
            WHEN '2' THEN 'Virtual'
            END as tipo_evento")
            ->join('ta', 'edt.ta_id', 'ta.id')
            ->join('proyectos', 'ta.id', 'proyectos.id')
            ->where('proyectos.linea_programatica_id', 5)
            ->where('proyectos.convocatoria_id', $this->convocatoria->id)
            ->whereNotIn('proyectos.id', [1052, 1113])->get();
    }

    /**
     * @var Invoice $edt
     */
    public function map($edt): array
    {
        return [
            'SGPS-' . ($edt->proyecto_id + 8000),
            $edt->tipo_evento,
            $edt->descripcion_evento,
            $edt->descripcion_participacion_entidad,
            $edt->publico_objetivo,
            $edt->numero_asistentes,
            $edt->estrategia_comunicacion,

        ];
    }

    public function headings(): array
    {
        return [
            'Código del proyecto',
            'Tipo de evento',
            'Descripción del evento',
            'Descripción participacion entidad',
            'Público objetivo',
            '# asistentes',
            'Estratégia de comunicación',
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
        return 'EDT';
    }

    public function properties(): array
    {
        return [
            'title' => 'EDT',
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
