<script>
    import AuthenticatedLayout, { title } from '@/Layouts/Authenticated'
    import { page, useForm } from '@inertiajs/inertia-svelte'
    import { route, checkRole } from '@/Utils'
    import { _ } from 'svelte-i18n'
    import { Inertia } from '@inertiajs/inertia'

    import Pagination from '@/Components/Pagination'
    import DataTableMenu from '@/Components/DataTableMenu'
    import { Item, Text } from '@smui/list'
    import DataTable from '@/Components/DataTable'
    import EvaluationStepper from '@/Components/EvaluationStepper'
    import InfoMessage from '@/Components/InfoMessage'
    import Switch from '@/Components/Switch'
    import PrimaryButton from '@/Components/PrimaryButton'
    import Textarea from '@/Components/Textarea'
    import Label from '@/Components/Label'
    import Select from '@/Components/Select'

    export let errors
    export let convocatoria
    export let evaluacion
    export let proyecto
    export let tipoEntidad
    export let entidadesAliadas
    export let infraestructuraTecnoacademia
    export let otrasEvaluaciones

    $title = 'Entidades aliadas'

    /**
     * Validar si el usuario autenticado es SuperAdmin
     */
    let auth_user = auth.user
    let is_super_admin = checkRole(auth_user, [1])

    let taInfo = {
        infraestructura_tecnoacademia: proyecto.infraestructura_tecnoacademia,
    }

    let formEstrategiaRegionalEvaluacion = useForm({
        entidad_aliada_verificada: evaluacion.evaluacion_proyecto_linea66?.entidad_aliada_verificada,
    })
    function submitEstrategiaRegionalEvaluacion() {
        if (is_super_admin || (checkRole(auth_user, [11, 5]) && evaluacion.finalizado == false && evaluacion.habilitado == true && evaluacion.modificable == true)) {
            $formEstrategiaRegionalEvaluacion.put(route('convocatorias.evaluaciones.entidades-aliadas.verificar', [convocatoria.id, evaluacion.id]), {
                preserveScroll: true,
            })
        }
    }

    let formTaEvaluacion = useForm({
        entidad_aliada_comentario: evaluacion.evaluacion_proyecto_linea70?.entidad_aliada_comentario ? evaluacion.evaluacion_proyecto_linea70?.entidad_aliada_comentario : '',
        entidad_aliada_requiere_comentario: evaluacion.evaluacion_proyecto_linea70?.entidad_aliada_comentario == null ? true : false,
    })
    function submitTaEvaluacion() {
        if (is_super_admin || (checkRole(auth_user, [11, 5]) && evaluacion.finalizado == false && evaluacion.habilitado == true && evaluacion.modificable == true)) {
            $formTaEvaluacion.put(route('convocatorias.evaluaciones.entidades-aliadas.guardar-evaluacion', [convocatoria.id, evaluacion.id]), {
                preserveScroll: true,
            })
        }
    }
</script>

