<script>
    import AuthenticatedLayout, { title } from '@/Layouts/Authenticated'
    import { page, useForm } from '@inertiajs/inertia-svelte'
    import { onMount } from 'svelte'
    import { _ } from 'svelte-i18n'
    import { checkRole, checkPermission } from '@/Utils'
    import ScrollBooster from 'scrollbooster'

    import Stepper from '@/Shared/Stepper'
    import InfoMessage from '@/Shared/InfoMessage'
    import Label from '@/Shared/Label'
    import Textarea from '@/Shared/Textarea'
    import LoadingButton from '@/Shared/LoadingButton'
    import RecomendacionEvaluador from '@/Shared/RecomendacionEvaluador'

    export let errors
    export let convocatoria
    export let proyecto
    export let objetivos
    export let objetivoGeneral
    export let productos
    export let to_pdf

    $title = 'Cadena de valor'

    /**
     * Validar si el usuario autenticado es SuperAdmin
     */
    let authUser = $page.props.auth.user
    let isSuperAdmin = checkRole(authUser, [1])

    let form = useForm({
        propuesta_sostenibilidad: proyecto.propuesta_sostenibilidad,
        propuesta_sostenibilidad_social: proyecto.propuesta_sostenibilidad_social,
        propuesta_sostenibilidad_ambiental: proyecto.propuesta_sostenibilidad_ambiental,
        propuesta_sostenibilidad_financiera: proyecto.propuesta_sostenibilidad_financiera,
    })

    function submit() {
        if (proyecto.allowed.to_update) {
            $form.put(route('convocatorias.proyectos.propuesta-sostenibilidad', [convocatoria.id, proyecto.id]), {
                preserveScroll: true,
            })
        }
    }

    onMount(() => {
        google.charts.setOnLoadCallback(drawChart)
    })

    function drawChart() {
        var data = new google.visualization.DataTable()
        data.addColumn('string', 'Name')
        data.addColumn('string', 'Manager')
        data.addColumn('string', 'ToolTip')

        var options = {
            nodeClass: 'bg-app-500 text-white shadow',
            selectedNodeClass: 'bg-app-700',
            allowHtml: true,
            size: 'small',
        }

        // For each orgchart box, provide the name, manager, and tooltip to show.

        data.addRows([[{ v: 'Objetivo general', f: '<strong>Objetivo general</strong><div>' + objetivoGeneral + '</div>' }, '', 'Objetivo general']])

        objetivos.map((objetivo) => {
            data.addRows([[{ v: 'Objetivo específico ' + objetivo.numero, f: '<strong>Objetivo específico ' + objetivo.numero + '</strong><div>' + objetivo.descripcion ? objetivo.descripcion : 'Sin descripción registrada aún' + '</div>' }, 'Objetivo general', 'Objetivo específico ' + objetivo.numero]])
        })

        let totalProyecto = 0

        productos.map((producto) => {
            data.addRows([[{ v: producto.v, f: '<strong>Producto</strong><div>' + producto.f + '</div>' }, producto.fkey, producto.tooltip]])
            producto.actividades.map((actividad) => {
                data.addRows([
                    [
                        {
                            v: 'act' + producto.v + actividad.id,
                            f: '<strong>Actividad</strong><div>' + actividad.descripcion + '</div><div><strong>Roles:</strong><ul class="list-inside">' + actividad.proyecto_roles_sennova.map((proyectoRol) => '<li>' + proyectoRol.convocatoria_rol_sennova.rol_sennova.nombre + '</li>') + '</ul></div>',
                        },
                        producto.v,
                        actividad.descripcion,
                    ],
                ])
                totalProyecto += actividad.costo_actividad
                data.addRows([[{ v: 'cost' + producto.v + actividad.id, f: '<strong>Costo</strong><div>$ ' + new Intl.NumberFormat('de-DE').format(!isNaN(actividad.costo_actividad) ? actividad.costo_actividad : 0) + ' COP</div>' }, 'act' + producto.v + actividad.id, new Intl.NumberFormat('de-DE').format(!isNaN(actividad.costo_actividad) ? actividad.costo_actividad : 0)]])
            })
        })

        // Create the chart.
        var chart = new google.visualization.OrgChart(document.getElementById('orgchart_div'))
        if (typeof chart.draw === 'function') {
            // Draw the chart, setting the allowHtml option to true for the tooltips.
            chart.draw(data, options)

            new ScrollBooster({
                viewport: document.getElementById('orgchart_div'),
                scrollMode: 'transform',
            })
        }

        console.log(totalProyecto)
    }
</script>

