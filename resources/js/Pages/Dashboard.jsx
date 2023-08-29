import AlertMui from '@/Components/Alert'
import ButtonMui from '@/Components/Button'
import DialogMui from '@/Components/Dialog'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'

import { route, checkRole, checkPermission } from '@/Utils'

import { Link } from '@inertiajs/react'
import { Grid } from '@mui/material'
import { useState } from 'react'
import FormRoles from './Users/FormRoles'

export default function Dashboard({ auth, roles_sistema }) {
    const auth_user = auth.user

    const is_super_admin = checkRole(auth_user, [1])
    const [dialog_status, setDialogStatus] = useState(true)

    return (
        <AuthenticatedLayout header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Dashboard</h2>}>
            <Grid container columnSpacing={2} rowSpacing={5}>
                <Grid item md={12}>
                    <div className="flex items-center justify-between rounded-xl px-10 py-20 text-app-800 bg-app-300/50">
                        <div className="max-w-2xl">
                            <h1 className="text-2xl font-bold">
                                ¡Bienvenido(a) <span className="capitalize">{auth.user.nombre}</span>! 👋🏻
                            </h1>

                            <p className="my-8">
                                Formule proyectos de I+D+i, Tecnoacademia-Tecnoparque, Servicios Tecnológicos y/o Apropiación de la ciencia y la tecnología y cultura de la innovación y la
                                competitividad.
                            </p>
                        </div>
                        <div>
                            <figure>
                                <img src={'/images/dashboard.png'} alt="" />
                            </figure>
                        </div>
                    </div>
                </Grid>

                <Grid item md={4}>
                    <Link
                        className="bg-white overflow-hidden rounded-lg px-6 py-2 hover:bg-app-800 hover:text-white h-[200px] shadow-md flex justify-around items-center flex-col"
                        href={route('convocatorias.index')}>
                        Convocatorias
                    </Link>
                </Grid>

                {checkRole(auth_user, [1, 21, 18, 19, 5, 17]) && (
                    <Grid item md={4}>
                        <Link
                            className="bg-white overflow-hidden rounded-lg px-6 py-2 hover:bg-app-800 hover:text-white h-[200px] shadow-md flex justify-around items-center flex-col"
                            href={route('anexos.index')}>
                            Anexos
                        </Link>
                    </Grid>
                )}

                {checkRole(auth_user, [1, 21, 18, 19, 5, 17]) && (
                    <Grid item md={4}>
                        <Link
                            className="bg-white overflow-hidden rounded-lg px-6 py-2 hover:bg-app-800 hover:text-white h-[200px] shadow-md flex justify-around items-center flex-col"
                            href={route('centros-formacion.index')}>
                            Centros de formación
                        </Link>
                    </Grid>
                )}

                {checkRole(auth_user, [1, 3, 4, 21, 18, 19, 5, 17]) && (
                    <Grid item md={4}>
                        <Link
                            className="bg-white overflow-hidden rounded-lg px-6 py-2 hover:bg-app-800 hover:text-white h-[200px] shadow-md flex justify-around items-center flex-col"
                            href={route('grupos-investigacion.index')}>
                            Grupos de investigación
                        </Link>
                    </Grid>
                )}

                {checkRole(auth_user, [1, 21, 18, 19, 5, 17]) && (
                    <Grid item md={4}>
                        <Link
                            className="bg-white overflow-hidden rounded-lg px-6 py-2 hover:bg-app-800 hover:text-white h-[200px] shadow-md flex justify-around items-center flex-col"
                            href={route('laboratorios-servicios-tecnologicos.index')}>
                            Laboratorios de Servicios Tecnológicos
                        </Link>
                    </Grid>
                )}

                {checkRole(auth_user, [1, 21, 18, 19, 5, 17]) && (
                    <Grid item md={4}>
                        <Link
                            className="bg-white overflow-hidden rounded-lg px-6 py-2 hover:bg-app-800 hover:text-white h-[200px] shadow-md flex justify-around items-center flex-col"
                            href={route('nodos-tecnoparque.index')}>
                            Nodos Tecnoparque
                        </Link>
                    </Grid>
                )}

                {checkRole(auth_user, [1, 21, 18, 19, 5, 17]) && (
                    <Grid item md={4}>
                        <Link
                            className="bg-white overflow-hidden rounded-lg px-6 py-2 hover:bg-app-800 hover:text-white h-[200px] shadow-md flex justify-around items-center flex-col"
                            href={route('programas-formacion.index')}>
                            Programas de formación
                        </Link>
                    </Grid>
                )}

                {checkRole(auth_user, [1, 3, 4, 5, 17, 18, 19, 21]) && (
                    <Grid item md={4}>
                        <Link
                            className="bg-white overflow-hidden rounded-lg px-6 py-2 hover:bg-app-800 hover:text-white h-[200px] shadow-md flex justify-around items-center flex-col"
                            href={route('reportes.index')}>
                            Reportes
                        </Link>
                    </Grid>
                )}

                {checkRole(auth_user, [1, 21, 18, 19, 5, 17]) && (
                    <Grid item md={4}>
                        <Link
                            className="bg-white overflow-hidden rounded-lg px-6 py-2 hover:bg-app-800 hover:text-white h-[200px] shadow-md flex justify-around items-center flex-col"
                            href={route('roles-sennova.index')}>
                            Roles SENNOVA
                        </Link>
                    </Grid>
                )}

                {checkRole(auth_user, [1, 21, 18, 19, 5, 17]) && (
                    <Grid item md={4}>
                        <Link
                            className="bg-white overflow-hidden rounded-lg px-6 py-2 hover:bg-app-800 hover:text-white h-[200px] shadow-md flex justify-around items-center flex-col"
                            href={route('semilleros-investigacion.nivel-nacional')}>
                            Semillero de investigación
                        </Link>
                    </Grid>
                )}

                {checkRole(auth_user, [1, 21, 18, 19, 5, 17]) && (
                    <Grid item md={4}>
                        <Link
                            className="bg-white overflow-hidden rounded-lg px-6 py-2 hover:bg-app-800 hover:text-white h-[200px] shadow-md flex justify-around items-center flex-col"
                            href={route('tecnoacademias.index')}>
                            TecnoAcademias
                        </Link>
                    </Grid>
                )}

                {checkRole(auth_user, [1, 21, 18, 19, 5, 17]) && (
                    <Grid item md={4}>
                        <Link
                            className="bg-white overflow-hidden rounded-lg px-6 py-2 hover:bg-app-800 hover:text-white h-[200px] shadow-md flex justify-around items-center flex-col"
                            href={route('hubs-innovacion.index')}>
                            Hubs de innovación
                        </Link>
                    </Grid>
                )}

                {checkRole(auth_user, [1, 3, 4, 5, 17, 18, 19, 21]) && (
                    <Grid item md={4}>
                        <Link
                            className="bg-white overflow-hidden rounded-lg px-6 py-2 hover:bg-app-800 hover:text-white h-[200px] shadow-md flex justify-around items-center flex-col"
                            href={route('users.index')}>
                            Usuarios
                        </Link>
                    </Grid>
                )}

                <Grid item md={12}>
                    <AlertMui severity="error" className="w-full">
                        Los demás módulos están en revisión. Muy pronto se habilitarán.
                    </AlertMui>
                </Grid>

                <DialogMui
                    open={dialog_status}
                    dialogContent={
                        <>
                            <small>Junio 8</small>

                            <hr className="mt-10 mb-10" />
                            <div>
                                {auth_user.roles.length == 0 && (
                                    <AlertMui>
                                        Por favor seleccione los roles de formulación según la línea en la que desea presentar proyectos. Si requiere otro rol por favor comuníquese con el
                                        administrador del sistema.
                                        <FormRoles usuario={auth_user} roles_sistema={roles_sistema} />
                                    </AlertMui>
                                )}

                                {auth_user.roles.length > 0 && auth_user.check_soportes_titulo_obtenido === 0 && auth_user.check_certificados_formacion === 0 ? (
                                    <>
                                        <p className="mt-10">
                                            A continuación, diríjase al CENSO SENNOVA 2023. Por favor haga clic en <strong>'Ir al CENSO SENNOVA 2023'</strong> para diligenciarlo.
                                        </p>
                                        {auth_user.informacion_completa && (
                                            <AlertMui className="mt-4">
                                                Si ya diligenció el CENSO por favor de clic en <strong>'Ya he completado el CENSO'</strong>
                                            </AlertMui>
                                        )}
                                    </>
                                ) : (
                                    auth_user.roles.length > 0 && (
                                        <AlertMui severity="error">
                                            Tiene <strong>{auth_user.check_soportes_titulo_obtenido}</strong> soporte(s) de estudio académico y{' '}
                                            <strong>{auth_user.check_certificados_formacion}</strong> certificado(s) de formación académica SENA sin cargar, por favor complete el CENSO SENNOVA.
                                        </AlertMui>
                                    )
                                )}
                            </div>
                        </>
                    }
                    dialogActions={
                        <>
                            {auth_user.roles.length > 0 && (
                                <div className="p-4 flex">
                                    {auth_user.informacion_completa && auth_user.check_soportes_titulo_obtenido == 0 && auth_user.check_certificados_formacion == 0 && (
                                        <ButtonMui onClick={() => setDialogStatus(false)}>Ya he completado el CENSO</ButtonMui>
                                    )}
                                    <Link
                                        className="ml-2 overflow-hidden shadow-sm rounded px-6 py-2 bg-app-500 text-white flex justify-around items-center flex-col text-center"
                                        href={route('users.perfil')}>
                                        Ir al CENSO SENNOVA 2023
                                    </Link>
                                </div>
                            )}
                        </>
                    }
                />
            </Grid>
        </AuthenticatedLayout>
    )
}
