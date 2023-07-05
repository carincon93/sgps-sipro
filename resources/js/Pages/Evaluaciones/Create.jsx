<script>
    import AuthenticatedLayout, { title } from '@/Layouts/Authenticated'
    import { inertia, useForm, page } from '@inertiajs/inertia-svelte'
    import { route, checkRole, checkPermission } from '@/Utils'
    import { _ } from 'svelte-i18n'

    import Form from './Form'

    export let errors
    export let evaluadores
    export let proyectos
    export let allowedToCreate

    $: $title = 'Crear evaluación'

    /**
     * Validar si el usuario autenticado es SuperAdmin
     */
    let authUser = auth.user
    let isSuperAdmin = checkRole(authUser, [1])

    let form = useForm({
        habilitado: false,
        modificable: false,
        finalizado: false,
        proyecto_id: null,
        user_id: null,
    })

    function submit() {
        if (allowedToCreate) {
            $form.post(route('evaluaciones.store'))
        }
    }
</script>

<AuthenticatedLayout>
    <header className="pt-[8rem]" slot="header">
        <div className="flex items-center justify-between lg:px-8 max-w-7xl mx-auto px-4 py-6 sm:px-6">
            <div>
                <h1>
                    <a use:inertia href={route('evaluaciones.index')} className="text-app-400 hover:text-app-600"> Evaluaciones </a>
                    <span className="text-app-400 font-medium">/</span>
                    Crear
                </h1>
            </div>
        </div>
    </header>

    <div className="grid grid-cols-3">
        <div>
            <h1 className="font-black text-4xl sticky top-0 uppercase">Nueva evaluación</h1>
        </div>
        <div className="bg-white rounded shadow col-span-2">
            <Form {form} {submit} {errors} {allowedToCreate} {evaluadores} {proyectos} />
        </div>
    </div>
</AuthenticatedLayout>
