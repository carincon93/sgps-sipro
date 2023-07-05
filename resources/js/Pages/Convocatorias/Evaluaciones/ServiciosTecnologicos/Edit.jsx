<script>
    import AuthenticatedLayout, { title } from '@/Layouts/Authenticated'
    import { useForm, page } from '@inertiajs/inertia-svelte'
    import { route, checkRole, checkPermission, monthDiff } from '@/Utils'
    import { _ } from 'svelte-i18n'

    import Button from '@/Components/Button'
    import Input from '@/Components/Input'
    import Label from '@/Components/Label'
    import PrimaryButton from '@/Components/PrimaryButton'
    import EvaluationStepper from '@/Components/EvaluationStepper'
    import Textarea from '@/Components/Textarea'
    import InfoMessage from '@/Components/InfoMessage'
    import Dialog from '@/Components/Dialog'
    import Switch from '@/Components/Switch'

    import STForm from '../../Proyectos/ServiciosTecnologicos/STForm'

    export let errors
    export let convocatoria
    export let servicioTecnologico
    export let servicioTecnologicoEvaluacion
    export let sectoresProductivos
    export let estadosSistemaGestion
    export let tiposProyectoSt
    export let lineasProgramaticas
    export let proyectoProgramasFormacion
    export let programasFormacionConRegistroCalificado
    // export let programasFormacionConRegistroRelacionados

    $: $title = servicioTecnologico ? servicioTecnologico.titulo : null

    /**
     * Validar si el usuario autenticado es SuperAdmin
     */
    let authUser = auth.user
    let isSuperAdmin = checkRole(authUser, [1])

    let dialogSegundaEvaluacion = convocatoria.fase == 4 ? true : false
    let proyectoDialogOpen = servicioTecnologicoEvaluacion.evaluacion.clausula_confidencialidad == false ? true : false

    let servicioTecnologicoInfo = useForm({
        tipo_proyecto_st_id: servicioTecnologico.tipo_proyecto_st_id,
        linea_programatica_id: servicioTecnologico.proyecto?.linea_programatica_id,
        titulo: servicioTecnologico.titulo,
        fecha_inicio: servicioTecnologico.fecha_inicio,
        fecha_finalizacion: servicioTecnologico.fecha_finalizacion,
        max_meses_ejecucion: servicioTecnologico.max_meses_ejecucion,
        pregunta_formulacion_problema: servicioTecnologico.pregunta_formulacion_problema,

        programas_formacion: proyectoProgramasFormacion.length > 0 ? proyectoProgramasFormacion : null,

        estado_sistema_gestion_id: servicioTecnologico.estado_sistema_gestion_id,
        sector_productivo: servicioTecnologico.sector_productivo,

        resumen: servicioTecnologico.resumen,
        antecedentes: servicioTecnologico.antecedentes,
        identificacion_problema: servicioTecnologico.identificacion_problema,
        justificacion_problema: servicioTecnologico.justificacion_problema,
        bibliografia: servicioTecnologico.bibliografia,
        zona_influencia: servicioTecnologico.zona_influencia,
        nombre_area_tecnica: servicioTecnologico.nombre_area_tecnica,

        resumen: servicioTecnologico.resumen,
        antecedentes: servicioTecnologico.antecedentes,
        identificacion_problema: servicioTecnologico.identificacion_problema,
        justificacion_problema: servicioTecnologico.justificacion_problema,
        bibliografia: servicioTecnologico.bibliografia,
    })

    let form = useForm({
        clausula_confidencialidad: servicioTecnologicoEvaluacion.evaluacion.clausula_confidencialidad,

        fechas_requiere_comentario: servicioTecnologicoEvaluacion.fecha_ejecucion_comentario == null ? true : false,
        fecha_ejecucion_comentario: servicioTecnologicoEvaluacion.fecha_ejecucion_comentario,

        titulo_puntaje: servicioTecnologicoEvaluacion.titulo_puntaje,
        titulo_comentario: servicioTecnologicoEvaluacion.titulo_comentario,
        titulo_requiere_comentario: servicioTecnologicoEvaluacion.titulo_comentario == null ? true : false,

        resumen_puntaje: servicioTecnologicoEvaluacion.resumen_puntaje,
        resumen_comentario: servicioTecnologicoEvaluacion.resumen_comentario,
        resumen_requiere_comentario: servicioTecnologicoEvaluacion.resumen_comentario == null ? true : false,

        antecedentes_puntaje: servicioTecnologicoEvaluacion.antecedentes_puntaje,
        antecedentes_comentario: servicioTecnologicoEvaluacion.antecedentes_comentario,
        antecedentes_requiere_comentario: servicioTecnologicoEvaluacion.antecedentes_comentario == null ? true : false,

        identificacion_problema_puntaje: servicioTecnologicoEvaluacion.identificacion_problema_puntaje,
        identificacion_problema_comentario: servicioTecnologicoEvaluacion.identificacion_problema_comentario,
        identificacion_problema_requiere_comentario: servicioTecnologicoEvaluacion.identificacion_problema_comentario == null ? true : false,

        pregunta_formulacion_problema_puntaje: servicioTecnologicoEvaluacion.pregunta_formulacion_problema_puntaje,
        pregunta_formulacion_problema_comentario: servicioTecnologicoEvaluacion.pregunta_formulacion_problema_comentario,
        pregunta_formulacion_problema_requiere_comentario: servicioTecnologicoEvaluacion.pregunta_formulacion_problema_comentario == null ? true : false,

        justificacion_problema_puntaje: servicioTecnologicoEvaluacion.justificacion_problema_puntaje,
        justificacion_problema_comentario: servicioTecnologicoEvaluacion.justificacion_problema_comentario,
        justificacion_problema_requiere_comentario: servicioTecnologicoEvaluacion.justificacion_problema_comentario == null ? true : false,

        bibliografia_requiere_comentario: servicioTecnologicoEvaluacion.bibliografia_comentario == null ? true : false,
        bibliografia_comentario: servicioTecnologicoEvaluacion.bibliografia_comentario,

        ortografia_comentario: servicioTecnologicoEvaluacion.ortografia_comentario,
        ortografia_requiere_comentario: servicioTecnologicoEvaluacion.ortografia_comentario == null ? true : false,
        redaccion_comentario: servicioTecnologicoEvaluacion.redaccion_comentario,
        redaccion_requiere_comentario: servicioTecnologicoEvaluacion.redaccion_comentario == null ? true : false,
        normas_apa_comentario: servicioTecnologicoEvaluacion.normas_apa_comentario,
        normas_apa_requiere_comentario: servicioTecnologicoEvaluacion.normas_apa_comentario == null ? true : false,
    })

    function submit() {
        if (isSuperAdmin || (checkRole(authUser, [11, 5]) && servicioTecnologicoEvaluacion.evaluacion.finalizado == false && servicioTecnologicoEvaluacion.evaluacion.habilitado == true && servicioTecnologicoEvaluacion.evaluacion.modificable == true)) {
            $form.put(route('convocatorias.servicios-tecnologicos-evaluaciones.update', [convocatoria.id, servicioTecnologicoEvaluacion.id]), {
                preserveScroll: true,
            })
        }
    }

    $: if (servicioTecnologicoInfo.fecha_inicio && servicioTecnologicoInfo.fecha_finalizacion) {
        servicioTecnologicoInfo.max_meses_ejecucion = monthDiff(servicioTecnologicoInfo.fecha_inicio, servicioTecnologicoInfo.fecha_finalizacion)
    }
