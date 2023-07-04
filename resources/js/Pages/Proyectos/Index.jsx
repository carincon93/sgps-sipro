<script>
    import AuthenticatedLayout, { title } from '@/Layouts/Authenticated'
    import { page, useForm } from '@inertiajs/inertia-svelte'
    import { route, checkRole, checkPermission } from '@/Utils'
    import { _ } from 'svelte-i18n'
    import { Inertia } from '@inertiajs/inertia'

    import Pagination from '@/Components/Pagination'
    import DataTable from '@/Components/DataTable'
    import DataTableMenu from '@/Components/DataTableMenu'
    import PrimaryButton from '@/Components/PrimaryButton'
    import Tags from '@/Components/Tags'
    import FormField from '@smui/form-field'
    import Radio from '@smui/radio'
    import Button from '@/Components/Button'
    import InfoMessage from '@/Components/InfoMessage'
    import { Item, Text } from '@smui/list'
    import Label from '@/Components/Label'
    import Select from '@/Components/Select'
    import Input from '@/Components/Input'

    export let proyectos
    export let convocatorias
    export let proyectosId

    $title = 'Proyectos'

    /**
     * Validar si el usuario autenticado es SuperAdmin
     */
    let authUser = $auth.user
    let isSuperAdmin = checkRole(authUser, [1])

    let filters = {
        year: $page.props.filters.year,
    }

    let form = useForm({
        proyectos_id: null,
        estado: false,
        estado_cord_sennova: '',
    })
    function submit() {
        if (isSuperAdmin || checkRole(authUser, [20, 18, 19, 5, 17])) {
            $form.post(route('proyectos.update.actualizar-estados-proyectos'), {
                preserveScroll: true,
            })
        }
    }

    let formEstadosProyectos = useForm({
        convocatoria_id: null,
    })
    function actualizarEstados() {
        $formEstadosProyectos.post(route('proyectos.update.actualizar-estados-todos-proyectos'))
    }
</script>

