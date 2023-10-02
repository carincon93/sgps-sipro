import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'

import AlertMui from '@/Components/Alert'
import ButtonMui from '@/Components/Button'
import MenuMui from '@/Components/Menu'

import { checkPermission, checkRole } from '@/Utils'
import { Head, Link, router } from '@inertiajs/react'

import MoreVertOutlinedIcon from '@mui/icons-material/MoreVertOutlined'
import { Divider, Grid, MenuItem } from '@mui/material'
import { useState } from 'react'

export default function Dashboard({ auth, convocatorias }) {
    const auth_user = auth.user
    const is_super_admin = checkRole(auth_user, [1])

    const [convocatoria_to_destroy, setConvocatoriaToDestroy] = useState(null)

    return (
        <AuthenticatedLayout>
            <Head title="Lista de convocatorias" />

            <Grid item md={6}>
                <h1 className="font-bold text-5xl">Lista de convocatorias</h1>
            </Grid>
            <Grid item md={6}>
                <figure>
                    <img src={'/images/dashboard.png'} alt="" />
                </figure>
            </Grid>

            {checkRole(auth_user, [1, 20, 18, 19, 5, 17]) && (
                <Grid item md={12}>
                    <AlertMui className="mt-10">
                        <p>A continuación, se listan todas las convocatorias, si desea crear una nueva de clic en el siguiente botón.</p>
                        <Link href={route('convocatorias.create')} className="my-4 bg-app-800 text-white py-2 px-4 rounded inline-block">
                            Crear convocatoria
                        </Link>
                    </AlertMui>
                </Grid>
            )}

            {is_super_admin || checkRole(auth_user, [11, 33]) || checkPermission(auth_user, [1, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 17, 18, 19, 14, 15, 16, 20, 21]) ? (
                <Grid container rowSpacing={2} className="!mt-10">
                    {convocatorias.data.map((convocatoria) =>
                        convocatoria.visible || is_super_admin || checkRole(auth_user, [5, 17, 18, 19, 20]) ? (
                            <Grid item md={4} key={convocatoria.id} className="relative parent-actions">
                                {is_super_admin && (
                                    <MenuMui
                                        className="!min-w-0 !absolute right-2 z-10 opacity-0 child-actions !bg-transparent"
                                        text={<MoreVertOutlinedIcon className="text-white hover:text-black" />}>
                                        <MenuItem onClick={() => router.visit(route('convocatorias.edit', convocatoria.id))} disabled={!is_super_admin} className={!is_super_admin ? 'hidden' : ''}>
                                            Editar convocatoria
                                        </MenuItem>

                                        <Divider />

                                        {convocatoria.id !== convocatoria_to_destroy && is_super_admin ? (
                                            <div>
                                                <MenuItem
                                                    onClick={() => {
                                                        setConvocatoriaToDestroy(convocatoria.id)
                                                    }}>
                                                    Eliminar
                                                </MenuItem>
                                            </div>
                                        ) : (
                                            <div>
                                                <MenuItem
                                                    onClick={(e) => {
                                                        setConvocatoriaToDestroy(null)
                                                    }}>
                                                    Cancelar
                                                </MenuItem>
                                                <MenuItem
                                                    sx={{ backgroundColor: 'rgba(0, 0, 0, 0.04)' }}
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        if (is_super_admin) {
                                                            router.delete(route('convocatorias.destroy', [convocatoria.id]), {
                                                                preserveScroll: true,
                                                            })
                                                        }
                                                    }}>
                                                    Confirmar
                                                </MenuItem>
                                            </div>
                                        )}
                                    </MenuMui>
                                )}
                                <ButtonMui
                                    onClick={(e) => {
                                        e.stopPropagation, router.visit(route('convocatorias.tipos-formulario-convocatoria', convocatoria.id))
                                    }}
                                    className="w-full relative overflow-hidden !shadow-md px-6 py-2 h-72 flex justify-center items-center flex-col"
                                    primary={false}>
                                    <h1 className="text-2xl text-center my-4">
                                        {convocatoria.tipo_convocatoria == 1 ? (
                                            <>
                                                {convocatoria.descripcion}
                                                <br />
                                                {convocatoria.year}
                                            </>
                                        ) : convocatoria.tipo_convocatoria == 2 ? (
                                            <>Proyectos de ejercicio (DEMO) {convocatoria.year}</>
                                        ) : (
                                            <>Nuevas TecnoAcademias - Nuevos Tecnoparques {convocatoria.year}</>
                                        )}
                                    </h1>

                                    <div className="bg-gray-700 text-white p-2 rounded-sm mt-4 flex">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 mr-2">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>

                                        <small>
                                            {' '}
                                            Convocatoria {convocatoria.esta_activa ? 'activa' : 'inactiva'}{' '}
                                            {convocatoria.visible && is_super_admin ? ' y visible' : convocatoria.visible == false && is_super_admin ? 'y oculta' : ''}
                                        </small>
                                    </div>
                                </ButtonMui>
                            </Grid>
                        ) : null,
                    )}
                </Grid>
            ) : null}
        </AuthenticatedLayout>
    )
}
