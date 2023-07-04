<script>
    import AuthenticatedLayout, { title } from '@/Layouts/Authenticated'
    import { Inertia } from '@inertiajs/inertia'
    import { inertia, page, useForm } from '@inertiajs/inertia-svelte'
    import { route, checkRole, checkPermission } from '@/Utils'
    import { _ } from 'svelte-i18n'

    import Button from '@/Components/Button'
    import { Item, Text, Separator } from '@smui/list'
    import DataTableMenu from '@/Components/DataTableMenu'
    import InfoMessage from '@/Components/InfoMessage'
    import Dialog from '@/Components/Dialog'

    import Form from './Form'

    export let errors
    export let convocatoria
    export let proyecto
    export let entidadAliada
    export let actividades
    export let actividadesRelacionadas
    export let objetivosEspecificosRelacionados
    export let tiposEntidadAliada
    export let naturalezaEntidadAliada
    export let tiposEmpresa

    $: $title = entidadAliada ? entidadAliada.nombre : null

    /**
     * Validar si el usuario autenticado es SuperAdmin
     */
    let authUser = $auth.user
    let isSuperAdmin = checkRole(authUser, [1])

    let form = useForm({
        _method: 'put',
        tipo: entidadAliada.tipo,
        nombre: entidadAliada.nombre,
        naturaleza: entidadAliada.naturaleza,
        tipo_empresa: entidadAliada.tipo_empresa,
        nit: entidadAliada.nit,
        tiene_convenio: entidadAliada.entidad_aliada_idi?.descripcion_convenio != null ? true : false,
        tiene_grupo_investigacion: entidadAliada.entidad_aliada_idi?.grupo_investigacion != null ? true : false,
        descripcion_convenio: entidadAliada?.entidad_aliada_idi?.descripcion_convenio ? entidadAliada.entidad_aliada_idi?.descripcion_convenio : '',
        grupo_investigacion: entidadAliada?.entidad_aliada_idi?.grupo_investigacion ? entidadAliada.entidad_aliada_idi?.grupo_investigacion : '',
        codigo_gruplac: entidadAliada.entidad_aliada_idi ? entidadAliada.entidad_aliada_idi?.codigo_gruplac : '',
        enlace_gruplac: entidadAliada.entidad_aliada_idi ? entidadAliada.entidad_aliada_idi?.enlace_gruplac : '',
        actividades_transferencia_conocimiento: entidadAliada.entidad_aliada_idi ? entidadAliada.entidad_aliada_idi?.actividades_transferencia_conocimiento : '',
        recursos_especie: entidadAliada.entidad_aliada_idi ? entidadAliada.entidad_aliada_idi?.recursos_especie : '',
        descripcion_recursos_especie: entidadAliada.entidad_aliada_idi ? entidadAliada.entidad_aliada_idi?.descripcion_recursos_especie : '',
        recursos_dinero: entidadAliada.entidad_aliada_idi ? entidadAliada.entidad_aliada_idi?.recursos_dinero : '',
        descripcion_recursos_dinero: entidadAliada.entidad_aliada_idi ? entidadAliada.entidad_aliada_idi?.descripcion_recursos_dinero : '',
        carta_intencion: null,
        carta_propiedad_intelectual: null,
        actividad_id: actividadesRelacionadas,
        soporte_convenio: null,
        fecha_inicio_convenio: entidadAliada.entidad_aliada_ta_tp?.fecha_inicio_convenio,
        fecha_fin_convenio: entidadAliada.entidad_aliada_ta_tp?.fecha_fin_convenio,
    })

    function submit() {
        if (proyecto.allowed.to_update) {
            $form.post(route('convocatorias.proyectos.entidades-aliadas.update', [convocatoria.id, proyecto.id, entidadAliada.id]), {
                preserveScroll: true,
            })
        }
    }

    let dialogEliminar = false
    let allowedToDestroy = false
    let miembroEntidadAliadaId
    function destroy() {
        if (allowedToDestroy) {
            Inertia.delete(route('convocatorias.proyectos.entidades-aliadas.miembros-entidad-aliada.destroy', [convocatoria.id, proyecto.id, entidadAliada.id, miembroEntidadAliadaId]), {
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
        <div className="flex items-center justify-between lg:px-8 max-w-7xl mx-auto px-4 py-6 sm:px-6">
            <div>
                <h1 className="overflow-ellipsis overflow-hidden w-breadcrumb-ellipsis whitespace-nowrap">
                    <a use:inertia href={route('convocatorias.proyectos.entidades-aliadas.index', [convocatoria.id, proyecto.id])} className="text-app-400 hover:text-app-600">Entidades aliadas</a>
                    <span className="text-app-400 font-medium">/</span>
                    {entidadAliada.nombre}
                </h1>
            </div>
        </div>
    </header>

    <div className="grid grid-cols-3 gap-4">
        <div className="sticky top-0">
            <h1 className="font-black text-4xl uppercase">Editar entidad aliada</h1>
        </div>

        <div className="bg-white rounded shadow col-span-2">
            <InfoMessage className="mb-8">
                <span className="text-5xl font-black">1.</span>
                <h1 className="text-3xl text-center">Entidad aliada</h1>
                <p className="my-8 text-center">Revise y actualice la información de la entidad aliada.</p>
            </InfoMessage>
            <Form {errors} {convocatoria} {proyecto} {entidadAliada} {actividades} {tiposEntidadAliada} {naturalezaEntidadAliada} {tiposEmpresa} {form} {submit} />
        </div>
    </div>

    {#if proyecto.codigo_linea_programatica == 66 || proyecto.codigo_linea_programatica == 82}
        <hr className="w-full my-20" />
        <InfoMessage className="mb-8" id="miembros-entidad-aliada">
            <span className="text-5xl font-black">2.</span>
            <h1 className="text-3xl text-center">Miembros de la entidad aliada</h1>
            <p className="my-8 text-center">Por favor ingrese los miembros de la entidad aliada.</p>
        </InfoMessage>
        <div className="mb-6 flex justify-end items-center">
            <div>
                <Button on:click={() => Inertia.visit(route('convocatorias.proyectos.entidades-aliadas.miembros-entidad-aliada.create', [convocatoria.id, proyecto.id, entidadAliada.id]))} variant="raised">Crear miembro</Button>
            </div>
        </div>
        <div className="bg-white rounded shadow">
            <table className="w-full whitespace-no-wrap table-fixed data-table">
                <thead>
                    <tr className="text-left font-bold">
                        <th className="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full"> Nombre </th>
                        <th className="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full"> Correo electrónico </th>
                        <th className="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full"> Número de celular </th>
                        <th className="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl text-center th-actions"> Acciones </th>
                    </tr>
                </thead>

                <tbody>
                    {#each entidadAliada.miembros_entidad_aliada as miembroEntidadAliada (miembroEntidadAliada.id)}
                        <tr className="hover:bg-gray-100 focus-within:bg-gray-100">
                            <td className="border-t">
                                <p className="px-6 py-4 focus:text-app-500">
                                    {miembroEntidadAliada.nombre}
                                </p>
                            </td>

                            <td className="border-t">
                                <p className="px-6 py-4 focus:text-app-500">
                                    {miembroEntidadAliada.email}
                                </p>
                            </td>

                            <td className="border-t">
                                <p className="px-6 py-4 focus:text-app-500">
                                    {miembroEntidadAliada.numero_celular}
                                </p>
                            </td>

                            <td className="border-t td-actions">
                                <DataTableMenu className={entidadAliada.miembros_entidad_aliada.length < 3 ? 'z-50' : ''}>
                                    <Item on:SMUI:action={() => Inertia.visit(route('convocatorias.proyectos.entidades-aliadas.miembros-entidad-aliada.edit', [convocatoria.id, proyecto.id, entidadAliada.id, miembroEntidadAliada.id]))}>
                                        <Text>Ver detalles</Text>
                                    </Item>

                                    <Separator className={!proyecto.allowed.to_update ? 'hidden' : ''} />
                                    <Item on:SMUI:action={() => ((miembroEntidadAliadaId = miembroEntidadAliada.id), (dialogEliminar = true), (allowedToDestroy = proyecto.allowed.to_update))} disabled={!proyecto.allowed.to_update} className={!proyecto.allowed.to_update ? 'hidden' : ''}>
                                        <Text>Eliminar</Text>
                                    </Item>
                                </DataTableMenu>
                            </td>
                        </tr>
                    {/each}

                    {#if entidadAliada.miembros_entidad_aliada.length === 0}
                        <tr>
                            <td className="border-t px-6 py-4" colspan="4">Sin información registrada</td>
                        </tr>
                    {/if}
                </tbody>
            </table>
        </div>
    {/if}

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
