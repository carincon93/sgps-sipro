<script>
    import AuthenticatedLayout, { title } from '@/Layouts/Authenticated'
    import { page, useForm } from '@inertiajs/inertia-svelte'
    import { route, checkRole } from '@/Utils'
    import { _ } from 'svelte-i18n'
    import { Inertia } from '@inertiajs/inertia'

    import Button from '@/Components/Button'
    import EvaluationStepper from '@/Components/EvaluationStepper'
    import Gantt from '@/Components/Gantt'
    import InfoMessage from '@/Components/InfoMessage'
    import Label from '@/Components/Label'
    import Input from '@/Components/Input'
    import Switch from '@/Components/Switch'
    import Textarea from '@/Components/Textarea'
    import PrimaryButton from '@/Components/PrimaryButton'
    import Pagination from '@/Components/Pagination'
    import DataTable from '@/Components/DataTable'
    import DataTableMenu from '@/Components/DataTableMenu'
    import { Item, Text } from '@smui/list'

    export let errors
    export let convocatoria
    export let evaluacion
    export let proyecto
    export let productos
    export let productosGantt
    export let otrasEvaluaciones

    $title = 'Productos'

    /**
     * Validar si el usuario autenticado es SuperAdmin
     */
    let authUser = auth.user
    let isSuperAdmin = checkRole(authUser, [1])

    let showGantt = false
    let formEstrategiaRegionalEvaluacion = useForm({
        productos_puntaje: evaluacion.idi_evaluacion ? evaluacion.idi_evaluacion?.productos_puntaje : evaluacion.cultura_innovacion_evaluacion ? evaluacion.cultura_innovacion_evaluacion.productos_puntaje : null,
        productos_comentario: evaluacion.idi_evaluacion ? evaluacion.idi_evaluacion?.productos_comentario : evaluacion.cultura_innovacion_evaluacion ? evaluacion.cultura_innovacion_evaluacion.productos_comentario : null,
        productos_requiere_comentario: evaluacion.idi_evaluacion ? (evaluacion.idi_evaluacion?.productos_comentario == null ? true : false) : evaluacion.cultura_innovacion_evaluacion ? (evaluacion.cultura_innovacion_evaluacion.productos_comentario == null ? true : false) : null,
    })
    function submitEstrategiaRegionalEvaluacion() {
        if (isSuperAdmin || (checkRole(authUser, [11, 5]) && evaluacion.finalizado == false && evaluacion.habilitado == true && evaluacion.modificable == true)) {
            $formEstrategiaRegionalEvaluacion.put(route('convocatorias.evaluaciones.productos.guardar-evaluacion', [convocatoria.id, evaluacion.id]), {
                preserveScroll: true,
            })
        }
    }

    let formTaEvaluacion = useForm({
        productos_comentario: evaluacion.ta_evaluacion?.productos_comentario,
        productos_requiere_comentario: evaluacion.ta_evaluacion?.productos_comentario == null ? true : false,
    })
    function submitTaEvaluacion() {
        if (isSuperAdmin || (checkRole(authUser, [11, 5]) && evaluacion.finalizado == false && evaluacion.habilitado == true && evaluacion.modificable == true)) {
            $formTaEvaluacion.put(route('convocatorias.evaluaciones.productos.guardar-evaluacion', [convocatoria.id, evaluacion.id]), {
                preserveScroll: true,
            })
        }
    }

    let formTpEvaluacion = useForm({
        productos_comentario: evaluacion.tp_evaluacion?.productos_comentario,
        productos_requiere_comentario: evaluacion.tp_evaluacion?.productos_comentario == null ? true : false,
    })
    function submitTpEvaluacion() {
        if (isSuperAdmin || (checkRole(authUser, [11, 5]) && evaluacion.finalizado == false && evaluacion.habilitado == true && evaluacion.modificable == true)) {
            $formTpEvaluacion.put(route('convocatorias.evaluaciones.productos.guardar-evaluacion', [convocatoria.id, evaluacion.id]), {
                preserveScroll: true,
            })
        }
    }

    let formServicioTecnologicoEvaluacion = useForm({
        productos_primer_obj_puntaje: evaluacion.servicio_tecnologico_evaluacion?.productos_primer_obj_puntaje,
        productos_primer_obj_comentario: evaluacion.servicio_tecnologico_evaluacion?.productos_primer_obj_comentario,
        productos_primer_obj_requiere_comentario: evaluacion.servicio_tecnologico_evaluacion?.productos_primer_obj_comentario == null ? true : false,

        productos_segundo_obj_puntaje: evaluacion.servicio_tecnologico_evaluacion?.productos_segundo_obj_puntaje,
        productos_segundo_obj_comentario: evaluacion.servicio_tecnologico_evaluacion?.productos_segundo_obj_comentario,
        productos_segundo_obj_requiere_comentario: evaluacion.servicio_tecnologico_evaluacion?.productos_segundo_obj_comentario == null ? true : false,

        productos_tercer_obj_puntaje: evaluacion.servicio_tecnologico_evaluacion?.productos_tercer_obj_puntaje,
        productos_tercer_obj_comentario: evaluacion.servicio_tecnologico_evaluacion?.productos_tercer_obj_comentario,
        productos_tercer_obj_requiere_comentario: evaluacion.servicio_tecnologico_evaluacion?.productos_tercer_obj_comentario == null ? true : false,

        productos_cuarto_obj_puntaje: evaluacion.servicio_tecnologico_evaluacion?.productos_cuarto_obj_puntaje,
        productos_cuarto_obj_comentario: evaluacion.servicio_tecnologico_evaluacion?.productos_cuarto_obj_comentario,
        productos_cuarto_obj_requiere_comentario: evaluacion.servicio_tecnologico_evaluacion?.productos_cuarto_obj_comentario == null ? true : false,
    })
    function submitServicioTecnologicoEvaluacion() {
        if (isSuperAdmin || (checkRole(authUser, [11, 5]) && evaluacion.finalizado == false && evaluacion.habilitado == true && evaluacion.modificable == true)) {
            $formServicioTecnologicoEvaluacion.put(route('convocatorias.evaluaciones.productos.guardar-evaluacion', [convocatoria.id, evaluacion.id]), {
                preserveScroll: true,
            })
        }
    }
