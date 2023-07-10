<script>
    import AuthenticatedLayout, { title } from '@/Layouts/Authenticated'
    import { inertia, page } from '@inertiajs/inertia-svelte'
    import { route, checkRole, checkPermission } from '@/Utils'
    import { Inertia } from '@inertiajs/inertia'

    import Button from '@/Shared/Button'
    import Dialog from '@/Shared/Dialog'

    let dialogOpen = true
    let allowed = $page.props.allowed

    $title = 'Panel de control'

    let authUser = $page.props.auth.user
    let isSuperAdmin = checkRole(authUser, [1])
</script>

<AuthenticatedLayout>
    <header class="pt-[8rem]" slot="header">
        <div class="flex items-center justify-between lg:px-8 max-w-7xl mx-auto px-4 py-6 sm:px-6">
            <div class="max-w-2xl">
                <h1 class="text-4xl">
                    ¡Bienvenido(a)
                    <span class="capitalize">{$page.props.auth.user.nombre}</span>!
                </h1>
                <div class="mt-2">
                    <p class="text-app-700 font-black text-xs">Roles asociados a su usuario:</p>
                    <div class="flex flex-wrap">
                        {#each $page.props.auth.user.roles as rol}
                            <span class="py-1 px-2 bg-app-500 text-white text-xs rounded-full mr-1 mt-1 capitalize">{rol.name}</span>
                        {/each}
                    </div>
                </div>
                <p class="text-2xl my-8">Formule proyectos de I+D+i, Tecnoacademia-Tecnoparque, Servicios Tecnológicos y/o Cultura de la innovación.</p>

                {#if isSuperAdmin || checkRole(authUser, [11]) || checkPermission(authUser, [1, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 17, 18, 19, 14, 15, 16, 20, 21])}
                    <Button variant="raised" on:click={() => Inertia.visit(route('convocatorias.index'))} class="mt-4 inline-block">Quiero revisar las convocatorias</Button>
                {/if}
            </div>
            <div>
                <figure>
                    <img src={'/images/dashboard.png'} alt="" />
                </figure>
            </div>
        </div>
    </header>
    <div class="py-12">
        <div class="grid grid-cols-3 gap-10">
            {#if isSuperAdmin}
                <a use:inertia class="bg-white overflow-hidden shadow-sm sm:rounded-lg px-6 py-2 hover:bg-app-500 hover:text-white h-52 flex justify-around items-center flex-col" href={route('anexos.index')}>Anexos</a>
            {/if}

            {#if isSuperAdmin}
                <a use:inertia class="bg-white overflow-hidden shadow-sm sm:rounded-lg px-6 py-2 hover:bg-app-500 hover:text-white h-52 flex justify-around items-center flex-col" href={route('centros-formacion.index')}>Centros de formación</a>
            {/if}

            {#if isSuperAdmin || checkRole(authUser, [11]) || checkPermission(authUser, [1, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 17, 18, 19, 14, 15, 16, 20, 21])}
                <a use:inertia class="bg-white overflow-hidden shadow-sm sm:rounded-lg px-6 py-2 hover:bg-app-500 hover:text-white h-52 flex justify-around items-center flex-col" href={route('convocatorias.index')}>Convocatorias</a>
            {/if}

            {#if isSuperAdmin || checkRole(authUser, [20, 18, 19, 5, 17])}
                <a use:inertia class="bg-white overflow-hidden shadow-sm sm:rounded-lg px-6 py-2 hover:bg-app-500 hover:text-white h-52 flex justify-around items-center flex-col" href={route('evaluaciones.index')}>Evaluaciones</a>
            {/if}

            <a use:inertia class="bg-white overflow-hidden shadow-sm sm:rounded-lg px-6 py-2 hover:bg-app-500 hover:text-white h-52 flex justify-around items-center flex-col" href={route('grupos-investigacion.index')}>Grupos, líneas y semilleros de investigación</a>

            {#if isSuperAdmin}
                <a use:inertia class="bg-white overflow-hidden shadow-sm sm:rounded-lg px-6 py-2 hover:bg-app-500 hover:text-white h-52 flex justify-around items-center flex-col" href={route('lineas-programaticas.index')}>Líneas programáticas</a>
            {/if}

            {#if isSuperAdmin || checkRole(authUser.user, [5])}
                <a use:inertia class="bg-white overflow-hidden shadow-sm sm:rounded-lg px-6 py-2 hover:bg-app-500 hover:text-white h-52 flex justify-around items-center flex-col" href={route('lineas-tecnoacademia.index')}>Líneas TecnoAcademia</a>
            {/if}

            {#if isSuperAdmin || checkRole(authUser.user, [17])}
                <a use:inertia class="bg-white overflow-hidden shadow-sm sm:rounded-lg px-6 py-2 hover:bg-app-500 hover:text-white h-52 flex justify-around items-center flex-col" href={route('lineas-tecnoparque.index')}>Líneas Tecnoparque</a>
            {/if}

            {#if isSuperAdmin || checkRole(authUser, [19])}
                <a use:inertia class="bg-white overflow-hidden shadow-sm sm:rounded-lg px-6 py-2 hover:bg-app-500 hover:text-white h-52 flex justify-around items-center flex-col" href={route('lineas-tecnicas.index')}>Líneas técnicas</a>
            {/if}

            {#if isSuperAdmin || checkPermission(authUser, [17])}
                <a use:inertia class="bg-white overflow-hidden shadow-sm sm:rounded-lg px-6 py-2 hover:bg-app-500 hover:text-white h-52 flex justify-around items-center flex-col text-center" href={route('nodos-tecnoparque.index')}>Nodos Tecnoparque</a>
            {/if}

            {#if isSuperAdmin || checkRole(authUser, [4]) || checkPermission(authUser, [8, 17])}
                <a use:inertia class="bg-white overflow-hidden shadow-sm sm:rounded-lg px-6 py-2 hover:bg-app-500 hover:text-white h-52 flex justify-around items-center flex-col text-center" href={route('nuevos-proyectos-ta-tp')}>Nuevos proyectos Tecnoacademia - Tecnoparque</a>
            {/if}

            {#if isSuperAdmin}
                <a use:inertia class="bg-white overflow-hidden shadow-sm sm:rounded-lg px-6 py-2 hover:bg-app-500 hover:text-white h-52 flex justify-around items-center flex-col" href={route('configuracion-presupuesto-sennova')}>Presupuesto SENNOVA</a>
            {/if}

            {#if isSuperAdmin || checkRole(authUser, [4, 21, 20, 18, 19, 5, 17])}
                <a use:inertia class="bg-white overflow-hidden shadow-sm sm:rounded-lg px-6 py-2 hover:bg-app-500 hover:text-white h-52 flex justify-around items-center flex-col" href={route('programas-formacion.index')}>Programas de formación</a>
            {/if}

            {#if isSuperAdmin || checkRole(authUser, [20, 18, 19, 5, 17])}
                <a use:inertia class="bg-white overflow-hidden shadow-sm sm:rounded-lg px-6 py-2 hover:bg-app-500 hover:text-white h-52 flex justify-around items-center flex-col" href={route('proyectos.index')}>Proyectos</a>
            {/if}

            {#if isSuperAdmin || checkRole(authUser, [4, 6]) || checkPermission(authUser, [22])}
                <a use:inertia class="bg-white overflow-hidden shadow-sm sm:rounded-lg px-6 py-2 hover:bg-app-500 hover:text-white h-52 flex justify-around items-center flex-col" href={route('proyectos-capacidad-instalada.index')}>Proyectos de capacidad instalada</a>
            {/if}

            {#if isSuperAdmin || checkRole(authUser, [5, 10, 12, 22])}
                <a use:inertia class="bg-white overflow-hidden shadow-sm sm:rounded-lg px-6 py-2 hover:bg-app-500 hover:text-white h-52 flex justify-around items-center flex-col" href={route('proyectos-idi-tecnoacademia.index')}>Proyectos e iniciativas I+D+i TecnoAcademias</a>
            {/if}

            {#if isSuperAdmin}
                <a use:inertia class="bg-white overflow-hidden shadow-sm sm:rounded-lg px-6 py-2 hover:bg-app-500 hover:text-white h-52 flex justify-around items-center flex-col" href={route('redes-conocimiento.index')}>Redes de conocimiento</a>
            {/if}

            {#if isSuperAdmin}
                <a use:inertia class="bg-white overflow-hidden shadow-sm sm:rounded-lg px-6 py-2 hover:bg-app-500 hover:text-white h-52 flex justify-around items-center flex-col" href={route('regionales.index')}>Regionales</a>
            {/if}

            {#if isSuperAdmin || checkRole(authUser, [20, 18, 19, 5, 17])}
                <a use:inertia class="bg-white overflow-hidden shadow-sm sm:rounded-lg px-6 py-2 hover:bg-app-500 hover:text-white h-52 flex justify-around items-center flex-col" href={route('reportes.index')}>Reportes</a>
            {/if}

            {#if isSuperAdmin}
                <a use:inertia class="bg-white overflow-hidden shadow-sm sm:rounded-lg px-6 py-2 hover:bg-app-500 hover:text-white h-52 flex justify-around items-center flex-col" href={route('roles-sennova.index')}>Roles SENNOVA</a>
            {/if}

            {#if isSuperAdmin}
                <a use:inertia class="bg-white overflow-hidden shadow-sm sm:rounded-lg px-6 py-2 hover:bg-app-500 hover:text-white h-52 flex justify-around items-center flex-col" href={route('roles.index')}>Roles de sistema</a>
            {/if}

            {#if allowed.ambientes_modernizacion}
                <a use:inertia class="bg-white overflow-hidden shadow-sm sm:rounded-lg px-6 py-2 hover:bg-app-500 hover:text-white h-52 flex justify-around items-center flex-col text-center" href={route('ambientes-modernizacion.index')}>Seguimiento post cierre - Ambientes de modernización SENNOVA</a>
            {/if}

            {#if isSuperAdmin || checkRole(authUser, [5])}
                <a use:inertia class="bg-white overflow-hidden shadow-sm sm:rounded-lg px-6 py-2 hover:bg-app-500 hover:text-white h-52 flex justify-around items-center flex-col" href={route('tecnoacademias.index')}>Tecnoacademias</a>
            {/if}

            {#if isSuperAdmin}
                <a use:inertia class="bg-white overflow-hidden shadow-sm sm:rounded-lg px-6 py-2 hover:bg-app-500 hover:text-white h-52 flex justify-around items-center flex-col" href={route('tematicas-estrategicas.index')}>Temáticas estratégicas SENA</a>
            {/if}

            {#if isSuperAdmin || checkRole(authUser, [4, 5, 17, 18, 19, 21])}
                <a use:inertia class="bg-white overflow-hidden shadow-sm sm:rounded-lg px-6 py-2 hover:bg-app-500 hover:text-white h-52 flex justify-around items-center flex-col" href={route('users.index')}>Usuarios</a>
            {/if}
        </div>
    </div>

    <Dialog bind:open={dialogOpen} id="informacion">
        <div slot="title" class="flex items-center flex-col mb-10">Importante</div>
        <div slot="content">
            <small>Junio 8</small>

            <hr class="mt-10 mb-10" />
            <div>
                <p>El CENSO SENNOVA 2023 está habilitado. Por favor haga clic en <strong>Ir al CENSO SENNOVA 2023</strong> para diligenciarlo.</p>
            </div>
        </div>
        <div slot="actions">
            <div class="p-4 flex">
                {#if authUser.informacion_completa}
                    <Button variant="outlined" on:click={() => (dialogOpen = false)}>Ya he completado el CENSO</Button>
                {/if}
                <a use:inertia class="ml-2 overflow-hidden shadow-sm rounded px-6 py-2 bg-app-500 text-white flex justify-around items-center flex-col text-center" href={route('users.perfil')}>Ir al CENSO SENNOVA 2023</a>
            </div>
        </div>
    </Dialog>
</AuthenticatedLayout>
