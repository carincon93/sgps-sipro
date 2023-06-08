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
    let authUser = $page.props.auth.user
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
    <header class="pt-[8rem]" slot="header">
        <div class="flex items-center justify-between lg:px-8 max-w-7xl mx-auto px-4 py-6 sm:px-6">
            <div>
                <h1>
                    <a use:inertia href={route('convocatorias.convocatoria-rol-sennova.index', convocatoria.id)} class="text-app-400 hover:text-app-600"> Roles SENNOVA de convocatoria </a>
                    <span class="text-app-400 font-medium">/</span>
                    Crear
                </h1>
            </div>
        </div>
    </header>

    <div class="grid grid-cols-3 gap-4">
        <div class="sticky top-0">
            <h1 class="font-black text-4xl uppercase">Nuevo rol de convocatoria</h1>
        </div>

        <div class="col-span-2">
            <Form {submit} {isSuperAdmin} {rolesSennova} {form} {errors} {lineasProgramaticas} {nivelesAcademicos} />
        </div>
    </div>
</AuthenticatedLayout>
