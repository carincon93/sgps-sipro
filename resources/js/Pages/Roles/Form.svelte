<script>
    import InputError from '@/Shared/InputError'
    import Input from '@/Shared/Input'
    import Label from '@/Shared/Label'
    import LoadingButton from '@/Shared/LoadingButton'
    import Checkbox from '@smui/checkbox'
    import FormField from '@smui/form-field'
    import Textarea from '@/Shared/Textarea'

    export let errors
    export let role
    export let allPermissions
    export let isSuperAdmin
    export let form
    export let submit
</script>

<form on:submit|preventDefault={submit}>
    <fieldset disabled={isSuperAdmin ? undefined : true}>
        <div class="bg-white rounded shadow max-w-3xl p-8">
            <div class="mt-8">
                <Input label="Nombre" id="name" type="text" class="mt-1" bind:value={$form.name} error={errors.name} required />
            </div>

            <div class="mt-8">
                <Textarea label="Descripción" maxlength="40000" id="description" bind:value={$form.description} error={errors.description} required />
            </div>
        </div>

        <div class="bg-white rounded shadow overflow-hidden mt-20">
            <div class="p-4">
                <Label required class="mb-4" labelFor="permission_id" value="Seleccione los permisos" />
                <InputError message={errors.permission_id} />
            </div>
            <div class="grid grid-cols-6">
                {#each allPermissions as { id, name }, i}
                    <div class="pt-8 pb-8 border-t border-b flex flex-col-reverse items-center justify-between">
                        <FormField>
                            <Checkbox bind:group={$form.permission_id} value={id} />
                            <span slot="label">{name}</span>
                        </FormField>
                    </div>
                {/each}
            </div>
        </div>
    </fieldset>
    <div class="shadow-inner bg-app-200 border-app-400 flex items-center justify-between mt-14 px-8 py-4">
        {#if role}
            <small class="flex items-center text-app-700">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {role?.updated_at}
            </small>
        {/if}
        {#if isSuperAdmin}
            <LoadingButton loading={$form.processing} class="ml-auto" type="submit">Guardar</LoadingButton>
        {:else}
            <span class="inline-block ml-1.5"> El recurso no se puede crear/modificar </span>
        {/if}
    </div>
</form>
