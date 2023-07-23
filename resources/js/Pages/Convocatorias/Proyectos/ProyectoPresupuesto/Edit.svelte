<script>
    import AuthenticatedLayout, { title } from '@/Layouts/Authenticated'
    import { inertia, useForm, page } from '@inertiajs/inertia-svelte'
    import { route, checkRole, checkPermission, back } from '@/Utils'
    import { _ } from 'svelte-i18n'

    import RecomendacionEvaluador from '@/Shared/RecomendacionEvaluador'
    import InfoMessage from '@/Shared/InfoMessage'
    import DataTableMenu from '@/Shared/DataTableMenu'
    import Dialog from '@/Shared/Dialog'
    import SelectMulti from '@/Shared/SelectMulti'
    import Button from '@/Shared/Button'
    import { Item, Separator, Text } from '@smui/list'
    import Label from '@/Shared/Label'
    import Select from '@/Shared/Select'
    import LoadingButton from '@/Shared/LoadingButton'
    import Input from '@/Shared/Input'
    import Textarea from '@/Shared/Textarea'

    import Form from './Form'
    import { Inertia } from '@inertiajs/inertia'

    export let errors
    export let convocatoria
    export let proyecto
    export let proyectoPresupuesto
    export let tiposLicencia
    export let tiposSoftware
    export let opcionesServiciosEdicion
    export let segundoGrupoPresupuestal
    export let tercerGrupoPresupuestal
    export let usosPresupuestales
    export let conceptosViaticos
    export let distanciasMunicipios
    export let frecuenciasSemanales
    export let proyectoRolesSennova
    export let municipios
    export let taTpViaticosMunicipios
    export let usosPresupuestalesRelacionados

    $: $title = 'Editar rubro presupuestal'

    /**
     * Validar si el usuario autenticado es SuperAdmin
     */
    let authUser = $page.props.auth.user
    let isSuperAdmin = checkRole(authUser, [1])

    let form = useForm({
        _method: 'put',
        codigo_uso_presupuestal: '',

        segundo_grupo_presupuestal_id: null,
        tercer_grupo_presupuestal_id: null,
        convocatoria_presupuesto_id: null,

        descripcion: proyectoPresupuesto.descripcion,
        justificacion: proyectoPresupuesto.justificacion,
        numero_items: proyectoPresupuesto.numero_items,
        tipo_software: proyectoPresupuesto.software_info?.tipo_software,
        tipo_licencia: proyectoPresupuesto.software_info?.tipo_licencia,
        fecha_inicio: proyectoPresupuesto.software_info?.fecha_inicio,
        fecha_finalizacion: proyectoPresupuesto.software_info?.fecha_finalizacion,
        servicio_edicion_info: proyectoPresupuesto.servicio_edicion_info?.info,
        valor_total: proyectoPresupuesto.valor_total,
        concepto_viaticos: proyectoPresupuesto.concepto_viaticos,
        requiere_estudio_mercado: null,
    })

    function submit() {
        if (proyecto.allowed.to_update) {
            $form.post(route('convocatorias.proyectos.presupuesto.update', [convocatoria.id, proyecto.id, proyectoPresupuesto.id]), {
                preserveScroll: true,
            })
        }
    }

    let municipioFormDialog = false
    let formMunicipio = useForm({
        id: 0,
        proyecto_rol_sennova_id: null,
        actividad_a_realizar: '',
        distancia_municipio: null,
        frecuencia_semanal: null,
        numero_visitas: 0,
        municipio_id: null,
    })

    function configurarDialogoMunicipio(municipio) {
        $formMunicipio.reset()
        $formMunicipio.id = municipio.id
        $formMunicipio.proyecto_rol_sennova_id = { value: municipio?.proyecto_rol_sennova_id, label: proyectoRolesSennova.find((item) => item.value == municipio?.proyecto_rol_sennova_id)?.label }
        $formMunicipio.actividad_a_realizar = municipio?.actividad_a_realizar
        $formMunicipio.distancia_municipio = { value: municipio?.distancia_municipio, label: distanciasMunicipios.find((item) => item.value == municipio?.distancia_municipio)?.label }
        $formMunicipio.frecuencia_semanal = { value: municipio?.frecuencia_semanal, label: frecuenciasSemanales.find((item) => item.value == municipio?.frecuencia_semanal)?.label }
        $formMunicipio.numero_visitas = municipio?.numero_visitas
        $formMunicipio.municipio_id = { value: municipio?.municipio_id, label: municipios.find((item) => item.value == municipio?.municipio_id)?.label }

        municipioFormDialog = true
    }

    function closeDialog() {
        $formMunicipio.reset()
        municipioFormDialog = false
    }

    function submitMunicipio() {
        if (proyecto.allowed.to_update) {
            $formMunicipio.post(route('convocatorias.proyectos.presupuesto.municipios.store', [convocatoria.id, proyecto.id, proyectoPresupuesto.id]), {
                onFinish: () => closeDialog(),
                preserveScroll: true,
            })
        }
    }

    let municipioId
    let destroyMunicipioDialog = false
    function configurarDialogoMunicipioDestroy(municipio) {
        municipioId = municipio.id
        destroyMunicipioDialog = true
    }

    function destroyMunicipio() {
        if (proyecto.allowed.to_update) {
            $formMunicipio.delete(route('convocatorias.proyectos.presupuesto.municipios.destroy', [convocatoria.id, proyecto.id, proyectoPresupuesto.id, municipioId]), {
                onFinish: () => ((municipioId = null), (destroyMunicipioDialog = false)),
                preserveScroll: true,
            })
        }
    }

    let infoViaticosDialog = true
