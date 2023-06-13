<script>
    import { Inertia } from '@inertiajs/inertia'
    import { route } from '@/Utils'

    import Button from '@/Shared/Button'
    import DataTableMenu from '@/Shared/DataTableMenu'
    import { Item, Text, Separator } from '@smui/list'

    export let estudiosAcademicos

    function destroy(estudioAcademicoId) {
        Inertia.delete(route('estudios-academicos.destroy', estudioAcademicoId), {
            preserveScroll: true,
        })
    }
</script>

<div class="bg-white rounded shadow">
    <Button on:click={() => Inertia.visit(route('estudios-academicos.create'))} class="m-2" variant="raised">Agregar estudio académico</Button>

    <table class="w-full whitespace-no-wrap table-fixed data-table">
        <thead>
            <tr class="text-left font-bold">
                <th class="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full"> Grado de formación </th>
                <th class="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full"> Título obtenido </th>
                <th class="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl text-center th-actions"> Acciones </th>
            </tr>
        </thead>
        <tbody>
            {#each estudiosAcademicos as estudioAcademico}
                <tr class="hover:bg-gray-100 focus-within:bg-gray-100">
                    <td class="border-t">
                        <p class="px-6 py-4 focus:text-app-500">{estudioAcademico.grado_formacion_text}</p>
                    </td>

                    <td class="border-t">
                        <p class="px-6 py-4">{estudioAcademico.titulo_obtenido}</p>
                    </td>
                    <td class="border-t td-actions">
                        <DataTableMenu class={estudiosAcademicos.length < 3 ? 'z-50' : ''}>
                            <Item on:SMUI:action={() => Inertia.visit(route('estudios-academicos.edit', estudioAcademico.id))}>
                                <Text>Editar</Text>
                            </Item>

                            <Separator />
                            <Item on:SMUI:action={() => destroy(estudioAcademico.id)}>
                                <Text>Eliminar</Text>
                            </Item>
                        </DataTableMenu>
                    </td>
                </tr>
            {/each}

            {#if estudiosAcademicos.length === 0}
                <tr>
                    <td class="border-t px-6 py-4" colspan="3">Sin información registrada</td>
                </tr>
            {/if}
        </tbody>
    </table>
</div>
