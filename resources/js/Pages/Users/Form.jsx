<script>
    import { page } from '@inertiajs/inertia-svelte'
    import { checkRole, checkPermission } from '@/Utils'

    import Input from '@/Components/Input'
    import Label from '@/Components/Label'
    import InputError from '@/Components/InputError'
    import PrimaryButton from '@/Components/PrimaryButton'
    import Switch from '@/Components/Switch'
    import Select from '@/Components/Select'
    import Checkbox from '@smui/checkbox'
    import FormField from '@smui/form-field'
    import InfoMessage from '@/Components/InfoMessage'

    export let submit
    export let form
    export let errors
    export let usuario
    export let tiposDocumento
    export let tiposVinculacion
    export let roles
    export let centrosFormacion
    export let allowedToCreate

    /**
     * Validar si el usuario autenticado es SuperAdmin
     */
    let authUser = $auth.user
    let isSuperAdmin = checkRole(authUser, [1])
</script>

<form on:submit|preventDefault={submit}>
    <div className="grid grid-cols-3">
        <div>
            <h1 className="font-black text-4xl sticky top-0 uppercase">Datos personales</h1>
        </div>
        <div className="bg-white rounded shadow col-span-2">
            <fieldset className="p-8" disabled={usuario?.allowed.to_update || allowedToCreate ? undefined : true}>
                <div className="mt-8">
                    <Input label="Nombre completo" id="nombre" type="text" className="mt-1" bind:value={$form.nombre} error={errors.nombre} required />
                </div>

                <div className="mt-8">
                    <Input label="Correo electrónico institucional" id="email" type="email" className="mt-1" bind:value={$form.email} error={errors.email} required />
                </div>

                <div className="mt-8">
                    <Label required className="mb-4" labelFor="tipo_documento" value="Tipo de documento" />
                    <Select id="tipo_documento" items={tiposDocumento} bind:selectedValue={$form.tipo_documento} error={errors.tipo_documento} autocomplete="off" placeholder="Seleccione un tipo de documento" required />
                </div>

                <div className="mt-8">
                    <Input label="Número de documento" id="numero_documento" type="number" input$min="55555" input$max="9999999999999" className="mt-1" bind:value={$form.numero_documento} error={errors.numero_documento} required />
                </div>

                <div className="mt-8">
                    <Input label="Número de celular" id="numero_celular" type="number" input$min="3000000000" input$max="9999999999" className="mt-1" bind:value={$form.numero_celular} error={errors.numero_celular} required />
                </div>

                <div className="mt-8">
                    <Label required labelFor="habilitado" value="¿Usuario habilitado para ingresar al sistema?" className="inline-block mb-4" />
                    <br />
                    <Switch bind:checked={$form.habilitado} />
                    <InputError message={errors.habilitado} />
                </div>

                <div className="mt-8">
                    <Label required className="mb-4" labelFor="tipo_vinculacion" value="Tipo de vinculación" />
                    <Select id="tipo_vinculacion" items={tiposVinculacion} bind:selectedValue={$form.tipo_vinculacion} error={errors.tipo_vinculacion} autocomplete="off" placeholder="Seleccione el tipo de vinculación" required />
                </div>

                {#if isSuperAdmin || allowedToCreate}
                    <div className="mt-8">
                        <Label required className="mb-4" labelFor="centro_formacion_id" value="Centro de formación" />
                        <Select id="centro_formacion_id" items={centrosFormacion} bind:selectedValue={$form.centro_formacion_id} error={errors.centro_formacion_id} autocomplete="off" placeholder="Busque por el nombre del centro de formación" required />
                    </div>
                {/if}

                {#if usuario?.autorizacion_datos}
                    <div className="mt-8">
                        <InfoMessage className="ml-4" message={usuario?.autorizacion_datos ? 'Está persona autorizó el tratamiento de datos' : 'Está persona no autorizó el tratamiento de datos'} />
                    </div>
                {/if}
            </fieldset>
        </div>
    </div>

    <div className="grid grid-cols-3 mt-4">
        <div>
            <h1 className="font-black text-4xl sticky top-0 uppercase">Roles</h1>
        </div>
        <div className="bg-white rounded shadow col-span-2">
            <fieldset className="p-8" disabled={usuario?.allowed.to_update || allowedToCreate ? undefined : true}>
                <div className="p-4">
                    <Label required className="mb-4" labelFor="role_id" value="Seleccione algún rol" />
                    <InputError message={errors.role_id} />
                </div>
                <div className="grid grid-cols-2">
                    {#each roles as { id, name }, i}
                        {#if checkRole(authUser, [4, 21, 17, 18, 20, 19, 5])}
                            {#if name == 'proponente cultura de la innovación' || name == 'proponente i+d+i' || name == 'proponente servicios tecnológicos' || name == 'proponente tecnoacademia' || name == 'proponente tecnoparque' || name == 'Líder de semilleros' || name == 'Facilitador TecnoAcademia' || name == 'Dinamizador Tecnoparque'}
                                <div className="pt-8 pb-8 border-t">
                                    <FormField>
                                        <Checkbox bind:group={$form.role_id} value={id} />
                                        <span slot="label">{name}</span>
                                    </FormField>
                                </div>
                            {/if}
                        {:else if isSuperAdmin}
                            <div className="pt-8 pb-8 border-t">
                                <FormField>
                                    <Checkbox bind:group={$form.role_id} value={id} />
                                    <span slot="label">{name}</span>
                                </FormField>
                            </div>
                        {/if}
                    {/each}
                </div>
            </fieldset>
        </div>
    </div>

    <div className="grid grid-cols-3 mt-4">
        <div>
            <h1 className="font-black text-4xl sticky top-0 uppercase">Permisos especiales</h1>
        </div>
        <div className="bg-white rounded shadow col-span-2">
            <fieldset className="p-8" disabled={isSuperAdmin || checkRole(authUser, [17, 18, 20, 19, 5, 23]) ? undefined : true}>
                <div className="p-4">
                    <Label className="mb-4" labelFor="role_id" value="Seleccione algún permiso especial para el usuario (Aplica cuando la convocatoria ha finalizado)" />
                    <InputError message={errors.permission_id} />
                </div>
                <div className="grid grid-cols-2">
                    {#if isSuperAdmin}
                        <div className="pt-8 pb-8 border-t">
                            <FormField>
                                <Checkbox bind:group={$form.permission_id} value={1} />
                                <span slot="label">Crear/modificar proyecto de I+D+i</span>
                            </FormField>
                        </div>

                        <div className="pt-8 pb-8 border-t">
                            <FormField>
                                <Checkbox bind:group={$form.permission_id} value={8} />
                                <span slot="label">Crear/modificar proyecto de TA</span>
                            </FormField>
                        </div>

                        <div className="pt-8 pb-8 border-t">
                            <FormField>
                                <Checkbox bind:group={$form.permission_id} value={17} />
                                <span slot="label">Crear/modificar proyecto de TP</span>
                            </FormField>
                        </div>

                        <div className="pt-8 pb-8 border-t">
                            <FormField>
                                <Checkbox bind:group={$form.permission_id} value={11} />
                                <span slot="label">Crear/modificar proyecto de Cultura de la Innovación</span>
                            </FormField>
                        </div>

                        <div className="pt-8 pb-8 border-t">
                            <FormField>
                                <Checkbox bind:group={$form.permission_id} value={5} />
                                <span slot="label">Crear/modificar proyecto de Servicios Tecnológicos</span>
                            </FormField>
                        </div>

                        <div className="pt-8 pb-8 border-t">
                            <FormField>
                                <Checkbox bind:group={$form.permission_id} value={23} />
                                <span slot="label">Modificar toda la información de proyectos de TA</span>
                            </FormField>
                        </div>

                        <div className="pt-8 pb-8 border-t">
                            <FormField>
                                <Checkbox bind:group={$form.permission_id} value={24} />
                                <span slot="label">Modificar toda la información de proyectos de TP</span>
                            </FormField>
                        </div>
                    {/if}
                </div>
            </fieldset>
        </div>
    </div>

    {#if usuario?.allowed.to_update}
        <div className="grid grid-cols-3 mt-4">
            <div>
                <h1 className="font-black text-4xl sticky top-0 uppercase">Restablecer contraseña</h1>
            </div>
            <div className="bg-white rounded shadow col-span-2">
                <div className="mt-4 p-8">
                    <Label labelFor="default_password" value="¿Usar contraseña por defecto?" className="inline-block mb-4" />
                    <br />
                    <Switch bind:checked={$form.default_password} />
                </div>
                {#if $form.numero_documento && $form.default_password}
                    <InfoMessage className="mt-4 p-8" message="La contraseña de este usuario es: sena{$form.numero_documento}*" />
                {/if}
            </div>
        </div>
    {/if}

    <div className="shadow-inner bg-app-200 border-app-400 mt-14 px-8 py-4">
        {#if $form.role_id.find((item) => item == 4) == 4 && isSuperAdmin}
            <InfoMessage alertMsg={true} className="my-2">
                <strong>Importante:</strong>
                <br />
                El/la usuario(a) tiene rol Dinamizador(a) SENNOVA, al dar clic en 'Guardar' se configurará como dinamizador(a) del centro seleccionado
            </InfoMessage>
        {/if}
        <div className="flex items-center justify-between">
            {#if usuario && usuario?.allowed.to_update}
                <small className="flex items-center text-app-700">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {usuario.updated_at}
                </small>
            {/if}
            {#if usuario?.allowed.to_update || allowedToCreate}
                <PrimaryButton loading={$form.processing} className="ml-auto" type="submit">Guardar</PrimaryButton>
            {:else}
                <span className="inline-block ml-1.5"> El recurso no se puede crear/modificar </span>
            {/if}
        </div>
    </div>
</form>
