<script>
    import AuthenticatedLayout, { title } from '@/Layouts/Authenticated'
    import { page } from '@inertiajs/inertia-svelte'
    import { route, checkRole, checkPermission } from '@/Utils'
    import { _ } from 'svelte-i18n'
    import { Inertia } from '@inertiajs/inertia'

    import Dialog from '@/Components/Dialog'
    import Button from '@/Components/Button'
    import Pagination from '@/Components/Pagination'
    import DataTable from '@/Components/DataTable'
    import DataTableMenu from '@/Components/DataTableMenu'
    import { Item, Text, Separator } from '@smui/list'
    import Stepper from '@/Components/Stepper'
    import RecomendacionEvaluador from '@/Components/RecomendacionEvaluador'

    export let convocatoria
    export let proyecto
    export let inventarioEquipos

    $title = 'Inventario de equipos'

    /**
     * Validar si el usuario autenticado es SuperAdmin
     */
    let auth_user = auth.user
    let is_super_admin = checkRole(auth_user, [1])

    let dialogEliminar = false
    let allowedToDestroy = false
    let inventarioEquipoId
    function destroy() {
        if (allowedToDestroy) {
            Inertia.delete(route('convocatorias.proyectos.inventario-equipos.destroy', [convocatoria.id, proyecto.id, inventarioEquipoId]), {
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
        <Stepper {convocatoria} {proyecto} />
    </header>

    <DataTable className="mt-20" routeParams={[convocatoria.id, proyecto.id]}>
        <div slot="title">Inventario de equipos</div>

        <div slot="caption">
            {#if (is_super_admin && proyecto.codigo_linea_programatica == 68) || (proyecto.mostrar_recomendaciones && proyecto.codigo_linea_programatica == 68)}
                <RecomendacionEvaluador className="mt-8">
                    {#each proyecto.evaluaciones as evaluacion, i}
                        {#if is_super_admin || (evaluacion.finalizado && evaluacion.habilitado)}
                            <div className="bg-zinc-900 p-4 rounded shadow text-white my-2">
                                <p className="text-xs">Evaluador COD-{evaluacion.id}:</p>
                                <p className="whitespace-pre-line text-xs">{evaluacion.servicio_tecnologico_evaluacion?.inventario_equipos_comentario ? evaluacion.servicio_tecnologico_evaluacion.inventario_equipos_comentario : 'Sin recomendación'}</p>
                            </div>
                        {/if}
                    {/each}
                    {#if proyecto.evaluaciones.length == 0}
                        <p className="whitespace-pre-line mt-4 text-xs">El proyecto no ha sido evaluado aún.</p>
                    {/if}
                </RecomendacionEvaluador>
            {/if}
        </div>

        <div slot="actions">
            {#if proyecto.allowed.to_update}
                <Button on:click={() => Inertia.visit(route('convocatorias.proyectos.inventario-equipos.create', [convocatoria.id, proyecto.id]))} variant="raised">Crear inventario de equipos</Button>
            {/if}
        </div>

        <thead slot="thead">
            <tr className="text-left font-bold">
                <th className="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full">Nombre</th>
                <th className="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full">Fecha de adquisición</th>
                <th className="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl text-center th-actions">Acciones</th>
            </tr>
        </thead>

        <tbody slot="tbody">
            {#each inventarioEquipos.data as inventarioEquipo (inventarioEquipo.id)}
                <tr className="hover:bg-gray-100 focus-within:bg-gray-100">
                    <td className="border-t">
                        <p className="focus:text-app-500 my-2 paragraph-ellipsis px-6">
                            {inventarioEquipo.nombre}
                        </p>
                    </td>

                    <td className="border-t">
                        <p className="focus:text-app-500 my-2 paragraph-ellipsis px-6">
                            {inventarioEquipo.fecha_adquisicion}
                        </p>
                    </td>

                    <td className="border-t td-actions">
                        <DataTableMenu className={inventarioEquipos.data.length < 3 ? 'z-50' : ''}>
                            <Item on:SMUI:action={() => Inertia.visit(route('convocatorias.proyectos.inventario-equipos.edit', [convocatoria.id, proyecto.id, inventarioEquipo.id]))}>
                                <Text>Ver detalles</Text>
                            </Item>

                            <Separator className={!proyecto.allowed.to_update ? 'hidden' : ''} />
                            <Item on:SMUI:action={() => ((inventarioEquipoId = inventarioEquipo.id), (dialogEliminar = true), (allowedToDestroy = proyecto.allowed.to_update))} disabled={!proyecto.allowed.to_update} className={!proyecto.allowed.to_update ? 'hidden' : ''}>
                                <Text>Eliminar</Text>
                            </Item>
                        </DataTableMenu>
                    </td>
                </tr>
            {/each}

            {#if inventarioEquipos.data.length === 0}
                <tr>
                    <td className="border-t px-6 py-4" colspan="4">Sin información registrada</td>
                </tr>
            {/if}
        </tbody>
    </DataTable>
    <Pagination links={inventarioEquipos.links} />

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
