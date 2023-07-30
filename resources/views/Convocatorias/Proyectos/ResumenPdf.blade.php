<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>PDF {{ $proyecto->codigo }}</title>

    <style>
        @page {
            margin: 60px;
            font-family: 'Nunito', Roboto, Arial;
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
                <p>PDF Proyecto - SGPS-SIPRO <br><small>Código SGPS del proyecto: {{ $proyecto->codigo }}</small></p>
            </td>
        </tr>
        <tr>
            <td valign="middle" align="center">
                <p>{{ ucfirst($proyecto->centroFormacion->nombre) }} ({{ $proyecto->centroFormacion->codigo }}) - Regional {{ ucfirst($proyecto->centroFormacion->regional->nombre) }}</p>
            </td>
        </tr>
    </table>

    <h1 style="text-align: center; margin: 15rem 0 6rem 0;">{{ $datos->titulo }}</h1>

    <p style="text-align: right; margin-bottom: 18rem 0;">{{ $proyecto->participantes()->where('es_formulador', true)->first()  ? ucwords($proyecto->participantes()->where('es_formulador', true)->first()->nombre) : 'Sin autor/a principal asignado'}}</p>

    <table width="100%" border="1" cellspacing="0" cellpadding="3" style="font-size: 12px;">
        @if ($datos->lineaInvestigacion)
            <tr>
                <td align="left">
                    <p class="title">Línea de investigación</p>
                </td>
                <td align="left">
                    <p>{{ ucfirst($datos->lineaInvestigacion->nombre) }}</p>
                </td>
            </tr>
        @endif
         <tr>
            <td align="left">
                <p class="title">Fechas de ejecución del proyecto</p>
            </td>
            <td align="left">
                <p>{{ $proyecto->fecha_inicio .' - '. $proyecto->fecha_finalizacion }}</p>
            </td>
        </tr>
        <tr>
            <td align="left">
                <p class="title">Código dependencia presupuestal (SIIF)</p>
            </td>
            <td align="left">
                <p>Linea programatica: {{ $proyecto->lineaProgramatica->codigo }} - {{ $proyecto->lineaProgramatica->nombre }}</p>
            </td>
        </tr>
         @if (!empty($datos->infraestructura_tecnoacademia))
            <tr>
                <td align="left">
                    <p class="title">La infraestructura donde opera la TecnoAcademia es:</p>
                </td>
                <td>
                    @if ($datos->infraestructura_tecnoacademia == 1)
                        Infraestructura SENA
                    @elseif ($datos->infraestructura_tecnoacademia == 2)
                        Infraestructura de entidad pública
                    @elseif ($datos->infraestructura_tecnoacademia == 3)
                        Infraestructura de entidad privada
                    @endif
                </td>
            </tr>
        @endif
        @if (!empty($datos->zona_influencia))
            <tr>
                <td align="left">Zona de influencia</td>
                <td align="left">{{ $datos->zona_influencia }}</td>
            </tr>
        @endif
        @if ($proyecto->proyectoLinea68)
            <tr>
                <td align="left">
                    <p class="title">Tipo de proyecto</p>
                </td>
                <td align="left">
                    {{ $tipoProyectoLinea68->where('value', $datos->tipo_proyecto_linea_68_id)->first() ? $tipoProyectoLinea68->where('value', $datos->tipo_proyecto_linea_68_id)->first()['label'] : '' }}
                </td>
            </tr>
        @endif
        @if ($datos->nodoTecnoparque)
            <tr>
                <td align="left">
                    <p class="title">Nodo Tecnoparque</p>
                </td>
                <td align="left">
                    <p>{{ ucfirst($datos->nodoTecnoparque->nombre) }}</p>
                </td>
            </tr>
        @endif
        @if ($datos->redConocimiento)
            <tr>
                <td align="left">
                    <p class="title">Red de conocimiento sectorial</p>
                </td>
                <td align="left">
                    <p>{{ $datos->redConocimiento->nombre }}</p>
                </td>
            </tr>
        @endif
        @if ($datos->disciplinaSubareaConocimiento)
            <tr>
                <td align="left">
                    <p class="title">Disciplina de la subárea de conocimiento</p>
                </td>
                <td align="left">
                    <p>{{ $datos->disciplinaSubareaConocimiento->nombre }}</p>
                </td>
            </tr>
        @endif
        @if ($datos->disciplinaSubareaConocimiento)
            <tr>
                <td align="left" width="35%">
                    <p class="title">¿En cuáles actividades económicas se puede aplicar el proyecto de investigación?</p>
                </td>
                <td align="left">
                    <p>{{ $datos->disciplinaSubareaConocimiento->nombre }}</p>
                </td>
            </tr>
        @endif
        @if ($datos->tematicaEstrategica)
            <tr>
                <td align="left">
                    <p class="title">Temática estratégica SENA</p>
                </td>
                <td align="left">
                    <p>{{ $datos->tematicaEstrategica->nombre }}</p>
                </td>
            </tr>
        @endif
        @if ($datos->video)
            <tr>
                <td align="left">
                    <p class="title">¿El proyecto tiene video?</p>
                </td>
                <td align="left">
                    <p><a target="_blank" href="{{ $datos->video }}">{{ $datos->video }}</a></p>
                </td>
            </tr>
        @endif
    </table>

    @if ($proyecto->proyectoLinea66)

        <hr style="margin: 4rem 0">

        @if ($proyecto->proyectoLinea66->proyecto_investigacion_pedagogica)
            <h4>¿El proyecto es de investigación pedagógica?</h4>
            <p>{{ $proyecto->proyectoLinea66->proyecto_investigacion_pedagogica ? 'Si' : 'No' }}</p>

            <h4>¿El proyecto está articulado con la ENI?</h4>
            <p>{{ $datos->articulacion_eni ? 'Si' : 'No' }}</p>

            <h4>Grupo de investigación ENI</h4>
            <p>{{ ucfirst($proyecto->proyectoLinea66->grupoInvestigacionEni->nombre) }}</p>

            <h4>Líneas de investigación ENI</h4>
            <li>
                @foreach ($proyecto->proyectoLinea66->lineasInvestigacionEni('nombre', 'asc')->cursor() as $lineaInvestigacionEni)
                    <li>{{ ucfirst($lineaInvestigacionEni->nombre) }}</li>
                @endforeach
            </li>

            <h4>Áreas temáticas</h4>
            <li>
                @foreach ($proyecto->proyectoLinea66->areasTematicasEni('nombre', 'asc')->cursor() as $areaTematicaEni)
                    <li>{{ ucfirst($areaTematicaEni->nombre) }}</li>
                @endforeach
            </li>
        @endif

        <hr style="margin: 4rem 0">

        @if ($datos->justificacion_industria_4)
            <h1>Justificación de la relación con la industria 4.0</h1>
            <p>{{ $datos->justificacion_industria_4 }}</p>
        @endif

        @if ($datos->justificacion_economia_naranja)
            <h1 style="margin: 4rem 2rem;">Justificación de la relación con la economía naranja</h1>

            <p>{{ $datos->justificacion_economia_naranja }}</p>
        @endif

        @if ($datos->impacto_sector_agricola)
            <div class="page_break">
                <h1 style="margin: 4rem 2rem;">¿El proyecto tendrá un impacto en el sector agrícola?</h1>

                <p class="page_break">{{ $datos->impacto_sector_agricola }}</p>
            </div>
        @endif

        @if ($datos->justificacion_politica_discapacidad)
            <div class="page_break">
                <h1 style="margin: 4rem 2rem;">Justificación del aporte a la Política Institucional para Atención de las Personas con discapacidad</h1>

                <p class="page_break">{{ $datos->justificacion_politica_discapacidad }}</p>
            </div>
        @endif

        @if ($datos->atencion_pluralista_diferencial)
            <h1 style="margin: 4rem 2rem;">Justificación del aporte a la Política Institucional de Atención con Enfoque Pluralista y Diferencial (acuerdo 0010 de 2016)</h1>
            <p>{{ $datos->atencion_pluralista_diferencial }}</p>
        @endif

        <h1 style="margin: 4rem 2rem;">¿Cuál es el origen de las muestras con las que se realizarán las actividades de investigación, bioprospección y/o aprovechamiento comercial o industrial?</p>
        @if ($datos->muestreo == 1)
            <p>Especies Nativas. (es la especie o subespecie taxonómica o variedad de animales cuya área de disposición geográfica se extiende al territorio nacional o a aguas jurisdiccionales colombianas o forma parte de los mismos comprendidas las especies o subespecies que migran temporalmente a ellos, siempre y cuando no se encuentren en el país o migren a él como resultado voluntario o involuntario de la actividad humana. Pueden ser silvestre, domesticada o escapada de domesticación incluyendo virus, viroides y similares)</p>

            <h3>¿Qué actividad pretende realizar con la especie nativa?</h3>
                @if ($datos->actividades_muestreo == '1.1.1')
                <p>Separación de las unidades funcionales y no funcionales del ADN y el ARN, en todas las formas que se encuentran en la naturaleza.</p>
            @elseif($datos->actividades_muestreo == '1.1.2')
                <p>Aislamiento de una o varias moléculas, entendidas estas como micro y macromoléculas, producidas por el metabolismo de un organismo.</p>
            @elseif($datos->actividades_muestreo == '1.1.3')
                <p>Solicitar patente sobre una función o propiedad identificada de una molécula, que se ha aislado y purificado.</p>
            @elseif($datos->actividades_muestreo == '1.1.4')
                <p>No logro identificar la actividad a desarrollar con la especie nativa</p>
            @endif

            <h3>¿Cuál es la finalidad de las actividades a realizar con la especie nativa/endémica?</h3>

            @if ($datos->objetivo_muestreo == '1.2.1')
                <p>Investigación básica sin fines comerciales.</p>
            @elseif($datos->objetivo_muestreo == '1.2.2')
                <p>Bioprospección en cualquiera de sus fases.</p>
            @elseif($datos->objetivo_muestreo == '1.2.3')
                <p>Comercial o Industrial.</p>
            @endif
        @elseif($datos->muestreo == 2)
            <p>Especies Introducidas. (son aquellas que no son nativas de Colombia y que ingresaron al país por intervención humana)</p>
        @elseif($datos->muestreo == 3)
            <p>Recursos genéticos humanos y sus productos derivados</p>
        @elseif($datos->muestreo == 4)
            <p>Intercambio de recursos genéticos y sus productos derivados, recursos biológicos que los contienen o los componentes asociados a estos. (son aquellas que realizan las comunidades indígenas, afroamericanas y locales de los Países Miembros de la Comunidad Andina entre sí y para su propio consumo, basadas en sus prácticas consuetudinarias)</p>
        @elseif($datos->muestreo == 5)
            <p>Recurso biológico que involucren actividades de sistemática molecular, ecología molecular, evolución y biogeografía molecular (siempre que el recurso biológico se haya colectado en el marco de un permiso de recolección de especímenes de especies silvestres de la diversidad biológica con fines de investigación científica no comercial o provenga de una colección registrada ante el Instituto Alexander van Humboldt)</p>
        @elseif($datos->muestreo == 6)
            <p>No aplica</p>
        @endif

        <hr style="margin: 4rem 0">

        <h4>En la ejecución del proyecto se requiere la recolección de especímenes de especies silvestres de la diversidad biológica con fines de elaboración de estudios ambientales (entendiendo como recolección los procesos de remoción o extracción temporal o definitiva de una especie ya sea vegetal o animal del medio natural) Nota: este permiso no se requiere cuando las actividades de recolección se limiten a investigaciones científicas o con fines industriales, comerciales o de prospección biológica.</h4>
        <p>{{ $datos->recoleccion_especimenes ? 'Si' : 'No' }}</p>

        <hr style="margin: 4rem 0">

        <h4>¿El proyecto se alinea con el plan tecnológico desarrollado por el centro de formación?</p>
        <p>{{ $datos->relacionado_plan_tecnologico['label'] }}</p>

        <hr style="margin: 4rem 0">

        <h4>¿El proyecto se alinea con las Agendas Departamentales de Competitividad e Innovación?</h4>
        <p>{{ $datos->relacionado_plan_tecnologico['label'] }}</p>

        <hr style="margin: 4rem 0">

        <h4>¿El proyecto se alinea con las Mesas Sectoriales?</h4>
        <p>{{ $datos->relacionado_mesas_sectoriales ? 'Si' : 'No'}}</p>

        @if ($datos->relacionado_mesas_sectoriales == 1)
            <h4>Alineado con las siguientes Mesas Sectoriales</h4>
            <ol>
                @foreach ($datos->mesasSectoriales()->orderBy('nombre', 'asc')->cursor() as $mesa)
                    <li>{{ ucfirst($mesa->nombre) }}</li>
                @endforeach
            </ol>
        @endif

        <hr style="margin: 4rem 0">

        <h4>¿El proyecto se formuló en conjunto con la tecnoacademia?</h4>
        <p>{{ $datos->relacionado_tecnoacademia == 1 ? 'Si' : ($datos->relacionado_tecnoacademia == 2 ? 'No' : 'No aplica')}}</p>

        @if ($datos->relacionado_tecnoacademia == 1)
            <h4>TecnoAcademias y líneas articuladas:</h4>
            <ol>
                @foreach ($proyecto->tecnoacademiaLineasTecnoacademia as $tecnoacademiaLineaTecnoacademia)
                    <li>{{ ucfirst($tecnoacademiaLineaTecnoacademia->lineaTecnoacademia->nombre) . '-' . ucfirst($tecnoacademiaLineaTecnoacademia->tecnoacademia->nombre) }}</li>
                @endforeach
            </ol>
        @endif

    @endif

    <hr style="margin: 4rem 0">

    <h2>Resumen del proyecto</h2>
    <p>{{ $datos->resumen }}</p>

    @if ($datos->resumen_regional)
        <h2>Complemento - Resumen ejecutivo regional</h2>
        <p>{{ $datos->resumen_regional }}</p>
    @endif

    <h2>Antecedentes</h2>
    <p>{{ $datos->antecedentes }}</p>

    @if ($datos->antecedentes_regional)
        <h2>Complemento - Antecedentes regional</h2>
        <p>{{ $datos->antecedentes_regional }}</p>
    @endif

    @if ($datos->antecedentes_tecnoacademia)
        <h2>Antecedentes de la Tecnoacademia y su impacto en la región</h2>
        <p>{{ $datos->antecedentes_tecnoacademia }}</p>
    @endif

    @if ($datos->logros_vigencia_anterior)
        <h2>Logros de la vigencia {{ $convocatoria->year }} en la implementación del programa de {{ $proyecto->proyectoLinea70 ? 'TecnoAcademia' : 'Tecnoparque' }}</h2>
        <p>{{ $datos->logros_vigencia_anterior }}</p>
    @endif

    @if ($datos->retos_oportunidades)
        <h2>Descripción de retos y prioridades locales y regionales en los cuales el Tecnoparque tiene impacto</h2>
        <p>{{ $datos->retos_oportunidades }}</p>
    @endif

     @if (!empty($datos->articulacion_agenda_competitividad))
        <h2>Articulación y contribución del Tecnoparque con la Agenda de la Comisión Regional de Competitividad.</h2>
        <p>{{ $datos->articulacion_agenda_competitividad }}</p>
    @endif

    @if (!empty($datos->aportes_linea_ocho_conpes))
        <h2>Aportes del Tecnoparque en el {{ $convocatoria->year + 1 }} a la Línea de acción 8 del Conpes 4011 'Facilitar intercambio de tecnología y la innovación en los emprendimientos CONPES'</h2>
        <p>{{ $datos->aportes_linea_ocho_conpes }}</p>
    @endif

     @if (!empty($datos->estado_ecosistema_ctel))
        <h2>Describir el estado actual del Ecosistema Territorial de CTeI en el Departamento y las oportunidades de articulación con el Tecnoparque.</h2>
        <p>{{ $datos->estado_ecosistema_ctel }}</p>
    @endif

    @if ($datos->pertinencia_territorio)
        <h2>Justificación y pertinencia en el territorio</h2>
        <p>{{ $datos->pertinencia_territorio }}</p>
    @endif

    @if (!empty($datos->marco_conceptual))
        <h2>Marco conceptual</h2>
        <p>{{ $datos->marco_conceptual }}</p>
    @endif

    @if (!empty($datos->lineas_tecnologicas_centro))
        <div class="border">
            <h2>Líneas tecnológicas del Centro con las que se articula la TecnoAcademia</h2>
            <p>{{ $datos->lineas_tecnologicas_centro }}</p>
        </div>
    @endif

    <h2>Metodología</h2>
    <p>{{ $datos->metodologia }}</p>

    @if ($datos->metodologia_local)
        @if ($proyecto->proyectoLinea69)
            <h4>A continuación, describa la metodología que será implementada en el {{ $convocatoria->year + 1 }} en el nodo para lograr los objetivos propuestos en cada una de las etapas definidas para los Tecnoparques:</h4>
        @else
            <h2>Metodología local</h2>
        @endif
        <p>{{ $datos->metodologia_local }}</p>
    @endif

    @if ($datos->talentosOtrosDepartamentos && $datos->talentosOtrosDepartamentos()->count() > 0)
        <h4>¿Planea en el {{ $convocatoria->year + 1 }} realizar acciones que beneficien talentos en otros departamentos?</h4>
        <ul>
            @foreach ($datos->talentosOtrosDepartamentos as $regional)
                <li>{{ ucfirst($regional->nombre) }}</li>
            @endforeach
        </ul>
    @endif

    @if (!empty($datos->estrategia_atencion_talentos))
        <h4>Comparta la estrategia para la atención de talentos y PBTs en los departamentos mencionados</h4>
        <p>{{ $datos->estrategia_atencion_talentos }}</p>
    @endif

     @if (!empty($datos->estrategia_articulacion_prox_vigencia))
        <h4>Comparta la estrategia de Articulación para el {{ $convocatoria->year + 1 }} para los proyectos de los Tecnoparques</h4>
        <p>{{ $datos->estrategia_articulacion_prox_vigencia }}</p>
    @endif

    @if (!empty($datos->alianzas_estrategicas))
        <h4>Comparta las alianzas estratégicas a gestionar en el {{ $convocatoria->year + 1 }} para promover el logro de las metas del Tecnoparque</h4>
        <p>{{ $datos->alianzas_estrategicas }}</p>
    @endif

     @if (!empty($datos->estrategia_divulgacion))
        <h4>Comparta la estrategia de divulgación y visibilización de acciones del Tecnoparque para el {{ $convocatoria->year + 1 }}</h4>
        <p>{{ $datos->estrategia_divulgacion }}</p>
    @endif

    @if (!empty($datos->promover_productividad))
        <h4>Proponga las estrategias para el {{ $convocatoria->year + 1 }} con el fin de que el Tecnoparque contribuya desde la ciencia, la Tecnología e Innovación a promover la productividad e innovación agropecuaria y agroindustrial</h4>
        <p>{{ $datos->promover_productividad }}</p>
    @endif

    @if ($datos->implementacion_modelo_pedagogico)
        <h2>Implementación del Modelo Pedagógico de las TecnoAcademia en el contexto regional de la TecnoAcademia</h2>
        <p>{{ $datos->implementacion_modelo_pedagogico }}</p>
    @endif

    @if ($datos->propuesta_sostenibilidad)
        <h2>Propuesta de sostenibilidad</h2>
        <p>{{ $datos->propuesta_sostenibilidad }}</p>
    @endif

    @if ($datos->propuesta_sostenibilidad_social)
        <h2>Propuesta de sostenibilidad social</h2>
        <p>{{ $datos->propuesta_sostenibilidad_social }}</p>
    @endif

    @if ($datos->propuesta_sostenibilidad_ambiental)
        <h2>Propuesta de sostenibilidad ambiental</h2>
        <p>{{ $datos->propuesta_sostenibilidad_ambiental }}</p>
    @endif

    @if ($datos->propuesta_sostenibilidad_financiera)
        <h2>Propuesta de sostenibilidad financiera</h2>
        <p>{{ $datos->propuesta_sostenibilidad_financiera }}</p>
    @endif

    @if ($datos->especificaciones_area)
        <h2>¿Cuenta con infraestructura adecuada y propia para el funcionamiento de la línea servicios tecnológicos en el centro de formación?</h2>
        <p>{{ $datos->infraestructura_adecuada ? 'Si' : 'No' }}</p>
    @endif

    @if ($datos->especificaciones_area)
        <h2>Especificaciones e infraestructura</h2>
        <p>{{ $datos->especificaciones_area }}</p>
    @endif

    @if ($datos->especificaciones_area)
        <h2>Enlace del video</h2>
        <p>{{ $datos->video }}</p>
    @endif

    @if ($datos->numero_aprendices)
        <hr style="margin: 4rem 0">
        <h4>Número de aprendices que se beneficiarán en la ejecución del proyecto</h4>
        <p>{{ $datos->numero_aprendices }}</p>
    @endif

    <hr style="margin: 4rem 0">

    @if ($proyecto->municipios->count() > 0)
        <table width="100%" border="1" cellspacing="0" cellpadding="3" style="margin-top: 4rem;">
            <tr>
                <th width="100%" class="title">Municipios beneficiados</th>
            </tr>
            <tr>
                <td width="100%">
                    <p>{{ $proyecto->municipios->implode('nombre', ', ') }}</p>
                </td>
            </tr>
        </table>
    @endif

    @if (!empty($datos->impacto_municipios))
        <h4>Descripción del beneficio en los municipios</h4>
        <p>{{ $datos->impacto_municipios }}</p>
    @endif

    @if ($proyecto->municipiosAImpactar->count() > 0)
        <table width="100%" border="1" cellspacing="0" cellpadding="3" style="margin-top: 4rem;">
            <tr>
                <th width="100%" class="title">Municipios a impactar en la vigencia el proyecto:</th>
            </tr>
            <tr>
                <td width="100%">
                    <p>{{ $proyecto->municipiosAImpactar->implode('nombre', ', ') }}</p>
                </td>
            </tr>
        </table>
    @endif

    <hr style="margin: 4rem 0">

    @if ($datos->nombre_instituciones_programas && !empty($datos->nombre_instituciones_programas) || !empty($datos->otras_nombre_instituciones_programas))
        <h4>Instituciones donde se están ejecutando los programas y que se espera continuar con el proyecto de TecnoAcademias</h4>
        @if (json_decode($datos->nombre_instituciones_programas))
            @php
                $nombre_instituciones_programas = collect(json_decode($datos->nombre_instituciones_programas));
            @endphp
                <p>{{ $nombre_instituciones_programas->implode('value', ', ') }}</p>
            @endif

            @if (!empty($datos->otras_nombre_instituciones_programas))
                <p>{{$datos->otras_nombre_instituciones_programas}}</p>
            @endif
    @endif

    @if (!empty($datos->proyeccion_nuevas_instituciones))
        <h4>¿Se proyecta incluir nuevas Instituciones Educativas en la nueva vigencia?</h4>
        <p>{{ $datos->proyeccion_nuevas_instituciones ? 'Si' : 'No' }}</p>
    @endif

    @if ($datos->proyeccion_nuevas_tecnoacademias == 1 && !empty($datos->nuevas_instituciones))
        <h4>Nuevas instituciones educativas que se vincularán con el proyecto de TecnoAcademia</h4>
        @if (json_decode($datos->nuevas_instituciones))
            @php
                $nuevas_instituciones = collect(json_decode($datos->nuevas_instituciones));
            @endphp
            <p>{{ $nuevas_instituciones->implode('value', ', ') }}</p>
        @endif

        @if (!empty($datos->otras_nuevas_instituciones))
            <h4>Instituciones donde se están ejecutando los programas y que se espera continuar con el proyecto de TecnoAcademias</h4>
            <p>{{$datos->otras_nuevas_instituciones}}</p>
        @endif
    @endif

    @if ($datos->proyeccion_articulacion_media == 1 && !empty($datos->nombre_instituciones))
        <h4>Instituciones donde se implementará el programa que tienen <strong>articulación con la Media</strong></h4>
        @if (json_decode($datos->nombre_instituciones))
            @php
                $nombre_instituciones = collect(json_decode($datos->nombre_instituciones));
            @endphp
            <p>{{ $nombre_instituciones->implode('value', ', ') }}</p>
        @endif
    @endif

    @if (!empty($datos->otras_nombre_instituciones))
        <h4>Instituciones donde se implementará el programa que tienen <strong>articulación con la Media</strong></h4>
        <p>{{$datos->otras_nombre_instituciones}}</p>
    @endif

    @if (!empty($datos->programas_formacion_articulados))
        <h4>Programas de articulación con la Media con los cuales se espera dar continuidad a la ruta de formación de los aprendices de la TecnoAcademia</h4>
        <li>
            @foreach ($proyecto->programasFormacion as $programaFormacionArticulado)
                <li>{{ ucfirst($programaFormacionArticulado->nombre)}}</li>
            @endforeach
        </li>
    @endif

    @if ($proyecto->disenosCurriculares->count() > 0)
        <h4>Programas a ejecutar en la vigencia del proyecto:</h4>
        <ul>
            @foreach ($proyecto->disenosCurriculares as $disenoCurricular)
                <li>{{ ucfirst($disenoCurricular->nombre) }}</li>
            @endforeach
        </ul>
    @endif

    @if (!empty($datos->proyectos_macro))
        <h4>Proyectos Macro de investigación formativa y aplicada de la TecnoAcademia para la vigencia {{ $convocatoria->year }}</h4>
        <p>{{ $datos->proyectos_macro }}</p>
    @endif

    @if (!empty($datos->articulacion_plan_educacion))
        <h4>Articulación de la TecnoAcademia con el Plan Decenal de Educación y su regionalización en el territorio: mencionar logros de la vigencia actual y del año siguiente</h4>
        <p>{{ $datos->articulacion_plan_educacion }}</p>
    @endif

    @if (!empty($datos->articulacion_territorios_stem))
        <h4>Artifculación de la TecnoAcademia con la Iniciativa de Territorios STEM+ del Ministerio de Educación en el Territorio</h4>
        <p>{{ $datos->articulacion_territorios_stem }}</p>
    @endif

    @if ($proyecto->proyectoLinea66)
        <h4>Nombre de los programas de formación con registro calificado a impactar</h4>
        @foreach ($proyecto->programasFormacion()->where('registro_calificado', true)->orderBy('nombre')->get() as $programaFormacion)
            <li>{{ ucfirst($programaFormacion->nombre) .' - '.  $programaFormacion->codigo}}</li>
        @endforeach

        <hr style="margin: 4rem 0">

        <h4>Nombre de los programas de formación articulados</h4>
            @foreach ($proyecto->programasFormacion()->where('registro_calificado', false)->orderBy('nombre')->get() as $programaFormacion)
            <li>{{ ucfirst($programaFormacion->nombre) .' - '.  $programaFormacion->codigo}}</li>
        @endforeach
    @endif

    <hr style="margin: 4rem 0">

    <h1>Indicadores</h1>

    @if (!empty($datos->productividad_beneficiaros))
        <h4>Productividad y competitividad del (los) beneficiario(s) final(es) del proyecto</h4>
        <p>{{ $datos->productividad_beneficiaros }}</p>
    @endif

    @if (!empty($datos->generacion_empleo_beneficiarios))
        <h4>Generación o mantenimiento de empleo por parte del (los) beneficiario(s) del proyecto</h4>
        <p>{{ $datos->generacion_empleo_beneficiarios }}</p>
    @endif

    @if (!empty($datos->creacion_nuevos_desarrollos))
        <h4>Creación de nuevas empresas y diseño y desarrollo de nuevos productos, procesos o servicios</h4>
        <p>{{ $datos->creacion_nuevos_desarrollos }}</p>
    @endif

    @if (!empty($datos->generacion_conocimientos_beneficiarios))
        <h4>Incorporación de nuevos conocimientos y competencias laborales en el talento humano en la(s) empresa(s) beneficiaria(s) del proyecto</h4>
        <p>{{ $datos->generacion_conocimientos_beneficiarios }}</p>
    @endif

    @if (!empty($datos->generacion_valor_beneficiarios))
        <h4>Generación de valor agregado en la(s) entidad(es) beneficiaria(s) del proyecto</h4>
        <p>{{ $datos->generacion_valor_beneficiarios }}</p>
    @endif

    @if (!empty($datos->generacion_valor_beneficiarios))
        <h4>Fortalecimiento de programas de formación del Sena</h4>
        <p>{{ $datos->fortalecimiento_programas_formacion }}</p>
    @endif

    @if (!empty($datos->transferencia_tecnologias))
        <h4>Transferencia de tecnologías al Sena y a los sectores productivos relacionados</h4>
        <p>{{ $datos->transferencia_tecnologias }}</p>
    @endif

    @if (!empty($datos->calidad_formacion))
        <h4>Cobertura, calidad y pertinencia de la formación</h4>
        <p>{{ $datos->calidad_formacion }}</p>
    @endif

    @if (!empty($datos->impacto_ambiental_proyectos))
        <h4>Impacto ambiental de Proyectos de Innovación e investigación aplicada</h4>
        <p>{{ $datos->impacto_ambiental_proyectos }}</p>
    @endif

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
                            <p>{{ ucwords($participante->nombre) }}</p>
                        </td>
                        <td>
                            <p>{{ $participante->email }}</p>
                        </td>
                        <td>
                            <p>{{ ucfirst($participante->centroFormacion->nombre) }}</p>
                        </td>
                        <td>
                            <p>{{ ucfirst($participante->centroFormacion->regional->nombre) }}</p>
                        </td>
                        <td>
                            @if ($participante->pivot && $participante->pivot->rol_sennova)
                                <p>{{ $rolesSennova->where('value', $participante->pivot->rol_sennova)->first() ? $rolesSennova->where('value', $participante->pivot->rol_sennova)->first()['label'] : 'Sin información registrada' }}</p>
                            @else
                                <p>Sin información registrada</p>
                            @endif
                        </td>
                        <td>
                            <p>{{ $participante->pivot->cantidad_meses }}</p>
                        </td>
                        <td>
                            <p>{{ $participante->pivot->cantidad_horas }}</p>
                        </td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    </div>
    @if ($proyecto->semillerosInvestigacion->count() > 0)
        <div class="border">
            <h4>Semilleros de investigación</h4>
            <table width="100%" border="1" cellspacing="0" cellpadding="3" style="border-top: none; font-size: 10px;">
                <thead slot="thead">
                    <tr>
                        <th>Nombre</th>
                        <th>Línea de investigación</th>
                        <th>Grupo de investigación</th>
                    </tr>
                </thead>
                <tbody slot="tbody">
                    @foreach ($proyecto->semillerosInvestigacion as $semilleroInvestigacion)
                        <tr>
                            <td>
                                <p>{{ ucfirst($semilleroInvestigacion->nombre) }}</p>
                            </td>
                            <td>
                                <p>{{ ucfirst($semilleroInvestigacion->lineaInvestigacion->nombre) }}</p>
                            </td>
                            <td>
                                <p>{{ ucfirst($semilleroInvestigacion->lineaInvestigacion->grupoInvestigacion->nombre) }}</p>
                            </td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        </div>
    @endif

    @if ($proyecto->proyectoLinea70 || $proyecto->proyectoLinea69)

        <hr style="margin: 4rem 0">

        <h1>Articulación SENNOVA</h1>
    @endif

    @if ($proyecto->proyectoLinea69)
        <h4>Comente la articulación y aporte del TecnoParque proyectada para el {{ $convocatoria->year +  1 }} a los semilleros y grupos de investigación</h4>
        <p>{{ $datos->aportacion_semilleros_grupos }}</p>

        <h4>¿Cómo proyecta la articulación en el {{ $convocatoria->year +  1 }}, el Tecnoparque con la línea de Servicios Tecnológicos?</h4>
        <p>{{ $datos->proyeccion_con_st }}</p>

        <h4>¿Cómo proyecta la articulación en el {{ $convocatoria->year +  1 }}, el Tecnoparque con la línea de Extensionismo Tecnológico?</h4>
        <p>{{ $datos->proyeccion_extensionismo_tecnologico }}</p>

        <h4>¿Cómo proyecta la articulación en el {{ $convocatoria->year +  1 }}, el Tecnoparque con los centros de desarrollo empresarial de la Regional?</h4>
        <p>{{ $datos->proyeccion_centros_desarrollo }}</p>

        <h4>¿Cómo proyecta en el {{ $convocatoria->year +  1 }}, el Tecnoparque contribuir a la formación en la Regional o en el SENA?</h4>
        <p>{{ $datos->proyeccion_formacion_regional }}</p>

    @endif


    @if ($proyecto->proyectoLinea70)

        <h4>Líneas de Investigación en las cuales se están ejecutando iniciativas o proyectos de la TecnoAcademia</h4>
        @foreach ($proyecto->lineasInvestigacion()->orderBy('nombre')->get() as $lineaInvestigacion)
            <li>{{ ucfirst($lineaInvestigacion->nombre) }}</li>
        @endforeach

        <h4>Grupos de investigación en los cuales está vinculada la TecnoAcademia</h4>
        @foreach ($proyecto->gruposInvestigacion()->orderBy('nombre')->get() as $grupoInvestigacion)
            <li>{{ ucfirst($grupoInvestigacion->nombre) }}</li>
        @endforeach

        <h4>¿Está la TecnoAcademia articulada con un semillero?</h4>
        <p>{{ $datos->articulacion_semillero ? 'Si' : 'No' }}</p>

        <h4>Semillero(s) de investigación de la TecnoAcademia</h4>
        @foreach ($proyecto->semillerosInvestigacion()->orderBy('nombre')->get() as $semilleroInvestigacion)
            <li>{{ ucfirst($semilleroInvestigacion->nombre) }}</li>
        @endforeach

        <h4>Proyectos o iniciativas en ejecución en el año {{ $convocatoria->year }}</h4>
        @foreach ($proyecto->proyectoLinea70->proyectosIdiTecnoacademia()->orderBy('titulo')->get() as $proyectoIdiTecnoacademia)
            <li>{{ ucfirst($proyectoIdiTecnoacademia->titulo) }}</li>
        @endforeach

        <h4>Semilleros en proceso de formalización</h4>
        @foreach (json_decode($datos->semilleros_en_formalizacion) as $semilleroEnFormalizacion)
            <li>{{ $semilleroEnFormalizacion->value }}</li>
        @endforeach

        <h4>Disciplinas de la subárea de conocimiento</h4>
        @foreach ($proyecto->proyectoLinea70->disciplinasSubareaConocimiento()->orderBy('nombre')->get() as $disciplinaSubareaConocimiento)
            <li>{{ ucfirst($disciplinaSubareaConocimiento->nombre) }}</li>
        @endforeach

        <h4>Redes de conocimiento</h4>
        @foreach ($proyecto->proyectoLinea70->redesConocimiento()->orderBy('nombre')->get() as $redConocimiento)
            <li>{{ ucfirst($redConocimiento->nombre) }}</li>
        @endforeach

        <h4>¿En cuáles actividades económicas se puede aplicar el proyecto?</h4>
        @foreach ($proyecto->proyectoLinea70->actividadesEconomicas()->orderBy('nombre')->get() as $actividadEconomica)
            <li>{{ ucfirst($actividadEconomica->nombre) }}</li>
        @endforeach

        <h4>Temáticas estratégica SENA</h4>
        @foreach ($proyecto->proyectoLinea70->tematicasEstrategicas()->orderBy('nombre')->get() as $tematicaEstrategica)
            <li>{{ ucfirst($tematicaEstrategica->nombre) }}</li>
        @endforeach

        @if (!empty($datos->proyectos_ejecucion))
            <h4>Proyectos o iniciativas en ejecución en el año {{ $convocatoria->year - 2 }}</h4>
            <p>{{ $datos->proyectos_ejecucion }}</p>
        @endif

        <hr style="margin: 4rem 0">

        <h1>Articulación con el Centro de Formación</h1>

        @if (!empty($datos->articulacion_centro_formacion))
            <h4>Articulación con el centro de formación</h4>
            <p>{{ $datos->articulacion_centro_formacion }}</p>
        @endif

        @if (!empty($datos->articulacion_programas_centro))
            <h4>¿Articulación de la TecnoAcademia en los programas de formación del Centro?</h4>
            <p>{{ $datos->articulacion_programas_centro }}</p>
        @endif

        @if (!empty($datos->articulacion_bienestar_aprendiz))
            <h4>¿Articulación de la TecnoAcademia en las acciones de Bienestar al aprendiz del Centro?</h4>
            <p>{{ $datos->articulacion_bienestar_aprendiz }}</p>
        @endif

        @if (!empty($datos->favorecimiento_ruta_formacion))
            <h4>¿Acciones conjuntas definidas con el equipo de Articulación con la Media del Centro para favorecer la ruta de formación desde la TecnoAcademia?</h4>
            <p>{{ $datos->favorecimiento_ruta_formacion }}</p>
        @endif

        @if (!empty($datos->lineas_medulares_centro))
            <h4>Líneas medulares del Centro con las que se articula la TecnoAcademia</h4>
            <p>{{ $datos->lineas_medulares_centro }}</p>
        @endif

    @endif

    <hr style="margin: 4rem 0">

    <h1>Problema central</h1>

    <div style="background-color: rgb(15, 169, 105); padding: 20px; color: rgba(255, 255, 255, 0.912); font-weight: bolder; text-align: center;">
        <p>{{ $datos->problema_central }}</p>
    </div>

    @if (!empty($datos->planteamiento_problema))
        <h4>Planteamiento del problema</h4>
        <p>{{ $datos->planteamiento_problema }}</p>
    @endif
    @if (!empty($datos->justificacion_problema))
        <h4>Justificación del problema</h4>
        <p>{{ $datos->justificacion_problema }}</p>
    @endif

    @if (!empty($datos->identificacion_problema))
        <h4>Identificación y descripción del problema</h4>
        <p>{{ $datos->identificacion_problema }}</p>
    @endif

    @if (!empty($datos->pregunta_formulacion_problema))
        <h4>Pregunta de formulación del problema</h4>
        <p>{{ $datos->pregunta_formulacion_problema }}</p>
    @endif

    <h1>Objetivo general</h1>
    <div style="background-color: rgb(15, 25, 169); padding: 20px; color: rgba(255, 255, 255, 0.912); font-weight: bolder; text-align: center;">
        <p>{{ $datos->objetivo_general }}</p>
    </div>

    <hr style="margin: 4rem 0">

    <h1>Efectos directos e indirectos | Restulados e impactos</h1>
    <ul>
        @foreach ($proyecto->efectosDirectos as $j => $efectoDirecto)
            @php
                $valor = 1;
                $valorResultado = 1;
            @endphp
            <li style="margin-top: 4rem;">
                <div style="position: relative; top: -1rem;">
                    <div style="margin-top: 2rem; font-size: 10px;">
                        <div style="background-color: rgb(15, 128, 169); padding: 20px; color: rgba(255, 255, 255, 0.712); font-weight: bolder; text-align: center;">
                            <p style="margin: 0px; font-size: 10px; text-align: center;">Efecto directo #{{ $j + 1 }} </p>
                            {{ $efectoDirecto->descripcion }}
                        </div>
                        @foreach ($efectoDirecto->efectosindirectos as $k => $efectoIndirecto)
                            <div style="background-color: rgb(15, 128, 169,{{ $valor }}); padding: 20px; margin-left: 2rem;" >
                                <p style="margin: 0px; font-size: 10px;">Efecto indirecto #{{ ($j + 1) .'.'. ($k + 1) }}</p>
                                {{ $efectoIndirecto->descripcion }}
                            </div>
                            @php
                                $valor -= 0.105;
                            @endphp
                        @endforeach
                    </div>

                    <p style="margin: 5rem 0;">El efecto directo <strong>"{{ $efectoDirecto->descripcion }}"</strong> se convierte en el siguiente resultado:<br><small>(Los efectos indirectos se convierten en los impactos.)</small></p>

                    <div style="margin-top: 2rem; font-size: 10px;">
                        <div style="background-color: rgb(169, 154, 15); padding: 20px; color: rgba(255, 255, 255, 0.712); font-weight: bolder; text-align: center;">
                            <p style="margin: 0px; font-size: 10px; text-align: center; font-weight: bold;">Resultado #{{ $j + 1 }} </p>
                            {{ $efectoDirecto->resultado->descripcion }}
                        </div>
                        @foreach ($efectoDirecto->efectosindirectos as $k => $efectoIndirecto)
                            <div style="background-color: rgb(169, 154, 15,{{ $valorResultado }}); padding: 20px; margin-left: 2rem;" >
                                <p style="margin: 0px; font-size: 10px;">Impacto #{{ ($j + 1) .'.'. ($k + 1) }}</p>
                                {{ $efectoIndirecto->impacto->descripcion }}
                            </div>
                            @php
                                $valorResultado -= 0.105;
                            @endphp
                        @endforeach
                    </div>

                </div>
            </li>
        @endforeach
    </ul>

    <hr style="margin: 4rem 0">

    <h1>Causas directas e indirectas | Objetivos específicos y actividades</h1>
    <ul>
        @foreach ($proyecto->causasDirectas as $j => $causaDirecta)
            @php
                $valor = 1;
            @endphp
            <li style="margin-top: 4rem;">
                <div style="position: relative; top: -1rem;">
                    <div style="margin-top: 2rem; font-size: 10px;">
                        <div style="background-color: rgb(15, 169, 105); padding: 20px; color: rgba(255, 255, 255, 0.712); font-weight: bolder; text-align: center;">
                            <p style="margin: 0px; font-size: 10px; text-align: center;">Causa directa #{{ $j + 1 }} </p>
                            {{ $causaDirecta->descripcion }}
                        </div>
                        @foreach ($causaDirecta->causasIndirectas as $k => $causaIndirecta)
                        <div style="background-color: rgb(17, 182, 113,{{ $valor }}); padding: 20px; margin-left: 2rem;" >
                                <p style="margin: 0px; font-size: 10px;">Causa indirecta #{{ ($j + 1) .'.'. ($k + 1) }}</p>
                                {{ $causaIndirecta->descripcion }}
                            </div>
                            @php
                                $valor -= 0.105;
                            @endphp
                        @endforeach
                    </div>
                </div>

                <p style="margin: 5rem 0;">La causa directa <strong>"{{ $causaDirecta->descripcion }}"</strong> se convierte en el siguiente objetivo específico:<br><small>(Las causas indirectas se convierten en las actividades.)</small></p>

                <div style="margin-top: 2rem; font-size: 10px;">
                    <div style="background-color: rgb(15, 110, 169); padding: 20px; color: rgba(255, 255, 255, 0.712); font-weight: bolder; text-align: center;">
                        <p style="margin: 0px; font-size: 10px; text-align: center;">Objetivo específico #{{ $j + 1 }} </p>
                        {{ $causaDirecta->objetivoEspecifico->descripcion }}
                    </div>
                    @foreach ($causaDirecta->causasIndirectas as $k => $causaIndirecta)
                        <div style="background-color: rgb(15, 110, 169,{{ $valor }}); padding: 20px; margin-left: 2rem;" >
                            <p style="margin: 0px; font-size: 10px;">Actividad #{{ ($j + 1) .'.'. ($k + 1) }}</p>
                            {{ $causaIndirecta->actividad->descripcion }}
                            <p>Costo de la actividad: ${{ number_format($causaIndirecta->actividad->costo_actividad, 0, ',', '.') }}</p>
                        </div>
                        @php
                            $valor -= 0.105;
                        @endphp
                    @endforeach
                </div>
            </li>
        @endforeach
    </ul>

    <hr style="margin: 4rem 0">

    <div class="border page_break">
        <h4 style="text-align:center">Productos</h4>

        @foreach ($proyecto->efectosDirectos as $efectoDirecto)
            @foreach ($efectoDirecto->resultado->productos as $producto)
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
                            <th align="left" width="15%">Indicador</th>
                            <td colspan="3">{{ $producto->indicador }}</td>
                        </tr>
                        @if (!empty($producto->productoIdi))
                            <tr>
                                <th align="left" width="15%">Subtipologia Minciencias</th>
                                <td colspan="3">{{ $producto->productoIdi->subtipologiaMinciencias->nombre }}</td>
                            </tr>
                        @endif
                        @if (!empty($producto->productoTaTp))
                            <tr>
                                <th align="left" width="15%">Valor proyectado</th>
                                <td colspan="3">{{ $producto->productoTaTp->valor_proyectado }}</td>
                            </tr>
                        @endif
                        @if (!empty($producto->productoCulturaInnovacion))
                            <tr>
                                <th align="left" width="15%">Subtipología Minciencias</th>
                                <td colspan="3">
                                    {{ $producto->productoCulturaInnovacion->subtipologiaMinciencias->tipologiaMinciencias->nombre }}<br>
                                    {{ $producto->productoCulturaInnovacion->subtipologiaMinciencias->nombre }}<br>
                                    {{ $producto->productoCulturaInnovacion->medio_verificacion }}
                                </td>
                            </tr>
                        @endif
                        @if (!empty($producto->productoServicioTecnologico))
                            <tr>
                                <th align="left" width="15%">Medio de verificación</th>
                                <td colspan="3">{{ $producto->productoServicioTecnologico->medio_verificacion }}</td>
                            </tr>
                            <tr>
                                <th align="left" width="15%">Nombre del Indicador del producto</th>
                                <td colspan="3">{{ $producto->productoServicioTecnologico->nombre_indicador }}</td>
                            </tr>
                            <tr>
                                <th align="left" width="15%">Fórmula del Indicador del producto</th>
                                <td colspan="3">{{ $producto->productoServicioTecnologico->formula_indicador }}</td>
                            </tr>
                        @endif

                        @if ($producto->actividades->count() > 0)
                            <tr>
                                <th align="left" width="15%">Actividades</th>
                                <td colspan="3">
                                    <ul>
                                        @foreach ($producto->actividades as $actividad)
                                            <li>{{ $actividad->descripcion }}</li>
                                        @endforeach
                                    </ul>
                                </td>
                            </tr>
                        @endif
                    </tbody>
                </table>
            @endforeach
        @endforeach
    </div>

    <div class="border page_break">
        <h4 style="text-align:center">Análisis de riesgos</h4>

        @foreach ($proyecto->analisisRiesgos as $riesgo)
            <table width="100%" border="1" cellspacing="0" cellpadding="3" style="margin-top: 3rem; font-size: 10px;">
                <tbody slot="thead">
                    <tr>
                        <th align="left" width="15%">Nivel de riesgo</th>
                        <td>{{ $riesgo->nivel }}</td>
                        <th align="left" width="15%">Tipo de riesgo</th>
                        <td>{{ $riesgo->tipo }}</td>
                    </tr>
                    <tr>
                        <th align="left" width="15%">Descripción</th>
                        <td colspan="3">{{ $riesgo->descripcion }}</td>
                    </tr>
                    <tr>
                        <th align="left" width="15%">Probabilidad</th>
                        <td>{{ $riesgo->probabilidad }}</td>
                        <th align="left" width="15%">Impactos</th>
                        <td>{{ $riesgo->impacto }}</td>
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

    @if ($proyecto->inventarioEquipos->count() > 0)
        <div class="border page_break">
            <h1>Inventario de equipos</h1>

            @foreach ($proyecto->inventarioEquipos as $equipo)
                <table width="100%" border="1" cellspacing="0" cellpadding="3" style="margin-top:20px; font-size: 10px;">
                    <tbody slot="thead">
                        <tr>
                            <th align="left" width="15%">Nombre</th>
                            <td>{{ $equipo->nombre }}</td>
                            <th align="left" width="15%">Marca</th>
                            <td>{{ $equipo->marca }}</td>
                        </tr>
                        <tr>
                            <th align="left" width="15%">Serial</th>
                            <td>{{ $equipo->serial }}</td>
                            <th align="left" width="15%">Código interno</th>
                            <td>{{ $equipo->codigo_interno }}</td>
                        </tr>
                        <tr>
                            <th align="left" width="15%">Fecha de adquisición</th>
                            <td>{{ $equipo->fecha_adquisicion }}</td>
                            <th align="left" width="15%">Estado</th>
                            <td>{{ $estadosInventarioEquipos->where('value', $equipo->estado)->first() ? $estadosInventarioEquipos->where('value', $equipo->estado)->first()['label'] : '' }}</td>
                        </tr>
                        <tr>
                            <th align="left" width="15%">¿Uso exclusivo de Servicios tecnológicos?</th>
                            <td>{{ $equipo->uso_st == 1 ? 'Si' : 'No' }}</td>
                            <th align="left" width="15%">¿Otra dependencia que usa el equipo?</th>
                            <td>
                                {{ $equipo->uso_otra_dependencia == 1 ? 'Si' : 'No' }}
                                @if ($equipo->uso_otra_dependencia == 1)
                                    <br>Dependencia: $equipo->dependencia
                                @endif
                            </td>
                        </tr>
                        <tr>
                            <th align="left" width="15%">Descripción</th>
                            <td colspan="3">{{ $equipo->descripcion }}</td>
                        </tr>

                        <tr>
                            <th align="left" width="15%">¿Para el próximo año el equipo necesita mantenimiento?</th>
                            <td>{{ $equipo->mantenimiento_prox_year == 1 ? 'Si' : 'No' }}</td>
                            <th align="left" width="15%">¿Para el próximo año el equipo necesita calibración?</th>
                            <td>{{ $equipo->calibracion_prox_year == 1 ? 'Si' : 'No' }}</td>
                        </tr>
                    </tbody>
                </table>
            @endforeach
        </div>
    @endif

    @if (!empty($proyecto->entidadesAliadas) && $proyecto->entidadesAliadas()->count() > 0)
        <h4 style="text-align:center">Entidades Aliadas</h4>
        <table width="100%" border="1" cellspacing="0" cellpadding="3" style="margin-top:20px; font-size: 10px;">
            <tbody slot="thead">
                @foreach ($proyecto->entidadesAliadas as $entidad)
                    <tr>
                        <th align="left" width="30%">Tipo de entidad aliada: {{ $entidad->tipo }} ({{ $entidad->naturaleza }})</th>
                        <td>
                            {{ $entidad->nombre }} ({{ $entidad->tipo_empresa }}) - NIT: {{ $entidad->nit }}
                        </td>
                    </tr>
                    @if (!empty($entidad->entidadAliadaLinea66))
                        <tr>
                            <th>Descripcion convenio</th>
                            <td>{{ $entidad->entidadAliadaLinea66->descripcion_convenio }}</td>
                        </tr>
                        <tr>
                            <th>Grupo de Investigación</th>
                            <td>{{ $entidad->entidadAliadaLinea66->codigo_gruplac }} - {{ $entidad->entidadAliadaLinea66->grupo_investigacion }} <br> {{ $entidad->entidadAliadaLinea66->enlace_gruplac }}</td>
                        </tr>
                        <tr>
                            <th>Recursos en especie</th>
                            <td>${{ number_format($entidad->entidadAliadaLinea66->recursos_especie, 0, ',', '.') }}</td>
                        </tr>
                        <tr>
                            <th>Descripción en especie aportados</th>
                            <td>{{ $entidad->entidadAliadaLinea66->descripcion_recursos_especie }}</td>
                        </tr>
                        <tr>
                            <th>Recursos en dinero</th>
                            <td>${{ number_format($entidad->entidadAliadaLinea66->recursos_dinero, 0, ',', '.') }}</td>
                        </tr>
                        <tr>
                            <th>Descripción destinación del dinero aportado</th>
                            <td>{{ $entidad->entidadAliadaLinea66->descripcion_recursos_dinero }}</td>
                        </tr>
                        <tr>
                            <th>Metodología o actividades de tranferencia al centro de formación</th>
                            <td>{{ $entidad->entidadAliadaLinea66->actividades_transferencia_conocimiento }}</td>
                        </tr>
                        <tr>
                            <th>Anexos</th>
                            <td>
                                <ul>
                                    <li>ANEXO 7. Carta de intención o acta que soporta el trabajo articulado con entidades aliadas (diferentes al SENA) <a href="{{ route('convocatorias.proyectos.entidades-aliadas.download-file-sharepoint', [$convocatoria->id, $proyecto->id, $entidad->id, 'carta_intencion']) }}">{{ route('convocatorias.proyectos.entidades-aliadas.download-file-sharepoint', [$convocatoria->id, $proyecto->id, $entidad->id, 'carta_intencion']) }}</a></li>
                                    <li>ANEXO 8. Propiedad intelectual <a href="{{ route('convocatorias.proyectos.entidades-aliadas.download-file-sharepoint', [$convocatoria->id, $proyecto->id, $entidad->id, 'carta_propiedad_intelectual']) }}">{{ route('convocatorias.proyectos.entidades-aliadas.download-file-sharepoint', [$convocatoria->id, $proyecto->id, $entidad->id, 'carta_propiedad_intelectual']) }}</a></li>
                                </ul>
                            </td>
                        </tr>
                        <tr>
                            <th>Actividades</th>
                            <td>
                                <ul>
                                    @foreach ($entidad->actividades as $actividadEntidad)
                                        <li>{{ $actividadEntidad->descripcion }}</li>
                                    @endforeach
                                </ul>
                            </td>
                        </tr>
                        <tr>
                            <th>Miembros de la entidad aliada</th>
                            <td>
                                <ul>
                                    @foreach ($entidad->miembrosEntidadAliada as $miembroEntidad)
                                        <li>{{ $miembroEntidad->nombre }} - {{ $miembroEntidad->email }} - {{ $miembroEntidad->numero_celular }}</li>
                                    @endforeach
                                </ul>
                            </td>
                        </tr>
                    @endif

                    @if (!empty($entidad->entidadAliadaTa))
                        <tr>
                            <th>Fechas de vigencia Convenio/Acuerdos</th>
                            <td>Inicio: {{ $entidad->entidadAliadaTa->fecha_inicio_convenio }} Fin: {{ $entidad->entidadAliadaTa->fecha_fin_convenio }}</td>
                        </tr>
                        <tr>
                            <th>Anexos</th>
                            <td>
                                <ul>
                                    <li>Convenio <a href="{{ route('convocatorias.proyectos.entidades-aliadas.download-file-sharepoint', [$convocatoria->id, $proyecto->id, $entidad->id, 'soporte_convenio']) }}">{{ route('convocatorias.proyectos.entidades-aliadas.download-file-sharepoint', [$convocatoria->id, $proyecto->id, $entidad->id, 'soporte_convenio']) }}</a></li>
                                </ul>
                            </td>
                        </tr>
                    @endif
                @endforeach
            </tbody>
        </table>
    @endif

    @if (!empty($proyecto->proyectoLinea70) && $proyecto->proyectoLinea70->edt()->count() > 0)
        <h4 style="text-align:center">EDT</h4>
        <table width="100%" border="1" cellspacing="0" cellpadding="3" style="margin-top:20px; font-size: 10px;">
            <tbody slot="thead">
                @foreach ($proyecto->proyectoLinea70->edt as $edt)
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
                            <p>Presupuesto: ${{ number_format($edt->proyectoPresupuesto->valor_total, 0, ',', '.') }}</p>
                            <p>{{ $edt->proyectoPresupuesto->descripcion }}</p>
                            <p>{{ $edt->proyectoPresupuesto->justificacion }}</p>
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

    <h1>Anexos</h1>
    <div>
        <table width="100%" border="1" cellspacing="0" cellpadding="3" style="margin-top:20px; font-size: 10px;">
            <tbody slot="thead">
                @forelse ($proyectoAnexo as $anexo)
                    <tr>
                        <th align="left" width="30%">{{ $anexo->nombre }}</th>
                        <td>
                            {{ empty($anexo->archivo) ? 'N/A' : '' }}
                            @if (!empty($anexo->archivo))
                                <a href="{{ route('convocatorias.proyectos.proyecto-anexos.download-file-sharepoint', ['proyecto' => $proyecto->id, 'convocatoria' => $convocatoria->id, 'proyecto_anexo' => $anexo, 'tipo_archivo' => 'archivo']) }}" target="blank" download>
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                                    </svg>
                                    {{ route('convocatorias.proyectos.proyecto-anexos.download-file-sharepoint', ['proyecto' => $proyecto->id, 'convocatoria' => $convocatoria->id, 'proyecto_anexo' => $anexo, 'tipo_archivo' => 'archivo']) }}
                                </a>
                            @endif
                        </td>
                    </tr>

                    @empty
                    <p>No hay anexos cargados</p>
                @endforelse
            </tbody>
        </table>
    </div>

    <hr style="margin: 4rem 0">

    <div class="page_break">
        <h2 style="text-align: center;">Presupuesto ${{ number_format($proyecto->precio_proyecto, 0, ',', '.') }} COP</h2>
        @foreach ($proyecto->proyectoPresupuesto as $presupuesto)
            <table width="100%" border="1" cellspacing="0" cellpadding="3" style="margin-top: 20px; font-size: 10px;">
                <tbody slot="tbody">
                    <tr>
                        <th colspan="3" class="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full">
                            Información
                            <span style="display: inline; font-size: 8px; background-color:rgb(15, 169, 105); padding: 0.5rem 1rem; font-weight: bolder; border-radius: 100%;">PRE-{{ $presupuesto->id }}</span>
                        </th>
                    </tr>
                    <tr>
                        <td align="left">
                            <small style="font-weight: bold;">Concepto interno SENA</small>
                            <div>
                                {{ $presupuesto->convocatoriaPresupuesto->presupuestoSennova->segundoGrupoPresupuestal->nombre }}
                            </div>
                        </td>
                        <td align="left">
                            <small style="font-weight: bold;">Rubro</small>
                            <div>
                                {{ $presupuesto->convocatoriaPresupuesto->presupuestoSennova->tercerGrupoPresupuestal->nombre }}
                            </div>
                        </td>
                        <td align="left">
                            <small style="font-weight: bold;">Uso presupuestal</small>
                            <div>
                                {{ $presupuesto->convocatoriaPresupuesto->presupuestoSennova->usoPresupuestal->descripcion }}
                            </div>
                        </td>
                    </tr>

                    <tr>
                        <td colspan="3">
                            <p style="font-weight: bold;">Descripción</p>
                            <p>{{ $presupuesto->descripcion }}</p>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="3">
                            <p style="font-weight: bold;">Justificación</p>
                            <p>{{ $presupuesto->justificacion }}</p>
                        </td>
                    </tr>
                    @if ($presupuesto->convocatoriaPresupuesto->presupuestoSennova->requiere_estudio_mercado || $presupuesto->codigo_uso_presupuestal == '020202008005096')
                        <tr>
                            <td colspan="3">Archivos</td>
                        </tr>
                        <tr>
                            <td colspan="3">
                                <ul>
                                    @foreach ($presupuesto->soportesEstudioMercado as $soporte)
                                        <li>
                                            @if ($presupuesto->formato_estudio_mercado)
                                                {{ $soporte->empresa }}
                                            @endif
                                            <a href="">{{ route('convocatorias.proyectos.presupuesto.soportes.download-file-sharepoint', [$convocatoria->id, $proyecto->id, $presupuesto->id, $soporte->id, 'soporte']) }}</a>
                                        </li>
                                    @endforeach
                                </ul>
                            </td>
                        </tr>
                    @endif
                    @if ($presupuesto->codigo_uso_presupuestal == '2010100600203101' || !empty($presupuesto->softwareInfo))
                        <tr>
                            <td colspan="3">Información del Software</td>
                        </tr>
                        <tr>
                            <td>
                                <p class="title">Tipo de licencia</p>
                                <p>{{ $tiposLicencia->where('value', $presupuesto->softwareInfo->tipo_licencia)->first() ? $tiposLicencia->where('value', $presupuesto->softwareInfo->tipo_licencia)->first()['label'] : '' }}</p>
                            </td>
                            <td>
                                <p class="title">Tipo de software</p>
                                <p>{{ $tiposSoftware->where('value', $presupuesto->softwareInfo->tipo_software)->first() ? $tiposSoftware->where('value', $presupuesto->softwareInfo->tipo_software)->first()['label'] : '' }}</p>
                            </td>
                            <td>
                                <p class="title">Fecha de inicio y fin</p>
                                <p>desde: {{ $presupuesto->softwareInfo->fecha_inicio }}{{ !empty($presupuesto->softwareInfo->fecha_finalizacion) ? ' al ' . $presupuesto->softwareInfo->fecha_finalizacion : '' }}</p>
                            </td>
                        </tr>
                    @endif
                    @if ($presupuesto->codigo_uso_presupuestal == '2020200800901' || !empty($presupuesto->servicioEdicionInfo))
                        <tr>
                            <td><b>Nodo editorial</b></td>
                            <td colspan="2">{{ $presupuesto->servicioEdicionInfo->info }}</td>
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
								<p>{{ $rolSENNOVA->descripcion }}</p>
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

    <hr style="margin: 4rem 0">

    <h4>Bibliografía</h4>
    <p>{{ $datos->bibliografia }}</p>
</body>
</html>
