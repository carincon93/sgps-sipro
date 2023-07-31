<script>
    import { route } from '@/Utils'

    import Label from '@/Components/Label'
    import PrimaryButton from '@/Components/PrimaryButton'
    import Textarea from '@/Components/Textarea'
    import Input from '@/Components/Input'
    import File from '@/Components/File'

    export let proyectoCapacidadInstalada
    export let entidadAliada
    export let submit
    export let errors
    export let form
    export let allowToCreate
    export let showInput
</script>

<form on:submit|preventDefault={submit}>
    <fieldset className="p-8" disabled={proyectoCapacidadInstalada.allowed.to_update ? undefined : true}>
        <div className="mt-8">
            <Label required className="mb-4" labelFor="nombre" value="Nombre de la entidad aliada/Centro de formación" />
            <Textarea maxlength="255" id="nombre" error={errors.nombre} bind:value={$form.nombre} required />
        </div>

        <div className="mt-8">
            <Label required className="mb-4" labelFor="nit" value="NIT" />
            <Input d="nit" type="text" className="mt-1" bind:value={$form.nit} error={errors.nit} required />
        </div>

        <div className="mt-8">
            <Label required={allowToCreate ? 'required' : undefined} className="mb-4" labelFor="documento" value="Documento" />
            <File id="documento" maxSize="10000" className="mt-1" error={errors?.documento} bind:value={$form.documento} {showInput} valueDb={entidadAliada?.documento} required={allowToCreate ? true : undefined} />
        </div>

        {#if $form.progress}
            <progress value={$form.progress.percentage} max="100" className="mt-4">
                {$form.progress.percentage}%
            </progress>
        {/if}
    </fieldset>
    <div className="flex items-center justify-between mt-14 px-8 py-4">
        {#if proyectoCapacidadInstalada.allowed.to_update || allowToCreate}
            <PrimaryButton loading={$form.processing} className="ml-auto" type="submit">{allowToCreate ? 'Crear' : 'Editar'} entidad aliada</PrimaryButton>
        {:else}
            <span className="inline-block"> El proyecto no se puede modificar </span>
        {/if}
    </div>
</form>
