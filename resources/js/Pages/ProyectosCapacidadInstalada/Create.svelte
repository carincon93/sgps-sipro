<script>
    import AuthenticatedLayout, { title } from '@/Layouts/Authenticated'
    import { inertia, useForm, page } from '@inertiajs/inertia-svelte'
    import { route, checkRole, checkPermission } from '@/Utils'
    import { _ } from 'svelte-i18n'

    import LoadingButton from '@/Shared/LoadingButton'
    import Form from './Form'

    export let errors
    export let centrosFormacion
    export let listaBeneficiados
    export let lineasInvestigacion
    export let semillerosInvestigacion
    export let areasConocimiento
    export let subareasConocimiento
    export let disciplinasSubareaConocimiento
    export let redesConocimiento
    export let actividadesEconomicas
    export let tiposProyectoCapacidadInstalada
    export let subtiposProyectoCapacidadInstalada
    export let roles
    export let programasFormacion
    export let allowedToCreate

    $: $title = 'Crear proyecto de capacidad instalada'

    /**
     * Validar si el usuario autenticado es SuperAdmin
     */
    let authUser = $page.props.auth.user
    let isSuperAdmin = checkRole(authUser, [1])

    let formPlanteamientoProblema = useForm({
        planteamiento_problema: '',
    })

    let formJustificacion = useForm({
        justificacion: '',
    })

    let formObjetivoGeneral = useForm({
        objetivo_general: '',
    })

    let formMetodologia = useForm({
        metodologia: '',
    })

    let formInfraestructuraDesarrolloProyecto = useForm({
        infraestructura_desarrollo_proyecto: '',
    })

    let formMaterialesFormacion = useForm({
        materiales_formacion_a_usar: '',
    })

    let formConclusiones = useForm({
        conclusiones: '',
    })

    let formBibliografia = useForm({
        bibliografia: '',
    })

    let form = useForm({
        centro_formacion_id: null,
        linea_investigacion_id: null,
        semillero_investigacion_id: null,
        disciplina_subarea_conocimiento_id: null,
        red_conocimiento_id: null,
        actividad_economica_id: null,
        tipo_proyecto_capacidad_instalada_id: null,
        subtipo_proyecto_capacidad_instalada_id: null,
        titulo: '',
        fecha_inicio: null,
        fecha_finalizacion: null,
        beneficia_a: '',
        rol_sennova: null,
        cantidad_meses: 0,
        cantidad_horas: 0,
    })

    let programasFormacionConRegistro = programasFormacion
    function selectProgramasFormacionConRegistros(event) {
        programasFormacionConRegistro = programasFormacion.filter(function (obj) {
            return obj.registro_calificado == true && obj.centro_formacion_id == event.detail?.value
        })
    }

    function submit() {
        if (allowedToCreate) {
            $form.post(route('proyectos-capacidad-instalada.store'))
        }
    }
</script>

<AuthenticatedLayout>
    <header class="pt-[8rem]" slot="header">
        <div class="flex items-center justify-between lg:px-8 max-w-7xl mx-auto px-4 py-6 sm:px-6">
            <div>
                <h1>
                    {#if allowedToCreate}
                        <a use:inertia href={route('proyectos-capacidad-instalada.index')} class="text-app-400 hover:text-app-600"> Proyectos de capacidad instalada </a>
                    {/if}
                    <span class="text-app-400 font-medium">/</span>
                    Crear
                </h1>
            </div>
        </div>
    </header>

    <Form
        {submit}
        {selectProgramasFormacionConRegistros}
        {errors}
        {form}
        {formPlanteamientoProblema}
        {formJustificacion}
        {formObjetivoGeneral}
        {formMetodologia}
        {formInfraestructuraDesarrolloProyecto}
        {formMaterialesFormacion}
        {formConclusiones}
        {formBibliografia}
        {centrosFormacion}
        {lineasInvestigacion}
        {semillerosInvestigacion}
        {redesConocimiento}
        {areasConocimiento}
        {subareasConocimiento}
        {disciplinasSubareaConocimiento}
        {actividadesEconomicas}
        {tiposProyectoCapacidadInstalada}
        {subtiposProyectoCapacidadInstalada}
        {listaBeneficiados}
        {roles}
        {allowedToCreate}
    >
        <div class="shadow-inner bg-app-200 border-app-400 bottom-0 flex items-center justify-between mt-14 px-8 py-4 sticky" slot="buttons">
            {#if allowedToCreate}
                <LoadingButton loading={$form.processing} class="ml-auto" type="submit">Guardar y continuar</LoadingButton>
            {:else}
                <span class="inline-block"> No tiene permisos para crear un proyecto. </span>
            {/if}
        </div>
    </Form>
</AuthenticatedLayout>
