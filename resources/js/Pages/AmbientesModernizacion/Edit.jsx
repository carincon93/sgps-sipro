<script>
    import AuthenticatedLayout, { title } from '@/Layouts/Authenticated'
    import { inertia, useForm, page } from '@inertiajs/inertia-svelte'
    import { route, checkRole, checkPermission } from '@/Utils'
    import { _ } from 'svelte-i18n'
    import { Inertia } from '@inertiajs/inertia'

    import Input from '@/Components/Input'
    import Label from '@/Components/Label'
    import PrimaryButton from '@/Components/PrimaryButton'
    import Select from '@/Components/Select'
    import Textarea from '@/Components/Textarea'
    import Dialog from '@/Components/Dialog'
    import Button from '@/Components/Button'
    import DataTableMenu from '@/Components/DataTableMenu'
    import { Item, Text, Separator } from '@smui/list'

    import Form from './Form'

    export let errors
    export let ambienteModernizacion
    export let codigosSgps
    export let tipologiasAmbientes
    export let mesasSectoriales
    export let semillerosInvestigacion
    export let areasConocimiento
    export let subareasConocimiento
    export let disciplinasSubareaConocimiento
    export let redesConocimiento
    export let actividadesEconomicas
    export let lineasInvestigacion
    export let tematicasEstrategicas
    export let programasFormacionConRegistro
    export let programasFormacionSinRegistro
    export let equiposAmbienteModernizacion
    export let roles

    export let codigosProyectosRelacionados
    export let programasFormacionCalificadosRelacionados
    export let programasFormacionNoCalificadosRelacionados
    export let semillerosRelacionados
    export let mesasSectorialesRelacionadas

    let opcionesSiNo = [
        { value: 1, label: 'Si' },
        { value: 2, label: 'No' },
    ]

    let estados = [
        { value: 1, label: 'Buena' },
        { value: 2, label: 'Regular' },
        { value: 3, label: 'Malo' },
    ]

    let estadosEquipo = [
        { value: 'Bueno', label: 'Bueno' },
        { value: 'Regular', label: 'Regular' },
        { value: 'Malo', label: 'Malo' },
    ]

    let opcionesFrecuencia = [
        { value: 'N/A', label: 'N/A' },
        { value: 'Semanal', label: 'Semanal' },
        { value: 'Mensual', label: 'Mensual' },
        { value: 'Trimestral', label: 'Trimestral' },
        { value: 'Semestral', label: 'Semestral' },
        { value: 'Anual', label: 'Anual' },
    ]

    let infoDialog = true
    let equipoFormDialog = false
    let destroyEquipoDialog = false
    let yearInicial = 2014
    let yearFinal = new Date().getFullYear() - 1

    let years = []

    for (let index = yearInicial; index <= yearFinal; index++) {
        years.push({ value: index, label: index })
    }

    $: $title = 'Editar ambiente de modernización'

    /**
     * Validar si el usuario autenticado es SuperAdmin
     */
    let authUser = auth.user
    let isSuperAdmin = checkRole(authUser, [1])

    let formRazonEstadoGeneral = useForm({
        razon_estado_general: ambienteModernizacion.razon_estado_general,
    })
    let formJustificacionAmbienteInactivo = useForm({
        justificacion_ambiente_inactivo: ambienteModernizacion.justificacion_ambiente_inactivo,
    })
    let formImpactoProcesosFormacion = useForm({
        impacto_procesos_formacion: ambienteModernizacion.impacto_procesos_formacion,
    })
    let formPertinenciaSectorProductivo = useForm({
        pertinencia_sector_productivo: ambienteModernizacion.pertinencia_sector_productivo,
    })
    let formProductividadBeneficiarios = useForm({
        productividad_beneficiarios: ambienteModernizacion.productividad_beneficiarios,
    })
    let formGeneracionEmpleo = useForm({
        generacion_empleo: ambienteModernizacion.generacion_empleo,
    })
    let formCreacionEmpresas = useForm({
        creacion_empresas: ambienteModernizacion.creacion_empresas,
    })
    let formIncorporacionNuevosConocimientos = useForm({
        incorporacion_nuevos_conocimientos: ambienteModernizacion.incorporacion_nuevos_conocimientos,
    })
    let formValorAgregadoEntidades = useForm({
        valor_agregado_entidades: ambienteModernizacion.valor_agregado_entidades,
    })
    let formFortalecimientoProgramasFormacion = useForm({
        fortalecimiento_programas_formacion: ambienteModernizacion.fortalecimiento_programas_formacion,
    })
    let formTransferenciaTecnologias = useForm({
        transferencia_tecnologias: ambienteModernizacion.transferencia_tecnologias,
    })
    let formCoberturaPerntinenciaFormacion = useForm({
        cobertura_perntinencia_formacion: ambienteModernizacion.cobertura_perntinencia_formacion,
    })
    let formObservacionesGeneralesAmbiente = useForm({
        observaciones_generales_ambiente: ambienteModernizacion.observaciones_generales_ambiente,
    })
    let formSoporteFotos = useForm({
        soporte_fotos_ambiente: null,
    })

    let form = useForm({
        _method: 'put',
        razon_estado_general: $formRazonEstadoGeneral.razon_estado_general,
        justificacion_ambiente_inactivo: $formJustificacionAmbienteInactivo.justificacion_ambiente_inactivo,
        impacto_procesos_formacion: $formImpactoProcesosFormacion.impacto_procesos_formacion,
        pertinencia_sector_productivo: $formPertinenciaSectorProductivo.pertinencia_sector_productivo,
        productividad_beneficiarios: $formProductividadBeneficiarios.productividad_beneficiarios,
        generacion_empleo: $formGeneracionEmpleo.generacion_empleo,
        creacion_empresas: $formCreacionEmpresas.creacion_empresas,
        incorporacion_nuevos_conocimientos: $formIncorporacionNuevosConocimientos.incorporacion_nuevos_conocimientos,
        valor_agregado_entidades: $formValorAgregadoEntidades.valor_agregado_entidades,
        fortalecimiento_programas_formacion: $formFortalecimientoProgramasFormacion.fortalecimiento_programas_formacion,
        transferencia_tecnologias: $formTransferenciaTecnologias.transferencia_tecnologias,
        cobertura_perntinencia_formacion: $formCoberturaPerntinenciaFormacion.cobertura_perntinencia_formacion,
        observaciones_generales_ambiente: $formObservacionesGeneralesAmbiente.observaciones_generales_ambiente,

        nombre_ambiente: ambienteModernizacion.nombre_ambiente,
        codigo_proyecto_sgps_id: ambienteModernizacion.seguimiento_ambiente_modernizacion.codigo_proyecto_sgps_id,
        tipologia_ambiente_id: ambienteModernizacion.tipologia_ambiente_id,
        red_conocimiento_id: ambienteModernizacion.red_conocimiento_id,
        linea_investigacion_id: ambienteModernizacion.linea_investigacion_id,
        actividad_economica_id: ambienteModernizacion.actividad_economica_id,
        area_conocimiento_id: ambienteModernizacion.disciplina_subarea_conocimiento.subarea_conocimiento.area_conocimiento_id,
        subarea_conocimiento_id: ambienteModernizacion.disciplina_subarea_conocimiento.subarea_conocimiento_id,
        disciplina_subarea_conocimiento_id: ambienteModernizacion.disciplina_subarea_conocimiento_id,
        tematica_estrategica_id: ambienteModernizacion.tematica_estrategica_id,
        semilleros_investigacion_id: semillerosRelacionados.length > 0 ? semillerosRelacionados : null,
        alineado_mesas_sectoriales: {
            value: ambienteModernizacion.alineado_mesas_sectoriales ? 1 : 2,
            label: ambienteModernizacion.alineado_mesas_sectoriales ? 'Si' : 'No',
        },
        financiado_anteriormente: {
            value: ambienteModernizacion.financiado_anteriormente ? 1 : 2,
            label: ambienteModernizacion.financiado_anteriormente ? 'Si' : 'No',
        },
        numero_tecnicas_tecnologias: ambienteModernizacion.numero_tecnicas_tecnologias,
        mesa_sectorial_id: mesasSectorialesRelacionadas,
        codigos_proyectos_id: codigosProyectosRelacionados.length > 0 ? codigosProyectosRelacionados : null,
        estado_general_maquinaria: ambienteModernizacion.estado_general_maquinaria,
        ambiente_activo: {
            value: ambienteModernizacion.ambiente_activo ? 1 : 2,
            label: ambienteModernizacion.ambiente_activo ? 'Si' : 'No',
        },
        programas_formacion_calificados: programasFormacionCalificadosRelacionados.length > 0 ? programasFormacionCalificadosRelacionados : null,
        programas_formacion: programasFormacionNoCalificadosRelacionados.length > 0 ? programasFormacionNoCalificadosRelacionados : null,
        ambiente_activo_procesos_idi: {
            value: ambienteModernizacion.ambiente_activo_procesos_idi ? 1 : 2,
            label: ambienteModernizacion.ambiente_activo_procesos_idi ? 'Si' : 'No',
        },
        numero_proyectos_beneficiados: ambienteModernizacion.numero_proyectos_beneficiados,
        cod_proyectos_beneficiados: ambienteModernizacion.cod_proyectos_beneficiados,
        ambiente_formacion_complementaria: {
            value: ambienteModernizacion.ambiente_formacion_complementaria ? 1 : 2,
            label: ambienteModernizacion.ambiente_formacion_complementaria ? 'Si' : 'No',
        },
        numero_total_cursos_comp: ambienteModernizacion.numero_total_cursos_comp,
        numero_cursos_empresas: ambienteModernizacion.numero_cursos_empresas,
        numero_personas_certificadas: ambienteModernizacion.numero_personas_certificadas,
        datos_empresa: ambienteModernizacion.datos_empresa,
        cursos_complementarios: ambienteModernizacion.cursos_complementarios,
        coordenada_latitud_ambiente: ambienteModernizacion.coordenada_latitud_ambiente,
        coordenada_longitud_ambiente: ambienteModernizacion.coordenada_longitud_ambiente,
        soporte_fotos_ambiente: ambienteModernizacion.soporte_fotos_ambiente,
        numero_publicaciones: ambienteModernizacion.numero_publicaciones,
        numero_aprendices_beneficiados: ambienteModernizacion.numero_aprendices_beneficiados,
        palabras_clave_ambiente: ambienteModernizacion.palabras_clave_ambiente,
        soporte_fotos_ambiente: null,
    })

    let dialogGuardar = false
    function submit() {
        if (ambienteModernizacion.allowed.to_update) {
            $form.post(route('ambientes-modernizacion.update', ambienteModernizacion.id), {
                onFinish: () => {
                    dialogGuardar = false
                },
                preserveScroll: true,
            })
        }
    }

    let formEquipo = useForm({
        id: 0,
        numero_inventario_equipo: '',
        nombre_equipo: '',
        descripcion_tecnica_equipo: '',
        estado_equipo: '',
        equipo_en_funcionamiento: '',
        observaciones_generales: '',
        marca: '',
        horas_promedio_uso: '',
        frecuencia_mantenimiento: '',
        year_adquisicion: '',
        nombre_cuentadante: '',
        cedula_cuentadante: '',
        rol_cuentadante: '',
    })

    function configurarDialogoEquipo(equipoAmbienteModernizacion) {
        $formEquipo.id = equipoAmbienteModernizacion.id
        $formEquipo.numero_inventario_equipo = equipoAmbienteModernizacion.numero_inventario_equipo
        $formEquipo.nombre_equipo = equipoAmbienteModernizacion.nombre_equipo
        $formEquipo.descripcion_tecnica_equipo = equipoAmbienteModernizacion.descripcion_tecnica_equipo
        $formEquipo.estado_equipo = { value: estadosEquipo.find((item) => item.label == equipoAmbienteModernizacion.estado_equipo)?.value, label: equipoAmbienteModernizacion.estado_equipo }
        $formEquipo.equipo_en_funcionamiento = { value: equipoAmbienteModernizacion.equipo_en_funcionamiento, label: opcionesSiNo.find((item) => item.value == equipoAmbienteModernizacion.equipo_en_funcionamiento)?.label }
        $formEquipo.observaciones_generales = equipoAmbienteModernizacion.observaciones_generales
        $formEquipo.marca = equipoAmbienteModernizacion.marca
        $formEquipo.horas_promedio_uso = equipoAmbienteModernizacion.horas_promedio_uso
        $formEquipo.frecuencia_mantenimiento = { value: opcionesFrecuencia.find((item) => item.label == equipoAmbienteModernizacion.frecuencia_mantenimiento)?.value, label: equipoAmbienteModernizacion.frecuencia_mantenimiento }
        $formEquipo.year_adquisicion = { value: equipoAmbienteModernizacion.year_adquisicion, label: equipoAmbienteModernizacion.year_adquisicion }
        $formEquipo.nombre_cuentadante = equipoAmbienteModernizacion.nombre_cuentadante
        $formEquipo.cedula_cuentadante = equipoAmbienteModernizacion.cedula_cuentadante
        $formEquipo.rol_cuentadante = { value: roles.find((item) => item.label == equipoAmbienteModernizacion.rol_cuentadante)?.value, label: equipoAmbienteModernizacion.rol_cuentadante }
        equipoFormDialog = true
    }

    function submitEquipo() {
        if (ambienteModernizacion.allowed.to_update) {
            $formEquipo.post(route('equipos-ambiente-modernizacion.store', ambienteModernizacion.id), {
                onFinish: () => (equipoFormDialog = false),
                preserveScroll: true,
            })
        }
    }

    let equipoAmbienteModernizacionId
    function configurarDialogoEquipoDestroy(equipoAmbienteModernizacion) {
        equipoAmbienteModernizacionId = equipoAmbienteModernizacion.id
        destroyEquipoDialog = true
    }

    function destroyEquipo() {
        if (ambienteModernizacion.allowed.to_update) {
            $formEquipo.delete(route('equipos-ambiente-modernizacion.destroy', equipoAmbienteModernizacionId), {
                onFinish: () => ((equipoAmbienteModernizacionId = null), (destroyEquipoDialog = false)),
                preserveScroll: true,
            })
        }
    }
