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
                <p style="font-weight: bold;">Línea de investigación</p>
            </td>
            <td align="left">
                <p style="white-space: pre-wrap">{{ $datos->lineaInvestigacion->nombre }} </p>
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
                <p style="font-weight: bold;">Red de conocimiento</p>
            </td>
            <td align="left">
                <p style="white-space: pre-wrap">{{ $datos->redConocimiento->nombre }} </p>
            </td>
        </tr>

        <tr>
            <td align="left">
                <p style="font-weight: bold;">Disciplina de conocimiento</p>
            </td>
            <td align="left">
                <p style="white-space: pre-wrap">{{ $datos->disciplinaSubareaConocimiento->nombre }} </p>
            </td>
        </tr>

        <tr>
            <td align="left">
                <p style="font-weight: bold;">¿En cuál de estas actividades económicas se puede aplicar el proyecto?</p>
            </td>
            <td align="left">
                <p style="white-space: pre-wrap">{{ $datos->actividadEconomica->nombre }} </p>
            </td>
        </tr>

        <tr>
            <td align="left">
                <p style="font-weight: bold;">Temática estratégica SENA</p>
            </td>
            <td align="left">
                <p style="white-space: pre-wrap">{{ $datos->tematicaEstrategica->nombre }} </p>
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

    @if ($datos->justificacion_industria_4)
        <h1>Justificación de la relación con la industria 4.0</h1>
        <p style="white-space: pre-wrap">{{ $datos->justificacion_industria_4 }}</p>
    @endif

    @if ($datos->justificacion_economia_naranja)
        <h1 style="margin: 4rem 2rem;">Justificación de la relación con la economía naranja</h1>

        <p style="white-space: pre-wrap">{{ $datos->justificacion_economia_naranja }}</p>
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
        <p style="white-space: pre-wrap">{{ $datos->atencion_pluralista_diferencial }}</p>
    @endif

    <h4>¿El proyecto se formuló en conjunto con la tecnoacademia?</h4>
    @if ($proyecto->tecnoacademiaLineasTecnoacademia()->exists())
        <ul>
             @foreach ($proyecto->tecnoacademiaLineasTecnoacademia as $tecnoacademiaLineaTecnoacademia)
                <li>{{ ucfirst($tecnoacademiaLineaTecnoacademia->lineaTecnoacademia->nombre) . '-' . ucfirst($tecnoacademiaLineaTecnoacademia->tecnoacademia->nombre) }}</li>
            @endforeach
        </ul>
    @else
        <p style="white-space: pre-wrap; overflow-wrap: break-word">No</p>
    @endif

    <hr style="margin: 4rem 0">

    <h4>En la ejecución del proyecto se requiere la recolección de especímenes de especies silvestres de la diversidad biológica con fines de elaboración de estudios ambientales (entendiendo como recolección los procesos de remoción o extracción temporal o definitiva de una especie ya sea vegetal o animal del medio natural) Nota: este permiso no se requiere cuando las actividades de recolección se limiten a investigaciones científicas o con fines industriales, comerciales o de prospección biológica.</h4>
    <p style="white-space: pre-wrap">{{ $datos->recoleccion_especimenes ? 'Si' : 'No' }}</p>

    @if ($datos->aporta_a_campesena)
        <hr style="margin: 4rem 0">
        <p style="font-weight: bold;">¿El proyecto aporta a CAMPESENA?</p>
        <p style="white-space: pre-wrap">{{ $datos->aporta_a_campesena ? 'Si' : 'No' }}</p>
    @endif

    @if ($datos->video)
        <hr style="margin: 4rem 0">
        <p style="font-weight: bold;">¿El proyecto tiene video?</p>
        <a target="_blank" href="{{ $datos->video }}">{{ $datos->video }}</a>
    @endif

    @if ($datos->justificacion_relacion_campesena)
        <hr style="margin: 4rem 0">
        <p style="font-weight: bold;">¿El proyecto está relacionado con la estratégia institucional CAMPESENA?</p>
        <p style="white-space: pre-wrap"><strong>Justificación: </strong> {{ $datos->justificacion_relacion_campesena }}</p>
    @endif

    @if ($datos->lineas_estrategicas_convocatoria)
        <hr style="margin: 4rem 0">
        <p style="font-weight: bold;">¿El proyecto se vincula con alguna de las líneas estrategicas de la convocatoria?</p>

        <ul>
            @foreach ($datos->lineas_estrategicas_convocatoria as $linea_estrategica)
                <li>{{ $lineas_estrategicas->firstWhere('value', $linea_estrategica)['label'] }}</li>
            @endforeach
        </ul>

        @if ($datos->justificacion_lineas_estrategicas)
            <p style="white-space: pre-wrap"><strong>Justificación: </strong> {{ $datos->justificacion_lineas_estrategicas }}</p>
        @endif
    @endif

    @if ($datos->aporta_a_campesena)
        <hr style="margin: 4rem 0">
        <p style="font-weight: bold;">¿El proyecto tendrá impacto regional?</p>
        <p style="white-space: pre-wrap">{{ $datos->justificacion_impacto_regional ? 'Si' : 'No' }}</p>
    @endif

    <hr style="margin: 4rem 0">

    <h4>¿El proyecto se alinea con las Mesas Sectoriales?</h4>
    @if ($proyecto->mesasSectoriales()->exists())
        <ul>
            @foreach ($proyecto->mesasSectoriales as $mesa_sectorial)
                <li>{{ ucfirst($mesa_sectorial->nombre) }}</li>
            @endforeach
        </ul>
    @else
        <p style="white-space: pre-wrap; overflow-wrap: break-word">No</p>
    @endif

    <hr style="margin: 4rem 0">

    <h4>¿El proyecto se alinea con el plan tecnológico desarrollado por el centro de formación?</h4>
    <p style="white-space: pre-wrap; overflow-wrap: break-word">@if ($datos->relacionado_plan_tecnologico) Si @else No @endif</p>

    <hr style="margin: 4rem 0">

    <h4>¿El proyecto se alinea con las Agendas Departamentales de Competitividad e Innovación?</h4>
    <p style="white-space: pre-wrap; overflow-wrap: break-word">@if ($datos->relacionado_agendas_competitividad) Si @else No @endif</p>

    <hr style="margin: 4rem 0">

    <h4>¿El proyecto se alinea con las Mesas Sectoriales?</h4>
    @if ($proyecto->mesasSectoriales()->exists())
        <ul>
            @foreach ($proyecto->mesasSectoriales as $mesa_sectorial)
                <li>{{ ucfirst($mesa_sectorial->nombre) }}</li>
            @endforeach
        </ul>
    @else
        <p style="white-space: pre-wrap; overflow-wrap: break-word">No</p>
    @endif

    <hr style="margin: 4rem 0">

    <h4>¿El proyecto se formuló en conjunto con la tecnoacademia?</h4>
    @if ($proyecto->tecnoacademiaLineasTecnoacademia()->exists())
        <ul>
             @foreach ($proyecto->tecnoacademiaLineasTecnoacademia as $tecnoacademiaLineaTecnoacademia)
                <li>{{ ucfirst($tecnoacademiaLineaTecnoacademia->lineaTecnoacademia->nombre) . '-' . ucfirst($tecnoacademiaLineaTecnoacademia->tecnoacademia->nombre) }}</li>
            @endforeach
        </ul>
    @else
        <p style="white-space: pre-wrap; overflow-wrap: break-word">No</p>
    @endif

    @if ($datos->lineas_estrategicas_beneficiadas)
        <hr style="margin: 4rem 0">
        <p style="font-weight: bold;">¿El proyecto aporta a la divulgación y apropiación del conocimiento relacionado con los retos que incorporan las líneas estratégicas de la Convocatoria?</p>

        <ul>
            @foreach ($datos->lineas_estrategicas_beneficiadas as $linea_estrategica)
                <li>{{ $lineas_estrategicas->firstWhere('value', $linea_estrategica)['label'] }}</li>
            @endforeach
        </ul>

        <p style="white-space: pre-wrap"><strong>Justificación: </strong>{{ $datos->justificacion_lineas_estrategicas_beneficiadas }}</p>
    @endif

    <hr style="margin: 4rem 0">

    <h1>Indicadores</h1>

    <h4>Productividad y competitividad del (los) beneficiario(s) final(es) del proyecto</h4>
    @if (!empty($datos->productividad_beneficiaros))
        <p style="white-space: pre-wrap">{{ $datos->productividad_beneficiaros }}</p>
    @else
        <p>Sin información registrada</p>
    @endif

    <h4>Generación o mantenimiento de empleo por parte del (los) beneficiario(s) del proyecto</h4>
    @if (!empty($datos->generacion_empleo_beneficiarios))
        <p style="white-space: pre-wrap">{{ $datos->generacion_empleo_beneficiarios }}</p>
    @else
        <p>Sin información registrada</p>
    @endif

    <h4>Creación de nuevas empresas y diseño y desarrollo de nuevos productos, procesos o servicios</h4>
    @if (!empty($datos->creacion_nuevos_desarrollos))
        <p style="white-space: pre-wrap">{{ $datos->creacion_nuevos_desarrollos }}</p>
    @else
        <p>Sin información registrada</p>
    @endif

    <h4>Incorporación de nuevos conocimientos y competencias laborales en el talento humano en la(s) empresa(s) beneficiaria(s) del proyecto</h4>
    @if (!empty($datos->generacion_conocimientos_beneficiarios))
        <p style="white-space: pre-wrap">{{ $datos->generacion_conocimientos_beneficiarios }}</p>
    @else
        <p>Sin información registrada</p>
    @endif

    <h4>Generación de valor agregado en la(s) entidad(es) beneficiaria(s) del proyecto</h4>
    @if (!empty($datos->generacion_valor_beneficiarios))
        <p style="white-space: pre-wrap">{{ $datos->generacion_valor_beneficiarios }}</p>
    @else
        <p>Sin información registrada</p>
    @endif

    <h4>Fortalecimiento de programas de formación del Sena</h4>
    @if (!empty($datos->generacion_valor_beneficiarios))
        <p style="white-space: pre-wrap">{{ $datos->fortalecimiento_programas_formacion }}</p>
    @else
        <p>Sin información registrada</p>
    @endif

    <h4>Transferencia de tecnologías al Sena y a los sectores productivos relacionados</h4>
    @if (!empty($datos->transferencia_tecnologias))
        <p style="white-space: pre-wrap">{{ $datos->transferencia_tecnologias }}</p>
    @else
        <p>Sin información registrada</p>
    @endif

    <h4>Cobertura, calidad y pertinencia de la formación</h4>
    @if (!empty($datos->calidad_formacion))
        <p style="white-space: pre-wrap">{{ $datos->calidad_formacion }}</p>
    @else
        <p>Sin información registrada</p>
    @endif

    <h4>Impacto ambiental de Proyectos de Innovación e investigación aplicada</h4>
    @if (!empty($datos->impacto_ambiental_proyectos))
        <p style="white-space: pre-wrap">{{ $datos->impacto_ambiental_proyectos }}</p>
    @else
        <p>Sin información registrada</p>
    @endif

    <hr style="margin: 4rem 0">

    <h1 style="margin: 4rem 2rem;">¿Cuál es el origen de las muestras con las que se realizarán las actividades de investigación, bioprospección y/o aprovechamiento comercial o industrial?</p>
    @if ($datos->muestreo == 1)
        <p style="white-space: pre-wrap">Especies Nativas. (es la especie o subespecie taxonómica o variedad de animales cuya área de disposición geográfica se extiende al territorio nacional o a aguas jurisdiccionales colombianas o forma parte de los mismos comprendidas las especies o subespecies que migran temporalmente a ellos, siempre y cuando no se encuentren en el país o migren a él como resultado voluntario o involuntario de la actividad humana. Pueden ser silvestre, domesticada o escapada de domesticación incluyendo virus, viroides y similares)</p>

        <h3>¿Qué actividad pretende realizar con la especie nativa?</h3>
            @if ($datos->actividades_muestreo == '1.1.1')
            <p style="white-space: pre-wrap">Separación de las unidades funcionales y no funcionales del ADN y el ARN, en todas las formas que se encuentran en la naturaleza.</p>
        @elseif($datos->actividades_muestreo == '1.1.2')
            <p style="white-space: pre-wrap">Aislamiento de una o varias moléculas, entendidas estas como micro y macromoléculas, producidas por el metabolismo de un organismo.</p>
        @elseif($datos->actividades_muestreo == '1.1.3')
            <p style="white-space: pre-wrap">Solicitar patente sobre una función o propiedad identificada de una molécula, que se ha aislado y purificado.</p>
        @elseif($datos->actividades_muestreo == '1.1.4')
            <p style="white-space: pre-wrap">No logro identificar la actividad a desarrollar con la especie nativa</p>
        @endif

        <h3>¿Cuál es la finalidad de las actividades a realizar con la especie nativa/endémica?</h3>

        @if ($datos->objetivo_muestreo == '1.2.1')
            <p style="white-space: pre-wrap">Investigación básica sin fines comerciales.</p>
        @elseif($datos->objetivo_muestreo == '1.2.2')
            <p style="white-space: pre-wrap">Bioprospección en cualquiera de sus fases.</p>
        @elseif($datos->objetivo_muestreo == '1.2.3')
            <p style="white-space: pre-wrap">Comercial o Industrial.</p>
        @endif
    @elseif($datos->muestreo == 2)
        <p style="white-space: pre-wrap">Especies Introducidas. (son aquellas que no son nativas de Colombia y que ingresaron al país por intervención humana)</p>
    @elseif($datos->muestreo == 3)
        <p style="white-space: pre-wrap">Recursos genéticos humanos y sus productos derivados</p>
    @elseif($datos->muestreo == 4)
        <p style="white-space: pre-wrap">Intercambio de recursos genéticos y sus productos derivados, recursos biológicos que los contienen o los componentes asociados a estos. (son aquellas que realizan las comunidades indígenas, afroamericanas y locales de los Países Miembros de la Comunidad Andina entre sí y para su propio consumo, basadas en sus prácticas consuetudinarias)</p>
    @elseif($datos->muestreo == 5)
        <p style="white-space: pre-wrap">Recurso biológico que involucren actividades de sistemática molecular, ecología molecular, evolución y biogeografía molecular (siempre que el recurso biológico se haya colectado en el marco de un permiso de recolección de especímenes de especies silvestres de la diversidad biológica con fines de investigación científica no comercial o provenga de una colección registrada ante el Instituto Alexander van Humboldt)</p>
    @elseif($datos->muestreo == 6)
        <p style="white-space: pre-wrap">No aplica</p>
    @endif

    <hr style="margin: 4rem 0">

    <h2>Resumen del proyecto</h2>
    <p style="white-space: pre-wrap">{{ $datos->resumen }}</p>

    <h2>Antecedentes</h2>
    <p style="white-space: pre-wrap">{{ $datos->antecedentes }}</p>

    <h4>Marco conceptual</h4>
    <p style="white-space: pre-wrap">{{ $datos->marco_conceptual }}</p>

    <hr style="margin: 4rem 0">

    <h4>Número de aprendices que se beneficiarán en la ejecución del proyecto</h4>
    <p style="white-space: pre-wrap">{{ $datos->numero_aprendices }}</p>

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

    @if ($datos->veredas_corregimientos)
        <table width="100%" border="1" cellspacing="0" cellpadding="3" style="margin-top: 4rem;">
            <tr>
                <th width="100%" style="font-weight: bold;">Veredas/Corregimientos beneficiados</th>
            </tr>
            <tr>
                <td width="100%">
                    <p style="white-space: pre-wrap">{{ implode(', ', array_column(json_decode($datos->veredas_corregimientos), 'value')) }}</p>
                </td>
            </tr>
        </table>
    @endif

    <h4>Descripción del beneficio en los municipios o corregimientos</h4>
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

    @if (!empty($datos->impacto_centro_formacion))
        <h4>Impacto en el centro de formación</h4>
        <p style="white-space: pre-wrap">{{ $datos->impacto_centro_formacion }}</p>
    @endif

    <h4>Semilleros de investigación vinculados al proyecto</h4>
    <ul>
        @foreach ($proyecto->semillerosInvestigacion()->orderBy('nombre')->get() as $semillero_investigacion)
            <li>{{ ucfirst($semillero_investigacion->nombre) }}</li>
        @endforeach
    </ul>

    <h4>Bibliografía</h4>
    <p style="white-space: pre-wrap; overflow-wrap: break-word">{{ $datos->bibliografia }}</p>

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

    <h1>Metodología</h1>
    <p style="white-space: pre-wrap">{{ $datos->metodologia }}</p>

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
                        <th align="left" width="30%">Descipción del convenio</th>
                        <td>
                            {{ $entidad->entidadAliadaLinea66_82->descripcion_convenio }}
                        </td>
                    </tr>

                    @if ($entidad->entidadAliadaLinea66_82->grupo_investigacion)
                        <tr>
                            <th align="left" width="30%">Grupo de investigación</th>
                            <td>
                                {{ $entidad->entidadAliadaLinea66_82->grupo_investigacion }}
                            </td>
                        </tr>

                        <tr>
                            <th align="left" width="30%">Código del GrupLAC</th>
                            <td>
                                {{ $entidad->entidadAliadaLinea66_82->codigo_gruplac }}
                            </td>
                        </tr>

                        <tr>
                            <th align="left" width="30%">Enlace del GrupLAC</th>
                            <td>
                                {{ $entidad->entidadAliadaLinea66_82->enlace_gruplac }}
                            </td>
                        </tr>
                    @endif

                    <tr>
                        <th align="left" width="30%">Recursos en especie entidad aliada ($COP)</th>
                        <td>
                            {{ $entidad->entidadAliadaLinea66_82->recursos_especie }}
                        </td>
                    </tr>

                    <tr>
                        <th align="left" width="30%">Descripción de los recursos en especie aportados</th>
                        <td>
                            {{ $entidad->entidadAliadaLinea66_82->descripcion_recursos_especie }}
                        </td>
                    </tr>

                    <tr>
                        <th align="left" width="30%">Recursos en dinero entidad aliada ($COP)</th>
                        <td>
                            {{ $entidad->entidadAliadaLinea66_82->recursos_dinero }}
                        </td>
                    </tr>

                    <tr>
                        <th align="left" width="30%">Descripción de la destinación del dinero aportado</th>
                        <td>
                            {{ $entidad->entidadAliadaLinea66_82->descripcion_recursos_dinero }}
                        </td>
                    </tr>

                    <tr>
                        <th align="left" width="30%">Metodología o actividades de transferencia al centro de formación</th>
                        <td>
                            {{ $entidad->entidadAliadaLinea66_82->actividades_transferencia_conocimiento }}
                        </td>
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
