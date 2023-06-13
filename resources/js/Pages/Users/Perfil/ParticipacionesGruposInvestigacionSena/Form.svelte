<script>
    import Label from '@/Shared/Label'
    import Select from '@/Shared/Select'
    import LoadingButton from '@/Shared/LoadingButton'

    export let errors
    export let participacionGrupoInvestigacionSena
    export let gruposInvestigacion
    export let semillerosInvestigacion
    export let form
    export let submit
</script>

<form on:submit|preventDefault={submit}>
    <fieldset class="p-8">
        <div class="mt-8">
            <Label required class="mb-4" labelFor="grupo_investigacion_id" value="Grupo de investigación al que pertenece actualmente" />
            <Select id="grupo_investigacion_id" items={gruposInvestigacion} bind:selectedValue={$form.grupo_investigacion_id} error={errors.grupo_investigacion_id} autocomplete="off" placeholder="Seleccione una opción" required />
        </div>

        <div class="mt-8">
            <Label required class="mb-4" labelFor="semillero_investigacion_id" value="Semillero de investigación al que pertenece actualmente" />
            <Select id="semillero_investigacion_id" items={semillerosInvestigacion} bind:selectedValue={$form.semillero_investigacion_id} error={errors.semillero_investigacion_id} autocomplete="off" placeholder="Seleccione una opción" />
        </div>

        <div class="mt-8">
            <Label required class="mb-4" labelFor="pertenece_grupo_investigacion_centro" value="¿Actualmente pertenece al grupo de investigación de su centro?" />
            <Select
                id="pertenece_grupo_investigacion_centro"
                items={[
                    { value: 1, label: 'Si' },
                    { value: 2, label: 'No' },
                ]}
                bind:selectedValue={$form.pertenece_grupo_investigacion_centro}
                error={errors.pertenece_grupo_investigacion_centro}
                autocomplete="off"
                placeholder="Seleccione una opción"
                required
            />
        </div>

        <div class="mt-8">
            <Label required class="mb-4" labelFor="pertenece_semillero_investigacion_centro" value="¿Actualmente pertenece al semillero de investigación de su centro?" />
            <Select
                id="pertenece_semillero_investigacion_centro"
                items={[
                    { value: 1, label: 'Si' },
                    { value: 2, label: 'No' },
                ]}
                bind:selectedValue={$form.pertenece_semillero_investigacion_centro}
                error={errors.pertenece_semillero_investigacion_centro}
                autocomplete="off"
                placeholder="Seleccione una opción"
                required
            />
        </div>
    </fieldset>
    <div class="shadow-inner bg-app-200 border-app-400 flex items-center justify-between mt-14 px-8 py-4">
        {#if participacionGrupoInvestigacionSena}
            <small class="flex items-center text-app-700">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {participacionGrupoInvestigacionSena?.updated_at}
            </small>
        {/if}
        <LoadingButton loading={$form.processing} class="ml-auto" type="submit">Guardar</LoadingButton>
    </div>
</form>
