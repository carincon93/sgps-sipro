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
    let auth_user = auth.user
    let is_super_admin = checkRole(auth_user, [1])

    let form = useForm({
        nombre: regional.nombre,
        codigo: regional.codigo,
        region_id: regional.region_id,
        director_regional_id: regional.director_regional_id,
    })

    function submit() {
        if (is_super_admin) {
            $form.put(route('regionales.update', regional.id), {
                preserveScroll: true,
            })
        }
    }
</script>

<AuthenticatedLayout>
    <header className="pt-[8rem]" slot="header">
        <div className="flex items-center justify-between lg:px-8 max-w-7xl mx-auto px-4 py-6 sm:px-6">
            <div>
                <h1 className="overflow-ellipsis overflow-hidden w-breadcrumb-ellipsis whitespace-nowrap">
                    <a use:inertia href={route('regionales.index')} className="text-app-400 hover:text-app-600"> Regionales </a>
                    <span className="text-app-400 font-medium">/</span>
                    {regional.nombre}
                </h1>
            </div>
        </div>
    </header>

    <div className="grid grid-cols-3 gap-4">
        <div className="sticky top-0">
            <h1 className="font-black text-4xl uppercase">Editar regional</h1>
        </div>

        <div className="bg-white rounded shadow col-span-2">
            <Form {errors} {regional} {regiones} {directoresRegionales} {is_super_admin} {form} {submit} />
        </div>
    </div>
</AuthenticatedLayout>
