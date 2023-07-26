<script>
    import Input from '@/Components/Input'
    import Label from '@/Components/Label'
    import PrimaryButton from '@/Components/PrimaryButton'
    import MultipleSelect from '@/Components/MultipleSelect'

    export let lineaInvestigacion
    export let submit
    export let form
    export let errors
    export let programasFormacion
    export let allowed_to_create
</script>

<form on:submit|preventDefault={submit} className="bg-white rounded shadow">
    <fieldset className="p-8" disabled={lineaInvestigacion?.allowed.to_update || allowed_to_create ? undefined : true}>
        <div className="mt-8">
            <Label required labelFor="nombre" value="Nombre de la línea de investigación" />
            <Input id="nombre" type="text" className="mt-1" bind:value={$form.nombre} error={errors.nombre} required />
        </div>

        <div className="mt-8">
            <Label required className="mb-4" labelFor="programas_formacion" value="Programa(s) de formación asociados" />
            <MultipleSelect id="programas_formacion" bind:selectedValue={$form.programas_formacion} items={programasFormacion}  error={errors.programas_formacion} placeholder="Buscar programas de formación" required />
        </div>
    </fieldset>
    <div className="flex items-center justify-between mt-14 px-8 py-4">
        {#if lineaInvestigacion}
            <small className="flex items-center text-app-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {lineaInvestigacion?.updated_at}
            </small>
        {/if}
        {#if lineaInvestigacion?.allowed.to_update || allowed_to_create}
            <PrimaryButton loading={$form.processing} className="ml-auto" type="submit">Guardar</PrimaryButton>
        {:else}
            <span className="inline-block ml-1.5"> El recurso no se puede crear/modificar </span>
        {/if}
    </div>
</form>
