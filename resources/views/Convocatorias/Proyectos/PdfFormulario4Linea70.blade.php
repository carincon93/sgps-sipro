<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>PDF {{ $proyecto->codigo }}</title>

    <style>
        body {
            font-family: 'Nunito', sans-serif;
        }

        .page-break {
            page-break-after: always;
        }

        h1 {
            font-size: 1.4rem;
            text-align: center;
        }

        p {
            text-align: justify;
            text-align-last: left;
            white-space: pre-wrap;
        }
    </style>

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@normal&display=swap" rel="stylesheet">
</head>
<body>
    <table width="100%" border="1" cellspacing="0" cellpadding="10" style="font-size: 12px;">
        <tr>
            <td rowspan="2" valign="middle" align="center" width="20%">
                <div>
                    <img src="http://sennova.senaedu.edu.co:8080/images/Sena_Colombia_logo.png" width="100px" alt="Logo SENA">
                </div>
            </td>
            <td valign="middle" align="center">
                <p style="white-space: pre-wrap">PDF Proyecto - SGPS-SIPRO <br><small>Código SGPS del proyecto: {{ $proyecto->codigo }}</small></p>
            </td>
        </tr>
        <tr>
            <td valign="middle" align="center">
                <p style="white-space: pre-wrap">{{ ucfirst($proyecto->centroFormacion->nombre) }} ({{ $proyecto->centroFormacion->codigo }}) - Regional {{ ucfirst($proyecto->centroFormacion->regional->nombre) }}</p>
            </td>
        </tr>
    </table>

    <h1 style="text-align: center; margin: 15rem 0 6rem 0;">{{ $datos->titulo }}</h1>

    <p style="text-align: right; margin: 18rem 0;">{{ $proyecto->participantes()->where('es_formulador', true)->first()  ? ucwords($proyecto->participantes()->where('es_formulador', true)->first()->nombre) : 'Sin autor/a principal asignado'}}</p>

    <table width="100%" border="1" cellspacing="0" cellpadding="3" style="font-size: 12px;">
        <tr>
            <td align="left">
                <p style="font-weight: bold;">Centro de formación</p>
            </td>
            <td align="left">
                {{ $proyecto->centroFormacion->nombre }}
            </td>
        </tr>

        <tr>
            <td align="left">
                <p style="font-weight: bold;">Fechas de ejecución del proyecto</p>
            </td>
            <td align="left">
                <p style="white-space: pre-wrap">{{ $proyecto->fecha_inicio .' - '. $proyecto->fecha_finalizacion }}</p>
            </td>
        </tr>

        <tr>
            <td align="left">
                <p style="font-weight: bold;">Código dependencia presupuestal (SIIF)</p>
            </td>
            <td align="left">
                <p style="white-space: pre-wrap">Linea programatica: {{ $proyecto->tipoFormularioConvocatoria->lineaProgramatica->codigo }} - {{ $proyecto->tipoFormularioConvocatoria->lineaProgramatica->nombre }}</p>
            </td>
        </tr>

        <tr>
            <td align="left">
                <p style="font-weight: bold;">Líneas temáticas a ejecutar en la vigencia del proyecto</p>
            </td>
            <td align="left">
                 @if ($proyecto->tecnoacademiaLineasTecnoacademia()->exists())
                    <ul>
                        @foreach ($proyecto->tecnoacademiaLineasTecnoacademia as $tecnoacademiaLineaTecnoacademia)
                            <li>{{ ucfirst($tecnoacademiaLineaTecnoacademia->lineaTecnoacademia->nombre) . '-' . ucfirst($tecnoacademiaLineaTecnoacademia->tecnoacademia->nombre) }}</li>
                        @endforeach
                    </ul>
                @endif
            </td>
        </tr>

        <tr>
            <td align="left">
                <p style="font-weight: bold;">La infraestructura donde opera la TecnoAcademia es</p>
            </td>
            <td align="left">
                <p style="white-space: pre-wrap">{{ $infraestructura_tecnoacademia->firstWhere('value', $datos->infraestructura_tecnoacademia) ? $infraestructura_tecnoacademia->firstWhere('value', $datos->infraestructura_tecnoacademia)['label'] : 'Sin información registrada' }}</p>
            </td>
        </tr>

    </table>

    <hr style="margin: 4rem 0">

    <div class="border page_break">
        <h4>Participantes</h4>
        <table width="100%" border="1" cellspacing="0" cellpadding="3" style="border-top: none; font-size: 10px;">
            <thead slot="thead">
                <tr>
                    <th>Nombre</th>
                    <th>Correo electrónico</th>
                    <th>Centro de formación</th>
                    <th>Regional</th>
                    <th>Rol SENNOVA</th>
                    <th>Meses</th>
                    <th>Horas</th>
                </tr>
            </thead>
            <tbody slot="tbody">
                @foreach ($proyecto->participantes as $participante)
                    <tr>
                        <td>
                            <p style="white-space: pre-wrap">{{ ucwords($participante->nombre) }}</p>
                        </td>
                        <td>
                            <p style="white-space: pre-wrap">{{ $participante->email }}</p>
                        </td>
                        <td>
                            <p style="white-space: pre-wrap">{{ ucfirst($participante->centroFormacion->nombre) }}</p>
                        </td>
                        <td>
                            <p style="white-space: pre-wrap">{{ ucfirst($participante->centroFormacion->regional->nombre) }}</p>
                        </td>
                        <td>
                            @if ($participante->pivot && $participante->pivot->rol_sennova)
                                <p style="white-space: pre-wrap">{{ $roles_sennova->where('value', $participante->pivot->rol_sennova)->first() ? $roles_sennova->where('value', $participante->pivot->rol_sennova)->first()['label'] : 'Sin información registrada' }}</p>
                            @else
                                <p style="white-space: pre-wrap">Sin información registrada</p>
                            @endif
                        </td>
                        <td>
                            <p style="white-space: pre-wrap">{{ $participante->pivot->cantidad_meses }}</p>
                        </td>
                        <td>
                            <p style="white-space: pre-wrap">{{ $participante->pivot->cantidad_horas }}</p>
                        </td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    </div>

    <hr style="margin: 4rem 0">

    <h2>Resumen del proyecto</h2>
    <p style="white-space: pre-wrap">{{ $datos->resumen }}</p>

    <h2>Complemento - Resumen ejecutivo regional</h2>
    <p style="white-space: pre-wrap">{{ $datos->resumen_regional }}</p>

    <h2>Antecedentes</h2>
    <p style="white-space: pre-wrap">{{ $datos->antecedentes }}</p>

    <h2>Antecedentes de la Tecnoacademia y su impacto en la región</h2>
    <p style="white-space: pre-wrap">{{ $datos->antecedentes_tecnoacademia }}</p>

    <h2>Justificación</h2>
    <p style="white-space: pre-wrap">{{ $datos->justificacion_problema }}</p>

    <h2>Logros de la vigencia {{ $convocatoria->year - 1 }} en la implementación del programa de TecnoAcademia</h2>
    <p style="white-space: pre-wrap">{{ $datos->logros_vigencia_anterior }}</p>

    <h2>Descripción de retos y prioridades locales y regionales en los cuales la Tecnoacademia tiene impacto</h2>
    <p style="white-space: pre-wrap">{{ $datos->retos_oportunidades }}</p>

    <h2>Justificación y pertinencia en el territorio</h2>
    <p style="white-space: pre-wrap">{{ $datos->pertinencia_territorio }}</p>

    <h2>Marco conceptual</h2>
    <p style="white-space: pre-wrap">{{ $datos->marco_conceptual }}</p>

    <h2>Líneas tecnológicas del Centro con las que se articula la TecnoAcademia</h2>
    <p>{{ $datos->lineas_tecnologicas_centro }}</p>

    <hr style="margin: 4rem 0">

    @if ($proyecto->municipios->count() > 0)
        <table width="100%" border="1" cellspacing="0" cellpadding="3" style="margin-top: 4rem;">
            <tr>
                <th width="100%" style="font-weight: bold;">Municipios beneficiados</th>
            </tr>
            <tr>
                <td width="100%">
                    <p style="white-space: pre-wrap">{{ $proyecto->municipios->implode('nombre', ', ') }}</p>
                </td>
            </tr>
        </table>
    @endif

    <h4>Descripción del beneficio en los municipios</h4>
    <p style="white-space: pre-wrap">{{ $datos->impacto_municipios }}</p>

    @if ( $proyecto->programasFormacion()->where('registro_calificado', false)->count() > 0 )
        <h4>Nombre de los programas de formación con los que se relaciona el proyecto</h4>
        <ul>
            <li>
                @foreach ($proyecto->programasFormacion()->where('registro_calificado', false)->get() as $programa_formacion)
                    <li>{{ ucfirst($programa_formacion->nombre)}}</li>
                @endforeach
            </li>
        </ul>
    @endif

    @if ( $proyecto->programasFormacion()->where('registro_calificado', true)->count() > 0 )
        <h4>Nombre de los programas de formación con registro calificado a impactar</h4>
        <ul>
            <li>
                @foreach ($proyecto->programasFormacion()->where('registro_calificado', true)->get() as $programa_formacion)
                    <li>{{ ucfirst($programa_formacion->nombre)}}</li>
                @endforeach
            </li>
        </ul>
    @endif

    <h4>Bibliografía</h4>
    <p style="white-space: pre-wrap; overflow-wrap: break-word">{{ $datos->bibliografia }}</p>

    <h1>Articulación</h1>

    <h4>Líneas de Investigación en las cuales se están ejecutando iniciativas o proyectos de la TecnoAcademia</h4>
    <ul>
        @foreach ($proyecto->lineasInvestigacion()->orderBy('nombre')->get() as $linea_investigacion)
            <li>{{ ucfirst($linea_investigacion->nombre) }}</li>
        @endforeach
    </ul>

    <h4>Grupos de investigación en los cuales está vinculada la TecnoAcademia</h4>
    <ul>
        @foreach ($proyecto->gruposInvestigacion()->orderBy('nombre')->get() as $grupo_investigacion)
            <li>{{ ucfirst($grupo_investigacion->nombre) }}</li>
        @endforeach
    </ul>

    <h4>¿Está la TecnoAcademia articulada con un semillero?</h4>
    <p style="white-space: pre-wrap">{{ $datos->articulacion_semillero ? 'Si' : 'No' }}</p>

    <h4>Semillero(s) de investigación de la TecnoAcademia</h4>
    <ul>
        @foreach ($proyecto->semillerosInvestigacion()->orderBy('nombre')->get() as $semillero_investigacion)
            <li>{{ ucfirst($semillero_investigacion->nombre) }}</li>
        @endforeach
    </ul>

    <h4>Proyectos o iniciativas en ejecución en el año {{ $convocatoria->year }}</h4>
    <ul>
        @foreach ($proyecto->proyectoFormulario4Linea70->proyectosIdiTecnoacademia()->orderBy('titulo')->get() as $proyecto_idi_Tecnoacademia)
            <li>{{ ucfirst($proyecto_idi_Tecnoacademia->titulo) }}</li>
        @endforeach
    </ul>

    <h4>Semilleros en proceso de formalización</h4>
    <ul>
        @if (json_decode($datos->semilleros_en_formalizacion))
            @foreach (json_decode($datos->semilleros_en_formalizacion) as $semillero_en_formalizacion)
                <li>{{ $semillero_en_formalizacion->value }}</li>
            @endforeach
        @endif
    </ul>

    <h4>Disciplinas de la subárea de conocimiento</h4>
    <ul>
        @foreach ($proyecto->proyectoFormulario4Linea70->disciplinasSubareaConocimiento()->orderBy('nombre')->get() as $disciplina_subarea_conocimiento)
            <li>{{ ucfirst($disciplina_subarea_conocimiento->nombre) }}</li>
        @endforeach
    </ul>

    <h4>Redes de conocimiento</h4>
    <ul>
        @foreach ($proyecto->redesConocimiento()->orderBy('nombre')->get() as $red_conocimiento)
            <li>{{ ucfirst($red_conocimiento->nombre) }}</li>
        @endforeach
    </ul>

    <h4>¿En cuáles actividades económicas se puede aplicar el proyecto?</h4>
    <ul>
        @foreach ($proyecto->proyectoFormulario4Linea70->actividadesEconomicas()->orderBy('nombre')->get() as $actividad_economica)
            <li>{{ ucfirst($actividad_economica->nombre) }}</li>
        @endforeach
    </ul>

    <h4>Temáticas estratégica SENA</h4>
    <ul>
        @foreach ($proyecto->proyectoFormulario4Linea70->tematicasEstrategicas()->orderBy('nombre')->get() as $tematica_estrategica)
            <li>{{ ucfirst($tematica_estrategica->nombre) }}</li>
        @endforeach
    </ul>

    @if (!empty($datos->proyectos_ejecucion))
        <h4>Proyectos o iniciativas en ejecución en el año {{ $convocatoria->year - 2 }}</h4>
        <p style="white-space: pre-wrap">{{ $datos->proyectos_ejecucion }}</p>
    @endif

    <hr style="margin: 4rem 0">

    <h1>Articulación con el Centro de Formación</h1>

    @if (!empty($datos->articulacion_centro_formacion))
        <h4>Articulación con el centro de formación</h4>
        <p style="white-space: pre-wrap">{{ $datos->articulacion_centro_formacion }}</p>
    @endif

    @if (!empty($datos->articulacion_programas_centro))
        <h4>¿Articulación de la TecnoAcademia en los programas de formación del Centro?</h4>
        <p style="white-space: pre-wrap">{{ $datos->articulacion_programas_centro }}</p>
    @endif

    @if (!empty($datos->articulacion_bienestar_aprendiz))
        <h4>¿Articulación de la TecnoAcademia en las acciones de Bienestar al aprendiz del Centro?</h4>
        <p style="white-space: pre-wrap">{{ $datos->articulacion_bienestar_aprendiz }}</p>
    @endif

    @if (!empty($datos->favorecimiento_ruta_formacion))
        <h4>¿Acciones conjuntas definidas con el equipo de Articulación con la Media del Centro para favorecer la ruta de formación desde la TecnoAcademia?</h4>
        <p style="white-space: pre-wrap">{{ $datos->favorecimiento_ruta_formacion }}</p>
    @endif

    @if (!empty($datos->lineas_medulares_centro))
        <h4>Líneas medulares del Centro con las que se articula la TecnoAcademia</h4>
        <p style="white-space: pre-wrap">{{ $datos->lineas_medulares_centro }}</p>
    @endif


    <hr style="margin: 4rem 0">

    <h1>Problema central</h1>

    <div style="background-color: rgb(190, 190, 190); padding: 20px; color: rgba(39, 39, 39, 0.912); font-weight: bolder; text-align: center;">
        <p style="white-space: pre-wrap">{{ $datos->problema_central }}</p>
    </div>

    @if (!empty($datos->planteamiento_problema))
        <h4>Planteamiento del problema</h4>
        <p style="white-space: pre-wrap">{{ $datos->planteamiento_problema }}</p>
    @endif

    @if (!empty($datos->identificacion_problema))
        <h4>Identificación y descripción del problema</h4>
        <p style="white-space: pre-wrap">{{ $datos->identificacion_problema }}</p>
    @endif

    @if (!empty($datos->pregunta_formulacion_problema))
        <h4>Pregunta de formulación del problema</h4>
        <p style="white-space: pre-wrap">{{ $datos->pregunta_formulacion_problema }}</p>
    @endif

    <h1>Objetivo general</h1>
    <div style="background-color: rgb(190, 190, 190); padding: 20px; color: rgba(39, 39, 39, 0.912); font-weight: bolder; text-align: center;">
        <p style="white-space: pre-wrap">{{ $datos->objetivo_general }}</p>
    </div>

    <hr style="margin: 4rem 0">

    <h1>Efectos directos e indirectos | Restulados e impactos</h1>
    @foreach ($proyecto->efectosDirectos as $j => $efecto_directo)

        <div style="margin-top: 2rem; font-size: 12px;">
            <h1>{{ $j + 1 }}. Efecto directo </h1>
            <p style="text-align: center;">{{ $efecto_directo->descripcion }}</p>

            <h1>Resultado asociado </h1>
            <p style="text-align: center;">{{ $efecto_directo->resultado->descripcion }}</p>


            <div style="margin-top: 20px;">
                @foreach ($efecto_directo->efectosindirectos as $k => $efecto_indirecto)
                    <table width="100%" style="font-size: 12px;">
                        <tr>
                            <td width="50%">
                                <div style="background-color: rgb(120, 15, 169); height: 4rem; padding: 20px; color: white;">
                                    <p style="margin: 0px; font-size: 10px;">{{ ($j + 1) .'.'. ($k + 1) }} Efecto indirecto</p>
                                    {{ $efecto_indirecto->descripcion }}
                                </div>
                            </td>
                            <td width="50%">
                                <div style="background-color: rgb(152, 61, 194); height: 4rem; padding: 20px; color: white;" >
                                    <p style="margin: 0px; font-size: 10px;">{{ ($j + 1) .'.'. ($k + 1) }} {{ $tipos_impacto->firstWhere('value', $efecto_indirecto->impacto->tipo) ? $tipos_impacto->firstWhere('value', $efecto_indirecto->impacto->tipo)['label'] : 'Sin información registrada' }}</p>
                                    {{ $efecto_indirecto->impacto->descripcion }}
                                </div>
                            </td>
                        </tr>
                    </table>
                @endforeach
            </div>
        </div>
    @endforeach

    <hr style="margin: 4rem 0">

    <h1>Causas directas e indirectas | Objetivos específicos y actividades</h1>

    @foreach ($proyecto->causasDirectas as $j => $causa_directa)
        <div style="margin-top: 2rem; font-size: 12px;">
            <h1>{{ $j + 1 }}. Causa directa </h1>
            <p style="text-align: center;">{{ $causa_directa->descripcion }}</p>

            <h1>Objetivo específico asociado </h1>
            <p style="text-align: center;">{{ $causa_directa->objetivoEspecifico->descripcion }}</p>

            <div style="margin-top: 20px;">
                @foreach ($causa_directa->causasIndirectas as $k => $causa_indirecta)
                    <table width="100%" style="font-size: 12px;">
                        <tr>
                            <td width="50%">
                                <div style="background-color: rgb(29, 110, 156); height: 4rem; padding: 20px; color: white;">
                                    <p style="margin: 0px; font-size: 10px;">{{ ($j + 1) .'.'. ($k + 1) }} Causa indirecta</p>
                                    {{ $causa_indirecta->descripcion }}
                                </div>
                            </td>
                            <td width="50%">
                                <div style="background-color: rgb(43, 148, 209); height: 4rem; padding: 20px; color: white;" >
                                    <p style="margin: 0px; font-size: 10px;">{{ ($j + 1) .'.'. ($k + 1) }} Actividad</p>
                                    {{ $causa_indirecta->actividad->descripcion }}
                                </div>
                            </td>
                        </tr>
                    </table>
                @endforeach
            </div>
        </div>
    @endforeach

    <hr style="margin: 4rem 0">

    <h1>Metodología</h1>
    <p style="white-space: pre-wrap">{{ $datos->metodologia }}</p>

    @if ($datos->metodologia_local)
        <h2>Descripcion de la metodología aplicada a nivel local</h2>
        <p style="white-space: pre-wrap">{{ $datos->metodologia_local }}</p>
    @endif

    @if ($datos->implementacion_modelo_pedagogico)
        <h4>Implementación del Modelo Pedagógico de las TecnoAcademia en el contexto regional de la TecnoAcademia</h4>
        <p style="white-space: pre-wrap">{{ $datos->implementacion_modelo_pedagogico }}</p>
    @endif

    @if ($proyecto->municipios()->exists())
        <h4>Nombre los municipios impactados en la vigencia {{ $convocatoria->year - 1 }} por la TecnoAcademia</h4>
        <p style="white-space: pre-wrap">{{ $proyecto->municipios->implode('nombre', ', ') }}</p>
    @endif

    @if ($proyecto->municipiosAImpactar()->exists())
        <h4>Defina los municipios a impactar en la vigencia {{ $convocatoria->year }}</h4>
        <p style="white-space: pre-wrap">{{ $proyecto->municipiosAImpactar->implode('nombre', ', ') }}</p>
    @endif

    @if ($datos->impacto_municipios)
        <h4>Descripción del beneficio o impacto generado por la TecnoAcademia en los municipios</h4>
        <p style="white-space: pre-wrap">{{ $datos->impacto_municipios }}</p>
    @endif

    @if ($datos->nombre_instituciones_programas && !empty($datos->nombre_instituciones_programas) || !empty($datos->otras_nombre_instituciones_programas))
        <h4>Instituciones donde se están ejecutando los programas y que se espera continuar con el proyecto de TecnoAcademias</h4>
        @if (json_decode($datos->nombre_instituciones_programas))
            @php
                $nombre_instituciones_programas = collect(json_decode($datos->nombre_instituciones_programas));
            @endphp
                <p style="white-space: pre-wrap">{{ $nombre_instituciones_programas->implode('value', ', ') }}</p>
            @endif

            @if (!empty($datos->otras_nombre_instituciones_programas))
                <p style="white-space: pre-wrap">{{$datos->otras_nombre_instituciones_programas}}</p>
            @endif
    @endif

    @if (!empty($datos->proyeccion_nuevas_instituciones))
        <h4>¿Se proyecta incluir nuevas Instituciones Educativas en la nueva vigencia?</h4>
        <p style="white-space: pre-wrap">{{ $datos->proyeccion_nuevas_instituciones ? 'Si' : 'No' }}</p>
    @endif

    @if ($datos->proyeccion_nuevas_tecnoacademias == 1 && !empty($datos->nuevas_instituciones))
        <h4>Nuevas instituciones educativas que se vincularán con el proyecto de TecnoAcademia</h4>
        @if (json_decode($datos->nuevas_instituciones))
            @php
                $nuevas_instituciones = collect(json_decode($datos->nuevas_instituciones));
            @endphp
            <p style="white-space: pre-wrap">{{ $nuevas_instituciones->implode('value', ', ') }}</p>
        @endif

        @if (!empty($datos->otras_nuevas_instituciones))
            <h4>Instituciones donde se están ejecutando los programas y que se espera continuar con el proyecto de TecnoAcademias</h4>
            <p style="white-space: pre-wrap">{{$datos->otras_nuevas_instituciones}}</p>
        @endif
    @endif

    @if ($datos->proyeccion_articulacion_media == 1 && !empty($datos->nombre_instituciones))
        <h4>Instituciones donde se implementará el programa que tienen <strong>articulación con la Media</strong></h4>
        @if (json_decode($datos->nombre_instituciones))
            @php
                $nombre_instituciones = collect(json_decode($datos->nombre_instituciones));
            @endphp
            <p style="white-space: pre-wrap">{{ $nombre_instituciones->implode('value', ', ') }}</p>
        @endif
    @endif

    @if (!empty($datos->otras_nombre_instituciones))
        <h4>Instituciones donde se implementará el programa que tienen <strong>articulación con la Media</strong></h4>
        <p style="white-space: pre-wrap">{{$datos->otras_nombre_instituciones}}</p>
    @endif

    @if ($proyecto->disenosCurriculares->count() > 0)
        <h4>Programas a ejecutar en la vigencia {{ $convocatoria->year }}:</h4>
        <ul>
            @foreach ($proyecto->disenosCurriculares as $disenoCurricular)
                <li>{{ ucfirst($disenoCurricular->nombre) }}</li>
            @endforeach
        </ul>
    @endif

    @if (!empty($datos->proyectos_macro))
        <h4>Proyectos Macro de investigación formativa y aplicada de la TecnoAcademia para la vigencia {{ $convocatoria->year }}</h4>
        <p style="white-space: pre-wrap">{{ $datos->proyectos_macro }}</p>
    @endif

    @if (!empty($datos->articulacion_plan_educacion))
        <h4>Articulación de la TecnoAcademia con el Plan Decenal de Educación y su regionalización en el territorio: mencionar logros de la vigencia {{ $convocatoria->year - 1 }} y {{ $convocatoria->year }}</h4>
        <p style="white-space: pre-wrap">{{ $datos->articulacion_plan_educacion }}</p>
    @endif

    @if (!empty($datos->articulacion_territorios_stem))
        <h4>Artifculación de la TecnoAcademia con la Iniciativa de Territorios STEM+ del Ministerio de Educación en el Territorio</h4>
        <p style="white-space: pre-wrap">{{ $datos->articulacion_territorios_stem }}</p>
    @endif

    <hr style="margin: 4rem 0">

    @if ($datos->propuesta_sostenibilidad)
        <h2>Propuesta de sostenibilidad</h2>
        <p style="white-space: pre-wrap">{{ $datos->propuesta_sostenibilidad }}</p>
    @endif

    @if ($datos->propuesta_sostenibilidad_social)
        <h2>Propuesta de sostenibilidad social</h2>
        <p style="white-space: pre-wrap">{{ $datos->propuesta_sostenibilidad_social }}</p>
    @endif

    @if ($datos->propuesta_sostenibilidad_ambiental)
        <h2>Propuesta de sostenibilidad ambiental</h2>
        <p style="white-space: pre-wrap">{{ $datos->propuesta_sostenibilidad_ambiental }}</p>
    @endif

    @if ($datos->propuesta_sostenibilidad_financiera)
        <h2>Propuesta de sostenibilidad financiera</h2>
        <p style="white-space: pre-wrap">{{ $datos->propuesta_sostenibilidad_financiera }}</p>
    @endif

    <hr style="margin: 4rem 0">

    <div class="border page_break">
        <h2 style="text-align:center">Productos</h2>

        @foreach ($proyecto->efectosDirectos as $efecto_directo)
            @foreach ($efecto_directo->resultado->productos as $producto)
                <table width="100%" border="1" cellspacing="0" cellpadding="3" style="margin-top: 3rem; font-size: 10px;">
                    <tbody slot="thead">
                        <tr>
                            <th align="left" width="15%">Producto</th>
                            <td colspan="3">{{ $producto->nombre }}</td>
                        </tr>
                        <tr>
                            <th align="left" width="15%">Fecha de ejecución</th>
                            <td>Inicio: {{ $producto->fecha_inicio }} - Fin: {{ $producto->fecha_finalizacion }}</td>
                            <th align="left" width="15%">Resultado</th>
                            <td>{{ $producto->resultado->descripcion }}</td>
                        </tr>
                        <tr>
                            <th align="left" width="15%">Meta del indicador</th>
                            <td>{{ $producto->meta_indicador }}</td>
                            <th align="left" width="15%">Unidad del indicador</th>
                            <td>{{ $producto->unidad_indicador }}</td>
                        </tr>
                        <tr>
                            <th align="left" width="15%">Formula del indicador</th>
                            <td colspan="3">{{ $producto->formula_indicador }}</td>
                        </tr>
                        <tr>
                            <th align="left" width="15%">Medio de verificación</th>
                            <td colspan="3">{{ $producto->medio_verificacion }}</td>
                        </tr>
                        @if ($producto->productoMinciencias()->exists())
                            <tr>
                                <th align="left" width="15%">Tipo</th>
                                <td>{{ $tipos_productos->firstWhere('value', $producto->productoMinciencias->tipo) ? $tipos_productos->firstWhere('value', $producto->productoMinciencias->tipo)['label'] : 'Sin información registrada' }}</td>
                                <th align="left" width="15%">Subtipología Minciencias</th>
                                <td>{{ $producto->productoMinciencias->subtipologiaMinciencias->nombre }}</td>
                            </tr>
                            <tr>
                                <th align="left" width="15%">TRL</th>
                                <td colspan="3">{{ $producto->productoMinciencias->trl }}</td>
                            </tr>
                        @endif
                    </tbody>
                </table>
            @endforeach
        @endforeach
    </div>

    <hr style="margin: 4rem 0">

    <div class="border page_break">
        <h2 style="text-align:center">Análisis de riesgos</h2>

        @foreach ($proyecto->analisisRiesgos as $riesgo)
            <table width="100%" border="1" cellspacing="0" cellpadding="3" style="margin-top: 3rem; font-size: 10px;">
                <tbody slot="thead">
                    <tr>
                        <th align="left" width="15%">Nivel de riesgo</th>
                        <td>{{ $niveles_riesgo->firstWhere('value', $riesgo->nivel)['label'] }}</td>
                        <th align="left" width="15%">Tipo de riesgo</th>
                        <td>{{ $tipos_riesgo->firstWhere('value', $riesgo->tipo)['label'] }}</td>
                    </tr>
                    <tr>
                        <th align="left" width="15%">Descripción</th>
                        <td colspan="3">{{ $riesgo->descripcion }}</td>
                    </tr>
                    <tr>
                        <th align="left" width="15%">Probabilidad</th>
                        <td>{{ $probabilidades_riesgo->firstWhere('value', $riesgo->probabilidad)['label'] }}</td>
                        <th align="left" width="15%">Impactos</th>
                        <td>{{ $impactos_riesgo->firstWhere('value', $riesgo->impacto)['label'] }}</td>
                    </tr>
                    <tr>
                        <th align="left" width="15%">Efectos</th>
                        <td colspan="3">{{ $riesgo->efectos }}</td>
                    </tr>
                    <tr>
                        <th align="left" width="15%">Medidas de mitigación</th>
                        <td colspan="3">{{ $riesgo->medidas_mitigacion }}</td>
                    </tr>
                </tbody>
            </table>
        @endforeach
    </div>

    <hr style="margin: 4rem 0">

    @if (!empty($proyecto->entidadesAliadas) && $proyecto->entidadesAliadas()->count() > 0)
        <h2 style="text-align:center">Entidades aliadas</h2>
        <table width="100%" border="1" cellspacing="0" cellpadding="3" style="margin-top:20px; font-size: 10px;">
            <tbody slot="thead">
                @foreach ($proyecto->entidadesAliadas as $entidad)
                    <tr>
                        <th align="left" width="30%">Nombre</th>
                        <td>
                            {{ $entidad->nombre }}
                        </td>
                    </tr>

                    <tr>
                        <th align="left" width="30%">Tipo</th>
                        <td>
                            {{ $tipos_entidad_aliada->firstWhere('value', $entidad->tipo)['label'] }}
                        </td>
                    </tr>

                    <tr>
                        <th align="left" width="30%">Tipo de empresa/entidad</th>
                        <td>
                            {{ $tipos_empresa->firstWhere('value', $entidad->tipo_empresa)['label'] }}
                        </td>
                    </tr>

                    <tr>
                        <th align="left" width="30%">Naturaleza de la entidad</th>
                        <td>
                            {{ $naturaleza_entidad_aliada->firstWhere('value', $entidad->naturaleza)['label'] }}
                        </td>
                    </tr>

                    <tr>
                        <th align="left" width="30%">Fechas de vigencia Convenio/Acuerdos</th>
                        <td>Inicio: {{ $entidad->entidadAliadaLinea70->fecha_inicio_convenio }} Fin: {{ $entidad->entidadAliadaLinea70->fecha_fin_convenio }}</td>
                    </tr>

                     <tr>
                        <th align="left" width="30%">Actividades</th>
                        <td>
                            <ul>
                                @foreach ($entidad->actividades as $actividadEntidad)
                                    <li>{{ $actividadEntidad->descripcion }}</li>
                                @endforeach
                            </ul>
                        </td>
                    </tr>

                    <tr>
                        <th align="left" width="30%">Miembros de la entidad aliada</th>
                        <td>
                            <ul>
                                @foreach ($entidad->miembrosEntidadAliada as $miembro)
                                    <li>{{ $miembro->nombre }} - {{ $miembro->email }} - {{ $miembro->numero_celular }}</li>
                                @endforeach
                            </ul>
                        </td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    @endif

    <hr style="margin: 4rem 0">

    @if ($datos->edt()->exists())
        <h2 style="text-align:center">Eventos de Divulgación Tecnológica</h2>
        <table width="100%" border="1" cellspacing="0" cellpadding="3" style="margin-top:20px; font-size: 10px;">
            <tbody slot="thead">
                @foreach ($datos->edt as $edt)
                    <tr>
                        <th>Nombre del evento</th>
                        <td>{{ $edt->nombre_evento }}</td>
                    </tr>

                    <tr>
                        <th>Organizador</th>
                        <td>{{ $edt->organizador }}</td>
                    </tr>

                    <tr>
                        <th>Fecha probable del evento</th>
                        <td>{{ $edt->fecha_evento }}</td>
                    </tr>

                    <tr>
                        <th>Presupuesto</th>
                        <td>
                            <p style="white-space: pre-wrap">Presupuesto: ${{ number_format($edt->proyectoPresupuesto->valor_total, 0, ',', '.') }}</p>
                            <p style="white-space: pre-wrap">{{ $edt->proyectoPresupuesto->descripcion }}</p>
                            <p style="white-space: pre-wrap">{{ $edt->proyectoPresupuesto->justificacion }}</p>
                        </td>
                    </tr>

                    <tr>
                        <th>Tipo de evento</th>
                        <td>
                            @if ($edt->tipo_evento == 1)
                                Presencial
                            @elseif ($edt->tipo_evento == 2)
                                Virtual
                            @elseif ($edt->tipo_evento == 3)
                                Mixto
                            @endif
                        </td>
                    </tr>

                    <tr>
                        <th>Descripción del evento</th>
                        <td>{{ $edt->descripcion_evento }}</td>
                    </tr>

                    <tr>
                        <th>Descripción de participación de la entidad</th>
                        <td>{{ $edt->descripcion_participacion_entidad }}</td>
                    </tr>

                    <tr>
                        <th>Público objetivo</th>
                        <td>{{ $edt->publico_objetivo }}</td>
                    </tr>

                    <tr>
                        <th>Número de asistentes</th>
                        <td>{{ $edt->numero_asistentes }}</td>
                    </tr>

                    <tr>
                        <th>Estrategia de comunicación</th>
                        <td>{{ $edt->estrategia_comunicacion }}</td>
                    </tr>

                @endforeach
            </tbody>
        </table>
    @endif

    <hr style="margin: 4rem 0">

    @if ($datos->edt()->exists())
        <h2 style="text-align:center">Aulas móviles</h2>
        <table width="100%" border="1" cellspacing="0" cellpadding="3" style="margin-top:20px; font-size: 10px;">
            <tbody slot="thead">
                @foreach ($datos->aulasMoviles as $aula_movil)
                    <tr>
                        <th align="left" width="30%">Placa del vehículo</th>
                        <td>{{ $aula_movil->placa }}</td>
                    </tr>

                    <tr>
                        <th align="left" width="30%">Modelo del vehículo</th>
                        <td>{{ $aula_movil->modelo }}</td>
                    </tr>

                    <tr>
                        <th align="left" width="30%">Acciones desarrolladas y logros en la vigencia {{ $convocatoria->year }} con el Aula Móvil</th>
                        <td>{{ $aula_movil->logros_vigencia }}</td>
                    </tr>

                    <tr>
                        <th align="left" width="30%">Número de municipios visitados en la vigencia {{ $convocatoria->year }}</th>
                        <td>{{ $aula_movil->numero_municipios_visitados }}</td>
                    </tr>

                    <tr>
                        <th align="left" width="30%">Número de aprendices beneficiados por el Aula Móvil en la vigencia {{ $convocatoria->year - 1 }}</th>
                        <td>{{ $aula_movil->numero_aprendices_beneficiados }}</td>
                    </tr>

                    <tr>
                        <th align="left" width="30%">Estado actual (mecánico) del Aula Móvil</th>
                        <td>{{ $aula_movil->estado }}</td>
                    </tr>

                    <tr>
                        <th align="left" width="30%">Módulos interactivos en el Aula Móvil</th>
                        <td>{{ $aula_movil->modulos_interactivos }}</td>
                    </tr>

                    <tr>
                        <th align="left" width="30%">Acciones que espera desarrollar con el Aula Móvole en la vigencia {{ $convocatoria->year }}</th>
                        <td>{{ $aula_movil->acciones_a_desarrollar }}</td>
                    </tr>

                    <tr>
                        <th align="left" width="30%">Número de aprendices a beneficiar en la vigencia {{ $convocatoria->year }}</th>
                        <td>{{ $aula_movil->numero_aprendices_a_beneficiar }}</td>
                    </tr>

                    <tr>
                        <th align="left" width="30%">Requerimientos de recursos de Mantenimiento para la vigencia {{ $convocatoria->year }}</th>
                        <td>{{ $aula_movil->recursos_mantenimiento }}</td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    @endif

    <hr style="margin: 4rem 0">

    <div class="page_break">

        <h2 style="text-align: center;">Rubros presupuestales</h2>

        @foreach ($proyecto->proyectoPresupuesto as $presupuesto)
            @foreach ($presupuesto->convocatoriaProyectoRubrosPresupuestales as $convocatoria_rubro_presupuestal)
                <table width="100%" border="1" cellspacing="0" cellpadding="3" style="margin-top: 20px; font-size: 10px;">
                    <tbody slot="tbody">
                        <tr>
                            <th colspan="3" class="px-6 pt-6 pb-4 sticky top-0 z-10 w-full">
                                Información
                                <span style="display: inline; font-size: 8px; padding: 0.5rem 1rem; font-weight: bolder; border-radius: 100%;">PRE-{{ $presupuesto->id }}</span>
                            </th>
                        </tr>
                        <tr>
                            <td align="left">
                                <small style="font-weight: bold;">Concepto interno SENA</small>
                                <div>
                                    {{ $convocatoria_rubro_presupuestal->rubroPresupuestal->segundoGrupoPresupuestal->nombre }}
                                </div>
                            </td>
                            <td align="left">
                                <small style="font-weight: bold;">Rubro</small>
                                <div>
                                    {{ $convocatoria_rubro_presupuestal->rubroPresupuestal->tercerGrupoPresupuestal->nombre }}
                                </div>
                            </td>
                            <td align="left">
                                <small style="font-weight: bold;">Uso presupuestal</small>
                                <div>
                                    {{ $convocatoria_rubro_presupuestal->rubroPresupuestal->usoPresupuestal->descripcion }}
                                </div>
                            </td>
                        </tr>

                        <tr>
                            <td colspan="3">
                                <p style="font-weight: bold;">Descripción</p>
                                <p style="white-space: pre-wrap">{{ $presupuesto->descripcion }}</p>
                            </td>
                        </tr>
                        <tr>
                            <td colspan="3">
                                <p style="font-weight: bold;">Justificación</p>
                                <p style="white-space: pre-wrap">{{ $presupuesto->justificacion }}</p>
                            </td>
                        </tr>

                        @if ($presupuesto->viaticosMunicipio()->exists())
                            <tr>
                                <td colspan="3">
                                    <p style="font-weight: bold;">Municipios a visitar</p>

                                    @foreach ($presupuesto->viaticosMunicipio as $viatico)
                                        <ul>
                                            @foreach ($viatico->municipios as $municipio)
                                                <li>{{ $municipios->firstWhere('id', $municipio)->nombre }}</li>
                                            @endforeach
                                        </ul>

                                        <p><strong>Distancia aprox. municipios:</strong> {{ $distancias_municipios->firstWhere('value', $viatico->distancia_municipio)['label'] }}</p>
                                        <p><strong>Número de visitas:</strong> {{ $viatico->numero_visitas }}</p>
                                        <p><strong>Frecuencia semanal:</strong> {{ $frecuencias_semanales->firstWhere('value', $viatico->frecuencia_semanal)['label'] }}</p>
                                        <p><strong>Actividades a desarrollar:</strong> {{ $viatico->actividad_a_realizar }}</p>
                                        <p><strong>Rol encargado:</strong> {{ $viatico->proyectoRolSennova->convocatoriaRolSennova->rolSennova->nombre }}</p>
                                    @endforeach
                                </td>
                            </tr>
                        @endif

                        @if ($presupuesto->nodoEditorialInfo()->exists()))
                            <tr>
                                <td><p style="font-weight: bold;">Nodo editorial</p></td>
                                <td colspan="2">{{ $opciones_servicios_edicion->firstWhere('value', $presupuesto->nodoEditorialInfo->info)['label'] }}</td>
                            </tr>
                        @endif

                        @if ($presupuesto->softwareInfo()->exists())
                            <tr>
                                <td colspan="3">
                                    <p style="font-weight: bold;">Información del Software</p>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <p style="font-weight: bold;">Tipo de licencia</p>
                                    <p style="white-space: pre-wrap">{{ $tipos_licencia->firstWhere('value', $presupuesto->softwareInfo->tipo_licencia) ? $tipos_licencia->firstWhere('value', $presupuesto->softwareInfo->tipo_licencia)['label'] : 'Sin información registrada' }}</p>
                                </td>
                                <td>
                                    <p style="font-weight: bold;">Tipo de software</p>
                                    <p style="white-space: pre-wrap">{{ $tipos_software->firstWhere('value', $presupuesto->softwareInfo->tipo_software) ? $tipos_software->firstWhere('value', $presupuesto->softwareInfo->tipo_software)['label'] : 'Sin información registrada' }}</p>
                                </td>
                                <td>
                                    <p><strong>Periodo de uso</strong></p>
                                    <p>Fecha de inicio y finalización</p>
                                    <p style="white-space: pre-wrap">Desde: {{ $presupuesto->softwareInfo->fecha_inicio }}{{ !empty($presupuesto->softwareInfo->fecha_finalizacion) ? ' al ' . $presupuesto->softwareInfo->fecha_finalizacion : '' }}</p>
                                </td>
                            </tr>
                        @endif

                        @if ($presupuesto->actividades->count() > 0)
                            <tr>
                                <td colspan="3">
                                    <small style="display: block; font-weight: bold; maargin-left: 10px;">Actividades</small>
                                    <ul>
                                        @foreach ($presupuesto->actividades as $actividad)
                                            <li>{{ $actividad->descripcion }}</li>
                                        @endforeach
                                    </ul>
                                </td>
                            </tr>
                        @endif

                        <tr>
                            <th colspan="2" class="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full">Subtotal del costo de los productos o servicios requeridos</th>
                            <td class="border-t">
                                ${{ number_format($presupuesto->valor_total, 0, ',', '.') }} COP
                            </td>
                        </tr>
                    </tbody>
                </table>
            @endforeach
        @endforeach
    </div>

    @if (!empty($proyecto->proyectoRolesSennova))
        <div class="page_break">
            <h2 style="text-align: center;">Roles SENNOVA ${{ number_format($proyecto->total_roles_sennova, 0, ',', '.') }} COP</h2>
			@foreach ($proyecto->proyectoRolesSennova as $rolSENNOVA)
				<table width="100%" border="1" cellspacing="0" cellpadding="3" style="margin-top: 20px; font-size: 10px;">
					<thead>
						<tr>
							<th width="30%">Rol</th>
							<th width="auto">Nivel académico</th>
							<th width="auto">Meses</th>
							<th width="auto">Número de personas</th>
							<th width="15%">Asignación mensual</th>
						</tr>
					</thead>
					<tbody slot="tbody">
						<tr>
							<td width="30%">{{ $rolSENNOVA->convocatoriaRolSennova->rolSennova->nombre }}</td>
							<td width="auto">
								@switch ($rolSENNOVA->convocatoriaRolSennova->nivel_academico)
									@case(1)
										técnico
									@break

									@case(2)
										tecnólogo
									@break

									@case(3)
										pregrado
									@break

									@case(4)
										especalización
									@break

									@case(5)
										maestría
									@break

									@case(6)
										doctorado
									@break

									@case(7)
										ninguno
									@break

									@case(8)
										técnico con especialización
									@break

									@case(9)
										tecnólogo con especialización
									@break

									@default
										''
								@endswitch
							</td>
							<th width="auto">{{ $rolSENNOVA->numero_meses }}</th>
							<th width="auto">{{ $rolSENNOVA->numero_roles }}</th>
							<td width="15%">${{ number_format($rolSENNOVA->convocatoriaRolSennova->asignacion_mensual, 0, ',', '.') }} COP</td>
						</tr>
						<tr>
							<td colspan="5">
								<p style="font-weight: bold;">Descripción del perfil requerido</p>
								<p style="white-space: pre-wrap">{{ $rolSENNOVA->descripcion }}</p>
							</td>
						</tr>

						@if ($rolSENNOVA->actividades->count() > 0)
							<tr>
								<td colspan="5">
									<small style="display: block; font-weight: bold; maargin-left: 10px;">Actividades</small>
									<ul>
										@foreach ($rolSENNOVA->actividades as $actividad)
											<li>{{ $actividad->descripcion }}</li>
										@endforeach
									</ul>
								</td>
							</tr>
						@endif
						<tr>
							<td colspan="4"><b>Subtotal del costo del rol requerido:</b></td>
							<td width="30%">${{ number_format(($rolSENNOVA->numero_meses * $rolSENNOVA->convocatoriaRolSennova->asignacion_mensual) * $rolSENNOVA->numero_roles, 0, ',', '.') }} COP</td>
						</tr>
					</tbody>
				</table>
			@endforeach
        </div>
    @endif

    <h4 style="text-align: center;">Precio total del proyecto ${{ number_format($proyecto->precio_proyecto, 0, ',', '.') }} COP</h4>
</body>
</html>
