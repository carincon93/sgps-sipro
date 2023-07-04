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
    export let serviciosTecnologicos
    export let allowedToCreate
    export let errors

    $title = 'Proyectos Servicios tecnológicos'

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
            $deleteForm.delete(route('convocatorias.servicios-tecnologicos.destroy', [convocatoria.id, proyectoId]), {
                onFinish: () => ((proyectoId = null), (dialogEliminar = false)),
                preserveScroll: true,
            })
        }
    }
</script>

<AuthenticatedLayout>
    <DataTable className="mt-20" routeParams={[convocatoria.id]} bind:filters showFilters={true}>
        <div slot="title">
            Fortalecimiento de la oferta de servicios tecnológicos para las empresas - Línea 68
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
                <Button on:click={() => Inertia.visit(route('convocatorias.servicios-tecnologicos.create', [convocatoria.id]))} variant="raised">Crear proyecto Servicios tecnológicos</Button>
            {/if}
        </div>

        <thead slot="thead">
            <tr className="text-left font-bold">
                <th className="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full"> Código </th>
                <th className="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full"> Título </th>
                <th className="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full"> Fecha de ejecución </th>
                <th className="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full"> Estado (Evaluación) </th>
                <th className="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl text-center th-actions"> Acciones </th>
            </tr>
        </thead>

        <tbody slot="tbody">
            {#each serviciosTecnologicos.data as { id, proyecto, titulo, fecha_ejecucion }}
                <tr className="hover:bg-gray-100 focus-within:bg-gray-100">
                    <td className="border-t">
                        <p className="px-6 py-4 focus:text-app-500">
                            {proyecto.codigo}
                            {#if JSON.parse(proyecto.estado_cord_sennova)?.requiereSubsanar && proyecto.mostrar_recomendaciones == true && proyecto.mostrar_requiere_subsanacion == true}
                                <span className="bg-red-100 inline-block mt-2 p-2 rounded text-red-400"> Requiere ser subsanado </span>
                            {:else if JSON.parse(proyecto.estado)?.requiereSubsanar && proyecto.mostrar_recomendaciones == true && proyecto.mostrar_requiere_subsanacion == true}
                                <span className="bg-red-100 inline-block mt-2 p-2 rounded text-red-400"> Requiere ser subsanado </span>
                            {/if}
                        </p>
                    </td>
                    <td className="border-t">
                        <p className="px-6 py-4 focus:text-app-500">
                            {titulo}
                        </p>
                    </td>
                    <td className="border-t">
                        <p className="px-6 py-4">
                            {fecha_ejecucion}
                        </p>
                    </td>
                    <td className="border-t">
                        {#if isSuperAdmin || checkRole(authUser, [19]) || (checkRole(authUser, [4, 13]) && proyecto?.mostrar_recomendaciones && convocatoria.tipo_convocatoria == 1) || (convocatoria.fase == 5 && proyecto.mostrar_recomendaciones)}
                            <p className="px-6 py-4">
                                {proyecto.estado_evaluacion_servicios_tecnologicos.estado}
                                <small>
                                    Puntaje: {proyecto?.estado_evaluacion_servicios_tecnologicos?.puntaje}
                                </small>
                                {#if isSuperAdmin || checkRole(authUser, [19])}
                                    <br />
                                    <small>
                                        Número de recomendaciones: {proyecto.estado_evaluacion_servicios_tecnologicos.numeroRecomendaciones}
                                        <br />
                                        Evaluaciones: {proyecto.estado_evaluacion_servicios_tecnologicos.evaluacionesHabilitadas} habilitada(s) / {proyecto.estado_evaluacion_servicios_tecnologicos.evaluacionesFinalizadas} finalizada(s)
                                        <br />
                                        {#if proyecto.estado_evaluacion_servicios_tecnologicos.alerta}
                                            <strong className="text-red-500">
                                                Importante: {proyecto.estado_evaluacion_servicios_tecnologicos.alerta}
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
                        <DataTableMenu className={serviciosTecnologicos.data.length < 3 ? 'z-50' : ''}>
                            <Item on:SMUI:action={() => Inertia.visit(route('convocatorias.servicios-tecnologicos.edit', [convocatoria.id, id]))} disabled={!proyecto.allowed.to_view} className={!proyecto.allowed.to_view ? 'hidden' : ''}>
                                <Text>Ver detalles</Text>
                            </Item>
                            <Separator className={!proyecto.allowed.to_destroy ? 'hidden' : ''} />
                            <Item on:SMUI:action={() => ((proyectoId = id), (dialogEliminar = true), (allowedToDestroy = proyecto.allowed.to_destroy))} disabled={!proyecto.allowed.to_destroy} className={!proyecto.allowed.to_destroy ? 'hidden' : ''}>
                                <Text>Eliminar</Text>
                            </Item>
                        </DataTableMenu>
                    </td>
                </tr>
            {/each}

            {#if serviciosTecnologicos.data.length === 0}
                <tr>
                    <td className="border-t px-6 py-4" colspan="5"> Sin información registrada </td>
                </tr>
            {/if}
        </tbody>
    </DataTable>
    <Pagination links={serviciosTecnologicos.links} />

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