<AuthenticatedLayout>
    <header className="pt-[8rem]" slot="header">
        <EvaluationStepper {convocatoria} {evaluacion} {proyecto} />
    </header>

    {#if proyecto.codigo_linea_programatica == 23 || proyecto.codigo_linea_programatica == 65 || proyecto.codigo_linea_programatica == 66 || proyecto.codigo_linea_programatica == 70 || proyecto.codigo_linea_programatica == 82}
        <a className="bg-orangered-900 bottom-0 fixed flex hover:bg-orangered-600 mb-5 ml-10 px-6 py-2 rounded-3xl shadow-2xl text-center text-white z-50" href="#evaluacion">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
            Ir a la evaluación
        </a>
    {/if}

    {#if proyecto.codigo_linea_programatica == 70}
        <form className="mt-20 mb-40">
            <div>
                <Label className="mb-4" labelFor="infraestructura_tecnoacademia" value="La infraestructura donde opera la TecnoAcademia es:" />
                <Select disabled={true} id="infraestructura_tecnoacademia" items={infraestructuraTecnoacademia} bind:selectedValue={taInfo.infraestructura_tecnoacademia} autocomplete="off" placeholder="Seleccione el tipo de insfraestructura" />
            </div>
        </form>
    {/if}

    <DataTable className="mt-20" routeParams={[convocatoria.id, evaluacion.id]}>
        <div slot="title">Entidades aliadas</div>

        <thead slot="thead">
            <tr className="text-left font-bold">
                <th className="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full">Nombre</th>
                <th className="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full">Tipo de entidad aliada</th>
                <th className="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl text-center th-actions">Acciones</th>
            </tr>
        </thead>

        <tbody slot="tbody">
            {#each entidadesAliadas.data as entidadAliada (entidadAliada.id)}
                <tr className="hover:bg-gray-100 focus-within:bg-gray-100">
                    <td className="border-t">
                        <p className="px-6 py-4 focus:text-app-500">
                            {entidadAliada.nombre}
                        </p>
                    </td>
                    <td className="border-t">
                        <p className="px-6 py-4 focus:text-app-500">
                            {entidadAliada.tipo}
                        </p>
                    </td>
                    <td className="border-t td-actions">
                        <DataTableMenu className={entidadesAliadas.data.length < 3 ? 'z-50' : ''}>
                            {#if is_super_admin || checkRole(auth_user, [11, 5])}
                                <Item on:SMUI:action={() => Inertia.visit(route('convocatorias.evaluaciones.entidades-aliadas.edit', [convocatoria.id, evaluacion.id, entidadAliada.id]))}>
                                    <Text>Ver detalles</Text>
                                </Item>
                            {/if}
                        </DataTableMenu>
                    </td>
                </tr>
            {/each}

            {#if entidadesAliadas.data.length === 0}
                <tr>
                    <td className="border-t px-6 py-4" colspan="4">Sin información registrada</td>
                </tr>
            {/if}
        </tbody>
    </DataTable>
    <Pagination links={entidadesAliadas.links} />

    {#if proyecto.codigo_linea_programatica == 23 || proyecto.codigo_linea_programatica == 65 || proyecto.codigo_linea_programatica == 66 || proyecto.codigo_linea_programatica == 82}
        <hr className="mt-10 mb-10" />

        <h1 className="text-3xl mt-24 mb-8 text-center" id="evaluacion">Evaluación</h1>
        <InfoMessage>
            <form on:submit|preventDefault={submitEstrategiaRegionalEvaluacion}>
                <div className="mt-4">
                    <p>Verifique que la información de la entidad o entidades aliadas registradas sea correcta. Luego seleccione una de las siguientes opciones: <strong>Entidad validada</strong> o <strong>Entidad no validada</strong> y finalmente de clic en <strong>Guardar</strong></p>
                    <Switch onMessage="Entidad validada" offMessage="Entidad no validada" disabled={is_super_admin ? undefined : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : undefined} bind:checked={$formEstrategiaRegionalEvaluacion.entidad_aliada_verificada} />
                </div>
                {#if is_super_admin || (checkRole(auth_user, [11, 5]) && evaluacion.finalizado == false && evaluacion.habilitado == true && evaluacion.modificable == true)}
                    <div className="px-8 py-4 border-t border-gray-200 flex items-center sticky bottom-0">
                        <PrimaryButton loading={$formEstrategiaRegionalEvaluacion.processing} className="ml-auto" type="submit">Guardar</PrimaryButton>
                    </div>
                {/if}
            </form>
            {#if evaluacion.evaluacion_proyecto_linea66?.entidad_aliada_verificada}
                El puntaje se asigna automáticamente.
                <br />
                <strong>Puntaje:</strong>
                {evaluacion.entidad_aliada_puntaje}
                <br />
                <strong>Tipo de entidad aliada:</strong>
                {tipoEntidad ? tipoEntidad : 'No hay una entidad aliada registrada'}
                <br />
                <strong>Código dependencia presupuestal (SIIF):</strong>
                {proyecto.codigo_linea_programatica}
            {/if}
        </InfoMessage>
    {:else if proyecto.codigo_linea_programatica == 70}
        <hr className="mt-10 mb-10" />

        <h1 className="text-3xl mt-24 mb-8 text-center" id="evaluacion">Evaluación</h1>

        <div className="mt-16">
            <form on:submit|preventDefault={submitTaEvaluacion}>
                <InfoMessage>
                    <div className="mt-4">
                        {#if checkRole(auth_user, [5]) && evaluacion.evaluacion_final}
                            {#each otrasEvaluaciones as evaluacion}
                                <div className="mb-8">
                                    <h4>Evaluador(a): <span className="font-black capitalize">{evaluacion.evaluacion.evaluador.nombre}</span></h4>
                                    {evaluacion.entidad_aliada_comentario ? evaluacion.entidad_aliada_comentario : 'Estado: El evaluador(a) da cumplimiento a las entidades aliadas'}
                                    <br />
                                </div>
                            {/each}
                        {/if}
                        <p>¿Las entidades aliadas son correctas? Por favor seleccione si Cumple o No cumple.</p>
                        <Switch onMessage="Cumple" offMessage="No cumple" disabled={is_super_admin ? undefined : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : undefined} bind:checked={$formTaEvaluacion.entidad_aliada_requiere_comentario} />
                        {#if $formTaEvaluacion.entidad_aliada_requiere_comentario == false}
                            <Textarea disabled={is_super_admin ? undefined : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : undefined} label="Comentario" className="mt-4" maxlength="40000" id="entidad_aliada_comentario" bind:value={$formTaEvaluacion.entidad_aliada_comentario} error={errors.entidad_aliada_comentario} required />
                        {/if}
                    </div>
                </InfoMessage>
                <div className="flex items-center justify-between mt-14 px-8 py-4">
                    {#if is_super_admin || (checkRole(auth_user, [11, 5]) && evaluacion.finalizado == false && evaluacion.habilitado == true && evaluacion.modificable == true)}
                        <PrimaryButton loading={$formTaEvaluacion.processing} className="ml-auto" type="submit">Guardar</PrimaryButton>
                    {/if}
                </div>
            </form>
        </div>
    {/if}
</AuthenticatedLayout>
