<?php

namespace App\Http\Controllers;

use App\Helpers\SelectHelper;
use App\Helpers\SharepointHelper;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\Request;
use App\Models\Proyecto;
use App\Models\Convocatoria;
use App\Models\Municipio;
use App\Models\ProyectoPdfVersion;
use App\Models\RolSennova;
use Spatie\Browsershot\Browsershot;
use Illuminate\Support\Facades\Log;
use PDF;

class PdfController extends Controller
{
    static function generarPdfFormulario1Linea65(Convocatoria $convocatoria, Proyecto $proyecto)
    {
        if ($proyecto->convocatoria_id != $convocatoria->id) {
            return abort(404);
        }

        ini_set('max_execution_time', 0);
        ini_set('memory_limit', -1);

        $datos = null;
        $datos = $proyecto->proyectoFormulario1Linea65;

        $proyecto->load('efectosDirectos.resultado');

        $pdf = PDF::setOption(['dpi' => 150, 'defaultFont' => 'Nunito'])->loadView('Convocatorias.Proyectos.PdfFormulario1Linea65', [
            'convocatoria'                  => $convocatoria,
            'proyecto'                      => $proyecto,
            'datos'                         => $datos,
            'municipios'                    => Municipio::all(),
            'proyecto_anexo'                => $proyecto->proyectoAnexo()->select('proyecto_anexo.*', 'anexos.nombre')->join('convocatoria_anexos', 'proyecto_anexo.convocatoria_anexo_id', 'convocatoria_anexos.id')->join('anexos', 'convocatoria_anexos.anexo_id', 'anexos.id')->get(),
            'tipos_productos'               => collect(json_decode(Storage::get('json/tipos-producto.json'), true)),
            'niveles_riesgo'                => collect(json_decode(Storage::get('json/niveles-riesgo.json'), true)),
            'tipos_riesgo'                  => collect(json_decode(Storage::get('json/tipos-riesgo.json'), true)),
            'probabilidades_riesgo'         => collect(json_decode(Storage::get('json/probabilidades-riesgo.json'), true)),
            'impactos_riesgo'               => collect(json_decode(Storage::get('json/impactos-riesgo.json'), true)),
            'roles_sennova'                 => RolSennova::select('id as value', 'nombre as label')->orderBy('nombre', 'ASC')->get(),
            'tipos_impacto'                 => collect(json_decode(Storage::get('json/tipos-impacto.json'), true)),
            'distancias_municipios'         => collect(json_decode(Storage::get('json/distancia-municipios.json'), true)),
            'frecuencias_semanales'         => collect(json_decode(Storage::get('json/frecuencias-semanales-visita.json'), true)),
            'opciones_servicios_edicion'    => collect(json_decode(Storage::get('json/opciones-servicios-edicion.json'), true)),
            'ejes_sennova'                  => collect(json_decode(Storage::get('json/ejes-sennova.json'), true)),
            'areas_cualificacion_mnc'       => collect(json_decode(Storage::get('json/areas-cualificacion-mnc.json'), true)),
            'tipos_eventos'                 => collect(json_decode(Storage::get('json/tipos-eventos-linea-65.json'), true)),
            'lineas_estrategicas_sena'      => collect(json_decode(Storage::get('json/lineas-estrategicas.json'), true)),
            'lineas_programaticas'          => SelectHelper::lineasProgramaticas(),
            'nodos_tecnoparques'            => SelectHelper::nodosTecnoparque(),
            'tecnoacademias'                => SelectHelper::tecnoacademias(),
            'hubs_innovacion'               => SelectHelper::hubsInnovacion(),
            'laboratorios_st'               => SelectHelper::laboratoriosServiciosTecnologicos(),
            'tipos_licencia'                => collect(json_decode(Storage::get('json/tipos-licencia-software.json'), true)),
            'tipos_software'                => collect(json_decode(Storage::get('json/tipos-software.json'), true))
        ]);

        return $pdf->stream();

        return $pdf->download($proyecto->codigo.'.pdf');

        // Get the file content from the response
        $fileContent = $pdf->setWarnings(false)->output();

        // Set the filename
        $filename = 'file.pdf';

        // Create a temporary file
        $tmp_file = tmpfile();

        // Write the file content to the temporary file
        fwrite($tmp_file, $fileContent);

        // Create a new file object from the temporary file
        $file = new \Illuminate\Http\UploadedFile(
            stream_get_meta_data($tmp_file)['uri'],
            $filename,
            'application/pdf',
            null,
            true
        );

        $request = new Request();

        // Set the file object in the request
        $request->merge([
            'pdf_proyecto' => $file,
        ]);

        $modulo = 'CONVOCATORIAS2023';
        $centroFormacionSharePoint  = $proyecto->centroFormacion->nombre_carpeta_sharepoint;
        $sharepoint_path            = "$modulo/$centroFormacionSharePoint/" . $proyecto->lineaProgramatica->codigo . "/$proyecto->codigo";

        // $response = self::saveFilesSharepoint($request, 'CONVOCATORIA2023', $proyecto, $proyecto, 'pdf_proyecto');

        $path = Storage::put($sharepoint_path . '/' . $proyecto->codigo . '.pdf', $fileContent);
        // if (!empty($response['sharePointPath'])) {
        //     ProyectoPdfVersion::create([
        //         'proyecto_id'     => $proyecto->id,
        //         'version'         => $response['nombreArchivo'],
        //         'estado'          => 1
        //     ]);

        //     ProyectoPdfVersion::where('proyecto_id', $proyecto->id)->update(['estado' => 1]);
        // }
    }

    static function generarPdfFormulario4Linea70(Convocatoria $convocatoria, Proyecto $proyecto)
    {
        ini_set('max_execution_time', 0);
        ini_set('memory_limit', -1);

        $datos = null;
        $datos = $proyecto->proyectoFormulario4Linea70;

        $proyecto->load('efectosDirectos.resultado');

        $pdf = PDF::setOption(['dpi' => 150, 'defaultFont' => 'Nunito'])->loadView('Convocatorias.Proyectos.PdfFormulario4Linea70', [
            'convocatoria'                      => $convocatoria,
            'proyecto'                          => $proyecto,
            'datos'                             => $datos,
            'municipios'                        => Municipio::all(),
            'proyecto_anexo'                    => $proyecto->proyectoAnexo()->select('proyecto_anexo.*', 'anexos.nombre')->join('convocatoria_anexos', 'proyecto_anexo.convocatoria_anexo_id', 'convocatoria_anexos.id')->join('anexos', 'convocatoria_anexos.anexo_id', 'anexos.id')->get(),
            'tipos_productos'                   => collect(json_decode(Storage::get('json/tipos-producto.json'), true)),
            'niveles_riesgo'                    => collect(json_decode(Storage::get('json/niveles-riesgo.json'), true)),
            'tipos_riesgo'                      => collect(json_decode(Storage::get('json/tipos-riesgo.json'), true)),
            'probabilidades_riesgo'             => collect(json_decode(Storage::get('json/probabilidades-riesgo.json'), true)),
            'impactos_riesgo'                   => collect(json_decode(Storage::get('json/impactos-riesgo.json'), true)),
            'roles_sennova'                     => RolSennova::select('id as value', 'nombre as label')->orderBy('nombre', 'ASC')->get(),
            'tipos_impacto'                     => collect(json_decode(Storage::get('json/tipos-impacto.json'), true)),
            'distancias_municipios'             => collect(json_decode(Storage::get('json/distancia-municipios.json'), true)),
            'frecuencias_semanales'             => collect(json_decode(Storage::get('json/frecuencias-semanales-visita.json'), true)),
            'opciones_servicios_edicion'        => collect(json_decode(Storage::get('json/opciones-servicios-edicion.json'), true)),
            'infraestructura_tecnoacademia'     => collect(json_decode(Storage::get('json/infraestructura-tecnoacademia.json'), true)),
            'tipos_entidad_aliada'              => collect(json_decode(Storage::get('json/tipos-entidades-aliadas.json'), true)),
            'naturaleza_entidad_aliada'         => collect(json_decode(Storage::get('json/naturaleza-empresa.json'), true)),
            'tipos_empresa'                     => collect(json_decode(Storage::get('json/tipos-empresa.json'), true)),
            'tipos_licencia'                    => collect(json_decode(Storage::get('json/tipos-licencia-software.json'), true)),
            'tipos_software'                    => collect(json_decode(Storage::get('json/tipos-software.json'), true))
        ]);

        return $pdf->stream();

        return $pdf->download($proyecto->codigo.'.pdf');

        // Get the file content from the response
        $fileContent = $pdf->setWarnings(false)->output();

        // Set the filename
        $filename = 'file.pdf';

        // Create a temporary file
        $tmp_file = tmpfile();

        // Write the file content to the temporary file
        fwrite($tmp_file, $fileContent);

        // Create a new file object from the temporary file
        $file = new \Illuminate\Http\UploadedFile(
            stream_get_meta_data($tmp_file)['uri'],
            $filename,
            'application/pdf',
            null,
            true
        );

        $request = new Request();

        // Set the file object in the request
        $request->merge([
            'pdf_proyecto' => $file,
        ]);

        $modulo = 'CONVOCATORIAS2023';
        $centroFormacionSharePoint  = $proyecto->centroFormacion->nombre_carpeta_sharepoint;
        $sharepoint_path            = "$modulo/$centroFormacionSharePoint/" . $proyecto->lineaProgramatica->codigo . "/$proyecto->codigo";

        // $response = self::saveFilesSharepoint($request, 'CONVOCATORIA2023', $proyecto, $proyecto, 'pdf_proyecto');

        $path = Storage::put($sharepoint_path . '/' . $proyecto->codigo . '.pdf', $fileContent);
        // if (!empty($response['sharePointPath'])) {
        //     ProyectoPdfVersion::create([
        //         'proyecto_id'     => $proyecto->id,
        //         'version'         => $response['nombreArchivo'],
        //         'estado'          => 1
        //     ]);

        //     ProyectoPdfVersion::where('proyecto_id', $proyecto->id)->update(['estado' => 1]);
        // }
    }

