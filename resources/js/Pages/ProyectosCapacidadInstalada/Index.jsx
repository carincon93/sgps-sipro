<script>
    import AuthenticatedLayout, { title } from '@/Layouts/Authenticated'
    import { page } from '@inertiajs/inertia-svelte'
    import { route, checkRole, checkPermission } from '@/Utils'
    import { _ } from 'svelte-i18n'
    import { Inertia } from '@inertiajs/inertia'

    import Pagination from '@/Components/Pagination'
    import DataTable from '@/Components/DataTable'
    import DataTableMenu from '@/Components/DataTableMenu'
    import Button from '@/Components/Button'
    import Dialog from '@/Components/Dialog'
    import { Item, Text, Separator } from '@smui/list'

    export let proyectosCapacidadInstalada
    export let allowedToCreate

    $title = 'Proyectos de capacidad instalada'

    /**
     * Validar si el usuario autenticado es SuperAdmin
     */
    let authUser = auth.user
    let isSuperAdmin = checkRole(authUser, [1])

    let dialogEliminar = false
    let proyectoCapacidadInstaladaId = null
    let allowedToDestroy = false
    function destroy() {
        if (allowedToDestroy) {
            Inertia.delete(route('proyectos-capacidad-instalada.destroy', [proyectoCapacidadInstaladaId]), {
                preserveScroll: true,
                onFinish: () => {
                    dialogEliminar = false
                },
            })
        }
    }
</script>

<AuthenticatedLayout>
    <DataTable className="mt-20" showFilters={false}>
        <div slot="title">Proyectos de capacidad instalada</div>

        <div slot="actions">
            {#if allowedToCreate}
                <Button on:click={() => Inertia.visit(route('proyectos-capacidad-instalada.create'))} variant="raised">Crear proyecto de capacidad instalada</Button>
            {/if}
        </div>

        <thead slot="thead">
            <tr className="text-left font-bold">
                <th className="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full"> Código </th>
                <th className="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full"> Título </th>
                <th className="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full"> Estado </th>
                <th className="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full"> Fecha de ejecución </th>
                <th className="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl text-center th-actions"> Acciones </th>
            </tr>
        </thead>

        <tbody slot="tbody">
            {#each proyectosCapacidadInstalada.data as { id, titulo, codigo, estado_proyecto, fecha_ejecucion, allowed }}
                <tr className="hover:bg-gray-100 focus-within:bg-gray-100">
                    <td className="border-t">
                        <p className="px-6 py-4">{codigo}</p>
                    </td>
                    <td className="border-t">
                        <p className="px-6 py-4">{titulo}</p>
                    </td>
                    <td className="border-t">
                        <p className="px-6 py-4">
                            {#if estado_proyecto == null}
                                Sin estado asignado
                            {:else}
                                {estado_proyecto}
                            {/if}
                        </p>
                    </td>
                    <td className="border-t">
                        <p className="px-6 py-4">{fecha_ejecucion}</p>
                    </td>

                    <td className="border-t td-actions">
                        <DataTableMenu className={proyectosCapacidadInstalada.data.length < 3 ? 'z-50' : ''}>
                            <Item on:SMUI:action={() => Inertia.visit(route('proyectos-capacidad-instalada.edit', [id]))} disabled={!allowed.to_view} className={!allowed.to_view ? 'hidden' : ''}>
                                <Text>Ver detalles</Text>
                            </Item>

                            <Separator className={!allowed.to_destroy ? 'hidden' : ''} />
                            <Item on:SMUI:action={() => ((proyectoCapacidadInstaladaId = id), (dialogEliminar = true), (allowedToDestroy = allowed.to_destroy))} disabled={!allowed.to_destroy} className={!allowed.to_destroy ? 'hidden' : ''}>
                                <Text>Eliminar</Text>
                            </Item>
                        </DataTableMenu>
                    </td>
                </tr>
            {/each}

            {#if proyectosCapacidadInstalada.data.length === 0}
                <tr>
                    <td className="border-t px-6 py-4" colspan="5"> Sin información registrada </td>
                </tr>
            {/if}
        </tbody>
    </DataTable>
    <Pagination links={proyectosCapacidadInstalada.links} />

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
