<script>
    import { Inertia } from '@inertiajs/inertia'
    import { useForm, page } from '@inertiajs/inertia-svelte'
    import { route, checkRole, checkPermission } from '@/Utils'
    import { _ } from 'svelte-i18n'
    import axios from 'axios'

    import Input from '@/Components/Input'
    import PrimaryButton from '@/Components/PrimaryButton'
    import DataTableMenu from '@/Components/DataTableMenu'
    import InfoMessage from '@/Components/InfoMessage'
    import { Item, Text, Separator } from '@smui/list'

    export let convocatoria
    export let proyecto

    let resultados = []

    /**
     * Validar si el usuario autenticado es SuperAdmin
     */
    let authUser = auth.user
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

<div className="bg-app-100 p-4">
    <h1 className="text-4xl text-center">Semilleros de investigación</h1>
    <p className="text-center w-1/3 m-auto mt-8">Realice la búsqueda de semilleros de investigación</p>
    <form on:submit|preventDefault={submit} on:input={() => (sended = false)}>
        <fieldset disabled={proyecto.allowed.to_update ? undefined : true}>
            <div className="mt-4 flex flex-row">
                <Input label="Escriba el nombre completo del semillero de investigación" id="search_semillero_investigacion" type="search" className="mt-1 m-auto block flex-1" bind:value={$form.search_semillero_investigacion} input$minLength="4" autocomplete="off" required />
                <PrimaryButton loading={$form.processing} className="m-auto ml-1" type="submit">Buscar</PrimaryButton>
            </div>
        </fieldset>
    </form>

    {#if sended}
        <h1 className="mt-24 mb-8 text-center text-3xl">Resultados de la búsqueda de semilleros de investigación</h1>
        <InfoMessage message="Una vez arroje los resultados de clic en los tres puntos y seleccione la opción <strong>Vincular</strong>" />
        <div className="bg-white rounded shadow">
            <table className="w-full whitespace-no-wrap table-fixed data-table">
                <thead>
                    <tr className="text-left font-bold">
                        <th className="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full">Nombre</th>
                        <th className="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full">Línea de investigación</th>
                        <th className="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full">Grupo de investigación</th>
                        <th className="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl text-center th-actions">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {#each resultados as resultado (resultado.id)}
                        <tr className="hover:bg-gray-100 focus-within:bg-gray-100">
                            <td className="border-t">
                                <p className="px-6 py-4 focus:text-app-500">
                                    {resultado.nombre}
                                </p>
                            </td>
                            <td className="border-t">
                                <p className="px-6 py-4">
                                    {resultado.linea_investigacion.nombre}
                                </p>
                            </td>
                            <td className="border-t">
                                <p className="px-6 py-4">
                                    {resultado.linea_investigacion.grupo_investigacion.nombre} - {resultado.linea_investigacion.grupo_investigacion.acronimo}
                                </p>
                            </td>
                            <td className="border-t td-actions">
                                <DataTableMenu className={resultados.length < 3 ? 'z-50' : ''}>
                                    <Item on:SMUI:action={() => linkSemilleroInvestigacion(resultado.id)} disabled={!proyecto.allowed.to_update} className={!proyecto.allowed.to_update ? 'hidden' : ''}>
                                        <Text>Vincular</Text>
                                    </Item>
                                </DataTableMenu>
                            </td>
                        </tr>
                    {/each}

                    {#if resultados.length === 0}
                        <tr>
                            <td className="border-t px-6 py-4" colspan="4">{$_('No data recorded')}</td>
                        </tr>
                    {/if}
                </tbody>
            </table>
        </div>
    {/if}
</div>

<h1 className="mt-24 mb-8 text-center text-3xl">Semilleros de investigación vinculados</h1>
<div className="bg-white rounded shadow h-[38rem] overflow-y-auto">
    <table className="w-full whitespace-no-wrap table-fixed data-table">
        <thead>
            <tr className="text-left font-bold">
                <th className="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full">Nombre</th>
                <th className="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full">Línea de investigación</th>
                <th className="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full">Grupo de investigación</th>
                <th className="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl text-center th-actions">Acciones</th>
            </tr>
        </thead>
        <tbody>
            {#each proyecto.semillerosInvestigacion as semilleroInvestigacion (semilleroInvestigacion.id)}
                <tr className="hover:bg-gray-100 focus-within:bg-gray-100">
                    <td className="border-t">
                        <p className="px-6 py-4 focus:text-app-500">
                            {semilleroInvestigacion.nombre}
                        </p>
                    </td>
                    <td className="border-t">
                        <p className="px-6 py-4">
                            {semilleroInvestigacion.linea_investigacion.nombre}
                        </p>
                    </td>
                    <td className="border-t">
                        <p className="px-6 py-4">
                            {semilleroInvestigacion.linea_investigacion.grupo_investigacion.nombre} - {semilleroInvestigacion.linea_investigacion.grupo_investigacion.acronimo}
                        </p>
                    </td>
                    <td className="border-t td-actions">
                        <DataTableMenu className={proyecto.semillerosInvestigacion.length < 3 ? 'z-50' : ''}>
                            <Item on:SMUI:action={() => removeSemilleroInvestigacion(semilleroInvestigacion.id)} disabled={!proyecto.allowed.to_update} className={!proyecto.allowed.to_update ? 'hidden' : ''}>
                                <Text>Quitar</Text>
                            </Item>
                        </DataTableMenu>
                    </td>
                </tr>
            {/each}

            {#if proyecto.semillerosInvestigacion.length === 0}
                <tr>
                    <td className="border-t px-6 py-4" colspan="4">{$_('No data recorded')}</td>
                </tr>
            {/if}
        </tbody>
    </table>
</div>