    static function generarPdfFormulario5Linea69(Convocatoria $convocatoria, Proyecto $proyecto)
    {
        ini_set('max_execution_time', 0);
        ini_set('memory_limit', -1);

        $datos = null;
        $datos = $proyecto->proyectoFormulario5Linea69;

        $proyecto->load('efectosDirectos.resultado');

        $pdf = PDF::setOption(['dpi' => 150, 'defaultFont' => 'Nunito'])->loadView('Convocatorias.Proyectos.PdfFormulario5Linea69', [
            'convocatoria'                      => $convocatoria,
            'proyecto'                          => $proyecto,
            'datos'                             => $datos,
            'municipios'                        => Municipio::all(),
            'proyecto_anexo'                    => $proyecto->proyectoAnexo()->select('proyecto_anexo.*', 'anexos.nombre')->join('convocatoria_anexos', 'proyecto_anexo.convocatoria_anexo_id', 'convocatoria_anexos.id')->join('anexos', 'convocatoria_anexos.anexo_id', 'anexos.id')->get(),
            'tipos_productos'                   => collect(json_decode(Storage::get('json/tipos-producto.json'), true)),
            'niveles_riesgo'                    => collect(json_decode(Storage::get('json/niveles-riesgo.json'), true)),
            'tipos_riesgo'                      => collect(json_decode(Storage::get('json/tipos-riesgo.json'), true)),
            'probabilidades_riesgo'             => collect(json_decode(Storage::get('json/probabilidades-riesgo.json'), true)),
            'impactos_riesgo'                   => collect(json_decode(Storage::get('json/impactos-riesgo.json'), true)),
            'roles_sennova'                     => RolSennova::select('id as value', 'nombre as label')->orderBy('nombre', 'ASC')->get(),
            'tipos_impacto'                     => collect(json_decode(Storage::get('json/tipos-impacto.json'), true)),
            'distancias_municipios'             => collect(json_decode(Storage::get('json/distancia-municipios.json'), true)),
            'frecuencias_semanales'             => collect(json_decode(Storage::get('json/frecuencias-semanales-visita.json'), true)),
            'opciones_servicios_edicion'        => collect(json_decode(Storage::get('json/opciones-servicios-edicion.json'), true)),
            'tipos_entidad_aliada'              => collect(json_decode(Storage::get('json/tipos-entidades-aliadas.json'), true)),
            'naturaleza_entidad_aliada'         => collect(json_decode(Storage::get('json/naturaleza-empresa.json'), true)),
            'tipos_empresa'                     => collect(json_decode(Storage::get('json/tipos-empresa.json'), true)),
            'tipos_licencia'                    => collect(json_decode(Storage::get('json/tipos-licencia-software.json'), true)),
            'tipos_software'                    => collect(json_decode(Storage::get('json/tipos-software.json'), true))
        ]);

        return $pdf->stream();

        return $pdf->download($proyecto->codigo.'.pdf');

        // Get the file content from the response
        $fileContent = $pdf->setWarnings(false)->output();

        // Set the filename
        $filename = 'file.pdf';

        // Create a temporary file
        $tmp_file = tmpfile();

        // Write the file content to the temporary file
        fwrite($tmp_file, $fileContent);

        // Create a new file object from the temporary file
        $file = new \Illuminate\Http\UploadedFile(
            stream_get_meta_data($tmp_file)['uri'],
            $filename,
            'application/pdf',
            null,
            true
        );

        $request = new Request();

        // Set the file object in the request
        $request->merge([
            'pdf_proyecto' => $file,
        ]);

        $modulo = 'CONVOCATORIAS2023';
        $centroFormacionSharePoint  = $proyecto->centroFormacion->nombre_carpeta_sharepoint;
        $sharepoint_path            = "$modulo/$centroFormacionSharePoint/" . $proyecto->lineaProgramatica->codigo . "/$proyecto->codigo";

        // $response = self::saveFilesSharepoint($request, 'CONVOCATORIA2023', $proyecto, $proyecto, 'pdf_proyecto');

        $path = Storage::put($sharepoint_path . '/' . $proyecto->codigo . '.pdf', $fileContent);
        // if (!empty($response['sharePointPath'])) {
        //     ProyectoPdfVersion::create([
        //         'proyecto_id'     => $proyecto->id,
        //         'version'         => $response['nombreArchivo'],
        //         'estado'          => 1
        //     ]);

        //     ProyectoPdfVersion::where('proyecto_id', $proyecto->id)->update(['estado' => 1]);
        // }
    }

