<script>
    import Label from '@/Components/Label'
    import PrimaryButton from '@/Components/PrimaryButton'
    import Select from '@/Components/Select'

    export let errors
    export let is_super_admin
    export let presupuestosSennova
    export let form
    export let submit
</script>

<form on:submit|preventDefault={submit}>
    <fieldset className="p-8" disabled={is_super_admin ? undefined : true}>
        <div className="mt-8">
            <Label required className="mb-4" labelFor="presupuesto_sennova_id" value="Rubros presupuestales SENNOVA" />
            <Select id="presupuesto_sennova_id" items={presupuestosSennova} bind:selectedValue={$form.presupuesto_sennova_id} error={errors.presupuesto_sennova_id} autocomplete="off" placeholder="Seleccione un rubro presupuestal SENNOVA" required />
        </div>
    </fieldset>
    <div className="flex items-center justify-between mt-14 px-8 py-4">
        {#if is_super_admin}
            <PrimaryButton loading={$form.processing} className="ml-auto" type="submit">Guardar</PrimaryButton>
        {/if}
    </div>
</form>
