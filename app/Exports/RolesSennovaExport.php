<?php

namespace App\Exports;

use App\Models\ProyectoRolSennova;
use App\Models\Convocatoria;
use Illuminate\Support\Facades\Storage;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use PhpOffice\PhpSpreadsheet\Style\NumberFormat;
use Maatwebsite\Excel\Concerns\WithColumnFormatting;
use Maatwebsite\Excel\Concerns\WithTitle;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use PhpOffice\PhpSpreadsheet\Style\Fill;

class RolesSennovaExport implements FromCollection, WithHeadings, WithMapping, WithStyles, WithColumnFormatting, ShouldAutoSize, WithTitle
{
    protected $datos;
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
        $proyectos_ids = explode(',', $this->convocatoria->proyectos->implode('id', ','));

        return ProyectoRolSennova::whereIn('proyecto_id', $proyectos_ids)->with('convocatoriaRolSennova.rolSennova')->get();
    }

    /**
     * @var Invoice $rolSennova
     */
    public function map($rolSennova): array
    {
        $informacion_celdas = [
            $this->convocatoria->descripcion . ' ' . $this->convocatoria->year,
            $rolSennova->proyecto->tipoFormularioConvocatoria->nombre,
            $rolSennova->proyecto->codigo,
            $rolSennova->proyecto->centroFormacion->regional->nombre,
            $rolSennova->proyecto->centroFormacion->codigo,
            $rolSennova->proyecto->centroFormacion->nombre,
            $rolSennova->convocatoriaRolSennova->rolSennova->nombre,
            $rolSennova->descripcion,
            $rolSennova->numero_meses,
            $rolSennova->numero_roles,
            $rolSennova->convocatoriaRolSennova->experiencia,
            collect(json_decode(Storage::get('json/niveles-academicos.json'), true))->firstWhere('value', $rolSennova->convocatoriaRolSennova->nivel_academico)['label'],
            $rolSennova->convocatoriaRolSennova->asignacion_mensual,
            $rolSennova->getTotalRolSennova(),
            // $rolSennova->getRolAprobadoAttribute(),

        ];

        return $informacion_celdas;
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
            'Rol SENNOVA',
            'Descripción',
            'Número de meses',
            'Número de roles',
            'Experiencia',
            'Nivel académico',
            'Asignación mensual',
            'Total',
            // 'Estado final',
        ];
    }

    public function columnFormats(): array
    {
        return [
            'M' => NumberFormat::FORMAT_CURRENCY_USD,
            'N' => NumberFormat::FORMAT_CURRENCY_USD,
        ];
    }

    /**
     * @return string
     */
    public function title(): string
    {
        return 'Roles SENNOVA';
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