    static function generarPdfFormulario6Linea82(Convocatoria $convocatoria, Proyecto $proyecto)
    {
        ini_set('max_execution_time', 0);
        ini_set('memory_limit', -1);

        $datos = null;
        $datos = $proyecto->proyectoFormulario6Linea82;

        $proyecto->load('efectosDirectos.resultado');

        $pdf = PDF::setOption(['dpi' => 150, 'defaultFont' => 'Nunito'])->loadView('Convocatorias.Proyectos.PdfFormulario6Linea82', [
            'convocatoria'                      => $convocatoria,
            'proyecto'                          => $proyecto,
            'datos'                             => $datos,
            'municipios'                        => Municipio::all(),
            'proyecto_anexo'                    => $proyecto->proyectoAnexo()->select('proyecto_anexo.*', 'anexos.nombre')->join('convocatoria_anexos', 'proyecto_anexo.convocatoria_anexo_id', 'convocatoria_anexos.id')->join('anexos', 'convocatoria_anexos.anexo_id', 'anexos.id')->get(),
            'tipos_productos'                   => collect(json_decode(Storage::get('json/tipos-producto.json'), true)),
            'niveles_riesgo'                    => collect(json_decode(Storage::get('json/niveles-riesgo.json'), true)),
            'tipos_riesgo'                      => collect(json_decode(Storage::get('json/tipos-riesgo.json'), true)),
            'probabilidades_riesgo'             => collect(json_decode(Storage::get('json/probabilidades-riesgo.json'), true)),
            'impactos_riesgo'                   => collect(json_decode(Storage::get('json/impactos-riesgo.json'), true)),
            'roles_sennova'                     => RolSennova::select('id as value', 'nombre as label')->orderBy('nombre', 'ASC')->get(),
            'tipos_impacto'                     => collect(json_decode(Storage::get('json/tipos-impacto.json'), true)),
            'distancias_municipios'             => collect(json_decode(Storage::get('json/distancia-municipios.json'), true)),
            'frecuencias_semanales'             => collect(json_decode(Storage::get('json/frecuencias-semanales-visita.json'), true)),
            'opciones_servicios_edicion'        => collect(json_decode(Storage::get('json/opciones-servicios-edicion.json'), true)),
            'tipos_entidad_aliada'              => collect(json_decode(Storage::get('json/tipos-entidades-aliadas.json'), true)),
            'naturaleza_entidad_aliada'         => collect(json_decode(Storage::get('json/naturaleza-empresa.json'), true)),
            'tipos_empresa'                     => collect(json_decode(Storage::get('json/tipos-empresa.json'), true)),
            'tipos_licencia'                    => collect(json_decode(Storage::get('json/tipos-licencia-software.json'), true)),
            'tipos_software'                    => collect(json_decode(Storage::get('json/tipos-software.json'), true)),
            'lineas_estrategicas'               => collect(json_decode(Storage::get('json/lineas-estrategicas.json'), true)),
            'areas_cualificacion_mnc'           => collect(json_decode(Storage::get('json/areas-cualificacion-mnc.json'), true)),
        ]);

        return $pdf->stream();

        return $pdf->download($proyecto->codigo.'.pdf');

        // Get the file content from the response
        $fileContent = $pdf->setWarnings(false)->output();

        // Set the filename
        $filename = 'file.pdf';

        // Create a temporary file
        $tmp_file = tmpfile();

        // Write the file content to the temporary file
        fwrite($tmp_file, $fileContent);

        // Create a new file object from the temporary file
        $file = new \Illuminate\Http\UploadedFile(
            stream_get_meta_data($tmp_file)['uri'],
            $filename,
            'application/pdf',
            null,
            true
        );

        $request = new Request();

        // Set the file object in the request
        $request->merge([
            'pdf_proyecto' => $file,
        ]);

        $modulo = 'CONVOCATORIAS2023';
        $centroFormacionSharePoint  = $proyecto->centroFormacion->nombre_carpeta_sharepoint;
        $sharepoint_path            = "$modulo/$centroFormacionSharePoint/" . $proyecto->lineaProgramatica->codigo . "/$proyecto->codigo";

        // $response = self::saveFilesSharepoint($request, 'CONVOCATORIA2023', $proyecto, $proyecto, 'pdf_proyecto');

        $path = Storage::put($sharepoint_path . '/' . $proyecto->codigo . '.pdf', $fileContent);
        // if (!empty($response['sharePointPath'])) {
        //     ProyectoPdfVersion::create([
        //         'proyecto_id'     => $proyecto->id,
        //         'version'         => $response['nombreArchivo'],
        //         'estado'          => 1
        //     ]);

        //     ProyectoPdfVersion::where('proyecto_id', $proyecto->id)->update(['estado' => 1]);
        // }
    }

    static function generarPdfFormulario7Linea23(Convocatoria $convocatoria, Proyecto $proyecto)
    {
        ini_set('max_execution_time', 0);
        ini_set('memory_limit', -1);

        $datos = null;
        $datos = $proyecto->proyectoFormulario7Linea23;

        $proyecto->load('efectosDirectos.resultado');

        $pdf = PDF::setOption(['dpi' => 150, 'defaultFont' => 'Nunito'])->loadView('Convocatorias.Proyectos.PdfFormulario7Linea23', [
            'convocatoria'                      => $convocatoria,
            'proyecto'                          => $proyecto,
            'datos'                             => $datos,
            'municipios'                        => Municipio::all(),
            'proyecto_anexo'                    => $proyecto->proyectoAnexo()->select('proyecto_anexo.*', 'anexos.nombre')->join('convocatoria_anexos', 'proyecto_anexo.convocatoria_anexo_id', 'convocatoria_anexos.id')->join('anexos', 'convocatoria_anexos.anexo_id', 'anexos.id')->get(),
            'tipos_productos'                   => collect(json_decode(Storage::get('json/tipos-producto.json'), true)),
            'niveles_riesgo'                    => collect(json_decode(Storage::get('json/niveles-riesgo.json'), true)),
            'tipos_riesgo'                      => collect(json_decode(Storage::get('json/tipos-riesgo.json'), true)),
            'probabilidades_riesgo'             => collect(json_decode(Storage::get('json/probabilidades-riesgo.json'), true)),
            'impactos_riesgo'                   => collect(json_decode(Storage::get('json/impactos-riesgo.json'), true)),
            'roles_sennova'                     => RolSennova::select('id as value', 'nombre as label')->orderBy('nombre', 'ASC')->get(),
            'tipos_impacto'                     => collect(json_decode(Storage::get('json/tipos-impacto.json'), true)),
            'distancias_municipios'             => collect(json_decode(Storage::get('json/distancia-municipios.json'), true)),
            'frecuencias_semanales'             => collect(json_decode(Storage::get('json/frecuencias-semanales-visita.json'), true)),
            'opciones_servicios_edicion'        => collect(json_decode(Storage::get('json/opciones-servicios-edicion.json'), true)),
            'tipos_entidad_aliada'              => collect(json_decode(Storage::get('json/tipos-entidades-aliadas.json'), true)),
            'naturaleza_entidad_aliada'         => collect(json_decode(Storage::get('json/naturaleza-empresa.json'), true)),
            'tipos_empresa'                     => collect(json_decode(Storage::get('json/tipos-empresa.json'), true)),
            'tipos_licencia'                    => collect(json_decode(Storage::get('json/tipos-licencia-software.json'), true)),
            'tipos_software'                    => collect(json_decode(Storage::get('json/tipos-software.json'), true)),
            'lineas_estrategicas'               => collect(json_decode(Storage::get('json/lineas-estrategicas.json'), true)),
        ]);

        return $pdf->stream();

        return $pdf->download($proyecto->codigo.'.pdf');

        // Get the file content from the response
        $fileContent = $pdf->setWarnings(false)->output();

        // Set the filename
        $filename = 'file.pdf';

        // Create a temporary file
        $tmp_file = tmpfile();

        // Write the file content to the temporary file
        fwrite($tmp_file, $fileContent);

        // Create a new file object from the temporary file
        $file = new \Illuminate\Http\UploadedFile(
            stream_get_meta_data($tmp_file)['uri'],
            $filename,
            'application/pdf',
            null,
            true
        );

        $request = new Request();

        // Set the file object in the request
        $request->merge([
            'pdf_proyecto' => $file,
        ]);

        $modulo = 'CONVOCATORIAS2023';
        $centroFormacionSharePoint  = $proyecto->centroFormacion->nombre_carpeta_sharepoint;
        $sharepoint_path            = "$modulo/$centroFormacionSharePoint/" . $proyecto->lineaProgramatica->codigo . "/$proyecto->codigo";

        // $response = self::saveFilesSharepoint($request, 'CONVOCATORIA2023', $proyecto, $proyecto, 'pdf_proyecto');

        $path = Storage::put($sharepoint_path . '/' . $proyecto->codigo . '.pdf', $fileContent);
        // if (!empty($response['sharePointPath'])) {
        //     ProyectoPdfVersion::create([
        //         'proyecto_id'     => $proyecto->id,
        //         'version'         => $response['nombreArchivo'],
        //         'estado'          => 1
        //     ]);

        //     ProyectoPdfVersion::where('proyecto_id', $proyecto->id)->update(['estado' => 1]);
        // }
    }

