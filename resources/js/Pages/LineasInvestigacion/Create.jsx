<script>
    import AuthenticatedLayout, { title } from '@/Layouts/Authenticated'
    import { inertia, useForm, page } from '@inertiajs/inertia-svelte'
    import { route, checkRole, checkPermission } from '@/Utils'
    import { _ } from 'svelte-i18n'

    import Form from './Form'

    export let errors
    export let grupoInvestigacion
    export let programasFormacion
    export let allowedToCreate

    $: $title = 'Crear línea de investigación'

    /**
     * Validar si el usuario autenticado es SuperAdmin
     */
    let authUser = $auth.user
    let isSuperAdmin = checkRole(authUser, [1])

    let form = useForm({
        nombre: '',
        grupo_investigacion_id: grupoInvestigacion.id,
        programas_formacion: null,
    })

    function submit() {
        if (isSuperAdmin || allowedToCreate) {
            $form.post(route('grupos-investigacion.lineas-investigacion.store', grupoInvestigacion.id))
        }
    }
</script>

<AuthenticatedLayout>
    <header className="pt-[8rem]" slot="header">
        <div className="flex items-center justify-between lg:px-8 max-w-7xl mx-auto px-4 py-6 sm:px-6">
            <div>
                <h1>
                    <a use:inertia href={route('grupos-investigacion.index')} className="text-app-400 hover:text-app-600"> Grupos de investigación </a>
                    <span className="text-app-400 font-medium">/</span>
                    <a use:inertia href={route('grupos-investigacion.edit', grupoInvestigacion.id)} className="text-app-400 hover:text-app-600"> {grupoInvestigacion.nombre} </a>
                    <span className="text-app-400 font-medium">/</span>
                    <a use:inertia href={route('grupos-investigacion.lineas-investigacion.index', grupoInvestigacion.id)} className="text-app-400 hover:text-app-600"> Líneas de investigación </a>
                    <span className="text-app-400 font-medium">/</span>
                    Crear
                </h1>
            </div>
        </div>
    </header>

    <div className="grid grid-cols-3 gap-4">
        <div className="sticky top-0">
            <h1 className="font-black text-4xl uppercase">Nueva línea de investigación</h1>
        </div>

        <div className="col-span-2">
            <Form {submit} {form} {errors} {programasFormacion} {allowedToCreate} />
        </div>
    </div>
</AuthenticatedLayout>
