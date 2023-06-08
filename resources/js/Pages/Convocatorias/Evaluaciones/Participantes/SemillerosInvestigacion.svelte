<script>
    import { page } from '@inertiajs/inertia-svelte'
    import { checkRole } from '@/Utils'
    import { _ } from 'svelte-i18n'

    export let proyecto

    /**
     * Validar si el usuario autenticado es SuperAdmin
     */
    let authUser = $page.props.auth.user
    let isSuperAdmin = checkRole(authUser, [1])
</script>

<h1 class="mt-24 mb-8 text-center text-3xl">Semilleros de investigación vinculados</h1>
<div class="bg-white rounded shadow">
    <table class="w-full whitespace-no-wrap table-fixed data-table">
        <thead>
            <tr class="text-left font-bold">
                <th class="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full">Nombre</th>
                <th class="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full">Línea de investigación</th>
                <th class="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full">Grupo de investigación</th>
            </tr>
        </thead>
        <tbody>
            {#each proyecto.semillerosInvestigacion as semilleroInvestigacion (semilleroInvestigacion.id)}
                <tr class="hover:bg-gray-100 focus-within:bg-gray-100">
                    <td class="border-t">
                        <p class="px-6 py-4 focus:text-app-500">
                            {semilleroInvestigacion.nombre}
                        </p>
                    </td>
                    <td class="border-t">
                        <p class="px-6 py-4">
                            {semilleroInvestigacion.linea_investigacion.nombre}
                        </p>
                    </td>
                    <td class="border-t">
                        <p class="px-6 py-4">
                            {semilleroInvestigacion.linea_investigacion.grupo_investigacion.nombre} - {semilleroInvestigacion.linea_investigacion.grupo_investigacion.acronimo}
                        </p>
                    </td>
                </tr>
            {/each}

            {#if proyecto.semillerosInvestigacion.length === 0}
                <tr>
                    <td class="border-t px-6 py-4" colspan="3">{$_('No data recorded')}</td>
                </tr>
            {/if}
        </tbody>
    </table>
</div>
