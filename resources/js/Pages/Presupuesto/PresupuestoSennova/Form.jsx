<script>
    import Label from '@/Components/Label'
    import Textarea from '@/Components/Textarea'
    import Select from '@/Components/Select'
    import Switch from '@/Components/Switch'
    import InputError from '@/Components/InputError'
    import PrimaryButton from '@/Components/PrimaryButton'
    import InfoMessage from '@/Components/InfoMessage'

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
    <fieldset className="p-8" disabled={isSuperAdmin ? undefined : true}>
        <div className="mt-8">
            <Label required className="mb-4" labelFor="primer_grupo_presupuestal_id" value="Primer grupo presupuestal" />
            <Select id="primer_grupo_presupuestal_id" items={primerGrupoPresupuestal} bind:selectedValue={$form.primer_grupo_presupuestal_id} error={errors.primer_grupo_presupuestal_id} autocomplete="off" placeholder="Seleccione un rubro del primer grupo presupuestal" required />
        </div>
        <div className="mt-8">
            <Label required className="mb-4" labelFor="segundo_grupo_presupuestal_id" value="Segundo grupo presupuestal" />
            <Select id="segundo_grupo_presupuestal_id" items={segundoGrupoPresupuestal} bind:selectedValue={$form.segundo_grupo_presupuestal_id} error={errors.segundo_grupo_presupuestal_id} autocomplete="off" placeholder="Seleccione un rubro del segundo grupo presupuestal" required />
        </div>
        <div className="mt-8">
            <Label required className="mb-4" labelFor="tercer_grupo_presupuestal_id" value="Tercer grupo presupuestal" />
            <Select id="tercer_grupo_presupuestal_id" items={tercerGrupoPresupuestal} bind:selectedValue={$form.tercer_grupo_presupuestal_id} error={errors.tercer_grupo_presupuestal_id} autocomplete="off" placeholder="Seleccione un rubro del tercer grupo presupuestal" required />
        </div>
        <div className="mt-8">
            <Label required className="mb-4" labelFor="uso_presupuestal_id" value="Uso presupuestal" />
            <Select id="uso_presupuestal_id" items={usosPresupuestales} bind:selectedValue={$form.uso_presupuestal_id} error={errors.uso_presupuestal_id} autocomplete="off" placeholder="Seleccione un uso presupuestal" required />
        </div>
        <div className="mt-8">
            <Label required className="mb-4" labelFor="linea_programatica_id" value="Línea programática" />
            <Select id="linea_programatica_id" items={lineasProgramaticas} bind:selectedValue={$form.linea_programatica_id} error={errors.linea_programatica_id} autocomplete="off" placeholder="Seleccione una línea programática" required />
        </div>
        <div className="mt-8">
            <Label labelFor="mensaje" value="Mensaje" />
            <InfoMessage>
                Escribe un mensaje si desea que se muestre cuando se seleccione el rubro.
                <br />
                Ejemplo: Para el proyecto solo se podrá destinar hasta $4.594.000 de viáticos, lo cual comprende la sumatoria de todos los rubros que tengan esta finalidad.
            </InfoMessage>
            <Textarea maxlength="40000" id="mensaje" bind:value={$form.mensaje} error={errors.mensaje} />
        </div>

        <hr className="mt-10 mb-10" />

        <div className="mt-8">
            <Label labelFor="requiere_estudio_mercado" value="¿Requiere estudio mercado? Nota: Si la opción es 'Si' el sistema solicitará al proponente el estudio de mercado" className="inline-block mb-4" />
            <br />
            <Switch bind:checked={$form.requiere_estudio_mercado} />
            <InputError message={errors.requiere_estudio_mercado} />
        </div>

        <hr className="mt-10 mb-10" />

        <div className="mt-8">
            <Label labelFor="sumar_al_presupuesto" value="¿Este rubro suma al presupuesto? Nota: Si la opción es 'Si' el sistema sumará este rubro al total del precio del proyecto" className="inline-block mb-4" />
            <br />
            <Switch bind:checked={$form.sumar_al_presupuesto} />
            <InputError message={errors.sumar_al_presupuesto} />
        </div>

        <hr className="mt-10 mb-10" />

        <div className="mt-8">
            <Label labelFor="habilitado" value="¿Este rubro esta habilitado? Nota: Si la opción es 'Si' el sistema hará visible el rubro en el formulario de presupuesto" className="inline-block mb-4" />
            <br />
            <Switch bind:checked={$form.habilitado} />
            <InputError message={errors.habilitado} />
        </div>
    </fieldset>
    <div className="shadow-inner bg-app-200 border-app-400 flex items-center justify-between mt-14 px-8 py-4">
        {#if presupuestoSennova}
            <small className="flex items-center text-app-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {presupuestoSennova?.updated_at}
            </small>
        {/if}
        {#if isSuperAdmin}
            <PrimaryButton loading={$form.processing} className="ml-auto" type="submit">Guardar</PrimaryButton>
        {:else}
            <span className="inline-block ml-1.5"> El recurso no se puede crear/modificar </span>
        {/if}
    </div>
</form>
