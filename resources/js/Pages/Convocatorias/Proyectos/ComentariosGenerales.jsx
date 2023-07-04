<script>
    import AuthenticatedLayout, { title } from '@/Layouts/Authenticated'
    import { page, useForm } from '@inertiajs/inertia-svelte'
    import { route, checkRole, checkPermission } from '@/Utils'
    import { _ } from 'svelte-i18n'

    import Stepper from '@/Components/Stepper'
    import Label from '@/Components/Label'
    import PrimaryButton from '@/Components/PrimaryButton'
    import Textarea from '@/Components/Textarea'
    import InfoMessage from '@/Components/InfoMessage'

    export let errors
    export let convocatoria
    export let proyecto
    export let evaluaciones

    $: $title = 'Comentarios generales'

    /**
     * Validar si el usuario autenticado es SuperAdmin
     */
    let authUser = $auth.user
    let isSuperAdmin = checkRole(authUser, [1])

    let formPrimeraEvaluacion = useForm({
        replicas: evaluaciones[0] ? evaluaciones[0].replicas : '',
    })

    function submitReplicaPrimeraEval() {
        if (proyecto.allowed.to_update) {
            $formPrimeraEvaluacion.post(route('convocatorias.proyectos.update-comentarios', [convocatoria.id, evaluaciones[0].id]), {
                preserveScroll: true,
            })
        }
    }

    let formSegundaEvaluacion = useForm({
        replicas: evaluaciones[1] ? evaluaciones[1].replicas : '',
    })

    function submitReplicaSegundaEval() {
        if (proyecto.allowed.to_update) {
            $formSegundaEvaluacion.post(route('convocatorias.proyectos.update-comentarios', [convocatoria.id, evaluaciones[1].id]), {
                preserveScroll: true,
            })
        }
    }

    let formTerceraEvaluacion = useForm({
        replicas: evaluaciones[2] ? evaluaciones[2].replicas : '',
    })

    function submitReplicaTerceraEval() {
        if (proyecto.allowed.to_update) {
            $formTerceraEvaluacion.post(route('convocatorias.proyectos.update-comentarios', [convocatoria.id, evaluaciones[2].id]), {
                preserveScroll: true,
            })
        }
    }
</script>

