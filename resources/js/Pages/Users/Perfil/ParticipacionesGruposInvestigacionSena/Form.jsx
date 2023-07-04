<script>
    import Label from '@/Components/Label'
    import Select from '@/Components/Select'
    import PrimaryButton from '@/Components/PrimaryButton'

    export let errors
    export let participacionGrupoInvestigacionSena
    export let gruposInvestigacion
    export let semillerosInvestigacion
    export let form
    export let submit
</script>

<form on:submit|preventDefault={submit}>
    <fieldset className="p-8">
        <div className="mt-8">
            <Label required className="mb-4" labelFor="pertenece_grupo_investigacion_centro" value="¿Actualmente pertenece al grupo de investigación de su centro?" />
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

        {#if $form.pertenece_grupo_investigacion_centro?.value == 1}
            <div className="mt-8">
                <Label required className="mb-4" labelFor="grupo_investigacion_id" value="Grupo de investigación al que pertenece actualmente" />
                <Select id="grupo_investigacion_id" items={gruposInvestigacion} bind:selectedValue={$form.grupo_investigacion_id} error={errors.grupo_investigacion_id} autocomplete="off" placeholder="Seleccione una opción" required />
            </div>
        {/if}

        <div className="mt-8">
            <Label required className="mb-4" labelFor="pertenece_semillero_investigacion_centro" value="¿Actualmente pertenece al semillero de investigación de su centro?" />
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

        {#if $form.pertenece_semillero_investigacion_centro?.value == 1}
            <div className="mt-8">
                <Label required className="mb-4" labelFor="semillero_investigacion_id" value="Semillero de investigación al que pertenece actualmente" />
                <Select id="semillero_investigacion_id" items={semillerosInvestigacion} bind:selectedValue={$form.semillero_investigacion_id} error={errors.semillero_investigacion_id} autocomplete="off" placeholder="Seleccione una opción" required />
            </div>
        {/if}
    </fieldset>
    <div className="shadow-inner bg-app-200 border-app-400 flex items-center justify-between mt-14 px-8 py-4">
        {#if participacionGrupoInvestigacionSena}
            <small className="flex items-center text-app-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {participacionGrupoInvestigacionSena?.updated_at}
            </small>
        {/if}
        <PrimaryButton loading={$form.processing} className="ml-auto" type="submit">Guardar</PrimaryButton>
    </div>
</form>
