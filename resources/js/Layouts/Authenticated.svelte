<script context="module">
    import { writable } from 'svelte/store'
    export const title = writable(null)
    export const permissions = writable(null)
</script>

<script>
    import { Inertia } from '@inertiajs/inertia'
    import { inertia, page } from '@inertiajs/inertia-svelte'
    import { route, checkRole, checkPermission } from '@/Utils'
    import { _ } from 'svelte-i18n'
    import { onMount } from 'svelte'
    import moment from 'moment'

    import ApplicationLogo from '@/Shared/ApplicationLogo'
    import Dropdown from '@/Shared/Dropdown'
    import Icon from '@/Shared/Icon'
    import ResponsiveNavLink from '@/Shared/ResponsiveNavLink'
    import FlashMessages from '@/Shared/FlashMessages'
    import Dialog from '@/Shared/Dialog'
    import Button from '@/Shared/Button'
    import Loading from '@/Shared/Loading'
    import DataTableMenu from '@/Shared/DataTableMenu'
    import { Item, Text } from '@smui/list'

    let dialogMenuNavegacion = false
    let dialogNotificationes = false
    let dialogSoporte = false
    let showingNavigationDropdown = false

    let authUser = $page.props.auth
    let isSuperAdmin = checkRole(authUser.user, [1])

    let loading = true
    Inertia.on('start', () => {
        loading = false
    })
    Inertia.on('finish', () => {
        loading = true
    })

    let body = document.getElementById('body')
    onMount(() => {
        body.classList.remove('mdc-dialog-scroll-lock')
    })

    let allowed = $page.props.allowed
</script>

<svelte:head>
    <title>{$title ? `${$title} - SGPS-SIPRO` : 'SGPS-SIPRO'}</title>
</svelte:head>

