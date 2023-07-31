<script>
    import AuthenticatedLayout, { title } from '@/Layouts/Authenticated'
    import { inertia, useForm, page } from '@inertiajs/inertia-svelte'
    import { route, checkRole, checkPermission } from '@/Utils'
    import { _ } from 'svelte-i18n'

    import Form from './Form'

    export let errors
    export let modalidades
    export let nivelesFormacion
    export let centrosFormacion
    export let allowedToCreate

    $: $title = 'Crear programa de formación'

    /**
     * Validar si el usuario autenticado es SuperAdmin
     */
    let authUser = $page.props.auth.user
    let isSuperAdmin = checkRole(authUser, [1])

    let form = useForm({
        nombre: '',
        codigo: '',
        modalidad: '',
        nivel_formacion: '',
        registro_calificado: false,
        centro_formacion_id: null,
    })

    function submit() {
        if (allowedToCreate) {
            $form.post(route('programas-formacion.store'))
        }
    }
</script>

<AuthenticatedLayout>
    <header class="pt-[8rem]" slot="header">
        <div class="flex items-center justify-between lg:px-8 max-w-7xl mx-auto px-4 py-6 sm:px-6">
            <div>
                <h1>
                    <a use:inertia href={route('programas-formacion.index')} class="text-app-400 hover:text-app-600"> Programas de formación </a>
                    <span class="text-app-400 font-medium">/</span>
                    Crear
                </h1>
            </div>
        </div>
    </header>

    <div class="grid grid-cols-3 gap-4">
        <div class="sticky top-0">
            <h1 class="font-black text-4xl uppercase">Nuevo programa de formación</h1>
        </div>

        <div class="bg-white rounded shadow col-span-2">
            <Form {errors} {form} {submit} {allowedToCreate} {centrosFormacion} {modalidades} {nivelesFormacion} />
        </div>
    </div>
</AuthenticatedLayout>
