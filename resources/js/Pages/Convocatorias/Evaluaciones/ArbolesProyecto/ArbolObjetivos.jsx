<script>
    import AuthenticatedLayout, { title } from '@/Layouts/Authenticated'
    import { useForm, page } from '@inertiajs/inertia-svelte'
    import { route, checkRole, checkPermission } from '@/Utils'
    import { _ } from 'svelte-i18n'

    import Label from '@/Components/Label'
    import Input from '@/Components/Input'
    import PrimaryButton from '@/Components/PrimaryButton'
    import Textarea from '@/Components/Textarea'
    import InfoMessage from '@/Components/InfoMessage'
    import EvaluationStepper from '@/Components/EvaluationStepper'
    import Switch from '@/Components/Switch'
    import ArbolObjetivosComponent from '../../Proyectos/ArbolesProyecto/ArbolObjetivosComponent'

    export let errors
    export let convocatoria
    export let evaluacion
    export let proyecto
    export let efectosDirectos
    export let causasDirectas
    export let tiposImpacto
    export let resultados
    export let objetivosEspecificos

    $: $title = 'Árbol de objetivos'

    /**
     * Validar si el usuario autenticado es SuperAdmin
     */
    let authUser = auth.user
    let isSuperAdmin = checkRole(authUser, [1])

    let formEstrategiaRegionalEvaluacion = useForm({
        objetivos_puntaje: evaluacion.idi_evaluacion ? evaluacion.idi_evaluacion.objetivos_puntaje : evaluacion.cultura_innovacion_evaluacion ? evaluacion.cultura_innovacion_evaluacion.objetivos_puntaje : null,
        objetivos_comentario: evaluacion.idi_evaluacion ? evaluacion.idi_evaluacion.objetivos_comentario : evaluacion.cultura_innovacion_evaluacion ? evaluacion.cultura_innovacion_evaluacion.objetivos_comentario : null,
        objetivos_requiere_comentario: evaluacion.idi_evaluacion ? (evaluacion.idi_evaluacion.objetivos_comentario == null ? true : false) : evaluacion.cultura_innovacion_evaluacion ? (evaluacion.cultura_innovacion_evaluacion.objetivos_comentario == null ? true : false) : null,

        resultados_puntaje: evaluacion.idi_evaluacion ? evaluacion.idi_evaluacion.resultados_puntaje : evaluacion.cultura_innovacion_evaluacion ? evaluacion.cultura_innovacion_evaluacion.resultados_puntaje : null,
        resultados_comentario: evaluacion.idi_evaluacion ? evaluacion.idi_evaluacion.resultados_comentario : evaluacion.cultura_innovacion_evaluacion ? evaluacion.cultura_innovacion_evaluacion.resultados_comentario : null,
        resultados_requiere_comentario: evaluacion.idi_evaluacion ? (evaluacion.idi_evaluacion.resultados_comentario == null ? true : false) : evaluacion.cultura_innovacion_evaluacion ? (evaluacion.cultura_innovacion_evaluacion.resultados_comentario == null ? true : false) : null,
    })
    function submitEstrategiaRegionalEvaluacion() {
        if (isSuperAdmin || (checkRole(authUser, [11, 5]) && evaluacion.finalizado == false && evaluacion.habilitado == true && evaluacion.modificable == true)) {
            $formEstrategiaRegionalEvaluacion.put(route('convocatorias.evaluaciones.arbol-objetivos.guardar-evaluacion', [convocatoria.id, evaluacion.id]), {
                preserveScroll: true,
            })
        }
    }

    let formServicioTecnologicoEvaluacion = useForm({
        objetivo_general_puntaje: evaluacion.servicio_tecnologico_evaluacion?.objetivo_general_puntaje,
        objetivo_general_comentario: evaluacion.servicio_tecnologico_evaluacion?.objetivo_general_comentario ? evaluacion.servicio_tecnologico_evaluacion?.objetivo_general_comentario : '',
        objetivo_general_requiere_comentario: evaluacion.servicio_tecnologico_evaluacion?.objetivo_general_comentario == null ? true : false,

        primer_objetivo_puntaje: evaluacion.servicio_tecnologico_evaluacion?.primer_objetivo_puntaje,
        primer_objetivo_comentario: evaluacion.servicio_tecnologico_evaluacion?.primer_objetivo_comentario ? evaluacion.servicio_tecnologico_evaluacion?.primer_objetivo_comentario : '',
        primer_objetivo_requiere_comentario: evaluacion.servicio_tecnologico_evaluacion?.primer_objetivo_comentario == null ? true : false,

        segundo_objetivo_puntaje: evaluacion.servicio_tecnologico_evaluacion?.segundo_objetivo_puntaje,
        segundo_objetivo_comentario: evaluacion.servicio_tecnologico_evaluacion?.segundo_objetivo_comentario ? evaluacion.servicio_tecnologico_evaluacion?.segundo_objetivo_comentario : '',
        segundo_objetivo_requiere_comentario: evaluacion.servicio_tecnologico_evaluacion?.segundo_objetivo_comentario == null ? true : false,

        tercer_objetivo_puntaje: evaluacion.servicio_tecnologico_evaluacion?.tercer_objetivo_puntaje,
        tercer_objetivo_comentario: evaluacion.servicio_tecnologico_evaluacion?.tercer_objetivo_comentario ? evaluacion.servicio_tecnologico_evaluacion?.tercer_objetivo_comentario : '',
        tercer_objetivo_requiere_comentario: evaluacion.servicio_tecnologico_evaluacion?.tercer_objetivo_comentario == null ? true : false,

        cuarto_objetivo_puntaje: evaluacion.servicio_tecnologico_evaluacion?.cuarto_objetivo_puntaje,
        cuarto_objetivo_comentario: evaluacion.servicio_tecnologico_evaluacion?.cuarto_objetivo_comentario ? evaluacion.servicio_tecnologico_evaluacion?.cuarto_objetivo_comentario : '',
        cuarto_objetivo_requiere_comentario: evaluacion.servicio_tecnologico_evaluacion?.cuarto_objetivo_comentario == null ? true : false,

        resultados_primer_obj_puntaje: evaluacion.servicio_tecnologico_evaluacion?.resultados_primer_obj_puntaje,
        resultados_primer_obj_comentario: evaluacion.servicio_tecnologico_evaluacion?.resultados_primer_obj_comentario ? evaluacion.servicio_tecnologico_evaluacion?.resultados_primer_obj_comentario : '',
        resultados_primer_obj_requiere_comentario: evaluacion.servicio_tecnologico_evaluacion?.resultados_primer_obj_comentario == null ? true : false,

        resultados_segundo_obj_puntaje: evaluacion.servicio_tecnologico_evaluacion?.resultados_segundo_obj_puntaje,
        resultados_segundo_obj_comentario: evaluacion.servicio_tecnologico_evaluacion?.resultados_segundo_obj_comentario ? evaluacion.servicio_tecnologico_evaluacion?.resultados_segundo_obj_comentario : '',
        resultados_segundo_obj_requiere_comentario: evaluacion.servicio_tecnologico_evaluacion?.resultados_segundo_obj_comentario == null ? true : false,

        resultados_tercer_obj_puntaje: evaluacion.servicio_tecnologico_evaluacion?.resultados_tercer_obj_puntaje,
        resultados_tercer_obj_comentario: evaluacion.servicio_tecnologico_evaluacion?.resultados_tercer_obj_comentario ? evaluacion.servicio_tecnologico_evaluacion?.resultados_tercer_obj_comentario : '',
        resultados_tercer_obj_requiere_comentario: evaluacion.servicio_tecnologico_evaluacion?.resultados_tercer_obj_comentario == null ? true : false,

        resultados_cuarto_obj_puntaje: evaluacion.servicio_tecnologico_evaluacion?.resultados_cuarto_obj_puntaje,
        resultados_cuarto_obj_comentario: evaluacion.servicio_tecnologico_evaluacion?.resultados_cuarto_obj_comentario ? evaluacion.servicio_tecnologico_evaluacion?.resultados_cuarto_obj_comentario : '',
        resultados_cuarto_obj_requiere_comentario: evaluacion.servicio_tecnologico_evaluacion?.resultados_cuarto_obj_comentario == null ? true : false,
    })
    function submitServicioTecnologicoEvaluacion() {
        if (isSuperAdmin || (checkRole(authUser, [11, 5]) && evaluacion.finalizado == false && evaluacion.habilitado == true && evaluacion.modificable == true)) {
            $formServicioTecnologicoEvaluacion.put(route('convocatorias.evaluaciones.arbol-objetivos.guardar-evaluacion', [convocatoria.id, evaluacion.id]), {
                preserveScroll: true,
            })
        }
    }

    let formTpEvaluacion = useForm({
        arbol_objetivos_comentario: evaluacion.tp_evaluacion?.arbol_objetivos_comentario ? evaluacion.tp_evaluacion?.arbol_objetivos_comentario : '',
        arbol_objetivos_requiere_comentario: evaluacion.tp_evaluacion?.arbol_objetivos_comentario == null ? true : false,
    })
    function submitTpEvaluacion() {
        if (isSuperAdmin || (checkRole(authUser, [11, 5]) && evaluacion.finalizado == false && evaluacion.habilitado == true && evaluacion.modificable == true)) {
            $formTpEvaluacion.put(route('convocatorias.evaluaciones.arbol-objetivos.guardar-evaluacion', [convocatoria.id, evaluacion.id]), {
                preserveScroll: true,
            })
        }
    }
