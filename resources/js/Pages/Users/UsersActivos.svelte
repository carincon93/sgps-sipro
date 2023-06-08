<script>
    import AuthenticatedLayout, { title } from '@/Layouts/Authenticated'
    import { page } from '@inertiajs/inertia-svelte'
    import { route, checkRole, checkPermission } from '@/Utils'
    import { _ } from 'svelte-i18n'
    import { Inertia } from '@inertiajs/inertia'

    import Pagination from '@/Shared/Pagination'
    import DataTable from '@/Shared/DataTable'
    import DataTableMenu from '@/Shared/DataTableMenu'
    import { Item, Text, Separator } from '@smui/list'

    export let usuarios

    $title = 'Usuarios activos'

    /**
     * Validar si el usuario autenticado es SuperAdmin
     */
    let authUser = $page.props.auth.user
    let isSuperAdmin = checkRole(authUser, [1])
</script>

<AuthenticatedLayout>
    <DataTable class="mt-20" showSearchInput={false}>
        <div slot="title">Usuarios activos</div>

        <thead slot="thead">
            <tr class="text-left font-bold">
                <th class="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full">Nombre</th>
                <th class="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full">Correo electrónico</th>
                <th class="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full">Centro de formación</th>
                <th class="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full">Última actividad (Fecha)</th>
                <th class="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl text-center th-actions">Acciones</th>
            </tr>
        </thead>
        <tbody slot="tbody">
            {#each usuarios.data as usuario (usuario.id)}
                <tr class="hover:bg-gray-100 focus-within:bg-gray-100">
                    <td class="border-t" style="border-left: 1px solid limegreen">
                        <p class="px-6 py-4 focus:text-app-500">
                            {usuario.nombre}
                        </p>
                    </td>
                    <td class="border-t">
                        <p class="px-6 py-4">
                            {usuario.email}
                        </p>
                    </td>
                    <td class="border-t">
                        <p class="px-6 py-4">
                            {usuario.centro_formacion?.nombre}
                        </p>
                    </td>
                    <td class="border-t">
                        <p class="px-6 py-4">{new Date(usuario.last_activity * 1000).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' })}</p>
                    </td>
                    <td class="border-t td-actions">
                        <DataTableMenu class={usuarios.data.length < 3 ? 'z-50' : ''}>
                            <Item on:SMUI:action={() => Inertia.visit(route('users.edit', usuario.user_id))}>
                                <Text>Ver detalles</Text>
                            </Item>
                        </DataTableMenu>
                    </td>
                </tr>
            {/each}

            {#if usuarios.data.length === 0}
                <tr>
                    <td class="border-t px-6 py-4" colspan="5">Sin información registrada</td>
                </tr>
            {/if}
        </tbody>
    </DataTable>
    <Pagination links={usuarios.links} />
</AuthenticatedLayout>
