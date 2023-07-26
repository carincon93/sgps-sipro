<?php

namespace App\Http\Controllers;

use App\Helpers\SelectHelper;
use App\Http\Requests\ProductoRequest;
use App\Models\Convocatoria;
use App\Models\Evaluacion\Evaluacion;
use App\Models\Proyecto;
use App\Models\Producto;
use App\Models\ProductoLinea65;
use App\Models\ProductoLinea66;
use App\Models\ProductoLinea68;
use App\Models\ProductoLinea69;
use App\Models\ProductoLinea70;
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

        $proyecto->load('evaluaciones.evaluacionProyectoLinea66');

        $resultado = $proyecto->efectosDirectos()->with('resultado')->get()->pluck('resultado')->flatten()->filter();
        $proyecto->codigo_linea_programatica = $proyecto->lineaProgramatica->codigo;

        if ($proyecto->codigo_linea_programatica == 65) {
            $proyecto->tipo_proyecto = $proyecto->proyectoLinea65->tipo_proyecto;
        }

        $validacionResultados = null;
        $cantidadActividades = $proyecto->causasDirectas->map(function ($causaDirecta) {
            return $causaDirecta->causasIndirectas->map(function ($causasIndirecta) {
                return $causasIndirecta->actividad;
            });
        })->flatten()->count();

        $cantidadResultados = $proyecto->efectosDirectos()->whereHas('resultado', function ($query) {
            $query->where('descripcion', '!=', null);
        })->with('resultado:id as value,descripcion as label,efecto_directo_id')->get()->pluck('resultado')->count();

        if ($cantidadActividades == 0 && $cantidadResultados == 0) {
            $validacionResultados = 'Para poder crear productos debe primero generar los resultados y/o actividades en el \'Árbol de objetivos\'';
        }

        return Inertia::render('Convocatorias/Proyectos/Productos/Index', [
            'convocatoria'              => $convocatoria->only('id', 'esta_activa', 'fase_formateada', 'fase', 'tipo_convocatoria', 'mostrar_recomendaciones'),
            'proyecto'                  => $proyecto->only('id', 'codigo_linea_programatica', 'precio_proyecto', 'modificable', 'en_subsanacion', 'evaluaciones', 'mostrar_recomendaciones', 'PdfVersiones', 'all_files', 'allowed', 'tipo_proyecto'),
            'filters'                   => request()->all('search'),
            'validacionResultados'      => $validacionResultados,
            'productos'                 => Producto::whereIn(
                                            'resultado_id',
                                                $resultado->map(function ($resultado) {
                                                    return $resultado->id;
                                                })
                                            )->with('actividades', 'resultado.objetivoEspecifico', 'productoLinea69', 'productoLinea70')->orderBy('resultado_id', 'ASC')->filterProducto(request()->only('search'))->paginate()->appends(['search' => request()->search]),

            'resultados'                => Resultado::select('resultados.id as value', 'resultados.descripcion as label', 'resultados.id as id')->whereHas('efectoDirecto', function ($query) use ($proyecto) {
                                                $query->where('efectos_directos.proyecto_id', $proyecto->id);
                                            })->where('resultados.descripcion', '!=', null)->with('actividades')->get(),
            'subtipologiasMinciencias'  => SelectHelper::subtipologiasMinciencias(),
            'tiposProducto'             => json_decode(Storage::get('json/tipos-producto.json'), true),

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

        $producto = new Producto();
        $producto->nombre               = $request->nombre;
        $producto->fecha_inicio         = $request->fecha_inicio;
        $producto->fecha_finalizacion   = $request->fecha_finalizacion;
        $producto->indicador            = $request->indicador;
        $producto->resultado()->associate($request->resultado_id);
        $producto->save();

        $producto->actividades()->attach($request->actividad_id);

        // Valida si es un producto de la línea 66
        if ($proyecto->proyectoLinea66()->exists()) {

            $request->validate([
                'tipo'                          => ['required', 'between:1,4'],
                'subtipologia_minciencias_id'   => 'required|min:0|max:2147483647|integer|exists:subtipologias_minciencias,id'
            ]);

            $productoLinea66 = new ProductoLinea66();
            $productoLinea66->tipo = $request->tipo;
            $productoLinea66->subtipologiaMinciencias()->associate($request->subtipologia_minciencias_id);
            $producto->productoLinea66()->save($productoLinea66);
        }

        // Valida si es un producto de la línea 65
        if ($proyecto->proyectoLinea65()->exists()) {
            $request->validate([
                'tipo'                          => ['required', 'between:1,4'],
                'subtipologia_minciencias_id'   => 'required|min:0|max:2147483647|integer|exists:subtipologias_minciencias,id'
            ]);

            $productoLinea65 = new ProductoLinea65();
            $productoLinea65->tipo = $request->tipo;
            $productoLinea65->subtipologiaMinciencias()->associate($request->subtipologia_minciencias_id);
            $producto->productoLinea65()->save($productoLinea65);
        }

        // Valida si es un producto de la línea 69
        if ($proyecto->proyectoLinea69()->exists()) {
            $request->validate([
                'medio_verificacion' => 'required|string',
                'valor_proyectado'   => 'required|string',
            ]);
            $productoLinea69 = new ProductoLinea69();
            $productoLinea69->producto()->associate($producto->id);
            $productoLinea69->valor_proyectado     = $request->valor_proyectado;
            $productoLinea69->medio_verificacion   = $request->medio_verificacion;
            $producto->productoLinea69()->save($productoLinea69);
        }

        // Valida si es un producto de la línea 70
        if ($proyecto->proyectoLinea70()->exists()) {
            $request->validate([
                'medio_verificacion' => 'required|string',
                'valor_proyectado'   => 'required|string',
            ]);
            $productoLinea70 = new ProductoLinea70();
            $productoLinea70->producto()->associate($producto->id);
            $productoLinea70->valor_proyectado     = $request->valor_proyectado;
            $productoLinea70->medio_verificacion   = $request->medio_verificacion;
            $producto->productoLinea70()->save($productoLinea70);
        }

        // Valida si es un producto de la línea 68
        if ($proyecto->proyectoLinea68()->exists()) {
            $request->validate([
                'medio_verificacion' => 'required|string',
            ]);
            $productoLinea68 = new ProductoLinea68();
            $productoLinea68->producto()->associate($producto->id);
            $productoLinea68->medio_verificacion    = $request->medio_verificacion;
            $productoLinea68->nombre_indicador      = $request->nombre_indicador;
            $productoLinea68->formula_indicador     = $request->formula_indicador;
            $productoLinea68->meta_indicador        = $request->meta_indicador;
            $producto->productoLinea68()->save($productoLinea68);
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

        if ($producto->resultado_id != $request->resultado_id) {
            $producto->actividades()->sync([]);
        } else {
            $producto->actividades()->sync($request->actividad_id);
        }

        if ($proyecto->proyectoLinea66()->exists()) {
            $request->validate([
                'tipo'                          => 'required|between:1,4',
                'subtipologia_minciencias_id'   => 'required|min:0|max:2147483647|integer|exists:subtipologias_minciencias,id'
            ]);
            $producto->productoLinea66()->update(['subtipologia_minciencias_id' => $request->subtipologia_minciencias_id, 'tipo' => $request->tipo]);
        }

        if ($proyecto->proyectoLinea65()->exists()) {
            $request->validate([
                'tipo'                          => 'required|between:1,4',
                'subtipologia_minciencias_id'   => 'required|min:0|max:2147483647|integer|exists:subtipologias_minciencias,id'
            ]);
            $producto->productoLinea65()->update(['subtipologia_minciencias_id' => $request->subtipologia_minciencias_id, 'tipo' => $request->tipo]);
        }

        if ($proyecto->proyectoLinea69()->exists()) {
            $request->validate([
                'medio_verificacion' => 'required|string',
                'valor_proyectado'   => 'required|string',
            ]);
            if ($producto->productoLinea69()->exists()) {
                $producto->productoLinea69()->update(['valor_proyectado' => $request->valor_proyectado, 'medio_verificacion' => $request->medio_verificacion]);
            } else {
                $producto->productoLinea69()->create(['valor_proyectado' => $request->valor_proyectado, 'medio_verificacion' => $request->medio_verificacion]);
            }
        }

         if ($proyecto->proyectoLinea70()->exists()) {
            $request->validate([
                'medio_verificacion' => 'required|string',
                'valor_proyectado'   => 'required|string',
            ]);
            if ($producto->productoLinea70()->exists()) {
                $producto->productoLinea70()->update(['valor_proyectado' => $request->valor_proyectado, 'medio_verificacion' => $request->medio_verificacion]);
            } else {
                $producto->productoLinea70()->create(['valor_proyectado' => $request->valor_proyectado, 'medio_verificacion' => $request->medio_verificacion]);
            }
        }

        if ($proyecto->proyectoLinea68()->exists()) {
            $request->validate([
                'medio_verificacion' => 'required|string',
            ]);
            $producto->productoLinea68()->update([
                'medio_verificacion' => $request->medio_verificacion,
                'nombre_indicador'   => $request->nombre_indicador,
                'formula_indicador'  => $request->formula_indicador,
                'meta_indicador'     => $request->meta_indicador

            ]);
        }

        $producto->nombre               = $request->nombre;
        $producto->fecha_inicio         = $request->fecha_inicio;
        $producto->fecha_finalizacion   = $request->fecha_finalizacion;
        $producto->indicador            = $request->indicador;
        $producto->resultado()->associate($request->resultado_id);
        $producto->save();

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

    /**
     * updateProductosEvaluacion
     *
     * @param  mixed $request
     * @param  mixed $convocatoria
     * @param  mixed $evaluacion
     * @return void
     */
    public function updateProductosEvaluacion(Request $request, Convocatoria $convocatoria, Evaluacion $evaluacion)
    {
        $this->authorize('modificar-evaluacion-autor', $evaluacion);

        switch ($evaluacion) {
            case $evaluacion->evaluacionProyectoLinea66()->exists():
                $evaluacion->evaluacionProyectoLinea66()->update([
                    'productos_puntaje'      => $request->productos_puntaje,
                    'productos_comentario'   => $request->productos_requiere_comentario == false ? $request->productos_comentario : null
                ]);
                break;
            case $evaluacion->evaluacionProyectoLinea65()->exists():
                $evaluacion->evaluacionProyectoLinea65()->update([
                    'productos_puntaje'      => $request->productos_puntaje,
                    'productos_comentario'   => $request->productos_requiere_comentario == false ? $request->productos_comentario : null
                ]);
                break;

            case $evaluacion->evaluacionProyectoLinea70()->exists():
                $evaluacion->evaluacionProyectoLinea70()->update([
                    'productos_comentario'  => $request->productos_requiere_comentario == false ? $request->productos_comentario : null
                ]);
                break;
            case $evaluacion->evaluacionProyectoLinea69()->exists():
                $evaluacion->evaluacionProyectoLinea69()->update([
                    'productos_comentario'  => $request->productos_requiere_comentario == false ? $request->productos_comentario : null
                ]);
                break;

            case $evaluacion->evaluacionProyectoLinea68()->exists():
                $evaluacion->evaluacionProyectoLinea68()->update([
                    'productos_primer_obj_puntaje'      => $request->productos_primer_obj_puntaje,
                    'productos_primer_obj_comentario'   => $request->productos_primer_obj_requiere_comentario == false ? $request->productos_primer_obj_comentario : null,

                    'productos_segundo_obj_puntaje'     => $request->productos_segundo_obj_puntaje,
                    'productos_segundo_obj_comentario'  => $request->productos_segundo_obj_requiere_comentario == false ? $request->productos_segundo_obj_comentario : null,

                    'productos_tercer_obj_puntaje'      => $request->productos_tercer_obj_puntaje,
                    'productos_tercer_obj_comentario'   => $request->productos_tercer_obj_requiere_comentario == false ? $request->productos_tercer_obj_comentario : null,

                    'productos_cuarto_obj_puntaje'      => $request->productos_cuarto_obj_puntaje,
                    'productos_cuarto_obj_comentario'   => $request->productos_cuarto_obj_requiere_comentario == false ? $request->productos_cuarto_obj_comentario : null,
                ]);
                break;
            default:
                break;
        }

        $evaluacion->save();

        return back()->with('success', 'El recurso se ha actualizado correctamente.');
    }
}
