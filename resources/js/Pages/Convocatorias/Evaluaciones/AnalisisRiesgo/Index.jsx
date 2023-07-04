<script>
    import AuthenticatedLayout, { title } from '@/Layouts/Authenticated'
    import { page, useForm } from '@inertiajs/inertia-svelte'
    import { route, checkRole } from '@/Utils'
    import { _ } from 'svelte-i18n'
    import { Inertia } from '@inertiajs/inertia'

    import Pagination from '@/Shared/Pagination'
    import DataTable from '@/Shared/DataTable'
    import DataTableMenu from '@/Shared/DataTableMenu'
    import { Item, Text } from '@smui/list'
    import EvaluationStepper from '@/Shared/EvaluationStepper'
    import InfoMessage from '@/Shared/InfoMessage'
    import Label from '@/Shared/Label'
    import Input from '@/Shared/Input'
    import Switch from '@/Shared/Switch'
    import Textarea from '@/Shared/Textarea'
    import LoadingButton from '@/Shared/LoadingButton'

    export let errors
    export let convocatoria
    export let evaluacion
    export let proyecto
    export let analisisRiesgos
    export let otrasEvaluaciones

    $title = 'Análisis de riesgos'

    /**
     * Validar si el usuario autenticado es SuperAdmin
     */
    let authUser = $page.props.auth.user
    let isSuperAdmin = checkRole(authUser, [1])

    let formEstrategiaRegionalEvaluacion = useForm({
        analisis_riesgos_puntaje: evaluacion.idi_evaluacion ? evaluacion.idi_evaluacion?.analisis_riesgos_puntaje : evaluacion.cultura_innovacion_evaluacion ? evaluacion.cultura_innovacion_evaluacion.analisis_riesgos_puntaje : null,
        analisis_riesgos_comentario: evaluacion.idi_evaluacion ? evaluacion.idi_evaluacion?.analisis_riesgos_comentario : evaluacion.cultura_innovacion_evaluacion ? evaluacion.cultura_innovacion_evaluacion.analisis_riesgos_comentario : null,
        analisis_riesgos_requiere_comentario: evaluacion.idi_evaluacion ? (evaluacion.idi_evaluacion?.analisis_riesgos_comentario == null ? true : false) : evaluacion.cultura_innovacion_evaluacion ? (evaluacion.cultura_innovacion_evaluacion.analisis_riesgos_comentario == null ? true : false) : null,
    })
    function submitEstrategiaRegionalEvaluacion() {
        if (isSuperAdmin || (checkRole(authUser, [11, 5]) && evaluacion.finalizado == false && evaluacion.habilitado == true && evaluacion.modificable == true)) {
            $formEstrategiaRegionalEvaluacion.put(route('convocatorias.evaluaciones.analisis-riesgos.guardar-evaluacion', [convocatoria.id, evaluacion.id]), {
                preserveScroll: true,
            })
        }
    }

    let formTaEvaluacion = useForm({
        analisis_riesgos_comentario: evaluacion.ta_evaluacion?.analisis_riesgos_comentario,
        analisis_riesgos_requiere_comentario: evaluacion.ta_evaluacion?.analisis_riesgos_comentario == null ? true : false,
    })
    function submitTaEvaluacion() {
        if (isSuperAdmin || (checkRole(authUser, [11, 5]) && evaluacion.finalizado == false && evaluacion.habilitado == true && evaluacion.modificable == true)) {
            $formTaEvaluacion.put(route('convocatorias.evaluaciones.analisis-riesgos.guardar-evaluacion', [convocatoria.id, evaluacion.id]), {
                preserveScroll: true,
            })
        }
    }

    let formTpEvaluacion = useForm({
        analisis_riesgos_comentario: evaluacion.tp_evaluacion?.analisis_riesgos_comentario,
        analisis_riesgos_requiere_comentario: evaluacion.tp_evaluacion?.analisis_riesgos_comentario == null ? true : false,
    })
    function submitTpEvaluacion() {
        if (isSuperAdmin || (checkRole(authUser, [11, 5]) && evaluacion.finalizado == false && evaluacion.habilitado == true && evaluacion.modificable == true)) {
            $formTpEvaluacion.put(route('convocatorias.evaluaciones.analisis-riesgos.guardar-evaluacion', [convocatoria.id, evaluacion.id]), {
                preserveScroll: true,
            })
        }
    }

    let formServicioTecnologicoEvaluacion = useForm({
        riesgos_objetivo_general_puntaje: evaluacion.servicio_tecnologico_evaluacion?.riesgos_objetivo_general_puntaje,
        riesgos_objetivo_general_comentario: evaluacion.servicio_tecnologico_evaluacion?.riesgos_objetivo_general_comentario,
        riesgos_objetivo_general_requiere_comentario: evaluacion.servicio_tecnologico_evaluacion?.riesgos_objetivo_general_comentario == null ? true : false,

        riesgos_productos_puntaje: evaluacion.servicio_tecnologico_evaluacion?.riesgos_productos_puntaje,
        riesgos_productos_comentario: evaluacion.servicio_tecnologico_evaluacion?.riesgos_productos_comentario,
        riesgos_productos_requiere_comentario: evaluacion.servicio_tecnologico_evaluacion?.riesgos_productos_comentario == null ? true : false,

        riesgos_actividades_puntaje: evaluacion.servicio_tecnologico_evaluacion?.riesgos_actividades_puntaje,
        riesgos_actividades_comentario: evaluacion.servicio_tecnologico_evaluacion?.riesgos_actividades_comentario,
        riesgos_actividades_requiere_comentario: evaluacion.servicio_tecnologico_evaluacion?.riesgos_actividades_comentario == null ? true : false,
    })
    function submitServicioTecnologicoEvaluacion() {
        if (isSuperAdmin || (checkRole(authUser, [11, 5]) && evaluacion.finalizado == false && evaluacion.habilitado == true && evaluacion.modificable == true)) {
            $formServicioTecnologicoEvaluacion.put(route('convocatorias.evaluaciones.analisis-riesgos.guardar-evaluacion', [convocatoria.id, evaluacion.id]), {
                preserveScroll: true,
            })
        }
    }
