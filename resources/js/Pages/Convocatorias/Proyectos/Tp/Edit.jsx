<script>
    import AuthenticatedLayout, { title } from '@/Layouts/Authenticated'
    import { useForm, page } from '@inertiajs/inertia-svelte'
    import { route, checkRole, checkPermission, checkPermissionByUser, monthDiff } from '@/Utils'
    import { _ } from 'svelte-i18n'
    import { Inertia } from '@inertiajs/inertia'
    import axios from 'axios'

    import Button from '@/Components/Button'
    import PrimaryButton from '@/Components/PrimaryButton'
    import Stepper from '@/Components/Stepper'
    import InfoMessage from '@/Components/InfoMessage'
    import Export2Word from '@/Components/Export2Word'
    import Dialog from '@/Components/Dialog'

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
    let authUser = auth.user
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
    <header className="pt-[8rem]" slot="header">
        <Stepper {convocatoria} proyecto={tp} />
    </header>

    <form on:submit|preventDefault={submit} id="tp-form">
        <fieldset className="p-8 divide-y" disabled={tp.proyecto.allowed.to_update ? undefined : true}>
            <TpForm {errors} {form} {isSuperAdmin} {authUser} {convocatoria} {tp} {lineasProgramaticas} />

            {#if (isSuperAdmin && tp.proyecto.evaluaciones.length > 0) || (tp.proyecto.mostrar_recomendaciones && tp.proyecto.evaluaciones.length > 0)}
                <div className="py-24">
                    <h1>Ortografía</h1>
                    {#each tp.proyecto.evaluaciones as evaluacion, i}
                        {#if isSuperAdmin || (evaluacion.finalizado && evaluacion.habilitado)}
                            <div className="bg-zinc-900 text-white p-4 rounded border mb-5">
                                <div className="text-xs flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                                    </svg>
                                    Evaluador COD-{evaluacion.id}:
                                </div>
                                <p className="whitespace-pre-line text-xs">{evaluacion.tp_evaluacion.ortografia_comentario ? evaluacion.tp_evaluacion.ortografia_comentario : 'Sin recomendación'}</p>
                            </div>
                        {/if}
                    {/each}
                    {#if tp.proyecto.evaluaciones.length == 0}
                        <p className="whitespace-pre-line mt-4 text-xs">El proyecto no ha sido evaluado aún.</p>
                    {/if}
                </div>
            {/if}

            {#if (isSuperAdmin && tp.proyecto.evaluaciones.length > 0) || (tp.proyecto.mostrar_recomendaciones && tp.proyecto.evaluaciones.length > 0)}
                <div className="py-24">
                    <h1>Redacción</h1>
                    {#each tp.proyecto.evaluaciones as evaluacion, i}
                        {#if isSuperAdmin || (evaluacion.finalizado && evaluacion.habilitado)}
                            <div className="bg-zinc-900 text-white p-4 rounded border mb-5">
                                <div className="text-xs flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                                    </svg>
                                    Evaluador COD-{evaluacion.id}:
                                </div>
                                <p className="whitespace-pre-line text-xs">{evaluacion.tp_evaluacion.redaccion_comentario ? evaluacion.tp_evaluacion.redaccion_comentario : 'Sin recomendación'}</p>
                            </div>
                        {/if}
                    {/each}
                    {#if tp.proyecto.evaluaciones.length == 0}
                        <p className="whitespace-pre-line mt-4 text-xs">El proyecto no ha sido evaluado aún.</p>
                    {/if}
                </div>
            {/if}

            {#if (isSuperAdmin && tp.proyecto.evaluaciones.length > 0) || (tp.proyecto.mostrar_recomendaciones && tp.proyecto.evaluaciones.length > 0)}
                <div className="py-24">
                    <h1>Normas APA</h1>
                    {#each tp.proyecto.evaluaciones as evaluacion, i}
                        {#if isSuperAdmin || (evaluacion.finalizado && evaluacion.habilitado)}
                            <div className="bg-zinc-900 text-white p-4 rounded border mb-5">
                                <div className="text-xs flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                                    </svg>
                                    Evaluador COD-{evaluacion.id}:
                                </div>
                                <p className="whitespace-pre-line text-xs">{evaluacion.tp_evaluacion.normas_apa_comentario ? evaluacion.tp_evaluacion.normas_apa_comentario : 'Sin recomendación'}</p>
                            </div>
                        {/if}
                    {/each}
                    {#if tp.proyecto.evaluaciones.length == 0}
                        <p className="whitespace-pre-line mt-4 text-xs">El proyecto no ha sido evaluado aún.</p>
                    {/if}
                </div>
            {/if}
        </fieldset>

        <div>
            <div className="flex items-center justify-between mt-14 px-8 py-4">
                <small className="flex items-center text-app-700">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {tp.updated_at}
                </small>

                {#if tp.proyecto.allowed.to_update}
                    <PrimaryButton loading={$form.processing} form="tp-form">Guardar información</PrimaryButton>
                {:else}
                    <span className="inline-block ml-1.5"> El proyecto no se puede modificar </span>
                {/if}
            </div>
        </div>
    </form>
</AuthenticatedLayout>
