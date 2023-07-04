<script>
    import AuthenticatedLayout, { title } from '@/Layouts/Authenticated'
    import { page } from '@inertiajs/inertia-svelte'
    import { route, checkRole, checkPermission } from '@/Utils'
    import { _ } from 'svelte-i18n'
    import { Inertia } from '@inertiajs/inertia'

    import Dialog from '@/Components/Dialog'
    import Button from '@/Components/Button'
    import Pagination from '@/Components/Pagination'
    import DataTable from '@/Components/DataTable'
    import DataTableMenu from '@/Components/DataTableMenu'
    import { Item, Text, Separator } from '@smui/list'
    import Stepper from '@/Components/Stepper'
    import InfoMessage from '@/Components/InfoMessage'
    import RecomendacionEvaluador from '@/Components/RecomendacionEvaluador'

    export let convocatoria
    export let proyecto
    export let eventos

    $title = 'EDT'

    /**
     * Validar si el usuario autenticado es SuperAdmin
     */
    let authUser = $auth.user
    let isSuperAdmin = checkRole(authUser, [1])

    let dialogEliminar = false
    let allowedToDestroy = false
    let edtId
    function destroy() {
        if (allowedToDestroy) {
            Inertia.delete(route('convocatorias.proyectos.edt.destroy', [convocatoria.id, proyecto.id, edtId]), {
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
        <div slot="title">EDT</div>

        <div slot="caption">
            {#if proyecto.servicios_organizacion == false}
                <InfoMessage message="Para poder agregar un EDT debe generar primero el uso presupuestal <strong>servicios personales indirectos > servicios prestados a las empresas y servicios de producción > Servicios personales indirectos (persona jurídica)</strong> >  <strong>Servicios de organización y asistencia de convenciones y ferias</strong>." />
            {:else}
                <p className="mb-20 text-center">A continuación, proyecte los EDTs que se realizarán durante la vigencia del proyecto:</p>
            {/if}

            {#if isSuperAdmin || proyecto.mostrar_recomendaciones}
                <RecomendacionEvaluador className="mt-8">
                    {#each proyecto.evaluaciones as evaluacion, i}
                        {#if (isSuperAdmin && evaluacion.ta_evaluacion) || (evaluacion.finalizado && evaluacion.habilitado && evaluacion.ta_evaluacion)}
                            <div className="bg-zinc-900 p-4 rounded shadow text-white my-2">
                                <p className="text-xs">Evaluador COD-{evaluacion.id}:</p>
                                <p className="whitespace-pre-line text-xs">{evaluacion.ta_evaluacion?.edt_comentario ? evaluacion.ta_evaluacion.edt_comentario : 'Sin recomendación'}</p>
                            </div>
                        {/if}
                    {/each}
                    {#if proyecto.evaluaciones.length == 0}
                        <p className="whitespace-pre-line mt-4 text-xs">El proyecto no ha sido evaluado aún.</p>
                    {/if}
                </RecomendacionEvaluador>
            {/if}
        </div>

        <div slot="actions">
            {#if proyecto.allowed.to_update}
                <Button on:click={() => Inertia.visit(route('convocatorias.proyectos.edt.create', [convocatoria.id, proyecto.id]))} variant="raised">Crear EDT</Button>
            {/if}
        </div>

        <thead slot="thead">
            <tr className="text-left font-bold">
                <th className="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full">Descripción del evento</th>
                <th className="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full">Número de asistentes</th>
                <th className="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full">Presupuesto</th>
                <th className="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl text-center th-actions">Acciones</th>
            </tr>
        </thead>

        <tbody slot="tbody">
            {#each eventos.data as evento (evento.id)}
                <tr className="hover:bg-gray-100 focus-within:bg-gray-100">
                    <td className="border-t">
                        <p className="focus:text-app-500 my-2 paragraph-ellipsis px-6">
                            {evento.descripcion_evento}
                        </p>
                    </td>

                    <td className="border-t">
                        <p className="focus:text-app-500 my-2 paragraph-ellipsis px-6">
                            {evento.numero_asistentes}
                        </p>
                    </td>

                    <td className="border-t">
                        <p className="focus:text-app-500 my-2 paragraph-ellipsis px-6">
                            ${new Intl.NumberFormat('de-DE').format(!isNaN(evento.proyecto_presupuesto.valor_total) ? evento.proyecto_presupuesto.valor_total : 0)}
                        </p>
                    </td>

                    <td className="border-t td-actions">
                        <DataTableMenu className={eventos.data.length < 3 ? 'z-50' : ''}>
                            <Item on:SMUI:action={() => Inertia.visit(route('convocatorias.proyectos.edt.edit', [convocatoria.id, proyecto.id, evento.id]))}>
                                <Text>Ver detalles</Text>
                            </Item>

                            <Separator className={!proyecto.allowed.to_update ? 'hidden' : ''} />
                            <Item on:SMUI:action={() => ((edtId = evento.id), (dialogEliminar = true), (allowedToDestroy = proyecto.allowed.to_update))} disabled={!proyecto.allowed.to_update} className={!proyecto.allowed.to_update ? 'hidden' : ''}>
                                <Text>Eliminar</Text>
                            </Item>
                        </DataTableMenu>
                    </td>
                </tr>
            {/each}

            {#if eventos.data.length === 0}
                <tr>
                    <td className="border-t px-6 py-4" colspan="4">Sin información registrada</td>
                </tr>
            {/if}
        </tbody>
    </DataTable>
    <Pagination links={eventos.links} />

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
