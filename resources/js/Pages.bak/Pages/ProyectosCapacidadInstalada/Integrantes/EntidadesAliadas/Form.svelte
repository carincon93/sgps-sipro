<script>
    import { route } from '@/Utils'

    import Label from '@/Shared/Label'
    import LoadingButton from '@/Shared/LoadingButton'
    import Textarea from '@/Shared/Textarea'
    import Input from '@/Shared/Input'
    import File from '@/Shared/File'

    export let proyectoCapacidadInstalada
    export let entidadAliada
    export let submit
    export let errors
    export let form
    export let allowToCreate
    export let showInput
</script>

<form on:submit|preventDefault={submit}>
    <fieldset class="p-8" disabled={proyectoCapacidadInstalada.allowed.to_update ? undefined : true}>
        <div class="mt-8">
            <Label required class="mb-4" labelFor="nombre" value="Nombre de la entidad aliada/Centro de formación" />
            <Textarea maxlength="255" id="nombre" error={errors.nombre} bind:value={$form.nombre} required />
        </div>

        <div class="mt-8">
            <Label required class="mb-4" labelFor="nit" value="NIT" />
            <Input d="nit" type="text" class="mt-1" bind:value={$form.nit} error={errors.nit} required />
        </div>

        <div class="mt-8">
            <Label required={allowToCreate ? 'required' : undefined} class="mb-4" labelFor="documento" value="Documento" />
            <File id="documento" maxSize="10000" class="mt-1" error={errors?.documento} bind:value={$form.documento} {showInput} valueDb={entidadAliada?.documento} required={allowToCreate ? true : undefined} />
        </div>

        {#if $form.progress}
            <progress value={$form.progress.percentage} max="100" class="mt-4">
                {$form.progress.percentage}%
            </progress>
        {/if}
    </fieldset>
    <div class="shadow-inner bg-app-200 border-app-400 bottom-0 flex items-center justify-between mt-14 px-8 py-4 sticky">
        {#if proyectoCapacidadInstalada.allowed.to_update || allowToCreate}
            <LoadingButton loading={$form.processing} class="ml-auto" type="submit">{allowToCreate ? 'Crear' : 'Editar'} entidad aliada</LoadingButton>
        {:else}
            <span class="inline-block"> El proyecto no se puede modificar </span>
        {/if}
    </div>
</form>
