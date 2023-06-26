<script>
    import { useForm, page } from '@inertiajs/inertia-svelte'
    import { Inertia } from '@inertiajs/inertia'
    import { route, checkRole, checkPermissionByUser } from '@/Utils'
    import { _ } from 'svelte-i18n'

    import Label from '@/Shared/Label'
    import LoadingButton from '@/Shared/LoadingButton'
    import InputError from '@/Shared/InputError'
    import Textarea from '@/Shared/Textarea'
    import Select from '@/Shared/Select'
    import InfoMessage from '@/Shared/InfoMessage'
    import Button from '@/Shared/Button'
    import Tooltip from '@/Shared/Tooltip'
    import RecomendacionEvaluador from '@/Shared/RecomendacionEvaluador'

    export let errors
    export let convocatoria
    export let proyecto
    export let efectosDirectos
    export let causasDirectas
    export let tiposImpacto
    export let resultados
    export let objetivosEspecificos
    export let faseEvaluacion = false

    /**
     * Validar si el usuario autenticado es SuperAdmin
     */
    let authUser = $page.props.auth.user
    let isSuperAdmin = checkRole(authUser, [1])

    /**
     * Efectos indirectos
     */
    let formEfectoIndirecto = useForm({
        id: null,
        efecto_directo_id: null,
        descripcion: '',
    })

    let showNuevoEfectoIndirectoForm = false
    let efectoDirectoIdNuevoIndirecto = null
    function setNuevoEfectoIndirecto(efectoDirecto) {
        $formEfectoIndirecto.reset()

        showNuevoEfectoIndirectoForm = true
        showEfectoIndirectoForm = false
        efectoDirectoIdNuevoIndirecto = efectoDirecto.id

        $formEfectoIndirecto.efecto_directo_id = efectoDirecto.id
    }

    let showEfectoIndirectoForm = false
    let efectoIndirectoId = null
    function setEfectoIndirecto(efectoDirecto, efectoIndirecto) {
        $formEfectoIndirecto.reset()
        if (showEfectoDirectoForm) {
            submitEfectoDirecto()
        }

        showEfectoIndirectoForm = true
        efectoIndirectoId = efectoIndirecto.id

        $formEfectoIndirecto.id = efectoIndirecto.id
        $formEfectoIndirecto.descripcion = efectoIndirecto.descripcion ? efectoIndirecto.descripcion : ''
        $formEfectoIndirecto.efecto_directo_id = efectoDirecto.id
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
                        showEfectoIndirectoForm = false
                        showNuevoEfectoIndirectoForm = false
                        $formEfectoIndirecto.reset()
                        efectoIndirectoId = null
                        efectoDirectoId = null
                    },

                    preserveScroll: true,
                },
            )
        }
    }

    let showEfectoIndirectoDestroyIcon = false
    let efectoIndirectoIdToDestroy = null
    function destroyEfectoIndirecto(efectoIndirecto) {
        if (proyecto.allowed.to_update) {
            Inertia.post(route('proyectos.efecto-indirecto.destroy', [proyecto.id, efectoIndirecto.id]), [], {
                preserveScroll: true,
            })
        }
    }

    /**
     * Efectos directos
     */
    let formEfectoDirecto = useForm({
        id: null,
        descripcion: '',
    })

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

    let showEfectoDirectoForm = false
    let efectoDirectoId = null
    function setEfectoDirecto(efectoDirecto) {
        $formEfectoDirecto.reset()
        if (showEfectoIndirectoForm) {
            submitEfectoIndirecto()
        }

        showEfectoDirectoForm = true
        efectoDirectoId = efectoDirecto.id

        $formEfectoDirecto.descripcion = efectoDirecto.descripcion ? efectoDirecto.descripcion : ''
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
                        showEfectoDirectoForm = false
                        $formEfectoDirecto.reset()
                        efectoDirectoId = null
                    },

                    preserveScroll: true,
                },
            )
        }
    }

    let showEfectoDirectoDestroyIcon = false
    let efectoDirectoIdToDestroy = null
    function destroyEfectoDirecto(efectoDirecto) {
        if (proyecto.allowed.to_update) {
            Inertia.post(route('proyectos.efecto-directo.destroy', [proyecto.id, efectoDirecto.id]), [], {
                preserveScroll: true,
            })
        }
    }

    /**
     * Causas directas
     */
    let formCausaDirecta = useForm({
        id: null,
        descripcion: '',
    })

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

    let showCausaDirectaForm = false
    let causaDirectaId = null
    function setCausaDirecta(causaDirecta) {
        $formCausaDirecta.reset()
        if (showEfectoIndirectoForm) {
            submitEfectoIndirecto()
        }

        showCausaDirectaForm = true
        causaDirectaId = causaDirecta.id

        $formCausaDirecta.descripcion = causaDirecta.descripcion ? causaDirecta.descripcion : ''
        $formCausaDirecta.id = causaDirecta.id
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
                        showCausaDirectaForm = false
                        $formCausaDirecta.reset()
                        causaDirectaId = null
                    },

                    preserveScroll: true,
                },
            )
        }
    }

    let showCausaDirectaDestroyIcon = false
    let causaDirectaIdToDestroy = null
    function destroyCausaDirecta(causaDirecta) {
        if (proyecto.allowed.to_update) {
            Inertia.post(route('proyectos.causa-directa.destroy', [proyecto.id, causaDirecta.id]), [], {
                preserveScroll: true,
            })
        }
    }

    /**
     * Causas indirectas
     */
    let formCausaIndirecta = useForm({
        id: null,
        causa_directa_id: null,
        descripcion: '',
    })

    let showNuevaCausaIndirectaForm = false
    let causaDirectaIdNuevaIndirecta = null
    function setNuevoCausaIndirecta(causaDirecta) {
        $formCausaIndirecta.reset()

        showNuevaCausaIndirectaForm = true
        showCausaIndirectaForm = false
        causaDirectaIdNuevaIndirecta = causaDirecta.id

        $formCausaIndirecta.causa_directa_id = causaDirecta.id
    }

    let showCausaIndirectaForm = false
    let causaIndirectaId = null
    function setCausaIndirecta(causaDirecta, causaIndirecta) {
        $formCausaIndirecta.reset()
        if (showEfectoDirectoForm) {
            submitEfectoDirecto()
        }

        showCausaIndirectaForm = true
        causaIndirectaId = causaIndirecta.id

        $formCausaIndirecta.id = causaIndirecta.id
        $formCausaIndirecta.descripcion = causaIndirecta.descripcion ? causaIndirecta.descripcion : ''
        $formCausaIndirecta.causa_directa_id = causaDirecta.id
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
                        showCausaIndirectaForm = false
                        showNuevaCausaIndirectaForm = false
                        $formCausaIndirecta.reset()
                        causaIndirectaId = null
                        causaDirectaId = null
                    },

                    preserveScroll: true,
                },
            )
        }
    }

    let showCausaIndirectaDestroyIcon = false
    let causaIndirectaIdToDestroy = null
    function destroyCausaIndirecta(causaIndirecta) {
        if (proyecto.allowed.to_update) {
            Inertia.post(route('proyectos.causa-indirecta.destroy', [proyecto.id, causaIndirecta.id]), [], {
                preserveScroll: true,
            })
        }
    }

    /**
     * Impactos
     */
    let formImpacto = useForm({
        id: null,
        efecto_indirecto_id: null,
        descripcion: '',
        tipo: '',
        resultado_id: '',
    })

    let showImpactoForm = false
    let impactoId = null
    function setImpacto(efectoIndirecto, impacto) {
        $formImpacto.reset()
        if (showResultadoForm) {
            submitResultado()
        }

        showImpactoForm = true
        impactoId = impacto.id

        $formImpacto.id = impacto.id
        $formImpacto.efecto_indirecto_id = efectoIndirecto.id
        $formImpacto.descripcion = impacto.descripcion ? impacto.descripcion : ''
        $formImpacto.tipo = impacto.tipo
            ? {
                  value: impacto.tipo,
                  label: tiposImpacto.find((item) => item.value == impacto.tipo)?.label,
              }
            : null
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
                        showImpactoForm = false
                        resultadoId = null
                        impactoId = null
                        $formImpacto.reset()
                    },

                    preserveScroll: true,
                },
            )
        }
    }

    let showImpactoDestroyIcon = false
    let impactoIdToDestroy = null
    function destroyImpacto(impacto) {
        if (proyecto.allowed.to_update) {
            Inertia.post(route('proyectos.impacto.destroy', [proyecto.id, impacto.id]), [], {
                preserveScroll: true,
            })
        }
    }

    /**
     * Resultados
     */
    let formResultado = useForm({
        descripcion: '',
    })

    let showResultadoForm = false
    let resultadoId = null
    $: causasDirectas
    function setResultado(efectoDirecto, resultado) {
        $formResultado.reset()
        if (showImpactoForm) {
            submitImpacto()
        }

        showResultadoForm = true
        resultadoId = resultado.id

        $formResultado.id = resultado.id
        $formResultado.descripcion = resultado.descripcion
        $formResultado.objetivo_especifico_id = { value: resultado.objetivo_especifico_id, label: objetivosEspecificos.find((item) => item.value == resultado.objetivo_especifico_id)?.label }
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
                        showResultadoForm = false
                        $formResultado.reset()
                        resultadoId = null
                    },

                    preserveScroll: true,
                },
            )
        }
    }

    let showResultadoDestroyIcon = false
    let resultadoIdToDestroy = null
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
     * Objetivos específicos
     */
    let formObjetivoEspecifico = useForm({
        id: null,
        descripcion: '',
        numero: 0,
    })

    let showObjetivoEspecificoForm = false
    let objetivoEspecificoId = null
    function setObjetivoEspecifico(causaDirecta, objetivoEspecifico, numero) {
        $formObjetivoEspecifico.reset()
        if (showActividadForm) {
            submitActividad()
        }

        showObjetivoEspecificoForm = true
        objetivoEspecificoId = objetivoEspecifico.id

        $formObjetivoEspecifico.id = objetivoEspecifico.id
        $formObjetivoEspecifico.descripcion = objetivoEspecifico.descripcion ? objetivoEspecifico.descripcion : ''
        $formObjetivoEspecifico.numero = numero
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
                        showObjetivoEspecificoForm = false
                        $formObjetivoEspecifico.reset()
                        objetivoEspecificoId = null
                    },

                    preserveScroll: true,
                },
            )
        }
    }

    let showObjetivoEspecificoDestroyIcon = false
    let objetivoEspecificoIdToDestroy = null
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
    let formActividad = useForm({
        id: null,
        fecha_inicio: '',
        fecha_finalizacion: '',
        causa_indirecta_id: null,
        objetivo_especifico_id: null,
        resultado_id: null,
        descripcion: '',
    })

    let showActividadForm = false
    let actividadId = null
    let resultadosFiltrados
    function setActividad(causaIndirecta, actividad) {
        $formActividad.reset()
        if (showObjetivoEspecificoForm) {
            submitObjetivoEspecifico()
        }

        resultadosFiltrados = resultados.filter((item) => item.objetivo_especifico_id == actividad.objetivo_especifico_id)
        resultadosFiltrados = resultadosFiltrados.filter((item) => item.label != null)

        showActividadForm = true
        actividadId = actividad.id

        $formActividad.id = actividad.id
        $formActividad.fecha_inicio = actividad.fecha_inicio
        $formActividad.fecha_finalizacion = actividad.fecha_finalizacion
        $formActividad.causa_indirecta_id = actividad.causa_indirecta_id
        $formActividad.objetivo_especifico_id = actividad.objetivo_especifico_id
        $formActividad.descripcion = actividad.descripcion ? actividad.descripcion : ''
        $formActividad.resultado_id = {
            value: actividad.resultado_id,
            label: resultados.find((item) => item.value == actividad.resultado_id)?.label,
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
                        showActividadForm = false
                        $formActividad.reset()
                        actividadId = null
                    },
                    preserveScroll: true,
                },
            )
        }
    }

    let showActividadDestroyIcon = false
    let actividadIdToDestroy = null
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
</script>

