<script>
    import { Inertia } from '@inertiajs/inertia'
    import { page } from '@inertiajs/inertia-svelte'
    import { route, checkRole, checkPermissionByUser } from '@/Utils'
    import { _ } from 'svelte-i18n'
    import { useForm } from '@inertiajs/inertia-svelte'

    import Dialog from '@/Shared/Dialog'
    import Button from '@/Shared/Button'
    import Label from '@/Shared/Label'
    import LoadingButton from '@/Shared/LoadingButton'
    import Textarea from '@/Shared/Textarea'
    import InfoMessage from '@/Shared/InfoMessage'
    import Dropdown from '@/Shared/Dropdown'
    import RecomendacionEvaluador from '@/Shared/RecomendacionEvaluador'

    export let errors
    export let proyecto
    export let efectosDirectos
    export let causasDirectas
    export let to_pdf
    export let faseEvaluacion = false

    let formId
    let dialogTitle
    let codigo

    let dialogOpen = false

    /**
     * Validar si el usuario autenticado es SuperAdmin
     */
    let authUser = $page.props.auth.user
    let isSuperAdmin = checkRole(authUser, [1])

    /**
     * Efectos indirectos
     */
    let formEfectoIndirecto = useForm({
        id: 0,
        efecto_directo_id: 0,
        descripcion: '',
    })

    let showEfectoIndirectoForm = false
    function showEfectoIndirectoDialog(efectoIndirecto, efectoDirectoId) {
        reset()
        codigo = efectoIndirecto?.id != null ? 'EFE-' + efectoIndirecto.efecto_directo_id + '-IND-' + efectoIndirecto.id : ''
        dialogTitle = 'Efecto indirecto'
        formId = 'efecto-indirecto'
        showEfectoIndirectoForm = true
        dialogOpen = true

        if (efectoIndirecto != null) {
            $formEfectoIndirecto.id = efectoIndirecto.id
            $formEfectoIndirecto.descripcion = efectoIndirecto.descripcion
            $formEfectoIndirecto.efecto_directo_id = efectoIndirecto.efecto_directo_id
        } else {
            $formEfectoIndirecto.id = null
            $formEfectoIndirecto.descripcion = null
            $formEfectoIndirecto.efecto_directo_id = efectoDirectoId
        }
    }

    function submitEfectoIndirecto() {
        if (proyecto.allowed.to_update) {
            $formEfectoIndirecto.post(
                route('proyectos.efecto-indirecto', {
                    proyecto: proyecto.id,
                    efecto_directo: $formEfectoIndirecto.efecto_directo_id,
                }),
                {
                    onSuccess: () => {
                        closeDialog()
                    },

                    preserveScroll: true,
                },
            )
        }
    }

    function destroyEfectoIndirecto(efectoIndirecto) {
        if (proyecto.allowed.to_update) {
            Inertia.post(route('proyectos.efecto-indirecto.destroy', [proyecto.id, efectoIndirecto.id]), [], {
                onSuccess: () => {
                    closeDialog()
                },
                preserveScroll: true,
            })
        }
    }

    /**
     * Efectos directos
     */
    function newEfectoDirecto() {
        if (proyecto.allowed.to_update) {
            Inertia.post(
                route('proyectos.new-efecto-directo', {
                    proyecto: proyecto.id,
                }),
                [],
                {
                    preserveScroll: true,
                },
            )
        }
    }

    let formEfectoDirecto = useForm({
        id: 0,
        descripcion: '',
    })

    let showEfectoDirectoForm = false
    function showEfectoDirectoDialog(efectoDirecto) {
        reset()
        codigo = 'EFE-' + efectoDirecto.id
        dialogTitle = 'Efecto directo'
        formId = 'efecto-directo'
        showEfectoDirectoForm = true
        dialogOpen = true
        $formEfectoDirecto.descripcion = efectoDirecto.descripcion
        $formEfectoDirecto.id = efectoDirecto.id
    }

    function submitEfectoDirecto() {
        if (proyecto.allowed.to_update) {
            $formEfectoDirecto.post(
                route('proyectos.efecto-directo', {
                    proyecto: proyecto.id,
                    efecto_directo: $formEfectoDirecto.id,
                }),
                {
                    onSuccess: () => {
                        closeDialog()
                    },

                    preserveScroll: true,
                },
            )
        }
    }

    function destroyEfectoDirecto(efectoDirecto) {
        if (proyecto.allowed.to_update) {
            Inertia.post(route('proyectos.efecto-directo.destroy', [proyecto.id, efectoDirecto.id]), [], {
                onSuccess: () => {
                    closeDialog()
                },
                preserveScroll: true,
            })
        }
    }

    /**
     * Problema central
     */
    let formProblemaCentral = useForm({
        identificacion_problema: proyecto.identificacion_problema,
        problema_central: proyecto.problema_central,
        justificacion_problema: proyecto.justificacion_problema,
        pregunta_formulacion_problema: proyecto.pregunta_formulacion_problema,
    })

    let showProblemaCentralForm = false
    function showProblemaCentralDialog() {
        reset()
        dialogTitle = 'Problema central'
        formId = 'problema-central'
        showProblemaCentralForm = true
        dialogOpen = true
        $formProblemaCentral.identificacion_problema = proyecto.identificacion_problema
        $formProblemaCentral.problema_central = proyecto.problema_central
        $formProblemaCentral.justificacion_problema = proyecto.justificacion_problema
        $formProblemaCentral.pregunta_formulacion_problema = proyecto.pregunta_formulacion_problema
    }

    function submitProblemaCentral() {
        if (proyecto.allowed.to_update) {
            $formProblemaCentral.post(route('proyectos.problema-central', proyecto.id), {
                onSuccess: () => {
                    closeDialog()
                },

                preserveScroll: true,
            })
        }
    }

    /**
     * Causas directas
     */
    let formCausaDirecta = useForm({
        id: 0,
        descripcion: '',
    })

    let showCausaDirectaForm = false
    function showCausaDirectaDialog(causaDirecta) {
        reset()
        codigo = 'CAU-' + causaDirecta.id
        dialogTitle = 'Causa directa'
        formId = 'causa-directa'
        showCausaDirectaForm = true
        dialogOpen = true
        $formCausaDirecta.id = causaDirecta.id
        $formCausaDirecta.descripcion = causaDirecta.descripcion
    }

    function newCausaDirecta() {
        if (proyecto.allowed.to_update) {
            Inertia.post(
                route('proyectos.new-causa-directa', {
                    proyecto: proyecto.id,
                }),
                [],
                {
                    preserveScroll: true,
                },
            )
        }
    }

    function submitCausaDirecta() {
        if (proyecto.allowed.to_update) {
            $formCausaDirecta.post(
                route('proyectos.causa-directa', {
                    proyecto: proyecto.id,
                    causa_directa: $formCausaDirecta.id,
                }),
                {
                    onSuccess: () => {
                        closeDialog()
                    },

                    preserveScroll: true,
                },
            )
        }
    }

    function destroyCausaDirecta(causaDirecta) {
        if (proyecto.allowed.to_update) {
            Inertia.post(route('proyectos.causa-directa.destroy', [proyecto.id, causaDirecta.id]), [], {
                onSuccess: () => {
                    closeDialog()
                },
                preserveScroll: true,
            })
        }
    }

    /**
     * Causas indirectas
     */
    let formCausaIndirecta = useForm({
        id: 0,
        causa_directa_id: 0,
        descripcion: '',
    })

    let showCausaIndirectaForm = false
    function showCausaIndirectaDialog(causaIndirecta, causaDirectaId) {
        reset()
        codigo = causaIndirecta?.id != null ? 'CAU-' + causaIndirecta.causa_directa_id + '-IND-' + causaIndirecta.id : ''
        dialogTitle = 'Causa indirecta'
        formId = 'causa-indirecta'
        showCausaIndirectaForm = true
        dialogOpen = true
        if (causaIndirecta != null) {
            $formCausaIndirecta.id = causaIndirecta.id
            $formCausaIndirecta.descripcion = causaIndirecta.descripcion
            $formCausaIndirecta.causa_directa_id = causaIndirecta.causa_directa_id
        } else {
            $formCausaIndirecta.id = null
            $formCausaIndirecta.descripcion = null
            $formCausaIndirecta.causa_directa_id = causaDirectaId
        }
    }

    function submitCausaIndirecta() {
        if (proyecto.allowed.to_update) {
            $formCausaIndirecta.post(
                route('proyectos.causa-indirecta', {
                    proyecto: proyecto.id,
                    causa_directa: $formCausaIndirecta.causa_directa_id,
                }),
                {
                    onSuccess: () => {
                        closeDialog()
                    },

                    preserveScroll: true,
                },
            )
        }
    }

    function destroyCausaIndirecta(causaIndirecta) {
        if (proyecto.allowed.to_update) {
            Inertia.post(route('proyectos.causa-indirecta.destroy', [proyecto.id, causaIndirecta.id]), [], {
                onSuccess: () => {
                    closeDialog()
                },
                preserveScroll: true,
            })
        }
    }

    function reset() {
        showEfectoIndirectoForm = false
        showEfectoDirectoForm = false
        showProblemaCentralForm = false
        showCausaDirectaForm = false
        showCausaIndirectaForm = false
        dialogTitle = ''
        codigo = ''
        formId = ''

        $formCausaIndirecta.reset()
        $formCausaDirecta.reset()
        $formProblemaCentral.reset()
        $formEfectoDirecto.reset()
        $formEfectoIndirecto.reset()
    }

    function closeDialog() {
        reset()
        dialogOpen = false
    }
