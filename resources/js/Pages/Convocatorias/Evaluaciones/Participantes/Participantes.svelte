<script>
    import { page } from '@inertiajs/inertia-svelte'
    import { checkRole } from '@/Utils'
    import { _ } from 'svelte-i18n'

    import Input from '@/Shared/Input'
    import Label from '@/Shared/Label'
    import Select from '@/Shared/Select'
    import DataTableMenu from '@/Shared/DataTableMenu'
    import { Item, Text } from '@smui/list'
    import Dialog from '@/Shared/Dialog'
    import Button from '@/Shared/Button'
    import InfoMessage from '@/Shared/InfoMessage'

    export let errors
    export let proyecto
    export let roles

    /**
     * Validar si el usuario autenticado es SuperAdmin
     */
    let authUser = $page.props.auth.user
    let isSuperAdmin = checkRole(authUser, [1])

    /**
     * Buscar
     */
    let formID
    let dialogOpen = false
    let dialogTitle

    /**
     * Participantes
     */
    let participanteInfo = {
        _method: null,
        user_id: 0,
        cantidad_horas: 0,
        cantidad_meses: 0,
        rol_sennova: null,
    }

    function showParticipante(user) {
        dialogTitle = user.nombre
        dialogOpen = true
        formID = 'participante-form'
        participanteInfo.user_id = user.id
        if (user.pivot) {
            participanteInfo._method = 'PUT'
            participanteInfo.cantidad_meses = user.pivot.cantidad_meses
            participanteInfo.cantidad_horas = user.pivot.cantidad_horas
            participanteInfo.rol_sennova = user.pivot.rol_sennova
        }
    }

    function closeDialog() {
        dialogOpen = false
    }
</script>

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
                            {#if isSuperAdmin || (checkRole(authUser, [11, 5]) && proyecto.finalizado == true)}
                                <Item on:SMUI:action={() => showParticipante(participante)}>
                                    <Text>Detalles</Text>
                                </Item>
                            {/if}
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
<Dialog bind:open={dialogOpen} id="participante">
    <div slot="title">
        <div class="mb-10 text-center">
            <div class="text-primary">Participante</div>
        </div>
    </div>
    <div slot="content">
        <form id="participante-form">
            <fieldset disabled={true}>
                <p class="block font-medium mb-2 text-gray-700 text-sm">Por favor diligencie la siguiente información sobre la vinculación del participante.</p>
                <div class="mt-4">
                    <Label required class="mb-4" labelFor="rol_sennova" value="Rol SENNOVA" />
                    <Select id="rol_sennova" items={roles} bind:selectedValue={participanteInfo.rol_sennova} error={errors.rol_sennova} autocomplete="off" placeholder="Seleccione un rol SENNOVA" required />
                </div>
                <div class="mt-4">
                    <Input label="Número de meses de vinculación al proyecto" id="cantidad_meses" type="number" input$step="0.1" input$min="1" input$max={proyecto.diff_meses} class="mt-1" bind:value={participanteInfo.cantidad_meses} placeholder="Número de meses de vinculación" autocomplete="off" required />
                    <InfoMessage message="Valor máximo: {proyecto.diff_meses.replace('.', ',')} meses." />
                </div>
                <div class="mt-4">
                    <Input label="Número de horas semanales dedicadas para el desarrollo del proyecto" id="cantidad_horas" type="number" input$step="1" input$min="1" input$max={participanteInfo.rol_sennova?.maxHoras} class="mt-1" bind:value={participanteInfo.cantidad_horas} placeholder="Número de horas semanales dedicadas para el desarrollo del proyecto" autocomplete="off" required />
                </div>
            </fieldset>
        </form>
    </div>

    <div slot="actions" class="flex w-full">
        <Button on:click={closeDialog} type="button" variant={null}>
            {$_('Cancel')}
        </Button>
    </div>
</Dialog>
