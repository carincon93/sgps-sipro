<script>
    import AuthenticatedLayout, { title } from '@/Layouts/Authenticated'
    import { page } from '@inertiajs/inertia-svelte'
    import { route, checkRole, checkPermission } from '@/Utils'
    import { _ } from 'svelte-i18n'

    import Dialog from '@/Components/Dialog'
    import Button from '@/Components/Button'
    import Pagination from '@/Components/Pagination'
    import DataTable from '@/Components/DataTable'
    import DataTableMenu from '@/Components/DataTableMenu'
    import { Item, Text, Separator } from '@smui/list'
    import { Inertia } from '@inertiajs/inertia'

    export let lineasTecnicas

    $title = 'Líneas técnicas'

    /**
     * Validar si el usuario autenticado es SuperAdmin
     */
    let authUser = auth.user
    let isSuperAdmin = checkRole(authUser, [1])

    let filters = {}

    let dialogEliminar = false
    let allowedToDestroy = false
    let lineaTecnicaId
    function destroy() {
        if (allowedToDestroy) {
            Inertia.delete(route('lineas-tecnicas.destroy', lineaTecnicaId), {
                preserveScroll: true,
                onFinish: () => {
                    dialogEliminar = false
                },
            })
        }
    }
</script>

<AuthenticatedLayout>
    <DataTable className="mt-20">
        <div slot="title">Líneas técnicas</div>

        <div slot="actions">
            {#if isSuperAdmin || checkRole(authUser, [19])}
                <Button on:click={() => Inertia.visit(route('lineas-tecnicas.create'))} variant="raised">Crear línea técnica</Button>
            {/if}
        </div>

        <thead slot="thead">
            <tr className="text-left font-bold">
                <th className="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full"> Nombre </th>
                <th className="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl text-center th-actions"> Acciones </th>
            </tr>
        </thead>
        <tbody slot="tbody">
            {#each lineasTecnicas.data as lineaTecnica (lineaTecnica.id)}
                <tr className="hover:bg-gray-100 focus-within:bg-gray-100">
                    <td className="border-t">
                        <p className="px-6 py-4 focus:text-app-500">
                            {lineaTecnica.nombre}
                        </p>
                    </td>
                    <td className="border-t td-actions">
                        <DataTableMenu className={lineasTecnicas.data.length < 3 ? 'z-50' : ''}>
                            <Item on:SMUI:action={() => Inertia.visit(route('lineas-tecnicas.edit', lineaTecnica.id))} disabled={!lineaTecnica.allowed.to_view} className={!lineaTecnica.allowed.to_view ? 'hidden' : ''}>
                                <Text>Ver detalles</Text>
                            </Item>

                            <Separator className={!lineaTecnica.allowed.to_destroy ? 'hidden' : ''} />
                            <Item on:SMUI:action={() => ((lineaTecnicaId = lineaTecnica.id), (dialogEliminar = true), (allowedToDestroy = lineaTecnica.allowed.to_destroy))} disabled={!lineaTecnica.allowed.to_destroy} className={!lineaTecnica.allowed.to_destroy ? 'hidden' : ''}>
                                <Text>Eliminar</Text>
                            </Item>
                        </DataTableMenu>
                    </td>
                </tr>
            {/each}

            {#if lineasTecnicas.data.length === 0}
                <tr>
                    <td className="border-t px-6 py-4" colspan="4"> Sin información registrada </td>
                </tr>
            {/if}
        </tbody>
    </DataTable>
    <Pagination links={lineasTecnicas.links} />

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
