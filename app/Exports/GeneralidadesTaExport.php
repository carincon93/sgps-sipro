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
            $ta->proyecto->centroFormacion->regional->nombre,
            $ta->proyecto->centroFormacion->codigo,
            $ta->proyecto->centroFormacion->nombre,
            $ta->proyecto->codigo,
            $ta->titulo,
            $ta->resumen,
            $ta->resumen_regional,
            $ta->antecedentes,
            $ta->antecedentes_tecnoacademia,
            $ta->problema_central,
            $ta->justificacion_problema,
            $ta->retos_oportunidades,
            $ta->pertinencia_territorio,
            $ta->marco_conceptual,
            $ta->objetivo_general,
            $ta->metodologia,
            $ta->metodologia_local,
            $ta->impacto_municipios,
            $ta->fecha_inicio,
            $ta->fecha_finalizacion,
            $ta->propuesta_sostenibilidad_social,
            $ta->propuesta_sostenibilidad_financiera,
            $ta->propuesta_sostenibilidad_ambiental,
            $ta->articulacion_centro_formacion,
            $ta->bibliografia,
            $ta->numero_instituciones,
            $ta->nuevas_instituciones,
            $ta->otras_nuevas_instituciones,
            $ta->nombre_instituciones,
            $ta->otras_nombre_instituciones,
            $ta->nombre_instituciones_programas,
            $ta->otras_nombre_instituciones_programas,
            $ta->cantidad_instructores_planta,
            $ta->cantidad_dinamizadores_planta,
            $ta->cantidad_psicopedagogos_planta,
            $ta->proyectos_ejecucion,
            $ta->proyectos_macro,
            $ta->lineas_medulares_centro,
            $ta->lineas_tecnologicas_centro,
            $ta->proyeccion_nuevas_instituciones ? 'Si' : 'No',
            $ta->proyeccion_articulacion_media ? 'Si' : 'No',
            $ta->articulacion_semillero ? 'Si' : 'No',
            $ta->semilleros_en_formalizacion,
            $ta->infraestructura_tecnoacademia,
            ($ta->proyecto->finalizado) ? 'SI' : 'NO',
            ($ta->proyecto->habilitado_para_evaluar) ? 'SI' : 'NO',
            $ta->proyecto->estado_cord_sennova ? json_decode($ta->proyecto->estado_cord_sennova)->estado : ($ta->proyecto->ta()->exists() ? $ta->proyecto->estado_evaluacion_ta['estado'] : 'Sin información registrada'),
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
