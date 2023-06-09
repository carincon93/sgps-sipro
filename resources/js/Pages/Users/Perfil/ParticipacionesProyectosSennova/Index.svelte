<script>
    import { Inertia } from '@inertiajs/inertia'
    import { route } from '@/Utils'

    import Button from '@/Shared/Button'
    import DataTableMenu from '@/Shared/DataTableMenu'
    import { Item, Text, Separator } from '@smui/list'

    export let participacionesProyectosSennova

    function destroy(participacionProyectoSennovaId) {
        Inertia.delete(route('participaciones-proyectos-sennova.destroy', participacionProyectoSennovaId), {
            preserveScroll: true,
        })
    }
</script>

<div class="bg-white rounded shadow">
    <Button on:click={() => Inertia.visit(route('participaciones-proyectos-sennova.create'))} class="m-2" variant="raised">Agregar participación</Button>
    <table class="w-full whitespace-no-wrap table-fixed data-table">
        <thead>
            <tr class="text-left font-bold">
                <th class="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full"> Tipo de proyecto </th>
                <th class="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full"> Código </th>
                <th class="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full"> Título </th>
                <th class="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full"> Fecha de inicio </th>
                <th class="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl text-center th-actions"> Acciones </th>
            </tr>
        </thead>
        <tbody>
            {#each participacionesProyectosSennova as participacionProyectoSennova}
                <tr class="hover:bg-gray-100 focus-within:bg-gray-100">
                    <td class="border-t">
                        <p class="px-6 py-4 focus:text-app-500">{participacionProyectoSennova.tipo_proyecto_text}</p>
                    </td>

                    <td class="border-t">
                        <p class="px-6 py-4">{participacionProyectoSennova.codigo_proyecto}</p>
                    </td>

                    <td class="border-t">
                        <p class="px-6 py-4">{participacionProyectoSennova.titulo}</p>
                    </td>

                    <td class="border-t">
                        <p class="px-6 py-4">{participacionProyectoSennova.fecha_inicio_proyecto}</p>
                    </td>
                    <td class="border-t td-actions">
                        <DataTableMenu class={participacionesProyectosSennova.length < 3 ? 'z-50' : ''}>
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
                    <td class="border-t px-6 py-4" colspan="5">Sin información registrada</td>
                </tr>
            {/if}
        </tbody>
    </table>
</div>
