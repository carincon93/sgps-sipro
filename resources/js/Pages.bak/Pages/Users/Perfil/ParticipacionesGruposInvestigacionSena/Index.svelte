<script>
    import { Inertia } from '@inertiajs/inertia'
    import { route } from '@/Utils'

    import Button from '@/Shared/Button'
    import DataTableMenu from '@/Shared/DataTableMenu'
    import { Item, Text, Separator } from '@smui/list'

    export let participacionesGruposInvestigacionSena

    function destroy(participacionGrupoInvestigacionSenaId) {
        Inertia.delete(route('participaciones-grupos-investigacion-sena.destroy', participacionGrupoInvestigacionSenaId), {
            preserveScroll: true,
        })
    }
</script>

<div class="bg-white rounded shadow">
    <Button on:click={() => Inertia.visit(route('participaciones-grupos-investigacion-sena.create'))} class="m-2" variant="raised">Agregar participación</Button>
    <table class="w-full whitespace-no-wrap table-fixed data-table">
        <thead>
            <tr class="text-left font-bold">
                <th class="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full"> Grupo de investigación </th>
                <th class="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full"> Semillero de investigación </th>
                <th class="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl text-center th-actions"> Acciones </th>
            </tr>
        </thead>
        <tbody>
            {#each participacionesGruposInvestigacionSena as participacionGrupoInvestigacionSena}
                <tr class="hover:bg-gray-100 focus-within:bg-gray-100">
                    <td class="border-t">
                        <p class="px-6 py-4 focus:text-app-500">{participacionGrupoInvestigacionSena.grupo_investigacion ? participacionGrupoInvestigacionSena.grupo_investigacion?.nombre : 'No pertenece al grupo de investigación de su centro'}</p>
                    </td>

                    <td class="border-t">
                        <p class="px-6 py-4">{participacionGrupoInvestigacionSena.semillero_investigacion ? participacionGrupoInvestigacionSena.semillero_investigacion.nombre : 'No pertenece al semillero de investigación de su centro'}</p>
                    </td>
                    <td class="border-t td-actions">
                        <DataTableMenu class="{participacionesGruposInvestigacionSena.length < 3 ? 'z-50' : ''} flex items-center justify-center">
                            <Item on:SMUI:action={() => Inertia.visit(route('participaciones-grupos-investigacion-sena.edit', participacionGrupoInvestigacionSena.id))}>
                                <Text>Editar</Text>
                            </Item>

                            <Separator />
                            <Item on:SMUI:action={() => destroy(participacionGrupoInvestigacionSena.id)}>
                                <Text>Eliminar</Text>
                            </Item>
                        </DataTableMenu>
                    </td>
                </tr>
            {/each}

            {#if participacionesGruposInvestigacionSena.length === 0}
                <tr>
                    <td class="border-t px-6 py-4" colspan="3">Sin información registrada</td>
                </tr>
            {/if}
        </tbody>
    </table>
</div>
