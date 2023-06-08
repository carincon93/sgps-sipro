<script>
    import Input from '@/Shared/Input'
    import LoadingButton from '@/Shared/LoadingButton'

    export let errors
    export let usoPresupuestal
    export let isSuperAdmin
    export let form
    export let submit
</script>

<form on:submit|preventDefault={submit}>
    <fieldset class="p-8" disabled={isSuperAdmin ? undefined : true}>
        <div class="mt-8">
            <Input label="Descripción" id="descripcion" type="text" class="mt-1" bind:value={$form.descripcion} error={errors.descripcion} required />
        </div>

        <div class="mt-8">
            <Input label="Código" id="cta" type="text" class="mt-1" bind:value={$form.codigo} error={errors.codigo} required />
        </div>
    </fieldset>
    <div class="shadow-inner bg-app-200 border-app-400 bottom-0 flex items-center justify-between mt-14 px-8 py-4 sticky">
        {#if usoPresupuestal}
            <small class="flex items-center text-app-700">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {usoPresupuestal?.updated_at}
            </small>
        {/if}
        {#if isSuperAdmin}
            <LoadingButton loading={$form.processing} class="ml-auto" type="submit">Guardar</LoadingButton>
        {:else}
            <span class="inline-block ml-1.5"> El recurso no se puede crear/modificar </span>
        {/if}
    </div>
</form>
