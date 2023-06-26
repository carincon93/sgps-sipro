<script>
    import AuthenticatedLayout, { title } from '@/Layouts/Authenticated'
    import { useForm, page } from '@inertiajs/inertia-svelte'
    import { Inertia } from '@inertiajs/inertia'
    import { route, checkRole, checkPermission } from '@/Utils'
    import { _ } from 'svelte-i18n'

    import Button from '@/Shared/Button'
    import LoadingButton from '@/Shared/LoadingButton'
    import Stepper from '@/Shared/Stepper'
    import InfoMessage from '@/Shared/InfoMessage'
    import Dialog from '@/Shared/Dialog'
    import Export2Word from '@/Shared/Export2Word'

    import IdiForm from './IdiForm'

    export let errors
    export let convocatoria
    export let idi
    export let mesasSectoriales
    export let lineasProgramaticas
    export let redesConocimiento
    export let areasConocimiento
    export let subareasConocimiento
    export let disciplinasSubareaConocimiento
    export let actividadesEconomicas
    export let tematicasEstrategicas
    export let lineasTecnoacademia
    export let lineasInvestigacion
    export let tecnoacademias
    export let municipios
    export let tecnoacademia
    export let areasTematicasEni
    export let lineasInvestigacionEni
    export let gruposInvestigacion
    export let opcionesIDiDropdown
    export let proyectoMunicipios
    export let proyectoAreasTematicasEni
    export let proyectoLineasInvestigacionEni
    export let programasFormacionConRegistroCalificado
    export let programasFormacionSinRegistroCalificado
    export let mesasSectorialesRelacionadas
    export let lineasTecnoacademiaRelacionadas
    export let programasFormacionConRegistroRelacionados
    export let programasFormacionSinRegistroRelacionados

    $: $title = idi ? idi.titulo : null

    /**
     * Validar si el usuario autenticado es SuperAdmin
     */
    let authUser = $page.props.auth.user
    let isSuperAdmin = checkRole(authUser, [1])

    let proyectoDialogOpen = true

    let dialogGuardar = false
    let exportComponent

    let tieneVideo = idi.video != null
    let requiereJustificacionIndustria4 = idi.justificacion_industria_4 != null
    let requiereJustificacionEconomiaNaranja = idi.justificacion_economia_naranja != null
    let requiereJustificacionPoliticaDiscapacidad = idi.justificacion_politica_discapacidad != null
    let requiereJustificacionAntencionPluralista = idi.atencion_pluralista_diferencial != null
    let requiereJustificacionSectorAgricola = idi.impacto_sector_agricola != null

    let form = useForm({
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

    let arrayLineasTecnoacademia = []
    async function submit() {
        if (idi.proyecto.allowed.to_update) {
            if ($form.relacionado_tecnoacademia?.value != 1) {
                $form.tecnoacademia_id = {}
                arrayLineasTecnoacademia = []
            }

            $form.put(route('convocatorias.idi.update', [convocatoria.id, idi.id]), {
                onFinish: () => {
                    dialogGuardar = false
                },
                preserveScroll: true,
            })
        }
    }

    $: if ($form.proyecto_investigacion_pedagogica == false || $form.articulacion_eni == false) {
        $form.grupo_investigacion_eni_id = null
        $form.linea_investigacion_eni_id = null
        $form.area_tematica_eni_id = null
    }
</script>

<AuthenticatedLayout>
    <header class="pt-[8rem]" slot="header">
        <Stepper {convocatoria} proyecto={idi} />
    </header>

    <form on:submit|preventDefault={submit} id="idi-form">
        <fieldset class="p-8 divide-y" disabled={idi.proyecto.allowed.to_update ? undefined : true}>
            <IdiForm
                {isSuperAdmin}
                {lineasProgramaticas}
                {gruposInvestigacion}
                {mesasSectoriales}
                {tecnoacademia}
                {idi}
                {convocatoria}
                {form}
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
            />

            <!-- {#if isSuperAdmin || idi.proyecto.mostrar_recomendaciones}
                <div class="py-24">
                    <h1>Ortografía</h1>
                    {#each idi.proyecto.evaluaciones as evaluacion, i}
                        {#if isSuperAdmin || (evaluacion.finalizado && evaluacion.habilitado)}
                            <div class="bg-zinc-900 p-4 rounded shadow text-white my-2">
                                <p class="text-xs">Evaluador COD-{evaluacion.id}:</p>
                                <p class="whitespace-pre-line text-xs">{evaluacion.idi_evaluacion.ortografia_comentario ? evaluacion.idi_evaluacion.ortografia_comentario : 'Sin recomendación'}</p>
                            </div>
                        {/if}
                    {/each}
                    {#if idi.proyecto.evaluaciones.length == 0}
                        <p class="whitespace-pre-line mt-4 text-xs">El proyecto no ha sido evaluado aún.</p>
                    {/if}
                </div>
            {/if}

            {#if isSuperAdmin || idi.proyecto.mostrar_recomendaciones}
                <div class="py-24">
                    <h1>Redacción</h1>
                    {#each idi.proyecto.evaluaciones as evaluacion, i}
                        {#if isSuperAdmin || (evaluacion.finalizado && evaluacion.habilitado)}
                            <div class="bg-zinc-900 p-4 rounded shadow text-white my-2">
                                <p class="text-xs">Evaluador COD-{evaluacion.id}:</p>
                                <p class="whitespace-pre-line text-xs">{evaluacion.idi_evaluacion.redaccion_comentario ? evaluacion.idi_evaluacion.redaccion_comentario : 'Sin recomendación'}</p>
                            </div>
                        {/if}
                    {/each}
                    {#if idi.proyecto.evaluaciones.length == 0}
                        <p class="whitespace-pre-line mt-4 text-xs">El proyecto no ha sido evaluado aún.</p>
                    {/if}
                </div>
            {/if}

            {#if isSuperAdmin || idi.proyecto.mostrar_recomendaciones}
                <div class="py-24">
                    <h1>Normas APA</h1>
                    {#each idi.proyecto.evaluaciones as evaluacion, i}
                        {#if isSuperAdmin || (evaluacion.finalizado && evaluacion.habilitado)}
                            <div class="bg-zinc-900 p-4 rounded shadow text-white my-2">
                                <p class="text-xs">Evaluador COD-{evaluacion.id}:</p>
                                <p class="whitespace-pre-line text-xs">{evaluacion.idi_evaluacion.normas_apa_comentario ? evaluacion.idi_evaluacion.normas_apa_comentario : 'Sin recomendación'}</p>
                            </div>
                        {/if}
                    {/each}
                    {#if idi.proyecto.evaluaciones.length == 0}
                        <p class="whitespace-pre-line mt-4 text-xs">El proyecto no ha sido evaluado aún.</p>
                    {/if}
                </div>
            {/if} -->
        </fieldset>

        <div>
            <!-- <InfoMessage>
                Se recomienda que antes de dar clic en el botón <strong>Guardar</strong> descargue el borrador de Generalidades en archivo Word. De esta manera si ocurre un error al guardar puede recuperar la información registrada. Luego de descargar el borrador de clic en el botón <strong>Guardar</strong>. Revise que se muestra un mensaje en verde que dice '<strong>
                    El recurso se ha modificado correctamente</strong
                >'. Si después de unos segundos no se muestra el mensaje y al recargar el aplicativo observa que la información no se ha guardado por favor envie un correo a <a href="mailto:sgpssipro@sena.edu.co" class="underline">sgpssipro@sena.edu.co</a>
                desde una cuenta <strong>@sena.edu.co</strong> y describa detalladamente lo ocurrido (Importante adjuntar el borrador e indicar el código del proyecto).
            </InfoMessage> -->
            <!-- <div class="shadow-inner bg-app-200 border-app-400 flex items-center justify-between mt-14 px-8 py-4"> -->
                <!-- <small class="flex items-center text-app-700">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {idi.updated_at}
                </small> -->

                <!-- <Button type="button" on:click={() => (dialogGuardar = true)}>Descargar Generalidades en Word</Button> -->

                <!-- {#if idi.proyecto.allowed.to_update}
                    <LoadingButton loading={$form.processing} form="idi-form">Guardar información</LoadingButton>
                {:else}
                    <span class="inline-block ml-1.5"> El proyecto no se puede modificar </span>
                {/if} -->
            <!-- </div> -->
        </div>
    </form>

    
</AuthenticatedLayout>
