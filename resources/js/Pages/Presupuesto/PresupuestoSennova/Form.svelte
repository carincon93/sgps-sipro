<script>
    import Label from '@/Shared/Label'
    import Textarea from '@/Shared/Textarea'
    import Select from '@/Shared/Select'
    import Switch from '@/Shared/Switch'
    import InputError from '@/Shared/InputError'
    import LoadingButton from '@/Shared/LoadingButton'
    import InfoMessage from '@/Shared/InfoMessage'

    export let submit
    export let form
    export let errors
    export let presupuestoSennova
    export let primerGrupoPresupuestal
    export let segundoGrupoPresupuestal
    export let tercerGrupoPresupuestal
    export let usosPresupuestales
    export let lineasProgramaticas
    export let isSuperAdmin
</script>

<form on:submit|preventDefault={submit}>
    <fieldset class="p-8" disabled={isSuperAdmin ? undefined : true}>
        <div class="mt-8">
            <Label required class="mb-4" labelFor="primer_grupo_presupuestal_id" value="Primer grupo presupuestal" />
            <Select id="primer_grupo_presupuestal_id" items={primerGrupoPresupuestal} bind:selectedValue={$form.primer_grupo_presupuestal_id} error={errors.primer_grupo_presupuestal_id} autocomplete="off" placeholder="Seleccione un rubro del primer grupo presupuestal" required />
        </div>
        <div class="mt-8">
            <Label required class="mb-4" labelFor="segundo_grupo_presupuestal_id" value="Segundo grupo presupuestal" />
            <Select id="segundo_grupo_presupuestal_id" items={segundoGrupoPresupuestal} bind:selectedValue={$form.segundo_grupo_presupuestal_id} error={errors.segundo_grupo_presupuestal_id} autocomplete="off" placeholder="Seleccione un rubro del segundo grupo presupuestal" required />
        </div>
        <div class="mt-8">
            <Label required class="mb-4" labelFor="tercer_grupo_presupuestal_id" value="Tercer grupo presupuestal" />
            <Select id="tercer_grupo_presupuestal_id" items={tercerGrupoPresupuestal} bind:selectedValue={$form.tercer_grupo_presupuestal_id} error={errors.tercer_grupo_presupuestal_id} autocomplete="off" placeholder="Seleccione un rubro del tercer grupo presupuestal" required />
        </div>
        <div class="mt-8">
            <Label required class="mb-4" labelFor="uso_presupuestal_id" value="Uso presupuestal" />
            <Select id="uso_presupuestal_id" items={usosPresupuestales} bind:selectedValue={$form.uso_presupuestal_id} error={errors.uso_presupuestal_id} autocomplete="off" placeholder="Seleccione un uso presupuestal" required />
        </div>
        <div class="mt-8">
            <Label required class="mb-4" labelFor="linea_programatica_id" value="Línea programática" />
            <Select id="linea_programatica_id" items={lineasProgramaticas} bind:selectedValue={$form.linea_programatica_id} error={errors.linea_programatica_id} autocomplete="off" placeholder="Seleccione una línea programática" required />
        </div>
    </fieldset>
    <div class="shadow-inner bg-app-200 border-app-400 flex items-center justify-between mt-14 px-8 py-4">
        {#if presupuestoSennova}
            <small class="flex items-center text-app-700">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {presupuestoSennova?.updated_at}
            </small>
        {/if}
        {#if isSuperAdmin}
            <LoadingButton loading={$form.processing} class="ml-auto" type="submit">Guardar</LoadingButton>
        {:else}
            <span class="inline-block ml-1.5"> El recurso no se puede crear/modificar </span>
        {/if}
    </div>
</form>
