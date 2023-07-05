<script>
    import AuthenticatedLayout, { title } from '@/Layouts/Authenticated'
    import { page } from '@inertiajs/inertia-svelte'
    import { route, checkRole } from '@/Utils'
    import { _ } from 'svelte-i18n'
    import { Inertia } from '@inertiajs/inertia'

    import Pagination from '@/Components/Pagination'
    import DataTableMenu from '@/Components/DataTableMenu'
    import { Item, Text } from '@smui/list'
    import DataTable from '@/Components/DataTable'

    export let convocatoria
    export let evaluaciones

    $title = 'Proyectos I+D+i'

    /**
     * Validar si el usuario autenticado es SuperAdmin
     */
    let authUser = auth.user
    let isSuperAdmin = checkRole(authUser, [1])
</script>

<AuthenticatedLayout>
    <DataTable className="mt-20" routeParams={[convocatoria.id]}>
        <div slot="title">Evaluaciones de proyectos I+D+i</div>

        <thead slot="thead">
            <tr className="text-left font-bold">
                <th className="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full"> Código </th>
                <th className="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full"> Título </th>
                <th className="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full"> Fecha de ejecución </th>
                <th className="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full"> Estado </th>
                <th className="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl text-center th-actions"> Acciones </th>
            </tr>
        </thead>

        <tbody slot="tbody">
            {#each evaluaciones.data as evaluacion}
                <tr className="hover:bg-gray-100 focus-within:bg-gray-100">
                    <td className="border-t">
                        <p className="px-6 py-4 focus:text-app-500">
                            {evaluacion.proyecto.codigo}

                            {#if !evaluacion.habilitado}
                                <span className="block text-danger">Evaluación deshabilitada. No puede realizar la evaluación.</span>
                            {/if}
                        </p>
                    </td>
                    <td className="border-t">
                        <p className="px-6 py-4 focus:text-app-500">
                            {evaluacion.proyecto.idi.titulo}
                        </p>
                    </td>
                    <td className="border-t">
                        <p className="px-6 py-4">
                            {evaluacion.proyecto.idi.fecha_ejecucion}
                        </p>
                    </td>
                    <td className="border-t">
                        <p className="px-6 py-4">
                            {#if convocatoria.fase == 3}
                                El proyecto se encuentra en subsanación
                            {/if}
                            {evaluacion.finalizado ? 'Evaluación finalizada' : evaluacion.iniciado ? 'Evaluación iniciada' : 'Sin evaluar'}
                        </p>
                    </td>
                    <td className="border-t td-actions">
                        <DataTableMenu className={evaluaciones.data.length < 3 ? 'z-50' : ''}>
                            {#if evaluacion.allowed.to_view}
                                <Item on:SMUI:action={() => Inertia.visit(route('convocatorias.idi-evaluaciones.edit', [convocatoria.id, evaluacion.id]))}>
                                    <Text>
                                        {#if evaluacion.allowed.to_update && !isSuperAdmin}
                                            Evaluar
                                        {:else}
                                            Ver detalles
                                        {/if}
                                    </Text>
                                </Item>
                            {/if}
                        </DataTableMenu>
                    </td>
                </tr>
            {/each}

            {#if evaluaciones.data.length === 0}
                <tr>
                    <td className="border-t px-6 py-4" colspan="5"> Sin información registrada </td>
                </tr>
            {/if}
        </tbody>
    </DataTable>
    <Pagination links={evaluaciones.links} />
</AuthenticatedLayout>
