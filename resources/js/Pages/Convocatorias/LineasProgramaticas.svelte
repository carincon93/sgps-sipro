<script>
    import AuthenticatedLayout, { title } from '@/Layouts/Authenticated'
    import { inertia, page } from '@inertiajs/inertia-svelte'
    import { route, checkRole, checkPermission } from '@/Utils'
    import { _ } from 'svelte-i18n'

    export let convocatoria
    export let lineas_programaticas

    let authUser = $page.props.auth.user
    let isSuperAdmin = checkRole(authUser, [1])

    $title = 'Convocatorias - Dashboard'
</script>

<AuthenticatedLayout>
    <div class="py-12">
        <h1 class="text-4xl text-center">
            A continuación, se listan las líneas programáticas de la vigencia {convocatoria.year} en las que puede formular proyectos.
        </h1>
        <div class="flex justify-around flex-wrap mt-24 gap-4 mb-12">
            {#each lineas_programaticas as linea_programatica}
                {#if JSON.parse(convocatoria.lineas_programaticas_activas)?.includes(linea_programatica.id)}
                    <div class="w-80 h-96">
                        <a use:inertia href={route('convocatorias.lineas-programaticas.proyectos', [convocatoria.id, linea_programatica.id])} class="bg-white overflow-hidden z-[2] relative text-center shadow-sm sm:rounded-lg px-6 py-2 hover:bg-app-500 hover:text-white flex justify-around items-center flex-col m-auto h-96">
                            {linea_programatica.nombre}
                        </a>
                    </div>
                {/if}
            {/each}
        </div>
    </div>
</AuthenticatedLayout>
