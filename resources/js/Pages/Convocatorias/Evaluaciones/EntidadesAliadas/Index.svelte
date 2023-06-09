<script>
    import AuthenticatedLayout, { title } from '@/Layouts/Authenticated'
    import { page, useForm } from '@inertiajs/inertia-svelte'
    import { route, checkRole } from '@/Utils'
    import { _ } from 'svelte-i18n'
    import { Inertia } from '@inertiajs/inertia'

    import Pagination from '@/Shared/Pagination'
    import DataTableMenu from '@/Shared/DataTableMenu'
    import { Item, Text } from '@smui/list'
    import DataTable from '@/Shared/DataTable'
    import EvaluationStepper from '@/Shared/EvaluationStepper'
    import InfoMessage from '@/Shared/InfoMessage'
    import Switch from '@/Shared/Switch'
    import LoadingButton from '@/Shared/LoadingButton'
    import Textarea from '@/Shared/Textarea'
    import Label from '@/Shared/Label'
    import Select from '@/Shared/Select'

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
    let authUser = $page.props.auth.user
    let isSuperAdmin = checkRole(authUser, [1])

    let taInfo = {
        infraestructura_tecnoacademia: proyecto.infraestructura_tecnoacademia,
    }

    let formEstrategiaRegionalEvaluacion = useForm({
        entidad_aliada_verificada: evaluacion.idi_evaluacion?.entidad_aliada_verificada,
    })
    function submitEstrategiaRegionalEvaluacion() {
        if (isSuperAdmin || (checkRole(authUser, [11, 5]) && evaluacion.finalizado == false && evaluacion.habilitado == true && evaluacion.modificable == true)) {
            $formEstrategiaRegionalEvaluacion.put(route('convocatorias.evaluaciones.entidades-aliadas.verificar', [convocatoria.id, evaluacion.id]), {
                preserveScroll: true,
            })
        }
    }

    let formTaEvaluacion = useForm({
        entidad_aliada_comentario: evaluacion.ta_evaluacion?.entidad_aliada_comentario,
        entidad_aliada_requiere_comentario: evaluacion.ta_evaluacion?.entidad_aliada_comentario == null ? true : false,
    })
    function submitTaEvaluacion() {
        if (isSuperAdmin || (checkRole(authUser, [11, 5]) && evaluacion.finalizado == false && evaluacion.habilitado == true && evaluacion.modificable == true)) {
            $formTaEvaluacion.put(route('convocatorias.evaluaciones.entidades-aliadas.guardar-evaluacion', [convocatoria.id, evaluacion.id]), {
                preserveScroll: true,
            })
        }
    }
</script>