</script>

<AuthenticatedLayout>
    <header className="pt-[8rem]" slot="header">
        <EvaluationStepper {convocatoria} {evaluacion} {proyecto} />
    </header>

    {#if proyecto.codigo_linea_programatica == 23 || proyecto.codigo_linea_programatica == 65 || proyecto.codigo_linea_programatica == 66 || proyecto.codigo_linea_programatica == 68 || proyecto.codigo_linea_programatica == 69 || proyecto.codigo_linea_programatica == 70 || proyecto.codigo_linea_programatica == 82}
        <a className="bg-orangered-900 bottom-0 fixed flex hover:bg-orangered-600 mb-5 ml-10 px-6 py-2 rounded-3xl shadow-2xl text-center text-white z-50" href="#evaluacion">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
            Ir a la evaluación
        </a>
    {/if}

    <h1 className="text-3xl m-24 text-center">Productos</h1>

    <p className="text-center mb-10">Los productos se entienden como los bienes o servicios que se generan y entregan en un proceso productivo. Los productos materializan los objetivos específicos de los proyectos. De esta forma, los productos de un proyecto deben agotar los objetivos específicos del mismo y deben cumplir a cabalidad con el objetivo general del proyecto.</p>

    {#if proyecto.codigo_linea_programatica == 70}
        <InfoMessage message="Debe asociar las fechas a cada uno de los productos haciendo clic en los tres puntos, a continuación, clic en 'Ver detalles'. (<strong>Se deben registrar todas las fechas para visualizar el diagrama de Gantt</strong>)." />
    {/if}
    {#if showGantt}
        <Button on:click={() => (showGantt = false)}>Ocultar diagrama de Gantt</Button>
    {:else}
        <Button on:click={() => (showGantt = true)}>Visualizar diagrama de Gantt</Button>
    {/if}

    {#if showGantt}
        <Gantt
            items={productosGantt}
            request={isSuperAdmin || checkRole(authUser, [11, 5])
                ? {
                      uri: 'convocatorias.evaluaciones.productos.edit',
                      params: [convocatoria.id, proyecto.id],
                  }
                : null}
        />
    {:else}
        <DataTable className="mt-20" routeParams={[convocatoria.id, evaluacion.id]}>
            <thead slot="thead">
                <tr className="text-left font-bold">
                    <th className="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full">Descripción</th>
                    <th className="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full">Objetivo específico</th>
                    <th className="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full">Resultado</th>
                    {#if proyecto.codigo_linea_programatica == 70}
                        <th className="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full">Meta</th>
                    {/if}
                    <th className="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl text-center th-actions">Acciones</th>
                </tr>
            </thead>

            <tbody slot="tbody">
                {#each productos.data as producto (producto.id)}
                    <tr className="hover:bg-gray-100 focus-within:bg-gray-100">
                        <td className="border-t">
                            <p className="focus:text-app-500 my-2 paragraph-ellipsis px-6">
                                {producto.nombre}
                            </p>
                        </td>

                        <td className="border-t">
                            <p className="focus:text-app-500 my-2 paragraph-ellipsis px-6">
                                {producto.resultado.objetivo_especifico.descripcion}
                            </p>
                        </td>
                        <td className="border-t">
                            <p className="focus:text-app-500 my-2 paragraph-ellipsis px-6">
                                {producto.resultado.descripcion}
                            </p>
                        </td>

                        {#if proyecto.codigo_linea_programatica == 70}
                            <td className="border-t">
                                <p className="focus:text-app-500 my-2 paragraph-ellipsis px-6">
                                    {producto.producto_ta_tp?.valor_proyectado}
                                </p>
                            </td>
                        {/if}

                        <td className="border-t td-actions">
                            <DataTableMenu className={productos.data.length < 3 ? 'z-50' : ''}>
                                {#if isSuperAdmin || checkRole(authUser, [11, 5])}
                                    <Item on:SMUI:action={() => Inertia.visit(route('convocatorias.evaluaciones.productos.edit', [convocatoria.id, evaluacion.id, producto.id]))}>
                                        <Text>Ver detalles</Text>
                                    </Item>
                                {:else}
                                    <Item>
                                        <Text>No tiene permisos</Text>
                                    </Item>
                                {/if}
                            </DataTableMenu>
                        </td>
                    </tr>
                {/each}

                {#if productos.data.length === 0}
                    <tr>
                        <td className="border-t px-6 py-4" colspan="4">Sin información registrada</td>
                    </tr>
                {/if}
            </tbody>
        </DataTable>
        <Pagination links={productos.links} />
    {/if}
    {#if proyecto.codigo_linea_programatica == 23 || proyecto.codigo_linea_programatica == 65 || proyecto.codigo_linea_programatica == 66 || proyecto.codigo_linea_programatica == 82}
        <hr className="mt-10 mb-10" />

        <h1 className="text-3xl mt-24 mb-8 text-center" id="evaluacion">Evaluación</h1>

        <div className="mt-16">
            <form on:submit|preventDefault={submitEstrategiaRegionalEvaluacion}>
                <InfoMessage>
                    <h1>Criterios de evaluacion</h1>
                    <ul className="list-disc p-4">
                        <li>
                            <strong>Puntaje: 0 a 4</strong> Los productos esperados no son pertinentes para atender la problemática identificada en un corto o mediano plazo (correlación con el cronograma de actividades) y la formulación de los indicadores dificulta su medición.
                        </li>
                        <li>
                            <strong>Puntaje: 5 a 7</strong> La mayoría de productos esperados son pertinentes para atender la problemática identificada en un corto o mediano plazo (correlación con el cronograma de actividades) y son susceptibles de mejora en cuanto a su alcance, así como lo es la formulación de los indicadores para realizar mediciones precisas en el tiempo.
                        </li>
                        <li>
                            <strong>Puntaje: 8 a 9</strong> Todos los productos esperados son pertinentes para atender la problemática identificada en un corto o mediano plazo (correlación con el cronograma de actividades) y la formulación de los indicadores permitirá realizar mediciones precisas en el tiempo.
                        </li>
                    </ul>

                    <Label className="mt-4 mb-4" labelFor="productos_puntaje" value="Puntaje (Máximo 9)" />
                    <Input
                        disabled={isSuperAdmin ? undefined : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : undefined}
                        label="Puntaje"
                        id="productos_puntaje"
                        type="number"
                        input$step="1"
                        input$min="0"
                        input$max="9"
                        className="mt-1"
                        bind:value={$formEstrategiaRegionalEvaluacion.productos_puntaje}
                        placeholder="Puntaje"
                        autocomplete="off"
                        error={errors.productos_puntaje}
                    />

                    <div className="mt-4">
                        <p>¿Los productos son correctos? Por favor seleccione si Cumple o No cumple.</p>
                        <Switch onMessage="Cumple" offMessage="No cumple" disabled={isSuperAdmin ? undefined : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : undefined} bind:checked={$formEstrategiaRegionalEvaluacion.productos_requiere_comentario} />
                        {#if $formEstrategiaRegionalEvaluacion.productos_requiere_comentario == false}
                            <Textarea disabled={isSuperAdmin ? undefined : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : undefined} label="Comentario" className="mt-4" maxlength="40000" id="productos_comentario" bind:value={$formEstrategiaRegionalEvaluacion.productos_comentario} error={errors.productos_comentario} required />
                        {/if}
                    </div>
                </InfoMessage>
                <div className="flex items-center justify-between mt-14 px-8 py-4">
                    {#if isSuperAdmin || (checkRole(authUser, [11, 5]) && evaluacion.finalizado == false && evaluacion.habilitado == true && evaluacion.modificable == true)}
                        <PrimaryButton loading={$formEstrategiaRegionalEvaluacion.processing} className="ml-auto" type="submit">Guardar</PrimaryButton>
                    {/if}
                </div>
            </form>
        </div>
    {:else if proyecto.codigo_linea_programatica == 68}
        <hr className="mt-10 mb-10" />

        <h1 className="text-3xl mt-24 mb-8 text-center" id="evaluacion">Evaluación</h1>

        <div className="mt-16">
            <form on:submit|preventDefault={submitServicioTecnologicoEvaluacion}>
                <InfoMessage>
                    {#each { length: proyecto.cantidad_objetivos } as _empty, j}
                        {#if j == 0}
                            <h1 className="text-black">Productos del primer objetivo específico</h1>

                            <Label className="mt-4 mb-4" labelFor="productos_primer_obj_puntaje" value="Puntaje (Máximo {(20.8 / proyecto.cantidad_objetivos).toFixed(2)})" />
                            <Input
                                disabled={isSuperAdmin ? undefined : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : undefined}
                                label="Puntaje"
                                id="productos_primer_obj_puntaje"
                                type="number"
                                input$step="0.1"
                                input$min="0"
                                input$max={(20.8 / proyecto.cantidad_objetivos).toFixed(2)}
                                className="mt-1"
                                bind:value={$formServicioTecnologicoEvaluacion.productos_primer_obj_puntaje}
                                placeholder="Puntaje"
                                autocomplete="off"
                                error={errors.productos_primer_obj_puntaje}
                            />

                            <div className="mt-4">
                                <p>¿Los productos del primer objetivo específico son correctos? Por favor seleccione si Cumple o No cumple.</p>
                                <Switch onMessage="Cumple" offMessage="No cumple" disabled={isSuperAdmin ? undefined : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : undefined} bind:checked={$formServicioTecnologicoEvaluacion.productos_primer_obj_requiere_comentario} />
                                {#if $formServicioTecnologicoEvaluacion.productos_primer_obj_requiere_comentario == false}
                                    <Textarea
                                        disabled={isSuperAdmin ? undefined : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : undefined}
                                        label="Comentario"
                                        className="mt-4"
                                        maxlength="40000"
                                        id="productos_primer_obj_comentario"
                                        bind:value={$formServicioTecnologicoEvaluacion.productos_primer_obj_comentario}
                                        error={errors.productos_primer_obj_comentario}
                                        required
                                    />
                                {/if}
                            </div>
                        {:else if j == 1}
                            <hr className="mt-10 mb-10 border-app-300" />

                            <h1 className="text-black">Productos del segundo objetivo específico</h1>

                            <Label className="mt-4 mb-4" labelFor="productos_segundo_obj_puntaje" value="Puntaje (Máximo {(20.8 / proyecto.cantidad_objetivos).toFixed(2)})" />
                            <Input
                                disabled={isSuperAdmin ? undefined : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : undefined}
                                label="Puntaje"
                                id="productos_segundo_obj_puntaje"
                                type="number"
                                input$step="0.1"
                                input$min="0"
                                input$max={(20.8 / proyecto.cantidad_objetivos).toFixed(2)}
                                className="mt-1"
                                bind:value={$formServicioTecnologicoEvaluacion.productos_segundo_obj_puntaje}
                                placeholder="Puntaje"
                                autocomplete="off"
                                error={errors.productos_segundo_obj_puntaje}
                            />

                            <div className="mt-4">
                                <p>¿Los productos del segundo objetivo específico son correctos? Por favor seleccione si Cumple o No cumple.</p>
                                <Switch onMessage="Cumple" offMessage="No cumple" disabled={isSuperAdmin ? undefined : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : undefined} bind:checked={$formServicioTecnologicoEvaluacion.productos_segundo_obj_requiere_comentario} />
                                {#if $formServicioTecnologicoEvaluacion.productos_segundo_obj_requiere_comentario == false}
                                    <Textarea
                                        disabled={isSuperAdmin ? undefined : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : undefined}
                                        label="Comentario"
                                        className="mt-4"
                                        maxlength="40000"
                                        id="productos_segundo_obj_comentario"
                                        bind:value={$formServicioTecnologicoEvaluacion.productos_segundo_obj_comentario}
                                        error={errors.productos_segundo_obj_comentario}
                                        required
                                    />
                                {/if}
                            </div>
                        {:else if j == 2}
                            <hr className="mt-10 mb-10 border-app-300" />

                            <h1 className="text-black">Productos del tercer objetivo específico</h1>

                            <Label className="mt-4 mb-4" labelFor="productos_tercer_obj_puntaje" value="Puntaje (Máximo {(20.8 / proyecto.cantidad_objetivos).toFixed(2)})" />
                            <Input
                                disabled={isSuperAdmin ? undefined : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : undefined}
                                label="Puntaje"
                                id="productos_tercer_obj_puntaje"
                                type="number"
                                input$step="0.1"
                                input$min="0"
                                input$max={(20.8 / proyecto.cantidad_objetivos).toFixed(2)}
                                className="mt-1"
                                bind:value={$formServicioTecnologicoEvaluacion.productos_tercer_obj_puntaje}
                                placeholder="Puntaje"
                                autocomplete="off"
                                error={errors.productos_tercer_obj_puntaje}
                            />

                            <div className="mt-4">
                                <p>¿Los productos del tercer objetivo específico son correctos? Por favor seleccione si Cumple o No cumple.</p>
                                <Switch onMessage="Cumple" offMessage="No cumple" disabled={isSuperAdmin ? undefined : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : undefined} bind:checked={$formServicioTecnologicoEvaluacion.productos_tercer_obj_requiere_comentario} />
                                {#if $formServicioTecnologicoEvaluacion.productos_tercer_obj_requiere_comentario == false}
                                    <Textarea
                                        disabled={isSuperAdmin ? undefined : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : undefined}
                                        label="Comentario"
                                        className="mt-4"
                                        maxlength="40000"
                                        id="productos_tercer_obj_comentario"
                                        bind:value={$formServicioTecnologicoEvaluacion.productos_tercer_obj_comentario}
                                        error={errors.productos_tercer_obj_comentario}
                                        required
                                    />
                                {/if}
                            </div>
                        {:else if j == 3}
                            <hr className="mt-10 mb-10 border-app-300" />

                            <h1 className="text-black">Productos del cuarto objetivo específico</h1>

                            <Label className="mt-4 mb-4" labelFor="productos_cuarto_obj_puntaje" value="Puntaje (Máximo {(20.8 / proyecto.cantidad_objetivos).toFixed(2)})" />
                            <Input
                                disabled={isSuperAdmin ? undefined : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : undefined}
                                label="Puntaje"
                                id="productos_cuarto_obj_puntaje"
                                type="number"
                                input$step="0.1"
                                input$min="0"
                                input$max={(20.8 / proyecto.cantidad_objetivos).toFixed(2)}
                                className="mt-1"
                                bind:value={$formServicioTecnologicoEvaluacion.productos_cuarto_obj_puntaje}
                                placeholder="Puntaje"
                                autocomplete="off"
                                error={errors.productos_cuarto_obj_puntaje}
                            />

                            <div className="mt-4">
                                <p>¿Los productos del cuarto objetivo específico son correctos? Por favor seleccione si Cumple o No cumple.</p>
                                <Switch onMessage="Cumple" offMessage="No cumple" disabled={isSuperAdmin ? undefined : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : undefined} bind:checked={$formServicioTecnologicoEvaluacion.productos_cuarto_obj_requiere_comentario} />
                                {#if $formServicioTecnologicoEvaluacion.productos_cuarto_obj_requiere_comentario == false}
                                    <Textarea
                                        disabled={isSuperAdmin ? undefined : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : undefined}
                                        label="Comentario"
                                        className="mt-4"
                                        maxlength="40000"
                                        id="productos_cuarto_obj_comentario"
                                        bind:value={$formServicioTecnologicoEvaluacion.productos_cuarto_obj_comentario}
                                        error={errors.productos_cuarto_obj_comentario}
                                        required
                                    />
                                {/if}
                            </div>
                        {/if}
                    {/each}
                </InfoMessage>
                <div className="flex items-center justify-between mt-14 px-8 py-4">
                    {#if isSuperAdmin || (checkRole(authUser, [11, 5]) && evaluacion.finalizado == false && evaluacion.habilitado == true && evaluacion.modificable == true)}
                        <PrimaryButton loading={$formServicioTecnologicoEvaluacion.processing} className="ml-auto" type="submit">Guardar</PrimaryButton>
                    {/if}
                </div>
            </form>
        </div>
    {:else if proyecto.codigo_linea_programatica == 70}
        <hr className="mt-10 mb-10" />

        <h1 className="text-3xl mt-24 mb-8 text-center" id="evaluacion">Evaluación</h1>

        <div className="mt-16">
            <form on:submit|preventDefault={submitTaEvaluacion}>
                <InfoMessage>
                    <div className="mt-4">
                        {#if checkRole(authUser, [5]) && evaluacion.evaluacion_final}
                            {#each otrasEvaluaciones as evaluacion}
                                <div className="mb-8">
                                    <h4>Evaluador(a): <span className="font-black capitalize">{evaluacion.evaluacion.evaluador.nombre}</span></h4>
                                    {evaluacion.productos_comentario ? evaluacion.productos_comentario : 'Estado: El evaluador(a) da cumplimiento a los productos'}
                                    <br />
                                </div>
                            {/each}
                        {/if}
                        <p>¿Los productos y las metas están definidas correctamente? Por favor seleccione si Cumple o No cumple.</p>
                        <Switch onMessage="Cumple" offMessage="No cumple" disabled={isSuperAdmin ? undefined : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : undefined} bind:checked={$formTaEvaluacion.productos_requiere_comentario} />
                        {#if $formTaEvaluacion.productos_requiere_comentario == false}
                            <Textarea disabled={isSuperAdmin ? undefined : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : undefined} label="Comentario" className="mt-4" maxlength="40000" id="productos_comentario" bind:value={$formTaEvaluacion.productos_comentario} error={errors.productos_comentario} required />
                        {/if}
                    </div>
                </InfoMessage>
                <div className="flex items-center justify-between mt-14 px-8 py-4">
                    {#if isSuperAdmin || (checkRole(authUser, [11, 5]) && evaluacion.finalizado == false && evaluacion.habilitado == true && evaluacion.modificable == true)}
                        <PrimaryButton loading={$formTaEvaluacion.processing} className="ml-auto" type="submit">Guardar</PrimaryButton>
                    {/if}
                </div>
            </form>
        </div>
    {:else if proyecto.codigo_linea_programatica == 69}
        <hr className="mt-10 mb-10" />

        <h1 className="text-3xl mt-24 mb-8 text-center" id="evaluacion">Evaluación</h1>

        <div className="mt-16">
            <form on:submit|preventDefault={submitTpEvaluacion}>
                <InfoMessage>
                    <div className="mt-4">
                        <p>¿Los productos y las metas están definidas correctamente? Por favor seleccione si Cumple o No cumple.</p>
                        <Switch onMessage="Cumple" offMessage="No cumple" disabled={isSuperAdmin ? undefined : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : undefined} bind:checked={$formTpEvaluacion.productos_requiere_comentario} />
                        {#if $formTpEvaluacion.productos_requiere_comentario == false}
                            <Textarea disabled={isSuperAdmin ? undefined : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : undefined} label="Comentario" className="mt-4" maxlength="40000" id="productos_comentario" bind:value={$formTpEvaluacion.productos_comentario} error={errors.productos_comentario} required />
                        {/if}
                    </div>
                </InfoMessage>
                <div className="flex items-center justify-between mt-14 px-8 py-4">
                    {#if isSuperAdmin || (checkRole(authUser, [11, 5]) && evaluacion.finalizado == false && evaluacion.habilitado == true && evaluacion.modificable == true)}
                        <PrimaryButton loading={$formTpEvaluacion.processing} className="ml-auto" type="submit">Guardar</PrimaryButton>
                    {/if}
                </div>
            </form>
        </div>
    {/if}
</AuthenticatedLayout>
