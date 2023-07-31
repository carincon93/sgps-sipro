<script>
    import Label from '@/Components/Label'
    import InputError from '@/Components/InputError'
    import PrimaryButton from '@/Components/PrimaryButton'
    import Switch from '@/Components/Switch'
    import Select from '@/Components/Select'
    import InfoMessage from '@/Components/InfoMessage'

    export let form
    export let submit
    export let errors
    export let evaluacion
    export let evaluadores
    export let proyectos
    export let allowed_to_create
</script>

<form on:submit|preventDefault={submit}>
    <fieldset className="p-8">
        <div className="mt-8">
            <Label required className="mb-4" labelFor="user_id" value="Evaluador" />
            <Select disabled={evaluacion?.clausula_confidencialidad} id="user_id" items={evaluadores} bind:selectedValue={$form.user_id} error={errors.user_id} autocomplete="off" placeholder="Seleccione un evaluador" required />
            {#if evaluacion?.clausula_confidencialidad}
                <InfoMessage alertMsg={true}>No se puede modificar el evaluador debido a que la evaluación ya tiene información registrada. Por favor genere una nueva evaluación con el nuevo evaluador y posteriormente deshabilite esta evaluación.</InfoMessage>
            {/if}
        </div>

        <div className="mt-8">
            <Label required className="mb-4" labelFor="proyecto_id" value="Proyecto" />
            <Select disabled={evaluacion?.clausula_confidencialidad} id="proyecto_id" items={proyectos} bind:selectedValue={$form.proyecto_id} error={errors.proyecto_id} autocomplete="off" placeholder="Seleccione un proyecto" required />
        </div>

        <div className="mt-8">
            <Label required labelFor="habilitado" value="¿La evaluación está habilitada? Nota: Una evaluación habilitada significa que el sistema la puede tomar para hacer el cálculo del promedio y asignar el estado del proyecto." className="inline-block mb-4" />
            <br />
            <Switch bind:checked={$form.habilitado} />
            <InputError message={errors.habilitado} />
        </div>

        <div className="mt-8">
            <Label required labelFor="modificable" value="¿La evaluación es modificable? Nota: Si la evaluación es modificable el evaluador podrá editar la información de la evaluación. Por otro lado el formulador NO podrá modicar la información del proyecto mientras se está realizando una evaluación." className="inline-block mb-4" />
            <br />
            <Switch bind:checked={$form.modificable} />
            <InputError message={errors.modificable} />
        </div>

        <div className="mt-8">
            <Label required labelFor="finalizado" value="¿La evaluación está finalizada?" className="inline-block mb-4" />
            <br />
            <Switch bind:checked={$form.finalizado} />
            <InputError message={errors.finalizado} />
        </div>
    </fieldset>

    <div className="shadow-inner bg-app-200 border-app-400 flex items-center justify-between mt-14 px-8 py-4">
        {#if evaluacion}
            <small className="flex items-center text-app-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {evaluacion?.updated_at}
            </small>
        {/if}
        {#if evaluacion?.allowed.to_update || allowed_to_create}
            <PrimaryButton loading={$form.processing} className="ml-auto" type="submit">Guardar</PrimaryButton>
        {:else}
            <span className="inline-block ml-1.5"> El recurso no se puede crear/modificar </span>
        {/if}
    </div>
</form>
