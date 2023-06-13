<script>
    import LoadingButton from '@/Shared/LoadingButton'
    import Textarea from '@/Shared/Textarea'

    export let errors
    export let proyectoCapacidadInstalada
    export let form
    export let submit
</script>

<form on:submit|preventDefault={submit}>
    <fieldset class="p-8" disabled={proyectoCapacidadInstalada.allowed.to_update ? undefined : true}>
        <div class="mt-8">
            <Textarea label="Descripción" maxlength="255" id="descripcion" error={errors.descripcion} bind:value={$form.descripcion} required />
        </div>
        <div class="mt-8">
            <Textarea label="Descripción del resultado" maxlength="255" id="descripcion_resultado" error={errors.descripcion_resultado} bind:value={$form.descripcion_resultado} required />
        </div>
        <div class="shadow-inner bg-app-200 border-app-400 flex items-center justify-between mt-14 px-8 py-4 ">
            {#if proyectoCapacidadInstalada}
                <small class="flex items-center text-app-700">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {proyectoCapacidadInstalada?.updated_at}
                </small>
            {/if}
            {#if proyectoCapacidadInstalada?.allowed.to_update}
                <LoadingButton loading={$form.processing} class="ml-auto" type="submit">Guardar</LoadingButton>
            {:else}
                <span class="inline-block ml-1.5"> El recurso no se puede crear/modificar </span>
            {/if}
        </div>
    </fieldset>
</form>
