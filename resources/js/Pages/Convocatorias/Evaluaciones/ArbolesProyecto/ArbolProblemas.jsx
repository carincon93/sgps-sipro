<script>
    import AuthenticatedLayout, { title } from '@/Layouts/Authenticated'
    import { useForm, page } from '@inertiajs/inertia-svelte'
    import { route, checkRole, checkPermission } from '@/Utils'
    import { _ } from 'svelte-i18n'

    import Label from '@/Components/Label'
    import PrimaryButton from '@/Components/PrimaryButton'
    import Textarea from '@/Components/Textarea'
    import InfoMessage from '@/Components/InfoMessage'
    import Input from '@/Components/Input'
    import Switch from '@/Components/Switch'
    import EvaluationStepper from '@/Components/EvaluationStepper'
    import ArbolProblemasComponent from '../../Proyectos/ArbolesProyecto/ArbolProblemasComponent'

    export let errors
    export let convocatoria
    export let evaluacion
    export let proyecto
    export let efectosDirectos
    export let causasDirectas

    $: $title = 'Árbol de problemas'

    /**
     * Validar si el usuario autenticado es SuperAdmin
     */
    let auth_user = auth.user
    let is_super_admin = checkRole(auth_user, [1])

    let formEstrategiaRegionalEvaluacion = useForm({
        problema_central_puntaje: evaluacion.idi_evaluacion ? evaluacion.idi_evaluacion.problema_central_puntaje : evaluacion.cultura_innovacion_evaluacion ? evaluacion.cultura_innovacion_evaluacion.problema_central_puntaje : null,
        problema_central_comentario: evaluacion.idi_evaluacion ? evaluacion.idi_evaluacion.problema_central_comentario : evaluacion.cultura_innovacion_evaluacion ? evaluacion.cultura_innovacion_evaluacion.problema_central_comentario : null,
        problema_central_requiere_comentario: evaluacion.idi_evaluacion ? (evaluacion.idi_evaluacion.problema_central_comentario == null ? true : false) : evaluacion.cultura_innovacion_evaluacion ? (evaluacion.cultura_innovacion_evaluacion.problema_central_comentario == null ? true : false) : null,
    })

    function submitEstrategiaRegionalEvaluacion() {
        if (is_super_admin || (checkRole(auth_user, [11, 5]) && evaluacion.finalizado == false && evaluacion.habilitado == true && evaluacion.modificable == true)) {
            $formEstrategiaRegionalEvaluacion.put(route('convocatorias.evaluaciones.arbol-problemas.guardar-evaluacion', [convocatoria.id, evaluacion.id]), {
                preserveScroll: true,
            })
        }
    }

    let formServicioTecnologicoEvaluacion = useForm({
        arbol_problemas_puntaje: evaluacion.servicio_tecnologico_evaluacion?.arbol_problemas_puntaje,
        arbol_problemas_comentario: evaluacion.servicio_tecnologico_evaluacion?.arbol_problemas_comentario ? evaluacion.servicio_tecnologico_evaluacion?.arbol_problemas_comentario : '',
        arbol_problemas_requiere_comentario: evaluacion.servicio_tecnologico_evaluacion?.arbol_problemas_comentario == null ? true : false,
    })
    function submitServicioTecnologicoEvaluacion() {
        if (is_super_admin || (checkRole(auth_user, [11, 5]) && evaluacion.finalizado == false && evaluacion.habilitado == true && evaluacion.modificable == true)) {
            $formServicioTecnologicoEvaluacion.put(route('convocatorias.evaluaciones.arbol-problemas.guardar-evaluacion', [convocatoria.id, evaluacion.id]), {
                preserveScroll: true,
            })
        }
    }

    let formTpEvaluacion = useForm({
        arbol_problemas_comentario: evaluacion.tp_evaluacion?.arbol_problemas_comentario ? evaluacion.tp_evaluacion?.arbol_problemas_comentario : '',
        arbol_problemas_requiere_comentario: evaluacion.tp_evaluacion?.arbol_problemas_comentario == null ? true : false,
    })
    function submitTpEvaluacion() {
        if (is_super_admin || (checkRole(auth_user, [11, 5]) && evaluacion.finalizado == false && evaluacion.habilitado == true && evaluacion.modificable == true)) {
            $formTpEvaluacion.put(route('convocatorias.evaluaciones.arbol-problemas.guardar-evaluacion', [convocatoria.id, evaluacion.id]), {
                preserveScroll: true,
            })
        }
    }
</script>

