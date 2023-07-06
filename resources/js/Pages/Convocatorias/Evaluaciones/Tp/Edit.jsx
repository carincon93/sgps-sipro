<script>
    import AuthenticatedLayout, { title } from '@/Layouts/Authenticated'
    import { useForm, page } from '@inertiajs/inertia-svelte'
    import { route, checkRole, checkPermission, monthDiff } from '@/Utils'
    import { _ } from 'svelte-i18n'
    import axios from 'axios'

    import Button from '@/Components/Button'
    import PrimaryButton from '@/Components/PrimaryButton'
    import EvaluationStepper from '@/Components/EvaluationStepper'
    import Textarea from '@/Components/Textarea'
    import InfoMessage from '@/Components/InfoMessage'
    import Dialog from '@/Components/Dialog'
    import Switch from '@/Components/Switch'

    import TpForm from '../../Proyectos/Tp/TpForm.svelte'

    export let errors
    export let convocatoria
    export let tp
    export let tpEvaluacion
    export let lineasProgramaticas

    $: $title = tp ? tp.titulo : null

    let dialogSegundaEvaluacion = convocatoria.fase == 4 ? true : false
    let proyectoDialogOpen = tpEvaluacion.evaluacion.clausula_confidencialidad == false ? true : false

    let codigoLineaProgramatica

    $: if (codigoLineaProgramatica) {
        tpInfo.codigo_linea_programatica = codigoLineaProgramatica.codigo
    } else {
        tpInfo.codigo_linea_programatica = tp.codigo_linea_programatica
    }

    /**
     * Validar si el usuario autenticado es SuperAdmin
     */
    let authUser = auth.user
    let isSuperAdmin = checkRole(authUser, [1])

    let tpInfo = useForm({
        centro_formacion_id: tp.proyecto.centro_formacion_id,
        linea_programatica_id: tp.proyecto.linea_programatica_id,
        fecha_inicio: tp.fecha_inicio,
        fecha_finalizacion: tp.fecha_finalizacion,
        max_meses_ejecucion: tp.max_meses_ejecucion,
        codigo_linea_programatica: null,
        nodo_tecnoparque_id: tp.nodo_tecnoparque_id,
        articulacion_agenda_competitividad: tp.articulacion_agenda_competitividad,
        aportes_linea_ocho_conpes: tp.aportes_linea_ocho_conpes,
        estado_ecosistema_ctel: tp.estado_ecosistema_ctel,
        logros_vigencia_anterior: tp.logros_vigencia_anterior,

        resumen: tp.resumen,
        resumen_regional: tp.resumen_regional,
        antecedentes: tp.antecedentes,
        antecedentes_regional: tp.antecedentes_regional,
        marco_conceptual: tp.marco_conceptual,
        bibliografia: tp.bibliografia,
        retos_oportunidades: tp.retos_oportunidades,
        pertinencia_territorio: tp.pertinencia_territorio,
    })

    let regional
    $: whitelistInstitucionesEducativas = []
    $: if (regional) {
        axios
            .get('https://www.datos.gov.co/resource/cfw5-qzt5.json?cod_dane_departamento=' + regional?.codigo)
            .then(function (response) {
                // handle success
                response.datp.map((item) => {
                    whitelistInstitucionesEducativas.push(item.nombre_establecimiento)
                })
            })
            .catch(function (error) {
                // handle error
                console.log(error)
            })
            .then(function () {
                // always executed
            })
    }

    let form = useForm({
        clausula_confidencialidad: tpEvaluacion.evaluacion.clausula_confidencialidad,
        fecha_ejecucion_comentario: tpEvaluacion.fecha_ejecucion_comentario ? tpEvaluacion.fecha_ejecucion_comentario : '',
        fecha_ejecucion_requiere_comentario: tpEvaluacion.fecha_ejecucion_comentario == null ? true : false,
        resumen_regional_comentario: tpEvaluacion.resumen_regional_comentario ? tpEvaluacion.resumen_regional_comentario : '',
        resumen_regional_requiere_comentario: tpEvaluacion.resumen_regional_comentario == null ? true : false,
        antecedentes_regional_comentario: tpEvaluacion.antecedentes_regional_comentario ? tpEvaluacion.antecedentes_regional_comentario : '',
        antecedentes_regional_requiere_comentario: tpEvaluacion.antecedentes_regional_comentario == null ? true : false,
        instituciones_comentario: tpEvaluacion.instituciones_comentario ? tpEvaluacion.instituciones_comentario : '',
        instituciones_requiere_comentario: tpEvaluacion.instituciones_comentario == null ? true : false,

        retos_oportunidades_comentario: tpEvaluacion.retos_oportunidades_comentario ? tpEvaluacion.retos_oportunidades_comentario : '',
        retos_oportunidades_requiere_comentario: tpEvaluacion.retos_oportunidades_comentario == null ? true : false,
        pertinencia_territorio_comentario: tpEvaluacion.pertinencia_territorio_comentario ? tpEvaluacion.pertinencia_territorio_comentario : '',
        pertinencia_territorio_requiere_comentario: tpEvaluacion.pertinencia_territorio_comentario == null ? true : false,

        bibliografia_comentario: tpEvaluacion.bibliografia_comentario ? tpEvaluacion.bibliografia_comentario : '',
        bibliografia_requiere_comentario: tpEvaluacion.bibliografia_comentario == null ? true : false,

        ortografia_comentario: tpEvaluacion.ortografia_comentario ? tpEvaluacion.ortografia_comentario : '',
        ortografia_requiere_comentario: tpEvaluacion.ortografia_comentario == null ? true : false,
        redaccion_comentario: tpEvaluacion.redaccion_comentario ? tpEvaluacion.redaccion_comentario : '',
        redaccion_requiere_comentario: tpEvaluacion.redaccion_comentario == null ? true : false,
        normas_apa_comentario: tpEvaluacion.normas_apa_comentario ? tpEvaluacion.normas_apa_comentario : '',
        normas_apa_requiere_comentario: tpEvaluacion.normas_apa_comentario == null ? true : false,
    })
    function submit() {
        if (isSuperAdmin || (checkRole(authUser, [11, 5]) && tpEvaluacion.evaluacion.finalizado == false && tpEvaluacion.evaluacion.habilitado == true && tpEvaluacion.evaluacion.modificable == true)) {
            $form.put(route('convocatorias.tp-evaluaciones.update', [convocatoria.id, tpEvaluacion.id]), {
                preserveScroll: true,
            })
        }
    }

    $: if (tpInfo.fecha_inicio && tpInfo.fecha_finalizacion) {
        tpInfo.max_meses_ejecucion = monthDiff(tpInfo.fecha_inicio, tpInfo.fecha_finalizacion)
    }
