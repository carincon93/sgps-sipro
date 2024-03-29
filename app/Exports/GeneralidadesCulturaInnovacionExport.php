<?php

namespace App\Exports;

use App\Models\Convocatoria;
use App\Models\CulturaInnovacion;
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

class GeneralidadesCulturaInnovacionExport implements FromCollection, WithHeadings, WithMapping, WithStyles, WithProperties, WithColumnFormatting, WithTitle, ShouldAutoSize
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
        return CulturaInnovacion::selectRaw("cultura_innovacion.*, CASE cultura_innovacion.muestreo
            WHEN '1' THEN 'Especies Nativas. (es la especie o subespecie taxonómica o variedad de animales cuya área de disposición geográfica se extiende al territorio nacional o a aguas jurisdiccionales colombianas o forma parte de los mismos comprendidas las especies o subespecies que migran temporalmente a ellos, siempre y cuando no se encuentren en el país o migren a él como resultado voluntario o involuntario de la actividad humana. Pueden ser silvestre, domesticada o escapada de domesticación incluyendo virus, viroides y similares)'
            WHEN '2' THEN 'Especies Introducidas. (son aquellas que no son nativas de Colombia y que ingresaron al país por intervención humana)'
            WHEN '3' THEN 'Recursos genéticos humanos y sus productos derivados'
            WHEN '4' THEN 'Intercambio de recursos genéticos y sus productos derivados, recursos biológicos que los contienen o los componentes asociados a estos. (son aquellas que realizan las comunidades indígenas, afroamericanas y locales de los Países Miembros de la Comunidad Andina entre sí y para su propio consumo, basadas en sus prácticas consuetudinarias)'
            WHEN '5' THEN 'Recurso biológico que involucren actividades de sistemática molecular, ecología molecular, evolución y biogeografía molecular (siempre que el recurso biológico se haya colectado en el marco de un permiso de recolección de especímenes de especies silvestres de la diversidad biológica con fines de investigación científica no comercial o provenga de una colección registrada ante el Instituto Alexander van Humboldt)'
            WHEN '6' THEN 'No aplica'
            END as muestreo,
            CASE cultura_innovacion.actividades_muestreo
            WHEN '1.1.1' THEN 'Separación de las unidades funcionales y no funcionales del ADN y el ARN, en todas las formas que se encuentran en la naturaleza.'
            WHEN '1.1.2' THEN 'Aislamiento de una o varias moléculas, entendidas estas como micro y macromoléculas, producidas por el metabolismo de un organismo.'
            WHEN '1.1.3' THEN 'Solicitar patente sobre una función o propiedad identificada de una molécula, que se ha aislado y purificado.'
            WHEN '1.1.4' THEN 'No logro identificar la actividad a desarrollar con la especie nativa'
            END as actividades_muestreo,
            CASE cultura_innovacion.objetivo_muestreo
            WHEN '1.2.1' THEN 'Investigación básica sin fines comerciales'
            WHEN '1.2.2' THEN 'Bioprospección en cualquiera de sus fases'
            WHEN '1.2.3' THEN 'Comercial o Industrial'
            END as objetivo_muestreo
            ")
            ->join('proyectos', 'cultura_innovacion.id', 'proyectos.id')
            ->where('proyectos.convocatoria_id', $this->convocatoria->id)
            ->get();
    }

    /**
     * @var Invoice $idi
     */
    public function map($proyectoLinea65): array
    {
        return [
            $this->convocatoria->descripcion,
            $proyectoLinea65->proyecto->centroFormacion->regional->nombre,
            $proyectoLinea65->proyecto->centroFormacion->codigo,
            $proyectoLinea65->proyecto->centroFormacion->nombre,
            $proyectoLinea65->proyecto->codigo,
            $proyectoLinea65->titulo,
            $proyectoLinea65->fecha_inicio,
            $proyectoLinea65->fecha_finalizacion,
            $proyectoLinea65->lineaInvestigacion->grupoInvestigacion->nombre,
            $proyectoLinea65->lineaInvestigacion->nombre,
            $proyectoLinea65->areaConocimiento->nombre,
            $proyectoLinea65->tematicaEstrategica->nombre,
            $proyectoLinea65->actividadEconomica->nombre,
            $proyectoLinea65->video,
            $proyectoLinea65->justificacion_industria_4,
            $proyectoLinea65->justificacion_economia_naranja,
            $proyectoLinea65->justificacion_politica_discapacidad,
            $proyectoLinea65->resumen,
            $proyectoLinea65->antecedentes,
            $proyectoLinea65->marco_conceptual,
            $proyectoLinea65->metodologia,
            $proyectoLinea65->propuesta_sostenibilidad,
            $proyectoLinea65->muestreo,
            $proyectoLinea65->actividades_muestreo,
            $proyectoLinea65->objetivo_muestreo,
            $proyectoLinea65->recoleccion_especimenes == 1 ? 'Si' : 'No',
            $proyectoLinea65->impacto_municipios,
            $proyectoLinea65->impacto_centro_formacion,
            $proyectoLinea65->objetivo_general,
            $proyectoLinea65->problema_central,
            $proyectoLinea65->justificacion_problema,
            $proyectoLinea65->relacionado_plan_tecnologico == 1 ? 'Si' : ($proyectoLinea65->relacionado_plan_tecnologico == 2 ? 'No' : 'No aplica'),
            $proyectoLinea65->relacionado_agendas_competitividad == 1 ? 'Si' : ($proyectoLinea65->relacionado_agendas_competitividad == 2 ? 'No' : 'No aplica'),
            $proyectoLinea65->relacionado_mesas_sectoriales == 1 ? 'Si' : ($proyectoLinea65->relacionado_mesas_sectoriales == 2 ? 'No' : 'No aplica'),
            $proyectoLinea65->relacionado_tecnoacademia == 1 ? 'Si' : ($proyectoLinea65->relacionado_tecnoacademia == 2 ? 'No' : 'No aplica'),
            $proyectoLinea65->bibliografia,
            $proyectoLinea65->numero_aprendices,
            $this->mapParticipantes($proyectoLinea65->proyecto->participantes),
            ($proyectoLinea65->proyecto->finalizado) ? 'SI' : 'NO',
            ($proyectoLinea65->proyecto->habilitado_para_evaluar) ? 'SI' : 'NO',
            $proyectoLinea65->proyecto->estado_cord_sennova ? json_decode($proyectoLinea65->proyecto->estado_cord_sennova)->estado : ($proyectoLinea65->proyecto->proyectoLinea65()->exists() ? $proyectoLinea65->proyecto->estado_evaluacion_cultura_innovacion['estado'] : 'Sin información registrada'),
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
            'Fecha de inicio',
            'Fecha de finalización',
            'Grupo de investigación',
            'Línea de investigación',
            'Área de conocimiento',
            'Temática estratégica',
            'Actividad económica',
            'Video',
            'Justificación de industria 4.0',
            'Justificación de economía naranja',
            'Justificación de política de discapacidad',
            'Resumen',
            'Antecedentes',
            'Marco conceptual',
            'Metodología',
            'Propuesta de sostenibilidad',
            'Muestreo',
            'Actividades del muestreo',
            'Objetivo del muestreo',
            'Recolección de especímentes',
            'Impacto en municipios',
            'Impacto en el centro de formación',
            'Objetivo general',
            'Problema central',
            'Justificación del problema',
            'Relacionado con el plan tecnológico',
            'Relacionado con agendas de competitividad',
            'Relacionado con mesas sectoriales',
            'Relacionado con la TecnoAcademia',
            'Bibliografía',
            'Número de aprendices',
            'Participantes',
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
            'title' => 'Cultura de Innovacion',
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

    private function mapParticipantes($participantes)
    {
        $tipos_vinculacion = collect(json_decode(Storage::get('json/tipos-vinculacion.json'), true));
        $mapParticipantes = [];

        foreach ($participantes as $participante) {
            array_push($mapParticipantes, [
                'nombre' => strtr(utf8_decode($participante->nombre), utf8_decode('àáâãäçèéêëìíîïñòóôõöùúûüýÿÀÁÂÃÄÇÈÉÊËÌÍÎÏÑÒÓÔÕÖÙÚÛÜÝ'), 'aaaaaceeeeiiiinooooouuuuyyAAAAACEEEEIIIINOOOOOUUUUY'),
                'documento' => $participante->numero_documento,
                'vinculacion' => $participante->tipo_vinculacion_text,
                'meses' => $participante->pivot->cantidad_meses,
                'horas' => $participante->pivot->cantidad_horas,
            ]);
        }
        return $mapParticipantes;
    }
}
