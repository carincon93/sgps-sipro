<script>
    import Input from '@/Components/Input'
    import PrimaryButton from '@/Components/PrimaryButton'

    export let errors
    export let usoPresupuestal
    export let is_super_admin
    export let form
    export let submit
</script>

<form on:submit|preventDefault={submit}>
    <fieldset className="p-8" disabled={is_super_admin ? undefined : true}>
        <div className="mt-8">
            <Input label="Descripción" id="descripcion" type="text" className="mt-1" bind:value={$form.descripcion} error={errors.descripcion} required />
        </div>

        <div className="mt-8">
            <Input label="Código" id="cta" type="text" className="mt-1" bind:value={$form.codigo} error={errors.codigo} required />
        </div>
    </fieldset>
    <div className="flex items-center justify-between mt-14 px-8 py-4">
        {#if usoPresupuestal}
            <small className="flex items-center text-app-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {usoPresupuestal?.updated_at}
            </small>
        {/if}
        {#if is_super_admin}
            <PrimaryButton loading={$form.processing} className="ml-auto" type="submit">Guardar</PrimaryButton>
        {:else}
            <span className="inline-block ml-1.5"> El recurso no se puede crear/modificar </span>
        {/if}
    </div>
</form>
