<script>
    import Input from '@/Shared/Input'
    import Label from '@/Shared/Label'
    import LoadingButton from '@/Shared/LoadingButton'
    import Checkbox from '@smui/checkbox'
    import FormField from '@smui/form-field'
    import InputError from '@/Shared/InputError'
    import Select from '@/Shared/Select'
    import Textarea from '@/Shared/Textarea'

    export let errors
    export let tecnoacademia
    export let lineasTecnoacademia
    export let modalidades
    export let centrosFormacion
    export let form
    export let submit
    export let allowedToCreate
</script>

<form on:submit|preventDefault={submit}>
    <fieldset class="p-8" disabled={tecnoacademia?.allowed.to_update || allowedToCreate ? undefined : true}>
        <div class="mt-8">
            <Input label="Nombre" id="nombre" type="text" class="mt-1" bind:value={$form.nombre} error={errors.nombre} required />
        </div>

        <div class="mt-8">
            <Label required class="mb-4" labelFor="centro_formacion_id" value="Centro de formación" />
            <Select id="centro_formacion_id" items={centrosFormacion} bind:selectedValue={$form.centro_formacion_id} error={errors.centro_formacion_id} autocomplete="off" placeholder="Busque por el nombre del centro de formación" required />
        </div>

        <div class="mt-8">
            <Label required class="mb-4" labelFor="modalidad" value="Modalidad" />
            <Select id="modalidad" items={modalidades} bind:selectedValue={$form.modalidad} error={errors.modalidad} autocomplete="off" placeholder="Seleccione una modalidad" required />
        </div>

        <div class="mt-8">
            <Label required class="mb-4" labelFor="fecha_creacion" value="Fecha de creación" />
            <input label="Fecha de creación" id="fecha_creacion" type="date" class="mt-1 p-4" bind:value={$form.fecha_creacion} required />
        </div>

        <div class="mt-8">
            <Textarea label="Foco de la TecnoAcademia" maxlength="40000" id="foco" bind:value={$form.foco} error={errors.foco} required />
        </div>

        <div class="mt-10">
            <Label required class="mb-4" labelFor="linea_tecnoacademia_id" value="Líneas de TecnoAcademia" />
            <div class="mt-10 grid grid-cols-2">
                {#each lineasTecnoacademia as { id, nombre }, i}
                    <FormField>
                        <Checkbox bind:group={$form.linea_tecnoacademia_id} value={id} />
                        <span slot="label">{nombre}</span>
                    </FormField>
                {/each}
            </div>
            <InputError message={errors.linea_tecnoacademia_id} />
        </div>
    </fieldset>
    <div class="shadow-inner bg-app-200 border-app-400 flex items-center justify-between mt-14 px-8 py-4">
        {#if tecnoacademia}
            <small class="flex items-center text-app-700">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {tecnoacademia?.updated_at}
            </small>
        {/if}
        {#if tecnoacademia?.allowed.to_update || allowedToCreate}
            <LoadingButton loading={$form.processing} class="ml-auto" type="submit">Guardar</LoadingButton>
        {:else}
            <span class="inline-block ml-1.5"> El recurso no se puede crear/modificar </span>
        {/if}
    </div>
</form>
