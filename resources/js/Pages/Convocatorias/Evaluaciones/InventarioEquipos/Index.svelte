<script>
    import AuthenticatedLayout, { title } from '@/Layouts/Authenticated'
    import { inertia, page, useForm } from '@inertiajs/inertia-svelte'
    import { route, checkRole, checkPermission } from '@/Utils'
    import { _ } from 'svelte-i18n'
    import { Inertia } from '@inertiajs/inertia'

    import InfoMessage from '@/Shared/InfoMessage'
    import Switch from '@/Shared/Switch'
    import Textarea from '@/Shared/Textarea'
    import Pagination from '@/Shared/Pagination'
    import DataTable from '@/Shared/DataTable'
    import DataTableMenu from '@/Shared/DataTableMenu'
    import { Item, Text } from '@smui/list'
    import EvaluationStepper from '@/Shared/EvaluationStepper'
    import LoadingButton from '@/Shared/LoadingButton'

    export let errors
    export let convocatoria
    export let proyecto
    export let evaluacion
    export let inventarioEquipos

    $title = 'Inventario de equipos'

    /**
     * Validar si el usuario autenticado es SuperAdmin
     */
    let authUser = $page.props.auth.user
    let isSuperAdmin = checkRole(authUser, [1])

    let formServicioTecnologicoEvaluacion = useForm({
        inventario_equipos_comentario: evaluacion.servicio_tecnologico_evaluacion?.inventario_equipos_comentario,
        inventario_equipos_requiere_comentario: evaluacion.servicio_tecnologico_evaluacion?.inventario_equipos_comentario == null ? true : false,
    })
    function submitServicioTecnologicoEvaluacion() {
        if (isSuperAdmin || (checkRole(authUser, [11, 5]) && evaluacion.finalizado == false && evaluacion.habilitado == true && evaluacion.modificable == true)) {
            $formServicioTecnologicoEvaluacion.put(route('convocatorias.evaluaciones.inventario-equipos.guardar-evaluacion', [convocatoria.id, evaluacion.id]), {
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
        <div slot="title">Inventario de equipos</div>
        <div slot="caption">
            <a class="bg-app-600 text-white p-2 rounded shadow" target="_blank" href={route('reportes.inventario-equipos', [proyecto.id])}>Descargar Excel</a>
        </div>

        <thead slot="thead">
            <tr class="text-left font-bold">
                <th class="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full">Nombre</th>
                <th class="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full">Fecha de adquisición</th>
                <th class="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl text-center th-actions">Acciones</th>
            </tr>
        </thead>

        <tbody slot="tbody">
            {#each inventarioEquipos.data as inventarioEquipo (inventarioEquipo.id)}
                <tr class="hover:bg-gray-100 focus-within:bg-gray-100">
                    <td class="border-t">
                        <p class="focus:text-app-500 my-2 paragraph-ellipsis px-6">
                            {inventarioEquipo.nombre}
                        </p>
                    </td>

                    <td class="border-t">
                        <p class="focus:text-app-500 my-2 paragraph-ellipsis px-6">
                            {inventarioEquipo.fecha_adquisicion}
                        </p>
                    </td>

                    <td class="border-t td-actions">
                        <DataTableMenu class={inventarioEquipos.data.length < 3 ? 'z-50' : ''}>
                            {#if isSuperAdmin || checkRole(authUser, [11, 5])}
                                <Item on:SMUI:action={() => Inertia.visit(route('convocatorias.evaluaciones.inventario-equipos.edit', [convocatoria.id, evaluacion.id, inventarioEquipo.id]))}>
                                    <Text>Ver detalles</Text>
                                </Item>
                            {/if}
                        </DataTableMenu>
                    </td>
                </tr>
            {/each}

            {#if inventarioEquipos.data.length === 0}
                <tr>
                    <td class="border-t px-6 py-4" colspan="4">Sin información registrada</td>
                </tr>
            {/if}
        </tbody>
    </DataTable>
    <Pagination links={inventarioEquipos.links} />

    <h1 class="text-3xl mt-24 mb-8 text-center" id="evaluacion">Evaluación</h1>

    <div class="mt-16">
        <form on:submit|preventDefault={submitServicioTecnologicoEvaluacion}>
            <InfoMessage>
                <div class="mt-4">
                    <p>¿El inventario de equipos es correcto? Por favor seleccione si Cumple o No cumple.</p>
                    <Switch onMessage="Cumple" offMessage="No cumple" disabled={isSuperAdmin ? undefined : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : undefined} bind:checked={$formServicioTecnologicoEvaluacion.inventario_equipos_requiere_comentario} />
                    {#if $formServicioTecnologicoEvaluacion.inventario_equipos_requiere_comentario == false}
                        <Textarea
                            disabled={isSuperAdmin ? undefined : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : undefined}
                            label="Comentario"
                            class="mt-4"
                            maxlength="40000"
                            id="inventario_equipos_comentario"
                            bind:value={$formServicioTecnologicoEvaluacion.inventario_equipos_comentario}
                            error={errors.inventario_equipos_comentario}
                            required
                        />
                    {/if}
                </div>
            </InfoMessage>
            <div class="shadow-inner bg-app-200 border-app-400 bottom-0 flex items-center justify-between mt-14 px-8 py-4 sticky">
                {#if isSuperAdmin || (checkRole(authUser, [11, 5]) && evaluacion.finalizado == false && evaluacion.habilitado == true && evaluacion.modificable == true)}
                    <LoadingButton loading={$formServicioTecnologicoEvaluacion.processing} class="ml-auto" type="submit">Guardar</LoadingButton>
                {/if}
            </div>
        </form>
    </div>
</AuthenticatedLayout>
