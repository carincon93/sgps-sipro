<script>
    import Input from '@/Components/Input'
    import Label from '@/Components/Label'
    import PrimaryButton from '@/Components/PrimaryButton'
    import Select from '@/Components/Select'

    export let submit
    export let form
    export let errors
    export let centroFormacion
    export let regionales
    export let subdirectores
    export let dinamizadoresSennova
    export let is_super_admin
</script>

<form on:submit|preventDefault={submit} className="bg-white rounded shadow">
    <fieldset className="p-8" disabled={is_super_admin ? undefined : true}>
        <div className="mt-8">
            <Input label="Nombre" id="nombre" type="text" className="mt-1" bind:value={$form.nombre} error={errors.nombre} required />
        </div>

        <div className="mt-8">
            <Input label="Código" id="codigo" type="number" input$min="0" input$max="2147483647" className="mt-1" bind:value={$form.codigo} error={errors.codigo} required />
        </div>

        <div className="mt-8">
            <Label required className="mb-4" labelFor="regional" value="Regional" />
            <Select id="regional_id" items={regionales} bind:selectedValue={$form.regional_id} error={errors.regional_id} autocomplete="off" placeholder="Seleccione una regional" required />
        </div>

        <div className="mt-8">
            <Label required className="mb-4" labelFor="subdirector_id" value="Subdirector" />
            <Select id="subdirector_id" items={subdirectores} bind:selectedValue={$form.subdirector_id} error={errors.subdirector_id} autocomplete="off" placeholder="Seleccione una subdirector" required />
        </div>

        <div className="mt-8">
            <Label required className="mb-4" labelFor="dinamizador_sennova_id" value="Dinamizador SENNOVA" />
            <Select id="dinamizador_sennova_id" items={dinamizadoresSennova} bind:selectedValue={$form.dinamizador_sennova_id} error={errors.dinamizador_sennova_id} autocomplete="off" placeholder="Seleccione una dinamizador SENNOVA" required />
        </div>
    </fieldset>
    <div className="shadow-inner bg-app-200 border-app-400 flex items-center justify-between mt-14 px-8 py-4">
        {#if centroFormacion && is_super_admin}
            <small className="flex items-center text-app-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {centroFormacion?.updated_at}
            </small>
        {/if}
        {#if is_super_admin}
            <PrimaryButton loading={$form.processing} className="ml-auto" type="submit">Guardar</PrimaryButton>
        {:else}
            <span className="inline-block ml-1.5"> El recurso no se puede crear/modificar </span>
        {/if}
    </div>
</form>