<AuthenticatedLayout>
    <header class="pt-[8rem]" slot="header">
        <EvaluationStepper {convocatoria} {evaluacion} {proyecto} />
    </header>

    {#if proyecto.codigo_linea_programatica == 23 || proyecto.codigo_linea_programatica == 65 || proyecto.codigo_linea_programatica == 66 || proyecto.codigo_linea_programatica == 70 || proyecto.codigo_linea_programatica == 82}
        <a class="bg-orangered-900 bottom-0 fixed flex hover:bg-orangered-600 mb-5 ml-10 px-6 py-2 rounded-3xl shadow-2xl text-center text-white z-50" href="#evaluacion">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
            Ir a la evaluación
        </a>
    {/if}

    {#if proyecto.codigo_linea_programatica == 70}
        <form class="mt-20 mb-40">
            <div>
                <Label class="mb-4" labelFor="infraestructura_tecnoacademia" value="La infraestructura donde opera la TecnoAcademia es:" />
                <Select disabled={true} id="infraestructura_tecnoacademia" items={infraestructuraTecnoacademia} bind:selectedValue={taInfo.infraestructura_tecnoacademia} autocomplete="off" placeholder="Seleccione el tipo de insfraestructura" />
            </div>
        </form>
    {/if}

    <DataTable class="mt-20" routeParams={[convocatoria.id, evaluacion.id]}>
        <div slot="title">Entidades aliadas</div>

        <thead slot="thead">
            <tr class="text-left font-bold">
                <th class="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full">Nombre</th>
                <th class="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full">Tipo de entidad aliada</th>
                <th class="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl text-center th-actions">Acciones</th>
            </tr>
        </thead>

        <tbody slot="tbody">
            {#each entidadesAliadas.data as entidadAliada (entidadAliada.id)}
                <tr class="hover:bg-gray-100 focus-within:bg-gray-100">
                    <td class="border-t">
                        <p class="px-6 py-4 focus:text-app-500">
                            {entidadAliada.nombre}
                        </p>
                    </td>
                    <td class="border-t">
                        <p class="px-6 py-4 focus:text-app-500">
                            {entidadAliada.tipo}
                        </p>
                    </td>
                    <td class="border-t td-actions">
                        <DataTableMenu class={entidadesAliadas.data.length < 3 ? 'z-50' : ''}>
                            {#if isSuperAdmin || checkRole(authUser, [11, 5])}
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
                    <td class="border-t px-6 py-4" colspan="4">Sin información registrada</td>
                </tr>
            {/if}
        </tbody>
    </DataTable>
    <Pagination links={entidadesAliadas.links} />

    {#if proyecto.codigo_linea_programatica == 23 || proyecto.codigo_linea_programatica == 65 || proyecto.codigo_linea_programatica == 66 || proyecto.codigo_linea_programatica == 82}
        <hr class="mt-10 mb-10" />

        <h1 class="text-3xl mt-24 mb-8 text-center" id="evaluacion">Evaluación</h1>
        <InfoMessage>
            <form on:submit|preventDefault={submitEstrategiaRegionalEvaluacion}>
                <div class="mt-4">
                    <p>Verifique que la información de la entidad o entidades aliadas registradas sea correcta. Luego seleccione una de las siguientes opciones: <strong>Entidad validada</strong> o <strong>Entidad no validada</strong> y finalmente de clic en <strong>Guardar</strong></p>
                    <Switch onMessage="Entidad validada" offMessage="Entidad no validada" disabled={isSuperAdmin ? undefined : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : undefined} bind:checked={$formEstrategiaRegionalEvaluacion.entidad_aliada_verificada} />
                </div>
                {#if isSuperAdmin || (checkRole(authUser, [11, 5]) && evaluacion.finalizado == false && evaluacion.habilitado == true && evaluacion.modificable == true)}
                    <div class="px-8 py-4 border-t border-gray-200 flex items-center sticky bottom-0">
                        <LoadingButton loading={$formEstrategiaRegionalEvaluacion.processing} class="ml-auto" type="submit">Guardar</LoadingButton>
                    </div>
                {/if}
            </form>
            {#if evaluacion.idi_evaluacion?.entidad_aliada_verificada}
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
        <hr class="mt-10 mb-10" />

        <h1 class="text-3xl mt-24 mb-8 text-center" id="evaluacion">Evaluación</h1>

        <div class="mt-16">
            <form on:submit|preventDefault={submitTaEvaluacion}>
                <InfoMessage>
                    <div class="mt-4">
                        {#if checkRole(authUser, [5]) && evaluacion.evaluacion_final}
                            {#each otrasEvaluaciones as evaluacion}
                                <div class="mb-8">
                                    <h4>Evaluador(a): <span class="font-black capitalize">{evaluacion.evaluacion.evaluador.nombre}</span></h4>
                                    {evaluacion.entidad_aliada_comentario ? evaluacion.entidad_aliada_comentario : 'Estado: El evaluador(a) da cumplimiento a las entidades aliadas'}
                                    <br />
                                </div>
                            {/each}
                        {/if}
                        <p>¿Las entidades aliadas son correctas? Por favor seleccione si Cumple o No cumple.</p>
                        <Switch onMessage="Cumple" offMessage="No cumple" disabled={isSuperAdmin ? undefined : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : undefined} bind:checked={$formTaEvaluacion.entidad_aliada_requiere_comentario} />
                        {#if $formTaEvaluacion.entidad_aliada_requiere_comentario == false}
                            <Textarea disabled={isSuperAdmin ? undefined : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : undefined} label="Comentario" class="mt-4" maxlength="40000" id="entidad_aliada_comentario" bind:value={$formTaEvaluacion.entidad_aliada_comentario} error={errors.entidad_aliada_comentario} required />
                        {/if}
                    </div>
                </InfoMessage>
                <div class="shadow-inner bg-app-200 border-app-400 bottom-0 flex items-center justify-between mt-14 px-8 py-4 sticky">
                    {#if isSuperAdmin || (checkRole(authUser, [11, 5]) && evaluacion.finalizado == false && evaluacion.habilitado == true && evaluacion.modificable == true)}
                        <LoadingButton loading={$formTaEvaluacion.processing} class="ml-auto" type="submit">Guardar</LoadingButton>
                    {/if}
                </div>
            </form>
        </div>
    {/if}
</AuthenticatedLayout>