</script>

<AuthenticatedLayout>
    <header className="pt-[8rem]" slot="header">
        <div className="flex items-center justify-between lg:px-8 max-w-7xl mx-auto px-4 py-6 sm:px-6">
            <div>
                <h1 className="overflow-ellipsis overflow-hidden w-breadcrumb-ellipsis whitespace-nowrap">
                    <a use:inertia href={route('ambientes-modernizacion.index')} className="text-app-400 hover:text-app-600"> Ambientes de modernización </a>
                    <span className="text-app-400 font-medium">/</span>
                    {ambienteModernizacion.nombre_ambiente}
                </h1>
            </div>
        </div>
    </header>

    <div>
        <div className="mt-44 grid grid-cols-2">
            <div><p className="block font-medium text-sm text-gray-700 mb-4">Regional:</p></div>
            <div>
                <p className="capitalize">{ambienteModernizacion.seguimiento_ambiente_modernizacion.centro_formacion.regional.nombre}</p>
                <p>Código: {ambienteModernizacion.seguimiento_ambiente_modernizacion.centro_formacion.regional.codigo}</p>
            </div>
        </div>

        <div className="mt-44 grid grid-cols-2">
            <div><p className="block font-medium text-sm text-gray-700 mb-4">Centro de formación:</p></div>
            <div>
                <p>{ambienteModernizacion.seguimiento_ambiente_modernizacion.centro_formacion.nombre}</p>
                <p>Código: {ambienteModernizacion.seguimiento_ambiente_modernizacion.centro_formacion.codigo}</p>
            </div>
        </div>

        <div className="mt-44 grid grid-cols-2">
            <div><p className="block font-medium text-sm text-gray-700 mb-4">Año de modernización:</p></div>
            <div>
                <p>{ambienteModernizacion.year_modernizacion}</p>
            </div>
        </div>

        <div className="mt-44 grid grid-cols-2">
            <div><p className="block font-medium text-sm text-gray-700 mb-4">1. Código proyecto SGPS:</p></div>
            <div>
                <p>
                    {ambienteModernizacion.seguimiento_ambiente_modernizacion.codigo_proyecto_sgps.titulo}
                    <br />
                    Código: SGPS-{ambienteModernizacion.seguimiento_ambiente_modernizacion.codigo_proyecto_sgps.codigo_sgps}
                    <br />
                    Año: {ambienteModernizacion.seguimiento_ambiente_modernizacion.codigo_proyecto_sgps.year_ejecucion}
                </p>
            </div>
        </div>
    </div>
    <Form
        {form}
        {errors}
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
        {codigosSgps}
        {mesasSectoriales}
        {tipologiasAmbientes}
        {semillerosInvestigacion}
        {areasConocimiento}
        {subareasConocimiento}
        {disciplinasSubareaConocimiento}
        {programasFormacionConRegistro}
        {programasFormacionSinRegistro}
        {tematicasEstrategicas}
        {redesConocimiento}
        {actividadesEconomicas}
        {lineasInvestigacion}
        {opcionesSiNo}
        {estados}
        {submit}
        {ambienteModernizacion}
        allowedToCreate={ambienteModernizacion ? false : true}
        bind:dialogGuardar
    />

    <hr className="w-full block my-20" />

    <div className="mb-20">
        <h1 className="text-center text-2xl">Relacione únicamente los equipos y maquinaría adquirida con la ejecución del proyecto de modernización SENNOVA:</h1>
        {#if ambienteModernizacion.allowed.to_update}
            <div className="flex justify-end mt-10">
                <Button on:click={() => ((equipoFormDialog = true), $formEquipo.reset())} variant="raised" type="button">Crear equipo</Button>
            </div>
        {/if}

        <table className="w-full bg-white whitespace-no-wrap table-fixed data-table mt-10">
            <thead>
                <tr className="text-left font-bold">
                    <th className="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full text-xs">Número de inventario SENA del equipo o maquina</th>
                    <th className="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full text-xs">Información del equipo o maquina</th>
                    <th className="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full text-xs">Información del cuentadante</th>
                    <th className="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full text-xs">Descripción general técnica del equipo o maquina</th>
                    <th className="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full text-xs">Estado del equipo o maquina</th>
                    <th className="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full text-xs">Información de funcionamiento y mantenimiento</th>
                    <th className="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full text-xs">Observaciones generales</th>
                    <th className="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full text-xs">Acciones</th>
                </tr>
            </thead>
            <tbody>
                {#each equiposAmbienteModernizacion as equipoAmbienteModernizacion}
                    <tr className="hover:bg-gray-100 focus-within:bg-gray-100">
                        <td className="border-t px-6 pt-6 pb-4 text-xs">
                            <div className="my-4">
                                {equipoAmbienteModernizacion.numero_inventario_equipo}
                            </div>
                        </td>
                        <td className="border-t px-6 pt-6 pb-4 text-xs">
                            <div className="my-4">
                                <strong>Marca:</strong>
                                {equipoAmbienteModernizacion.marca}
                            </div>
                            <div className="my-4">
                                <strong>Nombre del equipo:</strong>
                                {equipoAmbienteModernizacion.nombre_equipo}
                            </div>

                            <div className="my-4">
                                <strong>Promedio de horas de uso al año:</strong>
                                {equipoAmbienteModernizacion.horas_promedio_uso}
                            </div>

                            <div className="my-4">
                                <strong>Año de adquisición del equipo o maquina:</strong>
                                {equipoAmbienteModernizacion.year_adquisicion}
                            </div>
                        </td>
                        <td className="border-t px-6 pt-6 pb-4 text-xs">
                            <div className="my-4">
                                <strong>Nombre del cuentadante:</strong>
                                {equipoAmbienteModernizacion.nombre_cuentadante}
                            </div>
                            <div className="my-4">
                                <strong>Cédula del cuentadante:</strong>
                                {equipoAmbienteModernizacion.cedula_cuentadante}
                            </div>

                            <div className="my-4">
                                <strong>Rol del cuentadante:</strong>
                                {equipoAmbienteModernizacion.rol_cuentadante}
                            </div>
                        </td>
                        <td className="border-t px-6 pt-6 pb-4 text-xs">
                            <p className="paragraph-ellipsis">
                                {equipoAmbienteModernizacion.descripcion_tecnica_equipo}
                            </p>
                        </td>

                        <td className="border-t px-6 pt-6 pb-4 text-xs">{equipoAmbienteModernizacion.estado_equipo}</td>
                        <td className="border-t px-6 pt-6 pb-4 text-xs">
                            <div className="my-4">
                                <strong>¿El equipo o maquina está en funcionamiento?</strong>
                                {equipoAmbienteModernizacion.equipo_en_funcionamiento_text}
                            </div>
                            <div className="my-4">
                                <strong>¿Con qué frecuencia requiere mantenimiento preventivo el equipo o maquina?</strong>
                                {equipoAmbienteModernizacion.frecuencia_mantenimiento}
                            </div>
                        </td>
                        <td className="border-t px-6 pt-6 pb-4 text-xs">
                            <p className="paragraph-ellipsis">
                                {equipoAmbienteModernizacion.observaciones_generales}
                            </p>
                        </td>

                        <td className="border-t px-6 pt-6 pb-4">
                            <DataTableMenu>
                                {#if ambienteModernizacion.allowed.to_update}
                                    <Item on:SMUI:action={() => configurarDialogoEquipo(equipoAmbienteModernizacion)}>
                                        <Text>Editar</Text>
                                    </Item>
                                    <Separator />
                                    <Item on:SMUI:action={() => configurarDialogoEquipoDestroy(equipoAmbienteModernizacion)}>
                                        <Text>Eliminar</Text>
                                    </Item>
                                {/if}
                            </DataTableMenu>
                        </td>
                    </tr>
                {/each}
                {#if equiposAmbienteModernizacion.length === 0}
                    <tr className="hover:bg-gray-100 focus-within:bg-gray-100">
                        <td className="border-t px-6 pt-6 pb-4" colspan="9"> Sin información registrada </td>
                    </tr>
                {/if}
            </tbody>
        </table>
    </div>

    <Dialog bind:open={equipoFormDialog} size="950px">
        <div slot="title" className="flex items-center flex-col mt-4">Registrar equipo</div>
        <div slot="content">
            <form on:submit|preventDefault={submitEquipo} id="equipo-ambiente-modernizacion">
                <fieldset className="p-8" disabled={ambienteModernizacion.allowed.to_update ? undefined : true}>
                    <div className="mt-8">
                        <Label required className="mb-4" labelFor="numero_inventario_equipo" value="Número de inventario del equipo o máquina" />
                        <Input id="numero_inventario_equipo" type="text" className="mt-1" error={errors.numero_inventario_equipo} placeholder="Escriba el número de inventario del equipo/maquina" bind:value={$formEquipo.numero_inventario_equipo} required />
                    </div>

                    <div className="mt-8">
                        <Label required className="mb-4" labelFor="year_adquisicion" value="Año de adquisición del equipo o maquina" />
                        <Select items={years} id="year_adquisicion" reload={true} bind:selectedValue={$formEquipo.year_adquisicion} error={errors.year_adquisicion} autocomplete="off" placeholder="Seleccione una opción" required />
                    </div>

                    <div className="mt-8">
                        <Label required className="mb-4" labelFor="nombre_equipo" value="Nombre del equipo o máquina" />
                        <Input id="nombre_equipo" type="text" className="mt-1" error={errors.nombre_equipo} placeholder="Escriba el número de inventario del equipo/maquina" bind:value={$formEquipo.nombre_equipo} required />
                    </div>

                    <div className="mt-8">
                        <Label required className="mb-4" labelFor="marca" value="Marca" />
                        <Input id="marca" type="text" className="mt-1" error={errors.marca} placeholder="Escriba marca" bind:value={$formEquipo.marca} required />
                    </div>

                    <div className="mt-8">
                        <Label required className="mb-4" labelFor="descripcion_tecnica_equipo" value="Descripción general técnica del equipo o máquina" />
                        <Textarea maxlength="40000" id="descripcion_tecnica_equipo" error={errors.descripcion_tecnica_equipo} bind:value={$formEquipo.descripcion_tecnica_equipo} required />
                    </div>

                    <div className="mt-8">
                        <Label required className="mb-4" labelFor="horas_promedio_uso" value="Promedio de horas de uso al año" />
                        <Input id="horas_promedio_uso" type="number" input$min="0" className="mt-1" error={errors.horas_promedio_uso} placeholder="Escriba horas_promedio_uso" bind:value={$formEquipo.horas_promedio_uso} required />
                    </div>

                    <div className="mt-8">
                        <Label required className="mb-4" labelFor="estado_equipo" value="Estado del equipo o máquina (Bueno, Regular, Malo)" />
                        <Select items={estadosEquipo} id="estado_equipo" bind:selectedValue={$formEquipo.estado_equipo} error={errors.estado_equipo} autocomplete="off" placeholder="Seleccione una opción" required />
                    </div>

                    <div className="mt-8">
                        <Label required className="mb-4" labelFor="equipo_en_funcionamiento" value="¿El equipo o máquina está funcionamiento? SI/NO" />
                        <Select items={opcionesSiNo} id="equipo_en_funcionamiento" bind:selectedValue={$formEquipo.equipo_en_funcionamiento} error={errors.equipo_en_funcionamiento} autocomplete="off" placeholder="Seleccione una opción" required />
                    </div>

                    <div className="mt-8">
                        <Label required className="mb-4" labelFor="frecuencia_mantenimiento" value="¿Con qué frecuencia requiere mantenimiento preventivo el equipo o maquina?" />
                        <Select items={opcionesFrecuencia} id="frecuencia_mantenimiento" bind:selectedValue={$formEquipo.frecuencia_mantenimiento} error={errors.frecuencia_mantenimiento} autocomplete="off" placeholder="Seleccione una opción" required />
                    </div>

                    <div className="mt-8">
                        <Label required className="mb-4" labelFor="observaciones_generales" value="Observaciones generales" />
                        <Textarea maxlength="40000" id="observaciones_generales" error={errors.observaciones_generales} bind:value={$formEquipo.observaciones_generales} required />
                    </div>

                    <hr className="w-full my-24" />

                    <h1 className="text-cener font-black mb-14">Información del cuentadante</h1>

                    <div className="mt-8">
                        <Label required className="mb-4" labelFor="nombre_cuentadante" value="Nombre completo" />
                        <Input id="nombre_cuentadante" type="text" error={errors.nombre_cuentadante} bind:value={$formEquipo.nombre_cuentadante} required />
                    </div>

                    <div className="mt-8">
                        <Label required className="mb-4" labelFor="cedula_cuentadante" value="Número de cédula" />
                        <Input id="cedula_cuentadante" type="number" input$min="0" error={errors.cedula_cuentadante} bind:value={$formEquipo.cedula_cuentadante} required />
                    </div>

                    <div className="mt-4 mb-20">
                        <Label required className="mb-4" labelFor="rol_cuentadante" value="Rol del cuentadante" />
                        <Select id="rol_cuentadante" items={roles} bind:selectedValue={$formEquipo.rol_cuentadante} error={errors.rol_cuentadante} autocomplete="off" placeholder="Seleccione un rol SENNOVA" required />
                    </div>
                </fieldset>
            </form>
        </div>
        <div slot="actions">
            <div className="p-4">
                <Button on:click={() => (equipoFormDialog = false)} variant={null}>Cancelar</Button>
                {#if ambienteModernizacion.allowed.to_update}
                    <PrimaryButton type="submit" loading={$formEquipo.processing} form="equipo-ambiente-modernizacion">Guardar</PrimaryButton>
                {/if}
            </div>
        </div>
    </Dialog>

    <Dialog bind:open={destroyEquipoDialog}>
        <div slot="title" className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            Eliminar recurso
        </div>
        <div slot="content">
            <p>
                ¿Está seguro(a) que desea eliminar este recurso?
                <br />
                Todos los datos se eliminarán de forma permanente.
                <br />
                Está acción no se puede deshacer.
            </p>
        </div>
        <div slot="actions">
            <div className="p-4">
                <Button on:click={() => ((destroyEquipoDialog = false), (equipoAmbienteModernizacionId = null))} variant={null}>Cancelar</Button>
                <Button variant="raised" on:click={destroyEquipo}>Confirmar</Button>
            </div>
        </div>
    </Dialog>

    <Dialog bind:open={infoDialog} id="informacion">
        <div slot="title" className="flex items-center flex-col mt-4">
            <figure>
                <img src={'/images/proyecto.png'} alt="Proyecto" className="h-32 mb-6" />
            </figure>
            Código del proyecto: {ambienteModernizacion.seguimiento_ambiente_modernizacion.codigo}
        </div>
        <div slot="content">
            <ul>
                <li className="flex items-center">
                    {#if ambienteModernizacion.finalizado}
                        <a className="bg-app-500 mx-auto p-2 rounded text-white text-xs" href={route('ambientes-modernizacion.descargar-pdf', [ambienteModernizacion.id])}>Descargar PDF</a>
                    {/if}
                </li>
            </ul>
            <div>
                <h1 className="text-center mt-4 mb-4">Para terminar de diligenciar toda la información del seguimiento post cierre del ambiente de modernización por favor de clic en <strong>Continuar diligenciando</strong>, si ya actualizó todos los campos de clic en <strong>Omitir</strong></h1>
            </div>
        </div>
        <div slot="actions">
            <div className="p-4">
                <Button on:click={() => (infoDialog = false)} variant={null}>Omitir</Button>
                <Button variant="raised" on:click={() => (infoDialog = false)} on:click={() => Inertia.visit('#financiado_anteriormente')}>Continuar diligenciando</Button>
            </div>
        </div>
    </Dialog>
</AuthenticatedLayout>
