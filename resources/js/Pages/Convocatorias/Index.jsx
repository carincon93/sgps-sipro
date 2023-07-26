import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import MenuMui from '@/Components/Menu'
import EditIcon from '@mui/icons-material/Edit'
import { checkRole } from '@/Utils'
import { Link, router } from '@inertiajs/react'
import { Divider, Grid, MenuItem } from '@mui/material'
import ButtonMui from '@/Components/Button'
import AlertMui from '@/Components/Alert'

export default function Dashboard({ auth, convocatorias }) {
    const auth_user = auth.user
    const is_super_admin = checkRole(auth_user, [1])

    return (
        <AuthenticatedLayout header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Lista de convocatorias</h2>}>
            <Grid item md={6}>
                <h1 className="font-bold text-5xl">Lista de convocatorias</h1>
            </Grid>

            <Grid item md={6}>
                <figure>
                    <img src={'/images/dashboard.png'} alt="" />
                </figure>
            </Grid>

            {is_super_admin && (
                <Grid item md={12}>
                    <AlertMui className="my-20">
                        <p>A continuación, se listan todas las convocatorias, si desea crear una nueva de clic en el siguiente botón.</p>
                        <Link href={route('convocatorias.create')} className="mt-8 mb-20">
                            Crear convocatoria
                        </Link>
                    </AlertMui>
                </Grid>
            )}

            {is_super_admin || checkRole(auth_user, [11]) || checkPermission(auth_user, [1, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 17, 18, 19, 14, 15, 16, 20, 21]) ? (
                <Grid container>
                    {convocatorias.data.map((convocatoria) =>
                        convocatoria.visible || is_super_admin || checkRole(auth_user, [5, 17, 18, 19, 20]) ? (
                            <Grid item md={4} key={convocatoria.id} className="mb-20 relative parent-actions !p-0">
                                {is_super_admin && (
                                    <MenuMui className="!min-w-0 !absolute right-0 z-10 opacity-0 child-actions" text={<EditIcon />}>
                                        <MenuItem onClick={() => router.visit(route('convocatorias.edit', convocatoria.id))} disabled={!is_super_admin} className={!is_super_admin ? 'hidden' : ''}>
                                            Editar convocatoria
                                        </MenuItem>

                                        <MenuItem onClick={() => router.visit(route('convocatorias.convocatoria-rol-sennova.index', convocatoria.id))}>Roles SENNOVA</MenuItem>

                                        <MenuItem onClick={() => router.visit(route('convocatorias.convocatoria-presupuesto.index', convocatoria.id))}>Rúbrica presupuestal SENNOVA</MenuItem>

                                        <Divider />
                                        <MenuItem
                                            onClick={() => ((convocatoria_id = convocatoria.id), (dialogEliminar = true), (allowedToDestroy = is_super_admin))}
                                            disabled={!is_super_admin}
                                            className={!is_super_admin ? 'hidden' : ''}>
                                            Eliminar convocatoria
                                        </MenuItem>
                                    </MenuMui>
                                )}
                                <ButtonMui
                                    onClick={(e) => {
                                        e.stopPropagation, router.visit(route('convocatorias.lineas-programaticas.index', convocatoria.id))
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
                                            <>Proyectos de ejercicio (DEMO)</>
                                        ) : (
                                            <>Nuevas TecnoAcademias - Nuevos Tecnoparques</>
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
