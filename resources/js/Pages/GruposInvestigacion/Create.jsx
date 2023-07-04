<script>
    import AuthenticatedLayout, { title } from '@/Layouts/Authenticated'
    import { inertia, useForm, page } from '@inertiajs/inertia-svelte'
    import { route, checkRole, checkPermission } from '@/Utils'
    import { _ } from 'svelte-i18n'

    import Form from './Form'

    export let errors
    export let categoriasMinciencias
    export let redesConocimiento
    export let centrosFormacion
    export let allowedToCreate

    $: $title = 'Crear grupo de investigación'

    /**
     * Validar si el usuario autenticado es SuperAdmin
     */
    let authUser = $auth.user
    let isSuperAdmin = checkRole(authUser, [1])

    let form = useForm({
        nombre: '',
        acronimo: '',
        email: '',
        enlace_gruplac: '',
        codigo_minciencias: '',
        categoria_minciencias: '',
        fecha_creacion_grupo: '',
        nombre_lider_grupo: '',
        email_contacto: '',
        reconocimientos_grupo_investigacion: '',
        programa_nal_ctei_principal: '',
        programa_nal_ctei_secundaria: '',
        vision: '',
        mision: '',
        objetivo_general: '',
        objetivos_especificos: '',
        link_propio_grupo: '',
        centro_formacion_id: null,
        redes_conocimiento: null,
        formato_gic_f_020: null,
        formato_gic_f_032: null,
    })

    function submit() {
        if (allowedToCreate) {
            $form.post(route('grupos-investigacion.store'))
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
                    Crear
                </h1>
            </div>
        </div>
    </header>

    <div className="grid grid-cols-3 gap-4">
        <div className="sticky top-0">
            <h1 className="font-black text-4xl uppercase">Nuevo grupo de investigación</h1>
        </div>

        <div className="col-span-2">
            <Form {submit} {form} {errors} {categoriasMinciencias} {redesConocimiento} {centrosFormacion} {allowedToCreate} method="store" />
        </div>
    </div>
</AuthenticatedLayout>
