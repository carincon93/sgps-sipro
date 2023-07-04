<script>
    import AuthenticatedLayout, { title } from '@/Layouts/Authenticated'
    import { page, useForm } from '@inertiajs/inertia-svelte'
    import { route, checkRole, checkPermission } from '@/Utils'
    import { _ } from 'svelte-i18n'
    import { Inertia } from '@inertiajs/inertia'

    import Pagination from '@/Components/Pagination'
    import DataTable from '@/Components/DataTable'
    import DataTableMenu from '@/Components/DataTableMenu'
    import { Item, Text, Separator } from '@smui/list'

    export let proyectos

    $title = 'Proyectos activos'

    /**
     * Validar si el usuario autenticado es SuperAdmin
     */
    let authUser = $auth.user
    let isSuperAdmin = checkRole(authUser, [1])
</script>

<AuthenticatedLayout>
    <DataTable className="mt-20" showFilters={false} showSearchInput={false}>
        <div slot="title">Proyectos activos</div>

        <thead slot="thead">
            <tr className="text-left font-bold">
                <th className="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full"> Código </th>
                <th className="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl text-center th-actions"> Acciones </th>
            </tr>
        </thead>

        <tbody slot="tbody">
            {#each proyectos.data as { id, estado, titulo, codigo, fecha_ejecucion, convocatoria }}
                <tr className="hover:bg-gray-100 focus-within:bg-gray-100">
                    <td className="border-t" style="border-left: 1px solid limegreen">
                        <p className="px-6 py-4 focus:text-app-500">
                            {codigo}
                        </p>
                    </td>

                    <td className="border-t td-actions">
                        <DataTableMenu className={proyectos.data.length < 3 ? 'z-50' : ''}>
                            <Item on:SMUI:action={() => Inertia.visit(route('proyectos.edit', [id]))} disabled={!isSuperAdmin || !checkRole(authUser, [1, 20, 18, 19, 5, 17]) == false ? false : true} className={!isSuperAdmin && checkRole(authUser, [1, 20, 18, 19, 5, 17]) ? 'hidden' : ''}>
                                <Text>Ver detalles</Text>
                            </Item>
                        </DataTableMenu>
                    </td>
                </tr>
            {/each}

            {#if proyectos.data.length === 0}
                <tr>
                    <td className="border-t px-6 py-4" colspan="5"> Sin información registrada </td>
                </tr>
            {/if}
        </tbody>
    </DataTable>
    <Pagination links={proyectos.links} />
</AuthenticatedLayout>
