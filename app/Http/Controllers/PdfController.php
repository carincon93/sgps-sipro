<?php

namespace App\Http\Controllers;

use App\Helpers\SharepointHelper;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\Request;
use App\Models\Proyecto;
use App\Models\Convocatoria;
use App\Models\TipoProyectoSt;
use App\Models\ProyectoPdfVersion;
use Spatie\Browsershot\Browsershot;
use Illuminate\Support\Facades\Log;
use PDF;

class PdfController extends Controller
{
    /**
     * generateResumenProyecto
     *
     * @param  mixed $convocatoria
     * @param  mixed $proyecto
     * @return void
     */
    static function generateResumenProyecto(Convocatoria $convocatoria, Proyecto $proyecto, $save = false)
    {
        ini_set('max_execution_time', 0);
        ini_set('memory_limit', -1);

        $datos = null;
        $tipoProyectoSt = null;
        if (!empty($proyecto->proyectoLinea66)) {
            $datos = $proyecto->proyectoLinea66;
            $opcionesIDiDropdown = collect(json_decode(Storage::get('json/opciones-aplica-no-aplica.json'), true));
            $datos->relacionado_plan_tecnologico = $opcionesIDiDropdown->where('value', $datos->relacionado_plan_tecnologico)->first();
            $rolesSennova = collect(json_decode(Storage::get('json/roles-sennova-idi.json'), true));
        } else if (!empty($proyecto->proyectoLinea70)) {
            $datos = $proyecto->proyectoLinea70;
            $rolesSennova = collect(json_decode(Storage::get('json/roles-sennova-ta.json'), true));
        } else if (!empty($proyecto->proyectoLinea69)) {
            $proyecto->proyectoLinea69->talentosOtrosDepartamentos;
            $datos = $proyecto->proyectoLinea69;
            $rolesSennova = collect(json_decode(Storage::get('json/roles-sennova-tp.json'), true));
        } else if (!empty($proyecto->proyectoLinea65)) {
            $datos = $proyecto->proyectoLinea65;
            $rolesSennova = collect(json_decode(Storage::get('json/roles-sennova-idi.json'), true));
        } else if (!empty($proyecto->proyectoLinea68)) {
            $datos = $proyecto->proyectoLinea68;
            $tipoProyectoSt = TipoProyectoSt::selectRaw("tipos_proyecto_st.id as value, CASE tipos_proyecto_st.tipo_proyecto
                        WHEN '1' THEN   concat(centros_formacion.nombre, chr(10), '∙ Tipo de proyecto: A', chr(10), '∙ Línea técnica: ', lineas_tecnicas.nombre)
                        WHEN '2' THEN   concat(centros_formacion.nombre, chr(10), '∙ Tipo de proyecto: B', chr(10), '∙ Línea técnica: ', lineas_tecnicas.nombre)
                    END as label")->join('centros_formacion', 'tipos_proyecto_st.centro_formacion_id', 'centros_formacion.id')->join('lineas_tecnicas', 'tipos_proyecto_st.linea_tecnica_id', 'lineas_tecnicas.id')->get();
            $rolesSennova = collect(json_decode(Storage::get('json/roles-sennova-st.json'), true));
        }

        $proyecto->load('efectosDirectos.resultado');

        $pdf = PDF::loadView('Convocatorias.Proyectos.ResumenPdf', [
            'convocatoria'              => $convocatoria,
            'proyecto'                  => $proyecto,
            'datos'                     => $datos,
            'tipoProyectoSt'            => $tipoProyectoSt,
            'proyectoAnexo'             => $proyecto->proyectoAnexo()->select('proyecto_anexo.id', 'proyecto_anexo.anexo_id', 'proyecto_anexo.archivo', 'anexos.nombre')->join('anexos', 'proyecto_anexo.anexo_id', 'anexos.id')->get(),
            'rolesSennova'              => $rolesSennova,
            'tiposImpacto'              => collect(json_decode(Storage::get('json/tipos-impacto.json'), true)),
            'estadosInventarioEquipos'  => collect(json_decode(Storage::get('json/estados-inventario-equipos.json'), true)),
            'tiposLicencia'             => collect(json_decode(Storage::get('json/tipos-licencia-software.json'), true)),
            'opcionesServiciosEdicion'  => collect(json_decode(Storage::get('json/opciones-servicios-edicion.json'), true)),
            'tiposSoftware'             => collect(json_decode(Storage::get('json/tipos-software.json'), true))
        ]);

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
        $sharepoint_path             = "$modulo/$centroFormacionSharePoint/" . $proyecto->lineaProgramatica->codigo . "/$proyecto->codigo";

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
