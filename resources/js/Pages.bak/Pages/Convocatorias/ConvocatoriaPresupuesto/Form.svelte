<script>
    import Label from '@/Shared/Label'
    import LoadingButton from '@/Shared/LoadingButton'
    import Select from '@/Shared/Select'

    export let errors
    export let isSuperAdmin
    export let presupuestosSennova
    export let form
    export let submit
</script>

<form on:submit|preventDefault={submit}>
    <fieldset class="p-8" disabled={isSuperAdmin ? undefined : true}>
        <div class="mt-8">
            <Label required class="mb-4" labelFor="presupuesto_sennova_id" value="Rubros presupuestales SENNOVA" />
            <Select id="presupuesto_sennova_id" items={presupuestosSennova} bind:selectedValue={$form.presupuesto_sennova_id} error={errors.presupuesto_sennova_id} autocomplete="off" placeholder="Seleccione un rubro presupuestal SENNOVA" required />
        </div>
    </fieldset>
    <div class="shadow-inner bg-app-200 border-app-400 bottom-0 flex items-center justify-between mt-14 px-8 py-4 sticky">
        {#if isSuperAdmin}
            <LoadingButton loading={$form.processing} class="ml-auto" type="submit">Guardar</LoadingButton>
        {/if}
    </div>
</form>
