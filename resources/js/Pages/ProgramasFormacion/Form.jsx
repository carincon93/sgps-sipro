<script>
    import Input from '@/Components/Input'
    import Label from '@/Components/Label'
    import PrimaryButton from '@/Components/PrimaryButton'
    import Select from '@/Components/Select'
    import Switch from '@/Components/Switch'
    import InputError from '@/Components/InputError'

    export let errors
    export let form
    export let submit
    export let programaFormacion
    export let centrosFormacion
    export let modalidades
    export let nivelesFormacion
    export let allowed_to_create
</script>

<form on:submit|preventDefault={submit}>
    <fieldset className="p-8" disabled={programaFormacion?.allowed.to_update || allowed_to_create ? undefined : true}>
        <div className="mt-8">
            <Input label="Nombre" id="nombre" type="text" className="mt-1" bind:value={$form.nombre} error={errors.nombre} required />
        </div>

        <div className="mt-8">
            <Input label="Código" id="codigo" type="number" input$min="0" input$max="2147483647" className="mt-1" bind:value={$form.codigo} error={errors.codigo} required />
        </div>

        <div className="mt-8">
            <Label required className="mb-4" labelFor="modalidad" value="Modalidad de estudio" />
            <Select id="modalidad" items={modalidades} bind:selectedValue={$form.modalidad} error={errors.modalidad} autocomplete="off" placeholder="Seleccione una modalidad de estudio" required />
        </div>

        <div className="mt-8">
            <Label required className="mb-4" labelFor="nivel_formacion" value="Nivel de formación" />
            <Select id="nivel_formacion" items={nivelesFormacion} bind:selectedValue={$form.nivel_formacion} error={errors.nivel_formacion} autocomplete="off" placeholder="Seleccione un nivel de formación" required />
        </div>

        <div className="mt-8">
            <Label required className="mb-4" labelFor="centro_formacion_id" value="Centro de formación" />
            <Select id="centro_formacion_id" items={centrosFormacion} bind:selectedValue={$form.centro_formacion_id} error={errors.centro_formacion_id} autocomplete="off" placeholder="Busque por el nombre del centro de formación" required />
        </div>

        <div className="mt-8">
            <Label required labelFor="registro_calificado" value="El programa de formación cuenta con registro calificado?" className="inline-block mb-4" />
            <br />
            <Switch bind:checked={$form.registro_calificado} />
            <InputError message={errors.registro_calificado} />
        </div>
    </fieldset>
    <div className="shadow-inner bg-app-200 border-app-400 flex items-center justify-between mt-14 px-8 py-4">
        {#if programaFormacion}
            <small className="flex items-center text-app-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {programaFormacion?.updated_at}
            </small>
        {/if}
        {#if programaFormacion?.allowed.to_update || allowed_to_create}
            <PrimaryButton loading={$form.processing} className="ml-auto" type="submit">Guardar</PrimaryButton>
        {:else}
            <span className="inline-block ml-1.5"> El recurso no se puede crear/modificar </span>
        {/if}
    </div>
</form>