    static function generarPdfFormulario8Linea66(Convocatoria $convocatoria, Proyecto $proyecto)
    {
        ini_set('max_execution_time', 0);
        ini_set('memory_limit', -1);

        $datos = null;
        $datos = $proyecto->proyectoFormulario8Linea66;

        $proyecto->load('efectosDirectos.resultado');

        $pdf = PDF::setOption(['dpi' => 150, 'defaultFont' => 'Nunito'])->loadView('Convocatorias.Proyectos.PdfFormulario8Linea66', [
            'convocatoria'                      => $convocatoria,
            'proyecto'                          => $proyecto,
            'datos'                             => $datos,
            'municipios'                        => Municipio::all(),
            'proyecto_anexo'                    => $proyecto->proyectoAnexo()->select('proyecto_anexo.*', 'anexos.nombre')->join('convocatoria_anexos', 'proyecto_anexo.convocatoria_anexo_id', 'convocatoria_anexos.id')->join('anexos', 'convocatoria_anexos.anexo_id', 'anexos.id')->get(),
            'tipos_productos'                   => collect(json_decode(Storage::get('json/tipos-producto.json'), true)),
            'niveles_riesgo'                    => collect(json_decode(Storage::get('json/niveles-riesgo.json'), true)),
            'tipos_riesgo'                      => collect(json_decode(Storage::get('json/tipos-riesgo.json'), true)),
            'probabilidades_riesgo'             => collect(json_decode(Storage::get('json/probabilidades-riesgo.json'), true)),
            'impactos_riesgo'                   => collect(json_decode(Storage::get('json/impactos-riesgo.json'), true)),
            'roles_sennova'                     => RolSennova::select('id as value', 'nombre as label')->orderBy('nombre', 'ASC')->get(),
            'tipos_impacto'                     => collect(json_decode(Storage::get('json/tipos-impacto.json'), true)),
            'distancias_municipios'             => collect(json_decode(Storage::get('json/distancia-municipios.json'), true)),
            'frecuencias_semanales'             => collect(json_decode(Storage::get('json/frecuencias-semanales-visita.json'), true)),
            'opciones_servicios_edicion'        => collect(json_decode(Storage::get('json/opciones-servicios-edicion.json'), true)),
            'tipos_entidad_aliada'              => collect(json_decode(Storage::get('json/tipos-entidades-aliadas.json'), true)),
            'naturaleza_entidad_aliada'         => collect(json_decode(Storage::get('json/naturaleza-empresa.json'), true)),
            'tipos_empresa'                     => collect(json_decode(Storage::get('json/tipos-empresa.json'), true)),
            'tipos_licencia'                    => collect(json_decode(Storage::get('json/tipos-licencia-software.json'), true)),
            'tipos_software'                    => collect(json_decode(Storage::get('json/tipos-software.json'), true)),
            'lineas_estrategicas'               => collect(json_decode(Storage::get('json/lineas-estrategicas.json'), true)),
        ]);

        return $pdf->stream();

        return $pdf->download($proyecto->codigo.'.pdf');

        // Get the file content from the response
        $fileContent = $pdf->setWarnings(false)->output();

        // Set the filename
        $filename = 'file.pdf';

        // Create a temporary file
        $tmp_file = tmpfile();

        // Write the file content to the temporary file
        fwrite($tmp_file, $fileContent);

        // Create a new file object from the temporary file
        $file = new \Illuminate\Http\UploadedFile(
            stream_get_meta_data($tmp_file)['uri'],
            $filename,
            'application/pdf',
            null,
            true
        );

        $request = new Request();

        // Set the file object in the request
        $request->merge([
            'pdf_proyecto' => $file,
        ]);

        $modulo = 'CONVOCATORIAS2023';
        $centroFormacionSharePoint  = $proyecto->centroFormacion->nombre_carpeta_sharepoint;
        $sharepoint_path            = "$modulo/$centroFormacionSharePoint/" . $proyecto->lineaProgramatica->codigo . "/$proyecto->codigo";

        // $response = self::saveFilesSharepoint($request, 'CONVOCATORIA2023', $proyecto, $proyecto, 'pdf_proyecto');

        $path = Storage::put($sharepoint_path . '/' . $proyecto->codigo . '.pdf', $fileContent);
        // if (!empty($response['sharePointPath'])) {
        //     ProyectoPdfVersion::create([
        //         'proyecto_id'     => $proyecto->id,
        //         'version'         => $response['nombreArchivo'],
        //         'estado'          => 1
        //     ]);

        //     ProyectoPdfVersion::where('proyecto_id', $proyecto->id)->update(['estado' => 1]);
        // }
    }

    static function generarPdfFormulario9Linea23(Convocatoria $convocatoria, Proyecto $proyecto)
    {
        ini_set('max_execution_time', 0);
        ini_set('memory_limit', -1);

        $datos = null;
        $datos = $proyecto->proyectoFormulario9Linea23;

        $proyecto->load('efectosDirectos.resultado');

        $pdf = PDF::setOption(['dpi' => 150, 'defaultFont' => 'Nunito'])->loadView('Convocatorias.Proyectos.PdfFormulario9Linea23', [
            'convocatoria'                      => $convocatoria,
            'proyecto'                          => $proyecto,
            'datos'                             => $datos,
            'municipios'                        => Municipio::all(),
            'proyecto_anexo'                    => $proyecto->proyectoAnexo()->select('proyecto_anexo.*', 'anexos.nombre')->join('convocatoria_anexos', 'proyecto_anexo.convocatoria_anexo_id', 'convocatoria_anexos.id')->join('anexos', 'convocatoria_anexos.anexo_id', 'anexos.id')->get(),
            'tipos_productos'                   => collect(json_decode(Storage::get('json/tipos-producto.json'), true)),
            'niveles_riesgo'                    => collect(json_decode(Storage::get('json/niveles-riesgo.json'), true)),
            'tipos_riesgo'                      => collect(json_decode(Storage::get('json/tipos-riesgo.json'), true)),
            'probabilidades_riesgo'             => collect(json_decode(Storage::get('json/probabilidades-riesgo.json'), true)),
            'impactos_riesgo'                   => collect(json_decode(Storage::get('json/impactos-riesgo.json'), true)),
            'roles_sennova'                     => RolSennova::select('id as value', 'nombre as label')->orderBy('nombre', 'ASC')->get(),
            'tipos_impacto'                     => collect(json_decode(Storage::get('json/tipos-impacto.json'), true)),
            'distancias_municipios'             => collect(json_decode(Storage::get('json/distancia-municipios.json'), true)),
            'frecuencias_semanales'             => collect(json_decode(Storage::get('json/frecuencias-semanales-visita.json'), true)),
            'opciones_servicios_edicion'        => collect(json_decode(Storage::get('json/opciones-servicios-edicion.json'), true)),
            'tipos_entidad_aliada'              => collect(json_decode(Storage::get('json/tipos-entidades-aliadas.json'), true)),
            'naturaleza_entidad_aliada'         => collect(json_decode(Storage::get('json/naturaleza-empresa.json'), true)),
            'tipos_empresa'                     => collect(json_decode(Storage::get('json/tipos-empresa.json'), true)),
            'tipos_licencia'                    => collect(json_decode(Storage::get('json/tipos-licencia-software.json'), true)),
            'tipos_software'                    => collect(json_decode(Storage::get('json/tipos-software.json'), true)),
            'lineas_estrategicas'               => collect(json_decode(Storage::get('json/lineas-estrategicas.json'), true)),
        ]);

        return $pdf->stream();

        return $pdf->download($proyecto->codigo.'.pdf');

        // Get the file content from the response
        $fileContent = $pdf->setWarnings(false)->output();

        // Set the filename
        $filename = 'file.pdf';

        // Create a temporary file
        $tmp_file = tmpfile();

        // Write the file content to the temporary file
        fwrite($tmp_file, $fileContent);

        // Create a new file object from the temporary file
        $file = new \Illuminate\Http\UploadedFile(
            stream_get_meta_data($tmp_file)['uri'],
            $filename,
            'application/pdf',
            null,
            true
        );

        $request = new Request();

        // Set the file object in the request
        $request->merge([
            'pdf_proyecto' => $file,
        ]);

        $modulo = 'CONVOCATORIAS2023';
        $centroFormacionSharePoint  = $proyecto->centroFormacion->nombre_carpeta_sharepoint;
        $sharepoint_path            = "$modulo/$centroFormacionSharePoint/" . $proyecto->lineaProgramatica->codigo . "/$proyecto->codigo";

        // $response = self::saveFilesSharepoint($request, 'CONVOCATORIA2023', $proyecto, $proyecto, 'pdf_proyecto');

        $path = Storage::put($sharepoint_path . '/' . $proyecto->codigo . '.pdf', $fileContent);
        // if (!empty($response['sharePointPath'])) {
        //     ProyectoPdfVersion::create([
        //         'proyecto_id'     => $proyecto->id,
        //         'version'         => $response['nombreArchivo'],
        //         'estado'          => 1
        //     ]);

        //     ProyectoPdfVersion::where('proyecto_id', $proyecto->id)->update(['estado' => 1]);
        // }
    }

