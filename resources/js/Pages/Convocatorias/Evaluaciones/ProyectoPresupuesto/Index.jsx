<script>
    import AuthenticatedLayout, { title } from '@/Layouts/Authenticated'
    import { page, useForm } from '@inertiajs/inertia-svelte'
    import { route, checkRole } from '@/Utils'
    import { _ } from 'svelte-i18n'
    import { Inertia } from '@inertiajs/inertia'

    import Pagination from '@/Components/Pagination'
    import PrimaryButton from '@/Components/PrimaryButton'
    import Textarea from '@/Components/Textarea'
    import Switch from '@/Components/Switch'
    import InfoMessage from '@/Components/InfoMessage'
    import DataTable from '@/Components/DataTable'
    import DataTableMenu from '@/Components/DataTableMenu'
    import { Item, Text } from '@smui/list'
    import EvaluationStepper from '@/Components/EvaluationStepper'

    export let errors
    export let convocatoria
    export let evaluacion
    export let proyecto
    export let proyectoPresupuesto
    export let segundoGrupoPresupuestal

    $title = 'Presupuesto'

    /**
     * Validar si el usuario autenticado es SuperAdmin
     */
    let auth_user = auth.user
    let is_super_admin = checkRole(auth_user, [1])

    let filters = {
        presupuestos: $page.props.filters.presupuestos,
    }

    let form = useForm({
        proyecto_presupuesto_comentario: evaluacion.ta_evaluacion?.proyecto_presupuesto_comentario ? evaluacion.tp_evaluacion?.proyecto_presupuesto_comentario : '',
        proyecto_presupuesto_requiere_comentario: evaluacion.ta_evaluacion ? (evaluacion.ta_evaluacion?.proyecto_presupuesto_comentario == null ? true : false) : evaluacion.tp_evaluacion?.proyecto_presupuesto_comentario == null ? true : false,
    })
    function submit() {
        if (is_super_admin || (checkRole(auth_user, [11, 5]) && evaluacion.finalizado == false && evaluacion.habilitado == true && evaluacion.modificable == true)) {
            $form.put(route('convocatorias.evaluaciones.proyecto-presupuesto.guardar-evaluacion', [convocatoria.id, evaluacion.id]), {
                preserveScroll: true,
            })
        }
    }
</script>

