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
                <p style="font-weight: bold;">Areas de Cualificación - Marco Nacional de Cualificaciones</p>
            </td>
            <td align="left">
               <ul>
                    @if ($datos->areas_cualificacion_mnc)
                        @foreach ($datos->areas_cualificacion_mnc as $area_cualificacion)
                            <li>{{ $areas_cualificacion_mnc->firstWhere('value', $area_cualificacion)['label'] }}</li>
                        @endforeach
                    @else
                        <li>Sin información registrada</li>
                    @endif
               </ul>
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

    <h2>Complemento - Antecedentes regional</h2>
    <p style="white-space: pre-wrap">{{ $datos->antecedentes_regional }}</p>

    <h4>Describa los principales logros del Hub de Innovación en el {{ $convocatoria->year - 1 }}</h4>
    <p style="white-space: pre-wrap">{{ $datos->logros_vigencia_anterior }}</p>

    <h4>Contexto General del Hub de Innovación</h4>
    <p style="white-space: pre-wrap">{{ $datos->contexto_general }}</p>

    <h1>PRIORIZACIÓN DE ESTRATEGIAS DEL TECNOPARQUE/HUB DE INNOVACIÓN DESDE LOS OBJETIVOS MISIONALES</h1>

    <h4>Descripción de retos y prioridades locales y regionales identificadas para ser atendidas por el  Hub de Innovación a corto (vigencia {{ $convocatoria->year }}), mediano y largo plazo</h4>
    <p style="white-space: pre-wrap">{{ $datos->retos_locales_regionales }}</p>

    <h4>De acuerdo al IDIC (Indice Departamental de  Innovación para Colombia https://AplicativoIDIC2020.ocyt.org.co/), identifique el estado actual del Departamento y plantee acciones que puedan ser ejecutadas por el Hub de Innovación en la vigencia {{ $convocatoria->year }} para contribuir con el mejoramiento del estado actual</h4>
    <p style="white-space: pre-wrap">{{ $datos->estado_actual_departamento }}</p>

    <h4>¿Cómo el Hub de Innovación, contribuirá en la vigencia {{ $convocatoria->year }} al desarrollo y fortalecimiento de las capacidades tecnológicas de las empresas, cadenas productivas y clústeres de la región?</h4>
    <p style="white-space: pre-wrap">{{ $datos->contribucion_desarrollo_empresas }}</p>

    <h4>¿Cómo se articuló en el año  {{ $convocatoria->year - 1 }} y cual será la contribución del  Hub de Innovación con la Agenda de la Comisión Regional de Competitividad, en la vigencia {{ $convocatoria->year }}?</h4>
    <p style="white-space: pre-wrap">{{ $datos->contribucion_agenda_regional_competitividad }}</p>

    <h1>ASPECTOS REGIONALES ASOCIADOS A LOS DOCUMENTOS NACIONALES Y AL PLAN DE DESARROLLO NACIONAL 2022-2026</h1>

    <h4>¿Cuáles serán los aportes del Hub de Innovación en el {{ $convocatoria->year }} a la Línea de acción 8 del Conpes 4011 'Facilitar intercambio de tecnología y la innovación en los emprendimientos CONPES, inlcuyendo acciones articuladas con Emprendimiento (Dirección de Empleo)?</h4>
    <p style="white-space: pre-wrap">{{ $datos->aportes_conpes_4011 }}</p>

    <h4>¿Cuáles serán los aportes del  Hub de Innovación en el {{ $convocatoria->year }} a la Línea de acción 1 del Conpes 4080 'el SENA desde 2022 y hasta 2026, fomentará la participación de la mujer en sus programas de investigación, desarrollo tecnológico e innovación, buscando generar competitividad con enfoque de género?</h4>
    <p style="white-space: pre-wrap">{{ $datos->aportes_conpes_4080 }}</p>

    <h4>Describa la situación actual del Departamento relacionada con la producción en cadenas agrícolas que han sido priorizadas en la Transformación Derecho Humano a la Alimentación y oportunidades para contribuir con el fortalecimiento de proyectos asociados a este objetivo</h4>
    <p style="white-space: pre-wrap">{{ $datos->situacion_actual_produccion_agricola }}</p>

    <h4>Describa las oportunidades en el departamento y regiones de influencia del Hub de Innovación para contribuir con la fortalecer proyectos de I + D + i tendientes a aportar alternativas de generación eléctrica a partir de fuentes no convencionales de energía renovable</h4>
    <p style="white-space: pre-wrap">{{ $datos->aportes_alternativas_generacion_electrica }}</p>

    <h4>Describa las oportunidades en el departamento y regiones de influencia del Hub de Innovación para contribuir con el impulso de la Economía Popular. Proyectos tendientes a aumentar los ingresos de los micronegocios de la economía popular</h4>
    <p style="white-space: pre-wrap">{{ $datos->aportes_impulso_economia_popular }}</p>

    <h4>Justificación y pertinencia  de las acciones que desarrolla el Hub de Innovación en el territorio</h4>
    <p style="white-space: pre-wrap">{{ $datos->justificacion_pertinencia }}</p>

    <h4>Describa las acciones realizadas en el {{ $convocatoria->year - 1 }}, integradas dentro de la Estrategia Campesena, en las que participó el Hub de Innovación</h4>
    <p style="white-space: pre-wrap">{{ $datos->acciones_estrategias_campesena }}</p>

    <h4>Bibliografía</h4>
    <p style="white-space: pre-wrap; overflow-wrap: break-word">{{ $datos->bibliografia }}</p>

    <h1 className="text-center">Articulación</h1>

    <h1>CONTRIBUCIÓN A LA FORMACIÓN</h1>

    <h4>¿Cuales fueron las principales acciones ejecutadas por el Hub de innovación en la vigencia {{ $convocatoria->year - 1 }} para contribuir a la formación en el Centro y en la Regional?</h4>
    <p style="white-space: pre-wrap">{{ $datos->contribucion_formacion_centro_regional }}</p>

    <h4>Para la vigencia {{ $convocatoria->year }}, defina acciones a realizar desde el Hub de Innovación,  que sean verificables,  y que contribuyan al fortalecimiento de la formación en el Centro y en la regional</h4>
    <p style="white-space: pre-wrap">{{ $datos->acciones_fortalecimiento_centro_regional }}</p>

    <h4>Defina acciones a realizar en el {{ $convocatoria->year }}, que promuevan la participación de aprendices en el Hub de Innovación</h4>
    <p style="white-space: pre-wrap">{{ $datos->acciones_participacion_aprendices }}</p>

    <h4>A partir de las acciones realizadas en el {{ $convocatoria->year - 1 }}, desde la oferta de Formación Complementaria (EDTs y otros Eventos), proyecte las acciones a realizar en la vigencia {{ $convocatoria->year }} en las que participe el Hub de Innovación</h4>
    <p style="white-space: pre-wrap">{{ $datos->acciones_aportes_por_edt }}</p>

    <h4>Describa las acciones realizadas o productos generados que contribuyeron en el {{ $convocatoria->year - 1 }} al Registro Calificado de Programas del Centro de Formación o de la Regional y plantee, acciones a realizar en la vigencia {{ $convocatoria->year }} que fortalezcan esta articulación</h4>
    <p style="white-space: pre-wrap">{{ $datos->acciones_fortalecimiento_programas_calificados }}</p>

    <h4>Describa las acciones realizadas o productos generados que contribuyeron en el {{ $convocatoria->year - 1 }} al Registro Calificado de Programas del Centro de Formación o de la Regional y plantee, acciones a realizar en la vigencia {{ $convocatoria->year }} que fortalezcan esta articulación</h4>
    <p style="white-space: pre-wrap">{{ $datos->acciones_fortalecimiento_programas_calificados }}</p>

    <h1>CONTRIBUCIÓN A LA INVESTIGACIÓN</h1>

    <h4>Describa las acciones realizadas o productos generados que contribuyeron en el {{ $convocatoria->year - 1 }} a la categorización de Grupos de Investigación del Centro de Formación o de la Regional y plantee, acciones a realizar en la vigencia {{ $convocatoria->year - 1 }} que fortalezcan esta articulación</h4>
    <p style="white-space: pre-wrap">{{ $datos->acciones_categorizacion_grupos_investigacion }}</p>

    <h4>Describa los Proyectos de Investigación del Centro en la vigencia {{ $convocatoria->year - 1 }}, en los cuales participó el  Hub. Plantee oportunidades para el fortalecimiento de esta articulación</h4>
    <p style="white-space: pre-wrap">{{ $datos->oportunidades_fortalecimiento_proyectos_sennova }}</p>

    <h4>Grupos de investigación en los cuales está vinculado el hub</h4>
    <ul>
        @foreach ($proyecto->gruposInvestigacion()->orderBy('nombre')->get() as $grupo_investigacion)
            <li>{{ ucfirst($grupo_investigacion->nombre) }}</li>
        @endforeach
    </ul>

    <h4>Semilleros de investigación en los cuales está vinculado el hub</h4>
    <ul>
        @foreach ($proyecto->semillerosInvestigacion()->orderBy('nombre')->get() as $semillero_investigacion)
            <li>{{ ucfirst($semillero_investigacion->nombre) }}</li>
        @endforeach
    </ul>

    <h1>El Hub de Innovación en el Eje de Servicios de I+D+i</h1>

    <h4>A partir de los resultados y las acciones realizadas por el Hub de Innovación, ¿Cómo proyecta la articulación en el {{ $convocatoria->year - 1 }}, el  con la línea de Servicios Tecnológicos?</h4>
    <p style="white-space: pre-wrap">{{ $datos->proyeccion_articulacion_linea_68 }}</p>

    <h4>A partir de los resultados y las acciones realizadas por el Hub de Innovación, ¿Cómo proyecta la articulación en el {{ $convocatoria->year - 1 }}, el  con la línea de Extensionismo Tecnológico?</h4>
    <p style="white-space: pre-wrap">{{ $datos->proyeccion_articulacion_linea_83 }}</p>

    <h4>A partir de los resultados y las acciones realizadas por el Hub de Innovación en las convocatorias de Fomento a la Innovación, plantee oportunidades para el fortalecimietno de esta estrategia {{ $convocatoria->year }} para ser implementadas en la siguiente vigencia</h4>
    <p style="white-space: pre-wrap">{{ $datos->oportunidades_fortalecimiento_convocatorias_innovacion }}</p>

    <h4>¿Cómo proyecta la articulación en el {{ $convocatoria->year - 1 }}, el  con los centros de desarrollo empresarial de la Regional?</h4>
    <p style="white-space: pre-wrap">{{ $datos->proyeccion_articulacion_centros_empresariales }}</p>

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

    <h2>Justificación</h2>
    <p style="white-space: pre-wrap">{{ $datos->justificacion_problema }}</p>

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

    <h1>Metodología General implementada por el Hub de Innovación</h1>
    <p style="white-space: pre-wrap">{{ $datos->metodologia }}</p>

    @if ($datos->metodologia_local)
        <h2>A continuación, describa la metodología que será implementada en el {{ $convocatoria->year }} en el nodo para lograr los objetivos propuestos en cada una de las etapas definidas para los Hubs de Innovación:</h2>
        <p style="white-space: pre-wrap">{{ $datos->metodologia_local }}</p>
    @endif

    @if ($proyecto->talentos_otros_departamentos)
        <h4>¿Planea en el {{ $convocatoria->year }} realizar acciones que beneficien talentos en otros departamentos?</h4>
        <p style="white-space: pre-wrap">{{ implode(', ', array_column(json_decode($datos->talentos_otros_departamentos), 'value')) }}</p>
    @endif

    @if ($datos->estrategia_atencion_talentos)
        <h2>Comparta la estrategia para la atención de talentos y PBTs en los departamentos mencionados</h2>
        <p style="white-space: pre-wrap">{{ $datos->estrategia_atencion_talentos }}</p>
    @endif

    @if ($datos->acciones_mejoramiento_idic)
        <h2>Describa las acciones que serán realizadas en el {{ $convocatoria->year }} para cotriuir al mejoramiento del IDIC del Departamento, desde el  Hub de Innovación</h2>
        <p style="white-space: pre-wrap">{{ $datos->acciones_mejoramiento_idic }}</p>
    @endif

    @if ($datos->municipios_beneficiados_vigencia_anterior)
        <h2>¿Planea en el {{ $convocatoria->year }} realizar acciones que beneficien talentos en otros departamentos?</h2>

        <ul>
            <li>
                @foreach ($municipios->whereIn('id', $datos->municipios_beneficiados_vigencia_anterior) as $municipio)
                    <li>{{ ucfirst($municipio->nombre)}}</li>
                @endforeach
            </li>
        </ul>
    @endif

    @if ($datos->beneficio_municipios_vigencia_anterior)
        <h2>Comparta la estrategia para la atención de talentos y PBTs en los departamentos mencionados</h2>
        <p style="white-space: pre-wrap">{{ $datos->beneficio_municipios_vigencia_anterior }}</p>
    @endif

    @if ($datos->municipios_beneficiados_vigencia_actual)
        <h2>Nombre de los municipios que planea serán beneficiados en el {{ $convocatoria->year }}</h2>

        <ul>
            <li>
                @foreach ($municipios->whereIn('id', $datos->municipios_beneficiados_vigencia_actual) as $municipio)
                    <li>{{ ucfirst($municipio->nombre)}}</li>
                @endforeach
            </li>
        </ul>
    @endif

    @if ($datos->estrategia_articulacion_pbts)
        <h2>De aceurdo a los resultados obtenidos, comparta la estrategia de Articulación de PBTs y Talentos para el {{ $convocatoria->year }}</h2>
        <p style="white-space: pre-wrap">{{ $datos->estrategia_articulacion_pbts }}</p>
    @endif

    @if ($datos->numero_empresas_atendidas)
        <h2>Número de Empresas atendidas en el {{ $convocatoria->year - 1 }}, por el Hub</h2>
        <p style="white-space: pre-wrap">{{ $datos->numero_empresas_atendidas }}</p>
    @endif

    @if ($datos->analisis_impacto_sector_empresarial)
        <h2>Analice los impactos en el {{ $convocatoria->year - 1 }} en el sector empresarial regional y determine acciones y estrategias a realizar en el {{ $convocatoria->year }} para continuar con el fortalecimiento</h2>
        <p style="white-space: pre-wrap">{{ $datos->analisis_impacto_sector_empresarial }}</p>
    @endif

    @if ($datos->numero_emprendedores_atendidos)
        <h2>Número de Emprendedores atendidos en el {{ $convocatoria->year - 1 }}</h2>
        <p style="white-space: pre-wrap">{{ $datos->numero_emprendedores_atendidos }}</p>
    @endif

    @if ($datos->analisis_impacto_regional)
        <h2>Analice los impactos en el{{ $convocatoria->year - 1 }} en el emprendimiento regional y determine acciones y estrategias a realizar en el {{ $convocatoria->year }} para continuar con el fortalecimiento</h2>
        <p style="white-space: pre-wrap">{{ $datos->analisis_impacto_regional }}</p>
    @endif

    @if ($datos->gestion_alianzas_estrategicas)
        <h2>Comparta las alianzas estratégicas a gestionar en el {{ $convocatoria->year }} para promover el logro de las metas del  Hub de Innovación</h2>
        <p style="white-space: pre-wrap">{{ $datos->gestion_alianzas_estrategicas }}</p>
    @endif

    @if ($datos->estrategias_visibilizacion)
        <h2>Comparta la estrategia de divulgación y visibilización de acciones del Hub de Innovación para el {{ $convocatoria->year }}</h2>
        <p style="white-space: pre-wrap">{{ $datos->estrategias_visibilizacion }}</p>
    @endif

    @if ($datos->integracion_plan_tecnologico)
        <h2>¿Cómo está integrado el Hub de Innovación en el Plan Tecnológico del Centro?</h2>
        <p style="white-space: pre-wrap">{{ $datos->integracion_plan_tecnologico }}</p>
    @endif

    <h1>PLANEACIÓN METODOLÓGICA PARA LA IMPLEMENTACIÓN DE ESTRATEGIAS Y ACCIONES QUE CONTRIBUYAN A LOS EJES PRIORIZADOS PARA LA VIGENCIA {{ $convocatoria->year }}</h1>

    @if ($datos->estrategias_productividad_agropecuaria)
        <h2>Proponga las estrategias para el {{ $convocatoria->year - 1 }} con el fin de que el Hub contribuya desde la ciencia, la Tecnología e Innovación a promover la productividad e innovación agropecuaria y agroindustrial en los territorios que impacta el Hub de Innovación</h2>
        <p style="white-space: pre-wrap">{{ $datos->estrategias_productividad_agropecuaria }}</p>
    @endif

    @if ($datos->acciones_estrategia_campesena)
        <h2>A partir de las necesidades y retos territoriales, plantee cuales serán las acciones a realizar en el {{ $convocatoria->year }}, integradas dentro de la Estrategia Campesena, en las que participará el Hub de Innovación</h2>
        <p style="white-space: pre-wrap">{{ $datos->acciones_estrategia_campesena }}</p>
    @endif

    @if ($datos->estrategia_campesena_campesinos)
        <h2>Describa las acciones del Hub de Innovación a  realizar en el {{ $convocatoria->year }}, que estarán integradas dentro de la Estrategia Campesena, para beneficiar Campesinos y agremiaciones campesinas y especialmente al acompañamiento de Proyectos de I + D + i tendientes a generar y articular mecanismos de atención diferencial, integral e incluyente, para los campesinos, de acuerdo con sus particularidades sociales, culturales, económicas y territoriales, que faciliten el acceso a los programas de formación y demás servicios de la Entidad</h2>
        <p style="white-space: pre-wrap">{{ $datos->estrategia_campesena_campesinos }}</p>
    @endif

    @if ($datos->acciones_fortalecimiento_economia_popular)
        <h2>Describa las acciones del  Hub de Innovación a  realizar en el {{ $convocatoria->year }}, que estarán direccionadas a fortalecer la Economía Popular</h2>
        <p style="white-space: pre-wrap">{{ $datos->acciones_fortalecimiento_economia_popular }}</p>
    @endif

    @if ($datos->acciones_fortalecimiento_idi)
        <h2>Describa las acciones del  Hub de Innovación a  realizar en el {{ $convocatoria->year }}, que estarán direccionadas a fortalecer Proyectos de I + D + i tendientes generación eléctrica a partir de fuentes no convencionales de energía renovable</h2>
        <p style="white-space: pre-wrap">{{ $datos->acciones_fortalecimiento_idi }}</p>
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
                                <td>{{ $tipos_productos->firstWhere('value', $producto->productoMinciencias->tipo)['label'] }}</td>
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
                        <td>Inicio: {{ $entidad->entidadAliadaLinea69->fecha_inicio_convenio }} Fin: {{ $entidad->entidadAliadaLinea69->fecha_fin_convenio }}</td>
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
