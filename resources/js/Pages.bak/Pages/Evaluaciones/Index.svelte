<script>
    import AuthenticatedLayout, { title } from '@/Layouts/Authenticated'
    import { page, useForm } from '@inertiajs/inertia-svelte'
    import { route, checkRole, checkPermission } from '@/Utils'
    import { _ } from 'svelte-i18n'
    import { Inertia } from '@inertiajs/inertia'

    import Button from '@/Shared/Button'
    import Pagination from '@/Shared/Pagination'
    import DataTable from '@/Shared/DataTable'
    import DataTableMenu from '@/Shared/DataTableMenu'
    import Dialog from '@/Shared/Dialog'
    import { Item, Text, Separator } from '@smui/list'
    import Tags from '@/Shared/Tags'
    import Label from '@/Shared/Label'
    import Switch from '@/Shared/Switch'
    import InfoMessage from '@/Shared/InfoMessage'
    import LoadingButton from '@/Shared/LoadingButton'
    import Select from '@/Shared/Select'

    export let evaluaciones
    export let allowedToCreate
    export let proyectosId

    $title = 'Evaluaciones'

    /**
     * Validar si el usuario autenticado es SuperAdmin
     */
    let authUser = $page.props.auth.user
    let isSuperAdmin = checkRole(authUser, [1])

    let filters = {
        year: $page.props.filters.year,
        estado: $page.props.filters.estado,
    }

    let estados = [
        { value: 'finalizado', label: 'Finalizado' },
        { value: 'modificable', label: 'Modificable' },
    ]

    let estadosHabilitacion = [
        { value: 'no aplica', label: 'No aplica' },
        { value: 'habilitado', label: 'Habilitado' },
        { value: 'deshabilitado', label: 'Deshabilitado' },
    ]

    let dialogEliminar = false
    let allowedToDestroy = false
    let evaluacionId
    function destroy() {
        if (allowedToDestroy) {
            Inertia.delete(route('evaluaciones.destroy', evaluacionId), {
                preserveScroll: true,
                onFinish: () => {
                    dialogEliminar = false
                },
            })
        }
    }

    function deshabilitarEvaluacionesNoIniciadas() {
        Inertia.post(route('convocatorias.evaluaciones.deshabilitar'), {
            preserveScroll: true,
        })
    }

    let form = useForm({
        proyectos_id: null,
        habilitado: '',
        estado: '',
    })
    function submit() {
        if (isSuperAdmin || checkRole(authUser, [20, 18, 19, 5, 17])) {
            $form.post(route('evaluaciones.update.actualizar-estados-evaluaciones'), {
                preserveScroll: true,
            })
        }
    }

    console.log($form.estado)
</script>

