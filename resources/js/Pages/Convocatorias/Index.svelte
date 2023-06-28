<script>
    import AuthenticatedLayout, { title } from '@/Layouts/Authenticated'
    import { Inertia } from '@inertiajs/inertia'
    import { inertia, page, useForm } from '@inertiajs/inertia-svelte'
    import { route, checkRole, checkPermission } from '@/Utils'
    import { _ } from 'svelte-i18n'

    import Button from '@/Shared/Button'
    import DataTableMenu from '@/Shared/DataTableMenu'
    import { Item, Text, Separator } from '@smui/list'
    import Password from '@/Shared/Password'
    import Dialog from '@/Shared/Dialog'
    import Label from '@/Shared/Label'

    export let errors
    export let convocatorias
    export let convocatoria_activa

    let authUser = $page.props.auth.user
    let isSuperAdmin = checkRole(authUser, [1])

    $title = 'Convocatorias'

    let deleteForm = useForm({
        password: '',
    })

    let dialogEliminar = false
    let allowedToDestroy = false
    let convocatoria_id
    function destroy() {
        if (allowedToDestroy) {
            $deleteForm.delete(route('convocatorias.destroy', [convocatoria_id]), {
                preserveScroll: true,
                onFinish: () => {
                    dialogEliminar = false
                },
            })
        }
    }
</script>

<AuthenticatedLayout>
    <header class="pt-[8rem]" slot="header">
        <div class="flex items-center justify-between lg:px-8 max-w-7xl mx-auto px-4 py-6 sm:px-6">
            <div>
                <h1 class="font-bold text-5xl">
                    Lista de convocatorias
                </h1>
            </div>
            <div>
                <figure>
                    <img src={'/images/dashboard.png'} alt="" />
                </figure>
            </div>
        </div>
    </header>
    <div class={isSuperAdmin ? 'py-12' : ''}>
        {#if isSuperAdmin}
            <div class="flex justify-center items-center flex-col">
                <p>A continuación, se listan todas las convocatorias, si desea crear una nueva de clic en el siguiente botón.</p>
                <div>
                    <Button on:click={() => Inertia.visit(route('convocatorias.create'))} class="mt-8 mb-20" variant="raised">Crear convocatoria</Button>
                </div>
            </div>
        {/if}

        <div class="grid grid-cols-3 gap-4">
            {#if isSuperAdmin || checkRole(authUser, [11]) || checkPermission(authUser, [1, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 17, 18, 19, 14, 15, 16, 20, 21])}
                {#each convocatorias.data as convocatoria (convocatoria.id)}
                    {#if (convocatoria.tipo_convocatoria != 3 && convocatoria.visible) || isSuperAdmin || checkRole(authUser, [5, 17, 18, 19, 20])}
                        <div>
                            {#if isSuperAdmin}
                                <div class="bg-white flex w-full justify-end">
                                    <DataTableMenu class="!min-w-0">
                                        <Item on:SMUI:action={() => Inertia.visit(route('convocatorias.edit', convocatoria.id))} disabled={!isSuperAdmin} class={!isSuperAdmin ? 'hidden' : ''}>
                                            <Text>Editar convocatoria</Text>
                                        </Item>

                                        <Item on:SMUI:action={() => Inertia.visit(route('convocatorias.convocatoria-rol-sennova.index', convocatoria.id))}>
                                            <Text>Roles SENNOVA</Text>
                                        </Item>

                                        <Item on:SMUI:action={() => Inertia.visit(route('convocatorias.convocatoria-presupuesto.index', convocatoria.id))}>
                                            <Text>Rúbrica presupuestal SENNOVA</Text>
                                        </Item>

                                        <Separator disabled={!isSuperAdmin} class={!isSuperAdmin ? 'hidden' : ''} />
                                        <Item on:SMUI:action={() => ((convocatoria_id = convocatoria.id), (dialogEliminar = true), (allowedToDestroy = isSuperAdmin))} disabled={!isSuperAdmin} class={!isSuperAdmin ? 'hidden' : ''}>
                                            <Text>Eliminar convocatoria</Text>
                                        </Item>
                                    </DataTableMenu>
                                </div>
                            {/if}
                            <a use:inertia href={route('convocatorias.lineas-programaticas.index', convocatoria.id)} class="bg-white overflow-hidden shadow-sm px-6 py-2 hover:bg-app-500 hover:text-white h-72 flex justify-center items-center flex-col">
                                <h1 class="text-2xl text-center my-4">
                                    {#if convocatoria.tipo_convocatoria == 1}
                                        {convocatoria.descripcion}
                                        <br />
                                        {convocatoria.year}
                                    {:else if convocatoria.tipo_convocatoria == 2}
                                        Proyectos de ejercicio (DEMO)
                                    {:else}
                                        Nuevas TecnoAcademias - Nuevos Tecnoparques {convocatoria.year}
                                    {/if}
                                </h1>

                                <div class="bg-gray-700 text-white p-2 rounded-sm mt-4 flex">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-5 mr-2">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>

                                    <small> Convocatoria {convocatoria.esta_activa ? 'activa' : 'inactiva'} {convocatoria.visible && isSuperAdmin ? ' y visible' : convocatoria.visible == false && isSuperAdmin ? 'y oculta' : ''}</small>
                                </div>
                            </a>
                        </div>
                    {/if}
                {/each}
            {/if}
        </div>
    </div>

    <Dialog bind:open={dialogEliminar}>
        <div slot="title" class="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            Eliminar convocatoria
        </div>
        <div slot="content">
            <p>
                ¿Está seguro (a) que desea eliminar esta convocatoria?
                <br />
                Una vez eliminada la convocatoria, todos los proyectos y datos asociados se eliminarán de forma permanente.
            </p>

            <form on:submit|preventDefault={destroy} id="delete-convocatoria" class="mt-20 mb-28">
                <Label labelFor="password" value="Ingrese su contraseña para confirmar que desea eliminar permanentemente esta convocatoria" class="mb-4" />
                <Password id="password" class="w-full" bind:value={$deleteForm.password} error={errors.password} required autocomplete="current-password" />
            </form>
        </div>
        <div slot="actions">
            <div class="p-4">
                <Button on:click={() => (dialogEliminar = false)} variant={null}>Cancelar</Button>
                <Button variant="raised" form="delete-convocatoria">Confirmar</Button>
            </div>
        </div>
    </Dialog>
</AuthenticatedLayout>