<AuthenticatedLayout>
    <DataTable className="mt-20" bind:filters showFilters={false}>
        <div slot="title">Proyectos</div>

        <div slot="caption">
            <InfoMessage>
                <p>En esta sección puede seleccionar varios códigos de proyectos y cambiar el estado al mismo tiempo. Seleccione entre: Subsanar, finalizar o evaluar.</p>
                <form on:submit|preventDefault={submit}>
                    <Tags enforceWhitelist={false} id="proyectos_id" className="mt-4" whitelist={proyectosId} bind:tags={$form.proyectos_id} placeholder="Código(s) SGPS" required />

                    <div className="flex mt-4 items-center">
                        <FormField>
                            <Radio bind:group={$form.estado} value="1" />
                            <span slot="label">Subsanar</span>
                        </FormField>
                    </div>

                    <div className="flex mt-4 items-center">
                        <FormField>
                            <Radio bind:group={$form.estado} value="2" />
                            <span slot="label">Finalizar</span>
                        </FormField>
                    </div>

                    <div className="flex mt-4 items-center">
                        <FormField>
                            <Radio bind:group={$form.estado} value="3" />
                            <span slot="label">Evaluar</span>
                        </FormField>
                    </div>

                    <hr className="mt-10 mb-10" />

                    <div className="mt-8">
                        <Label labelFor="estado_cord_sennova" value="Por favor defina el estado del proyecto. (Solo si el proyecto tuvo uno revisión por la cord. SENNOVA)" className="inline-block mb-4" />
                        <br />
                        <Input label="Estado (Definido por la cord. SENNOVA)" id="estado_cord_sennova" type="text" className="mt-1" bind:value={$form.estado_cord_sennova} />
                    </div>

                    <div className="py-4 flex items-center sticky bottom-0">
                        {#if isSuperAdmin || checkRole(authUser, [20, 18, 19, 5, 17])}
                            <PrimaryButton loading={$form.processing} className="ml-auto" type="submit">Actualizar fase de los proyectos</PrimaryButton>
                        {/if}
                    </div>
                </form>
            </InfoMessage>

            <InfoMessage className="mt-10">
                <form on:submit|preventDefault={actualizarEstados}>
                    <div>
                        <p>Seleccione una convocatoria</p>

                        <Select id="convocatoria_id" items={convocatorias} bind:selectedValue={$formEstadosProyectos.convocatoria_id} autocomplete="off" placeholder="Seleccione una convocatoria" />
                    </div>

                    <div className="py-4 flex items-center sticky bottom-0">
                        {#if isSuperAdmin || checkRole(authUser, [20, 18, 19, 5, 17])}
                            <PrimaryButton loading={$formEstadosProyectos.processing} className="ml-auto" type="submit">Actualizar puntajes de proyectos</PrimaryButton>
                        {/if}
                    </div>
                </form>
            </InfoMessage>

            <hr className="my-10 w-full" />
        </div>

        <div slot="actions">
            {#if isSuperAdmin}
                <Button on:click={() => Inertia.visit(route('proyectos.activos'))} variant="raised">Proyectos activos</Button>
            {/if}
        </div>

        <thead slot="thead">
            <tr className="text-left font-bold">
                <th className="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full"> Código </th>
                {#if isSuperAdmin || checkRole(authUser, [20, 18, 19, 5, 17])}
                    <th className="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full"> Versiones (.pdf) </th>
                {/if}
                <th className="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl text-center th-actions"> Acciones </th>
            </tr>
        </thead>

        <tbody slot="tbody">
            {#each proyectos.data as { id, estado, titulo, codigo, fecha_ejecucion, pdf_versiones, convocatoria }}
                <tr className="hover:bg-gray-100 focus-within:bg-gray-100">
                    <td className="border-t">
                        <p className="px-6 py-4 focus:text-app-500">
                            {codigo}
                            {#if JSON.parse(estado)?.requiereSubsanar}
                                <br />
                                <span className="bg-red-100 inline-block mt-2 p-2 rounded text-red-400"> Requiere modificaciones </span>
                            {/if}
                        </p>
                    </td>
                    {#if isSuperAdmin || checkRole(authUser, [20, 18, 19, 5, 17])}
                        <td className="border-t">
                            {#if pdf_versiones}
                                <ul>
                                    {#each pdf_versiones as version}
                                        <li>
                                            {#if version.estado == 1}
                                                <a className="text-app-500 underline" href={route('convocatorias.proyectos.version', [convocatoria.id, id, version.version])}> {version.version}.pdf - Descargar</a>
                                                <small className="block">{version.created_at}</small>
                                            {/if}
                                        </li>
                                    {/each}
                                    {#if pdf_versiones.length == 0}
                                        <p>No se ha generado algún pdf</p>
                                    {/if}
                                </ul>
                            {:else}
                                <p>No se ha generado algún pdf</p>
                            {/if}
                        </td>
                    {/if}

                    <td className="border-t td-actions">
                        <DataTableMenu className={proyectos.data.length < 3 ? 'z-50' : ''}>
                            <Item on:SMUI:action={() => Inertia.visit(route('proyectos.edit', [id]))} disabled={!isSuperAdmin || !checkRole(authUser, [1, 20, 18, 19, 5, 17]) == false ? false : true} className={!isSuperAdmin && checkRole(authUser, [1, 20, 18, 19, 5, 17]) == false ? 'hidden' : ''}>
                                <Text>Ver detalles</Text>
                            </Item>
                        </DataTableMenu>
                    </td>
                </tr>
            {/each}

            {#if proyectos.data.length === 0}
                <tr>
                    <td className="border-t px-6 py-4" colspan="5"> Sin información registrada </td>
                </tr>
            {/if}
        </tbody>
    </DataTable>
    <Pagination links={proyectos.links} />
</AuthenticatedLayout>
