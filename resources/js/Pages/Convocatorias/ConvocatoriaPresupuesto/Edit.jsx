<script>
    import AuthenticatedLayout, { title } from '@/Layouts/Authenticated'
    import { inertia, useForm, page } from '@inertiajs/inertia-svelte'
    import { route, checkRole, checkPermission } from '@/Utils'
    import { _ } from 'svelte-i18n'

    import Form from './Form'

    export let errors
    export let convocatoria
    export let convocatoriaPresupuesto
    export let presupuestosSennova

    $: $title = convocatoriaPresupuesto ? convocatoriaPresupuesto.presupuesto_sennova.codigo : null

    /**
     * Validar si el usuario autenticado es SuperAdmin
     */
    let auth_user = auth.user
    let is_super_admin = checkRole(auth_user, [1])

    let form = useForm({
        presupuesto_sennova_id: convocatoriaPresupuesto.presupuesto_sennova_id,
    })

    function submit() {
        if (is_super_admin) {
            $form.put(route('convocatorias.convocatoria-presupuesto.update', [convocatoria.id, convocatoriaPresupuesto.id]), {
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
                    <a use:inertia href={route('convocatorias.convocatoria-presupuesto.index', convocatoria.id)} className="text-app-400 hover:text-app-600"> Rubros presupuestales SENNOVA de convocatoria</a>
                    <span className="text-app-400 font-medium">/</span>
                    {convocatoriaPresupuesto.presupuesto_sennova.codigo}
                </h1>
            </div>
        </div>
    </header>

    <div className="grid grid-cols-3 gap-4">
        <div className="sticky top-0">
            <h1 className="font-black text-4xl uppercase">Editar rubro presupuestal de convocatoria</h1>
        </div>

        <div className="col-span-2">
            <Form {submit} {errors} {is_super_admin} {presupuestosSennova} {form} />
        </div>
    </div>
</AuthenticatedLayout>
