<?php

namespace App\Exports;

use App\Models\ProyectoPresupuesto;
use App\Models\Convocatoria;
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

class PresupuestosExport implements FromCollection, WithHeadings, WithMapping, WithStyles, WithColumnFormatting, ShouldAutoSize, WithTitle
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
        $proyectos_id = explode(',', $this->convocatoria->proyectos->implode('id', ','));

        return ProyectoPresupuesto::whereIn('proyecto_id', $proyectos_id)->with('convocatoriaProyectoRubrosPresupuestales.rubroPresupuestal.segundoGrupoPresupuestal', 'convocatoriaProyectoRubrosPresupuestales.rubroPresupuestal.tercerGrupoPresupuestal', 'convocatoriaProyectoRubrosPresupuestales.rubroPresupuestal.usoPresupuestal')->get();
    }

    /**
     * @var Invoice $presupuesto
     */
    public function map($presupuesto): array
    {
        $informacion_celdas = [
            $this->convocatoria->descripcion . ' ' . $this->convocatoria->year,
            $presupuesto->proyecto->tipoFormularioConvocatoria->nombre,
            $presupuesto->proyecto->codigo,
            $presupuesto->proyecto->centroFormacion->regional->nombre,
            $presupuesto->proyecto->centroFormacion->codigo,
            $presupuesto->proyecto->centroFormacion->nombre,
            optional(optional(optional($presupuesto->convocatoriaProyectoRubrosPresupuestales->first())->rubroPresupuestal)->segundoGrupoPresupuestal)->nombre,
            optional(optional(optional($presupuesto->convocatoriaProyectoRubrosPresupuestales->first())->rubroPresupuestal)->tercerGrupoPresupuestal)->nombre,
            $presupuesto->convocatoriaProyectoRubrosPresupuestales
                ->map(function ($convocatoria_rubro_presupuestal) {
                    return optional($convocatoria_rubro_presupuestal->rubroPresupuestal)->usoPresupuestal->descripcion;
                })
                ->implode(', '),
            $presupuesto->descripcion,
            $presupuesto->justificacion,
            $presupuesto->valor_total,
            // $presupuesto->getPresupuestoAprobadoAttribute(),
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
            'Concepto inerno SENA',
            'Concepto MinHacienda',
            'Usos presupuestales',
            'Descripción',
            'Justificación',
            'Valor',
            // 'Estado final',
        ];
    }

    public function columnFormats(): array
    {
        return [
            'N' => NumberFormat::FORMAT_CURRENCY_USD,
        ];
    }

    /**
     * @return string
     */
    public function title(): string
    {
        return 'Rúbrica presupuestal';
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
