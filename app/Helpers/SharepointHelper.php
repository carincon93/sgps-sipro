<?php

namespace App\Helpers;

use Illuminate\Http\Request as HttpRequest;
use GuzzleHttp\Psr7\Request;
use GuzzleHttp\Client;
use GuzzleHttp\Exception\ClientException;
use Illuminate\Database\QueryException;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\UploadedFile;

class SharepointHelper
{
    protected static $api_url = 'https://sena4.sharepoint.com/sites/gruposennova';
    protected static $root_folder = 'SGPSSIPRO/';

    public static function generateToken()
    {
        $client = new Client();

        try {
            $headers = [
                'Accept'        => 'application/json',
                'Content-Type'  => 'application/x-www-form-urlencoded',
            ];
            $options = [
                'form_params' => [
                    'grant_type'    => 'client_credentials',
                    'client_id'     => '0dd21127-166d-44c3-a684-c92fc7d5709f@cbc2c381-2f2e-4d93-91d1-506c9316ace7',
                    'client_secret' => 'GuIR7qpFFi2eLnO/02AaV3AbduwCqaAk5f50owFd0vo=',
                    'resource'      => '00000003-0000-0ff1-ce00-000000000000/sena4.sharepoint.com@cbc2c381-2f2e-4d93-91d1-506c9316ace7'
                ]
            ];
            $request = new Request('POST', 'https://accounts.accesscontrol.windows.net/cbc2c381-2f2e-4d93-91d1-506c9316ace7/tokens/OAuth/2', $headers);
            $response = $client->sendAsync($request, $options)->wait();
            $response = json_decode($response->getBody()->getContents(), true);

            return $response['access_token'];
        } catch (ClientException $e) {
            $response = $e->getResponse();
            Log::debug($e->getMessage());

            abort($response->getStatusCode());
        }
    }

    public static function checkFolderAndCreate($sharepoint_path)
    {
        $carpetas = explode('/', $sharepoint_path);
        $carpeta_formateada = '';
        try {
            foreach ($carpetas as $carpeta) {
                $carpeta_formateada .= $carpeta . '/';

                $status = static::checkFolder($carpeta_formateada);

                if ($status == 404) {
                    $folder = static::createFolder($carpeta_formateada);
                    Log::debug($folder);
                }
                Log::debug('Se han creado todas las carpetas');
            }
            return true;
        } catch (\Throwable  $e) {
            Log::debug($e);
        }
    }

