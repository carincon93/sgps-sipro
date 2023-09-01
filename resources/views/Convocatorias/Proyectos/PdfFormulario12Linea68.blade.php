<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>PDF {{ $proyecto->codigo }}</title>

    <style>
        * {
            font-family: Roboto, Arial;
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
                <p style="font-weight: bold;">Centro de formación y Línea Técnica</p>
            </td>
            <td align="left">
                {{ $tipo_proyecto_linea68->firstWhere('value', $datos->tipo_proyecto_linea_68_id)['label'] }}
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
                <p style="font-weight: bold;">Nombre del área técnica</p>
            </td>
            <td align="left">
                <p style="white-space: pre-wrap; text-transform: capitalize;">{{ $datos->nombre_area_tecnica }}</p>
            </td>
        </tr>

        <tr>
            <td align="left">
                <p style="font-weight: bold;">Estado del sistema de gestión</p>
            </td>
            <td align="left">
                <p style="white-space: pre-wrap">{{ $datos->estadoSistemaGestion->estado }}</p>
            </td>
        </tr>

         @if ($datos->sector_productivo)
            <tr>
                <td align="left">
                    <p style="font-weight: bold;">Estrategia SENA priorizada</p>
                </td>
                <td align="left">
                    <p style="white-space: pre-wrap">{{ $sectores_productivos->firstWhere('value', $datos->sector_productivo)['label'] }}</p>
                </td>
            </tr>
        @endif

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

    <h2>Relacione el último proyecto con el que fue financiada la operación del área técnica en la cual se desarrollará el proyecto en {{ $convocatoria->year }}</h2>
    <p style="white-space: pre-wrap">{{ $datos->continuidad }}</p>

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
        <h4>Nombre de los programas de formación con registro calificado con los que se relaciona el proyecto</h4>
        <ul>
            <li>
                @foreach ($proyecto->programasFormacion()->where('registro_calificado', true)->get() as $programa_formacion)
                    <li>{{ ucfirst($programa_formacion->nombre)}}</li>
                @endforeach
            </li>
        </ul>
    @endif

    @if ( $datos->municipios_influencia && count($datos->municipios_influencia) > 0 )
        <h4>Zonas de influencia</h4>
        <ul>
            <li>
                @foreach ($municipios->whereIn('id', $datos->municipios_influencia) as $municipio)
                    <li>{{ ucfirst($municipio->nombre)}}</li>
                @endforeach
            </li>
        </ul>
    @endif

    @if ( $datos->otras_zonas_influencia )
        <h4>Otras zonas de influencia (Veredas, corregimientos)</h4>
        <p style="white-space: pre-wrap">{{ $datos->otras_zonas_influencia }}</p>
    @endif

    <h1 className="mt-24 mb-8 text-center text-3xl">Especificaciones e infraestructura</h1>

    @if ($datos->especificaciones_area)
        <h2>¿Cuenta con infraestructura adecuada y propia para el funcionamiento de la línea servicios tecnológicos en el centro de formación?</h2>
        <p style="white-space: pre-wrap">{{ $datos->infraestructura_adecuada ? 'Si' : 'No' }}</p>
    @endif

    @if ($datos->especificaciones_area)
        <h2>Especificaciones e infraestructura</h2>
        <p style="white-space: pre-wrap">{{ $datos->especificaciones_area }}</p>
    @endif

    @if ($datos->video)
        <p style="font-weight: bold;">Enlace del video de las instalaciones donde se desarrollan las actividades de la línea servicios tecnológicos. (Youtube, Vídeo en Google Drive con visualización pública)</p>
        <a target="_blank" href="{{ $datos->video }}">{{ $datos->video }}</a>
    @endif

    <h4>Bibliografía</h4>
    <p style="white-space: pre-wrap; overflow-wrap: break-word">{{ $datos->bibliografia }}</p>

    <hr style="margin: 4rem 0">

    <h1>Problema central</h1>

    <div style="background-color: rgb(15, 169, 105); padding: 20px; color: rgba(255, 255, 255, 0.912); font-weight: bolder; text-align: center;">
        <p style="white-space: pre-wrap">{{ $datos->problema_central }}</p>
    </div>

    @if (!empty($datos->planteamiento_problema))
        <h4>Planteamiento del problema</h4>
        <p style="white-space: pre-wrap">{{ $datos->planteamiento_problema }}</p>
    @endif
    @if (!empty($datos->justificacion_problema))
        <h4>Justificación del problema</h4>
        <p style="white-space: pre-wrap">{{ $datos->justificacion_problema }}</p>
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
    <div style="background-color: rgb(15, 25, 169); padding: 20px; color: rgba(255, 255, 255, 0.912); font-weight: bolder; text-align: center;">
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
                                <div style="background-color: rgb(16, 137, 87); height: 4rem; padding: 20px; color: white;">
                                    <p style="margin: 0px; font-size: 10px;">{{ ($j + 1) .'.'. ($k + 1) }} Causa indirecta</p>
                                    {{ $causa_indirecta->descripcion }}
                                </div>
                            </td>
                            <td width="50%">
                                <div style="background-color: rgb(15, 169, 105); height: 4rem; padding: 20px; color: white;" >
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
        @if ($proyecto->proyectoFormulario5Linea69)
            <h4>A continuación, describa la metodología que será implementada en el {{ $convocatoria->year + 1 }} en el nodo para lograr los objetivos propuestos en cada una de las etapas definidas para los Tecnoparques:</h4>
        @else
            <h2>Metodología local</h2>
        @endif
        <p style="white-space: pre-wrap">{{ $datos->metodologia_local }}</p>
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
                                <td><b>Nodo editorial</b></td>
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
