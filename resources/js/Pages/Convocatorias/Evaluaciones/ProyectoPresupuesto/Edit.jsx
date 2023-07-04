<script>
    import AuthenticatedLayout, { title } from '@/Layouts/Authenticated'
    import { inertia, useForm, page } from '@inertiajs/inertia-svelte'
    import { route, checkRole } from '@/Utils'
    import { _ } from 'svelte-i18n'

    import InfoMessage from '@/Components/InfoMessage'
    import Switch from '@/Components/Switch'
    import Textarea from '@/Components/Textarea'
    import PrimaryButton from '@/Components/PrimaryButton'
    import Form from '../../Proyectos/ProyectoPresupuesto/Form'

    export let errors
    export let convocatoria
    export let evaluacion
    export let proyectoPresupuestoEvaluacion
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

    $: $title = proyectoPresupuesto.convocatoria_presupuesto.presupuesto_sennova.uso_presupuestal ? proyectoPresupuesto.convocatoria_presupuesto.presupuesto_sennova.uso_presupuestal.descripcion : null

    /**
     * Validar si el usuario autenticado es SuperAdmin
     */
    let authUser = $auth.user
    let isSuperAdmin = checkRole(authUser, [1])

    let presupuestoInfo = useForm({
        codigo_uso_presupuestal: '',

        segundo_grupo_presupuestal_id: proyectoPresupuesto.convocatoria_presupuesto?.presupuesto_sennova?.segundo_grupo_presupuestal_id,
        tercer_grupo_presupuestal_id: proyectoPresupuesto.convocatoria_presupuesto?.presupuesto_sennova?.tercer_grupo_presupuestal_id,
        convocatoria_presupuesto_id: proyectoPresupuesto.convocatoria_presupuesto_id,

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
    })

    let form = useForm({
        comentario: proyectoPresupuestoEvaluacion ? proyectoPresupuestoEvaluacion.comentario : '',
        correcto: proyectoPresupuestoEvaluacion?.correcto == undefined || proyectoPresupuestoEvaluacion?.correcto == true ? true : false,
    })
    function submit() {
        if (isSuperAdmin || (checkRole(authUser, [11, 5]) && evaluacion.finalizado == false && evaluacion.habilitado == true && evaluacion.modificable == true)) {
            $form.put(route('convocatorias.evaluaciones.presupuesto.update', [convocatoria.id, evaluacion.id, proyectoPresupuesto.id]), {
                preserveScroll: true,
            })
        }
    }

    let presupuestoSennova
    let prevSegundoGrupoPresupuestal
    $: {
        if (presupuestoInfo.segundo_grupo_presupuestal_id != prevSegundoGrupoPresupuestal) {
            presupuestoSennova = null
        }

        presupuestoInfo.codigo_uso_presupuestal = presupuestoSennova?.codigo
        prevSegundoGrupoPresupuestal = presupuestoInfo.segundo_grupo_presupuestal_id
    }
</script>

