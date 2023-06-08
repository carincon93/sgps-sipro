<script>
    import Label from '@/Shared/Label'
    import InputError from '@/Shared/InputError'
    import LoadingButton from '@/Shared/LoadingButton'
    import Textarea from '@/Shared/Textarea'
    import InfoMessage from '@/Shared/InfoMessage'
    import Select from '@/Shared/Select'
    import Input from '@/Shared/Input'

    export let errors
    export let proyecto
    export let convocatoria
    export let proyectoPresupuesto
    export let tiposLicencia
    export let tiposSoftware
    export let opcionesServiciosEdicion
    export let form
    export let submit
    export let segundoGrupoPresupuestal
    export let tercerGrupoPresupuestal
    export let usosPresupuestales
    export let conceptosViaticos
    export let formMunicipio
    export let method = ''

    let arrayTecerGrupoPresupuestal = tercerGrupoPresupuestal.filter(function (obj) {
        return obj.segundo_grupo_presupuestal_id == $form.segundo_grupo_presupuestal_id
    })
    function selectSegundoGrupoPresupuestal(event) {
        arrayUsosPresupuestales = []
        arrayTecerGrupoPresupuestal = []
        $form.tercer_grupo_presupuestal_id = null
        $form.convocatoria_presupuesto_id = null

        if (proyecto.linea_programatica.codigo == 69 || proyecto.linea_programatica.codigo == 70) {
            if (event.detail?.codigo != '2041102' || event.detail?.codigo != '2041101' || event.detail?.codigo != '20411204110401') {
                $form.concepto_viaticos = null
                $formMunicipio.proyecto_rol_sennova_id = null
                $formMunicipio.actividad_a_realizar = ''
                $formMunicipio.distancia_municipio = null
                $formMunicipio.frecuencia_semanal = null
                $formMunicipio.numero_visitas = 0
                $formMunicipio.municipios = null
            }
        }

        arrayTecerGrupoPresupuestal = tercerGrupoPresupuestal.filter(function (obj) {
            return obj.segundo_grupo_presupuestal_id == event.detail?.value
        })
    }

    let arrayUsosPresupuestales = usosPresupuestales.filter(function (obj) {
        return obj.tercer_grupo_presupuestal_id == $form.tercer_grupo_presupuestal_id
    })
    function selectTercerGrupoPresupuestal(event) {
        arrayUsosPresupuestales = usosPresupuestales.filter(function (obj) {
            return obj.segundo_grupo_presupuestal_id == $form.segundo_grupo_presupuestal_id?.value && obj.tercer_grupo_presupuestal_id == event.detail?.value
        })
    }

    let mensaje = ''
    let requiereEstudioMercado = arrayUsosPresupuestales.filter(function (obj) {
        return obj.requiere_estudio_mercado == true && obj.value == $form.convocatoria_presupuesto_id ? true : null
    })
    function selectUsoPresupuestal(event) {
        mensaje = event.detail?.mensaje
        requiereEstudioMercado = event.detail?.requiere_estudio_mercado
        $form.codigo_uso_presupuestal = event.detail?.codigo_uso_presupuestal
    }
</script>