</script>

<h1 class="text-3xl {to_pdf ? '' : 'mt-24'} mb-8 text-center">Árbol de problemas</h1>
<p class="text-center">Diligenciar el árbol de problemas iniciando con el problema principal (tronco), sus causas (raíces) y efectos (ramas).</p>

{#if (isSuperAdmin && faseEvaluacion == false) || (proyecto.mostrar_recomendaciones && faseEvaluacion == false)}
    <RecomendacionEvaluador class="mt-8">
        {#each proyecto.evaluaciones as evaluacion, i}
            {#if isSuperAdmin || (evaluacion.finalizado && evaluacion.habilitado)}
                <div class="bg-zinc-900 p-4 rounded shadow text-white my-2">
                    <p class="text-xs">Evaluador COD-{evaluacion.id}:</p>
                    {#if evaluacion.idi_evaluacion}
                        <p class="whitespace-pre-line text-xs">{evaluacion.idi_evaluacion?.problema_central_comentario ? evaluacion.idi_evaluacion.problema_central_comentario : 'Sin recomendación'}</p>
                    {:else if evaluacion.cultura_innovacion_evaluacion}
                        <p class="whitespace-pre-line text-xs">{evaluacion.cultura_innovacion_evaluacion?.arbol_problemas_comentario ? evaluacion.cultura_innovacion_evaluacion.arbol_problemas_comentario : 'Sin recomendación'}</p>
                    {:else if evaluacion.servicio_tecnologico_evaluacion}
                        <p class="whitespace-pre-line text-xs">{evaluacion.servicio_tecnologico_evaluacion?.arbol_problemas_comentario ? evaluacion.servicio_tecnologico_evaluacion.arbol_problemas_comentario : 'Sin recomendación'}</p>
                    {:else if evaluacion.ta_evaluacion}
                        <p class="whitespace-pre-line text-xs">{evaluacion.ta_evaluacion?.arbol_problemas_comentario ? evaluacion.ta_evaluacion.arbol_problemas_comentario : 'Sin recomendación'}</p>
                    {:else if evaluacion.tp_evaluacion}
                        <p class="whitespace-pre-line text-xs">{evaluacion.tp_evaluacion?.arbol_problemas_comentario ? evaluacion.tp_evaluacion.arbol_problemas_comentario : 'Sin recomendación'}</p>
                    {/if}
                </div>
            {/if}
        {/each}

        {#if proyecto.evaluaciones.length == 0}
            <p class="whitespace-pre-line mt-4 text-xs">El proyecto no ha sido evaluado aún.</p>
        {/if}
    </RecomendacionEvaluador>
{/if}

{#if !to_pdf}
    <figure>
        <img src="/images/arbol-problemas.png" class="mx-auto" alt="" />
    </figure>
{/if}

<div>
    <!-- Efectos directos y efectos indirectos relacionados -->
    <div class="efecto-directo-container">
        <div class="p-2">
            <div class="text-5xl font-extrabold">
                <span class="bg-clip-text text-transparent my-6 m-auto bg-gradient-to-r from-app-500 to-app-300 block w-max"> Problema central </span>
            </div>

            <p class="text-center my-10">Por favor diligencie el problema central</p>

            <div on:click={showProblemaCentralDialog} class="{proyecto.problema_central != null && proyecto.problema_central.length > 0 ? 'cell' : ''} border border-app-500 h-20 flex items-center justify-center shadow-lg p-4 cursor-pointer hover:shadow-app-500/80">
                {#if proyecto.problema_central != null && proyecto.problema_central.length > 0}
                    <p class="leading-tight paragraph-ellipsis text-xs">
                        {proyecto.problema_central}
                    </p>
                {:else}
                    <p class="text-xs flex items-center">Sin información registrada aún. Por favor modifique el problema central</p>
                {/if}
            </div>

            <hr class="w-full my-10" />

            <div class="text-5xl font-extrabold mb-10 title relative">
                <span class="bg-clip-text text-transparent m-auto bg-gradient-to-r from-app-500 to-app-300 block w-max"> Efectos directos e indirectos </span>
            </div>

            <p class="text-center my-10">Por favor genere algún efecto directo y asocie sus respectivos efectos indirectos</p>

            <div class="grid grid-cols-2 gap-2">
                {#each efectosDirectos as efectoDirecto, i}
                    <div class="p-2 border border-app-300 mr-2 shadow-inner my-20">
                        <span class="my-4 m-auto text-app-600 block w-max box-title relative"> Efecto directo </span>
                        <small class="block text-center">Código: {efectoDirecto.id}</small>
                        <div class="{efectoDirecto.descripcion != null && efectoDirecto.descripcion.length > 0 ? 'cell' : ''} border border-app-500 linea-superior relative mt-14 shadow-lg cursor-pointer hover:shadow-app-500/80 p-4 min-h-[120px]" on:click={showEfectoDirectoDialog(efectoDirecto)}>
                            <p class="leading-tight paragraph-ellipsis text-xs">
                                <small class="block font-bold mb-2">EFE-{efectoDirecto.id}</small>
                                {#if efectoDirecto.descripcion != null && efectoDirecto.descripcion.length > 0}
                                    {efectoDirecto.descripcion}
                                {:else}
                                    <p class="text-xs flex items-center mt-4">Sin información registrada aún. Por favor modifique este efecto directo</p>
                                {/if}
                            </p>
                        </div>

                        <div>
                            <span class="my-4 m-auto text-app-600 block w-max box-title relative"> Efectos indirectos </span>
                        </div>

                        <div class="grid {efectoDirecto.efectos_indirectos.length > 0 ? 'grid-cols-4' : ''} gap-3">
                            {#each efectoDirecto.efectos_indirectos as efectoIndirecto}
                                <div class="{efectoIndirecto.descripcion != null && efectoIndirecto.descripcion.length > 0 ? 'cell' : ''} border border-app-500 relative mt-10 space-x-4 cursor-pointer shadow-lg hover:shadow-app-500/80 p-4 min-h-[136px] flex-1" on:click={showEfectoIndirectoDialog(efectoIndirecto, efectoDirecto.id)}>
                                    <p class="leading-tight paragraph-ellipsis text-xs">
                                        <small class="block font-bold mb-2">EFE-{efectoDirecto.id}-IND-{efectoIndirecto.id}</small>
                                        {#if efectoIndirecto.descripcion != null && efectoIndirecto.descripcion.length > 0}
                                            {efectoIndirecto.descripcion}
                                        {:else}
                                            <p class="text-xs flex items-center mt-4">Sin información registrada aún. Por favor modifique este efecto indirecto.</p>
                                        {/if}
                                    </p>
                                </div>
                            {/each}

                            {#if isSuperAdmin || checkRole(authUser, [4, 5, 6, 12, 13, 15, 16, 17]) || (proyecto.codigo_linea_programatica == 69 && proyecto?.proyecto_base) || (proyecto.codigo_linea_programatica == 69 && checkPermissionByUser( authUser, [23], )) || (proyecto.codigo_linea_programatica == 70 && proyecto?.proyecto_base) || (proyecto.codigo_linea_programatica == 70 && checkPermissionByUser( authUser, [24], ))}
                                <div class="new-item mt-10 flex flex-col items-center justify-center shadow-lg p-4 min-h-[136px] cursor-pointer hover:shadow-fuchsia-400/80" on:click={[($formEfectoIndirecto.efecto_directo_id = efectoDirecto.id), submitEfectoIndirecto()]}>
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                    <p class="text-xs flex items-center">
                                        Asociar un nuevo efecto indirecto al efecto directo con código EFE-{efectoDirecto.id}
                                    </p>
                                </div>
                            {/if}
                        </div>
                    </div>
                {/each}
                {#if isSuperAdmin || checkRole(authUser, [4, 5, 6, 12, 13, 15, 16, 17]) || (proyecto.codigo_linea_programatica == 69 && proyecto?.proyecto_base) || (proyecto.codigo_linea_programatica == 69 && checkPermissionByUser( authUser, [23], )) || (proyecto.codigo_linea_programatica == 70 && proyecto?.proyecto_base) || (proyecto.codigo_linea_programatica == 70 && checkPermissionByUser( authUser, [24], ))}
                    <div class="p-2 border border-app-300 mr-2 item my-20 cursor-pointer flex flex-col shadow-lg min-h-[570px] hover:bg-fuchsia-400 hover:text-white items-center justify-center" on:click={() => newEfectoDirecto()}>
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        <p class="text-xs flex items-center justify-center">
                            <small class="block font-bold">Añadir un nuevo efecto directo</small>
                        </p>
                    </div>
                {/if}
            </div>

            <hr class="w-full my-10" />

            <div class="text-5xl font-extrabold mb-10 title relative">
                <span class="bg-clip-text text-transparent my-6 m-auto bg-gradient-to-l from-app-500 to-app-300 block w-max"> Causas directas e indirectas </span>
            </div>

            <p class="text-center my-10">Por favor genere alguna causa directa y asocie sus respectivas causas indirectas</p>

            <div class="grid grid-cols-2 gap-2">
                {#each causasDirectas as causaDirecta, i}
                    <div class="p-2 border border-app-300 mr-2 shadow-inner my-20">
                        <span class="my-4 m-auto text-app-600 block w-max box-title relative"> Causa directa </span>
                        <small class="block text-center">Código: {causaDirecta.id}</small>

                        <div class="{causaDirecta.descripcion != null && causaDirecta.descripcion.length > 0 ? 'cell' : ''} border border-app-500 linea-superior relative mt-14 shadow-lg cursor-pointer hover:shadow-app-500/80 p-4 min-h-[120px]" on:click={showCausaDirectaDialog(causaDirecta)}>
                            <p class="leading-tight paragraph-ellipsis text-xs">
                                <small class="block font-bold mb-2">CAU-{causaDirecta.id}</small>
                                {#if causaDirecta.descripcion != null && causaDirecta.descripcion.length > 0}
                                    {causaDirecta.descripcion}
                                {:else}
                                    <p class="text-xs flex items-center mt-4">Sin información registrada aún. Por favor modifique esta causa directa</p>
                                {/if}
                            </p>
                        </div>

                        <div class="mb-14">
                            <span class="my-4 m-auto text-app-600 block w-max box-title relative"> Causas indirectas </span>
                        </div>

                        <div class="grid {causaDirecta.causas_indirectas.length > 0 ? 'grid-cols-4' : ''} gap-3">
                            {#each causaDirecta.causas_indirectas as causaIndirecta, j}
                                <div class="{causaIndirecta.descripcion != null && causaIndirecta.descripcion.length > 0 && causaIndirecta.descripcion != ' ' ? 'cell' : ''} border border-app-500 linea-inferior mb-10 relative space-x-4 cursor-pointer shadow-lg hover:shadow-app-500/80 p-4 min-h-[136px]" style="flex: 1 0 33.333%" on:click={showCausaIndirectaDialog(causaIndirecta, causaDirecta.id)}>
                                    <p class="leading-tight paragraph-ellipsis text-xs">
                                        <small class="block font-bold mb-2">CAU-{causaDirecta.id}-IND-{causaIndirecta.id}</small>
                                        {#if causaIndirecta.descripcion != null && causaIndirecta.descripcion.length > 0 && causaIndirecta.descripcion != ' '}
                                            {causaIndirecta.descripcion}
                                        {:else}
                                            <p class="flex items-center mt-4 text-xs">Sin información registrada aún. Por favor modifique esta causa indirecta.</p>
                                        {/if}
                                    </p>
                                </div>
                            {/each}

                            {#if isSuperAdmin || checkRole(authUser, [4, 5, 6, 12, 13, 15, 16, 17]) || (proyecto.codigo_linea_programatica == 69 && proyecto?.proyecto_base) || (proyecto.codigo_linea_programatica == 69 && checkPermissionByUser( authUser, [23], )) || (proyecto.codigo_linea_programatica == 70 && proyecto?.proyecto_base) || (proyecto.codigo_linea_programatica == 70 && checkPermissionByUser( authUser, [24], ))}
                                <div class="new-item linea-inferior mb-10 relative flex flex-col items-center justify-center space-x-4 cursor-pointer shadow-lg hover:shadow-fuchsia-400/80 p-4 min-h-[136px]" style="flex: 1 0 33.333%" on:click={[($formCausaIndirecta.causa_directa_id = causaDirecta.id), submitCausaIndirecta()]}>
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                    <p class="text-xs flex items-center">
                                        Asociar una nueva causa indirecta a la causa directa con código: CAU-{causaDirecta.id}
                                    </p>
                                </div>
                            {/if}
                        </div>
                    </div>
                {/each}
                {#if isSuperAdmin || checkRole(authUser, [4, 5, 6, 12, 13, 15, 16, 17]) || (proyecto.codigo_linea_programatica == 69 && proyecto?.proyecto_base) || (proyecto.codigo_linea_programatica == 69 && checkPermissionByUser( authUser, [23], )) || (proyecto.codigo_linea_programatica == 70 && proyecto?.proyecto_base) || (proyecto.codigo_linea_programatica == 70 && checkPermissionByUser( authUser, [24], ))}
                    <div class="p-2 border border-app-300 mr-2 item my-20 cursor-pointer flex flex-col shadow-lg min-h-[570px] hover:bg-fuchsia-400 hover:text-white items-center justify-center" on:click={() => newCausaDirecta()}>
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        <p class="text-xs flex items-center justify-center">
                            <small class="block font-bold">Añadir una nueva causa directa</small>
                        </p>
                    </div>
                {/if}
            </div>
        </div>
    </div>
</div>

<!-- Dialog -->
<Dialog bind:open={dialogOpen} id="arbol-problemas">
    <div slot="title" class="mb-10 text-center">
        <div class="text-primary">
            {dialogTitle}
        </div>
        {#if codigo}
            <small class="block text-primary-light">
                Código: {codigo}
            </small>
        {/if}

        <!-- {#if isSuperAdmin || checkRole(authUser, [4, 5, 6, 12, 13, 15, 16, 17]) || (proyecto.allowed.to_update && proyecto.codigo_linea_programatica == 69 && proyecto?.proyecto_base) || proyecto.codigo_linea_programatica == 69 && checkPermissionByUser(authUser, [23]) || (proyecto.codigo_linea_programatica == 70 && proyecto?.proyecto_base) || proyecto.codigo_linea_programatica == 70 && checkPermissionByUser(authUser, [])} -->
        {#if isSuperAdmin}
            <Dropdown class="!bg-red-500 font-semibold shadow-red-400/80 mdc-button mdc-button--raised mdc-dialog__button mdc-ripple-upgraded ml-auto rounded-md shadow-lg text-xs" placement="bottom-end">
                <div class="flex items-center cursor-pointer select-none group">Eliminar</div>
                <div slot="dropdown" class="mt-2 py-2 shadow-xl bg-white rounded text-xs">
                    {#if showCausaIndirectaForm}
                        <Button variant={null} on:click={destroyCausaIndirecta($formCausaIndirecta)}>
                            Confirmar
                            <small class="flex items-center"> También se eliminará la actividad asociada </small>
                        </Button>
                    {:else if showCausaDirectaForm}
                        <Button variant={null} on:click={destroyCausaDirecta($formCausaDirecta)}>
                            Confirmar

                            <small class="flex items-center">También se eliminará el objetivo específico asociado </small>
                        </Button>
                    {:else if showEfectoDirectoForm}
                        <Button variant={null} on:click={destroyEfectoDirecto($formEfectoDirecto)}>
                            Confirmar
                            <small class="flex items-center"> También se eliminará el resultado asociado </small>
                        </Button>
                    {:else if showEfectoIndirectoForm}
                        <Button variant={null} on:click={destroyEfectoIndirecto($formEfectoIndirecto)}>
                            Confirmar
                            <small class="flex items-center"> También se eliminará el impacto asociado </small>
                        </Button>
                    {/if}
                </div>
            </Dropdown>
        {/if}
    </div>
    <div slot="content">
        {#if showCausaIndirectaForm}
            <form on:submit|preventDefault={submitCausaIndirecta} id="causa-indirecta">
                <fieldset disabled={proyecto.allowed.to_update ? undefined : true}>
                    <div>
                        <InfoMessage class="ml-10 mb-6" message="Son acciones o hechos que dan origen a las causas directas y que se encuentran a partir del segundo nivel, justamente debajo de las causas directas del árbol de problemas." />
                        <Textarea disabled={isSuperAdmin ? false : proyecto.codigo_linea_programatica == 70 ? true : false} label="Descripción" maxlength="40000" id="causa-indirecta-descripcion" error={errors.descripcion} bind:value={$formCausaIndirecta.descripcion} required />
                    </div>
                </fieldset>
            </form>
        {:else if showCausaDirectaForm}
            <form on:submit|preventDefault={submitCausaDirecta} id="causa-directa">
                <fieldset disabled={proyecto.allowed.to_update ? undefined : true}>
                    <div>
                        <InfoMessage class="ml-10 mb-6" message="Son las acciones o hechos concretos que generan o dan origen al problema central. Aparecen en la estructura del árbol en el primer nivel, inmediatamente abajo del problema central." />
                        <Textarea disabled={isSuperAdmin ? false : proyecto.codigo_linea_programatica == 70 ? true : false} label="Descripción" maxlength="40000" id="causa-directa-descripcion" error={errors.descripcion} bind:value={$formCausaDirecta.descripcion} required />
                    </div>
                </fieldset>
            </form>
        {:else if showEfectoIndirectoForm}
            <form on:submit|preventDefault={submitEfectoIndirecto} id="efecto-indirecto">
                <fieldset disabled={proyecto.allowed.to_update ? undefined : true}>
                    <div>
                        <InfoMessage class="ml-10 mb-6" message="Corresponden a situaciones negativas generadas por los efectos directos." />
                        <Textarea disabled={isSuperAdmin ? false : proyecto.codigo_linea_programatica == 70 ? true : false} label="Descripción" maxlength="40000" id="efecto-directo-descripcion" error={errors.descripcion} bind:value={$formEfectoIndirecto.descripcion} required />
                    </div>
                </fieldset>
            </form>
        {:else if showProblemaCentralForm}
            <form on:submit|preventDefault={submitProblemaCentral} id="problema-central">
                <fieldset disabled={proyecto.allowed.to_update ? undefined : true}>
                    {#if proyecto.codigo_linea_programatica != 68 || (proyecto.codigo_linea_programatica == 70 && proyecto?.proyecto_base) || (proyecto.codigo_linea_programatica == 70 && checkPermissionByUser(authUser, [24]))}
                        <div>
                            <Label required class="mb-4" labelFor="identificacion_problema" value="Identificación y descripción del problema" />
                            <InfoMessage
                                class="ml-10 mb-6"
                                message="1. Descripción de la necesidad, problema u oportunidad identificada del plan tecnológico y/o agendas departamentales de innovación y competitividad.<br>2. Descripción del problema que se atiende con el proyecto, sustentado en el contexto, la caracterización, los datos, las estadísticas, de la regional, entre otros, citar toda la información consignada utilizando normas APA última edición. La información debe ser de fuentes primarias de información, ejemplo: Secretarías, DANE, Artículos científicos, entre otros."
                            />
                            <Textarea disabled={isSuperAdmin ? false : proyecto.codigo_linea_programatica == 70 ? true : false} label="Identificación y descripción del problema" maxlength="40000" id="identificacion_problema" error={errors.identificacion_problema} bind:value={$formProblemaCentral.identificacion_problema} required />
                        </div>
                        <div class="mt-10">
                            <Label required class="mb-4" labelFor="justificacion_problema" value="Justificación" />
                            <InfoMessage class="ml-10 mb-6" message="Descripción de la solución al problema (descrito anteriormente) que se presenta en la regional, así como las consideraciones que justifican la elección del proyecto. De igual forma, describir la pertinencia y viabilidad del proyecto en el marco del impacto regional identificado en el instrumento de planeación." />

                            <Textarea disabled={isSuperAdmin ? false : proyecto.codigo_linea_programatica == 70 ? true : false} label="Justificación del problema" maxlength="5000" id="justificacion_problema" error={errors.justificacion_problema} bind:value={$formProblemaCentral.justificacion_problema} required />
                        </div>
                    {/if}

                    <div class="mt-10">
                        <Label required class="mb-4" labelFor="problema_central" value="Problema central (tronco)" />
                        <InfoMessage
                            class="ml-10 mb-6"
                            message="Para la redacción del problema central se debe tener en cuenta: a) Se debe referir a una situación existente, teniendo en cuenta la mayoría de los siguientes componentes: social, económico, tecnológico, ambiental. b) Su redacción debe ser una oración corta con sujeto, verbo y predicado. c) Se debe comprender con total claridad; el problema se debe formular mediante una oración clara y sin ambigüedades."
                        />
                        <Textarea disabled={isSuperAdmin ? false : proyecto.codigo_linea_programatica == 70 ? true : false} label="Problema central" maxlength="5000" id="problema_central" error={errors.problema_central} bind:value={$formProblemaCentral.problema_central} required />
                    </div>
                </fieldset>
            </form>
        {:else if showEfectoDirectoForm}
            <form on:submit|preventDefault={submitEfectoDirecto} id="efecto-directo">
                <fieldset disabled={proyecto.allowed.to_update ? undefined : true}>
                    <div>
                        <InfoMessage class="ml-10 mb-6" message="Son aquellos que caracterizan las consecuencias de la situación que existirá en caso de no ejecutarse el proyecto; es decir, si se mantiene inalterado el orden actual de las cosas." />
                        <Textarea disabled={isSuperAdmin ? false : proyecto.codigo_linea_programatica == 70 ? true : false} label="Descripción" maxlength="40000" id="efecto-directo-descripcion" error={errors.descripcion} bind:value={$formEfectoDirecto.descripcion} required />
                    </div>
                </fieldset>
            </form>
        {/if}
    </div>
    <div slot="actions" class="flex items-center justify-center w-full">
        <Button on:click={closeDialog} type="button" variant={null}>Cancelar</Button>

        {#if proyecto.allowed.to_update && formId}
            <LoadingButton loading={$formProblemaCentral.processing || $formCausaDirecta.processing || $formCausaIndirecta.processing || $formEfectoDirecto.processing || $formEfectoIndirecto.processing} class="ml-auto" type="submit" form={formId}>Guardar</LoadingButton>
        {/if}
    </div>
</Dialog>

<style>
    .title:before {
        content: '';
        top: -80px;
        position: absolute;
        z-index: -1;
        right: 50%;
        width: 2px;
        height: 85px;
        background: #d2d6ff;
    }

    .cell {
        background: linear-gradient(165deg, #9458ffbf 25%, rgb(143 96 227) 51%, #734cb9 100%);
        color: #fff;
    }

    .new-item {
        background: linear-gradient(165deg, #d143a0bf 25%, rgb(227 96 192) 51%, #e6499e 100%);
        color: #fff;
    }

    .box-title::before {
        content: '';
        top: 20px;
        position: absolute;
        right: 50%;
        width: 2px;
        height: 60px;
        background: #d2d6ff;
        z-index: auto;
    }
</style>
