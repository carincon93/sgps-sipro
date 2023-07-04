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
    import InfoMessage from '@/Components/InfoMessage'
    import Switch from '@/Components/Switch'
    import Dialog from '@/Components/Dialog'
    import CulturaInnovacionForm from '../../Proyectos/CulturaInnovacion/CulturaInnovacionForm'

    export let errors
    export let convocatoria
    export let culturaInnovacion
    export let areasConocimiento
    export let culturaInnovacionEvaluacion
    export let mesasSectoriales
    export let tecnoacademia
    export let tecnoacademias
    export let lineasProgramaticas
    export let actividadesEconomicas
    export let tematicasEstrategicas
    export let lineasTecnoacademia
    export let municipios
    export let programasFormacionConRegistroCalificado
    export let programasFormacionSinRegistroCalificado
    export let opcionesAplicaNoAplica
    export let proyectoMunicipios
    export let programasFormacionConRegistroRelacionados
    export let programasFormacionSinRegistroRelacionados
    export let mesasSectorialesRelacionadas
    export let lineasTecnoacademiaRelacionadas
    export let lineasInvestigacion
    export let tiposProyectos
    export let tiposEventos

    $: $title = culturaInnovacion ? culturaInnovacion.titulo : null

    /**
     * Validar si el usuario autenticado es SuperAdmin
     */
    let authUser = $auth.user
    let isSuperAdmin = checkRole(authUser, [1])

    let dialogSegundaEvaluacion = convocatoria.fase == 4 ? true : false
    let proyectoDialogOpen = culturaInnovacionEvaluacion.evaluacion.clausula_confidencialidad == false ? true : false

    let arrayLineasTecnoacademia = lineasTecnoacademia.filter(function (obj) {
        return obj.tecnoacademia_id == tecnoacademia?.id
    })
    function selectLineasTecnoacademia(event) {
        arrayLineasTecnoacademia = lineasTecnoacademia.filter(function (obj) {
            return obj.tecnoacademia_id == event.detail?.value
        })
    }

    let tieneVideo = culturaInnovacion.video != null
    let requiereJustificacionIndustria4 = culturaInnovacion.justificacion_industria_4 != null
    let requiereJustificacionEconomiaNaranja = culturaInnovacion.justificacion_economia_naranja != null
    let requiereJustificacionPoliticaDiscapacidad = culturaInnovacion.justificacion_politica_discapacidad != null

    let culturaInnovacionInfo = {
        centro_formacion_id: culturaInnovacion.proyecto?.centro_formacion_id,
        linea_investigacion_id: culturaInnovacion.linea_investigacion_id,
        area_conocimiento_id: culturaInnovacion.area_conocimiento_id,
        tematica_estrategica_id: culturaInnovacion.tematica_estrategica_id,
        linea_programatica_id: culturaInnovacion.proyecto?.linea_programatica_id,
        actividad_economica_id: culturaInnovacion.actividad_economica_id,
        titulo: culturaInnovacion.titulo,
        fecha_inicio: culturaInnovacion.fecha_inicio,
        fecha_finalizacion: culturaInnovacion.fecha_finalizacion,
        max_meses_ejecucion: culturaInnovacion.max_meses_ejecucion,
        video: culturaInnovacion.video,
        justificacion_industria_4: culturaInnovacion.justificacion_industria_4,
        justificacion_economia_naranja: culturaInnovacion.justificacion_economia_naranja,
        justificacion_politica_discapacidad: culturaInnovacion.justificacion_politica_discapacidad,
        resumen: culturaInnovacion.resumen,
        antecedentes: culturaInnovacion.antecedentes,
        identificacion_problema: culturaInnovacion.identificacion_problema,
        justificacion_problema: culturaInnovacion.justificacion_problema,
        marco_conceptual: culturaInnovacion.marco_conceptual,
        bibliografia: culturaInnovacion.bibliografia,
        numero_aprendices: culturaInnovacion.numero_aprendices,
        municipios: proyectoMunicipios.length > 0 ? proyectoMunicipios : null,
        programas_formacion: programasFormacionConRegistroRelacionados.length > 0 ? programasFormacionConRegistroRelacionados : null,
        programas_formacion_articulados: programasFormacionSinRegistroRelacionados.length > 0 ? programasFormacionSinRegistroRelacionados : null,
        impacto_municipios: culturaInnovacion.impacto_municipios,
        impacto_centro_formacion: culturaInnovacion.impacto_centro_formacion,
        muestreo: culturaInnovacion.muestreo,
        actividades_muestreo: culturaInnovacion.actividades_muestreo,
        objetivo_muestreo: culturaInnovacion.objetivo_muestreo,
        recoleccion_especimenes: culturaInnovacion.recoleccion_especimenes,
        relacionado_plan_tecnologico: culturaInnovacion.relacionado_plan_tecnologico,
        relacionado_agendas_competitividad: culturaInnovacion.relacionado_agendas_competitividad,
        relacionado_mesas_sectoriales: culturaInnovacion.relacionado_mesas_sectoriales,
        relacionado_tecnoacademia: culturaInnovacion.relacionado_tecnoacademia,
        tecnoacademia_id: tecnoacademia?.id,

        linea_tecnologica_id: lineasTecnoacademiaRelacionadas,
        mesa_sectorial_id: mesasSectorialesRelacionadas,
    }

    $: if (culturaInnovacionInfo.fecha_inicio && culturaInnovacionInfo.fecha_finalizacion) {
        culturaInnovacionInfo.max_meses_ejecucion = monthDiff(culturaInnovacionInfo.fecha_inicio, culturaInnovacionInfo.fecha_finalizacion)
    }

    let formResumen = useForm({
        resumen: culturaInnovacion.resumen,
    })
    let formAntecedentes = useForm({
        antecedentes: culturaInnovacion.antecedentes,
    })
    let formMarcoConceptual = useForm({
        marco_conceptual: culturaInnovacion.marco_conceptual,
    })
    let formJustificacionIndustria4 = useForm({
        justificacion_industria_4: culturaInnovacion.justificacion_industria_4,
    })
    let formJustificacionEconomiaNaranja = useForm({
        justificacion_economia_naranja: culturaInnovacion.justificacion_economia_naranja,
    })
    let formJustificacionPoliticaDiscapacidad = useForm({
        justificacion_politica_discapacidad: culturaInnovacion.justificacion_politica_discapacidad,
    })
    let formImpactoMunicipios = useForm({
        impacto_municipios: culturaInnovacion.impacto_municipios,
    })
    let formImpactoCentroFormacion = useForm({
        impacto_centro_formacion: culturaInnovacion.impacto_centro_formacion,
    })
    let formBibliografia = useForm({
        bibliografia: culturaInnovacion.bibliografia,
    })

    let formGeneralidades = useForm({
        centro_formacion_id: culturaInnovacion.proyecto?.centro_formacion_id,
        linea_investigacion_id: culturaInnovacion.linea_investigacion_id,
        area_conocimiento_id: culturaInnovacion.area_conocimiento_id,
        tematica_estrategica_id: culturaInnovacion.tematica_estrategica_id,
        linea_programatica_id: culturaInnovacion.proyecto?.linea_programatica_id,
        actividad_economica_id: culturaInnovacion.actividad_economica_id,
        tipo_proyecto: culturaInnovacion.tipo_proyecto,
        tipo_evento: {
            value: culturaInnovacion.tipo_evento,
            label: tiposEventos.find((item) => item.value == culturaInnovacion.tipo_evento)?.label,
        },
        titulo: culturaInnovacion.titulo,
        fecha_inicio: culturaInnovacion.fecha_inicio,
        fecha_finalizacion: culturaInnovacion.fecha_finalizacion,
        max_meses_ejecucion: culturaInnovacion.max_meses_ejecucion,
        video: culturaInnovacion.video,
        numero_aprendices: culturaInnovacion.numero_aprendices,
        municipios: proyectoMunicipios.length > 0 ? proyectoMunicipios : null,
        programas_formacion: programasFormacionConRegistroRelacionados.length > 0 ? programasFormacionConRegistroRelacionados : null,
        programas_formacion_articulados: programasFormacionSinRegistroRelacionados.length > 0 ? programasFormacionSinRegistroRelacionados : null,
        muestreo: culturaInnovacion.muestreo,
        actividades_muestreo: culturaInnovacion.actividades_muestreo,
        objetivo_muestreo: culturaInnovacion.objetivo_muestreo,
        recoleccion_especimenes: culturaInnovacion.recoleccion_especimenes,
        relacionado_plan_tecnologico: culturaInnovacion.relacionado_plan_tecnologico,
        relacionado_agendas_competitividad: culturaInnovacion.relacionado_agendas_competitividad,
        relacionado_mesas_sectoriales: culturaInnovacion.relacionado_mesas_sectoriales,
        relacionado_tecnoacademia: culturaInnovacion.relacionado_tecnoacademia,
        tecnoacademia_id: tecnoacademia?.id,

        linea_tecnologica_id: lineasTecnoacademiaRelacionadas,
        mesa_sectorial_id: mesasSectorialesRelacionadas,

        resumen: culturaInnovacion.resumen,
        antecedentes: culturaInnovacion.antecedentes,
        marco_conceptual: culturaInnovacion.marco_conceptual,
        justificacion_industria_4: culturaInnovacion.justificacion_industria_4,
        justificacion_economia_naranja: culturaInnovacion.justificacion_economia_naranja,
        justificacion_politica_discapacidad: culturaInnovacion.justificacion_politica_discapacidad,
        impacto_municipios: culturaInnovacion.impacto_municipios,
        impacto_centro_formacion: culturaInnovacion.impacto_centro_formacion,
        bibliografia: culturaInnovacion.bibliografia,

        impacto_sector_agricola: culturaInnovacion.impacto_sector_agricola,
        atencion_pluralista_diferencial: culturaInnovacion.atencion_pluralista_diferencial,
    })

    let form = useForm({
        clausula_confidencialidad: culturaInnovacionEvaluacion.evaluacion.clausula_confidencialidad,
        titulo_puntaje: culturaInnovacionEvaluacion.titulo_puntaje,
        titulo_comentario: culturaInnovacionEvaluacion.titulo_comentario,
        titulo_requiere_comentario: culturaInnovacionEvaluacion.titulo_comentario == null ? true : false,
        video_puntaje: culturaInnovacionEvaluacion.video_puntaje,
        video_comentario: culturaInnovacionEvaluacion.video_comentario,
        video_requiere_comentario: culturaInnovacionEvaluacion.video_comentario == null ? true : false,
        resumen_puntaje: culturaInnovacionEvaluacion.resumen_puntaje,
        resumen_comentario: culturaInnovacionEvaluacion.resumen_comentario,
        resumen_requiere_comentario: culturaInnovacionEvaluacion.resumen_comentario == null ? true : false,
        antecedentes_puntaje: culturaInnovacionEvaluacion.antecedentes_puntaje,
        antecedentes_comentario: culturaInnovacionEvaluacion.antecedentes_comentario,
        antecedentes_requiere_comentario: culturaInnovacionEvaluacion.antecedentes_comentario == null ? true : false,
        ortografia_puntaje: culturaInnovacionEvaluacion.ortografia_puntaje,
        ortografia_comentario: culturaInnovacionEvaluacion.ortografia_comentario,
        ortografia_requiere_comentario: culturaInnovacionEvaluacion.ortografia_comentario == null ? true : false,
        redaccion_puntaje: culturaInnovacionEvaluacion.redaccion_puntaje,
        redaccion_comentario: culturaInnovacionEvaluacion.redaccion_comentario,
        redaccion_requiere_comentario: culturaInnovacionEvaluacion.redaccion_comentario == null ? true : false,
        normas_apa_puntaje: culturaInnovacionEvaluacion.normas_apa_puntaje,
        normas_apa_comentario: culturaInnovacionEvaluacion.normas_apa_comentario,
        normas_apa_requiere_comentario: culturaInnovacionEvaluacion.normas_apa_comentario == null ? true : false,

        justificacion_economia_naranja_requiere_comentario: culturaInnovacionEvaluacion.justificacion_economia_naranja_comentario == null ? true : false,
        justificacion_economia_naranja_comentario: culturaInnovacionEvaluacion.justificacion_economia_naranja_comentario,

        justificacion_industria_4_requiere_comentario: culturaInnovacionEvaluacion.justificacion_industria_4_comentario == null ? true : false,
        justificacion_industria_4_comentario: culturaInnovacionEvaluacion.justificacion_industria_4_comentario,

        bibliografia_requiere_comentario: culturaInnovacionEvaluacion.bibliografia_comentario == null ? true : false,
        bibliografia_comentario: culturaInnovacionEvaluacion.bibliografia_comentario,

        fechas_requiere_comentario: culturaInnovacionEvaluacion.fechas_comentario == null ? true : false,
        fechas_comentario: culturaInnovacionEvaluacion.fechas_comentario,

        justificacion_politica_discapacidad_requiere_comentario: culturaInnovacionEvaluacion.justificacion_politica_discapacidad_comentario == null ? true : false,
        justificacion_politica_discapacidad_comentario: culturaInnovacionEvaluacion.justificacion_politica_discapacidad_comentario,

        actividad_economica_requiere_comentario: culturaInnovacionEvaluacion.actividad_economica_comentario == null ? true : false,
        actividad_economica_comentario: culturaInnovacionEvaluacion.actividad_economica_comentario,

        area_conocimiento_requiere_comentario: culturaInnovacionEvaluacion.area_conocimiento_comentario == null ? true : false,
        area_conocimiento_comentario: culturaInnovacionEvaluacion.area_conocimiento_comentario,

        tematica_estrategica_requiere_comentario: culturaInnovacionEvaluacion.tematica_estrategica_comentario == null ? true : false,
        tematica_estrategica_comentario: culturaInnovacionEvaluacion.tematica_estrategica_comentario,
    })
    function submit() {
        if (isSuperAdmin || (checkRole(authUser, [11, 5]) && culturaInnovacionEvaluacion.evaluacion.finalizado == false && culturaInnovacionEvaluacion.evaluacion.habilitado == true && culturaInnovacionEvaluacion.evaluacion.modificable == true)) {
            $form.put(route('convocatorias.cultura-innovacion-evaluaciones.update', [convocatoria.id, culturaInnovacionEvaluacion.id]), {
                preserveScroll: true,
            })
        }
    }