    static function generarPdfFormulario10Linea69(Convocatoria $convocatoria, Proyecto $proyecto)
    {
        ini_set('max_execution_time', 0);
        ini_set('memory_limit', -1);

        $datos = null;
        $datos = $proyecto->proyectoFormulario10Linea69;

        $proyecto->load('efectosDirectos.resultado');

        $pdf = PDF::setOption(['dpi' => 150, 'defaultFont' => 'Nunito'])->loadView('Convocatorias.Proyectos.PdfFormulario10Linea69', [
            'convocatoria'                      => $convocatoria,
            'proyecto'                          => $proyecto,
            'datos'                             => $datos,
            'municipios'                        => Municipio::all(),
            'proyecto_anexo'                    => $proyecto->proyectoAnexo()->select('proyecto_anexo.*', 'anexos.nombre')->join('convocatoria_anexos', 'proyecto_anexo.convocatoria_anexo_id', 'convocatoria_anexos.id')->join('anexos', 'convocatoria_anexos.anexo_id', 'anexos.id')->get(),
            'tipos_productos'                   => collect(json_decode(Storage::get('json/tipos-producto.json'), true)),
            'niveles_riesgo'                    => collect(json_decode(Storage::get('json/niveles-riesgo.json'), true)),
            'tipos_riesgo'                      => collect(json_decode(Storage::get('json/tipos-riesgo.json'), true)),
            'probabilidades_riesgo'             => collect(json_decode(Storage::get('json/probabilidades-riesgo.json'), true)),
            'impactos_riesgo'                   => collect(json_decode(Storage::get('json/impactos-riesgo.json'), true)),
            'roles_sennova'                     => RolSennova::select('id as value', 'nombre as label')->orderBy('nombre', 'ASC')->get(),
            'tipos_impacto'                     => collect(json_decode(Storage::get('json/tipos-impacto.json'), true)),
            'distancias_municipios'             => collect(json_decode(Storage::get('json/distancia-municipios.json'), true)),
            'frecuencias_semanales'             => collect(json_decode(Storage::get('json/frecuencias-semanales-visita.json'), true)),
            'opciones_servicios_edicion'        => collect(json_decode(Storage::get('json/opciones-servicios-edicion.json'), true)),
            'tipos_entidad_aliada'              => collect(json_decode(Storage::get('json/tipos-entidades-aliadas.json'), true)),
            'naturaleza_entidad_aliada'         => collect(json_decode(Storage::get('json/naturaleza-empresa.json'), true)),
            'tipos_empresa'                     => collect(json_decode(Storage::get('json/tipos-empresa.json'), true)),
            'tipos_licencia'                    => collect(json_decode(Storage::get('json/tipos-licencia-software.json'), true)),
            'tipos_software'                    => collect(json_decode(Storage::get('json/tipos-software.json'), true))
        ]);

        return $pdf->stream();

        return $pdf->download($proyecto->codigo.'.pdf');

        // Get the file content from the response
        $fileContent = $pdf->setWarnings(false)->output();

        // Set the filename
        $filename = 'file.pdf';

        // Create a temporary file
        $tmp_file = tmpfile();

        // Write the file content to the temporary file
        fwrite($tmp_file, $fileContent);

        // Create a new file object from the temporary file
        $file = new \Illuminate\Http\UploadedFile(
            stream_get_meta_data($tmp_file)['uri'],
            $filename,
            'application/pdf',
            null,
            true
        );

        $request = new Request();

        // Set the file object in the request
        $request->merge([
            'pdf_proyecto' => $file,
        ]);

        $modulo = 'CONVOCATORIAS2023';
        $centroFormacionSharePoint  = $proyecto->centroFormacion->nombre_carpeta_sharepoint;
        $sharepoint_path            = "$modulo/$centroFormacionSharePoint/" . $proyecto->lineaProgramatica->codigo . "/$proyecto->codigo";

        // $response = self::saveFilesSharepoint($request, 'CONVOCATORIA2023', $proyecto, $proyecto, 'pdf_proyecto');

        $path = Storage::put($sharepoint_path . '/' . $proyecto->codigo . '.pdf', $fileContent);
        // if (!empty($response['sharePointPath'])) {
        //     ProyectoPdfVersion::create([
        //         'proyecto_id'     => $proyecto->id,
        //         'version'         => $response['nombreArchivo'],
        //         'estado'          => 1
        //     ]);

        //     ProyectoPdfVersion::where('proyecto_id', $proyecto->id)->update(['estado' => 1]);
        // }
    }

    static function generarPdfFormulario11Linea83(Convocatoria $convocatoria, Proyecto $proyecto)
    {
        ini_set('max_execution_time', 0);
        ini_set('memory_limit', -1);

        $datos = null;
        $datos = $proyecto->proyectoFormulario11Linea83;

        $proyecto->load('efectosDirectos.resultado');

        $pdf = PDF::setOption(['dpi' => 150, 'defaultFont' => 'Nunito'])->loadView('Convocatorias.Proyectos.PdfFormulario11Linea83', [
            'convocatoria'                      => $convocatoria,
            'proyecto'                          => $proyecto,
            'datos'                             => $datos,
            'municipios'                        => Municipio::all(),
            'proyecto_anexo'                    => $proyecto->proyectoAnexo()->select('proyecto_anexo.*', 'anexos.nombre')->join('convocatoria_anexos', 'proyecto_anexo.convocatoria_anexo_id', 'convocatoria_anexos.id')->join('anexos', 'convocatoria_anexos.anexo_id', 'anexos.id')->get(),
            'tipos_productos'                   => collect(json_decode(Storage::get('json/tipos-producto.json'), true)),
            'niveles_riesgo'                    => collect(json_decode(Storage::get('json/niveles-riesgo.json'), true)),
            'tipos_riesgo'                      => collect(json_decode(Storage::get('json/tipos-riesgo.json'), true)),
            'probabilidades_riesgo'             => collect(json_decode(Storage::get('json/probabilidades-riesgo.json'), true)),
            'impactos_riesgo'                   => collect(json_decode(Storage::get('json/impactos-riesgo.json'), true)),
            'roles_sennova'                     => RolSennova::select('id as value', 'nombre as label')->orderBy('nombre', 'ASC')->get(),
            'tipos_impacto'                     => collect(json_decode(Storage::get('json/tipos-impacto.json'), true)),
            'distancias_municipios'             => collect(json_decode(Storage::get('json/distancia-municipios.json'), true)),
            'frecuencias_semanales'             => collect(json_decode(Storage::get('json/frecuencias-semanales-visita.json'), true)),
            'opciones_servicios_edicion'        => collect(json_decode(Storage::get('json/opciones-servicios-edicion.json'), true)),
            'tipos_entidad_aliada'              => collect(json_decode(Storage::get('json/tipos-entidades-aliadas.json'), true)),
            'naturaleza_entidad_aliada'         => collect(json_decode(Storage::get('json/naturaleza-empresa.json'), true)),
            'tipos_empresa'                     => collect(json_decode(Storage::get('json/tipos-empresa.json'), true)),
            'tipos_licencia'                    => collect(json_decode(Storage::get('json/tipos-licencia-software.json'), true)),
            'tipos_software'                    => collect(json_decode(Storage::get('json/tipos-software.json'), true))
        ]);

        return $pdf->stream();

        return $pdf->download($proyecto->codigo.'.pdf');

        // Get the file content from the response
        $fileContent = $pdf->setWarnings(false)->output();

        // Set the filename
        $filename = 'file.pdf';

        // Create a temporary file
        $tmp_file = tmpfile();

        // Write the file content to the temporary file
        fwrite($tmp_file, $fileContent);

        // Create a new file object from the temporary file
        $file = new \Illuminate\Http\UploadedFile(
            stream_get_meta_data($tmp_file)['uri'],
            $filename,
            'application/pdf',
            null,
            true
        );

        $request = new Request();

        // Set the file object in the request
        $request->merge([
            'pdf_proyecto' => $file,
        ]);

        $modulo = 'CONVOCATORIAS2023';
        $centroFormacionSharePoint  = $proyecto->centroFormacion->nombre_carpeta_sharepoint;
        $sharepoint_path            = "$modulo/$centroFormacionSharePoint/" . $proyecto->lineaProgramatica->codigo . "/$proyecto->codigo";

        // $response = self::saveFilesSharepoint($request, 'CONVOCATORIA2023', $proyecto, $proyecto, 'pdf_proyecto');

        $path = Storage::put($sharepoint_path . '/' . $proyecto->codigo . '.pdf', $fileContent);
        // if (!empty($response['sharePointPath'])) {
        //     ProyectoPdfVersion::create([
        //         'proyecto_id'     => $proyecto->id,
        //         'version'         => $response['nombreArchivo'],
        //         'estado'          => 1
        //     ]);

        //     ProyectoPdfVersion::where('proyecto_id', $proyecto->id)->update(['estado' => 1]);
        // }
    }

