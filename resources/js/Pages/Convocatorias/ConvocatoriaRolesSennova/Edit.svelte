<script>
    import AuthenticatedLayout, { title } from '@/Layouts/Authenticated'
    import { inertia, useForm, page } from '@inertiajs/inertia-svelte'
    import { route, checkRole, checkPermission } from '@/Utils'
    import { _ } from 'svelte-i18n'

    import Form from './Form'

    export let errors
    export let convocatoria
    export let convocatoriaRolSennova
    export let rolesSennova
    export let nivelesAcademicos
    export let lineasProgramaticas

    $: $title = convocatoriaRolSennova ? convocatoriaRolSennova.nombre : null

    /**
     * Validar si el usuario autenticado es SuperAdmin
     */
    let authUser = $page.props.auth.user
    let isSuperAdmin = checkRole(authUser, [1])

    let form = useForm({
        asignacion_mensual: convocatoriaRolSennova.asignacion_mensual,
        experiencia: convocatoriaRolSennova.experiencia,
        nivel_academico: convocatoriaRolSennova.nivel_academico,
        linea_programatica_id: convocatoriaRolSennova.linea_programatica_id,
        rol_sennova_id: convocatoriaRolSennova.rol_sennova_id,
        perfil: convocatoriaRolSennova.perfil,
        mensaje: convocatoriaRolSennova.mensaje,
    })

    function submit() {
        if (isSuperAdmin) {
            $form.put(route('convocatorias.convocatoria-rol-sennova.update', [convocatoria.id, convocatoriaRolSennova.id]), {
                preserveScroll: true,
            })
        }
    }
</script>

<AuthenticatedLayout>
    <header class="pt-[8rem]" slot="header">
        <div class="flex items-center justify-between lg:px-8 max-w-7xl mx-auto px-4 py-6 sm:px-6">
            <div>
                <h1 class="overflow-ellipsis overflow-hidden w-breadcrumb-ellipsis whitespace-nowrap">
                    <a use:inertia href={route('convocatorias.convocatoria-rol-sennova.index', convocatoria.id)} class="text-app-400 hover:text-app-600"> Roles SENNOVA </a>
                    <span class="text-app-400 font-medium">/</span>
                    {convocatoriaRolSennova.rol_sennova.nombre}
                </h1>
            </div>
        </div>
    </header>

    <div class="grid grid-cols-3 gap-4">
        <div class="sticky top-0">
            <h1 class="font-black text-4xl uppercase">Editar rol de convocatoria</h1>
        </div>

        <div class="col-span-2">
            <Form {submit} {isSuperAdmin} {rolesSennova} {form} {errors} {lineasProgramaticas} {nivelesAcademicos} />
        </div>
    </div>
</AuthenticatedLayout>
