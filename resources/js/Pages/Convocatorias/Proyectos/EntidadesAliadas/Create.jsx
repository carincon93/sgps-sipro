<script>
    import AuthenticatedLayout, { title } from '@/Layouts/Authenticated'
    import { inertia, useForm, page } from '@inertiajs/inertia-svelte'
    import { route, checkRole, checkPermission } from '@/Utils'
    import { _ } from 'svelte-i18n'

    import Form from './Form'

    export let errors
    export let convocatoria
    export let proyecto
    export let actividades
    export let tiposEntidadAliada
    export let naturalezaEntidadAliada
    export let tiposEmpresa

    $: $title = 'Crear entidad aliada'

    /**
     * Validar si el usuario autenticado es SuperAdmin
     */
    let authUser = $auth.user
    let isSuperAdmin = checkRole(authUser, [1])

    let form = useForm({
        tipo: '',
        nombre: '',
        naturaleza: '',
        tipo_empresa: '',
        nit: '',
        descripcion_convenio: '',
        grupo_investigacion: '',
        codigo_gruplac: '',
        enlace_gruplac: '',
        actividades_transferencia_conocimiento: '',
        recursos_especie: '',
        descripcion_recursos_especie: '',
        recursos_dinero: '',
        descripcion_recursos_dinero: '',
        carta_intencion: null,
        carta_propiedad_intelectual: null,
        soporte_convenio: null,
        infraestructura_tecnoacademia: '',
        fecha_inicio_convenio: '',
        fecha_fin_convenio: '',
        actividad_id: [],
        tipo_convocatoria: convocatoria.tipo_convocatoria,
    })

    function submit() {
        if (proyecto.allowed.to_update) {
            $form.post(route('convocatorias.proyectos.entidades-aliadas.store', [convocatoria.id, proyecto.id]))
        }
    }
</script>

<AuthenticatedLayout>
    <header className="pt-[8rem]" slot="header">
        <div className="flex items-center justify-between lg:px-8 max-w-7xl mx-auto px-4 py-6 sm:px-6">
            <div>
                <h1>
                    <a use:inertia href={route('convocatorias.proyectos.entidades-aliadas.index', [convocatoria.id, proyecto.id])} className="text-app-400 hover:text-app-600"> Entidades aliadas </a>
                    <span className="text-app-400 font-medium">/</span>
                    Crear
                </h1>
            </div>
        </div>
    </header>

    <div className="grid grid-cols-3 gap-4">
        <div className="sticky top-0">
            <h1 className="font-black text-4xl uppercase">Nueva entidad aliada</h1>
        </div>

        <div className="bg-white rounded shadow col-span-2">
            <Form {errors} {convocatoria} {proyecto} {actividades} {tiposEntidadAliada} {naturalezaEntidadAliada} {tiposEmpresa} {form} {submit} method="store" />
        </div>
    </div>
</AuthenticatedLayout>
