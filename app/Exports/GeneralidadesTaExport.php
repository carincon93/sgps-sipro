<?php

namespace App\Exports;

use App\Models\Convocatoria;
use App\Models\Ta;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use Maatwebsite\Excel\Concerns\WithTitle;
use PhpOffice\PhpSpreadsheet\Style\NumberFormat;
use Maatwebsite\Excel\Concerns\WithColumnFormatting;
use Maatwebsite\Excel\Concerns\WithProperties;

class GeneralidadesTaExport implements FromCollection, WithHeadings, WithMapping, WithStyles, WithProperties, WithColumnFormatting, WithTitle
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
        return Ta::selectRaw("ta.*, CASE ta.infraestructura_tecnoacademia
            WHEN '1' THEN 'Infraestructura del SENA'
            WHEN '2' THEN 'Infraestructura de entidad pública'
            WHEN '3' THEN 'Infraestructura entidad privada'
            END as infraestructura_tecnoacademia")
            ->join('proyectos', 'ta.id', 'proyectos.id')
            ->where('proyectos.convocatoria_id', $this->convocatoria->id)->whereNotIn('ta.id', [1052, 1113])->get();
    }

    /**
     * @var Invoice $ta
     */
    public function map($ta): array
    {
        return [
            $this->convocatoria->descripcion,
            $proyectoLinea70->proyecto->centroFormacion->regional->nombre,
            $proyectoLinea70->proyecto->centroFormacion->codigo,
            $proyectoLinea70->proyecto->centroFormacion->nombre,
            $proyectoLinea70->proyecto->codigo,
            $proyectoLinea70->titulo,
            $proyectoLinea70->resumen,
            $proyectoLinea70->resumen_regional,
            $proyectoLinea70->antecedentes,
            $proyectoLinea70->antecedentes_tecnoacademia,
            $proyectoLinea70->problema_central,
            $proyectoLinea70->justificacion_problema,
            $proyectoLinea70->retos_oportunidades,
            $proyectoLinea70->pertinencia_territorio,
            $proyectoLinea70->marco_conceptual,
            $proyectoLinea70->objetivo_general,
            $proyectoLinea70->metodologia,
            $proyectoLinea70->metodologia_local,
            $proyectoLinea70->impacto_municipios,
            $proyectoLinea70->fecha_inicio,
            $proyectoLinea70->fecha_finalizacion,
            $proyectoLinea70->propuesta_sostenibilidad_social,
            $proyectoLinea70->propuesta_sostenibilidad_financiera,
            $proyectoLinea70->propuesta_sostenibilidad_ambiental,
            $proyectoLinea70->articulacion_centro_formacion,
            $proyectoLinea70->bibliografia,
            $proyectoLinea70->numero_instituciones,
            $proyectoLinea70->nuevas_instituciones,
            $proyectoLinea70->otras_nuevas_instituciones,
            $proyectoLinea70->nombre_instituciones,
            $proyectoLinea70->otras_nombre_instituciones,
            $proyectoLinea70->nombre_instituciones_programas,
            $proyectoLinea70->otras_nombre_instituciones_programas,
            $proyectoLinea70->cantidad_instructores_planta,
            $proyectoLinea70->cantidad_dinamizadores_planta,
            $proyectoLinea70->cantidad_psicopedagogos_planta,
            $proyectoLinea70->proyectos_ejecucion,
            $proyectoLinea70->proyectos_macro,
            $proyectoLinea70->lineas_medulares_centro,
            $proyectoLinea70->lineas_tecnologicas_centro,
            $proyectoLinea70->proyeccion_nuevas_instituciones ? 'Si' : 'No',
            $proyectoLinea70->proyeccion_articulacion_media ? 'Si' : 'No',
            $proyectoLinea70->articulacion_semillero ? 'Si' : 'No',
            $proyectoLinea70->semilleros_en_formalizacion,
            $proyectoLinea70->infraestructura_tecnoacademia,
            ($proyectoLinea70->proyecto->finalizado) ? 'SI' : 'NO',
            ($proyectoLinea70->proyecto->habilitado_para_evaluar) ? 'SI' : 'NO',
            $proyectoLinea70->proyecto->estado_cord_sennova ? json_decode($proyectoLinea70->proyecto->estado_cord_sennova)->estado : ($proyectoLinea70->proyecto->proyectoLinea70()->exists() ? $proyectoLinea70->proyecto->estado_evaluacion_ta['estado'] : 'Sin información registrada'),
        ];
    }

    public function headings(): array
    {
        return [
            'Convocatoria',
            'Regional',
            'Código del centro',
            'Centro de formación',
            'Código del proyecto',
            'Título',
            'Resumen',
            'Resumen ejecutivo regional',
            'Antecedentes',
            'Antecedentes de la Tecnoacademia y su impacto en la región',
            'Problema central',
            'Justificación del problema',
            'Descripción de retos y prioridades locales y regionales en los cuales la Tecnoacademia tiene impacto',
            'Justificación y pertinencia en el territorio',
            'Marco conceptual',
            'Objetivo general',
            'Metodología',
            'Metodología local',
            'Descripción del beneficio o impacto generado por la TecnoAcademia en los municipios',
            'Fecha de inicio',
            'Fecha de finalización',
            'Propuesta de sostenibilidad social',
            'Propuesta de sostenibilidad financiera',
            'Propuesta de sostenibilidad ambiental',
            'Articulación con el centro de formación',
            'Bibliografía',
            'Número instituciones',
            'Nuevas instituciones educativas que se vincularán con el proyecto de TecnoAcademia',
            'Nuevas instituciones educativas que se vincularán con el proyecto de TecnoAcademia',
            'Instituciones donde se implementará el programa que tienen articulación con la Media',
            'Instituciones donde se implementará el programa que tienen articulación con la Media',
            'Instituciones donde se están ejecutando los programas y que se espera continuar con el proyecto de TecnoAcademias',
            'Instituciones donde se están ejecutando los programas y que se espera continuar con el proyecto de TecnoAcademias',
            'Cantidad instructores de planta',
            'Cantidad dinamizadores de planta',
            'Cantidad psicopedagogos de planta',
            'Proyectos o iniciativas en ejecución en el año 2021',
            'Proyectos Macro o líneas de proyecto de investigación formativa y aplicada de la TecnoAcademia para la vigencia 2022',
            'Líneas medulares del Centro con las que se articula la TecnoAcademia',
            'Líneas tecnológicas del Centro con las que se articula la TecnoAcademia',
            '¿Se proyecta incluir nuevas Instituciones Educativas en la nueva vigencia?',
            '¿Se proyecta incluir Instituciones Educativas en articulación con la media?',
            '¿Está la TecnoAcademia articulada con un semillero?',
            'Semilleros en proceso de formalización',
            'Infraestructura tecnoacademia',
            'Finalizado',
            'Radicado',
            'Estado final',
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
        return 'Generalidades';
    }

    public function properties(): array
    {
        return [
            'title' => 'Proyectos TA',
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
