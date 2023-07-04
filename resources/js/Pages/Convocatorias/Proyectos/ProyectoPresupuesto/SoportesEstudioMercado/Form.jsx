<script>
    import Input from '@/Components/Input'
    import Label from '@/Components/Label'
    import PrimaryButton from '@/Components/PrimaryButton'
    import PercentageProgress from '@/Components/PercentageProgress'

    export let errors
    export let proyecto
    export let soporteEstudioMercado
    export let form
    export let submit

    let average
    $: average = (parseInt($form.primer_valor) + parseInt($form.segundo_valor) + (parseInt($form.tercer_valor) > 0 && $form.requiere_tercer_estudio_mercado ? parseInt($form.tercer_valor) : 0)) / (parseInt($form.tercer_valor) > 0 && $form.requiere_tercer_estudio_mercado ? 3 : 2)
</script>

<form on:submit|preventDefault={submit}>
    <fieldset className="p-8" disabled={proyecto.allowed.to_update ? undefined : true}>
        <div className="mt-8">
            <Input label="Nombre de la empresa" id="empresa" type="text" className="mt-1" bind:value={$form.empresa} error={errors.empresa} required />
        </div>

        <div className="mt-8">
            <Label className="mb-4" labelFor="soporte" value="Url del soporte/cotización" />
            <Input label="Url" id="soporte" type="url" className="mt-1" error={errors.soporte} placeholder="Url https://www.google.com.co" bind:value={$form.soporte} />
        </div>
    </fieldset>
    <div className="shadow-inner bg-app-200 border-app-400 flex items-center justify-between mt-14 px-8 py-4">
        {#if soporteEstudioMercado}
            <small className="flex items-center text-app-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {soporteEstudioMercado.updated_at}
            </small>
        {/if}
        {#if proyecto.allowed.to_update}
            <PrimaryButton loading={$form.processing} className="ml-auto" type="submit">Guardar</PrimaryButton>
        {:else}
            <span className="inline-block ml-1.5"> El recurso no se puede crear/modificar </span>
        {/if}
    </div>
</form>
