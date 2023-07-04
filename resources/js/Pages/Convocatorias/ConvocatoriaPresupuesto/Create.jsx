<script>
    import AuthenticatedLayout, { title } from '@/Layouts/Authenticated'
    import { inertia, useForm, page } from '@inertiajs/inertia-svelte'
    import { route, checkRole, checkPermission } from '@/Utils'
    import { _ } from 'svelte-i18n'

    import Form from './Form'

    export let errors
    export let convocatoria
    export let presupuestosSennova

    $: $title = 'Asociar rubro presupuestal SENNOVA a la convocatoria'

    /**
     * Validar si el usuario autenticado es SuperAdmin
     */
    let authUser = $page.props.auth.user
    let isSuperAdmin = checkRole(authUser, [1])

    let form = useForm({
        presupuesto_sennova_id: null,
    })

    function submit() {
        if (isSuperAdmin) {
            $form.post(route('convocatorias.convocatoria-presupuesto.store', convocatoria.id))
        }
    }
</script>

<AuthenticatedLayout>
    <header class="pt-[8rem]" slot="header">
        <div class="flex items-center justify-between lg:px-8 max-w-7xl mx-auto px-4 py-6 sm:px-6">
            <div>
                <h1>
                    <a use:inertia href={route('convocatorias.convocatoria-presupuesto.index', convocatoria.id)} class="text-app-400 hover:text-app-600"> Rubros presupuestales SENNOVA de la convocatoria </a>
                    <span class="text-app-400 font-medium">/</span>
                    Crear
                </h1>
            </div>
        </div>
    </header>

    <div class="grid grid-cols-3 gap-4">
        <div class="sticky top-0">
            <h1 class="font-black text-4xl uppercase">Nuevo rubro presupuestal de convocatoria</h1>
        </div>

        <div class="col-span-2">
            <Form {submit} {errors} {isSuperAdmin} {presupuestosSennova} {form} />
        </div>
    </div>
</AuthenticatedLayout>
