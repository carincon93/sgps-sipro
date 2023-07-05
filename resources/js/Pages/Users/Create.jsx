<script>
    import AuthenticatedLayout, { title } from '@/Layouts/Authenticated'
    import { inertia, useForm, page } from '@inertiajs/inertia-svelte'
    import { route, checkRole, checkPermission } from '@/Utils'
    import { _ } from 'svelte-i18n'

    import Form from './Form'

    export let errors
    export let tiposDocumento
    export let tiposVinculacion
    export let roles
    export let centrosFormacion
    export let allowedToCreate

    $: $title = 'Crear usuario'

    /**
     * Validar si el usuario autenticado es SuperAdmin
     */
    let authUser = auth.user
    let isSuperAdmin = checkRole(authUser, [1])

    let form = useForm({
        nombre: '',
        email: '',
        tipo_documento: '',
        numero_documento: '',
        numero_celular: '',
        habilitado: true,
        tipo_vinculacion: '',
        centro_formacion_id: isSuperAdmin ? null : checkRole(authUser, [4, 21]) ? authUser.centro_formacion_id : null,
        role_id: [],
        permission_id: [],
        autorizacion_datos: false,
    })

    function submit() {
        if (allowedToCreate) {
            $form.post(route('users.store'))
        }
    }
</script>

<AuthenticatedLayout>
    <header className="pt-[8rem]" slot="header">
        <div className="flex items-center justify-between lg:px-8 max-w-7xl mx-auto px-4 py-6 sm:px-6">
            <div>
                <h1>
                    <a use:inertia href={route('users.index')} className="text-app-400 hover:text-app-600"> Usuarios </a>
                    <span className="text-app-400 font-medium">/</span>
                    Crear
                </h1>
            </div>
        </div>
    </header>

    <Form {submit} {form} {errors} {tiposDocumento} {tiposVinculacion} {roles} {centrosFormacion} {allowedToCreate} />
</AuthenticatedLayout>
