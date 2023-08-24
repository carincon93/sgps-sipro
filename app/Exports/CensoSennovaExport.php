<?php

namespace App\Exports;

use App\Models\DisciplinaSubareaConocimiento;
use App\Models\RolSennova;
use App\Models\User;
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
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Style\Style;
use PhpOffice\PhpSpreadsheet\Style\Color;
use PhpOffice\PhpSpreadsheet\Style\Border;

class CensoSennovaExport implements FromCollection, WithHeadings, WithMapping, WithStyles, WithProperties, WithColumnFormatting, WithTitle, ShouldAutoSize
{
    protected $centro_formacion_id;

    public function __construct($centro_formacion_id)
    {
        $this->centro_formacion_id = $centro_formacion_id;
    }

    /**
     * @return \Illuminate\Support\Collection
     */
    public function collection()
    {
        $query = User::with('estudiosAcademicos', 'formacionesAcademicasSena', 'participacionesGruposInvestigacionSena', 'participacionesProyectoSennova')
            ->orderBy('centro_formacion_id');

        if ($this->centro_formacion_id) {
            $query->whereIn('centro_formacion_id', $this->centro_formacion_id);
        }

        return $query->get();
    }

    /**
     * @var Invoice $user
     */
    public function map($user): array
    {
        return [
            $user->informacion_completa ? 'SI' : 'NO',
            $user->habilitado ? 'SI' : 'NO',
            optional($user->centroFormacion)->nombre,
            optional($user->centroFormacion->regional)->nombre,
            $user->nombre,
            $user->email,
            $user->tipo_documento_text,
            $user->numero_documento,
            $user->numero_celular,
            $user->tipo_vinculacion_text,
            $user->genero_text,
            $user->fecha_nacimiento,
            $user->horas_dedicadas,
            $user->meses_dedicados,
            $user->nivel_ingles_text,
            $user->fecha_resolucion_nombramiento,
            $user->fecha_acta_nombramiento,
            $user->nro_acta_nombramiento,
            $user->fecha_inicio_contrato,
            $user->fecha_finalizacion_contrato,
            $user->asignacion_mensual,
            $user->cvlac,
            $user->link_sigep_ii,
            $user->grupo_etnico_text,
            $user->discapacidad_text,
            $user->experiencia_laboral_sena,
            $user->cursos_evaluacion_proyectos ? 'SI' : 'NO',
            $user->cursos_de_evaluacion_realizados_text,
            $user->experiencia_como_evaluador ? 'SI' : 'NO',
            $user->numero_proyectos_evaluados,
            $user->participacion_como_evaluador_sennova ? 'SI' : 'NO',
            $user->conocimiento_iso_17025 ? 'SI' : 'NO',
            $user->conocimiento_iso_19011 ? 'SI' : 'NO',
            $user->conocimiento_iso_29119 ? 'SI' : 'NO',
            $user->conocimiento_iso_9001 ? 'SI' : 'NO',
            $user->experiencia_metodos_ensayo ? 'SI' : 'NO',
            $user->meses_experiencia_metodos_ensayo,
            $user->experiencia_metodos_calibracion ? 'SI' : 'NO',
            $user->meses_experiencia_metodos_calibracion,
            $user->experiencia_minima_metodos ? 'SI' : 'NO',
            $user->roles_fuera_sennova_text,
            $user->tiempo_por_rol_text,
            optional($user->redConocimiento)->nombre,
            optional($user->rolSennova)->nombre,
            $user->subareaExperiencia ? $user->subareaExperiencia->areaExperiencia->nombre : null,
            $user->subareaExperiencia ? $user->subareaExperiencia->nombre : null,
            $user->otros_roles_sennova ? RolSennova::whereIn('id', $user->otros_roles_sennova)->get()->pluck('nombre')->implode(', ') : null,
            $user->disciplinas_subarea_conocimiento ? DisciplinaSubareaConocimiento::whereIn('id', $user->disciplinas_subarea_conocimiento)
                ->with('subareaConocimiento.areaConocimiento')
                ->get()
                ->pluck('subareaConocimiento.areaConocimiento.nombre')
                ->implode(', ') : null,
            $user->disciplinas_subarea_conocimiento ? DisciplinaSubareaConocimiento::whereIn('id', $user->disciplinas_subarea_conocimiento)
                ->with('subareaConocimiento.areaConocimiento')
                ->get()
                ->pluck('subareaConocimiento.nombre')
                ->implode(', ') : null,
            $user->disciplinas_subarea_conocimiento ? DisciplinaSubareaConocimiento::whereIn('id', $user->disciplinas_subarea_conocimiento)->get()->pluck('nombre')->implode(', ') : null,
            $user->estudiosAcademicos->pluck('estudio_academico_text')->implode(', '),
            $user->formacionesAcademicasSena->pluck('formacion_academica_sena_text')->implode(', '),
            $user->participacionesGruposInvestigacionSena
                ->map(function ($participacion) {
                    return optional($participacion->grupoInvestigacion)->nombre;
                })
                ->implode(', '),
            $user->participacionesGruposInvestigacionSena
                ->map(function ($participacion) {
                    return optional($participacion->semilleroInvestigacion)->nombre;
                })
                ->implode(', '),
            $user->autorizacion_datos ? 'SI' : 'NO',
        ];
    }

// participacionesProyectoSennova