<AuthenticatedLayout>
    <header className="pt-[8rem]" slot="header">
        <EvaluationStepper {convocatoria} {evaluacion} {proyecto} />
    </header>

    <ArbolProblemasComponent {errors} {convocatoria} {proyecto} {efectosDirectos} {causasDirectas} faseEvaluacion={true} />

    {#if proyecto.codigo_linea_programatica == 23 || proyecto.codigo_linea_programatica == 65 || proyecto.codigo_linea_programatica == 66 || proyecto.codigo_linea_programatica == 68 || proyecto.codigo_linea_programatica == 69 || proyecto.codigo_linea_programatica == 82}
        <hr className="mt-10 mb-10" />
        <a className="bg-orangered-900 bottom-0 fixed flex hover:bg-orangered-600 mb-5 ml-10 px-6 py-2 rounded-3xl shadow-2xl text-center text-white z-50" href="#evaluacion">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
            Ir a la evaluación
        </a>
    {/if}

    {#if proyecto.codigo_linea_programatica == 23 || proyecto.codigo_linea_programatica == 65 || proyecto.codigo_linea_programatica == 66 || proyecto.codigo_linea_programatica == 82}
        <hr className="mt-10 mb-10" />

        <h1 className="text-3xl mt-24 mb-8 text-center" id="evaluacion">Evaluación</h1>
        <div className="mt-16">
            <div className="mt-44 ">
                <div>
                    <p className="mb-4">Antecedentes</p>
                </div>
                <div>
                    <Textarea disabled label="Antecedentes" maxlength="40000" id="antecedentes" value={proyecto.antecedentes} />
                </div>
            </div>

            <div className="mt-44 ">
                <div>
                    <p className="mb-4">Identificación y descripción del problema</p>
                </div>
                <div>
                    <Textarea disabled label="Identificación y descripción del problema" maxlength="40000" id="identificacion_problema" value={proyecto.identificacion_problema} />
                </div>
            </div>

            <div className="mt-44 ">
                <div>
                    <p className="mb-4">Justificación</p>
                </div>
                <div>
                    <Textarea disabled label="Justificación" maxlength="40000" id="justificacion_problema" value={proyecto.justificacion_problema} />
                </div>
            </div>

            <div className="mt-44 ">
                <div>
                    <p className="mb-4">Marco conceptual</p>
                </div>
                <div>
                    <Textarea disabled label="Marco conceptual" maxlength="20000" id="marco_conceptual" value={proyecto.marco_conceptual} />
                </div>
            </div>

            <form on:submit|preventDefault={submitEstrategiaRegionalEvaluacion}>
                <InfoMessage>
                    <h1>Criterios de evaluacion</h1>
                    <ul className="list-disc p-4">
                        <li><strong>Puntaje: 0 a 7</strong> El problema no ha sido identificado a partir de los instrumentos de planeación regional como las agendas departamentales y/o planes tecnológicos y no se encuentra coherencia con los antecedentes, la justificación y el marco conceptual.</li>
                        <li><strong>Puntaje: 8 a 13</strong> El problema se ha identificado a partir de los instrumentos de planeación regional como las agendas departamentales y/o planes tecnológicos y se encuentra coherencia entre los antecedentes, la justificación y el marco conceptual. Sin embargo, es susceptible de ajustes en términos de coherencia en la propuesta</li>
                        <li><strong>Puntaje: 14 a 15</strong> El problema se ha identificado a partir de los instrumentos de planeación regional como las agendas departamentales y/o planes tecnológicos y guarda una coherencia global entre los antecedentes, la justificación y el marco conceptual.</li>
                    </ul>

                    <Label className="mt-4 mb-4" labelFor="problema_central_puntaje" value="Puntaje (Máximo 15)" />
                    <Input
                        disabled={is_super_admin ? undefined : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : undefined}
                        label="Puntaje"
                        id="problema_central_puntaje"
                        type="number"
                        input$step="1"
                        input$min="0"
                        input$max="15"
                        className="mt-1"
                        bind:value={$formEstrategiaRegionalEvaluacion.problema_central_puntaje}
                        placeholder="Puntaje"
                        autocomplete="off"
                        error={errors.problema_central_puntaje}
                    />

                    <div className="mt-4">
                        <p>¿Los antecedentes, árbol de problemas, identificación y descripción del problema, justificación y el marco conceptual son correctos? Por favor seleccione si Cumple o No cumple.</p>
                        <Switch onMessage="Cumple" offMessage="No cumple" disabled={is_super_admin ? undefined : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : undefined} bind:checked={$formEstrategiaRegionalEvaluacion.problema_central_requiere_comentario} />
                        {#if $formEstrategiaRegionalEvaluacion.problema_central_requiere_comentario == false}
                            <Textarea
                                disabled={is_super_admin ? undefined : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : undefined}
                                label="Comentario"
                                className="mt-4"
                                maxlength="40000"
                                id="problema_central_comentario"
                                bind:value={$formEstrategiaRegionalEvaluacion.problema_central_comentario}
                                error={errors.problema_central_comentario}
                                required
                            />
                        {/if}
                    </div>
                </InfoMessage>
                <div className="flex items-center justify-between mt-14 px-8 py-4">
                    {#if is_super_admin || (checkRole(auth_user, [11, 5]) && evaluacion.finalizado == false && evaluacion.habilitado == true && evaluacion.modificable == true)}
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
                    <h1>Criterios de evaluacion</h1>
                    <p>El árbol de objetivos se obtiene al transformar en positivo el árbol de problema manteniendo la misma estructura y niveles de jerarquía. Es una versión de lo que se esperará que suceda bajo las siguientes consideraciones:</p>
                    <ul className="list-disc p-4">
                        <li>El problema principal del árbol de problemas se convertirá en el objetivo general.</li>
                        <li>Las causas directas serán los objetivos específicos.</li>
                        <li>Las causas indirectas serán las actividades.</li>
                        <li>Los efectos directos se convertirán en resultados.</li>
                    </ul>

                    <Label className="mt-4 mb-4" labelFor="arbol_problemas_puntaje" value="Puntaje (Máximo 5)" />
                    <Input
                        disabled={is_super_admin ? undefined : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : undefined}
                        label="Puntaje"
                        id="arbol_problemas_puntaje"
                        type="number"
                        input$step="1"
                        input$min="0"
                        input$max="5"
                        className="mt-1"
                        bind:value={$formServicioTecnologicoEvaluacion.arbol_problemas_puntaje}
                        placeholder="Puntaje"
                        autocomplete="off"
                        error={errors.arbol_problemas_puntaje}
                    />

                    <div className="mt-4">
                        <p>¿El árbol de problemas es correcto? Por favor seleccione si Cumple o No cumple.</p>
                        <Switch onMessage="Cumple" offMessage="No cumple" disabled={is_super_admin ? undefined : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : undefined} bind:checked={$formServicioTecnologicoEvaluacion.arbol_problemas_requiere_comentario} />
                        {#if $formServicioTecnologicoEvaluacion.arbol_problemas_requiere_comentario == false}
                            <Textarea
                                disabled={is_super_admin ? undefined : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : undefined}
                                label="Comentario"
                                className="mt-4"
                                maxlength="40000"
                                id="arbol_problemas_comentario"
                                bind:value={$formServicioTecnologicoEvaluacion.arbol_problemas_comentario}
                                error={errors.arbol_problemas_comentario}
                                required
                            />
                        {/if}
                    </div>
                </InfoMessage>
                <div className="flex items-center justify-between mt-14 px-8 py-4">
                    {#if is_super_admin || (checkRole(auth_user, [11, 5]) && evaluacion.finalizado == false && evaluacion.habilitado == true && evaluacion.modificable == true)}
                        <PrimaryButton loading={$formServicioTecnologicoEvaluacion.processing} className="ml-auto" type="submit">Guardar</PrimaryButton>
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
                        <p>¿El árbol de problemas es correcto? Por favor seleccione si Cumple o No cumple.</p>
                        <Switch onMessage="Cumple" offMessage="No cumple" disabled={is_super_admin ? undefined : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : undefined} bind:checked={$formTpEvaluacion.arbol_problemas_requiere_comentario} />
                        {#if $formTpEvaluacion.arbol_problemas_requiere_comentario == false}
                            <Textarea disabled={is_super_admin ? undefined : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : undefined} label="Comentario" className="mt-4" maxlength="40000" id="arbol_problemas_comentario" bind:value={$formTpEvaluacion.arbol_problemas_comentario} error={errors.arbol_problemas_comentario} required />
                        {/if}
                    </div>
                </InfoMessage>
                <div className="flex items-center justify-between mt-14 px-8 py-4">
                    {#if is_super_admin || (checkRole(auth_user, [11, 5]) && evaluacion.finalizado == false && evaluacion.habilitado == true && evaluacion.modificable == true)}
                        <PrimaryButton loading={$formTpEvaluacion.processing} className="ml-auto" type="submit">Guardar</PrimaryButton>
                    {/if}
                </div>
            </form>
        </div>
    {/if}
</AuthenticatedLayout>