<AuthenticatedLayout>
    <Button variant="raised" type="button" on:click={() => deshabilitarEvaluacionesNoIniciadas()}>Deshabilitar evaluaciones no iniciadas</Button>

    <DataTable class="mt-20" bind:filters showFilters={true}>
        <div slot="title">Evaluaciones</div>

        <div slot="caption">
            <InfoMessage>
                <p>En esta sección puede seleccionar varios códigos de proyectos y cambiar el estado de su evaluación al mismo tiempo.</p>
                <form on:submit|preventDefault={submit}>
                    <Tags enforceWhitelist={false} id="proyectos_id" class="mt-4" whitelist={proyectosId} bind:tags={$form.proyectos_id} placeholder="Código(s) SGPS" />

                    <div class="mt-8">
                        <Label labelFor="habilitado" value="¿La evaluación está habilitada? Nota: Una evaluación habilitada significa que el sistema la puede tomar para hacer el cálculo del promedio y asignar el estado del proyecto." class="inline-block mb-4" />
                        <br />
                        <Select id="habilitado" items={estadosHabilitacion} bind:selectedValue={$form.habilitado} placeholder="Seleccione una opción" autocomplete="off" />
                    </div>

                    <div class="mt-8">
                        {#if ($form.estado?.value == 'modificable' && $form.estado?.value != 'finalizado') || $form.estado == ''}
                            <Label labelFor="modificable" value="¿La evaluación es modificable? Nota: Si la evaluación es modificable el evaluador podrá editar la información de la evaluación. Por otro lado el formulador NO podrá modicar la información del proyecto mientras se está realizando una evaluación." class="inline-block mb-4" />
                        {/if}

                        {#if $form.estado?.value == 'finalizado' && $form.estado?.value != 'modificable'}
                            <Label labelFor="finalizado" value="¿La evaluación está finalizada?" class="inline-block mb-4" />
                        {/if}
                        <Select id="estado" items={estados} bind:selectedValue={$form.estado} autocomplete="off" placeholder="Seleccione un estado" />
                    </div>

                    <div class="py-4 flex items-center sticky bottom-0">
                        {#if isSuperAdmin || checkRole(authUser, [20, 18, 19, 5, 17])}
                            <LoadingButton loading={$form.processing} class="ml-auto" type="submit">Actualizar estados de las evaluaciones</LoadingButton>
                        {/if}
                    </div>
                </form>
            </InfoMessage>

            <hr class="my-10 w-full" />
        </div>

        <div slot="filters">
            <label for="year" class="block text-gray-700">Año:</label>
            <select id="year" class="mt-1 w-full form-select" bind:value={filters.year}>
                <option value={null}>Seleccione un año</option>
                <option value="2022">2022</option>
            </select>

            <label for="year" class="block text-gray-700">Estado:</label>
            <select id="year" class="mt-1 w-full form-select" bind:value={filters.estado}>
                <option value={null}>Seleccione un estado</option>
                <option value="finalizados idi">Finalizado I+D+i</option>
                <option value="finalizados ta">Finalizado TA</option>
                <option value="finalizados tp">Finalizado TP</option>
                <option value="finalizados cultura innovacion">Finalizado Cultura innovacion</option>
                <option value="finalizados st">Finalizado ST</option>

                <option value="sin evaluar idi">Sin evaluar I+D+i</option>
                <option value="sin evaluar ta">Sin evaluar TA</option>
                <option value="sin evaluar tp">Sin evaluar TP</option>
                <option value="sin evaluar cultura innovacion">Sin evaluar Cultura innovacion</option>
                <option value="sin evaluar st">Sin evaluar ST</option>
            </select>
        </div>
        <div slot="actions">
            {#if allowedToCreate}
                <Button on:click={() => Inertia.visit(route('evaluaciones.activas'))} variant="raised">Evaluaciones activas</Button>
                <Button on:click={() => Inertia.visit(route('evaluaciones.create'))} variant="raised">Crear evaluación</Button>
            {/if}
        </div>

        <thead slot="thead">
            <tr class="text-left font-bold">
                <th class="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full">Código</th>
                <th class="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full">Título</th>
                <th class="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full">Centro de formación</th>
                <th class="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full">Evaluador</th>
                <th class="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full">Estado evaluación</th>
                <th class="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full">Estado proyecto</th>
                <th class="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl text-center th-actions">Acciones</th>
            </tr>
        </thead>
        <tbody slot="tbody">
            {#each evaluaciones.data as evaluacion}
                <tr class="hover:bg-gray-100 focus-within:bg-gray-100">
                    <td class="border-t">
                        <p class="px-6 py-4 focus:text-app-500">
                            {evaluacion.proyecto.codigo}
                        </p>
                    </td>
                    <td class="border-t">
                        <p class="px-6 py-4">
                            {evaluacion.proyecto.idi
                                ? evaluacion.proyecto.idi.titulo
                                : evaluacion.proyecto.cultura_innovacion
                                ? evaluacion.proyecto.cultura_innovacion.titulo
                                : evaluacion.proyecto.servicio_tecnologico
                                ? evaluacion.proyecto.servicio_tecnologico.titulo
                                : evaluacion.proyecto.tp?.nodo_tecnoparque
                                ? evaluacion.proyecto.tp?.titulo
                                : evaluacion.proyecto.tecnoacademia_lineas_tecnoacademia
                                ? evaluacion.proyecto.tecnoacademia_lineas_tecnoacademia[0]?.tecnoacademia.nombre
                                : null}
                        </p>
                    </td>
                    <td class="border-t">
                        <p class="px-6 py-4">
                            {evaluacion.proyecto.centro_formacion.nombre + ' - Código: ' + evaluacion.proyecto.centro_formacion.codigo}
                        </p>
                    </td>
                    <td class="border-t">
                        <p class="px-6 py-4">
                            {evaluacion.evaluador.nombre}
                        </p>
                    </td>
                    <td class="border-t">
                        <p class="px-6 py-4">
                            <br />
                            {evaluacion.verificar_estado_evaluacion}
                            <br />
                            {evaluacion.habilitado ? 'Habilitada' : 'Deshabilitada'}
                        </p>
                    </td>

                    <td class="border-t">
                        <p class="px-6 py-4">
                            {#if evaluacion.proyecto.estado_evaluacion_idi}
                                {evaluacion.estado_proyecto_por_evaluador?.estado}
                                {#if evaluacion.allowed.to_view}
                                    <br />
                                    <small>
                                        Puntaje: {evaluacion.total_evaluacion}
                                        <br />
                                        Número de recomendaciones: {evaluacion.total_recomendaciones}
                                    </small>
                                {/if}
                            {:else if evaluacion.proyecto.estado_evaluacion_cultura_innovacion}
                                {evaluacion.estado_proyecto_por_evaluador?.estado}
                                {#if evaluacion.allowed.to_view}
                                    <br />
                                    <small>
                                        Puntaje: {evaluacion.total_evaluacion}
                                        <br />
                                        Número de recomendaciones: {evaluacion.total_recomendaciones}
                                    </small>
                                {/if}
                            {:else if evaluacion.proyecto.estado_evaluacion_servicios_tecnologicos}
                                {evaluacion.estado_proyecto_por_evaluador?.estado}
                                {#if evaluacion.allowed.to_view}
                                    <br />
                                    <small>
                                        Puntaje: {evaluacion.total_evaluacion}
                                        <br />
                                        Número de recomendaciones: {evaluacion.total_recomendaciones}
                                    </small>
                                {/if}
                            {:else if evaluacion.proyecto.estado_evaluacion_ta}
                                {evaluacion.proyecto.estado_evaluacion_ta.estado}
                                {#if evaluacion.allowed.to_view}
                                    <small>
                                        Número de recomendaciones: {evaluacion.total_recomendaciones}
                                    </small>
                                {/if}
                            {:else if evaluacion.proyecto.estado_evaluacion_tp}
                                {evaluacion.proyecto.estado_evaluacion_tp.estado}
                                {#if evaluacion.allowed.to_view}
                                    <small>
                                        Número de recomendaciones: {evaluacion.total_recomendaciones}
                                    </small>
                                {/if}
                            {/if}
                        </p>
                    </td>
                    <td class="border-t td-actions">
                        <DataTableMenu class={evaluaciones.data.length < 3 ? 'z-50' : ''}>
                            <Item on:SMUI:action={() => Inertia.visit(route('evaluaciones.edit', evaluacion.id))} disabled={!evaluacion.allowed.to_view} class={!evaluacion.allowed.to_view ? 'hidden' : ''}>
                                <Text>Ver detalles</Text>
                            </Item>

                            <Separator class={!evaluacion.allowed.to_destroy ? 'hidden' : ''} />
                            <Item on:SMUI:action={() => ((evaluacionId = evaluacion.id), (dialogEliminar = true), (allowedToDestroy = evaluacion.allowed.to_destroy))} disabled={!evaluacion.allowed.to_destroy} class={!evaluacion.allowed.to_destroy ? 'hidden' : ''}>
                                <Text>Eliminar</Text>
                            </Item>
                        </DataTableMenu>
                    </td>
                </tr>
            {/each}

            {#if evaluaciones.data.length === 0}
                <tr>
                    <td class="border-t px-6 py-4" colspan="7">Sin información registrada</td>
                </tr>
            {/if}
        </tbody>
    </DataTable>
    <Pagination links={evaluaciones.links} />

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