</script>

<AuthenticatedLayout>
    <header className="pt-[8rem]" slot="header">
        <EvaluationStepper {convocatoria} evaluacion={culturaInnovacionEvaluacion.evaluacion} proyecto={culturaInnovacion.proyecto} />
    </header>

    <form on:submit|preventDefault={submit}>
        <CulturaInnovacionForm
            evaluacion={culturaInnovacionEvaluacion.evaluacion}
            {isSuperAdmin}
            {convocatoria}
            form={formGeneralidades}
            {culturaInnovacion}
            {errors}
            {areasConocimiento}
            {lineasInvestigacion}
            {actividadesEconomicas}
            {tematicasEstrategicas}
            {tecnoacademias}
            {programasFormacionConRegistroCalificado}
            {programasFormacionSinRegistroCalificado}
            {municipios}
            {opcionesAplicaNoAplica}
            {tiposProyectos}
            {tiposEventos}
            {selectLineasTecnoacademia}
            {tieneVideo}
            {requiereJustificacionIndustria4}
            {requiereJustificacionEconomiaNaranja}
            {requiereJustificacionPoliticaDiscapacidad}
            {lineasProgramaticas}
            {formJustificacionIndustria4}
            {formJustificacionEconomiaNaranja}
            {formJustificacionPoliticaDiscapacidad}
            {formResumen}
            {formAntecedentes}
            {formMarcoConceptual}
            {formImpactoMunicipios}
            {formImpactoCentroFormacion}
            {formBibliografia}
            {arrayLineasTecnoacademia}
            {mesasSectoriales}
        >
            <div slot="titulo">
                <InfoMessage>
                    <h1>Criterios de evaluacion</h1>
                    <ul className="list-disc p-4">
                        <li><strong>Puntaje: 0,0 a 0,5</strong> El título orienta el enfoque del proyecto</li>
                        <li><strong>Puntaje: 0,6 a 1,0</strong> El título orienta el enfoque del proyecto e indica el cómo y el para qué</li>
                    </ul>
                    <Label className="mt-4 mb-4" labelFor="titulo_puntaje" value="Puntaje (Máximo 1)" />
                    <Input disabled={culturaInnovacionEvaluacion.evaluacion.finalizado == false && culturaInnovacionEvaluacion.evaluacion.habilitado == false ? true : undefined} label="Puntaje" id="titulo_puntaje" type="number" input$step="0.1" input$min="0" input$max="1" className="mt-1" bind:value={$form.titulo_puntaje} placeholder="Puntaje" autocomplete="off" error={errors.titulo_puntaje} />

                    <div className="mt-4">
                        <p>¿El título es correcto? Por favor seleccione si Cumple o No cumple.</p>
                        <Switch onMessage="Cumple" offMessage="No cumple" disabled={culturaInnovacionEvaluacion.evaluacion.finalizado == false && culturaInnovacionEvaluacion.evaluacion.habilitado == false ? true : undefined} bind:checked={$form.titulo_requiere_comentario} />
                        {#if $form.titulo_requiere_comentario == false}
                            <Textarea disabled={culturaInnovacionEvaluacion.evaluacion.finalizado == false && culturaInnovacionEvaluacion.evaluacion.habilitado == false ? true : undefined} label="Comentario" className="mt-4" maxlength="40000" id="titulo_comentario" bind:value={$form.titulo_comentario} required />
                        {/if}
                    </div>
                </InfoMessage>
            </div>

            <div slot="fechas">
                <InfoMessage>
                    <div className="mt-4">
                        <p>¿Las fechas son correctas? Por favor seleccione si Cumple o No cumple.</p>
                        <Switch onMessage="Cumple" offMessage="No cumple" disabled={culturaInnovacionEvaluacion.evaluacion.finalizado == false && culturaInnovacionEvaluacion.evaluacion.habilitado == false ? true : undefined} bind:checked={$form.fechas_requiere_comentario} />
                        {#if $form.fechas_requiere_comentario == false}
                            <Textarea disabled={culturaInnovacionEvaluacion.evaluacion.finalizado == false && culturaInnovacionEvaluacion.evaluacion.habilitado == false ? true : undefined} label="Comentario" className="mt-4" maxlength="40000" id="fechas_comentario" bind:value={$form.fechas_comentario} error={errors.fechas_comentario} required />
                        {/if}
                    </div>
                </InfoMessage>
            </div>

            <div slot="area-conocimiento">
                <InfoMessage>
                    <div className="mt-4">
                        <p>¿La área de conocimiento es correcto? Por favor seleccione si Cumple o No cumple.</p>
                        <Switch onMessage="Cumple" offMessage="No cumple" disabled={culturaInnovacionEvaluacion.evaluacion.finalizado == false && culturaInnovacionEvaluacion.evaluacion.habilitado == false ? true : undefined} bind:checked={$form.area_conocimiento_requiere_comentario} />
                        {#if $form.area_conocimiento_requiere_comentario == false}
                            <Textarea disabled={culturaInnovacionEvaluacion.evaluacion.finalizado == false && culturaInnovacionEvaluacion.evaluacion.habilitado == false ? true : undefined} label="Comentario" className="mt-4" maxlength="40000" id="area_conocimiento_comentario" bind:value={$form.area_conocimiento_comentario} error={errors.area_conocimiento_comentario} required />
                        {/if}
                    </div>
                </InfoMessage>
            </div>

            <div slot="actividad-economica">
                <InfoMessage>
                    <div className="mt-4">
                        <p>¿La actividad económica es correcta? Por favor seleccione si Cumple o No cumple.</p>
                        <Switch onMessage="Cumple" offMessage="No cumple" disabled={culturaInnovacionEvaluacion.evaluacion.finalizado == false && culturaInnovacionEvaluacion.evaluacion.habilitado == false ? true : undefined} bind:checked={$form.actividad_economica_requiere_comentario} />
                        {#if $form.actividad_economica_requiere_comentario == false}
                            <Textarea disabled={culturaInnovacionEvaluacion.evaluacion.finalizado == false && culturaInnovacionEvaluacion.evaluacion.habilitado == false ? true : undefined} label="Comentario" className="mt-4" maxlength="40000" id="actividad_economica_comentario" bind:value={$form.actividad_economica_comentario} error={errors.actividad_economica_comentario} required />
                        {/if}
                    </div>
                </InfoMessage>
            </div>

            <div slot="tematica-estrategica">
                <InfoMessage>
                    <div className="mt-4">
                        <p>¿La temática estratégica es correcta? Por favor seleccione si Cumple o No cumple.</p>
                        <Switch onMessage="Cumple" offMessage="No cumple" disabled={culturaInnovacionEvaluacion.evaluacion.finalizado == false && culturaInnovacionEvaluacion.evaluacion.habilitado == false ? true : undefined} bind:checked={$form.tematica_estrategica_requiere_comentario} />
                        {#if $form.tematica_estrategica_requiere_comentario == false}
                            <Textarea disabled={culturaInnovacionEvaluacion.evaluacion.finalizado == false && culturaInnovacionEvaluacion.evaluacion.habilitado == false ? true : undefined} label="Comentario" className="mt-4" maxlength="40000" id="tematica_estrategica_comentario" bind:value={$form.tematica_estrategica_comentario} error={errors.tematica_estrategica_comentario} required />
                        {/if}
                    </div>
                </InfoMessage>
            </div>

            <div slot="industria-4">
                {#if requiereJustificacionIndustria4}
                    <InfoMessage>
                        <div className="mt-4">
                            <p>¿El ítem es correcto? Por favor seleccione si Cumple o No cumple.</p>
                            <Switch onMessage="Cumple" offMessage="No cumple" disabled={culturaInnovacionEvaluacion.evaluacion.finalizado == false && culturaInnovacionEvaluacion.evaluacion.habilitado == false ? true : undefined} bind:checked={$form.justificacion_industria_4_requiere_comentario} />
                            {#if $form.justificacion_industria_4_requiere_comentario == false}
                                <Textarea
                                    disabled={culturaInnovacionEvaluacion.evaluacion.finalizado == false && culturaInnovacionEvaluacion.evaluacion.habilitado == false ? true : undefined}
                                    label="Comentario"
                                    className="mt-4"
                                    maxlength="40000"
                                    id="justificacion_industria_4_comentario"
                                    bind:value={$form.justificacion_industria_4_comentario}
                                    error={errors.justificacion_industria_4_comentario}
                                    required
                                />
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
                            <Switch onMessage="Cumple" offMessage="No cumple" disabled={culturaInnovacionEvaluacion.evaluacion.finalizado == false && culturaInnovacionEvaluacion.evaluacion.habilitado == false ? true : undefined} bind:checked={$form.justificacion_economia_naranja_requiere_comentario} />
                            {#if $form.justificacion_economia_naranja_requiere_comentario == false}
                                <Textarea
                                    disabled={culturaInnovacionEvaluacion.evaluacion.finalizado == false && culturaInnovacionEvaluacion.evaluacion.habilitado == false ? true : undefined}
                                    label="Comentario"
                                    className="mt-4"
                                    maxlength="40000"
                                    id="justificacion_economia_naranja_comentario"
                                    bind:value={$form.justificacion_economia_naranja_comentario}
                                    error={errors.justificacion_economia_naranja_comentario}
                                    required
                                />
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
                            <Switch onMessage="Cumple" offMessage="No cumple" disabled={culturaInnovacionEvaluacion.evaluacion.finalizado == false && culturaInnovacionEvaluacion.evaluacion.habilitado == false ? true : undefined} bind:checked={$form.justificacion_politica_discapacidad_requiere_comentario} />
                            {#if $form.justificacion_politica_discapacidad_requiere_comentario == false}
                                <Textarea
                                    disabled={culturaInnovacionEvaluacion.evaluacion.finalizado == false && culturaInnovacionEvaluacion.evaluacion.habilitado == false ? true : undefined}
                                    label="Comentario"
                                    className="mt-4"
                                    maxlength="40000"
                                    id="justificacion_politica_discapacidad_comentario"
                                    bind:value={$form.justificacion_politica_discapacidad_comentario}
                                    error={errors.justificacion_politica_discapacidad_comentario}
                                    required
                                />
                            {/if}
                        </div>
                    </InfoMessage>
                {/if}
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

            <div slot="resumen">
                <InfoMessage>
                    <h1>Criterios de evaluacion</h1>
                    <ul className="list-disc p-4">
                        <li><strong>Puntaje: 0,0 a 1,0</strong> El resumen no presenta de forma clara la pertinencia y calidad del proyecto, en términos de cuál es el problema central, cómo se le dará solución y cuáles serán las herramientas que se utilizarán para ello, entre otros.</li>
                        <li><strong>Puntaje: 1,1 a 2,0</strong> El resumen presenta de forma clara la pertinencia y calidad del proyecto e incluye todos los elementos en términos de cuál es el problema central, cómo se le dará solución y cuáles serán las herramientas que se utilizarán para ello, entre otros.</li>
                    </ul>

                    <Label className="mt-4 mb-4" labelFor="resumen_puntaje" value="Puntaje (Máximo 2)" />
                    <Input disabled={culturaInnovacionEvaluacion.evaluacion.finalizado == false && culturaInnovacionEvaluacion.evaluacion.habilitado == false ? true : undefined} label="Puntaje" id="resumen_puntaje" type="number" input$step="0.1" input$min="0" input$max="2" className="mt-1" bind:value={$form.resumen_puntaje} placeholder="Puntaje" autocomplete="off" error={errors.resumen_puntaje} />

                    <div className="mt-4">
                        <p>¿El resumen es correcto? Por favor seleccione si Cumple o No cumple.</p>
                        <Switch onMessage="Cumple" offMessage="No cumple" disabled={culturaInnovacionEvaluacion.evaluacion.finalizado == false && culturaInnovacionEvaluacion.evaluacion.habilitado == false ? true : undefined} bind:checked={$form.resumen_requiere_comentario} />
                        {#if $form.resumen_requiere_comentario == false}
                            <Textarea disabled={culturaInnovacionEvaluacion.evaluacion.finalizado == false && culturaInnovacionEvaluacion.evaluacion.habilitado == false ? true : undefined} label="Comentario" className="mt-4" maxlength="40000" id="resumen_comentario" bind:value={$form.resumen_comentario} required />
                        {/if}
                    </div>
                </InfoMessage>
            </div>

            <div slot="bibliografia">
                <InfoMessage>
                    <div className="mt-4">
                        <p>¿La bibliografía es correcta? Por favor seleccione si Cumple o No cumple.</p>
                        <Switch onMessage="Cumple" offMessage="No cumple" disabled={culturaInnovacionEvaluacion.evaluacion.finalizado == false && culturaInnovacionEvaluacion.evaluacion.habilitado == false ? true : undefined} bind:checked={$form.bibliografia_requiere_comentario} />
                        {#if $form.bibliografia_requiere_comentario == false}
                            <Textarea disabled={culturaInnovacionEvaluacion.evaluacion.finalizado == false && culturaInnovacionEvaluacion.evaluacion.habilitado == false ? true : undefined} label="Comentario" className="mt-4" maxlength="40000" id="bibliografia_comentario" bind:value={$form.bibliografia_comentario} error={errors.bibliografia_comentario} required />
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
                    <Input
                        disabled={culturaInnovacionEvaluacion.evaluacion.finalizado == false && culturaInnovacionEvaluacion.evaluacion.habilitado == false ? true : undefined}
                        label="Puntaje"
                        id="ortografia_puntaje"
                        type="number"
                        input$step="1"
                        input$min="0"
                        input$max="1"
                        className="mt-1"
                        bind:value={$form.ortografia_puntaje}
                        placeholder="Puntaje"
                        autocomplete="off"
                        error={errors.ortografia_puntaje}
                    />

                    <div className="mt-4">
                        <p>¿La ortografía es correcta? Por favor seleccione si Cumple o No cumple.</p>
                        <Switch onMessage="Cumple" offMessage="No cumple" disabled={culturaInnovacionEvaluacion.evaluacion.finalizado == false && culturaInnovacionEvaluacion.evaluacion.habilitado == false ? true : undefined} bind:checked={$form.ortografia_requiere_comentario} />
                        {#if $form.ortografia_requiere_comentario == false}
                            <Textarea disabled={culturaInnovacionEvaluacion.evaluacion.finalizado == false && culturaInnovacionEvaluacion.evaluacion.habilitado == false ? true : undefined} label="Comentario" className="mt-4" maxlength="40000" id="ortografia_comentario" bind:value={$form.ortografia_comentario} required />
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
                    <Input disabled={culturaInnovacionEvaluacion.evaluacion.finalizado == false && culturaInnovacionEvaluacion.evaluacion.habilitado == false ? true : undefined} label="Puntaje" id="redaccion_puntaje" type="number" input$step="1" input$min="0" input$max="1" className="mt-1" bind:value={$form.redaccion_puntaje} placeholder="Puntaje" autocomplete="off" error={errors.redaccion_puntaje} />

                    <div className="mt-4">
                        <p>¿La redacción es correcto? Por favor seleccione si Cumple o No cumple.</p>
                        <Switch onMessage="Cumple" offMessage="No cumple" disabled={culturaInnovacionEvaluacion.evaluacion.finalizado == false && culturaInnovacionEvaluacion.evaluacion.habilitado == false ? true : undefined} bind:checked={$form.redaccion_requiere_comentario} />
                        {#if $form.redaccion_requiere_comentario == false}
                            <Textarea disabled={culturaInnovacionEvaluacion.evaluacion.finalizado == false && culturaInnovacionEvaluacion.evaluacion.habilitado == false ? true : undefined} label="Comentario" className="mt-4" maxlength="40000" id="redaccioncomentario" bind:value={$form.redaccion_comentario} required />
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
                    <Input
                        disabled={culturaInnovacionEvaluacion.evaluacion.finalizado == false && culturaInnovacionEvaluacion.evaluacion.habilitado == false ? true : undefined}
                        label="Puntaje"
                        id="normas_apa_puntaje"
                        type="number"
                        input$step="1"
                        input$min="0"
                        input$max="1"
                        className="mt-1"
                        bind:value={$form.normas_apa_puntaje}
                        placeholder="Puntaje"
                        autocomplete="off"
                        error={errors.normas_apa_puntaje}
                    />

                    <div className="mt-4">
                        <p>¿Las normas APA son correctas? Por favor seleccione si Cumple o No cumple.</p>
                        <Switch onMessage="Cumple" offMessage="No cumple" disabled={culturaInnovacionEvaluacion.evaluacion.finalizado == false && culturaInnovacionEvaluacion.evaluacion.habilitado == false ? true : undefined} bind:checked={$form.normas_apa_requiere_comentario} />
                        {#if $form.normas_apa_requiere_comentario == false}
                            <Textarea disabled={culturaInnovacionEvaluacion.evaluacion.finalizado == false && culturaInnovacionEvaluacion.evaluacion.habilitado == false ? true : undefined} label="Comentario" className="mt-4" maxlength="40000" id="normas_apa_comentario" bind:value={$form.normas_apa_comentario} required />
                        {/if}
                    </div>
                </InfoMessage>
            </div>
        </CulturaInnovacionForm>

        <div className="flex items-center justify-between mt-14 px-8 py-4">
            {#if isSuperAdmin || (checkRole(authUser, [11, 5]) && culturaInnovacionEvaluacion.evaluacion.finalizado == false && culturaInnovacionEvaluacion.evaluacion.habilitado == true && culturaInnovacionEvaluacion.evaluacion.modificable == true)}
                {#if $form.clausula_confidencialidad}
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-900 mr-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-green-900">Ha aceptado la cláusula de confidencialidad</span>
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
            Código del proyecto: {culturaInnovacion.proyecto.codigo}
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
            Código del proyecto: {culturaInnovacion.proyecto.codigo}
        </div>
        <div slot="content">
            <div>
                <h1 className="text-center mt-4 mb-4">Importante</h1>

                <p>Antes de iniciar a la segunda evaluación por favor diríjase a la sección <strong>Comentarios generales</strong> y verifique si el proponente hizo alguna aclaración sobre algún ítem.</p>

                {#if culturaInnovacion.proyecto.pdf_versiones}
                    <hr className="m-10 block" />
                    <h1 className="text-center mt-4 mb-4">Version del proyecto (.pdf)</h1>
                    <p className="mt-4">También revise la versión del proyecto en .pdf para ir verificando los cambios realizados en los diferentes campos.</p>
                    <ul>
                        {#each culturaInnovacion.proyecto.pdf_versiones as version}
                            <li>
                                {#if version.estado == 1}
                                    <a className="text-white underline" href={route('convocatorias.proyectos.version', [convocatoria.id, culturaInnovacion.id, version.version])}> {version.version}.pdf - Descargar</a>
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
