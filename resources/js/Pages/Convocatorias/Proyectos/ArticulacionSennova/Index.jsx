<script>
    import AuthenticatedLayout, { title } from '@/Layouts/Authenticated'
    import { page, useForm } from '@inertiajs/inertia-svelte'
    import { route, checkRole, checkPermission } from '@/Utils'
    import { _ } from 'svelte-i18n'
    import { Inertia } from '@inertiajs/inertia'

    import Stepper from '@/Components/Stepper'
    import Label from '@/Components/Label'
    import PrimaryButton from '@/Components/PrimaryButton'
    import Select from '@/Components/Select'
    import MultipleSelect from '@/Components/MultipleSelect'
    import Textarea from '@/Components/Textarea'
    import Tags from '@/Components/Tags'
    import InfoMessage from '@/Components/InfoMessage'
    import RecomendacionEvaluador from '@/Components/RecomendacionEvaluador'
    import Participantes from '../Participantes/Participantes'

    export let errors
    export let convocatoria
    export let proyecto
    export let areasConocimiento
    export let subareasConocimiento
    export let disciplinasSubareaConocimiento
    export let lineasInvestigacion
    export let gruposInvestigacion
    export let semillerosInvestigacion
    export let redesConocimiento
    export let tematicasEstrategicas
    export let actividadesEconomicas
    export let gruposInvestigacionRelacionados
    export let lineasInvestigacionRelacionadas
    export let semillerosInvestigacionRelacionados
    export let disciplinasSubareaConocimientoRelacionadas
    export let redesConocimientoRelacionadas
    export let actividadesEconomicasRelacionadas
    export let tematicasEstrategicasRelacionadas
    export let proyectosIdiTecnoacademia
    export let proyectosIdiTecnoacademiaRelacionados
    export let centrosFormacion
    export let autorPrincipal
    export let tiposDocumento
    export let tiposVinculacion
    export let roles

    $title = 'Articulación SENNOVA'

    /**
     * Validar si el usuario autenticado es SuperAdmin
     */
    let authUser = $auth.user
    let isSuperAdmin = checkRole(authUser, [1])

    let form = useForm({
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
        proyectos_ejecucion: proyecto.proyectos_ejecucion ? proyecto.proyectos_ejecucion : '',
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
    })

    async function syncTpColumnLong(column, form) {
        return new Promise((resolve) => {
            if (proyecto.allowed.to_update) {
                Inertia.put(
                    route('convocatorias.tp.updateLongColumn', [convocatoria.id, proyecto.id, column]),
                    { [column]: form[column] },
                    {
                        onError: (resp) => resolve(resp),
                        onFinish: () => resolve({}),
                        preserveScroll: true,
                    },
                )
            } else {
                resolve({})
            }
        })
    }

    async function syncTaColumnLong(column, form) {
        return new Promise((resolve) => {
            if (proyecto.allowed.to_update) {
                Inertia.put(
                    route('convocatorias.ta.updateLongColumn', [convocatoria.id, proyecto.id, column]),
                    { [column]: form[column] },
                    {
                        onError: (resp) => resolve(resp),
                        onFinish: () => resolve({}),
                        preserveScroll: true,
                    },
                )
            } else {
                resolve({})
            }
        })
    }

    function submit() {
        if (proyecto.allowed.to_update) {
            $form.post(route('convocatorias.proyectos.articulacion-sennova.store', [convocatoria.id, proyecto.id]), {
                preserveScroll: true,
            })
        }
    }

    let opcionesSiNo = [
        { value: 1, label: 'Si' },
        { value: 2, label: 'No' },
    ]

    let arraySubareasConocimiento = subareasConocimiento.filter(function (obj) {
        return obj.area_conocimiento_id == $form.area_conocimiento_id?.value
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
    <header className="pt-[8rem]" slot="header">
        <Stepper {convocatoria} {proyecto} />
    </header>

    <div className="mt-16">
        <Participantes {centrosFormacion} {autorPrincipal} {convocatoria} {proyecto} {errors} {tiposDocumento} {tiposVinculacion} {roles} />
    </div>

    <h1 className="text-3xl mt-24 mb-8 text-center">Articulación SENNOVA</h1>

    <p className="text-center mb-8">A continuación, registre la información relacionada con la articulación de la línea de {proyecto.codigo_linea_programatica == 70 ? 'TecnoAcademia' : proyecto.codigo_linea_programatica == 69 ? 'TecnoParque' : ''} con las otras líneas de SENNOVA en el centro y la regional:</p>

    <form on:submit|preventDefault={submit}>
        <fieldset disabled={proyecto.allowed.to_update ? undefined : true}>
            {#if proyecto.codigo_linea_programatica == 70}
                <div className="mt-44 grid grid-cols-2">
                    <div>
                        <Label required className="mb-4" labelFor="lineas_investigacion" value="Líneas de Investigación en las cuales se están ejecutando iniciativas o proyectos de la TecnoAcademia" />
                    </div>
                    <div>
                        <MultipleSelect id="lineas_investigacion" bind:selectedValue={$form.lineas_investigacion} items={lineasInvestigacion}  error={errors.lineas_investigacion} placeholder="Buscar por el nombre de la línea de investigación" required />
                    </div>
                </div>

                <div className="mt-44 grid grid-cols-2">
                    <div>
                        <Label required className="mb-4" labelFor="grupos_investigacion" value="Grupos de investigación en los cuales está vinculada la TecnoAcademia" />
                    </div>
                    <div>
                        <MultipleSelect id="grupos_investigacion" bind:selectedValue={$form.grupos_investigacion} items={gruposInvestigacion}  error={errors.grupos_investigacion} placeholder="Buscar por el nombre del grupo de investigación" required />
                    </div>
                </div>

                <div className="mt-44 grid grid-cols-2">
                    <div>
                        <Label required className="mb-4" labelFor="articulacion_semillero" value="¿Está la TecnoAcademia articulada con un semillero?" />
                    </div>
                    <div>
                        <Select items={opcionesSiNo} id="articulacion_semillero" bind:selectedValue={$form.articulacion_semillero} error={errors.articulacion_semillero} autocomplete="off" placeholder="Seleccione una opción" required />
                    </div>
                </div>

                {#if $form.articulacion_semillero?.value == 1}
                    <div className="mt-44 grid grid-cols-2">
                        <div>
                            <Label required className="mb-4" labelFor="semilleros_investigacion" value="Semillero(s) de investigación de la TecnoAcademia" />
                        </div>
                        <div>
                            <MultipleSelect id="semilleros_investigacion" bind:selectedValue={$form.semilleros_investigacion} items={semillerosInvestigacion}  error={errors.semilleros_investigacion} placeholder="Buscar por el nombre del semillero de investigación" required />
                        </div>
                    </div>
                {/if}
                <div className="mt-44 grid grid-cols-2">
                    <div>
                        <Label required className="mb-4" labelFor="proyectos_ejecucion" value="Proyectos o iniciativas en ejecución en el año {convocatoria.year - 1}" />
                    </div>
                    <div>
                        <MultipleSelect id="proyecto_idi_tecnoacademia_id" bind:selectedValue={$form.proyecto_idi_tecnoacademia_id} items={proyectosIdiTecnoacademia}  error={errors.proyecto_idi_tecnoacademia_id} placeholder="Seleccione uno o varias iniciativas" required />

                        <InfoMessage className="mt-10 mb-4">Si aún no ha registrado el proyecto en el módulo de <strong>Proyectos e iniciativas I+D+i TecnoAcademias</strong>, relacione en el siguiente campo el título del proyecto. Se recomienda hacer el registro en el módulo.</InfoMessage>
                        <Textarea label="Proyectos / Iniciativas" maxlength="40000" id="proyectos_ejecucion" error={errors.proyectos_ejecucion} bind:value={$form.proyectos_ejecucion} />
                    </div>
                </div>

                <div className="mt-44 grid grid-cols-2">
                    <div>
                        <Label className="mb-4" labelFor="semilleros_en_formalizacion" value="Semilleros en proceso de formalización (Separados por coma)" />
                    </div>
                    <div>
                        <Tags id="semilleros_en_formalizacion" className="mt-4" enforceWhitelist={false} bind:tags={$form.semilleros_en_formalizacion} placeholder="Nombre del semillero" error={errors.semilleros_en_formalizacion} />
                    </div>
                </div>

                <div className="mt-44 grid grid-cols-2">
                    <div>
                        <Label className="mb-4" labelFor="area_conocimiento_id" value="Área de conocimiento" />
                    </div>
                    <div>
                        <Select id="area_conocimiento_id" items={areasConocimiento} bind:selectedValue={$form.area_conocimiento_id} selectFunctions={[(event) => selectAreaConocimiento(event)]} error={errors.area_conocimiento_id} autocomplete="off" placeholder="Busque por el nombre de la área de conocimiento" />
                    </div>
                </div>
                <div className="mt-44 grid grid-cols-2">
                    <div>
                        <Label className="mb-4" labelFor="subarea_conocimiento_id" value="Subárea de conocimiento" />
                    </div>
                    <div>
                        <Select disabled={$form.area_conocimiento_id ? undefined : true} id="subarea_conocimiento_id" items={arraySubareasConocimiento} bind:selectedValue={$form.subarea_conocimiento_id} selectFunctions={[(event) => selectSubreaConocimiento(event)]} error={errors.subarea_conocimiento_id} autocomplete="off" placeholder="Busque por el nombre de la subárea de conocimiento" />
                    </div>
                </div>
                <div className="mt-44 grid grid-cols-2">
                    <div>
                        <Label required className="mb-4" labelFor="disciplina_subarea_conocimiento_id" value="Disciplina de la subárea de conocimiento" />
                    </div>
                    <div>
                        <MultipleSelect
                            disabled={$form.subarea_conocimiento_id || disciplinasSubareaConocimientoRelacionadas.length > 0 ? undefined : true}
                            id="disciplinas_subarea_conocimiento_id"
                            bind:selectedValue={$form.disciplinas_subarea_conocimiento}
                            items={arrayDisciplinasSubareaConocimiento}

                            error={errors.disciplinas_subarea_conocimiento}
                            placeholder="Disciplinas subárea de concimiento"
                            required
                        />
                    </div>
                </div>

                <div className="mt-44 grid grid-cols-2">
                    <div>
                        <Label required className="mb-4" labelFor="redes_conocimiento" value="Red de conocimiento sectorial" />
                    </div>
                    <div>
                        <MultipleSelect id="redes_conocimiento" bind:selectedValue={$form.redes_conocimiento} items={redesConocimiento}  error={errors.redes_conocimiento} placeholder="Buscar por el nombre del grupo de investigación" required />
                    </div>
                </div>

                <div className="mt-44 grid grid-cols-2">
                    <div>
                        <Label required className="mb-4" labelFor="actividades_economicas" value="¿En cuál de estas actividades económicas se puede aplicar el proyecto?" />
                    </div>
                    <div>
                        <MultipleSelect id="actividades_economicas" bind:selectedValue={$form.actividades_economicas} items={actividadesEconomicas}  error={errors.actividades_economicas} placeholder="Buscar por el nombre del grupo de investigación" required />
                    </div>
                </div>

                <div className="mt-44 grid grid-cols-2">
                    <div>
                        <Label required className="mb-4" labelFor="tematicas_estrategicas" value="Temática estratégica SENA" />
                    </div>
                    <div>
                        <MultipleSelect id="tematicas_estrategicas" bind:selectedValue={$form.tematicas_estrategicas} items={tematicasEstrategicas}  error={errors.tematicas_estrategicas} placeholder="Buscar por el nombre del grupo de investigación" required />
                    </div>
                </div>

                <h6 className="mt-20 mb-12 text-2xl text-center">Articulación con el Centro</h6>

                <div className="mt-44 grid grid-cols-2">
                    <div>
                        <Label required className="mb-4" labelFor="articulacion_centro_formacion" value="Articulación con el centro de formación" />
                    </div>
                    <div>
                        <Textarea maxlength="40000" id="articulacion_centro_formacion" error={errors.articulacion_centro_formacion} bind:value={$form.articulacion_centro_formacion} on:blur={() => syncTaColumnLong('articulacion_centro_formacion', $form)} required />
                    </div>
                </div>

                <div className="mt-44 grid grid-cols-2">
                    <div>
                        <Label required className="mb-4" labelFor="articulacion_programas_centro" value="¿Articulación de la TecnoAcademia en los programas de formación del Centro? " />
                    </div>
                    <div>
                        <Textarea maxlength="40000" id="articulacion_programas_centro" error={errors.articulacion_programas_centro} bind:value={$form.articulacion_programas_centro} on:blur={() => syncTaColumnLong('articulacion_programas_centro', $form)} required />
                    </div>
                </div>

                <div className="mt-44 grid grid-cols-2">
                    <div>
                        <Label required className="mb-4" labelFor="articulacion_bienestar_aprendiz" value="¿Articulación de la TecnoAcademia en las acciones de Bienestar al aprendiz del Centro?  " />
                    </div>
                    <div>
                        <Textarea maxlength="40000" id="articulacion_bienestar_aprendiz" error={errors.articulacion_bienestar_aprendiz} bind:value={$form.articulacion_bienestar_aprendiz} on:blur={() => syncTaColumnLong('articulacion_bienestar_aprendiz', $form)} required />
                    </div>
                </div>

                <div className="mt-44 grid grid-cols-2">
                    <div>
                        <Label required className="mb-4" labelFor="favorecimiento_ruta_formacion" value="¿Acciones conjuntas definidas con el equipo de Articulación con la Media del Centro para favorecer la ruta de formación desde la TecnoAcademia?" />
                    </div>
                    <div>
                        <Textarea maxlength="40000" id="fav" error={errors.favorecimiento_ruta_formacion} bind:value={$form.favorecimiento_ruta_formacion} on:blur={() => syncTaColumnLong('favorecimiento_ruta_formacion', $form)} required />
                    </div>
                </div>

                <div className="py-24">
                    <div className="mt-44 grid grid-cols-2">
                        <div>
                            <Label required className="mb-4" labelFor="lineas_medulares_centro" value="Líneas medulares del Centro con las que se articula la TecnoAcademia" />
                        </div>
                        <div>
                            <Textarea maxlength="40000" id="lineas_medulares_centro" error={errors.lineas_medulares_centro} bind:value={$form.lineas_medulares_centro} on:blur={() => syncTaColumnLong('lineas_medulares_centro', $form)} required />
                        </div>
                    </div>
                    {#if isSuperAdmin || proyecto.mostrar_recomendaciones}
                        <RecomendacionEvaluador className="mt-8">
                            {#each proyecto.evaluaciones as evaluacion, i}
                                {#if isSuperAdmin || (evaluacion.finalizado && evaluacion.habilitado)}
                                    <div className="bg-zinc-900 p-4 rounded shadow text-white my-2">
                                        <p className="text-xs">Evaluador COD-{evaluacion.id}:</p>
                                        <p className="whitespace-pre-line text-xs">{evaluacion.ta_evaluacion.lineas_medulares_centro_comentario ? evaluacion.ta_evaluacion.lineas_medulares_centro_comentario : 'Sin recomendación'}</p>
                                    </div>
                                {/if}
                            {/each}
                            {#if proyecto.evaluaciones.length == 0}
                                <p className="whitespace-pre-line mt-4 text-xs">El proyecto no ha sido evaluado aún.</p>
                            {/if}
                        </RecomendacionEvaluador>
                    {/if}
                </div>
            {:else if proyecto.codigo_linea_programatica == 69}
                <div className="py-24">
                    <div className="grid grid-cols-1">
                        <div>
                            <Label required className="mb-4" labelFor="impacto_centro_formacion" value="Impacto en el centro de formación" />
                        </div>
                        <div>
                            <Textarea maxlength="40000" id="impacto_centro_formacion" error={errors.impacto_centro_formacion} bind:value={$form.impacto_centro_formacion} on:blur={() => syncTpColumnLong('impacto_centro_formacion', $form)} required />
                        </div>
                    </div>
                    {#if (isSuperAdmin && proyecto.evaluaciones.length > 0) || (proyecto.mostrar_recomendaciones && proyecto.evaluaciones.length > 0)}
                        <RecomendacionEvaluador className="mt-8">
                            {#each proyecto.evaluaciones as evaluacion, i}
                                {#if isSuperAdmin || (evaluacion.finalizado && evaluacion.habilitado)}
                                    <div className="bg-zinc-900 p-4 rounded shadow text-white my-2">
                                        <p className="text-xs">Evaluador COD-{evaluacion.id}:</p>
                                        <p className="whitespace-pre-line text-xs">{evaluacion.tp_evaluacion.impacto_centro_formacion_comentario ? evaluacion.tp_evaluacion.impacto_centro_formacion_comentario : 'Sin recomendación'}</p>
                                    </div>
                                {/if}
                            {/each}
                            {#if proyecto.evaluaciones.length == 0}
                                <p className="whitespace-pre-line mt-4 text-xs">El proyecto no ha sido evaluado aún.</p>
                            {/if}
                        </RecomendacionEvaluador>
                    {/if}
                </div>

                <div className="py-24">
                    <div className="grid grid-cols-1">
                        <div>
                            <Label required className="mb-4" labelFor="aportacion_semilleros_grupos" value="Comente la articulación y aporte del TecnoParque proyectada para el {convocatoria.year} a los semilleros y grupos de investigación." />
                        </div>
                        <div>
                            <Textarea maxlength="40000" id="aportacion_semilleros_grupos" error={errors.aportacion_semilleros_grupos} bind:value={$form.aportacion_semilleros_grupos} on:blur={() => syncTpColumnLong('aportacion_semilleros_grupos', $form)} required />
                        </div>
                    </div>
                </div>

                <div className="py-24">
                    <div className="grid grid-cols-1">
                        <div>
                            <Label required className="mb-4" labelFor="proyeccion_con_st" value="¿Cómo proyecta la articulación en el {convocatoria.year}, el Tecnoparque con la línea de Servicios Tecnológicos?" />
                        </div>
                        <div>
                            <Textarea maxlength="40000" id="proyeccion_con_st" error={errors.proyeccion_con_st} bind:value={$form.proyeccion_con_st} on:blur={() => syncTpColumnLong('proyeccion_con_st', $form)} required />
                        </div>
                    </div>
                </div>

                <div className="py-24">
                    <div className="grid grid-cols-1">
                        <div>
                            <Label required className="mb-4" labelFor="proyeccion_extensionismo_tecnologico" value="¿Cómo proyecta la articulación en el {convocatoria.year}, el Tecnoparque con la línea de Extensionismo Tecnológico?" />
                        </div>
                        <div>
                            <Textarea maxlength="40000" id="proyeccion_extensionismo_tecnologico" error={errors.proyeccion_extensionismo_tecnologico} bind:value={$form.proyeccion_extensionismo_tecnologico} on:blur={() => syncTpColumnLong('proyeccion_extensionismo_tecnologico', $form)} required />
                        </div>
                    </div>
                </div>

                <div className="py-24">
                    <div className="grid grid-cols-1">
                        <div>
                            <Label required className="mb-4" labelFor="proyeccion_centros_desarrollo" value="¿Cómo proyecta la articulación en el {convocatoria.year}, el Tecnoparque con los centros de desarrollo empresarial de la Regional?" />
                        </div>
                        <div>
                            <Textarea maxlength="40000" id="proyeccion_centros_desarrollo" error={errors.proyeccion_centros_desarrollo} bind:value={$form.proyeccion_centros_desarrollo} on:blur={() => syncTpColumnLong('proyeccion_centros_desarrollo', $form)} required />
                        </div>
                    </div>
                </div>

                <div className="py-24">
                    <div className="grid grid-cols-1">
                        <div>
                            <Label required className="mb-4" labelFor="proyeccion_formacion_regional" value="¿Cómo proyecta en el {convocatoria.year}, el Tecnoparque contribuir a la formación en la Regional o en el SENA?" />
                        </div>
                        <div>
                            <Textarea maxlength="40000" id="proyeccion_formacion_regional" error={errors.proyeccion_formacion_regional} bind:value={$form.proyeccion_formacion_regional} on:blur={() => syncTpColumnLong('proyeccion_formacion_regional', $form)} required />
                        </div>
                    </div>
                </div>
                <h1 className="text-4xl text-center">Semilleros y Grupos de investigación</h1>

                <div className="mt-44 grid grid-cols-2">
                    <div>
                        <Label required className="mb-4" labelFor="semilleros_investigacion" value="Semillero(s) de investigación" />
                    </div>
                    <div>
                        <MultipleSelect id="semilleros_investigacion" bind:selectedValue={$form.semilleros_investigacion} items={semillerosInvestigacion}  error={errors.semilleros_investigacion} placeholder="Buscar por el nombre del semillero de investigación" required />
                    </div>
                </div>

                <div className="mt-44 grid grid-cols-2">
                    <div>
                        <Label required className="mb-4" labelFor="grupos_investigacion" value="Grupos de investigación" />
                    </div>
                    <div>
                        <MultipleSelect id="grupos_investigacion" bind:selectedValue={$form.grupos_investigacion} items={gruposInvestigacion}  error={errors.grupos_investigacion} placeholder="Buscar por el nombre del grupo de investigación" required />
                    </div>
                </div>
            {/if}
        </fieldset>
        <div className="shadow-inner bg-app-200 border-app-400 flex items-center justify-between mt-14 px-8 py-4">
            {#if proyecto.allowed.to_update}
                <PrimaryButton loading={$form.processing} className="ml-auto" type="submit">Guardar</PrimaryButton>
            {/if}
        </div>
    </form>
</AuthenticatedLayout>
