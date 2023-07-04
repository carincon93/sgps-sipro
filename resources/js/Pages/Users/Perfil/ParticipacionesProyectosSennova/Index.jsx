<script>
    import { Inertia } from '@inertiajs/inertia'
    import { route } from '@/Utils'

    import Button from '@/Components/Button'
    import DataTableMenu from '@/Components/DataTableMenu'
    import { Item, Text, Separator } from '@smui/list'

    export let participacionesProyectosSennova

    function destroy(participacionProyectoSennovaId) {
        Inertia.delete(route('participaciones-proyectos-sennova.destroy', participacionProyectoSennovaId), {
            preserveScroll: true,
        })
    }
</script>

<div className="bg-white rounded shadow">
    <Button on:click={() => Inertia.visit(route('participaciones-proyectos-sennova.create'))} className="m-2" variant="raised">Agregar participación</Button>
    <table className="w-full whitespace-no-wrap table-fixed data-table">
        <thead>
            <tr className="text-left font-bold">
                <th className="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full"> Tipo de proyecto </th>
                <th className="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full"> Código </th>
                <th className="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full"> Título </th>
                <th className="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full"> Fecha de inicio </th>
                <th className="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl text-center th-actions"> Acciones </th>
            </tr>
        </thead>
        <tbody>
            {#each participacionesProyectosSennova as participacionProyectoSennova}
                <tr className="hover:bg-gray-100 focus-within:bg-gray-100">
                    {#if participacionProyectoSennova.ha_formulado_proyectos_sennova}
                        <td className="border-t">
                            <p className="px-6 py-4 focus:text-app-500">{participacionProyectoSennova.tipo_proyecto_text}</p>
                        </td>

                        <td className="border-t">
                            <p className="px-6 py-4">{participacionProyectoSennova.codigo_proyecto}</p>
                        </td>

                        <td className="border-t">
                            <p className="px-6 py-4">{participacionProyectoSennova.titulo}</p>
                        </td>

                        <td className="border-t">
                            <p className="px-6 py-4">{participacionProyectoSennova.fecha_inicio_proyecto}</p>
                        </td>
                    {:else}
                        <td className="border-t" colspan="4">
                            <p className="px-6 py-4">No he participado en proyectos SENNOVA</p>
                        </td>
                    {/if}
                    <td className="border-t td-actions">
                        <DataTableMenu className="{participacionesProyectosSennova.length < 3 ? 'z-50' : ''} flex items-center justify-center">
                            <Item on:SMUI:action={() => Inertia.visit(route('participaciones-proyectos-sennova.edit', participacionProyectoSennova.id))}>
                                <Text>Editar</Text>
                            </Item>

                            <Separator />
                            <Item on:SMUI:action={() => destroy(participacionProyectoSennova.id)}>
                                <Text>Eliminar</Text>
                            </Item>
                        </DataTableMenu>
                    </td>
                </tr>
            {/each}

            {#if participacionesProyectosSennova.length === 0}
                <tr>
                    <td className="border-t px-6 py-4" colspan="5">Sin información registrada</td>
                </tr>
            {/if}
        </tbody>
    </table>
</div>