    static function generarPdfFormulario12Linea68(Convocatoria $convocatoria, Proyecto $proyecto)
    {
        ini_set('max_execution_time', 0);
        ini_set('memory_limit', -1);

        $datos = null;
        $tipo_proyecto_linea68 = SelectHelper::laboratoriosServiciosTecnologicos();
        $datos = $proyecto->proyectoFormulario12Linea68;

        $proyecto->load('efectosDirectos.resultado');

        $pdf = PDF::setOption(['dpi' => 150, 'defaultFont' => 'Nunito'])->loadView('Convocatorias.Proyectos.PdfFormulario12Linea68', [
            'convocatoria'                  => $convocatoria,
            'proyecto'                      => $proyecto,
            'datos'                         => $datos,
            'tipo_proyecto_linea68'         => $tipo_proyecto_linea68,
            'municipios'                    => Municipio::all(),
            'proyecto_anexo'                => $proyecto->proyectoAnexo()->select('proyecto_anexo.*', 'anexos.nombre')->join('convocatoria_anexos', 'proyecto_anexo.convocatoria_anexo_id', 'convocatoria_anexos.id')->join('anexos', 'convocatoria_anexos.anexo_id', 'anexos.id')->get(),
            'tipos_productos'               => collect(json_decode(Storage::get('json/tipos-producto.json'), true)),
            'niveles_riesgo'                => collect(json_decode(Storage::get('json/niveles-riesgo.json'), true)),
            'tipos_riesgo'                  => collect(json_decode(Storage::get('json/tipos-riesgo.json'), true)),
            'probabilidades_riesgo'         => collect(json_decode(Storage::get('json/probabilidades-riesgo.json'), true)),
            'impactos_riesgo'               => collect(json_decode(Storage::get('json/impactos-riesgo.json'), true)),
            'sectores_productivos'          => collect(json_decode(Storage::get('json/sectores-productivos.json'), true)),
            'roles_sennova'                 => RolSennova::select('id as value', 'nombre as label')->orderBy('nombre', 'ASC')->get(),
            'tipos_impacto'                 => collect(json_decode(Storage::get('json/tipos-impacto.json'), true)),
            'distancias_municipios'         => collect(json_decode(Storage::get('json/distancia-municipios.json'), true)),
            'frecuencias_semanales'         => collect(json_decode(Storage::get('json/frecuencias-semanales-visita.json'), true)),
            'opciones_servicios_edicion'    => collect(json_decode(Storage::get('json/opciones-servicios-edicion.json'), true)),
        ]);

        return $pdf->stream();

        return $pdf->download($proyecto->codigo.'.pdf');

        // Get the file content from the response
        $fileContent = $pdf->setWarnings(false)->output();

        // Set the filename
        $filename = 'file.pdf';

        // Create a temporary file
        $tmp_file = tmpfile();

        // Write the file content to the temporary file
        fwrite($tmp_file, $fileContent);

        // Create a new file object from the temporary file
        $file = new \Illuminate\Http\UploadedFile(
            stream_get_meta_data($tmp_file)['uri'],
            $filename,
            'application/pdf',
            null,
            true
        );

        $request = new Request();

        // Set the file object in the request
        $request->merge([
            'pdf_proyecto' => $file,
        ]);

        $modulo = 'CONVOCATORIAS2023';
        $centroFormacionSharePoint  = $proyecto->centroFormacion->nombre_carpeta_sharepoint;
        $sharepoint_path            = "$modulo/$centroFormacionSharePoint/" . $proyecto->lineaProgramatica->codigo . "/$proyecto->codigo";

        // $response = self::saveFilesSharepoint($request, 'CONVOCATORIA2023', $proyecto, $proyecto, 'pdf_proyecto');

        $path = Storage::put($sharepoint_path . '/' . $proyecto->codigo . '.pdf', $fileContent);
        // if (!empty($response['sharePointPath'])) {
        //     ProyectoPdfVersion::create([
        //         'proyecto_id'     => $proyecto->id,
        //         'version'         => $response['nombreArchivo'],
        //         'estado'          => 1
        //     ]);

        //     ProyectoPdfVersion::where('proyecto_id', $proyecto->id)->update(['estado' => 1]);
        // }
    }

    static function generarPdfFormulario13Linea65(Convocatoria $convocatoria, Proyecto $proyecto)
    {
        ini_set('max_execution_time', 0);
        ini_set('memory_limit', -1);

        $datos = null;
        $datos = $proyecto->proyectoFormulario13Linea65;

        $proyecto->load('efectosDirectos.resultado');

        $pdf = PDF::setOption(['dpi' => 150, 'defaultFont' => 'Nunito'])->loadView('Convocatorias.Proyectos.PdfFormulario13Linea65', [
            'convocatoria'                  => $convocatoria,
            'proyecto'                      => $proyecto,
            'datos'                         => $datos,
            'municipios'                    => Municipio::all(),
            'proyecto_anexo'                => $proyecto->proyectoAnexo()->select('proyecto_anexo.*', 'anexos.nombre')->join('convocatoria_anexos', 'proyecto_anexo.convocatoria_anexo_id', 'convocatoria_anexos.id')->join('anexos', 'convocatoria_anexos.anexo_id', 'anexos.id')->get(),
            'tipos_productos'               => collect(json_decode(Storage::get('json/tipos-producto.json'), true)),
            'niveles_riesgo'                => collect(json_decode(Storage::get('json/niveles-riesgo.json'), true)),
            'tipos_riesgo'                  => collect(json_decode(Storage::get('json/tipos-riesgo.json'), true)),
            'probabilidades_riesgo'         => collect(json_decode(Storage::get('json/probabilidades-riesgo.json'), true)),
            'impactos_riesgo'               => collect(json_decode(Storage::get('json/impactos-riesgo.json'), true)),
            'roles_sennova'                 => RolSennova::select('id as value', 'nombre as label')->orderBy('nombre', 'ASC')->get(),
            'tipos_impacto'                 => collect(json_decode(Storage::get('json/tipos-impacto.json'), true)),
            'distancias_municipios'         => collect(json_decode(Storage::get('json/distancia-municipios.json'), true)),
            'frecuencias_semanales'         => collect(json_decode(Storage::get('json/frecuencias-semanales-visita.json'), true)),
            'opciones_servicios_edicion'    => collect(json_decode(Storage::get('json/opciones-servicios-edicion.json'), true)),
            'ejes_sennova'                  => collect(json_decode(Storage::get('json/ejes-sennova.json'), true)),
            'areas_cualificacion_mnc'       => collect(json_decode(Storage::get('json/areas-cualificacion-mnc.json'), true)),
            'tipos_eventos'                 => collect(json_decode(Storage::get('json/tipos-eventos-linea-65.json'), true)),
            'lineas_estrategicas_sena'      => collect(json_decode(Storage::get('json/lineas-estrategicas.json'), true)),
            'lineas_programaticas'          => SelectHelper::lineasProgramaticas(),
            'nodos_tecnoparques'            => SelectHelper::nodosTecnoparque(),
            'tecnoacademias'                => SelectHelper::tecnoacademias(),
            'hubs_innovacion'               => SelectHelper::hubsInnovacion(),
            'laboratorios_st'               => SelectHelper::laboratoriosServiciosTecnologicos(),
            'tipos_licencia'                => collect(json_decode(Storage::get('json/tipos-licencia-software.json'), true)),
            'tipos_software'                => collect(json_decode(Storage::get('json/tipos-software.json'), true))
        ]);

        return $pdf->stream();

        return $pdf->download($proyecto->codigo.'.pdf');

        // Get the file content from the response
        $fileContent = $pdf->setWarnings(false)->output();

        // Set the filename
        $filename = 'file.pdf';

        // Create a temporary file
        $tmp_file = tmpfile();

        // Write the file content to the temporary file
        fwrite($tmp_file, $fileContent);

        // Create a new file object from the temporary file
        $file = new \Illuminate\Http\UploadedFile(
            stream_get_meta_data($tmp_file)['uri'],
            $filename,
            'application/pdf',
            null,
            true
        );

        $request = new Request();

        // Set the file object in the request
        $request->merge([
            'pdf_proyecto' => $file,
        ]);

        $modulo = 'CONVOCATORIAS2023';
        $centroFormacionSharePoint  = $proyecto->centroFormacion->nombre_carpeta_sharepoint;
        $sharepoint_path            = "$modulo/$centroFormacionSharePoint/" . $proyecto->lineaProgramatica->codigo . "/$proyecto->codigo";

        // $response = self::saveFilesSharepoint($request, 'CONVOCATORIA2023', $proyecto, $proyecto, 'pdf_proyecto');

        $path = Storage::put($sharepoint_path . '/' . $proyecto->codigo . '.pdf', $fileContent);
        // if (!empty($response['sharePointPath'])) {
        //     ProyectoPdfVersion::create([
        //         'proyecto_id'     => $proyecto->id,
        //         'version'         => $response['nombreArchivo'],
        //         'estado'          => 1
        //     ]);

        //     ProyectoPdfVersion::where('proyecto_id', $proyecto->id)->update(['estado' => 1]);
        // }
    }