    public function headings(): array
    {
        return [
            '¿Ha completado el CENSO?',
            '¿Está habilitado?',
            'Centro de formación',
            'Regional',
            'Nombre',
            'Correo electrónico',
            'Tipo de documento',
            'Número de documento',
            'Número de celular',
            'Tipo de vinculación',
            'Género',
            'Fecha de nacimiento',
            'Número de horas semanales de dedicación en actividades de CTeI',
            'Número de meses de dedicación en actividades de CTeI',
            'Nivel de inglés',
            'Fecha de resolución de nombramiento',
            'Fecha del acta de nombramiento',
            'Número del acta de nombramiento',
            'Fecha de inicio del contrato',
            'Fecha de finalización del contrato',
            'Asignación mensual',
            'cvLAC',
            'Enlace SIGEP II',
            'Grupo étnico',
            'Discapacidad',
            'Tiempo de experiencia laboral en el SENA',
            '¿Ha realizado cursos complementarios relacionados con evaluación de proyectos?',
            'Nombres de los cursos',
            '¿Tiene experiencia como evaluador?',
            'Si su respuesta en la pregunta anterior es SI indique el número de proyectos que ha evaluado',
            '¿Ha participado como evaluador Sennova en vigencias anteriores?',
            '¿Ha realizado cursos o tiene conocimiento de las norma Norma ISO/IEC 17025:2017?',
            '¿Ha realizado cursos o tiene conocimiento de las norma Norma ISO 19011:2018?',
            '¿Ha realizado cursos o tiene conocimiento de las norma Norma ISO 29119 Vigente?',
            '¿Ha realizado cursos o tiene conocimiento de las norma Norma ISO 9001:2015?',
            '¿Tiene experiencia técnica en métodos de ensayo?',
            'Si su respuesta en la pregunta anterior es SI indique el número de meses de experiencia',
            '¿Tiene experiencia técnica con métodos de calibración?',
            'Si su respuesta en la pregunta anterior es SI indique el número de meses de experiencia',
            '¿Cuenta con experiencia técnica mínimo de doce (12) meses relacionada por lo menos con dos (2) métodos de ensayo o dos (2) métodos de calibración o dos (2) productos de base tecnológica (TICs)?',
            'Si ha estado en otros roles fuera de SENNOVA por favor indiquelos en el siguiente campo. Separados por coma (,)',
            'Indique el tiempo en meses al lado del nombre del rol',
            'Red de conocimiento',
            'Rol SENNOVA',
            'Roles SENNOVA en los cuales ha sido contratado/vinculado',
            'Área de experiencia laboral',
            'Subárea de experiencia laboral',
            'Áreas de conocimiento',
            'Subáreas de conocimiento',
            'Disciplinas de conocimiento',
            'Estudios académicos',
            'Formaciones académicas SENA',
            'Grupos de investigación',
            'Semilleros de investigación',
            '¿Autoriza el tratamiento de datos?',
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
        return 'Censo SENNOVA';
    }

    public function properties(): array
    {
        return [
            'title' => 'Censo SENNOVA',
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
}
