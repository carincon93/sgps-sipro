<script>
    import AuthenticatedLayout, { title } from '@/Layouts/Authenticated'
    import { inertia, useForm, page } from '@inertiajs/inertia-svelte'
    import { route, checkRole, checkPermission } from '@/Utils'
    import { _ } from 'svelte-i18n'

    import Form from './Form'

    export let errors
    export let convocatoria
    export let rolesSennova
    export let nivelesAcademicos
    export let lineasProgramaticas

    $: $title = 'Crear rol SENNOVA'

    /**
     * Validar si el usuario autenticado es SuperAdmin
     */
    let authUser = auth.user
    let isSuperAdmin = checkRole(authUser, [1])

    let form = useForm({
        rol_sennova_id: null,
        linea_programatica_id: null,
        asignacion_mensual: '',
        experiencia: '',
        nivel_academico: '',
        perfil: '',
        mensaje: '',
    })

    function submit() {
        if (isSuperAdmin) {
            $form.post(route('convocatorias.convocatoria-rol-sennova.store', convocatoria.id))
        }
    }
</script>

<AuthenticatedLayout>
    <header className="pt-[8rem]" slot="header">
        <div className="flex items-center justify-between lg:px-8 max-w-7xl mx-auto px-4 py-6 sm:px-6">
            <div>
                <h1>
                    <a use:inertia href={route('convocatorias.convocatoria-rol-sennova.index', convocatoria.id)} className="text-app-400 hover:text-app-600"> Roles SENNOVA de convocatoria </a>
                    <span className="text-app-400 font-medium">/</span>
                    Crear
                </h1>
            </div>
        </div>
    </header>

    <div className="grid grid-cols-3 gap-4">
        <div className="sticky top-0">
            <h1 className="font-black text-4xl uppercase">Nuevo rol de convocatoria</h1>
        </div>

        <div className="col-span-2">
            <Form {submit} {isSuperAdmin} {rolesSennova} {form} {errors} {lineasProgramaticas} {nivelesAcademicos} />
        </div>
    </div>
</AuthenticatedLayout>
