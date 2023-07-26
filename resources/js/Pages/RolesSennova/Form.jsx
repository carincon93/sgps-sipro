<script>
    import Input from '@/Components/Input'
    import Label from '@/Components/Label'
    import PrimaryButton from '@/Components/PrimaryButton'
    import Select from '@/Components/Select'
    import Switch from '@/Components/Switch'

    export let errors
    export let rolSennova
    export let lineasProgramaticas
    export let is_super_admin
    export let form
    export let submit
</script>

<form on:submit|preventDefault={submit}>
    <fieldset className="p-8" disabled={is_super_admin ? undefined : true}>
        <div className="mt-8">
            <Input label="Nombre" id="nombre" type="text" className="mt-1" bind:value={$form.nombre} error={errors.nombre} required />
        </div>

        <div className="mt-8">
            <Label required className="mb-4" labelFor="nombre" value="¿Este rol suma al presupuesto del proyecto" />
            <Switch bind:checked={$form.sumar_al_presupuesto} />
        </div>

        <div className="mt-8">
            <Label className="mb-4" labelFor="linea_programatica_id" value="Línea programática" />
            <Select id="linea_programatica_id" items={lineasProgramaticas} bind:selectedValue={$form.linea_programatica_id} error={errors.linea_programatica_id} autocomplete="off" placeholder="Seleccione una línea programática" />
        </div>
    </fieldset>
    <div className="shadow-inner bg-app-200 border-app-400 flex items-center justify-between mt-14 px-8 py-4">
        {#if rolSennova}
            <small className="flex items-center text-app-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {rolSennova?.updated_at}
            </small>
        {/if}
        {#if is_super_admin}
            <PrimaryButton loading={$form.processing} className="ml-auto" type="submit">Guardar</PrimaryButton>
        {:else}
            <span className="inline-block ml-1.5"> El recurso no se puede crear/modificar </span>
        {/if}
    </div>
</form>
