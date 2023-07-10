<script>
    import AuthenticatedLayout, { title } from '@/Layouts/Authenticated'
    import { page, useForm } from '@inertiajs/inertia-svelte'
    import { route, checkRole } from '@/Utils'
    import { _ } from 'svelte-i18n'

    import EvaluationStepper from '@/Shared/EvaluationStepper'
    import Label from '@/Shared/Label'
    import LoadingButton from '@/Shared/LoadingButton'
    import Textarea from '@/Shared/Textarea'

    export let errors
    export let convocatoria
    export let evaluacion
    export let proyecto
    export let causalesRechazoRegistradas

    $: $title = 'Verificación de causales de rechazo'

    /**
     * Validar si el usuario autenticado es SuperAdmin
     */
    let authUser = $page.props.auth.user
    let isSuperAdmin = checkRole(authUser, [1])

    let form = useForm({
        causal_rechazo: causalesRechazoRegistradas,
        justificacion_causal_rechazo: evaluacion.justificacion_causal_rechazo,
    })

    function submit() {
        if (isSuperAdmin || (checkRole(authUser, [11, 5]) && evaluacion.finalizado == false && evaluacion.habilitado == true && evaluacion.modificable == true)) {
            $form.post(route('convocatorias.evaluaciones.update-causal-rechazo', [convocatoria.id, evaluacion.id]), {
                preserveScroll: true,
            })
        }
    }
</script>

<AuthenticatedLayout>
    <header class="pt-[8rem]" slot="header">
        <EvaluationStepper {convocatoria} {evaluacion} {proyecto} />
    </header>

    <h1 class="mt-24 mb-8 text-center text-3xl">Causales de rechazo</h1>

    <form on:submit|preventDefault={submit}>
        <div class="mt-28">
            <div class="grid grid-cols-2">
                <Label
                    class="p-3 border-t border-b flex items-center text-sm"
                    labelFor="1"
                    value="El proyecto se inscribe en alguna de las líneas de la Estrategia Regional, pero su formulación obedece a los objetivos de otra línea. Ejemplo: se formula un proyecto de la Estrategia Regional con el objeto de modernizar un ambiente de formación y se verifica que el proyecto se enfoca en la prestación de nuevos servicios tecnológicos"
                />

                <div class="border-b border-t flex items-center justify-center">
                    <input type="checkbox" bind:group={$form.causal_rechazo} id="1" value={1} class="rounded text-app-500" />
                </div>
            </div>

            <div class="grid grid-cols-2">
                <Label class="p-3 border-t border-b flex items-center text-sm" labelFor="2" value="En la formulación del proyecto se consideran como actividades principales y no como productos resultados de investigación, la realización de actividades de divulgación tecnológica como congresos, simposios, semanarios, entre otros." />

                <div class="border-b border-t flex items-center justify-center">
                    <input type="checkbox" bind:group={$form.causal_rechazo} id="2" value={2} class="rounded text-app-500" />
                </div>
            </div>

            <div class="grid grid-cols-2">
                <Label class="p-3 border-t border-b flex items-center text-sm" labelFor="3" value="Se verifique que el proyecto y sus productos resultados de investigación sean parte de una tesis doctoral, de maestría o de pregrado." />

                <div class="border-b border-t flex items-center justify-center">
                    <input type="checkbox" bind:group={$form.causal_rechazo} id="3" value={3} class="rounded text-app-500" />
                </div>
            </div>

            <div class="grid grid-cols-2">
                <Label class="p-3 border-t border-b flex items-center text-sm" labelFor="4" value="Se verifique una posible vulneración de los derechos de uno o varios autores que debe ser validada por la Coordinación SENNOVA." />

                <div class="border-b border-t flex items-center justify-center">
                    <input type="checkbox" bind:group={$form.causal_rechazo} id="4" value={4} class="rounded text-app-500" />
                </div>
            </div>
            {#if $form.causal_rechazo?.length > 0}
                <div class="mt-8 mb-8">
                    <Label required labelFor="justificacion_causal_rechazo" value="Justificación" />

                    <Textarea required maxlength="40000" id="justificacion_causal_rechazo" error={errors.justificacion_causal_rechazo} bind:value={$form.justificacion_causal_rechazo} />
                </div>
            {/if}
        </div>
        <div class="shadow-inner bg-app-200 border-app-400 bottom-0 flex items-center justify-between mt-14 px-8 py-4 sticky">
            {#if isSuperAdmin || (checkRole(authUser, [11, 5]) && evaluacion.finalizado == false && evaluacion.habilitado == true && evaluacion.modificable == true)}
                <LoadingButton loading={$form.processing} class="ml-auto" type="submit">Guardar</LoadingButton>
            {/if}
        </div>
    </form>
</AuthenticatedLayout>
