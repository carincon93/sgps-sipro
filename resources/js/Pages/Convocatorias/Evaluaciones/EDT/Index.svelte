<script>
    import AuthenticatedLayout, { title } from '@/Layouts/Authenticated'
    import { page, useForm } from '@inertiajs/inertia-svelte'
    import { route, checkRole, checkPermission } from '@/Utils'
    import { _ } from 'svelte-i18n'
    import { Inertia } from '@inertiajs/inertia'

    import Switch from '@/Shared/Switch'
    import Pagination from '@/Shared/Pagination'
    import DataTable from '@/Shared/DataTable'
    import DataTableMenu from '@/Shared/DataTableMenu'
    import { Item, Text } from '@smui/list'
    import EvaluationStepper from '@/Shared/EvaluationStepper'
    import InfoMessage from '@/Shared/InfoMessage'
    import Textarea from '@/Shared/Textarea'
    import LoadingButton from '@/Shared/LoadingButton'

    export let errors
    export let convocatoria
    export let evaluacion
    export let proyecto
    export let eventos
    export let otrasEvaluaciones

    $title = 'EDT'

    /**
     * Validar si el usuario autenticado es SuperAdmin
     */
    let authUser = $page.props.auth.user
    let isSuperAdmin = checkRole(authUser, [1])

    let formTaEvaluacion = useForm({
        edt_comentario: evaluacion.ta_evaluacion.edt_comentario ? evaluacion.ta_evaluacion.edt_comentario : '',
        edt_requiere_comentario: evaluacion.ta_evaluacion.edt_comentario == null ? true : false,
    })
    function submitTaEvaluacion() {
        if (isSuperAdmin || (checkRole(authUser, [11, 5]) && evaluacion.finalizado == false && evaluacion.habilitado == true && evaluacion.modificable == true)) {
            $formTaEvaluacion.put(route('convocatorias.evaluaciones.edt.guardar-evaluacion', [convocatoria.id, evaluacion.id]), {
                preserveScroll: true,
            })
        }
    }
</script>

<AuthenticatedLayout>
    <header class="pt-[8rem]" slot="header">
        <EvaluationStepper {convocatoria} {evaluacion} {proyecto} />
    </header>
    <a class="bg-orangered-900 bottom-0 fixed flex hover:bg-orangered-600 mb-5 ml-10 px-6 py-2 rounded-3xl shadow-2xl text-center text-white z-50" href="#evaluacion">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
        Ir a la evaluación
    </a>

    <DataTable class="mt-20" routeParams={[convocatoria.id, evaluacion.id]}>
        <div slot="title">EDT</div>

        <div slot="caption">
            {#if proyecto.servicios_organizacion == false}
                <InfoMessage message="Para poder agregar un EDT debe generar primero el uso presupuestal <strong>Servicios personales indirectos (persona jurídica)</strong> >  <strong>Servicios de organización y asistencia de convenciones y ferias</strong>." />
            {:else}
                <p class="mb-20 text-center">A continuación, proyecte los EDTs que se realizarán durante la vigencia del proyecto:</p>
            {/if}
        </div>

        <thead slot="thead">
            <tr class="text-left font-bold">
                <th class="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full">Descripción del evento</th>
                <th class="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full">Número de asistentes</th>
                <th class="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full">Presupuesto</th>
                <th class="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl text-center th-actions">Acciones</th>
            </tr>
        </thead>

        <tbody slot="tbody">
            {#each eventos.data as evento (evento.id)}
                <tr class="hover:bg-gray-100 focus-within:bg-gray-100">
                    <td class="border-t">
                        <p class="focus:text-app-500 my-2 paragraph-ellipsis px-6">
                            {evento.descripcion_evento}
                        </p>
                    </td>

                    <td class="border-t">
                        <p class="focus:text-app-500 my-2 paragraph-ellipsis px-6">
                            {evento.numero_asistentes}
                        </p>
                    </td>

                    <td class="border-t">
                        <p class="focus:text-app-500 my-2 paragraph-ellipsis px-6">
                            ${new Intl.NumberFormat('de-DE').format(!isNaN(evento.proyecto_presupuesto.valor_total) ? evento.proyecto_presupuesto.valor_total : 0)}
                        </p>
                    </td>

                    <td class="border-t td-actions">
                        <DataTableMenu class={eventos.data.length < 3 ? 'z-50' : ''}>
                            {#if isSuperAdmin || checkPermission(authUser, [6, 7, 15])}
                                <Item on:SMUI:action={() => Inertia.visit(route('convocatorias.evaluaciones.edt.edit', [convocatoria.id, evaluacion.id, evento.id]))}>
                                    <Text>Ver detalles</Text>
                                </Item>
                            {/if}
                        </DataTableMenu>
                    </td>
                </tr>
            {/each}

            {#if eventos.data.length === 0}
                <tr>
                    <td class="border-t px-6 py-4" colspan="4">Sin información registrada</td>
                </tr>
            {/if}
        </tbody>
    </DataTable>
    <Pagination links={eventos.links} />

    <hr class="mt-10 mb-10" />

    <h1 class="text-3xl mt-24 mb-8 text-center" id="evaluacion">Evaluación</h1>

    <div class="mt-16">
        <form on:submit|preventDefault={submitTaEvaluacion}>
            <InfoMessage>
                <div class="mt-4">
                    {#if checkRole(authUser, [5]) && evaluacion.evaluacion_final}
                        {#each otrasEvaluaciones as evaluacion}
                            <div class="mb-8">
                                <h4>Evaluador(a): <span class="font-black capitalize">{evaluacion.evaluacion.evaluador.nombre}</span></h4>
                                {evaluacion.edt_comentario ? evaluacion.edt_comentario : 'Estado: El evaluador(a) da cumplimiento a los edt'}
                                <br />
                            </div>
                        {/each}
                    {/if}
                    <p>¿Las EDT son correctas? Por favor seleccione si Cumple o No cumple.</p>
                    <Switch onMessage="Cumple" offMessage="No cumple" disabled={isSuperAdmin ? undefined : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : undefined} bind:checked={$formTaEvaluacion.edt_requiere_comentario} />
                    {#if $formTaEvaluacion.edt_requiere_comentario == false}
                        <Textarea disabled={isSuperAdmin ? undefined : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : undefined} label="Comentario" class="mt-4" maxlength="40000" id="edt_comentario" bind:value={$formTaEvaluacion.edt_comentario} error={errors.edt_comentario} required />
                    {/if}
                </div>
            </InfoMessage>
            <div class="shadow-inner bg-app-200 border-app-400 bottom-0 flex items-center justify-between mt-14 px-8 py-4 sticky">
                {#if isSuperAdmin || (checkRole(authUser, [11, 5]) && evaluacion.finalizado == false && evaluacion.habilitado == true && evaluacion.modificable == true)}
                    <LoadingButton loading={$formTaEvaluacion.processing} class="ml-auto" type="submit">Guardar</LoadingButton>
                {/if}
            </div>
        </form>
    </div>
</AuthenticatedLayout>