    public static function createFolder($nombre_carpeta)
    {
        $client = new Client();

        try {
            $headers = [
                'Authorization' => 'Bearer ' . static::generateToken(),
                'Accept'        => 'application/json;odata=verbose',
                'Content-Type'  => 'application/json;odata=verbose'
            ];
            $body = '{
                "__metadata": {
                    "type": "SP.Folder"
                },
                "ServerRelativeUrl": "' . self::$root_folder . $nombre_carpeta . '"
            }';

            $request = new Request('POST', self::$api_url . '/_api/web/folders', $headers, $body);
            $response = $client->sendAsync($request)->wait();
            $response = json_decode($response->getBody()->getContents(), true);

            return $response['d']['ServerRelativeUrl'];
        } catch (ClientException $e) {
            $response = $e->getResponse();
            Log::debug($e->getMessage());

            abort($response->getStatusCode());
        }
    }

    public static function getFolders($sharepoint_path)
    {
        $carpetas_formateadas = '';
        $modulo = '';
        foreach (explode('/', $sharepoint_path) as $key => $value) {
            if ($key == 0) {
                $modulo = str_replace('+', '%20', urlencode($value));
            }
            $carpetas_formateadas .= str_replace('+', '%20', urlencode($value)) . '/';
        }

        return array('carpetasFormateadas' => $carpetas_formateadas, 'modulo' => $modulo);
    }

    public static function uploadFile($sharepoint_path, $upload_file, $nombre_archivo)
    {
        $carpetas_formateadas = self::getFolders($sharepoint_path)['carpetasFormateadas'];

        $urlFormat = str_replace(' ', '%20', self::$root_folder) . $carpetas_formateadas;

        $curl = curl_init();

        try {
            $file_handler = fopen($upload_file, 'r');
            $file_data = fread($file_handler, filesize($upload_file));

            $url = self::$api_url . '/_api/web/GetFolderByServerRelativeUrl(\'' . $urlFormat . '\')/Files/add(url=\'' . $nombre_archivo . '\',overwrite=true)';

            curl_setopt_array($curl, array(
                CURLOPT_URL => $url,
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_ENCODING => '',
                CURLOPT_MAXREDIRS => 10,
                CURLOPT_TIMEOUT => 0,
                CURLOPT_FOLLOWLOCATION => true,
                CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
                CURLOPT_CUSTOMREQUEST => 'POST',
                CURLOPT_POSTFIELDS => $file_data,
                CURLOPT_INFILE => $file_handler,
                CURLOPT_INFILESIZE => filesize($upload_file),
                CURLOPT_HTTPHEADER => array(
                    'Authorization: Bearer ' . static::generateToken(),
                    'Content-Type: ' . $upload_file->getMimeType(),
                    'Accept: application/json;odata=verbose'
                ),
            ));

            $response = curl_exec($curl);

            curl_close($curl);

            $response = json_decode($response, true);

            return $response['d']['ServerRelativeUrl'];
        } catch (\Throwable  $e) {
            Log::debug($e);

            return $e;
        }
    }

    public static function checkFile($file)
    {
        $client = new Client();

        try {
            $headers = [
                'Authorization' => 'Bearer ' . static::generateToken(),
                'Accept'        => 'application/json;odata=verbose',
                'Content-Type'  => 'application/json;odata=verbose'
            ];

            $request = new Request('GET', self::$api_url . "/_api/web/GetFileByServerRelativeUrl('" . $file . "')/\$value", $headers);
            $response = $client->sendAsync($request)->wait();
            return $response->getStatusCode();
        } catch (ClientException $e) {
            $response = $e->getResponse();
            Log::debug($e->getMessage());

            return $response->getStatusCode();
        }
    }

    public static function checkFolder($nombre_carpeta)
    {
        $client = new Client();

        try {
            $headers = [
                'Authorization' => 'Bearer ' . static::generateToken(),
                'Accept'        => 'application/json;odata=verbose',
                'Content-Type'  => 'application/json;odata=verbose'
            ];

            $request = new Request('GET', self::$api_url . "/_api/web/GetFolderByServerRelativeUrl('" . self::$root_folder .  $nombre_carpeta . "')", $headers);
            $response = $client->sendAsync($request)->wait();
            return $response->getStatusCode();
        } catch (ClientException $e) {
            $response = $e->getResponse();
            Log::debug($e->getMessage());

            return $response->getStatusCode();
        }
    }

    public static function deleteFile($file)
    {
        $client = new Client();

        if ($file && static::checkFile($file) == 200) {
            try {
                $headers = [
                    'Authorization' => 'Bearer ' . static::generateToken(),
                    'Accept'        => 'application/json;odata=verbose',
                    'Content-Type'  => 'application/json;odata=verbose'
                ];

                $request = new Request('DELETE', self::$api_url . "/_api/web/GetFileByServerRelativeUrl('" . $file . "')", $headers);
                $response = $client->sendAsync($request)->wait();
                $response = json_decode($response->getBody()->getContents(), true);


                return $response;
            } catch (ClientException $e) {
                $response = $e->getResponse();
                Log::debug($e->getMessage());

                abort($response->getStatusCode());
            }
        }
    }

    public static function downloadFile($sharepoint_path)
    {
        $client = new Client();

        $carpetas_formateadas = '';
        $path_explode = explode('/', $sharepoint_path);
        foreach ($path_explode as $key => $value) {
            if ($key > 2 && $key < count($path_explode) - 1) {
                $carpetas_formateadas .= str_replace('+', '%20', urlencode($value)) . '/';
            }
        }

        try {
            $headers = [
                'Authorization' => 'Bearer ' . static::generateToken(),
            ];
            $request  = new Request('GET', self::$api_url . "/_api/web/GetFolderByServerRelativeUrl('" . $carpetas_formateadas . "')/Files('" . end($path_explode) . "')/\$value", $headers);
            $response = $client->sendAsync($request)->wait();

            $content_type = $response->getHeader('Content-Type')[0];
            $file_content = $response->getBody();

            return response($file_content)
                ->header('Content-Type', $content_type)
                ->header('Content-Disposition', 'attachment; filename="' . end($path_explode) . '"')
                ->header('Content-Transfer-Encoding', 'binary')
                ->header('Accept-Ranges', 'bytes')
                ->header('Filename', end($path_explode));
        } catch (ClientException $e) {
            // $response = $e->getResponse();
            Log::debug($e->getMessage());

            // abort($response->getStatusCode());
        }
    }

    public static function downloadServerFile($model, $archivo)
    {
        $ruta = $model->{$archivo};

        return response()->download(storage_path("app/$ruta"));
    }


    public static function saveFilesSharepoint($tmp_file, $modelo, $sharepoint_path, $campo_bd)
    {
        $status = self::checkFolderAndCreate($sharepoint_path);

        $success = null;

        if ($status) {
            $nombre_archivo = self::prepareFileName($campo_bd, $tmp_file);

            if ($modelo) {
                self::deleteFile($modelo->{$campo_bd});
            }

            $sharepoint_path = self::uploadFile($sharepoint_path, $tmp_file, $nombre_archivo);
            if (strpos($sharepoint_path, '.tmp') > 0) {
                return back()->with('error', 'Error: No se ha podido cargar el archivo');
            }

            try {
                if ($modelo) {
                    $modelo->update([$campo_bd => $sharepoint_path]);
                    $success = true;
                }
            } catch (QueryException $e) {
                Log::debug($e->getMessage());
                $success = false;
            }

            return back()->with('success', 'Se ha modificado la información y se ha cargado el archivo correctamente.');
        }
    }

    public static function prepareFileName($nombre_archivo, $upload_file)
    {
        $nuevo_nombre_archivo = str_replace(' ', '', substr($nombre_archivo, 0, 30));
        $nuevo_nombre_archivo = preg_replace('/[-`~!@#_$%\^&*()+={}[\]\\\\|;:\'",.><?\/]/', '', $nuevo_nombre_archivo);

        $random    = Str::random(10);

        return str_replace(array("\r", "\n"), '', str_replace(array("\r", "\n"), '', "{$nuevo_nombre_archivo}cod{$random}." . $upload_file->extension()));
    }
}
