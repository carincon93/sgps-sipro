<script>
    import AuthenticatedLayout, { title } from '@/Layouts/Authenticated'
    import { page, inertia } from '@inertiajs/inertia-svelte'
    import { route, checkRole, checkPermission } from '@/Utils'
    import { _ } from 'svelte-i18n'
    import { Inertia } from '@inertiajs/inertia'

    import Button from '@/Shared/Button'
    import Pagination from '@/Shared/Pagination'
    import Dialog from '@/Shared/Dialog'
    import DataTable from '@/Shared/DataTable'
    import DataTableMenu from '@/Shared/DataTableMenu'
    import { Item, Text, Separator } from '@smui/list'

    export let semillerosInvestigacion
    export let grupoInvestigacion
    export let allowedToCreate

    $title = 'Semilleros de investigación'

    /**
     * Validar si el usuario autenticado es SuperAdmin
     */
    let authUser = $page.props.auth.user
    let isSuperAdmin = checkRole(authUser, [1])

    let filters = {}

    let semilleroInvestigacionId
    let dialogEliminar = false
    let allowedToDestroy = false

    function destroy() {
        if (allowedToDestroy) {
            Inertia.delete(route('grupos-investigacion.semilleros-investigacion.destroy', [grupoInvestigacion.id, semilleroInvestigacionId]), {
                preserveScroll: true,
                onFinish: () => {
                    dialogEliminar = false
                },
            })
        }
    }
</script>

<AuthenticatedLayout>
    <header class="pt-[8rem]" slot="header">
        <div class="flex items-center justify-between lg:px-8 max-w-7xl mx-auto px-4 py-6 sm:px-6">
            <div>
                <h1>
                    <a use:inertia href={route('grupos-investigacion.index')} class="text-app-400 hover:text-app-600"> Grupos de investigación </a>
                    <span class="text-app-400 font-medium">/</span>
                    <a use:inertia href={route('grupos-investigacion.edit', grupoInvestigacion.id)} class="text-app-400 hover:text-app-600"> {grupoInvestigacion.nombre} </a>
                </h1>
            </div>
        </div>
    </header>

    <DataTable class="mt-20" routeParams={[grupoInvestigacion.id]}>
        <div slot="title">Semilleros de investigación - Grupo: {grupoInvestigacion.nombre}</div>

        <div slot="actions">
            {#if allowedToCreate}
                <Button on:click={() => Inertia.visit(route('grupos-investigacion.semilleros-investigacion.create', grupoInvestigacion.id))} variant="raised">Crear semillero de investigación</Button>
            {/if}
        </div>

        <thead slot="thead">
            <tr class="text-left font-bold">
                <th class="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full"> Nombre </th>
                <th class="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full"> Línea de investigación principal </th>
                <th class="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full"> Código </th>
                <th class="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl text-center w-1/4"> Acciones </th>
            </tr>
        </thead>
        <tbody slot="tbody">
            {#each semillerosInvestigacion.data as semilleroInvestigacion (semilleroInvestigacion.id)}
                <tr class="hover:bg-gray-100 focus-within:bg-gray-100">
                    <td class="border-t">
                        <p class="px-6 py-4 focus:text-app-500">
                            {semilleroInvestigacion.nombre}
                        </p>
                    </td>
                    <td class="border-t">
                        <p class="px-6 py-4 focus:text-app-500">
                            {semilleroInvestigacion.nombre_linea_principal}
                        </p>
                    </td>
                    <td class="border-t">
                        <p class="px-6 py-4 focus:text-app-500">
                            {semilleroInvestigacion.codigo}
                        </p>
                    </td>
                    <td class="border-t td-actions">
                        <DataTableMenu class={semillerosInvestigacion.data.length < 3 ? 'z-50' : ''}>
                            <Item on:SMUI:action={() => Inertia.visit(route('grupos-investigacion.semilleros-investigacion.edit', [grupoInvestigacion.id, semilleroInvestigacion.id]))} disabled={!semilleroInvestigacion.allowed.to_view} class={!semilleroInvestigacion.allowed.to_view ? 'hidden' : ''}>
                                <Text>Ver detalles</Text>
                            </Item>

                            <Separator class={!semilleroInvestigacion.allowed.to_destroy ? 'hidden' : ''} />
                            <Item on:SMUI:action={() => ((semilleroInvestigacionId = semilleroInvestigacion.id), (dialogEliminar = true), (allowedToDestroy = semilleroInvestigacion.allowed.to_destroy))} disabled={!semilleroInvestigacion.allowed.to_destroy} class={!semilleroInvestigacion.allowed.to_destroy ? 'hidden' : ''}>
                                <Text>Eliminar</Text>
                            </Item>
                        </DataTableMenu>
                    </td>
                </tr>
            {/each}

            {#if semillerosInvestigacion.data.length === 0}
                <tr>
                    <td class="border-t px-6 py-4" colspan="4"> Sin información registrada </td>
                </tr>
            {/if}
        </tbody>
    </DataTable>
    <Pagination links={semillerosInvestigacion.links} />

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