</script>

<AuthenticatedLayout>
    <header className="pt-[8rem]" slot="header">
        <EvaluationStepper {convocatoria} evaluacion={servicioTecnologicoEvaluacion.evaluacion} proyecto={servicioTecnologico.proyecto} />
    </header>

    <form on:submit|preventDefault={submit}>
        <STForm form={servicioTecnologicoInfo} {isSuperAdmin} {errors} {convocatoria} {servicioTecnologico} {lineasProgramaticas} {tiposProyectoSt} {sectoresProductivos} {estadosSistemaGestion} {programasFormacionConRegistroCalificado} evaluacion={servicioTecnologicoEvaluacion.evaluacion}>
            <div slot="titulo">
                <InfoMessage>
                    <h1>Criterios de evaluacion</h1>
                    <ul className="list-disc p-4">
                        <li>
                            <strong>Puntaje: 0 a 4</strong> Debe corresponder al contenido del proyecto y responder a los siguientes interrogantes: ¿Qué se va a hacer?, ¿Sobre qué o quiénes se hará?, ¿Cómo?, ¿Dónde se llevará a cabo? Tiene que estar escrito de manera breve y concisa. Un buen título describe con exactitud y usando el menor número posible de palabras el tema central del proyecto.

                            <br />
                            Nota: las respuestas a las preguntas anteriormente formuladas no necesariamente deben responderse en mismo orden en el que aparecen. (Máximo 40 palabras)
                        </li>
                    </ul>
                    <Label className="mt-4 mb-4" labelFor="titulo_puntaje" value="Puntaje (Máximo 4)" />
                    <Input
                        disabled={isSuperAdmin ? undefined : servicioTecnologicoEvaluacion.evaluacion.finalizado == true || servicioTecnologicoEvaluacion.evaluacion.habilitado == false || servicioTecnologicoEvaluacion.evaluacion.modificable == false ? true : undefined}
                        label="Puntaje"
                        id="titulo_puntaje"
                        type="number"
                        input$min="0"
                        input$max="4"
                        className="mt-1"
                        bind:value={$form.titulo_puntaje}
                        placeholder="Puntaje"
                        autocomplete="off"
                        error={errors.titulo_puntaje}
                    />

                    <div className="mt-4">
                        <p>¿El título es correcto? Por favor seleccione si Cumple o No cumple.</p>
                        <Switch onMessage="Cumple" offMessage="No cumple" disabled={isSuperAdmin ? undefined : servicioTecnologicoEvaluacion.evaluacion.finalizado == true || servicioTecnologicoEvaluacion.evaluacion.habilitado == false || servicioTecnologicoEvaluacion.evaluacion.modificable == false ? true : undefined} bind:checked={$form.titulo_requiere_comentario} />
                        {#if $form.titulo_requiere_comentario == false}
                            <Textarea
                                disabled={isSuperAdmin ? undefined : servicioTecnologicoEvaluacion.evaluacion.finalizado == true || servicioTecnologicoEvaluacion.evaluacion.habilitado == false || servicioTecnologicoEvaluacion.evaluacion.modificable == false ? true : undefined}
                                label="Comentario"
                                className="mt-4"
                                maxlength="40000"
                                id="titulo_comentario"
                                bind:value={$form.titulo_comentario}
                                error={errors.titulo_comentario}
                                required
                            />
                        {/if}
                    </div>
                </InfoMessage>
            </div>

            <div slot="fechas">
                <InfoMessage>
                    <div className="mt-4">
                        <p>¿Las fechas son correctas? Por favor seleccione si Cumple o No cumple</p>
                        <Switch onMessage="Cumple" offMessage="No cumple" disabled={isSuperAdmin ? undefined : servicioTecnologicoEvaluacion.evaluacion.finalizado == true || servicioTecnologicoEvaluacion.evaluacion.habilitado == false || servicioTecnologicoEvaluacion.evaluacion.modificable == false ? true : undefined} bind:checked={$form.fechas_requiere_comentario} />
                        {#if $form.fechas_requiere_comentario == false}
                            <Textarea
                                disabled={isSuperAdmin ? undefined : servicioTecnologicoEvaluacion.evaluacion.finalizado == true || servicioTecnologicoEvaluacion.evaluacion.habilitado == false || servicioTecnologicoEvaluacion.evaluacion.modificable == false ? true : undefined}
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

            <div slot="resumen">
                <InfoMessage>
                    <h1>Criterios de evaluacion</h1>
                    <ul className="list-disc p-4">
                        <li>
                            <strong>Puntaje: 0 a 3</strong> Información necesaria para darle al lector una idea precisa de la pertinencia y calidad proyecto. Explique en qué consiste el problema o necesidad, cómo cree que lo resolverá, cuáles son las razones que justifican su ejecución y las herramientas que se utilizarán en el desarrollo del proyecto. Nota: El resumen por lo general se construye al
                            final de la contextualización con el fin de tener claros todos los puntos que intervinieron en la misma y poder dar a conocer de forma más pertinente los por menores del proyecto. (Máximo 1000 caracteres).
                        </li>
                    </ul>
                    <Label className="mt-4 mb-4" labelFor="resumen_puntaje" value="Puntaje (Máximo 3)" />
                    <Input
                        disabled={isSuperAdmin ? undefined : servicioTecnologicoEvaluacion.evaluacion.finalizado == true || servicioTecnologicoEvaluacion.evaluacion.habilitado == false || servicioTecnologicoEvaluacion.evaluacion.modificable == false ? true : undefined}
                        label="Puntaje"
                        id="resumen_puntaje"
                        type="number"
                        input$min="0"
                        input$max="3"
                        className="mt-1"
                        bind:value={$form.resumen_puntaje}
                        placeholder="Puntaje"
                        autocomplete="off"
                        error={errors.resumen_puntaje}
                    />

                    <div className="mt-4">
                        <p>¿El resumen es correcto? Por favor seleccione si Cumple o No cumple.</p>
                        <Switch onMessage="Cumple" offMessage="No cumple" disabled={isSuperAdmin ? undefined : servicioTecnologicoEvaluacion.evaluacion.finalizado == true || servicioTecnologicoEvaluacion.evaluacion.habilitado == false || servicioTecnologicoEvaluacion.evaluacion.modificable == false ? true : undefined} bind:checked={$form.resumen_requiere_comentario} />
                        {#if $form.resumen_requiere_comentario == false}
                            <Textarea
                                disabled={isSuperAdmin ? undefined : servicioTecnologicoEvaluacion.evaluacion.finalizado == true || servicioTecnologicoEvaluacion.evaluacion.habilitado == false || servicioTecnologicoEvaluacion.evaluacion.modificable == false ? true : undefined}
                                label="Comentario"
                                className="mt-4"
                                maxlength="40000"
                                id="resumen_comentario"
                                bind:value={$form.resumen_comentario}
                                error={errors.resumen_comentario}
                                required
                            />
                        {/if}
                    </div>
                </InfoMessage>
            </div>

            <div slot="antecedentes">
                <InfoMessage>
                    <h1>Criterios de evaluacion</h1>
                    <ul className="list-disc p-4">
                        <li>
                            <strong>Puntaje: 0 a 3</strong> Se debe evidenciar la identificación y caracterización del mercado potencial/objetivo, nicho de mercado al cual se busca atender o la necesidad que se busca satisfacer tomando como referencia el estudio del sector, identificando si existen el(los) mismo(s) alcance(s) o similar(es) en la empresa privada o pública u otros centros de formación
                            de tal forma que el proyecto no se convierta en una competencia frente a un servicio/producto ofertado. Se debe registrar el análisis de las tendencias del mercado, en relación con clientes potenciales, competidores y proveedores. En este ítem es necesario valorar las necesidades de los clientes actuales o potenciales y precisar la segmentación del mercado, las tendencias
                            de los precios y las gestiones comerciales a realizadas Nota: La información debe ser de fuentes primarias, ejemplo: Secretarías, DANE, Artículos científicos, entre otros y citarla utilizando normas APA séptima edición. (Máximo 10000 caracteres).
                        </li>
                    </ul>
                    <Label className="mt-4 mb-4" labelFor="antecedentes_puntaje" value="Puntaje (Máximo 3)" />
                    <Input
                        disabled={isSuperAdmin ? undefined : servicioTecnologicoEvaluacion.evaluacion.finalizado == true || servicioTecnologicoEvaluacion.evaluacion.habilitado == false || servicioTecnologicoEvaluacion.evaluacion.modificable == false ? true : undefined}
                        label="Puntaje"
                        id="antecedentes_puntaje"
                        type="number"
                        input$min="0"
                        input$max="3"
                        className="mt-1"
                        bind:value={$form.antecedentes_puntaje}
                        placeholder="Puntaje"
                        autocomplete="off"
                        error={errors.antecedentes_puntaje}
                    />

                    <div className="mt-4">
                        <p>¿Los antecedentes son correctos? Por favor seleccione si Cumple o No cumple.</p>
                        <Switch onMessage="Cumple" offMessage="No cumple" disabled={isSuperAdmin ? undefined : servicioTecnologicoEvaluacion.evaluacion.finalizado == true || servicioTecnologicoEvaluacion.evaluacion.habilitado == false || servicioTecnologicoEvaluacion.evaluacion.modificable == false ? true : undefined} bind:checked={$form.antecedentes_requiere_comentario} />
                        {#if $form.antecedentes_requiere_comentario == false}
                            <Textarea
                                disabled={isSuperAdmin ? undefined : servicioTecnologicoEvaluacion.evaluacion.finalizado == true || servicioTecnologicoEvaluacion.evaluacion.habilitado == false || servicioTecnologicoEvaluacion.evaluacion.modificable == false ? true : undefined}
                                label="Comentario"
                                className="mt-4"
                                maxlength="40000"
                                id="antecedentes_comentario"
                                bind:value={$form.antecedentes_comentario}
                                error={errors.antecedentes_comentario}
                                required
                            />
                        {/if}
                    </div>
                </InfoMessage>
            </div>

            <div slot="problema">
                <InfoMessage>
                    <h1>Criterios de evaluacion</h1>
                    <ul className="list-disc p-4">
                        <li>
                            <strong>Puntaje: 0 a 4</strong> Se debe evidenciar la descripción de la realidad objeto de estudio. Luego de identificar el problema central y de haber separado las causas que lo generan de los efectos que produce, se procede a describirlo concretamente, partiendo de lo general a lo específico (a nivel mundial, a nivel nacional, a nivel regional) alineados con los objetivos
                            de desarrollo sostenible, los documentos CONPES (Consejo Nacional de Política económica y social) que le aplique(n), las agendas departamentales de competitividad e innovación y considerando la situación actual. Se deben referenciar los datos estadísticos entre otros datos relevantes. Nota: La información debe ser de fuentes primarias, ejemplo: Secretarías, DANE, Artículos
                            científicos, entre otros, y citarla utilizando normas APA sexta edición. Evite adjetivos que impliquen juicios de valor tales como: bueno, malo, mejor, peor. (Máximo 5000 caracteres)
                        </li>
                    </ul>
                    <Label className="mt-4 mb-4" labelFor="identificacion_problema_puntaje" value="Puntaje (Máximo 4)" />
                    <Input
                        disabled={isSuperAdmin ? undefined : servicioTecnologicoEvaluacion.evaluacion.finalizado == true || servicioTecnologicoEvaluacion.evaluacion.habilitado == false || servicioTecnologicoEvaluacion.evaluacion.modificable == false ? true : undefined}
                        label="Puntaje"
                        id="identificacion_problema_puntaje"
                        type="number"
                        input$min="0"
                        input$max="4"
                        className="mt-1"
                        bind:value={$form.identificacion_problema_puntaje}
                        placeholder="Puntaje"
                        autocomplete="off"
                        error={errors.identificacion_problema_puntaje}
                    />

                    <div className="mt-4">
                        <p>¿La identificación del problema es correcta? Por favor seleccione si Cumple o No cumple.</p>
                        <Switch onMessage="Cumple" offMessage="No cumple" disabled={isSuperAdmin ? undefined : servicioTecnologicoEvaluacion.evaluacion.finalizado == true || servicioTecnologicoEvaluacion.evaluacion.habilitado == false || servicioTecnologicoEvaluacion.evaluacion.modificable == false ? true : undefined} bind:checked={$form.identificacion_problema_requiere_comentario} />
                        {#if $form.identificacion_problema_requiere_comentario == false}
                            <Textarea
                                disabled={isSuperAdmin ? undefined : servicioTecnologicoEvaluacion.evaluacion.finalizado == true || servicioTecnologicoEvaluacion.evaluacion.habilitado == false || servicioTecnologicoEvaluacion.evaluacion.modificable == false ? true : undefined}
                                label="Comentario"
                                className="mt-4"
                                maxlength="40000"
                                id="identificacion_problema_comentario"
                                bind:value={$form.identificacion_problema_comentario}
                                error={errors.identificacion_problema_comentario}
                                required
                            />
                        {/if}
                    </div>
                </InfoMessage>
            </div>

            <div slot="pregunta-formulacion">
                <InfoMessage>
                    <h1>Criterios de evaluacion</h1>
                    <ul className="list-disc p-4">
                        <li>
                            <p><strong>Puntaje: 0 a 2</strong> Se debe verificar que la pregunta del problema defina con exactitud ¿cuál es el problema para resolver, investigar o intervenir?</p>
                            La pregunta debe cumplir las siguientes condiciones:
                            <ul>
                                <li>• Guardar estrecha correspondencia con el título del proyecto.</li>
                                <li>• Evitar adjetivos que impliquen juicios de valor tales como: bueno, malo, mejor, peor.</li>
                                <li>• No debe dar origen a respuestas tales como si o no.</li>
                            </ul>
                            <br />
                            <strong>Máximo 50 palabras</strong>
                        </li>
                    </ul>
                    <Label className="mt-4 mb-4" labelFor="pregunta_formulacion_problema_puntaje" value="Puntaje (Máximo 2)" />
                    <Input
                        disabled={isSuperAdmin ? undefined : servicioTecnologicoEvaluacion.evaluacion.finalizado == true || servicioTecnologicoEvaluacion.evaluacion.habilitado == false || servicioTecnologicoEvaluacion.evaluacion.modificable == false ? true : undefined}
                        label="Puntaje"
                        id="pregunta_formulacion_problema_puntaje"
                        type="number"
                        input$min="0"
                        input$max="2"
                        className="mt-1"
                        bind:value={$form.pregunta_formulacion_problema_puntaje}
                        placeholder="Puntaje"
                        autocomplete="off"
                        error={errors.pregunta_formulacion_problema_puntaje}
                    />

                    <div className="mt-4">
                        <p>¿La pregunta de formulación del problema es correcta? Por favor seleccione si Cumple o No cumple.</p>
                        <Switch onMessage="Cumple" offMessage="No cumple" disabled={isSuperAdmin ? undefined : servicioTecnologicoEvaluacion.evaluacion.finalizado == true || servicioTecnologicoEvaluacion.evaluacion.habilitado == false || servicioTecnologicoEvaluacion.evaluacion.modificable == false ? true : undefined} bind:checked={$form.pregunta_formulacion_problema_requiere_comentario} />
                        {#if $form.pregunta_formulacion_problema_requiere_comentario == false}
                            <Textarea
                                disabled={isSuperAdmin ? undefined : servicioTecnologicoEvaluacion.evaluacion.finalizado == true || servicioTecnologicoEvaluacion.evaluacion.habilitado == false || servicioTecnologicoEvaluacion.evaluacion.modificable == false ? true : undefined}
                                label="Comentario"
                                className="mt-4"
                                maxlength="40000"
                                id="pregunta_formulacion_problema_comentario"
                                bind:value={$form.pregunta_formulacion_problema_comentario}
                                error={errors.pregunta_formulacion_problema_comentario}
                                required
                            />
                        {/if}
                    </div>
                </InfoMessage>
            </div>

            <div slot="justificacion">
                <InfoMessage>
                    <h1>Criterios de evaluacion</h1>
                    <p><strong>Puntaje: 0 a 4</strong></p>
                    <ul className="list-disc p-4">
                        <p>La justificación debe describir la solución del problema y debe responder a las siguientes preguntas:</p>
                        <li>• ¿Cómo se relaciona el proyecto con las prioridades de la región y del país?</li>
                        <li>• ¿Qué resultados se lograrán?</li>
                        <li>• ¿Cuál es la finalidad con los resultados esperados?</li>
                        <li>• ¿Cómo se utilizarán los resultados y quiénes serán los beneficiarios?</li>
                        <li>• Debe incluir el impacto a la formación, al sector productivo y a la política nacional de ciencia, tecnología e innovación.</li>
                        <li>
                            <strong>Nota:</strong> La justificación debe brindar un argumento convincente de los resultados del proyecto generado y de su aplicabilidad.
                        </li>
                    </ul>
                    <Label className="mt-4 mb-4" labelFor="justificacion_problema_puntaje" value="Puntaje (Máximo 4)" />
                    <Input
                        disabled={isSuperAdmin ? undefined : servicioTecnologicoEvaluacion.evaluacion.finalizado == true || servicioTecnologicoEvaluacion.evaluacion.habilitado == false || servicioTecnologicoEvaluacion.evaluacion.modificable == false ? true : undefined}
                        label="Puntaje"
                        id="justificacion_problema_puntaje"
                        type="number"
                        input$min="0"
                        input$max="4"
                        className="mt-1"
                        bind:value={$form.justificacion_problema_puntaje}
                        placeholder="Puntaje"
                        autocomplete="off"
                        error={errors.justificacion_problema_puntaje}
                    />

                    <div className="mt-4">
                        <p>¿La justificación del problema es correcta? Por favor seleccione si Cumple o No cumple.</p>
                        <Switch onMessage="Cumple" offMessage="No cumple" disabled={isSuperAdmin ? undefined : servicioTecnologicoEvaluacion.evaluacion.finalizado == true || servicioTecnologicoEvaluacion.evaluacion.habilitado == false || servicioTecnologicoEvaluacion.evaluacion.modificable == false ? true : undefined} bind:checked={$form.justificacion_problema_requiere_comentario} />
                        {#if $form.justificacion_problema_requiere_comentario == false}
                            <Textarea
                                disabled={isSuperAdmin ? undefined : servicioTecnologicoEvaluacion.evaluacion.finalizado == true || servicioTecnologicoEvaluacion.evaluacion.habilitado == false || servicioTecnologicoEvaluacion.evaluacion.modificable == false ? true : undefined}
                                label="Comentario"
                                className="mt-4"
                                maxlength="40000"
                                id="justificacion_problema_comentario"
                                bind:value={$form.justificacion_problema_comentario}
                                error={errors.justificacion_problema_comentario}
                                required
                            />
                        {/if}
                    </div>
                </InfoMessage>
            </div>

            <div slot="bibliografia">
                <InfoMessage>
                    <div className="mt-4">
                        <p>¿La bibliografía es correcta? Por favor seleccione si Cumple o No cumple.</p>
                        <Switch onMessage="Cumple" offMessage="No cumple" disabled={isSuperAdmin ? undefined : servicioTecnologicoEvaluacion.evaluacion.finalizado == true || servicioTecnologicoEvaluacion.evaluacion.habilitado == false || servicioTecnologicoEvaluacion.evaluacion.modificable == false ? true : undefined} bind:checked={$form.bibliografia_requiere_comentario} />
                        {#if $form.bibliografia_requiere_comentario == false}
                            <Textarea
                                disabled={isSuperAdmin ? undefined : servicioTecnologicoEvaluacion.evaluacion.finalizado == true || servicioTecnologicoEvaluacion.evaluacion.habilitado == false || servicioTecnologicoEvaluacion.evaluacion.modificable == false ? true : undefined}
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
                        <Switch onMessage="Cumple" offMessage="No cumple" disabled={isSuperAdmin ? undefined : servicioTecnologicoEvaluacion.evaluacion.finalizado == true || servicioTecnologicoEvaluacion.evaluacion.habilitado == false || servicioTecnologicoEvaluacion.evaluacion.modificable == false ? true : undefined} bind:checked={$form.ortografia_requiere_comentario} />
                        {#if $form.ortografia_requiere_comentario == false}
                            <Textarea
                                disabled={isSuperAdmin ? undefined : servicioTecnologicoEvaluacion.evaluacion.finalizado == true || servicioTecnologicoEvaluacion.evaluacion.habilitado == false || servicioTecnologicoEvaluacion.evaluacion.modificable == false ? true : undefined}
                                label="Comentario"
                                className="mt-4"
                                maxlength="40000"
                                id="ortografia_comentario"
                                bind:value={$form.ortografia_comentario}
                                error={errors.ortografia_comentario}
                                required
                            />
                        {/if}
                    </div>
                </InfoMessage>

                <hr className="mt-10 mb-10" />
                <h1>Redacción</h1>
                <InfoMessage>
                    <div className="mt-4">
                        <p>¿La redacción es correcta? Por favor seleccione si Cumple o No cumple.</p>
                        <Switch onMessage="Cumple" offMessage="No cumple" disabled={isSuperAdmin ? undefined : servicioTecnologicoEvaluacion.evaluacion.finalizado == true || servicioTecnologicoEvaluacion.evaluacion.habilitado == false || servicioTecnologicoEvaluacion.evaluacion.modificable == false ? true : undefined} bind:checked={$form.redaccion_requiere_comentario} />
                        {#if $form.redaccion_requiere_comentario == false}
                            <Textarea
                                disabled={isSuperAdmin ? undefined : servicioTecnologicoEvaluacion.evaluacion.finalizado == true || servicioTecnologicoEvaluacion.evaluacion.habilitado == false || servicioTecnologicoEvaluacion.evaluacion.modificable == false ? true : undefined}
                                label="Comentario"
                                className="mt-4"
                                maxlength="40000"
                                id="redaccioncomentario"
                                bind:value={$form.redaccion_comentario}
                                error={errors.redaccion_comentario}
                            />
                        {/if}
                    </div>
                </InfoMessage>

                <hr className="mt-10 mb-10" />
                <h1>Normas APA</h1>
                <InfoMessage>
                    <div className="mt-4">
                        <p>¿Las normas APA son correctas? Por favor seleccione si Cumple o No cumple.</p>
                        <Switch onMessage="Cumple" offMessage="No cumple" disabled={isSuperAdmin ? undefined : servicioTecnologicoEvaluacion.evaluacion.finalizado == true || servicioTecnologicoEvaluacion.evaluacion.habilitado == false || servicioTecnologicoEvaluacion.evaluacion.modificable == false ? true : undefined} bind:checked={$form.normas_apa_requiere_comentario} />
                        {#if $form.normas_apa_requiere_comentario == false}
                            <Textarea
                                disabled={isSuperAdmin ? undefined : servicioTecnologicoEvaluacion.evaluacion.finalizado == true || servicioTecnologicoEvaluacion.evaluacion.habilitado == false || servicioTecnologicoEvaluacion.evaluacion.modificable == false ? true : undefined}
                                label="Comentario"
                                className="mt-4"
                                maxlength="40000"
                                id="normas_apa_comentario"
                                bind:value={$form.normas_apa_comentario}
                                error={errors.normas_apa_comentario}
                                required
                            />
                        {/if}
                    </div>
                </InfoMessage>
            </div>
        </STForm>

        <div className="flex items-center justify-between mt-14 px-8 py-4">
            {#if isSuperAdmin || (checkRole(authUser, [11, 5]) && servicioTecnologicoEvaluacion.evaluacion.finalizado == false && servicioTecnologicoEvaluacion.evaluacion.habilitado == true && servicioTecnologicoEvaluacion.evaluacion.modificable == true)}
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
            Código del proyecto: {servicioTecnologico.proyecto.codigo}
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
            Código del proyecto: {servicioTecnologico.proyecto.codigo}
        </div>
        <div slot="content">
            <div>
                <h1 className="text-center mt-4 mb-4">Importante</h1>

                <p>Antes de iniciar a la segunda evaluación por favor diríjase a la sección <strong>Comentarios generales</strong> y verifique si el proponente hizo alguna aclaración sobre algún ítem.</p>

                {#if servicioTecnologico.proyecto.pdf_versiones}
                    <hr className="m-10 block" />
                    <h1 className="text-center mt-4 mb-4">Version del proyecto (.pdf)</h1>
                    <p className="mt-4">También revise la versión del proyecto en .pdf para ir verificando los cambios realizados en los diferentes campos.</p>
                    <ul>
                        {#each servicioTecnologico.proyecto.pdf_versiones as version}
                            <li>
                                {#if version.estado == 1}
                                    <a className="text-white underline" href={route('convocatorias.proyectos.version', [convocatoria.id, servicioTecnologico.id, version.version])}> {version.version}.pdf - Descargar</a>
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