</script>

<AuthenticatedLayout>
    <header class="pt-[8rem]" slot="header">
        <div class="flex items-center justify-between lg:px-8 max-w-7xl mx-auto px-4 py-6 sm:px-6">
            <h1 class="flex overflow-ellipsis overflow-hidden w-breadcrumb-ellipsis whitespace-nowrap">
                <a use:inertia href={route('convocatorias.proyectos.presupuesto.index', [convocatoria.id, proyecto.id]) + '?page=' + proyectoPresupuesto.item_page + '&#PRE-' + proyectoPresupuesto.id} class="text-app-400 hover:text-app-600 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M11 15l-3-3m0 0l3-3m-3 3h8M3 12a9 9 0 1118 0 9 9 0 01-18 0z" />
                    </svg>
                    Volver a la lista de rubros
                </a>
                <span class="text-app-400 font-medium mx-2">/</span>
                Editar rubro presupuestal
            </h1>
        </div>
    </header>

    <div class="grid grid-cols-3 gap-4">
        <div>
            <h1 class="font-black text-4xl sticky top-0 uppercase">Editar rubro</h1>

            <InfoMessage class="mt-10">Para mayor información consultar en la plataforma CompromISO la guía descripción de los rubros presupuestales SENA, código: GRF-G-004</InfoMessage>

            {#if usosPresupuestalesRelacionados[0].requiere_estudio_mercado}
                <a href={route('convocatorias.proyectos.presupuesto.soportes.index', [convocatoria.id, proyecto.id, proyectoPresupuesto.id])} class="text-app-400 hover:text-app-600 flex items-center my-10">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                    Ir al estudio de mercado y soportes
                </a>
            {/if}

            {#if isSuperAdmin || proyecto.mostrar_recomendaciones}
                <RecomendacionEvaluador class="!w-full mt-10">
                    {#each proyectoPresupuesto.proyecto_presupuestos_evaluaciones as evaluacionPresupuesto, i}
                        <div class="bg-zinc-900 p-4 rounded shadow text-white my-2">
                            <p class="text-xs">Evaluador COD-{evaluacionPresupuesto.evaluacion.id}:</p>
                            <p class="whitespace-pre-line text-xs">
                                {#if evaluacionPresupuesto.correcto == false && evaluacionPresupuesto.evaluacion.habilitado}
                                    {evaluacionPresupuesto.comentario ? evaluacionPresupuesto.comentario : 'Sin recomendación'}
                                {:else}
                                    Aprobado
                                {/if}
                            </p>
                        </div>
                    {/each}
                    {#if proyectoPresupuesto.proyecto_presupuestos_evaluaciones.length == 0}
                        <p class="whitespace-pre-line mt-4 text-xs">El proyecto no ha sido evaluado aún.</p>
                    {/if}
                </RecomendacionEvaluador>
            {/if}
        </div>
        <div class="col-span-2">
            <Form {errors} {proyecto} {convocatoria} {proyectoPresupuesto} {tiposLicencia} {tiposSoftware} {opcionesServiciosEdicion} {form} {submit} {segundoGrupoPresupuestal} {tercerGrupoPresupuestal} {usosPresupuestales} {conceptosViaticos} {distanciasMunicipios} {frecuenciasSemanales} {proyectoRolesSennova} {municipios} {formMunicipio} {usosPresupuestalesRelacionados} method="PUT">
                <div slot="viaticos">
                    {#if proyecto.linea_programatica.codigo == 69 || proyecto.linea_programatica.codigo == 70}
                        {#if $form.segundo_grupo_presupuestal_id?.codigo == '2041102' || $form.segundo_grupo_presupuestal_id?.codigo == '2041101' || $form.segundo_grupo_presupuestal_id?.codigo == '2041104'}
                            <h1 class="text-center text-2xl mt-10">Relacione los municipios a visitar:</h1>
                            {#if proyecto.allowed.to_update}
                                <div class="flex justify-end mt-10">
                                    <Button on:click={(() => (municipioFormDialog = true), $formMunicipio.reset())} variant="raised" type="button">Añadir un municipio</Button>
                                </div>
                            {/if}
                            <table class="w-full bg-white whitespace-no-wrap table-fixed data-table mt-10" id="municipios-viaticos">
                                <thead>
                                    <tr class="text-left font-bold">
                                        <th class="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full text-xs">Municipio</th>
                                        <th class="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full text-xs">Distancia municipio</th>
                                        <th class="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full text-xs">Frecuencia semanal de visita</th>
                                        <th class="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full text-xs">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {#each taTpViaticosMunicipios as municipio}
                                        <tr class="hover:bg-gray-100 focus-within:bg-gray-100">
                                            <td class="border-t px-6 pt-6 pb-4 text-xs">
                                                <div class="my-4">
                                                    {municipio.municipio.nombre}
                                                </div>
                                            </td>
                                            <td class="border-t px-6 pt-6 pb-4 text-xs">
                                                <div class="my-4">
                                                    {municipio.distancia_municipio}
                                                </div>
                                            </td>
                                            <td class="border-t px-6 pt-6 pb-4 text-xs">
                                                <div class="my-4">
                                                    {municipio.distancia_municipio}
                                                </div>
                                            </td>
                                            <td class="border-t px-6 pt-6 pb-4">
                                                <DataTableMenu>
                                                    {#if proyecto.allowed.to_update}
                                                        <Item on:SMUI:action={() => configurarDialogoMunicipio(municipio)}>
                                                            <Text>Editar</Text>
                                                        </Item>
                                                        <Separator />
                                                        <Item on:SMUI:action={() => configurarDialogoMunicipioDestroy(municipio)}>
                                                            <Text>Eliminar</Text>
                                                        </Item>
                                                    {/if}
                                                </DataTableMenu>
                                            </td>
                                        </tr>
                                    {/each}
                                    {#if taTpViaticosMunicipios.length === 0}
                                        <tr class="hover:bg-gray-100 focus-within:bg-gray-100">
                                            <td class="border-t px-6 pt-6 pb-4" colspan="9"> Sin información registrada </td>
                                        </tr>
                                    {/if}
                                </tbody>
                            </table>
                        {/if}
                    {/if}
                </div>
            </Form>
        </div>
    </div>

    <Dialog bind:open={municipioFormDialog}>
        <div slot="title" class="flex items-center flex-col mt-4">Añadir municipio</div>
        <div slot="content">
            {#if proyecto.linea_programatica.codigo == 69 || proyecto.linea_programatica.codigo == 70}
                <form on:submit|preventDefault={submitMunicipio} id="municipio-a-visitar">
                    <fieldset class="p-8" disabled={proyecto.allowed.to_update ? undefined : true}>
                        <h1 class="mt-14">Comisiones proyectadas</h1>
                        {#if proyectoRolesSennova?.length > 0}
                            <div class="mt-8">
                                <Label required labelFor="proyecto_rol_sennova_id" value="Rol" />
                                <Select id="proyecto_rol_sennova_id" items={proyectoRolesSennova} bind:selectedValue={$formMunicipio.proyecto_rol_sennova_id} error={errors.proyecto_rol_sennova_id} autocomplete="off" placeholder="Seleccione un rol" required />
                            </div>
                        {:else}
                            <InfoMessage alertMsg={true}>No se han generado roles en el numeral <strong>Roles</strong>. Debe crear alguno para que pueda continuar.</InfoMessage>
                        {/if}
                        <div class="mt-8">
                            <Label required labelFor="actividad_a_realizar" value="Actividad a realizar" />
                            <Textarea maxlength="40000" id="actividad_a_realizar" error={errors.actividad_a_realizar} bind:value={$formMunicipio.actividad_a_realizar} required />
                        </div>
                        <div class="mt-8 grid grid-cols-2">
                            <div>
                                <Label required class="mb-4" labelFor="municipio_id" value="Municipio a visitar" />
                            </div>
                            <div>
                                <SelectMulti id="municipio_id" bind:selectedValue={$formMunicipio.municipio_id} items={municipios} isMulti={false} error={errors.municipio_id} placeholder="Seleccione un municipio" required />
                            </div>
                        </div>

                        <div class="mt-8">
                            <Label required labelFor="distancia_municipio" value="Distancia municipio" />
                            <Select id="distancia_municipio" items={distanciasMunicipios} bind:selectedValue={$formMunicipio.distancia_municipio} error={errors.distancia_municipio} autocomplete="off" placeholder="Seleccione una opción" required />
                        </div>

                        <div class="mt-8">
                            <Label required labelFor="frecuencia_semanal" value="Frecuencia semanal de visita" />
                            <Select id="frecuencia_semanal" items={frecuenciasSemanales} bind:selectedValue={$formMunicipio.frecuencia_semanal} error={errors.frecuencia_semanal} autocomplete="off" placeholder="Seleccione una opción" required />
                        </div>

                        <div class="mt-8">
                            <Input label="Número de visitas" id="numero_visitas" type="number" input$min="0" class="mt-1" bind:value={$formMunicipio.numero_visitas} error={errors.numero_visitas} required />
                        </div>
                    </fieldset>
                </form>
            {/if}
        </div>
        <div slot="actions">
            <div class="p-4">
                <Button on:click={() => closeDialog()} variant={null}>Cancelar</Button>
                {#if proyecto.allowed.to_update}
                    <LoadingButton type="submit" loading={$formMunicipio.processing} form="municipio-a-visitar">Guardar</LoadingButton>
                {/if}
            </div>
        </div>
    </Dialog>

    <Dialog bind:open={destroyMunicipioDialog}>
        <div slot="title" class="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
            <div class="p-4">
                <Button
                    on:click={() => {
                        ;(destroyMunicipioDialog = false), (municipioId = null)
                    }}
                    variant={null}>Cancelar</Button
                >
                <LoadingButton loading={$formMunicipio.processing} variant="raised" on:click={destroyMunicipio}>Confirmar</LoadingButton>
            </div>
        </div>
    </Dialog>

    {#if proyecto.linea_programatica.codigo == 69 || proyecto.linea_programatica.codigo == 70}
        {#if $form.segundo_grupo_presupuestal_id?.codigo == '2041102' || $form.segundo_grupo_presupuestal_id?.codigo == '2041101' || $form.segundo_grupo_presupuestal_id?.codigo == '2041104'}
            <Dialog bind:open={infoViaticosDialog}>
                <div slot="title" class="flex items-center">Municipios a visitar</div>
                <div slot="content">
                    Debe seleccionar los municipios a visitrar. Por favor de clic en el botón <strong>Ir a la sección municipios</strong>
                </div>
                <div slot="actions">
                    <div class="p-4">
                        <Button variant="raised" on:click={() => (infoViaticosDialog = false)} on:click={() => Inertia.visit('#municipios-viaticos')}>Ir a la sección municipios</Button>
                    </div>
                </div>
            </Dialog>
        {/if}
    {/if}
</AuthenticatedLayout>
