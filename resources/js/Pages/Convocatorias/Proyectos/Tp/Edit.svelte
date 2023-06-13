<script>
    import AuthenticatedLayout, { title } from '@/Layouts/Authenticated'
    import { useForm, page } from '@inertiajs/inertia-svelte'
    import { route, checkRole, checkPermission, checkPermissionByUser, monthDiff } from '@/Utils'
    import { _ } from 'svelte-i18n'
    import { Inertia } from '@inertiajs/inertia'
    import axios from 'axios'

    import Button from '@/Shared/Button'
    import LoadingButton from '@/Shared/LoadingButton'
    import Stepper from '@/Shared/Stepper'
    import InfoMessage from '@/Shared/InfoMessage'
    import Export2Word from '@/Shared/Export2Word'
    import Dialog from '@/Shared/Dialog'

    import TpForm from './TpForm.svelte'

    export let errors
    export let convocatoria
    export let tp
    export let lineasProgramaticas
    export let nodosTecnoparque

    $: $title = tp ? tp.titulo : null

    /**
     * Validar si el usuario autenticado es SuperAdmin
     */
    let authUser = $page.props.auth.user
    let isSuperAdmin = checkRole(authUser, [1])

    let form = useForm({
        _method: 'put',
        centro_formacion_id: tp.proyecto.centro_formacion_id,
        linea_programatica_id: tp.proyecto.linea_programatica_id,
        fecha_inicio: tp.fecha_inicio,
        fecha_finalizacion: tp.fecha_finalizacion,
        max_meses_ejecucion: tp.max_meses_ejecucion,
        codigo_linea_programatica: null,
        nodo_tecnoparque_id: tp.nodo_tecnoparque_id,
        articulacion_agenda_competitividad: tp.articulacion_agenda_competitividad,
        aportes_linea_ocho_conpes: tp.aportes_linea_ocho_conpes,
        estado_ecosistema_ctel: tp.estado_ecosistema_ctel,
        logros_vigencia_anterior: tp.logros_vigencia_anterior,

        resumen: tp.resumen,
        resumen_regional: tp.resumen_regional,
        antecedentes: tp.antecedentes,
        antecedentes_regional: tp.antecedentes_regional,
        marco_conceptual: tp.marco_conceptual,
        bibliografia: tp.bibliografia,
        retos_oportunidades: tp.retos_oportunidades,
        pertinencia_territorio: tp.pertinencia_territorio,
        pdf_proyecto_general: null,
    })

    let dialogGuardar = false
    let proyectoDialogOpen = true
    let exportComponent

    let codigoLineaProgramatica

    $: if (codigoLineaProgramatica) {
        $form.codigo_linea_programatica = codigoLineaProgramatica.codigo
    } else {
        $form.codigo_linea_programatica = tp.codigo_linea_programatica
    }

    let regional
    $: whitelistInstitucionesEducativas = []
    $: if (regional) {
        axios
            .get('https://www.datos.gov.co/resource/cfw5-qzt5.json?cod_dane_departamento=' + regional?.codigo)
            .then(function (response) {
                // handle success
                response.data.map((item) => {
                    whitelistInstitucionesEducativas.push(item.nombre_establecimiento)
                })
            })
            .catch(function (error) {
                // handle error
                console.log(error)
            })
            .then(function () {
                // always executed
            })
    }

    function submit() {
        if (tp.proyecto.allowed.to_update) {
            $form.post(route('convocatorias.tp.update', [convocatoria.id, tp.id]), {
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
        <Stepper {convocatoria} proyecto={tp} />
    </header>

    <form on:submit|preventDefault={submit} id="tp-form">
        <fieldset class="p-8 divide-y" disabled={tp.proyecto.allowed.to_update ? undefined : true}>
            <TpForm {errors} {form} {isSuperAdmin} {authUser} {convocatoria} {tp} {lineasProgramaticas} />

            {#if (isSuperAdmin && tp.proyecto.evaluaciones.length > 0) || (tp.proyecto.mostrar_recomendaciones && tp.proyecto.evaluaciones.length > 0)}
                <div class="py-24">
                    <h1>Ortografía</h1>
                    {#each tp.proyecto.evaluaciones as evaluacion, i}
                        {#if isSuperAdmin || (evaluacion.finalizado && evaluacion.habilitado)}
                            <div class="bg-zinc-900 text-white p-4 rounded border mb-5">
                                <div class="text-xs flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                                    </svg>
                                    Evaluador COD-{evaluacion.id}:
                                </div>
                                <p class="whitespace-pre-line text-xs">{evaluacion.tp_evaluacion.ortografia_comentario ? evaluacion.tp_evaluacion.ortografia_comentario : 'Sin recomendación'}</p>
                            </div>
                        {/if}
                    {/each}
                    {#if tp.proyecto.evaluaciones.length == 0}
                        <p class="whitespace-pre-line mt-4 text-xs">El proyecto no ha sido evaluado aún.</p>
                    {/if}
                </div>
            {/if}

            {#if (isSuperAdmin && tp.proyecto.evaluaciones.length > 0) || (tp.proyecto.mostrar_recomendaciones && tp.proyecto.evaluaciones.length > 0)}
                <div class="py-24">
                    <h1>Redacción</h1>
                    {#each tp.proyecto.evaluaciones as evaluacion, i}
                        {#if isSuperAdmin || (evaluacion.finalizado && evaluacion.habilitado)}
                            <div class="bg-zinc-900 text-white p-4 rounded border mb-5">
                                <div class="text-xs flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                                    </svg>
                                    Evaluador COD-{evaluacion.id}:
                                </div>
                                <p class="whitespace-pre-line text-xs">{evaluacion.tp_evaluacion.redaccion_comentario ? evaluacion.tp_evaluacion.redaccion_comentario : 'Sin recomendación'}</p>
                            </div>
                        {/if}
                    {/each}
                    {#if tp.proyecto.evaluaciones.length == 0}
                        <p class="whitespace-pre-line mt-4 text-xs">El proyecto no ha sido evaluado aún.</p>
                    {/if}
                </div>
            {/if}

            {#if (isSuperAdmin && tp.proyecto.evaluaciones.length > 0) || (tp.proyecto.mostrar_recomendaciones && tp.proyecto.evaluaciones.length > 0)}
                <div class="py-24">
                    <h1>Normas APA</h1>
                    {#each tp.proyecto.evaluaciones as evaluacion, i}
                        {#if isSuperAdmin || (evaluacion.finalizado && evaluacion.habilitado)}
                            <div class="bg-zinc-900 text-white p-4 rounded border mb-5">
                                <div class="text-xs flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                                    </svg>
                                    Evaluador COD-{evaluacion.id}:
                                </div>
                                <p class="whitespace-pre-line text-xs">{evaluacion.tp_evaluacion.normas_apa_comentario ? evaluacion.tp_evaluacion.normas_apa_comentario : 'Sin recomendación'}</p>
                            </div>
                        {/if}
                    {/each}
                    {#if tp.proyecto.evaluaciones.length == 0}
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
            <div class="shadow-inner bg-app-200 border-app-400 bottom-0 flex items-center justify-between mt-14 px-8 py-4 sticky">
                <small class="flex items-center text-app-700">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {tp.updated_at}
                </small>
                <Button type="button" on:click={() => (dialogGuardar = true)}>Descargar Generalidades en Word</Button>

                {#if tp.proyecto.allowed.to_update}
                    <LoadingButton loading={$form.processing} form="tp-form">Guardar información</LoadingButton>
                {:else}
                    <span class="inline-block ml-1.5"> El proyecto no se puede modificar </span>
                {/if}
            </div>
        </div>
    </form>

    <Dialog bind:open={proyectoDialogOpen} id="informacion">
        <div slot="title" class="flex items-center flex-col mt-4">
            <figure>
                <img src={'/images/proyecto.png'} alt="Proyecto" class="h-32 mb-6" />
            </figure>
            Código del proyecto: {tp.proyecto.codigo}
        </div>
        <div slot="content">
            <div>
                {#if JSON.parse(tp.proyecto.estado)?.requiereSubsanar == true && tp.proyecto.mostrar_recomendaciones && tp.proyecto.evaluaciones.length > 0 == true && tp.proyecto.mostrar_requiere_subsanacion == true}
                    <!-- <h1 class="text-center mb-4 font-black text-2xl">Este proyecto requiere ser subsanado</h1> -->
                    <p>Por favor revise las observaciones de los evaluadores en cada uno de los campos y secciones.</p>
                    <p>Importante: Se ha agregado una sección de <strong>Comentarios generales</strong>, revise si hay comentarios de los evaluadores y por favor escriba la respectiva respuesta.</p>
                {:else if JSON.parse(tp.proyecto.estado)?.requiereSubsanar == false && tp.proyecto.mostrar_recomendaciones && tp.proyecto.evaluaciones.length > 0 == true && tp.proyecto.mostrar_requiere_subsanacion == true}
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
                        <li>Complemento - Antecedentes regional</li>
                        <li>Justificación</li>
                        <li>Descripción de retos y prioridades locales y regionales en los cuales el Tecnoparque tiene impacto</li>
                        <li>Articulación y contribución del Tecnoparque con la Agenda de la Comisión Regional de Competitividad.</li>
                        <li>Aportes del Tecnoparque en el {convocatoria.year} a la Línea de acción 8 del Conpes 4011 'Facilitar intercambio de tecnología y la innovación en los emprendimientos CONPES'</li>
                        <li>Describir el estado actual del Ecosistema Territorial de CTeI en el Departamento y las oportunidades de articulación con el Tecnoparque</li>
                        <li>Describa los principales logros del Tecnoparque en el {convocatoria.year - 1}</li>
                        <li>Justificación y pertinencia en el territorio</li>
                        <li>Marco conceptual</li>
                        <li>Bibliografía</li>
                    </ul>
                {/if}
            </div>
        </div>
        <div slot="actions">
            <div class="p-4">
                <Button on:click={() => (proyectoDialogOpen = false)} variant={null}>Omitir</Button>
                {#if tp.proyecto.allowed.to_update}
                    <Button variant="raised" on:click={() => (proyectoDialogOpen = false)} on:click={() => Inertia.visit('#nodo_tecnoparque_id')}>Continuar diligenciando</Button>
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
                    {tp.proyecto.centro_formacion.nombre}
                </p>
                <p style="white-space: pre-line; margin-bottom: 4rem; text-transform: capitalize">
                    <strong>Nodo Tecnoparque:</strong>
                    {nodosTecnoparque.find((item) => item.value == $form.nodo_tecnoparque_id?.value)?.label}
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
                    <strong>Complemento - Antecedentes regional</strong>
                    <br />
                    {$form.antecedentes_regional ? $form.antecedentes_regional : 'Sin información registrada'}
                </p>
                <p style="white-space: pre-line; margin-bottom: 4rem">
                    <strong>Descripción de retos y prioridades locales y regionales en los cuales el Tecnoparque tiene impacto</strong>
                    <br />
                    {$form.retos_oportunidades ? $form.retos_oportunidades : 'Sin información registrada'}
                </p>
                <p style="white-space: pre-line; margin-bottom: 4rem">
                    <strong>Articulación y contribución del Tecnoparque con la Agenda de la Comisión Regional de Competitividad.</strong>
                    <br />
                    {$form.articulacion_agenda_competitividad ? $form.articulacion_agenda_competitividad : 'Sin información registrada'}
                </p>
                <p style="white-space: pre-line; margin-bottom: 4rem">
                    <strong>Aportes del Tecnoparque en el {convocatoria.year} a la Línea de acción 8 del Conpes 4011 'Facilitar intercambio de tecnología y la innovación en los emprendimientos CONPES'</strong>
                    <br />
                    {$form.aportes_linea_ocho_conpes ? $form.aportes_linea_ocho_conpes : 'Sin información registrada'}
                </p>
                <p style="white-space: pre-line; margin-bottom: 4rem">
                    <strong>Describir el estado actual del Ecosistema Territorial de CTeI en el Departamento y las oportunidades de articulación con el Tecnoparque.</strong>
                    <br />
                    {$form.estado_ecosistema_ctel ? $form.estado_ecosistema_ctel : 'Sin información registrada'}
                </p>

                <p style="white-space: pre-line; margin-bottom: 4rem">
                    <strong>Describa los principales logros del Tecnoparque en el {convocatoria.year - 1}</strong>
                    <br />
                    {$form.logros_vigencia_anterior ? $form.logros_vigencia_anterior : 'Sin información registrada'}
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
                    <strong>Bibliografía</strong>
                    <br />
                    {$form.bibliografia ? $form.bibliografia : 'Sin información registrada'}
                </p>
            </Export2Word>
        </div>
        <div slot="actions">
            <div class="p-4">
                <Button on:click={() => (dialogGuardar = false)} variant={null}>Cancelar</Button>
                <Button variant="raised" type="button" on:click={() => exportComponent.export2Word(tp.proyecto.codigo)}>Descargar Generalidades en Word</Button>
            </div>
        </div>
    </Dialog>
</AuthenticatedLayout>
