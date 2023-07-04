<script>
    import { page } from '@inertiajs/inertia-svelte'
    import { checkRole } from '@/Utils'
    import { _ } from 'svelte-i18n'

    export let proyecto

    /**
     * Validar si el usuario autenticado es SuperAdmin
     */
    let authUser = $auth.user
    let isSuperAdmin = checkRole(authUser, [1])
</script>

<h1 className="mt-24 mb-8 text-center text-3xl">Programas de formación vinculados</h1>
<div className="bg-white rounded shadow">
    <table className="w-full whitespace-no-wrap table-fixed data-table">
        <thead>
            <tr className="text-left font-bold">
                <th className="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full">Código</th>
                <th className="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full">Nombre</th>
                <th className="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full">Tipo</th>
                <th className="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full">Centro de formación</th>
                <th className="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full">Regional</th>
            </tr>
        </thead>
        <tbody>
            {#each proyecto.programasFormacion as programaFormacion (programaFormacion.id)}
                <tr className="hover:bg-gray-100 focus-within:bg-gray-100">
                    <td className="border-t">
                        <p className="px-6 py-4 focus:text-app-500">
                            {programaFormacion.codigo}
                        </p>
                    </td>
                    <td className="border-t">
                        <p className="px-6 py-4">
                            {programaFormacion.nombre}
                        </p>
                    </td>
                    <td className="border-t">
                        <p className="px-6 py-4">
                            {programaFormacion.modalidad}
                        </p>
                    </td>
                    <td className="border-t">
                        <p className="px-6 py-4">
                            {programaFormacion.centro_formacion.nombre}
                        </p>
                    </td>
                    <td className="border-t">
                        <p className="px-6 py-4">
                            {programaFormacion.centro_formacion.regional.nombre}
                        </p>
                    </td>
                </tr>
            {/each}

            {#if proyecto.programasFormacion.length === 0}
                <tr>
                    <td className="border-t px-6 py-4" colspan="5">{$_('No data recorded')}</td>
                </tr>
            {/if}
        </tbody>
    </table>
</div>
