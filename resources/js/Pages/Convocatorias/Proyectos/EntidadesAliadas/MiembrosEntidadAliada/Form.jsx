<script>
    import Input from '@/Components/Input'
    import Label from '@/Components/Label'
    import PrimaryButton from '@/Components/PrimaryButton'
    import Select from '@/Components/Select'
    import InfoMessage from '@/Components/InfoMessage'
    import Checkbox from '@smui/checkbox'
    import FormField from '@smui/form-field'

    export let errors
    export let proyecto
    export let miembroEntidadAliada
    export let tiposDocumento
    export let form
    export let submit
</script>

<form on:submit|preventDefault={submit}>
    <fieldset className="p-8" disabled={proyecto.allowed.to_update ? undefined : true}>
        <div className="mt-8">
            <Input label="Nombre completo" id="nombre" type="text" className="mt-1" bind:value={$form.nombre} error={errors.nombre} required />
        </div>

        <div className="mt-8">
            <Input label="Correo electrónico" id="email" type="email" className="mt-1" bind:value={$form.email} error={errors.email} required />
        </div>

        <div className="mt-8">
            <Label required className="mb-4" labelFor="tipo_documento" value="Tipo de documento" />
            <Select id="tipo_documento" items={tiposDocumento} bind:selectedValue={$form.tipo_documento} error={errors.tipo_documento} autocomplete="off" placeholder="Seleccione un tipo de documento" required />
        </div>

        <div className="mt-8">
            <Input label="Número de documento" id="numero_documento" type="number" input$min="55555" input$max="9999999999999" className="mt-1" bind:value={$form.numero_documento} error={errors.numero_documento} required />
        </div>

        <div className="mt-8">
            <Input label="Número de celular" id="numero_celular" type="number" input$min="3000000000" input$max="9999999999" className="mt-1" bind:value={$form.numero_celular} error={errors.numero_celular} required />
        </div>

        {#if miembroEntidadAliada}
            <div className="mt-8">
                <InfoMessage message={miembroEntidadAliada.autorizacion_datos ? 'Está persona autorizó el tratamiento de datos' : 'Está persona no autorizó el tratamiento de datos'} />
            </div>
        {:else}
            <div className="mt-8">
                <InfoMessage message="Los datos proporcionados serán tratados de acuerdo con la política de tratamiento de datos personales del SENA y a la ley 1581 de 2012 (acuerdo No. 0009 del 2016)" />
                <FormField>
                    <Checkbox bind:checked={$form.autorizacion_datos} />
                    <span slot="label">¿La persona autoriza el tratamiento de datos personales?. <a href="https://www.sena.edu.co/es-co/transparencia/Documents/proteccion_datos_personales_sena_2016.pdf" target="_blank" className="text-indigo-500">Leer acuerdo No. 0009 del 2016</a></span>
                </FormField>
            </div>
        {/if}
    </fieldset>
    <div className="shadow-inner bg-app-200 border-app-400 flex items-center justify-between mt-14 px-8 py-4">
        {#if miembroEntidadAliada}
            <small className="flex items-center text-app-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {miembroEntidadAliada.updated_at}
            </small>
        {/if}
        {#if proyecto.allowed.to_update}
            <PrimaryButton loading={$form.processing} className="ml-auto" type="submit">Guardar</PrimaryButton>
        {:else}
            <span className="inline-block ml-1.5"> El recurso no se puede crear/modificar </span>
        {/if}
    </div>
</form>
