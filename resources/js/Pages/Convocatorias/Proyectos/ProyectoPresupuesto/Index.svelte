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
    import Stepper from '@/Shared/Stepper'
    import InfoMessage from '@/Shared/InfoMessage'

    export let convocatoria
    export let proyecto
    export let proyectoPresupuesto
    export let segundoGrupoPresupuestal

    $title = 'Presupuesto'

    /**
     * Validar si el usuario autenticado es SuperAdmin
     */
    let authUser = $page.props.auth.user
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
    <header class="pt-[8rem]" slot="header">
        <Stepper {convocatoria} {proyecto} />
    </header>

    <h1 class="mt-24 mb-8 text-center text-3xl">Rubros presupuestales</h1>

    <InfoMessage class="my-14">
        <strong>Actualmente el total del costo de los productos o servicios requeridos es de:</strong> ${new Intl.NumberFormat('de-DE').format(!isNaN(proyecto.total_proyecto_presupuesto) ? proyecto.total_proyecto_presupuesto : 0)} COP
    </InfoMessage>

    {#if proyecto.codigo_linea_programatica == 66 || proyecto.codigo_linea_programatica == 82}
        <h1 class="mt-24 mb-8 text-center text-3xl">Reglas</h1>
        <div class="bg-white rounded shadow">
            <table class="w-full whitespace-no-wrap table-fixed data-table">
                <thead>
                    <tr class="text-left font-bold">
                        <th class="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full">Concepto SENA</th>
                        <th class="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full">Regla</th>
                        <th class="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full">Estado</th>
                    </tr>
                </thead>

                <tbody>
                    <tr class="hover:bg-gray-100 focus-within:bg-gray-100">
                        <td class="border-t p-4"> Servicios especiales de construcción </td>
                        <td class="border-t p-4">
                            El valor no debe superar el 5% (${new Intl.NumberFormat('de-DE').format(!isNaN(proyecto.total_maquinaria_industrial) ? proyecto.total_maquinaria_industrial * 0.05 : 0)}) del rubro de "MAQUINARIA INDUSTRIAL" (${new Intl.NumberFormat('de-DE').format(!isNaN(proyecto.total_maquinaria_industrial) ? proyecto.total_maquinaria_industrial : 0)}).
                        </td>
                        <td class="border-t p-4">
                            Valor actual: ${new Intl.NumberFormat('de-DE').format(!isNaN(proyecto.total_servicios_especiales_construccion) ? proyecto.total_servicios_especiales_construccion : 0)}
                            {#if proyecto.total_maquinaria_industrial == 0 || proyecto.total_servicios_especiales_construccion <= proyecto.total_maquinaria_industrial * 0.05}
                                <span class="bg-green-100 text-green-400 hover:bg-green-200 px-2 py-1 rounded-3xl text-center block"> Cumple </span>
                            {:else}
                                <span class="bg-red-100 text-red-400 hover:bg-red-200 px-2 py-1 rounded-3xl text-center block"> No cumple </span>
                            {/if}
                        </td>
                    </tr>

                    <tr class="hover:bg-gray-100 focus-within:bg-gray-100">
                        <td class="border-t p-4"> Viáticos </td>
                        <td class="border-t p-4"> La sumatoria de todos los rubros de viáticos no debe superar el valor de $4.594.000 </td>
                        <td class="border-t p-4">
                            Valor actual: ${new Intl.NumberFormat('de-DE').format(!isNaN(proyecto.total_viaticos) ? proyecto.total_viaticos : 0)}
                            {#if proyecto.total_viaticos <= 4594000}
                                <span class="bg-green-100 text-green-400 hover:bg-green-200 px-2 py-1 rounded-3xl text-center block"> Cumple </span>
                            {:else}
                                <span class="bg-red-100 text-red-400 hover:bg-red-200 px-2 py-1 rounded-3xl text-center block"> No cumple </span>
                            {/if}
                        </td>
                    </tr>

                    <tr class="hover:bg-gray-100 focus-within:bg-gray-100">
                        <td class="border-t p-4"> Mantenimiento de maquinaria, equipo, transporte y sofware </td>
                        <td class="border-t p-4">
                            El valor no debe superar el 5% (${new Intl.NumberFormat('de-DE').format(!isNaN(proyecto.precio_proyecto) ? proyecto.precio_proyecto * 0.05 : 0)}) del total del proyecto ( ${new Intl.NumberFormat('de-DE').format(!isNaN(proyecto.precio_proyecto) ? proyecto.precio_proyecto : 0)}).
                        </td>
                        <td class="border-t p-4">
                            Valor actual: ${new Intl.NumberFormat('de-DE').format(!isNaN(proyecto.total_mantenimiento_maquinaria) ? proyecto.total_mantenimiento_maquinaria : 0)}
                            {#if proyecto.total_mantenimiento_maquinaria <= proyecto.precio_proyecto * 0.05}
                                <span class="bg-green-100 text-green-400 hover:bg-green-200 px-2 py-1 rounded-3xl text-center block"> Cumple </span>
                            {:else}
                                <span class="bg-red-100 text-red-400 hover:bg-red-200 px-2 py-1 rounded-3xl text-center block"> No cumple </span>
                            {/if}
                        </td>
                    </tr>
                </tbody>

                <tfoot>
                    <tr>
                        <td colspan="3" class="border-t p-4">
                            <strong>Nota:</strong> Los valores en paréntesis son los valores calculados del proyecto.
                        </td>
                    </tr>
                </tfoot>
            </table>
        </div>
    {:else if proyecto.codigo_linea_programatica == 23}
        <h1 class="mt-24 mb-8 text-center text-3xl">Reglas</h1>
        <div class="bg-white rounded shadow">
            <table class="w-full whitespace-no-wrap table-fixed data-table">
                <thead>
                    <tr class="text-left font-bold">
                        <th class="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full">Concepto SENA</th>
                        <th class="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full">Regla</th>
                        <th class="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full">Estado</th>
                    </tr>
                </thead>

                <tbody>
                    <tr class="hover:bg-gray-100 focus-within:bg-gray-100">
                        <td class="border-t p-4"> Servicios especiales de construcción </td>
                        <td class="border-t p-4"> El valor no debe superar los 100 salarios mínimos. </td>
                        <td class="border-t p-4">
                            Valor actual: ${new Intl.NumberFormat('de-DE').format(!isNaN(proyecto.total_servicios_especiales_construccion) ? proyecto.total_servicios_especiales_construccion : 0)}
                            {#if proyecto.total_servicios_especiales_construccion <= proyecto.salarios_minimos}
                                <span class="bg-green-100 text-green-400 hover:bg-green-200 px-2 py-1 rounded-3xl text-center block"> Cumple </span>
                            {:else}
                                <span class="bg-red-100 text-red-400 hover:bg-red-200 px-2 py-1 rounded-3xl text-center block"> No cumple </span>
                            {/if}
                        </td>
                    </tr>

                    <tr class="hover:bg-gray-100 focus-within:bg-gray-100">
                        <td class="border-t p-4"> Mantenimiento de maquinaria, equipo, transporte y sofware </td>
                        <td class="border-t p-4">
                            El valor no debe superar el 5% (${new Intl.NumberFormat('de-DE').format(!isNaN(proyecto.precio_proyecto) ? proyecto.precio_proyecto * 0.05 : 0)}) del total del proyecto ( ${new Intl.NumberFormat('de-DE').format(!isNaN(proyecto.precio_proyecto) ? proyecto.precio_proyecto : 0)}).
                        </td>
                        <td class="border-t p-4">
                            Valor actual: ${new Intl.NumberFormat('de-DE').format(!isNaN(proyecto.total_mantenimiento_maquinaria) ? proyecto.total_mantenimiento_maquinaria : 0)}
                            {#if proyecto.total_mantenimiento_maquinaria <= proyecto.precio_proyecto * 0.05}
                                <span class="bg-green-100 text-green-400 hover:bg-green-200 px-2 py-1 rounded-3xl text-center block"> Cumple </span>
                            {:else}
                                <span class="bg-red-100 text-red-400 hover:bg-red-200 px-2 py-1 rounded-3xl text-center block"> No cumple </span>
                            {/if}
                        </td>
                    </tr>
                </tbody>

                <tfoot>
                    <tr>
                        <td colspan="3" class="border-t p-4">
                            <strong>Nota:</strong> Los valores en paréntesis son los valores calculados del proyecto.
                        </td>
                    </tr>
                </tfoot>
            </table>
        </div>
    {/if}

    <DataTable class="mt-20" routeParams={[convocatoria.id, proyecto.id]} bind:filters showFilters={true}>
        <div slot="filters">
            <label for="presupuestos" class="block text-gray-700">Presupuestos:</label>
            <select id="presupuestos" class="mt-1 w-full form-select" bind:value={filters.presupuestos}>
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
                        <span class="hidden md:inline">presupuesto</span>
                    </div>
                </Button>
            {/if}
        </div>

        <thead slot="thead">
            <tr class="text-left font-bold">
                <th class="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full">Descripción del bien o servicio</th>
                <th class="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full">Subtotal del costo de los productos o servicios requeridos</th>
                {#if isSuperAdmin || proyecto.mostrar_recomendaciones}
                    <th class="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full">Evaluación</th>
                {/if}
                <th class="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl text-center th-actions">Acciones</th>
            </tr>
        </thead>

        <tbody slot="tbody">
            {#each proyectoPresupuesto.data as presupuesto (presupuesto.id)}
                <tr class="hover:bg-gray-100 focus-within:bg-gray-100">
                    <td class="border-t">
                        <div class="flex flex-col focus:text-app-500 px-6 py-4" id="PRE-{presupuesto.id}">
                            <small>
                                Código: PRE-{presupuesto.id}
                            </small>
                            <div class="mt-3">
                                <p class="paragraph-ellipsis">
                                    {presupuesto.descripcion}
                                </p>
                            </div>

                            <div class="mt-3">
                                <small class="underline">Rubro concepto interno SENA</small>
                                <p class="whitespace-pre-line">
                                    {presupuesto.convocatoria_presupuesto?.presupuesto_sennova?.segundo_grupo_presupuestal.nombre}
                                </p>
                            </div>

                            <div class="mt-3">
                                <small class="underline">Uso presupuestal</small>
                                <p class="whitespace-pre-line">
                                    {presupuesto.convocatoria_presupuesto?.presupuesto_sennova?.uso_presupuestal.descripcion}
                                </p>
                            </div>
                        </div>
                    </td>
                    <td class="border-t">
                        <div class="mt-3 px-6">
                            ${new Intl.NumberFormat('de-DE').format(presupuesto.valor_total)} COP
                        </div>
                        {#if !presupuesto.convocatoria_presupuesto?.presupuesto_sennova?.sumar_al_presupuesto}
                            <span class="text-red-400 text-center text-xs px-6"> Este uso presupuestal NO suma al total del presupuesto </span>
                        {/if}
                    </td>
                    {#if isSuperAdmin || proyecto.mostrar_recomendaciones}
                        <td class="border-t">
                            <div class="px-6 py-4">
                                {presupuesto.presupuesto_aprobado}
                            </div>
                        </td>
                    {/if}
                    <td class="border-t td-actions">
                        <DataTableMenu class={proyectoPresupuesto.data.length < 3 ? 'z-50' : ''}>
                            <Item on:SMUI:action={() => Inertia.visit(route('convocatorias.proyectos.presupuesto.edit', [convocatoria.id, proyecto.id, presupuesto.id]))}>
                                <Text>Ver detalles</Text>
                            </Item>

                            <Item on:SMUI:action={() => Inertia.visit(route('convocatorias.proyectos.presupuesto.soportes.index', [convocatoria.id, proyecto.id, presupuesto.id]))} disabled={!presupuesto.convocatoria_presupuesto?.presupuesto_sennova?.requiere_estudio_mercado} class={!presupuesto.convocatoria_presupuesto?.presupuesto_sennova?.requiere_estudio_mercado ? 'hidden' : ''}>
                                <Text>Estudio de mercado</Text>
                            </Item>

                            <Separator class={!proyecto.allowed.to_update ? 'hidden' : ''} />
                            <Item on:SMUI:action={() => ((proyectoPresupuestoId = presupuesto.id), (dialogEliminar = true), (allowedToDestroy = proyecto.allowed.to_update))} disabled={!proyecto.allowed.to_update} class={!proyecto.allowed.to_update ? 'hidden' : ''}>
                                <Text>Eliminar rubro</Text>
                            </Item>
                        </DataTableMenu>
                    </td>
                </tr>
            {/each}

            {#if proyectoPresupuesto.data.length === 0}
                <tr>
                    <td class="border-t px-6 py-4" colspan="5">Sin información registrada</td>
                </tr>
            {/if}
        </tbody>
    </DataTable>
    <Pagination links={proyectoPresupuesto.links} />

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
