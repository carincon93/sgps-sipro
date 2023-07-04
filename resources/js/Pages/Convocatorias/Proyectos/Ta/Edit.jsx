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

        <div class="shadow-inner bg-app-200 border-app-400 flex items-center justify-between mt-14 px-8 py-4">
            <small class="flex items-center text-app-700">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {ta.updated_at}
            </small>

            {#if ta.proyecto.allowed.to_update}
                <LoadingButton loading={$form.processing} form="ta-form">Guardar información</LoadingButton>
            {:else}
                <span class="inline-block ml-1.5"> El proyecto no se puede modificar </span>
            {/if}
        </div>
    </form>
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