<!-- {#if (isSuperAdmin && faseEvaluacion == false) || (proyecto.mostrar_recomendaciones && faseEvaluacion == false)}
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
{/if} -->

<div>
    <!-- Causas directas y causas indirectas relacionados -->
    <figure class="flex w-full items-center justify-center">
        <img src="/images/causas-objetivos.png" alt="" />
    </figure>
    <div class="grid grid-cols-2 gap-4">
        <div>
            <div class="text-3xl font-extrabold mt-28">
                <span class="bg-clip-text text-transparent m-auto bg-gradient-to-r from-app-500 to-app-300 block w-max"> 1. Causas directas e indirectas </span>
            </div>

            <InfoMessage class="mr-6 my-4">Recuerde que al crear una causa directa se genera automáticamente el objetivo específico en la sección de la derecha. Pasa igual si se crea una causa indirecta, se genera la actividad respectiva. Recuerde que ambos ítems deben tener relación.</InfoMessage>

            {#each causasDirectas as causaDirecta, i}
                <div class="my-20 shadow p-2" style="background-color: #ffffff75">
                    <small class="inline-block ml-2">Causa directa #{i + 1}</small>
                    {#if causaDirectaId != causaDirecta.id}
                        <!-- svelte-ignore a11y-click-events-have-key-events -->
                        <div class="bg-white relative p-4 rounded-md parent-actions hover:cursor-text min-h-[120px] max-h-[120px] my-4 pr-14" on:click={setCausaDirecta(causaDirecta)}>
                            {causaDirecta.descripcion ? causaDirecta.descripcion : 'Por favor diligencie esta causa directa.'}

                            <div class="absolute flex top-[45%] right-2 z-10 opacity-0 ease-in duration-100 hover:opacity-100 child-actions">
                                {#if showCausaDirectaDestroyIcon && causaDirecta.id == causaDirectaIdToDestroy}
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 hover:cursor-pointer" on:click={(e) => (e.stopPropagation(), destroyCausaDirecta(causaDirecta))}>
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                    </svg>

                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="ml-2 w-5 h-5 hover:cursor-pointer" on:click={(e) => (e.stopPropagation(), (showCausaDirectaDestroyIcon = false))}>
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                {:else}
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 hover:cursor-pointer" on:click={setCausaDirecta(causaDirecta)}>
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                    </svg>

                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="ml-2 w-5 h-5 hover:cursor-pointer" on:click={(e) => (e.stopPropagation(), (showCausaDirectaDestroyIcon = true), (causaDirectaIdToDestroy = causaDirecta.id))}>
                                        <path
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                                        />
                                    </svg>
                                {/if}
                            </div>
                        </div>
                    {/if}
                    {#if showCausaDirectaForm && causaDirectaId == causaDirecta.id}
                        <form on:submit|preventDefault={submitCausaDirecta} id="causa-directa" class="mt-4">
                            <fieldset class="relative" disabled={proyecto.allowed.to_update ? undefined : true}>
                                <Textarea disabled={isSuperAdmin ? false : proyecto.codigo_linea_programatica == 70 ? true : false} maxlength="40000" id="causa-directa-descripcion" error={errors.descripcion} bind:value={$formCausaDirecta.descripcion} required />
                            </fieldset>

                            {#if proyecto.allowed.to_update}
                                <LoadingButton loading={$formCausaDirecta.processing} class="my-4" type="submit" form="causa-directa">Guardar información sobre la causa directa</LoadingButton>
                            {/if}
                            <Button class="ml-2" variant={null} on:click={() => ((showCausaDirectaForm = false), (causaDirectaId = null))}>Cancelar</Button>
                        </form>
                    {/if}

                    <small class="ml-2 mt-6 flex items-center">
                        Causas indirectas
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="ml-2 w-4 h-4" style="transform: scaleX(-1)">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M15 15l-6 6m0 0l-6-6m6 6V9a6 6 0 0112 0v3" />
                        </svg>
                    </small>
                    {#each causaDirecta.causas_indirectas as causaIndirecta, i}
                        {#if causaIndirectaId != causaIndirecta.id}
                            <!-- svelte-ignore a11y-click-events-have-key-events -->
                            <div class="bg-white p-4 relative rounded-md parent-actions hover:cursor-text min-h-[120px] max-h-[120px] my-4 pr-14" on:click={setCausaIndirecta(causaDirecta, causaIndirecta)}>
                                {causaIndirecta.descripcion ? causaIndirecta.descripcion : 'Por favor diligencie esta causa indirecta.'}
                                <div class="absolute flex top-[45%] right-2 z-10 opacity-0 ease-in duration-100 hover:opacity-100 child-actions">
                                    {#if showCausaIndirectaDestroyIcon && causaIndirecta.id == causaIndirectaIdToDestroy}
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 hover:cursor-pointer" on:click={(e) => (e.stopPropagation(), destroyCausaIndirecta(causaIndirecta))}>
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                        </svg>

                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="ml-2 w-5 h-5 hover:cursor-pointer" on:click={(e) => (e.stopPropagation(), (showCausaIndirectaDestroyIcon = false))}>
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    {:else}
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 hover:cursor-pointer" on:click={setCausaIndirecta(causaDirecta, causaIndirecta)}>
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                        </svg>

                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="ml-2 w-5 h-5 hover:cursor-pointer" on:click={(e) => (e.stopPropagation(), (showCausaIndirectaDestroyIcon = true), (causaIndirectaIdToDestroy = causaIndirecta.id))}>
                                            <path
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                                            />
                                        </svg>
                                    {/if}
                                </div>
                            </div>
                        {/if}

                        {#if showCausaIndirectaForm && causaIndirectaId == causaIndirecta.id}
                            <form on:submit|preventDefault={submitCausaIndirecta} id="causa-indirecta" class="mt-4">
                                <fieldset class="relative" disabled={proyecto.allowed.to_update ? undefined : true}>
                                    <div>
                                        <Textarea disabled={isSuperAdmin ? false : proyecto.codigo_linea_programatica == 70 ? true : false} maxlength="40000" id="causa-directa-descripcion" error={errors.descripcion} bind:value={$formCausaIndirecta.descripcion} required />
                                    </div>
                                </fieldset>

                                {#if proyecto.allowed.to_update}
                                    <LoadingButton loading={$formCausaIndirecta.processing} class="my-4" type="submit" form="causa-indirecta">Guardar información sobre la causa indirecta</LoadingButton>
                                {/if}

                                <Button class="ml-2" variant={null} on:click={() => ((showCausaIndirectaForm = false), (causaIndirectaId = null))}>Cancelar</Button>
                            </form>
                        {/if}
                    {/each}

                    <div class="flex items-center justify-end">
                        <Tooltip label="Importante leer" class="mr-6 my-4">Al crear una causa indirecta se genera automáticamente la actividad en la sección de la derecha. Recuerde que ambos deben tener relación.</Tooltip>
                        <Button class="my-4" labelClass="flex items-center justify-center" disabled={showNuevaCausaIndirectaForm ? true : undefined} variant={null} type="Button" on:click={setNuevoCausaIndirecta(causaDirecta)}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>

                            <span class="ml-2">Añadir una causa indirecta</span>
                        </Button>
                    </div>

                    {#if showNuevaCausaIndirectaForm && causaDirectaIdNuevaIndirecta == causaDirecta.id}
                        <form on:submit|preventDefault={submitCausaIndirecta} id="causa-indirecta">
                            <fieldset class="relative" disabled={proyecto.allowed.to_update ? undefined : true}>
                                <div>
                                    <Textarea disabled={isSuperAdmin ? false : proyecto.codigo_linea_programatica == 70 ? true : false} maxlength="40000" label="Escriba la nueva causa indirecta" id="causa-directa-descripcion" error={errors.descripcion} bind:value={$formCausaIndirecta.descripcion} required />
                                </div>
                            </fieldset>

                            {#if proyecto.allowed.to_update}
                                <LoadingButton loading={$formCausaIndirecta.processing} class="my-4" type="submit" form="causa-indirecta">Añadir causa indirecta</LoadingButton>
                            {/if}

                            <Button class="ml-2" variant={null} on:click={() => ((showNuevaCausaIndirectaForm = false), (causaDirectaId = null))}>Cancelar</Button>
                        </form>
                    {/if}
                </div>
            {/each}

            <Button type="button" variant={null} class="block mt-4 mb-20 mx-auto" labelClass="flex items-center justify-center" on:click={() => newCausaDirecta()}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 mr-2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Añadir causa directa
            </Button>
        </div>

        <!-- Objetivos específicos y actividades relacionados -->
        <div>
            <div class="text-3xl font-extrabold mt-28">
                <span class="bg-clip-text text-transparent m-auto bg-gradient-to-r from-app-500 to-app-300 block w-max"> 2. Objetivos específicos y actividades </span>
            </div>

            <InfoMessage class="mr-6 my-4">Si desea generar un objetivo específico debe primero crear la causa directa en la sección de la izquierda. Pasa igual si desea generar una actividad, debe primero generar una causa indirecta. Recuerde que ambos ítems deben tener relación.</InfoMessage>

            {#each causasDirectas as causaDirecta, i}
                <div class="my-20 shadow p-2 pb-[76px]" style="background-color: #ffffff75">
                    <small class="inline-block ml-2 mb-4">Objetivo específico #{i + 1}</small>
                    {#if objetivoEspecificoId != causaDirecta.objetivo_especifico?.id}
                        <!-- svelte-ignore a11y-click-events-have-key-events -->
                        <div class="bg-white p-4 relative rounded-md parent-actions hover:cursor-text min-h-[120px] max-h-[120px] pr-14" on:click={setObjetivoEspecifico(causaDirecta, causaDirecta.objetivo_especifico, i + 1)}>
                            {causaDirecta.objetivo_especifico?.descripcion ? causaDirecta.objetivo_especifico?.descripcion : 'Por favor diligencie este objetivo específico.'}
                            <div class="absolute flex top-[45%] right-2 z-10 opacity-0 ease-in duration-100 hover:opacity-100 child-actions">
                                {#if showObjetivoEspecificoDestroyIcon && causaDirecta.objetivo_especifico?.id == objetivoEspecificoIdToDestroy}
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 hover:cursor-pointer" on:click={(e) => (e.stopPropagation(), destroyObjetivoEspecifico(causaDirecta.objetivo_especifico))}>
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                    </svg>

                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="ml-2 w-5 h-5 hover:cursor-pointer" on:click={(e) => (e.stopPropagation(), (showObjetivoEspecificoDestroyIcon = false))}>
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                {:else}
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 hover:cursor-pointer" on:click={setObjetivoEspecifico(causaDirecta, causaDirecta.objetivo_especifico, i + 1)}>
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                    </svg>

                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="ml-2 w-5 h-5 hover:cursor-pointer" on:click={(e) => (e.stopPropagation(), (showObjetivoEspecificoDestroyIcon = true), (objetivoEspecificoIdToDestroy = causaDirecta.objetivo_especifico?.id))}>
                                        <path
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                                        />
                                    </svg>
                                {/if}
                            </div>
                        </div>
                    {/if}
                    {#if showObjetivoEspecificoForm && objetivoEspecificoId == causaDirecta.objetivo_especifico?.id}
                        <form on:submit|preventDefault={submitObjetivoEspecifico} id="objetivo-especifico-form">
                            <fieldset class="relative" disabled={proyecto.allowed.to_update ? undefined : true}>
                                <div>
                                    <Textarea disabled={isSuperAdmin ? false : proyecto.codigo_linea_programatica == 70 ? true : false} maxlength="40000" id="descripcion-objetivo-especifico" error={errors.descripcion} bind:value={$formObjetivoEspecifico.descripcion} required />
                                </div>

                                <Tooltip class="mt-2" label="Información sobre los objetivos específicos">
                                    Los objetivos específicos son los medios cuantificables que llevarán al cumplimiento del objetivo general. Estos surgen de pasar a positivo las causas directas identificadas en el árbol de problemas.
                                    <br />
                                    La redacción de los objetivos específicos deberá iniciar con un verbo en modo infinitivo, es decir, con una palabra terminada en "ar", "er" o "ir". La estructura del objetivo debe contener al menos tres componentes: (1) la acción que se espera realizar, (2) el objeto sobre el cual recae la acción y (3) elementos adicionales de contexto o descriptivos.
                                </Tooltip>
                            </fieldset>

                            {#if proyecto.allowed.to_update}
                                <LoadingButton loading={$formObjetivoEspecifico.processing} class="my-4" type="submit" form="objetivo-especifico-form">Guardar información sobre el objetivo específico</LoadingButton>
                            {/if}

                            <Button class="ml-2" variant={null} on:click={() => ((showObjetivoEspecificoForm = false), (objetivoEspecificoId = null))}>Cancelar</Button>
                        </form>
                    {/if}

                    <small class="ml-2 mt-6 flex items-center">
                        Actividades
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="ml-2 w-4 h-4" style="transform: scaleX(-1)">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M15 15l-6 6m0 0l-6-6m6 6V9a6 6 0 0112 0v3" />
                        </svg>
                    </small>
                    {#each causaDirecta.causas_indirectas as causaIndirecta, i}
                        {#if actividadId != causaIndirecta.actividad?.id}
                            <!-- svelte-ignore a11y-click-events-have-key-events -->
                            <div class="bg-white p-4 relative rounded-md parent-actions hover:cursor-text min-h-[120px] max-h-[120px] my-4 pr-14" on:click={setActividad(causaIndirecta, causaIndirecta.actividad)}>
                                {causaIndirecta.actividad?.descripcion ? causaIndirecta.actividad?.descripcion : 'Por favor diligencie esta actividad.'}
                                <div class="absolute flex top-[45%] right-2 z-10 opacity-0 ease-in duration-100 hover:opacity-100 child-actions">
                                    {#if showActividadDestroyIcon && causaIndirecta.actividad?.id == actividadIdToDestroy}
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 hover:cursor-pointer" on:click={(e) => (e.stopPropagation(), destroyActividad(causaIndirecta.actividad))}>
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                        </svg>

                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="ml-2 w-5 h-5 hover:cursor-pointer" on:click={(e) => (e.stopPropagation(), (showActividadDestroyIcon = false))}>
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    {:else}
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 hover:cursor-pointer" on:click={setActividad(causaIndirecta, causaIndirecta.actividad)}>
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                        </svg>

                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="ml-2 w-5 h-5 hover:cursor-pointer" on:click={(e) => (e.stopPropagation(), (showActividadDestroyIcon = true), (actividadIdToDestroy = causaIndirecta.actividad?.id))}>
                                            <path
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                                            />
                                        </svg>
                                    {/if}
                                </div>
                            </div>
                        {/if}

                        {#if showActividadForm && actividadId == causaIndirecta.actividad?.id}
                            <form on:submit|preventDefault={submitActividad} id="actividad-form" class="mt-4">
                                <fieldset class="relative" disabled={proyecto.allowed.to_update ? undefined : true}>
                                    <div>
                                        <Textarea disabled={isSuperAdmin ? false : proyecto.codigo_linea_programatica == 70 ? true : false} maxlength="15000" id="descripcion-actividad" error={errors.descripcion} bind:value={$formActividad.descripcion} required />
                                    </div>

                                    <Tooltip class="mt-2" label="Información sobre las actividades">
                                        Se debe evidenciar que la descripción de las actividades se realice de manera secuencial y de forma coherente con los productos a las cuales están asociadas para alcanzar el logro de cada uno de los objetivos específicos.
                                        <br />
                                        Las actividades deben redactarse en verbos en modo infinitivo, es decir, en palabras que expresen acciones y terminen en “ar”, “er” o “ir”, estos no deben hacer referencia a objetivos específicos o generales. Algunos ejemplos de verbos inadecuados para describir actividades son: apropiar, asegurar, colaborar, consolidar, desarrollar, fomentar, fortalecer, garantizar,
                                        implementar, impulsar, mejorar, movilizar, proponer, promover, entre otros.
                                    </Tooltip>

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
                                </fieldset>

                                {#if proyecto.allowed.to_update}
                                    <LoadingButton loading={$formActividad.processing} class="my-4" type="submit" form="actividad-form">Guardar información sobre la actividad</LoadingButton>
                                {/if}

                                <Button class="ml-2" variant={null} on:click={() => ((showActividadForm = false), (actividadId = null))}>Cancelar</Button>
                            </form>
                        {/if}
                    {/each}
                </div>
            {/each}
        </div>
    </div>

    <figure class="flex w-full items-center justify-center mt-20">
        <img src="/images/efectos-resultados.png" alt="" />
    </figure>
    <!-- Efectos directos y efectos indirectos relacionados -->
    <div class="grid grid-cols-2 gap-4">
        <div>
            <div class="text-3xl font-extrabold mt-28">
                <span class="bg-clip-text text-transparent m-auto bg-gradient-to-r from-app-500 to-app-300 block w-max"> 3. Efectos directos e indirectos </span>
            </div>

            {#each efectosDirectos as efectoDirecto, i}
                <div class="my-20 shadow p-2" style="background-color: #ffffff75">
                    <small class="inline-block ml-2">Efecto directo</small>
                    {#if efectoDirectoId != efectoDirecto.id}
                        <!-- svelte-ignore a11y-click-events-have-key-events -->
                        <div class="bg-white relative p-4 rounded-md parent-actions hover:cursor-text min-h-[120px] max-h-[120px] my-4 pr-14" on:click={setEfectoDirecto(efectoDirecto)}>
                            {efectoDirecto.descripcion ? efectoDirecto.descripcion : 'Por favor diligencie este efecto directo.'}

                            <div class="absolute flex top-[45%] right-2 z-10 opacity-0 ease-in duration-100 hover:opacity-100 child-actions">
                                {#if showEfectoDirectoDestroyIcon && efectoDirecto.id == efectoDirectoIdToDestroy}
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 hover:cursor-pointer" on:click={(e) => (e.stopPropagation(), destroyEfectoDirecto(efectoDirecto))}>
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                    </svg>

                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="ml-2 w-5 h-5 hover:cursor-pointer" on:click={(e) => (e.stopPropagation(), (showEfectoDirectoDestroyIcon = false))}>
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                {:else}
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 hover:cursor-pointer" on:click={setEfectoDirecto(efectoDirecto)}>
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                    </svg>

                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="ml-2 w-5 h-5 hover:cursor-pointer" on:click={(e) => (e.stopPropagation(), (showEfectoDirectoDestroyIcon = true), (efectoDirectoIdToDestroy = efectoDirecto.id))}>
                                        <path
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                                        />
                                    </svg>
                                {/if}
                            </div>
                        </div>
                    {/if}
                    {#if showEfectoDirectoForm && efectoDirectoId == efectoDirecto.id}
                        <form on:submit|preventDefault={submitEfectoDirecto} id="efecto-directo">
                            <fieldset class="relative" disabled={proyecto.allowed.to_update ? undefined : true}>
                                <Textarea disabled={isSuperAdmin ? false : proyecto.codigo_linea_programatica == 70 ? true : false} maxlength="40000" id="efecto-directo-descripcion" error={errors.descripcion} bind:value={$formEfectoDirecto.descripcion} required />
                            </fieldset>

                            {#if proyecto.allowed.to_update}
                                <LoadingButton loading={$formEfectoDirecto.processing} class="my-4" type="submit" form="efecto-directo">Guardar información sobre el efecto directo</LoadingButton>
                            {/if}
                            <Button class="ml-2" variant={null} on:click={() => ((showEfectoDirectoForm = false), (efectoDirectoId = null))}>Cancelar</Button>
                        </form>
                    {/if}

                    <small class="ml-2 mt-6 flex items-center">
                        Efectos indirectos
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="ml-2 w-4 h-4" style="transform: scaleX(-1)">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M15 15l-6 6m0 0l-6-6m6 6V9a6 6 0 0112 0v3" />
                        </svg>
                    </small>
                    {#each efectoDirecto.efectos_indirectos as efectoIndirecto, i}
                        {#if efectoIndirectoId != efectoIndirecto.id}
                            <!-- svelte-ignore a11y-click-events-have-key-events -->
                            <div class="bg-white p-4 relative rounded-md parent-actions hover:cursor-text min-h-[120px] max-h-[120px] my-4 pr-14" on:click={setEfectoIndirecto(efectoDirecto, efectoIndirecto)}>
                                {efectoIndirecto.descripcion ? efectoIndirecto.descripcion : 'Por favor diligencie este efecto indirecto.'}
                                <div class="absolute flex top-[45%] right-2 z-10 opacity-0 ease-in duration-100 hover:opacity-100 child-actions">
                                    {#if showEfectoIndirectoDestroyIcon && efectoIndirecto.id == efectoIndirectoIdToDestroy}
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 hover:cursor-pointer" on:click={(e) => (e.stopPropagation(), destroyEfectoIndirecto(efectoIndirecto))}>
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                        </svg>

                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="ml-2 w-5 h-5 hover:cursor-pointer" on:click={(e) => (e.stopPropagation(), (showEfectoIndirectoDestroyIcon = false))}>
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    {:else}
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 hover:cursor-pointer" on:click={setEfectoIndirecto(efectoDirecto, efectoIndirecto)}>
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                        </svg>

                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="ml-2 w-5 h-5 hover:cursor-pointer" on:click={(e) => (e.stopPropagation(), (showEfectoIndirectoDestroyIcon = true), (efectoIndirectoIdToDestroy = efectoIndirecto.id))}>
                                            <path
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                                            />
                                        </svg>
                                    {/if}
                                </div>
                            </div>
                        {/if}

                        {#if showEfectoIndirectoForm && efectoIndirectoId == efectoIndirecto.id}
                            <form on:submit|preventDefault={submitEfectoIndirecto} id="efecto-indirecto" class="mt-4">
                                <fieldset class="relative" disabled={proyecto.allowed.to_update ? undefined : true}>
                                    <div>
                                        <Textarea disabled={isSuperAdmin ? false : proyecto.codigo_linea_programatica == 70 ? true : false} maxlength="40000" id="efecto-directo-descripcion" error={errors.descripcion} bind:value={$formEfectoIndirecto.descripcion} required />
                                    </div>
                                </fieldset>

                                {#if proyecto.allowed.to_update}
                                    <LoadingButton loading={$formEfectoIndirecto.processing} class="my-4" type="submit" form="efecto-indirecto">Guardar información sobre el efecto indirecto</LoadingButton>
                                {/if}

                                <Button class="ml-2" variant={null} on:click={() => ((showEfectoIndirectoForm = false), (efectoIndirectoId = null))}>Cancelar</Button>
                            </form>
                        {/if}
                    {/each}

                    <div class="flex items-center justify-end">
                        <Tooltip label="Importante leer" class="mr-6 my-4">Al crear un efecto indirecto se genera automáticamente el impacto en la sección de la derecha. Recuerde que ambos deben tener relación.</Tooltip>
                        <Button class="my-4" labelClass="flex items-center justify-center" disabled={showNuevoEfectoIndirectoForm ? true : undefined} variant={null} type="Button" on:click={setNuevoEfectoIndirecto(efectoDirecto)}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>

                            <span class="ml-2">Añadir un efecto indirecto</span>
                        </Button>
                    </div>

                    {#if showNuevoEfectoIndirectoForm && efectoDirectoIdNuevoIndirecto == efectoDirecto.id}
                        <form on:submit|preventDefault={submitEfectoIndirecto} id="efecto-indirecto">
                            <fieldset class="relative" disabled={proyecto.allowed.to_update ? undefined : true}>
                                <div>
                                    <Textarea disabled={isSuperAdmin ? false : proyecto.codigo_linea_programatica == 70 ? true : false} maxlength="40000" label="Escriba el nuevo efecto indirecto" id="efecto-directo-descripcion" error={errors.descripcion} bind:value={$formEfectoIndirecto.descripcion} required />
                                </div>
                            </fieldset>

                            {#if proyecto.allowed.to_update}
                                <LoadingButton loading={$formEfectoIndirecto.processing} class="my-4" type="submit" form="efecto-indirecto">Añadir efecto indirecto</LoadingButton>
                            {/if}

                            <Button class="ml-2" variant={null} on:click={() => ((showNuevoEfectoIndirectoForm = false), (efectoDirectoId = null))}>Cancelar</Button>
                        </form>
                    {/if}
                </div>
            {/each}

            <Button type="button" variant={null} class="block mt-4 mb-20 mx-auto" labelClass="flex items-center justify-center" on:click={() => newEfectoDirecto()}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 mr-2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Añadir efecto directo
            </Button>
        </div>

        <!-- Resultados e impactos relacionados -->
        <div>
            <div class="text-3xl font-extrabold mt-28">
                <span class="bg-clip-text text-transparent m-auto bg-gradient-to-r from-app-500 to-app-300 block w-max"> 4. Resultados e impactos </span>
            </div>

            {#each efectosDirectos as efectoDirecto, i}
                <div class="my-20 shadow p-2 pb-[76px]" style="background-color: #ffffff75">
                    <small class="inline-block ml-2 mb-4">Resultado</small>
                    {#if resultadoId != efectoDirecto.resultado?.id}
                        <!-- svelte-ignore a11y-click-events-have-key-events -->
                        <div class="bg-white p-4 relative rounded-md parent-actions hover:cursor-text min-h-[120px] max-h-[120px] pr-14" on:click={setResultado(efectoDirecto, efectoDirecto.resultado)}>
                            {efectoDirecto.resultado?.descripcion ? efectoDirecto.resultado?.descripcion : 'Por favor diligencie este resultado.'}
                            <div class="absolute flex top-[40%] right-2 z-10 opacity-0 ease-in duration-100 hover:opacity-100 child-actions">
                                {#if showResultadoDestroyIcon && efectoDirecto.resultado?.id == resultadoIdToDestroy}
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 hover:cursor-pointer" on:click={(e) => (e.stopPropagation(), destroyResultado(efectoDirecto.resultado))}>
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                    </svg>

                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="ml-2 w-5 h-5 hover:cursor-pointer" on:click={(e) => (e.stopPropagation(), (showResultadoDestroyIcon = false))}>
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                {:else}
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 hover:cursor-pointer" on:click={setResultado(efectoDirecto, efectoDirecto.resultado)}>
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                    </svg>

                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="ml-2 w-5 h-5 hover:cursor-pointer" on:click={(e) => (e.stopPropagation(), (showResultadoDestroyIcon = true), (resultadoIdToDestroy = efectoDirecto.resultado?.id))}>
                                        <path
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                                        />
                                    </svg>
                                {/if}
                            </div>
                        </div>
                    {/if}

                    {#if showResultadoForm && resultadoId == efectoDirecto.resultado?.id}
                        <form on:submit|preventDefault={submitResultado} id="resultado-form">
                            <fieldset class="relative" disabled={proyecto.allowed.to_update ? undefined : true}>
                                {#if objetivosEspecificos.length == 0}
                                    <InfoMessage class="ml-10 mb-6">Por favor genere primero los objetivos específicos.</InfoMessage>
                                {:else}
                                    <div>
                                        <Textarea disabled={isSuperAdmin ? false : proyecto.codigo_linea_programatica == 70 ? true : false} maxlength="1000" id="descripcion-resultado" error={errors.descripcion} bind:value={$formResultado.descripcion} required />
                                    </div>

                                    <Tooltip class="mt-2" label="Información sobre los resultados">Se debe evidenciar que los resultados son directos, medibles y cuantificables que se alcanzarán con el desarrollo de cada uno de los objetivos específicos del proyecto.</Tooltip>

                                    <div class="mt-10">
                                        <InfoMessage class="ml-10">Por seleccione un objetivo específico.</InfoMessage>

                                        <Select id="objetivo-especifico" items={objetivosEspecificos} bind:selectedValue={$formResultado.objetivo_especifico_id} error={errors.objetivo_especifico_id} autocomplete="off" placeholder="Seleccione un objetivo específico" required />
                                    </div>
                                {/if}
                            </fieldset>

                            {#if proyecto.allowed.to_update}
                                <LoadingButton loading={$formResultado.processing} class="my-4" type="submit" form="resultado-form">Guardar información sobre el resultado</LoadingButton>
                            {/if}

                            <Button class="ml-2" variant={null} on:click={() => ((showResultadoForm = false), (resultadoId = null))}>Cancelar</Button>
                        </form>
                    {/if}

                    <small class="ml-2 mt-6 flex items-center">
                        Impactos
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="ml-2 w-4 h-4" style="transform: scaleX(-1)">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M15 15l-6 6m0 0l-6-6m6 6V9a6 6 0 0112 0v3" />
                        </svg>
                    </small>
                    {#each efectoDirecto.efectos_indirectos as efectoIndirecto, i}
                        {#if impactoId != efectoIndirecto.impacto?.id}
                            <!-- svelte-ignore a11y-click-events-have-key-events -->
                            <div class="bg-white p-4 relative rounded-md parent-actions hover:cursor-text min-h-[120px] max-h-[120px] my-4 pr-14" on:click={setImpacto(efectoIndirecto, efectoIndirecto.impacto)}>
                                {efectoIndirecto.impacto?.descripcion ? efectoIndirecto.impacto?.descripcion : 'Por favor diligencie este impacto.'}
                                <div class="absolute flex top-[40%] right-2 z-10 opacity-0 ease-in duration-100 hover:opacity-100 child-actions">
                                    {#if showImpactoDestroyIcon && efectoIndirecto.impacto?.id == impactoIdToDestroy}
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 hover:cursor-pointer" on:click={(e) => (e.stopPropagation(), destroyImpacto(efectoIndirecto.impacto))}>
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                        </svg>

                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="ml-2 w-5 h-5 hover:cursor-pointer" on:click={(e) => (e.stopPropagation(), (showImpactoDestroyIcon = false))}>
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    {:else}
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 hover:cursor-pointer" on:click={setImpacto(efectoIndirecto, efectoIndirecto.impacto)}>
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                        </svg>

                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="ml-2 w-5 h-5 hover:cursor-pointer" on:click={(e) => (e.stopPropagation(), (showImpactoDestroyIcon = true), (impactoIdToDestroy = efectoIndirecto.impacto?.id))}>
                                            <path
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                                            />
                                        </svg>
                                    {/if}
                                </div>
                            </div>
                        {/if}

                        {#if showImpactoForm && impactoId == efectoIndirecto.impacto?.id}
                            <form on:submit|preventDefault={submitImpacto} id="impacto-form" class="mt-4">
                                <fieldset class="relative" disabled={proyecto.allowed.to_update ? undefined : true}>
                                    <div>
                                        <Textarea disabled={isSuperAdmin ? false : proyecto.codigo_linea_programatica == 70 ? true : false} maxlength="10000" id="descripcion-impacto" error={errors.descripcion} bind:value={$formImpacto.descripcion} required />
                                        <Tooltip class="mt-2" label="Información sobre el impacto">Se busca medir la contribución potencial que genera el proyecto en los siguientes ámbitos: tecnológico, económico, ambiental, social, centro de formación, sector productivo</Tooltip>
                                    </div>

                                    <div class="mt-8">
                                        <Label labelFor="tipo-impacto" class="mb-4" value="Tipo" />
                                        {#if $formImpacto.tipo?.value == 4}
                                            <Tooltip class="my-6" label="Información sobre el tipo de impacto">
                                                Se busca minimizar y/o evitar los impactos negativos sobre el medio ambiente, tales como contaminación del aire, contaminación de corrientes de agua naturales, ruido, destrucción del paisaje, separación de comunidades que operan como unidades, etc. Por otro lado, se busca identificar diversas acciones de impacto ambiental positivo, tales como:
                                                producción limpia y sustentable, protección medioambiental, uso de residuos y reciclaje.
                                            </Tooltip>
                                        {:else if $formImpacto.tipo?.value == 2}
                                            <Tooltip class="my-6" label="Información sobre el tipo de impacto">
                                                Se busca medir la contribución potencial del proyecto en cualquiera de los siguientes ámbitos: generación y aplicación de nuevos conocimientos y tecnologías, desarrollo de infraestructura científico- tecnológica, articulación de diferentes proyectos para lograr un objetivo común, mejoramiento de la infraestructura, desarrollo de capacidades de
                                                gestión tecnológica.
                                            </Tooltip>
                                        {:else if $formImpacto.tipo?.value == 5}
                                            <Tooltip class="my-6" label="Información sobre el tipo de impacto">Se busca medir la contribución potencial del proyecto al desarrollo de la comunidad Sena (Aprendices, instructores y a la formación)</Tooltip>
                                        {:else if $formImpacto.tipo?.value == 6}
                                            <Tooltip>Se busca medir la contribución potencial del proyecto al desarrollo del sector productivo en concordancia con el sector priorizado de Colombia Productiva y a la mesa técnica a la que pertenece el proyecto.</Tooltip>
                                        {/if}
                                        <Select id="tipo-impacto" items={tiposImpacto} bind:selectedValue={$formImpacto.tipo} error={errors.tipo} autocomplete="off" placeholder="Seleccione un tipo" required />
                                    </div>
                                </fieldset>

                                {#if proyecto.allowed.to_update}
                                    <LoadingButton loading={$formImpacto.processing} class="my-4" type="submit" form="impacto-form">Guardar información sobre el impacto</LoadingButton>
                                {/if}

                                <Button class="ml-2" variant={null} on:click={() => ((showImpactoForm = false), (impactoId = null))}>Cancelar</Button>
                            </form>
                        {/if}
                    {/each}
                </div>
            {/each}
        </div>
    </div>
</div>

<style>
    form {
        position: relative;
    }

    form:before {
        content: '';
        position: absolute;
        width: 102.8%;
        height: 102%;
        background: rgb(208 225 213 / 66%);
        left: -8px;
        right: 0;
        top: -10px;
    }

    .parent-actions:hover .child-actions {
        opacity: 1;
    }
</style>
