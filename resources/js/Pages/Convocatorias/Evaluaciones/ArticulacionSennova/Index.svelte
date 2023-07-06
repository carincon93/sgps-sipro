<script>
    import AuthenticatedLayout, { title } from '@/Layouts/Authenticated'
    import { page, useForm } from '@inertiajs/inertia-svelte'
    import { route, checkRole, checkPermission } from '@/Utils'
    import { _ } from 'svelte-i18n'

    import EvaluationStepper from '@/Shared/EvaluationStepper'
    import Label from '@/Shared/Label'
    import LoadingButton from '@/Shared/LoadingButton'
    import Select from '@/Shared/Select'
    import SelectMulti from '@/Shared/SelectMulti'
    import Textarea from '@/Shared/Textarea'
    import Tags from '@/Shared/Tags'
    import InfoMessage from '@/Shared/InfoMessage'
    import Switch from '@/Shared/Switch'

    export let errors
    export let convocatoria
    export let areasConocimiento
    export let evaluacion
    export let proyecto
    export let lineasInvestigacion
    export let gruposInvestigacion
    export let semillerosInvestigacion
    export let gruposInvestigacionRelacionados
    export let lineasInvestigacionRelacionadas
    export let semillerosInvestigacionRelacionados
    export let otrasEvaluaciones
    export let subareasConocimiento
    export let disciplinasSubareaConocimiento
    export let disciplinasSubareaConocimientoRelacionadas
    export let redesConocimientoRelacionadas
    export let actividadesEconomicasRelacionadas
    export let tematicasEstrategicasRelacionadas
    export let proyectosIdiTecnoacademiaRelacionados
    export let proyectosIdiTecnoacademia
    export let redesConocimiento
    export let actividadesEconomicas
    export let tematicasEstrategicas

    $title = 'Articulación SENNOVA'

    /**
     * Validar si el usuario autenticado es SuperAdmin
     */
    let authUser = $page.props.auth.user
    let isSuperAdmin = checkRole(authUser, [1])

    let opcionesSiNo = [
        { value: 1, label: 'Si' },
        { value: 2, label: 'No' },
    ]
    let articulacionSennovaInfo = {
        area_conocimiento_id: null,
        subarea_conocimiento_id: null,
        lineas_investigacion: lineasInvestigacionRelacionadas?.length > 0 ? lineasInvestigacionRelacionadas : null,
        grupos_investigacion: gruposInvestigacionRelacionados?.length > 0 ? gruposInvestigacionRelacionados : null,
        semilleros_investigacion: semillerosInvestigacionRelacionados?.length > 0 ? semillerosInvestigacionRelacionados : null,
        disciplinas_subarea_conocimiento: disciplinasSubareaConocimientoRelacionadas?.length > 0 ? disciplinasSubareaConocimientoRelacionadas : null,
        redes_conocimiento: redesConocimientoRelacionadas?.length > 0 ? redesConocimientoRelacionadas : null,
        actividades_economicas: actividadesEconomicasRelacionadas?.length > 0 ? actividadesEconomicasRelacionadas : null,
        tematicas_estrategicas: tematicasEstrategicasRelacionadas?.length > 0 ? tematicasEstrategicasRelacionadas : null,
        proyecto_idi_tecnoacademia_id: proyectosIdiTecnoacademiaRelacionados?.length > 0 ? proyectosIdiTecnoacademiaRelacionados : null,
        proyectos_ejecucion: proyecto.proyectos_ejecucion,
        semilleros_en_formalizacion: proyecto.semilleros_en_formalizacion,
        articulacion_semillero: proyecto.articulacion_semillero,
        articulacion_centro_formacion: proyecto.articulacion_centro_formacion,
        lineas_medulares_centro: proyecto.lineas_medulares_centro,
        articulacion_programas_centro: proyecto.articulacion_programas_centro,
        articulacion_bienestar_aprendiz: proyecto.articulacion_bienestar_aprendiz,
        favorecimiento_ruta_formacion: proyecto.favorecimiento_ruta_formacion,

        // Tp
        impacto_centro_formacion: proyecto.impacto_centro_formacion,
        aportacion_semilleros_grupos: proyecto.aportacion_semilleros_grupos,
        proyeccion_con_st: proyecto.proyeccion_con_st,
        proyeccion_extensionismo_tecnologico: proyecto.proyeccion_extensionismo_tecnologico,
        proyeccion_centros_desarrollo: proyecto.proyeccion_centros_desarrollo,
        proyeccion_formacion_regional: proyecto.proyeccion_formacion_regional,
    }

    let formTaTpEvaluacion = useForm({
        articulacion_sennova_comentario: evaluacion.ta_evaluacion ? (evaluacion.ta_evaluacion.articulacion_sennova_comentario ? evaluacion.ta_evaluacion.articulacion_sennova_comentario : '' ) : evaluacion.tp_evaluacion ? (evaluacion.tp_evaluacion.articulacion_sennova_comentario ? evaluacion.tp_evaluacion.articulacion_sennova_comentario : '') : '',
        articulacion_sennova_requiere_comentario: evaluacion.ta_evaluacion ? (evaluacion.ta_evaluacion.articulacion_sennova_comentario == null ? true : false) : evaluacion.tp_evaluacion ? (evaluacion.tp_evaluacion.articulacion_sennova_comentario == null ? true : false) : null,
        impacto_centro_formacion_comentario: evaluacion.ta_evaluacion ? (evaluacion.ta_evaluacion.impacto_centro_formacion_comentario ? evaluacion.ta_evaluacion.impacto_centro_formacion_comentario : '') : evaluacion.tp_evaluacion ? (evaluacion.tp_evaluacion.impacto_centro_formacion_comentario ? evaluacion.tp_evaluacion.impacto_centro_formacion_comentario : '') : '',
        impacto_centro_formacion_requiere_comentario: evaluacion.ta_evaluacion ? (evaluacion.ta_evaluacion.impacto_centro_formacion_comentario == null ? true : false) : evaluacion.tp_evaluacion ? (evaluacion.tp_evaluacion.impacto_centro_formacion_comentario == null ? true : false) : null,

        lineas_medulares_centro_comentario: evaluacion.ta_evaluacion.lineas_medulares_centro_comentario ? evaluacion.ta_evaluacion.lineas_medulares_centro_comentario : '',
        lineas_medulares_centro_requiere_comentario: evaluacion.ta_evaluacion ? (evaluacion.ta_evaluacion.lineas_medulares_centro_comentario == null ? true : false) : null,
    })
    function submitTaTpEvaluacion() {
        if (isSuperAdmin || (checkRole(authUser, [11, 5]) && evaluacion.finalizado == false && evaluacion.habilitado == true && evaluacion.modificable == true)) {
            $formTaTpEvaluacion.put(route('convocatorias.evaluaciones.articulacion-sennova.guardar-evaluacion', [convocatoria.id, evaluacion.id]), {
                preserveScroll: true,
            })
        }
    }

    let arraySubareasConocimiento = subareasConocimiento.filter(function (obj) {
        return obj.area_conocimiento_id == articulacionSennovaInfo.area_conocimiento_id?.value
    })
    function selectAreaConocimiento(event) {
        arraySubareasConocimiento = subareasConocimiento.filter(function (obj) {
            return obj.area_conocimiento_id == event.detail?.value
        })
    }

    let arrayDisciplinasSubareaConocimiento = []
    function selectSubreaConocimiento(event) {
        arrayDisciplinasSubareaConocimiento = disciplinasSubareaConocimiento.filter(function (obj) {
            return obj.subarea_conocimiento_id == event.detail?.value
        })
    }
