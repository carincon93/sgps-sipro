<script>
    import AuthenticatedLayout, { title } from '@/Layouts/Authenticated'
    import { inertia, page } from '@inertiajs/inertia-svelte'
    import { route, checkRole, checkPermission } from '@/Utils'
    import { _ } from 'svelte-i18n'

    export let convocatoria

    let authUser = $page.props.auth.user
    let isSuperAdmin = checkRole(authUser, [1])

    $title = 'Convocatorias - Dashboard'
</script>

<AuthenticatedLayout>
    <div class="py-12">
        {#if isSuperAdmin || checkPermission(authUser, [8, 17])}
            <h1 class="text-4xl text-center">A continuación, se listan las líneas programáticas dónde está habilitado(a) para formular proyectos.</h1>
            <div class="flex justify-around mt-24 gap-4">
                {#if isSuperAdmin || (checkPermission(authUser, [8]) && convocatoria.tipo_convocatoria == 3)}
                    <a use:inertia href={route('convocatorias.ta.index', convocatoria.id)} class="bg-white overflow-hidden text-center shadow-sm sm:rounded-lg px-6 py-2 hover:bg-app-500 hover:text-white flex justify-around items-center flex-col w-80 h-96">
                        <figure>
                            <img src={'/images/ta.png'} alt="Línea programática - Tecnoacademia" class="bg-white h-44 w-44 object-contain rounded-full" />
                        </figure>
                        Tecnoacademia
                    </a>
                {/if}

                {#if isSuperAdmin || (checkPermission(authUser, [17]) && convocatoria.tipo_convocatoria == 3)}
                    <a use:inertia href={route('convocatorias.tp.index', convocatoria.id)} class="bg-white overflow-hidden text-center shadow-sm sm:rounded-lg px-6 py-2 hover:bg-app-500 hover:text-white flex justify-around items-center flex-col w-80 h-96">
                        <figure>
                            <img src={'/images/tp.png'} alt="Línea programática - Tecnoparque" class="bg-white h-44 w-44 object-contain rounded-full" />
                        </figure>
                        Tecnoparque
                    </a>
                {/if}
            </div>
        {/if}

        {#if isSuperAdmin || (checkRole(authUser, [11, 5, 20, 19, 18]) && convocatoria.tipo_convocatoria == 1) || (checkRole(authUser, [11, 5, 20, 19, 18]) && convocatoria.tipo_convocatoria == 3)}
            <hr class="mt-20 mb-20" />
            <h1 class="text-4xl text-center" id="evaluacion">A continuación, se listan las líneas programáticas dónde puede realizar las respectivas evaluaciones.</h1>
            <div class="flex justify-around mt-24 gap-4">
                {#if isSuperAdmin || checkRole(authUser, [11, 5])}
                    <a use:inertia href={route('convocatorias.ta-evaluaciones.index', convocatoria.id)} class="bg-white overflow-hidden text-center shadow-sm sm:rounded-lg px-6 py-2 hover:bg-app-500 hover:text-white flex justify-around items-center flex-col w-80 h-96">
                        <figure>
                            <img src={'/images/evata.png'} alt="Línea programática - Tecnoacademia" class="bg-white h-44 w-44 object-contain rounded-full" />
                        </figure>
                        Tecnoacademia
                    </a>
                {/if}

                {#if isSuperAdmin || checkRole(authUser, [11, 17])}
                    <a use:inertia href={route('convocatorias.tp-evaluaciones.index', convocatoria.id)} class="bg-white overflow-hidden text-center shadow-sm sm:rounded-lg px-6 py-2 hover:bg-app-500 hover:text-white flex justify-around items-center flex-col w-80 h-96">
                        <figure>
                            <img src={'/images/evatp.png'} alt="Línea programática - Tecnoparque" class="bg-white h-44 w-44 object-contain rounded-full" />
                        </figure>
                        Tecnoparque
                    </a>
                {/if}
            </div>
        {/if}
    </div>
</AuthenticatedLayout>
