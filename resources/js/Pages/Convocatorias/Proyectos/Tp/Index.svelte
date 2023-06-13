<script>
    import AuthenticatedLayout, { title } from '@/Layouts/Authenticated'
    import { page, useForm } from '@inertiajs/inertia-svelte'
    import { route, checkRole, checkPermission, checkPermissionByUser } from '@/Utils'
    import { _ } from 'svelte-i18n'
    import { Inertia } from '@inertiajs/inertia'

    import Pagination from '@/Shared/Pagination'
    import DataTableMenu from '@/Shared/DataTableMenu'
    import Button from '@/Shared/Button'
    import { Item, Text, Separator } from '@smui/list'
    import DataTable from '@/Shared/DataTable'
    import Dialog from '@/Shared/Dialog'
    import Label from '@/Shared/Label'
    import Password from '@/Shared/Password'
    import InfoMessage from '@/Shared/InfoMessage'

    export let errors
    export let convocatoria
    export let proyectosTp
    export let allowedToCreate

    $title = 'Proyectos Tecnoparque'

    /**
     * Validar si el usuario autenticado es SuperAdmin
     */
    let authUser = $page.props.auth.user
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
            $deleteForm.delete(route('convocatorias.tp.destroy', [convocatoria.id, proyectoId]), {
                onFinish: () => ((proyectoId = null), (dialogEliminar = false)),
                preserveScroll: true,
            })
        }
    }
</script>

<AuthenticatedLayout>
    <DataTable class="mt-20" routeParams={[convocatoria.id]} bind:filters showFilters={true}>
        <div slot="title">
            Tecnoparque
            <InfoMessage class="mt-10 text-xl">Ahora se listan únicamente los proyectos que usted ha creado y también en los que está asociado.</InfoMessage>
        </div>

        <div slot="filters">
            <label for="estructuracion_proyectos" class="block text-gray-700">Filtros:</label>
            <select id="estructuracion_proyectos" class="mt-1 w-full form-select" bind:value={filters.estructuracion_proyectos}>
                <option value={null}>Seleccione una opción</option>
                <option value={false}>Ver - Proyectos de la convocatoria</option>
                <option value={true}>Ver - Curso de estructuración de proyectos</option>
            </select>
        </div>

        <div slot="actions">
            {#if allowedToCreate}
                <Button on:click={() => Inertia.visit(route('convocatorias.tp.create', [convocatoria.id]))} variant="raised">Crear proyecto Tecnoparque</Button>
            {/if}
        </div>

        <thead slot="thead">
            <tr class="text-left font-bold">
                <th class="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full"> Código </th>
                <th class="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full"> Nodo Tecnoparque </th>
                <th class="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full"> Fecha de ejecución </th>
                <th class="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full"> Estado (Evaluación) </th>
                <th class="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl text-center th-actions"> Acciones </th>
            </tr>
        </thead>

        <tbody slot="tbody">
            {#each proyectosTp.data as tp}
                <tr class="hover:bg-gray-100 focus-within:bg-gray-100">
                    <td class="border-t">
                        <p class="px-6 py-4 focus:text-app-500">
                            {tp.proyecto.codigo}
                            {#if tp.proyecto_base}
                                <small class="bg-red-100 inline-block mt-2 p-2 rounded text-red-400"> Proyecto base (Solo pueden acceder administradores) </small>
                            {/if}
                            {#if JSON.parse(tp.proyecto.estado)?.requiereSubsanar && tp.proyecto.mostrar_recomendaciones == true && tp.proyecto.mostrar_requiere_subsanacion == true}
                                <span class="bg-red-100 inline-block mt-2 p-2 rounded text-red-400"> Requiere ser subsanado </span>
                            {/if}
                        </p>
                    </td>
                    <td class="border-t">
                        <p class="px-6 py-4 focus:text-app-500">
                            {tp.titulo}
                        </p>
                    </td>
                    <td class="border-t">
                        <p class="px-6 py-4">
                            {tp.fecha_ejecucion}
                        </p>
                    </td>
                    <td class="border-t">
                        {#if isSuperAdmin || checkRole(authUser, [17]) || (checkRole(authUser, [4, 24, 16]) && tp.proyecto.mostrar_recomendaciones) || (convocatoria.fase == 5 && tp.proyecto.mostrar_recomendaciones)}
                            <p class="px-6 py-4">
                                {tp.proyecto.estado_evaluacion_tp.estado}
                                {#if isSuperAdmin || checkRole(authUser, [17])}
                                    <br />
                                    <small>
                                        <br />
                                        Número de recomendaciones: {tp.proyecto.estado_evaluacion_tp.numeroRecomendaciones}
                                        <br />
                                        Evaluaciones: {tp.proyecto.estado_evaluacion_tp.evaluacionesHabilitadas} habilitada(s) / {tp.proyecto.estado_evaluacion_tp.evaluacionesFinalizadas} finalizada(s)
                                        <br />
                                        {#if tp.proyecto.estado_evaluacion_tp.alerta}
                                            <strong class="text-red-500">
                                                Importante: {tp.proyecto.estado_evaluacion_tp.alerta}
                                            </strong>
                                        {/if}
                                    </small>
                                {/if}
                            </p>
                        {:else}
                            <p class="px-6 py-4">Aún no tiene permisos para ver el estado de evaluación de este proyecto.</p>
                        {/if}
                    </td>
                    <td class="border-t td-actions">
                        <DataTableMenu class={proyectosTp.data.length < 3 ? 'z-50' : ''}>
                            <Item on:SMUI:action={() => Inertia.visit(route('convocatorias.tp.edit', [convocatoria.id, tp.id]))} disabled={!tp.proyecto.allowed.to_view} class={!tp.proyecto.allowed.to_view ? 'hidden' : ''}>
                                <Text>Ver detalles</Text>
                            </Item>

                            <Separator class={!tp.proyecto.allowed.to_destroy ? 'hidden' : ''} />
                            <Item on:SMUI:action={() => ((proyectoId = tp.id), (dialogEliminar = true), (allowedToDestroy = tp.proyecto.allowed.to_destroy))} disabled={!tp.proyecto.allowed.to_destroy} class={!tp.proyecto.allowed.to_destroy ? 'hidden' : ''}>
                                <Text>Eliminar</Text>
                            </Item>
                        </DataTableMenu>
                    </td>
                </tr>
            {/each}

            {#if proyectosTp.data.length === 0}
                <tr>
                    <td class="border-t px-6 py-4" colspan="5"> Sin información registrada </td>
                </tr>
            {/if}
        </tbody>
    </DataTable>
    <Pagination links={proyectosTp.links} />

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
        <div slot="content">
            <form on:submit|preventDefault={destroy} id="delete-tp" class="mt-24 mb-28">
                <Label labelFor="password" value="Ingrese su contraseña para confirmar que desea eliminar permanentemente este proyecto" class="mb-4" />
                <Password id="password" class="w-full" bind:value={$deleteForm.password} error={errors.password} required autocomplete="current-password" />
            </form>
        </div>
        <div slot="actions">
            <div class="p-4">
                <Button on:click={() => (dialogEliminar = false)} variant={null}>Cancelar</Button>
                <Button variant="raised" type="submit" form="delete-tp">Confirmar</Button>
            </div>
        </div>
    </Dialog>
</AuthenticatedLayout>