<div class="min-h-screen app-wrapper">
    <nav class="fixed top-0 left-0 right-0 z-[9999]">
        <!-- Primary Navigation Menu -->
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 rounded-full" style="margin: 10px auto; backdrop-filter: blur(5px); background-color: rgb(255 255 255 / 65%);">
            <div class="flex justify-between h-16">
                <div class="flex">
                    <!-- Logo -->
                    <div class="flex-shrink-0 flex items-center">
                        <a use:inertia href={route('dashboard')}>
                            <ApplicationLogo />
                        </a>
                    </div>

                    <!-- Navigation Links -->
                    <div class="hidden space-x-8 sm:-my-px sm:ml-10 sm:flex sm:items-center">
                        <Button on:click={() => (dialogMenuNavegacion = true)} variant={null}>Menú de navegación</Button>
                    </div>
                </div>

                <div class="hidden sm:flex sm:items-center sm:ml-6">
                    <!-- Settings Dropdown -->
                    <div class="mr-5 ml-5 relative">
                        <button on:click={() => (dialogNotificationes = true)} class="flex items-center hover:text-app-600 {authUser.numeroNotificaciones > 0 ? 'tada' : ''}">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                            </svg>
                            {#if authUser.numeroNotificaciones > 0}
                                <span class="absolute bg-app-500 flex h-5/6 items-center justify-center rounded-full text-center text-white text-xs w-5/6" style="top: -10px; left: 10px;">{authUser.numeroNotificaciones}</span>
                            {/if}
                        </button>
                    </div>
                    <div class="ml-3 relative">
                        <Dropdown class="mt-1" placement="bottom-end">
                            <div class="flex items-center cursor-pointer select-none group">
                                <div class="text-gray-700 group-hover:text-app-600 focus:text-app-600 mr-1 whitespace-no-wrap">
                                    <span class="capitalize">{authUser.user.nombre}</span>
                                </div>
                                <Icon name="cheveron-down" class="w-5 h-5 group-hover:fill-app-600 fill-gray-700 focus:fill-app-600" />
                            </div>
                            <div slot="dropdown" class="mt-2 py-2 shadow-xl bg-white rounded text-sm">
                                <div class="flex items-center px-6 py-2 hover:bg-app-500 hover:text-white">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" style="flex-basis: 20px;" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                                    </svg>
                                    <span class="ml-1.5"><a href="mailto:sgpssipro@sena.edu.co">sgpssipro@sena.edu.co</a></span>
                                </div>

                                <a use:inertia href={route('users.perfil')} class="flex items-center px-6 py-2 hover:bg-app-500 hover:text-white">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" style="flex-basis: 20px;" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span class="ml-1.5">Perfil</span>
                                </a>

                                <a use:inertia={{ method: 'post' }} href={route('logout')} class="flex items-center px-6 py-2 hover:bg-app-500 hover:text-white">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fill-rule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clip-rule="evenodd" />
                                    </svg>
                                    <span class="ml-1.5">{$_('Logout')}</span>
                                </a>
                            </div>
                        </Dropdown>
                    </div>
                </div>
            </div>
        </div>

        <!-- Responsive Navigation Menu -->
        <div class="sm:hidden{(showingNavigationDropdown ? ' block' : '', !showingNavigationDropdown ? ' hidden' : '')}">
            <div class="pt-2 pb-3 space-y-1">
                <ResponsiveNavLink href={route('dashboard')} active={route().current('dashboard')}>Menú de navegación</ResponsiveNavLink>
            </div>

            <!-- Responsive Settings Options -->
            <div class="pt-4 pb-1 border-t border-gray-200">
                <div class="flex items-center px-4">
                    <div class="font-medium text-base text-gray-800">
                        {authUser.user.name}
                    </div>
                    <div class="font-medium text-sm text-gray-500">
                        {authUser.user.email}
                    </div>
                </div>

                <div class="mt-3 space-y-1">
                    <ResponsiveNavLink href={route('logout')} method="post" as="button">
                        {$_('Logout')}
                    </ResponsiveNavLink>
                </div>
            </div>
        </div>
    </nav>

    <div class="main">
        <div class="gradient" />
    </div>

    <!-- Page Heading -->
    {#if $$slots.header}
        <slot name="header" />
    {/if}

    <!-- Page Content -->
    <main class="lg:px-8 max-w-7xl !pt-[5rem] relative z-10 md:p-12 mx-auto px-4 py-8 sm:px-6">
        <FlashMessages />
        <Loading {loading} />
        <slot />

        <!-- <button class="bg-app-600 bottom-4 fixed left-3 p-3 rounded-full text-white flex tada" type="button" on:click={() => (dialogSoporte = true)}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M16.712 4.33a9.027 9.027 0 011.652 1.306c.51.51.944 1.064 1.306 1.652M16.712 4.33l-3.448 4.138m3.448-4.138a9.014 9.014 0 00-9.424 0M19.67 7.288l-4.138 3.448m4.138-3.448a9.014 9.014 0 010 9.424m-4.138-5.976a3.736 3.736 0 00-.88-1.388 3.737 3.737 0 00-1.388-.88m2.268 2.268a3.765 3.765 0 010 2.528m-2.268-4.796a3.765 3.765 0 00-2.528 0m4.796 4.796c-.181.506-.475.982-.88 1.388a3.736 3.736 0 01-1.388.88m2.268-2.268l4.138 3.448m0 0a9.027 9.027 0 01-1.306 1.652c-.51.51-1.064.944-1.652 1.306m0 0l-3.448-4.138m3.448 4.138a9.014 9.014 0 01-9.424 0m5.976-4.138a3.765 3.765 0 01-2.528 0m0 0a3.736 3.736 0 01-1.388-.88 3.737 3.737 0 01-.88-1.388m2.268 2.268L7.288 19.67m0 0a9.024 9.024 0 01-1.652-1.306 9.027 9.027 0 01-1.306-1.652m0 0l4.138-3.448M4.33 16.712a9.014 9.014 0 010-9.424m4.138 5.976a3.765 3.765 0 010-2.528m0 0c.181-.506.475-.982.88-1.388a3.736 3.736 0 011.388-.88m-2.268 2.268L4.33 7.288m6.406 1.18L7.288 4.33m0 0a9.024 9.024 0 00-1.652 1.306A9.025 9.025 0 004.33 7.288"
                />
            </svg>

            <span class="ml-2 hover:cursor-pointer font-black">Nuevo formulario de soporte</span>
        </button> -->

        <a href="https://forms.office.com/r/6206w44sM4" target="_blank" class="bg-app-600 bottom-4 fixed left-3 p-3 rounded-full text-white flex tada">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M16.712 4.33a9.027 9.027 0 011.652 1.306c.51.51.944 1.064 1.306 1.652M16.712 4.33l-3.448 4.138m3.448-4.138a9.014 9.014 0 00-9.424 0M19.67 7.288l-4.138 3.448m4.138-3.448a9.014 9.014 0 010 9.424m-4.138-5.976a3.736 3.736 0 00-.88-1.388 3.737 3.737 0 00-1.388-.88m2.268 2.268a3.765 3.765 0 010 2.528m-2.268-4.796a3.765 3.765 0 00-2.528 0m4.796 4.796c-.181.506-.475.982-.88 1.388a3.736 3.736 0 01-1.388.88m2.268-2.268l4.138 3.448m0 0a9.027 9.027 0 01-1.306 1.652c-.51.51-1.064.944-1.652 1.306m0 0l-3.448-4.138m3.448 4.138a9.014 9.014 0 01-9.424 0m5.976-4.138a3.765 3.765 0 01-2.528 0m0 0a3.736 3.736 0 01-1.388-.88 3.737 3.737 0 01-.88-1.388m2.268 2.268L7.288 19.67m0 0a9.024 9.024 0 01-1.652-1.306 9.027 9.027 0 01-1.306-1.652m0 0l4.138-3.448M4.33 16.712a9.014 9.014 0 010-9.424m4.138 5.976a3.765 3.765 0 010-2.528m0 0c.181-.506.475-.982.88-1.388a3.736 3.736 0 011.388-.88m-2.268 2.268L4.33 7.288m6.406 1.18L7.288 4.33m0 0a9.024 9.024 0 00-1.652 1.306A9.025 9.025 0 004.33 7.288"
                />
            </svg>

            <span class="ml-2 hover:cursor-pointer font-black">Nuevo formulario de soporte</span>
        </a>
    </main>
</div>

<!-- Dialog -->
<Dialog bind:open={dialogMenuNavegacion} id="main-menu" fullscreen>
    <div slot="title" class="mb-6 text-center text-app-600">
        <div class="">Menú de navegación</div>
    </div>
    <div slot="content">
        <div class="grid grid-cols-3 gap-5 p-8">
            {#if isSuperAdmin}
                <Button on:click={() => Inertia.visit(route('anexos.index'))} variant={route().current('anexos.*') ? 'raised' : 'outlined'} class="p-2">Anexos</Button>
            {/if}

            {#if isSuperAdmin}
                <Button on:click={() => Inertia.visit(route('centros-formacion.index'))} variant={route().current('centros-formacion.*') ? 'raised' : 'outlined'} class="p-2">Centros de formación</Button>
            {/if}

            {#if isSuperAdmin || checkRole(authUser.user, [11]) || checkPermission(authUser.user, [1, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 17, 18, 19, 14, 15, 16, 20, 21])}
                <Button on:click={() => Inertia.visit(route('convocatorias.index'))} variant={route().current('convocatorias.*') ? 'raised' : 'outlined'} class="p-2">Convocatorias</Button>
            {/if}

            {#if isSuperAdmin || checkRole(authUser.user, [20, 18, 19, 5, 17])}
                <Button on:click={() => Inertia.visit(route('evaluaciones.index'))} variant={route().current('evaluaciones.*') ? 'raised' : 'outlined'} class="p-2">Evaluaciones</Button>
            {/if}

            <Button on:click={() => Inertia.visit(route('grupos-investigacion.index'))} variant={route().current('grupos-investigacion.*') ? 'raised' : 'outlined'} class="p-2">Grupos, líneas y semilleros de investigación</Button>

            {#if isSuperAdmin}
                <Button on:click={() => Inertia.visit(route('lineas-programaticas.index'))} variant={route().current('lineas-programaticas.*') ? 'raised' : 'outlined'} class="p-2">Líneas programáticas</Button>
            {/if}

            {#if isSuperAdmin || checkRole(authUser.user, [19])}
                <Button on:click={() => Inertia.visit(route('lineas-tecnicas.index'))} variant={route().current('lineas-tecnicas.*') ? 'raised' : 'outlined'} class="p-2">Líneas técnicas</Button>
            {/if}

            {#if isSuperAdmin || checkRole(authUser.user, [5])}
                <Button on:click={() => Inertia.visit(route('lineas-tecnoacademia.index'))} variant={route().current('lineas-tecnoacademia.*') ? 'raised' : 'outlined'} class="p-2">Líneas TecnoAcademia</Button>
            {/if}

            {#if isSuperAdmin || checkRole(authUser.user, [17])}
                <Button on:click={() => Inertia.visit(route('lineas-tecnoparque.index'))} variant={route().current('lineas-parque.*') ? 'raised' : 'outlined'} class="p-2">Líneas Tecnoparque</Button>
            {/if}

            {#if isSuperAdmin || checkPermission(authUser.user, [17])}
                <Button on:click={() => Inertia.visit(route('nodos-tecnoparque.index'))} variant={route().current('nodos-tecnoparque') ? 'raised' : 'outlined'} class="p-2">Nodos Tecnoparque</Button>
            {/if}

            {#if isSuperAdmin || checkRole(authUser.user, [4]) || checkPermission(authUser.user, [8, 17])}
                <Button on:click={() => Inertia.visit(route('convocatorias.index'))} variant={route().current('convocatorias.index') ? 'raised' : 'outlined'} class="p-2">Nuevos proyectos Tecnoacademia - Tecnoparque</Button>
            {/if}

            {#if isSuperAdmin}
                <Button on:click={() => Inertia.visit(route('configuracion-presupuesto-sennova'))} variant={route().current('configuracion-presupuesto-sennova.*') ? 'raised' : 'outlined'} class="p-2">Presupuesto SENNOVA</Button>
            {/if}

            {#if isSuperAdmin || checkRole(authUser.user, [4, 21, 20, 18, 19, 5, 17])}
                <Button on:click={() => Inertia.visit(route('programas-formacion.index'))} variant={route().current('programas-formacion.*') ? 'raised' : 'outlined'} class="p-2">Programas de formación</Button>
            {/if}

            {#if isSuperAdmin || checkRole(authUser.user, [20, 18, 19, 5, 17])}
                <Button on:click={() => Inertia.visit(route('proyectos.index'))} variant={route().current('proyectos.*') ? 'raised' : 'outlined'} class="p-2">Proyectos</Button>
            {/if}

            {#if isSuperAdmin || checkRole(authUser.user, [4, 6]) || checkPermission(authUser.user, [22])}
                <Button on:click={() => Inertia.visit(route('proyectos-capacidad-instalada.index'))} variant={route().current('proyectos-capacidad-instalada.*') ? 'raised' : 'outlined'} class="p-2">Proyectos de capacidad instalada</Button>
            {/if}

            {#if isSuperAdmin || checkRole(authUser.user, [5, 10, 12, 22])}
                <Button on:click={() => Inertia.visit(route('proyectos-idi-tecnoacademia.index'))} variant={route().current('proyectos-idi-tecnoacademia.*') ? 'raised' : 'outlined'} class="p-2">Proyectos e iniciativas I+D+i TecnoAcademias</Button>
            {/if}

            {#if isSuperAdmin}
                <Button on:click={() => Inertia.visit(route('redes-conocimiento.index'))} variant={route().current('redes-conocimiento.*') ? 'raised' : 'outlined'} class="p-2">Redes de conocimiento</Button>
            {/if}

            {#if isSuperAdmin}
                <Button on:click={() => Inertia.visit(route('regionales.index'))} variant={route().current('regionales.*') ? 'raised' : 'outlined'} class="p-2">Regionales</Button>
            {/if}

            {#if isSuperAdmin || checkRole(authUser.user, [20, 18, 19, 5, 17])}
                <Button on:click={() => Inertia.visit(route('reportes.index'))} variant={route().current('reportes.*') ? 'raised' : 'outlined'} class="p-2">Reportes</Button>
            {/if}

            {#if isSuperAdmin}
                <Button on:click={() => Inertia.visit(route('roles-sennova.index'))} variant={route().current('roles-sennova.*') ? 'raised' : 'outlined'} class="p-2">Roles SENNOVA</Button>
            {/if}

            {#if isSuperAdmin}
                <Button on:click={() => Inertia.visit(route('roles.index'))} variant={route().current('roles.*') ? 'raised' : 'outlined'} class="p-2">Roles de sistema</Button>
            {/if}

            {#if allowed.ambientes_modernizacion}
                <Button on:click={() => Inertia.visit(route('ambientes-modernizacion.index'))} variant={route().current('ambientes-modernizacion.*') ? 'raised' : 'outlined'} class="p-2">Seguimiento post cierre - Ambientes de modernización SENNOVA</Button>
            {/if}

            {#if isSuperAdmin || checkRole(authUser.user, [5])}
                <Button on:click={() => Inertia.visit(route('tecnoacademias.index'))} variant={route().current('tecnoacademias.*') ? 'raised' : 'outlined'} class="p-2">Tecnoacademias</Button>
            {/if}

            {#if isSuperAdmin}
                <Button on:click={() => Inertia.visit(route('tematicas-estrategicas.index'))} variant={route().current('tematicas-estrategicas.*') ? 'raised' : 'outlined'} class="p-2">Temáticas estratégicas SENA</Button>
            {/if}

            {#if isSuperAdmin || checkRole(authUser.user, [4, 21, 18, 19, 5, 17])}
                <Button on:click={() => Inertia.visit(route('users.index'))} variant={route().current('users.*') ? 'raised' : 'outlined'} class="p-2">Usuarios</Button>
            {/if}
        </div>
    </div>
    <div slot="actions">
        <div class="p-4">
            <Button on:click={() => (dialogMenuNavegacion = false)} variant={null}>Cancelar</Button>
        </div>
    </div>
</Dialog>

<Dialog bind:open={dialogSoporte} id="soporte" fullscreen hexBgColor="#97c7c9">
    <div slot="title" class="mb-6 text-center text-app-600">
        <div class="text-white mb-3">Soporte</div>
        <img src="/images/notifications.png" alt="" class="w-80 mx-auto" />
    </div>
    <div slot="content" class="text-white scrollbar style-scrollbar">
        <div>
            <!-- <iframe title="Formulario de retroalimentación" width="100%" height="500px" src="https://forms.office.com/r/6206w44sM4?embed=true" frameborder="0" marginwidth="0" marginheight="0" style="border: none; max-width:100%; max-height:100vh" allowfullscreen webkitallowfullscreen mozallowfullscreen msallowfullscreen /> -->
        </div>
    </div>
    <div slot="actions">
        <div class="p-4">
            <Button on:click={() => (dialogSoporte = false)} class="!text-white !border-white hover:opacity-90 transition-all" variant="outlined">Cancelar</Button>
        </div>
    </div>
</Dialog>

<Dialog bind:open={dialogNotificationes} id="notificaciones" fullscreen hexBgColor="#97c7c9">
    <div slot="title" class="mb-6 text-center text-app-600">
        <div class="text-white mb-3">Notificaciones recientes</div>
        <img src="/images/notifications.png" alt="" class="w-80 mx-auto" />
    </div>
    <div slot="content" class="text-white scrollbar style-scrollbar">
        <div>
            <ul class="divide-y">
                {#each authUser.notificaciones as notificacion}
                    <li class="flex justify-between py-4">
                        <div>
                            {notificacion.data.message}
                            <br />
                            <small class="mr-2">{moment(notificacion.created_at).locale('es').fromNow()}</small>
                        </div>
                        <DataTableMenu style="color: #fff">
                            {#if notificacion.data.action}
                                <Item on:SMUI:action={() => Inertia.visit('/' + notificacion.data.action)}>
                                    <Text>Ver detalles</Text>
                                </Item>
                            {:else}
                                <Item>
                                    <Text>No hay acciones disponibles</Text>
                                </Item>
                            {/if}
                        </DataTableMenu>
                    </li>
                {/each}
            </ul>
            <div class="flex items-center justify-center">
                <Button on:click={() => Inertia.visit(route('notificaciones.index'))} class="!text-white !border-white hover:opacity-90 transition-all" variant="outlined">Administrar todas las notificaciones</Button>
            </div>
        </div>
    </div>
    <div slot="actions">
        <div class="p-4">
            <Button on:click={() => (dialogNotificationes = false)} class="!text-white !border-white hover:opacity-90 transition-all" variant="outlined">Cancelar</Button>
        </div>
    </div>
</Dialog>

<style>
    .tada {
        -webkit-animation: tada 2.5s ease infinite;
        animation: tada 2.5s ease infinite;
    }

    @-webkit-keyframes tada {
        from {
            -webkit-transform: scale3d(1, 1, 1);
            transform: scale3d(1, 1, 1);
        }
        10%,
        20% {
            -webkit-transform: scale3d(0.95, 0.95, 0.95) rotate3d(0, 0, 1, -2deg);
            transform: scale3d(0.95, 0.95, 0.95) rotate3d(0, 0, 1, -2deg);
        }
        30%,
        50%,
        70%,
        90% {
            -webkit-transform: scale3d(1, 1, 1) rotate3d(0, 0, 1, 2deg);
            transform: scale3d(1, 1, 1) rotate3d(0, 0, 1, 2deg);
        }
        40%,
        60%,
        80% {
            -webkit-transform: scale3d(1, 1, 1) rotate3d(0, 0, 1, -2deg);
            transform: scale3d(1, 1, 1) rotate3d(0, 0, 1, -2deg);
        }
        to {
            -webkit-transform: scale3d(1, 1, 1);
            transform: scale3d(1, 1, 1);
        }
    }
    @keyframes tada {
        from {
            -webkit-transform: scale3d(1, 1, 1);
            transform: scale3d(1, 1, 1);
        }
        10%,
        20% {
            -webkit-transform: scale3d(0.95, 0.95, 0.95) rotate3d(0, 0, 1, -2deg);
            transform: scale3d(0.95, 0.95, 0.95) rotate3d(0, 0, 1, -2deg);
        }
        30%,
        50%,
        70%,
        90% {
            -webkit-transform: scale3d(1, 1, 1) rotate3d(0, 0, 1, 2deg);
            transform: scale3d(1, 1, 1) rotate3d(0, 0, 1, 2deg);
        }
        40%,
        60%,
        80% {
            -webkit-transform: rotate3d(0, 0, 1, -2deg);
            transform: rotate3d(0, 0, 1, -2deg);
        }
        to {
            -webkit-transform: scale3d(1, 1, 1);
            transform: scale3d(1, 1, 1);
        }
    }
</style>