<form on:submit|preventDefault={submit} id="form-proyecto-presupuesto" class="bg-white rounded shadow">
    <fieldset class="p-8" disabled={proyecto.allowed.to_update ? undefined : true}>
        <fieldset disabled={method == 'PUT' ? true : undefined}>
            <div class="mt-8">
                <Label required labelFor="segundo_grupo_presupuestal_id" value="Rubro concepto interno SENA" />
                <Select id="segundo_grupo_presupuestal_id" items={segundoGrupoPresupuestal} bind:selectedValue={$form.segundo_grupo_presupuestal_id} selectFunctions={[(event) => selectSegundoGrupoPresupuestal(event)]} error={errors.segundo_grupo_presupuestal_id} autocomplete="off" placeholder="Seleccione una opción" required />
            </div>
        </fieldset>

        {#if $form.segundo_grupo_presupuestal_id}
            <div class="mt-8">
                <Label required labelFor="tercer_grupo_presupuestal_id" value="Rubro concepto ministerio de hacienda" />
                <Select id="tercer_grupo_presupuestal_id" items={arrayTecerGrupoPresupuestal} bind:selectedValue={$form.tercer_grupo_presupuestal_id} selectFunctions={[(event) => selectTercerGrupoPresupuestal(event)]} error={errors.tercer_grupo_presupuestal_id} autocomplete="off" placeholder="Seleccione una opción" required />
            </div>
        {/if}

        {#if $form.segundo_grupo_presupuestal_id && $form.tercer_grupo_presupuestal_id}
            <div class="mt-8">
                <Label required labelFor="convocatoria_presupuesto_id" value="Uso presupuestal" />
                <Select id="convocatoria_presupuesto_id" items={arrayUsosPresupuestales} bind:selectedValue={$form.convocatoria_presupuesto_id} selectFunctions={[(event) => selectUsoPresupuestal(event)]} error={errors.convocatoria_presupuesto_id} autocomplete="off" placeholder="Seleccione una opción" required />
            </div>

            {#if mensaje}
                <InfoMessage message={mensaje} />
            {/if}
        {/if}

        {#if requiereEstudioMercado == false && $form.convocatoria_presupuesto_id}
            <InfoMessage message="<strong>Importante:</strong> El uso presupuestal seleccionado no requiere de estudio de mercado." />

            <div class="mt-10">
                <Input label="Valor total" id="valor_total" type="number" input$min="0" class="mt-1" bind:value={$form.valor_total} error={errors.valor_total} required />
            </div>
        {/if}

        <hr class="mt-10 mb-10" />

        <div class="mt-8">
            <Textarea label="Describa los bienes o servicios a adquirir. Sea específico" maxlength="40000" id="descripcion" error={errors.descripcion} bind:value={$form.descripcion} required />
        </div>

        <div class="mt-8">
            <Textarea label="Justificación de la necesidad: ¿por qué se requiere este producto o servicio?" maxlength="40000" id="justificacion" error={errors.justificacion} bind:value={$form.justificacion} required />
        </div>

        {#if $form.codigo_uso_presupuestal == '2010100600203101'}
            <div class="mt-8">
                <Label required class="mb-4" labelFor="tipo_licencia" value="Tipo de licencia" />
                <select id="tipo_licencia" class="w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50 focus:border-app-200 focus:ring-app-200 p-4" bind:value={$form.tipo_licencia} required>
                    <option value="">Seleccione el tipo de licencia </option>
                    {#each tiposLicencia as { value, label }}
                        <option {value}>{label}</option>
                    {/each}
                </select>
            </div>

            <div class="mt-8">
                <Label required class="mb-4" labelFor="tipo_software" value="Tipo de software" />
                <select id="tipo_software" class="w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50 focus:border-app-200 focus:ring-app-200 p-4" bind:value={$form.tipo_software} required>
                    <option value="">Seleccione el tipo de software </option>
                    {#each tiposSoftware as { value, label }}
                        <option {value}>{label}</option>
                    {/each}
                </select>
            </div>

            <div class="mt-8">
                <p>Periodo de uso</p>
                <div class="mt-8">
                    <Label required class="mb-4" labelFor="fecha_inicio" value="Fecha de inicio" />
                    <input label="Fecha de inicio" id="fecha_inicio" type="date" class="mt-1 p-4" bind:value={$form.fecha_inicio} required />
                </div>
                <div class="mt-8">
                    <Label required class="mb-4" labelFor="fecha_finalizacion" value="Fecha de finalización (Cuando aplique)" />
                    <input label="Fecha de finalización" id="fecha_finalizacion" type="date" class="mt-1 p-4" bind:value={$form.fecha_finalizacion} />
                </div>
            </div>
            {#if errors.fecha_inicio || errors.fecha_finalizacion}
                <InputError message={errors.fecha_inicio || errors.fecha_finalizacion} />
            {/if}
        {:else if ($form.codigo_uso_presupuestal == '2020200800901' && convocatoria.campos_convocatoria.find((element) => element.campo == 'nodo_editorial').convocatoriaId == convocatoria.id) || ($form.servicio_edicion_info && convocatoria.campos_convocatoria.find((element) => element.campo == 'nodo_editorial').convocatoriaId == convocatoria.id)}
            <div class="mt-8">
                <Label required class="mb-4" labelFor="servicio_edicion_info" value="Nodo editorial" />
                <Select id="servicio_edicion_info" items={opcionesServiciosEdicion} bind:selectedValue={$form.servicio_edicion_info} error={errors.servicio_edicion_info} autocomplete="off" placeholder="Seleccione una opción" required />
            </div>
        {/if}

        {#if proyecto.linea_programatica.codigo == 69}
            {#if $form.segundo_grupo_presupuestal_id?.codigo == '2041102' || $form.segundo_grupo_presupuestal_id?.codigo == '2041101' || $form.segundo_grupo_presupuestal_id?.codigo == '2041104'}
                <div class="mt-8">
                    <Label required labelFor="concepto_viaticos" value="Concepto" />
                    <Select id="concepto_viaticos" items={conceptosViaticos} bind:selectedValue={$form.concepto_viaticos} error={errors.concepto_viaticos} autocomplete="off" placeholder="Seleccione una opción" required />
                </div>
            {/if}
        {/if}

        <slot name="viaticos" />
    </fieldset>

    <div class="shadow-inner bg-app-200 border-app-400 flex items-center justify-between mt-14 px-8 py-4">
        {#if proyectoPresupuesto}
            <small class="flex items-center text-app-700">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {proyectoPresupuesto.updated_at}
            </small>
        {/if}
        {#if proyecto.allowed.to_update}
            <LoadingButton loading={$form.processing} class="ml-auto" type="submit">Guardar</LoadingButton>
        {:else}
            <span class="inline-block ml-1.5"> El recurso no se puede crear/modificar </span>
        {/if}
    </div>
</form>
