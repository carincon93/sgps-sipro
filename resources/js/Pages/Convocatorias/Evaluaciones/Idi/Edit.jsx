<script>
    import AuthenticatedLayout, { title } from '@/Layouts/Authenticated'
    import { useForm, page } from '@inertiajs/inertia-svelte'
    import { route, checkRole, monthDiff } from '@/Utils'
    import { _ } from 'svelte-i18n'

    import Button from '@/Components/Button'
    import Input from '@/Components/Input'
    import Label from '@/Components/Label'
    import PrimaryButton from '@/Components/PrimaryButton'
    import EvaluationStepper from '@/Components/EvaluationStepper'
    import Textarea from '@/Components/Textarea'
    import Switch from '@/Components/Switch'
    import Dialog from '@/Components/Dialog'
    import InfoMessage from '@/Components/InfoMessage'

    import IdiForm from '../../Proyectos/Idi/IdiForm'

    export let errors
    export let convocatoria
    export let idi
    export let idiEvaluacion
    export let mesasSectoriales
    export let mesasSectorialesRelacionadas
    export let lineasTecnoacademiaRelacionadas
    export let tecnoacademias
    export let tecnoacademia
    export let municipios
    export let opcionesIDiDropdown
    export let proyectoMunicipios
    export let areasConocimiento
    export let subareasConocimiento
    export let disciplinasSubareaConocimiento
    export let lineasProgramaticas
    export let redesConocimiento
    export let actividadesEconomicas
    export let tematicasEstrategicas
    export let gruposInvestigacion
    export let lineasTecnoacademia
    export let lineasInvestigacion
    export let areasTematicasEni
    export let proyectoLineasInvestigacionEni
    export let proyectoAreasTematicasEni
    export let lineasInvestigacionEni
    export let programasFormacionConRegistroCalificado
    export let programasFormacionSinRegistroCalificado
    export let programasFormacionConRegistroRelacionados
    export let programasFormacionSinRegistroRelacionados

    $: $title = idi ? idi.titulo : null

    /**
     * Validar si el usuario autenticado es SuperAdmin
     */
    let authUser = auth.user
    let isSuperAdmin = checkRole(authUser, [1])

    let dialogClausulaConfidencialidad = idiEvaluacion.evaluacion.clausula_confidencialidad == false ? true : false
    let dialogSegundaEvaluacion = convocatoria.fase == 4 ? true : false

    let tieneVideo = idi.video != null
    let requiereJustificacionIndustria4 = idi.justificacion_industria_4 != null
    let requiereJustificacionEconomiaNaranja = idi.justificacion_economia_naranja != null
    let requiereJustificacionPoliticaDiscapacidad = idi.justificacion_politica_discapacidad != null
    let requiereJustificacionAntencionPluralista = idi.atencion_pluralista_diferencial != null
    let requiereJustificacionSectorAgricola = idi.impacto_sector_agricola != null

    let idiInfo = useForm({
        centro_formacion_id: idi.proyecto?.centro_formacion_id,
        linea_investigacion_id: idi.linea_investigacion_id,
        area_conocimiento_id: idi.disciplina_subarea_conocimiento.subarea_conocimiento.area_conocimiento_id,
        subarea_conocimiento_id: idi.disciplina_subarea_conocimiento.subarea_conocimiento_id,
        disciplina_subarea_conocimiento_id: idi.disciplina_subarea_conocimiento_id,
        tematica_estrategica_id: idi.tematica_estrategica_id,
        red_conocimiento_id: idi.red_conocimiento_id,
        linea_programatica_id: idi.proyecto?.linea_programatica_id,
        actividad_economica_id: idi.actividad_economica_id,
        grupo_investigacion_eni_id: { value: idi.grupo_investigacion_eni_id, label: gruposInvestigacion.find((item) => item.value == idi.grupo_investigacion_eni_id)?.label },
        titulo: idi.titulo,
        fecha_inicio: idi.fecha_inicio,
        fecha_finalizacion: idi.fecha_finalizacion,
        max_meses_ejecucion: idi.max_meses_ejecucion,
        video: idi.video,
        numero_aprendices: idi.numero_aprendices,
        municipios: proyectoMunicipios.length > 0 ? proyectoMunicipios : null,
        area_tematica_eni_id: proyectoAreasTematicasEni.length > 0 ? proyectoAreasTematicasEni : null,
        linea_investigacion_eni_id: proyectoLineasInvestigacionEni.length > 0 ? proyectoLineasInvestigacionEni : null,
        programas_formacion: programasFormacionConRegistroRelacionados.length > 0 ? programasFormacionConRegistroRelacionados : null,
        programas_formacion_articulados: programasFormacionSinRegistroRelacionados.length > 0 ? programasFormacionSinRegistroRelacionados : null,
        muestreo: idi.muestreo,
        actividades_muestreo: idi.actividades_muestreo,
        objetivo_muestreo: idi.objetivo_muestreo,
        recoleccion_especimenes: idi.recoleccion_especimenes,
        relacionado_plan_tecnologico: idi.relacionado_plan_tecnologico,
        relacionado_agendas_competitividad: idi.relacionado_agendas_competitividad,
        relacionado_mesas_sectoriales: idi.relacionado_mesas_sectoriales,
        relacionado_tecnoacademia: idi.relacionado_tecnoacademia,
        tecnoacademia_id: tecnoacademia?.id,
        proyecto_investigacion_pedagogica: idi.proyecto_investigacion_pedagogica,
        articulacion_eni: idi.articulacion_eni,
        justificacion_proyecto_investigacion_pedagogica: idi.justificacion_proyecto_investigacion_pedagogica,

        linea_tecnologica_id: lineasTecnoacademiaRelacionadas,
        mesa_sectorial_id: mesasSectorialesRelacionadas,

        resumen: idi.resumen,
        antecedentes: idi.antecedentes,
        marco_conceptual: idi.marco_conceptual,
        justificacion_industria_4: idi.justificacion_industria_4,
        justificacion_economia_naranja: idi.justificacion_economia_naranja,
        justificacion_politica_discapacidad: idi.justificacion_politica_discapacidad,
        atencion_pluralista_diferencial: idi.atencion_pluralista_diferencial,
        impacto_sector_agricola: idi.impacto_sector_agricola,
        bibliografia: idi.bibliografia,
        impacto_municipios: idi.impacto_municipios,
        impacto_centro_formacion: idi.impacto_centro_formacion,
    })

    $: if (idiInfo.fecha_inicio && idiInfo.fecha_finalizacion) {
        idiInfo.max_meses_ejecucion = monthDiff(idiInfo.fecha_inicio, idiInfo.fecha_finalizacion)
    }

    let form = useForm({
        clausula_confidencialidad: idiEvaluacion.evaluacion.clausula_confidencialidad,
        titulo_puntaje: idiEvaluacion.titulo_puntaje,
        titulo_comentario: idiEvaluacion.titulo_comentario,
        titulo_requiere_comentario: idiEvaluacion.titulo_comentario == null ? true : false,
        video_puntaje: idiEvaluacion.video_puntaje,
        video_comentario: idiEvaluacion.video_comentario,
        video_requiere_comentario: idiEvaluacion.video_comentario == null ? true : false,
        resumen_puntaje: idiEvaluacion.resumen_puntaje,
        resumen_comentario: idiEvaluacion.resumen_comentario,
        resumen_requiere_comentario: idiEvaluacion.resumen_comentario == null ? true : false,
        problema_central_puntaje: idiEvaluacion.problema_central_puntaje,
        problema_central_comentario: idiEvaluacion.problema_central_comentario,
        problema_central_requiere_comentario: idiEvaluacion.problema_central_comentario == null ? true : false,
        ortografia_puntaje: idiEvaluacion.ortografia_puntaje,
        ortografia_comentario: idiEvaluacion.ortografia_comentario,
        ortografia_requiere_comentario: idiEvaluacion.ortografia_comentario == null ? true : false,
        redaccion_puntaje: idiEvaluacion.redaccion_puntaje,
        redaccion_comentario: idiEvaluacion.redaccion_comentario,
        redaccion_requiere_comentario: idiEvaluacion.redaccion_comentario == null ? true : false,
        normas_apa_puntaje: idiEvaluacion.normas_apa_puntaje,
        normas_apa_comentario: idiEvaluacion.normas_apa_comentario,
        normas_apa_requiere_comentario: idiEvaluacion.normas_apa_comentario == null ? true : false,

        justificacion_economia_naranja_requiere_comentario: idiEvaluacion.justificacion_economia_naranja_comentario == null ? true : false,
        justificacion_economia_naranja_comentario: idiEvaluacion.justificacion_economia_naranja_comentario,

        justificacion_industria_4_requiere_comentario: idiEvaluacion.justificacion_industria_4_comentario == null ? true : false,
        justificacion_industria_4_comentario: idiEvaluacion.justificacion_industria_4_comentario,

        bibliografia_requiere_comentario: idiEvaluacion.bibliografia_comentario == null ? true : false,
        bibliografia_comentario: idiEvaluacion.bibliografia_comentario,

        fechas_requiere_comentario: idiEvaluacion.fechas_comentario == null ? true : false,
        fechas_comentario: idiEvaluacion.fechas_comentario,

        justificacion_politica_discapacidad_requiere_comentario: idiEvaluacion.justificacion_politica_discapacidad_comentario == null ? true : false,
        justificacion_politica_discapacidad_comentario: idiEvaluacion.justificacion_politica_discapacidad_comentario,

        actividad_economica_requiere_comentario: idiEvaluacion.actividad_economica_comentario == null ? true : false,
        actividad_economica_comentario: idiEvaluacion.actividad_economica_comentario,

        disciplina_subarea_conocimiento_requiere_comentario: idiEvaluacion.disciplina_subarea_conocimiento_comentario == null ? true : false,
        disciplina_subarea_conocimiento_comentario: idiEvaluacion.disciplina_subarea_conocimiento_comentario,

        red_conocimiento_requiere_comentario: idiEvaluacion.red_conocimiento_comentario == null ? true : false,
        red_conocimiento_comentario: idiEvaluacion.red_conocimiento_comentario,

        tematica_estrategica_requiere_comentario: idiEvaluacion.tematica_estrategica_comentario == null ? true : false,
        tematica_estrategica_comentario: idiEvaluacion.tematica_estrategica_comentario,
    })
    function submit() {
        if (idiEvaluacion.evaluacion.allowed.to_update) {
            $form.put(route('convocatorias.idi-evaluaciones.update', [convocatoria.id, idiEvaluacion.id]), {
                preserveScroll: true,
            })
        }
    }
