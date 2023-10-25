<?php

namespace App\Exports;

use App\Models\Convocatoria;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use PhpOffice\PhpSpreadsheet\Style\NumberFormat;
use Maatwebsite\Excel\Concerns\WithColumnFormatting;
use Maatwebsite\Excel\Concerns\WithProperties;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Illuminate\Support\Facades\Storage;

class ProyectosExport implements FromCollection, WithHeadings, WithMapping, WithStyles, WithProperties, WithColumnFormatting, ShouldAutoSize
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
        return $this->convocatoria->proyectos()->get();
    }
    /**
     * @var Invoice $proyecto
     */
    public function map($proyecto): array
    {
        $redes_conocimiento         = '';
        $disciplina_conocimiento    = '';
        $subarea_conocimiento       = '';
        $area_conocimiento          = '';
        $titulo                     = '';
        $objetivo_general           = '';

        if ($proyecto->proyectoFormulario1Linea65()->exists()) {
            $redes_conocimiento         = $proyecto->redesConocimiento->implode(', ');
            $disciplina_conocimiento    = optional($proyecto->proyectoFormulario1Linea65->disciplinaSubareaConocimiento)->nombre;
            $subarea_conocimiento       = optional(optional($proyecto->proyectoFormulario1Linea65->disciplinaSubareaConocimiento)->subareaConocimiento)->nombre;
            $area_conocimiento          = optional(optional(optional($proyecto->proyectoFormulario1Linea65->disciplinaSubareaConocimiento)->subareaConocimiento)->areaConocimiento)->nombre;
            $redes_conocimiento         = $proyecto->redesConocimiento->implode(', ');
            $titulo                     = $proyecto->proyectoFormulario1Linea65->titulo;
            $objetivo_general           = $proyecto->proyectoFormulario1Linea65->objetivo_general;
        }

        if ($proyecto->proyectoFormulario3Linea61()->exists()) {
            $titulo                     = $proyecto->proyectoFormulario3Linea61->titulo;
            $objetivo_general           = $proyecto->proyectoFormulario3Linea61->objetivo_general;
        }

        if ($proyecto->proyectoFormulario4Linea70()->exists()) {
            $disciplina_conocimiento    = $proyecto->proyectoFormulario4Linea70->disciplinasSubareaConocimiento()->get()->pluck('nombre')->implode(', ');
            $titulo                     = $proyecto->proyectoFormulario4Linea70->titulo;
            $objetivo_general           = $proyecto->proyectoFormulario4Linea70->objetivo_general;
        }

        if ($proyecto->proyectoFormulario5Linea69()->exists()) {
            $titulo                     = $proyecto->proyectoFormulario5Linea69->titulo;
            $objetivo_general           = $proyecto->proyectoFormulario5Linea69->objetivo_general;
        }

        if ($proyecto->proyectoFormulario6Linea82()->exists()) {
            $redes_conocimiento = $proyecto->proyectoFormulario6Linea82->redConocimiento->nombre;
            $disciplina_conocimiento    = optional($proyecto->proyectoFormulario6Linea82->disciplinaSubareaConocimiento)->nombre;
            $subarea_conocimiento       = optional(optional($proyecto->proyectoFormulario6Linea82->disciplinaSubareaConocimiento)->subareaConocimiento)->nombre;
            $area_conocimiento          = optional(optional(optional($proyecto->proyectoFormulario6Linea82->disciplinaSubareaConocimiento)->subareaConocimiento)->areaConocimiento)->nombre;
            $titulo                     = $proyecto->proyectoFormulario6Linea82->titulo;
            $objetivo_general           = $proyecto->proyectoFormulario6Linea82->objetivo_general;
        }

        if ($proyecto->proyectoFormulario7Linea23()->exists()) {
            $titulo                     = $proyecto->proyectoFormulario7Linea23->titulo;
            $objetivo_general           = $proyecto->proyectoFormulario7Linea23->objetivo_general;
        }

        if ($proyecto->proyectoFormulario8Linea66()->exists()) {
            $redes_conocimiento         = $proyecto->proyectoFormulario8Linea66->redConocimiento->nombre;
            $disciplina_conocimiento    = optional($proyecto->proyectoFormulario8Linea66->disciplinaSubareaConocimiento)->nombre;
            $subarea_conocimiento       = optional(optional($proyecto->proyectoFormulario8Linea66->disciplinaSubareaConocimiento)->subareaConocimiento)->nombre;
            $area_conocimiento          = optional(optional(optional($proyecto->proyectoFormulario8Linea66->disciplinaSubareaConocimiento)->subareaConocimiento)->areaConocimiento)->nombre;
            $titulo                     = $proyecto->proyectoFormulario8Linea66->titulo;
            $objetivo_general           = $proyecto->proyectoFormulario8Linea66->objetivo_general;
        }

        if ($proyecto->proyectoFormulario9Linea23()->exists()) {
            $titulo                     = $proyecto->proyectoFormulario9Linea23->titulo;
            $objetivo_general           = $proyecto->proyectoFormulario9Linea23->objetivo_general;
        }

        if ($proyecto->proyectoFormulario10Linea69()->exists()) {
            $titulo                     = $proyecto->proyectoFormulario10Linea69->titulo;
            $objetivo_general           = $proyecto->proyectoFormulario10Linea69->objetivo_general;
        }

        // if ($proyecto->proyectosFormulario13Linea65()->exists()) {
        //     $disciplina_conocimiento = $proyecto->proyectosFormulario13Linea65->disciplinaSubareaConocimiento->nombre;
        // }

        if ($proyecto->proyectoFormulario12Linea68()->exists()) {
            $titulo                     = $proyecto->proyectoFormulario12Linea68->titulo;
            $objetivo_general           = $proyecto->proyectoFormulario12Linea68->objetivo_general;
        }

        if ($proyecto->proyectoFormulario13Linea65()->exists()) {
            $titulo                     = $proyecto->proyectoFormulario13Linea65->titulo;
            $objetivo_general           = $proyecto->proyectoFormulario13Linea65->objetivo_general;
        }

        if ($proyecto->proyectoFormulario15Linea65()->exists()) {
            $titulo                     = $proyecto->proyectoFormulario15Linea65->titulo;
            $objetivo_general           = $proyecto->proyectoFormulario15Linea65->objetivo_general;
        }

        if ($proyecto->proyectoFormulario16Linea65()->exists()) {
            $titulo                     = $proyecto->proyectoFormulario16Linea65->titulo;
            $objetivo_general           = $proyecto->proyectoFormulario16Linea65->objetivo_general;
        }

        if ($proyecto->proyectoFormulario17Linea69()->exists()) {
            $titulo                     = $proyecto->proyectoFormulario17Linea69->titulo;
            $objetivo_general           = $proyecto->proyectoFormulario17Linea69->objetivo_general;
        }

        return [
            $this->convocatoria->descripcion . ' ' . $this->convocatoria->year,
            $proyecto->codigo,
            $proyecto->centroFormacion->regional->nombre,
            $proyecto->centroFormacion->codigo,
            $proyecto->centroFormacion->nombre,
            $proyecto->tipoFormularioConvocatoria->nombre,
            mb_strtoupper($titulo),
            $redes_conocimiento,
            $area_conocimiento ?? 'N/A',
            $subarea_conocimiento ?? 'N/A',
            $disciplina_conocimiento ?? 'N/A',
            $objetivo_general,
            $proyecto->total_proyecto_presupuesto,
            $proyecto->total_roles_sennova,
            $proyecto->total_proyecto_presupuesto + $proyecto->total_roles_sennova,
            ($proyecto->finalizado) ? 'SI' : 'NO',
            $proyecto->participantes()->firstWhere('es_formulador', true) ? mb_strtoupper($proyecto->participantes()->firstWhere('es_formulador', true)->nombre) : 'Sin información registrada',
        ];
    }

    public function headings(): array
    {
        return [
            'Convocatoria',
            'Código SGPS',
            'Regional',
            'Código del centro formación',
            'Centro de formación',
            'Formulario',
            'Título',
            'Red de conocimiento',
            'Área de conocimiento',
            'Subárea de conocimiento',
            'Disciplina de conocimiento',
            'Objetivo general',
            'Total valor rubros presupuestales',
            'Total valor roles',
            'Total valor del proyecto',
            'Finalizado',
            'Autor(a) principal',
        ];
    }

    public function columnFormats(): array
    {
        return [
            'M' => NumberFormat::FORMAT_CURRENCY_USD,
            'N' => NumberFormat::FORMAT_CURRENCY_USD,
            'O' => NumberFormat::FORMAT_CURRENCY_USD,
        ];
    }

    public function properties(): array
    {
        return [
            'title' => 'Resumen proyectos ' . $this->convocatoria->descripcion,
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
    }
}
