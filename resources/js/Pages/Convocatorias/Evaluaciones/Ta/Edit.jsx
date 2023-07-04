<script>
    import AuthenticatedLayout, { title } from '@/Layouts/Authenticated'
    import { useForm, page } from '@inertiajs/inertia-svelte'
    import { route, checkRole, checkPermission, monthDiff } from '@/Utils'
    import { _ } from 'svelte-i18n'
    import axios from 'axios'

    import Button from '@/Shared/Button'
    import LoadingButton from '@/Shared/LoadingButton'
    import EvaluationStepper from '@/Shared/EvaluationStepper'
    import Textarea from '@/Shared/Textarea'
    import InfoMessage from '@/Shared/InfoMessage'
    import Dialog from '@/Shared/Dialog'
    import Switch from '@/Shared/Switch'

    import TaForm from '../../Proyectos/Ta/TaForm.svelte'

    export let errors
    export let convocatoria
    export let ta
    export let taEvaluacion
    export let lineasProgramaticas
    export let lineasTecnoacademia
    export let proyectoMunicipios
    export let otrasEvaluaciones
    export let proyectoMunicipiosImpactar
    export let tecnoacademiaRelacionada
    export let disenosCurricularesRelacionados
    export let lineasTecnoacademiaRelacionadas
    export let programasFormacionSinRegistroRelacionados

    $: $title = ta ? ta.titulo : null

    let opcionesSiNo = [
        { value: 1, label: 'Si' },
        { value: 2, label: 'No' },
    ]

    let dialogSegundaEvaluacion = convocatoria.fase == 4 ? true : false
    let proyectoDialogOpen = taEvaluacion.evaluacion.clausula_confidencialidad == false ? true : false

    let codigoLineaProgramatica

    $: if (codigoLineaProgramatica) {
        taInfo.codigo_linea_programatica = codigoLineaProgramatica.codigo
    } else {
        taInfo.codigo_linea_programatica = ta.codigo_linea_programatica
    }

    /**
     * Validar si el usuario autenticado es SuperAdmin
     */
    let authUser = $page.props.auth.user
    let isSuperAdmin = checkRole(authUser, [1])

    let taInfo = useForm({
        centro_formacion_id: ta.proyecto.centro_formacion_id,
        linea_programatica_id: ta.proyecto.linea_programatica_id,
        fecha_inicio: ta.fecha_inicio,
        fecha_finalizacion: ta.fecha_finalizacion,
        max_meses_ejecucion: ta.max_meses_ejecucion,
        resumen: ta.resumen,
        resumen_regional: ta.resumen_regional,
        antecedentes: ta.antecedentes,
        justificacion_problema: ta.justificacion_problema,
        antecedentes_tecnoacademia: ta.antecedentes_tecnoacademia,
        retos_oportunidades: ta.retos_oportunidades,
        pertinencia_territorio: ta.pertinencia_territorio,
        marco_conceptual: ta.marco_conceptual,
        municipios: proyectoMunicipios.length > 0 ? proyectoMunicipios : null,
        municipios_impactar: proyectoMunicipiosImpactar.length > 0 ? proyectoMunicipiosImpactar : null,
        impacto_municipios: ta.impacto_municipios,
        nombre_instituciones: ta.nombre_instituciones,
        nombre_instituciones_programas: ta.nombre_instituciones_programas,
        nuevas_instituciones: ta.nuevas_instituciones,
        articulacion_centro_formacion: ta.articulacion_centro_formacion,
        proyectos_macro: ta.proyectos_macro,
        lineas_medulares_centro: ta.lineas_medulares_centro,
        lineas_tecnologicas_centro: ta.lineas_tecnologicas_centro,
        proyeccion_nuevas_instituciones: ta.proyeccion_nuevas_instituciones,
        proyeccion_articulacion_media: ta.proyeccion_articulacion_media,
        bibliografia: ta.bibliografia,
        tecnoacademia_id: tecnoacademiaRelacionada,
        tecnoacademia_linea_tecnoacademia_id: lineasTecnoacademiaRelacionadas,
        codigo_linea_programatica: null,
        programas_formacion_articulados: programasFormacionSinRegistroRelacionados.length > 0 ? programasFormacionSinRegistroRelacionados : null,
        diseno_curricular_id: disenosCurricularesRelacionados.length > 0 ? disenosCurricularesRelacionados : null,
        logros_vigencia_anterior: ta.logros_vigencia_anterior,
    })

    console.log(taInfo.tecnoacademia_linea_tecnoacademia_id)

    let regionalIEArticulacion
    $: whitelistInstitucionesEducativasArticular = []
    $: if (regionalIEArticulacion) {
        axios
            .get('https://www.datos.gov.co/resource/cfw5-qzt5.json?cod_dane_departamento=' + regionalIEArticulacion?.codigo)
            .then(function (response) {
                // handle success
                response.data.map((item) => {
                    whitelistInstitucionesEducativasArticular.push(item.nombre_establecimiento)
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

    let regionalIEEjecucion
    $: whitelistInstitucionesEducativasEjecutar = []
    $: if (regionalIEEjecucion) {
        axios
            .get('https://www.datos.gov.co/resource/cfw5-qzt5.json?cod_dane_departamento=' + regionalIEEjecucion?.codigo)
            .then(function (response) {
                // handle success
                response.data.map((item) => {
                    whitelistInstitucionesEducativasEjecutar.push(item.nombre_establecimiento)
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
        clausula_confidencialidad: taEvaluacion.evaluacion.clausula_confidencialidad,
        resumen_regional_comentario: taEvaluacion.resumen_regional_comentario,
        resumen_regional_requiere_comentario: taEvaluacion.resumen_regional_comentario == null ? true : false,
        antecedentes_tecnoacademia_comentario: taEvaluacion.antecedentes_tecnoacademia_comentario,
        antecedentes_tecnoacademia_requiere_comentario: taEvaluacion.antecedentes_tecnoacademia_comentario == null ? true : false,
        retos_oportunidades_comentario: taEvaluacion.retos_oportunidades_comentario,
        retos_oportunidades_requiere_comentario: taEvaluacion.retos_oportunidades_comentario == null ? true : false,
        metodologia_comentario: taEvaluacion.metodologia_comentario,
        metodologia_local_requiere_comentario: taEvaluacion.metodologia_comentario == null ? true : false,
        lineas_medulares_centro_comentario: taEvaluacion.lineas_medulares_centro_comentario,
        lineas_medulares_centro_requiere_comentario: taEvaluacion.lineas_medulares_centro_comentario == null ? true : false,
        lineas_tecnologicas_centro_comentario: taEvaluacion.lineas_tecnologicas_centro_comentario,
        lineas_tecnologicas_centro_requiere_comentario: taEvaluacion.lineas_tecnologicas_centro_comentario == null ? true : false,
        municipios_comentario: taEvaluacion.municipios_comentario,
        municipios_requiere_comentario: taEvaluacion.municipios_comentario == null ? true : false,
        instituciones_comentario: taEvaluacion.instituciones_comentario,
        instituciones_requiere_comentario: taEvaluacion.instituciones_comentario == null ? true : false,
        fecha_ejecucion_comentario: taEvaluacion.fecha_ejecucion_comentario,
        fecha_ejecucion_requiere_comentario: taEvaluacion.fecha_ejecucion_comentario == null ? true : false,
        cadena_valor_comentario: taEvaluacion.cadena_valor_comentario,
        cadena_valor_requiere_comentario: taEvaluacion.cadena_valor_comentario == null ? true : false,
        analisis_riesgos_comentario: taEvaluacion.analisis_riesgos_comentario,
        analisis_riesgos_requiere_comentario: taEvaluacion.analisis_riesgos_comentario == null ? true : false,
        anexos_comentario: taEvaluacion.anexos_comentario,
        anexos_requiere_comentario: taEvaluacion.anexos_comentario == null ? true : false,
        proyectos_macro_comentario: taEvaluacion.proyectos_macro_comentario,
        proyectos_macro_requiere_comentario: taEvaluacion.proyectos_macro_comentario == null ? true : false,
        bibliografia_comentario: taEvaluacion.bibliografia_comentario,
        bibliografia_requiere_comentario: taEvaluacion.bibliografia_comentario == null ? true : false,

        articulacion_centro_formacion_comentario: taEvaluacion.articulacion_centro_formacion_comentario,
        articulacion_centro_formacion_requiere_comentario: taEvaluacion.articulacion_centro_formacion_comentario == null ? true : false,

        ortografia_comentario: taEvaluacion.ortografia_comentario,
        ortografia_requiere_comentario: taEvaluacion.ortografia_comentario == null ? true : false,
        redaccion_comentario: taEvaluacion.redaccion_comentario,
        redaccion_requiere_comentario: taEvaluacion.redaccion_comentario == null ? true : false,
        normas_apa_comentario: taEvaluacion.normas_apa_comentario,
        normas_apa_requiere_comentario: taEvaluacion.normas_apa_comentario == null ? true : false,
    })

    function submit() {
        if (isSuperAdmin || (checkRole(authUser, [11, 5]) && taEvaluacion.evaluacion.finalizado == false && taEvaluacion.evaluacion.habilitado == true && taEvaluacion.evaluacion.modificable == true)) {
            $form.put(route('convocatorias.ta-evaluaciones.update', [convocatoria.id, taEvaluacion.id]), {
                preserveScroll: true,
            })
        }
    }

    $: if (taInfo.fecha_inicio && taInfo.fecha_finalizacion) {
        taInfo.max_meses_ejecucion = monthDiff(taInfo.fecha_inicio, taInfo.fecha_finalizacion)
    }
</script>

<AuthenticatedLayout>
    <header class="pt-[8rem]" slot="header">
        <EvaluationStepper {convocatoria} evaluacion={taEvaluacion.evaluacion} proyecto={ta.proyecto} />
    </header>

    <form on:submit|preventDefault={submit}>
        <TaForm {errors} evaluacion={taEvaluacion.evaluacion} form={taInfo} {isSuperAdmin} {convocatoria} {ta} {lineasTecnoacademia} {lineasProgramaticas}>
            <div slot="fechas">
                <InfoMessage>
                    <div class="mt-4">
                        {#if checkRole(authUser, [5]) && taEvaluacion.evaluacion.evaluacion_final}
                            {#each otrasEvaluaciones as evaluacion}
                                <div class="mb-8">
                                    <h4>Evaluador(a): <span class="font-black capitalize">{evaluacion.evaluacion.evaluador.nombre}</span></h4>
                                    {evaluacion.fecha_ejecucion_comentario ? evaluacion.fecha_ejecucion_comentario : 'Estado: El evaluador(a) da cumplimiento al ítem'}
                                    <br />
                                </div>
                            {/each}
                        {/if}
                        <p>¿Las fechas son correctas? Por favor seleccione si Cumple o No cumple</p>
                        <Switch onMessage="Cumple" offMessage="No cumple" disabled={isSuperAdmin ? undefined : taEvaluacion.evaluacion.finalizado == true || taEvaluacion.evaluacion.habilitado == false || taEvaluacion.evaluacion.modificable == false ? true : undefined} bind:checked={$form.fecha_ejecucion_requiere_comentario} />
                        {#if $form.fecha_ejecucion_requiere_comentario == false}
                            <Textarea
                                disabled={isSuperAdmin ? undefined : taEvaluacion.evaluacion.finalizado == true || taEvaluacion.evaluacion.habilitado == false || taEvaluacion.evaluacion.modificable == false ? true : undefined}
                                label="Comentario"
                                class="mt-4"
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
                    <div class="mt-4">
                        {#if checkRole(authUser, [5]) && taEvaluacion.evaluacion.evaluacion_final}
                            {#each otrasEvaluaciones as evaluacion}
                                <div class="mb-8">
                                    <h4>Evaluador(a): <span class="font-black capitalize">{evaluacion.evaluacion.evaluador.nombre}</span></h4>
                                    {evaluacion.resumen_regional_comentario ? evaluacion.resumen_regional_comentario : 'Estado: El evaluador(a) da cumplimiento al ítem'}
                                    <hr />
                                </div>
                            {/each}
                        {/if}
                        <p>¿El resumen ejecutivo regional es correcto? Por favor seleccione si Cumple o No cumple.</p>
                        <Switch onMessage="Cumple" offMessage="No cumple" disabled={isSuperAdmin ? undefined : taEvaluacion.evaluacion.finalizado == true || taEvaluacion.evaluacion.habilitado == false || taEvaluacion.evaluacion.modificable == false ? true : undefined} bind:checked={$form.resumen_regional_requiere_comentario} />
                        {#if $form.resumen_regional_requiere_comentario == false}
                            <Textarea
                                disabled={isSuperAdmin ? undefined : taEvaluacion.evaluacion.finalizado == true || taEvaluacion.evaluacion.habilitado == false || taEvaluacion.evaluacion.modificable == false ? true : undefined}
                                label="Comentario"
                                class="mt-4"
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
                    <div class="mt-4">
                        {#if checkRole(authUser, [5]) && taEvaluacion.evaluacion.evaluacion_final}
                            {#each otrasEvaluaciones as evaluacion}
                                <div class="mb-8">
                                    <h4>Evaluador(a): <span class="font-black capitalize">{evaluacion.evaluacion.evaluador.nombre}</span></h4>
                                    {evaluacion.antecedentes_tecnoacademia_comentario ? evaluacion.antecedentes_tecnoacademia_comentario : 'Estado: El evaluador(a) da cumplimiento al ítem'}
                                    <hr />
                                </div>
                            {/each}
                        {/if}
                        <p>¿Los antecedentes de la Tecnoacademia y su impacto en la región son correctos? Por favor seleccione si Cumple o No cumple.</p>
                        <Switch onMessage="Cumple" offMessage="No cumple" disabled={isSuperAdmin ? undefined : taEvaluacion.evaluacion.finalizado == true || taEvaluacion.evaluacion.habilitado == false || taEvaluacion.evaluacion.modificable == false ? true : undefined} bind:checked={$form.antecedentes_tecnoacademia_requiere_comentario} />
                        {#if $form.antecedentes_tecnoacademia_requiere_comentario == false}
                            <Textarea
                                disabled={isSuperAdmin ? undefined : taEvaluacion.evaluacion.finalizado == true || taEvaluacion.evaluacion.habilitado == false || taEvaluacion.evaluacion.modificable == false ? true : undefined}
                                label="Comentario"
                                class="mt-4"
                                maxlength="40000"
                                id="antecedentes_tecnoacademia_comentario"
                                bind:value={$form.antecedentes_tecnoacademia_comentario}
                                error={errors.antecedentes_tecnoacademia_comentario}
                                required
                            />
                        {/if}
                    </div>
                </InfoMessage>
            </div>

            <div slot="retos-oportunidades">
                <InfoMessage>
                    <div class="mt-4">
                        {#if checkRole(authUser, [5]) && taEvaluacion.evaluacion.evaluacion_final}
                            {#each otrasEvaluaciones as evaluacion}
                                <div class="mb-8">
                                    <h4>Evaluador(a): <span class="font-black capitalize">{evaluacion.evaluacion.evaluador.nombre}</span></h4>
                                    {evaluacion.retos_oportunidades_comentario ? evaluacion.retos_oportunidades_comentario : 'Estado: El evaluador(a) da cumplimiento al ítem'}
                                    <hr />
                                </div>
                            {/each}
                        {/if}
                        <p>¿La descripción es correcta? Por favor seleccione si Cumple o No cumple.</p>
                        <Switch onMessage="Cumple" offMessage="No cumple" disabled={isSuperAdmin ? undefined : taEvaluacion.evaluacion.finalizado == true || taEvaluacion.evaluacion.habilitado == false || taEvaluacion.evaluacion.modificable == false ? true : undefined} bind:checked={$form.retos_oportunidades_requiere_comentario} />
                        {#if $form.retos_oportunidades_requiere_comentario == false}
                            <Textarea
                                disabled={isSuperAdmin ? undefined : taEvaluacion.evaluacion.finalizado == true || taEvaluacion.evaluacion.habilitado == false || taEvaluacion.evaluacion.modificable == false ? true : undefined}
                                label="Comentario"
                                class="mt-4"
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

            <div slot="lineas-tecnologicas">
                <InfoMessage>
                    <div class="mt-4">
                        {#if checkRole(authUser, [5]) && taEvaluacion.evaluacion.evaluacion_final}
                            {#each otrasEvaluaciones as evaluacion}
                                <div class="mb-8">
                                    <h4>Evaluador(a): <span class="font-black capitalize">{evaluacion.evaluacion.evaluador.nombre}</span></h4>
                                    {evaluacion.lineas_tecnologicas_centro_comentario ? evaluacion.lineas_tecnologicas_centro_comentario : 'Estado: El evaluador(a) da cumplimiento al ítem'}
                                    <hr />
                                </div>
                            {/each}
                        {/if}
                        <p>¿La información sobre las líneas tecnológicas es correcta? Por favor seleccione si Cumple o No cumple.</p>
                        <Switch onMessage="Cumple" offMessage="No cumple" disabled={isSuperAdmin ? undefined : taEvaluacion.evaluacion.finalizado == true || taEvaluacion.evaluacion.habilitado == false || taEvaluacion.evaluacion.modificable == false ? true : undefined} bind:checked={$form.lineas_tecnologicas_centro_requiere_comentario} />
                        {#if $form.lineas_tecnologicas_centro_requiere_comentario == false}
                            <Textarea
                                disabled={isSuperAdmin ? undefined : taEvaluacion.evaluacion.finalizado == true || taEvaluacion.evaluacion.habilitado == false || taEvaluacion.evaluacion.modificable == false ? true : undefined}
                                label="Comentario"
                                class="mt-4"
                                maxlength="40000"
                                id="lineas_tecnologicas_centro_comentario"
                                bind:value={$form.lineas_tecnologicas_centro_comentario}
                                error={errors.lineas_tecnologicas_centro_comentario}
                                required
                            />
                        {/if}
                    </div>
                </InfoMessage>
            </div>

            <div slot="bibliografia">
                <InfoMessage>
                    <div class="mt-4">
                        {#if checkRole(authUser, [5]) && taEvaluacion.evaluacion.evaluacion_final}
                            {#each otrasEvaluaciones as evaluacion}
                                <div class="mb-8">
                                    <h4>Evaluador(a): <span class="font-black capitalize">{evaluacion.evaluacion.evaluador.nombre}</span></h4>
                                    {evaluacion.bibliografia_comentario ? evaluacion.bibliografia_comentario : 'Estado: El evaluador(a) da cumplimiento al ítem'}
                                    <hr />
                                </div>
                            {/each}
                        {/if}
                        <p>¿La bibliografia es correcta? Por favor seleccione si Cumple o No cumple.</p>
                        <Switch onMessage="Cumple" offMessage="No cumple" disabled={isSuperAdmin ? undefined : taEvaluacion.evaluacion.finalizado == true || taEvaluacion.evaluacion.habilitado == false || taEvaluacion.evaluacion.modificable == false ? true : undefined} bind:checked={$form.bibliografia_requiere_comentario} />
                        {#if $form.bibliografia_requiere_comentario == false}
                            <Textarea
                                disabled={isSuperAdmin ? undefined : taEvaluacion.evaluacion.finalizado == true || taEvaluacion.evaluacion.habilitado == false || taEvaluacion.evaluacion.modificable == false ? true : undefined}
                                label="Comentario"
                                class="mt-4"
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
                <hr class="mt-10 mb-10" />

                <h1>Ortografía</h1>
                <InfoMessage>
                    <div class="mt-4">
                        {#if checkRole(authUser, [5]) && taEvaluacion.evaluacion.evaluacion_final}
                            {#each otrasEvaluaciones as evaluacion}
                                <div class="mb-8">
                                    <h4>Evaluador(a): <span class="font-black capitalize">{evaluacion.evaluacion.evaluador.nombre}</span></h4>
                                    {evaluacion.ortografia_comentario ? evaluacion.ortografia_comentario : 'Estado: El evaluador(a) da cumplimiento al ítem'}
                                    <br />
                                </div>
                            {/each}
                        {/if}
                        <p>¿La ortografía es correcta? Por favor seleccione si Cumple o No cumple.</p>
                        <Switch onMessage="Cumple" offMessage="No cumple" disabled={isSuperAdmin ? undefined : taEvaluacion.evaluacion.finalizado == true || taEvaluacion.evaluacion.habilitado == false || taEvaluacion.evaluacion.modificable == false ? true : undefined} bind:checked={$form.ortografia_requiere_comentario} />
                        {#if $form.ortografia_requiere_comentario == false}
                            <Textarea disabled={isSuperAdmin ? undefined : taEvaluacion.evaluacion.finalizado == true || taEvaluacion.evaluacion.habilitado == false || taEvaluacion.evaluacion.modificable == false ? true : undefined} label="Comentario" class="mt-4" maxlength="40000" id="ortografia_comentario" bind:value={$form.ortografia_comentario} error={errors.ortografia_comentario} required />
                        {/if}
                    </div>
                </InfoMessage>

                <hr class="mt-10 mb-10" />
                <h1>Redacción</h1>
                <InfoMessage>
                    <div class="mt-4">
                        {#if checkRole(authUser, [5]) && taEvaluacion.evaluacion.evaluacion_final}
                            {#each otrasEvaluaciones as evaluacion}
                                <div class="mb-8">
                                    <h4>Evaluador(a): <span class="font-black capitalize">{evaluacion.evaluacion.evaluador.nombre}</span></h4>
                                    {evaluacion.redaccion_comentario ? evaluacion.redaccion_comentario : 'Estado: El evaluador(a) da cumplimiento al ítem'}
                                    <br />
                                </div>
                            {/each}
                        {/if}
                        <p>¿La redacción es correcta? Por favor seleccione si Cumple o No cumple.</p>
                        <Switch onMessage="Cumple" offMessage="No cumple" disabled={isSuperAdmin ? undefined : taEvaluacion.evaluacion.finalizado == true || taEvaluacion.evaluacion.habilitado == false || taEvaluacion.evaluacion.modificable == false ? true : undefined} bind:checked={$form.redaccion_requiere_comentario} />
                        {#if $form.redaccion_requiere_comentario == false}
                            <Textarea disabled={isSuperAdmin ? undefined : taEvaluacion.evaluacion.finalizado == true || taEvaluacion.evaluacion.habilitado == false || taEvaluacion.evaluacion.modificable == false ? true : undefined} label="Comentario" class="mt-4" maxlength="40000" id="redaccioncomentario" bind:value={$form.redaccion_comentario} error={errors.redaccion_comentario} />
                        {/if}
                    </div>
                </InfoMessage>

                <hr class="mt-10 mb-10" />
                <h1>Normas APA</h1>
                <InfoMessage>
                    <div class="mt-4">
                        {#if checkRole(authUser, [5]) && taEvaluacion.evaluacion.evaluacion_final}
                            {#each otrasEvaluaciones as evaluacion}
                                <div class="mb-8">
                                    <h4>Evaluador(a): <span class="font-black capitalize">{evaluacion.evaluacion.evaluador.nombre}</span></h4>
                                    {evaluacion.normas_apa_comentario ? evaluacion.normas_apa_comentario : 'Estado: El evaluador(a) da cumplimiento al ítem'}
                                    <br />
                                </div>
                            {/each}
                        {/if}
                        <p>¿Las normas APA son correctas? Por favor seleccione si Cumple o No cumple.</p>
                        <Switch onMessage="Cumple" offMessage="No cumple" disabled={isSuperAdmin ? undefined : taEvaluacion.evaluacion.finalizado == true || taEvaluacion.evaluacion.habilitado == false || taEvaluacion.evaluacion.modificable == false ? true : undefined} bind:checked={$form.normas_apa_requiere_comentario} />
                        {#if $form.normas_apa_requiere_comentario == false}
                            <Textarea disabled={isSuperAdmin ? undefined : taEvaluacion.evaluacion.finalizado == true || taEvaluacion.evaluacion.habilitado == false || taEvaluacion.evaluacion.modificable == false ? true : undefined} label="Comentario" class="mt-4" maxlength="40000" id="normas_apa_comentario" bind:value={$form.normas_apa_comentario} error={errors.normas_apa_comentario} required />
                        {/if}
                    </div>
                </InfoMessage>
            </div>
        </TaForm>

        <div class="shadow-inner bg-app-200 border-app-400 bottom-0 flex items-center justify-between mt-14 px-8 py-4 sticky">
            {#if isSuperAdmin || (checkRole(authUser, [11, 5]) && taEvaluacion.evaluacion.finalizado == false && taEvaluacion.evaluacion.habilitado == true && taEvaluacion.evaluacion.modificable == true)}
                {#if $form.clausula_confidencialidad}
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-green-500 mr-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span class="text-green-500">Ha aceptado la cláusula de confidencialidad</span>
                {:else}
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-red-500 mr-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span class="text-red-500">No ha aceptado la cláusula de confidencialidad</span>
                {/if}

                <LoadingButton loading={$form.processing} class="ml-auto" type="submit">Guardar</LoadingButton>
            {/if}
        </div>
    </form>

    <Dialog bind:open={proyectoDialogOpen} id="informacion">
        <div slot="title" class="flex items-center flex-col mt-4">
            <figure>
                <img src={'/images/feedback.png'} alt="Evaluación" class="h-32 mb-6" />
            </figure>
            Código del proyecto: {ta.proyecto.codigo}
        </div>
        <div slot="content">
            <div>
                <h1 class="text-center mt-4 mb-4">Cláusula de confidencialidad</h1>
                <p class="mb-4">
                    Al hacer clic en el botón Aceptar, dejo constancia del tratamiento confidencial que daré a la información relacionada con el proceso de evaluación que incluye, sin limitarse a esta, la información sobre proyectos, centros de formación, formuladores, autores y coautores de proyectos, resultados del proceso de evaluación en sus dos etapas. Por tanto, declaro que me abstendré de
                    usar o divulgar para cualquier fin y por cualquier medio la información enunciada.
                </p>
            </div>
        </div>
        <div slot="actions">
            <div class="p-4">
                <Button on:click={() => (($form.clausula_confidencialidad = true), (proyectoDialogOpen = false))} variant={null}>Aceptar</Button>
            </div>
        </div>
    </Dialog>

    <Dialog bind:open={dialogSegundaEvaluacion} id="informacion">
        <div slot="title" class="flex items-center flex-col mt-4">
            <figure>
                <img src={'/images/feedback.png'} alt="Evaluación" class="h-32 mb-6" />
            </figure>
            Código del proyecto: {ta.proyecto.codigo}
        </div>
        <div slot="content">
            <div>
                <h1 class="text-center mt-4 mb-4">Importante</h1>

                <p>Antes de iniciar a la segunda evaluación por favor diríjase a la sección <strong>Comentarios generales</strong> y verifique si el proponente hizo alguna aclaración sobre algún ítem.</p>

                {#if ta.proyecto.pdf_versiones}
                    <hr class="m-10 block" />
                    <h1 class="text-center mt-4 mb-4">Version del proyecto (.pdf)</h1>
                    <p class="mt-4">También revise la versión del proyecto en .pdf para ir verificando los cambios realizados en los diferentes campos.</p>
                    <ul>
                        {#each ta.proyecto.pdf_versiones as version}
                            <li>
                                {#if version.estado == 1}
                                    <a class="text-white underline" href={route('convocatorias.proyectos.version', [convocatoria.id, ta.id, version.version])}> {version.version}.pdf - Descargar</a>
                                    <small class="block">{version.created_at}</small>
                                {/if}
                            </li>
                        {/each}
                    </ul>
                {/if}
            </div>
        </div>
        <div slot="actions">
            <div class="p-4">
                <Button on:click={() => (dialogSegundaEvaluacion = false)} variant={null}>Aceptar</Button>
            </div>
        </div>
    </Dialog>
</AuthenticatedLayout>

<style>
    :global(.tagify__tag) {
        background: #e5e5e5;
    }

    :global(.tagify__tag:focus div::before) {
        background: #d3e2e2;
    }

    :global(.tagify__tag:hover:not([readonly]) div:before) {
        background: #d3e2e2;
    }
</style>
