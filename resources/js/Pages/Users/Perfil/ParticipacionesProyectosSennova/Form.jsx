<script>
    import Input from '@/Components/Input'
    import Label from '@/Components/Label'
    import Select from '@/Components/Select'
    import PrimaryButton from '@/Components/PrimaryButton'

    export let errors
    export let participacionProyectoSennova
    export let tiposProyectos
    export let form
    export let submit
</script>

<form on:submit|preventDefault={submit}>
    <fieldset className="p-8">
        <div className="mt-8">
            <Label required className="mb-4" labelFor="ha_formulado_proyectos_sennova" value="¿Ha formulado proyectos SENNOVA?" />
            <Select
                id="ha_formulado_proyectos_sennova"
                items={[
                    { value: 1, label: 'Si' },
                    { value: 2, label: 'No' },
                ]}
                bind:selectedValue={$form.ha_formulado_proyectos_sennova}
                error={errors.ha_formulado_proyectos_sennova}
                autocomplete="off"
                placeholder="Seleccione una opción"
                required
            />
        </div>

        {#if $form.ha_formulado_proyectos_sennova?.value == 1}
            <div className="mt-8">
                <Label required className="mb-4" labelFor="tipo_proyecto" value="Tipo de proyecto" />
                <Select id="tipo_proyecto" items={tiposProyectos} bind:selectedValue={$form.tipo_proyecto} error={errors.tipo_proyecto} autocomplete="off" placeholder="Seleccione una opción" required />
            </div>

            <div className="mt-8">
                <Input label="Código del proyecto" id="codigo_proyecto" type="text" className="mt-1" bind:value={$form.codigo_proyecto} error={errors.codigo_proyecto} required />
            </div>

            <div className="mt-8">
                <Input label="Título" id="titulo" type="text" className="mt-1" bind:value={$form.titulo} error={errors.titulo} required />
            </div>

            <div className="mt-8">
                <Label labelFor="fecha_inicio_proyecto" value="Fecha de inicio del proyecto" />
                <input id="fecha_inicio_proyecto" type="date" className="mt-1 block w-full p-4" error={errors.fecha_inicio_proyecto} bind:value={$form.fecha_inicio_proyecto} required />
            </div>

            <div className="mt-8">
                <Label labelFor="fecha_finalizacion_proyecto" value="Fecha de finalización del proyecto" />
                <input id="fecha_finalizacion_proyecto" type="date" className="mt-1 block w-full p-4" error={errors.fecha_finalizacion_proyecto} bind:value={$form.fecha_finalizacion_proyecto} required />
            </div>
        {/if}
    </fieldset>
    <div className="shadow-inner bg-app-200 border-app-400 flex items-center justify-between mt-14 px-8 py-4">
        {#if participacionProyectoSennova}
            <small className="flex items-center text-app-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {participacionProyectoSennova?.updated_at}
            </small>
        {/if}
        <PrimaryButton loading={$form.processing} className="ml-auto" type="submit">Guardar</PrimaryButton>
    </div>
</form>
