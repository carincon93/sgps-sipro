<script>
    import Input from '@/Components/Input'
    import Label from '@/Components/Label'
    import PrimaryButton from '@/Components/PrimaryButton'
    import Select from '@/Components/Select'
    import Textarea from '@/Components/Textarea'

    export let submit
    export let is_super_admin
    export let rolesSennova
    export let form
    export let errors
    export let lineasProgramaticas
    export let nivelesAcademicos
</script>

<form on:submit|preventDefault={submit}>
    <fieldset className="p-8" disabled={is_super_admin ? undefined : true}>
        <div className="mt-8">
            <Label required className="mb-4" labelFor="rol_sennova_id" value="Rol SENNOVA" />
            <Select id="rol_sennova_id" items={rolesSennova} bind:selectedValue={$form.rol_sennova_id} error={errors.rol_sennova_id} autocomplete="off" placeholder="Seleccione un rol SENNOVA" required />
        </div>

        <div className="mt-8">
            <Input label="Asignación mensual" id="asignacion_mensual" type="number" input$min="0" className="mt-1" bind:value={$form.asignacion_mensual} error={errors.asignacion_mensual} required />
        </div>

        <div className="mt-8">
            <Input label="Meses de experiencia requerida" id="experiencia" type="text" className="mt-1" bind:value={$form.experiencia} error={errors.experiencia} />
        </div>
        <div className="mt-8">
            <Label required className="mb-4" labelFor="linea_programatica_id" value="Línea programática" />
            <Select id="linea_programatica_id" items={lineasProgramaticas} bind:selectedValue={$form.linea_programatica_id} error={errors.linea_programatica_id} placeholder="Seleccione una línea programática" required />
        </div>

        <div className="mt-8">
            <Label required className="mb-4" labelFor="nivel_academico" value="Nivel académico" />
            <Select id="nivel_academico" items={nivelesAcademicos} bind:selectedValue={$form.nivel_academico} error={errors.nivel_academico} autocomplete="off" placeholder="Seleccione un nivel académico" required />
        </div>

        <div className="mt-8">
            <Textarea label="Perfil" maxlength="40000" id="perfil" bind:value={$form.perfil} error={errors.perfil} />
        </div>

        <div className="mt-8">
            <Textarea label="Mensaje (Regla de negocio)" maxlength="40000" id="mensaje" bind:value={$form.mensaje} error={errors.mensaje} />
        </div>
    </fieldset>
    <div className="flex items-center justify-between mt-14 px-8 py-4">
        {#if is_super_admin}
            <PrimaryButton loading={$form.processing} className="ml-auto" type="submit">Guardar</PrimaryButton>
        {/if}
    </div>
</form>
