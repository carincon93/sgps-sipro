<?php

namespace App\Exports;

use App\Models\Convocatoria;
use App\Models\EntidadAliada;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use Maatwebsite\Excel\Concerns\WithTitle;
use PhpOffice\PhpSpreadsheet\Style\NumberFormat;
use Maatwebsite\Excel\Concerns\WithColumnFormatting;
use Maatwebsite\Excel\Concerns\WithProperties;

class EntidadesAliadasIdiExport implements FromCollection, WithHeadings, WithMapping, WithStyles, WithProperties, WithColumnFormatting, WithTitle
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
        return EntidadAliada::select('entidades_aliadas.*', 'entidad_aliada_idi.descripcion_convenio', 'entidad_aliada_idi.grupo_investigacion', 'entidad_aliada_idi.codigo_gruplac', 'entidad_aliada_idi.enlace_gruplac', 'entidad_aliada_idi.actividades_transferencia_conocimiento', 'entidad_aliada_idi.carta_intencion', 'entidad_aliada_idi.carta_propiedad_intelectual', 'entidad_aliada_idi.recursos_especie', 'entidad_aliada_idi.descripcion_recursos_especie', 'entidad_aliada_idi.recursos_dinero', 'entidad_aliada_idi.descripcion_recursos_dinero', 'proyectos.id as proyecto_id')->join('entidad_aliada_idi', 'entidades_aliadas.id', 'entidad_aliada_idi.entidad_aliada_id')->join('proyectos', 'entidades_aliadas.proyecto_id', 'proyectos.id')->where('proyectos.convocatoria_id', $this->convocatoria->id)->whereNotIn('proyectos.id', [1052, 1113])->get();
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
            $entidadAliada->descripcion_convenio,
            $entidadAliada->grupo_investigacion,
            $entidadAliada->codigo_gruplac,
            $entidadAliada->enlace_gruplac,
            $entidadAliada->actividades_transferencia_conocimiento,
            $entidadAliada->recursos_especie,
            $entidadAliada->descripcion_recursos_especie,
            $entidadAliada->recursos_dinero,
            $entidadAliada->descripcion_recursos_dinero,
            $entidadAliada->carta_intencion,
            $entidadAliada->carta_propiedad_intelectual,
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
            'Tipo',
            'Nombre',
            'Naturaleza',
            'Tipo de empresa',
            'NIT',
            'Descripción del convenio',
            'Grupo de investigación',
            'Código GrupLAC',
            'Enlace GrupLAC',
            'Actividades de tranferencia de conocimiento',
            'Recursos en especie',
            'Descripción - Recursos en especie',
            'Recursos en dinero',
            'Descripción - Recursos en dinero',
            'Enlace de descarga - Carta de intención',
            'Enlace de descarga - Carta de propiedad intelectual',
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
        return 'Entidades aliadas - IDI';
    }

    public function properties(): array
    {
        return [
            'title' => 'Entidades aliadas - IDI',
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
