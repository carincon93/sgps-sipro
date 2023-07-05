<script>
    import AuthenticatedLayout, { title } from '@/Layouts/Authenticated'
    import { inertia, useForm, page } from '@inertiajs/inertia-svelte'
    import { route, checkRole, checkPermission } from '@/Utils'
    import { _ } from 'svelte-i18n'

    import Form from './Form'

    export let errors
    export let redesConocimiento
    export let lineasInvestigacion
    export let grupoInvestigacion
    export let programasFormacion
    export let allowedToCreate

    $: $title = 'Crear semillero de investigación'

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
        nombre: '',
        fecha_creacion_semillero: '',
        nombre_lider_semillero: '',
        email_contacto: '',
        reconocimientos_semillero_investigacion: '',
        vision: '',
        mision: '',
        objetivo_general: '',
        objetivos_especificos: '',
        link_semillero: '',
        formato_gic_f_021: '',
        formato_gic_f_032: '',
        formato_aval_semillero: '',
        centro_formacion_id: isSuperAdmin ? null : checkRole(authUser, [4, 21, 20, 18, 19, 5, 17, 27]) ? authUser.centro_formacion_id : null,
        linea_investigacion_id: null,
        linea_investigacion: null,
        redes_conocimiento: null,
        programas_formacion: null,
        lineas_investigacion: null,
        es_semillero_tecnoacademia: null,
        formato_gic_f_021: null,
        formato_gic_f_032: null,
        formato_aval_semillero: null,
    })

    function submit() {
        if (allowedToCreate) {
            $form.post(route('grupos-investigacion.semilleros-investigacion.store', grupoInvestigacion.id))
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
                    Crear
                </h1>
            </div>
        </div>
    </header>

    <div className="grid grid-cols-3 gap-4">
        <div className="sticky top-0">
            <h1 className="font-black text-4xl uppercase">Nuevo semillero</h1>
        </div>

        <div className="col-span-2">
            <Form {form} {submit} {errors} {opcionesSiNo} {lineasInvestigacion} {grupoInvestigacion} {redesConocimiento} {programasFormacion} {allowedToCreate} method="store" />
        </div>
    </div>
</AuthenticatedLayout>
