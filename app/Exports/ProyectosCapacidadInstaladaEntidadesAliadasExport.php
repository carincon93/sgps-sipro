<?php

namespace App\Exports;

use App\Models\ProyectoCapacidadInstaladaEntidadAliada;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use PhpOffice\PhpSpreadsheet\Style\NumberFormat;
use Maatwebsite\Excel\Concerns\WithColumnFormatting;
use Maatwebsite\Excel\Concerns\WithProperties;
use Illuminate\Support\Facades\Storage;
use Maatwebsite\Excel\Concerns\WithTitle;

class ProyectosCapacidadInstaladaEntidadesAliadasExport implements FromCollection, WithHeadings, WithMapping, WithStyles, WithProperties, WithColumnFormatting, WithTitle
{
    protected $datos;

    public function __construct()
    {
        // 
    }

    /**
     * @return \Illuminate\Support\Collection
     */
    public function collection()
    {
        return ProyectoCapacidadInstaladaEntidadAliada::orderBy('proyecto_capacidad_instalada_id')->get();
    }

    /**
     * @var Invoice $proyecto
     */
    public function map($entidadAliada): array
    {
        return [
            $entidadAliada->proyectoCapacidadInstalada->codigo,
            $entidadAliada->nombre,
            $entidadAliada->nit,
            $entidadAliada->documento,
        ];
    }

    public function headings(): array
    {
        return [
            'Código del proyecto',
            'Nombre de la entidad',
            'NIT',
            'Documentos'
        ];
    }

    public function columnFormats(): array
    {
        return [
            // 
        ];
    }

    /**
     * @return string
     */
    public function title(): string
    {
        return 'Entidades aliadas';
    }

    public function properties(): array
    {
        return [
            'title' => 'Entidades aliadas',
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
