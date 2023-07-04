<script>
    import AuthenticatedLayout, { title } from '@/Layouts/Authenticated'
    import { page, useForm } from '@inertiajs/inertia-svelte'
    import { route, checkRole, checkPermission } from '@/Utils'
    import { _ } from 'svelte-i18n'
    import { Inertia } from '@inertiajs/inertia'

    import Dialog from '@/Components/Dialog'
    import Button from '@/Components/Button'
    import Pagination from '@/Components/Pagination'
    import DataTableMenu from '@/Components/DataTableMenu'
    import { Item, Text, Separator } from '@smui/list'
    import DataTable from '@/Components/DataTable'
    import Stepper from '@/Components/Stepper'
    import InfoMessage from '@/Components/InfoMessage'
    import Label from '@/Components/Label'
    import Select from '@/Components/Select'
    import PrimaryButton from '@/Components/PrimaryButton'
    import RecomendacionEvaluador from '@/Components/RecomendacionEvaluador'

    export let errors
    export let convocatoria
    export let proyecto
    export let entidadesAliadas
    export let infraestructuraTecnoacademia

    $title = 'Entidades aliadas'

    /**
     * Validar si el usuario autenticado es SuperAdmin
     */
    let authUser = $auth.user
    let isSuperAdmin = checkRole(authUser, [1])

    let form = useForm({
        _method: 'put',
        infraestructura_tecnoacademia: proyecto.infraestructura_tecnoacademia,
    })

    function submit() {
        if (proyecto.allowed.to_update) {
            $form.post(route('convocatorias.ta.infraestrucutra.update', [convocatoria.id, proyecto.id]), {
                preserveScroll: true,
            })
        }
    }

    let dialogEliminar = false
    let allowedToDestroy = false
    let entidadAliadaId
    function destroy() {
        if (allowedToDestroy) {
            Inertia.delete(route('convocatorias.proyectos.entidades-aliadas.destroy', [convocatoria.id, proyecto.id, entidadAliadaId]), {
                preserveScroll: true,
                onFinish: () => {
                    dialogEliminar = false
                },
            })
        }
    }
</script>

