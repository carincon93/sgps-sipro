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
    protected static $apiUrl = 'https://sena4.sharepoint.com/sites/gruposennova';
    protected static $rootFolder = 'SGPSSIPRO/';

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
                    'client_id'     => '3af81ccc-ebb4-4b5a-9650-dd37d716a8e3@cbc2c381-2f2e-4d93-91d1-506c9316ace7',
                    'client_secret' => 'Qft6c8Lb4wGKhmSZs2CoWvbdUSHMvRNvhYD3fAANXqs=',
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

    public static function checkFolderAndCreate($sharePointPath)
    {
        $carpetas = explode('/', $sharePointPath);
        $carpetaFormateada = '';
        try {
            foreach ($carpetas as $carpeta) {
                $carpetaFormateada .= $carpeta . '/';

                $status = static::checkFolder($carpetaFormateada);

                if ($status == 404) {
                    $folder = static::createFolder($carpetaFormateada);
                    Log::debug($folder);
                }
                Log::debug('Se han creado todas las carpetas');
            }
            return true;
        } catch (\Throwable  $e) {
            Log::debug($e->getMessage());

            if ($e) {
                abort($e->getStatusCode());
            }
        }
    }

    public static function createFolder($nombreCarpeta)
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
                "ServerRelativeUrl": "' . self::$rootFolder . $nombreCarpeta . '"
            }';

            $request = new Request('POST', self::$apiUrl . '/_api/web/folders', $headers, $body);
            $response = $client->sendAsync($request)->wait();
            $response = json_decode($response->getBody()->getContents(), true);

            return $response['d']['ServerRelativeUrl'];
        } catch (ClientException $e) {
            $response = $e->getResponse();
            Log::debug($e->getMessage());

            abort($response->getStatusCode());
        }
    }

    public static function getFolders($sharePointPath)
    {
        $carpetasFormateadas = '';
        $modulo = '';
        foreach (explode('/', $sharePointPath) as $key => $value) {
            if ($key == 0) {
                $modulo = str_replace('+', '%20', urlencode($value));
            }
            $carpetasFormateadas .= str_replace('+', '%20', urlencode($value)) . '/';
        }

        return array('carpetasFormateadas' => $carpetasFormateadas, 'modulo' => $modulo);
    }

    public static function uploadFile($sharePointPath, $uploadFile, $nombreArchivo)
    {
        $carpetasFormateadas = self::getFolders($sharePointPath)['carpetasFormateadas'];

        $urlFormat = str_replace(' ', '%20', self::$rootFolder) . $carpetasFormateadas;

        $curl = curl_init();

        try {
            $fileHandler = fopen($uploadFile, 'r');
            $fileData = fread($fileHandler, filesize($uploadFile));

            $url = self::$apiUrl . '/_api/web/GetFolderByServerRelativeUrl(\'' . $urlFormat . '\')/Files/add(url=\'' . $nombreArchivo . '\',overwrite=true)';

            curl_setopt_array($curl, array(
                CURLOPT_URL => $url,
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_ENCODING => '',
                CURLOPT_MAXREDIRS => 10,
                CURLOPT_TIMEOUT => 0,
                CURLOPT_FOLLOWLOCATION => true,
                CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
                CURLOPT_CUSTOMREQUEST => 'POST',
                CURLOPT_POSTFIELDS => $fileData,
                CURLOPT_INFILE => $fileHandler,
                CURLOPT_INFILESIZE => filesize($uploadFile),
                CURLOPT_HTTPHEADER => array(
                    'Authorization: Bearer ' . static::generateToken(),
                    'Content-Type: ' . $uploadFile->getMimeType(),
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

            $request = new Request('GET', self::$apiUrl . "/_api/web/GetFileByServerRelativeUrl('" . $file . "')/\$value", $headers);
            $response = $client->sendAsync($request)->wait();
            return $response->getStatusCode();
        } catch (ClientException $e) {
            $response = $e->getResponse();
            Log::debug($e->getMessage());

            return $response->getStatusCode();
        }
    }

    public static function checkFolder($nombreCarpeta)
    {
        $client = new Client();

        try {
            $headers = [
                'Authorization' => 'Bearer ' . static::generateToken(),
                'Accept'        => 'application/json;odata=verbose',
                'Content-Type'  => 'application/json;odata=verbose'
            ];

            $request = new Request('GET', self::$apiUrl . "/_api/web/GetFolderByServerRelativeUrl('" . self::$rootFolder .  $nombreCarpeta . "')", $headers);
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

                $request = new Request('DELETE', self::$apiUrl . "/_api/web/GetFileByServerRelativeUrl('" . $file . "')", $headers);
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

    public static function downloadFile($sharePointPath)
    {
        $client = new Client();

        $carpetasFormateadas = '';
        $pathExplode = explode('/', $sharePointPath);
        foreach ($pathExplode as $key => $value) {
            if ($key > 2 && $key < count($pathExplode) - 1) {
                $carpetasFormateadas .= str_replace('+', '%20', urlencode($value)) . '/';
            }
        }

        try {
            $headers = [
                'Authorization' => 'Bearer ' . static::generateToken(),
            ];
            $request = new Request('GET', self::$apiUrl . "/_api/web/GetFolderByServerRelativeUrl('" . $carpetasFormateadas . "')/Files('" . end($pathExplode) . "')/\$value", $headers);
            $response = $client->sendAsync($request)->wait();

            $contentType = $response->getHeader('Content-Type')[0];

            return [
                'content'                   => $response->getBody(),
                'content-type'              => $contentType,
                'content-disposition'       => 'inline; filename="' . end($pathExplode) . '"',
                'content-transfer-encoding' => 'binary',
                'accept-ranges'             => 'bytes',
                'filename'                  => end($pathExplode)
            ];
        } catch (ClientException $e) {
            // $response = $e->getResponse();
            // Log::debug($e->getMessage());

            // abort($response->getStatusCode());
        }
    }

    public static function downloadServerFile($model, $archivo)
    {
        $ruta = $model->{$archivo};

        return response()->download(storage_path("app/$ruta"));
    }


    public static function saveFilesSharepoint($tmpFile, $modelo, $sharePointPath, $campoBd)
    {
        $status = self::checkFolderAndCreate($sharePointPath);
        $success = null;

        if ($status) {
            $nombreArchivo = self::prepareFileName($campoBd, $tmpFile);

            if ($modelo) {
                self::deleteFile($modelo->{$campoBd});
            }

            $sharePointPath = self::uploadFile($sharePointPath, $tmpFile, $nombreArchivo);

            try {
                if ($modelo) {
                    $modelo->update([$campoBd => $sharePointPath]);
                    $success = true;
                }
            } catch (QueryException $e) {
                Log::debug($e->getMessage());
                $success = false;
            }
        }

        return collect(['success' => $success, 'sharePointPath' => $sharePointPath]);
    }

    public static function prepareFileName($nombreArchivo, $uploadFile)
    {
        $nuevoNombreArchivo = str_replace(' ', '', substr($nombreArchivo, 0, 30));
        $nuevoNombreArchivo = preg_replace('/[-`~!@#_$%\^&*()+={}[\]\\\\|;:\'",.><?\/]/', '', $nuevoNombreArchivo);

        $random    = Str::random(10);

        return str_replace(array("\r", "\n"), '', str_replace(array("\r", "\n"), '', "{$nuevoNombreArchivo}cod{$random}." . $uploadFile->extension()));
    }
}
