<script>
    import Input from '@/Shared/Input'
    import Label from '@/Shared/Label'
    import LoadingButton from '@/Shared/LoadingButton'
    import SelectMulti from '@/Shared/SelectMulti'

    export let lineaInvestigacion
    export let submit
    export let form
    export let errors
    export let programasFormacion
    export let allowedToCreate
</script>

<form on:submit|preventDefault={submit} class="bg-white rounded shadow">
    <fieldset class="p-8" disabled={lineaInvestigacion?.allowed.to_update || allowedToCreate ? undefined : true}>
        <div class="mt-8">
            <Label required labelFor="nombre" value="Nombre de la línea de investigación" />
            <Input id="nombre" type="text" class="mt-1" bind:value={$form.nombre} error={errors.nombre} required />
        </div>

        <div class="mt-8">
            <Label required class="mb-4" labelFor="programas_formacion" value="Programa(s) de formación asociados" />
            <SelectMulti id="programas_formacion" bind:selectedValue={$form.programas_formacion} items={programasFormacion} isMulti={true} error={errors.programas_formacion} placeholder="Buscar programas de formación" required />
        </div>
    </fieldset>
    <div class="shadow-inner bg-app-200 border-app-400 bottom-0 flex items-center justify-between mt-14 px-8 py-4 sticky">
        {#if lineaInvestigacion}
            <small class="flex items-center text-app-700">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {lineaInvestigacion?.updated_at}
            </small>
        {/if}
        {#if lineaInvestigacion?.allowed.to_update || allowedToCreate}
            <LoadingButton loading={$form.processing} class="ml-auto" type="submit">Guardar</LoadingButton>
        {:else}
            <span class="inline-block ml-1.5"> El recurso no se puede crear/modificar </span>
        {/if}
    </div>
</form>
