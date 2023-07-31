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
        search_semillero_investigacion: '',
    })

    let sended = false
    function submit() {
        if (proyecto.allowed.to_update) {
            sended = false
            try {
                axios
                    .post(route('convocatorias.proyectos.participantes.semilleros-investigacion', { convocatoria: convocatoria.id, proyecto: proyecto.id }), $form)
                    .then((response) => {
                        resultados = response.data
                        sended = true
                    })
                    .catch((error) => {})
            } catch (error) {}
        }
    }

    function linkSemilleroInvestigacion(id) {
        if (proyecto.allowed.to_update) {
            Inertia.post(
                route('convocatorias.proyectos.participantes.semilleros-investigacion.link', {
                    proyecto: proyecto.id,
                    convocatoria: convocatoria.id,
                }),
                { semillero_investigacion_id: id },
                { preserveScroll: true },
            )
        }
    }

    function removeSemilleroInvestigacion(id) {
        if (proyecto.allowed.to_update) {
            Inertia.post(
                route('convocatorias.proyectos.participantes.semilleros-investigacion.unlink', {
                    proyecto: proyecto.id,
                    convocatoria: convocatoria.id,
                }),
                { semillero_investigacion_id: id, _method: 'DELETE' },
                { preserveScroll: true },
            )
        }
    }
</script>

<div class="bg-app-100 p-4">
    <h1 class="text-4xl text-center">Semilleros de investigación</h1>
    <p class="text-center w-1/3 m-auto mt-8">Realice la búsqueda de semilleros de investigación</p>
    <form on:submit|preventDefault={submit} on:input={() => (sended = false)}>
        <fieldset disabled={proyecto.allowed.to_update ? undefined : true}>
            <div class="mt-4 flex flex-row">
                <Input label="Escriba el nombre completo del semillero de investigación" id="search_semillero_investigacion" type="search" class="mt-1 m-auto block flex-1" bind:value={$form.search_semillero_investigacion} input$minLength="4" autocomplete="off" required />
                <LoadingButton loading={$form.processing} class="m-auto ml-1" type="submit">Buscar</LoadingButton>
            </div>
        </fieldset>
    </form>

    {#if sended}
        <h1 class="mt-24 mb-8 text-center text-3xl">Resultados de la búsqueda de semilleros de investigación</h1>
        <InfoMessage message="Una vez arroje los resultados de clic en los tres puntos y seleccione la opción <strong>Vincular</strong>" />
        <div class="bg-white rounded shadow">
            <table class="w-full whitespace-no-wrap table-fixed data-table">
                <thead>
                    <tr class="text-left font-bold">
                        <th class="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full">Nombre</th>
                        <th class="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full">Línea de investigación</th>
                        <th class="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full">Grupo de investigación</th>
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
                                    {resultado.linea_investigacion.nombre}
                                </p>
                            </td>
                            <td class="border-t">
                                <p class="px-6 py-4">
                                    {resultado.linea_investigacion.grupo_investigacion.nombre} - {resultado.linea_investigacion.grupo_investigacion.acronimo}
                                </p>
                            </td>
                            <td class="border-t td-actions">
                                <DataTableMenu class={resultados.length < 3 ? 'z-50' : ''}>
                                    <Item on:SMUI:action={() => linkSemilleroInvestigacion(resultado.id)} disabled={!proyecto.allowed.to_update} class={!proyecto.allowed.to_update ? 'hidden' : ''}>
                                        <Text>Vincular</Text>
                                    </Item>
                                </DataTableMenu>
                            </td>
                        </tr>
                    {/each}

                    {#if resultados.length === 0}
                        <tr>
                            <td class="border-t px-6 py-4" colspan="4">{$_('No data recorded')}</td>
                        </tr>
                    {/if}
                </tbody>
            </table>
        </div>
    {/if}
</div>

<h1 class="mt-24 mb-8 text-center text-3xl">Semilleros de investigación vinculados</h1>
<div class="bg-white rounded shadow h-[38rem] overflow-y-auto">
    <table class="w-full whitespace-no-wrap table-fixed data-table">
        <thead>
            <tr class="text-left font-bold">
                <th class="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full">Nombre</th>
                <th class="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full">Línea de investigación</th>
                <th class="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full">Grupo de investigación</th>
                <th class="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl text-center th-actions">Acciones</th>
            </tr>
        </thead>
        <tbody>
            {#each proyecto.semillerosInvestigacion as semilleroInvestigacion (semilleroInvestigacion.id)}
                <tr class="hover:bg-gray-100 focus-within:bg-gray-100">
                    <td class="border-t">
                        <p class="px-6 py-4 focus:text-app-500">
                            {semilleroInvestigacion.nombre}
                        </p>
                    </td>
                    <td class="border-t">
                        <p class="px-6 py-4">
                            {semilleroInvestigacion.linea_investigacion.nombre}
                        </p>
                    </td>
                    <td class="border-t">
                        <p class="px-6 py-4">
                            {semilleroInvestigacion.linea_investigacion.grupo_investigacion.nombre} - {semilleroInvestigacion.linea_investigacion.grupo_investigacion.acronimo}
                        </p>
                    </td>
                    <td class="border-t td-actions">
                        <DataTableMenu class={proyecto.semillerosInvestigacion.length < 3 ? 'z-50' : ''}>
                            <Item on:SMUI:action={() => removeSemilleroInvestigacion(semilleroInvestigacion.id)} disabled={!proyecto.allowed.to_update} class={!proyecto.allowed.to_update ? 'hidden' : ''}>
                                <Text>Quitar</Text>
                            </Item>
                        </DataTableMenu>
                    </td>
                </tr>
            {/each}

            {#if proyecto.semillerosInvestigacion.length === 0}
                <tr>
                    <td class="border-t px-6 py-4" colspan="4">{$_('No data recorded')}</td>
                </tr>
            {/if}
        </tbody>
    </table>
</div>
