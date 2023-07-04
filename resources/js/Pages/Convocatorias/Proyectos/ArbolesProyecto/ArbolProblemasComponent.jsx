<script>
    import { Inertia } from '@inertiajs/inertia'
    import { page } from '@inertiajs/inertia-svelte'
    import { route, checkRole, checkPermissionByUser } from '@/Utils'
    import { _ } from 'svelte-i18n'
    import { useForm } from '@inertiajs/inertia-svelte'

    import Label from '@/Components/Label'
    import PrimaryButton from '@/Components/PrimaryButton'
    import Textarea from '@/Components/Textarea'
    import InfoMessage from '@/Components/InfoMessage'
    import RecomendacionEvaluador from '@/Components/RecomendacionEvaluador'

    export let errors
    export let proyecto
    export let faseEvaluacion = false

    /**
     * Validar si el usuario autenticado es SuperAdmin
     */
    let authUser = $auth.user
    let isSuperAdmin = checkRole(authUser, [1])

    /**
     * Problema central
     */
    let formProblemaCentral = useForm({
        identificacion_problema: proyecto.identificacion_problema ? proyecto.identificacion_problema : '',
        problema_central: proyecto.problema_central ? proyecto.problema_central : '',
        justificacion_problema: proyecto.justificacion_problema ? proyecto.justificacion_problema : '',
        pregunta_formulacion_problema: proyecto.pregunta_formulacion_problema ? proyecto.pregunta_formulacion_problema : '',
        objetivo_general: proyecto.objetivo_general ? proyecto.objetivo_general : '',
    })

    function submitProblemaCentral() {
        if (proyecto.allowed.to_update) {
            $formProblemaCentral.post(route('proyectos.problema-central', proyecto.id), {
                preserveScroll: true,
            })
        }
    }
</script>

