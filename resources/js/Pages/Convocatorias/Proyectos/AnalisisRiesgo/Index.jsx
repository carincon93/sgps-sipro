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
    import RecomendacionEvaluador from '@/Components/RecomendacionEvaluador'

    export let convocatoria
    export let proyecto
    export let analisisRiesgos

    $title = 'Análisis de riesgos'

    /**
     * Validar si el usuario autenticado es SuperAdmin
     */
    let authUser = auth.user
    let isSuperAdmin = checkRole(authUser, [1])

    let dialogEliminar = false
    let allowedToDestroy = false
    let analisisRiesgoId
    function destroy() {
        if (allowedToDestroy) {
            Inertia.delete(route('convocatorias.proyectos.analisis-riesgos.destroy', [convocatoria.id, proyecto.id, analisisRiesgoId]), {
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
        <div slot="title">Análisis de riesgos</div>

        <div slot="caption">
            {#if isSuperAdmin || proyecto.mostrar_recomendaciones}
                <RecomendacionEvaluador className="mt-8">
                    {#each proyecto.evaluaciones as evaluacion, i}
                        {#if isSuperAdmin || (evaluacion.finalizado && evaluacion.habilitado)}
                            <div className="bg-zinc-900 p-4 rounded shadow text-white my-2">
                                <p className="text-xs">Evaluador COD-{evaluacion.id}:</p>
                                {#if evaluacion.idi_evaluacion}
                                    <p className="whitespace-pre-line text-xs">{evaluacion.idi_evaluacion?.analisis_riesgos_comentario ? evaluacion.idi_evaluacion.analisis_riesgos_comentario : 'Sin recomendación'}</p>
                                {:else if evaluacion.cultura_innovacion_evaluacion}
                                    <p className="whitespace-pre-line text-xs">{evaluacion.cultura_innovacion_evaluacion?.analisis_riesgos_comentario ? evaluacion.cultura_innovacion_evaluacion.analisis_riesgos_comentario : 'Sin recomendación'}</p>
                                {:else if evaluacion.ta_evaluacion}
                                    <p className="whitespace-pre-line text-xs">{evaluacion.ta_evaluacion?.analisis_riesgos_comentario ? evaluacion.ta_evaluacion.analisis_riesgos_comentario : 'Sin recomendación'}</p>
                                {:else if evaluacion.tp_evaluacion}
                                    <p className="whitespace-pre-line text-xs">{evaluacion.tp_evaluacion?.analisis_riesgos_comentario ? evaluacion.tp_evaluacion.analisis_riesgos_comentario : 'Sin recomendación'}</p>
                                {:else if evaluacion.servicio_tecnologico_evaluacion}
                                    <hr className="mt-10 mb-10 border-black-200" />
                                    <h1 className="font-black">Análisis de riesgos</h1>

                                    <ul className="list-disc pl-4">
                                        <li className="whitespace-pre-line text-xs mb-10">{evaluacion.servicio_tecnologico_evaluacion?.riesgos_objetivo_general_comentario ? 'Recomendación riesgos a nivel de objetivo general: ' + evaluacion.servicio_tecnologico_evaluacion.riesgos_objetivo_general_comentario : 'Sin recomendación'}</li>
                                        <li className="whitespace-pre-line text-xs mb-10">{evaluacion.servicio_tecnologico_evaluacion?.riesgos_productos_comentario ? 'Recomendación riesgos a nivel de productos: ' + evaluacion.servicio_tecnologico_evaluacion.riesgos_productos_comentario : 'Sin recomendación'}</li>
                                        <li className="whitespace-pre-line text-xs mb-10">{evaluacion.servicio_tecnologico_evaluacion?.riesgos_actividades_comentario ? 'Recomendación riesgos a nivel de actividades: ' + evaluacion.servicio_tecnologico_evaluacion.riesgos_actividades_comentario : 'Sin recomendación'}</li>
                                    </ul>
                                {/if}
                            </div>
                        {/if}
                    {/each}
                    {#if proyecto.evaluaciones.length == 0}
                        <p className="whitespace-pre-line mt-4 text-xs">El proyecto no ha sido evaluado aún.</p>
                    {/if}
                </RecomendacionEvaluador>
            {/if}

            <p className="text-justify mt-10 mb-24">
                Los riesgos son eventos inciertos que pueden llegar a suceder en el futuro, dentro del horizonte de la ejecución del proyecto y representaran efectos de diferente magnitud en uno o más de sus objetivos.
                <br />
                Se debe establecer un riesgo por cada nivel (A nivel de objetivo general - A nivel de actividades - A nivel de productos). Estos riesgos podrán ser clasificados conforme los siguientes tipos: mercados, operacionales, legales, administrativos.
            </p>
        </div>

        <div slot="actions">
            {#if proyecto.allowed.to_update}
                <Button on:click={() => Inertia.visit(route('convocatorias.proyectos.analisis-riesgos.create', [convocatoria.id, proyecto.id]))} variant="raised">Crear análisis de riesgos</Button>
            {/if}
        </div>

        <thead slot="thead">
            <tr className="text-left font-bold">
                <th className="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full">Descripción</th>
                <th className="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full">Nivel</th>
                <th className="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full">Tipo de riesgo</th>
                <th className="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl text-center th-actions">Acciones</th>
            </tr>
        </thead>

        <tbody slot="tbody">
            {#each analisisRiesgos.data as analisisRiesgo (analisisRiesgo.id)}
                <tr className="hover:bg-gray-100 focus-within:bg-gray-100">
                    <td className="border-t">
                        <p className="focus:text-app-500 my-2 paragraph-ellipsis px-6">
                            {analisisRiesgo.descripcion}
                        </p>
                    </td>

                    <td className="border-t">
                        <p className="focus:text-app-500 my-2 paragraph-ellipsis px-6">
                            {analisisRiesgo.nivel}
                        </p>
                    </td>

                    <td className="border-t">
                        <p className="focus:text-app-500 my-2 paragraph-ellipsis px-6">
                            {analisisRiesgo.tipo}
                        </p>
                    </td>

                    <td className="border-t td-actions">
                        <DataTableMenu className={analisisRiesgos.data.length < 3 ? 'z-50' : ''}>
                            <Item on:SMUI:action={() => Inertia.visit(route('convocatorias.proyectos.analisis-riesgos.edit', [convocatoria.id, proyecto.id, analisisRiesgo.id]))}>
                                <Text>Ver detalles</Text>
                            </Item>

                            <Separator className={!proyecto.allowed.to_update ? 'hidden' : ''} />
                            <Item on:SMUI:action={() => ((analisisRiesgoId = analisisRiesgo.id), (dialogEliminar = true), (allowedToDestroy = proyecto.allowed.to_update))} disabled={!proyecto.allowed.to_update} className={!proyecto.allowed.to_update ? 'hidden' : ''}>
                                <Text>Eliminar</Text>
                            </Item>
                        </DataTableMenu>
                    </td>
                </tr>
            {/each}

            {#if analisisRiesgos.data.length === 0}
                <tr>
                    <td className="border-t px-6 py-4" colspan="4">Sin información registrada</td>
                </tr>
            {/if}
        </tbody>
    </DataTable>
    <Pagination links={analisisRiesgos.links} />

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
