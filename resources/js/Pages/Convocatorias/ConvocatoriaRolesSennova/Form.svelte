<script>
    import Input from '@/Shared/Input'
    import Label from '@/Shared/Label'
    import LoadingButton from '@/Shared/LoadingButton'
    import Select from '@/Shared/Select'
    import Textarea from '@/Shared/Textarea'

    export let submit
    export let isSuperAdmin
    export let rolesSennova
    export let form
    export let errors
    export let lineasProgramaticas
    export let nivelesAcademicos
</script>

<form on:submit|preventDefault={submit}>
    <fieldset class="p-8" disabled={isSuperAdmin ? undefined : true}>
        <div class="mt-8">
            <Label required class="mb-4" labelFor="rol_sennova_id" value="Rol SENNOVA" />
            <Select id="rol_sennova_id" items={rolesSennova} bind:selectedValue={$form.rol_sennova_id} error={errors.rol_sennova_id} autocomplete="off" placeholder="Seleccione un rol SENNOVA" required />
        </div>

        <div class="mt-8">
            <Input label="Asignación mensual" id="asignacion_mensual" type="number" input$min="0" class="mt-1" bind:value={$form.asignacion_mensual} error={errors.asignacion_mensual} required />
        </div>

        <div class="mt-8">
            <Input label="Meses de experiencia requerida" id="experiencia" type="text" class="mt-1" bind:value={$form.experiencia} error={errors.experiencia} />
        </div>
        <div class="mt-8">
            <Label required class="mb-4" labelFor="linea_programatica_id" value="Línea programática" />
            <Select id="linea_programatica_id" items={lineasProgramaticas} bind:selectedValue={$form.linea_programatica_id} error={errors.linea_programatica_id} placeholder="Seleccione una línea programática" required />
        </div>

        <div class="mt-8">
            <Label required class="mb-4" labelFor="nivel_academico" value="Nivel académico" />
            <Select id="nivel_academico" items={nivelesAcademicos} bind:selectedValue={$form.nivel_academico} error={errors.nivel_academico} autocomplete="off" placeholder="Seleccione un nivel académico" required />
        </div>

        <div class="mt-8">
            <Textarea label="Perfil" maxlength="40000" id="perfil" bind:value={$form.perfil} error={errors.perfil} />
        </div>

        <div class="mt-8">
            <Textarea label="Mensaje (Regla de negocio)" maxlength="40000" id="mensaje" bind:value={$form.mensaje} error={errors.mensaje} />
        </div>
    </fieldset>
    <div class="shadow-inner bg-app-200 border-app-400 bottom-0 flex items-center justify-between mt-14 px-8 py-4 sticky">
        {#if isSuperAdmin}
            <LoadingButton loading={$form.processing} class="ml-auto" type="submit">Guardar</LoadingButton>
        {/if}
    </div>
</form>
