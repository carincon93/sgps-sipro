<script>
    import InputError from '@/Components/InputError'
    import Input from '@/Components/Input'
    import Label from '@/Components/Label'
    import PrimaryButton from '@/Components/PrimaryButton'
    import Checkbox from '@smui/checkbox'
    import FormField from '@smui/form-field'
    import Textarea from '@/Components/Textarea'

    export let errors
    export let role
    export let allPermissions
    export let is_super_admin
    export let form
    export let submit
</script>

<form on:submit|preventDefault={submit}>
    <fieldset disabled={is_super_admin ? undefined : true}>
        <div className="bg-white rounded shadow max-w-3xl p-8">
            <div className="mt-8">
                <Input label="Nombre" id="name" type="text" className="mt-1" bind:value={$form.name} error={errors.name} required />
            </div>

            <div className="mt-8">
                <Textarea label="Descripción" maxlength="40000" id="description" bind:value={$form.description} error={errors.description} required />
            </div>
        </div>

        <div className="bg-white rounded shadow overflow-hidden mt-20">
            <div className="p-4">
                <Label required className="mb-4" labelFor="permission_id" value="Seleccione los permisos" />
                <InputError message={errors.permission_id} />
            </div>
            <div className="grid grid-cols-6">
                {#each allPermissions as { id, name }, i}
                    <div className="pt-8 pb-8 border-t border-b flex flex-col-reverse items-center justify-between">
                        <FormField>
                            <Checkbox bind:group={$form.permission_id} value={id} />
                            <span slot="label">{name}</span>
                        </FormField>
                    </div>
                {/each}
            </div>
        </div>
    </fieldset>
    <div className="shadow-inner bg-app-200 border-app-400 flex items-center justify-between mt-14 px-8 py-4">
        {#if role}
            <small className="flex items-center text-app-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {role?.updated_at}
            </small>
        {/if}
        {#if is_super_admin}
            <PrimaryButton loading={$form.processing} className="ml-auto" type="submit">Guardar</PrimaryButton>
        {:else}
            <span className="inline-block ml-1.5"> El recurso no se puede crear/modificar </span>
        {/if}
    </div>
</form>
