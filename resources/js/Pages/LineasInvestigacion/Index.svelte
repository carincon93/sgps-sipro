<script>
    import AuthenticatedLayout, { title } from '@/Layouts/Authenticated'
    import { page, inertia } from '@inertiajs/inertia-svelte'
    import { route, checkRole, checkPermission } from '@/Utils'
    import { _ } from 'svelte-i18n'
    import { Inertia } from '@inertiajs/inertia'

    import Button from '@/Shared/Button'
    import Pagination from '@/Shared/Pagination'
    import DataTable from '@/Shared/DataTable'
    import DataTableMenu from '@/Shared/DataTableMenu'
    import { Item, Text, Separator } from '@smui/list'
    import Dialog from '@/Shared/Dialog'

    export let lineasInvestigacion
    export let grupoInvestigacion
    export let allowedToCreate

    $title = 'Líneas de investigación'

    /**
     * Validar si el usuario autenticado es SuperAdmin
     */
    let authUser = $page.props.auth.user
    let isSuperAdmin = checkRole(authUser, [1])

    let filters = {
        grupoInvestigacion: $page.props.filters.grupoInvestigacion,
    }

    let lineaInvestigacionId
    let dialogEliminar = false
    let allowedToDestroy = false

    function destroy() {
        if (allowedToDestroy) {
            Inertia.delete(route('grupos-investigacion.lineas-investigacion.destroy', [grupoInvestigacion.id, lineaInvestigacionId]), {
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
        <div slot="title">Líneas de investigación - Grupo de investigación: {grupoInvestigacion.nombre}</div>

        <div slot="actions">
            {#if isSuperAdmin || allowedToCreate}
                <Button on:click={() => Inertia.visit(route('grupos-investigacion.lineas-investigacion.create', grupoInvestigacion.id))} variant="raised">Crear línea de investigación</Button>
            {/if}
        </div>

        <thead slot="thead">
            <tr class="text-left font-bold">
                <th class="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full"> Nombre </th>
                <th class="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full"> Grupo de investigación </th>
                <th class="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full"> Centro de formación </th>
                <th class="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl text-center th-actions"> Acciones </th>
            </tr>
        </thead>
        <tbody slot="tbody">
            {#each lineasInvestigacion.data as lineaInvestigacion (lineaInvestigacion.id)}
                <tr class="hover:bg-gray-100 focus-within:bg-gray-100">
                    <td class="border-t">
                        <p class="px-6 py-4 focus:text-app-500">
                            {lineaInvestigacion.nombre}
                        </p>
                    </td>
                    <td class="border-t">
                        <p class="px-6 py-4 focus:text-app-500">
                            {lineaInvestigacion.grupo_investigacion?.nombre}
                        </p>
                    </td>
                    <td class="border-t">
                        <p class="px-6 py-4 focus:text-app-500">
                            {lineaInvestigacion.grupo_investigacion?.centro_formacion?.nombre}
                        </p>
                    </td>
                    <td class="border-t td-actions">
                        <DataTableMenu class={lineasInvestigacion.data.length < 3 ? 'z-50' : ''}>
                            <Item on:SMUI:action={() => Inertia.visit(route('grupos-investigacion.lineas-investigacion.edit', [grupoInvestigacion.id, lineaInvestigacion.id]))}>
                                <Text>Ver detalles</Text>
                            </Item>
                            <Separator class={!lineaInvestigacion.allowed.to_destroy ? 'hidden' : ''} />
                            <Item on:SMUI:action={() => ((lineaInvestigacionId = lineaInvestigacion.id), (dialogEliminar = true), (allowedToDestroy = lineaInvestigacion.allowed.to_destroy))} disabled={!lineaInvestigacion.allowed.to_destroy} class={!lineaInvestigacion.allowed.to_destroy ? 'hidden' : ''}>
                                <Text>Eliminar</Text>
                            </Item>
                        </DataTableMenu>
                    </td>
                </tr>
            {/each}

            {#if lineasInvestigacion.data.length === 0}
                <tr>
                    <td class="border-t px-6 py-4" colspan="4"> Sin información registrada </td>
                </tr>
            {/if}
        </tbody>
    </DataTable>
    <Pagination links={lineasInvestigacion.links} />

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
