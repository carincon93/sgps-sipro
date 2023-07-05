<script>
    import AuthenticatedLayout, { title } from '@/Layouts/Authenticated'
    import { inertia, page } from '@inertiajs/inertia-svelte'
    import { route, checkRole, checkPermission } from '@/Utils'
    import { _ } from 'svelte-i18n'
    import { Inertia } from '@inertiajs/inertia'

    import Dialog from '@/Components/Dialog'
    import Button from '@/Components/Button'
    import DataTableMenu from '@/Components/DataTableMenu'
    import { Item, Text, Separator } from '@smui/list'
    import DataTable from '@/Components/DataTable'
    import Pagination from '@/Components/Pagination'
    import InfoMessage from '@/Components/InfoMessage'

    export let convocatoria
    export let proyecto
    export let entidadAliada
    export let miembrosEntidadAliada

    $title = 'Miembros de la entidad aliada'

    /**
     * Validar si el usuario autenticado es SuperAdmin
     */
    let authUser = auth.user
    let isSuperAdmin = checkRole(authUser, [1])

    let filters = {}

    let dialogEliminar = false
    let allowedToDestroy = false
    let miembroEntidadAliadaId
    function destroy() {
        if (allowedToDestroy) {
            Inertia.delete(route('convocatorias.proyectos.entidades-aliadas.miembros-entidad-aliada.destroy', [convocatoria.id, proyecto.id, entidadAliada.id, miembroEntidadAliadaId]), {
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
                <h1 className="overflow-ellipsis overflow-hidden w-breadcrumb-ellipsis whitespace-nowrap">
                    <a use:inertia href={route('convocatorias.proyectos.entidades-aliadas.index', [convocatoria.id, proyecto.id])} className="text-app-400 hover:text-app-600"> Entidades aliadas </a>
                    <span className="text-app-400 font-medium">/</span>
                    <a use:inertia href={route('convocatorias.proyectos.entidades-aliadas.edit', [convocatoria.id, proyecto.id, entidadAliada.id])} className="text-app-400 hover:text-app-600">
                        {entidadAliada.nombre}
                    </a>
                    <span className="text-app-400 font-medium">/</span>
                    Miembros de la entidad aliada
                </h1>
            </div>
        </div>
    </header>

    <InfoMessage message="Por favor ingrese cada uno de los miembros de la entidad aliada." />

    <DataTable className="mt-20" routeParams={[convocatoria.id, proyecto.id]}>
        <div slot="title">Miembros de la entidad aliada</div>

        <div slot="actions">
            {#if proyecto.allowed.to_update}
                <Button on:click={() => Inertia.visit(route('convocatorias.proyectos.entidades-aliadas.miembros-entidad-aliada.create', [convocatoria.id, proyecto.id, entidadAliada.id]))} variant="raised">Crear miembro de la entidad aliada</Button>
            {/if}
        </div>

        <thead slot="thead">
            <tr className="text-left font-bold">
                <th className="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full">Nombre</th>
                <th className="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full">Correo electrónico</th>
                <th className="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full">Número de celular</th>
                <th className="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl text-center th-actions">Acciones</th>
            </tr>
        </thead>

        <tbody slot="tbody">
            {#each miembrosEntidadAliada.data as miembroEntidadAliada (miembroEntidadAliada.id)}
                <tr className="hover:bg-gray-100 focus-within:bg-gray-100">
                    <td className="border-t">
                        <p className="px-6 py-4 focus:text-app-500">
                            {miembroEntidadAliada.nombre}
                        </p>
                    </td>

                    <td className="border-t">
                        <p className="px-6 py-4 focus:text-app-500">
                            {miembroEntidadAliada.email}
                        </p>
                    </td>

                    <td className="border-t">
                        <p className="px-6 py-4 focus:text-app-500">
                            {miembroEntidadAliada.numero_celular}
                        </p>
                    </td>

                    <td className="border-t td-actions">
                        <DataTableMenu className={miembrosEntidadAliada.data.length < 3 ? 'z-50' : ''}>
                            <Item on:SMUI:action={() => Inertia.visit(route('convocatorias.proyectos.entidades-aliadas.miembros-entidad-aliada.edit', [convocatoria.id, proyecto.id, entidadAliada.id, miembroEntidadAliada.id]))}>
                                <Text>Ver detalles</Text>
                            </Item>

                            <Separator className={!proyecto.allowed.to_update ? 'hidden' : ''} />
                            <Item on:SMUI:action={() => ((miembroEntidadAliadaId = miembroEntidadAliada.id), (dialogEliminar = true), (allowedToDestroy = proyecto.allowed.to_update))} disabled={!proyecto.allowed.to_update} className={!proyecto.allowed.to_update ? 'hidden' : ''}>
                                <Text>Eliminar</Text>
                            </Item>
                        </DataTableMenu>
                    </td>
                </tr>
            {/each}

            {#if miembrosEntidadAliada.data.length === 0}
                <tr>
                    <td className="border-t px-6 py-4" colspan="4">Sin información registrada</td>
                </tr>
            {/if}
        </tbody>
    </DataTable>
    <Pagination links={miembrosEntidadAliada.links} />

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