    static function generarPdfFormulario15Linea65(Convocatoria $convocatoria, Proyecto $proyecto)
    {
        ini_set('max_execution_time', 0);
        ini_set('memory_limit', -1);

        $datos = null;
        $datos = $proyecto->proyectoFormulario15Linea65;

        $proyecto->load('efectosDirectos.resultado');

        $pdf = PDF::setOption(['dpi' => 150, 'defaultFont' => 'Nunito'])->loadView('Convocatorias.Proyectos.PdfFormulario15Linea65', [
            'convocatoria'                  => $convocatoria,
            'proyecto'                      => $proyecto,
            'datos'                         => $datos,
            'municipios'                    => Municipio::all(),
            'proyecto_anexo'                => $proyecto->proyectoAnexo()->select('proyecto_anexo.*', 'anexos.nombre')->join('convocatoria_anexos', 'proyecto_anexo.convocatoria_anexo_id', 'convocatoria_anexos.id')->join('anexos', 'convocatoria_anexos.anexo_id', 'anexos.id')->get(),
            'tipos_productos'               => collect(json_decode(Storage::get('json/tipos-producto.json'), true)),
            'niveles_riesgo'                => collect(json_decode(Storage::get('json/niveles-riesgo.json'), true)),
            'tipos_riesgo'                  => collect(json_decode(Storage::get('json/tipos-riesgo.json'), true)),
            'probabilidades_riesgo'         => collect(json_decode(Storage::get('json/probabilidades-riesgo.json'), true)),
            'impactos_riesgo'               => collect(json_decode(Storage::get('json/impactos-riesgo.json'), true)),
            'roles_sennova'                 => RolSennova::select('id as value', 'nombre as label')->orderBy('nombre', 'ASC')->get(),
            'tipos_impacto'                 => collect(json_decode(Storage::get('json/tipos-impacto.json'), true)),
            'distancias_municipios'         => collect(json_decode(Storage::get('json/distancia-municipios.json'), true)),
            'frecuencias_semanales'         => collect(json_decode(Storage::get('json/frecuencias-semanales-visita.json'), true)),
            'opciones_servicios_edicion'    => collect(json_decode(Storage::get('json/opciones-servicios-edicion.json'), true)),
            'ejes_sennova'                  => collect(json_decode(Storage::get('json/ejes-sennova.json'), true)),
            'areas_cualificacion_mnc'       => collect(json_decode(Storage::get('json/areas-cualificacion-mnc.json'), true)),
            'tipos_eventos'                 => collect(json_decode(Storage::get('json/tipos-eventos-linea-65.json'), true)),
            'lineas_estrategicas_sena'      => collect(json_decode(Storage::get('json/lineas-estrategicas.json'), true)),
            'lineas_programaticas'          => SelectHelper::lineasProgramaticas(),
            'nodos_tecnoparques'            => SelectHelper::nodosTecnoparque(),
            'tecnoacademias'                => SelectHelper::tecnoacademias(),
            'hubs_innovacion'               => SelectHelper::hubsInnovacion(),
            'laboratorios_st'               => SelectHelper::laboratoriosServiciosTecnologicos(),
            'tipos_licencia'                => collect(json_decode(Storage::get('json/tipos-licencia-software.json'), true)),
            'tipos_software'                => collect(json_decode(Storage::get('json/tipos-software.json'), true))
        ]);

        return $pdf->stream();

        return $pdf->download($proyecto->codigo.'.pdf');

        // Get the file content from the response
        $fileContent = $pdf->setWarnings(false)->output();

        // Set the filename
        $filename = 'file.pdf';

        // Create a temporary file
        $tmp_file = tmpfile();

        // Write the file content to the temporary file
        fwrite($tmp_file, $fileContent);

        // Create a new file object from the temporary file
        $file = new \Illuminate\Http\UploadedFile(
            stream_get_meta_data($tmp_file)['uri'],
            $filename,
            'application/pdf',
            null,
            true
        );

        $request = new Request();

        // Set the file object in the request
        $request->merge([
            'pdf_proyecto' => $file,
        ]);

        $modulo = 'CONVOCATORIAS2023';
        $centroFormacionSharePoint  = $proyecto->centroFormacion->nombre_carpeta_sharepoint;
        $sharepoint_path            = "$modulo/$centroFormacionSharePoint/" . $proyecto->lineaProgramatica->codigo . "/$proyecto->codigo";

        // $response = self::saveFilesSharepoint($request, 'CONVOCATORIA2023', $proyecto, $proyecto, 'pdf_proyecto');

        $path = Storage::put($sharepoint_path . '/' . $proyecto->codigo . '.pdf', $fileContent);
        // if (!empty($response['sharePointPath'])) {
        //     ProyectoPdfVersion::create([
        //         'proyecto_id'     => $proyecto->id,
        //         'version'         => $response['nombreArchivo'],
        //         'estado'          => 1
        //     ]);

        //     ProyectoPdfVersion::where('proyecto_id', $proyecto->id)->update(['estado' => 1]);
        // }
    }

    static function generarPdfFormulario16Linea65(Convocatoria $convocatoria, Proyecto $proyecto)
    {
        ini_set('max_execution_time', 0);
        ini_set('memory_limit', -1);

        $datos = null;
        $datos = $proyecto->proyectoFormulario16Linea65;

        $proyecto->load('efectosDirectos.resultado');

        $pdf = PDF::setOption(['dpi' => 150, 'defaultFont' => 'Nunito'])->loadView('Convocatorias.Proyectos.PdfFormulario16Linea65', [
            'convocatoria'                  => $convocatoria,
            'proyecto'                      => $proyecto,
            'datos'                         => $datos,
            'municipios'                    => Municipio::all(),
            'proyecto_anexo'                => $proyecto->proyectoAnexo()->select('proyecto_anexo.*', 'anexos.nombre')->join('convocatoria_anexos', 'proyecto_anexo.convocatoria_anexo_id', 'convocatoria_anexos.id')->join('anexos', 'convocatoria_anexos.anexo_id', 'anexos.id')->get(),
            'tipos_productos'               => collect(json_decode(Storage::get('json/tipos-producto.json'), true)),
            'niveles_riesgo'                => collect(json_decode(Storage::get('json/niveles-riesgo.json'), true)),
            'tipos_riesgo'                  => collect(json_decode(Storage::get('json/tipos-riesgo.json'), true)),
            'probabilidades_riesgo'         => collect(json_decode(Storage::get('json/probabilidades-riesgo.json'), true)),
            'impactos_riesgo'               => collect(json_decode(Storage::get('json/impactos-riesgo.json'), true)),
            'roles_sennova'                 => RolSennova::select('id as value', 'nombre as label')->orderBy('nombre', 'ASC')->get(),
            'tipos_impacto'                 => collect(json_decode(Storage::get('json/tipos-impacto.json'), true)),
            'distancias_municipios'         => collect(json_decode(Storage::get('json/distancia-municipios.json'), true)),
            'frecuencias_semanales'         => collect(json_decode(Storage::get('json/frecuencias-semanales-visita.json'), true)),
            'opciones_servicios_edicion'    => collect(json_decode(Storage::get('json/opciones-servicios-edicion.json'), true)),
            'ejes_sennova'                  => collect(json_decode(Storage::get('json/ejes-sennova.json'), true)),
            'areas_cualificacion_mnc'       => collect(json_decode(Storage::get('json/areas-cualificacion-mnc.json'), true)),
            'tipos_eventos'                 => collect(json_decode(Storage::get('json/tipos-eventos-linea-65.json'), true)),
            'lineas_estrategicas_sena'      => collect(json_decode(Storage::get('json/lineas-estrategicas.json'), true)),
            'lineas_programaticas'          => SelectHelper::lineasProgramaticas(),
            'nodos_tecnoparques'            => SelectHelper::nodosTecnoparque(),
            'tecnoacademias'                => SelectHelper::tecnoacademias(),
            'hubs_innovacion'               => SelectHelper::hubsInnovacion(),
            'laboratorios_st'               => SelectHelper::laboratoriosServiciosTecnologicos(),
            'tipos_licencia'                => collect(json_decode(Storage::get('json/tipos-licencia-software.json'), true)),
            'tipos_software'                => collect(json_decode(Storage::get('json/tipos-software.json'), true))
        ]);

        return $pdf->stream();

        return $pdf->download($proyecto->codigo.'.pdf');

        // Get the file content from the response
        $fileContent = $pdf->setWarnings(false)->output();

        // Set the filename
        $filename = 'file.pdf';

        // Create a temporary file
        $tmp_file = tmpfile();

        // Write the file content to the temporary file
        fwrite($tmp_file, $fileContent);

        // Create a new file object from the temporary file
        $file = new \Illuminate\Http\UploadedFile(
            stream_get_meta_data($tmp_file)['uri'],
            $filename,
            'application/pdf',
            null,
            true
        );

        $request = new Request();

        // Set the file object in the request
        $request->merge([
            'pdf_proyecto' => $file,
        ]);

        $modulo = 'CONVOCATORIAS2023';
        $centroFormacionSharePoint  = $proyecto->centroFormacion->nombre_carpeta_sharepoint;
        $sharepoint_path            = "$modulo/$centroFormacionSharePoint/" . $proyecto->lineaProgramatica->codigo . "/$proyecto->codigo";

        // $response = self::saveFilesSharepoint($request, 'CONVOCATORIA2023', $proyecto, $proyecto, 'pdf_proyecto');

        $path = Storage::put($sharepoint_path . '/' . $proyecto->codigo . '.pdf', $fileContent);
        // if (!empty($response['sharePointPath'])) {
        //     ProyectoPdfVersion::create([
        //         'proyecto_id'     => $proyecto->id,
        //         'version'         => $response['nombreArchivo'],
        //         'estado'          => 1
        //     ]);

        //     ProyectoPdfVersion::where('proyecto_id', $proyecto->id)->update(['estado' => 1]);
        // }
    }