</script>

<AuthenticatedLayout>
    <header className="pt-[8rem]" slot="header">
        <EvaluationStepper {convocatoria} evaluacion={idiEvaluacion.evaluacion} proyecto={idi.proyecto} />
    </header>

    <form on:submit|preventDefault={submit}>
        <IdiForm
            evaluacion={idiEvaluacion.evaluacion}
            {isSuperAdmin}
            {lineasProgramaticas}
            {gruposInvestigacion}
            {mesasSectoriales}
            {tecnoacademia}
            {idi}
            {convocatoria}
            form={idiInfo}
            {errors}
            {redesConocimiento}
            {areasConocimiento}
            {subareasConocimiento}
            {disciplinasSubareaConocimiento}
            {actividadesEconomicas}
            {tematicasEstrategicas}
            {lineasTecnoacademia}
            {lineasInvestigacion}
            {tecnoacademias}
            {municipios}
            {areasTematicasEni}
            {lineasInvestigacionEni}
            {opcionesIDiDropdown}
            {programasFormacionConRegistroCalificado}
            {programasFormacionSinRegistroCalificado}
            {tieneVideo}
            {requiereJustificacionIndustria4}
            {requiereJustificacionEconomiaNaranja}
            {requiereJustificacionPoliticaDiscapacidad}
            {requiereJustificacionAntencionPluralista}
            {requiereJustificacionSectorAgricola}
        >
            <div slot="titulo">
                <InfoMessage>
                    <h1>Criterios de evaluacion</h1>
                    <ul className="list-disc p-4">
                        <li><strong>Puntaje: 0,0 a 0,5</strong> El título orienta el enfoque del proyecto</li>
                        <li><strong>Puntaje: 0,6 a 1,0</strong> El título orienta el enfoque del proyecto e indica el cómo y el para qué</li>
                    </ul>
                    <Label className="mt-4 mb-4" labelFor="titulo_puntaje" value="Puntaje (Máximo 1)" />
                    <Input label="Puntaje" id="titulo_puntaje" type="number" input$step="0.1" input$min="0" input$max="1" className="mt-1" bind:value={$form.titulo_puntaje} placeholder="Puntaje" autocomplete="off" error={errors.titulo_puntaje} />

                    <div className="mt-4">
                        <p>¿El título es correcto? Por favor seleccione si Cumple o No cumple.</p>
                        <Switch onMessage="Cumple" offMessage="No cumple" bind:checked={$form.titulo_requiere_comentario} />
                        {#if $form.titulo_requiere_comentario == false}
                            <Textarea label="Comentario" className="mt-4" maxlength="40000" id="titulo_comentario" bind:value={$form.titulo_comentario} error={errors.titulo_comentario} required />
                        {/if}
                    </div>
                </InfoMessage>
            </div>

            <div slot="fechas">
                <InfoMessage>
                    <div className="mt-4">
                        <p>¿Las fechas son correctas? Por favor seleccione si Cumple o No cumple</p>
                        <Switch onMessage="Cumple" offMessage="No cumple" bind:checked={$form.fechas_requiere_comentario} />
                        {#if $form.fechas_requiere_comentario == false}
                            <Textarea label="Comentario" className="mt-4" maxlength="40000" id="fechas_comentario" bind:value={$form.fechas_comentario} error={errors.fechas_comentario} required />
                        {/if}
                    </div>
                </InfoMessage>
            </div>

            <div slot="red-conocimiento">
                <InfoMessage>
                    <div className="mt-4">
                        <p>¿La red de conocimiento sectorial es correcta? Por favor seleccione si Cumple o No cumple.</p>
                        <Switch onMessage="Cumple" offMessage="No cumple" bind:checked={$form.red_conocimiento_requiere_comentario} />
                        {#if $form.red_conocimiento_requiere_comentario == false}
                            <Textarea label="Comentario" className="mt-4" maxlength="40000" id="red_conocimiento_comentario" bind:value={$form.red_conocimiento_comentario} error={errors.red_conocimiento_comentario} required />
                        {/if}
                    </div>
                </InfoMessage>
            </div>

            <div slot="disciplina-subarea-conocimiento">
                <InfoMessage>
                    <div className="mt-4">
                        <p>¿La disciplina de la subárea de conocimiento es correcta? Por favor seleccione si Cumple o No cumple.</p>
                        <Switch onMessage="Cumple" offMessage="No cumple" bind:checked={$form.disciplina_subarea_conocimiento_requiere_comentario} />
                        {#if $form.disciplina_subarea_conocimiento_requiere_comentario == false}
                            <Textarea label="Comentario" className="mt-4" maxlength="40000" id="disciplina_subarea_conocimiento_comentario" bind:value={$form.disciplina_subarea_conocimiento_comentario} error={errors.disciplina_subarea_conocimiento_comentario} required />
                        {/if}
                    </div>
                </InfoMessage>
            </div>

            <div slot="actividad-economica">
                <InfoMessage>
                    <div className="mt-4">
                        <p>¿La actividad económica es correcta? Por favor seleccione si Cumple o No cumple.</p>
                        <Switch onMessage="Cumple" offMessage="No cumple" bind:checked={$form.actividad_economica_requiere_comentario} />
                        {#if $form.actividad_economica_requiere_comentario == false}
                            <Textarea label="Comentario" className="mt-4" maxlength="40000" id="actividad_economica_comentario" bind:value={$form.actividad_economica_comentario} error={errors.actividad_economica_comentario} required />
                        {/if}
                    </div>
                </InfoMessage>
            </div>

            <div slot="tematica-estrategica">
                <InfoMessage>
                    <div className="mt-4">
                        <p>¿La temática estratégica es correcta? Por favor seleccione si Cumple o No cumple.</p>
                        <Switch onMessage="Cumple" offMessage="No cumple" bind:checked={$form.tematica_estrategica_requiere_comentario} />
                        {#if $form.tematica_estrategica_requiere_comentario == false}
                            <Textarea label="Comentario" className="mt-4" maxlength="40000" id="tematica_estrategica_comentario" bind:value={$form.tematica_estrategica_comentario} error={errors.tematica_estrategica_comentario} required />
                        {/if}
                    </div>
                </InfoMessage>
            </div>

            <div slot="video">
                {#if tieneVideo}
                    <InfoMessage>
                        <h1>Criterios de evaluacion</h1>
                        <ul className="list-disc p-4">
                            <li><strong>Puntaje: 0,0 a 0,5</strong> El video no cumple los 3 minutos establecidos y no presenta de forma clara la justificación, la problemática, el objetivo general, los objetivos específicos, las actividades, los productos y/o su impacto de acuerdo con los lineamientos de la convocatoria</li>
                            <li><strong>Puntaje: 0,6 a 1,0</strong> El video cumple los 3 minutos establecidos y presenta la justificación, la problemática, el objetivo general, los objetivos específicos, las actividades, los productos y su impacto de acuerdo con los lineamientos de la convocatoria</li>
                        </ul>

                        <Label className="mt-4 mb-4" labelFor="video_puntaje" value="Puntaje (Máximo 1)" />
                        <Input label="Puntaje" id="video_puntaje" type="number" input$step="0.1" input$min="0" input$max="1" className="mt-1" bind:value={$form.video_puntaje} placeholder="Puntaje" autocomplete="off" error={errors.video_puntaje} />

                        <div className="mt-4">
                            <p>¿El video es correcto? Por favor seleccione si Cumple o No cumple.</p>
                            <Switch onMessage="Cumple" offMessage="No cumple" bind:checked={$form.video_requiere_comentario} />
                            {#if $form.video_requiere_comentario == false}
                                <Textarea label="Comentario" className="mt-4" maxlength="40000" id="video_comentario" bind:value={$form.video_comentario} error={errors.video_comentario} required />
                            {/if}
                        </div>
                    </InfoMessage>
                {/if}
            </div>

            <div slot="industria4">
                {#if requiereJustificacionIndustria4}
                    <InfoMessage>
                        <div className="mt-4">
                            <p>¿El ítem es correcto? Por favor seleccione si Cumple o No cumple.</p>
                            <Switch onMessage="Cumple" offMessage="No cumple" bind:checked={$form.justificacion_industria_4_requiere_comentario} />
                            {#if $form.justificacion_industria_4_requiere_comentario == false}
                                <Textarea label="Comentario" className="mt-4" maxlength="40000" id="justificacion_industria_4_comentario" bind:value={$form.justificacion_industria_4_comentario} error={errors.justificacion_industria_4_comentario} required />
                            {/if}
                        </div>
                    </InfoMessage>
                {/if}
            </div>

            <div slot="economia-naranja">
                {#if requiereJustificacionEconomiaNaranja}
                    <InfoMessage>
                        <div className="mt-4">
                            <p>¿El ítem es correcto? Por favor seleccione si Cumple o No cumple.</p>
                            <Switch onMessage="Cumple" offMessage="No cumple" bind:checked={$form.justificacion_economia_naranja_requiere_comentario} />
                            {#if $form.justificacion_economia_naranja_requiere_comentario == false}
                                <Textarea label="Comentario" className="mt-4" maxlength="40000" id="justificacion_economia_naranja_comentario" bind:value={$form.justificacion_economia_naranja_comentario} error={errors.justificacion_economia_naranja_comentario} required />
                            {/if}
                        </div>
                    </InfoMessage>
                {/if}
            </div>

            <div slot="politica-discapacidad">
                {#if requiereJustificacionPoliticaDiscapacidad}
                    <InfoMessage>
                        <div className="mt-4">
                            <p>¿El ítem es correcto? Por favor seleccione si Cumple o No cumple.</p>
                            <Switch onMessage="Cumple" offMessage="No cumple" bind:checked={$form.justificacion_politica_discapacidad_requiere_comentario} />
                            {#if $form.justificacion_politica_discapacidad_requiere_comentario == false}
                                <Textarea label="Comentario" className="mt-4" maxlength="40000" id="justificacion_politica_discapacidad_comentario" bind:value={$form.justificacion_politica_discapacidad_comentario} error={errors.justificacion_politica_discapacidad_comentario} required />
                            {/if}
                        </div>
                    </InfoMessage>
                {/if}
            </div>

            <div slot="resumen">
                <InfoMessage>
                    <h1>Criterios de evaluacion</h1>
                    <ul className="list-disc p-4">
                        <li><strong>Puntaje: 0,0 a 1,0</strong> El resumen no presenta de forma clara la pertinencia y calidad del proyecto, en términos de cuál es el problema central, cómo se le dará solución y cuáles serán las herramientas que se utilizarán para ello, entre otros.</li>
                        <li><strong>Puntaje: 1,1 a 2,0</strong> El resumen presenta de forma clara la pertinencia y calidad del proyecto e incluye todos los elementos en términos de cuál es el problema central, cómo se le dará solución y cuáles serán las herramientas que se utilizarán para ello, entre otros.</li>
                    </ul>

                    <Label className="mt-4 mb-4" labelFor="resumen_puntaje" value="Puntaje (Máximo 2)" />
                    <Input label="Puntaje" id="resumen_puntaje" type="number" input$step="0.1" input$min="0" input$max="2" className="mt-1" bind:value={$form.resumen_puntaje} placeholder="Puntaje" autocomplete="off" error={errors.resumen_puntaje} />

                    <div className="mt-4">
                        <p>¿El resumen es correcto? Por favor seleccione si Cumple o No cumple.</p>
                        <Switch onMessage="Cumple" offMessage="No cumple" bind:checked={$form.resumen_requiere_comentario} />
                        {#if $form.resumen_requiere_comentario == false}
                            <Textarea label="Comentario" className="mt-4" maxlength="40000" id="resumen_comentario" bind:value={$form.resumen_comentario} error={errors.resumen_comentario} required />
                        {/if}
                    </div>
                </InfoMessage>
            </div>

            <div slot="bibliografia">
                <InfoMessage>
                    <div className="mt-4">
                        <p>¿La bibliografía es correcta? Por favor seleccione si Cumple o No cumple.</p>
                        <Switch onMessage="Cumple" offMessage="No cumple" bind:checked={$form.bibliografia_requiere_comentario} />
                        {#if $form.bibliografia_requiere_comentario == false}
                            <Textarea label="Comentario" className="mt-4" maxlength="40000" id="bibliografia_comentario" bind:value={$form.bibliografia_comentario} error={errors.bibliografia_comentario} required />
                        {/if}
                    </div>
                </InfoMessage>
            </div>

            <div slot="items-finales">
                <hr className="mt-10 mb-10" />
                <h1>Ortografía</h1>
                <InfoMessage>
                    <h1>Criterios de evaluacion</h1>
                    <ul className="list-disc p-4">
                        <li><strong>Puntaje: 1</strong> Todo el documento respeta y aplica las reglas ortográficas</li>
                    </ul>

                    <Label className="mt-4 mb-4" labelFor="ortografia_puntaje" value="Puntaje (Máximo 1)" />
                    <Input label="Puntaje" id="ortografia_puntaje" type="number" input$step="1" input$min="0" input$max="1" className="mt-1" bind:value={$form.ortografia_puntaje} placeholder="Puntaje" autocomplete="off" error={errors.ortografia_puntaje} />

                    <div className="mt-4">
                        <p>¿La ortografía es correcta? Por favor seleccione si Cumple o No cumple.</p>
                        <Switch onMessage="Cumple" offMessage="No cumple" bind:checked={$form.ortografia_requiere_comentario} />
                        {#if $form.ortografia_requiere_comentario == false}
                            <Textarea label="Comentario" className="mt-4" maxlength="40000" id="ortografia_comentario" bind:value={$form.ortografia_comentario} error={errors.ortografia_comentario} required />
                        {/if}
                    </div>
                </InfoMessage>

                <hr className="mt-10 mb-10" />
                <h1>Redacción</h1>
                <InfoMessage>
                    <h1>Criterios de evaluacion</h1>
                    <ul className="list-disc p-4">
                        <li><strong>Puntaje: 1</strong> Todo el documento respeta y aplica las reglas gramaticales</li>
                    </ul>

                    <Label className="mt-4 mb-4" labelFor="redaccion_puntaje" value="Puntaje (Máximo 1)" />
                    <Input label="Puntaje" id="redaccion_puntaje" type="number" input$step="1" input$min="0" input$max="1" className="mt-1" bind:value={$form.redaccion_puntaje} placeholder="Puntaje" autocomplete="off" error={errors.redaccion_puntaje} />

                    <div className="mt-4">
                        <p>¿La redacción es correcta? Por favor seleccione si Cumple o No cumple.</p>
                        <Switch onMessage="Cumple" offMessage="No cumple" bind:checked={$form.redaccion_requiere_comentario} />
                        {#if $form.redaccion_requiere_comentario == false}
                            <Textarea label="Comentario" className="mt-4" maxlength="40000" id="redaccioncomentario" bind:value={$form.redaccion_comentario} error={errors.redaccion_comentario} />
                        {/if}
                    </div>
                </InfoMessage>

                <hr className="mt-10 mb-10" />
                <h1>Normas APA</h1>
                <InfoMessage>
                    <h1>Criterios de evaluacion</h1>
                    <ul className="list-disc p-4">
                        <li><strong>Puntaje: 1</strong> Las normas APA han sido aplicadas en todo el documento para referenciar y citar otros autores</li>
                    </ul>

                    <Label className="mt-4 mb-4" labelFor="normas_apa_puntaje" value="Puntaje (Máximo 1)" />
                    <Input label="Puntaje" id="normas_apa_puntaje" type="number" input$step="1" input$min="0" input$max="1" className="mt-1" bind:value={$form.normas_apa_puntaje} placeholder="Puntaje" autocomplete="off" error={errors.normas_apa_puntaje} />

                    <div className="mt-4">
                        <p>¿Las normas APA son correctas? Por favor seleccione si Cumple o No cumple.</p>
                        <Switch onMessage="Cumple" offMessage="No cumple" bind:checked={$form.normas_apa_requiere_comentario} />
                        {#if $form.normas_apa_requiere_comentario == false}
                            <Textarea label="Comentario" className="mt-4" maxlength="40000" id="normas_apa_comentario" bind:value={$form.normas_apa_comentario} error={errors.normas_apa_comentario} required />
                        {/if}
                    </div>
                </InfoMessage>
            </div>
        </IdiForm>
        <div className="flex items-center justify-between mt-14 px-8 py-4">
            {#if idiEvaluacion.evaluacion.allowed.to_update}
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

    <Dialog bind:open={dialogClausulaConfidencialidad} id="informacion">
        <div slot="title" className="flex items-center flex-col mt-4">
            <figure>
                <img src={'/images/feedback.png'} alt="Evaluación" className="h-32 mb-6" />
            </figure>
            Código del proyecto: {idi.proyecto.codigo}
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
                <Button on:click={() => (($form.clausula_confidencialidad = true), (dialogClausulaConfidencialidad = false))} variant={null}>Aceptar</Button>
            </div>
        </div>
    </Dialog>

    <Dialog bind:open={dialogSegundaEvaluacion} id="informacion">
        <div slot="title" className="flex items-center flex-col mt-4">
            <figure>
                <img src={'/images/feedback.png'} alt="Evaluación" className="h-32 mb-6" />
            </figure>
            Código del proyecto: {idi.proyecto.codigo}
        </div>
        <div slot="content">
            <div>
                <h1 className="text-center mt-4 mb-4">Importante</h1>

                <p>Antes de iniciar a la segunda evaluación por favor diríjase a la sección <strong>Comentarios generales</strong> y verifique si el proponente hizo alguna aclaración sobre algún ítem.</p>

                {#if idi.proyecto.pdf_versiones}
                    <hr className="m-10 block" />
                    <h1 className="text-center mt-4 mb-4">Version del proyecto (.pdf)</h1>
                    <p className="mt-4">También revise la versión del proyecto en .pdf para ir verificando los cambios realizados en los diferentes campos.</p>
                    <ul>
                        {#each idi.proyecto.pdf_versiones as version}
                            <li>
                                {#if version.estado == 1}
                                    <a className="text-white underline" href={route('convocatorias.proyectos.version', [convocatoria.id, idi.id, version.version])}> {version.version}.pdf - Descargar</a>
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
