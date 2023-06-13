<script>
    import { Inertia } from '@inertiajs/inertia'
    import { useForm, page } from '@inertiajs/inertia-svelte'
    import { route, checkRole, checkPermission } from '@/Utils'
    import { _ } from 'svelte-i18n'
    import axios from 'axios'

    import Input from '@/Shared/Input'
    import Label from '@/Shared/Label'
    import Select from '@/Shared/Select'
    import LoadingButton from '@/Shared/LoadingButton'
    import DataTableMenu from '@/Shared/DataTableMenu'
    import { Item, Text, Separator } from '@smui/list'
    import Dialog from '@/Shared/Dialog'
    import Button from '@/Shared/Button'
    import InfoMessage from '@/Shared/InfoMessage'
    import Checkbox from '@smui/checkbox'
    import FormField from '@smui/form-field'

    export let errors
    export let convocatoria
    export let proyecto
    export let tiposDocumento
    export let tiposVinculacion
    export let centrosFormacion
    export let roles
    export let autorPrincipal

    let resultados = []

    /**
     * Validar si el usuario autenticado es SuperAdmin
     */
    let authUser = $page.props.auth.user
    let isSuperAdmin = checkRole(authUser, [1])

    /**
     * Buscar
     */
    let form = useForm({
        search_participante: '',
    })
    let formID
    let dialogOpen = false
    let dialogTitle

    let sended = false
    function submit() {
        if (proyecto.allowed.to_update) {
            sended = false
            try {
                axios
                    .post(route('convocatorias.proyectos.participantes.users', { convocatoria: convocatoria.id, proyecto: proyecto.id }), $form)
                    .then((response) => {
                        resultados = response.data
                        sended = true
                    })
                    .catch((error) => {})
            } catch (error) {}
        }
    }

    function removeParticipante(id) {
        if (proyecto.allowed.to_update) {
            Inertia.post(
                route('convocatorias.proyectos.participantes.users.unlink', {
                    proyecto: proyecto.id,
                    convocatoria: convocatoria.id,
                }),
                { user_id: id, _method: 'DELETE' },
                { preserveScroll: true },
            )
        }
    }

    /**
     * Participantes
     */
    let formParticipante = useForm({
        _method: null,
        user_id: 0,
        cantidad_meses: 0,
        cantidad_horas: 0,
        centro_formacion_id: null,
        rol_sennova: null,
    })

    function showParticipante(user, method = null) {
        reset()
        dialogTitle = user.nombre
        dialogOpen = true
        formID = 'participante-form'
        $formParticipante._method = method
        $formParticipante.user_id = user.id
        if (user.pivot) {
            $formParticipante.cantidad_meses = user.pivot.cantidad_meses
            $formParticipante.cantidad_horas = user.pivot.cantidad_horas
            $formParticipante.rol_sennova = { value: user.pivot.rol_sennova, label: roles.find((item) => item.value == user.pivot.rol_sennova)?.label }
        }
    }

    function submitParticipante() {
        if (proyecto.allowed.to_update) {
            $formParticipante.post(
                route('convocatorias.proyectos.participantes.users.link', {
                    proyecto: proyecto.id,
                    convocatoria: convocatoria.id,
                }),
                {
                    onSuccess: () => {
                        closeDialog()
                    },

                    preserveScroll: true,
                },
            )
        }
    }

    /**
     * Registrar nuevo participante
     */
    let formNuevoParticipante = useForm({
        nombre: '',
        email: '',
        tipo_documento: '',
        numero_documento: '',
        numero_celular: '',
        tipo_vinculacion: '',
        cantidad_meses: 0,
        cantidad_horas: 0,
        centro_formacion_id: null,
        rol_sennova: null,
        autorizacion_datos: false,
    })

    let formNuevoParticipanteId
    let openNuevoParticipanteDialog = false
    function showRegister() {
        reset()
        openNuevoParticipanteDialog = true
        formNuevoParticipanteId = 'nuevo-participante-form'
    }

    function submitRegister() {
        if (proyecto.allowed.to_update) {
            $formNuevoParticipante.post(route('convocatorias.proyectos.participantes.users.register', { convocatoria: convocatoria.id, proyecto: proyecto.id }), {
                onSuccess: () => {
                    closeDialog()
                },

                preserveScroll: true,
            })
        }
    }

    function reset() {
        //Participante - form
        $formParticipante.reset()
        //Nuevo participante - form
        $formNuevoParticipante.reset()
    }

    function closeDialog() {
        reset()
        dialogOpen = false
        openNuevoParticipanteDialog = false
    }

    let nuevoAutorPrinciaplId = null
    let dialogAutorPrincipal = false

    function showNuevoAutor(participante) {
        dialogAutorPrincipal = true
        nuevoAutorPrinciaplId = participante.id
    }

    let confirmarAutor = false
    function submitNuevoAutorPrincipal() {
        if (proyecto.allowed.to_update) {
            confirmarAutor = true
            Inertia.post(route('convocatorias.proyectos.participantes.nuevo-autor-principal', [convocatoria.id, proyecto.id, nuevoAutorPrinciaplId]), [], {
                onSuccess: () => {
                    dialogAutorPrincipal = false
                    confirmarAutor = false
                },

                preserveScroll: true,
            })
        }
    }