<!--
{#if (isSuperAdmin && faseEvaluacion == false) || (proyecto.mostrar_recomendaciones && faseEvaluacion == false)}
    <RecomendacionEvaluador className="mt-8">
        {#each proyecto.evaluaciones as evaluacion, i}
            {#if isSuperAdmin || (evaluacion.finalizado && evaluacion.habilitado)}
                <div className="bg-zinc-900 p-4 rounded shadow text-white my-2">
                    <p className="text-xs">Evaluador COD-{evaluacion.id}:</p>
                    {#if evaluacion.idi_evaluacion}
                        <p className="whitespace-pre-line text-xs">{evaluacion.idi_evaluacion?.problema_central_comentario ? evaluacion.idi_evaluacion.problema_central_comentario : 'Sin recomendación'}</p>
                    {:else if evaluacion.cultura_innovacion_evaluacion}
                        <p className="whitespace-pre-line text-xs">{evaluacion.cultura_innovacion_evaluacion?.arbol_problemas_comentario ? evaluacion.cultura_innovacion_evaluacion.arbol_problemas_comentario : 'Sin recomendación'}</p>
                    {:else if evaluacion.servicio_tecnologico_evaluacion}
                        <p className="whitespace-pre-line text-xs">{evaluacion.servicio_tecnologico_evaluacion?.arbol_problemas_comentario ? evaluacion.servicio_tecnologico_evaluacion.arbol_problemas_comentario : 'Sin recomendación'}</p>
                    {:else if evaluacion.ta_evaluacion}
                        <p className="whitespace-pre-line text-xs">{evaluacion.ta_evaluacion?.arbol_problemas_comentario ? evaluacion.ta_evaluacion.arbol_problemas_comentario : 'Sin recomendación'}</p>
                    {:else if evaluacion.tp_evaluacion}
                        <p className="whitespace-pre-line text-xs">{evaluacion.tp_evaluacion?.arbol_problemas_comentario ? evaluacion.tp_evaluacion.arbol_problemas_comentario : 'Sin recomendación'}</p>
                    {/if}
                </div>
            {/if}
        {/each}

        {#if proyecto.evaluaciones.length == 0}
            <p className="whitespace-pre-line mt-4 text-xs">El proyecto no ha sido evaluado aún.</p>
        {/if}
    </RecomendacionEvaluador>
{/if} -->

<div>
    <div className="efecto-directo-container">
        <div className="p-2">
            <div className="text-5xl font-extrabold my-10">
                <span className="bg-clip-text text-transparent m-auto bg-gradient-to-r from-app-500 to-app-300 block w-max">1. Problema central </span>
            </div>

            <form on:submit|preventDefault={submitProblemaCentral} id="problema-central">
                <fieldset className="space-y-20" disabled={proyecto.allowed.to_update ? undefined : true}>
                    {#if proyecto.codigo_linea_programatica != 68 || (proyecto.codigo_linea_programatica == 70 && proyecto?.proyecto_base) || (proyecto.codigo_linea_programatica == 70 && checkPermissionByUser(authUser, [24]))}
                        <div>
                            <Label required className="mb-4" labelFor="identificacion_problema" value="Identificación y descripción del problema" />
                            <InfoMessage
                                className="ml-10 mb-6"
                                message="1. Descripción de la necesidad, problema u oportunidad identificada del plan tecnológico y/o agendas departamentales de innovación y competitividad.<br>2. Descripción del problema que se atiende con el proyecto, sustentado en el contexto, la caracterización, los datos, las estadísticas, de la regional, entre otros, citar toda la información consignada utilizando normas APA última edición. La información debe ser de fuentes primarias de información, ejemplo: Secretarías, DANE, Artículos científicos, entre otros."
                            />
                            <Textarea disabled={isSuperAdmin ? false : proyecto.codigo_linea_programatica == 70 ? true : false} label="Identificación y descripción del problema" maxlength="40000" id="identificacion_problema" error={errors.identificacion_problema} bind:value={$formProblemaCentral.identificacion_problema} required />
                        </div>
                        <div className="mt-10">
                            <Label required className="mb-4" labelFor="justificacion_problema" value="Justificación" />
                            <InfoMessage className="ml-10 mb-6" message="Descripción de la solución al problema (descrito anteriormente) que se presenta en la regional, así como las consideraciones que justifican la elección del proyecto. De igual forma, describir la pertinencia y viabilidad del proyecto en el marco del impacto regional identificado en el instrumento de planeación." />

                            <Textarea disabled={isSuperAdmin ? false : proyecto.codigo_linea_programatica == 70 ? true : false} label="Justificación del problema" maxlength="5000" id="justificacion_problema" error={errors.justificacion_problema} bind:value={$formProblemaCentral.justificacion_problema} required />
                        </div>
                    {/if}

                    <div className="mt-10">
                        <Label required className="mb-4" labelFor="problema_central" value="Problema central (tronco)" />
                        <InfoMessage
                            className="ml-10 mb-6"
                            message="Para la redacción del problema central se debe tener en cuenta: a) Se debe referir a una situación existente, teniendo en cuenta la mayoría de los siguientes componentes: social, económico, tecnológico, ambiental. b) Su redacción debe ser una oración corta con sujeto, verbo y predicado. c) Se debe comprender con total claridad; el problema se debe formular mediante una oración clara y sin ambigüedades."
                        />
                        <Textarea disabled={isSuperAdmin ? false : proyecto.codigo_linea_programatica == 70 ? true : false} label="Problema central" maxlength="5000" id="problema_central" error={errors.problema_central} bind:value={$formProblemaCentral.problema_central} required />
                    </div>

                    <div className="text-5xl font-extrabold my-10">
                        <span className="bg-clip-text text-transparent m-auto bg-gradient-to-r from-app-500 to-app-300 block w-max">2. Objetivo general </span>
                    </div>

                    {#if proyecto.codigo_linea_programatica == 68}
                        <InfoMessage className="ml-10 mb-6">
                            <p>
                                El objetivo general se origina al convertir en positivo el problema principal (tronco) identificado en el árbol de problemas.
                                <br />
                                La redacción deberá iniciar con un verbo en modo infinitivo, es decir, con una palabra terminada en "ar", "er" o "ir". La estructura del objetivo debe contener al menos tres componentes: (1) la acción que se espera realizar, (2) el objeto sobre el cual recae la acción y (3) elementos adicionales de contexto o descriptivos.
                                <br />
                                El objetivo general debe expresar el fin concreto del proyecto en correspondencia directa con el título del proyecto y la pregunta de la formulación del problema, el cual debe ser claro, medible, alcanzable y consistente con el proyecto que está formulando. Debe responde al ¿Qué?, ¿Cómo? y el ¿Para qué?
                            </p>
                        </InfoMessage>
                    {:else}
                        <InfoMessage className="ml-10 mb-6" message="Establece que pretende alcanzar la investigación. Se inicia con un verbo en modo infinitivo, es medible y alcanzable. Responde al Qué, Cómo y el Para qué" />
                    {/if}

                    <div>
                        <Label required className="mb-4" labelFor="objetivo-general" value="Objetivo general" />
                        <Textarea disabled={isSuperAdmin ? false : proyecto.codigo_linea_programatica == 70 ? true : false} maxlength="10000" id="objetivo-general" error={errors.objetivo_general} bind:value={$formProblemaCentral.objetivo_general} required />
                    </div>
                </fieldset>

                {#if proyecto.allowed.to_update}
                    <PrimaryButton loading={$formProblemaCentral.processing} className="my-10" type="submit" form="problema-central">1. Guardar información sobre el problema central</PrimaryButton>
                {/if}
            </form>
        </div>
    </div>
</div>
