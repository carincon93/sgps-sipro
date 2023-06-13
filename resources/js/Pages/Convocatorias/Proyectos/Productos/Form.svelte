<script>
    import Label from '@/Shared/Label'
    import InputError from '@/Shared/InputError'
    import LoadingButton from '@/Shared/LoadingButton'
    import Select from '@/Shared/Select'
    import Textarea from '@/Shared/Textarea'
    import InfoMessage from '@/Shared/InfoMessage'

    export let errors
    export let proyecto
    export let producto
    export let resultados
    export let subtipologiasMinciencias
    export let tiposProducto
    export let form
    export let submit
    export let isSuperAdmin

    let actividades = resultados.find((item) => item.value == producto?.resultado_id)?.actividades

    function selectResultado(event) {
        actividades = event.detail.actividades
    }
</script>

<form on:submit|preventDefault={submit}>
    <fieldset class="p-8" disabled={proyecto.allowed.to_update ? undefined : true}>
        {#if proyecto.codigo_linea_programatica == 70}
            <InfoMessage class="my-8">
                <p>
                    <strong>Importante:</strong> Debe modifcar las fechas de ejecución, meta y las activiades a asociar.
                </p>
            </InfoMessage>
        {/if}

        <div class="mt-8 mb-8">
            <Label class="text-center" required value="Fecha de ejecución" />
            <div class="mt-4 flex items-start justify-around">
                <div class="mt-4 flex items-center">
                    <Label labelFor="fecha_inicio" value="Del" />
                    <div class="ml-4">
                        <input id="fecha_inicio" type="date" class="mt-1 block w-full p-4" min={proyecto.fecha_inicio} max={proyecto.fecha_finalizacion} bind:value={$form.fecha_inicio} required />
                    </div>
                </div>
                <div class="mt-4 flex items-center">
                    <Label labelFor="fecha_finalizacion" value="hasta" />
                    <div class="ml-4">
                        <input id="fecha_finalizacion" type="date" class="mt-1 block w-full p-4" min={proyecto.fecha_inicio} max={proyecto.fecha_finalizacion} bind:value={$form.fecha_finalizacion} required />
                    </div>
                </div>
            </div>
            {#if errors.fecha_inicio || errors.fecha_finalizacion}
                <InputError message={errors.fecha_inicio || errors.fecha_finalizacion} />
            {/if}
        </div>

        <hr />

        <div class="mt-8">
            {#if $form.tatp_servicio_tecnologico && proyecto.codigo_linea_programatica != 70}
                <InfoMessage class="my-8">
                    <p>
                        Los productos pueden corresponder a bienes o servicios. Un bien es un objeto tangible, almacenable o transportable, mientras que el servicio es una prestación intangible.
                        <br />
                        El producto debe cumplir con la siguiente estructura:
                        <br />
                        Cuando el producto es un bien: nombre del bien + la condición deseada. Ejemplo: Vía construida.
                        <br />
                        Cuando el producto es un servicio: nombre del servicio + el complemento. Ejemplo: Servicio de asistencia técnica para el mejoramiento de hábitos alimentarios
                    </p>
                </InfoMessage>
            {/if}
            <Textarea disabled={isSuperAdmin ? false : proyecto.codigo_linea_programatica == 70 ? true : false} label="Descripción" maxlength="40000" id="nombre" error={errors.nombre} bind:value={$form.nombre} required />
        </div>

        {#if proyecto.codigo_linea_programatica != 70 || isSuperAdmin}
            <div class="mt-8">
                <Label required class="mb-4" labelFor="resultado_id" value="Resultado" />
                <Select id="resultado_id" items={resultados} bind:selectedValue={$form.resultado_id} selectFunctions={[(event) => selectResultado(event)]} error={errors.resultado_id} autocomplete="off" placeholder="Seleccione un resultado" required />
            </div>
        {/if}
        {#if proyecto.servicio_tecnologico == null}
            <div class="mt-8">
                <Label required labelFor="indicador" value="Indicador" />

                {#if proyecto.codigo_linea_programatica != 70}
                    {#if $form.tatp_servicio_tecnologico == true}
                        <InfoMessage class="my-8" message="Deber ser medible y con una fórmula. Por ejemplo: (# metodologías validadas/# metodologías totales) X 100" />
                    {:else}
                        <InfoMessage class="my-8" message="Especifique los medios de verificación para validar los logros del proyecto." />
                    {/if}
                {/if}
                <Textarea disabled={isSuperAdmin ? false : proyecto.codigo_linea_programatica == 70 ? true : false} maxlength="40000" id="indicador" error={errors.indicador} bind:value={$form.indicador} required />
            </div>
        {/if}

        {#if $form.tatp_servicio_tecnologico == false}
            <div class="mt-8">
                <Label required class="mb-4" labelFor="subtipologia_minciencias_id" value="Subtipología Minciencias" />
                <Select id="subtipologia_minciencias_id" items={subtipologiasMinciencias} bind:selectedValue={$form.subtipologia_minciencias_id} error={errors.subtipologia_minciencias_id} autocomplete="off" placeholder="Seleccione una subtipología" required />
            </div>

            <div class="mt-8">
                <Select id="tipo" items={tiposProducto} bind:selectedValue={$form.tipo} error={errors.tipo} autocomplete="off" placeholder="Seleccione un tipo" required />
            </div>
        {:else if proyecto.ta || proyecto.tp}
            <div class="mt-8">
                <Textarea label="Meta" maxlength="40000" id="valor_proyectado" error={errors.valor_proyectado} bind:value={$form.valor_proyectado} required />
            </div>
        {/if}

        {#if $form.tatp_servicio_tecnologico == true}
            <div class="mt-8">
                <Label required labelFor="medio_verificacion" value="Medio de verificación" />

                {#if proyecto.codigo_linea_programatica != 70}
                    {#if proyecto.servicio_tecnologico}
                        <InfoMessage class="my-8" message="Los medios de verificación corresponden a las evidencias y/o fuentes de información en las que está disponibles los registros, la información necesaria y suficiente. Dichos medios pueden ser documentos oficiales, informes, evaluaciones, encuestas, documentos o reportes internos que genera el proyecto, entre otros." />
                    {:else}
                        <InfoMessage class="my-8" message="Especifique los medios de verificación para validar los logros del objetivo específico." />
                    {/if}
                {/if}

                <Textarea disabled={isSuperAdmin ? false : proyecto.codigo_linea_programatica == 70 ? true : false} maxlength="40000" id="medio_verificacion" error={errors.medio_verificacion} bind:value={$form.medio_verificacion} required />
            </div>
        {/if}

        {#if proyecto.servicio_tecnologico}
            <div class="mt-8">
                <Label required labelFor="nombre_indicador" value="Nombre del Indicador del producto" />

                <InfoMessage class="my-8" message="El indicador debe mantener una estructura coherente. Esta se compone de dos elementos: en primer lugar, debe ir el objeto a cuantificar, descrito por un sujeto y posteriormente la condición deseada, definida a través de un verbo en participio. Por ejemplo: Kilómetros de red vial nacional construidos." />
                <Textarea maxlength="40000" id="nombre_indicador" error={errors.nombre_indicador} bind:value={$form.nombre_indicador} required />
            </div>

            <div class="mt-8">
                <Label required labelFor="indicador" value="Fórmula del Indicador del producto" />

                <InfoMessage
                    class="my-8"
                    message="El método de cálculo debe ser una expresión matemática definida de manera adecuada y de fácil comprensión, es decir, deben quedar claras cuáles son las variables utilizadas. Los métodos de cálculo más comunes son el porcentaje, la tasa de variación, la razón y el número índice. Aunque éstos no son las únicas expresiones para los indicadores, sí son las más frecuentes."
                />
                <Textarea maxlength="40000" id="indicador" error={errors.indicador} bind:value={$form.indicador} required />
            </div>

            <div class="mt-8">
                <Label required labelFor="meta_indicador" value="Meta del indicador" />

                <Textarea maxlength="40000" id="meta_indicador" error={errors.meta_indicador} bind:value={$form.meta_indicador} required />
            </div>
        {/if}

        <h6 class="mt-20 mb-12 text-2xl">Actividades</h6>
        <div class="bg-white rounded shadow overflow-hidden">
            <div class="p-4">
                <Label required class="mb-4" labelFor="actividad_id" value="Relacione alguna actividad" />
                <InputError message={errors.actividad_id} />
            </div>
            <div class={actividades?.length > 0 ? 'grid grid-cols-2' : ''}>
                {#if actividades?.length > 0}
                    {#each actividades as { id, descripcion }, i}
                        <Label class="p-3 border-t border-b flex items-center text-sm" labelFor={'linea-tecnologica-' + id} value={descripcion} />

                        <div class="border-b border-t flex items-center justify-center">
                            <input type="checkbox" bind:group={$form.actividad_id} id={'linea-tecnologica-' + id} value={id} class="rounded text-app-500" />
                        </div>
                    {/each}
                {:else}
                    <InfoMessage alertMsg={true}
                        >El resultado seleccionado no tiene actividades asociadas. Debe completar la información de cada actividad en el numeral de <strong>Metodología y actividades</strong>. Para ello diríjase a la parte inferior de la ventanta, haga clic en los tres puntos de cada actividad > Ver detalles. En el formulario que visualiza deberá completar el resto de información.</InfoMessage
                    >
                {/if}
            </div>
        </div>
    </fieldset>
    <div class="shadow-inner bg-app-200 border-app-400 flex items-center justify-between mt-14 px-8 py-4">
        {#if producto}
            <small class="flex items-center text-app-700">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {producto.updated_at}
            </small>
        {/if}
        {#if proyecto.allowed.to_update}
            <LoadingButton loading={$form.processing} class="ml-auto" type="submit">Guardar</LoadingButton>
        {:else}
            <span class="inline-block ml-1.5"> El recurso no se puede crear/modificar </span>
        {/if}
    </div>
</form>
