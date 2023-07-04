<script>
    import AuthenticatedLayout, { title } from '@/Layouts/Authenticated'
    import { inertia, useForm, page } from '@inertiajs/inertia-svelte'
    import { route, checkRole } from '@/Utils'
    import { _ } from 'svelte-i18n'

    import Label from '@/Components/Label'
    import Input from '@/Components/Input'
    import InputError from '@/Components/InputError'
    import PrimaryButton from '@/Components/PrimaryButton'
    import Switch from '@/Components/Switch'
    import InfoMessage from '@/Components/InfoMessage'
    import Button from '@/Components/Button'
    import Select from '@/Components/Select'
    import Dialog from '@/Components/Dialog'

    export let errors
    export let proyecto
    export let evaluadores

    $: $title = proyecto ? proyecto.codigo : null

    /**
     * Validar si el usuario autenticado es SuperAdmin
     */
    let authUser = $auth.user
    let isSuperAdmin = checkRole(authUser, [1])

    let form = useForm({
        subsanacion: proyecto.habilitado_para_evaluar == false && proyecto.modificable == true && proyecto.finalizado == false,
        estado_cord_sennova: proyecto.estado_cord_sennova ? JSON.parse(proyecto.estado_cord_sennova)?.estado : null,
        mostrar_recomendaciones: proyecto.mostrar_recomendaciones,
        en_evaluacion: proyecto.en_evaluacion,
        radicado: proyecto.radicado,
    })

    function submit() {
        if (isSuperAdmin || checkRole(authUser, [20, 18, 19, 5, 17])) {
            $form.put(route('proyectos.update', proyecto.id), {
                preserveScroll: true,
            })
        }
    }

    let formEvaluacion = useForm({
        id: null,
        habilitado: false,
        modificable: false,
        finalizado: false,
        proyecto_id: null,
        user_id: null,
    })

    function submitEvaluacion() {
        if (isSuperAdmin || checkRole(authUser, [20, 18, 19, 5, 17])) {
            $formEvaluacion.put(route('evaluaciones.update', $formEvaluacion.id), {
                preserveScroll: true,
            })
        }
    }

    let dialogOpen = false
    let showEvaluacionForm = false
    function showEvaluacionDialog(evaluacion) {
        showEvaluacionForm = true
        dialogOpen = true
        $formEvaluacion.id = evaluacion.id
        $formEvaluacion.habilitado = evaluacion.habilitado
        $formEvaluacion.modificable = evaluacion.modificable
        $formEvaluacion.finalizado = evaluacion.finalizado
        $formEvaluacion.clausula_confidencialidad = evaluacion.clausula_confidencialidad
        $formEvaluacion.proyecto_id = evaluacion.proyecto_id
        $formEvaluacion.user_id = evaluacion.user_id
    }

    $: if ($formEvaluacion?.modificable) {
        $form.subsanacion = false
        $form.en_evaluacion = true
    } else {
        $form.subsanacion = proyecto.habilitado_para_evaluar == false && proyecto.modificable == true && proyecto.finalizado == false
    }

    $: if ($form?.subsanacion && $form?.en_evaluacion) {
        $form.en_evaluacion = false
    }
</script>