<AuthenticatedLayout>
    <header className="pt-[8rem]" slot="header">
        <EvaluationStepper {convocatoria} {evaluacion} {proyecto} />
    </header>

    <a className="bg-orangered-900 bottom-0 fixed flex hover:bg-orangered-600 mb-5 ml-10 px-6 py-2 rounded-3xl shadow-2xl text-center text-white z-50" href="#evaluacion">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
        <span>
            <small>¿Cómo realizar la evaluación?</small>
            Clic en <strong>los 3 puntos</strong> y luego en <strong>Evaluar</strong>
        </span>
    </a>

    <DataTable className="mt-20" routeParams={[convocatoria.id, evaluacion.id]} bind:filters showFilters={true}>
        <div slot="filters">
            <label for="presupuestos" className="block text-gray-700">Presupuestos:</label>
            <select id="presupuestos" className="mt-1 w-full form-select" bind:value={filters.presupuestos}>
                <option value={null}>Seleccione un presupuesto</option>
                {#each segundoGrupoPresupuestal as { nombre }}
                    <option value={nombre}>{nombre}</option>
                {/each}
            </select>
        </div>

        <thead slot="thead">
            <tr className="text-left font-bold">
                <th className="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full">Descripción del bien o servicio</th>
                <th className="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full">Subtotal del costo de los productos o servicios requeridos</th>
                <th className="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full">Evaluación</th>
                <th className="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl text-center th-actions">Acciones</th>
            </tr>
        </thead>

        <tbody slot="tbody">
            {#each proyectoPresupuesto.data as presupuesto (presupuesto.id)}
                <tr className="hover:bg-gray-100 focus-within:bg-gray-100">
                    <td className="border-t">
                        <div className="flex flex-col focus:text-app-500 px-6 py-4" id="PRE-{presupuesto.id}">
                            <small>
                                Código: PRE-{presupuesto.id}
                            </small>
                            <div className="mt-3">
                                <p className="paragraph-ellipsis">
                                    {presupuesto.descripcion}
                                </p>
                            </div>

                            <div className="mt-3">
                                <small className="underline">Rubro concepto interno SENA</small>
                                <p className="whitespace-pre-line">
                                    {presupuesto.convocatoria_presupuesto?.presupuesto_sennova?.segundo_grupo_presupuestal.nombre}
                                </p>
                            </div>

                            <div className="mt-3">
                                <small className="underline">Uso presupuestal</small>
                                <p className="whitespace-pre-line">
                                    {presupuesto.convocatoria_presupuesto?.presupuesto_sennova?.uso_presupuestal.descripcion}
                                </p>
                            </div>
                        </div>
                    </td>
                    <td className="border-t">
                        <div className="mt-3 px-6">
                            ${new Intl.NumberFormat('de-DE').format(presupuesto.valor_total)} COP
                        </div>
                        {#if !presupuesto.convocatoria_presupuesto?.presupuesto_sennova?.sumar_al_presupuesto}
                            <span className="text-red-400 text-center text-xs px-6"> Este uso presupuestal NO suma al total del presupuesto </span>
                        {/if}
                    </td>
                    <td className="border-t">
                        <div className="px-6 py-4">
                            <p className="px-6 py-4 focus:text-app-500">
                                {presupuesto.proyecto_presupuestos_evaluaciones?.find((item) => item.evaluacion_id == evaluacion.id) ? 'Evaluado' : 'Sin evaluar'}
                            </p>
                            {#if convocatoria.fase == 4}
                                <small className="text-red-500">{presupuesto.proyecto_presupuestos_evaluaciones?.find((item) => item.evaluacion_id == evaluacion.id && item.correcto == false) ? 'Por favor revise si hicieron la respectiva subsanación' : ''}</small>
                            {/if}
                        </div>
                    </td>
                    <td className="border-t td-actions">
                        <DataTableMenu className={proyectoPresupuesto.data.length < 3 ? 'z-50' : ''}>
                            <Item on:SMUI:action={() => Inertia.visit(route('convocatorias.evaluaciones.presupuesto.edit', [convocatoria.id, evaluacion.id, presupuesto.id]))}>
                                <Text>Evaluar</Text>
                            </Item>

                            <Item on:SMUI:action={() => Inertia.visit(route('convocatorias.evaluaciones.presupuesto.soportes', [convocatoria.id, evaluacion.id, presupuesto.id]))} disabled={!presupuesto.convocatoria_presupuesto?.presupuesto_sennova?.requiere_estudio_mercado} className={!presupuesto.convocatoria_presupuesto?.presupuesto_sennova?.requiere_estudio_mercado ? 'hidden' : ''}>
                                <Text>Estudio de mercado</Text>
                            </Item>
                        </DataTableMenu>
                    </td>
                </tr>
            {/each}

            {#if proyectoPresupuesto.data.length === 0}
                <tr>
                    <td className="border-t px-6 py-4" colspan="5">Sin información registrada</td>
                </tr>
            {/if}
        </tbody>

        <tfoot slot="tfoot">
            <tr>
                <td colspan="5" className="border-t p-4">
                    <strong>Actualmente el total del costo de los productos o servicios requeridos es de:</strong> ${new Intl.NumberFormat('de-DE').format(!isNaN(proyecto.total_proyecto_presupuesto) ? proyecto.total_proyecto_presupuesto : 0)} COP
                </td>
            </tr>
        </tfoot>
    </DataTable>
    <Pagination links={proyectoPresupuesto.links} />

    {#if proyecto.codigo_linea_programatica == 69 || proyecto.codigo_linea_programatica == 70}
        <hr className="mt-10 mb-10" />

        <h1 className="text-3xl mt-24 mb-8 text-center" id="evaluacion">Evaluación general</h1>
        <InfoMessage alertMsg={true}><strong>Importante:</strong> Si hace una evaluación general de los rubros presupuestales reemplazará los ítems ya evaluados.</InfoMessage>

        <div className="mt-16">
            <form on:submit|preventDefault={submit}>
                <InfoMessage>
                    <div className="mt-4">
                        <p>¿Los rubros presupuestales son correctos? Por favor seleccione si Cumple o No cumple.</p>
                        <Switch onMessage="Cumple" offMessage="No cumple" disabled={is_super_admin ? undefined : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : undefined} bind:checked={$form.proyecto_presupuesto_requiere_comentario} />
                        {#if $form.proyecto_presupuesto_requiere_comentario == false}
                            <Textarea disabled={is_super_admin ? undefined : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : undefined} label="Comentario" className="mt-4" maxlength="40000" id="proyecto_presupuesto_comentario" bind:value={$form.proyecto_presupuesto_comentario} error={errors.proyecto_presupuesto_comentario} required />
                        {/if}
                    </div>
                </InfoMessage>
                <div className="flex items-center justify-between mt-14 px-8 py-4">
                    {#if is_super_admin || (checkRole(auth_user, [11, 5]) && evaluacion.finalizado == false && evaluacion.habilitado == true && evaluacion.modificable == true)}
                        <PrimaryButton loading={$form.processing} className="ml-auto" type="submit">Guardar</PrimaryButton>
                    {/if}
                </div>
            </form>
        </div>
    {/if}
</AuthenticatedLayout>
