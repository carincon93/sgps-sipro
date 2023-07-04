<script>
    import AuthenticatedLayout, { title } from '@/Layouts/Authenticated'
    import { inertia, useForm, page } from '@inertiajs/inertia-svelte'
    import { route, checkRole, checkPermission, monthDiff } from '@/Utils'
    import { _ } from 'svelte-i18n'

    import Form from './Form'

    export let errors
    export let proyectoIdiTecnoacademia
    export let tecnoacademias
    export let programasSennova
    export let semillerosInvestigacion
    export let lineasTecnoacademia
    export let estadosProyectoIdiTecnoacademia
    export let proyectos
    export let regionales
    export let municipios
    export let roles
    export let beneficiados
    export let lineasRelacionadas
    export let programasRelacionados
    export let beneficiadosRelacionados
    export let municipiosRelacionados
    export let autorPrincipal

    $: $title = 'Editar proyecto I+D+i TecnoAcademia'

    /**
     * Validar si el usuario autenticado es SuperAdmin
     */
    let authUser = $auth.user
    let isSuperAdmin = checkRole(authUser, [1])

    let form = useForm({
        _method: 'put',
        tecnoacademia_id: proyectoIdiTecnoacademia.tecnoacademia_id,
        semillero_investigacion_id: proyectoIdiTecnoacademia.semillero_investigacion_id,
        proyecto_id: proyectoIdiTecnoacademia.proyecto_id,
        tecnoacademia_linea_tecnoacademia_id: lineasRelacionadas,
        titulo: proyectoIdiTecnoacademia.titulo,
        fecha_inicio: proyectoIdiTecnoacademia.fecha_inicio,
        fecha_finalizacion: proyectoIdiTecnoacademia.fecha_finalizacion,
        resumen: proyectoIdiTecnoacademia.resumen,
        palabras_clave: proyectoIdiTecnoacademia.palabras_clave,
        especies: proyectoIdiTecnoacademia.especies,
        tiene_linea_investigacion: proyectoIdiTecnoacademia.tiene_linea_investigacion,
        lineas_investigacion: proyectoIdiTecnoacademia.lineas_investigacion,
        proyecto_nuevo: proyectoIdiTecnoacademia.proyecto_nuevo,
        proyecto_con_continuidad: proyectoIdiTecnoacademia.proyecto_con_continuidad,
        productos_premios: proyectoIdiTecnoacademia.productos_premios,
        texto_exposicion: proyectoIdiTecnoacademia.texto_exposicion,
        pdf_proyecto: null,
        resultados_obtenidos: proyectoIdiTecnoacademia.resultados_obtenidos,
        documentos_resultados: null,
        observaciones_resultados: proyectoIdiTecnoacademia.observaciones_resultados,
        nombre_aprendices_vinculados: proyectoIdiTecnoacademia.nombre_aprendices_vinculados,
        nombre_instituciones_educativas: proyectoIdiTecnoacademia.nombre_instituciones_educativas,
        nuevas_instituciones_educativas: proyectoIdiTecnoacademia.nuevas_instituciones_educativas,
        programa_sennova_participante: programasRelacionados,
        programa_formacion_articulado_media: proyectoIdiTecnoacademia.programa_formacion_articulado_media,
        entidades_vinculadas: proyectoIdiTecnoacademia.entidades_vinculadas,
        fuente_recursos: proyectoIdiTecnoacademia.fuente_recursos,
        presupuesto: proyectoIdiTecnoacademia.presupuesto,
        hace_parte_de_semillero: proyectoIdiTecnoacademia.hace_parte_de_semillero,
        estado_proyecto: proyectoIdiTecnoacademia.estado_proyecto,
        poblacion_beneficiada: proyectoIdiTecnoacademia.poblacion_beneficiada,
        otra_poblacion_beneficiada: proyectoIdiTecnoacademia.otra_poblacion_beneficiada,
        nombre_centro_programa: proyectoIdiTecnoacademia.nombre_centro_programa,
        beneficiados: beneficiadosRelacionados,
        municipios: municipiosRelacionados,
        rol_sennova: autorPrincipal.pivot.rol_sennova,
        cantidad_meses: autorPrincipal.pivot.cantidad_meses,
        cantidad_horas: autorPrincipal.pivot.cantidad_horas,
    })

    let dialogGuardar = false
    function submit() {
        if (proyectoIdiTecnoacademia.allowed.to_update) {
            $form.post(route('proyectos-idi-tecnoacademia.update', proyectoIdiTecnoacademia.id), {
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
                    <a use:inertia href={route('proyectos-idi-tecnoacademia.index')} className="text-app-400 hover:text-app-600"> Proyectos I+D+i TecnoAcademia </a>
                    <span className="text-app-400 font-medium">/</span>
                    <a use:inertia href={route('proyectos-idi-tecnoacademia.edit', proyectoIdiTecnoacademia.id)} className="text-app-400 hover:text-app-600 font-extrabold underline"> Información básica </a>
                    <span className="text-app-400 font-medium">/</span>
                    <a use:inertia href={route('proyectos-idi-tecnoacademia.participantes.index', proyectoIdiTecnoacademia.id)} className="text-app-400 hover:text-app-600"> Participantes </a>
                    <span className="text-app-400 font-medium">/</span>
                    <a use:inertia href={route('proyectos-idi-tecnoacademia.productos.index', proyectoIdiTecnoacademia.id)} className="text-app-400 hover:text-app-600">Productos</a>
                </h1>
            </div>
        </div>
    </header>

    <Form {errors} {proyectoIdiTecnoacademia} {tecnoacademias} {programasSennova} {semillerosInvestigacion} {estadosProyectoIdiTecnoacademia} {proyectos} {regionales} {municipios} {roles} {beneficiados} {form} {submit} {lineasTecnoacademia} bind:dialogGuardar />
</AuthenticatedLayout>
