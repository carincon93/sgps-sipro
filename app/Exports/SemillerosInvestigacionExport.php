<?php

namespace App\Exports;

use App\Models\Convocatoria;
use App\Models\SemilleroInvestigacion;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use Maatwebsite\Excel\Concerns\WithTitle;
use PhpOffice\PhpSpreadsheet\Style\NumberFormat;
use Maatwebsite\Excel\Concerns\WithColumnFormatting;
use Maatwebsite\Excel\Concerns\WithProperties;

class SemillerosInvestigacionExport implements FromCollection, WithHeadings, WithMapping, WithStyles, WithProperties, WithColumnFormatting, WithTitle
{
    protected $convocatoria;

    public function __construct(Convocatoria $convocatoria, $lineasProgramaticasId)
    {
        $this->convocatoria = $convocatoria;
        $this->lineasProgramaticasId = $lineasProgramaticasId;
    }

    /**
     * @return \Illuminate\Support\Collection
     */
    public function collection()
    {
        return SemilleroInvestigacion::select('semilleros_investigacion.*', 'centros_formacion.nombre as nombre_centro', 'proyectos.id as proyecto_id')
            ->join('lineas_investigacion', 'semilleros_investigacion.linea_investigacion_id', 'lineas_investigacion.id')
            ->join('grupos_investigacion', 'lineas_investigacion.grupo_investigacion_id', 'grupos_investigacion.id')
            ->join('centros_formacion', 'grupos_investigacion.centro_formacion_id', 'centros_formacion.id')
            ->join('proyecto_semillero_investigacion', 'semilleros_investigacion.id', 'proyecto_semillero_investigacion.semillero_investigacion_id')
            ->join('proyectos', 'proyecto_semillero_investigacion.proyecto_id', 'proyectos.id')
            ->where('proyectos.convocatoria_id', $this->convocatoria->id)
            ->whereIn('proyectos.linea_programatica_id', $this->lineasProgramaticasId)
            ->whereNotIn('proyectos.id', [1052, 1113])->get();
    }

    /**
     * @var Invoice $semilleroInvestigacion
     */
    public function map($semilleroInvestigacion): array
    {
        return [
            'SGPS-' . ($semilleroInvestigacion->proyecto_id + 8000),
            $semilleroInvestigacion->nombre_centro,
            $semilleroInvestigacion->nombre,
            $semilleroInvestigacion->codigo,
            $semilleroInvestigacion->fecha_creacion_semillero,
            $semilleroInvestigacion->nombre_lider_semillero,
            $semilleroInvestigacion->email_contacto,
            $semilleroInvestigacion->reconocimientos_semillero_investigacion,
            $semilleroInvestigacion->vision,
            $semilleroInvestigacion->mision,
            $semilleroInvestigacion->objetivo_general,
            $semilleroInvestigacion->objetivos_especificos,
            $semilleroInvestigacion->link_semillero,
            $semilleroInvestigacion->formato_gic_f_021,
            $semilleroInvestigacion->formato_gic_f_032,
            $semilleroInvestigacion->formato_aval_semillero,
            $semilleroInvestigacion->es_semillero_tecnoacademia == 1 ? 'Si' : ($semilleroInvestigacion->es_semillero_tecnoacademia == 2 ? 'No' : ''),
        ];
    }

    public function headings(): array
    {
        return [
            'Código del proyecto',
            'Centro de formación',
            'Nombre',
            'Código del semillero',
            'Fecha de creación',
            'Nombre del líder de semillero',
            'Email de contacto',
            'Reconocimientos',
            'Visión',
            'Misión',
            'Objetivo general',
            'Objetivos específicos',
            'Link del semillero',
            'Formato GIC F 021',
            'Formato GIC F 032',
            'Formato Aval del semillero',
            '¿Semillero de TecnoAcademia?',
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
        return 'Semilleros de investigación';
    }

    public function properties(): array
    {
        return [
            'title' => 'Semilleros de investigación',
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
