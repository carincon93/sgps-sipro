<script>
    import AuthenticatedLayout, { title } from '@/Layouts/Authenticated'
    import { inertia, useForm, page } from '@inertiajs/inertia-svelte'
    import { route, checkRole, checkPermission } from '@/Utils'
    import { _ } from 'svelte-i18n'

    import Form from './Form'

    export let errors
    export let semilleroInvestigacion
    export let lineasInvestigacion
    export let grupoInvestigacion
    export let redesConocimiento
    export let programasFormacion
    export let redesConocimientoSemilleroInvestigacion
    export let programasFormacionSemilleroInvestigacion
    export let lineasInvestigacionSemilleroInvestigacion

    $: $title = semilleroInvestigacion ? semilleroInvestigacion.nombre : null

    /**
     * Validar si el usuario autenticado es SuperAdmin
     */
    let authUser = auth.user
    let isSuperAdmin = checkRole(authUser, [1])

    let opcionesSiNo = [
        { value: 1, label: 'Si' },
        { value: 2, label: 'No' },
    ]
    let form = useForm({
        _method: 'put',
        nombre: semilleroInvestigacion.nombre,
        fecha_creacion_semillero: semilleroInvestigacion.fecha_creacion_semillero,
        nombre_lider_semillero: semilleroInvestigacion.nombre_lider_semillero,
        email_contacto: semilleroInvestigacion.email_contacto,
        reconocimientos_semillero_investigacion: semilleroInvestigacion.reconocimientos_semillero_investigacion,
        vision: semilleroInvestigacion.vision,
        mision: semilleroInvestigacion.mision,
        objetivo_general: semilleroInvestigacion.objetivo_general,
        objetivos_especificos: semilleroInvestigacion.objetivos_especificos,
        link_semillero: semilleroInvestigacion.link_semillero,

        linea_investigacion_id: semilleroInvestigacion.linea_investigacion_id,
        linea_investigacion: null,
        centro_formacion_id: semilleroInvestigacion.linea_investigacion?.grupo_investigacion?.centro_formacion_id,
        redes_conocimiento: redesConocimientoSemilleroInvestigacion.length > 0 ? redesConocimientoSemilleroInvestigacion : null,
        programas_formacion: programasFormacionSemilleroInvestigacion.length > 0 ? programasFormacionSemilleroInvestigacion : null,
        lineas_investigacion: lineasInvestigacionSemilleroInvestigacion.length > 0 ? lineasInvestigacionSemilleroInvestigacion : null,
        es_semillero_tecnoacademia: semilleroInvestigacion.es_semillero_tecnoacademia,

        formato_gic_f_021: null,
        formato_gic_f_032: null,
        formato_aval_semillero: null,
    })

    let dialogGuardar = false
    function submit() {
        if (semilleroInvestigacion.allowed.to_update) {
            $form.post(route('grupos-investigacion.semilleros-investigacion.update', [grupoInvestigacion.id, semilleroInvestigacion.id]), {
                onFinish: () => {
                    dialogGuardar = false
                },
                preserveScroll: true,
            })
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
                    <a use:inertia href={route('grupos-investigacion.semilleros-investigacion.index', grupoInvestigacion.id)} className="text-app-400 hover:text-app-600"> Semilleros de investigación </a>
                    <span className="text-app-400 font-medium">/</span>
                    {semilleroInvestigacion.nombre}
                </h1>
            </div>
        </div>
    </header>

    <div className="grid grid-cols-3 gap-4">
        <div className="sticky top-0">
            <h1 className="font-black text-4xl uppercase">Editar semillero</h1>
        </div>

        <div className="col-span-2">
            <h1 className="font-black text-4xl uppercase">{semilleroInvestigacion.nombre}</h1>
            <Form {form} {submit} {errors} {opcionesSiNo} {semilleroInvestigacion} {lineasInvestigacion} {grupoInvestigacion} {redesConocimiento} {programasFormacion} {redesConocimientoSemilleroInvestigacion} {programasFormacionSemilleroInvestigacion} {lineasInvestigacionSemilleroInvestigacion} bind:dialogGuardar />
        </div>
    </div>
</AuthenticatedLayout>
