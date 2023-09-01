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

    <h2>Antecedentes</h2>
    <p style="white-space: pre-wrap">{{ $datos->antecedentes }}</p>

    <h4>Descripción de retos y prioridades locales y regionales en los cuales ET tiene impacto</h4>
    <p style="white-space: pre-wrap">{{ $datos->retos_prioridades }}</p>

    <h4>Articulación y contribución de las acciones planteadas por ET en las  Agendas de la Comisión Regional de Competitividad de los Departamentoss impactados</h4>
    <p style="white-space: pre-wrap">{{ $datos->contribucion_agenda_regional_competitividad }}</p>

    <h4>Aportes de ET a los Conpes en los cuales tiene compromisos y acciones a desarrollar</h4>
    <p style="white-space: pre-wrap">{{ $datos->aportes_conpes }}</p>

    <h4>Describir el estado actual del Ecosistema Territorial de CTeI en el Departamento y las oportunidades que se ofrecen desde ET  para su fortalecimiento</h4>
    <p style="white-space: pre-wrap">{{ $datos->estado_actual_ecosistema_ctel }}</p>

    <h4>Describa los principales logros de la implementación de la línea ET en el {{ $convocatoria->year - 1 }}</h4>
    <p style="white-space: pre-wrap">{{ $datos->logros_implementacion_ctel }}</p>

    <h4>Justificación y pertinencia en el territorio y en el sistema de productividad regional</h4>
    <p style="white-space: pre-wrap">{{ $datos->justificacion_pertinencia_territorio }}</p>

    <h4>Marco conceptual y metodológico de la Lïnea de Extensionismo Tecnológico</h4>
    <p style="white-space: pre-wrap">{{ $datos->marco_conceptual }}</p>

    <h1>EJES TRANSVERSALES {{ $convocatoria->year }}</h1>

    <h4>¿El proyecto aporta al fortaleciminto de  Proyectos de I + D + i tendientes a aumentar la producción en cadenas agrícolas priorizadas para el Derecho Humano a la Alimentación?</h4>
    <p style="white-space: pre-wrap">{{ $datos->aporta_fortalecimiento_cadenas_agricolas }}</p>

    <h4>Plantee como las estrategias de la Línea de Extensionismo Tecnológico contribuyen al fortalecimiento de Proyectos de I + D + i tendientes generación eléctrica a partir de fuentes no convencionales de energía renovable</h4>
    <p style="white-space: pre-wrap">{{ $datos->estrategias_generacion_electrica }}</p>

    <h4>Plantee como las estrategias de la Línea de Extensionismo Tecnológico contribuyen al fortalecimiento de Proyectos tendientes a aumentar los ingresos de los micronegocios de la economía popular</h4>
    <p style="white-space: pre-wrap">{{ $datos->estrategias_fortalecimiento_micronegocios }}</p>

    <h4>Plantee como las estrategias de la Línea de Extensionismo Tecnológico contribuyen al fortalecimiento de Proyectos de I + D + i tendientes a generar y articular mecanismos de atención diferencial, integral e incluyente, para los campesinos, de acuerdo con sus particularidades sociales, culturales, económicas y territoriales, que faciliten el acceso a los programas de formación y demás servicios de la Entidad.</h4>
    <p style="white-space: pre-wrap">{{ $datos->estrategias_articulacion_campesinos }}</p>

    <h4>Bibliografía</h4>
    <p style="white-space: pre-wrap; overflow-wrap: break-word">{{ $datos->bibliografia }}</p>

    <h1 className="text-center">Articulación</h1>

    <h4>Impacto de la impelmentación de acciones de la línea de Extensionismo Tecnológico  en el (los) centro(s) de formación y en la Formación Profesional</h4>
    <p style="white-space: pre-wrap">{{ $datos->impacto_centros_formacion }}</p>

    <h4>Comente la articulación y aporte dela Línea de ET, proyectada para el {{ $convocatoria->year }} a los semilleros y grupos de investigación</h4>
    <p style="white-space: pre-wrap">{{ $datos->articulacion_semilleros_grupos_investigacion }}</p>

    <h4>¿Cómo proyecta la articulación en el {{ $convocatoria->year }}, de las acciones de ET con la línea de Servicios Tecnológicos?</h4>
    <p style="white-space: pre-wrap">{{ $datos->articulacion_linea_68 }}</p>

    <h4>¿Cómo se  proyectan las estrategias de Extensionismo Tecnológico para articularse con los centros de desarrollo empresarial de(l) Los Centros en las Regionales impactadas?</h4>
    <p style="white-space: pre-wrap">{{ $datos->articulacion_centros_desarrollo_empresarial }}</p>

    <h4>¿Cómo proyecta en el {{ $convocatoria->year }}, Extensionismo Tecnológico contribuir a la formación en la Regional o en el SENA?</h4>
    <p style="white-space: pre-wrap">{{ $datos->contribucion_formacion_regional_nacional }}</p>

    <h4>¿Cómo proyecta en el {{ $convocatoria->year }}, Extensionismo Tecnológico promover el desarrollo y fortalecimiento de las capacidades tecnológicas de las empresas, cadenas productivas y clústeres en las regiones?</h4>
    <p style="white-space: pre-wrap">{{ $datos->proyeccion_capacidades_tecnologicas_empresas }}</p>

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

    <h1>Metodología (¿Cómo se implementará la línea en el {{ $convocatoria->year }}?)</h1>
    <p style="white-space: pre-wrap">{{ $datos->metodologia }}</p>

    <h4>Comparta la estrategia para la atención de Empresas en los departamentos mencionados</h4>
    <p style="white-space: pre-wrap">{{ $datos->estrategias_atencion_empresas_municipios }}</p>

    <h4>Comparta las alianzas estratégicas a gestionar en el {{ $convocatoria->year }} para promover el logro de las metas de Extensionismo Tecnológico</h4>
    <p style="white-space: pre-wrap">{{ $datos->estrategias_promover_logros }}</p>

    <h4>Comparta la estrategia de divulgación y visibilización de acciones de las acciones de la línea ET para el {{ $convocatoria->year }}</h4>
    <p style="white-space: pre-wrap">{{ $datos->estrategias_visibilizacion }}</p>

    <h4>Proponga las estrategias para el {{ $convocatoria->year }} con el fin de que las estrategias de la lïnea de Extensionismo Tecnológico contribuya desde la ciencia, la Tecnología e Innovación a promover la productividad e innovación agropecuaria y agroindustrial</h4>
    <p style="white-space: pre-wrap">{{ $datos->estrategias_productividad_agropecuaria_agroindustrial }}</p>

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

                    @if ($entidad->entidadAliadaLinea83()->exists())
                        <tr>
                            <th align="left" width="30%">Fechas de vigencia Convenio/Acuerdos</th>
                            <td>Inicio: {{ $entidad->entidadAliadaLinea83->fecha_inicio_convenio }} Fin: {{ $entidad->entidadAliadaLinea83->fecha_fin_convenio }}</td>
                        </tr>
                    @endif

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
