<?php

namespace App\Http\Controllers;

use App\Helpers\SelectHelper;
use App\Http\Requests\ProductoRequest;
use App\Models\Actividad;
use App\Models\Convocatoria;
use App\Models\Evaluacion\Evaluacion;
use App\Models\Proyecto;
use App\Models\Producto;
use App\Models\ProductoMinciencias;
use App\Models\Resultado;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ProductoController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Convocatoria $convocatoria, Proyecto $proyecto, Request $request)
    {
        $this->authorize('visualizar-proyecto-autor', $proyecto);

        if ($proyecto->convocatoria_id != $convocatoria->id) {
            return abort(404);
        }

        if (request()->filled('evaluacion_id')) {
            $evaluacion = Evaluacion::find(request()->evaluacion_id);

            $this->authorize('modificar-evaluacion-autor', [$evaluacion]);

            $items_evaluacion = $evaluacion->getItemsAEvaluar($convocatoria->id, $proyecto->tipo_formulario_convocatoria_id);
        }

        $proyecto->load('evaluaciones', 'proyectoRolesSennova.proyectoRolesEvaluaciones', 'proyectoPresupuesto.proyectoPresupuestosEvaluaciones');
        // $proyecto->load('evaluaciones.evaluacionProyectoFormulario8Linea66');

        $proyecto->tipoFormularioConvocatoria->lineaProgramatica;

        $resultado = $proyecto->efectosDirectos()->with('resultado')->get()->pluck('resultado')->flatten()->filter();

        $objetivo_especifico = $proyecto->causasDirectas()->with('objetivoEspecifico')->get()->pluck('objetivoEspecifico')->flatten()->filter();

        return Inertia::render('Convocatorias/Proyectos/Productos/Index', [
            'convocatoria'              =>  $convocatoria->only('id', 'esta_activa', 'fase_formateada', 'fase', 'tipo_convocatoria', 'mostrar_recomendaciones'),
            'proyecto'                  =>  $proyecto,
            'evaluacion'                =>  $items_evaluacion ?? [],
            'productos'                 =>  Producto::whereIn(
                'resultado_id',
                $resultado->map(function ($resultado) {
                    return $resultado->id;
                })
            )->with('actividades', 'resultado.objetivoEspecifico', 'productoMinciencias')->orderBy('id', 'ASC')->get(),
            'actividades_sin_resultado' => Actividad::whereIn(
                'objetivo_especifico_id',
                $objetivo_especifico->map(function ($objetivo_especifico) {
                    return $objetivo_especifico->id;
                })
            )->where('resultado_id', null)->count(),
            'resultados'                =>  Resultado::select('resultados.id as value', 'resultados.descripcion as label', 'resultados.id as id')->whereHas('efectoDirecto', function ($query) use ($proyecto) {
                $query->where('efectos_directos.proyecto_id', $proyecto->id);
            })->where('resultados.descripcion', '!=', null)->with('actividades')->get(),
            'subtipologias_minciencias' =>  SelectHelper::subtipologiasMinciencias(),
            'tipos_producto'            =>  json_decode(Storage::get('json/tipos-producto.json'), true),

        ]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create(Convocatoria $convocatoria, Proyecto $proyecto)
    {
        $this->authorize('visualizar-proyecto-autor', $proyecto);

        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(ProductoRequest $request, Convocatoria $convocatoria, Proyecto $proyecto)
    {
        $this->authorize('modificar-proyecto-autor', $proyecto);

        $producto = Producto::create($request->only('resultado_id', 'nombre', 'fecha_inicio', 'fecha_finalizacion', 'unidad_indicador', 'meta_indicador', 'medio_verificacion', 'formula_indicador'));

        $producto->actividades()->attach($request->actividad_id);

        if ($request->filled('tipo') && $request->filled('trl') && $request->filled('subtipologia_minciencias_id')) {

            $request->validate([
                'tipo'                          => 'required|between:1,4',
                'trl'                           => 'required|min:1|max:9',
                'subtipologia_minciencias_id'   => 'required|min:0|max:2147483647|integer|exists:subtipologias_minciencias,id'
            ]);

            $producto_minciencias_linea_66 = new ProductoMinciencias();
            $producto_minciencias_linea_66->tipo = $request->tipo;
            $producto_minciencias_linea_66->trl  = $request->trl;
            $producto_minciencias_linea_66->subtipologiaMinciencias()->associate($request->subtipologia_minciencias_id);
            $producto->productoMinciencias()->save($producto_minciencias_linea_66);
        }

        return redirect()->route('convocatorias.proyectos.productos.index', [$convocatoria, $proyecto])->with('success', 'El recurso se ha creado correctamente.');
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Producto  $producto
     * @return \Illuminate\Http\Response
     */
    public function show(Convocatoria $convocatoria, Proyecto $proyecto, Producto $producto)
    {
        $this->authorize('visualizar-proyecto-autor', $proyecto);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Producto  $producto
     * @return \Illuminate\Http\Response
     */
    public function edit(Convocatoria $convocatoria, Proyecto $proyecto, Producto $producto)
    {
        $this->authorize('visualizar-proyecto-autor', $proyecto);

        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Producto  $producto
     * @return \Illuminate\Http\Response
     */
    public function update(ProductoRequest $request, Convocatoria $convocatoria, Proyecto $proyecto, Producto $producto)
    {
        $this->authorize('modificar-proyecto-autor', $proyecto);

        $producto->update($request->only('resultado_id', 'nombre', 'fecha_inicio', 'fecha_finalizacion', 'unidad_indicador', 'meta_indicador', 'medio_verificacion', 'formula_indicador'));
        $producto->save();

        $producto->actividades()->sync($request->actividad_id);

        if ($request->filled('tipo') && $request->filled('trl') && $request->filled('subtipologia_minciencias_id')) {
            $request->validate([
                'tipo'                          => 'required|between:1,4',
                'trl'                           => 'required|min:1|max:9',
                'subtipologia_minciencias_id'   => 'required|min:0|max:2147483647|integer|exists:subtipologias_minciencias,id'
            ]);
            $producto->productoMinciencias()->update(['subtipologia_minciencias_id' => $request->subtipologia_minciencias_id, 'tipo' => $request->tipo, 'trl' => $request->trl]);
        }

        return back()->with('success', 'El recurso se ha actualizado correctamente.');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Producto  $producto
     * @return \Illuminate\Http\Response
     */
    public function destroy(Convocatoria $convocatoria, Proyecto $proyecto, Producto $producto)
    {
        $this->authorize('modificar-proyecto-autor', $proyecto);

        $producto->delete();

        return redirect()->route('convocatorias.proyectos.productos.index', [$convocatoria, $proyecto])->with('success', 'El recurso se ha eliminado correctamente.');
    }
}
