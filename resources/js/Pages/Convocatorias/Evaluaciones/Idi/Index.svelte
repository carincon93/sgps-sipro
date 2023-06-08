<script>
    import AuthenticatedLayout, { title } from '@/Layouts/Authenticated'
    import { page } from '@inertiajs/inertia-svelte'
    import { route, checkRole } from '@/Utils'
    import { _ } from 'svelte-i18n'
    import { Inertia } from '@inertiajs/inertia'

    import Pagination from '@/Shared/Pagination'
    import DataTableMenu from '@/Shared/DataTableMenu'
    import { Item, Text } from '@smui/list'
    import DataTable from '@/Shared/DataTable'

    export let convocatoria
    export let evaluaciones

    $title = 'Proyectos I+D+i'

    /**
     * Validar si el usuario autenticado es SuperAdmin
     */
    let authUser = $page.props.auth.user
    let isSuperAdmin = checkRole(authUser, [1])
</script>

<AuthenticatedLayout>
    <DataTable class="mt-20" routeParams={[convocatoria.id]}>
        <div slot="title">Evaluaciones de proyectos I+D+i</div>

        <thead slot="thead">
            <tr class="text-left font-bold">
                <th class="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full"> Código </th>
                <th class="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full"> Título </th>
                <th class="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full"> Fecha de ejecución </th>
                <th class="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full"> Estado </th>
                <th class="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl text-center th-actions"> Acciones </th>
            </tr>
        </thead>

        <tbody slot="tbody">
            {#each evaluaciones.data as evaluacion}
                <tr class="hover:bg-gray-100 focus-within:bg-gray-100">
                    <td class="border-t">
                        <p class="px-6 py-4 focus:text-app-500">
                            {evaluacion.proyecto.codigo}

                            {#if !evaluacion.habilitado}
                                <span class="block text-danger">Evaluación deshabilitada. No puede realizar la evaluación.</span>
                            {/if}
                        </p>
                    </td>
                    <td class="border-t">
                        <p class="px-6 py-4 focus:text-app-500">
                            {evaluacion.proyecto.idi.titulo}
                        </p>
                    </td>
                    <td class="border-t">
                        <p class="px-6 py-4">
                            {evaluacion.proyecto.idi.fecha_ejecucion}
                        </p>
                    </td>
                    <td class="border-t">
                        <p class="px-6 py-4">
                            {#if convocatoria.fase == 3}
                                El proyecto se encuentra en subsanación
                            {/if}
                            {evaluacion.finalizado ? 'Evaluación finalizada' : evaluacion.iniciado ? 'Evaluación iniciada' : 'Sin evaluar'}
                        </p>
                    </td>
                    <td class="border-t td-actions">
                        <DataTableMenu class={evaluaciones.data.length < 3 ? 'z-50' : ''}>
                            {#if evaluacion.allowed.to_view}
                                <Item on:SMUI:action={() => Inertia.visit(route('convocatorias.idi-evaluaciones.edit', [convocatoria.id, evaluacion.id]))}>
                                    <Text>
                                        {#if evaluacion.allowed.to_update && !isSuperAdmin}
                                            Evaluar
                                        {:else}
                                            Ver detalles
                                        {/if}
                                    </Text>
                                </Item>
                            {/if}
                        </DataTableMenu>
                    </td>
                </tr>
            {/each}

            {#if evaluaciones.data.length === 0}
                <tr>
                    <td class="border-t px-6 py-4" colspan="5"> Sin información registrada </td>
                </tr>
            {/if}
        </tbody>
    </DataTable>
    <Pagination links={evaluaciones.links} />
</AuthenticatedLayout>
