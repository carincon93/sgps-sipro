<script>
    import AuthenticatedLayout, { title } from '@/Layouts/Authenticated'
    import { page } from '@inertiajs/inertia-svelte'
    import { route, checkRole, checkPermission } from '@/Utils'
    import { _ } from 'svelte-i18n'
    import { Inertia } from '@inertiajs/inertia'

    import Pagination from '@/Components/Pagination'
    import DataTableMenu from '@/Components/DataTableMenu'
    import { Item, Text } from '@smui/list'
    import DataTable from '@/Components/DataTable'

    export let convocatoria
    export let ta

    $title = 'Proyectos Tecnoacademia'

    /**
     * Validar si el usuario autenticado es SuperAdmin
     */
    let auth_user = auth.user
    let is_super_admin = checkRole(auth_user, [1])
</script>

<AuthenticatedLayout>
    <DataTable className="mt-20" routeParams={[convocatoria.id]}>
        <div slot="title">Evaluaciones de proyectos de Tecnoacademia</div>

        <thead slot="thead">
            <tr className="text-left font-bold">
                <th className="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full"> Código </th>
                <th className="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full"> Teacnoacademia </th>
                <th className="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full"> Fecha de ejecución </th>
                <th className="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full"> Estado </th>
                {#if checkRole(auth_user, [5])}
                    <th className="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full"> Evaluador </th>
                {/if}
                <th className="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl text-center th-actions"> Acciones </th>
            </tr>
        </thead>

        <tbody slot="tbody">
            {#each ta.data as { evaluacion_id, nombre_user, proyecto, fecha_ejecucion, iniciado, habilitado, finalizado, evaluacion_final }}
                <tr className="hover:bg-gray-100 focus-within:bg-gray-100">
                    <td className="border-t">
                        <p className="px-6 py-4 focus:text-app-500">
                            {proyecto.codigo}

                            {#if evaluacion_final}
                                <span className="block text-danger"> Evaluación final </span>
                            {/if}

                            {#if !habilitado}
                                <span className="block text-danger">Evaluación deshabilitada. No puede realizar la evaluación.</span>
                            {/if}
                        </p>
                    </td>
                    <td className="border-t">
                        <p className="px-6 py-4 focus:text-app-500">
                            {proyecto.tecnoacademia_lineas_tecnoacademia[0]?.tecnoacademia.nombre}
                        </p>
                    </td>
                    <td className="border-t">
                        <p className="px-6 py-4">
                            {fecha_ejecucion}
                        </p>
                    </td>
                    <td className="border-t">
                        <p className="px-6 py-4">
                            {#if convocatoria.fase == 3}
                                El proyecto se encuentra en subsanación
                            {/if}
                            {finalizado ? 'Evaluación finalizada' : iniciado ? 'Evaluación iniciada' : 'Sin evaluar'}
                        </p>
                    </td>
                    {#if checkRole(auth_user, [5])}
                        <td className="border-t">
                            <p className="px-6 py-4">
                                {nombre_user}
                            </p>
                        </td>
                    {/if}

                    <td className="border-t td-actions">
                        <DataTableMenu className={ta.data.length < 3 ? 'z-50' : ''}>
                            {#if is_super_admin || checkRole(auth_user, [11, 5])}
                                <Item on:SMUI:action={() => Inertia.visit(route('convocatorias.ta-evaluaciones.edit', [convocatoria.id, evaluacion_id]))}>
                                    <Text>
                                        {#if checkRole(auth_user, [5])}
                                            Verificar
                                        {:else}
                                            Evaluar
                                        {/if}
                                    </Text>
                                </Item>
                            {/if}
                        </DataTableMenu>
                    </td>
                </tr>
            {/each}

            {#if ta.data.length === 0}
                <tr>
                    <td className="border-t px-6 py-4" colspan="5"> Sin información registrada </td>
                </tr>
            {/if}
        </tbody>
    </DataTable>
    <Pagination links={ta.links} />
</AuthenticatedLayout>
