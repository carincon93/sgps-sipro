<script>
    import { Inertia } from '@inertiajs/inertia'
    import { useForm, page } from '@inertiajs/inertia-svelte'
    import { route, checkRole, checkPermission } from '@/Utils'
    import { _ } from 'svelte-i18n'
    import axios from 'axios'

    import Input from '@/Shared/Input'
    import LoadingButton from '@/Shared/LoadingButton'
    import DataTableMenu from '@/Shared/DataTableMenu'
    import InfoMessage from '@/Shared/InfoMessage'
    import { Item, Text, Separator } from '@smui/list'

    export let convocatoria
    export let proyecto

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
        search_programa_formacion: '',
    })

    let sended = false
    function submit() {
        if (proyecto.allowed.to_update) {
            sended = console.log('here')
            try {
                axios
                    .post(route('convocatorias.proyectos.participantes.programas-formacion', { convocatoria: convocatoria.id, proyecto: proyecto.id }), $form)
                    .then((response) => {
                        resultados = response.data
                        sended = true
                    })
                    .catch((error) => {})
            } catch (error) {}
        }
    }

    function linkProgramaFormacion(id) {
        if (proyecto.allowed.to_update) {
            Inertia.post(
                route('convocatorias.proyectos.participantes.programas-formacion.link', {
                    proyecto: proyecto.id,
                    convocatoria: convocatoria.id,
                }),
                { programa_formacion_id: id },
                { preserveScroll: true },
            )
        }
    }

    function removeProgramaFormacion(id) {
        if (proyecto.allowed.to_update) {
            Inertia.post(
                route('convocatorias.proyectos.participantes.programas-formacion.unlink', {
                    proyecto: proyecto.id,
                    convocatoria: convocatoria.id,
                }),
                { programa_formacion_id: id, _method: 'DELETE' },
                { preserveScroll: true },
            )
        }
    }
</script>

<div class="bg-app-100 p-4">
    <h1 class="text-4xl text-center title">Programas de formación</h1>
    <p class="text-center w-1/3 m-auto mt-8">Realice la búsqueda de programas de formación</p>

    <form on:submit|preventDefault={submit} on:input={() => (sended = false)}>
        <fieldset disabled={proyecto.allowed.to_update ? undefined : true}>
            <div class="mt-4 flex flex-row">
                <Input label="Escriba el ID o el nombre completo del programa de formación" id="search_programa_formacion" type="search" class="mt-1 m-auto block flex-1" bind:value={$form.search_programa_formacion} input$minLength="4" autocomplete="off" required />
                <LoadingButton loading={$form.processing} class="m-auto ml-1" type="submit">Buscar</LoadingButton>
            </div>
        </fieldset>
    </form>

    {#if sended}
        <h1 class="mt-24 mb-8 text-center text-3xl">Resultados de la búsqueda de programas de formación</h1>
        <InfoMessage message="Una vez arroje los resultados de clic en los tres puntos y seleccione la opción <strong>Vincular</strong>" />
        <div class="bg-white rounded shadow">
            <table class="w-full whitespace-no-wrap table-fixed data-table">
                <thead>
                    <tr class="text-left font-bold">
                        <th class="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full">Código</th>
                        <th class="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full">Nombre</th>
                        <th class="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full">Tipo</th>
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
                                    {resultado.codigo}
                                </p>
                            </td>
                            <td class="border-t">
                                <p class="px-6 py-4">
                                    {resultado.nombre}
                                </p>
                            </td>
                            <td class="border-t">
                                <p class="px-6 py-4">
                                    {resultado.modalidad}
                                </p>
                            </td>
                            <td class="border-t">
                                <p class="px-6 py-4">
                                    {resultado.centro_formacion.nombre}
                                </p>
                            </td>
                            <td class="border-t">
                                <p class="px-6 py-4">
                                    {resultado.centro_formacion.regional.nombre}
                                </p>
                            </td>
                            <td class="border-t td-actions">
                                <DataTableMenu class={resultados.length < 3 ? 'z-50' : ''}>
                                    <Item on:SMUI:action={() => linkProgramaFormacion(resultado.id)} disabled={!proyecto.allowed.to_update} class={!proyecto.allowed.to_update ? 'hidden' : ''}>
                                        <Text>Vincular</Text>
                                    </Item>
                                </DataTableMenu>
                            </td>
                        </tr>
                    {/each}

                    {#if resultados.length === 0}
                        <tr>
                            <td class="border-t px-6 py-4" colspan="6">{$_('No data recorded')}</td>
                        </tr>
                    {/if}
                </tbody>
            </table>
        </div>
    {/if}
</div>

<h1 class="mt-24 mb-8 text-center text-3xl">Programas de formación vinculados</h1>
<div class="bg-white rounded shadow">
    <table class="w-full whitespace-no-wrap table-fixed data-table">
        <thead>
            <tr class="text-left font-bold">
                <th class="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full">Código</th>
                <th class="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full">Nombre</th>
                <th class="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full">Tipo</th>
                <th class="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full">Centro de formación</th>
                <th class="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full">Regional</th>
                <th class="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl text-center th-actions">Acciones</th>
            </tr>
        </thead>
        <tbody>
            {#each proyecto.programasFormacion as programaFormacion (programaFormacion.id)}
                <tr class="hover:bg-gray-100 focus-within:bg-gray-100">
                    <td class="border-t">
                        <p class="px-6 py-4 focus:text-app-500">
                            {programaFormacion.codigo}
                        </p>
                    </td>
                    <td class="border-t">
                        <p class="px-6 py-4">
                            {programaFormacion.nombre}
                        </p>
                    </td>
                    <td class="border-t">
                        <p class="px-6 py-4">
                            {programaFormacion.modalidad}
                        </p>
                    </td>
                    <td class="border-t">
                        <p class="px-6 py-4">
                            {programaFormacion.centro_formacion.nombre}
                        </p>
                    </td>
                    <td class="border-t">
                        <p class="px-6 py-4">
                            {programaFormacion.centro_formacion.regional.nombre}
                        </p>
                    </td>
                    <td class="border-t td-actions">
                        <DataTableMenu class={proyecto.programasFormacion.length < 3 ? 'z-50' : ''}>
                            <Item on:SMUI:action={() => removeProgramaFormacion(programaFormacion.id)}>
                                <Text>Quitar</Text>
                            </Item>
                        </DataTableMenu>
                    </td>
                </tr>
            {/each}

            {#if proyecto.programasFormacion.length === 0}
                <tr>
                    <td class="border-t px-6 py-4" colspan="6">{$_('No data recorded')}</td>
                </tr>
            {/if}
        </tbody>
    </table>
</div>