<AuthenticatedLayout>
    <header className="pt-[8rem]" slot="header">
        <div className="flex items-center justify-between lg:px-8 max-w-7xl mx-auto px-4 py-6 sm:px-6">
            <div>
                <h1 className="overflow-ellipsis overflow-hidden w-breadcrumb-ellipsis whitespace-nowrap">
                    <a use:inertia href={route('convocatorias.evaluaciones.presupuesto.index', [convocatoria.id, evaluacion.id])} className="text-app-400 hover:text-app-600"> Presupuesto </a>
                    <span className="text-app-400 font-medium">/</span>
                    {proyectoPresupuesto.convocatoria_presupuesto.presupuesto_sennova.uso_presupuestal.descripcion}
                </h1>
            </div>
        </div>
    </header>
    <div className="grid grid-cols-3 gap-4">
        <div>
            <h1 className="font-black text-4xl sticky top-0 uppercase">Evaluar rubro</h1>

            <a href={route('convocatorias.evaluaciones.presupuesto.soportes', [convocatoria.id, evaluacion.id, proyectoPresupuesto.id])} className="text-app-400 hover:text-app-600 flex items-center my-10">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
                Ir al estudio de mercado y soportes
            </a>
        </div>
        <div className="col-span-2">
            <Form {errors} proyecto={evaluacion.proyecto} {convocatoria} {proyectoPresupuesto} {tiposLicencia} {tiposSoftware} {opcionesServiciosEdicion} form={presupuestoInfo} {submit} {segundoGrupoPresupuestal} {tercerGrupoPresupuestal} {usosPresupuestales} {conceptosViaticos} {distanciasMunicipios} {frecuenciasSemanales} {proyectoRolesSennova} {municipios} method="PUT">
                <div slot="viaticos">
                    {#if evaluacion.proyecto.linea_programatica.codigo == 69 || evaluacion.proyecto.linea_programatica.codigo == 70}
                        {#if $form.segundo_grupo_presupuestal_id?.codigo == '2041102' || $form.segundo_grupo_presupuestal_id?.codigo == '2041101' || $form.segundo_grupo_presupuestal_id?.codigo == '2041104'}
                            <h1 className="text-center text-2xl mt-10">Relacione los municipios a visitar:</h1>

                            <table className="w-full bg-white whitespace-no-wrap table-fixed data-table mt-10" id="municipios-viaticos">
                                <thead>
                                    <tr className="text-left font-bold">
                                        <th className="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full text-xs">Municipio</th>
                                        <th className="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full text-xs">Distancia municipio</th>
                                        <th className="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full text-xs">Frecuencia semanal de visita</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {#each taTpViaticosMunicipios as municipio}
                                        <tr className="hover:bg-gray-100 focus-within:bg-gray-100">
                                            <td className="border-t px-6 pt-6 pb-4 text-xs">
                                                <div className="my-4">
                                                    {municipio.municipio.nombre}
                                                </div>
                                            </td>
                                            <td className="border-t px-6 pt-6 pb-4 text-xs">
                                                <div className="my-4">
                                                    {municipio.distancia_municipio}
                                                </div>
                                            </td>
                                            <td className="border-t px-6 pt-6 pb-4 text-xs">
                                                <div className="my-4">
                                                    {municipio.distancia_municipio}
                                                </div>
                                            </td>
                                        </tr>
                                    {/each}
                                    {#if taTpViaticosMunicipios.length === 0}
                                        <tr className="hover:bg-gray-100 focus-within:bg-gray-100">
                                            <td className="border-t px-6 pt-6 pb-4" colspan="9"> Sin información registrada </td>
                                        </tr>
                                    {/if}
                                </tbody>
                            </table>
                        {/if}
                    {/if}
                </div>
            </Form>

            <form className="mt-10" on:submit|preventDefault={submit} id="form-proyecto-presupuesto">
                <InfoMessage>
                    <div className="mt-4">
                        <p>¿El rubro presupuestal es correcto? Por favor seleccione si Cumple o No cumple.</p>
                        <Switch onMessage="Cumple" offMessage="No cumple" disabled={isSuperAdmin ? undefined : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : undefined} bind:checked={$form.correcto} />
                        {#if $form.correcto == false}
                            <Textarea disabled={isSuperAdmin ? undefined : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : undefined} label="Comentario" className="mt-4" maxlength="40000" id="comentario" bind:value={$form.comentario} error={errors.comentario} required />
                        {/if}
                    </div>
                </InfoMessage>

                <div className="flex items-center justify-between mt-14 px-8 py-4">
                    {#if isSuperAdmin || (checkRole(authUser, [11, 5]) && evaluacion.finalizado == false && evaluacion.habilitado == true && evaluacion.modificable == true)}
                        {#if presupuestoInfo.convocatoria_presupuesto_id != '' || presupuestoInfo.convocatoria_presupuesto_id != ''}
                            <PrimaryButton loading={$form.processing} className="ml-auto" type="submit">Evaluar</PrimaryButton>
                        {/if}
                    {/if}
                </div>
            </form>
        </div>
    </div>
</AuthenticatedLayout>
