<?php

namespace App\Exports;

use App\Models\Convocatoria;
use App\Models\EntidadAliada;
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

class EntidadesAliadasTaExport implements FromCollection, WithHeadings, WithMapping, WithStyles, WithProperties, WithColumnFormatting, WithTitle, ShouldAutoSize
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
        return EntidadAliada::select('entidades_aliadas.*', 'entidad_aliada_ta_tp.soporte_convenio', 'entidad_aliada_ta_tp.fecha_inicio_convenio', 'entidad_aliada_ta_tp.fecha_fin_convenio', 'proyectos.id as proyecto_id')
            ->join('entidad_aliada_ta_tp', 'entidades_aliadas.id', 'entidad_aliada_ta_tp.entidad_aliada_id')
            ->join('proyectos', 'entidades_aliadas.proyecto_id', 'proyectos.id')
            ->where('proyectos.linea_programatica_id', 5)
            ->where('proyectos.convocatoria_id', $this->convocatoria->id)
            ->get();
    }

    /**
     * @var Invoice $entidadAliada
     */
    public function map($entidadAliada): array
    {
        return [
            $this->convocatoria->descripcion,
            $entidadAliada->proyecto->codigo,
            $entidadAliada->proyecto->centroFormacion->regional->nombre,
            $entidadAliada->proyecto->centroFormacion->codigo,
            $entidadAliada->proyecto->centroFormacion->nombre,
            $entidadAliada->proyecto->lineaProgramatica->codigo,
            $entidadAliada->proyecto->lineaProgramatica->nombre,
            $entidadAliada->tipo,
            $entidadAliada->nombre,
            $entidadAliada->naturaleza,
            $entidadAliada->tipo_empresa,
            $entidadAliada->nit,
            $entidadAliada->soporte_convenio,
            $entidadAliada->fecha_inicio_convenio,
            $entidadAliada->fecha_fin_convenio,
        ];
    }

    public function headings(): array
    {
        return [
            'Convocatoria',
            'Código del proyecto',
            'Regional',
            'Código del centro de formación',
            'Centro de formación',
            'Código de la línea programática',
            'Línea programática',
            'Tipo de entidad',
            'Nombre',
            'Naturaleza',
            'Tipo de empresa',
            'NIT',
            'Url convenio',
            'Fecha de inicio de convenio',
            'Fecha de fin de convenio',
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
        return 'Entidades aliadas - TA';
    }

    public function properties(): array
    {
        return [
            'title' => 'Entidades aliadas - TA',
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
