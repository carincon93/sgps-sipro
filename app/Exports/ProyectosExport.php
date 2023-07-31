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
use Illuminate\Support\Facades\Storage;

class ProyectosExport implements FromCollection, WithHeadings, WithMapping, WithStyles, WithProperties, WithColumnFormatting
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
        $proyecto->updateValoresProyecto();
        $tipo = '';
        if (!empty($proyecto->proyectoLinea66)) {
            $this->datos = $proyecto->proyectoLinea66;
            $tipo = 'I+D+I';
        } else if (!empty($proyecto->proyectoLinea70)) {
            $this->datos = $proyecto->proyectoLinea70;
            $tipo = 'Tecnoacademia';
        } else if (!empty($proyecto->proyectoLinea69)) {
            $this->datos = $proyecto->proyectoLinea69;
            $tipo = 'Tecnoparque';
        } else if (!empty($proyecto->proyectoLinea65)) {
            $this->datos = $proyecto->proyectoLinea65;
            $tipo = 'Apropiación de la cultura de la innovación';
        } else if (!empty($proyecto->proyectoLinea68)) {
            $this->datos =  $proyecto->proyectoLinea68;
            $tipo = 'Servicios tecnológicos';
        }

        return [
            $this->convocatoria->descripcion,
            $proyecto->codigo,
            $tipo,
            $proyecto->centroFormacion->regional->nombre,
            $proyecto->centroFormacion->codigo,
            $proyecto->centroFormacion->nombre,
            $proyecto->lineaProgramatica->codigo,
            $proyecto->lineaProgramatica->nombre,
            $this->datos->titulo,
            ($this->datos->redConocimiento) ? $this->datos->redConocimiento->nombre : 'N/A',
            ($this->datos->disciplinaSubareaConocimiento) ? $this->datos->disciplinaSubareaConocimiento->subareaConocimiento->areaConocimiento->nombre : ($this->datos->areaConocimiento ? $this->datos->areaConocimiento->nombre : ($this->datos->disciplinasSubareaConocimiento ? $this->datos->disciplinasSubareaConocimiento->map(function ($disciplinaSubareaConocimiento) {
                return ['nombre' => $disciplinaSubareaConocimiento->subareaConocimiento->areaConocimiento->nombre];
            })->implode('nombre', ', ') : 'N/A')),
            ($this->datos->disciplinaSubareaConocimiento) ? $this->datos->disciplinaSubareaConocimiento->subareaConocimiento->nombre : ($this->datos->disciplinasSubareaConocimiento ? $this->datos->disciplinasSubareaConocimiento->map(function ($disciplinaSubareaConocimiento) {
                return ['nombre' => $disciplinaSubareaConocimiento->subareaConocimiento->nombre];
            })->implode('nombre', ', ') : 'N/A'),
            ($this->datos->disciplinaSubareaConocimiento) ? $this->datos->disciplinaSubareaConocimiento->nombre : ($this->datos->disciplinasSubareaConocimiento ? $this->datos->disciplinasSubareaConocimiento->implode('nombre', ', ') : 'N/A'),
            $this->datos->objetivo_general,
            $proyecto->total_proyecto_presupuesto,
            $proyecto->total_roles_sennova,
            $proyecto->precio_proyecto > 0 ? $proyecto->precio_proyecto : '0',
            ($proyecto->finalizado) ? 'SI' : 'NO',
            ($proyecto->radicado) ? 'NO' : 'SI',
            ($proyecto->proyectoLinea66()->exists() ? $proyecto->estado_evaluacion_idi['estado'] : ($proyecto->proyectoLinea65()->exists() ? $proyecto->estado_evaluacion_cultura_innovacion['estado'] : ($proyecto->proyectoLinea70()->exists() ? $proyecto->estado_evaluacion_ta['estado'] : ($proyecto->proyectoLinea69()->exists() ? $proyecto->estado_evaluacion_tp['estado'] : ($proyecto->proyectoLinea68()->exists() ? $proyecto->estado_evaluacion_servicios_tecnologicos['estado'] : 'Sin información registrada'))))),
            $proyecto->estado_cord_sennova ? json_decode($proyecto->estado_cord_sennova)->estado : '',
            $proyecto->proyectoLinea66()->exists() ? $proyecto->estado_evaluacion_idi['puntaje'] : ($proyecto->proyectoLinea65()->exists() ? $proyecto->estado_evaluacion_cultura_innovacion['puntaje'] : ($proyecto->proyectoLinea68()->exists() ? $proyecto->estado_evaluacion_servicios_tecnologicos['puntaje'] : 'N/A')),
            $proyecto->proyectoLinea66()->exists() ? $proyecto->estado_evaluacion_idi['alerta'] : 'N/A',
            $this->mapParticipantes($proyecto->participantes),
            $proyecto->proyectoLinea66()->exists() ? $proyecto->proyectoLinea66->numero_aprendices : ($proyecto->proyectoLinea65()->exists() ? $proyecto->proyectoLinea65->numero_aprendices : 'N/A')
        ];
    }

    public function headings(): array
    {
        return [
            'Convocatoria',
            'Código',
            'Tipo',
            'Regional',
            'Código centro formación',
            'Centro formación',
            'Código línea programática',
            'Linea Programatica',
            'Título',
            'Red Conocimiento',
            'Área Conocimiento',
            'Subareas conocimiento',
            'Disciplina',
            'Objetivo General',
            'Total Presupuestos',
            'Total Roles',
            'Total Proyecto',
            'Finalizado',
            '¿Se puede eliminar del sistema?',
            'Estado final',
            'Estado Cord. SENNOVA',
            'Puntaje',
            'Desviación estándar',
            'Participantes',
            'Número de aprendices beneficiados',
        ];
    }

    public function columnFormats(): array
    {
        return [
            'O' => NumberFormat::FORMAT_CURRENCY_USD_SIMPLE,
            'P' => NumberFormat::FORMAT_CURRENCY_USD_SIMPLE,
            'Q' => NumberFormat::FORMAT_CURRENCY_USD_SIMPLE,
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
