<script>
    import AuthenticatedLayout, { title } from '@/Layouts/Authenticated'
    import { inertia, useForm, page } from '@inertiajs/inertia-svelte'
    import { route, checkRole, checkPermission } from '@/Utils'
    import { _ } from 'svelte-i18n'

    import Form from './Form'

    export let errors
    export let rubroSegundoGrupoPresupuestal

    $: $title = rubroSegundoGrupoPresupuestal ? rubroSegundoGrupoPresupuestal.nombre : null

    /**
     * Validar si el usuario autenticado es SuperAdmin
     */
    let authUser = $page.props.auth.user
    let isSuperAdmin = checkRole(authUser, [1])

    let dialogOpen = false

    let form = useForm({
        nombre: rubroSegundoGrupoPresupuestal.nombre,
        codigo: rubroSegundoGrupoPresupuestal.codigo,
    })

    function submit() {
        if (isSuperAdmin) {
            $form.put(route('segundo-grupo-presupuestal.update', rubroSegundoGrupoPresupuestal.id), {
                preserveScroll: true,
            })
        }
    }
</script>

<AuthenticatedLayout>
    <header class="pt-[8rem]" slot="header">
        <div class="flex items-center justify-between lg:px-8 max-w-7xl mx-auto px-4 py-6 sm:px-6">
            <div>
                <h1 class="overflow-ellipsis overflow-hidden w-breadcrumb-ellipsis whitespace-nowrap">
                    <a use:inertia href={route('segundo-grupo-presupuestal.index')} class="text-app-400 hover:text-app-600"> Segundo grupo presupuestal </a>
                    <span class="text-app-400 font-medium">/</span>
                    {rubroSegundoGrupoPresupuestal.nombre}
                </h1>
            </div>
        </div>
    </header>

    <div class="grid grid-cols-3 gap-4">
        <div class="sticky top-0">
            <h1 class="font-black text-4xl uppercase">Editar rubro del segundo grupo presupuestal</h1>
        </div>

        <div class="bg-white rounded shadow col-span-2">
            <Form {errors} {rubroSegundoGrupoPresupuestal} {form} {submit} {isSuperAdmin} />
        </div>
    </div>
</AuthenticatedLayout>
