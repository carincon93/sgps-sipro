<script>
    import AuthenticatedLayout, { title } from '@/Layouts/Authenticated'
    import { page, useForm } from '@inertiajs/inertia-svelte'
    import { route, checkRole } from '@/Utils'
    import { _ } from 'svelte-i18n'

    import EvaluationStepper from '@/Shared/EvaluationStepper'
    import Label from '@/Shared/Label'
    import Textarea from '@/Shared/Textarea'
    import LoadingButton from '@/Shared/LoadingButton'
    import InfoMessage from '@/Shared/InfoMessage'

    export let errors
    export let convocatoria
    export let evaluacion
    export let proyecto
    export let otrasEvaluaciones

    $: $title = 'Comentarios generales'

    /**
     * Validar si el usuario autenticado es SuperAdmin
     */
    let authUser = $page.props.auth.user
    let isSuperAdmin = checkRole(authUser, [1])

    let form = useForm({
        comentario_formulador: evaluacion.comentario_formulador,
        comentario_evaluador: evaluacion.comentario_evaluador,
    })

    function submit() {
        if (isSuperAdmin || (checkRole(authUser, [11, 5]) && evaluacion.finalizado == false && evaluacion.habilitado == true && evaluacion.modificable == true)) {
            $form.post(route('convocatorias.evaluaciones.update-comentarios-generales', [convocatoria.id, evaluacion.id]), {
                preserveScroll: true,
            })
        }
    }
</script>

<AuthenticatedLayout>
    <header class="pt-[8rem]" slot="header">
        <EvaluationStepper {convocatoria} {evaluacion} {proyecto} />
    </header>

    <h1 class="mt-24 mb-8 text-center text-3xl">Comentarios generales</h1>
    <InfoMessage class="mb-10">
        {#if evaluacion.evaluacion_final != true}
            Este es un espacio para que haga un comentario general al formulador del proyecto.
        {:else}
            Este es un espacio para que haga un comentario final al formulador del proyecto.
        {/if}
    </InfoMessage>

    {#if evaluacion.evaluacion_final}
        <InfoMessage>
            {#each otrasEvaluaciones as evaluacion}
                <div class="mb-8">
                    <h4>Comentario general del evaluador(a): <span class="font-black capitalize">{evaluacion.evaluador.nombre}</span></h4>
                    <p class="whitespace-pre-line">
                        {evaluacion.comentario_evaluador ? evaluacion.comentario_evaluador : 'Sin información registrada'}
                    </p>
                    <br />
                </div>
            {/each}
        </InfoMessage>
    {/if}

    {#if evaluacion.replicas}
        <hr class="mt-10 mb-10 border-black-200" />

        <h1 class="font-black mb-10">Comentario / resupuesta del formulador</h1>

        <p class="whitespace-pre-line">
            {evaluacion.replicas ? evaluacion.replicas : 'Sin información registrada'}
        </p>
    {/if}

    <form on:submit|preventDefault={submit}>
        <div class="mt-28">
            <div class="mt-8 mb-8">
                <Label labelFor=" comentario_evaluador" value={evaluacion.evaluacion_final ? 'Comentario final' : 'Comentarios'} />

                <Textarea maxlength="40000" id=" comentario_evaluador" error={errors.comentario_evaluador} bind:value={$form.comentario_evaluador} />
            </div>
        </div>
        <div class="shadow-inner bg-app-200 border-app-400 bottom-0 flex items-center justify-between mt-14 px-8 py-4 sticky">
            {#if isSuperAdmin || (checkRole(authUser, [11, 5]) && evaluacion.finalizado == false && evaluacion.habilitado == true && evaluacion.modificable == true)}
                <LoadingButton loading={$form.processing} class="ml-auto" type="submit">Guardar</LoadingButton>
            {/if}
        </div>
    </form>
</AuthenticatedLayout>
