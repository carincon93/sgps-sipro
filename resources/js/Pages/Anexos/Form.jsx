<script>
    import { route } from '@/Utils'

    import Textarea from '@/Components/Textarea'
    import File from '@/Components/File'
    import Label from '@/Components/Label'
    import PrimaryButton from '@/Components/PrimaryButton'
    import Checkbox from '@smui/checkbox'
    import FormField from '@smui/form-field'
    import Switch from '@/Components/Switch'
    import Select from '@/Components/Select'
    import MultipleSelect from '@/Components/MultipleSelect'
    import InputError from '@/Components/InputError'

    export let form
    export let submit
    export let errors
    export let anexo
    export let lineasProgramaticas
    export let convocatorias
    export let isSuperAdmin
    export let method = ''
</script>

<form on:submit|preventDefault={submit}>
    <fieldset className="p-8" disabled={isSuperAdmin ? undefined : true}>
        <div className="mt-8">
            <Textarea label="Nombre del anexo" maxlength="40000" id="nombre" error={errors.nombre} bind:value={$form.nombre} required />
        </div>

        <div className="mt-8">
            <Textarea label="Descripción" maxlength="40000" id="descripcion" error={errors.descripcion} bind:value={$form.descripcion} required />
        </div>

        <div className="mt-8">
            <Label className="mb-4 mt-8" labelFor="archivo" value="Formato" />
            <File id="archivo" maxSize="10000" bind:value={$form.archivo} valueDb={anexo?.archivo} error={errors.archivo} route={anexo?.archivo?.includes('http') || method == 'store' ? null : route('anexos.download-file-sharepoint', [anexo, 'archivo'])} />
        </div>

        <div className="mt-44 mb-20 grid grid-cols-2">
            <div>
                <Label required className="mb-4" labelFor="convocatoria_id" value="Seleccione las convocatorias en las que se debe solicitar el anexo" />
            </div>
            <div>
                <MultipleSelect id="convocatoria_id" bind:selectedValue={$form.convocatoria_id} items={convocatorias}  error={errors.convocatoria_id} placeholder="Buscar convocatorias" required />
            </div>
        </div>

        <div className="mt-8">
            <Label required labelFor="obligatorio" value="¿El anexo es obligatorio?" className="inline-block mb-4" />
            <br />
            <Switch bind:checked={$form.obligatorio} />
            <InputError message={errors.obligatorio} />
        </div>

        <div className="mt-8">
            <Label required labelFor="habilitado" value="¿El anexo esta habilitado?" className="inline-block mb-4" />
            <br />
            <Switch bind:checked={$form.habilitado} />
            <InputError message={errors.habilitado} />
        </div>

        <div className="bg-white rounded shadow overflow-hidden mt-20">
            <div className="grid grid-cols-2">
                {#each lineasProgramaticas as { id, nombre, codigo }, i}
                    <FormField>
                        <Checkbox bind:group={$form.linea_programatica_id} value={id} />
                        <span slot="label">{nombre} ({codigo})</span>
                    </FormField>
                {/each}
            </div>
        </div>
    </fieldset>
    <div className="shadow-inner bg-app-200 border-app-400 flex items-center justify-between mt-14 px-8 py-4 ">
        {#if anexo && isSuperAdmin}
            <small className="flex items-center text-app-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {anexo?.updated_at}
            </small>
        {/if}
        {#if isSuperAdmin}
            <PrimaryButton loading={$form.processing} className="ml-auto" type="submit">Guardar</PrimaryButton>
        {:else}
            <span className="inline-block ml-1.5"> El recurso no se puede crear/modificar </span>
        {/if}
    </div>
</form>
