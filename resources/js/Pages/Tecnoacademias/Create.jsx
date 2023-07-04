<script>
    import AuthenticatedLayout, { title } from '@/Layouts/Authenticated'
    import { inertia, useForm, page } from '@inertiajs/inertia-svelte'
    import { route, checkRole, checkPermission } from '@/Utils'
    import { _ } from 'svelte-i18n'

    import Form from './Form'

    export let errors
    export let lineasTecnoacademia
    export let modalidades
    export let centrosFormacion
    export let allowedToCreate

    $: $title = 'Crear tecnoacademia'

    /**
     * Validar si el usuario autenticado es SuperAdmin
     */
    let authUser = $auth.user
    let isSuperAdmin = checkRole(authUser, [1])

    let form = useForm({
        nombre: '',
        foco: '',
        fecha_creacion: '',
        modalidad: null,
        centro_formacion_id: null,
        linea_tecnoacademia_id: [],
    })

    function submit() {
        if (isSuperAdmin || checkRole(authUser, [5])) {
            $form.post(route('tecnoacademias.store'))
        }
    }
</script>

<AuthenticatedLayout>
    <header className="pt-[8rem]" slot="header">
        <div className="flex items-center justify-between lg:px-8 max-w-7xl mx-auto px-4 py-6 sm:px-6">
            <div>
                <h1>
                    <a use:inertia href={route('tecnoacademias.index')} className="text-app-400 hover:text-app-600"> Tecnoacademias </a>
                    <span className="text-app-400 font-medium">/</span>
                    Crear
                </h1>
            </div>
        </div>
    </header>

    <div className="grid grid-cols-3 gap-4">
        <div className="sticky top-0">
            <h1 className="font-black text-4xl uppercase">Nueva Tecnoacademia</h1>
        </div>

        <div className="bg-white rounded shadow col-span-2">
            <Form {errors} {allowedToCreate} {lineasTecnoacademia} {modalidades} {centrosFormacion} {form} {submit} />
        </div>
    </div>
</AuthenticatedLayout>
