<script>
    import AuthenticatedLayout, { title } from '@/Layouts/Authenticated'
    import { page } from '@inertiajs/inertia-svelte'
    import { route, checkRole } from '@/Utils'
    import { _ } from 'svelte-i18n'
    import { Inertia } from '@inertiajs/inertia'

    import Pagination from '@/Components/Pagination'
    import DataTableMenu from '@/Components/DataTableMenu'
    import { Item, Text } from '@smui/list'
    import DataTable from '@/Components/DataTable'
    import EvaluationStepper from '@/Components/EvaluationStepper'
    import Input from '@/Components/Input'

    export let convocatoria
    export let evaluacion
    export let proyecto
    export let proyectoRolesSennova = []

    $title = 'Roles SENNOVA'

    /**
     * Validar si el usuario autenticado es SuperAdmin
     */
    let authUser = $auth.user
    let isSuperAdmin = checkRole(authUser, [1])

    let cantidadesRolesInfo = {
        cantidad_instructores_planta: proyecto.cantidad_instructores_planta,
        cantidad_dinamizadores_planta: proyecto.cantidad_dinamizadores_planta,
        cantidad_psicopedagogos_planta: proyecto.cantidad_psicopedagogos_planta,
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
    <header className="pt-[8rem]" slot="header">
        <EvaluationStepper {convocatoria} {evaluacion} {proyecto} />
    </header>

    <a className="bg-orangered-900 bottom-0 fixed flex hover:bg-orangered-600 mb-5 ml-10 px-6 py-2 rounded-3xl shadow-2xl text-center text-white z-50" href="#evaluacion">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
        <span>
            <small>¿Cómo realizar la evaluación?</small>
            Clic en <strong>Detalles</strong> y luego en <strong>Evaluar</strong>
        </span>
    </a>

    <DataTable className="mt-20" routeParams={[convocatoria.id, proyecto.id]}>
        <div slot="title">Roles SENNOVA</div>

        <div slot="caption">
            {#if proyecto.codigo_linea_programatica == 70}
                <form>
                    <fieldset disabled={true}>
                        <div className="mt-4">
                            <Input label="Número de instructores de planta" id="cantidad_instructores_planta" type="number" input$min="1" input$max="32767" className="mt-1" value={cantidadesRolesInfo.cantidad_instructores_planta} required />
                        </div>

                        <div className="mt-4">
                            <Input label="Número de dinamizadores de planta" id="cantidad_dinamizadores_planta" type="number" input$min="1" input$max="32767" className="mt-1" value={cantidadesRolesInfo.cantidad_dinamizadores_planta} required />
                        </div>

                        <div className="mt-4">
                            <Input label="Número de psicopedagógos de planta" id="cantidad_psicopedagogos_planta" type="number" input$min="1" input$max="32767" className="mt-1" value={cantidadesRolesInfo.cantidad_psicopedagogos_planta} required />
                        </div>
                    </fieldset>
                </form>
            {/if}
        </div>

        <thead slot="thead">
            <tr className="text-left font-bold">
                <th className="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full">Nombre</th>
                <th className="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full">Nivel académico</th>
                <th className="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full">Asignación mensual</th>
                <th className="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full">Estado</th>
                <th className="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl text-center th-actions">Acciones</th>
            </tr>
        </thead>

        <tbody slot="tbody">
            {#each proyectoRolesSennova.data as proyectoRolSennova (proyectoRolSennova.id)}
                <tr className="hover:bg-gray-100 focus-within:bg-gray-100">
                    <td className="border-t">
                        <p className="px-6 py-4 focus:text-app-500">
                            {proyectoRolSennova?.convocatoria_rol_sennova?.rol_sennova?.nombre}
                        </p>
                    </td>
                    <td className="border-t">
                        <p className="px-6 py-4 focus:text-app-500">
                            {nivelAcademico(proyectoRolSennova?.convocatoria_rol_sennova?.nivel_academico)}
                        </p>
                    </td>
                    <td className="border-t">
                        <p className="px-6 py-4 focus:text-app-500">
                            ${new Intl.NumberFormat('de-DE').format(!isNaN(proyectoRolSennova?.convocatoria_rol_sennova?.asignacion_mensual) ? proyectoRolSennova?.convocatoria_rol_sennova?.asignacion_mensual : 0)}
                            / Meses: {proyectoRolSennova.numero_meses}
                            / Cantidad: {proyectoRolSennova.numero_roles}
                        </p>
                    </td>
                    <td className="border-t">
                        <div className="flex items-center">
                            <p className="px-6 py-4 focus:text-app-500">
                                {proyectoRolSennova.proyecto_roles_evaluaciones?.find((item) => item.evaluacion_id == evaluacion.id) ? 'Evaluado' : 'Sin evaluar'}
                            </p>
                            {#if convocatoria.fase == 4}
                                <small className="text-red-500">{proyectoRolSennova.proyecto_roles_evaluaciones?.find((item) => item.evaluacion_id == evaluacion.id && item.correcto == false) ? 'Por favor revise si hicieron la respectiva subsanación' : ''}</small>
                            {/if}
                        </div>
                    </td>
                    <td className="border-t td-actions">
                        <DataTableMenu className={proyectoRolesSennova.data.length < 3 ? 'z-50' : ''}>
                            {#if isSuperAdmin || checkRole(authUser, [11, 5])}
                                <Item on:SMUI:action={() => Inertia.visit(route('convocatorias.evaluaciones.proyecto-rol-sennova.edit', [convocatoria.id, evaluacion.id, proyectoRolSennova.id]))}>
                                    <Text>
                                        {#if checkRole(authUser, [20, 18, 19, 5, 17])}
                                            Verificar
                                        {:else}
                                            Evaluar
                                        {/if}
                                    </Text>
                                </Item>
                            {/if}
                        </DataTableMenu>
                    </td>
                </tr>
            {/each}

            {#if proyectoRolesSennova.data.length === 0}
                <tr>
                    <td className="border-t px-6 py-4" colspan="5">Sin información registrada</td>
                </tr>
            {/if}
        </tbody>
        <tfoot slot="tfoot">
            <tr>
                <td colspan="5" className="border-t p-4">
                    <strong>Actualmente el total del costo de los roles requeridos es de:</strong> ${new Intl.NumberFormat('de-DE').format(!isNaN(proyecto.total_roles_sennova) ? proyecto.total_roles_sennova : 0)} COP
                </td>
            </tr>
        </tfoot>
    </DataTable>
    <Pagination links={proyectoRolesSennova.links} />
</AuthenticatedLayout>