</script>

<AuthenticatedLayout>
    <header class="pt-[8rem]" slot="header">
        <EvaluationStepper {convocatoria} {evaluacion} {proyecto} />
    </header>

    <h1 class="text-3xl mt-24 mb-8 text-center">Articulación SENNOVA</h1>

    <p class="text-center mb-8">A continuación, registre la información relacionada con la articulación de la línea de {proyecto.codigo_linea_programatica == 70 ? 'TecnoAcademia' : proyecto.codigo_linea_programatica == 69 ? 'TecnoParque' : ''} con las otras líneas de SENNOVA en el centro y la regional:</p>
    {#if proyecto.codigo_linea_programatica == 70}
        <form>
            <fieldset disabled={proyecto.allowed.to_update ? undefined : true}>
                <div class="mt-44 grid grid-cols-2">
                    <div>
                        <Label class="mb-4" labelFor="lineas_investigacion" value="Líneas de Investigación en las cuales se están ejecutando iniciativas o proyectos de la TecnoAcademia" />
                    </div>
                    <div>
                        <SelectMulti id="lineas_investigacion" bind:selectedValue={articulacionSennovaInfo.lineas_investigacion} items={lineasInvestigacion} isMulti={true} error={errors.lineas_investigacion} placeholder="Buscar por el nombre de la línea de investigación" disabled required />
                    </div>
                </div>

                <div class="mt-44 grid grid-cols-2">
                    <div>
                        <Label class="mb-4" labelFor="grupos_investigacion" value="Grupos de investigación en los cuales está vinculada la TecnoAcademia" />
                    </div>
                    <div>
                        <SelectMulti id="grupos_investigacion" bind:selectedValue={articulacionSennovaInfo.grupos_investigacion} items={gruposInvestigacion} isMulti={true} error={errors.grupos_investigacion} placeholder="Buscar por el nombre del grupo de investigación" disabled required />
                    </div>
                </div>

                <div class="mt-44 grid grid-cols-2">
                    <div>
                        <Label class="mb-4" labelFor="articulacion_semillero" value="¿Está la TecnoAcademia articulada con un semillero?" />
                    </div>
                    <div>
                        <Select items={opcionesSiNo} id="articulacion_semillero" bind:selectedValue={articulacionSennovaInfo.articulacion_semillero} error={errors.articulacion_semillero} autocomplete="off" placeholder="Seleccione una opción" disabled required />
                    </div>
                </div>

                {#if articulacionSennovaInfo?.value == 1}
                    <div class="mt-44 grid grid-cols-2">
                        <div>
                            <Label class="mb-4" labelFor="semilleros_investigacion" value="Semillero(s) de investigación de la TecnoAcademia" />
                        </div>
                        <div>
                            <SelectMulti id="semilleros_investigacion" bind:selectedValue={articulacionSennovaInfo.semilleros_investigacion} items={semillerosInvestigacion} isMulti={true} error={errors.semilleros_investigacion} placeholder="Buscar por el nombre del semillero de investigación" disabled required />
                        </div>
                    </div>
                {/if}
                <div class="mt-44 grid grid-cols-2">
                    <div>
                        <Label class="mb-4" labelFor="proyectos_ejecucion" value="Proyectos o iniciativas en ejecución en el año {convocatoria.year - 1}" />
                    </div>
                    <div>
                        <SelectMulti id="proyecto_idi_tecnoacademia_id" bind:selectedValue={articulacionSennovaInfo.proyecto_idi_tecnoacademia_id} items={proyectosIdiTecnoacademia} isMulti={true} error={errors.proyecto_idi_tecnoacademia_id} placeholder="Seleccione uno o varias iniciativas" disabled required />

                        <InfoMessage class="mt-10 mb-4">Si aún no ha registrado el proyecto en el módulo de <strong>Proyectos e iniciativas I+D+i TecnoAcademias</strong>, relacione en el siguiente campo el título del proyecto. Se recomienda hacer el registro en el módulo.</InfoMessage>
                        <Textarea label="Proyectos / Iniciativas" maxlength="40000" id="proyectos_ejecucion" error={errors.proyectos_ejecucion} bind:value={articulacionSennovaInfo.proyectos_ejecucion} />
                    </div>
                </div>

                <div class="mt-44 grid grid-cols-2">
                    <div>
                        <Label class="mb-4" labelFor="semilleros_en_formalizacion" value="Semilleros en proceso de formalización (Separados por coma)" />
                    </div>
                    <div>
                        <Tags id="semilleros_en_formalizacion" class="mt-4" enforceWhitelist={false} bind:tags={articulacionSennovaInfo.semilleros_en_formalizacion} placeholder="Nombre del semillero" error={errors.semilleros_en_formalizacion} />
                    </div>
                </div>

                <div class="mt-44 grid grid-cols-2">
                    <div>
                        <Label class="mb-4" labelFor="disciplina_subarea_conocimiento_id" value="Disciplina de la subárea de conocimiento" />
                    </div>
                    <div>
                        <SelectMulti disabled id="disciplinas_subarea_conocimiento_id" bind:selectedValue={articulacionSennovaInfo.disciplinas_subarea_conocimiento} items={arrayDisciplinasSubareaConocimiento} isMulti={true} error={errors.disciplinas_subarea_conocimiento} placeholder="Disciplinas subárea de concimiento" required />
                    </div>
                </div>

                <div class="mt-44 grid grid-cols-2">
                    <div>
                        <Label class="mb-4" labelFor="redes_conocimiento" value="Red de conocimiento sectorial" />
                    </div>
                    <div>
                        <SelectMulti id="redes_conocimiento" bind:selectedValue={articulacionSennovaInfo.redes_conocimiento} items={redesConocimiento} isMulti={true} error={errors.redes_conocimiento} placeholder="Buscar por el nombre del grupo de investigación" disabled required />
                    </div>
                </div>

                <div class="mt-44 grid grid-cols-2">
                    <div>
                        <Label class="mb-4" labelFor="actividades_economicas" value="¿En cuál de estas actividades económicas se puede aplicar el proyecto?" />
                    </div>
                    <div>
                        <SelectMulti id="actividades_economicas" bind:selectedValue={articulacionSennovaInfo.actividades_economicas} items={actividadesEconomicas} isMulti={true} error={errors.actividades_economicas} placeholder="Buscar por el nombre del grupo de investigación" disabled required />
                    </div>
                </div>

                <div class="mt-44 grid grid-cols-2">
                    <div>
                        <Label class="mb-4" labelFor="tematicas_estrategicas" value="Temática estratégica SENA" />
                    </div>
                    <div>
                        <SelectMulti id="tematicas_estrategicas" bind:selectedValue={articulacionSennovaInfo.tematicas_estrategicas} items={tematicasEstrategicas} isMulti={true} error={errors.tematicas_estrategicas} placeholder="Buscar por el nombre del grupo de investigación" disabled required />
                    </div>
                </div>

                <h6 class="mt-20 mb-12 text-2xl text-center">Articulación con el Centro</h6>

                <div class="mt-44 grid grid-cols-2">
                    <div>
                        <Label class="mb-4" labelFor="articulacion_centro_formacion" value="Articulación con el centro de formación" />
                    </div>
                    <div>
                        <Textarea maxlength="40000" id="articulacion_centro_formacion" error={errors.articulacion_centro_formacion} bind:value={articulacionSennovaInfo.articulacion_centro_formacion} disabled />
                    </div>
                </div>

                <div class="mt-44 grid grid-cols-2">
                    <div>
                        <Label class="mb-4" labelFor="articulacion_programas_centro" value="¿Articulación de la TecnoAcademia en los programas de formación del Centro? " />
                    </div>
                    <div>
                        <Textarea maxlength="40000" id="articulacion_programas_centro" error={errors.articulacion_programas_centro} bind:value={articulacionSennovaInfo.articulacion_programas_centro} disabled />
                    </div>
                </div>

                <div class="mt-44 grid grid-cols-2">
                    <div>
                        <Label class="mb-4" labelFor="articulacion_bienestar_aprendiz" value="¿Articulación de la TecnoAcademia en las acciones de Bienestar al aprendiz del Centro?  " />
                    </div>
                    <div>
                        <Textarea maxlength="40000" id="articulacion_bienestar_aprendiz" error={errors.articulacion_bienestar_aprendiz} bind:value={articulacionSennovaInfo.articulacion_bienestar_aprendiz} disabled />
                    </div>
                </div>

                <div class="mt-44 grid grid-cols-2">
                    <div>
                        <Label class="mb-4" labelFor="favorecimiento_ruta_formacion" value="¿Acciones conjuntas definidas con el equipo de Articulación con la Media del Centro para favorecer la ruta de formación desde la TecnoAcademia?" />
                    </div>
                    <div>
                        <Textarea maxlength="40000" id="fav" error={errors.favorecimiento_ruta_formacion} bind:value={articulacionSennovaInfo.favorecimiento_ruta_formacion} disabled />
                    </div>
                </div>

                <div class="py-24">
                    <div class="mt-44 grid grid-cols-2">
                        <div>
                            <Label class="mb-4" labelFor="lineas_medulares_centro" value="Líneas medulares del Centro con las que se articula la TecnoAcademia" />
                        </div>
                        <div>
                            <Textarea maxlength="40000" id="lineas_medulares_centro" error={errors.lineas_medulares_centro} bind:value={articulacionSennovaInfo.lineas_medulares_centro} disabled />
                        </div>
                    </div>
                </div>
            </fieldset>
            <div class="shadow-inner bg-app-200 border-app-400 flex items-center justify-between mt-14 px-8 py-4">
                {#if proyecto.allowed.to_update}
                    <LoadingButton loading={articulacionSennovaInfo.processing} class="ml-auto" type="submit">Guardar</LoadingButton>
                {/if}
            </div>
        </form>
    {:else if proyecto.codigo_linea_programatica == 69}
        <form>
            <div class="py-24">
                <div class="grid grid-cols-1">
                    <div>
                        <Label class="mb-4" labelFor="impacto_centro_formacion" value="Impacto en el centro de formación" />
                    </div>
                    <div>
                        <Textarea maxlength="40000" id="impacto_centro_formacion" error={errors.impacto_centro_formacion} bind:value={articulacionSennovaInfo.impacto_centro_formacion} disabled />
                    </div>
                </div>
            </div>

            <div class="py-24">
                <div class="grid grid-cols-1">
                    <div>
                        <Label class="mb-4" labelFor="aportacion_semilleros_grupos" value="Comente la articulación y aporte del TecnoParque proyectada para el {convocatoria.year} a los semilleros y grupos de investigación." />
                    </div>
                    <div>
                        <Textarea maxlength="40000" id="aportacion_semilleros_grupos" error={errors.aportacion_semilleros_grupos} bind:value={articulacionSennovaInfo.aportacion_semilleros_grupos} disabled />
                    </div>
                </div>
            </div>

            <div class="py-24">
                <div class="grid grid-cols-1">
                    <div>
                        <Label class="mb-4" labelFor="proyeccion_con_st" value="¿Cómo proyecta la articulación en el {convocatoria.year}, el Tecnoparque con la línea de Servicios Tecnológicos?" />
                    </div>
                    <div>
                        <Textarea maxlength="40000" id="proyeccion_con_st" error={errors.proyeccion_con_st} bind:value={articulacionSennovaInfo.proyeccion_con_st} disabled />
                    </div>
                </div>
            </div>

            <div class="py-24">
                <div class="grid grid-cols-1">
                    <div>
                        <Label class="mb-4" labelFor="proyeccion_extensionismo_tecnologico" value="Cómo proyecta la articulación en el {convocatoria.year}, el Tecnoparque con la línea de Extensionismo Tecnológico?" />
                    </div>
                    <div>
                        <Textarea maxlength="40000" id="proyeccion_extensionismo_tecnologico" error={errors.proyeccion_extensionismo_tecnologico} bind:value={articulacionSennovaInfo.proyeccion_extensionismo_tecnologico} disabled />
                    </div>
                </div>
            </div>

            <div class="py-24">
                <div class="grid grid-cols-1">
                    <div>
                        <Label class="mb-4" labelFor="proyeccion_centros_desarrollo" value="¿Cómo proyecta la articulación en el {convocatoria.year}, el Tecnoparque con los centros de desarrollo empresarial de la Regional?" />
                    </div>
                    <div>
                        <Textarea maxlength="40000" id="proyeccion_centros_desarrollo" error={errors.proyeccion_centros_desarrollo} bind:value={articulacionSennovaInfo.proyeccion_centros_desarrollo} disabled />
                    </div>
                </div>
            </div>

            <div class="py-24">
                <div class="grid grid-cols-1">
                    <div>
                        <Label class="mb-4" labelFor="proyeccion_formacion_regional" value="¿Cómo proyecta en el {convocatoria.year}, el Tecnoparque contribuir a la formación en la Regional o en el SENA?" />
                    </div>
                    <div>
                        <Textarea maxlength="40000" id="proyeccion_formacion_regional" error={errors.proyeccion_formacion_regional} bind:value={articulacionSennovaInfo.proyeccion_formacion_regional} disabled />
                    </div>
                </div>
            </div>
            <h1 class="text-4xl text-center">Semilleros y Grupos de investigación</h1>

            <div class="mt-44 grid grid-cols-2">
                <div>
                    <Label class="mb-4" labelFor="semilleros_investigacion" value="Semillero(s) de investigación" />
                </div>
                <div>
                    <SelectMulti id="semilleros_investigacion" bind:selectedValue={articulacionSennovaInfo.semilleros_investigacion} items={semillerosInvestigacion} isMulti={true} error={errors.semilleros_investigacion} placeholder="Buscar por el nombre del semillero de investigación" disabled required />
                </div>
            </div>

            <div class="mt-44 grid grid-cols-2">
                <div>
                    <Label class="mb-4" labelFor="grupos_investigacion" value="Grupos de investigación" />
                </div>
                <div>
                    <SelectMulti id="grupos_investigacion" bind:selectedValue={articulacionSennovaInfo.grupos_investigacion} items={gruposInvestigacion} isMulti={true} error={errors.grupos_investigacion} placeholder="Buscar por el nombre del grupo de investigación" disabled required />
                </div>
            </div>
        </form>
    {/if}

    <div class="mt-16">
        <h1 class="text-3xl mt-24 mb-8 text-center" id="evaluacion">Evaluación</h1>
        <form on:submit|preventDefault={submitTaTpEvaluacion}>
            <div class="mt-16">
                <InfoMessage>
                    <div class="mt-4">
                        <!-- {#if checkRole(authUser, [5]) && evaluacion.evaluacion_final}
                                {#each otrasEvaluaciones as evaluacion}
                                    <div class="mb-8">
                                        <h4>Evaluador(a): <span class="font-black capitalize">{evaluacion.evaluacion.evaluador.nombre}</span></h4>
                                        {evaluacion.articulacion_sennova_comentario ? evaluacion.articulacion_sennova_comentario : 'Estado: El evaluador(a) da cumplimiento al ítem'}
                                        <br />
                                    </div>
                                {/each}
                            {/if} -->
                        <p>¿La articulación SENNOVA está definida correctamente? Por favor seleccione si Cumple o No cumple.</p>
                        <Switch onMessage="Cumple" offMessage="No cumple" disabled={isSuperAdmin ? undefined : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : undefined} bind:checked={$formTaTpEvaluacion.articulacion_sennova_requiere_comentario} />
                        {#if $formTaTpEvaluacion.articulacion_sennova_requiere_comentario == false}
                            <Textarea
                                disabled={isSuperAdmin ? undefined : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : undefined}
                                label="Comentario"
                                class="mt-4"
                                maxlength="40000"
                                id="articulacion_sennova_comentario"
                                bind:value={$formTaTpEvaluacion.articulacion_sennova_comentario}
                                error={errors.articulacion_sennova_comentario}
                                required
                            />
                        {/if}
                    </div>
                </InfoMessage>
            </div>
            <InfoMessage>
                <div class="mt-4">
                    <p>¿El impacto en el centro de formación es correcto? Por favor seleccione si Cumple o No cumple</p>
                    <Switch onMessage="Cumple" offMessage="No cumple" disabled={isSuperAdmin ? undefined : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : undefined} bind:checked={$formTaTpEvaluacion.impacto_centro_formacion_requiere_comentario} />
                    {#if $formTaTpEvaluacion.impacto_centro_formacion_requiere_comentario == false}
                        <Textarea
                            disabled={isSuperAdmin ? undefined : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : undefined}
                            label="Comentario"
                            class="mt-4"
                            maxlength="40000"
                            id="impacto_centro_formacion_comentario"
                            bind:value={$formTaTpEvaluacion.impacto_centro_formacion_comentario}
                            error={errors.impacto_centro_formacion_comentario}
                            required
                        />
                    {/if}
                </div>
            </InfoMessage>

            {#if proyecto.codigo_linea_programatica == 70}
                <InfoMessage>
                    <div class="mt-4">
                        <!-- {#if checkRole(authUser, [5]) && evaluacion.evaluacion_final}
                            {#each otrasEvaluaciones as evaluacion}
                                <div class="mb-8">
                                    <h4>Evaluador(a): <span class="font-black capitalize">{evaluacion.evaluacion.evaluador.nombre}</span></h4>
                                    {evaluacion.lineas_medulares_centro_comentario ? evaluacion.lineas_medulares_centro_comentario : 'Estado: El evaluador(a) da cumplimiento al ítem'}
                                    <hr />
                                </div>
                            {/each}
                        {/if} -->
                        <p>¿La información sobre las líneas medulares es correcta? Por favor seleccione si Cumple o No cumple.</p>
                        <Switch onMessage="Cumple" offMessage="No cumple" disabled={isSuperAdmin ? undefined : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : undefined} bind:checked={$formTaTpEvaluacion.lineas_medulares_centro_requiere_comentario} />
                        {#if $formTaTpEvaluacion.lineas_medulares_centro_requiere_comentario == false}
                            <Textarea
                                disabled={isSuperAdmin ? undefined : evaluacion.finalizado == true || evaluacion.habilitado == false || evaluacion.modificable == false ? true : undefined}
                                label="Comentario"
                                class="mt-4"
                                maxlength="40000"
                                id="lineas_medulares_centro_comentario"
                                bind:value={$formTaTpEvaluacion.lineas_medulares_centro_comentario}
                                error={errors.lineas_medulares_centro_comentario}
                                required
                            />
                        {/if}
                    </div>
                </InfoMessage>
            {/if}
            <div class="shadow-inner bg-app-200 border-app-400 bottom-0 flex items-center justify-between mt-14 px-8 py-4 sticky">
                {#if isSuperAdmin || (checkRole(authUser, [11, 5]) && evaluacion.finalizado == false && evaluacion.habilitado == true && evaluacion.modificable == true)}
                    <LoadingButton loading={$formTaTpEvaluacion.processing} class="ml-auto" type="submit">Guardar</LoadingButton>
                {/if}
            </div>
        </form>
    </div>
</AuthenticatedLayout>
