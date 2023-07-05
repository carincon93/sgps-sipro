<script>
    import AuthenticatedLayout, { title } from '@/Layouts/Authenticated'
    import { page } from '@inertiajs/inertia-svelte'
    import { route, checkRole, checkPermission } from '@/Utils'
    import { _ } from 'svelte-i18n'
    import { Inertia } from '@inertiajs/inertia'

    import Button from '@/Components/Button'
    import Pagination from '@/Components/Pagination'
    import Dialog from '@/Components/Dialog'
    import DataTable from '@/Components/DataTable'
    import DataTableMenu from '@/Components/DataTableMenu'
    import { Item, Text, Separator } from '@smui/list'

    export let usuarios
    export let roles
    export let allowedToCreate

    $title = 'Usuarios'

    /**
     * Validar si el usuario autenticado es SuperAdmin
     */
    let authUser = auth.user
    let isSuperAdmin = checkRole(authUser, [1])

    let filters = {
        roles: $page.props.filters.roles,
    }

    let dialogEliminar = false
    let allowedToDestroy = false
    let usuarioId
    function destroy() {
        if (allowedToDestroy && usuarioId) {
            Inertia.delete(route('users.destroy', usuarioId), {
                preserveScroll: true,
                onFinish: () => {
                    dialogEliminar = false
                },
            })
        }
    }
</script>

<AuthenticatedLayout>
    <DataTable className="mt-20" bind:filters showFilters={true}>
        <div slot="title">Usuarios</div>

        <div slot="filters">
            <label for="roles" className="block text-gray-700">Roles:</label>
            <select id="roles" className="mt-1 w-full form-select" bind:value={filters.roles}>
                <option value={null}>Seleccione un rol</option>
                {#each roles as role}
                    <option value={role.name}>{role.name}</option>
                {/each}
            </select>
        </div>
        <div slot="actions">
            {#if allowedToCreate}
                <Button on:click={() => Inertia.visit(route('users.online'))} variant="raised" className="ml-1">Usuarios en línea</Button>
                <Button on:click={() => Inertia.visit(route('users.create'))} variant="raised">Crear usuario</Button>
            {/if}
        </div>

        <thead slot="thead">
            <tr className="text-left font-bold">
                <th className="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full">Nombre</th>
                <th className="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full">Correo electrónico</th>
                <th className="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full">Centro de formación</th>
                <th className="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full">Rol</th>
                <th className="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl text-center th-actions">Acciones</th>
            </tr>
        </thead>
        <tbody slot="tbody">
            {#each usuarios.data as usuario (usuario.id)}
                <tr className="hover:bg-gray-100 focus-within:bg-gray-100">
                    <td className="border-t">
                        <p className="px-6 py-4 focus:text-app-500">
                            {usuario.nombre}
                        </p>
                    </td>
                    <td className="border-t">
                        <p className="px-6 py-4">
                            {usuario.email}
                        </p>
                    </td>
                    <td className="border-t">
                        <p className="px-6 py-4">
                            {usuario.centro_formacion?.nombre}
                        </p>
                    </td>
                    <td className="border-t">
                        <ul className="px-6 py-4 list-disc">
                            {#each usuario.roles as role}
                                <li>{role.name}</li>
                            {/each}
                        </ul>
                    </td>
                    <td className="border-t td-actions">
                        <DataTableMenu className={usuarios.data.length < 3 ? 'z-50' : ''}>
                            <Item on:SMUI:action={() => Inertia.visit(route('users.edit', usuario.id))} disabled={!usuario.allowed.to_view || !usuario.allowed.to_update} className={!usuario.allowed.to_view || !usuario.allowed.to_update ? 'hidden' : ''}>
                                <Text>Ver detalles</Text>
                            </Item>

                            <Separator className={!usuario.allowed.to_destroy ? 'hidden' : ''} />
                            <Item on:SMUI:action={() => ((usuarioId = usuario.id), (dialogEliminar = true), (allowedToDestroy = usuario.allowed.to_destroy))} disabled={!usuario.allowed.to_destroy} className={!usuario.allowed.to_destroy ? 'hidden' : ''}>
                                <Text>Eliminar</Text>
                            </Item>
                        </DataTableMenu>
                    </td>
                </tr>
            {/each}

            {#if usuarios.data.length === 0}
                <tr>
                    <td className="border-t px-6 py-4" colspan="5">Sin información registrada</td>
                </tr>
            {/if}
        </tbody>
    </DataTable>
    <Pagination links={usuarios.links} />

    <Dialog bind:open={dialogEliminar}>
        <div slot="title">
            <div className="text-center">Eliminar recurso</div>
            <div className="relative bg-app-100 text-app-600 p-5 h-44 w-1/3 m-auto my-10" style="border-radius: 41% 59% 70% 30% / 32% 40% 60% 68% ;">
                <figure>
                    <img src="/images/eliminar.png" alt="" className="h-44 m-auto" />
                </figure>
            </div>
            <div className="text-center">
                ¿Está seguro (a) que desea eliminar este elemento?<br />Una vez eliminado todos sus recursos y datos se eliminarán de forma permanente.
            </div>
        </div>
        <div slot="content" />
        <div slot="actions">
            <div className="p-4">
                <Button on:click={() => (dialogEliminar = false)} variant={null}>Cancelar</Button>
                <Button variant="raised" type="button" on:click={() => destroy()}>Confirmar</Button>
            </div>
        </div>
    </Dialog>
</AuthenticatedLayout>
