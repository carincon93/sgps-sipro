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
    import InfoMessage from '@/Components/InfoMessage'

    export let convocatoria
    export let proyecto
    export let proyectoPresupuesto
    export let segundoGrupoPresupuestal

    $title = 'Presupuesto'

    /**
     * Validar si el usuario autenticado es SuperAdmin
     */
    let authUser = auth.user
    let isSuperAdmin = checkRole(authUser, [1])

    let filters = {
        presupuestos: $page.props.filters.presupuestos,
    }

    let dialogEliminar = false
    let allowedToDestroy = false
    let proyectoPresupuestoId
    function destroy() {
        if (allowedToDestroy) {
            Inertia.delete(route('convocatorias.proyectos.presupuesto.destroy', [convocatoria.id, proyecto.id, proyectoPresupuestoId]), {
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

    <h1 className="mt-24 mb-8 text-center text-3xl">Rubros presupuestales</h1>

    <InfoMessage className="my-14">
        <strong>Actualmente el total del costo de los productos o servicios requeridos es de:</strong> ${new Intl.NumberFormat('de-DE').format(!isNaN(proyecto.total_proyecto_presupuesto) ? proyecto.total_proyecto_presupuesto : 0)} COP
    </InfoMessage>

    <DataTable className="mt-20" routeParams={[convocatoria.id, proyecto.id]} bind:filters showFilters={true}>
        <div slot="filters">
            <label for="presupuestos" className="block text-gray-700">Presupuestos:</label>
            <select id="presupuestos" className="mt-1 w-full form-select" bind:value={filters.presupuestos}>
                <option value={null}>Seleccione un presupuesto</option>
                {#each segundoGrupoPresupuestal as { nombre }}
                    <option value={nombre}>{nombre}</option>
                {/each}
            </select>
        </div>

        <div slot="actions">
            {#if proyecto.allowed.to_update}
                <Button on:click={() => Inertia.visit(route('convocatorias.proyectos.presupuesto.create', [convocatoria.id, proyecto.id]))}>
                    <div>
                        <span>Crear</span>
                        <span className="hidden md:inline">presupuesto</span>
                    </div>
                </Button>
            {/if}
        </div>

        <thead slot="thead">
            <tr className="text-left font-bold">
                <th className="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full">Descripción del bien o servicio</th>
                <th className="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full">Subtotal del costo de los productos o servicios requeridos</th>
                {#if isSuperAdmin || proyecto.mostrar_recomendaciones}
                    <th className="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full">Evaluación</th>
                {/if}
                <th className="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl text-center th-actions">Acciones</th>
            </tr>
        </thead>

        <tbody slot="tbody">
            {#each proyectoPresupuesto.data as presupuesto (presupuesto.id)}
                <tr className="hover:bg-gray-100 focus-within:bg-gray-100">
                    <td className="border-t">
                        <div className="flex flex-col focus:text-app-500 px-6 py-4" id="PRE-{presupuesto.id}">
                            <small>
                                Código: PRE-{presupuesto.id}
                            </small>
                            <div className="mt-3">
                                <p className="paragraph-ellipsis">
                                    {presupuesto.descripcion}
                                </p>
                            </div>

                            <div className="mt-3">
                                <small className="underline">Rubro concepto interno SENA</small>
                                <p className="whitespace-pre-line">
                                    {presupuesto.convocatoria_presupuesto?.presupuesto_sennova?.segundo_grupo_presupuestal.nombre}
                                </p>
                            </div>

                            <div className="mt-3">
                                <small className="underline">Uso presupuestal</small>
                                <p className="whitespace-pre-line">
                                    {presupuesto.convocatoria_presupuesto?.presupuesto_sennova?.uso_presupuestal.descripcion}
                                </p>
                            </div>
                        </div>
                    </td>
                    <td className="border-t">
                        <div className="mt-3 px-6">
                            ${new Intl.NumberFormat('de-DE').format(presupuesto.valor_total)} COP
                        </div>
                        {#if !presupuesto.convocatoria_presupuesto?.presupuesto_sennova?.sumar_al_presupuesto}
                            <span className="text-red-400 text-center text-xs px-6"> Este uso presupuestal NO suma al total del presupuesto </span>
                        {/if}
                    </td>
                    {#if isSuperAdmin || proyecto.mostrar_recomendaciones}
                        <td className="border-t">
                            <div className="px-6 py-4">
                                {presupuesto.presupuesto_aprobado}
                            </div>
                        </td>
                    {/if}
                    <td className="border-t td-actions">
                        <DataTableMenu className={proyectoPresupuesto.data.length < 3 ? 'z-50' : ''}>
                            <Item on:SMUI:action={() => Inertia.visit(route('convocatorias.proyectos.presupuesto.edit', [convocatoria.id, proyecto.id, presupuesto.id]))}>
                                <Text>Ver detalles</Text>
                            </Item>

                            <Item on:SMUI:action={() => Inertia.visit(route('convocatorias.proyectos.presupuesto.soportes.index', [convocatoria.id, proyecto.id, presupuesto.id]))} disabled={!presupuesto.convocatoria_presupuesto?.presupuesto_sennova?.requiere_estudio_mercado} className={!presupuesto.convocatoria_presupuesto?.presupuesto_sennova?.requiere_estudio_mercado ? 'hidden' : ''}>
                                <Text>Estudio de mercado</Text>
                            </Item>

                            <Separator className={!proyecto.allowed.to_update ? 'hidden' : ''} />
                            <Item on:SMUI:action={() => ((proyectoPresupuestoId = presupuesto.id), (dialogEliminar = true), (allowedToDestroy = proyecto.allowed.to_update))} disabled={!proyecto.allowed.to_update} className={!proyecto.allowed.to_update ? 'hidden' : ''}>
                                <Text>Eliminar rubro</Text>
                            </Item>
                        </DataTableMenu>
                    </td>
                </tr>
            {/each}

            {#if proyectoPresupuesto.data.length === 0}
                <tr>
                    <td className="border-t px-6 py-4" colspan="5">Sin información registrada</td>
                </tr>
            {/if}
        </tbody>
    </DataTable>
    <Pagination links={proyectoPresupuesto.links} />

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