</script>

<AuthenticatedLayout>
    <header className="pt-[8rem]" slot="header">
        <EvaluationStepper {convocatoria} evaluacion={tpEvaluacion.evaluacion} proyecto={tp.proyecto} />
    </header>

    <form on:submit|preventDefault={submit}>
        <TpForm {errors} evaluacion={tpEvaluacion.evaluacion} form={tpInfo} {isSuperAdmin} {convocatoria} {tp} {lineasProgramaticas}>
            <div slot="fechas">
                <InfoMessage>
                    <div className="mt-4">
                        <p>¿Las fechas son correctas? Por favor seleccione si Cumple o No cumple</p>
                        <Switch onMessage="Cumple" offMessage="No cumple" disabled={isSuperAdmin ? undefined : tpEvaluacion.evaluacion.finalizado == true || tpEvaluacion.evaluacion.habilitado == false || tpEvaluacion.evaluacion.modificable == false ? true : undefined} bind:checked={$form.fecha_ejecucion_requiere_comentario} />
                        {#if $form.fecha_ejecucion_requiere_comentario == false}
                            <Textarea
                                disabled={isSuperAdmin ? undefined : tpEvaluacion.evaluacion.finalizado == true || tpEvaluacion.evaluacion.habilitado == false || tpEvaluacion.evaluacion.modificable == false ? true : undefined}
                                label="Comentario"
                                className="mt-4"
                                maxlength="40000"
                                id="fecha_ejecucion_comentario"
                                bind:value={$form.fecha_ejecucion_comentario}
                                error={errors.fecha_ejecucion_comentario}
                                required
                            />
                        {/if}
                    </div>
                </InfoMessage>
            </div>

            <div slot="resumen-regional">
                <InfoMessage>
                    <div className="mt-4">
                        <p>¿El resumen ejecutivo regional es correcto? Por favor seleccione si Cumple o No cumple</p>
                        <Switch onMessage="Cumple" offMessage="No cumple" disabled={isSuperAdmin ? undefined : tpEvaluacion.evaluacion.finalizado == true || tpEvaluacion.evaluacion.habilitado == false || tpEvaluacion.evaluacion.modificable == false ? true : undefined} bind:checked={$form.resumen_regional_requiere_comentario} />
                        {#if $form.resumen_regional_requiere_comentario == false}
                            <Textarea
                                disabled={isSuperAdmin ? undefined : tpEvaluacion.evaluacion.finalizado == true || tpEvaluacion.evaluacion.habilitado == false || tpEvaluacion.evaluacion.modificable == false ? true : undefined}
                                label="Comentario"
                                className="mt-4"
                                maxlength="40000"
                                id="resumen_regional_comentario"
                                bind:value={$form.resumen_regional_comentario}
                                error={errors.resumen_regional_comentario}
                                required
                            />
                        {/if}
                    </div>
                </InfoMessage>
            </div>

            <div slot="antecedentes">
                <InfoMessage>
                    <div className="mt-4">
                        <p>¿Los antecedentes regionales son correctos? Por favor seleccione si Cumple o No cumple</p>
                        <Switch onMessage="Cumple" offMessage="No cumple" disabled={isSuperAdmin ? undefined : tpEvaluacion.evaluacion.finalizado == true || tpEvaluacion.evaluacion.habilitado == false || tpEvaluacion.evaluacion.modificable == false ? true : undefined} bind:checked={$form.antecedentes_regional_requiere_comentario} />
                        {#if $form.antecedentes_regional_requiere_comentario == false}
                            <Textarea
                                disabled={isSuperAdmin ? undefined : tpEvaluacion.evaluacion.finalizado == true || tpEvaluacion.evaluacion.habilitado == false || tpEvaluacion.evaluacion.modificable == false ? true : undefined}
                                label="Comentario"
                                className="mt-4"
                                maxlength="40000"
                                id="antecedentes_regional_comentario"
                                bind:value={$form.antecedentes_regional_comentario}
                                error={errors.antecedentes_regional_comentario}
                                required
                            />
                        {/if}
                    </div>
                </InfoMessage>
            </div>

            <div slot="retos-oportunidades">
                <InfoMessage>
                    <div className="mt-4">
                        <p>¿Los retos y prioridades locales son correctos? Por favor seleccione si Cumple o No cumple</p>
                        <Switch onMessage="Cumple" offMessage="No cumple" disabled={isSuperAdmin ? undefined : tpEvaluacion.evaluacion.finalizado == true || tpEvaluacion.evaluacion.habilitado == false || tpEvaluacion.evaluacion.modificable == false ? true : undefined} bind:checked={$form.retos_oportunidades_requiere_comentario} />
                        {#if $form.retos_oportunidades_requiere_comentario == false}
                            <Textarea
                                disabled={isSuperAdmin ? undefined : tpEvaluacion.evaluacion.finalizado == true || tpEvaluacion.evaluacion.habilitado == false || tpEvaluacion.evaluacion.modificable == false ? true : undefined}
                                label="Comentario"
                                className="mt-4"
                                maxlength="40000"
                                id="retos_oportunidades_comentario"
                                bind:value={$form.retos_oportunidades_comentario}
                                error={errors.retos_oportunidades_comentario}
                                required
                            />
                        {/if}
                    </div>
                </InfoMessage>
            </div>

            <div slot="pertinencia-territorio">
                <InfoMessage>
                    <div className="mt-4">
                        <p>¿La justificación y pertinencia en el territorio es correcta? Por favor seleccione si Cumple o No cumple</p>
                        <Switch onMessage="Cumple" offMessage="No cumple" disabled={isSuperAdmin ? undefined : tpEvaluacion.evaluacion.finalizado == true || tpEvaluacion.evaluacion.habilitado == false || tpEvaluacion.evaluacion.modificable == false ? true : undefined} bind:checked={$form.pertinencia_territorio_requiere_comentario} />
                        {#if $form.pertinencia_territorio_requiere_comentario == false}
                            <Textarea
                                disabled={isSuperAdmin ? undefined : tpEvaluacion.evaluacion.finalizado == true || tpEvaluacion.evaluacion.habilitado == false || tpEvaluacion.evaluacion.modificable == false ? true : undefined}
                                label="Comentario"
                                className="mt-4"
                                maxlength="40000"
                                id="pertinencia_territorio_comentario"
                                bind:value={$form.pertinencia_territorio_comentario}
                                error={errors.pertinencia_territorio_comentario}
                                required
                            />
                        {/if}
                    </div>
                </InfoMessage>
            </div>

            <div slot="bibliografia">
                <InfoMessage>
                    <div className="mt-4">
                        <p>¿La bibliografia es correcta? Por favor seleccione si Cumple o No cumple</p>
                        <Switch onMessage="Cumple" offMessage="No cumple" disabled={isSuperAdmin ? undefined : tpEvaluacion.evaluacion.finalizado == true || tpEvaluacion.evaluacion.habilitado == false || tpEvaluacion.evaluacion.modificable == false ? true : undefined} bind:checked={$form.bibliografia_requiere_comentario} />
                        {#if $form.bibliografia_requiere_comentario == false}
                            <Textarea
                                disabled={isSuperAdmin ? undefined : tpEvaluacion.evaluacion.finalizado == true || tpEvaluacion.evaluacion.habilitado == false || tpEvaluacion.evaluacion.modificable == false ? true : undefined}
                                label="Comentario"
                                className="mt-4"
                                maxlength="40000"
                                id="bibliografia_comentario"
                                bind:value={$form.bibliografia_comentario}
                                error={errors.bibliografia_comentario}
                                required
                            />
                        {/if}
                    </div>
                </InfoMessage>
            </div>

            <div slot="items-finales">
                <hr className="mt-10 mb-10" />

                <h1>Ortografía</h1>
                <InfoMessage>
                    <div className="mt-4">
                        <p>¿La ortografía es correcta? Por favor seleccione si Cumple o No cumple.</p>
                        <Switch onMessage="Cumple" offMessage="No cumple" disabled={isSuperAdmin ? undefined : tpEvaluacion.evaluacion.finalizado == true || tpEvaluacion.evaluacion.habilitado == false || tpEvaluacion.evaluacion.modificable == false ? true : undefined} bind:checked={$form.ortografia_requiere_comentario} />
                        {#if $form.ortografia_requiere_comentario == false}
                            <Textarea disabled={isSuperAdmin ? undefined : tpEvaluacion.evaluacion.finalizado == true || tpEvaluacion.evaluacion.habilitado == false || tpEvaluacion.evaluacion.modificable == false ? true : undefined} label="Comentario" className="mt-4" maxlength="40000" id="ortografia_comentario" bind:value={$form.ortografia_comentario} error={errors.ortografia_comentario} required />
                        {/if}
                    </div>
                </InfoMessage>

                <hr className="mt-10 mb-10" />
                <h1>Redacción</h1>
                <InfoMessage>
                    <div className="mt-4">
                        <p>¿La redacción es correcta? Por favor seleccione si Cumple o No cumple.</p>
                        <Switch onMessage="Cumple" offMessage="No cumple" disabled={isSuperAdmin ? undefined : tpEvaluacion.evaluacion.finalizado == true || tpEvaluacion.evaluacion.habilitado == false || tpEvaluacion.evaluacion.modificable == false ? true : undefined} bind:checked={$form.redaccion_requiere_comentario} />
                        {#if $form.redaccion_requiere_comentario == false}
                            <Textarea disabled={isSuperAdmin ? undefined : tpEvaluacion.evaluacion.finalizado == true || tpEvaluacion.evaluacion.habilitado == false || tpEvaluacion.evaluacion.modificable == false ? true : undefined} label="Comentario" className="mt-4" maxlength="40000" id="redaccioncomentario" bind:value={$form.redaccion_comentario} error={errors.redaccion_comentario} />
                        {/if}
                    </div>
                </InfoMessage>

                <hr className="mt-10 mb-10" />
                <h1>Normas APA</h1>
                <InfoMessage>
                    <div className="mt-4">
                        <p>¿Las normas APA son correctas? Por favor seleccione si Cumple o No cumple.</p>
                        <Switch onMessage="Cumple" offMessage="No cumple" disabled={isSuperAdmin ? undefined : tpEvaluacion.evaluacion.finalizado == true || tpEvaluacion.evaluacion.habilitado == false || tpEvaluacion.evaluacion.modificable == false ? true : undefined} bind:checked={$form.normas_apa_requiere_comentario} />
                        {#if $form.normas_apa_requiere_comentario == false}
                            <Textarea disabled={isSuperAdmin ? undefined : tpEvaluacion.evaluacion.finalizado == true || tpEvaluacion.evaluacion.habilitado == false || tpEvaluacion.evaluacion.modificable == false ? true : undefined} label="Comentario" className="mt-4" maxlength="40000" id="normas_apa_comentario" bind:value={$form.normas_apa_comentario} error={errors.normas_apa_comentario} required />
                        {/if}
                    </div>
                </InfoMessage>
            </div>
        </TpForm>

        <div className="flex items-center justify-between mt-14 px-8 py-4">
            {#if isSuperAdmin || (checkRole(authUser, [11, 5]) && tpEvaluacion.evaluacion.finalizado == false && tpEvaluacion.evaluacion.habilitado == true && tpEvaluacion.evaluacion.modificable == true)}
                {#if $form.clausula_confidencialidad}
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500 mr-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-green-500">Ha aceptado la cláusula de confidencialidad</span>
                {:else}
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500 mr-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-red-500">No ha aceptado la cláusula de confidencialidad</span>
                {/if}

                <PrimaryButton loading={$form.processing} className="ml-auto" type="submit">Guardar</PrimaryButton>
            {/if}
        </div>
    </form>

    <Dialog bind:open={proyectoDialogOpen} id="informacion">
        <div slot="title" className="flex items-center flex-col mt-4">
            <figure>
                <img src={'/images/feedback.png'} alt="Evaluación" className="h-32 mb-6" />
            </figure>
            Código del proyecto: {tp.proyecto.codigo}
        </div>
        <div slot="content">
            <div>
                <h1 className="text-center mt-4 mb-4">Cláusula de confidencialidad</h1>
                <p className="mb-4">
                    Al hacer clic en el botón Aceptar, dejo constancia del tratamiento confidencial que daré a la información relacionada con el proceso de evaluación que incluye, sin limitarse a esta, la información sobre proyectos, centros de formación, formuladores, autores y coautores de proyectos, resultados del proceso de evaluación en sus dos etapas. Por tanto, declaro que me abstendré de
                    usar o divulgar para cualquier fin y por cualquier medio la información enunciada.
                </p>
            </div>
        </div>
        <div slot="actions">
            <div className="p-4">
                <Button on:click={() => (($form.clausula_confidencialidad = true), (proyectoDialogOpen = false))} variant={null}>Aceptar</Button>
            </div>
        </div>
    </Dialog>

    <Dialog bind:open={dialogSegundaEvaluacion} id="informacion">
        <div slot="title" className="flex items-center flex-col mt-4">
            <figure>
                <img src={'/images/feedback.png'} alt="Evaluación" className="h-32 mb-6" />
            </figure>
            Código del proyecto: {tp.proyecto.codigo}
        </div>
        <div slot="content">
            <div>
                <h1 className="text-center mt-4 mb-4">Importante</h1>

                <p>Antes de iniciar a la segunda evaluación por favor diríjase a la sección <strong>Comentarios generales</strong> y verifique si el proponente hizo alguna aclaración sobre algún ítem.</p>

                {#if tp.proyecto.pdf_versiones}
                    <hr className="m-10 block" />
                    <h1 className="text-center mt-4 mb-4 font-black">Version del proyecto (.pdf)</h1>
                    <p className="mt-4">También revise la versión del proyecto en .pdf para ir verificando los cambios realizados en los diferentes campos.</p>
                    <ul>
                        {#each tp.proyecto.pdf_versiones as version}
                            <li>
                                {#if version.estado == 1}
                                    <a className="text-white underline" href={route('convocatorias.proyectos.version', [convocatoria.id, tp.id, version.version])}> {version.version}.pdf - Descargar</a>
                                    <small className="block">{version.created_at}</small>
                                {/if}
                            </li>
                        {/each}
                    </ul>
                {/if}
            </div>
        </div>
        <div slot="actions">
            <div className="p-4">
                <Button on:click={() => (dialogSegundaEvaluacion = false)} variant={null}>Aceptar</Button>
            </div>
        </div>
    </Dialog>
</AuthenticatedLayout>
