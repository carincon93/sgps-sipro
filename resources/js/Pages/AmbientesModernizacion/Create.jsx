<script>
    import AuthenticatedLayout, { title } from '@/Layouts/Authenticated'
    import { inertia, useForm, page } from '@inertiajs/inertia-svelte'
    import { route, checkRole, checkPermission } from '@/Utils'
    import { _ } from 'svelte-i18n'

    import Form from './Form.svelte'

    export let errors
    export let centrosFormacion
    export let codigosSgps
    export let mesasSectoriales
    export let tipologiasAmbientes
    export let areasConocimiento
    export let subareasConocimiento
    export let disciplinasSubareaConocimiento
    export let redesConocimiento
    export let actividadesEconomicas
    export let lineasInvestigacion
    export let tematicasEstrategicas
    export let seguimientoId
    export let allowedToCreate

    $: $title = 'Crear ambiente de modernización'

    /**
     * Validar si el usuario autenticado es SuperAdmin
     */
    let authUser = $auth.user
    let isSuperAdmin = checkRole(authUser, [1])

    let formRazonEstadoGeneral = useForm({
        razon_estado_general: '',
    })
    let formJustificacionAmbienteInactivo = useForm({
        justificacion_ambiente_inactivo: '',
    })
    let formImpactoProcesosFormacion = useForm({
        impacto_procesos_formacion: '',
    })
    let formPertinenciaSectorProductivo = useForm({
        pertinencia_sector_productivo: '',
    })
    let formProductividadBeneficiarios = useForm({
        productividad_beneficiarios: '',
    })
    let formGeneracionEmpleo = useForm({
        generacion_empleo: '',
    })
    let formCreacionEmpresas = useForm({
        creacion_empresas: '',
    })
    let formIncorporacionNuevosConocimientos = useForm({
        incorporacion_nuevos_conocimientos: '',
    })
    let formValorAgregadoEntidades = useForm({
        valor_agregado_entidades: '',
    })
    let formFortalecimientoProgramasFormacion = useForm({
        fortalecimiento_programas_formacion: '',
    })
    let formTransferenciaTecnologias = useForm({
        transferencia_tecnologias: '',
    })
    let formCoberturaPerntinenciaFormacion = useForm({
        cobertura_perntinencia_formacion: '',
    })
    let formObservacionesGeneralesAmbiente = useForm({
        observaciones_generales_ambiente: '',
    })
    let formSoporteFotos = useForm({
        soporte_fotos_ambiente: null,
    })

    let form = useForm({
        seguimiento_ambiente_modernizacion_id: seguimientoId,
        centro_formacion_id: null,
        codigo_proyecto_sgps_id: null,
        nombre_ambiente: '',
        tipologia_ambiente_id: null,
        red_conocimiento_id: null,
        linea_investigacion_id: null,
        actividad_economica_id: null,
        area_conocimiento_id: null,
        subarea_conocimiento_id: null,
        disciplina_subarea_conocimiento_id: null,
        tematica_estrategica_id: null,
        alineado_mesas_sectoriales: false,
        financiado_anteriormente: false,
        mesa_sectorial_id: [],
        codigos_proyectos_id: null,
    })

    function submit() {
        if (allowedToCreate) {
            $form.post(route('ambientes-modernizacion.store'))
        }
    }
</script>

<AuthenticatedLayout>
    <header className="pt-[8rem]" slot="header">
        <div className="flex items-center justify-between lg:px-8 max-w-7xl mx-auto px-4 py-6 sm:px-6">
            <div>
                <h1>
                    <a use:inertia href={route('ambientes-modernizacion.index')} className="text-app-400 hover:text-app-600"> Ambientes de modernización </a>
                    <span className="text-app-400 font-medium">/</span>
                    Crear
                </h1>
            </div>
        </div>
    </header>

    <Form
        {form}
        {errors}
        {centrosFormacion}
        {codigosSgps}
        {formRazonEstadoGeneral}
        {formJustificacionAmbienteInactivo}
        {formImpactoProcesosFormacion}
        {formPertinenciaSectorProductivo}
        {formProductividadBeneficiarios}
        {formGeneracionEmpleo}
        {formCreacionEmpresas}
        {formIncorporacionNuevosConocimientos}
        {formValorAgregadoEntidades}
        {formFortalecimientoProgramasFormacion}
        {formTransferenciaTecnologias}
        {formCoberturaPerntinenciaFormacion}
        {formObservacionesGeneralesAmbiente}
        {formSoporteFotos}
        {mesasSectoriales}
        {tipologiasAmbientes}
        {areasConocimiento}
        {subareasConocimiento}
        {disciplinasSubareaConocimiento}
        {tematicasEstrategicas}
        {redesConocimiento}
        {actividadesEconomicas}
        {lineasInvestigacion}
        {submit}
        {allowedToCreate}
    />
</AuthenticatedLayout>
