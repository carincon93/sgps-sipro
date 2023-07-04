<script>
    import AuthenticatedLayout, { title } from '@/Layouts/Authenticated'
    import { inertia, useForm, page } from '@inertiajs/inertia-svelte'
    import { route, checkRole, checkPermission } from '@/Utils'
    import { _ } from 'svelte-i18n'

    import Form from './Form'

    export let errors
    export let regional
    export let regiones
    export let directoresRegionales

    $: $title = regional ? regional.nombre : null

    /**
     * Validar si el usuario autenticado es SuperAdmin
     */
    let authUser = $page.props.auth.user
    let isSuperAdmin = checkRole(authUser, [1])

    let form = useForm({
        nombre: regional.nombre,
        codigo: regional.codigo,
        region_id: regional.region_id,
        director_regional_id: regional.director_regional_id,
    })

    function submit() {
        if (isSuperAdmin) {
            $form.put(route('regionales.update', regional.id), {
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
                    <a use:inertia href={route('regionales.index')} class="text-app-400 hover:text-app-600"> Regionales </a>
                    <span class="text-app-400 font-medium">/</span>
                    {regional.nombre}
                </h1>
            </div>
        </div>
    </header>

    <div class="grid grid-cols-3 gap-4">
        <div class="sticky top-0">
            <h1 class="font-black text-4xl uppercase">Editar regional</h1>
        </div>

        <div class="bg-white rounded shadow col-span-2">
            <Form {errors} {regional} {regiones} {directoresRegionales} {isSuperAdmin} {form} {submit} />
        </div>
    </div>
</AuthenticatedLayout>
