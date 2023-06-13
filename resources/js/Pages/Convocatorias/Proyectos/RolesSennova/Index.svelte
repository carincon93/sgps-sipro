<script>
    import AuthenticatedLayout, { title } from '@/Layouts/Authenticated'
    import { page, useForm } from '@inertiajs/inertia-svelte'
    import { route, checkRole, checkPermission } from '@/Utils'
    import { _ } from 'svelte-i18n'
    import { Inertia } from '@inertiajs/inertia'

    import Dialog from '@/Shared/Dialog'
    import Button from '@/Shared/Button'
    import Pagination from '@/Shared/Pagination'
    import DataTableMenu from '@/Shared/DataTableMenu'
    import { Item, Text, Separator } from '@smui/list'
    import DataTable from '@/Shared/DataTable'
    import Stepper from '@/Shared/Stepper'
    import Input from '@/Shared/Input'
    import LoadingButton from '@/Shared/LoadingButton'
    import InfoMessage from '@/Shared/InfoMessage'

    export let errors
    export let convocatoria
    export let proyecto
    export let proyectoRolesSennova = []

    $title = 'Roles SENNOVA'

    /**
     * Validar si el usuario autenticado es SuperAdmin
     */
    let authUser = $page.props.auth.user
    let isSuperAdmin = checkRole(authUser, [1])

    let form = useForm({
        cantidad_instructores_planta: proyecto.cantidad_instructores_planta,
        cantidad_dinamizadores_planta: proyecto.cantidad_dinamizadores_planta,
        cantidad_psicopedagogos_planta: proyecto.cantidad_psicopedagogos_planta,
    })
    function submit() {
        if (proyecto.allowed.to_update) {
            $form.put(route('convocatorias.proyectos.rol-sennova-ta.update', [convocatoria.id, proyecto.id]), {
                preserveScroll: true,
            })
        }
    }

    let dialogEliminar = false
    let allowedToDestroy = false
    let proyectoRolSennovaId
    function destroy() {
        if (allowedToDestroy) {
            Inertia.delete(route('convocatorias.proyectos.proyecto-rol-sennova.destroy', [convocatoria.id, proyecto.id, proyectoRolSennovaId]), {
                preserveScroll: true,
                onFinish: () => {
                    dialogEliminar = false
                },
            })
        }
    }

    function nivelAcademico(numeroNivel) {
        let nivelAcademico = ''
        switch (numeroNivel) {
            case 1:
                nivelAcademico = 'técnico'
                break
            case 2:
                nivelAcademico = 'tecnólogo'
                break
            case 3:
                nivelAcademico = 'pregrado'
                break
            case 4:
                nivelAcademico = 'especalización'
                break
            case 5:
                nivelAcademico = 'maestría'
                break
            case 6:
                nivelAcademico = 'doctorado'
                break
            case 7:
                nivelAcademico = 'ninguno'
                break
            case 8:
                nivelAcademico = 'técnico con especialización'
                break
            case 9:
                nivelAcademico = 'tecnólogo con especialización'
                break
            default:
                break
        }

        return nivelAcademico
    }
</script>