</script>

<AuthenticatedLayout>
    <header class="pt-[8rem]" slot="header">
        <EvaluationStepper {convocatoria} {evaluacion} {proyecto} />
    </header>

    <a class="bg-orangered-900 bottom-0 fixed flex hover:bg-orangered-600 mb-5 ml-10 px-6 py-2 rounded-3xl shadow-2xl text-center text-white z-50" href="#evaluacion">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
        Ir a la evaluación
    </a>

    <DataTable class="mt-20" routeParams={[convocatoria.id, evaluacion.id]}>
        <div slot="title">Análisis de riesgos</div>

        <p class="text-center mt-10 mb-24" slot="caption">
            Los riesgos son eventos inciertos que pueden llegar a suceder en el futuro, dentro del horizonte de la ejecución del proyecto y representaran efectos de diferente magnitud en uno o más de sus objetivos.
            <br />
            Se debe establecer un riesgo por cada nivel (A nivel de objetivo general - A nivel de actividades - A nivel de productos). Estos riesgos podrán ser clasificados conforme los siguientes tipos: mercados, operacionales, legales, administrativos.
        </p>

        <thead slot="thead">
            <tr class="text-left font-bold">
                <th class="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full">Descripción</th>
                <th class="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full">Nivel</th>
                <th class="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full">Tipo de riesgo</th>
                <th class="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl text-center th-actions">Acciones</th>
            </tr>
        </thead>

        <tbody slot="tbody">
            {#each analisisRiesgos.data as analisisRiesgo (analisisRiesgo.id)}
                <tr class="hover:bg-gray-100 focus-within:bg-gray-100">
                    <td class="border-t">
                        <p class="focus:text-app-500 my-2 paragraph-ellipsis px-6">
                            {analisisRiesgo.descripcion}
                        </p>
                    </td>

                    <td class="border-t">
                        <p class="focus:text-app-500 my-2 paragraph-ellipsis px-6">
                            {analisisRiesgo.nivel}
                        </p>
                    </td>

                    <td class="border-t">
                        <p class="focus:text-app-500 my-2 paragraph-ellipsis px-6">
                            {analisisRiesgo.tipo}
                        </p>
                    </td>

                    <td class="border-t td-actions">
                        <DataTableMenu class={analisisRiesgos.data.length < 3 ? 'z-50' : ''}>
                            {#if isSuperAdmin || checkRole(authUser, [11, 5])}
                                <Item on:SMUI:action={() => Inertia.visit(route('convocatorias.evaluaciones.analisis-riesgos.edit', [convocatoria.id, evaluacion.id, analisisRiesgo.id]))}>
                                    <Text>Ver detalles</Text>
                                </Item>
                            {/if}
                        </DataTableMenu>
                    </td>
                </tr>
            {/each}

            {#if analisisRiesgos.data.length === 0}
                <tr>
                    <td class="border-t px-6 py-4" colspan="4">Sin información registrada</td>
                </tr>
            {/if}
        </tbody>
    </DataTable>
    <Pagination links={analisisRiesgos.links} />

    {#if proyecto.codigo_linea_programatica == 23 || proyecto.codigo_linea_programatica == 65 || proyecto.codigo_linea_programatica == 66 || proyecto.codigo_linea_programatica == 82}
        <hr class="mt-10 mb-10" />

        <h1 class="text-3xl mt-24 mb-8 text-center" id="evaluacion">Evaluación</h1>

        <div class="mt-16">
            <form on:submit|preventDefault={submitEstrategiaRegionalEvaluacion}>
                <InfoMessage>
                    <h1>Criterios de evaluacion</h1>
                    <ul class="list-disc p-4">
                        <li>
                            <strong>Puntaje: 0,0 a 2,0</strong> Los riesgos descritos en los tres niveles de análisis no son coherentes con las situaciones que se presentarán en el desarrollo del proyecto y las medidas de mitigación son insuficientes para darles solución.
                        </li>
                        <li>
                            <strong>Puntaje: 2,1 a 3,9</strong> Los riesgos descritos en los tres niveles de análisis son coherentes con las situaciones que se presentarán en el desarrollo del proyecto y las medidas de mitigación son susceptibles de mejora para dar un tratamiento más acertado a los riesgos.
                        </li>
                        <li>
                            <strong>Puntaje: 4,0 a 5,0</strong> Los riesgos descritos en los tres niveles de análisis son coherentes con las situaciones que se presentarán en el desarrollo del proyecto y las medidas de mitigación son suficientes para dar tratamiento a los riesgos.
                        </li>
                    </ul>

                    <Label class="mt-4 mb-4" labelFor="analisis_riesgos_puntaje" value="Puntaje (Máximo 5)" />
                    <Input
                        disabled={isSuperAdmin ? undefined : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : undefined}
                        label="Puntaje"
                        id="analisis_riesgos_puntaje"
                        type="number"
                        input$step="0.1"
                        input$min="0"
                        input$max="5"
                        class="mt-1"
                        bind:value={$formEstrategiaRegionalEvaluacion.analisis_riesgos_puntaje}
                        placeholder="Puntaje"
                        autocomplete="off"
                        error={errors.analisis_riesgos_puntaje}
                    />

                    <div class="mt-4">
                        <p>¿Los análisis de riesgos son correctos? Por favor seleccione si Cumple o No cumple.</p>
                        <Switch onMessage="Cumple" offMessage="No cumple" disabled={isSuperAdmin ? undefined : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : undefined} bind:checked={$formEstrategiaRegionalEvaluacion.analisis_riesgos_requiere_comentario} />
                        {#if $formEstrategiaRegionalEvaluacion.analisis_riesgos_requiere_comentario == false}
                            <Textarea
                                disabled={isSuperAdmin ? undefined : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : undefined}
                                label="Comentario"
                                class="mt-4"
                                maxlength="40000"
                                id="analisis_riesgos_comentario"
                                bind:value={$formEstrategiaRegionalEvaluacion.analisis_riesgos_comentario}
                                error={errors.analisis_riesgos_comentario}
                                required
                            />
                        {/if}
                    </div>
                </InfoMessage>
                <div class="shadow-inner bg-app-200 border-app-400 bottom-0 flex items-center justify-between mt-14 px-8 py-4 sticky">
                    {#if isSuperAdmin || (checkRole(authUser, [11, 5]) && evaluacion.finalizado == false && evaluacion.habilitado == true && evaluacion.modificable == true)}
                        <LoadingButton loading={$formEstrategiaRegionalEvaluacion.processing} class="ml-auto" type="submit">Guardar</LoadingButton>
                    {/if}
                </div>
            </form>
        </div>
    {:else if proyecto.codigo_linea_programatica == 68}
        <hr class="mt-10 mb-10" />

        <h1 class="text-3xl mt-24 mb-8 text-center" id="evaluacion">Evaluación</h1>

        <div class="mt-16">
            <form on:submit|preventDefault={submitServicioTecnologicoEvaluacion}>
                <InfoMessage>
                    <h1>Criterios de evaluacion</h1>
                    <ul class="list-disc p-4">
                        <li><strong>Puntaje: 0,0 a 0,2</strong> Identifica claramente el tipo de riesgo (mercados, operacionales, legales, administrativos)</li>
                        <li><strong>Puntaje: 0,0 a 0,2</strong> Describe adecuamente el riesgo identificado para el Objetivo general</li>
                        <li><strong>Puntaje: 0,0 a 0,2</strong> Identifica la probabilidad de ocurrencia del riesgo</li>
                        <li><strong>Puntaje: 0,0 a 0,2</strong> Identifica el impacto generado por el riesgo</li>
                        <li><strong>Puntaje: 0,0 a 0,2</strong> Identifica los posibles efectos que puede causar el riegos</li>
                        <li><strong>Puntaje: 0,0 a 0,2</strong> Se debe evidenciar las medidas de mitigación del riesgo</li>
                        <li><strong>Puntaje: 0,0 a 0,2</strong> Identifica claramente el tipo de riesgo (mercados, operacionales, legales, administrativos)</li>
                        <li><strong>Puntaje: 0,0 a 0,2</strong> Describe adecuamente el riesgo identificado para el Objetivo general</li>
                        <li><strong>Puntaje: 0,0 a 0,2</strong> Identifica la probabilidad de ocurrencia del riesgo</li>
                        <li><strong>Puntaje: 0,0 a 0,2</strong> Identifica el impacto generado por el riesgo</li>
                        <li><strong>Puntaje: 0,0 a 0,2</strong> Identifica los posibles efectos que puede causar el riegos</li>
                        <li><strong>Puntaje: 0,0 a 0,2</strong> Se debe evidenciar las medidas de mitigación del riesgo</li>
                        <li><strong>Puntaje máximo por nivel de análisis de riesgos</strong> 2,4</li>
                    </ul>

                    <hr class="mt-10 mb-10 border-app-300" />

                    <h1 class="font-black">Análisis de riesgos a nivel de objetivo general</h1>

                    <Label class="mt-4 mb-4" labelFor="riesgos_objetivo_general_puntaje" value="Puntaje (Máximo 2,4)" />
                    <Input
                        disabled={isSuperAdmin ? undefined : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : undefined}
                        label="Puntaje"
                        id="riesgos_objetivo_general_puntaje"
                        type="number"
                        input$step="0.1"
                        input$min="0"
                        input$max="2.4"
                        class="mt-1"
                        bind:value={$formServicioTecnologicoEvaluacion.riesgos_objetivo_general_puntaje}
                        placeholder="Puntaje"
                        autocomplete="off"
                        error={errors.riesgos_objetivo_general_puntaje}
                    />

                    <div class="mt-4">
                        <p>¿Los análisis de riesgos a nivel de objetivo general son correctos? Por favor seleccione si Cumple o No cumple.</p>
                        <Switch onMessage="Cumple" offMessage="No cumple" disabled={isSuperAdmin ? undefined : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : undefined} bind:checked={$formServicioTecnologicoEvaluacion.riesgos_objetivo_general_requiere_comentario} />
                        {#if $formServicioTecnologicoEvaluacion.riesgos_objetivo_general_requiere_comentario == false}
                            <Textarea
                                disabled={isSuperAdmin ? undefined : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : undefined}
                                label="Comentario"
                                class="mt-4"
                                maxlength="40000"
                                id="riesgos_objetivo_general_comentario"
                                bind:value={$formServicioTecnologicoEvaluacion.riesgos_objetivo_general_comentario}
                                error={errors.riesgos_objetivo_general_comentario}
                                required
                            />
                        {/if}
                    </div>

                    <hr class="mt-10 mb-10 border-app-300" />

                    <h1 class="font-black">Análisis de riesgos a nivel de productos</h1>

                    <Label class="mt-4 mb-4" labelFor="riesgos_productos_puntaje" value="Puntaje (Máximo 2,4)" />
                    <Input
                        disabled={isSuperAdmin ? undefined : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : undefined}
                        label="Puntaje"
                        id="riesgos_productos_puntaje"
                        type="number"
                        input$step="0.1"
                        input$min="0"
                        input$max="2.4"
                        class="mt-1"
                        bind:value={$formServicioTecnologicoEvaluacion.riesgos_productos_puntaje}
                        placeholder="Puntaje"
                        autocomplete="off"
                        error={errors.riesgos_productos_puntaje}
                    />

                    <div class="mt-4">
                        <p>¿Los análisis de riesgos a nivel de productos son correctos? Por favor seleccione si Cumple o No cumple.</p>
                        <Switch onMessage="Cumple" offMessage="No cumple" disabled={isSuperAdmin ? undefined : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : undefined} bind:checked={$formServicioTecnologicoEvaluacion.riesgos_productos_requiere_comentario} />
                        {#if $formServicioTecnologicoEvaluacion.riesgos_productos_requiere_comentario == false}
                            <Textarea
                                disabled={isSuperAdmin ? undefined : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : undefined}
                                label="Comentario"
                                class="mt-4"
                                maxlength="40000"
                                id="riesgos_productos_comentario"
                                bind:value={$formServicioTecnologicoEvaluacion.riesgos_productos_comentario}
                                error={errors.riesgos_productos_comentario}
                                required
                            />
                        {/if}
                    </div>

                    <hr class="mt-10 mb-10 border-app-300" />

                    <h1 class="font-black">Análisis de riesgos a nivel de actividades</h1>

                    <Label class="mt-4 mb-4" labelFor="riesgos_actividades_puntaje" value="Puntaje (Máximo 2,4)" />
                    <Input
                        disabled={isSuperAdmin ? undefined : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : undefined}
                        label="Puntaje"
                        id="riesgos_actividades_puntaje"
                        type="number"
                        input$step="0.1"
                        input$min="0"
                        input$max="2.4"
                        class="mt-1"
                        bind:value={$formServicioTecnologicoEvaluacion.riesgos_actividades_puntaje}
                        placeholder="Puntaje"
                        autocomplete="off"
                        error={errors.riesgos_actividades_puntaje}
                    />

                    <div class="mt-4">
                        <p>¿Los análisis de riesgos a nivel de actividades son correctos? Por favor seleccione si Cumple o No cumple.</p>
                        <Switch onMessage="Cumple" offMessage="No cumple" disabled={isSuperAdmin ? undefined : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : undefined} bind:checked={$formServicioTecnologicoEvaluacion.riesgos_actividades_requiere_comentario} />
                        {#if $formServicioTecnologicoEvaluacion.riesgos_actividades_requiere_comentario == false}
                            <Textarea
                                disabled={isSuperAdmin ? undefined : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : undefined}
                                label="Comentario"
                                class="mt-4"
                                maxlength="40000"
                                id="riesgos_actividades_comentario"
                                bind:value={$formServicioTecnologicoEvaluacion.riesgos_actividades_comentario}
                                error={errors.riesgos_actividades_comentario}
                                required
                            />
                        {/if}
                    </div>
                </InfoMessage>
                <div class="shadow-inner bg-app-200 border-app-400 bottom-0 flex items-center justify-between mt-14 px-8 py-4 sticky">
                    {#if isSuperAdmin || (checkRole(authUser, [11, 5]) && evaluacion.finalizado == false && evaluacion.habilitado == true && evaluacion.modificable == true)}
                        <LoadingButton loading={$formServicioTecnologicoEvaluacion.processing} class="ml-auto" type="submit">Guardar</LoadingButton>
                    {/if}
                </div>
            </form>
        </div>
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
                                    {evaluacion.analisis_riesgos_comentario ? evaluacion.analisis_riesgos_comentario : 'Estado: El evaluador(a) da cumplimiento a los análisis de riesgos'}
                                    <br />
                                </div>
                            {/each}
                        {/if}
                        <p>¿Los análisis de riesgos son correctos? Por favor seleccione si Cumple o No cumple.</p>
                        <Switch onMessage="Cumple" offMessage="No cumple" disabled={isSuperAdmin ? undefined : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : undefined} bind:checked={$formTaEvaluacion.analisis_riesgos_requiere_comentario} />
                        {#if $formTaEvaluacion.analisis_riesgos_requiere_comentario == false}
                            <Textarea disabled={isSuperAdmin ? undefined : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : undefined} label="Comentario" class="mt-4" maxlength="40000" id="analisis_riesgos_comentario" bind:value={$formTaEvaluacion.analisis_riesgos_comentario} error={errors.analisis_riesgos_comentario} required />
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
    {:else if proyecto.codigo_linea_programatica == 69}
        <hr class="mt-10 mb-10" />

        <h1 class="text-3xl mt-24 mb-8 text-center" id="evaluacion">Evaluación</h1>

        <div class="mt-16">
            <form on:submit|preventDefault={submitTpEvaluacion}>
                <InfoMessage>
                    <div class="mt-4">
                        <p>¿Los análisis de riesgos son correctos? Por favor seleccione si Cumple o No cumple.</p>
                        <Switch onMessage="Cumple" offMessage="No cumple" disabled={isSuperAdmin ? undefined : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : undefined} bind:checked={$formTpEvaluacion.analisis_riesgos_requiere_comentario} />
                        {#if $formTpEvaluacion.analisis_riesgos_requiere_comentario == false}
                            <Textarea disabled={isSuperAdmin ? undefined : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : undefined} label="Comentario" class="mt-4" maxlength="40000" id="analisis_riesgos_comentario" bind:value={$formTpEvaluacion.analisis_riesgos_comentario} error={errors.analisis_riesgos_comentario} required />
                        {/if}
                    </div>
                </InfoMessage>
                <div class="shadow-inner bg-app-200 border-app-400 bottom-0 flex items-center justify-between mt-14 px-8 py-4 sticky">
                    {#if isSuperAdmin || (checkRole(authUser, [11, 5]) && evaluacion.finalizado == false && evaluacion.habilitado == true && evaluacion.modificable == true)}
                        <LoadingButton loading={$formTpEvaluacion.processing} class="ml-auto" type="submit">Guardar</LoadingButton>
                    {/if}
                </div>
            </form>
        </div>
    {/if}
</AuthenticatedLayout>
