<script>
    import { Inertia } from '@inertiajs/inertia'
    import { route } from '@/Utils'

    import Button from '@/Components/Button'
    import DataTableMenu from '@/Components/DataTableMenu'
    import { Item, Text, Separator } from '@smui/list'

    export let estudiosAcademicos

    function destroy(estudioAcademicoId) {
        Inertia.delete(route('estudios-academicos.destroy', estudioAcademicoId), {
            preserveScroll: true,
        })
    }
</script>

<div className="bg-white rounded shadow">
    <Button on:click={() => Inertia.visit(route('estudios-academicos.create'))} className="m-2" variant="raised">Agregar estudio académico</Button>

    <table className="w-full whitespace-no-wrap table-fixed data-table">
        <thead>
            <tr className="text-left font-bold">
                <th className="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full"> Grado de formación </th>
                <th className="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full"> Título obtenido </th>
                <th className="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl text-center th-actions"> Acciones </th>
            </tr>
        </thead>
        <tbody>
            {#each estudiosAcademicos as estudioAcademico}
                <tr className="hover:bg-gray-100 focus-within:bg-gray-100">
                    <td className="border-t">
                        <p className="px-6 py-4 focus:text-app-500">{estudioAcademico.grado_formacion_text}</p>
                    </td>

                    <td className="border-t">
                        <p className="px-6 py-4">{estudioAcademico.titulo_obtenido}</p>
                    </td>
                    <td className="border-t td-actions">
                        <DataTableMenu className="{estudiosAcademicos.length < 3 ? 'z-50' : ''} flex items-center justify-center">
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
                    <td className="border-t px-6 py-4" colspan="3">Sin información registrada</td>
                </tr>
            {/if}
        </tbody>
    </table>
</div>
