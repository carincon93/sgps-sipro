<script>
    import AuthenticatedLayout, { title } from '@/Layouts/Authenticated'
    import { page, inertia } from '@inertiajs/inertia-svelte'
    import { route, checkRole, checkPermission } from '@/Utils'
    import { _ } from 'svelte-i18n'
    import { Inertia } from '@inertiajs/inertia'

    import Dialog from '@/Components/Dialog'
    import Button from '@/Components/Button'
    import DataTableMenu from '@/Components/DataTableMenu'
    import { Item, Text, Separator } from '@smui/list'
    import Pagination from '@/Components/Pagination'

    export let proyectoIdiTecnoacademia
    export let productos

    $title = 'Productos'

    /**
     * Validar si el usuario autenticado es SuperAdmin
     */
    let auth_user = auth.user
    let is_super_admin = checkRole(auth_user, [1])

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
    <header className="pt-[8rem]" slot="header">
        <div className="flex items-center justify-between lg:px-8 max-w-7xl mx-auto px-4 py-6 sm:px-6">
            <div>
                <h1>
                    <a use:inertia href={route('proyectos-idi-tecnoacademia.index')} className="text-app-400 hover:text-app-600"> Proyectos I+D+i TecnoAcademia </a>
                    <span className="text-app-400 font-medium">/</span>
                    <a use:inertia href={route('proyectos-idi-tecnoacademia.edit', proyectoIdiTecnoacademia.id)} className="text-app-400 hover:text-app-600">Información básica</a>
                    <span className="text-app-400 font-medium">/</span>
                    <a use:inertia href={route('proyectos-idi-tecnoacademia.participantes.index', proyectoIdiTecnoacademia.id)} className="text-app-400 hover:text-app-600">Participantes</a>
                    <span className="text-app-400 font-medium">/</span>
                    <a use:inertia href={route('proyectos-idi-tecnoacademia.productos.index', proyectoIdiTecnoacademia.id)} className="text-app-400 hover:text-app-600 font-extrabold underline">Productos</a>
                </h1>
            </div>
        </div>
    </header>

    <h1 className="mt-24 mb-8 text-center text-3xl">Productos</h1>

    <div className="mb-6 flex justify-between items-center">
        {#if proyectoIdiTecnoacademia.allowed.to_update}
            <Button on:click={() => Inertia.visit(route('proyectos-idi-tecnoacademia.productos.create', proyectoIdiTecnoacademia.id))} variant="raised">Crear producto</Button>
        {/if}
    </div>

    <div className="bg-white rounded shadow">
        <table className="w-full whitespace-no-wrap table-fixed data-table">
            <thead>
                <tr className="text-left font-bold">
                    <th className="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full">Descripción</th>
                    <th className="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full">Tipo de producto</th>
                    <th className="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl text-center th-actions">Acciones</th>
                </tr>
            </thead>
            <tbody>
                {#each productos.data as producto (producto.id)}
                    <tr className="hover:bg-gray-100 focus-within:bg-gray-100">
                        <td className="border-t">
                            <p className="px-6 py-4">
                                {producto.descripcion}
                            </p>
                        </td>
                        <td className="border-t">
                            <p className="px-6 py-4">
                                {producto.tipo_producto_idi.tipo}
                            </p>
                        </td>
                        <td className="border-t td-actions">
                            <DataTableMenu className={productos.data.length < 3 ? 'z-50' : ''}>
                                <Item on:SMUI:action={() => Inertia.visit(route('proyectos-idi-tecnoacademia.productos.edit', [proyectoIdiTecnoacademia.id, producto.id]))}>
                                    <Text>Ver detalles</Text>
                                </Item>

                                <Separator className={!proyectoIdiTecnoacademia.allowed.to_destroy ? 'hidden' : ''} />
                                <Item on:SMUI:action={() => ((productoId = producto.id), (dialogEliminar = true), (allowedToDestroy = proyectoIdiTecnoacademia.allowed.to_destroy))} disabled={!proyectoIdiTecnoacademia.allowed.to_destroy} className={!proyectoIdiTecnoacademia.allowed.to_destroy ? 'hidden' : ''}>
                                    <Text>Eliminar</Text>
                                </Item>
                            </DataTableMenu>
                        </td>
                    </tr>
                {/each}

                {#if productos.data.length === 0}
                    <tr>
                        <td className="border-t px-6 py-4" colspan="4"> Sin información registrada </td>
                    </tr>
                {/if}
            </tbody>
        </table>
    </div>
    <Pagination links={productos.links} />

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