</script>

<AuthenticatedLayout>
    <header className="pt-[8rem]" slot="header">
        <EvaluationStepper {convocatoria} {evaluacion} {proyecto} />
    </header>

    {#if proyecto.codigo_linea_programatica == 23 || proyecto.codigo_linea_programatica == 65 || proyecto.codigo_linea_programatica == 66 || proyecto.codigo_linea_programatica == 82}
        <hr className="mt-10 mb-10" />
        <a className="bg-orangered-900 bottom-0 fixed flex hover:bg-orangered-600 mb-5 ml-10 px-6 py-2 rounded-3xl shadow-2xl text-center text-white z-50" href="#evaluacion">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
            Ir a la evaluación
        </a>
    {/if}

    <ArbolObjetivosComponent {errors} {convocatoria} {proyecto} {efectosDirectos} {causasDirectas} {tiposImpacto} {resultados} {objetivosEspecificos} faseEvaluacion={true} />

    {#if proyecto.codigo_linea_programatica == 23 || proyecto.codigo_linea_programatica == 65 || proyecto.codigo_linea_programatica == 66 || proyecto.codigo_linea_programatica == 82}
        <hr className="mt-10 mb-10" />

        <h1 className="text-3xl mt-24 mb-8 text-center" id="evaluacion">Evaluación</h1>

        <div className="mt-16">
            <form on:submit|preventDefault={submitEstrategiaRegionalEvaluacion}>
                <InfoMessage>
                    <h1 className="text-2xl text-center mb-10">Resultados</h1>
                    <h1>Criterios de evaluacion</h1>
                    <ul className="list-disc p-4">
                        <li><strong>Puntaje: 0 a 4</strong> No son claros los beneficios y ventajas de los resultados en el marco del proyecto, no se generan por el desarrollo de las actividades y tampoco evidencian la materialización de la solución propuesta para resolver el problema del proyecto.</li>
                        <li><strong>Puntaje: 5 a 7</strong> Los resultados se generan por el desarrollo de las actividades y se identifican sus ventajas y beneficios para dar solución al problema identificado. Son susceptibles de mejora para evidenciar de forma clara la materialización de la solución propuesta.</li>
                        <li><strong>Puntaje: 8 a 9</strong> Los resultados se generan por el desarrollo de las actividades, sus beneficios y ventajas sobresalen en pro de dar una solución contundente al problema identificado y evidencian de forma clara la materialización de la solución propuesta.</li>
                    </ul>

                    <Label className="mt-4 mb-4" labelFor="resultados_puntaje" value="Puntaje (Máximo 9)" />
                    <Input
                        disabled={isSuperAdmin ? undefined : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : undefined}
                        label="Puntaje"
                        id="resultados_puntaje"
                        type="number"
                        input$step="1"
                        input$min="0"
                        input$max="9"
                        className="mt-1"
                        bind:value={$formEstrategiaRegionalEvaluacion.resultados_puntaje}
                        placeholder="Puntaje"
                        autocomplete="off"
                        error={errors.resultados_puntaje}
                    />

                    <div className="mt-4">
                        <p>¿Los resultados son correctos? Por favor seleccione si Cumple o No cumple.</p>
                        <Switch onMessage="Cumple" offMessage="No cumple" disabled={isSuperAdmin ? undefined : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : undefined} bind:checked={$formEstrategiaRegionalEvaluacion.resultados_requiere_comentario} />
                        {#if $formEstrategiaRegionalEvaluacion.resultados_requiere_comentario == false}
                            <Textarea disabled={isSuperAdmin ? undefined : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : undefined} label="Comentario" className="mt-4" maxlength="40000" id="resultados_comentario" bind:value={$formEstrategiaRegionalEvaluacion.resultados_comentario} error={errors.resultados_comentario} required />
                        {/if}
                    </div>

                    <hr className="mt-10 mb-10" />
                    <h1 className="text-2xl text-center mb-10">Árbol de objetivos / Objetivo general / Objetivos específicos</h1>
                    <h1>Criterios de evaluacion</h1>
                    <ul className="list-disc p-4">
                        <li><strong>Puntaje: 0 a 7</strong> El objetivo general y los objetivos específicos (solución identificada) no dan respuesta al problema, tampo estan relacionados entre ellos, y los objetivos específicos no presentan una secuencia lógica para alcanzar el objetivo general.</li>
                        <li><strong>Puntaje: 8 a 13</strong> El objetivo general y los objetivos específicos (solución identificada) dan respuesta parcial al problema; hay relación entre ellos y los objetivos específicos están formulados como una secuencia lógica para alcanzar el objetivo general, pero susceptibles de ajustes y mejoras.</li>
                        <li><strong>Puntaje: 14 a 15</strong> El objetivo general y los objetivos específicos (solución identificada) dan respuesta integral al problema; hay relación entre ellos y los objetivos específicos están formulados como una secuencia lógica para alcanzar el objetivo general.</li>
                    </ul>

                    <Label className="mt-4 mb-4" labelFor="objetivos_puntaje" value="Puntaje (Máximo 15)" />
                    <Input
                        disabled={isSuperAdmin ? undefined : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : undefined}
                        label="Puntaje"
                        id="objetivos_puntaje"
                        type="number"
                        input$step="1"
                        input$min="0"
                        input$max="15"
                        className="mt-1"
                        bind:value={$formEstrategiaRegionalEvaluacion.objetivos_puntaje}
                        placeholder="Puntaje"
                        autocomplete="off"
                        error={errors.objetivos_puntaje}
                    />

                    <div className="mt-4">
                        <p>¿El árbol de objetivos, objetivo general o los objetivos específicos son correctos? Por favor seleccione si Cumple o No cumple.</p>
                        <Switch onMessage="Cumple" offMessage="No cumple" disabled={isSuperAdmin ? undefined : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : undefined} bind:checked={$formEstrategiaRegionalEvaluacion.objetivos_requiere_comentario} />
                        {#if $formEstrategiaRegionalEvaluacion.objetivos_requiere_comentario == false}
                            <Textarea disabled={isSuperAdmin ? undefined : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : undefined} label="Comentario" className="mt-4" maxlength="40000" id="objetivos_comentario" bind:value={$formEstrategiaRegionalEvaluacion.objetivos_comentario} error={errors.objetivos_comentario} required />
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
                    <h1 className="text-2xl text-center mb-10">Objetivo general</h1>

                    <h1>Criterios de evaluacion</h1>
                    <ul className="list-disc p-4">
                        <li>
                            <strong>Puntaje: 0 a 2</strong> El objetivo general se origina al convertir en positivo el problema principal (tronco) identificado en el árbol de problemas. La redacción deberá iniciar con un verbo en modo infinitivo, es decir, con una palabra terminada en ""ar"", ""er"" o ""ir"". La estructura del objetivo debe contener al menos tres componentes: (1) la acción que se espera
                            realizar, (2) el objeto sobre el cual recae la acción y (3) elementos adicionales de contexto o descriptivos. El objetivo general debe expresar el fin concreto del proyecto en correspondencia directa con el título del proyecto y la pregunta de la formulación del problema, el cual debe ser claro, medible, alcanzable y consistente con el proyecto que está formulando. Debe
                            responde al ¿Qué?, ¿Cómo? y el ¿Para qué? Nota: A continuación, se describen algunos errores comunes al momento de estructurar el objetivo general: - Incluir en el objetivo general del proyecto las alternativas de solución (por ejemplo: mediante, por intermedio de, a través de, entre otros). - Incluir en el objetivo general los fines o efectos del proyecto (por ejemplo:
                            “… para mejorar la calidad de vida”)
                        </li>
                    </ul>

                    <Label className="mt-4 mb-4" labelFor="objetivo_general_puntaje" value="Puntaje (Máximo 2)" />
                    <Input
                        disabled={isSuperAdmin ? undefined : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : undefined}
                        label="Puntaje"
                        id="objetivo_general_puntaje"
                        type="number"
                        input$step="1"
                        input$min="0"
                        input$max="2"
                        className="mt-1"
                        bind:value={$formServicioTecnologicoEvaluacion.objetivo_general_puntaje}
                        placeholder="Puntaje"
                        autocomplete="off"
                        error={errors.objetivo_general_puntaje}
                    />

                    <div className="mt-4">
                        <p>¿El objetivo general es correcto? Por favor seleccione si Cumple o No cumple.</p>
                        <Switch onMessage="Cumple" offMessage="No cumple" disabled={isSuperAdmin ? undefined : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : undefined} bind:checked={$formServicioTecnologicoEvaluacion.objetivo_general_requiere_comentario} />
                        {#if $formServicioTecnologicoEvaluacion.objetivo_general_requiere_comentario == false}
                            <Textarea
                                disabled={isSuperAdmin ? undefined : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : undefined}
                                label="Comentario"
                                className="mt-4"
                                maxlength="40000"
                                id="objetivo_general_comentario"
                                bind:value={$formServicioTecnologicoEvaluacion.objetivo_general_comentario}
                                error={errors.objetivo_general_comentario}
                                required
                            />
                        {/if}
                    </div>

                    <hr className="mt-10 mb-10 border-app-300" />
                    <h1 className="text-2xl text-center mb-10">Objetivos específicos</h1>

                    <h1>Criterios de evaluacion</h1>
                    <ul className="list-disc p-4">
                        <li>
                            <strong>Puntaje: 0 a {proyecto.cantidad_objetivos > 0 ? (8 / proyecto.cantidad_objetivos).toFixed(2) : 0}</strong> Los objetivos específicos son los medios cuantificables que llevarán al cumplimiento del objetivo general. Estos surgen de pasar a positivo las causas directas identificadas en el árbol de problemas. La redacción de los objetivos específicos deberá iniciar con
                            un verbo en modo infinitivo, es decir, con una palabra terminada en ""ar"", ""er"" o ""ir"". La estructura del objetivo debe contener al menos tres componentes: (1) la acción que se espera realizar, (2) el objeto sobre el cual recae la acción y (3) elementos adicionales de contexto o descriptivos. Nota: A continuación, se describen algunos errores comunes al momento de estructurar
                            los objetivos específicos: - Describir los objetivos específicos del proyecto de forma demasiado amplia, es decir, los objetivos específicos parecen objetivos generales. - Confundir los objetivos específicos con las actividades del proyecto. Es decir, utilizar verbos que hacen referencia a aspectos demasiado operativos para describir los objetivos específicos de la iniciativa,
                            por ejemplo: contratar, instalar, entre otros.
                        </li>
                    </ul>
                    {#if proyecto.cantidad_objetivos == 0}
                        <InfoMessage className="mt-10" alertMsg={true}>Este proyecto no tiene objetivos específicos generados. No se puede evaluar</InfoMessage>
                    {/if}
                    {#each { length: proyecto.cantidad_objetivos } as _empty, j}
                        {#if j == 0}
                            <h1 className="text-black">Primer objetivo específico</h1>

                            <Label className="mt-4 mb-4" labelFor="primer_objetivo_puntaje" value="Puntaje (Máximo {(8 / proyecto.cantidad_objetivos).toFixed(2)})" />
                            <Input
                                disabled={isSuperAdmin ? undefined : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : undefined}
                                label="Puntaje"
                                id="primer_objetivo_puntaje"
                                type="number"
                                input$step="0.1"
                                input$min="0"
                                input$max={(8 / proyecto.cantidad_objetivos).toFixed(2)}
                                className="mt-1"
                                bind:value={$formServicioTecnologicoEvaluacion.primer_objetivo_puntaje}
                                placeholder="Puntaje"
                                autocomplete="off"
                                error={errors.primer_objetivo_puntaje}
                            />

                            <div className="mt-4">
                                <p>¿El primer objetivo específico es correcto? Por favor seleccione si Cumple o No cumple.</p>
                                <Switch onMessage="Cumple" offMessage="No cumple" disabled={isSuperAdmin ? undefined : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : undefined} bind:checked={$formServicioTecnologicoEvaluacion.primer_objetivo_requiere_comentario} />
                                {#if $formServicioTecnologicoEvaluacion.primer_objetivo_requiere_comentario == false}
                                    <Textarea
                                        disabled={isSuperAdmin ? undefined : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : undefined}
                                        label="Comentario"
                                        className="mt-4"
                                        maxlength="40000"
                                        id="primer_objetivo_comentario"
                                        bind:value={$formServicioTecnologicoEvaluacion.primer_objetivo_comentario}
                                        error={errors.primer_objetivo_comentario}
                                        required
                                    />
                                {/if}
                            </div>
                        {:else if j == 1}
                            <hr className="mt-10 mb-10 border-app-300" />

                            <h1 className="text-black">Segundo objetivo específico</h1>

                            <Label className="mt-4 mb-4" labelFor="segundo_objetivo_puntaje" value="Puntaje (Máximo {(8 / proyecto.cantidad_objetivos).toFixed(2)})" />

                            <Input
                                disabled={isSuperAdmin ? undefined : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : undefined}
                                label="Puntaje"
                                id="segundo_objetivo_puntaje"
                                type="number"
                                input$step="0.1"
                                input$min="0"
                                input$max={(8 / proyecto.cantidad_objetivos).toFixed(2)}
                                className="mt-1"
                                bind:value={$formServicioTecnologicoEvaluacion.segundo_objetivo_puntaje}
                                placeholder="Puntaje"
                                autocomplete="off"
                                error={errors.segundo_objetivo_puntaje}
                            />

                            <div className="mt-4">
                                <p>¿El segundo objetivo específico es correcto? Por favor seleccione si Cumple o No cumple.</p>
                                <Switch onMessage="Cumple" offMessage="No cumple" disabled={isSuperAdmin ? undefined : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : undefined} bind:checked={$formServicioTecnologicoEvaluacion.segundo_objetivo_requiere_comentario} />
                                {#if $formServicioTecnologicoEvaluacion.segundo_objetivo_requiere_comentario == false}
                                    <Textarea
                                        disabled={isSuperAdmin ? undefined : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : undefined}
                                        label="Comentario"
                                        className="mt-4"
                                        maxlength="40000"
                                        id="segundo_objetivo_comentario"
                                        bind:value={$formServicioTecnologicoEvaluacion.segundo_objetivo_comentario}
                                        error={errors.segundo_objetivo_comentario}
                                        required
                                    />
                                {/if}
                            </div>
                        {:else if j == 2}
                            <hr className="mt-10 mb-10 border-app-300" />

                            <h1 className="text-black">Tercer objetivo específico</h1>
                            <Label className="mt-4 mb-4" labelFor="tercer_objetivo_puntaje" value="Puntaje (Máximo {(8 / proyecto.cantidad_objetivos).toFixed(2)})" />

                            <Input
                                disabled={isSuperAdmin ? undefined : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : undefined}
                                label="Puntaje"
                                id="tercer_objetivo_puntaje"
                                type="number"
                                input$step="0.1"
                                input$min="0"
                                input$max={(8 / proyecto.cantidad_objetivos).toFixed(2)}
                                className="mt-1"
                                bind:value={$formServicioTecnologicoEvaluacion.tercer_objetivo_puntaje}
                                placeholder="Puntaje"
                                autocomplete="off"
                                error={errors.tercer_objetivo_puntaje}
                            />

                            <div className="mt-4">
                                <p>¿El tercer objetivo específico es correcto? Por favor seleccione si Cumple o No cumple.</p>
                                <Switch onMessage="Cumple" offMessage="No cumple" disabled={isSuperAdmin ? undefined : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : undefined} bind:checked={$formServicioTecnologicoEvaluacion.tercer_objetivo_requiere_comentario} />
                                {#if $formServicioTecnologicoEvaluacion.tercer_objetivo_requiere_comentario == false}
                                    <Textarea
                                        disabled={isSuperAdmin ? undefined : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : undefined}
                                        label="Comentario"
                                        className="mt-4"
                                        maxlength="40000"
                                        id="tercer_objetivo_comentario"
                                        bind:value={$formServicioTecnologicoEvaluacion.tercer_objetivo_comentario}
                                        error={errors.tercer_objetivo_comentario}
                                        required
                                    />
                                {/if}
                            </div>
                        {:else if j == 3}
                            <hr className="mt-10 mb-10 border-app-300" />

                            <h1 className="text-black">Cuardo objetivo específico</h1>
                            <Label className="mt-4 mb-4" labelFor="cuarto_objetivo_puntaje" value="Puntaje (Máximo {(8 / proyecto.cantidad_objetivos).toFixed(2)})" />

                            <Input
                                disabled={isSuperAdmin ? undefined : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : undefined}
                                label="Puntaje"
                                id="cuarto_objetivo_puntaje"
                                type="number"
                                input$step="0.1"
                                input$min="0"
                                input$max={(8 / proyecto.cantidad_objetivos).toFixed(2)}
                                className="mt-1"
                                bind:value={$formServicioTecnologicoEvaluacion.cuarto_objetivo_puntaje}
                                placeholder="Puntaje"
                                autocomplete="off"
                                error={errors.cuarto_objetivo_puntaje}
                            />

                            <div className="mt-4">
                                <p>¿El cuarto objetivo específico es correcto? Por favor seleccione si Cumple o No cumple.</p>
                                <Switch onMessage="Cumple" offMessage="No cumple" disabled={isSuperAdmin ? undefined : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : undefined} bind:checked={$formServicioTecnologicoEvaluacion.cuarto_objetivo_requiere_comentario} />
                                {#if $formServicioTecnologicoEvaluacion.cuarto_objetivo_requiere_comentario == false}
                                    <Textarea
                                        disabled={isSuperAdmin ? undefined : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : undefined}
                                        label="Comentario"
                                        className="mt-4"
                                        maxlength="40000"
                                        id="cuarto_objetivo_comentario"
                                        bind:value={$formServicioTecnologicoEvaluacion.cuarto_objetivo_comentario}
                                        error={errors.cuarto_objetivo_comentario}
                                        required
                                    />
                                {/if}
                            </div>
                        {/if}
                    {/each}

                    <hr className="mt-10 mb-10 border-app-300" />
                    <h1 className="text-2xl text-center mb-10">Resultados</h1>

                    <h1>Criterios de evaluacion</h1>
                    <ul className="list-disc p-4">
                        <li>
                            <strong>Puntaje: 0 a {proyecto.cantidad_objetivos > 0 ? (10 / proyecto.cantidad_objetivos).toFixed(2) : 0}</strong> Se debe evidenciar que los resultados son directos, medibles y cuantificables que se alcanzarán con el desarrollo de cada uno de los objetivos específicos del proyecto.
                            <br />
                            Nota: Los resultados son, en contraste, intangibles, tales como conocimientos y habilidades nuevas, compromisos adquiridos, etc.
                        </li>
                    </ul>
                    {#if proyecto.cantidad_objetivos == 0}
                        <InfoMessage className="mt-10" alertMsg={true}>Este proyecto no tiene objetivos específicos generados. No se puede evaluar</InfoMessage>
                    {/if}
                    {#each { length: proyecto.cantidad_objetivos } as _empty, j}
                        {#if j == 0}
                            <h1 className="text-black">Resultados del primer objetivo específico</h1>

                            <Label className="mt-4 mb-4" labelFor="resultados_primer_obj_puntaje" value="Puntaje (Máximo {(10 / proyecto.cantidad_objetivos).toFixed(2)})" />
                            <Input
                                disabled={isSuperAdmin ? undefined : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : undefined}
                                label="Puntaje"
                                id="resultados_primer_obj_puntaje"
                                type="number"
                                input$step="0.1"
                                input$min="0"
                                input$max={(10 / proyecto.cantidad_objetivos).toFixed(2)}
                                className="mt-1"
                                bind:value={$formServicioTecnologicoEvaluacion.resultados_primer_obj_puntaje}
                                placeholder="Puntaje"
                                autocomplete="off"
                                error={errors.resultados_primer_obj_puntaje}
                            />

                            <div className="mt-4">
                                <p>¿Los resultados del primer objetivo específico son correctos? Por favor seleccione si Cumple o No cumple.</p>
                                <Switch onMessage="Cumple" offMessage="No cumple" disabled={isSuperAdmin ? undefined : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : undefined} bind:checked={$formServicioTecnologicoEvaluacion.resultados_primer_obj_requiere_comentario} />
                                {#if $formServicioTecnologicoEvaluacion.resultados_primer_obj_requiere_comentario == false}
                                    <Textarea
                                        disabled={isSuperAdmin ? undefined : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : undefined}
                                        label="Comentario"
                                        className="mt-4"
                                        maxlength="40000"
                                        id="resultados_primer_obj_comentario"
                                        bind:value={$formServicioTecnologicoEvaluacion.resultados_primer_obj_comentario}
                                        error={errors.resultados_primer_obj_comentario}
                                        required
                                    />
                                {/if}
                            </div>
                        {:else if j == 1}
                            <hr className="mt-10 mb-10 border-app-300" />

                            <h1 className="text-black">Resultados del segundo objetivo específico</h1>

                            <Label className="mt-4 mb-4" labelFor="resultados_segundo_obj_puntaje" value="Puntaje (Máximo {(10 / proyecto.cantidad_objetivos).toFixed(2)})" />
                            <Input
                                disabled={isSuperAdmin ? undefined : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : undefined}
                                label="Puntaje"
                                id="resultados_segundo_obj_puntaje"
                                type="number"
                                input$step="0.1"
                                input$min="0"
                                input$max={(10 / proyecto.cantidad_objetivos).toFixed(2)}
                                className="mt-1"
                                bind:value={$formServicioTecnologicoEvaluacion.resultados_segundo_obj_puntaje}
                                placeholder="Puntaje"
                                autocomplete="off"
                                error={errors.resultados_segundo_obj_puntaje}
                            />

                            <div className="mt-4">
                                <p>¿Los resultados del segundo objetivo específico son correctos? Por favor seleccione si Cumple o No cumple.</p>
                                <Switch onMessage="Cumple" offMessage="No cumple" disabled={isSuperAdmin ? undefined : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : undefined} bind:checked={$formServicioTecnologicoEvaluacion.resultados_segundo_obj_requiere_comentario} />
                                {#if $formServicioTecnologicoEvaluacion.resultados_segundo_obj_requiere_comentario == false}
                                    <Textarea
                                        disabled={isSuperAdmin ? undefined : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : undefined}
                                        label="Comentario"
                                        className="mt-4"
                                        maxlength="40000"
                                        id="resultados_segundo_obj_comentario"
                                        bind:value={$formServicioTecnologicoEvaluacion.resultados_segundo_obj_comentario}
                                        error={errors.resultados_segundo_obj_comentario}
                                        required
                                    />
                                {/if}
                            </div>
                        {:else if j == 2}
                            <hr className="mt-10 mb-10 border-app-300" />

                            <h1 className="text-black">Resultados del tercer objetivo específico</h1>

                            <Label className="mt-4 mb-4" labelFor="resultados_tercer_obj_puntaje" value="Puntaje (Máximo {(10 / proyecto.cantidad_objetivos).toFixed(2)})" />
                            <Input
                                disabled={isSuperAdmin ? undefined : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : undefined}
                                label="Puntaje"
                                id="resultados_tercer_obj_puntaje"
                                type="number"
                                input$step="0.1"
                                input$min="0"
                                input$max={(10 / proyecto.cantidad_objetivos).toFixed(2)}
                                className="mt-1"
                                bind:value={$formServicioTecnologicoEvaluacion.resultados_tercer_obj_puntaje}
                                placeholder="Puntaje"
                                autocomplete="off"
                                error={errors.resultados_tercer_obj_puntaje}
                            />

                            <div className="mt-4">
                                <p>¿Los resultados del tercer objetivo específico son correctos? Por favor seleccione si Cumple o No cumple.</p>
                                <Switch onMessage="Cumple" offMessage="No cumple" disabled={isSuperAdmin ? undefined : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : undefined} bind:checked={$formServicioTecnologicoEvaluacion.resultados_tercer_obj_requiere_comentario} />
                                {#if $formServicioTecnologicoEvaluacion.resultados_tercer_obj_requiere_comentario == false}
                                    <Textarea
                                        disabled={isSuperAdmin ? undefined : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : undefined}
                                        label="Comentario"
                                        className="mt-4"
                                        maxlength="40000"
                                        id="resultados_tercer_obj_comentario"
                                        bind:value={$formServicioTecnologicoEvaluacion.resultados_tercer_obj_comentario}
                                        error={errors.resultados_tercer_obj_comentario}
                                        required
                                    />
                                {/if}
                            </div>
                        {:else if j == 3}
                            <hr className="mt-10 mb-10 border-app-300" />

                            <h1 className="text-black">Resultados del cuarto objetivo específico</h1>

                            <Label className="mt-4 mb-4" labelFor="resultados_cuarto_obj_puntaje" value="Puntaje (Máximo {(10 / proyecto.cantidad_objetivos).toFixed(2)})" />
                            <Input
                                disabled={isSuperAdmin ? undefined : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : undefined}
                                label="Puntaje"
                                id="resultados_cuarto_obj_puntaje"
                                type="number"
                                input$step="0.1"
                                input$min="0"
                                input$max={(10 / proyecto.cantidad_objetivos).toFixed(2)}
                                className="mt-1"
                                bind:value={$formServicioTecnologicoEvaluacion.resultados_cuarto_obj_puntaje}
                                placeholder="Puntaje"
                                autocomplete="off"
                                error={errors.resultados_cuarto_obj_puntaje}
                            />

                            <div className="mt-4">
                                <p>¿Los resultados del cuarto objetivo específico son correctos? Por favor seleccione si Cumple o No cumple.</p>
                                <Switch onMessage="Cumple" offMessage="No cumple" disabled={isSuperAdmin ? undefined : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : undefined} bind:checked={$formServicioTecnologicoEvaluacion.resultados_cuarto_obj_requiere_comentario} />
                                {#if $formServicioTecnologicoEvaluacion.resultados_cuarto_obj_requiere_comentario == false}
                                    <Textarea
                                        disabled={isSuperAdmin ? undefined : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : undefined}
                                        label="Comentario"
                                        className="mt-4"
                                        maxlength="40000"
                                        id="resultados_cuarto_obj_comentario"
                                        bind:value={$formServicioTecnologicoEvaluacion.resultados_cuarto_obj_comentario}
                                        error={errors.resultados_cuarto_obj_comentario}
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
    {:else if proyecto.codigo_linea_programatica == 69}
        <hr className="mt-10 mb-10" />

        <h1 className="text-3xl mt-24 mb-8 text-center" id="evaluacion">Evaluación</h1>
        <div className="mt-16">
            <form on:submit|preventDefault={submitTpEvaluacion}>
                <InfoMessage>
                    <div className="mt-4">
                        <p>¿El árbol de objetivos es correcto? Por favor seleccione si Cumple o No cumple.</p>
                        <Switch onMessage="Cumple" offMessage="No cumple" disabled={isSuperAdmin ? undefined : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : undefined} bind:checked={$formTpEvaluacion.arbol_objetivos_requiere_comentario} />
                        {#if $formTpEvaluacion.arbol_objetivos_requiere_comentario == false}
                            <Textarea disabled={isSuperAdmin ? undefined : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : undefined} label="Comentario" className="mt-4" maxlength="40000" id="arbol_objetivos_comentario" bind:value={$formTpEvaluacion.arbol_objetivos_comentario} error={errors.arbol_objetivos_comentario} required />
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
