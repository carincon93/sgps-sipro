<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>SGPS-SIPRO - {{ $ambienteModernizacion->seguimientoAmbienteModernizacion->codigo }}</title>
    <!-- Fonts -->
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700&amp;display=swap">
    <!-- Styles -->
    <link rel="stylesheet" href="/css/app.css">
    <style>
        /** Define the margins of your page **/
        @page {
            margin: 230px 25px 60px 25px;
            font-family: 'Nunito', Roboto, Arial;
        }

        header {
            position: fixed;
            top: -210px;
            left: 0px;
            right: 0px;
            height: 150px;

            /** Extra personal styles **/
            text-align: center;
            line-height: 12px;
        }

        footer {
            position: fixed;
            bottom: -40px;
            left: 0px;
            right: 0px;
            height: 50px;

            /** Extra personal styles **/
            text-align: center;
            line-height: 35px;
        }

        body main {
            font-size: 12px;
        }

        .title {
            font-weight: bold;
        }

        .border {
            border: 1px solid black;
            padding: 3px;
        }

        .rotate90 {
            transform: rotate(90deg);
            margin-top: 0.8in;
        }

        .page_break {
            page-break-before: always;
        }
    </style>
</head>

<body>
    <!-- Define header and footer blocks before your content -->
    <header>
        <table width="100%" border="1" cellspacing="0" cellpadding="10">
            <tr>
                <td rowspan="2" valign="middle" align="center" width="20%">
                    <div>
                        <img src="{{ asset('images/Sena_Colombia_logo.png') }}" alt="Logo SENA">
                    </div>
                </td>
                <td valign="middle" align="center">
                    <p>Proyecto - SGPS-SIPRO <br> <small>Código del proyecto: {{ $ambienteModernizacion->seguimientoAmbienteModernizacion->codigo }}</small></p>
                    <br>
                    Fecha de diligenciamiento: {{ $ambienteModernizacion->fecha_seguimiento }}
                    <br>
                    Autor: {{ $ambienteModernizacion->dinamizadorSennova->nombre }}
                </td>
            </tr>
            <tr>
                <td valign="middle" align="center">
                    <p><small>{{ $ambienteModernizacion->nombre_ambiente }}</small></p>
                </td>
            </tr>
        </table>
    </header>

    <footer>
        <small>Copyright - SGPS-SIPRO &copy; <?php echo date('Y'); ?> </small>
    </footer>

    <!-- Wrap the content of your PDF inside a main tag -->
    <main>
        <table width="100%" border="1" cellspacing="0" cellpadding="10" style="margin-top: 10px;">
            <tr>
                <td width="40%">
                    <p><small>Regional:</small></p>
                </td>
                <td width="60%">
                    <p><small style="text-transform: capitalize;">{{ $ambienteModernizacion->seguimientoAmbienteModernizacion->centroFormacion->regional->nombre }}</small></p>
                </td>
            </tr>
            <tr>
                <td width="40%">
                    <p><small>Centro de formación:</small></p>
                </td>
                <td width="60%">
                    <p><small>{{ $ambienteModernizacion->seguimientoAmbienteModernizacion->centroFormacion->nombre }}</small></p>
                </td>
            </tr>
            <tr>
                <td width="40%">
                    <p><small>Año de modernización:</small></p>
                </td>
                <td width="60%">
                    <p><small>{{ $ambienteModernizacion->year_modernizacion }}</small></p>
                </td>
            </tr>
            <tr>
                <td width="40%">
                    <p><small>Código proyecto SGPS:</small></p>
                </td>
                <td width="60%">
                    <p>
                        <small>
                            {{ $ambienteModernizacion->seguimientoAmbienteModernizacion->codigoProyectoSgps->titulo }}
                            <br>
                            Código: SGPS-{{ $ambienteModernizacion->seguimientoAmbienteModernizacion->codigoProyectoSgps->codigo_sgps }}
                            <br>
                            Año: {{ $ambienteModernizacion->seguimientoAmbienteModernizacion->codigoProyectoSgps->year_ejecucion }}
                        </small>
                    </p>
                </td>
            </tr>
            <tr>
                <td width="40%">
                    <p><small>Tipologías de los ambientes (Circular 3-2018- 143):</small></p>
                </td>
                <td width="60%">
                    <p>
                        <small>
                            {{ $ambienteModernizacion->tipologiaAmbiente->tipo }}
                        </small>
                    </p>
                </td>
            </tr>
            <tr>
                <td width="40%">
                    <p><small>Área de conocimiento relacionada con el ambiente modernizado por Sennova:</small></p>
                </td>
                <td width="60%">
                    <p>
                        <small>
                            {{ $ambienteModernizacion->disciplinaSubareaConocimiento->subareaConocimiento->areaConocimiento->nombre }}
                        </small>
                    </p>
                </td>
            </tr>
            <tr>
                <td width="40%">
                    <p><small>Subárea relacionada con el ambiente modernizado por Sennova:</small></p>
                </td>
                <td width="60%">
                    <p>
                        <small>
                            {{ $ambienteModernizacion->disciplinaSubareaConocimiento->subareaConocimiento->nombre }}
                        </small>
                    </p>
                </td>
            </tr>
            <tr>
                <td width="40%">
                    <p><small>Disciplina relacionada con el ambiente modernizado por Sennova:</small></p>
                </td>
                <td width="60%">
                    <p>
                        <small>
                            {{ $ambienteModernizacion->disciplinaSubareaConocimiento->nombre }}
                        </small>
                    </p>
                </td>
            </tr>
            <tr>
                <td width="40%">
                    <p><small>Red de conocimiento relacionada con el ambiente modernizado por Sennova (resolución 335 de 2012):</small></p>
                </td>
                <td width="60%">
                    <p>
                        <small>
                            {{ $ambienteModernizacion->redConocimiento->nombre }}
                        </small>
                    </p>
                </td>
            </tr>
            <tr>
                <td width="40%">
                    <p><small>Código CIIU relacionado con el ambiente modernizado por Sennova:</small></p>
                </td>
                <td width="60%">
                    <p>
                        <small>
                            {{ $ambienteModernizacion->actividadEconomica->nombre }}
                        </small>
                    </p>
                </td>
            </tr>
            <tr>
                <td width="40%">
                    <p><small>Temática estratégica SENA relacionada con el ambiente modernizado por Sennova:</small></p>
                </td>
                <td width="60%">
                    <p>
                        <small>
                            {{ $ambienteModernizacion->tematicaEstrategica->nombre }}
                        </small>
                    </p>
                </td>
            </tr>
            <tr>
                <td width="40%">
                    <p><small>Línea investigación relacionada con el ambiente modernizado por Sennova:</small></p>
                </td>
                <td width="60%">
                    <p>
                        <small>
                            {{ $ambienteModernizacion->lineaInvestigacion->nombre }}
                        </small>
                    </p>
                </td>
            </tr>
            <tr>
                <td width="40%">
                    <p><small>¿El proyecto se alinea con las Mesas Sectoriales?</small></p>
                </td>
                <td width="60%">
                    <p>
                        <small>
                            {{ $ambienteModernizacion->alineado_mesas_sectoriales ? 'Si' : 'No' }}
                        </small>
                    </p>
                </td>
            </tr>
            @if ($ambienteModernizacion->alineado_mesas_sectoriales)
                <tr>
                    <td width="40%">
                        <p><small>Lista de Mesas Sectoriales?</small></p>
                    </td>
                    <td width="60%">
                        <ul>
                            @forelse ($ambienteModernizacion->mesasSectoriales as $mesaSectorial)
                                <li>{{ $mesaSectorial->nombre }}</li>
                            @empty
                                <li>Sin información registrada</li>
                            @endforelse
                        </ul>
                    </td>
                </tr>
            @endif
            <tr>
                <td width="40%">
                    <p><small>¿El ambiente de formación ha sido financiado en más de una vigencia por Sennova?</small></p>
                </td>
                <td width="60%">
                    <p>
                        <small>
                            {{ $ambienteModernizacion->financiado_anteriormente ? 'Si' : 'No' }}
                        </small>
                    </p>
                </td>
            </tr>
            <tr>
                <td width="40%">
                    <p><small>Relacione el número de técnicas o tecnologías adquiridas y/o mejoradas con el ambiente de aprendizaje, modernizado por SENNOVA:</small></p>
                </td>
                <td width="60%">
                    <p>
                        <small>
                            {{ $ambienteModernizacion->numero_tecnicas_tecnologias }}
                        </small>
                    </p>
                </td>
            </tr>
            @if ($ambienteModernizacion->financiado_anteriormente)
                <tr>
                    <td width="40%">
                        <p><small>Si la respuesta anterior fue afirmativa, relacione los códigos y nombres de los proyectos beneficiados y/o ejecutados en el ambiente modernizado por Sennova de convocatoria (SGPS) o de capacidad instalada (CAP):</small></p>
                    </td>
                    <td width="60%">
                        <ul>
                            @forelse ($ambienteModernizacion->codigosProyectosSgps as $codigoSgps)
                                <li>
                                    {{ $codigoSgps->titulo }}
                                    <br>
                                    Código: SGPS-{{ $codigoSgps->codigo_sgps }}
                                    <br>
                                    Año: {{ $codigoSgps->year_ejecucion }}
                                </li>
                            @empty
                                <li>Sin información registrada</li>
                            @endforelse
                        </ul>
                    </td>
                </tr>
            @endif
            <tr>
                <td width="40%">
                    <p><small>Estado general de maquinaria y equipo instalados en el ambiente de aprendizaje, modernizado por SENNOVA:</small></p>
                </td>
                <td width="60%">
                    <p>
                        <small>
                            {{ ($ambienteModernizacion->estado_general_maquinaria == 1 ? 'Bueno' : $ambienteModernizacion->estado_general_maquinaria == 2) ? 'Regular' : 'Malo' }}
                        </small>
                    </p>
                </td>
            </tr>
            @if ($ambienteModernizacion->estado_general_maquinaria == 2 || $ambienteModernizacion->estado_general_maquinaria == 3)
                <tr>
                    <td width="40%">
                        <p><small>Si la respuesta anterior fue regular o malo, describa la razón. Para mayor especificidad listar máquina por máquina para identificación a partir del tiempo de vida útil:</small></p>
                    </td>
                    <td width="60%">
                        <p>
                            <small>
                                {{ $ambienteModernizacion->razon_estado_general }}
                            </small>
                        </p>
                    </td>
                </tr>
            @endif
            <tr>
                <td width="40%">
                    <p><small>¿A la fecha el ambiente modernizado por Sennova está activo para realizar procesos de formación?</small></p>
                </td>
                <td width="60%">
                    <p>
                        <small>
                            {{ $ambienteModernizacion->ambiente_activo ? 'Si' : 'No' }}
                        </small>
                    </p>
                </td>
            </tr>
            @if ($ambienteModernizacion->ambiente_activo == false)
                <tr>
                    <td width="40%">
                        <p><small>Si la respuesta anterior fue negativa, justifique la respuesta</small></p>
                    </td>
                    <td width="60%">
                        <p>
                            <small>
                                {{ $ambienteModernizacion->justificacion_ambiente_inactivo }}
                            </small>
                        </p>
                    </td>
                </tr>
            @else
                <tr>
                    <td width="40%">
                        <p><small>Si la respuesta anterior fue afirmativa, seleccione los programas de formación con registro calificado beneficiados</small></p>
                    </td>
                    <td width="60%">
                        <ul>
                            @forelse ($ambienteModernizacion->programasFormacion()->where('registro_calificado', true)->get() as $programaFormacion)
                                <li>
                                    {{ $programaFormacion->nombre }}
                                    <br>
                                    Código: {{ $programaFormacion->codigo }}
                                </li>
                            @empty
                                <li>Sin información registrada</li>
                            @endforelse
                        </ul>
                    </td>
                </tr>

                <tr>
                    <td width="40%">
                        <p><small>Si la respuesta anterior fue afirmativa, seleccione los programas de formación beneficiados</small></p>
                    </td>
                    <td width="60%">
                        <ul>
                            @forelse ($ambienteModernizacion->programasFormacion()->where('registro_calificado', false)->get() as $programaFormacion)
                                <li>
                                    {{ $programaFormacion->nombre }}
                                    <br>
                                    Código: {{ $programaFormacion->codigo }}
                                </li>
                            @empty
                                <li>Sin información registrada</li>
                            @endforelse
                        </ul>
                    </td>
                </tr>
            @endif
            <tr>
                <td width="40%">
                    <p><small>¿A la fecha el ambiente modernizado por Sennova está activo para realizar procesos de investigación, desarrollo tecnológico y/o innovación con semilleros o programas de formación?</small></p>
                </td>
                <td width="60%">
                    <p>
                        <small>
                            {{ $ambienteModernizacion->ambiente_activo_procesos_idi ? 'Si' : 'No' }}
                        </small>
                    </p>
                </td>
            </tr>
            @if ($ambienteModernizacion->ambiente_activo_procesos_idi)
                <tr>
                    <td width="40%">
                        <p><small>Si la respuesta anterior fue afirmativa, relacione el número de proyectos beneficiados y/o ejecutados en el ambiente modernizado por Sennova</small></p>
                    </td>
                    <td width="60%">
                        <p>
                            <small>
                                {{ $ambienteModernizacion->numero_proyectos_beneficiados }}
                            </small>
                        </p>
                    </td>
                </tr>

                <tr>
                    <td width="40%">
                        <p><small>Si la respuesta anterior fue afirmativa, relacione los códigos y nombres de los proyectos beneficiados y/o ejecutados en el ambiente modernizado por Sennova</small></p>
                    </td>
                    <td width="60%">
                        <ul>
                            @if ($ambienteModernizacion->cod_proyectos_beneficiados)
                                @forelse (json_decode($ambienteModernizacion->cod_proyectos_beneficiados) as $proyectoBeneficiado)
                                    <li>
                                        {{ $proyectoBeneficiado->value }}
                                    </li>
                                @empty
                                    <li>Sin información registrada</li>
                                @endforelse
                            @else
                                <li>Sin información registrada</li>
                            @endif
                        </ul>
                    </td>
                </tr>

                <tr>
                    <td width="40%">
                        <p><small>Si la respuesta anterior fue afirmativa, relacione los semilleros de investigación beneficiados con el ambiente modernizado por Sennova</small></p>
                    </td>
                    <td width="60%">
                        <ul>
                            @forelse ($ambienteModernizacion->semillerosInvestigacion as $semilleroInvestigacion)
                                <li>
                                    {{ $semilleroInvestigacion->nombre }}
                                    <br>
                                    Centro de formación: {{ $semilleroInvestigacion->lineaInvestigacion->grupoInvestigacion->centroFormacion->nombre }}
                                </li>
                            @empty
                                <li>Sin información registrada</li>
                            @endforelse
                        </ul>
                    </td>
                </tr>
            @endif
            <tr>
                <td width="40%">
                    <p><small>¿El ambiente de formación ha generado formación complementaria después de la modernización con Sennova?</small></p>
                </td>
                <td width="60%">
                    <p>
                        <small>
                            {{ $ambienteModernizacion->ambiente_formacion_complementaria ? 'Si' : 'No' }}
                        </small>
                    </p>
                </td>
            </tr>

            @if ($ambienteModernizacion->ambiente_formacion_complementaria)
                <tr>
                    <td width="40%">
                        <p><small>Si la respuesta anterior fue afirmativa, relacione el número total de cursos complementarios que se ha brindado formación complementaria</small></p>
                    </td>
                    <td width="60%">
                        <p>
                            <small>
                                {{ $ambienteModernizacion->numero_total_cursos_comp }}
                            </small>
                        </p>
                    </td>
                </tr>

                <tr>
                    <td width="40%">
                        <p><small>Si la respuesta anterior fue afirmativa, relacione el número de cursos complementarios a empresas que se ha brindado formación complementaria</small></p>
                    </td>
                    <td width="60%">
                        <p>
                            <small>
                                {{ $ambienteModernizacion->numero_cursos_empresas }}
                            </small>
                        </p>
                    </td>
                </tr>

                <tr>
                    <td width="40%">
                        <p><small>Si la respuesta anterior fue afirmativa, relacione el NIT y nombre de las empresas (cuando aplique) que se ha brindada formación complementaria</small></p>
                    </td>
                    <td width="60%">
                        <ul>
                            @forelse (json_decode($ambienteModernizacion->datos_empresa) as $empresa)
                                <li>
                                    {{ $empresa->value }}
                                </li>
                            @empty
                                <li>Sin información registrada</li>
                            @endforelse
                        </ul>
                    </td>
                </tr>
                <tr>
                    <td width="40%">
                        <p><small>Si la respuesta anterior fue afirmativa, relacione el número total de personas certificadas de las empresas que se ha brindado formación complementaria</small></p>
                    </td>
                    <td width="60%">
                        <p>
                            <small>
                                {{ $ambienteModernizacion->numero_personas_certificadas }}
                            </small>
                        </p>
                    </td>
                </tr>

                <tr>
                    <td width="40%">
                        <p><small>Si la respuesta anterior fue afirmativa, relacione los códigos y nombres Sena de cada curso de formación complementario</small></p>
                    </td>
                    <td width="60%">
                        <ul>
                            @forelse (json_decode($ambienteModernizacion->cursos_complementarios) as $curso)
                                <li>
                                    {{ $curso->value }}
                                </li>
                            @empty
                                <li>Sin información registrada</li>
                            @endforelse
                        </ul>
                    </td>
                </tr>
            @endif

            <tr>
                <td width="40%">
                    <p><small>Diligencie la coordenada latitud (W) del ambiente de formación modernizado por Sennova (generado en Google maps). Ejemplo: -74.062916</small></p>
                </td>
                <td width="60%">
                    <p>
                        <small>
                            {{ $ambienteModernizacion->coordenada_latitud_ambiente }}
                        </small>
                    </p>
                </td>
            </tr>
            <tr>
                <td width="40%">
                    <p><small>Diligencie la coordenada longitud (N) del ambiente de formación modernizado por Sennova (generado en Google maps). Ejemplo: 4.643244</small></p>
                </td>
                <td width="60%">
                    <p>
                        <small>
                            {{ $ambienteModernizacion->coordenada_longitud_ambiente }}
                        </small>
                    </p>
                </td>
            </tr>
            <tr>
                <td width="40%">
                    <p><small>Describa el impacto generado en los procesos de formación:</small></p>
                </td>
                <td width="60%">
                    <p>
                        <small>
                            {{ $ambienteModernizacion->impacto_procesos_formacion }}
                        </small>
                    </p>
                </td>
            </tr>
            <tr>
                <td width="40%">
                    <p><small>Describa la pertinencia obtenida con el sector productivo:</small></p>
                </td>
                <td width="60%">
                    <p>
                        <small>
                            {{ $ambienteModernizacion->pertinencia_sector_productivo }}
                        </small>
                    </p>
                </td>
            </tr>
            <tr>
                <td width="40%">
                    <p><small>Relacione el número de publicaciones derivadas con el ambiente de aprendizaje después de ejecutar el proyecto de modernización SENNOVA:</small></p>
                </td>
                <td width="60%">
                    <p>
                        <small>
                            {{ $ambienteModernizacion->numero_publicaciones }}
                        </small>
                    </p>
                </td>
            </tr>
            <tr>
                <td width="40%">
                    <p><small>Relacione el número de aprendices beneficiados con el ambiente de aprendizaje después de ejecutar el proyecto de modernización SENNOVA:</small></p>
                </td>
                <td width="60%">
                    <p>
                        <small>
                            {{ $ambienteModernizacion->numero_aprendices_beneficiados }}
                        </small>
                    </p>
                </td>
            </tr>
            <tr>
                <td width="40%">
                    <p><small>Productividad y competitividad del (los) beneficiario(s) final(es) del proyecto:</small></p>
                </td>
                <td width="60%">
                    <p>
                        <small>
                            {{ $ambienteModernizacion->productividad_beneficiarios }}
                        </small>
                    </p>
                </td>
            </tr>
            <tr>
                <td width="40%">
                    <p><small>Creación de nuevas empresas y diseño y desarrollo de nuevos productos, procesos o servicios:</small></p>
                </td>
                <td width="60%">
                    <p>
                        <small>
                            {{ $ambienteModernizacion->creacion_empresas }}
                        </small>
                    </p>
                </td>
            </tr>
            <tr>
                <td width="40%">
                    <p><small>Incorporación de nuevos conocimientos y competencias laborales en el talento humano en la(s) empresa(s) beneficiaria(s) del proyecto:</small></p>
                </td>
                <td width="60%">
                    <p>
                        <small>
                            {{ $ambienteModernizacion->incorporacion_nuevos_conocimientos }}
                        </small>
                    </p>
                </td>
            </tr>
            <tr>
                <td width="40%">
                    <p><small>Generación de valor agregado en la(s) entidad(es) beneficiaria(s) del proyecto:</small></p>
                </td>
                <td width="60%">
                    <p>
                        <small>
                            {{ $ambienteModernizacion->valor_agregado_entidades }}
                        </small>
                    </p>
                </td>
            </tr>
            <tr>
                <td width="40%">
                    <p><small>Fortalecimiento de programas de formación del Sena:</small></p>
                </td>
                <td width="60%">
                    <p>
                        <small>
                            {{ $ambienteModernizacion->fortalecimiento_programas_formacion }}
                        </small>
                    </p>
                </td>
            </tr>
            <tr>
                <td width="40%">
                    <p><small>Transferencia de tecnologías al Sena y a los sectores productivos relacionados:</small></p>
                </td>
                <td width="60%">
                    <p>
                        <small>
                            {{ $ambienteModernizacion->transferencia_tecnologias }}
                        </small>
                    </p>
                </td>
            </tr>
            <tr>
                <td width="40%">
                    <p><small>Cobertura, calidad y pertinencia de la formación:</small></p>
                </td>
                <td width="60%">
                    <p>
                        <small>
                            {{ $ambienteModernizacion->cobertura_perntinencia_formacion }}
                        </small>
                    </p>
                </td>
            </tr>
            <tr>
                <td width="40%">
                    <p><small>Palabras claves relacionadas con el ambiente de formación modernizado por Sennova (Separados por coma):</small></p>
                </td>
                <td width="60%">
                    <ul>
                        @if ($ambienteModernizacion->palabras_clave_ambiente)
                            @forelse (json_decode($ambienteModernizacion->palabras_clave_ambiente) as $palabraClave)
                                <li>
                                    {{ $palabraClave->value }}
                                </li>
                            @empty
                                <li>Sin información registrada</li>
                            @endforelse
                        @else
                            <li>Sin información registrada</li>
                        @endif
                    </ul>
                </td>
            </tr>
            <tr>
                <td width="40%">
                    <p><small>Observaciones generales del ambiente modernizado por Sennova:</small></p>
                </td>
                <td width="60%">
                    <p>
                        <small>
                            {{ $ambienteModernizacion->observaciones_generales_ambiente }}
                        </small>
                    </p>
                </td>
            </tr>
            <tr>
                <td width="40%">
                    <p><small>Url del archivo formato (.pdf) con fotos del ambiente modernizado con el proyecto Sennova:</small></p>
                </td>
                <td width="60%">
                    <a href="{{ $ambienteModernizacion->soporte_fotos_ambiente }}" target="_blank">
                        {{ $ambienteModernizacion->soporte_fotos_ambiente }}
                    </a>
                </td>
            </tr>
        </table>
        <table width="100%" border="1" cellspacing="0" cellpadding="10" style="margin-top: 10px;">
            <tr>
                <td>
                    <p style="font-weight: bold; text-align: center;">Relacione únicamente los equipos y maquinaría adquirida con la ejecución del proyecto de modernización SENNOVA</p>
                </td>
            </tr>
        </table>

        @forelse ($ambienteModernizacion->equiposAmbienteModernizacion as $equipo)
            <table width="100%" border="1" cellspacing="0" cellpadding="10" style="margin-top: 10px;">
                <tr>
                    <td width="40%">
                        <p style="font-weight: bold;">Número de inventario SENA del equipo o maquina</p>
                        <p>{{ $equipo->numero_inventario_equipo }}</p>

                        <br>
                        <p style="font-weight: bold;">Nombre del equipo o maquina</p>
                        <p>{{ $equipo->nombre_equipo }}</p>

                        <br>
                        <p style="font-weight: bold;">Promedio de horas de uso al año</p>
                        <p>{{ $equipo->horas_promedio_uso }}</p>

                        <br>
                        <p style="font-weight: bold;">Marca</p>
                        <p>{{ $equipo->marca }}</p>

                        <p style="font-weight: bold;">Año de adquisición del equipo o maquina</p>
                        <p>{{ $equipo->year_adquisicion }}</p>

                        <br>
                        <p style="font-weight: bold;">Nombre del cuentadante</p>
                        <p>{{ $equipo->nombre_cuentadante }}</p>

                        <br>
                        <p style="font-weight: bold;">Cédula del cuentadante</p>
                        <p>{{ $equipo->cedula_cuentadante }}</p>

                        <br>
                        <p style="font-weight: bold;">Rol del cuentadante</p>
                        <p>{{ $equipo->rol_cuentadante }}</p>
                    </td>

                    <td width="60%">
                        <p style="font-weight: bold;">Descripción general técnica del equipo o maquina</p>
                        <p>{{ $equipo->descripcion_tecnica_equipo }}</p>

                        <br>
                        <p style="font-weight: bold;">Observaciones generales</p>
                        <p>{{ $equipo->observaciones_generales }}</p>

                        <br>
                        <p style="font-weight: bold;">Estado del equipo o maquina</p>
                        <p>{{ ($equipo->estado_equipo == 1 ? 'Bueno' : $equipo->estado_equipo == 2) ? 'Regular' : 'Malo' }}</p>

                        <br>
                        <p style="font-weight: bold;">¿El equipo o maquina está en funcionamiento?</p>
                        <p>{{ $equipo->equipo_en_funcionamiento ? 'Si' : 'No' }}</p>

                        <br>
                        <p style="font-weight: bold;">¿Con qué frecuencia requiere mantenimiento el equipo o maquina?</p>
                        <p>{{ $equipo->frecuencia_mantenimiento }}</p>
                    </td>
                </tr>
            </table>
        @empty
            <p>Sin información registrada</p>
        @endforelse
    </main>
</body>

</html>
