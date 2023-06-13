<script>
    import Input from '@/Shared/Input'
    import Label from '@/Shared/Label'
    import LoadingButton from '@/Shared/LoadingButton'
    import Select from '@/Shared/Select'
    import Textarea from '@/Shared/Textarea'
    import SelectMulti from '@/Shared/SelectMulti'

    export let errors
    export let isSuperAdmin
    export let categoriasProyectos
    export let activadores
    export let form
    export let submit
    export let lineaProgramatica
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
            <Label required class="mb-4" labelFor="categoria_proyecto" value="Categoría" />
            <Select id="categoria_proyecto" items={categoriasProyectos} bind:selectedValue={$form.categoria_proyecto} error={errors.categoria_proyecto} autocomplete="off" placeholder="Seleccione una categoría" required />
        </div>

        <div class="mt-8">
            <Textarea label="Descripción" maxlength="40000" id="descripcion" error={errors.descripcion} bind:value={$form.descripcion} required />
        </div>

        <div class="mt-8">
            <Label required class="mb-4" labelFor="activadores" value="Nombre de los activadores" />
            <SelectMulti id="activadores" bind:selectedValue={$form.activadores} items={activadores} isMulti={true} error={errors.municipios} placeholder="Buscar activadores" required />
        </div>
    </fieldset>
    <div class="shadow-inner bg-app-200 border-app-400 bottom-0 flex items-center justify-between mt-14 px-8 py-4 sticky">
        {#if lineaProgramatica}
            <small class="flex items-center text-app-700">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {lineaProgramatica?.updated_at}
            </small>
        {/if}

        {#if isSuperAdmin}
            <LoadingButton loading={$form.processing} class="ml-auto" type="submit">Guardar</LoadingButton>
        {:else}
            <span class="inline-block ml-1.5"> El recurso no se puede crear/modificar </span>
        {/if}
    </div>
</form>
