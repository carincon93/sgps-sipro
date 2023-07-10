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
                            <small>Formulación</small>
                        </a>
                        {#if linea_programatica.codigo == 66 || linea_programatica.codigo == 82 || linea_programatica.codigo == 23}
                            {#if isSuperAdmin || checkRole(authUser, [11, 18])}
                                <a use:inertia href={route('convocatorias.idi-evaluaciones.index', convocatoria.id)} class="bg-app-700 px-6 py-4 shadow-sm rounded-b-lg top-[-4rem] z-[3] transition duration-300 text-center text-white hover:bg-white hover:text-black relative block w-80 mt-2"> Evaluar proyectos </a>
                            {/if}
                        {:else if linea_programatica.codigo == 70}
                            {#if isSuperAdmin || checkRole(authUser, [11, 5])}
                                <a use:inertia href={route('convocatorias.ta-evaluaciones.index', convocatoria.id)} class="bg-app-700 px-6 py-4 shadow-sm rounded-b-lg top-[-4rem] z-[3] transition duration-300 text-center text-white hover:bg-white hover:text-black relative block w-80 mt-2"> Evaluar proyectos </a>
                            {/if}

                        {:else if linea_programatica.codigo == 69}
                            {#if isSuperAdmin || checkRole(authUser, [11, 17])}
                                <a use:inertia href={route('convocatorias.tp-evaluaciones.index', convocatoria.id)} class="bg-app-700 px-6 py-4 shadow-sm rounded-b-lg top-[-4rem] z-[3] transition duration-300 text-center text-white hover:bg-white hover:text-black relative block w-80 mt-2"> Evaluar proyectos </a>
                            {/if}

                        {:else if linea_programatica.codigo == 68}
                            {#if isSuperAdmin || checkRole(authUser, [11, 19])}
                                <a use:inertia href={route('convocatorias.servicios-tecnologicos-evaluaciones.index', convocatoria.id)} class="bg-app-700 px-6 py-4 shadow-sm rounded-b-lg top-[-4rem] z-[3] transition duration-300 text-center text-white hover:bg-white hover:text-black relative block w-80 mt-2"> Evaluar proyectos </a>
                            {/if}
                        {:else if linea_programatica.codigo == 65}
                            {#if isSuperAdmin || checkRole(authUser, [11, 20])}
                                <a use:inertia href={route('convocatorias.cultura-innovacion-evaluaciones.index', convocatoria.id)} class="bg-app-700 px-6 py-4 shadow-sm rounded-b-lg top-[-4rem] z-[3] transition duration-300 text-center text-white hover:bg-white hover:text-black relative block w-80 mt-2"> Evaluar proyectos </a>
                            {/if}
                        {/if}
                    </div>

                {/if}
            {/each}
        </div>
    </div>
</AuthenticatedLayout>
