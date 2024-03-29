<?php

namespace App\Exports;

use App\Models\Convocatoria;
use App\Models\ProgramaFormacion;
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

class ProgramasFormacionArticuladosExport implements FromCollection, WithHeadings, WithMapping, WithStyles, WithProperties, WithColumnFormatting, WithTitle, ShouldAutoSize
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
        return ProgramaFormacion::selectRaw("programas_formacion.nombre, programas_formacion.codigo, CASE programas_formacion.modalidad
            WHEN '1' THEN 'Presencial'
            WHEN '2' THEN 'A distancia'
            WHEN '3' THEN 'Virtual'
            WHEN '4' THEN 'Presencial / Virtual'
            END as modalidad, CASE programas_formacion.nivel_formacion
            WHEN '1' THEN 'Tecnología'
            WHEN '2' THEN 'Especialización técnica profesional'
            WHEN '3' THEN 'Especialización tecnológica'
            WHEN '4' THEN 'Técnico'
            WHEN '5' THEN 'Auxiliar'
            WHEN '6' THEN 'Operario'
            WHEN '7' THEN 'Profundización técnica'
            END as nivel_formacion, regionales.nombre as nombre_regional, centros_formacion.codigo as codigo_centro, centros_formacion.nombre as nombre_centro, lineas_programaticas.nombre as nombre_linea, lineas_programaticas.codigo as codigo_linea, proyectos.id as proyecto_id")
            ->join('proyecto_programa_formacion', 'programas_formacion.id', 'proyecto_programa_formacion.programa_formacion_id')
            ->join('proyectos', 'proyecto_programa_formacion.proyecto_id', 'proyectos.id')
            ->join('lineas_programaticas', 'proyectos.linea_programatica_id', 'lineas_programaticas.id')
            ->join('centros_formacion', 'proyectos.centro_formacion_id', 'centros_formacion.id')
            ->join('regionales', 'centros_formacion.regional_id', 'regionales.id')
            ->where('proyectos.convocatoria_id', $this->convocatoria->id)
            ->where('programas_formacion.registro_calificado', false)
            ->get();
    }

    /**
     * @var Invoice $programaFormacionArticulado
     */
    public function map($programaFormacionArticulado): array
    {
        return [
            $this->convocatoria->descripcion,
            'SGPS-' . ($programaFormacionArticulado->proyecto_id + 8000),
            $programaFormacionArticulado->nombre_regional,
            $programaFormacionArticulado->codigo_centro,
            $programaFormacionArticulado->nombre_centro,
            $programaFormacionArticulado->codigo_linea,
            $programaFormacionArticulado->nombre_linea,
            $programaFormacionArticulado->nombre,
            $programaFormacionArticulado->codigo,
            $programaFormacionArticulado->modalidad,
            $programaFormacionArticulado->nivel_formacion,
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
            'Nombre del programa',
            'Código',
            'Modalidad',
            'Nivel de formación',
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
        return 'Programas formación articulados';
    }

    public function properties(): array
    {
        return [
            'title' => 'Programas formación articulados',
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
