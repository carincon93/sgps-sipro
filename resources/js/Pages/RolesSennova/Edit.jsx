<script>
    import AuthenticatedLayout, { title } from '@/Layouts/Authenticated'
    import { inertia, useForm, page } from '@inertiajs/inertia-svelte'
    import { route, checkRole, checkPermission } from '@/Utils'
    import { _ } from 'svelte-i18n'

    import Form from './Form'

    export let errors
    export let rolSennova
    export let lineasProgramaticas

    $: $title = rolSennova ? rolSennova.nombre : null

    /**
     * Validar si el usuario autenticado es SuperAdmin
     */
    let authUser = auth.user
    let isSuperAdmin = checkRole(authUser, [1])

    let dialogOpen = false

    let form = useForm({
        nombre: rolSennova.nombre,
        sumar_al_presupuesto: rolSennova.sumar_al_presupuesto,
        linea_programatica_id: rolSennova.linea_programatica_id,
    })

    function submit() {
        if (isSuperAdmin) {
            $form.put(route('roles-sennova.update', rolSennova.id), {
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
                    <a use:inertia href={route('roles-sennova.index')} className="text-app-400 hover:text-app-600"> Roles SENNOVA </a>
                    <span className="text-app-400 font-medium">/</span>
                    {rolSennova.nombre}
                </h1>
            </div>
        </div>
    </header>

    <div className="grid grid-cols-3 gap-4">
        <div className="sticky top-0">
            <h1 className="font-black text-4xl uppercase">Editar rol SENNOVA</h1>
        </div>

        <div className="bg-white rounded shadow col-span-2">
            <Form {errors} {rolSennova} {isSuperAdmin} {form} {lineasProgramaticas} {submit} />
        </div>
    </div>
</AuthenticatedLayout>
