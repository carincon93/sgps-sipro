<script>
    import AuthenticatedLayout, { title } from '@/Layouts/Authenticated'
    import { inertia, useForm, page } from '@inertiajs/inertia-svelte'
    import { route, checkRole, checkPermission } from '@/Utils'
    import { _ } from 'svelte-i18n'

    import Form from './Form'
    import InfoMessage from '@/Shared/InfoMessage'

    export let convocatoria
    export let proyecto
    export let errors
    export let segundoGrupoPresupuestal
    export let tercerGrupoPresupuestal
    export let usosPresupuestales
    export let tiposLicencia
    export let tiposSoftware
    export let opcionesServiciosEdicion
    export let conceptosViaticos
    export let distanciasMunicipios
    export let frecuenciasSemanales
    export let proyectoRolesSennova
    export let municipios

    $: $title = 'Crear presupuesto'

    /**
     * Validar si el usuario autenticado es SuperAdmin
     */
    let authUser = $page.props.auth.user
    let isSuperAdmin = checkRole(authUser, [1])

    let form = useForm({
        convocatoria_presupuesto_id: null,
        descripcion: '',
        justificacion: '',
        numero_items: '',
        tipo_software: '',
        tipo_licencia: '',
        fecha_inicio: '',
        fecha_finalizacion: '',
        codigo_uso_presupuestal: '',
        servicio_edicion_info: '',
        valor_total: 0,
        concepto_viaticos: null,
        requiere_estudio_mercado: null,
    })

    let formMunicipio = useForm({
        id: 0,
        proyecto_rol_sennova_id: null,
        actividad_a_realizar: '',
        distancia_municipio: null,
        frecuencia_semanal: null,
        numero_visitas: 0,
        municipio_id: null,
    })

    function submit() {
        if (proyecto.allowed.to_update) {
            $form.post(route('convocatorias.proyectos.presupuesto.store', [convocatoria.id, proyecto.id]))
        }
    }

    let presupuestoSennova
</script>

<AuthenticatedLayout>
    <header class="pt-[8rem]" slot="header">
        <div class="flex items-center justify-between lg:px-8 max-w-7xl mx-auto px-4 py-6 sm:px-6">
            <div>
                <h1>
                    <a use:inertia href={route('convocatorias.proyectos.presupuesto.index', [convocatoria.id, proyecto.id])} class="text-app-400 hover:text-app-600"> Presupuestos </a>
                    <span class="text-app-400 font-medium">/</span>
                    Crear
                </h1>
            </div>
        </div>
    </header>

    <div class="grid grid-cols-3 gap-4">
        <div class="sticky top-0">
            <h1 class="font-black text-4xl uppercase">Nuevo rubro</h1>
            <InfoMessage class="mt-10">Para mayor información consultar en la plataforma CompromISO la guía descripción de los rubros presupuestales SENA, código: GRF-G-004</InfoMessage>
        </div>

        <div class="bg-white rounded shadow col-span-2">
            <Form {errors} {proyecto} {convocatoria} {tiposLicencia} {tiposSoftware} {opcionesServiciosEdicion} {form} {submit} {presupuestoSennova} {segundoGrupoPresupuestal} {tercerGrupoPresupuestal} {usosPresupuestales} {conceptosViaticos} {distanciasMunicipios} {frecuenciasSemanales} {proyectoRolesSennova} {municipios} {formMunicipio} method="store" />
        </div>
    </div>
</AuthenticatedLayout>

<style>
    :global(#tipo_licencia) {
        border-radius: 4px;
        border: 1px solid #dbdbdb;
        height: 56px;
        padding: 0 10px;
    }

    :global(#tipo_software) {
        border-radius: 4px;
        border: 1px solid #dbdbdb;
        height: 56px;
        padding: 0 10px;
    }
</style>
