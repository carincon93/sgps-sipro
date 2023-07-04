<script>
    import Label from '@/Components/Label'
    import PrimaryButton from '@/Components/PrimaryButton'
    import Select from '@/Components/Select'
    import Textarea from '@/Components/Textarea'
    import InfoMessage from '@/Components/InfoMessage'

    export let errors
    export let proyecto
    export let analisisRiesgo
    export let nivelesRiesgo
    export let tiposRiesgo
    export let probabilidadesRiesgo
    export let impactosRiesgo
    export let form
    export let submit
</script>

<form on:submit|preventDefault={submit}>
    <fieldset className="p-8" disabled={proyecto.allowed.to_update ? undefined : true}>
        <div className="mt-8">
            <Label required className="mb-4" labelFor="nivel" value="Nivel de riesgo" />
            <Select id="nivel" items={nivelesRiesgo} bind:selectedValue={$form.nivel} error={errors.nivel} autocomplete="off" placeholder="Seleccione el nivel del riesgo" required />
        </div>

        <div className="mt-8">
            <Label required className="mb-4" labelFor="tipo" value="Tipo de riesgo" />
            <Select id="tipo" items={tiposRiesgo} bind:selectedValue={$form.tipo} error={errors.tipo} autocomplete="off" placeholder="Seleccione el tipo de riesgo" required />
            {#if $form.tipo?.value == 1}
                <InfoMessage className="ml-10 my-4" message="Es la probabilidad de variaciones en las condiciones del mercado como el precio, la calidad y la disponibilidad de los materiales e insumos, la competencia (oferta/demanda) del producto/servicios ofrecidos, la tasa de cambiaria y los asociados a la tecnología utilizada (obsolescencia)." />
            {:else if $form.tipo?.value == 2}
                <InfoMessage className="ml-10 my-4" message="Es toda posible contingencia que pueda provocar pérdidas en el desarrollo del proyecto por causa de errores humanos, de errores tecnológicos, de procesos internos defectuosos o fallidos. Esta clase de riesgo es inherente a todos los sistemas y procesos realizados por humanos." />
            {:else if $form.tipo?.value == 3}
                <InfoMessage
                    className="ml-10 my-4"
                    message="Son los obstáculos legales o normativos que pueden afectar el desarrollo del proyecto. Por ejemplo: nuevos requisitos legales, cambios reglamentarios o gubernamentales directamente relacionados con el entorno que se desarrolla el proyecto, ausencia y/o deficiencia de documentación, errores en los contratos, incapacidad del proyecto de cumplir lo pactado."
                />
            {:else if $form.tipo?.value == 4}
                <InfoMessage
                    className="ml-10 my-4"
                    message="Es la probabilidad de incurrir en pérdidas originadas por la deficiencia en la planeación, procesos, controles y/o falta de idoneidad y competencia del personal. Por ejemplo: falta de planeación del proyecto, estructura organizacional incoherente, falta de liderazgo, falta de integración entre la dirección y la parte operativa y/o productiva, ineficiencia en la adaptación a los cambios del entorno, toma de decisiones por información incompleta."
                />
            {/if}
        </div>

        <div className="mt-8">
            <Textarea label="Descripción" maxlength="800" id="descripcion" error={errors.descripcion} bind:value={$form.descripcion} required />
        </div>

        <div className="mt-8">
            <Label required className="mb-4" labelFor="probabilidad" value="Probabilidad" />
            <Select id="probabilidad" items={probabilidadesRiesgo} bind:selectedValue={$form.probabilidad} error={errors.probabilidad} autocomplete="off" placeholder="Seleccione la probabilidad" required />
        </div>

        <div className="mt-8">
            <Label required className="mb-4" labelFor="impacto" value="Impacto" />
            <Select id="impacto" items={impactosRiesgo} bind:selectedValue={$form.impacto} error={errors.impacto} autocomplete="off" placeholder="Seleccione la probabilidad" required />
        </div>

        <div className="mt-8">
            <Textarea label="Efectos" maxlength="800" id="efectos" error={errors.efectos} bind:value={$form.efectos} required />
        </div>

        <div className="mt-8">
            <Textarea label="Medidas de mitigación" maxlength="800" id="medidas_mitigacion" error={errors.medidas_mitigacion} bind:value={$form.medidas_mitigacion} required />
        </div>
    </fieldset>
    <div className="shadow-inner bg-app-200 border-app-400  flex items-center justify-between mt-14 px-8 py-4 ">
        {#if analisisRiesgo}
            <small className="flex items-center text-app-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {analisisRiesgo.updated_at}
            </small>
        {/if}
        {#if proyecto.allowed.to_update}
            <PrimaryButton loading={$form.processing} className="ml-auto" type="submit">Guardar</PrimaryButton>
        {:else}
            <span className="inline-block ml-1.5"> El recurso no se puede crear/modificar </span>
        {/if}
    </div>
</form>
