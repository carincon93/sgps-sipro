<script>
    import AuthenticatedLayout, { title } from '@/Layouts/Authenticated'
    import { page, useForm } from '@inertiajs/inertia-svelte'
    import { route, checkRole, checkPermission, checkPermissionByUser } from '@/Utils'
    import { _ } from 'svelte-i18n'
    import { Inertia } from '@inertiajs/inertia'

    import Pagination from '@/Components/Pagination'
    import DataTableMenu from '@/Components/DataTableMenu'
    import Button from '@/Components/Button'
    import { Item, Text, Separator } from '@smui/list'
    import DataTable from '@/Components/DataTable'
    import Dialog from '@/Components/Dialog'
    import Label from '@/Components/Label'
    import Password from '@/Components/Password'
    import InfoMessage from '@/Components/InfoMessage'

    export let convocatoria
    export let proyectosTa
    export let allowedToCreate
    export let errors

    $title = 'Proyectos Tecnoacademia'

    /**
     * Validar si el usuario autenticado es SuperAdmin
     */
    let authUser = $auth.user
    let isSuperAdmin = checkRole(authUser, [1])

    let filters = {
        estructuracion_proyectos: $page.props.filters.estructuracion_proyectos,
    }

    let dialogEliminar = false
    let deleteForm = useForm({
        password: '',
    })

    let proyectoId = null
    let allowedToDestroy = false
    function destroy() {
        if (allowedToDestroy && proyectoId) {
            $deleteForm.delete(route('convocatorias.ta.destroy', [convocatoria.id, proyectoId]), {
                onFinish: () => ((proyectoId = null), (dialogEliminar = false)),
                preserveScroll: true,
            })
        }
    }
</script>

