<script>
    import AuthenticatedLayout, { title } from '@/Layouts/Authenticated'
    import { useForm, page } from '@inertiajs/inertia-svelte'
    import { Inertia } from '@inertiajs/inertia'
    import { route, checkRole, checkPermission } from '@/Utils'
    import { _ } from 'svelte-i18n'

    import Button from '@/Shared/Button'
    import LoadingButton from '@/Shared/LoadingButton'
    import Stepper from '@/Shared/Stepper'
    import InfoMessage from '@/Shared/InfoMessage'
    import Dialog from '@/Shared/Dialog'
    import Export2Word from '@/Shared/Export2Word'

    import IdiForm from './IdiForm'

    export let errors
    export let convocatoria
    export let idi
    export let mesasSectoriales
    export let lineasProgramaticas
    export let redesConocimiento
    export let areasConocimiento
    export let subareasConocimiento
    export let disciplinasSubareaConocimiento
    export let actividadesEconomicas
    export let tematicasEstrategicas
    export let lineasTecnoacademia
    export let lineasInvestigacion
    export let tecnoacademias
    export let municipios
    export let tecnoacademia
    export let areasTematicasEni
    export let lineasInvestigacionEni
    export let gruposInvestigacion
    export let opcionesIDiDropdown
    export let proyectoMunicipios
    export let proyectoAreasTematicasEni
    export let proyectoLineasInvestigacionEni
    export let programasFormacionConRegistroCalificado
    export let programasFormacionSinRegistroCalificado
    export let mesasSectorialesRelacionadas
    export let lineasTecnoacademiaRelacionadas
    export let programasFormacionConRegistroRelacionados
    export let programasFormacionSinRegistroRelacionados

    $: $title = idi ? idi.titulo : null

    /**
     * Validar si el usuario autenticado es SuperAdmin
     */
    let authUser = $page.props.auth.user
    let isSuperAdmin = checkRole(authUser, [1])

    let proyectoDialogOpen = true

    let dialogGuardar = false
    let exportComponent

    let tieneVideo = idi.video != null
    let requiereJustificacionIndustria4 = idi.justificacion_industria_4 != null
    let requiereJustificacionEconomiaNaranja = idi.justificacion_economia_naranja != null
    let requiereJustificacionPoliticaDiscapacidad = idi.justificacion_politica_discapacidad != null
    let requiereJustificacionAntencionPluralista = idi.atencion_pluralista_diferencial != null
    let requiereJustificacionSectorAgricola = idi.impacto_sector_agricola != null

    let form = useForm({
        centro_formacion_id: idi.proyecto?.centro_formacion_id,
        linea_investigacion_id: idi.linea_investigacion_id,
        area_conocimiento_id: idi.disciplina_subarea_conocimiento.subarea_conocimiento.area_conocimiento_id,
        subarea_conocimiento_id: idi.disciplina_subarea_conocimiento.subarea_conocimiento_id,
        disciplina_subarea_conocimiento_id: idi.disciplina_subarea_conocimiento_id,
        tematica_estrategica_id: idi.tematica_estrategica_id,
        red_conocimiento_id: idi.red_conocimiento_id,
        linea_programatica_id: idi.proyecto?.linea_programatica_id,
        actividad_economica_id: idi.actividad_economica_id,
        grupo_investigacion_eni_id: { value: idi.grupo_investigacion_eni_id, label: gruposInvestigacion.find((item) => item.value == idi.grupo_investigacion_eni_id)?.label },
        titulo: idi.titulo,
        fecha_inicio: idi.fecha_inicio,
        fecha_finalizacion: idi.fecha_finalizacion,
        max_meses_ejecucion: idi.max_meses_ejecucion,
        video: idi.video,
        numero_aprendices: idi.numero_aprendices,
        municipios: proyectoMunicipios.length > 0 ? proyectoMunicipios : null,
        area_tematica_eni_id: proyectoAreasTematicasEni.length > 0 ? proyectoAreasTematicasEni : null,
        linea_investigacion_eni_id: proyectoLineasInvestigacionEni.length > 0 ? proyectoLineasInvestigacionEni : null,
        programas_formacion: programasFormacionConRegistroRelacionados.length > 0 ? programasFormacionConRegistroRelacionados : null,
        programas_formacion_articulados: programasFormacionSinRegistroRelacionados.length > 0 ? programasFormacionSinRegistroRelacionados : null,
        muestreo: idi.muestreo,
        actividades_muestreo: idi.actividades_muestreo,
        objetivo_muestreo: idi.objetivo_muestreo,
        recoleccion_especimenes: idi.recoleccion_especimenes,
        relacionado_plan_tecnologico: idi.relacionado_plan_tecnologico,
        relacionado_agendas_competitividad: idi.relacionado_agendas_competitividad,
        relacionado_mesas_sectoriales: idi.relacionado_mesas_sectoriales,
        relacionado_tecnoacademia: idi.relacionado_tecnoacademia,
        tecnoacademia_id: tecnoacademia?.id,
        proyecto_investigacion_pedagogica: idi.proyecto_investigacion_pedagogica,
        articulacion_eni: idi.articulacion_eni,
        justificacion_proyecto_investigacion_pedagogica: idi.justificacion_proyecto_investigacion_pedagogica,

        linea_tecnologica_id: lineasTecnoacademiaRelacionadas,
        mesa_sectorial_id: mesasSectorialesRelacionadas,

        resumen: idi.resumen,
        antecedentes: idi.antecedentes,
        marco_conceptual: idi.marco_conceptual,
        justificacion_industria_4: idi.justificacion_industria_4,
        justificacion_economia_naranja: idi.justificacion_economia_naranja,
        justificacion_politica_discapacidad: idi.justificacion_politica_discapacidad,
        atencion_pluralista_diferencial: idi.atencion_pluralista_diferencial,
        impacto_sector_agricola: idi.impacto_sector_agricola,
        bibliografia: idi.bibliografia,
        impacto_municipios: idi.impacto_municipios,
        impacto_centro_formacion: idi.impacto_centro_formacion,
    })

    let arrayLineasTecnoacademia = []
    async function submit() {
        if (idi.proyecto.allowed.to_update) {
            if ($form.relacionado_tecnoacademia?.value != 1) {
                $form.tecnoacademia_id = {}
                arrayLineasTecnoacademia = []
            }

            $form.put(route('convocatorias.idi.update', [convocatoria.id, idi.id]), {
                onFinish: () => {
                    dialogGuardar = false
                },
                preserveScroll: true,
            })
        }
    }

    $: if ($form.proyecto_investigacion_pedagogica == false || $form.articulacion_eni == false) {
        $form.grupo_investigacion_eni_id = null
        $form.linea_investigacion_eni_id = null
        $form.area_tematica_eni_id = null
    }
