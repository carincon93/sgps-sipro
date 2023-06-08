<script>
    import Input from '@/Shared/Input'
    import Label from '@/Shared/Label'
    import Select from '@/Shared/Select'
    import File from '@/Shared/File'
    import LoadingButton from '@/Shared/LoadingButton'

    export let errors
    export let formacionAcademicaSena
    export let modalidadesEstudio
    export let nivelesFormacion
    export let form
    export let submit
</script>

<form on:submit|preventDefault={submit}>
    <fieldset class="p-8">
        <div class="mt-8">
            <Label required class="mb-4" labelFor="egresado_sena" value="¿Es egresado SENA?" />
            <Select
                id="egresado_sena"
                items={[
                    { value: 1, label: 'Si' },
                    { value: 2, label: 'No' },
                ]}
                bind:selectedValue={$form.egresado_sena}
                error={errors.egresado_sena}
                autocomplete="off"
                placeholder="Seleccione una opción"
                required
            />
        </div>

        <div class="mt-8">
            <Label required class="mb-4" labelFor="modalidad_sena" value="Modalidad SENA" />
            <Select id="modalidad_sena" items={modalidadesEstudio} bind:selectedValue={$form.modalidad_sena} error={errors.modalidad_sena} autocomplete="off" placeholder="Seleccione una opción" required />
        </div>

        <div class="mt-8">
            <Label required class="mb-4" labelFor="nivel_sena" value="Nivel SENA" />
            <Select id="nivel_sena" items={nivelesFormacion} bind:selectedValue={$form.nivel_sena} error={errors.nivel_sena} autocomplete="off" placeholder="Seleccione una opción" required />
        </div>

        <div class="mt-8">
            <Input label="Título obtenido" id="titulo_obtenido" type="text" class="mt-1" bind:value={$form.titulo_obtenido} error={errors.titulo_obtenido} required />
        </div>

        <div class="mt-8">
            <Label labelFor="fecha_inicio_formacion" value="Fecha de inicio de la formación" />
            <input id="fecha_inicio_formacion" type="date" class="mt-1 block w-full p-4" error={errors.fecha_inicio_formacion} bind:value={$form.fecha_inicio_formacion} required />
        </div>

        <div class="mt-8">
            <Label labelFor="fecha_finalizacion_formacion" value="Fecha de finalización de la formación" />
            <input id="fecha_finalizacion_formacion" type="date" class="mt-1 block w-full p-4" error={errors.fecha_finalizacion_formacion} bind:value={$form.fecha_finalizacion_formacion} required />
        </div>

        <div class="mt-8">
            <Label class="mb-4" labelFor="certificado_formacion" value="Seleccionar certificado" />
            <File id="certificado_formacion" maxSize="10000" bind:value={$form.certificado_formacion} error={errors.certificado_formacion} />
        </div>
    </fieldset>
    <div class="shadow-inner bg-app-200 border-app-400 flex items-center justify-between mt-14 px-8 py-4">
        {#if formacionAcademicaSena}
            <small class="flex items-center text-app-700">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {formacionAcademicaSena?.updated_at}
            </small>
        {/if}
        <LoadingButton loading={$form.processing} class="ml-auto" type="submit">Guardar</LoadingButton>
    </div>
</form>
