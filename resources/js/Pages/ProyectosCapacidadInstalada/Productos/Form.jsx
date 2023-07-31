<script>
    import PrimaryButton from '@/Components/PrimaryButton'
    import Textarea from '@/Components/Textarea'
    import Select from '@/Components/Select'

    export let errors
    export let proyectoCapacidadInstalada
    export let producto
    export let resultados
    export let tipologiasMinciencias
    export let form
    export let submit
</script>

<form on:submit|preventDefault={submit}>
    <fieldset className="p-8" disabled={proyectoCapacidadInstalada?.allowed.to_update ? undefined : true}>
        <div className="mt-8">
            <Textarea label="Descripción" maxlength="255" id="descripcion" error={errors.descripcion} bind:value={$form.descripcion} required />
        </div>
        <div className="mt-8">
            <Select id="resultado_id" items={resultados} bind:selectedValue={$form.resultado_id} error={errors.resultado_id} autocomplete="off" placeholder="Seleccione un resultado" required />
        </div>
        <div className="mt-8">
            <Select id="tipologia_minciencias" items={tipologiasMinciencias} bind:selectedValue={$form.tipologia_minciencias} error={errors.tipologia_minciencias} autocomplete="off" placeholder="Seleccione una tipología" required />
        </div>
        <div className="shadow-inner bg-app-200 border-app-400 flex items-center justify-between mt-14 px-8 py-4">
            {#if producto}
                <small className="flex items-center text-app-700">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {producto?.updated_at}
                </small>
            {/if}
            {#if proyectoCapacidadInstalada?.allowed.to_update}
                <PrimaryButton loading={$form.processing} className="ml-auto" type="submit">Guardar</PrimaryButton>
            {:else}
                <span className="inline-block ml-1.5"> El recurso no se puede crear/modificar </span>
            {/if}
        </div>
    </fieldset>
</form>