</script>

<AuthenticatedLayout>
    <header class="pt-[8rem]" slot="header">
        <Stepper {convocatoria} proyecto={idi} />
    </header>

    <form on:submit|preventDefault={submit} id="idi-form">
        <fieldset class="p-8 divide-y" disabled={idi.proyecto.allowed.to_update ? undefined : true}>
            <IdiForm
                {isSuperAdmin}
                {lineasProgramaticas}
                {gruposInvestigacion}
                {mesasSectoriales}
                {tecnoacademia}
                {idi}
                {convocatoria}
                {form}
                {errors}
                {redesConocimiento}
                {areasConocimiento}
                {subareasConocimiento}
                {disciplinasSubareaConocimiento}
                {actividadesEconomicas}
                {tematicasEstrategicas}
                {lineasTecnoacademia}
                {lineasInvestigacion}
                {tecnoacademias}
                {municipios}
                {areasTematicasEni}
                {lineasInvestigacionEni}
                {opcionesIDiDropdown}
                {programasFormacionConRegistroCalificado}
                {programasFormacionSinRegistroCalificado}
                {tieneVideo}
                {requiereJustificacionIndustria4}
                {requiereJustificacionEconomiaNaranja}
                {requiereJustificacionPoliticaDiscapacidad}
                {requiereJustificacionAntencionPluralista}
                {requiereJustificacionSectorAgricola}
            />

            {#if isSuperAdmin || idi.proyecto.mostrar_recomendaciones}
                <div class="py-24">
                    <h1>Ortografía</h1>
                    {#each idi.proyecto.evaluaciones as evaluacion, i}
                        {#if isSuperAdmin || (evaluacion.finalizado && evaluacion.habilitado)}
                            <div class="bg-zinc-900 p-4 rounded shadow text-white my-2">
                                <p class="text-xs">Evaluador COD-{evaluacion.id}:</p>
                                <p class="whitespace-pre-line text-xs">{evaluacion.idi_evaluacion.ortografia_comentario ? evaluacion.idi_evaluacion.ortografia_comentario : 'Sin recomendación'}</p>
                            </div>
                        {/if}
                    {/each}
                    {#if idi.proyecto.evaluaciones.length == 0}
                        <p class="whitespace-pre-line mt-4 text-xs">El proyecto no ha sido evaluado aún.</p>
                    {/if}
                </div>
            {/if}

            {#if isSuperAdmin || idi.proyecto.mostrar_recomendaciones}
                <div class="py-24">
                    <h1>Redacción</h1>
                    {#each idi.proyecto.evaluaciones as evaluacion, i}
                        {#if isSuperAdmin || (evaluacion.finalizado && evaluacion.habilitado)}
                            <div class="bg-zinc-900 p-4 rounded shadow text-white my-2">
                                <p class="text-xs">Evaluador COD-{evaluacion.id}:</p>
                                <p class="whitespace-pre-line text-xs">{evaluacion.idi_evaluacion.redaccion_comentario ? evaluacion.idi_evaluacion.redaccion_comentario : 'Sin recomendación'}</p>
                            </div>
                        {/if}
                    {/each}
                    {#if idi.proyecto.evaluaciones.length == 0}
                        <p class="whitespace-pre-line mt-4 text-xs">El proyecto no ha sido evaluado aún.</p>
                    {/if}
                </div>
            {/if}

            {#if isSuperAdmin || idi.proyecto.mostrar_recomendaciones}
                <div class="py-24">
                    <h1>Normas APA</h1>
                    {#each idi.proyecto.evaluaciones as evaluacion, i}
                        {#if isSuperAdmin || (evaluacion.finalizado && evaluacion.habilitado)}
                            <div class="bg-zinc-900 p-4 rounded shadow text-white my-2">
                                <p class="text-xs">Evaluador COD-{evaluacion.id}:</p>
                                <p class="whitespace-pre-line text-xs">{evaluacion.idi_evaluacion.normas_apa_comentario ? evaluacion.idi_evaluacion.normas_apa_comentario : 'Sin recomendación'}</p>
                            </div>
                        {/if}
                    {/each}
                    {#if idi.proyecto.evaluaciones.length == 0}
                        <p class="whitespace-pre-line mt-4 text-xs">El proyecto no ha sido evaluado aún.</p>
                    {/if}
                </div>
            {/if}
        </fieldset>

        <div>
            <InfoMessage>
                Se recomienda que antes de dar clic en el botón <strong>Guardar</strong> descargue el borrador de Generalidades en archivo Word. De esta manera si ocurre un error al guardar puede recuperar la información registrada. Luego de descargar el borrador de clic en el botón <strong>Guardar</strong>. Revise que se muestra un mensaje en verde que dice '<strong>
                    El recurso se ha modificado correctamente</strong
                >'. Si después de unos segundos no se muestra el mensaje y al recargar el aplicativo observa que la información no se ha guardado por favor envie un correo a <a href="mailto:sgpssipro@sena.edu.co" class="underline">sgpssipro@sena.edu.co</a>
                desde una cuenta <strong>@sena.edu.co</strong> y describa detalladamente lo ocurrido (Importante adjuntar el borrador e indicar el código del proyecto).
            </InfoMessage>
            <div class="shadow-inner bg-app-200 border-app-400 flex items-center justify-between mt-14 px-8 py-4">
                <small class="flex items-center text-app-700">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {idi.updated_at}
                </small>
                <Button type="button" on:click={() => (dialogGuardar = true)}>Descargar Generalidades en Word</Button>

                {#if idi.proyecto.allowed.to_update}
                    <LoadingButton loading={$form.processing} form="idi-form">Guardar información</LoadingButton>
                {:else}
                    <span class="inline-block ml-1.5"> El proyecto no se puede modificar </span>
                {/if}
            </div>
        </div>
    </form>

    <Dialog bind:open={proyectoDialogOpen} id="informacion">
        <div slot="title" class="flex items-center flex-col mt-4">
            <figure>
                <img src={window.basePath + '/images/proyecto.png'} alt="Proyecto" class="h-32 mb-6" />
            </figure>
            Código del proyecto: {idi.proyecto.codigo}
        </div>
        <div slot="content">
            <div>
                {#if (JSON.parse(idi.proyecto.estado_cord_sennova)?.requiereSubsanar == true && idi.proyecto.mostrar_recomendaciones == true && idi.proyecto.mostrar_requiere_subsanacion == true) || (JSON.parse(idi.proyecto.estado)?.requiereSubsanar == true && idi.proyecto.mostrar_recomendaciones == true && idi.proyecto.mostrar_requiere_subsanacion == true)}
                    <!-- <h1 class="text-center mb-4 font-black text-2xl">Este proyecto requiere ser subsanado</h1> -->
                    <p>Por favor revise las observaciones de los evaluadores en cada uno de los campos y secciones.</p>
                    <p>Importante: Se ha agregado una sección de <strong>Comentarios generales</strong>, revise si hay comentarios de los evaluadores y por favor escriba la respectiva respuesta.</p>
                {:else if (JSON.parse(idi.proyecto.estado_cord_sennova)?.requiereSubsanar == false && idi.proyecto.mostrar_recomendaciones == true && idi.proyecto.mostrar_requiere_subsanacion == true) || (JSON.parse(idi.proyecto.estado)?.requiereSubsanar == false && idi.proyecto.mostrar_recomendaciones == true && idi.proyecto.mostrar_requiere_subsanacion == true)}
                    <div>
                        <!-- <h1 class="text-center mb-4 font-black text-2xl">Este proyecto no requiere subsanación</h1> -->
                        <p><strong>Tenga en cuenta:</strong> El estado final de los proyectos se conocerá cuando finalice la etapa de segunda evaluación (Estado Rechazado, pre – aprobado con observaciones y Preaprobado).</p>
                    </div>
                {:else}
                    <h1 class="text-center mt-4 mb-4">Para terminar el numeral de <strong>Generalidades</strong> por favor continue diligenciando los siguientes campos:</h1>
                    <p class="text-center mb-4">Si ya están completos omita esta información.</p>
                    <ul class="list-disc">
                        <li>Video</li>
                        <li>Industria 4.0</li>
                        <li>Sector agrícola</li>
                        <li>Política Institucional para Atención de las Personas con discapacidad</li>
                        <li>Política Institucional de Atención con Enfoque Pluralista y Diferencial (acuerdo 0010 de 2016)</li>
                        <li>Origen de las muestras</li>
                        <li>Plan tecnológico</li>
                        <li>Agendas Departamentales de Competitividad e Innovación</li>
                        <li>Mesas sectoriales</li>
                        <li>Tecnoacademia</li>
                        <li>Resumen</li>
                        <li>Antecedentes</li>
                        <li>Marco conceptual</li>
                        <li>Bibliografía</li>
                        <li>Número de aprendices beneficiados</li>
                        <li>Nombre de los municipios beneficiados</li>
                        <li>Impacto en el centro de formación</li>
                    </ul>
                {/if}
            </div>
        </div>
        <div slot="actions">
            <div class="p-4">
                <Button on:click={() => (proyectoDialogOpen = false)} variant={null}>Omitir</Button>
                {#if idi.proyecto.allowed.to_update}
                    <Button variant="raised" on:click={() => (proyectoDialogOpen = false)} on:click={() => Inertia.visit('#tematica_estrategica_id')}>Continuar diligenciando</Button>
                {/if}
            </div>
        </div>
    </Dialog>

    <Dialog bind:open={dialogGuardar}>
        <div slot="title">
            <div class="m-auto relative text-app-600">
                <figure>
                    <img src="/images/megaphone.png" alt="" class="m-auto w-20" />
                </figure>
            </div>
        </div>
        <div slot="content">
            <Export2Word id="borrador" showButton={false} bind:this={exportComponent}>
                <h1 class="font-black text-center my-10">Información del proyecto</h1>
                <p style="white-space: pre-line; margin-bottom: 4rem">
                    <strong>Descripción llamativa que orienta el enfoque del proyecto, indica el cómo y el para qué. (Máximo 20 palabras):</strong>
                    {$form.titulo}
                </p>

                <p style="white-space: pre-line; margin-bottom: 4rem">
                    <strong>Código dependencia presupuestal (SIIF):</strong>
                    {lineasProgramaticas.find((item) => item.value == $form.linea_programatica_id?.value)?.label}
                </p>
                <p style="white-space: pre-line; margin-bottom: 4rem">
                    <strong>Centro de formación:</strong>
                    {idi.proyecto.centro_formacion.nombre}
                </p>

                <p style="white-space: pre-line; margin-bottom: 4rem">
                    <strong>Líneas temáticas a ejecutar en la vigencia del proyecto:</strong>
                    <br />
                    {#if $form.tecnoacademia_linea_tecnoacademia_id}
                        {#each $form.tecnoacademia_linea_tecnoacademia_id as lineaTematica}
                            <br />
                            {lineaTematica.label}
                        {/each}
                    {:else}
                        Sin información registrada
                    {/if}
                </p>

                <p style="white-space: pre-line; margin-bottom: 4rem">
                    <strong>Fecha de ejecución:</strong>
                    Del {$form.fecha_inicio + ' hasta ' + $form.fecha_finalizacion}
                </p>

                <p style="white-space: pre-line; margin-bottom: 4rem">
                    <strong>Red de conocimiento sectorial:</strong>
                    {$form.red_conocimiento_id ? $form.red_conocimiento_id?.label : 'Sin información registrada'}
                </p>

                <p style="white-space: pre-line; margin-bottom: 4rem">
                    <strong>Área de conocimiento:</strong>
                    {$form.area_conocimiento_id ? $form.area_conocimiento_id?.label : 'Sin información registrada'}
                </p>

                <p style="white-space: pre-line; margin-bottom: 4rem">
                    <strong>Subárea de conocimiento:</strong>
                    {$form.subarea_conocimiento_id ? $form.subarea_conocimiento_id?.label : 'Sin información registrada'}
                </p>

                <p style="white-space: pre-line; margin-bottom: 4rem">
                    <strong>Disciplina de la subárea de conocimiento:</strong>
                    {$form.disciplina_subarea_conocimiento_id ? $form.disciplina_subarea_conocimiento_id?.label : 'Sin información registrada'}
                </p>

                <p style="white-space: pre-line; margin-bottom: 4rem">
                    <strong>¿En cuál de estas actividades económicas se puede aplicar el proyecto?</strong>
                    {$form.actividad_economica_id ? $form.actividad_economica_id?.label : 'Sin información registrada'}
                </p>

                <p style="white-space: pre-line; margin-bottom: 4rem">
                    <strong>Temática estratégica SENA</strong>
                    {$form.tematica_estrategica_id ? $form.tematica_estrategica_id?.label : 'Sin información registrada'}
                </p>

                <p style="white-space: pre-line; margin-bottom: 4rem">
                    <strong>¿El proyecto está articulado con la ENI?</strong>
                    {$form.articulacion_eni ? 'Si' : 'No'}
                </p>

                <p style="white-space: pre-line; margin-bottom: 4rem">
                    <strong>Grupo de investigación ENI</strong>
                    {$form.grupo_investigacion_eni_id?.label}
                </p>

                <p style="white-space: pre-line; margin-bottom: 4rem">
                    <strong>Líneas de investigación ENI</strong>
                    <br />

                    {#if $form.linea_investigacion_eni_id}
                        {#each $form.linea_investigacion_eni_id as lineaInvestigacionEni}
                            {lineaInvestigacionEni?.label}
                        {/each}
                    {:else}
                        Sin información registrada
                    {/if}
                </p>

                <p style="white-space: pre-line; margin-bottom: 4rem">
                    <strong>Áreas temáticas</strong>
                    <br />
                    {#if $form.area_tematica_eni_id}
                        {#each $form.area_tematica_eni_id as areaTematicaEni}
                            {areaTematicaEni?.label}
                        {/each}
                    {:else}
                        Sin información registrada
                    {/if}
                </p>

                <p style="white-space: pre-line; margin-bottom: 4rem">
                    <strong>¿El proyecto tiene video?</strong>
                    <br />
                    {tieneVideo ? 'Si' : 'No'}
                    <br />
                    {$form.video ? $form.video : 'Sin información registrada'}
                </p>

                <p style="white-space: pre-line; margin-bottom: 4rem">
                    <strong>¿El proyecto está relacionado con la industria 4.0?</strong>
                    <br />
                    {requiereJustificacionIndustria4 ? 'Si' : 'No'}
                    <br />
                    {$form.justificacion_industria_4 ? $form.justificacion_industria_4 : 'Sin información registrada'}
                </p>

                <p style="white-space: pre-line; margin-bottom: 4rem">
                    <strong>¿El proyecto está relacionado con la economía naranja?</strong>
                    <br />
                    {requiereJustificacionEconomiaNaranja ? 'Si' : 'No'}
                    <br />
                    {$form.justificacion_economia_naranja ? $form.justificacion_economia_naranja : 'Sin información registrada'}
                </p>

                <p style="white-space: pre-line; margin-bottom: 4rem">
                    <strong>¿El proyecto tendrá un impacto en el sector agrícola?</strong>
                    <br />
                    {requiereJustificacionSectorAgricola ? 'Si' : 'No'}
                    <br />
                    {$form.impacto_sector_agricola ? $form.impacto_sector_agricola : 'Sin información registrada'}
                </p>

                <p style="white-space: pre-line; margin-bottom: 4rem">
                    <strong>¿El proyecto aporta a la Política Institucional para Atención de las Personas con discapacidad?</strong>
                    <br />
                    {requiereJustificacionPoliticaDiscapacidad ? 'Si' : 'No'}
                    <br />
                    {$form.justificacion_politica_discapacidad ? $form.justificacion_politica_discapacidad : 'Sin información registrada'}
                </p>

                <p style="white-space: pre-line; margin-bottom: 4rem">
                    <strong>¿El proyecto aporta a la Política Institucional de Atención con Enfoque Pluralista y Diferencial (acuerdo 0010 de 2016)?</strong>
                    <br />
                    {requiereJustificacionAntencionPluralista ? 'Si' : 'No'}
                    <br />
                    {$form.atencion_pluralista_diferencial ? $form.atencion_pluralista_diferencial : 'Sin información registrada'}
                </p>

                <p style="white-space: pre-line; margin-bottom: 4rem">
                    <strong>¿Cuál es el origen de las muestras con las que se realizarán las actividades de investigación, bioprospección y/o aprovechamiento comercial o industrial?</strong>
                    <br />
                    {$form.muestreo ? ($form.muestreo == 6 ? 'No aplica' : 'Sin información registrada') : 'Sin información registrada'}
                    <br />
                    {$form.actividades_muestreo ? $form.actividades_muestreo : 'Sin información registrada'}
                    <br />
                    {$form.objetivo_muestreo ? $form.objetivo_muestreo : 'Sin información registrada'}
                </p>

                <p style="white-space: pre-line; margin-bottom: 4rem">
                    <strong>
                        En la ejecución del proyecto se requiere la recolección de especímenes de especies silvestres de la diversidad biológica con fines de elaboración de estudios ambientales (entendiendo como recolección los procesos de remoción o extracción temporal o definitiva de una especie ya sea vegetal o animal del medio natural) Nota: este permiso no se requiere cuando las actividades
                        de recolección se limiten a investigaciones científicas o con fines industriales, comerciales o de prospección biológica.
                    </strong>
                    <br />
                    {$form.recoleccion_especimenes ? $form.recoleccion_especimenes?.label : 'Sin información registrada'}
                </p>

                <p style="white-space: pre-line; margin-bottom: 4rem">
                    <strong>¿El proyecto se alinea con el plan tecnológico desarrollado por el centro de formación?</strong>
                    <br />
                    {$form.relacionado_plan_tecnologico ? $form.relacionado_plan_tecnologico?.label : 'Sin información registrada'}
                </p>

                <p style="white-space: pre-line; margin-bottom: 4rem">
                    <strong>¿El proyecto se alinea con las Agendas Departamentales de Competitividad e Innovación?</strong>
                    <br />
                    {$form.relacionado_agendas_competitividad ? $form.relacionado_agendas_competitividad?.label : 'Sin información registrada'}
                </p>

                <p style="white-space: pre-line;">
                    <strong>¿El proyecto se alinea con las Mesas Sectoriales?</strong>
                    <br />
                    {$form.relacionado_mesas_sectoriales ? $form.relacionado_mesas_sectoriales?.label : 'Sin información registrada'}
                </p>

                <div style="margin-bottom: 4rem">
                    Mesas sectoriales relacionadas:
                    <ul class="list-disc p-4">
                        {#each mesasSectoriales as { id, nombre }, i}
                            {#each $form.mesa_sectorial_id as mesaSectorialRelacionada}
                                {#if id == mesaSectorialRelacionada}
                                    <li>{nombre}</li>
                                {/if}
                            {/each}
                        {/each}
                    </ul>
                </div>

                <p style="white-space: pre-line;">
                    <strong>¿El proyecto se formuló en conjunto con la tecnoacademia?</strong>
                    <br />
                    {$form.relacionado_tecnoacademia ? $form.relacionado_tecnoacademia?.label : 'Sin información registrada'}
                </p>

                <p style="white-space: pre-line; margin-bottom: 4rem">
                    <strong>Resumen del proyecto</strong>
                    <br />
                    <small>Información necesaria para darle al lector una idea precisa de la pertinencia y calidad del proyecto. Explique en qué consiste el problema o necesidad, cómo cree que lo resolverá, cuáles son las razones que justifican su ejecución y las herramientas que se utilizarán en el desarrollo del proyecto.</small>
                    <br />
                    {$form.resumen ? $form.resumen : 'Sin información registrada'}
                </p>

                <p style="white-space: pre-line; margin-bottom: 4rem">
                    <strong>Antecedentes</strong>
                    <br />
                    <small>Presenta las investigaciones, innovaciones o desarrollos tecnológicos que se han realizado a nivel internacional, nacional, departamental o municipal en el marco de la temática de la propuesta del proyecto; que muestran la pertinencia del proyecto, citar toda la información consignada utilizando normas APA última edición.</small>
                    <br />
                    {$form.antecedentes ? $form.antecedentes : 'Sin información registrada'}
                </p>

                <p style="white-space: pre-line; margin-bottom: 4rem">
                    <strong>Marco conceptual</strong>
                    <br />
                    <small>Descripción de los aspectos conceptuales y/o teóricos relacionados con el problema. Se hace la claridad que no es un listado de definiciones.</small>
                    <br />
                    {$form.marco_conceptual ? $form.marco_conceptual : 'Sin información registrada'}
                </p>

                <p style="white-space: pre-line; margin-bottom: 4rem">
                    <strong>Número de los aprendices que se beneficiarán en la ejecución del proyecto</strong>
                    <br />
                    <small>Escriba el número de aprendices que se beneficiarán en la ejecución del proyecto.</small>
                    <br />
                    {$form.numero_aprendices ? $form.numero_aprendices : 'Sin información registrada'}
                </p>

                <p style="white-space: pre-line; margin-bottom: 4rem">
                    <strong>Nombre de los municipios beneficiados:</strong>
                    <br />
                    {#if $form.municipios}
                        {#each $form.municipios as municipio}
                            <br />
                            {municipio.label}
                        {/each}
                    {:else}
                        Sin información registrada
                    {/if}
                </p>

                <p style="white-space: pre-line; margin-bottom: 4rem">
                    <strong>Nombre de los programas de formación con registro calificado a impactar:</strong>
                    <br />
                    {#if $form.programas_formacion}
                        {#each $form.programas_formacion as programaFormacion}
                            <br />
                            {programaFormacion.label}
                        {/each}
                    {:else}
                        Sin información registrada
                    {/if}
                </p>

                <p style="white-space: pre-line; margin-bottom: 4rem">
                    <strong>Nombre de los programas de formación articulados:</strong>
                    <br />
                    {#if $form.programas_formacion_articulados}
                        {#each $form.programas_formacion_articulados as programaFormacion}
                            <br />
                            {programaFormacion.label}
                        {/each}
                    {:else}
                        Sin información registrada
                    {/if}
                </p>

                <p style="white-space: pre-line; margin-bottom: 4rem; word-wrap: break-word">
                    <strong>Descripción del beneficio en los municipios</strong>
                    <br />
                    {$form.impacto_municipios ? $form.impacto_municipios : 'Sin información registrada'}
                </p>

                <p style="white-space: pre-line; margin-bottom: 4rem; word-wrap: break-word">
                    <strong>Impacto en el centro de formación</strong>
                    <br />
                    {$form.impacto_centro_formacion ? $form.impacto_centro_formacion : 'Sin información registrada'}
                </p>

                <p style="white-space: pre-line; margin-bottom: 4rem; word-wrap: break-word">
                    <strong>Bibliografía</strong>
                    <br />
                    <small>Lista de las referencias utilizadas en cada apartado del proyecto. Utilizar normas APA- Última edición (http://biblioteca.sena.edu.co/images/PDF/InstructivoAPA.pdf).</small>
                    <br />
                    {$form.bibliografia ? $form.bibliografia : 'Sin información registrada'}
                </p>
            </Export2Word>
        </div>
        <div slot="actions">
            <div class="p-4">
                <Button on:click={() => (dialogGuardar = false)} variant={null}>Cancelar</Button>
                <Button variant="raised" type="button" on:click={() => exportComponent.export2Word(idi.proyecto.codigo)}>Descargar Generalidades en Word</Button>
            </div>
        </div>
    </Dialog>
</AuthenticatedLayout>
