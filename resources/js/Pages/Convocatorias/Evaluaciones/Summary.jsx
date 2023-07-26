<script>
    import AuthenticatedLayout, { title } from '@/Layouts/Authenticated'
    import { page, useForm } from '@inertiajs/inertia-svelte'
    import { route, checkRole } from '@/Utils'
    import { _ } from 'svelte-i18n'

    import EvaluationStepper from '@/Components/EvaluationStepper'
    import Dialog from '@/Components/Dialog'
    import Button from '@/Components/Button'
    import InfoMessage from '@/Components/InfoMessage'
    import Label from '@/Components/Label'
    import Password from '@/Components/Password'
    import Textarea from '@/Components/Textarea'
    import Switch from '@/Components/Switch'
    import PrimaryButton from '@/Components/PrimaryButton'

    export let errors
    export let convocatoria
    export let evaluacion
    export let proyecto
    export let versiones

    $: $title = 'Finalizar evaluación'

    let finalizarEvaluacionDialogOpen = errors.password != undefined ? true : false

    /**
     * Validar si el usuario autenticado es SuperAdmin
     */
    let auth_user = auth.user
    let is_super_admin = checkRole(auth_user, [1])

    let form = useForm({
        password: '',
    })

    function finalizarEvaluacion() {
        if (is_super_admin || (checkRole(auth_user, [11, 5]) && evaluacion.finalizado == false && evaluacion.habilitado == true && evaluacion.modificable == true)) {
            $form.put(route('convocatorias.evaluaciones.finish', [convocatoria.id, evaluacion.id]), {
                onFinish: () => {
                    $form.password = ''

                    if (!errors.password) {
                        finalizarEvaluacionDialogOpen = false
                    }
                },
                preserveScroll: true,
            })
            $form.password = ''
        }
    }

    let formFinal = useForm({
        tieneImpactoSectorAgricola: evaluacion?.idi_evaluacion?.impacto_sector_agricola ? true : false,
        tieneImpactoPoblacionCampesina: evaluacion?.idi_evaluacion?.impacto_poblacion_campesina ? true : false,
        impacto_sector_agricola: evaluacion.idi_evaluacion ? evaluacion.idi_evaluacion?.impacto_sector_agricola : '',
        impacto_poblacion_campesina: evaluacion.idi_evaluacion ? evaluacion.idi_evaluacion?.impacto_poblacion_campesina : '',
    })

    function submitPreguntasFinales() {
        if (is_super_admin || (checkRole(auth_user, [11, 5]) && evaluacion.finalizado == false && evaluacion.habilitado == true && evaluacion.modificable == true)) {
            $formFinal.put(route('convocatorias.evaluaciones.preguntas-finales', [convocatoria.id, evaluacion.id]), {
                preserveScroll: true,
            })
        }
    }
</script>

