<script>
    import AuthenticatedLayout, { title } from '@/Layouts/Authenticated'
    import { page, inertia } from '@inertiajs/inertia-svelte'
    import { route, checkRole, checkPermission } from '@/Utils'
    import { _ } from 'svelte-i18n'
    import { Inertia } from '@inertiajs/inertia'

    import Dialog from '@/Shared/Dialog'
    import Button from '@/Shared/Button'
    import DataTableMenu from '@/Shared/DataTableMenu'
    import { Item, Text, Separator } from '@smui/list'
    import Pagination from '@/Shared/Pagination'

    export let proyectoIdiTecnoacademia
    export let productos

    $title = 'Productos'

    /**
     * Validar si el usuario autenticado es SuperAdmin
     */
    let authUser = $page.props.auth.user
    let isSuperAdmin = checkRole(authUser, [1])

    let dialogEliminar = false
    let allowedToDestroy = false
    let productoId
    function destroy() {
        if (allowedToDestroy) {
            Inertia.delete(route('proyectos-idi-tecnoacademia.productos.destroy', [proyectoIdiTecnoacademia.id, productoId]), {
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
                    <a use:inertia href={route('proyectos-idi-tecnoacademia.index')} class="text-app-400 hover:text-app-600"> Proyectos I+D+i TecnoAcademia </a>
                    <span class="text-app-400 font-medium">/</span>
                    <a use:inertia href={route('proyectos-idi-tecnoacademia.edit', proyectoIdiTecnoacademia.id)} class="text-app-400 hover:text-app-600">Información básica</a>
                    <span class="text-app-400 font-medium">/</span>
                    <a use:inertia href={route('proyectos-idi-tecnoacademia.participantes.index', proyectoIdiTecnoacademia.id)} class="text-app-400 hover:text-app-600">Participantes</a>
                    <span class="text-app-400 font-medium">/</span>
                    <a use:inertia href={route('proyectos-idi-tecnoacademia.productos.index', proyectoIdiTecnoacademia.id)} class="text-app-400 hover:text-app-600 font-extrabold underline"
                        >Productos</a>
                </h1>
            </div>
        </div>
    </header>

    <h1 class="mt-24 mb-8 text-center text-3xl">Productos</h1>

    <div class="mb-6 flex justify-between items-center">
        {#if proyectoIdiTecnoacademia.allowed.to_update}
            <Button on:click={() => Inertia.visit(route('proyectos-idi-tecnoacademia.productos.create', proyectoIdiTecnoacademia.id))} variant="raised">Crear producto</Button>
        {/if}
    </div>

    <div class="bg-white rounded shadow">
        <table class="w-full whitespace-no-wrap table-fixed data-table">
            <thead>
                <tr class="text-left font-bold">
                    <th class="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full">Descripción</th>
                    <th class="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full">Tipo de producto</th>
                    <th class="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl text-center th-actions">Acciones</th>
                </tr>
            </thead>
            <tbody>
                {#each productos.data as producto (producto.id)}
                    <tr class="hover:bg-gray-100 focus-within:bg-gray-100">
                        <td class="border-t">
                            <p class="px-6 py-4">
                                {producto.descripcion}
                            </p>
                        </td>
                        <td class="border-t">
                            <p class="px-6 py-4">
                                {producto.tipo_productos_linea_66.tipo}
                            </p>
                        </td>
                        <td class="border-t td-actions">
                            <DataTableMenu class={productos.data.length < 3 ? 'z-50' : ''}>
                                <Item on:SMUI:action={() => Inertia.visit(route('proyectos-idi-tecnoacademia.productos.edit', [proyectoIdiTecnoacademia.id, producto.id]))}>
                                    <Text>Ver detalles</Text>
                                </Item>

                                <Separator class={!proyectoIdiTecnoacademia.allowed.to_destroy ? 'hidden' : ''} />
                                <Item
                                    on:SMUI:action={() => ((productoId = producto.id), (dialogEliminar = true), (allowedToDestroy = proyectoIdiTecnoacademia.allowed.to_destroy))}
                                    disabled={!proyectoIdiTecnoacademia.allowed.to_destroy}
                                    class={!proyectoIdiTecnoacademia.allowed.to_destroy ? 'hidden' : ''}>
                                    <Text>Eliminar</Text>
                                </Item>
                            </DataTableMenu>
                        </td>
                    </tr>
                {/each}

                {#if productos.data.length === 0}
                    <tr>
                        <td class="border-t px-6 py-4" colspan="4"> Sin información registrada </td>
                    </tr>
                {/if}
            </tbody>
        </table>
    </div>
    <Pagination links={productos.links} />

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
