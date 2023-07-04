<script>
    import AuthenticatedLayout, { title } from '@/Layouts/Authenticated'
    import { useForm, page } from '@inertiajs/inertia-svelte'
    import { route, checkRole } from '@/Utils'
    import { _ } from 'svelte-i18n'

    import Button from '@/Shared/Button'
    import DataTable from '@/Shared/DataTable'
    import Select from '@/Shared/Select'

    $title = 'Reportes de sistema'

    export let convocatorias
    export let errors

    /**
     * Validar si el usuario autenticado es SuperAdmin
     */
    let authUser = $page.props.auth.user
    let isSuperAdmin = checkRole(authUser, [1])

    let form = useForm({
        _token: $page.props.csrf_token,
        convocatoria: null,
    })

    function downloadReport(report) {
        if (report != null) {
            window.open(route('reportes.' + report, { convocatoria: $form.convocatoria?.value }))
        }
    }
</script>

<AuthenticatedLayout>
    <h1 class="mt-24 mb-8 text-center text-3xl">Reportes de sistema</h1>
    <div class="mb-20">
        <Select id="convocatorias" items={convocatorias} bind:selectedValue={$form.convocatoria} error={errors.convocatoria} autocomplete="off" placeholder="Seleccione una convocatoria" required />
    </div>
    <DataTable class="mt-20" showSearchInput="false">
        <thead slot="thead">
            <tr class="text-left font-bold">
                <th class="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full">Nombre</th>
                <th class="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl text-center th-actions">Acciones</th>
            </tr>
        </thead>
        <tbody slot="tbody">
            <tr class="hover:bg-gray-100 focus-within:bg-gray-100">
                <td class="border-t"><p class="px-6 py-4 focus:text-app-500">Resumen proyectos</p></td>
                <td class="border-t td-actions">
                    {#if $form.convocatoria && (isSuperAdmin || checkRole(authUser, [20, 18, 19, 5, 17]))}
                        <Button variant="raised" on:click={() => downloadReport('resumen-proyectos')}>Descargar</Button>
                    {/if}
                </td>
            </tr>
            <tr class="hover:bg-gray-100 focus-within:bg-gray-100">
                <td class="border-t"><p class="px-6 py-4 focus:text-app-500">Resumen presupuestos y roles SENNOVA</p></td>
                <td class="border-t td-actions">
                    {#if (isSuperAdmin && $form.convocatoria) || checkRole(authUser, [4, 21, 17, 18, 20, 19, 5])}
                        <Button variant="raised" on:click={() => downloadReport('resumePresupuestos')}>Descargar</Button>
                    {/if}
                </td>
            </tr>
            <tr class="hover:bg-gray-100 focus-within:bg-gray-100">
                <td class="border-t">
                    <p class="px-6 py-4 focus:text-app-500">Evaluaciones</p>
                </td>
                <td class="border-t td-actions">
                    {#if (isSuperAdmin && $form.convocatoria) || checkRole(authUser, [20, 18, 19, 5, 17])}
                        <Button variant="raised" on:click={() => downloadReport('evaluaciones')}>Descargar</Button>
                    {/if}
                </td>
            </tr>
            <tr class="hover:bg-gray-100 focus-within:bg-gray-100">
                <td class="border-t"><p class="px-6 py-4 focus:text-app-500">Resumen presupuesto proyecto aprobado</p></td>
                <td class="border-t td-actions">
                    {#if $form.convocatoria && (isSuperAdmin || checkRole(authUser, [20, 18, 19, 5, 17]))}
                        <Button variant="raised" on:click={() => downloadReport('resumeProyectoPresupuestoAprobado')}>Descargar</Button>
                    {/if}
                </td>
            </tr>
            <tr class="hover:bg-gray-100 focus-within:bg-gray-100">
                <td class="border-t"><p class="px-6 py-4 focus:text-app-500">Comentarios evaluaciones</p></td>
                <td class="border-t td-actions">
                    {#if $form.convocatoria && (isSuperAdmin || checkRole(authUser, [20, 18, 19, 5, 17]))}
                        <Button variant="raised" on:click={() => downloadReport('comentarios-evaluaciones')}>Descargar</Button>
                    {/if}
                </td>
            </tr>
            <tr class="hover:bg-gray-100 focus-within:bg-gray-100">
                <td class="border-t"><p class="px-6 py-4 focus:text-app-500">Proyectos TA</p></td>
                <td class="border-t td-actions">
                    {#if $form.convocatoria && (isSuperAdmin || checkRole(authUser, [20, 18, 19, 5, 17]))}
                        <Button variant="raised" on:click={() => downloadReport('proyectos-ta')}>Descargar</Button>
                    {/if}
                </td>
            </tr>

            <tr class="hover:bg-gray-100 focus-within:bg-gray-100">
                <td class="border-t"><p class="px-6 py-4 focus:text-app-500">Proyectos I+D+i</p></td>
                <td class="border-t td-actions">
                    {#if $form.convocatoria && (isSuperAdmin || checkRole(authUser, [20, 18, 19, 5, 17]))}
                        <Button variant="raised" on:click={() => downloadReport('proyectos-idi')}>Descargar</Button>
                    {/if}
                </td>
            </tr>

            <tr class="hover:bg-gray-100 focus-within:bg-gray-100">
                <td class="border-t"><p class="px-6 py-4 focus:text-app-500">Proyectos TP</p></td>
                <td class="border-t td-actions">
                    {#if $form.convocatoria && (isSuperAdmin || checkRole(authUser, [20, 18, 19, 5, 17]))}
                        <Button variant="raised" on:click={() => downloadReport('proyectos-tp')}>Descargar</Button>
                    {/if}
                </td>
            </tr>

            <tr class="hover:bg-gray-100 focus-within:bg-gray-100">
                <td class="border-t"><p class="px-6 py-4 focus:text-app-500">Cultura de innovación</p></td>
                <td class="border-t td-actions">
                    {#if $form.convocatoria && (isSuperAdmin || checkRole(authUser, [20, 18, 19, 5, 17]))}
                        <Button variant="raised" on:click={() => downloadReport('proyectos-cultura-innovacion')}>Descargar</Button>
                    {/if}
                </td>
            </tr>

            <tr class="hover:bg-gray-100 focus-within:bg-gray-100">
                <td class="border-t"><p class="px-6 py-4 focus:text-app-500">Proyectos ST</p></td>
                <td class="border-t td-actions">
                    {#if $form.convocatoria && (isSuperAdmin || checkRole(authUser, [20, 18, 19, 5, 17]))}
                        <Button variant="raised" on:click={() => downloadReport('proyectos-st')}>Descargar</Button>
                    {/if}
                </td>
            </tr>

            <tr class="hover:bg-gray-100 focus-within:bg-gray-100">
                <td class="border-t">
                    <p class="px-6 py-4 focus:text-app-500">Proyectos de capacidad instalada</p>
                </td>
                <td class="border-t td-actions">
                    {#if isSuperAdmin || checkRole(authUser, [20, 18, 19, 5, 17])}
                        <Button variant="raised" on:click={() => downloadReport('proyectos-capacidad-instalada')}>Descargar</Button>
                    {/if}
                </td>
            </tr>

            <tr class="hover:bg-gray-100 focus-within:bg-gray-100">
                <td class="border-t">
                    <p class="px-6 py-4 focus:text-app-500">Grupos, Líneas y Semilleros de investigación</p>
                </td>
                <td class="border-t td-actions">
                    {#if isSuperAdmin || checkRole(authUser, [20, 18, 19, 5, 17])}
                        <Button variant="raised" on:click={() => downloadReport('grupos-lineas-semilleros')}>Descargar</Button>
                    {/if}
                </td>
            </tr>
        </tbody>
    </DataTable>
</AuthenticatedLayout>
