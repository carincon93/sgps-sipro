<script>
    import AuthenticatedLayout, { title } from '@/Layouts/Authenticated'
    import { page } from '@inertiajs/inertia-svelte'
    import { route, checkRole, checkPermission } from '@/Utils'
    import { _ } from 'svelte-i18n'
    import { Inertia } from '@inertiajs/inertia'

    import Dialog from '@/Shared/Dialog'
    import Button from '@/Shared/Button'
    import Pagination from '@/Shared/Pagination'
    import DataTable from '@/Shared/DataTable'
    import DataTableMenu from '@/Shared/DataTableMenu'
    import { Item, Text, Separator } from '@smui/list'

    export let presupuestoSennova

    $title = 'Presupuesto SENNOVA'

    /**
     * Validar si el usuario autenticado es SuperAdmin
     */
    let authUser = $page.props.auth.user
    let isSuperAdmin = checkRole(authUser, [1])

    let filters = {}

    let dialogEliminar = false
    let allowedToDestroy = false
    let presupuestoSennovaId
    function destroy() {
        if (allowedToDestroy) {
            Inertia.delete(route('presupuesto-sennova.destroy', presupuestoSennovaId), {
                preserveScroll: true,
                onFinish: () => {
                    dialogEliminar = false
                },
            })
        }
    }
</script>

<AuthenticatedLayout>
    <DataTable class="mt-20">
        <div slot="title">Presupuesto SENNOVA</div>

        <div slot="actions">
            {#if isSuperAdmin}
                <Button on:click={() => Inertia.visit(route('presupuesto-sennova.create'))} variant="raised">Crear rubro presupuestal SENNOVA</Button>
            {/if}
        </div>

        <thead slot="thead">
            <tr class="text-left font-bold">
                <th class="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full"> Código </th>
                <th class="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full"> Segundo grupo presupuestal </th>
                <th class="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full"> Tercer grupo presupuestal </th>
                <th class="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full"> Uso presupuestal </th>
                <th class="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full"> Línea programática </th>
                <th class="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl text-center th-actions"> Acciones </th>
            </tr>
        </thead>
        <tbody slot="tbody">
            {#each presupuestoSennova.data as rubroPresupuestal (rubroPresupuestal.id)}
                <tr class="hover:bg-gray-100 focus-within:bg-gray-100">
                    <td class="border-t">
                        <p class="px-6 py-4 focus:text-app-500">
                            {rubroPresupuestal.codigo}
                        </p>
                    </td>
                    <td class="border-t">
                        <p class="px-6 py-4 focus:text-app-500">
                            {rubroPresupuestal.segundo_grupo_presupuestal.nombre}
                        </p>
                    </td>

                    <td class="border-t">
                        <p class="px-6 py-4 focus:text-app-500">
                            {rubroPresupuestal.tercer_grupo_presupuestal.nombre}
                        </p>
                    </td>

                    <td class="border-t">
                        <p class="px-6 py-4 focus:text-app-500">
                            {rubroPresupuestal.uso_presupuestal.descripcion}
                        </p>
                    </td>

                    <td class="border-t">
                        <p class="px-6 py-4 focus:text-app-500">
                            {rubroPresupuestal.linea_programatica.codigo}
                        </p>
                    </td>

                    <td class="border-t td-actions">
                        <DataTableMenu class={presupuestoSennova.data.length < 3 ? 'z-50' : ''}>
                            <Item on:SMUI:action={() => Inertia.visit(route('presupuesto-sennova.edit', rubroPresupuestal.id))} disabled={!isSuperAdmin} class={!isSuperAdmin ? 'hidden' : ''}>
                                <Text>Ver detalles</Text>
                            </Item>

                            <Separator class={!isSuperAdmin ? 'hidden' : ''} />
                            <Item on:SMUI:action={() => ((presupuestoSennovaId = rubroPresupuestal.id), (dialogEliminar = true), (allowedToDestroy = isSuperAdmin))} disabled={!isSuperAdmin} class={!isSuperAdmin ? 'hidden' : ''}>
                                <Text>Eliminar</Text>
                            </Item>
                        </DataTableMenu>
                    </td>
                </tr>
            {/each}

            {#if presupuestoSennova.data.length === 0}
                <tr>
                    <td class="border-t px-6 py-4" colspan="6"> Sin información registrada </td>
                </tr>
            {/if}
        </tbody>
    </DataTable>
    <Pagination links={presupuestoSennova.links} />

    <Dialog bind:open={dialogEliminar}>
        <div slot="title">
            <div class="text-center">Eliminar recurso</div>
            <div class="relative bg-app-100 text-app-600 p-5 h-44 w-1/3 m-auto my-10" style="border-radius: 41% 59% 70% 30% / 32% 40% 60% 68% ;">
                <figure>
                    <img src="/images/eliminar.png" alt="" class="h-44 m-auto" />
                </figure>
            </div>
            <div class="text-center">
                ¿Está seguro (a) que desea eliminar este elemento?<br />Una vez eliminado todos sus recursos y datos se eliminarán de forma permanente.
            </div>
        </div>
        <div slot="content" />
        <div slot="actions">
            <div class="p-4">
                <Button on:click={() => (dialogEliminar = false)} variant={null}>Cancelar</Button>
                <Button variant="raised" type="button" on:click={() => destroy()}>Confirmar</Button>
            </div>
        </div>
    </Dialog>
</AuthenticatedLayout>
