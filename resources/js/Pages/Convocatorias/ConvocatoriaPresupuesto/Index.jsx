<script>
    import AuthenticatedLayout, { title } from '@/Layouts/Authenticated'
    import { page } from '@inertiajs/inertia-svelte'
    import { route, checkRole, checkPermission } from '@/Utils'
    import { _ } from 'svelte-i18n'
    import { Inertia } from '@inertiajs/inertia'

    import Pagination from '@/Components/Pagination'
    import DataTable from '@/Components/DataTable'
    import Button from '@/Components/Button'
    import DataTableMenu from '@/Components/DataTableMenu'
    import { Item, Text, Separator } from '@smui/list'
    import Dialog from '@/Components/Dialog'

    export let convocatoria
    export let convocatoriaPresupuesto

    $title = 'Rubros presupuestales SENNOVA asociados a la convocatoria'

    /**
     * Validar si el usuario autenticado es SuperAdmin
     */
    let authUser = $auth.user
    let isSuperAdmin = checkRole(authUser, [1])

    let convocatoriaPresupuestoId
    let dialogEliminar = false
    let allowedToDestroy
    function destroy() {
        if (allowedToDestroy) {
            Inertia.delete(route('convocatorias.convocatoria-presupuesto.destroy', [convocatoria.id, convocatoriaPresupuestoId]), {
                preserveScroll: true,
                onFinish: () => {
                    dialogEliminar = false
                },
            })
        }
    }
</script>

<AuthenticatedLayout>
    <DataTable className="mt-20" routeParams={[convocatoria.id]}>
        <div slot="title">Rubros presupuestales SENNOVA asociados a la convocatoria</div>

        <div slot="actions">
            {#if isSuperAdmin}
                <Button on:click={() => Inertia.visit(route('convocatorias.convocatoria-presupuesto.create', convocatoria.id))} variant="raised">Asociar rubro presupuestal SENNOVA</Button>
            {/if}
        </div>

        <thead slot="thead">
            <tr className="text-left font-bold">
                <th className="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full">Código</th>
                <th className="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full">Segundo grupo presupuestal</th>
                <th className="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full">Tercer grupo presupuestal</th>
                <th className="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full">Uso presupuestal</th>
                <th className="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full">Línea programática</th>
                <th className="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl text-center th-actions">Acciones</th>
            </tr>
        </thead>

        <tbody slot="tbody">
            {#each convocatoriaPresupuesto.data as rubro (rubro.id)}
                <tr className="hover:bg-gray-100 focus-within:bg-gray-100">
                    <td className="border-t">
                        <p className="px-6 py-4 focus:text-app-500">
                            {rubro.presupuesto_sennova.codigo}
                        </p>
                    </td>
                    <td className="border-t">
                        <p className="px-6 py-4 focus:text-app-500">
                            {rubro.presupuesto_sennova.segundo_grupo_presupuestal.nombre}
                        </p>
                    </td>

                    <td className="border-t">
                        <p className="px-6 py-4 focus:text-app-500">
                            {rubro.presupuesto_sennova.tercer_grupo_presupuestal.nombre}
                        </p>
                    </td>

                    <td className="border-t">
                        <p className="px-6 py-4 focus:text-app-500">
                            {rubro.presupuesto_sennova.uso_presupuestal.descripcion}
                        </p>
                    </td>

                    <td className="border-t">
                        <p className="px-6 py-4 focus:text-app-500">
                            {rubro.presupuesto_sennova.linea_programatica.codigo}
                        </p>
                    </td>

                    <td className="border-t td-actions">
                        <DataTableMenu className={convocatoriaPresupuesto.data.length < 3 ? 'z-50' : ''}>
                            <Item on:SMUI:action={() => Inertia.visit(route('convocatorias.convocatoria-presupuesto.edit', [convocatoria.id, rubro.id]))} disabled={!isSuperAdmin} className={!isSuperAdmin ? 'hidden' : ''}>
                                <Text>Ver detalles</Text>
                            </Item>

                            <Separator className={!isSuperAdmin ? 'hidden' : ''} />
                            <Item on:SMUI:action={() => ((convocatoriaPresupuestoId = rubro.id), (dialogEliminar = true), (allowedToDestroy = isSuperAdmin))} disabled={!isSuperAdmin} className={!isSuperAdmin ? 'hidden' : ''}>
                                <Text>Eliminar</Text>
                            </Item>
                        </DataTableMenu>
                    </td>
                </tr>
            {/each}

            {#if convocatoriaPresupuesto.data.length === 0}
                <tr>
                    <td className="border-t px-6 py-4" colspan="6">Sin información registrada</td>
                </tr>
            {/if}
        </tbody>
    </DataTable>
    <Pagination links={convocatoriaPresupuesto.links} />

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