<AuthenticatedLayout>
    <header class="pt-[8rem]" slot="header">
        {#if !to_pdf}
            <Stepper {convocatoria} {proyecto} />
        {/if}
    </header>
    {#if !to_pdf}
        <h1 class="text-3xl mt-24 text-center">Propuesta de sostenibilidad</h1>

        {#if isSuperAdmin || proyecto.mostrar_recomendaciones}
            <div class="my-14">
                <RecomendacionEvaluador class="mt-8">
                    {#each proyecto.evaluaciones as evaluacion, i}
                        {#if isSuperAdmin || (evaluacion.finalizado && evaluacion.habilitado)}
                            <div class="bg-zinc-900 p-4 rounded shadow text-white my-2">
                                <p class="text-xs">Evaluador COD-{evaluacion.id}:</p>
                                {#if evaluacion.idi_evaluacion}
                                    <p class="whitespace-pre-line text-xs">{evaluacion.idi_evaluacion?.cadena_valor_comentario ? evaluacion.idi_evaluacion.cadena_valor_comentario : 'Sin recomendación'}</p>
                                {:else if evaluacion.cultura_innovacion_evaluacion}
                                    <p class="whitespace-pre-line text-xs">{evaluacion.cultura_innovacion_evaluacion?.cadena_valor_comentario ? evaluacion.cultura_innovacion_evaluacion.cadena_valor_comentario : 'Sin recomendación'}</p>
                                {:else if evaluacion.ta_evaluacion}
                                    <p class="whitespace-pre-line text-xs">{evaluacion.ta_evaluacion?.cadena_valor_comentario ? evaluacion.ta_evaluacion.cadena_valor_comentario : 'Sin recomendación'}</p>
                                {:else if evaluacion.tp_evaluacion}
                                    <p class="whitespace-pre-line text-xs">{evaluacion.tp_evaluacion?.cadena_valor_comentario ? evaluacion.tp_evaluacion.cadena_valor_comentario : 'Sin recomendación'}</p>
                                {:else if evaluacion.servicio_tecnologico_evaluacion}
                                    <hr class="mt-10 mb-10 border-black-200" />
                                    <h1 class="font-black">Propuesta de sostenibilidad</h1>

                                    <p class="whitespace-pre-line text-xs mb-10">{evaluacion.servicio_tecnologico_evaluacion?.propuesta_sostenibilidad_comentario ? 'Recomendación: ' + evaluacion.servicio_tecnologico_evaluacion.propuesta_sostenibilidad_comentario : 'Sin recomendación'}</p>

                                    <hr class="mt-10 mb-10 border-black-200" />
                                    <h1 class="font-black">Impactos</h1>

                                    <ul class="list-disc pl-4">
                                        <li class="whitespace-pre-line text-xs mb-10">{evaluacion.servicio_tecnologico_evaluacion?.impacto_ambiental_comentario ? 'Recomendación impacto ambiental: ' + evaluacion.servicio_tecnologico_evaluacion.impacto_ambiental_comentario : 'Sin recomendación'}</li>
                                        <li class="whitespace-pre-line text-xs mb-10">{evaluacion.servicio_tecnologico_evaluacion?.impacto_social_centro_comentario ? 'Recomendación impacto social en el centro de formación: ' + evaluacion.servicio_tecnologico_evaluacion.impacto_social_centro_comentario : 'Sin recomendación'}</li>
                                        <li class="whitespace-pre-line text-xs mb-10">{evaluacion.servicio_tecnologico_evaluacion?.impacto_social_productivo_comentario ? 'Recomendación impacto social en el sector productivo: ' + evaluacion.servicio_tecnologico_evaluacion.impacto_social_productivo_comentario : 'Sin recomendación'}</li>
                                        <li class="whitespace-pre-line text-xs mb-10">{evaluacion.servicio_tecnologico_evaluacion?.impacto_tecnologico_comentario ? 'Recomendación impacto tecnológico: ' + evaluacion.servicio_tecnologico_evaluacion.impacto_tecnologico_comentario : 'Sin recomendación'}</li>
                                    </ul>
                                {/if}
                            </div>
                        {/if}
                    {/each}

                    {#if proyecto.evaluaciones.length == 0}
                        <p class="whitespace-pre-line mt-4 text-xs">El proyecto no ha sido evaluado aún.</p>
                    {/if}
                </RecomendacionEvaluador>
            </div>
        {/if}

        {#if proyecto.codigo_linea_programatica == 70}
            <p class="text-center mb-24">A continuación, plantee las acciones concretas que contribuirán a la sostenibilidad financiera de la TecnoAcademia y su aporte a la sostenibilidad ambiental y social del territorio.</p>
        {/if}

        <form on:submit|preventDefault={submit}>
            <fieldset disabled={proyecto.allowed.to_update ? undefined : true}>
                {#if proyecto.codigo_linea_programatica != 70}
                    <div class="mt-8">
                        <Label required class="mb-4" labelFor="propuesta_sostenibilidad" value="Propuesta de sostenibilidad" />
                        {#if proyecto.codigo_linea_programatica == 68}
                            <InfoMessage class="mb-6">
                                Se deben mencionar aquellos factores que pueden comprometer la viabilidad, desarrollo de los objetivos y resultados del proyecto a través del tiempo.
                                <br />
                                Para definir la propuesta de sostenibilidad se deben tener en cuenta los impactos definidos en el árbol de objetivos (ambiental, social - en el centro de formación, social - en el sector productivo, tecnológico)
                            </InfoMessage>
                        {:else}
                            <InfoMessage class="mb-2" message="Identificar los efectos que tiene el desarrollo del proyecto de investigación ya sea positivos o negativos. Se recomienda establecer las acciones pertinentes para mitigar los impactos negativos ambientales identificados y anexar el respectivo permiso ambiental cuando aplique. Tener en cuenta si aplica el decreto 1376 de 2013." />
                        {/if}
                        <Textarea label="Propuesta de sostenibilidad" maxlength="40000" id="propuesta_sostenibilidad" error={errors.propuesta_sostenibilidad} bind:value={$form.propuesta_sostenibilidad} required />
                    </div>
                {:else if proyecto.codigo_linea_programatica == 70}
                    <div class="mt-8">
                        <Textarea label="Propuesta de sostenibilidad social" maxlength="40000" id="propuesta_sostenibilidad_social" error={errors.propuesta_sostenibilidad_social} bind:value={$form.propuesta_sostenibilidad_social} required />
                    </div>
                    <div class="mt-8">
                        <Textarea label="Propuesta de sostenibilidad ambiental" maxlength="40000" id="propuesta_sostenibilidad_ambiental" error={errors.propuesta_sostenibilidad_ambiental} bind:value={$form.propuesta_sostenibilidad_ambiental} required />
                    </div>
                    <div class="mt-8">
                        <Textarea label="Propuesta de sostenibilidad financiera" maxlength="40000" id="propuesta_sostenibilidad_financiera" error={errors.propuesta_sostenibilidad_financiera} bind:value={$form.propuesta_sostenibilidad_financiera} required />
                    </div>
                {/if}
            </fieldset>
            <div class="shadow-inner bg-app-200 border-app-400 flex items-center justify-between mt-14 px-8 py-4">
                <small class="flex items-center text-app-700">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {proyecto.updated_at}
                </small>
                {#if proyecto.allowed.to_update}
                    <LoadingButton loading={$form.processing} class="ml-auto" type="submit">Guardar propuesta de sostenibilidad</LoadingButton>
                {:else}
                    <span class="inline-block ml-1.5"> El proyecto no se puede modificar </span>
                {/if}
            </div>
        </form>

        <hr class="mb-20 mt-20" />

        <h1 class="text-3xl m-24 text-center">Cadena de valor</h1>

        <p class="text-center my-10">Para que pueda moverse fácilmente haga un clic sostenido sobre el gráfico de la cadena de valor y arrastre hacia cualquier dirección</p>

        {#if productos.length == 0}
            <InfoMessage
                message="No ha generado productos por lo tanto tiene la cadena de valor incompleta.<br />Por favor realice los siguientes pasos:<div>1. Diríjase a <strong>Productos</strong> y genere los productos correspondientes</div><div>2. Luego diríjase a <strong>Actividades</strong> y asocie los productos y rubros correspondientes. De esta manera completa la cadena de valor.</div>"
            />
        {/if}
        <div class="mt-10">
            <div id="orgchart_div" class="overflow-hidden" style="margin: 0 -100px;" />
        </div>
    {:else}
        <div id="orgchart_div" style="width: 100%;" />
    {/if}
</AuthenticatedLayout>

{#if to_pdf}
    <style>
        main {
            margin: 0 !important;
            padding: 0 !important;
            width: 100%;
            height: 100vh;
        }
        nav,
        button.absolute.bottom-1\.5,
        .bg-gray-200.p-4.rounded.border-orangered.border.mb-5 {
            display: none !important;
        }
        .min-h-screen.bg-gray-100 {
            background: white !important;
        }
        div#orgchart_div {
            overflow: unset;
        }
        .bg-gray-200.p-4.rounded.border-orangered.border.mb-5 {
            display: none;
        }
    </style>
{/if}

<style>
    :global(#orgchart_div table) {
        border-collapse: unset;
    }

    :global(#orgchart_div table td.google-visualization-orgchart-node-small > div) {
        margin: auto;
        width: 150px;
    }

    div#orgchart_div:hover {
        cursor: grab;
    }

    div#orgchart_div:active {
        cursor: grabbing;
    }
</style>
