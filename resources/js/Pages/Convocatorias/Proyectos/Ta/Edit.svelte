<script>
    import AuthenticatedLayout, { title } from '@/Layouts/Authenticated'
    import { useForm, page } from '@inertiajs/inertia-svelte'
    import { route, checkRole, checkPermission, monthDiff } from '@/Utils'
    import { _ } from 'svelte-i18n'
    import { Inertia } from '@inertiajs/inertia'

    import Button from '@/Shared/Button'
    import LoadingButton from '@/Shared/LoadingButton'
    import Stepper from '@/Shared/Stepper'
    import InfoMessage from '@/Shared/InfoMessage'
    import Dialog from '@/Shared/Dialog'
    import Export2Word from '@/Shared/Export2Word'

    import TaForm from './TaForm.svelte'

    export let errors
    export let convocatoria
    export let ta
    export let lineasTecnoacademia
    export let lineasTecnoacademiaRelacionadas
    export let tecnoacademiaRelacionada
    export let lineasProgramaticas

    $: $title = ta ? ta.titulo : null

    /**
     * Validar si el usuario autenticado es SuperAdmin
     */
    let authUser = $page.props.auth.user
    let isSuperAdmin = checkRole(authUser, [1])

    let form = useForm({
        _method: 'put',
        centro_formacion_id: ta.proyecto.centro_formacion_id,
        linea_programatica_id: ta.proyecto.linea_programatica_id,
        fecha_inicio: ta.fecha_inicio,
        fecha_finalizacion: ta.fecha_finalizacion,
        max_meses_ejecucion: ta.max_meses_ejecucion,
        tecnoacademia_id: tecnoacademiaRelacionada.id,
        tecnoacademia_linea_tecnoacademia_id: lineasTecnoacademiaRelacionadas,
        codigo_linea_programatica: null,

        logros_vigencia_anterior: ta.logros_vigencia_anterior,
        resumen: ta.resumen,
        resumen_regional: ta.resumen_regional,
        antecedentes: ta.antecedentes,
        antecedentes_tecnoacademia: ta.antecedentes_tecnoacademia,
        justificacion_problema: ta.justificacion_problema,
        marco_conceptual: ta.marco_conceptual,
        bibliografia: ta.bibliografia,
        pertinencia_territorio: ta.pertinencia_territorio,
        retos_oportunidades: ta.retos_oportunidades,
        lineas_tecnologicas_centro: ta.lineas_tecnologicas_centro,
        pdf_proyecto_general: null,
    })

    let proyectoDialogOpen = true
    let codigoLineaProgramatica
    let dialogGuardar = false
    let exportComponent

    $: if (codigoLineaProgramatica) {
        $form.codigo_linea_programatica = codigoLineaProgramatica.codigo
    } else {
        $form.codigo_linea_programatica = ta.codigo_linea_programatica
    }

    function submit() {
        if (ta.proyecto.allowed.to_update) {
            $form.post(route('convocatorias.ta.update', [convocatoria.id, ta.id]), {
                onFinish: () => {
                    dialogGuardar = false
                },
                preserveScroll: true,
            })
        }
    }

    $: if ($form.fecha_inicio && $form.fecha_finalizacion) {
        $form.max_meses_ejecucion = monthDiff($form.fecha_inicio, $form.fecha_finalizacion)
    }
</script>