<AuthenticatedLayout>
    <header className="pt-[8rem]" slot="header">
        <EvaluationStepper {convocatoria} {evaluacion} {proyecto} />
    </header>

    {#if evaluacion.finalizado == true}
        <InfoMessage className="mt-20 mb-2" message="La evaluación ha sido finalizada con éxito." />
    {/if}
    <div className="mt-20">
        <InfoMessage className="mb-2">
            <h1 className="text-2xl font-black text-center">Evaluación</h1>

            {#if proyecto.codigo_linea_programatica == 23 || proyecto.codigo_linea_programatica == 65 || proyecto.codigo_linea_programatica == 66 || proyecto.codigo_linea_programatica == 82}
                <div className="flex">
                    <ul className="list-disc flex-1 pl-4">
                        <li><strong>Título:</strong> {evaluacion.titulo_puntaje ? evaluacion.titulo_puntaje : 0}</li>
                        {#if proyecto.codigo_linea_programatica == 65 || proyecto.codigo_linea_programatica == 66 || proyecto.codigo_linea_programatica == 82}
                            <li><strong>Video:</strong> {evaluacion.video_puntaje ? evaluacion.video_puntaje : 0}</li>
                        {/if}
                        <li><strong>Resumen:</strong> {evaluacion.resumen_puntaje ? evaluacion.resumen_puntaje : 0}</li>
                        <li><strong>Problema central:</strong> {evaluacion.problema_central_puntaje ? evaluacion.problema_central_puntaje : 0}</li>
                        <li><strong>Objetivos:</strong> {evaluacion.objetivos_puntaje ? evaluacion.objetivos_puntaje : 0}</li>
                        <li><strong>Metodología:</strong> {evaluacion.metodologia_puntaje ? evaluacion.metodologia_puntaje : 0}</li>
                        {#if proyecto.codigo_linea_programatica == 66 || proyecto.codigo_linea_programatica == 82}
                            <li><strong>Entidad aliada:</strong> {evaluacion.entidad_aliada_puntaje ? evaluacion.entidad_aliada_puntaje : 0}</li>
                        {/if}
                        <li><strong>Resultados:</strong> {evaluacion.resultados_puntaje ? evaluacion.resultados_puntaje : 0}</li>
                        <li><strong>Productos:</strong> {evaluacion.productos_puntaje ? evaluacion.productos_puntaje : 0}</li>
                        <li><strong>Cadena de valor:</strong> {evaluacion.cadena_valor_puntaje ? evaluacion.cadena_valor_puntaje : 0}</li>
                        <li><strong>Análisis de riesgos:</strong> {evaluacion.analisis_riesgos_puntaje ? evaluacion.analisis_riesgos_puntaje : 0}</li>
                        <li><strong>Ortografía:</strong> {evaluacion.ortografia_puntaje ? evaluacion.ortografia_puntaje : 0}</li>
                        <li><strong>Redacción:</strong> {evaluacion.redaccion_puntaje ? evaluacion.redaccion_puntaje : 0}</li>
                        <li><strong>Normas APA:</strong> {evaluacion.normas_apa_puntaje ? evaluacion.normas_apa_puntaje : 0}</li>
                    </ul>
                    <div className="flex flex-1 items-center justify-center border-l-2 border-app-400 pl-10">
                        <h1 className="text-2xl">
                            <strong>Puntaje total:</strong>
                            {evaluacion.total_evaluacion}
                        </h1>
                    </div>
                </div>
            {:else if proyecto.codigo_linea_programatica == 68}
                <div className="flex">
                    <ul className="list-disc flex-1 pl-4">
                        <li><strong>Título:</strong> {evaluacion.titulo_puntaje ? evaluacion.titulo_puntaje : 0}</li>
                        <li><strong>Resumen:</strong> {evaluacion.resumen_puntaje ? evaluacion.resumen_puntaje : 0}</li>
                        <li><strong>Antecedentes:</strong> {evaluacion.antecedentes_puntaje ? evaluacion.antecedentes_puntaje : 0}</li>
                        <li><strong>Justificación del problema:</strong> {evaluacion.justificacion_problema_puntaje ? evaluacion.justificacion_problema_puntaje : 0}</li>
                        <li><strong>Pregunta de formulación del problema:</strong> {evaluacion.pregunta_formulacion_problema_puntaje ? evaluacion.pregunta_formulacion_problema_puntaje : 0}</li>
                        <li><strong>Propuesta de sostenibilidad:</strong> {evaluacion.propuesta_sostenibilidad_puntaje ? evaluacion.propuesta_sostenibilidad_puntaje : 0}</li>
                        <li><strong>Identificación del problema:</strong> {evaluacion.identificacion_problema_puntaje ? evaluacion.identificacion_problema_puntaje : 0}</li>
                        <li><strong>Árbol de problemas:</strong> {evaluacion.arbol_problemas_puntaje ? evaluacion.arbol_problemas_puntaje : 0}</li>
                        <li><strong>Impacto ambiental:</strong> {evaluacion.impacto_ambiental_puntaje ? evaluacion.impacto_ambiental_puntaje : 0}</li>
                        <li><strong>Impacto social en el centro de formación:</strong> {evaluacion.impacto_social_centro_puntaje ? evaluacion.impacto_social_centro_puntaje : 0}</li>
                        <li><strong>Impacto social en el sector productivo:</strong> {evaluacion.impacto_social_productivo_puntaje ? evaluacion.impacto_social_productivo_puntaje : 0}</li>
                        <li><strong>Impacto tecnológico:</strong> {evaluacion.impacto_tecnologico_puntaje ? evaluacion.impacto_tecnologico_puntaje : 0}</li>
                        <li><strong>Objetivo general:</strong> {evaluacion.objetivo_general_puntaje ? evaluacion.objetivo_general_puntaje : 0}</li>
                        <li><strong>Primer objetivo específico:</strong> {evaluacion.primer_objetivo_puntaje ? evaluacion.primer_objetivo_puntaje : 0}</li>
                        <li><strong>Segundo objetivo específico:</strong> {evaluacion.segundo_objetivo_puntaje ? evaluacion.segundo_objetivo_puntaje : 0}</li>
                        <li><strong>Tercer objetivo específico:</strong> {evaluacion.tercer_objetivo_puntaje ? evaluacion.tercer_objetivo_puntaje : 0}</li>
                        <li><strong>Cuarto (+ o más) objetivo específico:</strong> {evaluacion.cuarto_objetivo_puntaje ? evaluacion.cuarto_objetivo_puntaje : 0}</li>
                        <li><strong>Resultados del primer objetivo específico:</strong> {evaluacion.resultados_primer_obj_puntaje ? evaluacion.resultados_primer_obj_puntaje : 0}</li>
                        <li><strong>Resultados del segundo objetivo específico:</strong> {evaluacion.resultados_segundo_obj_puntaje ? evaluacion.resultados_segundo_obj_puntaje : 0}</li>
                        <li><strong>Resultados del tercer objetivo específico:</strong> {evaluacion.resultados_tercer_obj_puntaje ? evaluacion.resultados_tercer_obj_puntaje : 0}</li>
                        <li><strong>Resultados del cuarto (+ o más) objetivo específico:</strong> {evaluacion.resultados_cuarto_obj_puntaje ? evaluacion.resultados_cuarto_obj_puntaje : 0}</li>
                        <li><strong>Metodología:</strong> {evaluacion.metodologia_puntaje ? evaluacion.metodologia_puntaje : 0}</li>
                        <li><strong>Actividades del primer objetivo específico:</strong> {evaluacion.actividades_primer_obj_puntaje ? evaluacion.actividades_primer_obj_puntaje : 0}</li>
                        <li><strong>Actividades del segundo objetivo específico:</strong> {evaluacion.actividades_segundo_obj_puntaje ? evaluacion.actividades_segundo_obj_puntaje : 0}</li>
                        <li><strong>Actividades del tercer objetivo específico:</strong> {evaluacion.actividades_tercer_obj_puntaje ? evaluacion.actividades_tercer_obj_puntaje : 0}</li>
                        <li><strong>Actividades del cuarto (+ o más) objetivo específico:</strong> {evaluacion.actividades_cuarto_obj_puntaje ? evaluacion.actividades_cuarto_obj_puntaje : 0}</li>
                        <li><strong>Productos del primer objetivo específico:</strong> {evaluacion.productos_primer_obj_puntaje ? evaluacion.productos_primer_obj_puntaje : 0}</li>
                        <li><strong>Productos del segundo objetivo específico:</strong> {evaluacion.productos_segundo_obj_puntaje ? evaluacion.productos_segundo_obj_puntaje : 0}</li>
                        <li><strong>Productos del tercer objetivo específico:</strong> {evaluacion.productos_tercer_obj_puntaje ? evaluacion.productos_tercer_obj_puntaje : 0}</li>
                        <li><strong>Productos del cuarto (+ o más) objetivo específico:</strong> {evaluacion.productos_cuarto_obj_puntaje ? evaluacion.productos_cuarto_obj_puntaje : 0}</li>

                        <li><strong>Análisis de riesgos a nivel de objetivo general:</strong> {evaluacion.riesgos_objetivo_general_puntaje ? evaluacion.riesgos_objetivo_general_puntaje : 0}</li>
                        <li><strong>Análisis de riesgos a nivel de productos:</strong> {evaluacion.riesgos_productos_puntaje ? evaluacion.riesgos_productos_puntaje : 0}</li>
                        <li><strong>Análisis de riesgos a nivel de actividades:</strong> {evaluacion.riesgos_actividades_puntaje ? evaluacion.riesgos_actividades_puntaje : 0}</li>
                    </ul>
                    <div className="flex flex-1 items-center justify-center border-l-2 border-app-400 pl-10">
                        <h1 className="text-2xl">
                            <strong>Puntaje total:</strong>
                            {evaluacion.total_evaluacion}
                        </h1>
                    </div>
                </div>
            {/if}
        </InfoMessage>

        {#if proyecto.codigo_linea_programatica == 23 || proyecto.codigo_linea_programatica == 66 || proyecto.codigo_linea_programatica == 82}
            <form on:submit|preventDefault={submitPreguntasFinales} className="my-24">
                <h1 className="text-center text-2xl">Por favor responda las siguientes preguntas</h1>
                <div className="mt-8">
                    <p>¿Una vez revisado el proyecto, considera que este tiene un impacto directo hacia el sector Agrícola?</p>
                    <Switch bind:checked={$formFinal.tieneImpactoSectorAgricola} />
                </div>
                {#if $formFinal.tieneImpactoSectorAgricola}
                    <div className="mt-8">
                        <Textarea maxlength="400" id="impacto_sector_agricola" bind:value={$formFinal.impacto_sector_agricola} />
                    </div>
                {/if}

                <div className="mt-8">
                    <p>¿Una vez revisado el proyecto, considera que este tiene un impacto directo hacia población campesina?</p>
                    <Switch bind:checked={$formFinal.tieneImpactoPoblacionCampesina} />
                </div>
                {#if $formFinal.tieneImpactoPoblacionCampesina}
                    <div className="mt-8">
                        <Textarea maxlength="400" id="impacto_poblacion_campesina" bind:value={$formFinal.impacto_poblacion_campesina} />
                    </div>
                {/if}

                <div className="mt-8">
                    <PrimaryButton loading={$formFinal.processing} className="ml-auto" type="submit">Guardar</PrimaryButton>
                </div>
            </form>
        {/if}

        {#if evaluacion.validar_evaluacion.length > 0}
            <InfoMessage className="mb-2" alertMsg={true}>
                <p><strong>Aún faltan ítems por evaluar. Para poder finalizar la evaluación debe completar los siguientes ítems:</strong></p>
                <ul className="list-disc p-4">
                    {#each evaluacion.validar_evaluacion as item}
                        <li>{item}</li>
                    {/each}
                </ul>
            </InfoMessage>
        {:else if evaluacion.finalizado == false && evaluacion.validar_evaluacion.length == 0}
            <InfoMessage className="mb-2" message="Si desea finalizar la evaluación de clic en <strong>Finalizar evaluación</strong> y a continuación, escriba la contraseña de su usuario." />
            <Button on:click={() => (finalizarEvaluacionDialogOpen = true)} variant="raised">Finalizar evaluación</Button>
        {/if}
    </div>
    <hr className="mt-10 mb-10" />
    <div>
        <InfoMessage>
            <h1><strong>Historial de acciones</strong></h1>
            {#if proyecto.logs}
                <ul>
                    {#each proyecto.logs as log}
                        <li>{log.created_at} - {JSON.parse(log.data).subject}</li>
                    {/each}
                </ul>
            {:else}
                <p>No se ha generado un historial aún</p>
            {/if}
        </InfoMessage>
    </div>
    <hr className="mt-10 mb-10" />
    <div>
        <InfoMessage>
            <h1><strong>Versiones del proyecto</strong></h1>
            {#if versiones}
                <ul>
                    {#each versiones as version}
                        <li>
                            {version.version}.pdf -
                            {#if version.estado == 1}
                                <a href={route('convocatorias.proyectos.version', [convocatoria.id, proyecto.id, version.version])}>Descargar</a>
                            {:else}
                                Generando, regrese pronto.
                            {/if}
                        </li>
                    {/each}
                </ul>
            {:else}
                <p>No se ha generado un historial aún</p>
            {/if}
        </InfoMessage>
    </div>

    <Dialog bind:open={finalizarEvaluacionDialogOpen}>
        <div slot="title" className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            Finalizar evaluación
        </div>
        <div slot="content">
            <InfoMessage className="mb-2" message="¿Está seguro (a) que desea finalizar la evaluación?<br />Una vez finalizada no se podrá modificar." />

            <form on:submit|preventDefault={finalizarEvaluacion} id="finalizar-evaluacion" className="mt-10 mb-28" on:load={($form.password = '')}>
                <Label labelFor="password" value="Ingrese su contraseña para confirmar que desea finalizar esta evaluación" className="mb-4" />
                <Password id="password" className="w-full" bind:value={$form.password} error={errors.password} required autocomplete="current-password" />
            </form>
        </div>
        <div slot="actions">
            <div className="p-4">
                <Button on:click={() => (finalizarEvaluacionDialogOpen = false)} variant={null}>Cancelar</Button>
                <Button variant="raised" form="finalizar-evaluacion">Finalizar evaluación</Button>
            </div>
        </div>
    </Dialog>
</AuthenticatedLayout>
