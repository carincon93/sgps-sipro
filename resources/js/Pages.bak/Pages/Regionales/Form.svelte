<script>
    import Input from '@/Shared/Input'
    import Label from '@/Shared/Label'
    import LoadingButton from '@/Shared/LoadingButton'
    import Select from '@/Shared/Select'

    export let errors
    export let regional
    export let regiones
    export let directoresRegionales
    export let isSuperAdmin
    export let form
    export let submit
</script>

<form on:submit|preventDefault={submit}>
    <fieldset class="p-8" disabled={isSuperAdmin ? undefined : true}>
        <div class="mt-8">
            <Input label="Nombre" id="nombre" type="text" class="mt-1" bind:value={$form.nombre} error={errors.nombre} required />
        </div>

        <div class="mt-8">
            <Input label="Código" id="codigo" type="number" input$min="0" input$max="2147483647" class="mt-1" bind:value={$form.codigo} error={errors.codigo} required />
        </div>

        <div class="mt-8">
            <Label required class="mb-4" labelFor="region_id" value="Región" />
            <Select id="region_id" items={regiones} bind:selectedValue={$form.region_id} error={errors.region_id} autocomplete="off" placeholder="Busque por el nombre de la región" required />
        </div>

        <div class="mt-8">
            <Label required class="mb-4" labelFor="director_regional_id" value="Director(a) Regional" />
            <Select id="director_regional_id" items={directoresRegionales} bind:selectedValue={$form.director_regional_id} error={errors.director_regional_id} autocomplete="off" placeholder="Busque por el nombre del director" required />
        </div>
    </fieldset>

    <div class="shadow-inner bg-app-200 border-app-400 flex items-center justify-between mt-14 px-8 py-4">
        {#if regional}
            <small class="flex items-center text-app-700">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {regional?.updated_at}
            </small>
        {/if}
        {#if isSuperAdmin}
            <LoadingButton loading={$form.processing} class="ml-auto" type="submit">Guardar</LoadingButton>
        {:else}
            <span class="inline-block ml-1.5"> El recurso no se puede crear/modificar </span>
        {/if}
    </div>
</form>
