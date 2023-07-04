<script>
    import AuthenticatedLayout, { title } from '@/Layouts/Authenticated'
    import { inertia, useForm, page } from '@inertiajs/inertia-svelte'
    import { route, checkRole, checkPermission } from '@/Utils'
    import { _ } from 'svelte-i18n'

    import Form from './Form'

    export let errors
    export let rubroPrimerGrupoPresupuestal

    $: $title = rubroPrimerGrupoPresupuestal ? rubroPrimerGrupoPresupuestal.nombre : null

    /**
     * Validar si el usuario autenticado es SuperAdmin
     */
    let authUser = $auth.user
    let isSuperAdmin = checkRole(authUser, [1])

    let form = useForm({
        nombre: rubroPrimerGrupoPresupuestal.nombre,
        cta: rubroPrimerGrupoPresupuestal.cta,
        bpin: rubroPrimerGrupoPresupuestal.bpin,
    })

    function submit() {
        if (isSuperAdmin) {
            $form.put(route('primer-grupo-presupuestal.update', rubroPrimerGrupoPresupuestal.id), {
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
                    <a use:inertia href={route('primer-grupo-presupuestal.index')} className="text-app-400 hover:text-app-600"> Primer grupo presupuestal </a>
                    <span className="text-app-400 font-medium">/</span>
                    {rubroPrimerGrupoPresupuestal.nombre}
                </h1>
            </div>
        </div>
    </header>

    <div className="grid grid-cols-3 gap-4">
        <div className="sticky top-0">
            <h1 className="font-black text-4xl uppercase">Editar rubro del primer grupo presupuestal</h1>
        </div>

        <div className="bg-white rounded shadow col-span-2">
            <Form {errors} {rubroPrimerGrupoPresupuestal} {form} {submit} {isSuperAdmin} />
        </div>
    </div>
</AuthenticatedLayout>
