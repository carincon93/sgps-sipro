<script>
    import AuthenticatedLayout, { title } from '@/Layouts/Authenticated'
    import { page } from '@inertiajs/inertia-svelte'
    import { route, checkRole, checkPermission } from '@/Utils'
    import { _ } from 'svelte-i18n'
    import { Inertia } from '@inertiajs/inertia'

    import InfoMessage from '@/Components/InfoMessage'
    import Dialog from '@/Components/Dialog'
    import Button from '@/Components/Button'
    import Pagination from '@/Components/Pagination'
    import DataTable from '@/Components/DataTable'
    import DataTableMenu from '@/Components/DataTableMenu'
    import { Item, Text, Separator } from '@smui/list'

    export let ambientesModernizacion
    export let codigosSgpsFaltantes
    export let allowedToCreate

    let dialogSeguimientos = false

    $title = 'Ambientes de modernización'

    /**
     * Validar si el usuario autenticado es SuperAdmin
     */
    let authUser = $auth.user
    let isSuperAdmin = checkRole(authUser, [1])

    let filters = {}

    let seguimientos = []
    let seguimientoId
    function configurarDialogoSeguimiento(ambienteModernizacion) {
        seguimientos = ambienteModernizacion.seguimiento_ambiente_modernizacion.ambientes_modernizacion
        seguimientoId = ambienteModernizacion.seguimiento_ambiente_modernizacion.id
        dialogSeguimientos = true
    }

    let ambienteModernizacionId
    let dialogEliminar = false
    let allowedToDestroy
    function destroy() {
        if (allowedToDestroy) {
            Inertia.delete(route('ambientes-modernizacion.destroy', ambienteModernizacionId), {
                preserveScroll: true,
                onFinish: () => {
                    dialogSeguimientos = false
                    dialogEliminar = false
                },
            })
        }
    }
</script>

<AuthenticatedLayout>
    <h1 className="text-2xl text-center">Seguimiento post cierre - Ambientes de modernización SENNOVA</h1>

    <p className="my-10 font-black">
        Este espacio está dispuesto para que cada Centro de Formación pueda realizar el registro permanente del seguimiento post cierre de los proyectos ejecutados en vigencias pasadas de la línea 23 Sennova con la actualización y/o modernización tecnológica de los ambientes de formación. Tener en cuenta que se debe hacer la validación del registro completo por parte del dinamizador SENNOVA y
        encargado del proyecto o ambiente.
    </p>

    <InfoMessage className="mt-10">
        <h1 className="font-black text-center mb-10">Proyectos sin seguimiento</h1>
        <ul className="pl-4 list-disc">
            {#each codigosSgpsFaltantes as codigo}
                <li>
                    <strong>Título: </strong>{codigo.titulo}
                    <br />
                    <strong>Código: </strong>SGPS-{codigo.codigo_sgps + '-' + codigo.year_ejecucion}
                </li>
            {/each}
        </ul>
    </InfoMessage>
    <DataTable className="mt-20">
        <div slot="actions">
            {#if allowedToCreate}
                <Button on:click={() => Inertia.visit(route('ambientes-modernizacion.create'))} variant="raised">Crear seguimiento ambiente de modernización</Button>
            {/if}
        </div>

        <thead slot="thead">
            <tr className="text-left font-bold">
                <th className="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full"> Código </th>
                <th className="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full"> Regional </th>
                <th className="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full"> Código del proyecto </th>
                <th className="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full"> Nombre </th>
                <th className="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full"> Estado </th>
                <th className="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl text-center th-actions"> Acciones </th>
            </tr>
        </thead>
        <tbody slot="tbody">
            {#each ambientesModernizacion.data as ambienteModernizacion (ambienteModernizacion.id)}
                <tr className="hover:bg-gray-100 focus-within:bg-gray-100">
                    <td className="border-t">
                        <p className="px-6 py-4 focus:text-app-500">
                            {ambienteModernizacion.seguimiento_ambiente_modernizacion.codigo}
                        </p>
                    </td>
                    <td className="border-t">
                        <p className="px-6 py-4 focus:text-app-500">
                            {ambienteModernizacion.seguimiento_ambiente_modernizacion.centro_formacion.regional.nombre}
                        </p>
                    </td>
                    <td className="border-t">
                        <p className="px-6 py-4 focus:text-indigo-500">
                            SGPS-{ambienteModernizacion.seguimiento_ambiente_modernizacion.codigo_proyecto_sgps.codigo_sgps + '-' + ambienteModernizacion.seguimiento_ambiente_modernizacion.codigo_proyecto_sgps.year_ejecucion}
                        </p>
                    </td>
                    <td className="border-t">
                        <p className="px-6 py-4 focus:text-app-500">
                            {ambienteModernizacion.nombre_ambiente}
                        </p>
                    </td>

                    <td className="border-t">
                        <p className="px-6 py-4 focus:text-app-500">{ambienteModernizacion.estado}</p>
                    </td>

                    <td className="border-t td-actions">
                        <DataTableMenu className={ambientesModernizacion.data.length < 3 ? 'z-50' : ''}>
                            <Item on:SMUI:action={() => configurarDialogoSeguimiento(ambienteModernizacion)}>
                                <Text>Revisar seguimientos</Text>
                            </Item>
                        </DataTableMenu>
                    </td>
                </tr>
            {/each}

            {#if ambientesModernizacion.data.length === 0}
                <tr>
                    <td className="border-t px-6 py-4" colspan="6"> Sin información registrada </td>
                </tr>
            {/if}
        </tbody>
    </DataTable>
    <Pagination links={ambientesModernizacion.links} />

    <Dialog bind:open={dialogSeguimientos} height="650">
        <div slot="title" className="flex items-center flex-col mt-4">Seleccione una fecha de realización de seguimiento:</div>
        <div slot="content">
            <div className="grid grid-cols-3 gap-4">
                {#each seguimientos as seguimiento}
                    <div className="flex">
                        <Button on:click={() => Inertia.visit(route('ambientes-modernizacion.edit', seguimiento.id))} variant="outlined">{seguimiento.fecha_seguimiento}</Button>
                        <DataTableMenu className="flex">
                            <Item on:SMUI:action={() => ((ambienteModernizacionId = seguimiento.id), (dialogEliminar = true), (allowedToDestroy = seguimiento.allowed.to_destroy))} disabled={!seguimiento.allowed.to_destroy} className={!seguimiento.allowed.to_destroy ? 'hidden' : ''}>
                                <Text>Eliminar</Text>
                            </Item>
                        </DataTableMenu>
                    </div>
                {/each}
            </div>
        </div>
        <div slot="actions">
            <div className="p-4">
                <Button on:click={() => ((dialogSeguimientos = false), (seguimientoId = null))} variant={null}>Cancelar</Button>
                <Button on:click={() => Inertia.visit(route('ambientes-modernizacion.create', 'seguimiento_id=' + seguimientoId))} variant="raised">Asociar seguimiento ambiente de modernización</Button>
            </div>
        </div>
    </Dialog>

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
