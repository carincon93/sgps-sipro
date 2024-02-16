import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'

import AlertMui from '@/Components/Alert'
import ButtonMui from '@/Components/Button'
import DialogMui from '@/Components/Dialog'
import MenuMui from '@/Components/Menu'
import SenaLogo from '@/Components/SenaLogo'

import { route, checkRole, checkPermission } from '@/Utils'

import { Head, Link, router, usePage } from '@inertiajs/react'
import { Grid, MenuItem } from '@mui/material'
import { useState } from 'react'

import FormRoles from './Users/FormRoles'

export default function Dashboard({ auth, roles_sistema }) {
    const { props: page_props } = usePage()

    const rol = page_props.ziggy.query.rol

    const auth_user = auth.user

    const is_super_admin = checkRole(auth_user, [1])
    const [dialog_status, setDialogStatus] = useState(checkRole(auth_user, [11, 33]) || (auth_user.roles.length == 0 && rol != 'evaluador_externo'))

    const submitEvaluadorInterno = (e) => {
        e.preventDefault()
        router.put(
            route('users.evaluador'),
            {
                evaluador_interno: true,
            },
            {
                onSuccess: () => setDialogStatus(false),
                preserveScroll: true,
            },
        )
    }

    const submitEvaluadorExterno = (e) => {
        e.preventDefault()
        router.put(
            route('users.evaluador'),
            {
                evaluador_externo: true,
            },
            {
                onSuccess: () => setDialogStatus(false),
                preserveScroll: true,
            },
        )
    }

    const submitEliminarEvaluador = (e) => {
        e.preventDefault()
        router.put(
            route('users.eliminar-evaluador'),
            {},
            {
                onSuccess: () => setDialogStatus(false),
                preserveScroll: true,
            },
        )
    }

    return (
        <AuthenticatedLayout>
            <Head title="Panel principal" />

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
                <Grid item md={4}>
                    <Link
                        className="bg-white overflow-hidden rounded-lg px-6 py-2 hover:bg-app-800 hover:text-white h-[200px] shadow-md flex justify-around items-center flex-col"
                        href={route('proyectos.index')}>
                        Histórico proyectos SGPS
                    </Link>
                </Grid>

                <Grid item md={4}>
                    <Link
                        className="bg-white overflow-hidden rounded-lg px-6 py-2 hover:bg-app-800 hover:text-white h-[200px] shadow-md flex justify-around items-center flex-col"
                        href={route('proyectos.index', { resultados: true })}>
                        Resultados proyectos SGPS
                    </Link>
                </Grid>
                {checkRole(auth_user, [1, 5, 11, 17, 18, 19, 33]) && (
                    <Grid item md={4}>
                        <Link
                            className="bg-white overflow-hidden rounded-lg px-6 py-2 hover:bg-app-800 hover:text-white h-[200px] shadow-md flex justify-around items-center flex-col"
                            href={route('evaluaciones.index')}>
                            Evaluaciones
                        </Link>
                    </Grid>
                )}
                {checkRole(auth_user, [1, 5, 17, 18, 19]) && (
                    <Grid item md={4}>
                        <Link
                            className="bg-white overflow-hidden rounded-lg px-6 py-2 hover:bg-app-800 hover:text-white h-[200px] shadow-md flex justify-around items-center flex-col"
                            href={route('evaluadores.index')}>
                            Evaluaciones
                        </Link>
                    </Grid>
                )}
                {checkRole(auth_user, [1, 5, 17, 18, 19]) && (
                    <Grid item md={4}>
                        <Link
                            className="bg-white overflow-hidden rounded-lg px-6 py-2 hover:bg-app-800 hover:text-white h-[200px] shadow-md flex justify-around items-center flex-col"
                            href={route('ambientes-modernizacion.index')}>
                            Ambientes de modernizacion
                        </Link>
                    </Grid>
                )}
                {checkRole(auth_user, [1, 5, 17, 18, 19]) && (
                    <Grid item md={4}>
                        <Link
                            className="bg-white overflow-hidden rounded-lg px-6 py-2 hover:bg-app-800 hover:text-white h-[200px] shadow-md flex justify-around items-center flex-col"
                            href={route('anexos.index')}>
                            Anexos
                        </Link>
                    </Grid>
                )}
                {checkRole(auth_user, [1, 2, 4, 5, 17, 18, 19, 21]) && (
                    <Grid item md={4}>
                        <Link
                            className="bg-white overflow-hidden rounded-lg px-6 py-2 hover:bg-app-800 hover:text-white h-[200px] shadow-md flex justify-around items-center flex-col"
                            href={route('centros-formacion.index')}>
                            Centros de formación
                        </Link>
                    </Grid>
                )}
                {checkRole(auth_user, [1, 3, 4, 5, 17, 18, 19, 21, 27]) && (
                    <Grid item md={4}>
                        <Link
                            className="bg-white overflow-hidden rounded-lg px-6 py-2 hover:bg-app-800 hover:text-white h-[200px] shadow-md flex justify-around items-center flex-col"
                            href={route('grupos-investigacion.index')}>
                            Grupos de investigación
                        </Link>
                    </Grid>
                )}
                {checkRole(auth_user, [1, 5, 17, 18, 19]) && (
                    <Grid item md={4}>
                        <Link
                            className="bg-white overflow-hidden rounded-lg px-6 py-2 hover:bg-app-800 hover:text-white h-[200px] shadow-md flex justify-around items-center flex-col"
                            href={route('intangibles.index')}>
                            Intangibles SENNOVA
                        </Link>
                    </Grid>
                )}
                {checkRole(auth_user, [1, 5, 17, 18, 19]) && (
                    <Grid item md={4}>
                        <Link
                            className="bg-white overflow-hidden rounded-lg px-6 py-2 hover:bg-app-800 hover:text-white h-[200px] shadow-md flex justify-around items-center flex-col"
                            href={route('laboratorios-servicios-tecnologicos.index')}>
                            Laboratorios de Servicios Tecnológicos
                        </Link>
                    </Grid>
                )}
                {checkRole(auth_user, [1, 5, 17, 18, 19]) && (
                    <Grid item md={4}>
                        <Link
                            className="bg-white overflow-hidden rounded-lg px-6 py-2 hover:bg-app-800 hover:text-white h-[200px] shadow-md flex justify-around items-center flex-col"
                            href={route('nodos-tecnoparque.index')}>
                            Nodos Tecnoparque
                        </Link>
                    </Grid>
                )}
                {checkRole(auth_user, [1, 5, 17, 18, 19]) && (
                    <Grid item md={4}>
                        <Link
                            className="bg-white overflow-hidden rounded-lg px-6 py-2 hover:bg-app-800 hover:text-white h-[200px] shadow-md flex justify-around items-center flex-col"
                            href={route('programas-formacion.index')}>
                            Programas de formación
                        </Link>
                    </Grid>
                )}
                {checkRole(auth_user, [1]) && (
                    <Grid item md={4}>
                        <Link
                            className="bg-white overflow-hidden rounded-lg px-6 py-2 hover:bg-app-800 hover:text-white h-[200px] shadow-md flex justify-around items-center flex-col"
                            href={route('regionales.index')}>
                            Regionales
                        </Link>
                    </Grid>
                )}
                {checkRole(auth_user, [1, 2, 3, 4, 5, 17, 18, 19, 21]) && (
                    <Grid item md={4}>
                        <Link
                            className="bg-white overflow-hidden rounded-lg px-6 py-2 hover:bg-app-800 hover:text-white h-[200px] shadow-md flex justify-around items-center flex-col"
                            href={route('reportes.index')}>
                            Reportes
                        </Link>
                    </Grid>
                )}
                {checkRole(auth_user, [1, 5, 17, 18, 19]) && (
                    <Grid item md={4}>
                        <Link
                            className="bg-white overflow-hidden rounded-lg px-6 py-2 hover:bg-app-800 hover:text-white h-[200px] shadow-md flex justify-around items-center flex-col"
                            href={route('roles-sennova.index')}>
                            Roles SENNOVA
                        </Link>
                    </Grid>
                )}
                <Grid item md={4}>
                    <Link
                        className="bg-white overflow-hidden rounded-lg px-6 py-2 hover:bg-app-800 hover:text-white h-[200px] shadow-md flex justify-around items-center flex-col"
                        href={route('semilleros-investigacion.nivel-nacional')}>
                        Semilleros de investigación
                    </Link>
                </Grid>
                {checkRole(auth_user, [1, 5, 17, 18, 19]) && (
                    <Grid item md={4}>
                        <Link
                            className="bg-white overflow-hidden rounded-lg px-6 py-2 hover:bg-app-800 hover:text-white h-[200px] shadow-md flex justify-around items-center flex-col"
                            href={route('tecnoacademias.index')}>
                            TecnoAcademias
                        </Link>
                    </Grid>
                )}
                {checkRole(auth_user, [1, 5, 17, 18, 19]) && (
                    <Grid item md={4}>
                        <Link
                            className="bg-white overflow-hidden rounded-lg px-6 py-2 hover:bg-app-800 hover:text-white h-[200px] shadow-md flex justify-around items-center flex-col"
                            href={route('hubs-innovacion.index')}>
                            Hubs de innovación
                        </Link>
                    </Grid>
                )}
                {checkRole(auth_user, [1, 2, 3, 4, 5, 17, 18, 19, 21]) && (
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
                {/* 
                <DialogMui
                    open={dialog_status}
                    enableGradient={true}
                    fullWidth={true}
                    blurEnabled={true}
                    maxWidth="md"
                    dialogContent={
                        <>
                            <div className="text-white">
                                <span className="text-white pointer-events-none place-items-center gap-2 flex py-2" href="/">
                                    SENNOVA | <SenaLogo className="w-10" />
                                </span>

                                {checkRole(auth_user, [11, 33]) ? (
                                    <>
                                        <h1 className="text-center text-2xl my-6">¡Hola {auth_user.nombre}!. Por favor confirme si desea participar como evaluador(a) de proyectos I+D+i 2024.</h1>
                                        <figure>
                                            <img src="/images/evaluadores.png" alt="" className="w-60 m-auto" />
                                        </figure>
                                    </>
                                ) : (
                                    auth_user.roles.length == 0 &&
                                    rol != 'evaluador_externo' && (
                                        <AlertMui>
                                            Por favor seleccione los roles de formulación según la línea en la que desea presentar proyectos. Si requiere otro rol por favor comuníquese con el
                                            administrador del sistema.
                                            <FormRoles usuario={auth_user} roles_sistema={roles_sistema} />
                                        </AlertMui>
                                    )
                                )}
                            </div>
                        </>
                    }
                    dialogActions={
                        <>
                            <MenuMui text="Confirmar postulación como evaluador(a)">
                                <MenuItem
                                    onClick={(e) => {
                                        submitEvaluadorInterno(e)
                                    }}>
                                    Pertenezco a SENNOVA
                                </MenuItem>
                                <MenuItem
                                    onClick={(e) => {
                                        submitEvaluadorExterno(e)
                                    }}>
                                    No hago parte de SENNOVA
                                </MenuItem>
                            </MenuMui>

                            <ButtonMui
                                onClick={(e) => {
                                    submitEliminarEvaluador(e)
                                }}>
                                Quiero eliminar mi postulación como evaluador(a)
                            </ButtonMui>
                        </>
                    }
                /> */}
            </Grid>
        </AuthenticatedLayout>
    )
}
