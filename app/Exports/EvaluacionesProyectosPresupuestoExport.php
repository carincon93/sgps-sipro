<?php

namespace App\Exports;

use App\Models\Proyecto;
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

class EvaluacionesProyectosPresupuestoExport implements FromCollection, WithHeadings, WithMapping, WithStyles, WithProperties, WithColumnFormatting
{

    protected $datos;
    protected $convocatoria;
    protected $proyectos;

    public function __construct(Convocatoria $convocatoria)
    {
        $this->convocatoria = $convocatoria;
        $this->proyectos = $convocatoria->proyectos()->withCount(['evaluaciones'])->get();
    }

    /**
     * @return \Illuminate\Support\Collection
     */
    public function collection()
    {
        return $this->proyectos;
    }
    /**
     * @var Invoice $proyecto
     */
    public function map($proyecto): array
    {
        $tipo = '';
        if (!empty($proyecto->proyectoLinea66)) {
            $this->datos =  $proyecto->proyectoLinea66;
            $tipo = 'I+D+I';
        } else if (!empty($proyecto->proyectoLinea70)) {
            $this->datos =  $proyecto->proyectoLinea70;
            $tipo = 'Tecnoacademia';
        } else if (!empty($proyecto->proyectoLinea69)) {
            $this->datos =  $proyecto->proyectoLinea69;
            $tipo = 'Tecnoparque';
        } else if (!empty($proyecto->proyectoLinea65)) {
            $this->datos =  $proyecto->proyectoLinea65;
            $tipo = 'Apropiación de la cultura de la innovación';
        } else if (!empty($proyecto->proyectoLinea68)) {
            $this->datos =  $proyecto->proyectoLinea68;
            $tipo = 'Servicios tecnológicos';
        }

        $data = [
            $this->convocatoria->descripcion,
            $proyecto->codigo,
            $tipo,
            $proyecto->centroFormacion->regional->nombre,
            $proyecto->centroFormacion->codigo,
            $proyecto->centroFormacion->nombre,
            $proyecto->lineaProgramatica->codigo,
            $proyecto->lineaProgramatica->nombre,
            $this->datos->titulo,
            $proyecto->total_proyecto_presupuesto,
            $proyecto->total_roles_sennova,
            $proyecto->precio_proyecto > 0 ? $proyecto->precio_proyecto : '0',
            ($proyecto->finalizado) ? 'SI' : 'NO',
            ($proyecto->habilitado_para_evaluar) ? 'SI' : 'NO',
            $proyecto->proyectoLinea66()->exists() ? $proyecto->estado_evaluacion_idi['estado'] : ($proyecto->proyectoLinea65()->exists() ? $proyecto->estado_evaluacion_cultura_innovacion['estado'] : ($proyecto->proyectoLinea70()->exists() ? $proyecto->estado_evaluacion_ta['estado'] : ($proyecto->proyectoLinea69()->exists() ? $proyecto->estado_evaluacion_tp['estado'] : ($proyecto->proyectoLinea68()->exists() ? $proyecto->estado_evaluacion_servicios_tecnologicos['estado'] : 'Sin información registrada')))),
            $proyecto->total_proyecto_presupuesto_aprobado,
            $proyecto->total_roles_sennova_aprobado,
            $proyecto->precio_proyecto_aprobado > 0 ? $proyecto->precio_proyecto_aprobado : '0',
        ];

        foreach ($proyecto->evaluaciones as $evaluacion) {
            $data[] = $evaluacion->evaluador->nombre;
            $data[] = $evaluacion->evaluador->numero_documento;
            $data[] = $evaluacion->evaluador->email;
            $data[] = $evaluacion->getVerificarEstadoEvaluacionAttribute();
        }

        return $data;
    }

    public function headings(): array
    {
        $cantEvaluadores = 0;
        $headers = [
            'Convocatoria',
            'Código',
            'Tipo',
            'Regional',
            'Código centro formación',
            'Centro formación',
            'Código línea programática',
            'Linea Programatica',
            'Título',
            'Total Presupuestos',
            'Total Roles',
            'Total Proyecto',
            'Finalizado',
            'Radicado',
            'Evaluación',
            'Total Presupuestos Aprobado',
            'Total Roles Aprobado',
            'Total Proyecto Aprobado',
        ];

        foreach ($this->proyectos as $proyecto) {
            if ($proyecto->evaluaciones_count > $cantEvaluadores) {
                $cantEvaluadores = $proyecto->evaluaciones_count;
            }
        }

        for ($i = 0; $i < $cantEvaluadores; $i++) {
            $headers = array_merge($headers, ['Evaluador ' . ($i + 1), 'Número ' . ($i + 1)]);
        }

        return $headers;
    }

    public function columnFormats(): array
    {
        return [
            'J' => NumberFormat::FORMAT_CURRENCY_USD_SIMPLE,
            'K' => NumberFormat::FORMAT_CURRENCY_USD_SIMPLE,
            'L' => NumberFormat::FORMAT_CURRENCY_USD_SIMPLE,
            'P' => NumberFormat::FORMAT_CURRENCY_USD_SIMPLE,
            'Q' => NumberFormat::FORMAT_CURRENCY_USD_SIMPLE,
            'R' => NumberFormat::FORMAT_CURRENCY_USD_SIMPLE,
        ];
    }

    public function properties(): array
    {
        return [
            'title' => 'Resumen Presupuesto aprobado proyectos ' . $this->convocatoria->descripcion,
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
