<script>
    import AuthenticatedLayout, { title } from '@/Layouts/Authenticated'
    import { inertia, useForm, page } from '@inertiajs/inertia-svelte'
    import { route, checkRole, checkPermission } from '@/Utils'
    import { _ } from 'svelte-i18n'

    import Form from './Form'

    export let errors
    export let regionales
    export let subdirectores
    export let dinamizadoresSennova

    $: $title = 'Crear centro de formación'

    /**
     * Validar si el usuario autenticado es SuperAdmin
     */
    let auth_user = auth.user
    let is_super_admin = checkRole(auth_user, [1])

    let form = useForm({
        nombre: '',
        codigo: '',
        regional_id: null,
        subdirector_id: null,
        dinamizador_sennova_id: null,
    })

    function submit() {
        if (is_super_admin) {
            $form.post(route('centros-formacion.store'))
        }
    }
</script>

<AuthenticatedLayout>
    <header className="pt-[8rem]" slot="header">
        <div className="flex items-center justify-between lg:px-8 max-w-7xl mx-auto px-4 py-6 sm:px-6">
            <div>
                <h1>
                    <a use:inertia href={route('centros-formacion.index')} className="text-app-400 hover:text-app-600"> Centros de formación </a>
                    <span className="text-app-400 font-medium">/</span>
                    Crear
                </h1>
            </div>
        </div>
    </header>

    <div className="grid grid-cols-3 gap-4">
        <div className="sticky top-0">
            <h1 className="font-black text-4xl uppercase">Nuevo centro de formación</h1>
        </div>

        <div className="col-span-2">
            <Form {submit} {form} {errors} {regionales} {subdirectores} {dinamizadoresSennova} {is_super_admin} />
        </div>
    </div>
</AuthenticatedLayout>
