<script>
    import AuthenticatedLayout, { title } from '@/Layouts/Authenticated'
    import { page, useForm } from '@inertiajs/inertia-svelte'
    import { route, checkRole, checkPermission } from '@/Utils'
    import { _ } from 'svelte-i18n'
    import { Inertia } from '@inertiajs/inertia'

    import Pagination from '@/Shared/Pagination'
    import DataTable from '@/Shared/DataTable'
    import DataTableMenu from '@/Shared/DataTableMenu'
    import { Item, Text, Separator } from '@smui/list'

    export let proyectos

    $title = 'Proyectos activos'

    /**
     * Validar si el usuario autenticado es SuperAdmin
     */
    let authUser = $page.props.auth.user
    let isSuperAdmin = checkRole(authUser, [1])
</script>

<AuthenticatedLayout>
    <DataTable class="mt-20" showFilters={false} showSearchInput={false}>
        <div slot="title">Proyectos activos</div>

        <thead slot="thead">
            <tr class="text-left font-bold">
                <th class="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full"> Código </th>
                <th class="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl text-center th-actions"> Acciones </th>
            </tr>
        </thead>

        <tbody slot="tbody">
            {#each proyectos.data as { id, estado, titulo, codigo, fecha_ejecucion, convocatoria }}
                <tr class="hover:bg-gray-100 focus-within:bg-gray-100">
                    <td class="border-t" style="border-left: 1px solid limegreen">
                        <p class="px-6 py-4 focus:text-app-500">
                            {codigo}
                        </p>
                    </td>

                    <td class="border-t td-actions">
                        <DataTableMenu class={proyectos.data.length < 3 ? 'z-50' : ''}>
                            <Item on:SMUI:action={() => Inertia.visit(route('proyectos.edit', [id]))} disabled={!isSuperAdmin || !checkRole(authUser, [1, 20, 18, 19, 5, 17]) == false ? false : true} class={!isSuperAdmin && checkRole(authUser, [1, 20, 18, 19, 5, 17]) ? 'hidden' : ''}>
                                <Text>Ver detalles</Text>
                            </Item>
                        </DataTableMenu>
                    </td>
                </tr>
            {/each}

            {#if proyectos.data.length === 0}
                <tr>
                    <td class="border-t px-6 py-4" colspan="5"> Sin información registrada </td>
                </tr>
            {/if}
        </tbody>
    </DataTable>
    <Pagination links={proyectos.links} />
</AuthenticatedLayout>
