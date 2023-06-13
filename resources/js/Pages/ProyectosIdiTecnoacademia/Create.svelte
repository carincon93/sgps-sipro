<script>
    import AuthenticatedLayout, { title } from '@/Layouts/Authenticated'
    import { inertia, useForm, page } from '@inertiajs/inertia-svelte'
    import { route, checkRole, checkPermission, monthDiff } from '@/Utils'
    import { _ } from 'svelte-i18n'

    import Form from './Form'

    export let errors
    export let tecnoacademias
    export let programasSennova
    export let semillerosInvestigacion
    export let lineasTecnoacademia
    export let estadosProyectoIdiTecnoacademia
    export let beneficiados
    export let proyectos
    export let municipios
    export let regionales
    export let roles
    export let allowedToCreate

    $: $title = 'Crear proyecto I+D+i TecnoAcademia'

    /**
     * Validar si el usuario autenticado es SuperAdmin
     */
    let authUser = $page.props.auth.user
    let isSuperAdmin = checkRole(authUser, [1])

    let form = useForm({
        tecnoacademia_id: null,
        semillero_investigacion_id: null,
        proyecto_id: null,
        tecnoacademia_linea_tecnoacademia_id: null,
        titulo: '',
        fecha_inicio: '',
        fecha_finalizacion: '',
        resumen: '',
        palabras_clave: null,
        especies: null,
        tiene_linea_investigacion: false,
        lineas_investigacion: null,
        proyecto_nuevo: false,
        proyecto_con_continuidad: false,
        productos_premios: '',
        texto_exposicion: '',
        pdf_proyecto: null,
        resultados_obtenidos: '',
        documentos_resultados: null,
        observaciones_resultados: '',
        nombre_aprendices_vinculados: null,
        nombre_instituciones_educativas: null,
        nuevas_instituciones_educativas: null,
        programa_sennova_participante: null,
        programa_formacion_articulado_media: '',
        entidades_vinculadas: null,
        fuente_recursos: '',
        presupuesto: '',
        hace_parte_de_semillero: false,
        estado_proyecto: '',
        poblacion_beneficiada: '',
        otra_poblacion_beneficiada: '',
        nombre_centro_programa: '',
        beneficiados: null,
        municipios: null,
        rol_sennova: null,
        cantidad_meses: 0,
        cantidad_horas: 0,
    })

    function submit() {
        if (allowedToCreate) {
            $form.post(route('proyectos-idi-tecnoacademia.store'))
        }
    }
</script>

<AuthenticatedLayout>
    <header class="pt-[8rem]" slot="header">
        <div class="flex items-center justify-between lg:px-8 max-w-7xl mx-auto px-4 py-6 sm:px-6">
            <div>
                <h1>
                    <a use:inertia href={route('proyectos-idi-tecnoacademia.index')} class="text-app-400 hover:text-app-600"> Proyectos I+D+i TecnoAcademia </a>
                    <span class="text-app-400 font-medium">/</span>
                    Crear
                </h1>
            </div>
        </div>
    </header>

    <Form {errors} {tecnoacademias} {programasSennova} {semillerosInvestigacion} {estadosProyectoIdiTecnoacademia} {proyectos} {regionales} {municipios} {roles} {beneficiados} {form} {submit} {lineasTecnoacademia} {allowedToCreate} method="store" />
</AuthenticatedLayout>
