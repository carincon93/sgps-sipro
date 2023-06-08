<script>
    import { useForm, page } from '@inertiajs/inertia-svelte'
    import { Inertia } from '@inertiajs/inertia'
    import { route, checkRole, checkPermissionByUser } from '@/Utils'
    import { _ } from 'svelte-i18n'

    import Label from '@/Shared/Label'
    import Input from '@/Shared/Input'
    import LoadingButton from '@/Shared/LoadingButton'
    import InputError from '@/Shared/InputError'
    import Textarea from '@/Shared/Textarea'
    import Select from '@/Shared/Select'
    import InfoMessage from '@/Shared/InfoMessage'
    import Dialog from '@/Shared/Dialog'
    import Button from '@/Shared/Button'
    import Dropdown from '@/Shared/Dropdown'
    import RecomendacionEvaluador from '@/Shared/RecomendacionEvaluador'

    export let errors
    export let to_pdf
    export let convocatoria
    export let proyecto
    export let efectosDirectos
    export let causasDirectas
    export let tiposImpacto
    export let resultados
    export let objetivosEspecificos
    export let faseEvaluacion = false

    let formId

    let dialogOpen = false
    let dialogTitle
    let codigo

    /**
     * Validar si el usuario autenticado es SuperAdmin
     */
    let authUser = $page.props.auth.user
    let isSuperAdmin = checkRole(authUser, [1])

    /**
     * Impactos
     */
    function newImpacto(efectoDirectoId) {
        if (proyecto.allowed.to_update) {
            Inertia.post(
                route('proyectos.efecto-indirecto', {
                    proyecto: proyecto.id,
                    efecto_directo: efectoDirectoId,
                }),
                [],
                {
                    onSuccess: () => {
                        closeDialog()
                    },

                    preserveScroll: true,
                },
            )
        }
    }

    let formImpacto = useForm({
        id: 0,
        efecto_indirecto_id: 0,
        descripcion: '',
        tipo: '',
        resultado_id: '',
    })

    let showImpactoForm = false
    let impactoEfectoIndirecto
    let impactoEfectoIndirectoCodigo
    function showImpactoDialog(efectoIndirecto, efectoIndirectoId, resultadoId) {
        codigo = efectoIndirecto.impacto.id != null ? 'RES-' + resultadoId + '-IMP-' + efectoIndirecto.impacto.id : ''
        dialogTitle = 'Impacto'
        dialogOpen = true
        showImpactoForm = true
        formId = 'impacto-form'
        impactoEfectoIndirecto = efectoIndirecto.descripcion
        impactoEfectoIndirectoCodigo = efectoIndirecto.id

        if (efectoIndirecto.impacto != null) {
            $formImpacto.id = efectoIndirecto.impacto.id
            $formImpacto.descripcion = efectoIndirecto.impacto.descripcion
            $formImpacto.tipo = {
                value: efectoIndirecto.impacto.tipo,
                label: tiposImpacto.find((item) => item.value == efectoIndirecto.impacto.tipo)?.label,
            }
            $formImpacto.efecto_indirecto_id = efectoIndirecto.impacto.efectoIndirectoId
            $formImpacto.resultado_id = resultadoId
        } else {
            $formImpacto.id = null
            $formImpacto.efecto_indirecto_id = efectoIndirectoId
            $formImpacto.resultado_id = ''
        }
    }

    function submitImpacto() {
        if (proyecto.allowed.to_update) {
            $formImpacto.post(
                route('proyectos.impacto', {
                    proyecto: proyecto.id,
                    impacto: $formImpacto.id,
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

    function destroyImpacto(impacto) {
        if (proyecto.allowed.to_update) {
            Inertia.post(route('proyectos.impacto.destroy', [proyecto.id, impacto.id]), [], {
                onSuccess: () => {
                    closeDialog()
                },
                preserveScroll: true,
            })
        }
    }

    /**
     * Resultados
     */
    function newResultado() {
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

    let formResultado = useForm({
        descripcion: '',
        trl: '',
    })

    let showResultadoForm = false
    let descripcionObjetivoEspecifico = []
    let resultadoEfectoDirecto
    $: causasDirectas
    function showResultadoDialog(efectoDirecto, resultado) {
        reset()
        let objetivoEspecifico = causasDirectas.find((causaDirecta) => causaDirecta.objetivo_especifico.id == resultado.objetivo_especifico_id)
        descripcionObjetivoEspecifico = {
            descripcion: objetivoEspecifico ? objetivoEspecifico.objetivo_especifico?.descripcion : 'Sin información registrada',
            numero: objetivoEspecifico ? objetivoEspecifico.objetivo_especifico?.numero : '',
        }
        codigo = 'RES-' + resultado.id
        dialogTitle = 'Resultado'
        dialogOpen = true
        showResultadoForm = true
        formId = 'resultado-form'
        $formResultado.id = resultado.id
        $formResultado.descripcion = resultado.descripcion
        $formResultado.trl = resultado.trl
        $formResultado.objetivo_especifico_id = { value: resultado.objetivo_especifico_id, label: objetivosEspecificos.find((item) => item.value == resultado.objetivo_especifico_id)?.label }
        resultadoEfectoDirecto = efectoDirecto.descripcion ?? 'Sin información registrada'
    }

    function submitResultado() {
        if (proyecto.allowed.to_update) {
            $formResultado.post(
                route('proyectos.resultado', {
                    proyecto: proyecto.id,
                    resultado: $formResultado.id,
                    objetivo_especifico_id: $formResultado.objetivo_especifico_id?.value,
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

    function destroyResultado(resultado) {
        if (proyecto.allowed.to_update) {
            Inertia.post(route('proyectos.resultado.destroy', [proyecto.id, resultado.id]), [], {
                onSuccess: () => {
                    closeDialog()
                },
                preserveScroll: true,
            })
        }
    }

    /**
     * Objetivo general
     */
    let formObjetivoGeneral = useForm({
        objetivo_general: proyecto.objetivo_general,
    })

    let showObjetivoGeneralForm = false
    let problemaCentral
    function showObjetivoGeneralDialog() {
        reset()
        dialogTitle = 'Objetivo general'
        dialogOpen = true
        showObjetivoGeneralForm = true
        formId = 'objetivo-general-form'
        problemaCentral = proyecto.problema_central
        $formObjetivoGeneral.objetivo_general = proyecto.objetivo_general
    }

    function submitObjetivoGeneral() {
        if (proyecto.allowed.to_update) {
            $formObjetivoGeneral.post(route('proyectos.objetivo-general', proyecto.id), {
                onSuccess: () => {
                    closeDialog()
                },

                preserveScroll: true,
            })
        }
    }

    /**
     * Objetivos específicos
     */
    function newObjetivoEspecifico() {
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

    let formObjetivoEspecifico = useForm({
        id: 0,
        descripcion: '',
        numero: 0,
    })

    let showObjetivoEspecificoForm = false
    let causaDirectaObjetivoEspecifico
    function showObjetivoEspecificoDialog(causaDirecta, numero) {
        reset()
        codigo = 'OBJ-ESP-' + causaDirecta.objetivo_especifico.id
        dialogTitle = causaDirecta.objetivo_especifico.numero
        dialogOpen = true
        showObjetivoEspecificoForm = true
        formId = 'objetivo-especifico-form'
        $formObjetivoEspecifico.id = causaDirecta.objetivo_especifico.id
        $formObjetivoEspecifico.descripcion = causaDirecta.objetivo_especifico.descripcion
        $formObjetivoEspecifico.numero = numero
        causaDirectaObjetivoEspecifico = causaDirecta.descripcion ?? 'Sin información registrada'
    }

    function submitObjetivoEspecifico() {
        if (proyecto.allowed.to_update) {
            $formObjetivoEspecifico.post(
                route('proyectos.objetivo-especifico', {
                    proyecto: proyecto.id,
                    objetivo_especifico: $formObjetivoEspecifico.id,
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

    function destroyObjetivoEspecifico(objetivoEspecifico) {
        if (proyecto.allowed.to_update) {
            Inertia.post(route('proyectos.objetivo-especifico.destroy', [proyecto.id, objetivoEspecifico.id]), [], {
                onSuccess: () => {
                    closeDialog()
                },
                preserveScroll: true,
            })
        }
    }

    /**
     * Actividades
     */
    function newActividad(causaDirectaId) {
        if (proyecto.allowed.to_update) {
            Inertia.post(
                route('proyectos.causa-indirecta', {
                    proyecto: proyecto.id,
                    causa_directa: causaDirectaId,
                }),
                [],
                {
                    onSuccess: () => {
                        closeDialog()
                    },

                    preserveScroll: true,
                },
            )
        }
    }

    let formActividad = useForm({
        id: 0,
        fecha_inicio: '',
        fecha_finalizacion: '',
        causa_indirecta_id: 0,
        objetivo_especifico_id: 0,
        resultado_id: 0,
        descripcion: '',
    })

    let showActividadForm = false
    let actividadCausaIndirecta
    let resultadosFiltrados
    let codigoCausaIndirecta
    function showActividadDialog(causaIndirecta, objetivoEspecificoId) {
        reset()
        codigo = causaIndirecta.actividad.id != null ? 'OBJ-ESP-' + objetivoEspecificoId + '-ACT-' + causaIndirecta.actividad.id : ''
        dialogTitle = 'Actividad'
        dialogOpen = true
        showActividadForm = true
        codigoCausaIndirecta = causaIndirecta.id
        formId = 'actividad-form'
        resultadosFiltrados = resultados.filter((item) => item.objetivo_especifico_id == objetivoEspecificoId)
        resultadosFiltrados = resultadosFiltrados.filter((item) => item.label != null)
        actividadCausaIndirecta = causaIndirecta.descripcion ?? 'Sin información registrada'

        $formActividad.id = causaIndirecta.actividad.id
        $formActividad.fecha_inicio = causaIndirecta.actividad.fecha_inicio
        $formActividad.fecha_finalizacion = causaIndirecta.actividad.fecha_finalizacion
        $formActividad.causa_indirecta_id = causaIndirecta.actividad.causa_indirecta_id
        $formActividad.objetivo_especifico_id = objetivoEspecificoId
        $formActividad.descripcion = causaIndirecta.actividad.descripcion
        $formActividad.resultado_id = {
            value: causaIndirecta.actividad.resultado_id,
            label: resultados.find((item) => item.value == causaIndirecta.actividad.resultado_id)?.label,
        }
    }

    function submitActividad() {
        if (proyecto.allowed.to_update) {
            $formActividad.post(
                route('proyectos.actividad', {
                    convocatoria: convocatoria.id,
                    proyecto: proyecto.id,
                    actividad: $formActividad.id,
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

    function destroyActividad(actividad) {
        if (proyecto.allowed.to_update) {
            Inertia.post(route('proyectos.actividad.destroy', [proyecto.id, actividad.id]), [], {
                onSuccess: () => {
                    closeDialog()
                },
                preserveScroll: true,
            })
        }
    }

    function reset() {
        showObjetivoGeneralForm = false
        showActividadForm = false
        showResultadoForm = false
        showImpactoForm = false
        showObjetivoEspecificoForm = false
        dialogTitle = ''
        codigo = ''
        formId = ''

        $formImpacto.reset()
        $formResultado.reset()
        $formObjetivoGeneral.reset()
        $formObjetivoEspecifico.reset()
        $formActividad.reset()
    }

    function closeDialog() {
        reset()
        dialogOpen = false
    }
</script>

<h1 class="text-3xl {to_pdf ? '' : 'mt-24'} mb-8 text-center">Árbol de objetivos</h1>
<p class="text-center">El árbol de objetivos se obtiene al transformar en positivo el árbol de problemas manteniendo la misma estructura y niveles de jerarquía.</p>

{#if (isSuperAdmin && faseEvaluacion == false) || (proyecto.mostrar_recomendaciones && faseEvaluacion == false)}
    <RecomendacionEvaluador class="mt-8">
        {#each proyecto.evaluaciones as evaluacion, i}
            {#if isSuperAdmin || (evaluacion.finalizado && evaluacion.habilitado)}
                <div class="bg-zinc-900 p-4 rounded shadow text-white my-2">
                    <p class="text-xs">Evaluador COD-{evaluacion.id}:</p>

                    {#if evaluacion.idi_evaluacion}
                        <h1 class="font-black mt-10">Objetivos</h1>
                        <p class="whitespace-pre-line text-xs">{evaluacion.idi_evaluacion?.objetivos_comentario ? evaluacion.idi_evaluacion.objetivos_comentario : 'Sin recomendación'}</p>

                        <hr class="mt-10 mb-10 border-black-200" />
                        <h1 class="font-black">Resultados</h1>

                        <p class="whitespace-pre-line text-xs">{evaluacion.idi_evaluacion?.resultados_comentario ? evaluacion.idi_evaluacion.resultados_comentario : 'Sin recomendación'}</p>
                    {:else if evaluacion.cultura_innovacion_evaluacion}
                        <h1 class="font-black mt-10">Objetivos</h1>
                        <p class="whitespace-pre-line text-xs">{evaluacion.cultura_innovacion_evaluacion?.objetivos_comentario ? evaluacion.cultura_innovacion_evaluacion.objetivos_comentario : 'Sin recomendación'}</p>

                        <hr class="mt-10 mb-10 border-black-200" />
                        <h1 class="font-black">Resultados</h1>

                        <p class="whitespace-pre-line text-xs">{evaluacion.cultura_innovacion_evaluacion?.resultados_comentario ? evaluacion.cultura_innovacion_evaluacion.resultados_comentario : 'Sin recomendación'}</p>
                    {:else if evaluacion.servicio_tecnologico_evaluacion}
                        <h1 class="font-black mt-10">Objetivo general</h1>

                        <p class="whitespace-pre-line text-xs">{evaluacion.servicio_tecnologico_evaluacion?.objetivo_general_comentario ? evaluacion.servicio_tecnologico_evaluacion.objetivo_general_comentario : 'Sin recomendación'}</p>

                        <hr class="mt-10 mb-10 border-black-200" />
                        <h1 class="font-black">Objetivos específicos</h1>

                        <ul class="list-disc pl-4">
                            <li class="whitespace-pre-line text-xs mb-10">{evaluacion.servicio_tecnologico_evaluacion?.primer_objetivo_comentario ? 'Recomendación primer objetivo específico: ' + evaluacion.servicio_tecnologico_evaluacion.primer_objetivo_comentario : 'Sin recomendación'}</li>
                            <li class="whitespace-pre-line text-xs mb-10">{evaluacion.servicio_tecnologico_evaluacion?.segundo_objetivo_comentario ? 'Recomendación segundo objetivo específico: ' + evaluacion.servicio_tecnologico_evaluacion.segundo_objetivo_comentario : 'Sin recomendación'}</li>
                            <li class="whitespace-pre-line text-xs mb-10">{evaluacion.servicio_tecnologico_evaluacion?.tercer_objetivo_comentario ? 'Recomendación tercer objetivo específico: ' + evaluacion.servicio_tecnologico_evaluacion.tercer_objetivo_comentario : 'Sin recomendación'}</li>
                            <li class="whitespace-pre-line text-xs mb-10">{evaluacion.servicio_tecnologico_evaluacion?.cuarto_objetivo_comentario ? 'Recomendación cuarto objetivo específico: ' + evaluacion.servicio_tecnologico_evaluacion.cuarto_objetivo_comentario : 'Sin recomendación'}</li>
                        </ul>

                        <hr class="mt-10 mb-10 border-black-200" />
                        <h1 class="font-black">Resultados</h1>
                        <ul class="list-disc pl-4">
                            <li class="whitespace-pre-line text-xs mb-10">{evaluacion.servicio_tecnologico_evaluacion?.resultados_primer_obj_comentario ? 'Recomendación resultados del primer objetivo específico: ' + evaluacion.servicio_tecnologico_evaluacion.resultados_primer_obj_comentario : 'Sin recomendación'}</li>
                            <li class="whitespace-pre-line text-xs mb-10">{evaluacion.servicio_tecnologico_evaluacion?.resultados_segundo_obj_comentario ? 'Recomendación resultados del segundo objetivo específico: ' + evaluacion.servicio_tecnologico_evaluacion.resultados_segundo_obj_comentario : 'Sin recomendación'}</li>
                            <li class="whitespace-pre-line text-xs mb-10">{evaluacion.servicio_tecnologico_evaluacion?.resultados_tercer_obj_comentario ? 'Recomendación resultados del tercer objetivo específico: ' + evaluacion.servicio_tecnologico_evaluacion.resultados_tercer_obj_comentario : 'Sin recomendación'}</li>
                            <li class="whitespace-pre-line text-xs mb-10">{evaluacion.servicio_tecnologico_evaluacion?.resultados_cuarto_obj_comentario ? 'Recomendación resultados del cuarto objetivo específico: ' + evaluacion.servicio_tecnologico_evaluacion.resultados_cuarto_obj_comentario : 'Sin recomendación'}</li>
                        </ul>
                    {:else if evaluacion.ta_evaluacion}
                        <p class="whitespace-pre-line text-xs">{evaluacion.ta_evaluacion?.arbol_objetivos_comentario ? evaluacion.ta_evaluacion.arbol_objetivos_comentario : 'Sin recomendación'}</p>
                    {:else if evaluacion.tp_evaluacion}
                        <p class="whitespace-pre-line text-xs">{evaluacion.tp_evaluacion?.arbol_objetivos_comentario ? evaluacion.tp_evaluacion.arbol_objetivos_comentario : 'Sin recomendación'}</p>
                    {/if}
                </div>
            {/if}
        {/each}
    </RecomendacionEvaluador>
{/if}

<div>
    <!-- Resultados e impactos relacionados -->
    <div class="resultado-container">
        <div class="p-2">
            <div class="text-5xl font-extrabold">
                <span class="bg-clip-text text-transparent my-6 m-auto bg-gradient-to-r from-app-500 to-app-300 block w-max"> Objetivo general </span>
            </div>
            <p class="text-center my-10">Por favor diligencie el objetivo general</p>
            <div on:click={showObjetivoGeneralDialog} class="cell border border-app-500 h-20 flex items-center justify-center shadow-lg p-4 cursor-pointer hover:shadow-app-500/80">
                {#if proyecto.objetivo_general != null && proyecto.objetivo_general.length > 0}
                    <p class="leading-tight paragraph-ellipsis text-xs">
                        {proyecto.objetivo_general}
                    </p>
                {:else}
                    <p class="text-xs flex items-center">Sin información registrada aún. Por favor modifique el objetivo general</p>
                {/if}
            </div>

            <hr class="w-full my-10" />

            <div class="text-5xl font-extrabold mb-10 title relative">
                <span class="bg-clip-text text-transparent my-6 m-auto bg-gradient-to-r from-app-500 to-app-300 block w-max box-title relative"> Objetivos específicos y actividades </span>
            </div>

            <p class="text-center my-10">Por favor genere algún objetivo específico y asocie sus respectivas actividades</p>

            <div class="grid grid-cols-2 gap-2">
                {#each causasDirectas as causaDirecta, i}
                    <div class="p-2 border border-app-300 mr-2 shadow-inner my-20">
                        <span class="m-auto text-app-600 block w-max"> Objetivo específico # {causaDirecta.objetivo_especifico.numero} </span>
                        <div class="{causaDirecta.objetivo_especifico.descripcion != null && causaDirecta.objetivo_especifico.descripcion.length > 0 ? 'cell' : ''} border my-14 border-app-500 cursor-pointer shadow-lg hover:shadow-app-500/80 p-4 min-h-[160px]" on:click={showObjetivoEspecificoDialog(causaDirecta, i + 1)}>
                            <p class="leading-tight paragraph-ellipsis text-xs">
                                <small class="block font-bold mb-2">OBJ-ESP-{causaDirecta.objetivo_especifico.id}</small>
                                {#if causaDirecta.objetivo_especifico.descripcion != null && causaDirecta.objetivo_especifico.descripcion.length > 0}
                                    {causaDirecta.objetivo_especifico.descripcion}
                                {:else}
                                    <p class="text-xs flex items-center mt-4">Sin información registrada aún. Por favor modifique este objetivo específico</p>
                                {/if}
                            </p>
                        </div>

                        <div class="mb-14">
                            <span class="m-auto text-app-600 block w-max box-title relative"> Actividades </span>
                        </div>

                        <div class="grid {causaDirecta.causas_indirectas.length > 0 ? 'grid-cols-4' : ''} gap-3">
                            {#each causaDirecta.causas_indirectas as causaIndirecta, j}
                                <div
                                    class="{causaIndirecta.actividad?.descripcion != null && causaIndirecta.actividad?.descripcion.length > 0 && causaIndirecta.actividad?.descripcion != ' ' ? 'cell' : ''} border border-app-500 mb-10 relative space-x-4 cursor-pointer shadow-lg hover:shadow-app-500/80 p-4 min-h-[136px]"
                                    style="flex: 1 0 33.333%"
                                    on:click={showActividadDialog(causaIndirecta, causaDirecta.objetivo_especifico.id)}
                                >
                                    <p class="leading-tight paragraph-ellipsis text-xs">
                                        <small class="block font-bold mb-2">OBJ-ESP-{causaDirecta.objetivo_especifico.id}-ACT-{causaIndirecta.actividad?.id}</small>
                                        {#if causaIndirecta.actividad?.descripcion != null && causaIndirecta.actividad?.descripcion.length > 0 && causaIndirecta.actividad?.descripcion != ' '}
                                            {causaIndirecta.actividad?.descripcion}
                                        {:else}
                                            <p class="flex items-center mt-4 text-xs">Sin información registrada aún. Por favor modifique esta actividad.</p>
                                        {/if}
                                    </p>
                                </div>
                            {/each}

                            {#if isSuperAdmin || checkRole(authUser, [4, 5, 6, 12, 13, 15, 16, 17]) || (proyecto.codigo_linea_programatica == 69 && proyecto?.proyecto_base) || (proyecto.codigo_linea_programatica == 69 && checkPermissionByUser( authUser, [23], )) || (proyecto.codigo_linea_programatica == 70 && proyecto?.proyecto_base) || (proyecto.codigo_linea_programatica == 70 && checkPermissionByUser( authUser, [24], ))}
                                <div class="new-item mb-10 relative flex flex-col items-center justify-center space-x-4 cursor-pointer shadow-lg hover:shadow-fuchsia-400/80 p-4 min-h-[136px]" style="flex: 1 0 33.333%" on:click={() => newActividad(causaDirecta.id)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                    <p class="text-xs flex items-center">
                                        Asociar una nueva actividad al objetivo específico con código: OBJ-ESP-{causaDirecta.objetivo_especifico.id}
                                    </p>
                                </div>
                            {/if}
                        </div>
                    </div>
                {/each}

                {#if isSuperAdmin || checkRole(authUser, [4, 5, 6, 12, 13, 15, 16, 17]) || (proyecto.codigo_linea_programatica == 69 && proyecto?.proyecto_base) || (proyecto.codigo_linea_programatica == 69 && checkPermissionByUser( authUser, [23], )) || (proyecto.codigo_linea_programatica == 70 && proyecto?.proyecto_base) || (proyecto.codigo_linea_programatica == 70 && checkPermissionByUser( authUser, [24], ))}
                    <div class="p-2 border border-app-300 mr-2 item my-20 cursor-pointer flex flex-col shadow-lg min-h-[570px] hover:bg-fuchsia-400 hover:text-white items-center justify-center" on:click={() => newObjetivoEspecifico()}>
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        <p class="text-xs flex items-center justify-center">
                            <small class="block font-bold">Añadir un nuevo objetivo específico</small>
                        </p>
                    </div>
                {/if}
            </div>

            <hr class="w-full my-10" />

            <div class="text-5xl font-extrabold mb-10 title relative">
                <span class="bg-clip-text text-transparent m-auto bg-gradient-to-r from-app-500 to-app-300 block w-max"> Resultados e impactos </span>
            </div>

            <p class="text-center my-10">Por favor genere algún resultado y asocie sus respectivos impactos</p>

            <div class="grid grid-cols-2 gap-2">
                {#each efectosDirectos as efectoDirecto, i}
                    <div class="p-2 border border-app-300 mr-2 shadow-inner my-20">
                        <span class="m-auto text-app-600 block w-max box-title relative"> Resultado </span>
                        <small class="block text-center">Código: {efectoDirecto?.resultado?.id}</small>
                        <div class="{efectoDirecto.resultado?.descripcion != null && efectoDirecto.resultado?.descripcion.length > 0 ? 'cell' : ''} border border-app-500 relative my-14 shadow-lg cursor-pointer hover:shadow-app-500/80 p-4 min-h-[160px]" on:click={showResultadoDialog(efectoDirecto, efectoDirecto.resultado)}>
                            <p class="leading-tight paragraph-ellipsis text-xs">
                                <small class="block font-bold mb-2">RES-{efectoDirecto?.resultado?.id}</small>
                                {#if efectoDirecto.resultado?.descripcion != null && efectoDirecto.resultado?.descripcion.length > 0}
                                    {efectoDirecto.resultado?.descripcion}
                                {:else}
                                    <p class="text-xs flex items-center mt-4">Sin información registrada aún. Por favor modifique este resultado</p>
                                {/if}
                            </p>
                        </div>

                        <div class="mb-5">
                            <span class="m-auto text-app-600 block w-max box-title relative"> Impactos </span>
                        </div>

                        <div class="grid {efectoDirecto.efectos_indirectos.length > 0 ? 'grid-cols-4' : ''} gap-3">
                            {#each efectoDirecto.efectos_indirectos as efectoIndirecto}
                                <div class="{efectoIndirecto.impacto.descripcion != null && efectoIndirecto.impacto.descripcion.length > 0 ? 'cell' : ''} border border-app-500 relative mt-10 space-x-4 cursor-pointer shadow-lg hover:shadow-app-500/80 p-4 min-h-[136px] flex-1" on:click={showImpactoDialog(efectoIndirecto, efectoDirecto.id, efectoDirecto?.resultado?.id)}>
                                    <p class="leading-tight paragraph-ellipsis text-xs">
                                        <small class="block font-bold mb-2">RES-{efectoDirecto?.resultado?.id}-IMP-{efectoIndirecto.impacto.id}</small>
                                        {#if efectoIndirecto.impacto.descripcion != null && efectoIndirecto.impacto.descripcion.length > 0}
                                            {efectoIndirecto.impacto.descripcion}
                                        {:else}
                                            <p class="text-xs flex items-center mt-4">Sin información registrada aún. Por favor modifique este impacto.</p>
                                        {/if}
                                    </p>
                                </div>
                            {/each}
                            {#if isSuperAdmin || checkRole(authUser, [4, 5, 6, 12, 13, 15, 16, 17]) || (proyecto.codigo_linea_programatica == 69 && proyecto?.proyecto_base) || (proyecto.codigo_linea_programatica == 69 && checkPermissionByUser( authUser, [23], )) || (proyecto.codigo_linea_programatica == 70 && proyecto?.proyecto_base) || (proyecto.codigo_linea_programatica == 70 && checkPermissionByUser( authUser, [24], ))}
                                <div class="new-item mt-10 relative flex flex-col items-center justify-center shadow-lg p-4 min-h-[136px] cursor-pointer hover:shadow-fuchsia-400/80" on:click={() => newImpacto(efectoDirecto.id)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                    <p class="text-xs flex items-center">
                                        Asociar un nuevo impacto al resultado con código RES-{efectoDirecto.resultado?.id}
                                    </p>
                                </div>
                            {/if}
                        </div>
                    </div>
                {/each}
                {#if isSuperAdmin || checkRole(authUser, [4, 5, 6, 12, 13, 15, 16, 17]) || (proyecto.codigo_linea_programatica == 69 && proyecto?.proyecto_base) || (proyecto.codigo_linea_programatica == 69 && checkPermissionByUser( authUser, [23], )) || (proyecto.codigo_linea_programatica == 70 && proyecto?.proyecto_base) || (proyecto.codigo_linea_programatica == 70 && checkPermissionByUser( authUser, [24], ))}
                    <div class="p-2 border border-app-300 mr-2 flex flex-col item justify-center my-20 cursor-pointer shadow-lg min-h-[570px] hover:bg-fuchsia-400 hover:text-white items-center" on:click={() => newResultado()}>
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        <p class="text-xs flex items-center justify-center">
                            <small class="block font-bold">Añadir un nuevo resultado</small>
                        </p>
                    </div>
                {/if}
            </div>
        </div>
    </div>

    <!-- Dialog -->
    <Dialog bind:open={dialogOpen} id="arbol-objetivos">
        <div slot="title">
            <div class="mb-10 text-center">
                <div class="text-primary">
                    {dialogTitle}
                </div>
                {#if codigo}
                    <small class="block text-primary-light">
                        Código: {codigo}
                    </small>
                {/if}

                <!-- {#if isSuperAdmin || checkRole(authUser, [4, 5, 6, 12, 13, 15, 16, 17]) || (proyecto.allowed.to_update && proyecto.codigo_linea_programatica != 69) || (proyecto.codigo_linea_programatica == 70 && proyecto?.proyecto_base) || proyecto.codigo_linea_programatica == 70 && checkPermissionByUser(authUser, [24])} -->
                {#if isSuperAdmin}
                    <Dropdown class="!bg-red-500 font-semibold shadow-red-400/80 mdc-button mdc-button--raised mdc-dialog__button mdc-ripple-upgraded ml-auto rounded-md shadow-lg text-xs" placement="bottom-end">
                        <div class="flex items-center cursor-pointer select-none group">Eliminar</div>
                        <div slot="dropdown" class="mt-2 py-2 shadow-xl bg-white rounded text-xs">
                            {#if showImpactoForm}
                                <Button variant={null} on:click={destroyImpacto($formImpacto)}>
                                    Confirmar
                                    <small class="flex items-center"> También se eliminará el efecto indirecto asociado </small>
                                </Button>
                            {:else if showResultadoForm}
                                <Button variant={null} on:click={destroyResultado($formResultado)}>
                                    Confirmar

                                    <small class="flex items-center">También se eliminará el efecto directo asociado </small>
                                </Button>
                            {:else if showActividadForm}
                                <Button variant={null} on:click={destroyActividad($formActividad)}>
                                    Confirmar
                                    <small class="flex items-center"> También se eliminará la causa indirecta asociada </small>
                                </Button>
                            {:else if showObjetivoEspecificoForm}
                                <Button variant={null} on:click={destroyObjetivoEspecifico($formObjetivoEspecifico)}>
                                    Confirmar
                                    <small class="flex items-center"> También se eliminará la causa indirecta asociada </small>
                                </Button>
                            {/if}
                        </div>
                    </Dropdown>
                {/if}
            </div>
        </div>
        <div slot="content">
            {#if showActividadForm}
                <InfoMessage class="ml-10 mb-6">
                    Se debe evidenciar que la descripción de las actividades se realice de manera secuencial y de forma coherente con los productos a las cuales están asociadas para alcanzar el logro de cada uno de los objetivos específicos.
                    <br />
                    Las actividades deben redactarse en verbos en modo infinitivo, es decir, en palabras que expresen acciones y terminen en “ar”, “er” o “ir”, estos no deben hacer referencia a objetivos específicos o generales. Algunos ejemplos de verbos inadecuados para describir actividades son: apropiar, asegurar, colaborar, consolidar, desarrollar, fomentar, fortalecer, garantizar, implementar,
                    impulsar, mejorar, movilizar, proponer, promover, entre otros.
                </InfoMessage>
                <p class="block font-medium mb-2 text-gray-700 text-xs">Causa indirecta (Código {codigoCausaIndirecta})</p>
                <p class="mb-10 whitespace-pre-line">
                    {actividadCausaIndirecta}
                </p>
                <form on:submit|preventDefault={submitActividad} id="actividad-form">
                    <fieldset disabled={proyecto.allowed.to_update ? undefined : true}>
                        {#if proyecto.codigo_linea_programatica == 69 || proyecto.codigo_linea_programatica == 70}
                            <div>
                                <Label required labelFor="resultado_id" value="Resultado" />
                                <Select id="resultado_id" items={resultadosFiltrados} bind:selectedValue={$formActividad.resultado_id} error={errors.resultado_id} autocomplete="off" placeholder="Seleccione un resultado" required />
                            </div>
                        {/if}

                        <div class="mt-8">
                            <p class="text-center">Fecha de ejecución</p>
                            <div class="mt-4 flex items-start justify-around">
                                <div class="mt-4 flex {errors.fecha_inicio ? '' : 'items-center'}">
                                    <Label required labelFor="fecha_inicio" class={errors.fecha_inicio ? 'top-3.5 relative' : ''} value="Del" />
                                    <div class="ml-4">
                                        <input id="fecha_inicio" type="date" class="mt-1 block w-full p-4" min={proyecto.fecha_inicio} max={proyecto.fecha_finalizacion} bind:value={$formActividad.fecha_inicio} required />
                                    </div>
                                </div>
                                <div class="mt-4 flex {errors.fecha_finalizacion ? '' : 'items-center'}">
                                    <Label required labelFor="fecha_finalizacion" class={errors.fecha_finalizacion ? 'top-3.5 relative' : ''} value="hasta" />
                                    <div class="ml-4">
                                        <input id="fecha_finalizacion" type="date" class="mt-1 block w-full p-4" min={proyecto.fecha_inicio} max={proyecto.fecha_finalizacion} bind:value={$formActividad.fecha_finalizacion} required />
                                    </div>
                                </div>
                            </div>
                            {#if errors.fecha_inicio || errors.fecha_finalizacion}
                                <InputError message={errors.fecha_inicio || errors.fecha_finalizacion} />
                            {/if}
                        </div>

                        <div class="mt-8">
                            <Textarea disabled={isSuperAdmin ? false : proyecto.codigo_linea_programatica == 70 ? true : false} label="Descripción" maxlength="15000" id="descripcion-actividad" error={errors.descripcion} bind:value={$formActividad.descripcion} required />
                        </div>
                    </fieldset>
                </form>
            {:else if showObjetivoEspecificoForm}
                {#if proyecto.codigo_linea_programatica == 68}
                    <InfoMessage class="ml-10 mb-6">
                        <p>
                            Los objetivos específicos son los medios cuantificables que llevarán al cumplimiento del objetivo general. Estos surgen de pasar a positivo las causas directas identificadas en el árbol de problemas.
                            <br />
                            La redacción de los objetivos específicos deberá iniciar con un verbo en modo infinitivo, es decir, con una palabra terminada en "ar", "er" o "ir". La estructura del objetivo debe contener al menos tres componentes: (1) la acción que se espera realizar, (2) el objeto sobre el cual recae la acción y (3) elementos adicionales de contexto o descriptivos.
                        </p>
                    </InfoMessage>
                {/if}
                <form on:submit|preventDefault={submitObjetivoEspecifico} id="objetivo-especifico-form">
                    <fieldset disabled={proyecto.allowed.to_update ? undefined : true}>
                        <p class="block font-medium mb-2 text-gray-700 text-xs">Causa directa</p>

                        <p class="mb-20 whitespace-pre-line">
                            {causaDirectaObjetivoEspecifico}
                        </p>
                        <div>
                            <Textarea disabled={isSuperAdmin ? false : proyecto.codigo_linea_programatica == 70 ? true : false} label="Descripción" maxlength="40000" id="descripcion-objetivo-especifico" error={errors.descripcion} bind:value={$formObjetivoEspecifico.descripcion} required />
                        </div>
                    </fieldset>
                </form>
            {:else if showObjetivoGeneralForm}
                <form on:submit|preventDefault={submitObjetivoGeneral} id="objetivo-general-form">
                    <fieldset disabled={proyecto.allowed.to_update ? undefined : true}>
                        {#if proyecto.codigo_linea_programatica == 68}
                            <InfoMessage class="ml-10 mb-6">
                                <p>
                                    El objetivo general se origina al convertir en positivo el problema principal (tronco) identificado en el árbol de problemas.
                                    <br />
                                    La redacción deberá iniciar con un verbo en modo infinitivo, es decir, con una palabra terminada en "ar", "er" o "ir". La estructura del objetivo debe contener al menos tres componentes: (1) la acción que se espera realizar, (2) el objeto sobre el cual recae la acción y (3) elementos adicionales de contexto o descriptivos.
                                    <br />
                                    El objetivo general debe expresar el fin concreto del proyecto en correspondencia directa con el título del proyecto y la pregunta de la formulación del problema, el cual debe ser claro, medible, alcanzable y consistente con el proyecto que está formulando. Debe responde al ¿Qué?, ¿Cómo? y el ¿Para qué?
                                </p>
                            </InfoMessage>
                        {:else}
                            <InfoMessage class="ml-10 mb-6" message="Establece que pretende alcanzar la investigación. Se inicia con un verbo en modo infinitivo, es medible y alcanzable. Responde al Qué, Cómo y el Para qué" />
                        {/if}
                        <p class="block font-medium mb-2 text-gray-700 text-xs">Problema central</p>

                        <p class="mb-20 whitespace-pre-line">
                            {problemaCentral ? problemaCentral : 'Sin información registrada'}
                        </p>
                        <div>
                            <Label required class="mb-4" labelFor="objetivo-general" value="Objetivo general" />
                            <Textarea disabled={isSuperAdmin ? false : proyecto.codigo_linea_programatica == 70 ? true : false} label="Descripción" maxlength="10000" id="objetivo-general" error={errors.objetivo_general} bind:value={$formObjetivoGeneral.objetivo_general} required />
                        </div>
                    </fieldset>
                </form>
            {:else if showResultadoForm}
                <InfoMessage class="ml-10 mb-6">Se debe evidenciar que los resultados son directos, medibles y cuantificables que se alcanzarán con el desarrollo de cada uno de los objetivos específicos del proyecto.</InfoMessage>
                <p class="block font-medium mb-2 text-gray-700 text-xs">Efecto directo</p>
                <p class="mb-20 whitespace-pre-line">
                    {resultadoEfectoDirecto}
                </p>

                {#if descripcionObjetivoEspecifico}
                    <p class="block font-medium mb-2 text-gray-700 text-xs">
                        Objetivo específico #{descripcionObjetivoEspecifico.numero} - Relacionado
                    </p>
                    <p class="mb-20 whitespace-pre-line">
                        {descripcionObjetivoEspecifico.descripcion}
                    </p>
                {/if}

                <form on:submit|preventDefault={submitResultado} id="resultado-form">
                    <fieldset disabled={proyecto.allowed.to_update ? undefined : true}>
                        {#if objetivosEspecificos.length == 0}
                            <InfoMessage class="ml-10 mb-6">Por favor genere primero los objetivos específicos.</InfoMessage>
                        {:else}
                            <div class="mb-10">
                                <InfoMessage class="ml-10">Por seleccione un objetivo específico.</InfoMessage>

                                <Select id="objetivo-especifico" items={objetivosEspecificos} bind:selectedValue={$formResultado.objetivo_especifico_id} error={errors.objetivo_especifico_id} autocomplete="off" placeholder="Seleccione un objetivo específico" required />
                            </div>

                            {#if proyecto.codigo_linea_programatica == 23 || proyecto.codigo_linea_programatica == 65 || proyecto.codigo_linea_programatica == 66 || proyecto.codigo_linea_programatica == 82}
                                <div class="mb-10">
                                    <Input label="TRL" id="trl" type="number" input$max="9" input$min="1" class="block w-full" error={errors.trl} bind:value={$formResultado.trl} required />
                                </div>
                            {/if}
                            <div class="mb-20">
                                <Textarea disabled={isSuperAdmin ? false : proyecto.codigo_linea_programatica == 70 ? true : false} label="Descripción" maxlength="1000" id="descripcion-resultado" error={errors.descripcion} bind:value={$formResultado.descripcion} required />
                            </div>
                        {/if}
                    </fieldset>
                </form>
            {:else if showImpactoForm}
                <InfoMessage class="ml-10 mb-6">Se busca medir la contribución potencial que genera el proyecto en los siguientes ámbitos: tecnológico, económico, ambiental, social, centro de formación, sector productivo</InfoMessage>

                <p class="block font-medium mb-2 text-gray-700 text-xs">Efecto indirecto (Código {impactoEfectoIndirectoCodigo})</p>

                <p class="mt-4 whitespace-pre-line">
                    {impactoEfectoIndirecto ? impactoEfectoIndirecto : 'Sin información registrada aún'}
                </p>

                <form on:submit|preventDefault={submitImpacto} id="impacto-form">
                    <fieldset disabled={proyecto.allowed.to_update ? undefined : true}>
                        <div class="mt-8">
                            <Label labelFor="tipo-impacto" value="Tipo" />
                            <Select id="tipo-impacto" items={tiposImpacto} bind:selectedValue={$formImpacto.tipo} error={errors.tipo} autocomplete="off" placeholder="Seleccione un tipo" required />
                            {#if $formImpacto.tipo?.value == 4}
                                <InfoMessage
                                    class="ml-10 mb-6"
                                    message="Se busca minimizar y/o evitar los impactos negativos sobre el medio ambiente, tales como contaminación del aire, contaminación de corrientes de agua naturales, ruido, destrucción del paisaje, separación de comunidades que operan como unidades, etc. Por otro lado, se busca identificar diversas acciones de impacto ambiental positivo, tales como: producción limpia y sustentable, protección medioambiental, uso de residuos y reciclaje."
                                />
                            {:else if $formImpacto.tipo?.value == 2}
                                <InfoMessage
                                    class="ml-10 mb-6"
                                    message="Se busca medir la contribución potencial del proyecto en cualquiera de los siguientes ámbitos: generación y aplicación de nuevos conocimientos y tecnologías, desarrollo de infraestructura científico- tecnológica, articulación de diferentes proyectos para lograr un objetivo común, mejoramiento de la infraestructura, desarrollo de capacidades de gestión tecnológica."
                                />
                            {:else if $formImpacto.tipo?.value == 5}
                                <InfoMessage class="ml-10 mb-6" message="Se busca medir la contribución potencial del proyecto al desarrollo de la comunidad Sena (Aprendices, instructores y a la formación)" />
                            {:else if $formImpacto.tipo?.value == 6}
                                <InfoMessage class="ml-10 mb-6" message="Se busca medir la contribución potencial del proyecto al desarrollo del sector productivo en concordancia con el sector priorizado de Colombia Productiva y a la mesa técnica a la que pertenece el proyecto." />
                            {/if}
                        </div>
                        <div class="mt-8">
                            <Textarea disabled={isSuperAdmin ? false : proyecto.codigo_linea_programatica == 70 ? true : false} label="Descripción" maxlength="10000" id="descripcion-impacto" error={errors.descripcion} bind:value={$formImpacto.descripcion} required />
                        </div>
                    </fieldset>
                </form>
            {/if}
        </div>
        <div slot="actions" class="flex w-full">
            <Button on:click={closeDialog} type="button" variant={null}>Cancelar</Button>
            {#if proyecto.allowed.to_update && formId}
                <LoadingButton loading={$formImpacto.processing || $formActividad.processing || $formObjetivoEspecifico.processing || $formObjetivoGeneral.processing || $formResultado.processing} class="btn-gray ml-auto" type="submit" form={formId}>Guardar</LoadingButton>
            {/if}
        </div>
    </Dialog>
</div>

{#if to_pdf}
    <style>
        nav,
        button.absolute.bottom-1\.5,
        .bg-gray-200.p-4.rounded.border-orangered.border.mb-5 {
            display: none !important;
        }
    </style>
{/if}

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