<AuthenticatedLayout>
    <header class="pt-[8rem]" slot="header">
        <Stepper {convocatoria} {proyecto} />
    </header>

    <h1 class="mt-24 mb-8 text-center text-3xl">Roles SENNOVA</h1>

    <DataTable class="mt-20" routeParams={[convocatoria.id, proyecto.id]}>
        <div slot="caption">
            <InfoMessage class="my-14">
                <p>
                    <strong>Actualmente el total del costo de los roles requeridos es de:</strong> ${new Intl.NumberFormat('de-DE').format(!isNaN(proyecto.total_roles_sennova) ? proyecto.total_roles_sennova : 0)} COP. Tenga en cuenta que el rol <strong>Aprendiz SENNOVA (contrato aprendizaje)</strong> no suma al total del presupuesto del proyecto.
                </p>
            </InfoMessage>
            <h2 class="text-center mt-10 mb-24">
                {#if proyecto.codigo_linea_programatica == 70}
                    Ingrese el número de instructores de planta, dinamizadores de planta y psicopedagógos de planta que requiere el proyecto.
                {:else}
                    Ingrese cada uno de los roles SENNOVA que requiere el proyecto.
                {/if}
            </h2>
            {#if proyecto.codigo_linea_programatica == 70}
                <form on:submit|preventDefault={submit} class="mb-40">
                    <fieldset disabled={proyecto.allowed.to_update ? undefined : true}>
                        <div class="mt-8">
                            <Input label="Número de instructores de planta" id="cantidad_instructores_planta" type="number" input$min="0" input$max="32767" class="mt-1" error={errors.cantidad_instructores_planta} bind:value={$form.cantidad_instructores_planta} required />
                        </div>

                        <div class="mt-8">
                            <Input label="Número de dinamizadores de planta" id="cantidad_dinamizadores_planta" type="number" input$min="0" input$max="32767" class="mt-1" error={errors.cantidad_dinamizadores_planta} bind:value={$form.cantidad_dinamizadores_planta} required />
                        </div>

                        <div class="mt-8">
                            <Input label="Número de psicopedagógos de planta" id="cantidad_psicopedagogos_planta" type="number" input$min="0" input$max="32767" class="mt-1" error={errors.cantidad_psicopedagogos_planta} bind:value={$form.cantidad_psicopedagogos_planta} required />
                        </div>
                    </fieldset>
                    <div class="shadow-inner bg-app-200 border-app-400 bottom-0 flex items-center justify-between mt-14 px-8 py-4 sticky">
                        {#if proyecto.allowed.to_update}
                            <LoadingButton loading={$form.processing} class="ml-auto" type="submit">Guardar</LoadingButton>
                        {/if}
                    </div>
                </form>
            {/if}
        </div>

        <div slot="actions">
            {#if proyecto.allowed.to_update}
                <Button on:click={() => Inertia.visit(route('convocatorias.proyectos.proyecto-rol-sennova.create', [convocatoria.id, proyecto.id]))} variant="raised">Crear Rol SENNOVA</Button>
            {/if}
        </div>

        <thead slot="thead">
            <tr class="text-left font-bold">
                <th class="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full">Nombre</th>
                <th class="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full">Nivel académico</th>
                <th class="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full">Asignación mensual</th>
                {#if isSuperAdmin || proyecto.mostrar_recomendaciones}
                    <th class="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full">Evaluación</th>
                {/if}
                <th class="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl text-center th-actions">Acciones</th>
            </tr>
        </thead>

        <tbody slot="tbody">
            {#each proyectoRolesSennova.data as proyectoRolSennova (proyectoRolSennova.id)}
                <tr class="hover:bg-gray-100 focus-within:bg-gray-100">
                    <td class="border-t">
                        <p class="px-6 py-4 focus:text-app-500">
                            {proyectoRolSennova?.convocatoria_rol_sennova?.rol_sennova?.nombre}
                        </p>
                    </td>
                    <td class="border-t">
                        <p class="px-6 py-4 focus:text-app-500">
                            {nivelAcademico(proyectoRolSennova?.convocatoria_rol_sennova?.nivel_academico)}
                        </p>
                    </td>
                    <td class="border-t">
                        <p class="px-6 py-4 focus:text-app-500">
                            ${new Intl.NumberFormat('de-DE').format(!isNaN(proyectoRolSennova?.convocatoria_rol_sennova?.asignacion_mensual) ? proyectoRolSennova?.convocatoria_rol_sennova?.asignacion_mensual : 0)}
                            / Meses: {proyectoRolSennova.numero_meses}
                            / Cantidad: {proyectoRolSennova.numero_roles}
                        </p>
                    </td>
                    {#if isSuperAdmin || proyecto.mostrar_recomendaciones}
                        <td class="border-t">
                            <div class="px-6 py-4">
                                {proyectoRolSennova.rol_aprobado}
                            </div>
                        </td>
                    {/if}
                    <td class="border-t td-actions">
                        <DataTableMenu class={proyectoRolesSennova.data.length < 3 ? 'z-50' : ''}>
                            <Item on:SMUI:action={() => Inertia.visit(route('convocatorias.proyectos.proyecto-rol-sennova.edit', [convocatoria.id, proyecto.id, proyectoRolSennova.id]))}>
                                <Text>Ver detalles</Text>
                            </Item>

                            <Separator class={!proyecto.allowed.to_update ? 'hidden' : ''} />
                            <Item on:SMUI:action={() => ((proyectoRolSennovaId = proyectoRolSennova.id), (dialogEliminar = true), (allowedToDestroy = proyecto.allowed.to_update))} disabled={!proyecto.allowed.to_update} class={!proyecto.allowed.to_update ? 'hidden' : ''}>
                                <Text>Eliminar</Text>
                            </Item>
                        </DataTableMenu>
                    </td>
                </tr>
            {/each}

            {#if proyectoRolesSennova.data.length === 0}
                <tr>
                    <td class="border-t px-6 py-4" colspan="5">Sin información registrada</td>
                </tr>
            {/if}
        </tbody>
    </DataTable>
    <Pagination links={proyectoRolesSennova.links} />

    <Dialog bind:open={dialogEliminar}>
        <div slot="title">
            <div class="text-center">Eliminar recurso</div>
            <div class="relative bg-app-100 text-app-600 p-5 h-44 w-1/3 m-auto my-10" style="border-radius: 41% 59% 70% 30% / 32% 40% 60% 68% ;">
                <figure>
                    <img src="/images/eliminar.png" alt="" class="h-44 m-auto" />
                </figure>
            </div>
            <div class="text-center">
                ¿Está seguro (a) que desea eliminar este elemento?<br />Una vez eliminado todos sus recursos y datos se eliminarán de forma permanente.
            </div>
        </div>
        <div slot="content" />
        <div slot="actions">
            <div class="p-4">
                <Button on:click={() => (dialogEliminar = false)} variant={null}>Cancelar</Button>
                <Button variant="raised" type="button" on:click={() => destroy()}>Confirmar</Button>
            </div>
        </div>
    </Dialog>
</AuthenticatedLayout>