    static function generarPdfFormulario17Linea69(Convocatoria $convocatoria, Proyecto $proyecto)
    {
        ini_set('max_execution_time', 0);
        ini_set('memory_limit', -1);

        $datos = null;
        $datos = $proyecto->proyectoFormulario17Linea69;

        $proyecto->load('efectosDirectos.resultado');

        $pdf = PDF::setOption(['dpi' => 150, 'defaultFont' => 'Nunito'])->loadView('Convocatorias.Proyectos.PdfFormulario17Linea69', [
            'convocatoria'                      => $convocatoria,
            'proyecto'                          => $proyecto,
            'datos'                             => $datos,
            'municipios'                        => Municipio::all(),
            'proyecto_anexo'                    => $proyecto->proyectoAnexo()->select('proyecto_anexo.*', 'anexos.nombre')->join('convocatoria_anexos', 'proyecto_anexo.convocatoria_anexo_id', 'convocatoria_anexos.id')->join('anexos', 'convocatoria_anexos.anexo_id', 'anexos.id')->get(),
            'tipos_productos'                   => collect(json_decode(Storage::get('json/tipos-producto.json'), true)),
            'niveles_riesgo'                    => collect(json_decode(Storage::get('json/niveles-riesgo.json'), true)),
            'tipos_riesgo'                      => collect(json_decode(Storage::get('json/tipos-riesgo.json'), true)),
            'probabilidades_riesgo'             => collect(json_decode(Storage::get('json/probabilidades-riesgo.json'), true)),
            'impactos_riesgo'                   => collect(json_decode(Storage::get('json/impactos-riesgo.json'), true)),
            'roles_sennova'                     => RolSennova::select('id as value', 'nombre as label')->orderBy('nombre', 'ASC')->get(),
            'tipos_impacto'                     => collect(json_decode(Storage::get('json/tipos-impacto.json'), true)),
            'distancias_municipios'             => collect(json_decode(Storage::get('json/distancia-municipios.json'), true)),
            'frecuencias_semanales'             => collect(json_decode(Storage::get('json/frecuencias-semanales-visita.json'), true)),
            'opciones_servicios_edicion'        => collect(json_decode(Storage::get('json/opciones-servicios-edicion.json'), true)),
            'tipos_entidad_aliada'              => collect(json_decode(Storage::get('json/tipos-entidades-aliadas.json'), true)),
            'naturaleza_entidad_aliada'         => collect(json_decode(Storage::get('json/naturaleza-empresa.json'), true)),
            'tipos_empresa'                     => collect(json_decode(Storage::get('json/tipos-empresa.json'), true)),
            'tipos_licencia'                    => collect(json_decode(Storage::get('json/tipos-licencia-software.json'), true)),
            'tipos_software'                    => collect(json_decode(Storage::get('json/tipos-software.json'), true))
        ]);

        return $pdf->stream();

        return $pdf->download($proyecto->codigo.'.pdf');

        // Get the file content from the response
        $fileContent = $pdf->setWarnings(false)->output();

        // Set the filename
        $filename = 'file.pdf';

        // Create a temporary file
        $tmp_file = tmpfile();

        // Write the file content to the temporary file
        fwrite($tmp_file, $fileContent);

        // Create a new file object from the temporary file
        $file = new \Illuminate\Http\UploadedFile(
            stream_get_meta_data($tmp_file)['uri'],
            $filename,
            'application/pdf',
            null,
            true
        );

        $request = new Request();

        // Set the file object in the request
        $request->merge([
            'pdf_proyecto' => $file,
        ]);

        $modulo = 'CONVOCATORIAS2023';
        $centroFormacionSharePoint  = $proyecto->centroFormacion->nombre_carpeta_sharepoint;
        $sharepoint_path            = "$modulo/$centroFormacionSharePoint/" . $proyecto->lineaProgramatica->codigo . "/$proyecto->codigo";

        // $response = self::saveFilesSharepoint($request, 'CONVOCATORIA2023', $proyecto, $proyecto, 'pdf_proyecto');

        $path = Storage::put($sharepoint_path . '/' . $proyecto->codigo . '.pdf', $fileContent);
        // if (!empty($response['sharePointPath'])) {
        //     ProyectoPdfVersion::create([
        //         'proyecto_id'     => $proyecto->id,
        //         'version'         => $response['nombreArchivo'],
        //         'estado'          => 1
        //     ]);

        //     ProyectoPdfVersion::where('proyecto_id', $proyecto->id)->update(['estado' => 1]);
        // }
    }

    static function saveFilesSharepoint(Request $request, $modulo, $proyecto, $modelo, $campo_bd)
    {
        $centroFormacionSharePoint = $proyecto->centroFormacion->nombre_carpeta_sharepoint;

        $sharepoint_path = "$modulo/$centroFormacionSharePoint/" . $proyecto->lineaProgramatica->codigo . "/$proyecto->codigo";
        $response = SharepointHelper::saveFilesSharepoint($request, $modelo, $sharepoint_path, $campo_bd, $proyecto->codigo . '-PDF');

        return $response;
    }


    static function takeScreenshot($route, $select = null)
    {
        $cookie = (isset($_COOKIE[config('session.cookie')])) ? $_COOKIE[config('session.cookie')] : '';
        $shot = Browsershot::url($route . '?to_pdf=1&key_to_pdf=ktvIOFQuNXqXinQIM1Uc')
            ->setNodeBinary(base_path() . '/node_modules/node/bin/node.exe')
            ->windowSize(1550, 800)
            ->deviceScaleFactor(2)
            ->addChromiumArguments([
                'no-sandbox',
                'disable-setuid-sandbox',
                'disable-background-timer-throttling',
                'disable-backgrounding-occluded-windows',
                'disable-renderer-backgrounding'
            ]);
        if (!empty($cookie)) {
            $shot->useCookies([
                'XSRF-TOKEN' => csrf_token(),
                config('session.cookie') => $cookie,
            ]);
        }
        if (!empty($select)) {
            $shot->select($select);
        } else {
            $shot->fullPage();
        }
        return $shot->base64Screenshot();
    }
}
