<?php

namespace App\Http\Controllers;

use App\Exports\CensoSennovaExport;
use App\Exports\ComentariosEvaluacionesExport;
use App\Exports\PresupuestoRolesSennovaExport;
use App\Exports\EvaluacionesExport;
use App\Exports\EvaluacionesProyectosPresupuestoExport;
use App\Exports\InfoGruposLineasSemillerosExport;
use App\Exports\InfoProyectosCapacidadInstaladaExport;
use App\Exports\InfoProyectosExport;
use App\Exports\InfoProyectosIdiExport;
use App\Exports\InfoProyectosStExport;
use App\Exports\InfoProyectosCulturaInnovacionExport;
use App\Exports\InfoProyectosTaExport;
use App\Exports\InfoProyectosTpExport;
use App\Helpers\SelectHelper;
use App\Models\Convocatoria;
use App\Models\Proyecto;

use App\Http\Controllers\Controller;

use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReporteController extends Controller
{

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $this->authorize('descargar-reportes', [User::class]);

        return Inertia::render('Reportes/Index', [
            'convocatorias'      => SelectHelper::convocatorias(),
            'centros_formacion'  => SelectHelper::centrosFormacion()
            // 'proyectosId'   => Proyecto::selectRaw("id + 8000 as codigo_only")->orderBy('id', 'ASC')->get()->pluck('codigo_only')->flatten('codigo_only')
        ]);
    }

    /**
     * censoSennova
     *
     * @param  mixed
     * @return void
     */
    public function censoSennova(Request $request)
    {
        ini_set('max_execution_time', 0);
        ini_set('memory_limit', -1);

        $this->authorize('descargar-reportes', [User::class]);

        return Excel::download(new CensoSennovaExport($request->centro_formacion_id), 'censo-sennova-' . time() . '.xlsx');
    }

    /**
     * resumenProyectos
     *
     * @param  mixed $convocatoria
     * @return void
     */
    public function resumenProyectos(Request $request, Convocatoria $convocatoria)
    {
        $this->authorize('descargar-reportes', [User::class]);

        return Excel::download(new InfoProyectosExport($convocatoria), 'proyectos-' . time() . '.xlsx');
    }

    /**
     * EvaluacionesExcel
     *
     * @return void
     */
    public function EvaluacionesExcel(Convocatoria $convocatoria)
    {
        $this->authorize('descargar-reportes', [User::class]);

        return Excel::download(new EvaluacionesExport($convocatoria), 'evaluaciones-' . time() . '.xlsx');
    }

    /**
     * comentariosEvaluacionesExcel
     *
     * @return void
     */
    public function comentariosEvaluacionesExcel(Convocatoria $convocatoria)
    {
        $this->authorize('descargar-reportes', [User::class]);

        return Excel::download(new ComentariosEvaluacionesExport($convocatoria), 'comentarios-evaluaciones-' . time() . '.xlsx');
    }

    /**
     * resumenPresupuestos
     *
     * @param  mixed $convocatoria
     * @return void
     */
    public function resumenPresupuestos(Convocatoria $convocatoria)
    {
        return Excel::download(new PresupuestoRolesSennovaExport($convocatoria), 'prespuestos-roles-' . time() . '.xlsx');
    }

    /**
     * EvaluacionesProyectosPresupuestoExport
     *
     * @return void
     */
    public function EvaluacionesProyectosPresupuestoExport(Convocatoria $convocatoria)
    {
        return Excel::download(new EvaluacionesProyectosPresupuestoExport($convocatoria), 'evaluaciones-proyecto-prespuestos-aprobados-' . time() . '.xlsx');
    }

    /**
     * proyectosTaExport
     *
     * @return void
     */
    public function proyectosTaExport(Convocatoria $convocatoria)
    {
        return Excel::download(new InfoProyectosTaExport($convocatoria), 'proyectos-ta' . time() . '.xlsx');
    }

    /**
     * proyectosIdiExport
     *
     * @return void
     */
    public function proyectosIdiExport(Convocatoria $convocatoria)
    {
        return Excel::download(new InfoProyectosIdiExport($convocatoria), 'proyectos-idi' . time() . '.xlsx');
    }

    /**
     * proyectosTpExport
     *
     * @return void
     */
    public function proyectosTpExport(Convocatoria $convocatoria)
    {
        return Excel::download(new InfoProyectosTpExport($convocatoria), 'proyectos-tp' . time() . '.xlsx');
    }

    /**
     * proyectosStExport
     *
     * @return void
     */
    public function proyectosStExport(Convocatoria $convocatoria)
    {
        return Excel::download(new InfoProyectosStExport($convocatoria), 'proyectos-st' . time() . '.xlsx');
    }

    /** proyectosCulturaInnovacionExport
     *
     * @return void
     */
    public function proyectosCulturaInnovacionExport(Convocatoria $convocatoria)
    {
        return Excel::download(new InfoProyectosCulturaInnovacionExport($convocatoria), 'proyectosCulturaInnovacion' . time() . '.xlsx');
    }

    /** gruposLineasSemillerosExport
     *
     * @return void
     */
    public function gruposLineasSemillerosExport()
    {
        return Excel::download(new InfoGruposLineasSemillerosExport(), 'gruposLineasSemilleros' . time() . '.xlsx');
    }

    /** proyectosCapacidadInstaladaExport
     *
     * @return void
     */
    public function proyectosCapacidadInstaladaExport()
    {
        return Excel::download(new InfoProyectosCapacidadInstaladaExport(), 'proyectosCapacidadInstalada' . time() . '.xlsx');
    }
}
