<script>
    import { route } from '@/Utils'
    import { Inertia } from '@inertiajs/inertia'

    import Button from '@/Shared/Button'
    import LoadingButton from '@/Shared/LoadingButton'
    import InputError from '@/Shared/InputError'
    import Checkbox from '@smui/checkbox'
    import FormField from '@smui/form-field'
    import SelectMulti from '@/Shared/SelectMulti'
    import Tags from '@/Shared/Tags'
    import InfoMessage from '@/Shared/InfoMessage'
    import Label from '@/Shared/Label'
    import Select from '@/Shared/Select'
    import Input from '@/Shared/Input'
    import Textarea from '@/Shared/Textarea'
    import File from '@/Shared/File'
    import Dialog from '@/Shared/Dialog'
    import Export2Word from '@/Shared/Export2Word'

    export let submit
    export let errors
    export let form
    export let formRazonEstadoGeneral
    export let formJustificacionAmbienteInactivo
    export let formImpactoProcesosFormacion
    export let formPertinenciaSectorProductivo
    export let formProductividadBeneficiarios
    export let formGeneracionEmpleo
    export let formCreacionEmpresas
    export let formIncorporacionNuevosConocimientos
    export let formValorAgregadoEntidades
    export let formFortalecimientoProgramasFormacion
    export let formTransferenciaTecnologias
    export let formCoberturaPerntinenciaFormacion
    export let formObservacionesGeneralesAmbiente
    export let dialogGuardar = false

    export let centrosFormacion
    export let ambienteModernizacion
    export let codigosSgps
    export let mesasSectoriales
    export let tipologiasAmbientes
    export let semillerosInvestigacion
    export let areasConocimiento
    export let subareasConocimiento
    export let disciplinasSubareaConocimiento
    export let programasFormacionConRegistro
    export let programasFormacionSinRegistro
    export let tematicasEstrategicas
    export let redesConocimiento
    export let actividadesEconomicas
    export let lineasInvestigacion
    export let opcionesSiNo = [
        { value: 1, label: 'Si' },
        { value: 2, label: 'No' },
    ]
    export let estados

    export let allowedToCreate

    let exportComponent

    let arraySubareasConocimiento = subareasConocimiento.filter(function (obj) {
        return obj.area_conocimiento_id == $form.area_conocimiento_id
    })
    function selectAreaConocimiento(event) {
        arraySubareasConocimiento = subareasConocimiento.filter(function (obj) {
            return obj.area_conocimiento_id == event.detail?.value
        })
    }

    let arrayDisciplinasSubareaConocimiento = disciplinasSubareaConocimiento.filter(function (obj) {
        return obj.subarea_conocimiento_id == $form.subarea_conocimiento_id
    })
    function selectSubreaConocimiento(event) {
        arrayDisciplinasSubareaConocimiento = disciplinasSubareaConocimiento.filter(function (obj) {
            return obj.subarea_conocimiento_id == event.detail?.value
        })
    }

    let arrayLineasInvestigacion = []
    function selectLineaInvestigacion(event) {
        arrayLineasInvestigacion = lineasInvestigacion.filter(function (obj) {
            return obj.centro_formacion_id == event.detail?.value
        })
    }

    async function syncColumnLong(column, form) {
        return new Promise((resolve) => {
            if ((typeof column !== 'undefined' && typeof form !== 'undefined' && allowedToCreate) || (typeof column !== 'undefined' && typeof form !== 'undefined' && ambienteModernizacion.allowed.to_update)) {
                Inertia.put(
                    route('ambientes-modernizacion.updateLongColumn', [ambienteModernizacion.id, column]),
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
</script>

<form on:submit|preventDefault={submit} id="semillero-investigacion-form">
    <fieldset class="p-8 divide-y" disabled={ambienteModernizacion?.allowed.to_update || allowedToCreate ? undefined : true}>
        {#if allowedToCreate}
            <div class="py-24 grid grid-cols-2">
                <div>
                    <Label required class="mb-4" labelFor="centro_formacion_id" value="Centro de formación" />
                </div>
                <div>
                    <Select id="centro_formacion_id" items={centrosFormacion} bind:selectedValue={$form.centro_formacion_id} selectFunctions={[(event) => selectLineaInvestigacion(event)]} error={errors.centro_formacion_id} autocomplete="off" placeholder="Busque por el nombre del centro de formación" required />
                </div>
            </div>

            <div class="py-24 grid grid-cols-2">
                <div>
                    <Label required class="mb-4" labelFor="codigo_proyecto_sgps_id" value="1. Código proyecto SGPS" />
                </div>
                <div>
                    <Select id="codigo_proyecto_sgps_id" items={codigosSgps} bind:selectedValue={$form.codigo_proyecto_sgps_id} error={errors.codigo_proyecto_sgps_id} autocomplete="off" placeholder="Busque por el título/código del proyecto" required />
                </div>
            </div>
        {/if}

        <div class="py-24">
            <Label required labelFor="nombre_ambiente" class="font-medium inline-block mb-10 text-center text-gray-700 text-sm w-full" value="2. Nombre del ambiente(s) de formación modernizado por Sennova. Ejemplo: Ambiente de soldadura - Ambiente de confecciones" />
            <Textarea label="Nombre" id="nombre_ambiente" sinContador={true} error={errors.nombre_ambiente} bind:value={$form.nombre_ambiente} classes="bg-transparent block border-0 {errors.nombre_ambiente ? '' : 'outline-none-important'} mt-1 outline-none text-4xl text-center w-full" required />
        </div>

        <div class="py-24 grid grid-cols-2">
            <div>
                <Label required class="mb-4" labelFor="tipologia_ambiente_id" value="3. Tipologías de los ambientes (Circular 3-2018- 143)" />
                <a href={'/storage/documentos-descarga/Circular-3-2018-143.pdf'} target="_blank" class="underline text-app-500">Ver Circular 3-2018-143</a>
            </div>
            <div>
                <Select id="tipologia_ambiente_id" items={tipologiasAmbientes} bind:selectedValue={$form.tipologia_ambiente_id} error={errors.tipologia_ambiente_id} autocomplete="off" placeholder="Seleccione una tipología" required />
            </div>
        </div>

        <div class="py-24 grid grid-cols-2">
            <div>
                <Label required class="mb-4" labelFor="area_conocimiento_id" value="4. Área de conocimiento relacionada con el ambiente modernizado por Sennova" />
            </div>
            <div>
                <Select id="area_conocimiento_id" items={areasConocimiento} bind:selectedValue={$form.area_conocimiento_id} selectFunctions={[(event) => selectAreaConocimiento(event)]} error={errors.area_conocimiento_id} autocomplete="off" placeholder="Busque por el nombre de la área de conocimiento" required />
            </div>
        </div>
        {#if $form.area_conocimiento_id}
            <div class="py-24 grid grid-cols-2">
                <div>
                    <Label required class="mb-4" labelFor="subarea_conocimiento_id" value="Subárea relacionada con el ambiente modernizado por Sennova" />
                </div>
                <div>
                    <Select id="subarea_conocimiento_id" items={arraySubareasConocimiento} bind:selectedValue={$form.subarea_conocimiento_id} selectFunctions={[(event) => selectSubreaConocimiento(event)]} error={errors.subarea_conocimiento_id} autocomplete="off" placeholder="Busque por el nombre de la subárea de conocimiento" required />
                </div>
            </div>
        {/if}
        {#if $form.subarea_conocimiento_id}
            <div class="py-24 grid grid-cols-2">
                <div>
                    <Label required class="mb-4" labelFor="disciplina_subarea_conocimiento_id" value="Disciplina relacionada con el ambiente modernizado por Sennova" />
                </div>
                <div>
                    <Select id="disciplina_subarea_conocimiento_id" items={arrayDisciplinasSubareaConocimiento} bind:selectedValue={$form.disciplina_subarea_conocimiento_id} error={errors.disciplina_subarea_conocimiento_id} autocomplete="off" placeholder="Busque por el nombre de la disciplina de subáreas de conocimiento" required />
                </div>
            </div>
        {/if}

        <div class="py-24 grid grid-cols-2">
            <div>
                <Label required class="mb-4" labelFor="red_conocimiento_id" value="5. Red de conocimiento relacionada con el ambiente modernizado por Sennova (resolución 335 de 2012)" />
            </div>
            <div>
                <Select id="red_conocimiento_id" items={redesConocimiento} bind:selectedValue={$form.red_conocimiento_id} error={errors.red_conocimiento_id} autocomplete="off" placeholder="Busque por el nombre de la red de conocimiento sectorial" required />
            </div>
        </div>

        <div class="py-24 grid grid-cols-2">
            <div>
                <Label required class="mb-4" labelFor="actividad_economica_id" value="6. Código CIIU relacionado con el ambiente modernizado por Sennova" />
            </div>
            <div>
                <Select id="actividad_economica_id" items={actividadesEconomicas} bind:selectedValue={$form.actividad_economica_id} error={errors.actividad_economica_id} autocomplete="off" placeholder="Busque por el nombre de la actividad económica" required />
            </div>
        </div>

        <div class="py-24 grid grid-cols-2">
            <div>
                <Label required class="mb-4" labelFor="tematica_estrategica_id" value="7. Temática estratégica SENA relacionada con el ambiente modernizado por Sennova" />
            </div>
            <div>
                <Select id="tematica_estrategica_id" items={tematicasEstrategicas} bind:selectedValue={$form.tematica_estrategica_id} error={errors.tematica_estrategica_id} autocomplete="off" placeholder="Busque por el nombre de la línea de investigación" required />
            </div>
        </div>

        {#if $form.centro_formacion_id?.value}
            <div class="py-24 grid grid-cols-2">
                <div>
                    <Label required class="mb-4" labelFor="linea_investigacion_id" value="8. Línea investigación relacionada con el ambiente modernizado por Sennova" />
                </div>
                <div>
                    <Select id="linea_investigacion_id" items={arrayLineasInvestigacion} bind:selectedValue={$form.linea_investigacion_id} error={errors.linea_investigacion_id} autocomplete="off" placeholder="Busque por el nombre de la línea de investigación, centro de formación, grupo de investigación o regional" required />
                </div>
            </div>
        {/if}

        <div class="py-24 grid grid-cols-2">
            <div>
                <Label required class="mb-4" labelFor="alineado_mesas_sectoriales" value="9. ¿El proyecto se alinea con las Mesas Sectoriales?" />
            </div>
            <div>
                <Select items={opcionesSiNo} id="alineado_mesas_sectoriales" bind:selectedValue={$form.alineado_mesas_sectoriales} error={errors.alineado_mesas_sectoriales} autocomplete="off" placeholder="Seleccione una opción" required />
            </div>
        </div>
        {#if $form.alineado_mesas_sectoriales?.value == 1}
            <div class="bg-app-100 p-5 py-24">
                <InputError message={errors.mesa_sectorial_id} />
                <div class="grid grid-cols-2">
                    <div>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-5" style="transform: translateX(-50px);">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p class="text-app-600">Por favor seleccione la o las mesas sectoriales con la cual o las cuales se alinea el proyecto</p>
                    </div>
                    <div class="bg-white grid grid-cols-2 max-w-xl overflow-y-scroll shadow-2xl mt-4 h-80">
                        {#each mesasSectoriales as { id, nombre }, i}
                            <FormField>
                                <Checkbox bind:group={$form.mesa_sectorial_id} value={id} />
                                <span slot="label">{nombre}</span>
                            </FormField>
                        {/each}
                    </div>
                </div>
            </div>
        {/if}

        <div class="py-24 grid grid-cols-2">
            <div>
                <Label required class="mb-4" labelFor="financiado_anteriormente" value="10. ¿El ambiente de formación ha sido financiado en más de una vigencia por Sennova?" />
            </div>
            <div>
                <Select items={opcionesSiNo} id="financiado_anteriormente" bind:selectedValue={$form.financiado_anteriormente} error={errors.financiado_anteriormente} autocomplete="off" placeholder="Seleccione una opción" required />
            </div>
        </div>

        {#if !allowedToCreate}
            <div class="py-24 grid grid-cols-2">
                <div>
                    <Label required class="mb-4" labelFor="numero_tecnicas_tecnologias" value="11. Relacione el número de técnicas o tecnologías adquiridas y/o mejoradas con el ambiente de aprendizaje, modernizado por SENNOVA. " />
                </div>
                <div>
                    <Input label="Número total" id="numero_tecnicas_tecnologias" type="number" input$min="0" input$max="999999" class="mt-1" error={errors.numero_tecnicas_tecnologias} placeholder="Escriba el número de técnicas o tecnologías adquiridas" bind:value={$form.numero_tecnicas_tecnologias} required />
                </div>
            </div>

            {#if $form.financiado_anteriormente?.value == 1}
                <div class="py-24 grid grid-cols-2">
                    <div>
                        <Label required class="mb-4" labelFor="codigos_proyectos_id" value="12. Si la respuesta anterior fue afirmativa, relacione los códigos y nombres de los proyectos beneficiados y/o ejecutados en el ambiente modernizado por Sennova de convocatoria (SGPS) o de capacidad instalada (CAP)" />
                    </div>
                    <div>
                        <SelectMulti id="codigos_proyectos_id" bind:selectedValue={$form.codigos_proyectos_id} items={codigosSgps} isMulti={true} error={errors.codigos_proyectos_id} placeholder="Buscar por el código/título del proyecto" required />
                    </div>
                </div>
            {/if}

            <div class="py-24 grid grid-cols-2">
                <div>
                    <Label required class="mb-4" labelFor="estado_general_maquinaria" value="13. Estado general de maquinaria y equipo instalados en el ambiente de aprendizaje, modernizado por SENNOVA." />
                </div>
                <div>
                    <Select items={estados} id="estado_general_maquinaria" bind:selectedValue={$form.estado_general_maquinaria} error={errors.estado_general_maquinaria} autocomplete="off" placeholder="Seleccione una opción" required />
                </div>
            </div>

            {#if $form.estado_general_maquinaria?.value == 2 || $form.estado_general_maquinaria?.value == 3}
                <div class="py-24 grid grid-cols-2">
                    <div>
                        <Label required class="mb-4" labelFor="razon_estado_general" value="14. Si la respuesta anterior fue regular o malo, describa la razón. Para mayor especificidad listar máquina por máquina para identificación a partir del tiempo de vida útil." />
                    </div>
                    <div>
                        <Textarea
                            label="Razón"
                            maxlength="40000"
                            id="razon_estado_general"
                            error={errors.razon_estado_general}
                            bind:value={$formRazonEstadoGeneral.razon_estado_general}
                            required
                            on:blur={() => {
                                syncColumnLong('razon_estado_general', $formRazonEstadoGeneral), ($form.razon_estado_general = $formRazonEstadoGeneral.razon_estado_general)
                            }}
                        />
                    </div>
                </div>
            {/if}

            <div class="py-24 grid grid-cols-2">
                <div>
                    <Label required class="mb-4" labelFor="ambiente_activo" value="15. ¿A la fecha el ambiente modernizado por Sennova está activo para realizar procesos de formación?" />
                </div>
                <div>
                    <Select items={opcionesSiNo} id="ambiente_activo" bind:selectedValue={$form.ambiente_activo} error={errors.ambiente_activo} autocomplete="off" placeholder="Seleccione una opción" required />
                </div>
            </div>

            {#if $form.ambiente_activo?.value == 1}
                <div class="py-24 grid grid-cols-2 pl-4">
                    <div>
                        <Label required class="mb-4" labelFor="programas_formacion_calificados" value="Si la respuesta anterior fue afirmativa, seleccione los programas de formación con registro calificado beneficiados." />
                    </div>
                    <div>
                        <SelectMulti id="programas_formacion_calificados" bind:selectedValue={$form.programas_formacion_calificados} items={programasFormacionConRegistro} isMulti={true} error={errors.programas_formacion_calificados} placeholder="Buscar por el nombre del programa de formación" required />
                    </div>
                </div>

                <div class="py-24 grid grid-cols-2 pl-4">
                    <div>
                        <Label required={programasFormacionSinRegistro.length > 0 ? 'required' : undefined} class="mb-4" labelFor="programas_formacion" value="Si la respuesta anterior fue afirmativa, seleccione los programas de formación beneficiados." />
                    </div>
                    <div>
                        <SelectMulti id="programas_formacion" bind:selectedValue={$form.programas_formacion} items={programasFormacionSinRegistro} isMulti={true} error={errors.programas_formacion} placeholder="Buscar por el nombre del programa de formación" required={programasFormacionSinRegistro.length > 0 ? 'required' : undefined} />
                    </div>
                </div>
            {:else if $form.ambiente_activo?.value == 2}
                <div class="py-24 grid grid-cols-2 pl-4">
                    <div>
                        <Label required class="mb-4" labelFor="justificacion_ambiente_inactivo" value="Si la respuesta anterior fue negativa, justifique la respuesta" />
                    </div>
                    <div>
                        <Textarea
                            label="Justificación"
                            maxlength="4000"
                            id="justificacion_ambiente_inactivo"
                            error={errors.justificacion_ambiente_inactivo}
                            bind:value={$formJustificacionAmbienteInactivo.justificacion_ambiente_inactivo}
                            required
                            on:blur={() => {
                                syncColumnLong('justificacion_ambiente_inactivo', $formJustificacionAmbienteInactivo), ($form.justificacion_ambiente_inactivo = $formJustificacionAmbienteInactivo.justificacion_ambiente_inactivo)
                            }}
                        />
                    </div>
                </div>
            {/if}

            <div class="py-24 grid grid-cols-2">
                <div>
                    <Label required class="mb-4" labelFor="ambiente_activo_procesos_idi" value="16. ¿A la fecha el ambiente modernizado por Sennova está activo para realizar procesos de investigación, desarrollo tecnológico y/o innovación con semilleros o programas de formación?" />
                </div>
                <div>
                    <Select items={opcionesSiNo} id="ambiente_activo_procesos_idi" bind:selectedValue={$form.ambiente_activo_procesos_idi} error={errors.ambiente_activo_procesos_idi} autocomplete="off" placeholder="Seleccione una opción" required />
                </div>
            </div>

            {#if $form.ambiente_activo_procesos_idi?.value == 1}
                <div class="py-24 grid grid-cols-2 pl-4">
                    <div>
                        <Label required class="mb-4" labelFor="numero_proyectos_beneficiados" value="Si la respuesta anterior fue afirmativa, relacione el número de proyectos beneficiados y/o ejecutados en el ambiente modernizado por Sennova" />
                    </div>
                    <div>
                        <Input label="Número de proyectos" id="numero_proyectos_beneficiados" type="number" input$min="0" input$max="999999" class="mt-1" error={errors.numero_proyectos_beneficiados} placeholder="Escriba el número de proyectos" bind:value={$form.numero_proyectos_beneficiados} required />
                    </div>
                </div>

                <div class="py-24 grid grid-cols-2 pl-4">
                    <div>
                        <Label required class="mb-4" labelFor="cod_proyectos_beneficiados" value="Si la respuesta anterior fue afirmativa, relacione los códigos y nombres de los proyectos beneficiados y/o ejecutados en el ambiente modernizado por Sennova" />
                    </div>
                    <div>
                        <Tags id="cod_proyectos_beneficiados" class="mt-4" enforceWhitelist={false} bind:tags={$form.cod_proyectos_beneficiados} placeholder="Códigos SGPS" error={errors.cod_proyectos_beneficiados} required />
                        <InfoMessage>Separar códigos por coma o dar Enter una vez finalice de escribir</InfoMessage>
                    </div>
                </div>

                <div class="py-24 grid grid-cols-2 pl-4">
                    <div>
                        <Label required class="mb-4" labelFor="semilleros_investigacion_id" value="Si la respuesta anterior fue afirmativa, relacione los semilleros de investigación beneficiados con el ambiente modernizado por Sennova" />
                    </div>
                    <div>
                        <SelectMulti id="semilleros_investigacion_id" bind:selectedValue={$form.semilleros_investigacion_id} items={semillerosInvestigacion} isMulti={true} error={errors.semilleros_investigacion_id} placeholder="Buscar por el nombre del semillero de investigación" required />
                    </div>
                </div>
            {/if}

            <div class="py-24 grid grid-cols-2">
                <div>
                    <Label required class="mb-4" labelFor="ambiente_formacion_complementaria" value="17. ¿El ambiente de formación ha generado formación complementaria después de la modernización con Sennova?" />
                </div>
                <div>
                    <Select items={opcionesSiNo} id="ambiente_formacion_complementaria" bind:selectedValue={$form.ambiente_formacion_complementaria} error={errors.ambiente_formacion_complementaria} autocomplete="off" placeholder="Seleccione una opción" required />
                </div>
            </div>

            {#if $form.ambiente_formacion_complementaria?.value == 1}
                <div class="py-24 grid grid-cols-2 pl-4">
                    <div>
                        <Label required class="mb-4" labelFor="numero_total_cursos_comp" value="Si la respuesta anterior fue afirmativa, relacione el número total de cursos complementarios que se ha brindado formación complementaria" />
                    </div>
                    <div>
                        <Input label="Número total" id="numero_total_cursos_comp" type="number" input$min="0" input$max="999999" class="mt-1" error={errors.numero_total_cursos_comp} placeholder="Escriba el número de proyectos" bind:value={$form.numero_total_cursos_comp} required />
                    </div>
                </div>

                <div class="py-24 grid grid-cols-2 pl-4">
                    <div>
                        <Label required class="mb-4" labelFor="numero_cursos_empresas" value="Si la respuesta anterior fue afirmativa, relacione el número de cursos complementarios a empresas que se ha brindado formación complementaria" />
                    </div>
                    <div>
                        <Input id="numero_cursos_empresas" type="number" input$min="0" input$max="999999" class="mt-1" error={errors.numero_cursos_empresas} placeholder="Escriba el número de proyectos" bind:value={$form.numero_cursos_empresas} required />
                    </div>
                </div>

                <div class="py-24 grid grid-cols-2 pl-4">
                    <div>
                        <Label required={$form.numero_cursos_empresas > 0 ? 'required' : undefined} class="mb-4" labelFor="datos_empresa" value="Si la respuesta anterior fue afirmativa, relacione el NIT y nombre de las empresas (cuando aplique) que se ha brindada formación complementaria" />
                    </div>
                    <div>
                        <Tags id="datos_empresa" class="mt-4" enforceWhitelist={false} bind:tags={$form.datos_empresa} placeholder="Empresas" error={errors.datos_empresa} required={$form.numero_cursos_empresas > 0 ? 'required' : undefined} />
                        <InfoMessage>Separar empresas por coma o dar Enter una vez finalice de escribir</InfoMessage>
                    </div>
                </div>

                <div class="py-24 grid grid-cols-2 pl-4">
                    <div>
                        <Label required class="mb-4" labelFor="numero_personas_certificadas" value="Si la respuesta anterior fue afirmativa, relacione el número total de personas certificadas de las empresas que se ha brindado formación complementaria." />
                    </div>
                    <div>
                        <Input id="numero_personas_certificadas" type="number" input$min="0" input$max="999999" class="mt-1" error={errors.numero_personas_certificadas} placeholder="Escriba el número total de personas certificadas" bind:value={$form.numero_personas_certificadas} required />
                    </div>
                </div>

                <div class="py-24 grid grid-cols-2 pl-4">
                    <div>
                        <Label class="mb-4" labelFor="cursos_complementarios" value="Si la respuesta anterior fue afirmativa, relacione los códigos y nombres Sena de cada curso de formación complementario" />
                    </div>
                    <div>
                        <Tags id="cursos_complementarios" class="mt-4" enforceWhitelist={false} bind:tags={$form.cursos_complementarios} placeholder="Cursos de formación complementarios" error={errors.cursos_complementarios} />
                        <InfoMessage>Separar cursos por coma o dar Enter una vez finalice de escribir</InfoMessage>
                    </div>
                </div>
            {/if}

            <div class="py-24 grid grid-cols-2">
                <div>
                    <Label required class="mb-4" labelFor="coordenada_latitud_ambiente" value="18. Diligencie la coordenada latitud (W) del ambiente de formación modernizado por Sennova (generado en Google maps). Ejemplo: -74.062916" />
                </div>
                <div>
                    <Input label="Latitud" id="coordenada_latitud_ambiente" type="text" class="mt-1" error={errors.coordenada_latitud_ambiente} placeholder="Escriba la latitud" bind:value={$form.coordenada_latitud_ambiente} required />
                    <InfoMessage>Más información en el siguiente enlace <a href="https://support.google.com/maps/answer/18539?hl=es-MX&co=GENIE.Platform%3DAndroid&oco=1" class="underline" target="_blank">https://support.google.com/maps/answer/18539?hl=es-MX&co=GENIE.Platform%3DAndroid&oco=1</a> (sección “Cómo obtener las coordenadas de un lugar”)</InfoMessage>
                </div>
            </div>

            <div class="py-24 grid grid-cols-2">
                <div>
                    <Label required class="mb-4" labelFor="coordenada_longitud_ambiente" value="19. Diligencie la coordenada longitud (N) del ambiente de formación modernizado por Sennova (generado en Google maps). Ejemplo: 4.643244" />
                </div>
                <div>
                    <Input label="Longitud" id="coordenada_longitud_ambiente" type="text" class="mt-1" error={errors.coordenada_longitud_ambiente} placeholder="Escriba la latitud" bind:value={$form.coordenada_longitud_ambiente} required />
                    <InfoMessage>Más información en el siguiente enlace <a href="https://support.google.com/maps/answer/18539?hl=es-MX&co=GENIE.Platform%3DAndroid&oco=1" class="underline" target="_blank">https://support.google.com/maps/answer/18539?hl=es-MX&co=GENIE.Platform%3DAndroid&oco=1</a> (sección “Cómo obtener las coordenadas de un lugar”)</InfoMessage>
                </div>
            </div>

            <div class="py-24 grid grid-cols-2">
                <div>
                    <Label required class="mb-4" labelFor="impacto_procesos_formacion" value="20. Describa el impacto generado en los procesos de formación" />
                </div>
                <div>
                    <Textarea
                        label="Impacto"
                        maxlength="4000"
                        id="impacto_procesos_formacion"
                        error={errors.impacto_procesos_formacion}
                        bind:value={$formImpactoProcesosFormacion.impacto_procesos_formacion}
                        required
                        on:blur={() => {
                            syncColumnLong('impacto_procesos_formacion', $formImpactoProcesosFormacion), ($form.impacto_procesos_formacion = $formImpactoProcesosFormacion.impacto_procesos_formacion)
                        }}
                    />
                </div>
            </div>

            <div class="py-24 grid grid-cols-2">
                <div>
                    <Label required class="mb-4" labelFor="pertinencia_sector_productivo" value="21. Describa la pertinencia obtenida con el sector productivo" />
                </div>
                <div>
                    <Textarea
                        label="Pertinencia"
                        maxlength="4000"
                        id="pertinencia_sector_productivo"
                        error={errors.pertinencia_sector_productivo}
                        bind:value={$formPertinenciaSectorProductivo.pertinencia_sector_productivo}
                        required
                        on:blur={() => {
                            syncColumnLong('pertinencia_sector_productivo', $formPertinenciaSectorProductivo), ($form.pertinencia_sector_productivo = $formPertinenciaSectorProductivo.pertinencia_sector_productivo)
                        }}
                    />
                </div>
            </div>

            <div class="py-24 grid grid-cols-2">
                <div>
                    <Label required class="mb-4" labelFor="numero_publicaciones" value="22. Relacione el número de publicaciones derivadas con el ambiente de aprendizaje después de ejecutar el proyecto de modernización SENNOVA." />
                </div>
                <div>
                    <Input label="Número total" id="numero_publicaciones" type="number" input$min="0" input$max="999999" class="mt-1" error={errors.numero_publicaciones} placeholder="Escriba el número de técnicas o tecnologías adquiridas" bind:value={$form.numero_publicaciones} required />
                </div>
            </div>

            <div class="py-24 grid grid-cols-2">
                <div>
                    <Label required class="mb-4" labelFor="numero_aprendices_beneficiados" value="23. Relacione el número de aprendices beneficiados con el ambiente de aprendizaje después de ejecutar el proyecto de modernización SENNOVA. " />
                </div>
                <div>
                    <Input label="Número total" id="numero_aprendices_beneficiados" type="number" input$min="0" input$max="999999" class="mt-1" error={errors.numero_aprendices_beneficiados} placeholder="Escriba el número de técnicas o tecnologías adquiridas" bind:value={$form.numero_aprendices_beneficiados} required />
                </div>
            </div>

            <h1 class="py-24 text-center">Describa de forma general (en los que aplique) el aporte del proyecto ejecutado de modernización SENNOVA a los indicadores de los proyectos relacionados en el artículo 5 del acuerdo 003 del 02 de febrero de 2012.</h1>

            <div class="py-24 grid grid-cols-2">
                <div>
                    <Label class="mb-4" labelFor="productividad_beneficiarios" value="24. Productividad y competitividad del (los) beneficiario(s) final(es) del proyecto." />
                </div>
                <div>
                    <Textarea
                        label="Descripción"
                        maxlength="4000"
                        id="productividad_beneficiarios"
                        error={errors.productividad_beneficiarios}
                        bind:value={$formProductividadBeneficiarios.productividad_beneficiarios}
                        on:blur={() => {
                            syncColumnLong('productividad_beneficiarios', $formProductividadBeneficiarios), ($form.productividad_beneficiarios = $formProductividadBeneficiarios.productividad_beneficiarios)
                        }}
                    />
                </div>
            </div>

            <div class="py-24 grid grid-cols-2">
                <div>
                    <Label class="mb-4" labelFor="generacion_empleo" value="25. Generación o mantenimiento de empleo por parte del (los) beneficiario(s) del proyecto." />
                </div>
                <div>
                    <Textarea
                        label="Descripción"
                        maxlength="4000"
                        id="generacion_empleo"
                        error={errors.generacion_empleo}
                        bind:value={$formGeneracionEmpleo.generacion_empleo}
                        on:blur={() => {
                            syncColumnLong('generacion_empleo', $formGeneracionEmpleo), ($form.generacion_empleo = $formGeneracionEmpleo.generacion_empleo)
                        }}
                    />
                </div>
            </div>

            <div class="py-24 grid grid-cols-2">
                <div>
                    <Label class="mb-4" labelFor="creacion_empresas" value="26. Creación de nuevas empresas y diseño y desarrollo de nuevos productos, procesos o servicios" />
                </div>
                <div>
                    <Textarea
                        label="Descripción"
                        maxlength="4000"
                        id="creacion_empresas"
                        error={errors.creacion_empresas}
                        bind:value={$formCreacionEmpresas.creacion_empresas}
                        on:blur={() => {
                            syncColumnLong('creacion_empresas', $formCreacionEmpresas), ($form.creacion_empresas = $formCreacionEmpresas.creacion_empresas)
                        }}
                    />
                </div>
            </div>

            <div class="py-24 grid grid-cols-2">
                <div>
                    <Label class="mb-4" labelFor="incorporacion_nuevos_conocimientos" value="27. Incorporación de nuevos conocimientos y competencias laborales en el talento humano en la(s) empresa(s) beneficiaria(s) del proyecto" />
                </div>
                <div>
                    <Textarea
                        label="Descripción"
                        maxlength="4000"
                        id="incorporacion_nuevos_conocimientos"
                        error={errors.incorporacion_nuevos_conocimientos}
                        bind:value={$formIncorporacionNuevosConocimientos.incorporacion_nuevos_conocimientos}
                        on:blur={() => {
                            syncColumnLong('incorporacion_nuevos_conocimientos', $formIncorporacionNuevosConocimientos), ($form.incorporacion_nuevos_conocimientos = $formIncorporacionNuevosConocimientos.incorporacion_nuevos_conocimientos)
                        }}
                    />
                </div>
            </div>

            <div class="py-24 grid grid-cols-2">
                <div>
                    <Label class="mb-4" labelFor="valor_agregado_entidades" value="28. Generación de valor agregado en la(s) entidad(es) beneficiaria(s) del proyecto" />
                </div>
                <div>
                    <Textarea
                        label="Descripción"
                        maxlength="4000"
                        id="valor_agregado_entidades"
                        error={errors.valor_agregado_entidades}
                        bind:value={$formValorAgregadoEntidades.valor_agregado_entidades}
                        on:blur={() => {
                            syncColumnLong('valor_agregado_entidades', $formValorAgregadoEntidades), ($form.valor_agregado_entidades = $formValorAgregadoEntidades.valor_agregado_entidades)
                        }}
                    />
                </div>
            </div>

            <div class="py-24 grid grid-cols-2">
                <div>
                    <Label class="mb-4" labelFor="fortalecimiento_programas_formacion" value="29. Fortalecimiento de programas de formación del Sena" />
                </div>
                <div>
                    <Textarea
                        label="Descripción"
                        maxlength="4000"
                        id="fortalecimiento_programas_formacion"
                        error={errors.fortalecimiento_programas_formacion}
                        bind:value={$formFortalecimientoProgramasFormacion.fortalecimiento_programas_formacion}
                        on:blur={() => {
                            syncColumnLong('fortalecimiento_programas_formacion', $formFortalecimientoProgramasFormacion), ($form.fortalecimiento_programas_formacion = $formFortalecimientoProgramasFormacion.fortalecimiento_programas_formacion)
                        }}
                    />
                </div>
            </div>

            <div class="py-24 grid grid-cols-2">
                <div>
                    <Label class="mb-4" labelFor="transferencia_tecnologias" value="30. Transferencia de tecnologías al Sena y a los sectores productivos relacionados" />
                </div>
                <div>
                    <Textarea
                        label="Descripción"
                        maxlength="4000"
                        id="transferencia_tecnologias"
                        error={errors.transferencia_tecnologias}
                        bind:value={$formTransferenciaTecnologias.transferencia_tecnologias}
                        on:blur={() => {
                            syncColumnLong('transferencia_tecnologias', $formTransferenciaTecnologias), ($form.transferencia_tecnologias = $formTransferenciaTecnologias.transferencia_tecnologias)
                        }}
                    />
                </div>
            </div>

            <div class="py-24 grid grid-cols-2">
                <div>
                    <Label class="mb-4" labelFor="cobertura_perntinencia_formacion" value="31. Cobertura, calidad y pertinencia de la formación" />
                </div>
                <div>
                    <Textarea
                        label="Descripción"
                        maxlength="4000"
                        id="cobertura_perntinencia_formacion"
                        error={errors.cobertura_perntinencia_formacion}
                        bind:value={$formCoberturaPerntinenciaFormacion.cobertura_perntinencia_formacion}
                        on:blur={() => {
                            syncColumnLong('cobertura_perntinencia_formacion', $formCoberturaPerntinenciaFormacion), ($form.cobertura_perntinencia_formacion = $formCoberturaPerntinenciaFormacion.cobertura_perntinencia_formacion)
                        }}
                    />
                </div>
            </div>

            <div class="py-24 grid grid-cols-2">
                <div>
                    <Label class="mb-4" labelFor="palabras_clave_ambiente" value="32. Palabras claves relacionadas con el ambiente de formación modernizado por Sennova" />
                </div>
                <div>
                    <Tags id="palabras_clave_ambiente" class="mt-4" enforceWhitelist={false} bind:tags={$form.palabras_clave_ambiente} placeholder="Palabras clave" error={errors.palabras_clave_ambiente} />
                    <InfoMessage>Separar palabras clave por coma o dar Enter una vez finalice de escribir</InfoMessage>
                </div>
            </div>

            <div class="py-24 grid grid-cols-2">
                <div>
                    <Label class="mb-4" labelFor="observaciones_generales_ambiente" value="33. Observaciones generales del ambiente modernizado por Sennova" />
                </div>
                <div>
                    <Textarea
                        label="Observaciones"
                        maxlength="4000"
                        id="observaciones_generales_ambiente"
                        bind:value={$formObservacionesGeneralesAmbiente.observaciones_generales_ambiente}
                        on:blur={() => {
                            syncColumnLong('observaciones_generales_ambiente', $formObservacionesGeneralesAmbiente), ($form.observaciones_generales_ambiente = $formObservacionesGeneralesAmbiente.observaciones_generales_ambiente)
                        }}
                        error={errors.observaciones_generales_ambiente}
                    />
                </div>
            </div>

            <div class="py-24">
                <Label class="mb-4" labelFor="soporte_fotos_ambiente" value="Archivo formato (.pdf) con fotos del ambiente modernizado con el proyecto Sennova" />
                <File id="soporte_fotos_ambiente" maxSize="10000" bind:value={$form.soporte_fotos_ambiente} valueDb={ambienteModernizacion.soporte_fotos_ambiente} error={errors.soporte_fotos_ambiente} route={ambienteModernizacion.soporte_fotos_ambiente?.includes('http') ? null : route('ambientes-modernizacion.download-file-sharepoint', [ambienteModernizacion, 'soporte_fotos_ambiente'])} />
            </div>
        {/if}
    </fieldset>
    <div class="shadow-inner bg-app-200 border-app-400 flex items-center justify-between mt-14 px-8 py-4">
        {#if ambienteModernizacion}
            <small class="flex items-center text-app-700">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {ambienteModernizacion.updated_at}
            </small>
        {/if}

        {#if ambienteModernizacion?.allowed.to_update}
            <Button on:click={() => (dialogGuardar = true)} class="ml-auto" type="button">Revisar información antes de guardar</Button>
        {:else if allowedToCreate}
            <span />
            <LoadingButton loading={$form.processing} form="semillero-investigacion-form">Guardar</LoadingButton>
        {:else}
            <span class="inline-block ml-1.5"> El semillero no se puede modificar </span>
        {/if}
    </div>
</form>

{#if ambienteModernizacion?.allowed.to_update}
    <Dialog bind:open={dialogGuardar}>
        <div slot="title">
            <div class="m-auto relative text-app-600">
                <figure>
                    <img src="/images/megaphone.png" alt="" class="m-auto w-20" />
                </figure>
            </div>
        </div>
        <div slot="header-info" class="ml-10 shadow-md">
            <InfoMessage>
                Se recomienda que antes de dar clic en el botón <strong>Guardar</strong> descargue el borrador en archivo Word. De esta manera si ocurre un error al guardar puede recuperar la información registrada. Luego de descargar el borrador de clic en el botón <strong>Guardar</strong>. Revise que se muestra un mensaje en verde que dice '<strong>
                    El recurso se ha modificado correctamente</strong
                >'. Si después de unos segundos no se muestra el mensaje y al recargar el aplicativo observa que la información no se ha guardado por favor envie un correo a <a href="mailto:sgpssipro@sena.edu.co" class="underline">sgpssipro@sena.edu.co</a>
                desde una cuenta <strong>@sena.edu.co</strong> y describa detalladamente lo ocurrido (Importante adjuntar el borrador e indicar el código del proyecto).
            </InfoMessage>
        </div>
        <div slot="content">
            <Export2Word id="borrador" showButton={false} bind:this={exportComponent}>
                <h1 class="font-black text-center my-10">Información del seguimiento post-cierre de ambientes de modernización</h1>
                <p class="capitalize" style="white-space: pre-line; margin-bottom: 4rem">
                    <strong>Regional:</strong>
                    {ambienteModernizacion?.seguimiento_ambiente_modernizacion.centro_formacion.regional.nombre}
                </p>

                <p style="white-space: pre-line; margin-bottom: 4rem">
                    <strong>Centro de formación:</strong>
                    {ambienteModernizacion?.seguimiento_ambiente_modernizacion.centro_formacion.nombre}
                </p>

                <p style="white-space: pre-line; margin-bottom: 4rem">
                    <strong>Año de modernización:</strong>
                    {ambienteModernizacion?.year_modernizacion}
                </p>

                <p style="white-space: pre-line; margin-bottom: 4rem">
                    <strong>1. Código proyecto SGPS:</strong>
                    {ambienteModernizacion?.seguimiento_ambiente_modernizacion.codigo_proyecto_sgps.titulo}
                    <br />
                    Código: SGPS-{ambienteModernizacion?.seguimiento_ambiente_modernizacion.codigo_proyecto_sgps.codigo_sgps}
                    <br />
                    Año: {ambienteModernizacion?.seguimiento_ambiente_modernizacion.codigo_proyecto_sgps.year_ejecucion}
                </p>

                <p style="white-space: pre-line; margin-bottom: 4rem">
                    <strong>2. Nombre del ambiente(s) de formación modernizado por Sennova. Ejemplo: Ambiente de soldadura - Ambiente de confecciones:</strong>
                    {$form.nombre_ambiente ? $form.nombre_ambiente : 'Sin información registrada'}
                </p>

                <p style="white-space: pre-line; margin-bottom: 4rem">
                    <strong>3. Tipologías de los ambientes (Circular 3-2018- 143):</strong>
                    {$form.tipologia_ambiente_id ? $form.tipologia_ambiente_id?.label : 'Sin información registrada'}
                </p>
                <p style="white-space: pre-line; margin-bottom: 4rem">
                    <strong>4. Área de conocimiento relacionada con el ambiente modernizado por Sennova:</strong>
                    {$form.area_conocimiento_id ? $form.area_conocimiento_id?.label : 'Sin información registrada'}
                </p>
                <p style="white-space: pre-line; margin-bottom: 4rem">
                    <strong>Subárea relacionada con el ambiente modernizado por Sennova:</strong>
                    {$form.subarea_conocimiento_id ? $form.subarea_conocimiento_id?.label : 'Sin información registrada'}
                </p>
                <p style="white-space: pre-line; margin-bottom: 4rem">
                    <strong>Disciplina relacionada con el ambiente modernizado por Sennova:</strong>
                    {$form.disciplina_subarea_conocimiento_id ? $form.disciplina_subarea_conocimiento_id?.label : 'Sin información registrada'}
                </p>
                <p style="white-space: pre-line; margin-bottom: 4rem">
                    <strong>5. Red de conocimiento relacionada con el ambiente modernizado por Sennova (resolución 335 de 2012):</strong>
                    {$form.red_conocimiento_id ? $form.red_conocimiento_id?.label : 'Sin información registrada'}
                </p>
                <p style="white-space: pre-line; margin-bottom: 4rem">
                    <strong>6. Código CIIU relacionado con el ambiente modernizado por Sennova:</strong>
                    {$form.actividad_economica_id ? $form.actividad_economica_id?.label : 'Sin información registrada'}
                </p>
                <p style="white-space: pre-line; margin-bottom: 4rem">
                    <strong>7. Temática estratégica SENA relacionada con el ambiente modernizado por Sennova:</strong>
                    {$form.tematica_estrategica_id ? $form.tematica_estrategica_id?.label : 'Sin información registrada'}
                </p>
                <p style="white-space: pre-line; margin-bottom: 4rem">
                    <strong>8. Línea investigación relacionada con el ambiente modernizado por Sennova:</strong>
                    {$form.linea_investigacion_id ? $form.linea_investigacion_id?.label : 'Sin información registrada'}
                </p>
                <p style="white-space: pre-line">
                    <strong>9. ¿El proyecto se alinea con las Mesas Sectoriales?</strong>
                    {$form.alineado_mesas_sectoriales ? $form.alineado_mesas_sectoriales?.label : 'Sin información registrada'}
                </p>
                <ul class="list-disc p-4">
                    {#each mesasSectoriales as { id, nombre }, i}
                        {#each $form.mesa_sectorial_id as mesaSectorialRelacionada}
                            {#if id == mesaSectorialRelacionada}
                                <li>{nombre}</li>
                            {/if}
                        {/each}
                    {/each}
                </ul>
                <p style="white-space: pre-line; margin-bottom: 4rem">
                    <strong>10. ¿El ambiente de formación ha sido financiado en más de una vigencia por Sennova?</strong>
                    {$form.financiado_anteriormente ? $form.financiado_anteriormente?.label : 'Sin información registrada'}
                </p>
                <p style="white-space: pre-line; margin-bottom: 4rem">
                    <strong>11. Relacione el número de técnicas o tecnologías adquiridas y/o mejoradas con el ambiente de aprendizaje, modernizado por SENNOVA:</strong>
                    {$form.numero_tecnicas_tecnologias ? $form.numero_tecnicas_tecnologias : 'Sin información registrada'}
                </p>
                <p style="white-space: pre-line">
                    <strong>12. Si la respuesta anterior fue afirmativa, relacione los códigos y nombres de los proyectos beneficiados y/o ejecutados en el ambiente modernizado por Sennova de convocatoria (SGPS) o de capacidad instalada (CAP):</strong>
                </p>
                {#if $form.codigos_proyectos_id}
                    <ul style="margin-bottom: 4rem">
                        {#each $form.codigos_proyectos_id as codigoProyecto}
                            <li>{codigoProyecto.label}</li>
                        {/each}
                    </ul>
                {:else}
                    <p style="margin-bottom: 4rem">Sin información registrada</p>
                {/if}
                <p style="white-space: pre-line; margin-bottom: 4rem">
                    <strong>13. Estado general de maquinaria y equipo instalados en el ambiente de aprendizaje, modernizado por SENNOVA:</strong>
                    {$form.estado_general_maquinaria?.value ? $form.estado_general_maquinaria?.label : 'Sin información registrada'}
                </p>
                <p style="white-space: pre-line; margin-bottom: 4rem">
                    <strong>14. Si la respuesta anterior fue regular o malo, describa la razón. Para mayor especificidad listar máquina por máquina para identificación a partir del tiempo de vida útil:</strong>
                    {$formRazonEstadoGeneral.razon_estado_general ? $formRazonEstadoGeneral.razon_estado_general : 'Sin información registrada'}
                </p>
                <p style="white-space: pre-line; margin-bottom: 4rem">
                    <strong>15. ¿A la fecha el ambiente modernizado por Sennova está activo para realizar procesos de formación?</strong>
                    {$form.ambiente_activo ? $form.ambiente_activo?.label : 'Sin información registrada'}
                </p>
                <p style="white-space: pre-line">
                    <strong>Si la respuesta anterior fue afirmativa, seleccione los programas de formación con registro calificado beneficiados:</strong>
                </p>
                {#if $form.programas_formacion_calificados}
                    <ul style="margin-bottom: 4rem">
                        {#each $form.programas_formacion_calificados as programaFormacionCalificado}
                            <li>{programaFormacionCalificado.label}</li>
                        {/each}
                    </ul>
                {:else}
                    <p style="margin-bottom: 4rem">Sin información registrada</p>
                {/if}
                <p style="white-space: pre-line">
                    <strong>Si la respuesta anterior fue afirmativa, seleccione los programas de formación beneficiados:</strong>
                </p>
                {#if $form.programas_formacion}
                    <ul style="margin-bottom: 4rem">
                        {#each $form.programas_formacion as programaFormacion}
                            <li>{programaFormacion.label}</li>
                        {/each}
                    </ul>
                {:else}
                    <p style="margin-bottom: 4rem">Sin información registrada</p>
                {/if}
                <p style="white-space: pre-line; margin-bottom: 4rem">
                    <strong>Si la respuesta anterior fue negativa, justifique la respuesta:</strong>
                    {$formJustificacionAmbienteInactivo.justificacion_ambiente_inactivo ? $formJustificacionAmbienteInactivo.justificacion_ambiente_inactivo : 'Sin información registrada'}
                </p>
                <p style="white-space: pre-line; margin-bottom: 4rem">
                    <strong>16. ¿A la fecha el ambiente modernizado por Sennova está activo para realizar procesos de investigación, desarrollo tecnológico y/o innovación con semilleros o programas de formación?</strong>
                    {$form.ambiente_activo_procesos_idi ? $form.ambiente_activo_procesos_idi?.label : 'Sin información registrada'}
                </p>
                <p style="white-space: pre-line; margin-bottom: 4rem">
                    <strong>Si la respuesta anterior fue afirmativa, relacione el número de proyectos beneficiados y/o ejecutados en el ambiente modernizado por Sennova:</strong>
                    {$form.numero_proyectos_beneficiados ? $form.numero_proyectos_beneficiados : 'Sin información registrada'}
                </p>
                <p style="white-space: pre-line">
                    <strong>Si la respuesta anterior fue afirmativa, relacione los códigos y nombres de los proyectos beneficiados y/o ejecutados en el ambiente modernizado por Sennova:</strong>
                </p>
                {#if JSON.parse($form.cod_proyectos_beneficiados)?.length > 0}
                    <ul style="margin-bottom: 4rem">
                        {#each JSON.parse($form.cod_proyectos_beneficiados) as codigoProyecto}
                            <li>{codigoProyecto.value}</li>
                        {/each}
                    </ul>
                {:else}
                    <p style="margin-bottom: 4rem">Sin información registrada</p>
                {/if}
                <p style="white-space: pre-line">
                    <strong>Si la respuesta anterior fue afirmativa, relacione los semilleros de investigación beneficiados con el ambiente modernizado por Sennova:</strong>
                </p>
                {#if $form.semilleros_investigacion_id}
                    <ul style="margin-bottom: 4rem">
                        {#each $form.semilleros_investigacion_id as semilleroInvestigacion}
                            <li>{semilleroInvestigacion.label}</li>
                        {/each}
                    </ul>
                {:else}
                    <p style="margin-bottom: 4rem">Sin información registrada</p>
                {/if}
                <p style="white-space: pre-line; margin-bottom: 4rem">
                    <strong>17. ¿El ambiente de formación ha generado formación complementaria después de la modernización con Sennova?</strong>
                    {$form.ambiente_formacion_complementaria ? $form.ambiente_formacion_complementaria?.label : 'Sin información registrada'}
                </p>
                <p style="white-space: pre-line; margin-bottom: 4rem">
                    <strong>Si la respuesta anterior fue afirmativa, relacione el número total de cursos complementarios que se ha brindado formación complementaria:</strong>
                    {$form.numero_total_cursos_comp ? $form.numero_total_cursos_comp : 'Sin información registrada'}
                </p>
                <p style="white-space: pre-line; margin-bottom: 4rem">
                    <strong>Si la respuesta anterior fue afirmativa, relacione el número de cursos complementarios a empresas que se ha brindado formación complementaria:</strong>
                    {$form.numero_cursos_empresas ? $form.numero_cursos_empresas : 'Sin información registrada'}
                </p>
                <p style="white-space: pre-line">
                    <strong>Si la respuesta anterior fue afirmativa, relacione el NIT y nombre de las empresas (cuando aplique) que se ha brindada formación complementaria:</strong>
                </p>
                {#if JSON.parse($form.datos_empresa)?.length > 0}
                    <ul style="margin-bottom: 4rem">
                        {#each JSON.parse($form.datos_empresa) as empresa}
                            <li>{empresa.value}</li>
                        {/each}
                    </ul>
                {:else}
                    <p style="margin-bottom: 4rem">Sin información registrada</p>
                {/if}
                <p style="white-space: pre-line; margin-bottom: 4rem">
                    <strong>Si la respuesta anterior fue afirmativa, relacione el número total de personas certificadas de las empresas que se ha brindado formación complementaria:</strong>
                    {$form.numero_personas_certificadas ? $form.numero_personas_certificadas : 'Sin información registrada'}
                </p>
                <p style="white-space: pre-line">
                    <strong>Si la respuesta anterior fue afirmativa, relacione los códigos y nombres Sena de cada curso de formación complementario:</strong>
                </p>
                {#if JSON.parse($form.cursos_complementarios)?.length > 0}
                    <ul style="margin-bottom: 4rem">
                        {#each JSON.parse($form.cursos_complementarios) as curso}
                            <li>{curso.value}</li>
                        {/each}
                    </ul>
                {:else}
                    <p style="margin-bottom: 4rem">Sin información registrada</p>
                {/if}
                <p style="white-space: pre-line; margin-bottom: 4rem">
                    <strong>18. Diligencie la coordenada latitud (W) del ambiente de formación modernizado por Sennova (generado en Google maps). Ejemplo: -74.062916:</strong>
                    {$form.coordenada_latitud_ambiente ? $form.coordenada_latitud_ambiente : 'Sin información registrada'}
                </p>
                <p style="white-space: pre-line; margin-bottom: 4rem">
                    <strong>19. Diligencie la coordenada longitud (N) del ambiente de formación modernizado por Sennova (generado en Google maps). Ejemplo: 4.643244:</strong>
                    {$form.coordenada_longitud_ambiente ? $form.coordenada_longitud_ambiente : 'Sin información registrada'}
                </p>
                <p style="white-space: pre-line; margin-bottom: 4rem">
                    <strong>20. Describa el impacto generado en los procesos de formación:</strong>
                    {$formImpactoProcesosFormacion.impacto_procesos_formacion ? $formImpactoProcesosFormacion.impacto_procesos_formacion : 'Sin información registrada'}
                </p>
                <p style="white-space: pre-line; margin-bottom: 4rem">
                    <strong>21. Describa la pertinencia obtenida con el sector productivo:</strong>
                    {$formPertinenciaSectorProductivo.pertinencia_sector_productivo ? $formPertinenciaSectorProductivo.pertinencia_sector_productivo : 'Sin información registrada'}
                </p>
                <p style="white-space: pre-line; margin-bottom: 4rem">
                    <strong>22. Relacione el número de publicaciones derivadas con el ambiente de aprendizaje después de ejecutar el proyecto de modernización SENNOVA:</strong>
                    {$form.numero_publicaciones ? $form.numero_publicaciones : 'Sin información registrada'}
                </p>
                <p style="white-space: pre-line; margin-bottom: 4rem">
                    <strong>23. Relacione el número de aprendices beneficiados con el ambiente de aprendizaje después de ejecutar el proyecto de modernización SENNOVA:</strong>
                    {$form.numero_aprendices_beneficiados ? $form.numero_aprendices_beneficiados : 'Sin información registrada'}
                </p>
                <p style="white-space: pre-line; margin-bottom: 4rem">
                    <strong>24. Productividad y competitividad del (los) beneficiario(s) final(es) del proyecto:</strong>
                    {$formProductividadBeneficiarios.productividad_beneficiarios ? $formProductividadBeneficiarios.productividad_beneficiarios : 'Sin información registrada'}
                </p>
                <p style="white-space: pre-line; margin-bottom: 4rem">
                    <strong>25. Generación o mantenimiento de empleo por parte del (los) beneficiario(s) del proyecto:</strong>
                    {$formGeneracionEmpleo.generacion_empleo ? $formGeneracionEmpleo.generacion_empleo : 'Sin información registrada'}
                </p>
                <p style="white-space: pre-line; margin-bottom: 4rem">
                    <strong>26. Creación de nuevas empresas y diseño y desarrollo de nuevos productos, procesos o servicios:</strong>
                    {$formCreacionEmpresas.creacion_empresas ? $formCreacionEmpresas.creacion_empresas : 'Sin información registrada'}
                </p>
                <p style="white-space: pre-line; margin-bottom: 4rem">
                    <strong>27. Incorporación de nuevos conocimientos y competencias laborales en el talento humano en la(s) empresa(s) beneficiaria(s) del proyecto:</strong>
                    {$formIncorporacionNuevosConocimientos.incorporacion_nuevos_conocimientos ? $formIncorporacionNuevosConocimientos.incorporacion_nuevos_conocimientos : 'Sin información registrada'}
                </p>
                <p style="white-space: pre-line; margin-bottom: 4rem">
                    <strong>28. Generación de valor agregado en la(s) entidad(es) beneficiaria(s) del proyecto:</strong>
                    {$formValorAgregadoEntidades.valor_agregado_entidades ? $formValorAgregadoEntidades.valor_agregado_entidades : 'Sin información registrada'}
                </p>
                <p style="white-space: pre-line; margin-bottom: 4rem">
                    <strong>29. Fortalecimiento de programas de formación del Sena:</strong>
                    {$formFortalecimientoProgramasFormacion.fortalecimiento_programas_formacion ? $formFortalecimientoProgramasFormacion.fortalecimiento_programas_formacion : 'Sin información registrada'}
                </p>
                <p style="white-space: pre-line; margin-bottom: 4rem">
                    <strong>30. Transferencia de tecnologías al Sena y a los sectores productivos relacionados:</strong>
                    {$formTransferenciaTecnologias.transferencia_tecnologias ? $formTransferenciaTecnologias.transferencia_tecnologias : 'Sin información registrada'}
                </p>
                <p style="white-space: pre-line; margin-bottom: 4rem">
                    <strong>31. Cobertura, calidad y pertinencia de la formación:</strong>
                    {$formCoberturaPerntinenciaFormacion.cobertura_perntinencia_formacion ? $formCoberturaPerntinenciaFormacion.cobertura_perntinencia_formacion : 'Sin información registrada'}
                </p>
                <p style="white-space: pre-line">
                    <strong>32. Palabras claves relacionadas con el ambiente de formación modernizado por Sennova:</strong>
                </p>
                {#if JSON.parse($form.palabras_clave_ambiente)?.length > 0}
                    <ul style="margin-bottom: 4rem">
                        {#each JSON.parse($form.palabras_clave_ambiente) as palabraClave}
                            <li>{palabraClave.value}</li>
                        {/each}
                    </ul>
                {:else}
                    <p style="margin-bottom: 4rem">Sin información registrada</p>
                {/if}
                <p style="white-space: pre-line; margin-bottom: 4rem">
                    <strong>33. Observaciones generales del ambiente modernizado por Sennova:</strong>
                    {$formObservacionesGeneralesAmbiente.observaciones_generales_ambiente ? $formObservacionesGeneralesAmbiente.observaciones_generales_ambiente : 'Sin información registrada'}
                </p>
            </Export2Word>
        </div>
        <div slot="actions">
            <div class="p-4">
                <Button on:click={() => (dialogGuardar = false)} variant={null}>Cancelar</Button>
                {#if ambienteModernizacion}
                    <Button variant="raised" type="button" on:click={() => exportComponent.export2Word(ambienteModernizacion.seguimiento_ambiente_modernizacion.codigo)}>Descargar borrador en Word</Button>
                    {#if ambienteModernizacion?.allowed.to_update || allowedToCreate}
                        <LoadingButton loading={$form.processing} form="semillero-investigacion-form">Guardar</LoadingButton>
                    {:else}
                        <span class="inline-block ml-1.5"> El semillero no se puede modificar </span>
                    {/if}
                {/if}
            </div>
        </div>
    </Dialog>
{/if}
