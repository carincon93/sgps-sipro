<script>
    import Input from '@/Components/Input'
    import Label from '@/Components/Label'
    import Select from '@/Components/Select'
    import File from '@/Components/File'
    import PrimaryButton from '@/Components/PrimaryButton'

    export let errors
    export let estudioAcademico
    export let nivelesAcademicos
    export let form
    export let submit
</script>

<form on:submit|preventDefault={submit}>
    <fieldset className="p-8">
        <div className="mt-8">
            <Label required className="mb-4" labelFor="grado_formacion" value="Nivel académico" />
            <Select id="grado_formacion" items={nivelesAcademicos} bind:selectedValue={$form.grado_formacion} error={errors.grado_formacion} autocomplete="off" placeholder="Seleccione una opción" required />
        </div>

        <div className="mt-8">
            <Input label="Título obtenido" id="titulo_obtenido" type="text" className="mt-1" bind:value={$form.titulo_obtenido} error={errors.titulo_obtenido} required />
        </div>

        <div className="mt-8">
            <Label className="mb-4" labelFor="soporte_titulo_obtenido" value="Seleccionar soporte" />
            <File id="soporte_titulo_obtenido" maxSize="10000" bind:value={$form.soporte_titulo_obtenido} error={errors.soporte_titulo_obtenido} />
        </div>
    </fieldset>
    <div className="shadow-inner bg-app-200 border-app-400 flex items-center justify-between mt-14 px-8 py-4">
        {#if estudioAcademico}
            <small className="flex items-center text-app-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {estudioAcademico?.updated_at}
            </small>
        {/if}
        <PrimaryButton loading={$form.processing} className="ml-auto" type="submit">Guardar</PrimaryButton>
    </div>
</form>
