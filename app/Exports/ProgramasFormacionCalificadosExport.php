<?php

namespace App\Exports;

use App\Models\Convocatoria;
use App\Models\ProgramaFormacion;
use Illuminate\Support\Facades\Storage;
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
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Style\Fill;

class ProgramasFormacionCalificadosExport implements FromCollection, WithHeadings, WithMapping, WithStyles, WithProperties, WithColumnFormatting, WithTitle, ShouldAutoSize
{
    protected $convocatoria;
    protected $tipo_formulario_convocatoria_id;

    public function __construct(Convocatoria $convocatoria,  $tipo_formulario_convocatoria_id)
    {
        $this->convocatoria = $convocatoria;
        $this->tipo_formulario_convocatoria_id = $tipo_formulario_convocatoria_id;
    }

    /**
     * @return \Illuminate\Support\Collection
     */
    public function collection()
    {
        return ProgramaFormacion::selectRaw("programas_formacion.*, proyectos.id as proyecto_id")
            ->join('proyecto_programa_formacion', 'programas_formacion.id', 'proyecto_programa_formacion.programa_formacion_id')
            ->join('proyectos', 'proyecto_programa_formacion.proyecto_id', 'proyectos.id')
            ->whereIn('proyectos.tipo_formulario_convocatoria_id', $this->tipo_formulario_convocatoria_id)
            ->where('proyectos.convocatoria_id', $this->convocatoria->id)
            ->where('programas_formacion.registro_calificado', true)
            ->orderBy('proyectos.id')
            ->get();
    }

    /**
     * @var Invoice $programa_formacion_registro_calificado
     */
    public function map($programa_formacion_registro_calificado): array
    {
        return [
            'SGPS-' . ($programa_formacion_registro_calificado->proyecto_id + 8000),
            $programa_formacion_registro_calificado->nombre,
            $programa_formacion_registro_calificado->codigo,
            collect(json_decode(Storage::get('json/modalidades-estudio.json'), true))->firstWhere('value', $programa_formacion_registro_calificado->modalidad)['label'],
            collect(json_decode(Storage::get('json/niveles-formacion.json'), true))->firstWhere('value', $programa_formacion_registro_calificado->nivel_formacion)['label'],
        ];
    }

    public function headings(): array
    {
        return [
            'Código del proyecto',
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
        return 'Programas formación registro calificado';
    }

    public function properties(): array
    {
        return [
            'title' => 'Programas formación registro calificado',
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
