<script>
    import AuthenticatedLayout, { title } from '@/Layouts/Authenticated'
    import { inertia, useForm, page } from '@inertiajs/inertia-svelte'
    import { route, checkRole, checkPermission } from '@/Utils'
    import { _ } from 'svelte-i18n'

    import Form from './Form'

    export let errors
    export let lineasProgramaticas
    export let convocatorias

    $: $title = 'Crear anexo'

    /**
     * Validar si el usuario autenticado es SuperAdmin
     */
    let auth_user = auth.user
    let is_super_admin = checkRole(auth_user, [1])

    let form = useForm({
        nombre: '',
        descripcion: '',
        archivo: null,
        obligatorio: false,
        habilitado: true,
        linea_programatica_id: [],
        convocatoria_id: null,
    })

    function submit() {
        if (is_super_admin) {
            $form.post(route('anexos.store'))
        }
    }
</script>

<AuthenticatedLayout>
    <header className="pt-[8rem]" slot="header">
        <div className="flex items-center justify-between lg:px-8 max-w-7xl mx-auto px-4 py-6 sm:px-6">
            <div>
                <h1>
                    <a use:inertia href={route('anexos.index')} className="text-app-400 hover:text-app-600"> Anexos </a>
                    <span className="text-app-400 font-medium">/</span>
                    Crear
                </h1>
            </div>
        </div>
    </header>

    <div className="grid grid-cols-3">
        <div>
            <h1 className="font-black text-4xl sticky top-0 uppercase">Nuevo anexo</h1>
        </div>
        <div className="bg-white rounded shadow col-span-2">
            <Form {form} {submit} {errors} {lineasProgramaticas} {is_super_admin} {convocatorias} method="store" />
        </div>
    </div>
</AuthenticatedLayout>