<AuthenticatedLayout>
    <header className="pt-[8rem]" slot="header">
        <Stepper {convocatoria} {proyecto} />
    </header>

    <DataTable className="mt-20" routeParams={[convocatoria.id, proyecto.id]}>
        <div slot="title">Entidades aliadas</div>

        <div slot="caption">
            {#if proyecto.codigo_linea_programatica == 23 || proyecto.codigo_linea_programatica == 65 || proyecto.codigo_linea_programatica == 66 || proyecto.codigo_linea_programatica == 70 || proyecto.codigo_linea_programatica == 82}
                {#if isSuperAdmin || proyecto.mostrar_recomendaciones}
                    <RecomendacionEvaluador className="mt-8">
                        {#each proyecto.evaluaciones as evaluacion, i}
                            {#if isSuperAdmin || (evaluacion.finalizado && evaluacion.habilitado)}
                                <div className="bg-zinc-900 p-4 rounded shadow text-white my-2">
                                    <p className="text-xs">Evaluador COD-{evaluacion.id}:</p>
                                    {#if evaluacion.idi_evaluacion}
                                        <p className="whitespace-pre-line text-xs">{evaluacion.idi_evaluacion?.entidad_aliada_comentario ? evaluacion.idi_evaluacion.entidad_aliada_comentario : 'Sin recomendación'}</p>
                                    {/if}
                                    {#if evaluacion.ta_evaluacion}
                                        <p className="whitespace-pre-line text-xs">{evaluacion.ta_evaluacion?.entidad_aliada_comentario ? evaluacion.ta_evaluacion.entidad_aliada_comentario : 'Sin recomendación'}</p>
                                    {/if}
                                </div>
                            {/if}
                        {/each}
                    </RecomendacionEvaluador>
                    {#if proyecto.evaluaciones.length == 0}
                        <p className="whitespace-pre-line mt-4 text-xs">El proyecto no ha sido evaluado aún.</p>
                    {/if}
                {/if}
            {/if}

            {#if proyecto.codigo_linea_programatica == 70}
                <form on:submit|preventDefault={submit} className="mt-8 mb-40">
                    <fieldset disabled={proyecto.allowed.to_update ? undefined : true}>
                        <div>
                            <Label required className="mb-4" labelFor="infraestructura_tecnoacademia" value="La infraestructura donde opera la TecnoAcademia es:" />
                            <Select id="infraestructura_tecnoacademia" items={infraestructuraTecnoacademia} bind:selectedValue={$form.infraestructura_tecnoacademia} error={errors.infraestructura_tecnoacademia} autocomplete="off" placeholder="Seleccione el tipo de insfraestructura" required />
                        </div>
                        {#if proyecto.allowed.to_update}
                            <div className="flex items-center justify-between mt-14 px-8 py-4">
                                <PrimaryButton loading={$form.processing} className="ml-auto" type="submit">Guardar</PrimaryButton>
                            </div>
                        {/if}
                    </fieldset>
                </form>

                <InfoMessage message="En el caso de tener un acuerdo, convenio o contrato de arrendamiento para la operación de la TecnoAcademia en una infraestructura de un tercero, es indispensable, adjuntar el documento contractual una vez este creando la entidad aliada." />
            {/if}
        </div>

        <div slot="actions">
            {#if proyecto.allowed.to_update}
                <Button on:click={() => Inertia.visit(route('convocatorias.proyectos.entidades-aliadas.create', [convocatoria.id, proyecto.id]))} variant="raised">Crear entidad aliada</Button>
            {/if}
        </div>

        <thead slot="thead">
            <tr className="text-left font-bold">
                <th className="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full">Nombre</th>
                <th className="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full">Tipo de entidad aliada</th>
                <th className="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl text-center th-actions">Acciones</th>
            </tr>
        </thead>

        <tbody slot="tbody">
            {#each entidadesAliadas.data as entidadAliada (entidadAliada.id)}
                <tr className="hover:bg-gray-100 focus-within:bg-gray-100">
                    <td className="border-t">
                        <p className="px-6 py-4 focus:text-app-500">
                            {entidadAliada.nombre}
                        </p>
                    </td>
                    <td className="border-t">
                        <p className="px-6 py-4 focus:text-app-500">
                            {entidadAliada.tipo}
                        </p>
                    </td>
                    <td className="border-t td-actions">
                        <DataTableMenu className={entidadesAliadas.data.length < 3 ? 'z-50' : ''}>
                            <Item on:SMUI:action={() => Inertia.visit(route('convocatorias.proyectos.entidades-aliadas.edit', [convocatoria.id, proyecto.id, entidadAliada.id]))}>
                                <Text>Ver detalles</Text>
                            </Item>

                            <Separator className={!proyecto.allowed.to_update ? 'hidden' : ''} />
                            <Item on:SMUI:action={() => ((entidadAliadaId = entidadAliada.id), (dialogEliminar = true), (allowedToDestroy = proyecto.allowed.to_update))} disabled={!proyecto.allowed.to_update} className={!proyecto.allowed.to_update ? 'hidden' : ''}>
                                <Text>Eliminar entidad aliada</Text>
                            </Item>
                        </DataTableMenu>
                    </td>
                </tr>
            {/each}

            {#if entidadesAliadas.data.length === 0}
                <tr>
                    <td className="border-t px-6 py-4" colspan="4">Sin información registrada</td>
                </tr>
            {/if}
        </tbody>
    </DataTable>
    <Pagination links={entidadesAliadas.links} />

    <Dialog bind:open={dialogEliminar}>
        <div slot="title">
            <div className="text-center">Eliminar recurso</div>
            <div className="relative bg-app-100 text-app-600 p-5 h-44 w-1/3 m-auto my-10" style="border-radius: 41% 59% 70% 30% / 32% 40% 60% 68% ;">
                <figure>
                    <img src="/images/eliminar.png" alt="" className="h-44 m-auto" />
                </figure>
            </div>
            <div className="text-center">
                ¿Está seguro (a) que desea eliminar este elemento?<br />Una vez eliminado todos sus recursos y datos se eliminarán de forma permanente.
            </div>
        </div>
        <div slot="content" />
        <div slot="actions">
            <div className="p-4">
                <Button on:click={() => (dialogEliminar = false)} variant={null}>Cancelar</Button>
                <Button variant="raised" type="button" on:click={() => destroy()}>Confirmar</Button>
            </div>
        </div>
    </Dialog>
</AuthenticatedLayout>
