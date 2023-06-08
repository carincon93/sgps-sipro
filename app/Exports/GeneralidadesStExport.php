<?php

namespace App\Exports;

use App\Models\Convocatoria;
use App\Models\ServicioTecnologico;
use Illuminate\Support\Facades\Storage;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use Maatwebsite\Excel\Concerns\WithTitle;
use PhpOffice\PhpSpreadsheet\Style\NumberFormat;
use Maatwebsite\Excel\Concerns\WithColumnFormatting;
use Maatwebsite\Excel\Concerns\WithProperties;

class GeneralidadesStExport implements FromCollection, WithHeadings, WithMapping, WithStyles, WithProperties, WithColumnFormatting, WithTitle
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
        return ServicioTecnologico::selectRaw("servicios_tecnologicos.*, CASE tipos_proyecto_st.tipo_proyecto
                        WHEN '1' THEN   concat('∙ Tipo de proyecto: A', chr(10), '∙ Línea técnica: ', lineas_tecnicas.nombre)
                        WHEN '2' THEN   concat('∙ Tipo de proyecto: B', chr(10), '∙ Línea técnica: ', lineas_tecnicas.nombre)
                    END as tipo_proyecto,
                    CASE tipos_proyecto_st.tipologia
                        WHEN '1' THEN 'Especiales'
                        WHEN '2' THEN 'Laboratorios'
                        WHEN '3' THEN 'Técnicos'
                    END as tipologia,
                    CASE tipos_proyecto_st.subclasificacion
                        WHEN '1' THEN 'Automatización y TICs'
                        WHEN '2' THEN 'Calibración'
                        WHEN '3' THEN 'Consultoría técnica'
                        WHEN '4' THEN 'Ensayo'
                        WHEN '5' THEN 'Fabricación especial'
                        WHEN '6' THEN 'Seguridad y salud en el trabajo'
                        WHEN '7' THEN 'Servicios de salud'
                    END as subclasificacion")
            ->join('tipos_proyecto_st', 'servicios_tecnologicos.tipo_proyecto_st_id', 'tipos_proyecto_st.id')
            ->join('lineas_tecnicas', 'tipos_proyecto_st.linea_tecnica_id', 'lineas_tecnicas.id')
            ->join('proyectos', 'servicios_tecnologicos.id', 'proyectos.id')
            ->where('proyectos.convocatoria_id', $this->convocatoria->id)
            ->whereNotIn('servicios_tecnologicos.id', [1052, 1113])
            ->get();
    }

    /**
     * @var Invoice $servicioTecnologico
     */
    public function map($servicioTecnologico): array
    {
        return [
            $this->convocatoria->descripcion,
            $servicioTecnologico->proyecto->centroFormacion->regional->nombre,
            $servicioTecnologico->proyecto->centroFormacion->codigo,
            $servicioTecnologico->proyecto->centroFormacion->nombre,
            $servicioTecnologico->proyecto->codigo,
            $servicioTecnologico->titulo,
            $servicioTecnologico->tipo_proyecto,
            $servicioTecnologico->tipologia,
            $servicioTecnologico->subclasificacion,
            $servicioTecnologico->estadoSistemaGestion->estado,
            $servicioTecnologico->resumen,
            $servicioTecnologico->antecedentes,
            $servicioTecnologico->problema_central,
            $servicioTecnologico->justificacion_problema,
            $servicioTecnologico->identificacion_problema,
            $servicioTecnologico->pregunta_formulacion_problema,
            $servicioTecnologico->objetivo_general,
            $servicioTecnologico->metodologia,
            $servicioTecnologico->fecha_inicio,
            $servicioTecnologico->fecha_finalizacion,
            $servicioTecnologico->propuesta_sostenibilidad,
            $servicioTecnologico->zona_influencia,
            $servicioTecnologico->video,
            $servicioTecnologico->especificaciones_area,
            $servicioTecnologico->infraestructura_adecuada,
            $servicioTecnologico->bibliografia,
            $this->mapParticipantes($servicioTecnologico->proyecto->participantes),
            ($servicioTecnologico->proyecto->finalizado) ? 'SI' : 'NO',
            ($servicioTecnologico->proyecto->habilitado_para_evaluar) ? 'SI' : 'NO',
            $servicioTecnologico->proyecto->estado_cord_sennova ? json_decode($servicioTecnologico->proyecto->estado_cord_sennova)->estado : ($servicioTecnologico->proyecto->servicioTecnologico()->exists() ? $servicioTecnologico->proyecto->estado_evaluacion_servicios_tecnologicos['estado'] : 'Sin información registrada'),
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
            'Tipo de proyecto',
            'Tipología',
            'Subclasificación',
            'Estado del sistema de gestión',
            'Resumen',
            'Antecedentes',
            'Problema central',
            'Justificación del problema',
            'Identificación del problema',
            'Pregunta de formulación del proyecto',
            'Objetivo general',
            'Metodología',
            'Fecha de inicio',
            'Fecha de finalización',
            'Propuesta de sostenibilidad',
            'Zona de influencia',
            'Video',
            'Especificaciones del área',
            'Infraestructura adecuada',
            'Bibliografía',
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
            'title' => 'Proyectos ST',
        ];
    }

    public function styles(Worksheet $sheet)
    {
        return [
            // Style the first row as bold text.
            1    => ['font' => ['bold' => true]],
        ];
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
