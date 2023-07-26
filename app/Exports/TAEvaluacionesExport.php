<?php

namespace App\Exports;

use App\Models\Convocatoria;
use App\Models\Evaluacion\TaEvaluacion;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use Maatwebsite\Excel\Concerns\WithTitle;
use PhpOffice\PhpSpreadsheet\Style\NumberFormat;
use Maatwebsite\Excel\Concerns\WithColumnFormatting;
use Maatwebsite\Excel\Concerns\WithProperties;

class TAEvaluacionesExport implements FromCollection, WithHeadings, WithMapping, WithStyles, WithProperties, WithColumnFormatting, WithTitle
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
        return TaEvaluacion::select('ta_evaluaciones.*')->join('evaluaciones', 'ta_evaluaciones.id', 'evaluaciones.id')->join('proyectos', 'evaluaciones.proyecto_id', 'proyectos.id')->where('proyectos.convocatoria_id', $this->convocatoria->id)->whereNotIn('proyectos.id', [1052, 1113])->get();
    }

    /**
     * @var Invoice $taEvaluacion
     */
    public function map($taEvaluacion): array
    {
        return [
            $taEvaluacion->evaluacion->proyecto->centroFormacion->regional->nombre,
            $taEvaluacion->evaluacion->proyecto->centroFormacion->codigo,
            $taEvaluacion->evaluacion->proyecto->centroFormacion->nombre,
            $taEvaluacion->evaluacion->proyecto->lineaProgramatica->codigo,
            $taEvaluacion->evaluacion->evaluador->nombre,
            $taEvaluacion->evaluacion->evaluador->numero_documento,
            $taEvaluacion->evaluacion->evaluador->email,
            $taEvaluacion->evaluacion->proyecto->codigo,
            $taEvaluacion->evaluacion->proyecto->proyectoLinea70->titulo,

            $taEvaluacion->resumen_regional_comentario ? $taEvaluacion->resumen_regional_comentario : 'Cumple',
            $taEvaluacion->antecedentes_tecnoacademia_comentario ? $taEvaluacion->antecedentes_tecnoacademia_comentario : 'Cumple',
            $taEvaluacion->retos_oportunidades_comentario ? $taEvaluacion->retos_oportunidades_comentario : 'Cumple',
            $taEvaluacion->metodologia_comentario ? $taEvaluacion->metodologia_comentario : 'Cumple',
            $taEvaluacion->lineas_medulares_centro_comentario ? $taEvaluacion->lineas_medulares_centro_comentario : 'Cumple',
            $taEvaluacion->lineas_tecnologicas_centro_comentario ? $taEvaluacion->lineas_tecnologicas_centro_comentario : 'Cumple',
            $taEvaluacion->articulacion_sennova_comentario ? $taEvaluacion->articulacion_sennova_comentario : 'Cumple',
            $taEvaluacion->municipios_comentario ? $taEvaluacion->municipios_comentario : 'Cumple',
            $taEvaluacion->instituciones_comentario ? $taEvaluacion->instituciones_comentario : 'Cumple',
            $taEvaluacion->fecha_ejecucion_comentario ? $taEvaluacion->fecha_ejecucion_comentario : 'Cumple',
            $taEvaluacion->cadena_valor_comentario ? $taEvaluacion->cadena_valor_comentario : 'Cumple',
            $taEvaluacion->analisis_riesgos_comentario ? $taEvaluacion->analisis_riesgos_comentario : 'Cumple',
            $taEvaluacion->anexos_comentario ? $taEvaluacion->anexos_comentario : 'Cumple',
            $taEvaluacion->proyectos_macro_comentario ? $taEvaluacion->proyectos_macro_comentario : 'Cumple',
            $taEvaluacion->bibliografia_comentario ? $taEvaluacion->bibliografia_comentario : 'Cumple',
            $taEvaluacion->productos_comentario ? $taEvaluacion->productos_comentario : 'Cumple',
            $taEvaluacion->entidad_aliada_comentario ? $taEvaluacion->entidad_aliada_comentario : 'Cumple',
            $taEvaluacion->edt_comentario ? $taEvaluacion->edt_comentario : 'Cumple',
            $taEvaluacion->articulacion_centro_formacion_comentario ? $taEvaluacion->articulacion_centro_formacion_comentario : 'Cumple',
            $taEvaluacion->proyecto_presupuesto_comentario ? $taEvaluacion->proyecto_presupuesto_comentario : 'Cumple',
            $taEvaluacion->ortografia_comentario ? $taEvaluacion->ortografia_comentario : 'Cumple',
            $taEvaluacion->redaccion_comentario ? $taEvaluacion->redaccion_comentario : 'Cumple',
            $taEvaluacion->normas_apa_comentario ? $taEvaluacion->normas_apa_comentario : 'Cumple',
        ];
    }

    public function headings(): array
    {
        return [
            'Regional',
            'Código del centro de formación',
            'Centro de formación',
            'Línea programática',
            'Evaluador',
            'Número de documento',
            'Correo electrónico',
            'Código del proyecto',
            'Título del proyecto',
            'Resumen regional',
            'Antecedentes TecnoAcademia',
            'Retos y oportunidades',
            'Metodología',
            'Líneas medulares centro de formación',
            'Líneas tecnologicas centro de formación',
            'Articulación SENNOVA',
            'Municipios a impactar',
            'Instituciones',
            'Fechas de ejecución',
            'Cadena de valor',
            'Análisis de riesgos',
            'Anexos',
            'Proyectos macro',
            'Bibliografía',
            'Productos',
            'Entidad aliada',
            'EDT',
            'Articulacion con el centro de formación',
            'Presupuesto',
            'Ortografía',
            'Redacción',
            'Normas APA',
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
        return 'TA';
    }

    public function properties(): array
    {
        return [
            'title' => 'Comentarios evaluaciones de TA',
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