<AuthenticatedLayout>
    <DataTable className="mt-20" routeParams={[convocatoria.id]} bind:filters showFilters={true}>
        <div slot="title">
            TecnoAcademia - Línea 70
            <InfoMessage className="mt-10 text-xl">Ahora se listan únicamente los proyectos que usted ha creado y también en los que está asociado.</InfoMessage>
        </div>

        <div slot="filters">
            <label for="estructuracion_proyectos" className="block text-gray-700">Filtros:</label>
            <select id="estructuracion_proyectos" className="mt-1 w-full form-select" bind:value={filters.estructuracion_proyectos}>
                <option value={null}>Seleccione una opción</option>
                <option value={false}>Ver - Proyectos de la convocatoria</option>
                <option value={true}>Ver - Curso de estructuración de proyectos</option>
            </select>
        </div>

        <div slot="actions">
            {#if allowedToCreate}
                <Button on:click={() => Inertia.visit(route('convocatorias.ta.create', [convocatoria.id]))} variant="raised">Crear proyecto Tecnoacademia</Button>
            {/if}
        </div>

        <thead slot="thead">
            <tr className="text-left font-bold">
                <th className="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full"> Código </th>
                <th className="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full"> Teacnoacademia </th>
                <th className="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full"> Fecha de ejecución </th>
                <th className="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full"> Estado (Evaluación) </th>
                <th className="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl text-center th-actions"> Acciones </th>
            </tr>
        </thead>

        <tbody slot="tbody">
            {#each proyectosTa.data as ta}
                <tr className="hover:bg-gray-100 focus-within:bg-gray-100">
                    <td className="border-t">
                        <p className="px-6 py-4 focus:text-app-500">
                            {ta.proyecto.codigo}
                            {#if ta.proyecto_base}
                                <small className="bg-red-100 inline-block mt-2 p-2 rounded text-red-400"> Proyecto base (Solo pueden acceder administradores) </small>
                            {/if}
                            {#if JSON.parse(ta.proyecto.estado)?.requiereSubsanar && ta.proyecto.mostrar_recomendaciones == true && ta.proyecto.mostrar_requiere_subsanacion == true}
                                <span className="bg-red-100 inline-block mt-2 p-2 rounded text-red-400"> Requiere ser subsanado </span>
                            {/if}
                        </p>
                    </td>
                    <td className="border-t">
                        <p className="px-6 py-4 focus:text-app-500">
                            {ta.proyecto.tecnoacademia_lineas_tecnoacademia[0]?.tecnoacademia.nombre}
                        </p>
                    </td>
                    <td className="border-t">
                        <p className="px-6 py-4">
                            {ta.fecha_ejecucion}
                        </p>
                    </td>
                    <td className="border-t">
                        {#if isSuperAdmin || checkRole(authUser, [5]) || (checkRole(authUser, [4, 22, 12]) && ta.proyecto.mostrar_recomendaciones) || (convocatoria.fase == 5 && ta.proyecto.mostrar_recomendaciones)}
                            <p className="px-6 py-4">
                                {ta.proyecto.estado_evaluacion_ta.estado}
                                {#if isSuperAdmin || checkRole(authUser, [5])}
                                    <br />
                                    <small>
                                        <br />
                                        Número de recomendaciones: {ta.proyecto.estado_evaluacion_ta.numeroRecomendaciones}
                                        <br />
                                        Evaluaciones: {ta.proyecto.estado_evaluacion_ta.evaluacionesHabilitadas} habilitada(s) / {ta.proyecto.estado_evaluacion_ta.evaluacionesFinalizadas} finalizada(s)
                                        <br />
                                        {#if ta.proyecto.estado_evaluacion_ta.alerta}
                                            <strong className="text-red-500">
                                                Importante: {ta.proyecto.estado_evaluacion_ta.alerta}
                                            </strong>
                                        {/if}
                                    </small>
                                {/if}
                            </p>
                        {:else}
                            <p className="px-6 py-4">Aún no tiene permisos para ver el estado de evaluación de este proyecto.</p>
                        {/if}
                    </td>
                    <td className="border-t td-actions">
                        <DataTableMenu className={proyectosTa.data.length < 3 ? 'z-50' : ''}>
                            <Item on:SMUI:action={() => Inertia.visit(route('convocatorias.ta.edit', [convocatoria.id, ta.id]))} disabled={!ta.proyecto.allowed.to_view} className={!ta.proyecto.allowed.to_view ? 'hidden' : ''}>
                                <Text>Ver detalles</Text>
                            </Item>

                            <Separator className={!ta.proyecto.allowed.to_destroy ? 'hidden' : ''} />
                            <Item on:SMUI:action={() => ((proyectoId = ta.id), (dialogEliminar = true), (allowedToDestroy = ta.proyecto.allowed.to_destroy))} disabled={!ta.proyecto.allowed.to_destroy} className={!ta.proyecto.allowed.to_destroy ? 'hidden' : ''}>
                                <Text>Eliminar</Text>
                            </Item>
                        </DataTableMenu>
                    </td>
                </tr>
            {/each}

            {#if proyectosTa.data.length === 0}
                <tr>
                    <td className="border-t px-6 py-4" colspan="5"> Sin información registrada </td>
                </tr>
            {/if}
        </tbody>
    </DataTable>
    <Pagination links={proyectosTa.links} />

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
        <div slot="content">
            <form on:submit|preventDefault={destroy} id="delete-tp" className="mt-24 mb-28">
                <Label labelFor="password" value="Ingrese su contraseña para confirmar que desea eliminar permanentemente este proyecto" className="mb-4" />
                <Password id="password" className="w-full" bind:value={$deleteForm.password} error={errors.password} required autocomplete="current-password" />
            </form>
        </div>
        <div slot="actions">
            <div className="p-4">
                <Button on:click={() => (dialogEliminar = false)} variant={null}>Cancelar</Button>
                <Button variant="raised" type="submit" form="delete-tp">Confirmar</Button>
            </div>
        </div>
    </Dialog>
</AuthenticatedLayout>