<AuthenticatedLayout>
    <header className="pt-[8rem]" slot="header">
        <div className="flex items-center justify-between lg:px-8 max-w-7xl mx-auto px-4 py-6 sm:px-6">
            <div>
                <h1 className="overflow-ellipsis overflow-hidden w-breadcrumb-ellipsis whitespace-nowrap flex items-center">
                    {#if isSuperAdmin || checkRole(authUser, [20, 18, 19, 5, 17])}
                        <a use:inertia href={route('proyectos.index')} className="text-app-400 hover:text-app-600"> Proyectos </a>
                    {/if}
                    <span className="text-app-400 font-medium mx-1.5">/</span>
                    {proyecto.codigo}
                    <a className="bg-app-600 text-white p-1 pr-5 rounded ml-2" href={route('convocatorias.proyectos.edit', [proyecto.convocatoria_id, proyecto.id])} target="_blank">
                        <span className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mx-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                            <small> Ver detalles </small>
                        </span>
                    </a>
                </h1>
            </div>
        </div>
    </header>

    <div className="bg-white rounded shadow max-w-3xl">
        <form on:submit|preventDefault={submit}>
            <fieldset className="p-8">
                <div className="mt-8">
                    <Label labelFor="subsanacion" value="¿El proyecto puede ser subsanado? Nota: Si se selecciona la opción SI se finalizarán todas la evaluaciones del proyecto {proyecto.codigo}" className="inline-block mb-4" />
                    <br />
                    <Switch bind:checked={$form.subsanacion} />
                    <InputError message={errors.subsanacion} />

                    <InfoMessage className="mt-10">
                        <p className="font-black">Tenga en cuenta: Información del estado del proyecto (Se tienen en cuenta la(s) {proyecto?.evaluacionesHabilitadas} evaluacion(es) habilitada(s))</p>
                        <ul>
                            <li>Estado del proyecto: {JSON.parse(proyecto.estado)?.estado != '' ? JSON.parse(proyecto.estado)?.estado : proyecto.estado_cord_sennova ? JSON.parse(proyecto.estado_cord_sennova)?.estado : 'Sin estado'}</li>
                            <li>Número de recomendaciones: {JSON.parse(proyecto.estado)?.numeroRecomendaciones ? JSON.parse(proyecto.estado)?.numeroRecomendaciones : 0}</li>
                            {#if JSON.parse(proyecto.estado)?.puntaje}
                                <li>Puntaje total: {JSON.parse(proyecto.estado)?.puntaje ? JSON.parse(proyecto.estado)?.puntaje : 0}</li>
                            {/if}
                            <li>¿Requiere ser subsanado?: {JSON.parse(proyecto.estado)?.requiereSubsanar ? 'Si' : 'No'}</li>
                        </ul>
                    </InfoMessage>
                </div>

                <hr className="mt-10 mb-10" />

                <div className="mt-8">
                    <Label labelFor="en_evaluacion" value="¿El proyecto puede ser evaluado? Nota: Esta opción permite que los evaluadores visualicen el proyecto en su lista de evaluaciones" className="inline-block mb-4" />
                    <br />
                    <Switch bind:checked={$form.en_evaluacion} />
                    <InputError message={errors.en_evaluacion} />
                </div>

                <hr className="mt-10 mb-10" />

                <div className="mt-8">
                    <Label labelFor="radicado" value="¿El proyecto esta radicado? Nota: Si la opción es si evita que sea eliminado del sistema" className="inline-block mb-4" />
                    <br />
                    <Switch bind:checked={$form.radicado} />
                    <InputError message={errors.radicado} />
                </div>

                <hr className="mt-10 mb-10" />

                <div className="mt-8">
                    <Label labelFor="estado_cord_sennova" value="Por favor defina el estado del proyecto. (Solo si el proyecto tuvo uno revisión por la cord. SENNOVA)" className="inline-block mb-4" />
                    <br />
                    <Input label="Estado (Definido por la cord. SENNOVA)" id="estado_cord_sennova" type="text" className="mt-1" bind:value={$form.estado_cord_sennova} error={errors.estado_cord_sennova} />
                    <InputError message={errors.estado_cord_sennova} />
                </div>

                <hr className="mt-10 mb-10" />

                <div className="mt-8">
                    <Label labelFor="mostrar_recomendaciones" value="¿Los proponentes pueden observar las recomendaciones?" className="inline-block mb-4" />
                    <br />
                    <Switch bind:checked={$form.mostrar_recomendaciones} />
                    <InputError message={errors.mostrar_recomendaciones} />
                </div>

                <hr className="mt-10 mb-10" />

                <h1 className="p-4 font-black">Evaluadores</h1>

                {#each proyecto.evaluaciones as evaluacion}
                    <div className="flex items-center justify-between p-4 border border-t">
                        <p className="capitalize">{evaluacion.evaluador.nombre}</p>
                        <Button type="button" variant="raised" on:click={() => showEvaluacionDialog(evaluacion)}>Modificar</Button>
                    </div>
                {/each}
                {#if proyecto.evaluaciones.length == 0}
                    <p className="p-4">El proyecto no tiene evaluadores asignados</p>
                {/if}
            </fieldset>

            <div className="flex items-center justify-between mt-14 px-8 py-4">
                {#if isSuperAdmin || checkRole(authUser, [20, 18, 19, 5, 17])}
                    <PrimaryButton loading={$form.processing} className="ml-auto" type="submit">Guardar</PrimaryButton>
                {/if}
            </div>
        </form>
    </div>

    <Dialog bind:open={dialogOpen}>
        <div slot="title" className="flex items-center">Editar evaluación</div>
        <div slot="content">
            {#if showEvaluacionForm}
                <form on:submit|preventDefault={submitEvaluacion} id="evaluacion">
                    <fieldset className="p-8">
                        <div className="mt-8">
                            <Label className="mb-4" labelFor="user_id" value="Evaluador" />
                            <Select disabled={$formEvaluacion.clausula_confidencialidad} id="user_id" items={evaluadores} bind:selectedValue={$formEvaluacion.user_id} error={errors.user_id} autocomplete="off" placeholder="Seleccione un evaluador" required />
                            {#if $formEvaluacion.clausula_confidencialidad}
                                <InfoMessage alertMsg={true}>No se puede modificar el evaluador debido a que la evaluación ya tiene información registrada. Por favor genere una nueva evaluación con el nuevo evaluador y posteriormente deshabilite esta evaluación.</InfoMessage>
                            {/if}
                        </div>

                        <hr className="mt-10 mb-10" />

                        <div className="mt-8">
                            <Label labelFor="habilitado" value="¿La evaluación está habilitada? Nota: Una evaluación habilitada significa que el sistema la puede tomar para hacer el cálculo del promedio y asignar el estado del proyecto." className="inline-block mb-4" />
                            <br />
                            <Switch bind:checked={$formEvaluacion.habilitado} />
                            <InputError message={errors.habilitado} />
                        </div>

                        <hr className="mt-10 mb-10" />

                        <div className="mt-8">
                            <Label labelFor="modificable" value="¿La evaluación es modificable? Nota: Si la evaluación es modificable el evaluador podrá editar la información de la evaluación. Por otro lado el formulador NO podrá modicar la información del proyecto mientras se está realizando una evaluación." className="inline-block mb-4" />
                            <br />
                            <Switch bind:checked={$formEvaluacion.modificable} />
                            <InputError message={errors.modificable} />
                        </div>
                    </fieldset>
                </form>
            {/if}
        </div>
        <div slot="actions">
            <div className="p-4">
                <Button on:click={() => ((dialogOpen = false), ($form.subsanacion = proyecto.habilitado_para_evaluar == false && proyecto.modificable == true && proyecto.finalizado == false))} variant={null}>Cancelar</Button>

                <PrimaryButton loading={$formEvaluacion.processing} className="btn-gray ml-auto" type="submit" form="evaluacion">Guardar</PrimaryButton>
            </div>
        </div>
    </Dialog>
</AuthenticatedLayout>
