<script>
    import AuthenticatedLayout, { title } from '@/Layouts/Authenticated'
    import { Inertia } from '@inertiajs/inertia'
    import { useForm, page, inertia } from '@inertiajs/inertia-svelte'
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
    export let proyectoIdiTecnoacademia
    export let tiposDocumento
    export let tiposVinculacion
    export let roles
    export let autorPrincipal
    export let centrosFormacion

    let resultados = []

    $: $title = 'Participantes'

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
    function search() {
        if (isSuperAdmin || checkRole(authUser, [5, 10, 12, 22])) {
            sended = false
            axios
                .post(route('proyectos-idi-tecnoacademia.participantes.users', proyectoIdiTecnoacademia.id), $form)
                .then((response) => {
                    resultados = response.data
                    sended = true
                })
                .catch((error) => {})
        }
    }

    function removeParticipante(id) {
        if (isSuperAdmin || checkRole(authUser, [5, 10, 12, 22])) {
            Inertia.post(route('proyectos-idi-tecnoacademia.participantes.users.unlink', proyectoIdiTecnoacademia.id), { user_id: id, _method: 'DELETE' }, { preserveScroll: true })
        }
    }

    /**
     * Participantes
     */
    let formParticipante = useForm({
        _method: null,
        user_id: 0,
        cantidad_horas: 0,
        cantidad_meses: 0,
        rol_sennova: null,
    })

    function showParticipante(user) {
        reset()
        dialogTitle = user.nombre
        dialogOpen = true
        formID = 'participante-form'
        $formParticipante.user_id = user.id
        if (user.pivot) {
            $formParticipante._method = 'PUT'
            $formParticipante.cantidad_meses = user.pivot.cantidad_meses
            $formParticipante.cantidad_horas = user.pivot.cantidad_horas
            $formParticipante.rol_sennova = user.pivot.rol_sennova
        }
    }

    function submitParticipante() {
        if (isSuperAdmin || checkRole(authUser, [5, 10, 12, 22])) {
            $formParticipante.post(route('proyectos-idi-tecnoacademia.participantes.users.link', proyectoIdiTecnoacademia.id), {
                onSuccess: () => {
                    closeDialog()
                },

                preserveScroll: true,
            })
        }
    }

    /**
     * Registrar nuevo participante
     */
    let formNuevoIntegrante = useForm({
        nombre: '',
        email: '',
        tipo_documento: '',
        numero_documento: '',
        numero_celular: '',
        tipo_vinculacion: '',
        rol_sennova: null,
        cantidad_meses: 0,
        cantidad_horas: 0,
        centro_formacion_id: null,
        autorizacion_datos: false,
    })

    let formNuevoIntegranteId
    let openNuevoParticipanteDialog = false
    function showRegister() {
        reset()
        openNuevoParticipanteDialog = true
        formNuevoIntegranteId = 'nuevo-participante-form'
    }

    function submitRegister() {
        if (isSuperAdmin || checkRole(authUser, [5, 10, 12, 22])) {
            $formNuevoIntegrante.post(route('proyectos-idi-tecnoacademia.participantes.users.register', proyectoIdiTecnoacademia.id), {
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
        $formNuevoIntegrante.reset()
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

    let sending = false
    function submitNuevoAutorPrincipal() {
        if (isSuperAdmin || authUser.id == autorPrincipal.id) {
            Inertia.post(route('proyectos-idi-tecnoacademia.nuevo-autor-principal', [proyectoIdiTecnoacademia.id, nuevoAutorPrinciaplId]), [], {
                onStart: () => {
                    sending = true
                },
                onSuccess: () => {
                    dialogAutorPrincipal = false
                },
                onFinish: () => {
                    sending = false
                },
                preserveScroll: true,
            })
        }
    }

    console.log(proyectoIdiTecnoacademia.allowed.to_update)
</script>

<AuthenticatedLayout>
    <header class="pt-[8rem]" slot="header">
        <div class="flex items-center justify-between lg:px-8 max-w-7xl mx-auto px-4 py-6 sm:px-6">
            <div>
                <h1>
                    <a use:inertia href={route('proyectos-idi-tecnoacademia.index')} class="text-app-400 hover:text-app-600"> Proyectos I+D+i TecnoAcademia </a>
                    <span class="text-app-400 font-medium">/</span>
                    <a use:inertia href={route('proyectos-idi-tecnoacademia.edit', proyectoIdiTecnoacademia.id)} class="text-app-400 hover:text-app-600">Información básica</a>
                    <span class="text-app-400 font-medium">/</span>
                    <a use:inertia href={route('proyectos-idi-tecnoacademia.participantes.index', proyectoIdiTecnoacademia.id)} class="text-app-400 hover:text-app-600 font-extrabold underline">Participantes</a>
                    <span class="text-app-400 font-medium">/</span>
                    <a use:inertia href={route('proyectos-idi-tecnoacademia.productos.index', proyectoIdiTecnoacademia.id)} class="text-app-400 hover:text-app-600">Productos</a>
                </h1>
            </div>
        </div>
    </header>

    <a use:inertia href={route('proyectos-idi-tecnoacademia.productos.index', proyectoIdiTecnoacademia.id)} class="flex bottom-0 fixed hover:bg-app-600 mb-4 px-6 py-2 bg-app-700 rounded-lg shadow-2xl text-center text-white z-50">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
        Ir a los productos
    </a>

    <div class="bg-app-100 p-4">
        <h1 class="text-4xl text-center">Participantes</h1>
        <p class="text-center m-auto mt-8">Realice la búsqueda de participantes por nombre, número de documento o por el correo electrónico institucional</p>
        <form on:submit|preventDefault={search} on:input={() => (sended = false)}>
            <fieldset>
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
                                        <Item on:SMUI:action={() => showParticipante(resultado)}>
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
                    <th class="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full">Centro de formación / Regional</th>
                    <th class="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full">Rol SENNOVA</th>
                    <th class="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl text-center th-actions">Acciones</th>
                </tr>
            </thead>
            <tbody>
                {#each proyectoIdiTecnoacademia.participantes as participante (participante.id)}
                    <tr class="hover:bg-gray-100 focus-within:bg-gray-100">
                        <td class="border-t">
                            <p class="px-6 py-4 focus:text-app-500">
                                {participante.nombre}
                                {#if participante.id == autorPrincipal.id}
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
                                {participante.centro_formacion ? participante.centro_formacion.nombre : ''} / {participante.centro_formacion ? participante.centro_formacion.regional.nombre : ''}
                            </p>
                        </td>
                        <td class="border-t">
                            <p class="px-6 py-4">
                                {#if participante.pivot.rol_sennova == 1}
                                    Facilitador tecnoacademia
                                {:else if participante.pivot.rol_sennova == 2}
                                    Infocenter tecnoparque
                                {:else if participante.pivot.rol_sennova == 3}
                                    Dinamizador tecnoacademia
                                {:else if participante.pivot.rol_sennova == 4}
                                    Psicopedagogo tecnoacademia
                                {/if}
                            </p>
                        </td>
                        <td class="border-t td-actions">
                            <DataTableMenu class={proyectoIdiTecnoacademia.participantes.length < 3 ? 'z-50' : ''}>
                                <Item on:SMUI:action={() => showParticipante(participante)} disabled={!proyectoIdiTecnoacademia.allowed.to_update} class={proyectoIdiTecnoacademia.allowed.to_update ? '' : 'hidden'}>
                                    <Text>Editar</Text>
                                </Item>
                                <Item on:SMUI:action={() => showNuevoAutor(participante)} disabled={!proyectoIdiTecnoacademia.allowed.to_update} class={proyectoIdiTecnoacademia.allowed.to_update ? '' : 'hidden'}>
                                    <Text>Convertir en autor principal</Text>
                                </Item>
                                <Separator class={!isSuperAdmin || authUser.id == participante.pivot.user_id ? 'hidden' : ''} />
                                <Item on:SMUI:action={() => removeParticipante(participante.id)} disabled={!isSuperAdmin || authUser.id == participante.pivot.user_id} class={!isSuperAdmin || authUser.id == participante.pivot.user_id ? 'hidden' : ''}>
                                    <Text>Quitar</Text>
                                </Item>
                            </DataTableMenu>
                        </td>
                    </tr>
                {/each}

                {#if proyectoIdiTecnoacademia.participantes.length === 0}
                    <tr>
                        <td class="border-t px-6 py-4" colspan="6">{$_('No data recorded')}</td>
                    </tr>
                {/if}
            </tbody>
        </table>
    </div>

    <!-- Dialog -->
    <Dialog bind:open={dialogOpen} id="participante">
        <div slot="title">
            <div class="mb-10 text-center">
                <div class="text-primary">
                    {#if $formParticipante._method != null}
                        Editar vinculación del participante: {dialogTitle}
                    {:else}
                        Vincular participante: {dialogTitle}
                    {/if}
                </div>
            </div>
        </div>
        <div slot="content">
            <form on:submit|preventDefault={submitParticipante} id="participante-form">
                <fieldset disabled={isSuperAdmin || checkRole(authUser, [5, 10, 12, 22]) ? undefined : true}>
                    <div class="mt-8">
                        <Label required class="mb-4" labelFor="rol_sennova" value="Rol SENNOVA" />
                        <Select id="rol_sennova" items={roles} bind:selectedValue={$formParticipante.rol_sennova} error={errors.rol_sennova} autocomplete="off" placeholder="Seleccione un rol SENNOVA" required />
                    </div>
                    <div class="mt-8">
                        <Input label="Número de meses de vinculación al proyecto" id="cantidad_meses" type="number" input$step="0.1" input$min="1" input$max="11.5" class="mt-1" bind:value={$formParticipante.cantidad_meses} placeholder="Número de meses de vinculación" autocomplete="off" required />
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
            <LoadingButton loading={$formParticipante.processing} class="ml-auto" type="submit" form={formID}>Vincular</LoadingButton>
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
            <form on:submit|preventDefault={submitRegister} id={formNuevoIntegranteId}>
                <fieldset>
                    <div class="mt-8">
                        <Input label="Nombre completo" id="nombre_nuevo_participante" type="text" class="mt-1" bind:value={$formNuevoIntegrante.nombre} error={errors.nombre} required />
                    </div>

                    <div class="mt-8">
                        <Input label="Correo electrónico institucional" id="email_nuevo_participante" type="email" class="mt-1" bind:value={$formNuevoIntegrante.email} error={errors.email} required />
                    </div>

                    <div class="mt-8">
                        <Label required class="mb-4" labelFor="tipo_documento_nuevo_participante" value="Tipo de documento" />
                        <Select id="tipo_documento_nuevo_participante" items={tiposDocumento} bind:selectedValue={$formNuevoIntegrante.tipo_documento} error={errors.tipo_documento} autocomplete="off" placeholder="Seleccione un tipo de documento" required />
                    </div>

                    <div class="mt-8">
                        <Input label="Número de documento" id="numero_documento_nuevo_participante" type="number" input$min="55555" input$max="9999999999999" class="mt-1" bind:value={$formNuevoIntegrante.numero_documento} error={errors.numero_documento} required />
                    </div>

                    <div class="mt-8">
                        <Input label="Número de celular" id="numero_celular_nuevo_participante" type="number" input$min="3000000000" input$max="9999999999" class="mt-1" bind:value={$formNuevoIntegrante.numero_celular} error={errors.numero_celular} required />
                    </div>

                    <div class="mt-8">
                        <Label required class="mb-4" labelFor="centro_formacion_id_nuevo_participante" value="Centro de formación" />
                        <Select id="centro_formacion_id_nuevo_participante" items={centrosFormacion} bind:selectedValue={$form.centro_formacion_id_nuevo_participante} error={errors.centro_formacion_id_nuevo_participante} autocomplete="off" placeholder="Busque por el nombre del centro de formación" required />
                    </div>

                    <div class="mt-8">
                        <Label required class="mb-4" labelFor="tipo_vinculacion_nuevo_participante" value="Tipo de vinculación" />
                        <Select id="tipo_vinculacion_nuevo_participante" items={tiposVinculacion} bind:selectedValue={$formNuevoIntegrante.tipo_vinculacion} error={errors.tipo_vinculacion} autocomplete="off" placeholder="Seleccione el tipo de vinculación" required />
                    </div>

                    <div class="mt-8">
                        <Label required class="mb-4" labelFor="rol_sennova" value="Rol SENNOVA" />
                        <Select id="rol_sennova" items={roles} bind:selectedValue={$formNuevoIntegrante.rol_sennova} error={errors.rol_sennova} autocomplete="off" placeholder="Seleccione un rol SENNOVA" required />
                    </div>

                    <div class="mt-8">
                        <Input label="Número de meses de vinculación al proyecto" id="cantidad_meses_nuevo_participante" type="number" input$step="0.1" input$min="1" input$max="11.5" class="mt-1" bind:value={$formNuevoIntegrante.cantidad_meses} placeholder="Número de meses de vinculación" autocomplete="off" error={errors.cantidad_meses} required />
                    </div>

                    <div class="mt-8">
                        <Input
                            label="Número de horas semanales dedicadas para el desarrollo del proyecto"
                            id="cantidad_horas_nuevo_participante"
                            type="number"
                            input$step="1"
                            input$min="1"
                            input$max={$formNuevoIntegrante.rol_sennova?.maxHoras}
                            class="mt-1"
                            bind:value={$formNuevoIntegrante.cantidad_horas}
                            placeholder="Número de horas semanales dedicadas para el desarrollo del proyecto"
                            autocomplete="off"
                            required
                        />
                    </div>

                    <div class="mt-8">
                        <InfoMessage message="Los datos proporcionados serán tratados de acuerdo con la política de tratamiento de datos personales del SENA y a la ley 1581 de 2012 (acuerdo No. 0009 del 2016" />
                        <FormField>
                            <Checkbox bind:checked={$formNuevoIntegrante.autorizacion_datos} />
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
            <LoadingButton loading={$formNuevoIntegrante.processing} class="ml-auto" type="submit" form={formNuevoIntegranteId}>
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
                <Button variant="raised" on:click={submitNuevoAutorPrincipal}>Confirmar</Button>
            </div>
        </div>
    </Dialog>
</AuthenticatedLayout>

<style>
    :global(#nuevo-participante-dialog .mdc-dialog__surface) {
        max-width: 1050px;
    }

    :global(#participante-dialog .mdc-dialog__surface) {
        max-width: 1050px;
    }
</style>
