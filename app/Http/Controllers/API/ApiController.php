<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use App\Models\CentroFormacion;
use App\Models\Proyecto;
use App\Models\User;


use App\Models\ProyectoFormulario1Linea65;
use App\Models\ProyectoFormulario3Linea61;
use App\Models\ProyectoFormulario4Linea70;
use App\Models\ProyectoFormulario5Linea69;
use App\Models\ProyectoFormulario6Linea82;
use App\Models\ProyectoFormulario7Linea23;
use App\Models\ProyectoFormulario8Linea66;
use App\Models\ProyectoFormulario9Linea23;
use App\Models\ProyectoFormulario10Linea69;
use App\Models\ProyectoFormulario11Linea83;
use App\Models\ProyectoFormulario12Linea68;
use App\Models\ProyectoFormulario13Linea65;
use App\Models\ProyectoFormulario15Linea65;
use App\Models\ProyectoFormulario16Linea65;
use App\Models\ProyectoFormulario17Linea69;
use App\Models\Participante;
use App\Models\EntidadAliada;



class ApiController extends Controller
{
    //CONSULTA DE LOS PROYECTOS

    //Proyecto Formulario 1 Linea 65
    public function ProyectoFormulario1Linea65(Request $request){

        if($request->has('id')){
            $IdProyecto = $request->input('id');
            $proyectos = ProyectoFormulario1Linea65::where('id', $IdProyecto)->get();
            $participante = Participante::where('proyecto_id', $IdProyecto)
            ->where('es_formulador', true)            
            ->get();
            $nombre_participante = User::where('id', $participante->first()->user_id)->value('nombre');
            $entidades_aliadas = EntidadAliada::where('proyecto_id', $IdProyecto)->get();
            $imagen_proyecto = Proyecto::where('id', $IdProyecto)->pluck('imagen');
            $ods_proyecto = Proyecto::where('id', $IdProyecto)->pluck('ods');
            $response = [
                'proyectos' => $proyectos,
                'participante' => $participante,
                'nombre_participante' => $nombre_participante,
                'entidades_aliadas' => $entidades_aliadas,
                'imagen_proyecto' => $imagen_proyecto,
                'ods_proyecto' => $ods_proyecto,
            ];
            return response()->json($response);
        } else {
//             $proyectos = ProyectoFormulario1Linea65::all();
            // return response()->json($proyectos);
        }
    }
    //Proyecto Formulario 3 Linea 61
    public function ProyectoFormulario3Linea61(Request $request){

        if($request->has('id')){
            $IdProyecto = $request->input('id');
            $proyectos = ProyectoFormulario3Linea61::where('id', $IdProyecto)->get();
            $participante = Participante::where('proyecto_id', $IdProyecto)
            ->where('es_formulador', true)            
            ->get();
            $nombre_participante = User::where('id', $participante->first()->user_id)->value('nombre');
            $entidades_aliadas = EntidadAliada::where('proyecto_id', $IdProyecto)->get();
            $response = [
                'proyectos' => $proyectos,
                'participante' => $participante,
                'nombre_participante' => $nombre_participante,
                'entidades_aliadas' => $entidades_aliadas,
            ];
            return response()->json($response);
        } else {
            // $proyectos = ProyectoFormulario3Linea61::all();
            // return response()->json($proyectos);
        }
    }
    //Proyecto Formulario 4 Linea 70
    public function ProyectoFormulario4Linea70(Request $request){

        if($request->has('id')){
            $IdProyecto = $request->input('id');
            $proyectos = ProyectoFormulario4Linea70::where('id', $IdProyecto)->get();
            $participante = Participante::where('proyecto_id', $IdProyecto)
            ->where('es_formulador', true)            
            ->get();
            $nombre_participante = User::where('id', $participante->first()->user_id)->value('nombre');
            $entidades_aliadas = EntidadAliada::where('proyecto_id', $IdProyecto)->get();
            $response = [
                'proyectos' => $proyectos,
                'participante' => $participante,
                'nombre_participante' => $nombre_participante,
                'entidades_aliadas' => $entidades_aliadas,
            ];
            return response()->json($response);
        } else {
            // $proyectos = ProyectoFormulario4Linea70::all();
            // return response()->json($proyectos);
        }
    }
    //Proyecto Formulario 5 Linea 69
    public function ProyectoFormulario5Linea69(Request $request){

        if($request->has('id')){
            $IdProyecto = $request->input('id');
            $proyectos = ProyectoFormulario5Linea69::where('id', $IdProyecto)->get();
            $participante = Participante::where('proyecto_id', $IdProyecto)
            ->where('es_formulador', true)            
            ->get();
            $nombre_participante = User::where('id', $participante->first()->user_id)->value('nombre');
            $entidades_aliadas = EntidadAliada::where('proyecto_id', $IdProyecto)->get();
            $response = [
                'proyectos' => $proyectos,
                'participante' => $participante,
                'nombre_participante' => $nombre_participante,
                'entidades_aliadas' => $entidades_aliadas,
            ];
            return response()->json($response);
        } else {
            // $proyectos = ProyectoFormulario5Linea69::all();
            // return response()->json($proyectos);
        }
    }
    //Proyecto Formulario 6 Linea 82
    public function ProyectoFormulario6Linea82(Request $request){

        if($request->has('id')){
            $IdProyecto = $request->input('id');
            $proyectos = ProyectoFormulario6Linea82::where('id', $IdProyecto)->get();
            $participante = Participante::where('proyecto_id', $IdProyecto)
            ->where('es_formulador', true)            
            ->get();
            $nombre_participante = User::where('id', $participante->first()->user_id)->value('nombre');
            $entidades_aliadas = EntidadAliada::where('proyecto_id', $IdProyecto)->get();
            $response = [
                'proyectos' => $proyectos,
                'participante' => $participante,
                'nombre_participante' => $nombre_participante,
                'entidades_aliadas' => $entidades_aliadas,
            ];
            return response()->json($response);
        } else {
            // $proyectos = ProyectoFormulario6Linea82::all();
            // return response()->json($proyectos);
        }
    }
    //Proyecto Formulario 7 Linea 23
    public function ProyectoFormulario7Linea23(Request $request){

        if($request->has('id')){
            $IdProyecto = $request->input('id');
            $proyectos = ProyectoFormulario7Linea23::where('id', $IdProyecto)->get();
            $participante = Participante::where('proyecto_id', $IdProyecto)
            ->where('es_formulador', true)            
            ->get();
            $nombre_participante = User::where('id', $participante->first()->user_id)->value('nombre');
            $entidades_aliadas = EntidadAliada::where('proyecto_id', $IdProyecto)->get();
            $response = [
                'proyectos' => $proyectos,
                'participante' => $participante,
                'nombre_participante' => $nombre_participante,
                'entidades_aliadas' => $entidades_aliadas,
            ];
            return response()->json($response);
        } else {
            // $proyectos = ProyectoFormulario7Linea23::all();
            // return response()->json($proyectos);
        }
    }
    //Proyecto Formulario 8 Linea 66
    public function ProyectoFormulario8Linea66(Request $request){

        if($request->has('id')){
            $IdProyecto = $request->input('id');
            $proyectos = ProyectoFormulario8Linea66::where('id', $IdProyecto)->get();
            $participante = Participante::where('proyecto_id', $IdProyecto)
            ->where('es_formulador', true)            
            ->get();
            $nombre_participante = User::where('id', $participante->first()->user_id)->value('nombre');
            $entidades_aliadas = EntidadAliada::where('proyecto_id', $IdProyecto)->get();
            $response = [
                'proyectos' => $proyectos,
                'participante' => $participante,
                'nombre_participante' => $nombre_participante,
                'entidades_aliadas' => $entidades_aliadas,
            ];
            return response()->json($response);
        } else {
            // $proyectos = ProyectoFormulario8Linea66::all();
            // return response()->json($proyectos);
        }
    }
    //Proyecto Formulario 9 Linea 23
    public function ProyectoFormulario9Linea23(Request $request){

        if($request->has('id')){
            $IdProyecto = $request->input('id');
            $proyectos = ProyectoFormulario9Linea23::where('id', $IdProyecto)->get();
                        $participante = Participante::where('proyecto_id', $IdProyecto)
            ->where('es_formulador', true)            
            ->get();
            $nombre_participante = User::where('id', $participante->first()->user_id)->value('nombre');
            $entidades_aliadas = EntidadAliada::where('proyecto_id', $IdProyecto)->get();
            $response = [
                'proyectos' => $proyectos,
                'participante' => $participante,
                'nombre_participante' => $nombre_participante,
                'entidades_aliadas' => $entidades_aliadas,
            ];
            return response()->json($response);
        } else {
            // $proyectos = ProyectoFormulario9Linea23::all();
            // return response()->json($proyectos);
        }
    }
    //Proyecto Formulario 10 Linea 69
    public function ProyectoFormulario10Linea69(Request $request){

        if($request->has('id')){
            $IdProyecto = $request->input('id');
            $proyectos = ProyectoFormulario10Linea69::where('id', $IdProyecto)->get();
            $participante = Participante::where('proyecto_id', $IdProyecto)
            ->where('es_formulador', true)            
            ->get();
            $nombre_participante = User::where('id', $participante->first()->user_id)->value('nombre');
            $entidades_aliadas = EntidadAliada::where('proyecto_id', $IdProyecto)->get();
            $response = [
                'proyectos' => $proyectos,
                'participante' => $participante,
                'nombre_participante' => $nombre_participante,
                'entidades_aliadas' => $entidades_aliadas,
            ];
            return response()->json($response);
        } else {
            // $proyectos = ProyectoFormulario10Linea69::all();
            // return response()->json($proyectos);
        }
    }
    //Proyecto Formulario 11 Linea 83
    public function ProyectoFormulario11Linea83(Request $request){

        if($request->has('id')){
            $IdProyecto = $request->input('id');
            $proyectos = ProyectoFormulario11Linea83::where('id', $IdProyecto)->get();
                        $participante = Participante::where('proyecto_id', $IdProyecto)
            ->where('es_formulador', true)            
            ->get();
            $nombre_participante = User::where('id', $participante->first()->user_id)->value('nombre');
            $entidades_aliadas = EntidadAliada::where('proyecto_id', $IdProyecto)->get();
            $response = [
                'proyectos' => $proyectos,
                'participante' => $participante,
                'nombre_participante' => $nombre_participante,
                'entidades_aliadas' => $entidades_aliadas,
            ];
            return response()->json($response);
        } else {
            // $proyectos = ProyectoFormulario11Linea83::all();
            // return response()->json($proyectos);
        }
    }
    //Proyecto Formulario 12 Linea 68
    public function ProyectoFormulario12Linea68(Request $request){

        if($request->has('id')){
            $IdProyecto = $request->input('id');
            $proyectos = ProyectoFormulario12Linea68::where('id', $IdProyecto)->get();
            $participante = Participante::where('proyecto_id', $IdProyecto)
            ->where('es_formulador', true)            
            ->get();
            $nombre_participante = User::where('id', $participante->first()->user_id)->value('nombre');
            $entidades_aliadas = EntidadAliada::where('proyecto_id', $IdProyecto)->get();
            $response = [
                'proyectos' => $proyectos,
                'participante' => $participante,
                'nombre_participante' => $nombre_participante,
                'entidades_aliadas' => $entidades_aliadas,
            ];
            return response()->json($response);
        } else {
            // $proyectos = ProyectoFormulario12Linea68::all();
            // return response()->json($proyectos);
        }
    }
    //Proyecto Formulario 13 Linea 65
    public function ProyectoFormulario13Linea65(Request $request){

        if($request->has('id')){
            $IdProyecto = $request->input('id');
            $proyectos = ProyectoFormulario13Linea65::where('id', $IdProyecto)->get();
            $participante = Participante::where('proyecto_id', $IdProyecto)
            ->where('es_formulador', true)            
            ->get();
            $nombre_participante = User::where('id', $participante->first()->user_id)->value('nombre');
            $entidades_aliadas = EntidadAliada::where('proyecto_id', $IdProyecto)->get();
            $response = [
                'proyectos' => $proyectos,
                'participante' => $participante,
                'nombre_participante' => $nombre_participante,
                'entidades_aliadas' => $entidades_aliadas,
            ];
            return response()->json($response);
        } else {
            // $proyectos = ProyectoFormulario13Linea65::all();
            // return response()->json($proyectos);
        }
    }
    //Proyecto Formulario 15 Linea 65
    public function ProyectoFormulario15Linea65(Request $request){

        if($request->has('id')){
            $IdProyecto = $request->input('id');
            $proyectos = ProyectoFormulario15Linea65::where('id', $IdProyecto)->get();
            $participante = Participante::where('proyecto_id', $IdProyecto)
            ->where('es_formulador', true)            
            ->get();
            $nombre_participante = User::where('id', $participante->first()->user_id)->value('nombre');
            $entidades_aliadas = EntidadAliada::where('proyecto_id', $IdProyecto)->get();
            $response = [
                'proyectos' => $proyectos,
                'participante' => $participante,
                'nombre_participante' => $nombre_participante,
                'entidades_aliadas' => $entidades_aliadas,
            ];
            return response()->json($response);
        } else {
            // $proyectos = ProyectoFormulario15Linea65::all();
            // return response()->json($proyectos);
        }
    }
    //Proyecto Formulario 16 Linea 65
    public function ProyectoFormulario16Linea65(Request $request){

        if($request->has('id')){
            $IdProyecto = $request->input('id');
            $proyectos = ProyectoFormulario16Linea65::where('id', $IdProyecto)->get();
            $participante = Participante::where('proyecto_id', $IdProyecto)
            ->where('es_formulador', true)            
            ->get();
            $nombre_participante = User::where('id', $participante->first()->user_id)->value('nombre');
            $entidades_aliadas = EntidadAliada::where('proyecto_id', $IdProyecto)->get();
            $response = [
                'proyectos' => $proyectos,
                'participante' => $participante,
                'nombre_participante' => $nombre_participante,
                'entidades_aliadas' => $entidades_aliadas,
            ];
            return response()->json($response);
        } else {
            // $proyectos = ProyectoFormulario16Linea65::all();
            // return response()->json($proyectos);
        }
    }
    //Proyecto Formulario 17 Linea 69
    public function ProyectoFormulario17Linea69(Request $request){

        if($request->has('id')){
            $IdProyecto = $request->input('id');
            $proyectos = ProyectoFormulario17Linea69::where('id', $IdProyecto)->get();
            $participante = Participante::where('proyecto_id', $IdProyecto)
            ->where('es_formulador', true)            
            ->get();
            $nombre_participante = User::where('id', $participante->first()->user_id)->value('nombre');
            $entidades_aliadas = EntidadAliada::where('proyecto_id', $IdProyecto)->get();
            $response = [
                'proyectos' => $proyectos,
                'participante' => $participante,
                'nombre_participante' => $nombre_participante,
                'entidades_aliadas' => $entidades_aliadas,
            ];
            return response()->json($response);
        } else {
            // $proyectos = ProyectoFormulario17Linea69::all();
            // return response()->json($proyectos);
        }
    }

///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////

    
    public function CreateToken(Request $request)
    {
        $token = $request->user()->createToken($request->token_name);

        return ['token' => $token->plainTextToken, 'type' => 'Bearer'];
    }