</script>

<div class="bg-app-100 p-4">
    <h1 class="text-4xl text-center">Participantes</h1>

    {#if proyecto.codigo_linea_programatica == 66 || proyecto.codigo_linea_programatica == 82 || proyecto.codigo_linea_programatica == 23}
        <h1 class="mt-24 mb-8 text-center text-3xl font-black">Reglas</h1>
        <div class="bg-white rounded shadow mb-20">
            <table class="w-full whitespace-no-wrap table-fixed data-table">
                <tbody>
                    <tr class="hover:bg-gray-100 focus-within:bg-gray-100">
                        <td class="border-t p-4"> Debe relacionar mínimo 2 aprendices con el rol de "Aprendiz en semillero de investigación" </td>
                    </tr>

                    <tr class="hover:bg-gray-100 focus-within:bg-gray-100">
                        <td class="border-t p-4"> Debe relacionar mínimo 1 instructor con el rol de “Instructor investigador” </td>
                    </tr>
                </tbody>
            </table>
        </div>
    {/if}

    <p class="text-center m-auto mt-8">Realice la búsqueda de participantes por nombre, número de documento o por el correo electrónico institucional</p>
    <form on:submit|preventDefault={submit} on:input={() => (sended = false)}>
        <fieldset disabled={proyecto.allowed.to_update ? undefined : true}>
            <div class="mt-4 flex flex-row">
                <Input label="Escriba el nombre, número de documento o el correo electrónico instiucional" id="search_participante" type="search" class="mt-1 m-auto block flex-1" bind:value={$form.search_participante} input$minLength="4" autocomplete="off" required />
                <LoadingButton loading={$form.processing} class="m-auto ml-1" type="submit">Buscar</LoadingButton>
            </div>
        </fieldset>
    </form>

    {#if sended}
        <h1 class="mt-24 mb-8 text-center text-3xl">Resultados de la búsqueda de participantes</h1>
        <InfoMessage message="Una vez arroje los resultados de clic en los tres puntos y seleccione la opción <strong>Vincular</strong>" />
        <div class="bg-white rounded shadow">
            <table class="w-full whitespace-no-wrap table-fixed data-table">
                <thead>
                    <tr class="text-left font-bold">
                        <th class="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full">Nombre</th>
                        <th class="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full">Correo electrónico</th>
                        <th class="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full">Centro de formación</th>
                        <th class="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full">Regional</th>
                        <th class="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl text-center th-actions">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {#each resultados as resultado (resultado.id)}
                        <tr class="hover:bg-gray-100 focus-within:bg-gray-100">
                            <td class="border-t">
                                <p class="px-6 py-4 focus:text-app-500">
                                    {resultado.nombre}
                                </p>
                            </td>
                            <td class="border-t">
                                <p class="px-6 py-4">
                                    {resultado.email}
                                </p>
                            </td>
                            <td class="border-t">
                                <p class="px-6 py-4">
                                    {resultado.centro_formacion ? resultado.centro_formacion.nombre : ''}
                                </p>
                            </td>
                            <td class="border-t">
                                <p class="px-6 py-4">
                                    {resultado.centro_formacion ? resultado.centro_formacion.regional.nombre : ''}
                                </p>
                            </td>
                            <td class="border-t td-actions">
                                <DataTableMenu class={resultados.length < 3 ? 'z-50' : ''}>
                                    <Item on:SMUI:action={() => showParticipante(resultado, 'POST')}>
                                        <Text>Vincular</Text>
                                    </Item>
                                </DataTableMenu>
                            </td>
                        </tr>
                    {/each}

                    {#if resultados.length === 0}
                        <tr>
                            <td class="border-t px-6 py-4" colspan="5">
                                {$_('No data recorded')}
                                <Button on:click={() => showRegister()} type="button" variant={null}>Crear participante</Button>
                            </td>
                        </tr>
                    {/if}
                </tbody>
            </table>
        </div>
    {/if}
</div>

<h1 class="mt-24 mb-8 text-center text-3xl">Participantes vinculados</h1>
<div class="bg-white rounded shadow">
    <table class="w-full whitespace-no-wrap table-fixed data-table">
        <thead>
            <tr class="text-left font-bold">
                <th class="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full">Nombre</th>
                <th class="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full">Correo electrónico</th>
                <th class="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full">Centro de formación</th>
                <th class="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full">Regional</th>
                <th class="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full">Participación</th>
                <th class="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl text-center th-actions">Acciones</th>
            </tr>
        </thead>
        <tbody>
            {#each proyecto.participantes as participante (participante.id)}
                <tr class="hover:bg-gray-100 focus-within:bg-gray-100">
                    <td class="border-t">
                        <p class="px-6 py-4 focus:text-app-500">
                            {participante.nombre}
                            {#if participante.id == autorPrincipal?.id}
                                <span class="inline-block text-xs bg-green-100 py-1 px-4 rounded-full shadow">Autor(a) principal</span>
                            {/if}
                        </p>
                    </td>
                    <td class="border-t">
                        <p class="px-6 py-4">
                            {participante.email}
                        </p>
                    </td>
                    <td class="border-t">
                        <p class="px-6 py-4">
                            {participante.centro_formacion ? participante.centro_formacion.nombre : ''}
                        </p>
                    </td>
                    <td class="border-t">
                        <p class="px-6 py-4">
                            {participante.centro_formacion ? participante.centro_formacion.regional.nombre : ''}
                        </p>
                    </td>
                    <td class="border-t">
                        <p class="px-6 py-4">
                            {participante.pivot.cantidad_meses.replace('.', ',')} meses - {participante.pivot.cantidad_horas} horas semanales
                        </p>
                    </td>
                    <td class="border-t td-actions">
                        <DataTableMenu class={proyecto.participantes.length < 3 ? 'z-50' : ''}>
                            <Item on:SMUI:action={() => showParticipante(participante, 'PUT')} disabled={!proyecto.allowed.to_update} class={!proyecto.allowed.to_update ? 'hidden' : ''}>
                                <Text>Editar</Text>
                            </Item>
                            <Item on:SMUI:action={() => showNuevoAutor(participante)} disabled={!proyecto.allowed.to_update} class={!proyecto.allowed.to_update ? 'hidden' : ''}>
                                <Text>Convertir en autor principal</Text>
                            </Item>
                            <Separator class={!proyecto.allowed.to_update ? 'hidden' : ''} />
                            <Item on:SMUI:action={() => removeParticipante(participante.id)} disabled={(!proyecto.allowed.to_update && authUser.id != participante.id) || (!proyecto.allowed.to_update && !participante.formulador)} class={(!proyecto.allowed.to_update && authUser.id != participante.id) || (!proyecto.allowed.to_update && !participante.formulador) ? 'hidden' : ''}>
                                <Text>Quitar</Text>
                            </Item>
                        </DataTableMenu>
                    </td>
                </tr>
            {/each}

            {#if proyecto.participantes.length === 0}
                <tr>
                    <td class="border-t px-6 py-4" colspan="6">{$_('No data recorded')}</td>
                </tr>
            {/if}
        </tbody>
    </table>
</div>

<!-- Dialog -->
<Dialog bind:open={dialogOpen} id="participante" height="450">
    <div slot="title">
        <div class="mb-10 text-center">
            <div class="text-primary">
                {#if $formParticipante._method != null}
                    Editar información del participante: {dialogTitle}
                {:else}
                    Vincular participante: {dialogTitle}
                {/if}
            </div>
        </div>
    </div>
    <div slot="content">
        <form on:submit|preventDefault={submitParticipante} id="participante-form">
            <fieldset disabled={proyecto.allowed.to_update ? undefined : true}>
                <p class="block font-medium mb-10 text-gray-700 text-sm">Por favor diligencie la siguiente información sobre la vinculación del participante.</p>
                <div class="mt-8">
                    <Label required class="mb-4" labelFor="rol_sennova" value="Rol SENNOVA" />
                    <Select id="rol_sennova" items={roles} bind:selectedValue={$formParticipante.rol_sennova} error={errors.rol_sennova} autocomplete="off" placeholder="Seleccione un rol SENNOVA" required />
                </div>

                <div class="mt-8">
                    <Input label="Número de meses de vinculación al proyecto" id="cantidad_meses" type="number" input$step="0.1" input$min="1" input$max={proyecto.diff_meses} class="mt-1" bind:value={$formParticipante.cantidad_meses} placeholder="Número de meses de vinculación" autocomplete="off" error={errors.cantidad_meses} required />
                    <InfoMessage class="pl-4">
                        <small>
                            El proyecto se ejecutará entre {proyecto.fecha_inicio} y {proyecto.fecha_finalizacion}, por lo tanto el número de meses máximo es: {proyecto.diff_meses}
                            <br />
                            <span class="flex">
                                Uitlice las flechas <span class="flex flex-col relative top-[-0.4rem]">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
                                    </svg>

                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                                    </svg>
                                </span> que aparecen dentro del campo para ajustar los decimales.
                            </span>
                        </small>
                    </InfoMessage>
                </div>

                <div class="mt-8">
                    <Input label="Número de horas semanales dedicadas para el desarrollo del proyecto" id="cantidad_horas" type="number" input$step="1" input$min="1" input$max={$formParticipante.rol_sennova?.maxHoras} class="mt-1" bind:value={$formParticipante.cantidad_horas} placeholder="Número de horas semanales dedicadas para el desarrollo del proyecto" autocomplete="off" required />
                </div>
            </fieldset>
        </form>
    </div>

    <div slot="actions" class="flex w-full">
        <Button on:click={closeDialog} type="button" variant={null}>
            {$_('Cancel')}
        </Button>
        <LoadingButton loading={$formParticipante.processing} class="ml-auto" type="submit" form={formID}>
            {$_('Save')}
        </LoadingButton>
    </div>
</Dialog>

<!-- Dialog Register -->
<Dialog bind:open={openNuevoParticipanteDialog} id="nuevo-participante">
    <div slot="title">
        <div class="mb-10 text-center">
            <div class="text-primary">Registar nuevo participante</div>
        </div>
    </div>
    <div slot="content">
        <form on:submit|preventDefault={submitRegister} id={formNuevoParticipanteId}>
            <fieldset disabled={proyecto.allowed.to_update ? undefined : true}>
                <div class="mt-8">
                    <Input label="Nombre completo" id="nombre_nuevo_participante" type="text" class="mt-1" bind:value={$formNuevoParticipante.nombre} error={errors.nombre} required />
                </div>

                <div class="mt-8">
                    <Input label="Correo electrónico institucional" id="email_nuevo_participante" type="email" class="mt-1" bind:value={$formNuevoParticipante.email} error={errors.email} required />
                </div>

                <div class="mt-8">
                    <Label required class="mb-4" labelFor="tipo_documento_nuevo_participante" value="Tipo de documento" />
                    <Select id="tipo_documento_nuevo_participante" items={tiposDocumento} bind:selectedValue={$formNuevoParticipante.tipo_documento} error={errors.tipo_documento} autocomplete="off" placeholder="Seleccione un tipo de documento" required />
                </div>

                <div class="mt-8">
                    <Input label="Número de documento" id="numero_documento_nuevo_participante" type="number" input$min="55555" input$max="9999999999999" class="mt-1" bind:value={$formNuevoParticipante.numero_documento} error={errors.numero_documento} required />
                </div>

                <div class="mt-8">
                    <Input label="Número de celular" id="numero_celular_nuevo_participante" type="number" input$min="3000000000" input$max="9999999999" class="mt-1" bind:value={$formNuevoParticipante.numero_celular} error={errors.numero_celular} required />
                </div>

                <div class="mt-8">
                    <Label required class="mb-4" labelFor="centro_formacion_id_nuevo_participante" value="Centro de formación" />
                    <Select id="centro_formacion_id_nuevo_participante" items={centrosFormacion} bind:selectedValue={$formNuevoParticipante.centro_formacion_id} error={errors.centro_formacion_id} autocomplete="off" placeholder="Busque por el nombre del centro de formación" required />
                </div>

                <div class="mt-8">
                    <Label required class="mb-4" labelFor="tipo_vinculacion_nuevo_participante" value="Tipo de vinculación" />
                    <Select id="tipo_vinculacion_nuevo_participante" items={tiposVinculacion} bind:selectedValue={$formNuevoParticipante.tipo_vinculacion} error={errors.tipo_vinculacion} autocomplete="off" placeholder="Seleccione el tipo de vinculación" required />
                </div>

                <p class="block font-medium mt-10 mb-10 text-gray-700 text-sm">Por favor diligencie la siguiente información sobre la vinculación del participante.</p>
                <div class="mt-8">
                    <Label required class="mb-4" labelFor="rol_sennova" value="Rol SENNOVA" />
                    <Select id="rol_sennova" items={roles} bind:selectedValue={$formNuevoParticipante.rol_sennova} error={errors.rol_sennova} autocomplete="off" placeholder="Seleccione un rol SENNOVA" required />
                </div>

                <div class="mt-8">
                    <Input label="Número de meses de vinculación al proyecto" id="cantidad_meses_nuevo_participante" type="number" input$step="0.1" input$min="1" input$max={proyecto.diff_meses} class="mt-1" bind:value={$formNuevoParticipante.cantidad_meses} placeholder="Número de meses de vinculación" autocomplete="off" error={errors.cantidad_meses} required />

                    <InfoMessage>
                        <small>
                            El proyecto se ejecutará entre {proyecto.fecha_inicio} y {proyecto.fecha_finalizacion}, por lo tanto el número de meses máximo es: {proyecto.diff_meses}
                            <br />
                            <span class="flex">
                                Uitlice las flechas <span class="flex flex-col relative top-[-0.4rem]">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
                                    </svg>

                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                                    </svg>
                                </span> que aparecen dentro del campo para ajustar los decimales.
                            </span>
                        </small>
                    </InfoMessage>
                </div>

                <div class="mt-8">
                    <Input
                        label="Número de horas semanales dedicadas para el desarrollo del proyecto"
                        id="cantidad_horas_nuevo_participante"
                        type="number"
                        input$step="1"
                        input$min="1"
                        input$max={$formNuevoParticipante.rol_sennova?.maxHoras}
                        class="mt-1"
                        bind:value={$formNuevoParticipante.cantidad_horas}
                        placeholder="Número de horas semanales dedicadas para el desarrollo del proyecto"
                        autocomplete="off"
                        required
                    />
                </div>

                <div class="mt-8">
                    <InfoMessage message="Los datos proporcionados serán tratados de acuerdo con la política de tratamiento de datos personales del SENA y a la ley 1581 de 2012 (acuerdo No. 0009 del 2016" />
                    <FormField>
                        <Checkbox bind:checked={$formNuevoParticipante.autorizacion_datos} />
                        <span slot="label">¿La persona autoriza el tratamiento de datos personales?. <a href="https://www.sena.edu.co/es-co/transparencia/Documents/proteccion_datos_personales_sena_2016.pdf" target="_blank" class="text-app-500">Leer acuerdo No. 0009 del 2016</a></span>
                    </FormField>
                </div>
            </fieldset>
        </form>
    </div>

    <div slot="actions" class="flex w-full">
        <Button on:click={closeDialog} type="button" variant={null}>
            {$_('Cancel')}
        </Button>
        <LoadingButton loading={$formNuevoParticipante.processing} class="ml-auto" type="submit" form={formNuevoParticipanteId}>
            {$_('Save')}
        </LoadingButton>
    </div>
</Dialog>

<Dialog bind:open={dialogAutorPrincipal}>
    <div slot="title" class="flex items-center">Cambiar de autor principal</div>
    <div slot="content">
        <p>
            ¿Está seguro(a) que desea convertir a este usuario en autor principal?
            <br />
            Solo debe haber un autor principal por proyecto y será el único que podrá modificar la información.
        </p>
    </div>
    <div slot="actions">
        <div class="p-4">
            <Button on:click={() => (dialogAutorPrincipal = false)} variant={null}>Cancelar</Button>
            <LoadingButton loading={confirmarAutor} type="submit" on:click={submitNuevoAutorPrincipal}>Confirmar</LoadingButton>
        </div>
    </div>
</Dialog>

<style>
    :global(#nuevo-participante-dialog .mdc-dialog__surface) {
        max-width: 1050px;
    }

    :global(#participante-dialog .mdc-dialog__surface) {
        max-width: 1050px;
    }
</style>
