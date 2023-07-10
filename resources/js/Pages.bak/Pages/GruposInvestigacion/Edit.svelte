<script>
    import AuthenticatedLayout, { title } from '@/Layouts/Authenticated'
    import { inertia, useForm, page } from '@inertiajs/inertia-svelte'
    import { route, checkRole, checkPermission } from '@/Utils'
    import { _ } from 'svelte-i18n'

    import Form from './Form'

    export let errors
    export let grupoInvestigacion
    export let categoriasMinciencias
    export let redesConocimiento
    export let redesConocimientoGrupoInvestigacion
    export let centrosFormacion

    $: $title = grupoInvestigacion ? grupoInvestigacion.nombre : null

    /**
     * Validar si el usuario autenticado es SuperAdmin
     */
    let authUser = $page.props.auth.user
    let isSuperAdmin = checkRole(authUser, [1])

    let form = useForm({
        _method: 'put',
        nombre: grupoInvestigacion.nombre,
        acronimo: grupoInvestigacion.acronimo,
        email: grupoInvestigacion.email,
        enlace_gruplac: grupoInvestigacion.enlace_gruplac,
        codigo_minciencias: grupoInvestigacion.codigo_minciencias,
        categoria_minciencias: grupoInvestigacion.categoria_minciencias,
        fecha_creacion_grupo: grupoInvestigacion.fecha_creacion_grupo,
        nombre_lider_grupo: grupoInvestigacion.nombre_lider_grupo,
        email_contacto: grupoInvestigacion.email_contacto,
        reconocimientos_grupo_investigacion: grupoInvestigacion.reconocimientos_grupo_investigacion,
        programa_nal_ctei_principal: grupoInvestigacion.programa_nal_ctei_principal,
        programa_nal_ctei_secundaria: grupoInvestigacion.programa_nal_ctei_secundaria,
        vision: grupoInvestigacion.vision,
        mision: grupoInvestigacion.mision,
        objetivo_general: grupoInvestigacion.objetivo_general,
        objetivos_especificos: grupoInvestigacion.objetivos_especificos,
        link_propio_grupo: grupoInvestigacion.link_propio_grupo,
        redes_conocimiento: redesConocimientoGrupoInvestigacion.length > 0 ? redesConocimientoGrupoInvestigacion : null,
        centro_formacion_id: grupoInvestigacion.centro_formacion_id,

        formato_gic_f_020: null,
        formato_gic_f_032: null,
    })

    let dialogGuardar = false
    function submit() {
        if (grupoInvestigacion.allowed.to_update) {
            $form.post(route('grupos-investigacion.update', grupoInvestigacion.id), {
                onFinish: () => {
                    dialogGuardar = false
                },
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
                    <a use:inertia href={route('grupos-investigacion.index')} class="text-app-400 hover:text-app-600"> Grupos de investigación </a>
                    <span class="text-app-400 font-medium">/</span>
                    {grupoInvestigacion.nombre}
                </h1>
            </div>
        </div>
    </header>

    <div class="grid grid-cols-3 gap-4">
        <div class="sticky top-0">
            <h1 class="font-black text-4xl uppercase">Editar grupo de investigación</h1>
        </div>

        <div class="col-span-2">
            <h1 class="font-black text-4xl uppercase">{grupoInvestigacion.nombre}</h1>
            <Form {submit} {form} {errors} {categoriasMinciencias} {redesConocimiento} {centrosFormacion} {grupoInvestigacion} bind:dialogGuardar />
        </div>
    </div>
</AuthenticatedLayout>