    public function isUserSennova(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => [
                Rule::requiredIf(function () use ($request) {
                    return empty($request->document_number);
                }),
                'email',
                'exists:users,email'
            ],
            'document_number' => [
                Rule::requiredIf(function () use ($request) {
                    return empty($request->email);
                }),
                'integer',
                'exists:users,numero_documento'
            ],

        ]);

        if ($validator->fails()) {
            return ['errors' => $validator->errors()];
        }
 
        $user = User::where(function ($query) use ($request) {
            if (!empty($request->email)) {
                $query->where('email', $request->email);
            }
            if (!empty($request->document_number)) {
                $query->where('numero_documento', $request->document_number);
            }
        })->role('dinamizador sennova')->first();

        if (!empty($user)) {
            return response()->json([
                'data' => [
                    "type" => "users",
                    "id" => $user->id,
                    "attributes" => [
                        'name' => $user->nombre,
                        'document_type' => $user->tipo_documento_text,
                        'document_number' => $user->numero_documento,
                        'email' => $user->email,
                        'cellphone' => $user->numero_celular,
                        "links" => [
                            "proyects_api" => route('v1.projects_by_user', $user->id)
                        ]
                    ],
                    "training_center" => [
                        "type" => "training_centers",
                        "id" => $user->centroFormacion->id,
                        "attributes" => [
                            "center_code" => $user->centroFormacion->codigo,
                            "name" => $user->centroFormacion->nombre,
                            "regional" => $user->centroFormacion->regional->nombre,
                        ],
                        "links" => [
                            "proyects_api" => route('v1.projects_by_center', $user->centroFormacion->id)
                        ]
                    ],
                ]
            ]);
        }

        return response()->json(['errors' => ['User not found']], 404);
    }

    public function projectsByUser($id)
    {
        $user = User::findOrFail($id);
        $proyectos = $user->proyectos()->whereRaw(
            DB::raw("(estado->>'estado'='No priorizado anexo 1C. Comuníquese con el Dinamizador SENNOVA.'
                            or estado->>'estado'='Pre-aprobado'
                            or estado->>'estado'='Pre-aprobado con observaciones'
                            or estado->>'estado'='No priorizado anexo 1C. Comuníquese con el Dinamizador SENNOVA.'
                            or estado->>'estado'='Proyecto con asignación de apoyo técnico para la formulación')")
        )->get();
        $projects = [];
        foreach ($proyectos as $proyecto) {
            $tipo = '';
            if (!empty($proyecto->proyectoFormulario8Linea66)) {
                $datos =  $proyecto->proyectoFormulario8Linea66;
                $tipo = 'I+D+I';
            } else if (!empty($proyecto->proyectoLinea70)) {
                $datos =  $proyecto->proyectoLinea70;
                $tipo = 'Tecnoacademia';
            } else if (!empty($proyecto->proyectoFormulario5Linea69)) {
                $datos =  $proyecto->proyectoFormulario5Linea69;
                $tipo = 'Tecnoparque';
            } else if (!empty($proyecto->proyectoFormulario1Linea65)) {
                $datos =  $proyecto->proyectoFormulario1Linea65;
                $tipo = 'Apropiación de la cultura de la innovación';
            } else if (!empty($proyecto->proyectoFormulario12Linea68)) {
                $datos =  $proyecto->proyectoFormulario12Linea68;
                $tipo = 'Servicios tecnológicos';
            }
            $data = [
                "type" => "projects",
                "id" => $proyecto->id,
                "attributes" => [
                    "announcement" => $proyecto->convocatoria->descripcion,
                    "type" => $tipo,
                    'code' => $proyecto->codigo,
                    'title' => $datos->titulo,
                    'general_objective' => $datos->objetivo_general,
                    'start_date' => $proyecto->fecha_inicio,
                    'end_date' => $proyecto->fecha_finalizacion,
                    'evaluation_state' => $proyecto->estado_cord_sennova ? json_decode($proyecto->estado_cord_sennova)->estado : ($proyecto->proyectoFormulario8Linea66()->exists() ? $proyecto->estado_evaluacion_idi['estado'] : ($proyecto->proyectoFormulario1Linea65()->exists() ? $proyecto->estado_evaluacion_proyecto_formulario_1_linea_65['estado'] : ($proyecto->proyectoLinea70()->exists() ? $proyecto->estado_evaluacion_ta['estado'] : ($proyecto->proyectoFormulario5Linea69()->exists() ? $proyecto->estado_evaluacion_tp['estado'] : ($proyecto->proyectoFormulario12Linea68()->exists() ? $proyecto->estado_evaluacion_proyecto_formulario_12_linea_68['estado'] : 'Sin información registrada'))))),
                    "links" => [
                        "proyect_api" => route('v1.project', $proyecto->id),
                        "public_url" => route('convocatorias.proyectos.edit', ['convocatoria' => $proyecto->convocatoria, 'proyecto' => $proyecto]),
                    ]
                ],
                "training_center" => [
                    "type" => "training_centers",
                    "id" => $proyecto->centroFormacion->id,
                    "attributes" => [
                        "center_code" => $proyecto->centroFormacion->codigo,
                        "name" => $proyecto->centroFormacion->nombre,
                        "regional" => $proyecto->centroFormacion->regional->nombre,
                    ],
                    "links" => [
                        "proyects_api" => route('v1.projects_by_center', $proyecto->centroFormacion->id)
                    ]
                ],
            ];
            $formuler = [];
            $userFormuler = $proyecto->participantes()->wherePivot('es_formulador', true)->first();
            if (!empty($userFormuler)) {
                $formuler =
                    [
                        "formuler" => [
                            "type" => "users",
                            "id" => $userFormuler->id,
                            "attributes" => [
                                'name' => $userFormuler->nombre,
                                'document_type' => $userFormuler->tipo_documento_text,
                                'document_number' => $userFormuler->numero_documento,
                                'email' => $userFormuler->email,
                                'cellphone' => $userFormuler->numero_celular
                            ]
                        ]
                    ];
            }
            array_push($projects, array_merge($data, $formuler));
        }

        return response()->json(['data' => $projects]);
    }

    public function projectsByCenter($id)
    {
        $center = CentroFormacion::findOrFail($id);
        $proyectos = $center->proyectos()->whereRaw(
            DB::raw("(estado->>'estado'='No priorizado anexo 1C. Comuníquese con el Dinamizador SENNOVA.'
                            or estado->>'estado'='Pre-aprobado'
                            or estado->>'estado'='Pre-aprobado con observaciones'
                            or estado->>'estado'='No priorizado anexo 1C. Comuníquese con el Dinamizador SENNOVA.'
                            or estado->>'estado'='Proyecto con asignación de apoyo técnico para la formulación')")
        )->get();
        $projects = [];
        foreach ($proyectos as $proyecto) {
            $tipo = '';
            if (!empty($proyecto->proyectoFormulario8Linea66)) {
                $datos =  $proyecto->proyectoFormulario8Linea66;
                $tipo = 'I+D+I';
            } else if (!empty($proyecto->proyectoLinea70)) {
                $datos =  $proyecto->proyectoLinea70;
                $tipo = 'Tecnoacademia';
            } else if (!empty($proyecto->proyectoFormulario5Linea69)) {
                $datos =  $proyecto->proyectoFormulario5Linea69;
                $tipo = 'Tecnoparque';
            } else if (!empty($proyecto->proyectoFormulario1Linea65)) {
                $datos =  $proyecto->proyectoFormulario1Linea65;
                $tipo = 'Apropiación de la cultura de la innovación';
            } else if (!empty($proyecto->proyectoFormulario12Linea68)) {
                $datos =  $proyecto->proyectoFormulario12Linea68;
                $tipo = 'Servicios tecnológicos';
            }
            $data = [
                "type" => "projects",
                "id" => $proyecto->id,
                "attributes" => [
                    "announcement" => $proyecto->convocatoria->descripcion,
                    "type" => $tipo,
                    'code' => $proyecto->codigo,
                    'title' => $datos->titulo,
                    'general_objective' => $datos->objetivo_general,
                    'evaluation_state' => $proyecto->estado_cord_sennova ? json_decode($proyecto->estado_cord_sennova)->estado : ($proyecto->proyectoFormulario8Linea66()->exists() ? $proyecto->estado_evaluacion_idi['estado'] : ($proyecto->proyectoFormulario1Linea65()->exists() ? $proyecto->estado_evaluacion_proyecto_formulario_1_linea_65['estado'] : ($proyecto->proyectoLinea70()->exists() ? $proyecto->estado_evaluacion_ta['estado'] : ($proyecto->proyectoFormulario5Linea69()->exists() ? $proyecto->estado_evaluacion_tp['estado'] : ($proyecto->proyectoFormulario12Linea68()->exists() ? $proyecto->estado_evaluacion_proyecto_formulario_12_linea_68['estado'] : 'Sin información registrada'))))),
                    'start_date' => $proyecto->fecha_inicio,
                    'end_date' => $proyecto->fecha_finalizacion,
                    "links" => [
                        "proyect_api" => route('v1.project', $proyecto->id),
                        "public_url" => route('convocatorias.proyectos.edit', ['convocatoria' => $proyecto->convocatoria, 'proyecto' => $proyecto]),
                    ]
                ]
            ];
            $formuler = [];
            $userFormuler = $proyecto->participantes()->wherePivot('es_formulador', true)->first();
            if (!empty($userFormuler)) {
                $formuler =
                    [
                        "formuler" => [
                            "type" => "users",
                            "id" => $userFormuler->id,
                            "attributes" => [
                                'name' => $userFormuler->nombre,
                                'document_type' => $userFormuler->tipo_documento_text,
                                'document_number' => $userFormuler->numero_documento,
                                'email' => $userFormuler->email,
                                'cellphone' => $userFormuler->numero_celular
                            ]
                        ]
                    ];
            }
            array_push($projects, array_merge($data, $formuler));
        }

        $response = array_merge(['data' => $projects], [
            "training_center" => [
                "type" => "training_centers",
                "id" => $center->id,
                "attributes" => [
                    "center_code" => $center->codigo,
                    "name" => $center->nombre,
                    "regional" => $center->regional->nombre,
                ],
                "links" => [
                    "proyects_api" => route('v1.projects_by_center', $center->id)
                ]
            ]
        ]);

        return response()->json($response);
    }

    public function summaryProject($id)
    {
        $proyecto = Proyecto::findOrFail($id);

        $tipo = '';
        $datos = '';
        if (!empty($proyecto->proyectoFormulario8Linea66)) {
            $datos =  $proyecto->proyectoFormulario8Linea66;
            $tipo = 'I+D+I';
        } else if (!empty($proyecto->proyectoLinea70)) {
            $datos =  $proyecto->proyectoLinea70;
            $tipo = 'Tecnoacademia';
        } else if (!empty($proyecto->proyectoFormulario5Linea69)) {
            $datos =  $proyecto->proyectoFormulario5Linea69;
            $tipo = 'Tecnoparque';
        } else if (!empty($proyecto->proyectoFormulario1Linea65)) {
            $datos =  $proyecto->proyectoFormulario1Linea65;
            $tipo = 'Apropiación de la cultura de la innovación';
        } else if (!empty($proyecto->proyectoFormulario12Linea68)) {
            $datos =  $proyecto->proyectoFormulario12Linea68;
            $tipo = 'Servicios tecnológicos';
        }

        $response = [
            "type" => "projects",
            "id" => $proyecto->id,
            "attributes" => [
                'announcement' => $proyecto->convocatoria->descripcion,
                'code' => $proyecto->codigo,
                'type' => $tipo,
                'title' => $datos->titulo,
                'programmatic_line' => [
                    'code' => $proyecto->lineaProgramatica->codigo,
                    'name' => $proyecto->lineaProgramatica->nombre,
                ],
                'knowledge_network' => ($datos->redConocimiento) ? $datos->redConocimiento->nombre : 'N/A',
                'knowledge_area' => ($datos->disciplinaSubareaConocimiento) ? $datos->disciplinaSubareaConocimiento->subareaConocimiento->areaConocimiento->nombre : ($datos->areaConocimiento ? $datos->areaConocimiento->nombre : ($datos->disciplinasSubareaConocimiento ? $datos->disciplinasSubareaConocimiento->map(function ($disciplinaSubareaConocimiento) {
                    return ['nombre' => $disciplinaSubareaConocimiento->subareaConocimiento->areaConocimiento->nombre];
                })->implode('nombre', ', ') : 'N/A')),
                'knowledge_subarea' => ($datos->disciplinaSubareaConocimiento) ? $datos->disciplinaSubareaConocimiento->subareaConocimiento->nombre : ($datos->disciplinasSubareaConocimiento ? $datos->disciplinasSubareaConocimiento->map(function ($disciplinaSubareaConocimiento) {
                    return ['nombre' => $disciplinaSubareaConocimiento->subareaConocimiento->nombre];
                })->implode('nombre', ', ') : 'N/A'),
                'disciplines_subarea_knowledge' => ($datos->disciplinaSubareaConocimiento) ? $datos->disciplinaSubareaConocimiento->nombre : ($datos->disciplinasSubareaConocimiento ? $datos->disciplinasSubareaConocimiento->implode('nombre', ', ') : 'N/A'),
                'general_objective' => $datos->objetivo_general,
                'total_project_budget' => $proyecto->total_proyecto_presupuesto,
                'total_roles_sennova' => $proyecto->total_roles_sennova,
                'price_project' => $proyecto->precio_proyecto > 0 ? $proyecto->precio_proyecto : '0',
                'finalized' => ($proyecto->finalizado) ? 'SI' : 'NO',
                'to_evaluate' => ($proyecto->habilitado_para_evaluar) ? 'SI' : 'NO',
                'evaluation_state' => $proyecto->estado_cord_sennova ? json_decode($proyecto->estado_cord_sennova)->estado : ($proyecto->proyectoFormulario8Linea66()->exists() ? $proyecto->estado_evaluacion_idi['estado'] : ($proyecto->proyectoFormulario1Linea65()->exists() ? $proyecto->estado_evaluacion_proyecto_formulario_1_linea_65['estado'] : ($proyecto->proyectoLinea70()->exists() ? $proyecto->estado_evaluacion_ta['estado'] : ($proyecto->proyectoFormulario5Linea69()->exists() ? $proyecto->estado_evaluacion_tp['estado'] : ($proyecto->proyectoFormulario12Linea68()->exists() ? $proyecto->estado_evaluacion_proyecto_formulario_12_linea_68['estado'] : 'Sin información registrada'))))),
                'score' => $proyecto->proyectoFormulario8Linea66()->exists() ? $proyecto->estado_evaluacion_idi['puntaje'] : ($proyecto->proyectoFormulario1Linea65()->exists() ? $proyecto->estado_evaluacion_proyecto_formulario_1_linea_65['puntaje'] : ($proyecto->proyectoFormulario12Linea68()->exists() ? $proyecto->estado_evaluacion_proyecto_formulario_12_linea_68['puntaje'] : 'N/A')),
                'alert' => $proyecto->proyectoFormulario8Linea66()->exists() ? $proyecto->estado_evaluacion_idi['alerta'] : 'N/A'
            ],
            'participants' => $this->mapParticipantes($proyecto->participantes),
            "training_center" => [
                "type" => "training_centers",
                "id" => $proyecto->centroFormacion->id,
                "attributes" => [
                    "center_code" => $proyecto->centroFormacion->codigo,
                    "name" => $proyecto->centroFormacion->nombre,
                    "regional" => $proyecto->centroFormacion->regional->nombre,
                ],
                "links" => [
                    "proyects_api" => route('v1.projects_by_center', $proyecto->centroFormacion->id)
                ]
            ],
            "links" => [
                "proyect_api" => route('v1.project', $proyecto->id),
                "public_url" => route('convocatorias.proyectos.edit', ['convocatoria' => $proyecto->convocatoria, 'proyecto' => $proyecto]),
            ]
        ];

        return response()->json(['data' => $response]);
    }

    private function mapParticipantes($participantes)
    {
        $tipos_vinculacion = collect(json_decode(Storage::get('json/tipos-vinculacion.json'), true));
        $mapParticipantes = [];

        foreach ($participantes as $participante) {
            array_push($mapParticipantes, [
                "type" => "users",
                "id" => $participante->id,
                "attributes" => [
                    'name' => strtr(utf8_decode($participante->nombre), utf8_decode('àáâãäçèéêëìíîïñòóôõöùúûüýÿÀÁÂÃÄÇÈÉÊËÌÍÎÏÑÒÓÔÕÖÙÚÛÜÝ'), 'aaaaaceeeeiiiinooooouuuuyyAAAAACEEEEIIIINOOOOOUUUUY'),
                    'document_type' => $participante->tipo_documento_text,
                    'document_number' => $participante->numero_documento,
                    'contract' => $participante->tipo_vinculacion_text,
                    'months' => $participante->pivot->cantidad_meses,
                    'hours' => $participante->pivot->cantidad_horas,
                    'formuler' => $participante->pivot->es_formulador,
                ]
            ]);
        }
        return $mapParticipantes;
    }

   
}