<AuthenticatedLayout>
    <header className="pt-[8rem]" slot="header">
        <Stepper {convocatoria} {proyecto} />
    </header>

    {#each evaluaciones as evaluacion}
        {#each evaluacion.evaluacion_causales_rechazo as causalRechazo}
            {#if causalRechazo.causal_rechazo == 1}
                <InfoMessage className="mt-24" alertMsg={true}>
                    <h1 className="mb-8 font-black">
                        <strong>¡Importante!</strong> Este proyecto tuvo la siguiente causal de rechazo {#if proyecto.modificable}, por favor haga la respectiva subsanación. {/if}
                    </h1>
                    <p>El proyecto se inscribe en alguna de las líneas de la Estrategia Regional, pero su formulación obedece a los objetivos de otra línea. Ejemplo: se formula un proyecto de la Estrategia Regional con el objeto de modernizar un ambiente de formación y se verifica que el proyecto se enfoca en la prestación de nuevos servicios tecnológicos</p>
                    <hr />
                </InfoMessage>
            {/if}

            {#if causalRechazo.causal_rechazo == 2}
                <InfoMessage className="mt-24" alertMsg={true}>
                    <h1 className="mb-8 font-black">
                        <strong>¡Importante!</strong> Este proyecto tuvo la siguiente causal de rechazo {#if proyecto.modificable}, por favor haga la respectiva subsanación. {/if}
                    </h1>

                    <p>En la formulación del proyecto se consideran como actividades principales y no como productos resultados de investigación, la realización de actividades de divulgación tecnológica como congresos, simposios, semanarios, entre otros.</p>
                    <hr />
                </InfoMessage>
            {/if}

            {#if causalRechazo.causal_rechazo == 3}
                <InfoMessage className="mt-24" alertMsg={true}>
                    <h1 className="mb-8 font-black">
                        <strong>¡Importante!</strong> Este proyecto tuvo la siguiente causal de rechazo {#if proyecto.modificable}, por favor haga la respectiva subsanación. {/if}
                    </h1>

                    <p>Se verifique que el proyecto y sus productos resultados de investigación sean parte de una tesis doctoral, de maestría o de pregrado.</p>
                    <hr />
                </InfoMessage>
            {/if}

            {#if causalRechazo.causal_rechazo == 4}
                <InfoMessage className="mt-24" alertMsg={true}>
                    <h1 className="mb-8 font-black">
                        <strong>¡Importante!</strong> Este proyecto tuvo la siguiente causal de rechazo {#if proyecto.modificable}, por favor haga la respectiva subsanación. {/if}
                    </h1>

                    <p>Se verifique una posible vulneración de los derechos de uno o varios autores que debe ser validada por la Coordinación SENNOVA.</p>
                    <hr />
                </InfoMessage>
            {/if}
        {/each}

        {#if evaluacion.justificacion_causal_rechazo}
            <InfoMessage alertMsg={true}>
                <h1 className="font-black">Justificación de la causal de rechazo</h1>
                <p>{evaluacion.justificacion_causal_rechazo}</p>
                <hr />
            </InfoMessage>
        {/if}
    {/each}

    <h1 className="mt-24 mb-8 text-center text-3xl">Comentarios generales</h1>
    <InfoMessage>Este es un espacio para que haga un comentario general, de una respuesta o le resuelva alguna duda a los evaluadores.</InfoMessage>

    {#if evaluaciones[0] && evaluaciones[0].finalizado && evaluaciones[0].habilitado}
        <form on:submit|preventDefault={submitReplicaPrimeraEval}>
            <fieldset disabled={proyecto.allowed.to_update ? undefined : true}>
                <div className="mt-28">
                    <h1 className="font-black">Evaluador COD-{evaluaciones[0].id}</h1>

                    <p className="whitespace-pre-line">
                        {evaluaciones[0].comentario_evaluador ? evaluaciones[0].comentario_evaluador : 'Sin información registrada'}
                    </p>

                    <div className="mt-8 mb-8">
                        <Label labelFor="replicas" value="Respuesta" />

                        <Textarea maxlength="40000" id="replicas" error={errors.replicas} bind:value={$formPrimeraEvaluacion.replicas} />
                    </div>
                </div>
            </fieldset>
            <div className="py-4 flex items-center sticky bottom-0">
                {#if proyecto.allowed.to_update}
                    <PrimaryButton loading={$formPrimeraEvaluacion.processing} className="ml-auto" type="submit">Enviar comentario / resupuesta</PrimaryButton>
                {/if}
            </div>
        </form>
    {/if}

    {#if evaluaciones[1] && evaluaciones[1].finalizado && evaluaciones[1].habilitado}
        <hr className="mt-10 mb-10 border-black-200" />

        <form on:submit|preventDefault={submitReplicaSegundaEval}>
            <fieldset disabled={proyecto.allowed.to_update ? undefined : true}>
                <div className="mt-28">
                    <h1 className="font-black">Evaluador COD-{evaluaciones[1].id}</h1>

                    <p className="whitespace-pre-line">
                        {evaluaciones[1].comentario_evaluador ? evaluaciones[1].comentario_evaluador : 'Sin información registrada'}
                    </p>

                    <div className="mt-8 mb-8">
                        <Label labelFor="replicas" value="Respuesta" />

                        <Textarea maxlength="40000" id="replicas" error={errors.replicas} bind:value={$formSegundaEvaluacion.replicas} />
                    </div>
                </div>
            </fieldset>
            <div className="py-4 flex items-center sticky bottom-0">
                {#if proyecto.allowed.to_update}
                    <PrimaryButton loading={$formSegundaEvaluacion.processing} className="ml-auto" type="submit">Enviar comentario / resupuesta</PrimaryButton>
                {/if}
            </div>
        </form>
    {/if}

    {#if evaluaciones[2] && evaluaciones[2].finalizado && evaluaciones[2].habilitado}
        <hr className="mt-10 mb-10 border-black-200" />

        <form on:submit|preventDefault={submitReplicaTerceraEval}>
            <fieldset disabled={proyecto.allowed.to_update ? undefined : true}>
                <div className="mt-28">
                    <h1 className="font-black">Evaluador COD-{evaluaciones[2].id}</h1>

                    <p className="whitespace-pre-line">
                        {evaluaciones[2].comentario_evaluador ? evaluaciones[2].comentario_evaluador : 'Sin información registrada'}
                    </p>

                    <div className="mt-8 mb-8">
                        <Label labelFor="replicas" value="Respuesta" />

                        <Textarea maxlength="40000" id="replicas" error={errors.replicas} bind:value={$formTerceraEvaluacion.replicas} />
                    </div>
                </div>
            </fieldset>
            <div className="py-4  flex items-center sticky bottom-0">
                {#if proyecto.allowed.to_update}
                    <PrimaryButton loading={$formTerceraEvaluacion.processing} className="ml-auto" type="submit">Enviar comentario / resupuesta</PrimaryButton>
                {/if}
            </div>
        </form>
    {/if}
</AuthenticatedLayout>