<AuthenticatedLayout>
    <header class="pt-[8rem]" slot="header">
        <Stepper {convocatoria} proyecto={ta} />
    </header>

    <form on:submit|preventDefault={submit} id="ta-form">
        <fieldset class="p-8 divide-y" disabled={ta.proyecto.allowed.to_update ? undefined : true}>
            <TaForm {errors} {form} {isSuperAdmin} {authUser} {convocatoria} {ta} {lineasTecnoacademia} {lineasProgramaticas} />
            {#if isSuperAdmin || ta.proyecto.mostrar_recomendaciones}
                <div class="py-24">
                    <h1>Ortografía</h1>
                    {#each ta.proyecto.evaluaciones as evaluacion, i}
                        {#if isSuperAdmin || (evaluacion.finalizado && evaluacion.habilitado)}
                            <div class="bg-zinc-900 text-white p-4 rounded border mb-5">
                                <div class="text-xs flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                                    </svg>
                                    Evaluador COD-{evaluacion.id}:
                                </div>
                                <p class="whitespace-pre-line text-xs">{evaluacion.ta_evaluacion.ortografia_comentario ? evaluacion.ta_evaluacion.ortografia_comentario : 'Sin recomendación'}</p>
                            </div>
                        {/if}
                    {/each}
                    {#if ta.proyecto.evaluaciones.length == 0}
                        <p class="whitespace-pre-line mt-4 text-xs">El proyecto no ha sido evaluado aún.</p>
                    {/if}
                </div>
            {/if}

            {#if isSuperAdmin || ta.proyecto.mostrar_recomendaciones}
                <div class="py-24">
                    <h1>Redacción</h1>
                    {#each ta.proyecto.evaluaciones as evaluacion, i}
                        {#if isSuperAdmin || (evaluacion.finalizado && evaluacion.habilitado)}
                            <div class="bg-zinc-900 text-white p-4 rounded border mb-5">
                                <div class="text-xs flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                                    </svg>
                                    Evaluador COD-{evaluacion.id}:
                                </div>
                                <p class="whitespace-pre-line text-xs">{evaluacion.ta_evaluacion.redaccion_comentario ? evaluacion.ta_evaluacion.redaccion_comentario : 'Sin recomendación'}</p>
                            </div>
                        {/if}
                    {/each}
                    {#if ta.proyecto.evaluaciones.length == 0}
                        <p class="whitespace-pre-line mt-4 text-xs">El proyecto no ha sido evaluado aún.</p>
                    {/if}
                </div>
            {/if}

            {#if isSuperAdmin || ta.proyecto.mostrar_recomendaciones}
                <div class="py-24">
                    <h1>Normas APA</h1>
                    {#each ta.proyecto.evaluaciones as evaluacion, i}
                        {#if isSuperAdmin || (evaluacion.finalizado && evaluacion.habilitado)}
                            <div class="bg-zinc-900 text-white p-4 rounded border mb-5">
                                <div class="text-xs flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                                    </svg>
                                    Evaluador COD-{evaluacion.id}:
                                </div>
                                <p class="whitespace-pre-line text-xs">{evaluacion.ta_evaluacion.normas_apa_comentario ? evaluacion.ta_evaluacion.normas_apa_comentario : 'Sin recomendación'}</p>
                            </div>
                        {/if}
                    {/each}
                    {#if ta.proyecto.evaluaciones.length == 0}
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
        </div>
        <div class="shadow-inner bg-app-200 border-app-400 flex items-center justify-between mt-14 px-8 py-4">
            <small class="flex items-center text-app-700">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {ta.updated_at}
            </small>
            <Button type="button" on:click={() => (dialogGuardar = true)}>Descargar Generalidades en Word</Button>

            {#if ta.proyecto.allowed.to_update}
                <LoadingButton loading={$form.processing} form="ta-form">Guardar información</LoadingButton>
            {:else}
                <span class="inline-block ml-1.5"> El proyecto no se puede modificar </span>
            {/if}
        </div>
    </form>

    <Dialog bind:open={proyectoDialogOpen} id="informacion">
        <div slot="title" class="flex items-center flex-col mt-4">
            <figure>
                <img src={'/images/proyecto.png'} alt="Proyecto" class="h-32 mb-6" />
            </figure>
            Código del proyecto: {ta.proyecto.codigo}
        </div>
        <div slot="content">
            <div>
                {#if JSON.parse(ta.proyecto.estado)?.requiereSubsanar == true && ta.proyecto.mostrar_recomendaciones == true && ta.proyecto.mostrar_requiere_subsanacion == true}
                    <!-- <h1 class="text-center mb-4 font-black text-2xl">Este proyecto requiere ser subsanado</h1> -->
                    <p>Por favor revise las observaciones de los evaluadores en cada uno de los campos y secciones.</p>
                    <p>Importante: Se ha agregado una sección de <strong>Comentarios generales</strong>, revise si hay comentarios de los evaluadores y por favor escriba la respectiva respuesta.</p>
                {:else if JSON.parse(ta.proyecto.estado)?.requiereSubsanar == false && ta.proyecto.mostrar_recomendaciones == true && ta.proyecto.mostrar_requiere_subsanacion == true}
                    <div>
                        <!-- <h1 class="text-center mb-4 font-black text-2xl">Este proyecto no requiere subsanación</h1> -->
                        <p><strong>Tenga en cuenta:</strong> El estado final de los proyectos se conocerá cuando finalice la etapa de segunda evaluación (Estado Rechazado, pre – aprobado con observaciones y Preaprobado).</p>
                    </div>
                {:else}
                    <h1 class="text-center mt-4 mb-4">Para terminar el numeral de <strong>Generalidades</strong> por favor continue diligenciando los siguientes campos:</h1>
                    <p class="text-center mb-4">Si ya están completos omita esta información.</p>
                    <ul class="list-disc">
                        <li>Resumen</li>
                        <li>Complemento - Resumen</li>
                        <li>Antecedentes</li>
                        <li>Antecedentes de la Tecnoacademia y su impacto en la región</li>
                        <li>Justificación</li>
                        <li>Logros de la vigencia {convocatoria.year - 1} en la implemtnación del programa de TecnoAcademia</li>
                        <li>Descripción de retos y prioridades locales y regionales en los cuales la Tecnoacademia tiene impacto</li>
                        <li>Justificación y pertinencia en el territorio</li>
                        <li>Marco conceptual</li>
                        <li>Líneas tecnológicas del Centro con las que se articula la TecnoAcademia</li>
                        <li>Bibliografía</li>
                    </ul>
                {/if}
            </div>
        </div>
        <div slot="actions">
            <div class="p-4">
                <Button on:click={() => (proyectoDialogOpen = false)} variant={null}>Omitir</Button>
                {#if ta.proyecto.allowed.to_update}
                    <Button variant="raised" on:click={() => (proyectoDialogOpen = false)} on:click={() => Inertia.visit('#tecnoacademia_linea_tecnoacademia_id')}>Continuar diligenciando</Button>
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
                    <strong>Código dependencia presupuestal (SIIF):</strong>
                    {lineasProgramaticas.find((item) => item.value == $form.linea_programatica_id?.value)?.label}
                </p>
                <p style="white-space: pre-line; margin-bottom: 4rem">
                    <strong>Centro de formación:</strong>
                    {ta.proyecto.centro_formacion.nombre}
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
                    <strong>Resumen del proyecto</strong>
                    <br />
                    {$form.resumen ? $form.resumen : 'Sin información registrada'}
                </p>
                <p style="white-space: pre-line; margin-bottom: 4rem">
                    <strong>Complemento - Resumen ejecutivo regional</strong>
                    <br />
                    {$form.resumen_regional ? $form.resumen_regional : 'Sin información registrada'}
                </p>
                <p style="white-space: pre-line; margin-bottom: 4rem">
                    <strong>Antecedentes</strong>
                    <br />
                    {$form.antecedentes ? $form.antecedentes : 'Sin información registrada'}
                </p>
                <p style="white-space: pre-line; margin-bottom: 4rem">
                    <strong>Antecedentes de la Tecnoacademia y su impacto en la región</strong>
                    <br />
                    {$form.antecedentes_tecnoacademia ? $form.antecedentes_tecnoacademia : 'Sin información registrada'}
                </p>
                <p style="white-space: pre-line; margin-bottom: 4rem">
                    <strong>Justificación</strong>
                    <br />
                    {$form.justificacion_problema ? $form.justificacion_problema : 'Sin información registrada'}
                </p>
                <p style="white-space: pre-line; margin-bottom: 4rem">
                    <strong>Logros de la vigencia {convocatoria.year - 1} en la implemtnación del programa de TecnoAcademia</strong>
                    <br />
                    {$form.logros_vigencia_anterior ? $form.logros_vigencia_anterior : 'Sin información registrada'}
                </p>

                <p style="white-space: pre-line; margin-bottom: 4rem">
                    <strong>Descripción de retos y prioridades locales y regionales en los cuales la Tecnoacademia tiene impacto</strong>
                    <br />
                    {$form.retos_oportunidades ? $form.retos_oportunidades : 'Sin información registrada'}
                </p>
                <p style="white-space: pre-line; margin-bottom: 4rem">
                    <strong>Justificación y pertinencia en el territorio</strong>
                    <br />
                    {$form.pertinencia_territorio ? $form.pertinencia_territorio : 'Sin información registrada'}
                </p>

                <p style="white-space: pre-line; margin-bottom: 4rem">
                    <strong>Marco conceptual</strong>
                    <br />
                    {$form.marco_conceptual ? $form.marco_conceptual : 'Sin información registrada'}
                </p>

                <p style="white-space: pre-line; margin-bottom: 4rem; word-wrap: break-word">
                    <strong>Líneas tecnológicas del Centro con las que se articula la TecnoAcademia</strong>
                    <br />
                    {$form.lineas_tecnologicas_centro ? $form.lineas_tecnologicas_centro : 'Sin información registrada'}
                </p>

                <p style="white-space: pre-line; margin-bottom: 4rem; word-wrap: break-word">
                    <strong>Bibliografía</strong>
                    <br />
                    {$form.bibliografia ? $form.bibliografia : 'Sin información registrada'}
                </p>
            </Export2Word>
        </div>
        <div slot="actions">
            <div class="p-4">
                <Button on:click={() => (dialogGuardar = false)} variant={null}>Cancelar</Button>
                <Button variant="raised" type="button" on:click={() => exportComponent.export2Word(ta.proyecto.codigo)}>Descargar Generalidades en Word</Button>
            </div>
        </div>
    </Dialog>
</AuthenticatedLayout>

<style>
    :global(.tagify__tag) {
        background: #e5e5e5;
    }

    :global(.tagify__tag:focus div::before) {
        background: #d3e2e2;
    }

    :global(.tagify__tag:hover:not([readonly]) div:before) {
        background: #d3e2e2;
    }
</style>
